import { createFileRoute, Link, useRouter, useLocation, redirect, isRedirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import React, { useState, Component } from "react";
import { trackEvent } from "@/utils/posthog";
import { supabase } from "@/integrations/supabase/client";
// Imports consolidated below
import {
  createMyRestaurant,
  upsertRestaurantProduct,
  updateMyRestaurantSettings,
  getStripeConnectUrl,
  disconnectStripe,
  startStarterSubscription,
  openBillingPortal,
} from "@/lib/restaurant/mutations.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  getRestaurantKPIs, 
  getRestaurantOrders, 
  getRestaurantProducts, 
  getRestaurantReservations,
  getRestaurantActivityFeed,
  updateRestaurantOrderStatus,
  updateReservationStatus,
  type OrderStatus,
} from "@/lib/restaurant/queries.functions";
import { getMyPromoCodes } from "@/lib/promotions/queries.functions";
import { createPromoCode, togglePromoCode } from "@/lib/promotions/mutations.functions";
import { Switch } from "@/components/ui/switch";
import { useSpeiselyPing } from "@/lib/vendor/useSpeiselyPing";
import { CustomDomainSection } from "@/components/vendor/CustomDomainSection";
import { VendorLayout, DashboardSkeleton } from "@/components/vendor/VendorLayout";
import { printReceipt } from "@/utils/printReceipt";
import { useI18n } from "@/i18n/I18nProvider";
import { PrintOnboardingBanner } from "@/components/vendor/PrintOnboardingBanner";

import { getUserProfile } from "@/lib/auth/get-user-profile.functions";

export const Route = createFileRoute("/_authenticated/restaurant")({
  ssr: false,
  beforeLoad: async () => {
    try {
      const profile = await getUserProfile();
      if (!profile.roles.includes("restaurant_owner")) {
        const otherRole = profile.roles.find(r => r !== "customer");
        const roleName = otherRole === "caterer" ? "Caterer" : otherRole === "planner" ? "Event Planner" : "Customer";
        
        throw redirect({
          to: "/auth",
          search: { 
            message: `This account is registered as a ${roleName}. Please sign in with a Restaurant Owner account.`,
            logout: "true",
          },
        });
      }
    } catch (err) {
      if (isRedirect(err)) {
        throw err;
      }
      console.error("beforeLoad error on restaurant dashboard:", err);
      throw redirect({
        to: "/auth",
        search: { 
          message: "Session expired or unauthorized. Please sign in again.",
          logout: "true",
        },
      });
    }
  },
  head: () => ({ meta: [{ title: "Restaurant Dashboard — Speisely" }] }),
  component: RestaurantDashboard,
});

const STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "picked_up",
  "delivered",
  "cancelled",
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-900",
  confirmed: "bg-sky-100 text-sky-900",
  preparing: "bg-indigo-100 text-indigo-900",
  ready: "bg-emerald-100 text-emerald-900",
  picked_up: "bg-teal-100 text-teal-900",
  delivered: "bg-green-100 text-green-900",
  cancelled: "bg-rose-100 text-rose-900",
};

function formatPrice(cents: number) {
  return `€${(cents / 100).toFixed(2)}`;
}

// Shell removed in favor of VendorLayout

// ---------------------------------------------------------------------------
// Auth-aware Error Boundary
// Catches "Unauthorized" errors thrown by server functions (e.g. expired session)
// and redirects to /auth rather than crashing the whole page.
// ---------------------------------------------------------------------------
interface DashboardErrorBoundaryState {
  hasError: boolean;
  isAuthError: boolean;
  message: string;
}

class DashboardErrorBoundary extends Component<
  { children: React.ReactNode },
  DashboardErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, isAuthError: false, message: "" };
  }

  static getDerivedStateFromError(error: unknown): DashboardErrorBoundaryState {
    const msg = error instanceof Error ? error.message : String(error);
    const isAuth =
      msg.includes("Unauthorized") ||
      msg.includes("401") ||
      msg.includes("No authorization") ||
      msg.includes("session") ||
      msg.includes("sign in");
    return { hasError: true, isAuthError: isAuth, message: msg };
  }

  componentDidCatch(error: unknown) {
    console.error("[DashboardErrorBoundary]", error);
    if (this.state.isAuthError) {
      // Delay redirect slightly so React finishes the error lifecycle
      setTimeout(() => {
        window.location.href = "/auth";
      }, 100);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.state.isAuthError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-cream">
          <div className="surface-card p-10 text-center max-w-sm">
            <p className="text-muted-foreground">Session expired. Redirecting to sign in…</p>
          </div>
        </div>
      );
    }
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="surface-card p-10 text-center max-w-sm space-y-4">
          <h2 className="font-display text-xl text-destructive">Something went wrong</h2>
          <p className="text-sm text-muted-foreground">{this.state.message}</p>
          <button
            className="rounded-full bg-forest px-6 py-2 text-sm text-white"
            onClick={() => this.setState({ hasError: false, isAuthError: false, message: "" })}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
}

function EmptyCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="surface-card p-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-mint text-forest text-2xl">
        🍽️
      </div>
      <h3 className="font-display text-xl">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}

function CreateRestaurantForm() {
  const create = useServerFn(createMyRestaurant);
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const mut = useMutation({
    mutationFn: (vars: { name: string; slug: string; custom_domain: string }) => create({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["restaurant"] });
    },
    onError: (e: any) => setErr(e.message ?? "Failed"),
  });
  return (
    <form
      className="mx-auto mt-2 max-w-md space-y-3 text-left"
      onSubmit={(e) => {
        e.preventDefault();
        setErr(null);
        mut.mutate({ name, slug, custom_domain: subdomain + ".speisely.de" });
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="rname">Restaurant name</Label>
        <Input id="rname" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="rslug">URL slug</Label>
        <Input
          id="rslug"
          value={slug}
          onChange={(e) => {
            const v = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
            setSlug(v);
            if (!subdomain || subdomain === slug) {
              setSubdomain(v);
            }
          }}
          placeholder="my-restaurant"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="rsubdomain">Speisely Domain (Mandatory)</Label>
        <div className="flex items-center gap-2">
          <Input
            id="rsubdomain"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            placeholder="my-restaurant"
            required
            className="flex-1"
          />
          <span className="text-muted-foreground text-sm shrink-0">.speisely.de</span>
        </div>
        <p className="text-xs text-muted-foreground">This will be your official storefront URL.</p>
      </div>
      {err && <p className="text-sm text-destructive">{err}</p>}
      <Button type="submit" className="w-full" disabled={mut.isPending}>
        {mut.isPending ? "Creating…" : "Create storefront"}
      </Button>
    </form>
  );
}

function OrdersSection() {
  const { t } = useI18n();
  const fetchOrders = useServerFn(getRestaurantOrders);
  const updateStatus = useServerFn(updateRestaurantOrderStatus);
  const qc = useQueryClient();
  const ordersQ = useSuspenseQuery({
    queryKey: ["restaurant", "orders"],
    queryFn: () => fetchOrders(),
    retry: false,
  });
  const statusMut = useMutation({
    mutationFn: (vars: { orderId: string; status: OrderStatus }) =>
      updateStatus({ data: vars }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["restaurant", "orders"] }),
  });


  const data = ordersQ.data;
  if (!data?.restaurant) {
    return (
      <EmptyCard
        title="Create your storefront"
        description="Set up your restaurant to start receiving orders on Speisely."
      >
        <CreateRestaurantForm />
      </EmptyCard>
    );
  }
  if (data.orders.length === 0) {
    const triggerTestPrint = () => {
      const mockOrder = {
        id: "test-print-12345",
        created_at: new Date().toISOString(),
        customer_name: "John Doe (Test)",
        total_cents: 2450,
        notes: t("Extra spicy, please", "Bitte extra scharf"),
        items: [
          { qty: 2, name: "Pizza Margherita", price_cents: 850 },
          { qty: 1, name: "Coca-Cola 0.33l", price_cents: 250 },
          { qty: 1, name: "Tiramisu", price_cents: 500 }
        ]
      };
      printReceipt(mockOrder, data.restaurant.name);
    };

    return (
      <EmptyCard
        title={t("No orders yet", "Noch keine Bestellungen")}
        description={t(
          `When customers order from ${data.restaurant.name}, they will appear here in real time.`,
          `Sobald Kunden bei ${data.restaurant.name} bestellen, erscheinen die Bestellungen hier in Echtzeit.`
        )}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={triggerTestPrint}
            className="rounded-full gap-2 border-forest/20 text-forest hover:bg-cream"
          >
            🖨️ {t("Print Test Receipt", "Test-Beleg drucken")}
          </Button>
          <p className="text-xs text-muted-foreground max-w-sm">
            {t(
              "Use this to test your 80mm thermal receipt printer alignment and layout.",
              "Nutze dies, um die Ausrichtung und das Layout deines 80mm Thermo-Bondruckers zu testen."
            )}
          </p>
        </div>
      </EmptyCard>
    );
  }
  return (
    <section className="space-y-4">
      <PrintOnboardingBanner type="thermal" brandName={data.restaurant.name} />
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-2xl">{t("Orders", "Bestellungen")}</h2>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const mockOrder = {
                id: "test-print-12345",
                created_at: new Date().toISOString(),
                customer_name: "John Doe (Test)",
                total_cents: 2450,
                notes: t("Extra spicy, please", "Bitte extra scharf"),
                items: [
                  { qty: 2, name: "Pizza Margherita", price_cents: 850 },
                  { qty: 1, name: "Coca-Cola 0.33l", price_cents: 250 },
                  { qty: 1, name: "Tiramisu", price_cents: 500 }
                ]
              };
              printReceipt(mockOrder, data.restaurant.name);
            }}
            className="h-8 rounded-full text-xs gap-1.5 border-forest/20 text-forest hover:bg-cream"
          >
            🖨️ {t("Test Print", "Test-Druck")}
          </Button>
          <span className="text-sm text-muted-foreground">
            {data.orders.length} {t("total", "gesamt")}
          </span>
        </div>
      </div>
      <div className="grid gap-4">
        {data.orders.map((o: any) => {
          const items = Array.isArray(o.items) ? o.items : [];
          return (
            <article key={o.id} className="surface-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[o.status as OrderStatus]}`}
                    >
                      {o.status}
                    </span>
                    <h3 className="font-display text-lg">
                      {o.customer_name ?? "Customer"} — {formatPrice(o.total_cents)}
                    </h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => printReceipt(o, data.restaurant.name)}
                      className="h-7 rounded-full text-xs gap-1 border-forest/20 text-forest hover:bg-cream shrink-0"
                    >
                      🖨️ {t("Print", "Drucken")}
                    </Button>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    #{o.id.slice(0, 8)} · {new Date(o.created_at).toLocaleString()}
                  </p>
                  {items.length > 0 && (
                    <ul className="mt-3 text-sm text-foreground/80 space-y-0.5">
                      {items.map((it: any, i: number) => (
                        <li key={i}>
                          {it.qty ?? 1}× {it.name}
                        </li>
                      ))}
                    </ul>
                  )}
                  {o.notes && (
                    <p className="mt-2 text-sm italic text-muted-foreground">"{o.notes}"</p>
                  )}
                </div>
                <div className="w-48">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Update status
                  </Label>
                  <Select
                    value={o.status}
                    onValueChange={(v) =>
                      statusMut.mutate({ orderId: o.id, status: v as OrderStatus })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ProductsSection() {
  const fetchProducts = useServerFn(getRestaurantProducts);
  const upsert = useServerFn(upsertRestaurantProduct);
  const qc = useQueryClient();
  const q = useSuspenseQuery({
    queryKey: ["restaurant", "products"],
    queryFn: () => fetchProducts(),
  });
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const mut = useMutation({
    mutationFn: (vars: { name: string; description: string; price_cents: number; image_url: string | null }) =>
      upsert({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["restaurant", "products"] });
      setName("");
      setDescription("");
      setPrice("");
      setImagePath(null);
      setImagePreview(null);
      setErr(null);
    },
    onError: (e: any) => setErr(e.message ?? "Failed to save"),
  });

  async function handleFile(file: File) {
    if (!q.data?.restaurant) return;
    setErr(null);
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${q.data.restaurant.id}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("restaurant-products")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data: signed } = await supabase.storage
        .from("restaurant-products")
        .createSignedUrl(path, 60 * 60);
      setImagePath(path);
      setImagePreview(signed?.signedUrl ?? null);
    } catch (e: any) {
      setErr(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }


  if (!q.data?.restaurant) return null;

  return (
    <section className="space-y-4">
      <h2 className="font-display text-2xl">Menu</h2>
      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {q.data.products.length === 0 ? (
            <EmptyCard
              title="No menu items yet"
              description="Add your first dish using the form on the right."
            />
          ) : (
            q.data.products.map((p: any) => (
              <div
                key={p.id}
                className="surface-card overflow-hidden flex items-stretch gap-0"
              >
                {p.image_signed_url ? (
                  <img
                    src={p.image_signed_url}
                    alt={p.name}
                    className="w-32 object-cover shrink-0"
                  />
                ) : (
                  <div className="w-32 bg-mint/40 grid place-items-center shrink-0">
                    <span className="text-2xl">🍽️</span>
                  </div>
                )}
                <div className="p-5 flex-1 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg">{p.name}</h3>
                    {p.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg">{formatPrice(p.price_cents)}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.is_available ? "Available" : "Hidden"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <form
          className="surface-card h-fit space-y-3 p-5"
          onSubmit={(e) => {
            e.preventDefault();
            const cents = Math.round(parseFloat(price || "0") * 100);
            if (!name || cents < 0) return;
            mut.mutate({ name, description, price_cents: cents, image_url: imagePath });
          }}
        >
          <h3 className="font-display text-lg">Add menu item</h3>
          <div className="space-y-1.5">
            <Label htmlFor="pname">Name</Label>
            <Input id="pname" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pdesc">Description</Label>
            <Textarea
              id="pdesc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pprice">Price (EUR)</Label>
            <Input
              id="pprice"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Image (Optional)</Label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt=""
                className="h-24 w-full rounded-lg object-cover shadow-sm mb-2"
              />
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? "Uploading…" : imagePreview ? "Replace image" : "Upload image"}
            </Button>
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <Button type="submit" className="w-full" disabled={mut.isPending || uploading}>
            {mut.isPending ? "Saving…" : "Add to menu"}
          </Button>
        </form>
      </div>
    </section>
  );
}

function OnboardingProgressIndicator({ kpis }: { kpis: any }) {
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);

  const stripeConnected = kpis.stripeConnectStatus === "connected";
  const subActive = kpis.subscriptionStatus === "active";
  const published = kpis.isPublished;

  const getStepStatus = (stepId: number) => {
    if (stepId === 1) {
      return stripeConnected ? "completed" : "current";
    }
    if (stepId === 2) {
      if (!stripeConnected) return "upcoming";
      return subActive ? "completed" : "current";
    }
    if (stepId === 3) {
      if (!subActive) return "upcoming";
      return published ? "completed" : "current";
    }
    return "upcoming";
  };

  const steps = [
    {
      id: 1,
      title: tt("Stripe-Zahlungen verbinden", "Connect Stripe Payments"),
      description: tt(
        "Verbinden Sie Stripe, um Online-Zahlungen direkt zu erhalten.",
        "Connect your Stripe account to receive online orders directly."
      ),
      actionLabel: tt("Stripe verbinden", "Connect Stripe"),
      actionHash: "billing",
    },
    {
      id: 2,
      title: tt("Starter-Paket aktivieren", "Activate Starter Plan"),
      description: tt(
        "Abonnieren Sie das €34.99/Monat Starter-Paket für 0% Provision.",
        "Subscribe to the €34.99/month Starter Plan for 0% order commission."
      ),
      actionLabel: tt("Plan abonnieren", "Subscribe to Plan"),
      actionHash: "billing",
      disabledText: tt("Erfordert Stripe-Verbindung", "Requires Stripe connection"),
    },
    {
      id: 3,
      title: tt("Storefront veröffentlichen", "Publish Storefront"),
      description: tt(
        "Schalten Sie Ihr Storefront online, damit Kunden bestellen können.",
        "Make your storefront live so customers can place orders."
      ),
      actionLabel: tt("Zum Profil & Veröffentlichen", "Go to Profile & Publish"),
      actionHash: "profile",
      disabledText: tt("Erfordert aktives Abonnement", "Requires active subscription"),
    },
  ];

  const allCompleted = stripeConnected && subActive && published;

  return (
    <div className="surface-card p-6 border-l-4 border-l-forest shadow-sm space-y-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-xl text-forest flex items-center gap-2">
            🚀 {tt("Storefront-Einrichtung", "Storefront Setup Checklist")}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {allCompleted 
              ? tt("Herzlichen Glückwunsch! Ihr Storefront ist vollständig eingerichtet und live.", "Congratulations! Your storefront is fully configured and live.")
              : tt("Schließen Sie diese 3 Schritte ab, um Ihre Bestellungen auf Speisely zu starten.", "Complete these 3 steps to start accepting orders on Speisely.")
            }
          </p>
        </div>
        {allCompleted && (
          <span className="bg-emerald-100 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-200">
            {tt("Aktiv & Live", "Active & Live")}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        {steps.map((step) => {
          const status = getStepStatus(step.id);
          const isCompleted = status === "completed";
          const isCurrent = status === "current";

          return (
            <div 
              key={step.id} 
              className={`flex flex-col justify-between p-5 rounded-xl border transition-all duration-200 ${
                isCompleted 
                  ? "bg-emerald-50/40 dark:bg-emerald-950/5 border-emerald-200" 
                  : isCurrent 
                  ? "bg-amber-50/20 dark:bg-amber-950/5 border-amber-300 shadow-md ring-1 ring-amber-300/30" 
                  : "bg-stone-50/50 dark:bg-stone-900/10 border-stone-200 opacity-60"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    isCompleted 
                      ? "bg-emerald-600 text-white" 
                      : isCurrent 
                      ? "bg-amber-500 text-white animate-pulse" 
                      : "bg-stone-200 text-stone-500"
                  }`}>
                    {isCompleted ? "✓" : step.id}
                  </span>
                  
                  {isCurrent && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-100/80 px-2 py-0.5 rounded animate-pulse">
                      {tt("Als nächstes", "Next Step")}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className={`font-display font-semibold text-base ${isCompleted ? "text-forest" : "text-foreground"}`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                {isCompleted ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold py-2">
                    <span className="text-sm">✓</span> {tt("Abgeschlossen", "Completed")}
                  </div>
                ) : isCurrent ? (
                  <Button 
                    onClick={() => { window.location.hash = step.actionHash; }}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    {step.actionLabel}
                  </Button>
                ) : (
                  <div className="text-xs text-muted-foreground/60 italic py-2">
                    {step.disabledText}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OverviewSection() {
  const fetchKPIs = useServerFn(getRestaurantKPIs);
  const q = useSuspenseQuery({
    queryKey: ["restaurant", "kpis"],
    queryFn: () => fetchKPIs(),
    refetchInterval: 60000,
    retry: false,
  });
  
  const fetchActivity = useServerFn(getRestaurantActivityFeed);
  const aq = useSuspenseQuery({
    queryKey: ["restaurant", "activity"],
    queryFn: () => fetchActivity(),
    refetchInterval: 60000,
    retry: false,
  });

  const upsert = useServerFn(updateMyRestaurantSettings);
  const qc = useQueryClient();

  if (q.error) return <div className="surface-card p-8 text-center text-destructive font-medium">Could not load overview details: {(q.error as any).message ?? "Unknown error"}</div>;
  if (!q.data) return <div className="surface-card p-8 text-center text-muted-foreground">No overview details available.</div>;

  const navigateTo = (hash: string) => {
    window.location.hash = hash;
  };

  const hasUrgentActions = 
    q.data.pendingOrders > 0 || 
    q.data.pendingReservations > 0 || 
    q.data.totalProducts === 0 || 
    q.data.isProfileIncomplete;

  return (
    <section className="space-y-8">
      <OnboardingProgressIndicator kpis={q.data} />
      {/* SECTION 1: URGENT ACTIONS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Urgent Actions</h2>
          <div className="flex items-center space-x-2">
            <Label htmlFor="active-status" className="font-medium">Accepting Orders</Label>
            <Switch
              id="active-status"
              checked={q.data.isActive}
              onCheckedChange={async (val) => {
                await upsert({ data: { name: "placeholder", is_active: val } });
                qc.invalidateQueries({ queryKey: ["restaurant", "kpis"] });
              }}
            />
          </div>
        </div>

        {hasUrgentActions ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {q.data.pendingOrders > 0 && (
              <div className="surface-card p-5 border-l-4 border-l-brand-orange shadow-sm flex flex-col justify-between">
                <div>
                  <p className="font-display font-bold text-lg">{q.data.pendingOrders} new orders waiting</p>
                  <p className="text-sm text-muted-foreground mt-1">Review and accept your incoming orders.</p>
                </div>
                <Button onClick={() => navigateTo("orders")} className="mt-4 w-full bg-brand-orange hover:bg-brand-orange/90 text-white">View Orders</Button>
              </div>
            )}
            {q.data.pendingReservations > 0 && (
              <div className="surface-card p-5 border-l-4 border-l-brand-orange shadow-sm flex flex-col justify-between">
                <div>
                  <p className="font-display font-bold text-lg">{q.data.pendingReservations} reservation requests</p>
                  <p className="text-sm text-muted-foreground mt-1">Pending reservations require your approval.</p>
                </div>
                <Button onClick={() => navigateTo("reservations")} className="mt-4 w-full bg-brand-orange hover:bg-brand-orange/90 text-white">View Reservations</Button>
              </div>
            )}
            {q.data.totalProducts === 0 && (
              <div className="surface-card p-5 border-l-4 border-l-brand-orange shadow-sm flex flex-col justify-between">
                <div>
                  <p className="font-display font-bold text-lg">Your menu has 0 items</p>
                  <p className="text-sm text-muted-foreground mt-1">Customers cannot place orders until you add items.</p>
                </div>
                <Button onClick={() => navigateTo("menu")} className="mt-4 w-full bg-brand-orange hover:bg-brand-orange/90 text-white">Add Menu Items</Button>
              </div>
            )}
            {q.data.isProfileIncomplete && (
              <div className="surface-card p-5 border-l-4 border-l-brand-orange shadow-sm flex flex-col justify-between">
                <div>
                  <p className="font-display font-bold text-lg">Profile incomplete</p>
                  <p className="text-sm text-muted-foreground mt-1">Missing logo, phone, or description.</p>
                </div>
                <Button onClick={() => navigateTo("profile")} variant="outline" className="mt-4 w-full border-brand-orange text-brand-orange hover:bg-brand-orange/10">Complete Profile</Button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg bg-mint/20 border border-mint/40 p-5 flex items-center gap-3">
            <span className="text-forest text-2xl">🎉</span>
            <p className="text-forest font-medium text-lg">All caught up! Nothing needs your attention right now.</p>
          </div>
        )}
      </div>

      {/* SECTION 2: TODAY AT A GLANCE */}
      <div className="space-y-4">
        <h2 className="font-display text-xl">Today at a glance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="surface-card p-5 space-y-1 bg-white dark:bg-zinc-900 border border-border/50 shadow-sm">
            <p className="text-sm text-muted-foreground font-medium flex items-center gap-2"><span className="text-brand-orange">🛍️</span> Orders today</p>
            <p className="text-3xl font-bold font-display">{q.data.ordersToday}</p>
          </div>
          <div className="surface-card p-5 space-y-1 bg-white dark:bg-zinc-900 border border-border/50 shadow-sm">
            <p className="text-sm text-muted-foreground font-medium flex items-center gap-2"><span className="text-brand-orange">📈</span> Revenue today</p>
            <p className="text-3xl font-bold font-display">€{(q.data.revenueTodayCents / 100).toFixed(2)}</p>
          </div>
          <div className="surface-card p-5 space-y-1 bg-white dark:bg-zinc-900 border border-border/50 shadow-sm">
            <p className="text-sm text-muted-foreground font-medium flex items-center gap-2"><span className="text-brand-orange">📅</span> Reservations today</p>
            <p className="text-3xl font-bold font-display">{q.data.reservationsToday}</p>
          </div>
          <div className="surface-card p-5 space-y-1 bg-white dark:bg-zinc-900 border border-border/50 shadow-sm">
            <p className="text-sm text-muted-foreground font-medium flex items-center gap-2"><span className="text-brand-orange">👀</span> Profile views today</p>
            <p className="text-3xl font-bold font-display">{q.data.profileViewsToday}</p>
          </div>
        </div>
      </div>

      {/* SECTION 3: RECENT ACTIVITY FEED */}
      <div className="space-y-4">
        <h2 className="font-display text-xl">Recent activity feed</h2>
        <div className="surface-card overflow-hidden">
          {(!aq.data || aq.data.length === 0) ? (
            <div className="p-8 text-center text-muted-foreground">No recent activity.</div>
          ) : (
            <div className="divide-y divide-border/50">
              {aq.data.map((event: any) => {
                const dateObj = new Date(event.time);
                const isToday = dateObj.toDateString() === new Date().toDateString();
                const isYesterday = dateObj.toDateString() === new Date(Date.now() - 86400000).toDateString();
                let timeStr = "";
                
                if (isToday) {
                  timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                } else if (isYesterday) {
                  timeStr = "yesterday";
                } else {
                  timeStr = dateObj.toLocaleDateString();
                }

                return (
                  <div key={event.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 mt-0.5 sm:mt-0">
                        {event.type === 'order' && <span className="text-brand-orange text-lg">🛍️</span>}
                        {event.type === 'reservation' && <span className="text-sky-500 text-lg">📅</span>}
                        {event.type === 'menu' && <span className="text-emerald-500 text-lg">🍽️</span>}
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {event.description}
                        {event.status === "pending" && <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">pending</span>}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-7 sm:ml-0">{timeStr}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function BusinessProfileSection() {
  const qc = useQueryClient();
  const fetchProducts = useServerFn(getRestaurantProducts);
  const q = useSuspenseQuery({ 
    queryKey: ["restaurant", "products"],
    queryFn: () => fetchProducts()
  });
  const upsert = useServerFn(updateMyRestaurantSettings);
  
  const restaurant = q.data?.restaurant;

  const [name, setName] = useState(restaurant?.name || "");
  const [desc, setDesc] = useState(restaurant?.description || "");
  const [phone, setPhone] = useState(restaurant?.phone || "");
  const [address, setAddress] = useState(restaurant?.business_address || "");
  const [logoPreview, setLogoPreview] = useState(restaurant?.logo_url || null);
  const [bannerPreview, setBannerPreview] = useState(restaurant?.banner_image_url || null);
  const [logoPath, setLogoPath] = useState(restaurant?.logo_url || null);
  const [bannerPath, setBannerPath] = useState(restaurant?.banner_image_url || null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isPublished, setIsPublished] = useState(restaurant?.is_published ?? false);
  const [certifications, setCertifications] = useState((restaurant as any).certifications || "");

  const [deliveryRadius, setDeliveryRadius] = useState(restaurant?.delivery_radius_km?.toString() || "5");
  const [minOrder, setMinOrder] = useState(restaurant?.min_order_amount?.toString() || "10");
  const [deliveryFee, setDeliveryFee] = useState(restaurant?.delivery_fee?.toString() || "2.5");
  const [acceptsPickup, setAcceptsPickup] = useState(restaurant?.accepts_pickup ?? true);
  const [acceptsDelivery, setAcceptsDelivery] = useState(restaurant?.accepts_delivery ?? true);
  const [serviceAreas, setServiceAreas] = useState(restaurant?.service_areas || "");
  const [seatCapacity, setSeatCapacity] = useState(restaurant?.seat_capacity?.toString() || "30");
  // Payment Methods
  const [acceptsCash, setAcceptsCash] = useState((restaurant as any).accepts_cash ?? false);
  const [acceptsPaypal, setAcceptsPaypal] = useState((restaurant as any).accepts_paypal ?? false);
  const [paypalEmail, setPaypalEmail] = useState((restaurant as any).paypal_email || "");
  const [operatingHours, setOperatingHours] = useState<any>(restaurant?.operating_hours || {
    monday: { open: "09:00", close: "22:00", closed: false },
    tuesday: { open: "09:00", close: "22:00", closed: false },
    wednesday: { open: "09:00", close: "22:00", closed: false },
    thursday: { open: "09:00", close: "22:00", closed: false },
    friday: { open: "09:00", close: "23:00", closed: false },
    saturday: { open: "10:00", close: "23:00", closed: false },
    sunday: { open: "10:00", close: "21:00", closed: false },
  });

  const logoRef = React.useRef<HTMLInputElement>(null);
  const bannerRef = React.useRef<HTMLInputElement>(null);

  if (!restaurant) return null;

  async function handleImage(file: File, type: "logo" | "banner") {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${restaurant!.id}/${type}-${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("storefront-assets")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      
      const { data: signed } = await supabase.storage
        .from("storefront-assets")
        .createSignedUrl(path, 60 * 60 * 24 * 7); // 1 week
        
      if (type === "logo") {
        setLogoPath(path);
        setLogoPreview(signed?.signedUrl ?? null);
      } else {
        setBannerPath(path);
        setBannerPreview(signed?.signedUrl ?? null);
      }
    } catch (e: any) {
      alert("Upload failed: " + e.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (isPublished) {
      trackEvent("storefront_publish_attempted");
    }
    setSaving(true);
    try {
      await upsert({
        data: {
          name,
          description: desc,
          phone,
          business_address: address,
          logo_url: logoPath,
          banner_image_url: bannerPath,
          delivery_radius_km: parseFloat(deliveryRadius) || 0,
          min_order_amount: parseFloat(minOrder) || 0,
          delivery_fee: parseFloat(deliveryFee) || 0,
          accepts_pickup: acceptsPickup,
          accepts_delivery: acceptsDelivery,
          service_areas: serviceAreas,
          operating_hours: operatingHours,
          seat_capacity: parseInt(seatCapacity) || 30,
          is_published: isPublished,
          certifications,
          accepts_cash: acceptsCash,
          accepts_paypal: acceptsPaypal,
          paypal_email: acceptsPaypal ? (paypalEmail || null) : null,
        }
      });
      alert("Settings saved successfully!");
      qc.invalidateQueries({ queryKey: ["restaurant"] });
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl">Business Profile</h2>
        <p className="text-sm text-muted-foreground">Manage your storefront presence, business details, and delivery operations.</p>
      </div>
      <div className="surface-card p-6 space-y-8 max-w-3xl">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Logo</Label>
            <div 
              onClick={() => logoRef.current?.click()}
              className="w-24 h-24 rounded-full border-2 border-dashed border-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-brand-orange transition-colors"
            >
              {logoPreview ? <img src={logoPreview} className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">Upload</span>}
            </div>
            <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
              if (e.target.files?.[0]) handleImage(e.target.files[0], "logo");
            }} />
          </div>
          <div className="space-y-2">
            <Label>Banner Image</Label>
            <div 
              onClick={() => bannerRef.current?.click()}
              className="w-full h-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-brand-orange transition-colors"
            >
              {bannerPreview ? <img src={bannerPreview} className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">Upload Banner</span>}
            </div>
            <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
              if (e.target.files?.[0]) handleImage(e.target.files[0], "banner");
            }} />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <div className="space-y-1.5">
            <Label>Restaurant Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea rows={3} value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Address</Label>
              <Input value={address} onChange={e => setAddress(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Zertifizierungen & Standards / Certifications & Standards (Optional)</Label>
            <Input 
              value={certifications} 
              onChange={e => setCertifications(e.target.value)} 
              placeholder="z.B. Bio, HACCP, Halal, DGE-orientiert, Vegan, Allergy-Aware"
            />
            <p className="text-[10px] text-muted-foreground">
              Geben Sie Zertifizierungen durch Komma getrennt ein. Sie werden als storefront Badges angezeigt. (Comma-separated, e.g. Bio, HACCP, Halal)
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="font-semibold text-lg">Delivery & Service Area</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center justify-between border border-border p-3 rounded-md">
              <Label htmlFor="accepts-delivery">Accepts Delivery</Label>
              <Switch id="accepts-delivery" checked={acceptsDelivery} onCheckedChange={setAcceptsDelivery} />
            </div>
            <div className="flex items-center justify-between border border-border p-3 rounded-md">
              <Label htmlFor="accepts-pickup">Accepts Pickup</Label>
              <Switch id="accepts-pickup" checked={acceptsPickup} onCheckedChange={setAcceptsPickup} />
            </div>
          </div>

          {acceptsDelivery && (
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Delivery Radius (km)</Label>
                <Input type="number" min="0" step="0.1" value={deliveryRadius} onChange={e => setDeliveryRadius(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Min. Order (€)</Label>
                <Input type="number" min="0" step="0.5" value={minOrder} onChange={e => setMinOrder(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Delivery Fee (€)</Label>
                <Input type="number" min="0" step="0.1" value={deliveryFee} onChange={e => setDeliveryFee(e.target.value)} />
              </div>
            </div>
          )}

          <div className="space-y-1.5 pt-4">
            <Label className="text-lg font-semibold flex items-center gap-2"><span className="text-brand-orange">📍</span> Service Areas / Delivery Postal Codes</Label>
            <p className="text-sm text-muted-foreground mb-2">
              To maximize your reach, specify exactly where you can deliver. Enter a comma-separated list of postal codes (e.g., 10115, 10117, 10119, 10435). This ensures customers only see your restaurant if you can fulfill their order.
            </p>
            <Input 
              value={serviceAreas} 
              onChange={e => setServiceAreas(e.target.value)} 
              placeholder="e.g. 10115, 10117, 10119, 10435"
              className="text-lg py-6"
            />
          </div>
        </div>

        {/* ── PAYMENT METHODS ─────────────────────────────────────── */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2">💳 Payment Methods</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Choose which payment methods your restaurant accepts. At least one must be enabled before you can publish your storefront. We never store passwords or sensitive card data.
            </p>
          </div>

          <div className="grid gap-3">
            {/* Cash */}
            <div className="flex items-center justify-between border border-border rounded-lg p-4 bg-stone-50 dark:bg-stone-900/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💵</span>
                <div>
                  <p className="font-semibold">Cash (Bar)</p>
                  <p className="text-xs text-muted-foreground">Customers pay in cash on delivery or at the counter</p>
                </div>
              </div>
              <Switch
                id="accepts-cash"
                checked={acceptsCash}
                onCheckedChange={setAcceptsCash}
              />
            </div>

            {/* PayPal */}
            <div className="border border-border rounded-lg p-4 bg-stone-50 dark:bg-stone-900/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🅿️</span>
                  <div>
                    <p className="font-semibold">PayPal</p>
                    <p className="text-xs text-muted-foreground">Customers pay via your PayPal.me link — no password stored</p>
                  </div>
                </div>
                <Switch
                  id="accepts-paypal"
                  checked={acceptsPaypal}
                  onCheckedChange={setAcceptsPaypal}
                />
              </div>
              {acceptsPaypal && (
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <Label className="text-sm font-medium">Your PayPal.me link or PayPal email</Label>
                  <div className="flex gap-2">
                    <Input
                      value={paypalEmail}
                      onChange={e => setPaypalEmail(e.target.value)}
                      placeholder="paypal.me/yourname  or  your@email.com"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="shrink-0 border-blue-400 text-blue-600 hover:bg-blue-50"
                      onClick={() => window.open("https://www.paypal.com/paypalme/my/profile", "_blank")}
                    >
                      Get PayPal.me →
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Don't have a PayPal.me link yet? Click "Get PayPal.me →" to create one on PayPal's website. Then paste it above.
                    We only store your PayPal.me link — never your password.
                  </p>
                </div>
              )}
            </div>

            {/* Stripe / Card */}
            <div className="flex items-center justify-between border border-border rounded-lg p-4 bg-stone-50 dark:bg-stone-900/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💳</span>
                <div>
                  <p className="font-semibold">Credit / Debit Card (Stripe)</p>
                  <p className="text-xs text-muted-foreground">Connect your own Stripe account to accept card payments. Go to the Billing tab to connect.</p>
                </div>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                restaurant.stripe_connect_status === "connected"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}>
                {restaurant.stripe_connect_status === "connected" ? "✓ Connected" : "Not connected"}
              </span>
            </div>
          </div>

          {!acceptsCash && !acceptsPaypal && restaurant.stripe_connect_status !== "connected" && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200/60 rounded p-3 font-medium">
              ⚠️ Please enable at least one payment method before publishing your storefront.
            </p>
          )}
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="font-semibold text-lg">Operating Hours</h3>
          <p className="text-sm text-muted-foreground">Set your opening hours. Customers won't be able to order for immediate pickup/delivery outside of these hours, but they can still pre-order for a future time when you are open.</p>
          <div className="space-y-3">
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
              <div key={day} className="flex items-center gap-4 border border-border p-3 rounded-md">
                <div className="w-28 font-medium capitalize">{day}</div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={!operatingHours[day]?.closed} 
                    onCheckedChange={(checked) => setOperatingHours((prev: any) => ({
                      ...prev, 
                      [day]: { ...prev[day], closed: !checked }
                    }))} 
                  />
                  <Label className="w-16">{!operatingHours[day]?.closed ? "Open" : "Closed"}</Label>
                </div>
                {!operatingHours[day]?.closed && (
                  <div className="flex items-center gap-2 flex-1">
                    <Input 
                      type="time" 
                      value={operatingHours[day]?.open || "09:00"} 
                      onChange={(e) => setOperatingHours((prev: any) => ({
                        ...prev, 
                        [day]: { ...prev[day], open: e.target.value }
                      }))}
                      className="w-32"
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input 
                      type="time" 
                      value={operatingHours[day]?.close || "22:00"} 
                      onChange={(e) => setOperatingHours((prev: any) => ({
                        ...prev, 
                        [day]: { ...prev[day], close: e.target.value }
                      }))}
                      className="w-32"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="font-semibold text-lg">{t("Tischreservierungen", "Table Reservations")}</h3>
          <p className="text-sm text-muted-foreground">
            {t(
              "Legen Sie Ihre Sitzplatzkapazität pro Zeitraum fest. Reservierungen werden bis zu diesem Limit automatisch bestätigt.",
              "Set your slot seat capacity. Bookings will be automatically accepted up to this limit per time slot."
            )}
          </p>
          <div className="space-y-1.5 max-w-xs">
            <Label>{t("Maximale Kapazität pro Slot", "Maximum Seat Capacity per Slot")}</Label>
            <Input 
              type="number" 
              min="1" 
              value={seatCapacity} 
              onChange={e => setSeatCapacity(e.target.value)} 
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="font-semibold text-lg flex items-center gap-2">🚀 Storefront Publishing</h3>
          <div className="flex items-center justify-between border border-border p-4 rounded-lg bg-stone-50 dark:bg-stone-900/20">
            <div>
              <Label htmlFor="is-published" className="font-semibold text-base">Publish Storefront</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Make your storefront live at /restaurant/{restaurant.slug}
              </p>
            </div>
            <Switch 
              id="is-published" 
              checked={isPublished} 
              disabled={!acceptsCash && !acceptsPaypal && restaurant.stripe_connect_status !== "connected"}
              onCheckedChange={(val) => {
                setIsPublished(val);
                if (val) {
                  trackEvent("storefront_publish_attempted");
                }
              }} 
            />
          </div>
          {!acceptsCash && !acceptsPaypal && restaurant.stripe_connect_status !== "connected" && (
            <p className="text-xs text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20 p-3 rounded border border-amber-200/50 font-medium">
              To publish your storefront, enable at least one payment method above (Cash, PayPal, or connect Stripe).
            </p>
          )}
        </div>

        <Button onClick={handleSave} disabled={uploading || saving} className="w-full">
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </section>
  );
}

function PromotionsSection({ vertical }: { vertical: "restaurants" | "caterers" | "planners" }) {
  const fetchPromos = useServerFn(getMyPromoCodes);
  const createPromo = useServerFn(createPromoCode);
  const togglePromo = useServerFn(togglePromoCode);
  const qc = useQueryClient();
  
  const q = useSuspenseQuery({
    queryKey: ["promotions"],
    queryFn: () => fetchPromos()
  });

  const [code, setCode] = useState("");
  const [type, setType] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState("");
  const [promote, setPromote] = useState(true);
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setCreating(true);
    try {
      await createPromo({ data: {
        code,
        discount_type: type,
        discount_value: parseFloat(value) || 0,
        promote_on_storefront: promote,
        vertical
      }});
      setCode("");
      setValue("");
      qc.invalidateQueries({ queryKey: ["promotions"] });
      qc.invalidateQueries({ queryKey: [vertical.slice(0, -1)] }); 
      alert("Promo code created successfully!");
    } catch (error: any) {
      setErr(error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    try {
      await togglePromo({ data: { id, is_active: active }});
      qc.invalidateQueries({ queryKey: ["promotions"] });
    } catch (e: any) {
      alert("Failed to toggle: " + e.message);
    }
  };



  const codes = q.data || [];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl">Promotions & Vouchers</h2>
        <p className="text-sm text-muted-foreground">Generate discount codes and sync them to your storefront banner.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Active Codes</h3>
          {codes.length === 0 ? (
            <div className="surface-card p-8 text-center border border-dashed border-border text-muted-foreground">
              You haven't created any promo codes yet.
            </div>
          ) : (
            <div className="grid gap-3">
              {codes.map((c: any) => (
                <div key={c.id} className={`surface-card p-4 flex items-center justify-between border ${c.is_active ? 'border-brand-orange/50' : 'border-border opacity-60'}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold font-mono text-lg">{c.code}</h4>
                      {!c.is_active && <span className="text-[10px] uppercase bg-muted px-2 py-0.5 rounded-full font-semibold">Inactive</span>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {c.discount_type === "percentage" ? `${c.discount_value}% off total` : `€${c.discount_value.toFixed(2)} off total`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`toggle-${c.id}`} className="text-xs">{c.is_active ? 'Active' : 'Disabled'}</Label>
                    <Switch 
                      id={`toggle-${c.id}`} 
                      checked={c.is_active} 
                      onCheckedChange={(val) => handleToggle(c.id, val)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <form className="surface-card h-fit space-y-4 p-5" onSubmit={handleCreate}>
          <h3 className="font-display text-lg">Create new code</h3>
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input value={code} onChange={e => setCode(e.target.value.toUpperCase().replace(/\s/g, ""))} placeholder="e.g. SUMMER20" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v: any) => setType(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percent (%)</SelectItem>
                  <SelectItem value="fixed">Fixed (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Value</Label>
              <Input type="number" min="0" step={type === "percentage" ? "1" : "0.5"} value={value} onChange={e => setValue(e.target.value)} placeholder={type === "percentage" ? "10" : "5.00"} required />
            </div>
          </div>
          <div className="pt-2 pb-1 border-t border-border mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="promote" className="flex-1 cursor-pointer">Promote on Storefront Banner</Label>
              <Switch id="promote" checked={promote} onCheckedChange={setPromote} />
            </div>
            {promote && (
              <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                This will automatically update and turn on your public announcement banner to display this code.
              </p>
            )}
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <Button type="submit" className="w-full" disabled={creating || !code || !value}>
            {creating ? "Creating..." : "Create Code"}
          </Button>
        </form>
      </div>
    </section>
  );
}

function ReservationsSection() {
  const fetchReservations = useServerFn(getRestaurantReservations);
  const updateStatus = useServerFn(updateReservationStatus);
  const qc = useQueryClient();
  const q = useSuspenseQuery({
    queryKey: ["restaurant", "reservations"],
    queryFn: () => fetchReservations(),
  });
  const statusMut = useMutation({
    mutationFn: (vars: { reservationId: string; status: "pending" | "confirmed" | "declined" | "approved" | "rejected" | "cancelled" | "completed" | "no_show" }) =>
      updateStatus({ data: vars }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["restaurant", "reservations"] }),
  });


  const data = q.data;
  if (!data?.restaurant) return null;
  if (data.reservations.length === 0) {
    return (
      <EmptyCard
        title="No reservations yet"
        description="When customers book a table, they will appear here in real time."
      />
    );
  }

  const statusStyles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-900",
    confirmed: "bg-emerald-100 text-emerald-900",
    declined: "bg-rose-100 text-rose-900",
    approved: "bg-emerald-100 text-emerald-900",
    rejected: "bg-rose-100 text-rose-900",
    cancelled: "bg-gray-100 text-gray-900",
    completed: "bg-indigo-100 text-indigo-900",
    no_show: "bg-red-100 text-red-900",
  };

  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-2xl">Table Reservations</h2>
        <span className="text-sm text-muted-foreground">{data.reservations.length} total</span>
      </div>
      <div className="grid gap-4">
        {data.reservations.map((r: any) => (
          <article key={r.id} className="surface-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusStyles[r.status] || "bg-gray-100"}`}>
                    {r.status}
                  </span>
                  <h3 className="font-display text-lg">
                    {r.first_name} {r.last_name} — {r.guest_count} Guests
                  </h3>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Date: {r.reservation_date} at {r.reservation_time}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Phone: {r.phone}
                </p>
                {r.email && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Email: {r.email}
                  </p>
                )}
                {r.notes && (
                  <p className="mt-2 text-sm italic text-muted-foreground">"{r.notes}"</p>
                )}
              </div>
              <div className="flex flex-col justify-end items-end gap-2 w-48">
                {r.status === "pending" ? (
                  <div className="flex gap-2 w-full mt-2">
                    <Button
                      size="sm"
                      onClick={() => statusMut.mutate({ reservationId: r.id, status: "confirmed" })}
                      className="flex-1 bg-[#22C55E] hover:bg-[#22C55E]/90 text-white font-semibold cursor-pointer"
                      disabled={statusMut.isPending}
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => statusMut.mutate({ reservationId: r.id, status: "declined" })}
                      className="flex-1 font-semibold cursor-pointer"
                      disabled={statusMut.isPending}
                    >
                      Decline
                    </Button>
                  </div>
                ) : (
                  <div className="w-full">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Update status
                    </Label>
                    <Select
                      value={r.status}
                      onValueChange={(v: any) => statusMut.mutate({ reservationId: r.id, status: v })}
                      disabled={statusMut.isPending}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">pending</SelectItem>
                        <SelectItem value="confirmed">confirmed</SelectItem>
                        <SelectItem value="declined">declined</SelectItem>
                        <SelectItem value="cancelled">cancelled</SelectItem>
                        <SelectItem value="completed">completed (attended)</SelectItem>
                        <SelectItem value="no_show">no show</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BillingSection() {
  const fetchProducts = useServerFn(getRestaurantProducts);
  const q = useSuspenseQuery({
    queryKey: ["restaurant", "products"],
    queryFn: () => fetchProducts(),
  });
  
  const qc = useQueryClient();
  const { t, lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
  
  const restaurant = q.data?.restaurant;
  if (!restaurant) return null;

  const planName = restaurant.plan_name || "starter";
  const subStatus = restaurant.subscription_status || "not_active";
  const billingCycleStart = restaurant.billing_cycle_start ? new Date(restaurant.billing_cycle_start) : new Date();

  // Mutations
  const getConnectUrl = useServerFn(getStripeConnectUrl);
  const disconnect = useServerFn(disconnectStripe);
  const startSubscription = useServerFn(startStarterSubscription);
  const getPortalUrl = useServerFn(openBillingPortal);

  const [loading, setLoading] = useState(false);

  const handleConnectStripe = async () => {
    trackEvent("stripe_connect_clicked");
    setLoading(true);
    try {
      const res = await getConnectUrl({ slug: restaurant.slug, origin: window.location.origin });
      if (res?.url) {
        window.location.href = res.url;
      }
    } catch (e: any) {
      alert("Failed to get Stripe connection URL: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectStripe = async () => {
    if (confirm(tt("Bist du sicher, dass du Stripe trennen möchtest? Dein Storefront wird offline geschaltet und Bestellungen pausiert.", 
                   "Are you sure you want to disconnect Stripe? Your storefront will be unpublished and ordering paused."))) {
      setLoading(true);
      try {
        await disconnect();
        alert(tt("Stripe-Konto getrennt.", "Stripe account disconnected."));
        qc.invalidateQueries({ queryKey: ["restaurant"] });
      } catch (e: any) {
        alert("Failed to disconnect: " + e.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStartSubscription = async () => {
    trackEvent("subscription_checkout_started");
    setLoading(true);
    try {
      const res = await startSubscription({ origin: window.location.origin });
      if (res?.url) {
        window.location.href = res.url;
      }
    } catch (e: any) {
      alert("Failed to start subscription: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPortal = async () => {
    setLoading(true);
    try {
      const res = await getPortalUrl({ origin: window.location.origin });
      if (res?.url) {
        window.location.href = res.url;
      }
    } catch (e: any) {
      alert("Failed to open billing portal: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  // Next payment is always 1 month after start
  const nextPaymentDate = new Date(billingCycleStart);
  nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

  const isStripeConnected = restaurant.stripe_connect_status === "connected";
  const isSubActive = subStatus === "active";

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl">{tt("Abonnement & Abrechnung", "Subscription & Billing")}</h2>
        <p className="text-sm text-muted-foreground">
          {tt("Verwalte deine Stripe-Zahlungsverbindung und dein Speisely-Abonnement.", 
             "Manage your Stripe payment connection and Speisely subscription plan.")}
        </p>
      </div>

      {/* STRIPE CONNECTION SECTION */}
      <div className="surface-card p-6 space-y-4">
        <h3 className="font-display text-xl flex items-center gap-2">
          💳 {tt("Direktzahlungen (Stripe Connect)", "Direct Payments (Stripe Connect)")}
        </h3>
        
        {isStripeConnected ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#22C55E] bg-[#22C55E]/10 p-3 rounded-lg border border-[#22C55E]/20 text-sm font-semibold">
              <span>🟢</span>
              <p>{tt("Ihr Stripe-Konto ist verbunden. Kunden bezahlen Sie direkt.", 
                     "Your Stripe account is connected. Customers pay you directly.")}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              {tt("Verbundenes Stripe-Konto: ", "Connected Stripe Account: ")} <code className="font-mono bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">{restaurant.stripe_user_id}</code>
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive hover:bg-destructive/10" 
              disabled={loading} 
              onClick={handleDisconnectStripe}
            >
              {tt("Stripe-Verbindung trennen", "Disconnect Stripe")}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200/50 text-sm font-semibold">
              <span>🔴</span>
              <p>{tt("Stripe-Konto nicht verbunden. Verbinden Sie Ihr Konto, um Bestellungen anzunehmen.", 
                     "Connect your Stripe account to accept online orders.")}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {tt("Um Online-Bestellungen anzunehmen, müssen Sie ein Stripe-Konto über Stripe Connect verbinden. Dies dauert weniger als 2 Minuten.", 
                 "To accept online orders, you need to connect a Stripe account via Stripe Connect. This takes less than 2 minutes.")}
            </p>
            <Button 
              className="bg-[#635BFF] hover:bg-[#635BFF]/90 text-white font-semibold flex items-center gap-2" 
              disabled={loading} 
              onClick={handleConnectStripe}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M13.962 10.885c0-1.83-.984-2.817-2.9-2.817c-1.22 0-2.296.536-2.9 1.053l-.536-3.238c.677-.384 2.112-.767 3.743-.767c3.82 0 5.86 1.954 5.86 5.62c0 4.148-3.084 5.925-6.236 5.925c-1.39 0-2.482-.321-3.023-.62l.52-3.177c.609.309 1.57.575 2.65.575c1.884.001 2.923-1.077 2.923-2.556zM8.344 6.772v10.51H4.664V6.772h3.68zM19.336 6.772v10.51h-3.68V6.772h3.68z"/></svg>
              {tt("Mit Stripe verbinden", "Connect with Stripe")}
            </Button>
          </div>
        )}
      </div>

      {/* SPEISELY SUBSCRIPTION SECTION */}
      <div className="surface-card p-6 space-y-6">
        <h3 className="font-display text-xl flex items-center gap-2">
          🚀 {tt("Speisely-Abonnement", "Speisely Subscription")}
        </h3>

        {!isStripeConnected ? (
          <div className="bg-stone-50 dark:bg-stone-900/20 p-5 rounded-lg border border-border text-center text-sm text-muted-foreground">
            {tt("Bitte verbinden Sie zuerst Stripe, um Ihr Abonnement zu verwalten.", 
               "Please connect Stripe first to manage your subscription plan.")}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Lapsed states / Active State Banners */}
            {subStatus === "past_due" && (
              <div className="bg-yellow-50 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-200 border border-yellow-200 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-bold text-sm">⚠️ {tt("Zahlung fehlgeschlagen", "Payment Failed")}</p>
                  <p className="text-xs mt-1">
                    {tt("Ihre Zahlung ist fehlgeschlagen. Bitte aktualisieren Sie Ihre Rechnungsdaten, um Ihr Storefront online zu halten.", 
                       "Your payment failed. Please update your billing details to keep your storefront live.")}
                  </p>
                </div>
                <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white shrink-0" onClick={handleOpenPortal} disabled={loading}>
                  {tt("Abrechnung aktualisieren", "Update Billing")}
                </Button>
              </div>
            )}

            {subStatus === "canceled" && (
              <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-200 border border-rose-200 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-bold text-sm">🛑 {tt("Abonnement gekündigt", "Subscription Canceled")}</p>
                  <p className="text-xs mt-1">
                    {tt("Ihr Starter-Tarif wurde gekündigt. Ihr Storefront ist derzeit pausiert.", 
                       "Your Starter Plan has been canceled. Your storefront is currently paused.")}
                  </p>
                </div>
                <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white shrink-0" onClick={handleStartSubscription} disabled={loading}>
                  {tt("Starter-Tarif starten", "Start Starter Plan")}
                </Button>
              </div>
            )}

            {/* Plan Display Cards */}
            <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
              <div className="space-y-4">
                <div className={`surface-card p-6 border-l-4 ${isSubActive ? 'border-l-forest' : 'border-l-zinc-300'} shadow-sm`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full ${isSubActive ? 'bg-forest/10 text-forest' : 'bg-stone-100 text-muted-foreground'}`}>
                        {tt("Speisely Tarif", "Speisely Plan")}
                      </span>
                      <h3 className="mt-3 font-display text-2xl">
                        {planName === "starter" ? tt("Starter-Paket (€34.99/Monat)", "Starter Plan (€34.99/month)") : planName}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase ${isSubActive ? 'text-green-600 bg-green-100' : 'text-stone-500 bg-stone-100'}`}>
                        {isSubActive ? tt("Aktiv", "Active") : subStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {isSubActive && (
                    <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-muted-foreground font-medium">{tt("Abrechnungszeitraum", "Billing Cycle")}</p>
                        <p className="font-semibold text-forest mt-0.5">{tt("Monatlich", "Monthly")}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-medium">{tt("Nächste Zahlung am", "Next Invoice Date")}</p>
                        <p className="font-semibold text-forest mt-0.5">{nextPaymentDate.toLocaleDateString(lang === "de" ? "de-DE" : "en-US")}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Plan Activation step if no subscription yet */}
                {!isSubActive && subStatus !== "past_due" && subStatus !== "canceled" && (
                  <div className="bg-stone-50 dark:bg-stone-900/20 p-5 rounded-lg border border-dashed border-border flex flex-col items-center text-center space-y-4">
                    <p className="text-sm font-semibold">
                      {tt("Abonnieren Sie das Restaurant Starter-Paket", "Subscribe to the Restaurant Starter Plan")}
                    </p>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      {tt("Für nur €34.99/Monat erhalten Sie ein unbegrenztes Storefront mit 0% Bestellprovision und Anbindung an Ihr eigenes Stripe-Konto.", 
                         "For just €34.99/month, unlock your unlimited storefront with 0% order commission and connection to your own Stripe account.")}
                    </p>
                    <Button className="w-full bg-forest hover:bg-forest/90 text-white font-bold" onClick={handleStartSubscription} disabled={loading}>
                      {tt("Starter-Tarif starten", "Start Starter Plan")}
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {/* Plan Features Checklist */}
                <div className="surface-card p-5 space-y-3">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{tt("Enthaltene Leistungen", "Plan Features")}</h4>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{tt("0% Bestellprovision", "0% order commission")}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{tt("Tischreservierungen inklusive", "Table reservations included")}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{tt("Eigene gehostete Storefront-URL", "Hosted storefront URL")}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{tt("Custom Domain Support", "Custom domain support")}</span>
                    </li>
                  </ul>
                </div>

                {/* Manage billing button when active or past_due */}
                {(isSubActive || subStatus === "past_due") && (
                  <Button variant="outline" size="sm" className="w-full rounded-full" onClick={handleOpenPortal} disabled={loading}>
                    {tt("Zahlungen & Rechnungen verwalten", "Manage Billing & Portal")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function RestaurantDashboardInner() {
  const fetchProducts = useServerFn(getRestaurantProducts);
  const qc = useQueryClient();
  const q = useSuspenseQuery({
    queryKey: ["restaurant", "products"],
    queryFn: () => fetchProducts(),
    retry: false,
  });

  React.useEffect(() => {
    trackEvent("restaurant_onboarding_started");
  }, []);

  // Real-time audio notification hook
  React.useEffect(() => {
    if (!q.data?.restaurant) return;
    
    const playAudio = () => {
      const audio = new Audio("/speisely_alert.mp3");
      audio.play().catch(e => console.log("Audio play blocked by browser:", e));
    };

    const channel = supabase.channel('restaurant-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'restaurant_orders', filter: `restaurant_id=eq.${q.data.restaurant.id}` },
        () => {
          playAudio();
          qc.invalidateQueries({ queryKey: ["restaurant", "orders"] });
          qc.invalidateQueries({ queryKey: ["restaurant", "kpis"] });
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'table_reservations', filter: `restaurant_id=eq.${q.data.restaurant.id}` },
        () => {
          playAudio();
          qc.invalidateQueries({ queryKey: ["restaurant", "reservations"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [q.data?.restaurant, qc]);

  const { hash } = useLocation();
  const activeTab = (hash || "#overview").replace("#", "");


  
  if (!q.data?.restaurant) {
    return (
      <VendorLayout vertical="restaurant" title="Restaurant Dashboard">
        <EmptyCard
          title="No storefront yet"
          description="Create your restaurant storefront to start receiving orders."
        />
        <CreateRestaurantForm />
      </VendorLayout>
    );
  }

  return (
    <VendorLayout 
      vertical="restaurant" 
      title={`${q.data.restaurant.name} Dashboard`} 
      storefrontSlug={q.data.restaurant.slug}
    >
      {activeTab === "overview" && <OverviewSection />}
      {activeTab === "orders" && <OrdersSection />}
      {activeTab === "reservations" && <ReservationsSection />}
      {activeTab === "menu" && <ProductsSection />}
      {activeTab === "promotions" && <PromotionsSection vertical="restaurants" />}
      {activeTab === "billing" && <BillingSection />}
      {activeTab === "profile" && (
        <div className="space-y-10">
          <CustomDomainSection 
            entity={q.data.restaurant} 
            onSave={async (slug, domain) => {
              const { updateMyRestaurantSettings } = await import("@/lib/restaurant/mutations.functions");
              await updateMyRestaurantSettings({
                data: {
                  name: q.data.restaurant.name, // required by schema
                  slug: slug,
                  custom_domain: domain
                }
              });
              qc.invalidateQueries({ queryKey: ["restaurant", "products"] });
            }}
          />
          <BusinessProfileSection />
        </div>
      )}
    </VendorLayout>
  );
}

function RestaurantDashboard() {
  return (
    <DashboardErrorBoundary>
      <RestaurantDashboardInner />
    </DashboardErrorBoundary>
  );
}
