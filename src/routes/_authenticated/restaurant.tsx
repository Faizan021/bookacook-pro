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
import { Checkbox } from "@/components/ui/checkbox";
import { useSpeiselyPing } from "@/lib/vendor/useSpeiselyPing";
import { CustomDomainSection } from "@/components/vendor/CustomDomainSection";
import { VendorLayout, DashboardSkeleton } from "@/components/vendor/VendorLayout";
import { printReceipt } from "@/utils/printReceipt";
import { useI18n } from "@/i18n/I18nProvider";
import { PrintOnboardingBanner } from "@/components/vendor/PrintOnboardingBanner";
import { CommunicationPreferences } from "@/components/vendor/CommunicationPreferences";
import { MenuImportWizard } from "@/components/vendor/MenuImportWizard";
import { SubscriptionTermsModal } from "@/components/vendor/SubscriptionTermsModal";

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
  head: () => ({ meta: [{ title: "Restaurant Dashboard â€” Speisely" }] }),
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
            <p className="text-muted-foreground">Session expired. Redirecting to sign inâ€¦</p>
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
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
  const create = useServerFn(createMyRestaurant);
  const saveConsent = useServerFn(updateMyConsent);
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const mut = useMutation({
    mutationFn: (vars: { name: string; slug: string; custom_domain: string }) => create(vars),
    onSuccess: async () => {
      try {
        await saveConsent({ marketing_opt_in: marketingOptIn, source: "restaurant_signup" });
      } catch (e) {
        console.error("Failed to save marketing consent during signup:", e);
      }
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
      
      {/* Optional Marketing Consent */}
      <div className="flex items-start gap-2.5 pt-1 pb-2">
        <Checkbox
          id="signup-marketing-consent"
          checked={marketingOptIn}
          onCheckedChange={(checked) => setMarketingOptIn(!!checked)}
          className="mt-0.5 border-forest/20 text-forest data-[state=checked]:bg-forest data-[state=checked]:border-forest"
        />
        <div className="grid gap-1 leading-none">
          <Label htmlFor="signup-marketing-consent" className="text-xs font-medium text-forest cursor-pointer">
            {tt(
              "Ich möchte Updates, Branchen-Tipps und Angebote von Speisely erhalten (optional)",
              "I want to receive updates, industry tips, and promotions from Speisely (optional)"
            )}
          </Label>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={mut.isPending}>
        {mut.isPending ? "Creating…" : "Create storefront"}
      </Button>
    </form>
  );
}

function OrdersSection() {
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
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
      updateStatus(vars),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["restaurant", "orders"] }),
  });


  const data = ordersQ.data;
  if (!data?.restaurant) {
    return (
      <EmptyCard
        title={tt("Erstellen Sie Ihr Storefront", "Create your storefront")}
        description={tt("Richten Sie Ihr Restaurant ein, um Bestellungen über Speisely zu erhalten.", "Set up your restaurant to start receiving orders on Speisely.")}
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
        notes: tt("Bitte extra scharf", "Extra spicy, please"),
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
        title={tt("Noch keine Bestellungen", "No orders yet")}
        description={tt(
          `Sobald Kunden bei ${data.restaurant.name} bestellen, erscheinen die Bestellungen hier in Echtzeit.`,
          `When customers order from ${data.restaurant.name}, they will appear here in real time.`
        )}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={triggerTestPrint}
            className="rounded-full gap-2 border-forest/20 text-forest hover:bg-cream"
          >
            🖨️ {tt("Test-Beleg drucken", "Print Test Receipt")}
          </Button>
          <p className="text-xs text-muted-foreground max-w-sm">
            {tt(
              "Nutze dies, um die Ausrichtung und das Layout deines 80mm Thermo-Bondruckers zu testen.",
              "Use this to test your 80mm thermal receipt printer alignment and layout."
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
            🖨️ {t("Test Print", "Test-Druck")}
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
                      {o.customer_name ?? "Customer"} â€” {formatPrice(o.total_cents)}
                    </h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => printReceipt(o, data.restaurant.name)}
                      className="h-7 rounded-full text-xs gap-1 border-forest/20 text-forest hover:bg-cream shrink-0"
                    >
                      🖨️ {t("Print", "Drucken")}
                    </Button>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    #{o.id.slice(0, 8)} Â· {new Date(o.created_at).toLocaleString()}
                  </p>
                  {items.length > 0 && (
                    <ul className="mt-3 text-sm text-foreground/80 space-y-0.5">
                      {items.map((it: any, i: number) => (
                        <li key={i}>
                          {it.qty ?? 1}Ã— {it.name}
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
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
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
  const [showImportWizard, setShowImportWizard] = useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const mut = useMutation({
    mutationFn: (vars: { name: string; description: string; price_cents: number; image_url: string | null }) =>
      upsert(vars),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["restaurant", "products"] });
      setName("");
      setDescription("");
      setPrice("");
      setImagePath(null);
      setImagePreview(null);
      setErr(null);
    },
    onError: (e: any) => setErr(e.message ?? tt("Speichern fehlgeschlagen", "Failed to save")),
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
      setErr(e.message ?? tt("Upload fehlgeschlagen", "Upload failed"));
    } finally {
      setUploading(false);
    }
  }


  if (!q.data?.restaurant) return null;

  return (
    <section className="space-y-4">
      {showImportWizard && (
        <MenuImportWizard
          onClose={() => setShowImportWizard(false)}
          onImported={() => {
            qc.invalidateQueries({ queryKey: ["restaurant", "products"] });
            setShowImportWizard(false);
          }}
        />
      )}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="font-display text-2xl">{tt("Speisekarte", "Menu")}</h2>
        <Button
          id="menu-import-btn"
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowImportWizard(true)}
          className="gap-1.5 border-brand-orange text-brand-orange hover:bg-brand-orange/10"
        >
          ⬆️ {tt("Speisekarte importieren", "Import Menu")}
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {q.data.products.length === 0 ? (
            <EmptyCard
              title={tt("Noch keine Artikel auf der Speisekarte", "No menu items yet")}
              description={tt("Fügen Sie Ihr erstes Gericht mithilfe des Formulars auf der rechten Seite hinzu.", "Add your first dish using the form on the right.")}
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
                      {p.is_available ? tt("Verfügbar", "Available") : tt("Ausgeblendet", "Hidden")}
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
          <h3 className="font-display text-lg">{tt("Menüartikel hinzufügen", "Add menu item")}</h3>
          <div className="space-y-1.5">
            <Label htmlFor="pname">{tt("Name", "Name")}</Label>
            <Input id="pname" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pdesc">{tt("Beschreibung", "Description")}</Label>
            <Textarea
              id="pdesc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pprice">{tt("Preis (EUR)", "Price (EUR)")}</Label>
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
            <Label>{tt("Bild (Optional)", "Image (Optional)")}</Label>
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
              {uploading ? tt("Wird hochgeladen...", "Uploading…") : imagePreview ? tt("Bild ersetzen", "Replace image") : tt("Bild hochladen", "Upload image")}
            </Button>
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <Button type="submit" className="w-full" disabled={mut.isPending || uploading}>
            {mut.isPending ? tt("Wird gespeichert...", "Saving…") : tt("Zur Speisekarte hinzufügen", "Add to menu")}
          </Button>
        </form>
      </div>
    </section>
  );}

function OnboardingProgressIndicator({ kpis }: { kpis: any }) {
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);

  const stripeConnected = kpis.stripeConnectStatus === "connected";
  const subActive = kpis.subscriptionStatus === "active";
  const published = kpis.isPublished;
  const hasPaymentMethod = stripeConnected || kpis.acceptsCash || kpis.acceptsPaypal;

  const getStepStatus = (stepId: number) => {
    if (stepId === 1) {
      return hasPaymentMethod ? "completed" : "current";
    }
    if (stepId === 2) {
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
      title: tt("Zahlungsmethoden einrichten", "Set up Payment Methods"),
      description: tt(
        "Verbinden Sie Stripe oder aktivieren Sie Barzahlung/PayPal, um Bestellungen anzunehmen.",
        "Connect Stripe or enable Cash/PayPal in profile settings to accept payments."
      ),
      actionLabel: tt("Zahlungsmethoden einrichten", "Set up Payment Methods"),
      actionHash: "profile",
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

  const allCompleted = hasPaymentMethod && subActive && published;

  return (
    <div className="bg-white border border-[#e2e8e4] p-8 rounded-3xl shadow-sm space-y-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-xl text-forest flex items-center gap-2">
            🚀 {tt("Storefront-Einrichtung", "Storefront Setup Checklist")}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {allCompleted 
              ? tt("Herzlichen Glückwunsch! Ihr Storefront ist vollständig eingerichtet und live.", "Congratulations! Your storefront is fully configured and live.")
              : tt("Schließen Sie diese Schritte ab, um Ihre Bestellungen auf Speisely zu starten.", "Complete these steps to start accepting orders on Speisely.")
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
              className={`flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 ${
                isCompleted 
                  ? "bg-emerald-500/5 dark:bg-emerald-950/10 border-emerald-500/20 shadow-sm" 
                  : isCurrent 
                  ? "bg-white dark:bg-zinc-900 border-forest/35 shadow-md ring-1 ring-forest/10 scale-[1.01]" 
                  : "bg-stone-50/50 dark:bg-stone-900/10 border-stone-200/60 opacity-60"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    isCompleted 
                      ? "bg-emerald-600 text-white shadow-sm" 
                      : isCurrent 
                      ? "bg-forest text-cream shadow-md" 
                      : "bg-stone-200 text-stone-400"
                  }`}>
                    {isCompleted ? "✓" : step.id}
                  </span>
                  
                  {isCurrent && (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-brand-orange bg-brand-orange/10 px-2.5 py-1 rounded-full border border-brand-orange/20 animate-pulse">
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
                    className="w-full bg-forest hover:bg-forest/90 text-cream text-xs font-bold py-2.5 rounded-full transition-all duration-200 cursor-pointer shadow-sm"
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
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
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
          <h2 className="font-display text-2xl">{tt("Dringende Aktionen", "Urgent Actions")}</h2>
          <div className="flex items-center space-x-2">
            <Label htmlFor="active-status" className="font-medium">{tt("Bestellungen annehmen", "Accepting Orders")}</Label>
            <Switch
              id="active-status"
              checked={q.data.isActive}
              onCheckedChange={async (val) => {
                await upsert({ name: "placeholder", is_active: val });
                qc.invalidateQueries({ queryKey: ["restaurant", "kpis"] });
              }}
            />
          </div>
        </div>

        {hasUrgentActions ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {q.data.pendingOrders > 0 && (
              <div className="bg-white border border-[#e2e8e4] p-6 rounded-2xl shadow-sm flex flex-col justify-between border-l-4 border-l-brand-orange">
                <div>
                  <p className="font-display font-bold text-base text-forest">{q.data.pendingOrders} {tt("neue Bestellungen warten", "new orders waiting")}</p>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{tt("Prüfen und bestätigen Sie Ihre eingehenden Bestellungen.", "Review and accept your incoming orders.")}</p>
                </div>
                <Button onClick={() => navigateTo("orders")} className="mt-5 w-full bg-brand-orange hover:bg-brand-orange/90 text-white rounded-full text-xs font-semibold py-2 transition shadow-sm">{tt("Bestellungen anzeigen", "View Orders")}</Button>
              </div>
            )}
            {q.data.pendingReservations > 0 && (
              <div className="bg-white border border-[#e2e8e4] p-6 rounded-2xl shadow-sm flex flex-col justify-between border-l-4 border-l-brand-orange">
                <div>
                  <p className="font-display font-bold text-base text-forest">{q.data.pendingReservations} {tt("Reservierungsanfragen", "reservation requests")}</p>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{tt("Ausstehende Reservierungen erfordern Ihre Zustimmung.", "Pending reservations require your approval.")}</p>
                </div>
                <Button onClick={() => navigateTo("reservations")} className="mt-5 w-full bg-brand-orange hover:bg-brand-orange/90 text-white rounded-full text-xs font-semibold py-2 transition shadow-sm">{tt("Reservierungen anzeigen", "View Reservations")}</Button>
              </div>
            )}
            {q.data.totalProducts === 0 && (
              <div className="bg-white border border-[#e2e8e4] p-6 rounded-2xl shadow-sm flex flex-col justify-between border-l-4 border-l-brand-orange">
                <div>
                  <p className="font-display font-bold text-base text-forest">{tt("Ihre Speisekarte hat 0 Artikel", "Your menu has 0 items")}</p>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{tt("Kunden können keine Bestellungen aufgeben, bis Sie Artikel hinzufügen.", "Customers cannot place orders until you add items.")}</p>
                </div>
                <Button onClick={() => navigateTo("menu")} className="mt-5 w-full bg-brand-orange hover:bg-brand-orange/90 text-white rounded-full text-xs font-semibold py-2 transition shadow-sm">{tt("Artikel hinzufügen", "Add Menu Items")}</Button>
              </div>
            )}
            {q.data.isProfileIncomplete && (
              <div className="bg-white border border-[#e2e8e4] p-6 rounded-2xl shadow-sm flex flex-col justify-between border-l-4 border-l-brand-orange">
                <div>
                  <p className="font-display font-bold text-base text-forest">{tt("Profil unvollständig", "Profile incomplete")}</p>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{tt("Logo, Telefonnummer oder Beschreibung fehlt.", "Missing logo, phone, or description.")}</p>
                </div>
                <Button onClick={() => navigateTo("profile")} variant="outline" className="mt-5 w-full border-brand-orange text-brand-orange hover:bg-brand-orange/10 rounded-full text-xs font-semibold py-2 transition">{tt("Profil vervollständigen", "Complete Profile")}</Button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/10 p-5 flex items-center gap-3">
            <span className="text-emerald-600 text-2xl">🎉</span>
            <p className="text-forest font-semibold text-base">{tt("Alles erledigt! Aktuell gibt es keine dringenden Aktionen.", "All caught up! Nothing needs your attention right now.")}</p>
          </div>
        )}
      </div>

      {/* SECTION 2: TODAY AT A GLANCE */}
      <div className="space-y-4">
        <h2 className="font-display text-xl text-forest">{tt("Heute im Überblick", "Today at a glance")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white border border-[#e2e8e4] p-6 rounded-2xl shadow-sm space-y-2 hover:border-forest/20 transition-all duration-200">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5"><span className="text-base">🛍️</span> {tt("Bestellungen heute", "Orders today")}</p>
            <p className="text-3xl font-bold font-display text-forest">{q.data.ordersToday}</p>
          </div>
          <div className="bg-white border border-[#e2e8e4] p-6 rounded-2xl shadow-sm space-y-2 hover:border-forest/20 transition-all duration-200">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5"><span className="text-base">📈</span> {tt("Umsatz heute", "Revenue today")}</p>
            <p className="text-3xl font-bold font-display text-forest">€{(q.data.revenueTodayCents / 100).toFixed(2)}</p>
          </div>
          <div className="bg-white border border-[#e2e8e4] p-6 rounded-2xl shadow-sm space-y-2 hover:border-forest/20 transition-all duration-200">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5"><span className="text-base">📅</span> {tt("Reservierungen heute", "Reservations today")}</p>
            <p className="text-3xl font-bold font-display text-forest">{q.data.reservationsToday}</p>
          </div>
          <div className="bg-white border border-[#e2e8e4] p-6 rounded-2xl shadow-sm space-y-2 hover:border-forest/20 transition-all duration-200">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5"><span className="text-base">👀</span> {tt("Profilaufrufe heute", "Profile views today")}</p>
            <p className="text-3xl font-bold font-display text-forest">{q.data.profileViewsToday}</p>
          </div>
        </div>
      </div>

      {/* SECTION 3: RECENT ACTIVITY FEED */}
      <div className="space-y-4">
        <h2 className="font-display text-xl text-forest">{tt("Aktuelle Aktivitäten", "Recent activity feed")}</h2>
        <div className="bg-white border border-[#e2e8e4] rounded-2xl shadow-sm overflow-hidden">
          {(!aq.data || aq.data.length === 0) ? (
            <div className="p-8 text-center text-muted-foreground">{tt("Keine aktuellen Aktivitäten.", "No recent activity.")}</div>
          ) : (
            <div className="divide-y divide-[#e2e8e4]/60">
              {aq.data.map((event: any) => {
                const dateObj = new Date(event.time);
                const isToday = dateObj.toDateString() === new Date().toDateString();
                const isYesterday = dateObj.toDateString() === new Date(Date.now() - 86400000).toDateString();
                let timeStr = "";
                
                if (isToday) {
                   timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                } else if (isYesterday) {
                  timeStr = tt("gestern", "yesterday");
                } else {
                  timeStr = dateObj.toLocaleDateString();
                }

                return (
                  <div key={event.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#f8faf9] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 mt-0.5 sm:mt-0">
                        {event.type === 'order' && <span className="text-brand-orange text-lg">🛍️</span>}
                        {event.type === 'reservation' && <span className="text-sky-500 text-lg">📅</span>}
                        {event.type === 'menu' && <span className="text-emerald-500 text-lg">🍽️</span>}
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {event.description}
                        {event.status === "pending" && <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">{tt("ausstehend", "pending")}</span>}
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

function SettingsGeneralSection({ restaurant }: { restaurant: any }) {
  const { t, lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
  const qc = useQueryClient();
  const upsert = useServerFn(updateMyRestaurantSettings);

  const [name, setName] = useState(restaurant.name);
  const [desc, setDesc] = useState(restaurant.description || "");
  const [phone, setPhone] = useState(restaurant.phone || "");
  const [address, setAddress] = useState(restaurant.business_address || "");
  const [logoPreview, setLogoPreview] = useState(restaurant.logo_url ? supabase.storage.from("storefront-assets").getPublicUrl(restaurant.logo_url).data.publicUrl : null);
  const [bannerPreview, setBannerPreview] = useState(restaurant.banner_image_url ? supabase.storage.from("storefront-assets").getPublicUrl(restaurant.banner_image_url).data.publicUrl : null);
  const [logoPath, setLogoPath] = useState(restaurant.logo_url || null);
  const [bannerPath, setBannerPath] = useState(restaurant.banner_image_url || null);
  const [certifications, setCertifications] = useState((restaurant as any).certifications || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const logoRef = React.useRef<HTMLInputElement>(null);
  const bannerRef = React.useRef<HTMLInputElement>(null);

  async function handleImage(file: File, type: "logo" | "banner") {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${restaurant.id}/${type}-${crypto.randomUUID()}.${ext}`;
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
    setSaving(true);
    try {
      await upsert({
          name,
          description: desc,
          phone,
          business_address: address,
          logo_url: logoPath,
          banner_image_url: bannerPath,
          certifications,
        });
      alert(tt("Allgemeine Einstellungen gespeichert!", "General settings saved successfully!"));
      qc.invalidateQueries({ queryKey: ["restaurant"] });
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
    <div className="bg-white border border-[#e2e8e4] p-8 rounded-3xl shadow-sm space-y-6">
      <div className="flex flex-col gap-1.5 border-b border-[#e2e8e4] pb-4">
        <h3 className="font-display text-xl text-forest">{tt("Allgemeine Einstellungen", "General Settings")}</h3>
        <p className="text-xs text-muted-foreground">{tt("Verwalten Sie Ihre grundlegenden Restaurant-Informationen.", "Manage your basic restaurant details.")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="restaurant-name">{tt("Name des Restaurants", "Restaurant Name")}</Label>
            <Input id="restaurant-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="restaurant-phone">{tt("Telefonnummer", "Phone Number")}</Label>
            <Input id="restaurant-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="restaurant-address">{tt("Geschäftsadresse", "Business Address")}</Label>
            <Input id="restaurant-address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="restaurant-certifications">{tt("Zertifizierungen (z.B. Halal, Bio, Vegan)", "Certifications (e.g., Halal, Organic, Vegan)")}</Label>
            <Input id="restaurant-certifications" value={certifications} onChange={(e) => setCertifications(e.target.value)} placeholder="Halal, Bio, Vegan" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="restaurant-desc">{tt("Beschreibung", "Description")}</Label>
            <Textarea id="restaurant-desc" value={desc} onChange={(e) => setDesc(e.target.value)} rows={5} className="resize-none" />
          </div>

          {/* Logo & Banner Upload Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{tt("Logo Bild", "Logo Image")}</Label>
              <div 
                onClick={() => !uploading && logoRef.current?.click()}
                className="cursor-pointer border border-dashed border-[#e2e8e4] hover:border-forest/40 hover:bg-[#f8faf9] rounded-2xl p-4 flex flex-col items-center justify-center h-28 bg-[#f8faf9] transition-all duration-200 overflow-hidden relative group"
              >
                {logoPreview ? (
                  <>
                    <img src={logoPreview} className="object-cover w-full h-full rounded-xl" alt="Logo" />
                    <div className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs font-semibold rounded-2xl">
                      {tt("Bild ändern", "Change Image")}
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-1">
                    <span className="text-2xl block">📸</span>
                    <span className="text-[10px] font-semibold text-forest/70 block">{tt("Bild wählen", "Choose Logo")}</span>
                  </div>
                )}
                <input ref={logoRef} type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0], "logo")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{tt("Banner Bild", "Banner Image")}</Label>
              <div 
                onClick={() => !uploading && bannerRef.current?.click()}
                className="cursor-pointer border border-dashed border-[#e2e8e4] hover:border-forest/40 hover:bg-[#f8faf9] rounded-2xl p-4 flex flex-col items-center justify-center h-28 bg-[#f8faf9] transition-all duration-200 overflow-hidden relative group"
              >
                {bannerPreview ? (
                  <>
                    <img src={bannerPreview} className="object-cover w-full h-full rounded-xl" alt="Banner" />
                    <div className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs font-semibold rounded-2xl">
                      {tt("Bild ändern", "Change Image")}
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-1">
                    <span className="text-2xl block">🖼️</span>
                    <span className="text-[10px] font-semibold text-forest/70 block">{tt("Bild wählen", "Choose Banner")}</span>
                  </div>
                )}
                <input ref={bannerRef} type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0], "banner")} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[#e2e8e4] flex justify-end">
        <Button onClick={handleSave} disabled={uploading || saving} className="bg-forest hover:bg-forest/90 text-white rounded-full px-6 py-2 shadow-sm font-semibold transition cursor-pointer">
          {saving ? tt("Wird gespeichert...", "Saving...") : tt("Allgemeines speichern", "Save General Settings")}
        </Button>
      </div>
    </div>
    <div className="mt-6">
      <CommunicationPreferences />
    </div>
    </>
  );
}

function SettingsStorefrontSection({ restaurant }: { restaurant: any }) {
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
  const qc = useQueryClient();
  const upsert = useServerFn(updateMyRestaurantSettings);

  const [acceptsPickup, setAcceptsPickup] = useState(restaurant.accepts_pickup ?? true);
  const [acceptsDelivery, setAcceptsDelivery] = useState(restaurant.accepts_delivery ?? true);
  const [deliveryRadius, setDeliveryRadius] = useState(restaurant.delivery_radius_km?.toString() || "5");
  const [minOrder, setMinOrder] = useState(restaurant.min_order_amount?.toString() || "10");
  const [deliveryFee, setDeliveryFee] = useState(restaurant.delivery_fee?.toString() || "2.5");
  const [serviceAreas, setServiceAreas] = useState(restaurant.service_areas || "");
  const [isPublished, setIsPublished] = useState(restaurant.is_published ?? false);
  const [saving, setSaving] = useState(false);

  // Check if payments are configured
  const hasPaymentMethod = restaurant.stripe_connect_status === "connected" || restaurant.accepts_cash || restaurant.accepts_paypal;

  async function handleSave() {
    setSaving(true);
    try {
      await upsert({
          name: restaurant.name,
          accepts_pickup: acceptsPickup,
          accepts_delivery: acceptsDelivery,
          delivery_radius_km: parseFloat(deliveryRadius) || 0,
          min_order_amount: parseFloat(minOrder) || 0,
          delivery_fee: parseFloat(deliveryFee) || 0,
          service_areas: serviceAreas,
          is_published: isPublished,
        });
      alert(tt("Storefront-Einstellungen gespeichert!", "Storefront settings saved successfully!"));
      qc.invalidateQueries({ queryKey: ["restaurant"] });
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Custom Domain Component */}
      <CustomDomainSection 
        entity={restaurant} 
        onSave={async (slug, domain) => {
          await upsert({
              name: restaurant.name,
              slug: slug,
              custom_domain: domain
            });
          qc.invalidateQueries({ queryKey: ["restaurant"] });
        }}
      />

      <div className="bg-white border border-[#e2e8e4] p-8 rounded-3xl shadow-sm space-y-6">
        <div className="flex flex-col gap-1.5 border-b border-[#e2e8e4] pb-4">
          <h3 className="font-display text-xl text-forest">{tt("Storefront & Liefer-Einstellungen", "Storefront & Delivery Settings")}</h3>
          <p className="text-xs text-muted-foreground">{tt("Verwalten Sie Ihre Bestellkanäle, Liefergebühren und die Storefront-Veröffentlichung.", "Manage your order channels, delivery fees, and storefront live status.")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center justify-between border border-border/60 rounded-2xl p-4 bg-[#f8faf9]">
              <div>
                <Label htmlFor="accepts-pickup" className="font-semibold text-forest">{tt("Abholung erlauben", "Allow Pickup")}</Label>
                <p className="text-[10px] text-muted-foreground mt-0.5">{tt("Kunden können Speisen vor Ort abholen", "Customers can pick up their orders at the counter")}</p>
              </div>
              <Switch id="accepts-pickup" checked={acceptsPickup} onCheckedChange={setAcceptsPickup} />
            </div>

            <div className="flex items-center justify-between border border-border/60 rounded-2xl p-4 bg-[#f8faf9]">
              <div>
                <Label htmlFor="accepts-delivery" className="font-semibold text-forest">{tt("Lieferung erlauben", "Allow Delivery")}</Label>
                <p className="text-[10px] text-muted-foreground mt-0.5">{tt("Eigener Lieferservice aktivieren", "Enable your own delivery service")}</p>
              </div>
              <Switch id="accepts-delivery" checked={acceptsDelivery} onCheckedChange={setAcceptsDelivery} />
            </div>

            {acceptsDelivery && (
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="delivery-radius" className="text-xs">{tt("Lieferradius (km)", "Radius (km)")}</Label>
                  <Input id="delivery-radius" type="number" min="0" step="0.5" value={deliveryRadius} onChange={(e) => setDeliveryRadius(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="min-order" className="text-xs">{tt("Mindestbestellwert (€)", "Min Order (€)")}</Label>
                  <Input id="min-order" type="number" min="0" step="0.5" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="delivery-fee" className="text-xs">{tt("Liefergebühr (€)", "Delivery Fee (€)")}</Label>
                  <Input id="delivery-fee" type="number" min="0" step="0.5" value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)} />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <Label htmlFor="service-areas">{tt("Liefergebiete (Postleitzahlen / Stadtteile)", "Service Areas (ZIPs / Neighborhoods)")}</Label>
              <Textarea id="service-areas" value={serviceAreas} onChange={(e) => setServiceAreas(e.target.value)} placeholder="e.g., 10115, 10435, Mitte" rows={3} className="resize-none" />
            </div>

            {/* Publishing Section */}
            <div className="flex flex-col gap-3 p-4 border border-[#e2e8e4] rounded-2xl bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="is-published" className="font-semibold text-forest">{tt("Storefront veröffentlichen", "Publish Storefront")}</Label>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{tt("Schalten Sie Ihr Storefront öffentlich live unter /restaurant/", "Make your storefront live at /restaurant/")}{restaurant.slug}</p>
                </div>
                <Switch id="is-published" checked={isPublished} disabled={!hasPaymentMethod} onCheckedChange={(val) => {
                  setIsPublished(val);
                  if (val) {
                    trackEvent("storefront_publish_attempted");
                  }
                }} />
              </div>
              {!hasPaymentMethod && (
                <p className="text-[10px] text-rose-600 bg-rose-500/5 border border-rose-500/10 p-2.5 rounded-lg leading-relaxed">
                  ⚠️ {tt("Aktivieren Sie zuerst mindestens eine Zahlungsmethode (Bargeld, PayPal oder Stripe) im Zahlungs-Tab, bevor Sie veröffentlichen.", "Please enable at least one payment method (Cash, PayPal, or Stripe Connect) under the Payments tab before publishing.")}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#e2e8e4] flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="bg-forest hover:bg-forest/90 text-white rounded-full px-6 py-2 shadow-sm font-semibold transition cursor-pointer">
            {saving ? tt("Wird gespeichert...", "Saving...") : tt("Storefront speichern", "Save Storefront Settings")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SettingsOperationsSection({ restaurant }: { restaurant: any }) {
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
  const qc = useQueryClient();
  const upsert = useServerFn(updateMyRestaurantSettings);

  const [operatingHours, setOperatingHours] = useState<any>(restaurant.operating_hours || {
    monday: { open: "09:00", close: "22:00", closed: false },
    tuesday: { open: "09:00", close: "22:00", closed: false },
    wednesday: { open: "09:00", close: "22:00", closed: false },
    thursday: { open: "09:00", close: "22:00", closed: false },
    friday: { open: "09:00", close: "23:00", closed: false },
    saturday: { open: "10:00", close: "23:00", closed: false },
    sunday: { open: "10:00", close: "21:00", closed: false },
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await upsert({
          name: restaurant.name,
          operating_hours: operatingHours,
        });
      alert(tt("Öffnungszeiten gespeichert!", "Operating hours saved successfully!"));
      qc.invalidateQueries({ queryKey: ["restaurant"] });
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white border border-[#e2e8e4] p-8 rounded-3xl shadow-sm space-y-6">
      <div className="flex flex-col gap-1.5 border-b border-[#e2e8e4] pb-4">
        <h3 className="font-display text-xl text-forest">{tt("Öffnungszeiten & Betriebszeiten", "Operating Hours")}</h3>
        <p className="text-xs text-muted-foreground">{tt("Legen Sie Ihre täglichen Öffnungszeiten fest. Kunden können außerhalb dieser Zeiten nur Vorbestellungen aufgeben.", "Set your daily business hours. Storefront orders will fall back to pre-ordering when closed.")}</p>
      </div>

      <div className="space-y-3">
        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
          const dayNames: Record<string, { de: string; en: string }> = {
            monday: { de: "Montag", en: "Monday" },
            tuesday: { de: "Dienstag", en: "Tuesday" },
            wednesday: { de: "Mittwoch", en: "Wednesday" },
            thursday: { de: "Donnerstag", en: "Thursday" },
            friday: { de: "Freitag", en: "Friday" },
            saturday: { de: "Samstag", en: "Saturday" },
            sunday: { de: "Sonntag", en: "Sunday" },
          };
          return (
            <div key={day} className="flex items-center justify-between border border-border/50 p-4 rounded-xl bg-[#f8faf9] flex-wrap gap-4">
              <div className="w-28 font-medium text-forest">{tt(dayNames[day].de, dayNames[day].en)}</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch 
                  checked={!operatingHours[day]?.closed} 
                  onCheckedChange={(checked) => setOperatingHours((prev: any) => ({
                    ...prev, 
                    [day]: { ...prev[day], closed: !checked }
                  }))} 
                />
                <span className="text-xs font-semibold text-muted-foreground">
                  {operatingHours[day]?.closed ? tt("Geschlossen", "Closed") : tt("Geöffnet", "Open")}
                </span>
              </div>
              {!operatingHours[day]?.closed && (
                <div className="flex items-center gap-2 text-xs">
                  <Input 
                    type="time" 
                    value={operatingHours[day]?.open || "09:00"} 
                    onChange={e => setOperatingHours((prev: any) => ({
                      ...prev, 
                      [day]: { ...prev[day], open: e.target.value }
                    }))} 
                    className="w-24 bg-white"
                  />
                  <span>-</span>
                  <Input 
                    type="time" 
                    value={operatingHours[day]?.close || "22:00"} 
                    onChange={e => setOperatingHours((prev: any) => ({
                      ...prev, 
                      [day]: { ...prev[day], close: e.target.value }
                    }))} 
                    className="w-24 bg-white"
                  />
                </div>
              )}
            </div>
          </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-[#e2e8e4] flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="bg-forest hover:bg-forest/90 text-white rounded-full px-6 py-2 shadow-sm font-semibold transition cursor-pointer">
          {saving ? tt("Wird gespeichert...", "Saving...") : tt("Öffnungszeiten speichern", "Save Operating Hours")}
        </Button>
      </div>
    </div>
  );
}

function SettingsPaymentsSection({ restaurant }: { restaurant: any }) {
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
  const qc = useQueryClient();
  const upsert = useServerFn(updateMyRestaurantSettings);
  const getConnectUrl = useServerFn(getStripeConnectUrl);
  const disconnect = useServerFn(disconnectStripe);

  const [acceptsCash, setAcceptsCash] = useState(restaurant.accepts_cash ?? false);
  const [acceptsPaypal, setAcceptsPaypal] = useState(restaurant.accepts_paypal ?? false);
  const [paypalEmail, setPaypalEmail] = useState(restaurant.paypal_email || "");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const isStripeConnected = restaurant.stripe_connect_status === "connected";

  async function handleConnectStripe() {
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
  }

  async function handleDisconnectStripe() {
    if (!confirm(tt("Sind Sie sicher, dass Sie Stripe deautorisieren möchten?", "Are you sure you want to disconnect Stripe?"))) return;
    setLoading(true);
    try {
      await disconnect();
      alert(tt("Stripe-Verbindung getrennt!", "Stripe successfully disconnected!"));
      qc.invalidateQueries({ queryKey: ["restaurant"] });
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await upsert({
          name: restaurant.name,
          accepts_cash: acceptsCash,
          accepts_paypal: acceptsPaypal,
          paypal_email: paypalEmail || null,
        });
      alert(tt("Zahlungsmethoden gespeichert!", "Payment methods saved successfully!"));
      qc.invalidateQueries({ queryKey: ["restaurant"] });
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1.5">
        <h2 className="font-display text-2xl text-forest">{tt("Kunden-Zahlungsmethoden", "Customer Payment Methods")}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {tt(
            "Konfigurieren Sie, wie Ihre Kunden für Bestellungen und Reservierungen bezahlen. Diese Einnahmen fließen direkt an Sie.",
            "Configure how your diners pay you for orders and reservations. These funds go directly to you."
          )}
        </p>
      </div>

      {/* Stripe Connect Integration Card */}
      <div className="bg-white border border-[#e2e8e4] p-8 rounded-3xl shadow-sm space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg">💳</span>
            <h3 className="font-display text-xl text-forest">
              {tt("Kredit- / Debitkarten (Stripe Connect)", "Credit / Debit Card (Stripe Connect)")}
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200 shrink-0">
              {tt("Empfohlen für Kartenzahlung", "Recommended for Cards")}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
            {tt(
              "Verbinden Sie Ihr Stripe-Konto, um Kartenzahlungen direkt von Ihren Kunden zu empfangen. Dies ist optional und hat keinen Einfluss auf Ihr Speisely-Abonnement.",
              "Connect your Stripe account to accept credit and debit card payments directly from your customers. This is optional and separate from your Speisely subscription."
            )}
          </p>
        </div>

        {isStripeConnected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-800 bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10 text-sm font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p>{tt("Stripe Connect ist verbunden. Kunden bezahlen direkt auf Ihr Konto.", 
                     "Stripe Connect is connected. Customers pay directly to your account.")}</p>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-4 pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {tt("Verbundenes Konto: ", "Connected Account: ")} <code className="font-mono bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-forest font-bold">{restaurant.stripe_user_id}</code>
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 rounded-full font-semibold transition" 
                disabled={loading} 
                onClick={handleDisconnectStripe}
              >
                {tt("Verbindung trennen", "Disconnect Account")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
                {tt("Klicken Sie auf den Button, um Stripe Connect einzurichten. Sie werden zu Stripe weitergeleitet, um Ihr Konto sicher zu verbinden.",
                   "Click to set up Stripe Connect. You will be redirected to Stripe to securely connect your free account.")}
              </p>
              <Button 
                className="bg-[#635BFF] hover:bg-[#635BFF]/90 text-white font-semibold flex items-center gap-2 rounded-full px-6 py-2.5 text-xs shadow-sm transition shrink-0" 
                disabled={loading} 
                onClick={handleConnectStripe}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M13.962 10.885c0-1.83-.984-2.817-2.9-2.817c-1.22 0-2.296.536-2.9 1.053l-.536-3.238c.677-.384 2.112-.767 3.743-.767c3.82 0 5.86 1.954 5.86 5.62c0 4.148-3.084 5.925-6.236 5.925c-1.39 0-2.482-.321-3.023-.62l.52-3.177c.609.309 1.57.575 2.65.575c1.884.001 2.923-1.077 2.923-2.556zM8.344 6.772v10.51H4.664V6.772h3.68zM19.336 6.772v10.51h-3.68V6.772h3.68z"/></svg>
                {tt("Mit Stripe verbinden", "Connect with Stripe")}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Alternative payment methods */}
      <div className="bg-white border border-[#e2e8e4] p-8 rounded-3xl shadow-sm space-y-6">
        <div className="flex flex-col gap-1.5 border-b border-[#e2e8e4] pb-4">
          <h3 className="font-display text-xl text-forest">{tt("Direkte Kunden-Zahlungsmethoden", "Direct Customer Payment Methods")}</h3>
          <p className="text-xs text-muted-foreground">{tt("Aktivieren Sie alternative Zahlungsmethoden wie Bargeld oder PayPal für Ihre Kunden.", "Enable storefront payment options like cash or PayPal for customer checkouts.")}</p>
        </div>

        <div className="grid gap-6">
          {/* Cash */}
          <div className="flex items-center justify-between border border-border/50 rounded-2xl p-4 bg-[#f8faf9]">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💵</span>
              <div>
                <p className="font-semibold text-forest">Cash (Barzahlung)</p>
                <p className="text-xs text-muted-foreground">{tt("Kunden zahlen vor Ort oder bei Lieferung bar.", "Customers pay in cash upon pickup or delivery.")}</p>
              </div>
            </div>
            <Switch id="accepts-cash" checked={acceptsCash} onCheckedChange={setAcceptsCash} />
          </div>

          {/* PayPal */}
          <div className="border border-border/50 rounded-2xl p-4 bg-[#f8faf9] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🅿️</span>
                <div>
                  <p className="font-semibold text-forest">PayPal</p>
                  <p className="text-xs text-muted-foreground">{tt("Kunden zahlen im Checkout direkt über Ihren PayPal.Me Link.", "Customers pay via your PayPal.Me link at checkout.")}</p>
                </div>
              </div>
              <Switch id="accepts-paypal" checked={acceptsPaypal} onCheckedChange={setAcceptsPaypal} />
            </div>
            {acceptsPaypal && (
              <div className="space-y-3 pt-3 border-t border-border/50">
                <Label className="text-xs font-semibold text-forest">{tt("Ihr PayPal.Me Link oder PayPal-E-Mail", "Your PayPal.Me Link or PayPal Email")}</Label>
                <div className="flex gap-2">
                  <Input 
                    value={paypalEmail} 
                    onChange={e => setPaypalEmail(e.target.value)} 
                    placeholder="paypal.me/ihrname  oder  email@domain.com"
                    className="flex-1 bg-white"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0 border-blue-400 text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-semibold"
                    onClick={() => window.open("https://www.paypal.com/paypalme/my/profile", "_blank")}
                  >
                    PayPal.me erstellen →
                  </Button>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-500/5 px-3 py-2 rounded-lg border border-emerald-500/10">
                  <span>🔒</span>
                  <p>
                    {tt(
                      "Sicherheits-Hinweis: Wir fragen niemals nach Ihren PayPal-Passwörtern oder sensiblen Anmeldedaten und speichern diese auch nicht. Es wird nur Ihr öffentlicher PayPal.Me Link/E-Mail gespeichert.",
                      "Security Note: We never ask for or store your PayPal passwords or sensitive login credentials. Only your public PayPal.Me link/email is stored."
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-[#e2e8e4] flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="bg-forest hover:bg-forest/90 text-white rounded-full px-6 py-2 shadow-sm font-semibold transition cursor-pointer">
            {saving ? tt("Wird gespeichert...", "Saving...") : tt("Zahlungsmethoden speichern", "Save Payment Methods")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SettingsReservationsSection({ restaurant }: { restaurant: any }) {
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
  const qc = useQueryClient();
  const upsert = useServerFn(updateMyRestaurantSettings);

  const [seatCapacity, setSeatCapacity] = useState(restaurant.seat_capacity?.toString() || "30");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await upsert({
          name: restaurant.name,
          seat_capacity: parseInt(seatCapacity) || 30,
        });
      alert(tt("Reservierungseinstellungen gespeichert!", "Reservation settings saved successfully!"));
      qc.invalidateQueries({ queryKey: ["restaurant"] });
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white border border-[#e2e8e4] p-8 rounded-3xl shadow-sm space-y-6">
      <div className="flex flex-col gap-1.5 border-b border-[#e2e8e4] pb-4">
        <h3 className="font-display text-xl text-forest">{tt("Reservierungs-Einstellungen", "Reservation Settings")}</h3>
        <p className="text-xs text-muted-foreground">{tt("Legen Sie Ihre maximale Tisch- und Sitzplatzkapazität pro Zeitfenster fest.", "Configure slot-based seat capacities and limits for table bookings.")}</p>
      </div>

      <div className="space-y-4 max-w-md">
        <div className="space-y-1.5">
          <Label htmlFor="seat-capacity">{tt("Maximale Sitzplatzkapazität pro Slot", "Maximum Seat Capacity per Slot")}</Label>
          <Input 
            id="seat-capacity"
            type="number" 
            min="1" 
            value={seatCapacity} 
            onChange={e => setSeatCapacity(e.target.value)} 
          />
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {tt(
            "Reservierungen werden bis zu dieser Sitzplatzanzahl pro Zeitslot automatisch vom System bestätigt. Danach werden Buchungsanfragen auf die Warteliste gesetzt.",
            "Bookings will be automatically confirmed up to this limit per time slot. Subsequent requests will require manual approval."
          )}
        </p>
      </div>

      <div className="pt-4 border-t border-[#e2e8e4] flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="bg-forest hover:bg-forest/90 text-white rounded-full px-6 py-2 shadow-sm font-semibold transition cursor-pointer">
          {saving ? tt("Wird gespeichert...", "Saving...") : tt("Reservierungen speichern", "Save Reservation Settings")}
        </Button>
      </div>
    </div>
  );
}

function SettingsShell({ activeSubtab, restaurant }: { activeSubtab: string; restaurant: any }) {
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);

  const isGeneralPending = !restaurant.logo_path || !restaurant.phone || !restaurant.description || !restaurant.address;
  const isStorefrontPending = !restaurant.is_published;
  const isPaymentsPending = !restaurant.accepts_cash && !restaurant.accepts_paypal && restaurant.stripe_connect_status !== "connected";
  const isBillingPending = restaurant.subscription_status !== "active";

  const subtabs = [
    { 
      id: "settings-general", 
      label: tt("Allgemein", "General"),
      pending: isGeneralPending,
      tooltip: tt("Profilinformationen vervollständigen (Logo, Telefon, Beschreibung, Adresse)", "Complete profile information (Logo, Phone, Description, Address)")
    },
    { 
      id: "settings-storefront", 
      label: tt("Storefront", "Storefront"),
      pending: isStorefrontPending,
      tooltip: tt("Storefront veröffentlichen", "Publish storefront")
    },
    { 
      id: "settings-operations", 
      label: tt("Betriebszeiten", "Operations"),
      pending: false,
      tooltip: tt("Betriebszeiten verwalten", "Manage operating hours")
    },
    { 
      id: "settings-payments", 
      label: tt("Zahlungen", "Payments"),
      pending: isPaymentsPending,
      tooltip: tt("Mindestens eine Zahlungsmethode einrichten", "Set up at least one payment method")
    },
    { 
      id: "settings-reservations", 
      label: tt("Reservierungen", "Reservations"),
      pending: false,
      tooltip: tt("Reservierungs-Einstellungen verwalten", "Manage reservation settings")
    },
    { 
      id: "settings-billing", 
      label: tt("Abonnement", "Billing"),
      pending: isBillingPending,
      tooltip: tt("Starter-Paket aktivieren", "Activate Starter Plan")
    },
  ];

  return (
    <div className="space-y-6">
      {/* Settings Guide Banner */}
      <div className="bg-cream/40 border border-brand-orange/10 rounded-2xl p-4 flex items-center gap-3">
        <span className="text-xl">⚙️</span>
        <div className="text-xs text-forest/80 leading-relaxed">
          {tt(
            "Bitte gehen Sie alle Einstellungsseiten durch. Vervollständigen Sie die ausstehenden Bereiche (gekennzeichnet mit einem pulsierenden orangefarbenen Punkt), um Ihr Storefront betriebsbereit zu machen.",
            "Please go through all settings pages. Complete the pending sections (marked with a pulsing orange dot) to get your storefront fully operational."
          )}
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="border-b border-[#e2e8e4] pb-px">
        <nav className="flex flex-wrap gap-6 -mb-px">
          {subtabs.map((tab) => {
            const isActive = activeSubtab === tab.id;
            return (
              <Link
                key={tab.id}
                to="."
                search={{ tab: tab.id }}
                className={`pb-4 text-sm font-medium transition-all border-b-2 relative flex items-center gap-2 ${
                  isActive
                    ? "border-forest text-forest font-semibold"
                    : "border-transparent text-muted-foreground hover:text-forest"
                }`}
                title={tab.tooltip}
              >
                <span>{tab.label}</span>
                {tab.pending ? (
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                ) : (
                  <span className="text-[10px] text-emerald-600 font-bold shrink-0">✓</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Subtab Content */}
      <div className="pt-2">
        {activeSubtab === "settings-general" && <SettingsGeneralSection restaurant={restaurant} />}
        {activeSubtab === "settings-storefront" && <SettingsStorefrontSection restaurant={restaurant} />}
        {activeSubtab === "settings-operations" && <SettingsOperationsSection restaurant={restaurant} />}
        {activeSubtab === "settings-payments" && <SettingsPaymentsSection restaurant={restaurant} />}
        {activeSubtab === "settings-reservations" && <SettingsReservationsSection restaurant={restaurant} />}
        {activeSubtab === "settings-billing" && <BillingSection />}
      </div>
    </div>
  );
}


function PromotionsSection({ vertical }: { vertical: "restaurants" | "caterers" | "planners" }) {
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
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
      alert(tt("Rabattcode erfolgreich erstellt!", "Promo code created successfully!"));
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
      alert(tt("Umschalten fehlgeschlagen: ", "Failed to toggle: ") + e.message);
    }
  };



  const codes = q.data || [];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl">{tt("Rabattcodes & Aktionen", "Promotions & Vouchers")}</h2>
        <p className="text-sm text-muted-foreground">{tt("Erstellen Sie Rabattcodes und zeigen Sie diese in Ihrem Storefront-Banner an.", "Generate discount codes and sync them to your storefront banner.")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">{tt("Aktive Codes", "Active Codes")}</h3>
          {codes.length === 0 ? (
            <div className="surface-card p-8 text-center border border-dashed border-border text-muted-foreground">
              {tt("Sie haben noch keine Rabattcodes erstellt.", "You haven't created any promo codes yet.")}
            </div>
          ) : (
            <div className="grid gap-3">
              {codes.map((c: any) => (
                <div key={c.id} className={`surface-card p-4 flex items-center justify-between border ${c.is_active ? 'border-brand-orange/50' : 'border-border opacity-60'}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold font-mono text-lg">{c.code}</h4>
                      {!c.is_active && <span className="text-[10px] uppercase bg-muted px-2 py-0.5 rounded-full font-semibold">{tt("Inaktiv", "Inactive")}</span>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {c.discount_type === "percentage" 
                        ? (lang === "de" ? `${c.discount_value}% Rabatt auf Gesamtsumme` : `${c.discount_value}% off total`)
                        : (lang === "de" ? `€${c.discount_value.toFixed(2)} Rabatt auf Gesamtsumme` : `€${c.discount_value.toFixed(2)} off total`)
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`toggle-${c.id}`} className="text-xs">{c.is_active ? tt("Aktiv", "Active") : tt("Deaktiviert", "Disabled")}</Label>
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
          <h3 className="font-display text-lg">{tt("Neuen Code erstellen", "Create new code")}</h3>
          <div className="space-y-1.5">
            <Label>{tt("Code", "Code")}</Label>
            <Input value={code} onChange={e => setCode(e.target.value.toUpperCase().replace(/\s/g, ""))} placeholder="e.g. SUMMER20" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{tt("Typ", "Type")}</Label>
              <Select value={type} onValueChange={(v: any) => setType(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">{tt("Prozent (%)", "Percent (%)")}</SelectItem>
                  <SelectItem value="fixed">{tt("Festbetrag (€)", "Fixed (€)")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{tt("Wert", "Value")}</Label>
              <Input type="number" min="0" step={type === "percentage" ? "1" : "0.5"} value={value} onChange={e => setValue(e.target.value)} placeholder={type === "percentage" ? "10" : "5.00"} required />
            </div>
          </div>
          <div className="pt-2 pb-1 border-t border-border mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="promote" className="flex-1 cursor-pointer">{tt("Auf Storefront-Banner bewerben", "Promote on Storefront Banner")}</Label>
              <Switch id="promote" checked={promote} onCheckedChange={setPromote} />
            </div>
            {promote && (
              <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                {tt("Dadurch wird Ihr Ankündigungsbanner im Storefront automatisch aktualisiert und aktiviert, um diesen Code anzuzeigen.", "This will automatically update and turn on your public announcement banner to display this code.")}
              </p>
            )}
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <Button type="submit" className="w-full" disabled={creating || !code || !value}>
            {creating ? tt("Wird erstellt...", "Creating...") : tt("Code erstellen", "Create Code")}
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
      updateStatus(vars),
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
                    {r.first_name} {r.last_name} â€” {r.guest_count} Guests
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
  const startSubscription = useServerFn(startStarterSubscription);
  const getPortalUrl = useServerFn(openBillingPortal);

  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleStartSubscription = async () => {
    setShowTerms(false);
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
    <section className="space-y-8">
      <div className="flex flex-col gap-1.5">
        <h2 className="font-display text-2xl text-forest">{tt("Abonnement & Abrechnung", "Subscription & Billing")}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {tt("Verwalte dein Speisely-Händlerkonto und Abonnement.", 
             "Manage your Speisely marketplace subscription and billing settings.")}
        </p>
      </div>



      {/* SPEISELY SUBSCRIPTION SECTION */}
      <div className="bg-white border border-[#e2e8e4] p-8 rounded-3xl shadow-sm space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">🚀</span>
            <h3 className="font-display text-xl text-forest">
              {tt("Speisely-Abonnement", "Speisely Subscription")}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {tt("Verwalte das monatliche Abonnement für dein Speisely-Händlerkonto. Diese Gebühr fließt direkt an das Speisely-Plattformkonto.", 
               "Manage the monthly subscription for your Speisely merchant account. This fee goes directly to the Speisely platform.")}
          </p>
        </div>

        <div className="space-y-6">
          {/* Lapsed states / Active State Banners */}
          {subStatus === "past_due" && (
            <div className="bg-amber-500/5 text-amber-800 dark:text-amber-200 border border-amber-500/10 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-bold text-sm">⚠️ {tt("Zahlung ausstehend", "Payment Pending")}</p>
                <p className="text-xs mt-1">
                  {tt("Die letzte Abonnement-Zahlung ist fehlgeschlagen. Bitte aktualisieren Sie Ihre Rechnungsdaten.", 
                     "Your last subscription payment failed. Please update your billing details.")}
                </p>
              </div>
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-4 shadow-sm" onClick={handleOpenPortal} disabled={loading}>
                {tt("Abrechnung aktualisieren", "Update Billing")}
              </Button>
            </div>
          )}

          {subStatus === "canceled" && (
            <div className="bg-rose-500/5 text-rose-800 dark:text-rose-200 border border-rose-500/10 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-bold text-sm">🛑 {tt("Abonnement beendet", "Subscription Canceled")}</p>
                <p className="text-xs mt-1">
                  {tt("Ihr Starter-Tarif wurde gekündigt. Ihr Storefront ist derzeit pausiert.", 
                     "Your Starter Plan has been canceled. Your storefront is currently paused.")}
                </p>
              </div>
              <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-4 shadow-sm" onClick={() => setShowTerms(true)} disabled={loading}>
                {tt("Tarif reaktivieren", "Reactivate Plan")}
              </Button>
            </div>
          )}

          {/* Plan Display Cards */}
          <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
            <div className="space-y-4">
              <div className={`bg-white border ${isSubActive ? 'border-forest/20 shadow-md ring-1 ring-forest/5' : 'border-[#e2e8e4]'} p-6 rounded-2xl shadow-sm transition-all duration-300`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full ${isSubActive ? 'bg-forest/10 text-forest' : 'bg-stone-100 text-muted-foreground'}`}>
                      {tt("Speisely Tarif", "Speisely Plan")}
                    </span>
                    <h3 className="mt-3 font-display text-2xl text-forest">
                      {planName === "starter" ? tt("Starter-Paket (€34.99/Monat)", "Starter Plan (€34.99/month)") : planName}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${isSubActive ? 'text-emerald-700 bg-emerald-500/10 border border-emerald-500/20' : 'text-stone-500 bg-stone-100'}`}>
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
                      <p className="text-muted-foreground font-medium">{tt("Nächstes Rechnungsdatum", "Next Invoice Date")}</p>
                      <p className="font-semibold text-forest mt-0.5">{nextPaymentDate.toLocaleDateString(lang === "de" ? "de-DE" : "en-US")}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Plan Activation step if no subscription yet */}
              {!isSubActive && subStatus !== "past_due" && subStatus !== "canceled" && (
                <div className="bg-[#f8faf9] p-6 rounded-2xl border border-dashed border-[#e2e8e4] flex flex-col items-center text-center space-y-4">
                  <p className="text-sm font-semibold text-forest">
                    {tt("Abonniere das Restaurant Starter-Paket", "Subscribe to the Restaurant Starter Plan")}
                  </p>
                  <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                    {tt("Für nur €34.99/Monat erhalten Sie ein unbegrenztes Storefront mit 0% Bestellprovision und Anbindung an Ihre eigenen Storefront-Zahlungsmethoden.", 
                       "For just €34.99/month, unlock your unlimited storefront with 0% order commission and connection to your preferred customer payment methods.")}
                  </p>
                  <Button className="w-full bg-forest hover:bg-forest/90 text-cream font-semibold rounded-full py-2.5 shadow-sm transition" onClick={() => setShowTerms(true)} disabled={loading}>
                    {tt("Plan abonnieren", "Subscribe to Plan")}
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Plan Features Checklist */}
              <div className="bg-white border border-[#e2e8e4] p-6 rounded-2xl shadow-sm space-y-4">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-forest/70">{tt("Enthaltene Leistungen", "Plan Features")}</h4>
                <ul className="space-y-3 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{tt("0% Bestellprovision", "0% order commission")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{tt("Tischreservierungen inklusive", "Table reservations included")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{tt("Eigene gehostete Storefront-URL", "Hosted storefront URL")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{tt("Custom Domain Support", "Custom domain support")}</span>
                  </li>
                </ul>
              </div>

              {/* Manage billing button when active or past_due */}
              {(isSubActive || subStatus === "past_due") && (
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <Button variant="outline" className="text-forest hover:bg-forest/5 rounded-full" onClick={handleOpenPortal} disabled={loading}>
                    {tt("Rechnungen & Portal ansehen", "Manage Billing & Invoices")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SubscriptionTermsModal 
        isOpen={showTerms} 
        onClose={() => setShowTerms(false)} 
        onConfirm={handleStartSubscription} 
        isLoading={loading} 
      />
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

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const rawTab = searchParams.get("tab") || (location.hash || "#overview").replace("#", "");
  
  // Normalize settings tabs
  let currentTab = rawTab;
  if (currentTab === "profile" || currentTab === "settings") {
    currentTab = "settings-general";
  } else if (currentTab === "billing") {
    currentTab = "settings-billing";
  } else if (["general", "storefront", "operations", "payments", "reservations"].includes(currentTab)) {
    currentTab = `settings-${currentTab}`;
  }

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
      {currentTab === "overview" && <OverviewSection />}
      {currentTab === "orders" && <OrdersSection />}
      {currentTab === "reservations" && <ReservationsSection />}
      {currentTab === "menu" && <ProductsSection />}
      {currentTab === "promotions" && <PromotionsSection vertical="restaurants" />}
      {currentTab.startsWith("settings-") && (
        <SettingsShell activeSubtab={currentTab} restaurant={q.data.restaurant} />
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
