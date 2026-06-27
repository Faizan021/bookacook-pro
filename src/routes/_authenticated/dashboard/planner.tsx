import { createFileRoute, Link, useRouter, useLocation, redirect, isRedirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import React, { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  getMyPlannerServices,
  createMyPlanner,
  upsertPlannerService,
  deletePlannerService,
  getPlannerKPIs,
  updateMyPlannerSettings,
  getPlannerRequests,
  updatePlannerRequestStatus
} from "@/lib/planner/mutations.functions";
import { getMyPromoCodes } from "@/lib/promotions/queries.functions";
import { createPromoCode, togglePromoCode } from "@/lib/promotions/mutations.functions";
import { useSpeiselyPing } from "@/lib/vendor/useSpeiselyPing";
import { MilestoneTimeline } from "@/components/vendor/MilestoneTimeline";
import { BlackoutCalendarSection } from "@/components/vendor/BlackoutCalendarSection";
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
import { Switch } from "@/components/ui/switch";
import { VendorLayout, DashboardSkeleton } from "@/components/vendor/VendorLayout";
import { CustomDomainSection } from "@/components/vendor/CustomDomainSection";
import { useI18n } from "@/i18n/I18nProvider";
import { printEventBrief } from "@/utils/printEventBrief";
import { PrintOnboardingBanner } from "@/components/vendor/PrintOnboardingBanner";

import { getUserProfile } from "@/lib/auth/get-user-profile.functions";

export const Route = createFileRoute("/_authenticated/dashboard/planner")({
  ssr: false,
  beforeLoad: async () => {
    try {
      const profile = await getUserProfile();
      if (!profile.roles.includes("planner")) {
        const otherRole = profile.roles.find(r => r !== "customer");
        const roleName = otherRole === "restaurant_owner" ? "Restaurant Owner" : otherRole === "caterer" ? "Caterer" : "Customer";
        
        throw redirect({
          to: "/auth",
          search: { 
            message: `This account is registered as a ${roleName}. Please sign in with a Planner account.`,
            logout: "true",
          },
        });
      }
    } catch (err) {
      if (isRedirect(err)) {
        throw err;
      }
      console.error("beforeLoad error on planner dashboard:", err);
      throw redirect({
        to: "/auth",
        search: { 
          message: "Session expired or unauthorized. Please sign in again.",
          logout: "true",
        },
      });
    }
  },
  head: () => ({ meta: [{ title: "Planner Dashboard — Speisely" }] }),
  component: PlannerDashboard,
});

// Shell removed in favor of VendorLayout
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
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-mint text-forest text-2xl shadow-sm">
        ✨
      </div>
      <h3 className="font-display text-xl">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}

function CreatePlannerForm() {
  const create = useServerFn(createMyPlanner);
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const mut = useMutation({
    mutationFn: (vars: { name: string; slug: string; custom_domain: string }) => create({ data: vars }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["planner"] }),
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
        <Label htmlFor="pname">Planner brand</Label>
        <Input id="pname" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="pslug">URL slug</Label>
        <Input
          id="pslug"
          value={slug}
          onChange={(e) => {
            const v = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
            setSlug(v);
            if (!subdomain || subdomain === slug) {
              setSubdomain(v);
            }
          }}
          placeholder="atelier-lumen"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="psubdomain">Speisely Domain (Mandatory)</Label>
        <div className="flex items-center gap-2">
          <Input
            id="psubdomain"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            placeholder="atelier-lumen"
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

function ServiceForm({
  plannerId,
  editing,
  onDone,
}: {
  plannerId: string;
  editing: any | null;
  onDone: () => void;
}) {
  const upsert = useServerFn(upsertPlannerService);
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(editing?.title ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [price, setPrice] = useState(
    editing ? (editing.starting_price_cents / 100).toString() : "",
  );
  const [imagePath, setImagePath] = useState<string | null>(editing?.image_url ?? null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    editing?.image_signed_url ?? null,
  );
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const mut = useMutation({
    mutationFn: (vars: any) => upsert({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["planner", "services"] });
      onDone();
    },
    onError: (e: any) => setErr(e.message ?? "Failed"),
  });

  async function handleFile(file: File) {
    setErr(null);
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${plannerId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("planner-services")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data: signed } = await supabase.storage
        .from("planner-services")
        .createSignedUrl(path, 60 * 60);
      setImagePath(path);
      setImagePreview(signed?.signedUrl ?? null);
    } catch (e: any) {
      setErr(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      className="surface-card h-fit space-y-3 p-5"
      onSubmit={(e) => {
        e.preventDefault();
        const cents = Math.round(parseFloat(price || "0") * 100);
        if (!title) return;
        mut.mutate({
          id: editing?.id,
          title,
          description,
          starting_price_cents: cents,
          image_url: imagePath,
        });
      }}
    >
      <h3 className="font-display text-lg">
        {editing ? "Edit service" : "Add service package"}
      </h3>
      <div className="space-y-1.5">
        <Label htmlFor="stitle">Title</Label>
        <Input id="stitle" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="sdesc">Description</Label>
        <Textarea
          id="sdesc"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="sprice">Starting from (EUR)</Label>
        <Input
          id="sprice"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label>Image</Label>
        {imagePreview && (
          <img
            src={imagePreview}
            alt=""
            className="h-28 w-full rounded-lg object-cover shadow-sm"
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
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? "Uploading…" : imagePreview ? "Replace image" : "Upload image"}
        </Button>
      </div>
      {err && <p className="text-sm text-destructive">{err}</p>}
      <div className="flex gap-2">
        <Button type="submit" className="flex-1" disabled={mut.isPending || uploading}>
          {mut.isPending ? "Saving…" : editing ? "Save changes" : "Create service"}
        </Button>
        {editing && (
          <Button type="button" variant="outline" onClick={onDone}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

function OverviewSection() {
  const fetchKPIs = useServerFn(getPlannerKPIs);
  const q = useSuspenseQuery({
    queryKey: ["planner", "kpis"],
    queryFn: () => fetchKPIs(),
  });
  const qc = useQueryClient();

  if (q.error) return <div className="surface-card p-8 text-center text-destructive font-medium">Could not load overview details: {(q.error as any).message ?? "Unknown error"}</div>;
  if (!q.data) return <div className="surface-card p-8 text-center text-muted-foreground">No overview details available.</div>;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">Overview</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="surface-card p-5 space-y-1 bg-white dark:bg-zinc-900 border border-border/50 shadow-sm">
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-2"><span className="text-brand-orange">📈</span> Revenue (Completed)</p>
          <p className="text-3xl font-bold font-display text-forest">€{(q.data.revenueCents / 100).toFixed(2)}</p>
        </div>
        <div className="surface-card p-5 space-y-1 bg-white dark:bg-zinc-900 border border-border/50 shadow-sm">
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-2"><span className="text-brand-orange">📅</span> Completed Events</p>
          <p className="text-3xl font-bold font-display">{q.data.totalOrders}</p>
        </div>
        <div className="surface-card p-5 space-y-1 bg-white dark:bg-zinc-900 border border-border/50 shadow-sm">
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-2"><span className="text-brand-orange">⏱️</span> Active Requests</p>
          <p className="text-3xl font-bold font-display text-brand-orange">{q.data.pendingOrders}</p>
        </div>
        <div className="surface-card p-5 space-y-1 bg-white dark:bg-zinc-900 border border-border/50 shadow-sm">
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-2"><span className="text-brand-orange">💶</span> Avg Event Budget</p>
          <p className="text-3xl font-bold font-display">€{(q.data.averageOrderCents / 100).toFixed(2)}</p>
        </div>
        <div className="surface-card p-5 space-y-1 bg-white dark:bg-zinc-900 border border-border/50 shadow-sm">
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-2"><span className="text-brand-orange">⭐</span> Popular Package</p>
          <p className="text-xl font-bold font-display truncate pt-2" title={q.data.popularDish}>{q.data.popularDish}</p>
        </div>
        <div className="surface-card p-5 space-y-1 bg-white dark:bg-zinc-900 border border-border/50 shadow-sm">
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-2"><span className="text-brand-orange">🔄</span> Retention Rate</p>
          <p className="text-3xl font-bold font-display text-emerald-600">{q.data.customerRetentionRate}%</p>
        </div>
        <div className="surface-card p-5 space-y-1 bg-white dark:bg-zinc-900 border border-border/50 shadow-sm">
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-2"><span className="text-brand-orange">👀</span> Profile Views</p>
          <p className="text-3xl font-bold font-display text-sky-600">{q.data.profileViews || 0}</p>
        </div>
        <div className="surface-card p-5 space-y-1 bg-white dark:bg-zinc-900 border border-border/50 shadow-sm">
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-2"><span className="text-brand-orange">📉</span> Conversion</p>
          <p className="text-3xl font-bold font-display text-sky-600">{q.data.conversionRate}%</p>
        </div>
        <div className="surface-card p-5 space-y-1 bg-white dark:bg-zinc-900 border border-border/50 shadow-sm">
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-2"><span className="text-brand-orange">❌</span> Cancelled</p>
          <p className="text-3xl font-bold font-display text-rose-600">{q.data.cancelledOrders}</p>
        </div>
      </div>
      {q.data.pendingOrders > 0 && (
        <div className="rounded-lg bg-brand-orange/10 border border-brand-orange/20 p-4">
          <p className="text-brand-orange font-medium">You have {q.data.pendingOrders} pending requests that require attention.</p>
        </div>
      )}
    </section>
  );
}

function BusinessProfileSection() {
  const qc = useQueryClient();
  const fetchServices = useServerFn(getMyPlannerServices);
  const q = useSuspenseQuery({ 
    queryKey: ["planner", "services"],
    queryFn: () => fetchServices()
  });
  const upsert = useServerFn(updateMyPlannerSettings);
  
  const planner = q.data?.planner;
  
  const [name, setName] = useState(planner?.name || "");
  const [desc, setDesc] = useState(planner?.description || "");
  const [phone, setPhone] = useState(planner?.phone || "");
  const [address, setAddress] = useState(planner?.business_address || "");
  const [logoPreview, setLogoPreview] = useState(planner?.logo_url || null);
  const [bannerPreview, setBannerPreview] = useState(planner?.banner_image_url || null);
  const [logoPath, setLogoPath] = useState(planner?.logo_url || null);
  const [bannerPath, setBannerPath] = useState(planner?.banner_image_url || null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serviceAreas, setServiceAreas] = useState((planner as any).service_areas || "");

  const logoRef = React.useRef<HTMLInputElement>(null);
  const bannerRef = React.useRef<HTMLInputElement>(null);

  if (!planner) return null;

  async function handleImage(file: File, type: "logo" | "banner") {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${planner!.id}/${type}-${crypto.randomUUID()}.${ext}`;
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
        data: {
          name,
          description: desc,
          phone,
          business_address: address,
          logo_url: logoPath,
          banner_image_url: bannerPath,
          service_areas: serviceAreas
        }
      });
      alert("Settings saved successfully!");
      qc.invalidateQueries({ queryKey: ["planner"] });
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
        <p className="text-sm text-muted-foreground">Manage your storefront presence, business details, and event service operations.</p>
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
            <Label>Planner Brand</Label>
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
        </div>

        <div className="space-y-4 pt-4 border-t border-border mt-4">
          <h3 className="font-semibold text-lg">Banking Details</h3>
          <p className="text-sm text-muted-foreground">Coming soon...</p>
        </div>

        <Button onClick={handleSave} disabled={uploading || saving} className="w-full">
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </section>
  );
}

function ServiceManagerSection({ planner, services }: { planner: any, services: any[] }) {
  const remove = useServerFn(deletePlannerService);
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const delMut = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["planner", "services"] }),
  });

  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-2xl">Service Manager</h2>
        <span className="text-sm text-muted-foreground">
          {services.length} package{services.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {services.length === 0 ? (
            <EmptyCard
              title="No service packages yet"
              description="Create your first service package using the form on the right."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((s: any) => (
                <article key={s.id} className="surface-card overflow-hidden">
                  {s.image_signed_url ? (
                    <img
                      src={s.image_signed_url}
                      alt=""
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center bg-mint/40 text-3xl">
                      ✨
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-display text-lg">{s.title}</h3>
                    {s.description && (
                      <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                        {s.description}
                      </p>
                    )}
                    <p className="mt-3 text-sm">
                      <span className="text-muted-foreground">Starting from </span>
                      <span className="font-display text-lg">
                        €{(s.starting_price_cents / 100).toFixed(2)}
                      </span>
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditing(s)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={delMut.isPending}
                        onClick={() => delMut.mutate(s.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
        <ServiceForm
          key={editing?.id ?? "new"}
          plannerId={planner.id}
          editing={editing}
          onDone={() => setEditing(null)}
        />
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

function LogisticsSection() {
  const qc = useQueryClient();
  const fetchServices = useServerFn(getMyPlannerServices);
  const q = useSuspenseQuery({ 
    queryKey: ["planner", "services"],
    queryFn: () => fetchServices()
  });
  const upsert = useServerFn(updateMyPlannerSettings);
  
  const planner = q.data?.planner;
  
  const [serviceAreas, setServiceAreas] = useState((planner as any)?.service_areas || "");
  const [deliveryFee, setDeliveryFee] = useState(((planner as any)?.delivery_fee_cents || 0) / 100);
  const [minDelivery, setMinDelivery] = useState(((planner as any)?.min_delivery_cents || 0) / 100);
  const [maxDistance, setMaxDistance] = useState((planner as any)?.max_delivery_distance_km || 0);
  const [saving, setSaving] = useState(false);

  if (!planner) return null;

  async function handleSave() {
    setSaving(true);
    try {
      await upsert({
        data: {
          name: planner!.name, // Required by schema
          service_areas: serviceAreas,
          delivery_fee_cents: Math.round(deliveryFee * 100),
          min_delivery_cents: Math.round(minDelivery * 100),
          max_delivery_distance_km: maxDistance
        }
      });
      alert("Logistics settings saved successfully!");
      qc.invalidateQueries({ queryKey: ["planner"] });
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl">Logistics & Delivery</h2>
        <p className="text-sm text-muted-foreground">Manage where you operate, travel fees, and minimum requirements.</p>
      </div>
      <div className="surface-card p-6 space-y-8 max-w-3xl">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2"><span className="text-brand-orange">📍</span> Service Areas / Postal Codes</h3>
          <p className="text-sm text-muted-foreground">
            Enter a comma-separated list of postal codes (e.g., 10115, 10117, 10119, 10435). This ensures customers only see your event planning services if you operate in their area.
          </p>
          <Input 
            value={serviceAreas} 
            onChange={e => setServiceAreas(e.target.value)} 
            placeholder="e.g. 10115, 10117, 10119, 10435"
            className="text-lg py-6"
          />
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="font-semibold text-lg flex items-center gap-2"><span className="text-brand-orange">🚚</span> Travel Rules</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Base Travel Fee (€)</Label>
              <Input 
                type="number" 
                min="0" 
                step="1"
                value={deliveryFee || ""} 
                onChange={e => setDeliveryFee(parseFloat(e.target.value) || 0)} 
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">Fee added to the quote for travel.</p>
            </div>
            <div className="space-y-2">
              <Label>Minimum Booking Value (€)</Label>
              <Input 
                type="number" 
                min="0" 
                step="1"
                value={minDelivery || ""} 
                onChange={e => setMinDelivery(parseFloat(e.target.value) || 0)} 
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">Minimum subtotal required to accept a request.</p>
            </div>
            <div className="space-y-2">
              <Label>Max Travel Distance (km)</Label>
              <Input 
                type="number" 
                min="0" 
                step="1"
                value={maxDistance || ""} 
                onChange={e => setMaxDistance(parseFloat(e.target.value) || 0)} 
                placeholder="20"
              />
              <p className="text-xs text-muted-foreground">Maximum radius you are willing to travel.</p>
            </div>
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full mt-4">
          {saving ? "Saving..." : "Save Logistics"}
        </Button>
      </div>
    </section>
  );
}

const BRIEF_STATUSES = [
  "draft",
  "needs_more_info",
  "ready_for_matching",
  "matched",
  "quote_requested",
  "quoted",
  "booked",
  "cancelled",
] as const;

function RequestsSection() {
  const { t } = useI18n();
  const fetchRequests = useServerFn(getPlannerRequests);
  const updateStatus = useServerFn(updatePlannerRequestStatus);
  const qc = useQueryClient();
  const q = useSuspenseQuery({
    queryKey: ["planner", "requests"],
    queryFn: () => fetchRequests(),
  });
  const mut = useMutation({
    mutationFn: (vars: { requestId: string; status: string }) =>
      updateStatus({ data: vars }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["planner", "requests"] }),
  });


  if (!q.data?.planner) return null;
  if (q.data.requests.length === 0) return (
    <div className="space-y-6">
      <PrintOnboardingBanner type="a4" brandName={q.data.planner.name} />
      <EmptyCard
        title={t("No requests yet", "Noch keine Anfragen")}
        description={t(
          `When a customer submits a request to ${q.data.planner.name}, it will appear here.`,
          `Sobald ein Kunde eine Anfrage an ${q.data.planner.name} sendet, erscheint sie hier.`
        )}
      >
        <div className="flex flex-col items-center justify-center gap-3 mt-4">
          <Button
            variant="outline"
            onClick={() => {
              const mockBrief = {
                id: "test-request-12345",
                created_at: new Date().toISOString(),
                event_type: t("Corporate Gala", "Firmen-Gala"),
                guest_count: 150,
                event_date: new Date(Date.now() + 86400000 * 60).toISOString(),
                location: "Grand Ballroom, Palace Hotel",
                budget_cents: 1200000,
                notes: t("Full event coordination including stage design and audio-visual setups.", "Komplette Event-Koordination inklusive Bühnengestaltung und Medientechnik."),
                status: "quote_requested",
                is_b2b: true,
                company_name: "Innovate AG",
                milestones: [
                  { title: t("Inquiry Received", "Anfrage erhalten"), status: "received", created_at: new Date().toISOString() },
                  { title: t("Consultation Scheduled", "Erstgespräch vereinbart"), status: "scheduled", created_at: new Date().toISOString() }
                ]
              };
              printEventBrief(mockBrief, q.data.planner.name, "planner");
            }}
            className="rounded-full gap-2 border-forest/20 text-forest hover:bg-cream"
          >
            🖨️ {t("Print Test Brief", "Test-Brief drucken")}
          </Button>
          <p className="text-xs text-muted-foreground max-w-sm">
            {t(
              "Use this to test your A4 page styling or export event summaries to PDF.",
              "Nutze dies, um dein A4-Seitenlayout zu testen oder Eventzettel als PDF zu exportieren."
            )}
          </p>
        </div>
      </EmptyCard>
    </div>
  );

  return (
    <>
      <PrintOnboardingBanner type="a4" brandName={q.data.planner.name} />
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl">{t("Requests", "Anfragen")}</h2>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const mockBrief = {
                  id: "test-request-12345",
                  created_at: new Date().toISOString(),
                  event_type: t("Corporate Gala", "Firmen-Gala"),
                  guest_count: 150,
                  event_date: new Date(Date.now() + 86400000 * 60).toISOString(),
                  location: "Grand Ballroom, Palace Hotel",
                  budget_cents: 1200000,
                  notes: t("Full event coordination including stage design and audio-visual setups.", "Komplette Event-Koordination inklusive Bühnengestaltung und Medientechnik."),
                  status: "quote_requested",
                  is_b2b: true,
                  company_name: "Innovate AG",
                  milestones: [
                    { title: t("Inquiry Received", "Anfrage erhalten"), status: "received", created_at: new Date().toISOString() },
                    { title: t("Consultation Scheduled", "Erstgespräch vereinbart"), status: "scheduled", created_at: new Date().toISOString() }
                  ]
                };
                printEventBrief(mockBrief, q.data.planner.name, "planner");
              }}
              className="h-8 rounded-full text-xs gap-1.5 border-forest/20 text-forest hover:bg-cream"
            >
              🖨️ {t("Test Print", "Test-Druck")}
            </Button>
            <span className="text-sm text-muted-foreground">
              {q.data.requests.length} {t("total", "gesamt")}
            </span>
          </div>
        </div>
        <div className="grid gap-4">
          {q.data.requests.map((b: any) => (
            <article key={b.id} className="surface-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="inline-block rounded-full px-3 py-1 text-xs font-medium capitalize bg-stone-200 text-stone-800">
                      {b.status.replace(/_/g, " ")}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => printEventBrief(b, q.data.planner.name, "planner")}
                      className="h-7 rounded-full text-xs gap-1 border-forest/20 text-forest hover:bg-cream shrink-0"
                    >
                      🖨️ {t("Print Request", "Anfrage drucken")}
                    </Button>
                    <h3 className="font-display text-lg">
                      {b.event_type ?? "Event"}
                      {b.guest_count ? ` · ${b.guest_count} guests` : ""}
                    </h3>
                  </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  #{b.id.slice(0, 8)} · received{" "}
                  {new Date(b.created_at).toLocaleString()}
                </p>
                <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-3">
                  {b.event_date && (
                    <div>
                      <dt className="text-muted-foreground text-xs">Date</dt>
                      <dd>{new Date(b.event_date).toLocaleDateString()}</dd>
                    </div>
                  )}
                  {b.location && (
                    <div>
                      <dt className="text-muted-foreground text-xs">Location</dt>
                      <dd>{b.location}</dd>
                    </div>
                  )}
                  {b.budget_cents != null && (
                    <div>
                      <dt className="text-muted-foreground text-xs">Budget</dt>
                      <dd>€{(b.budget_cents / 100).toFixed(2)}</dd>
                    </div>
                  )}
                </dl>
                {b.notes && (
                  <p className="mt-3 text-sm italic text-muted-foreground">"{b.notes}"</p>
                )}
              </div>
              <div className="w-full lg:w-[400px] shrink-0 space-y-4">
                <MilestoneTimeline 
                  briefId={b.id} 
                  milestones={b.milestones} 
                  onUpdate={() => qc.invalidateQueries({ queryKey: ["planner", "requests"] })} 
                  isVendor={true} 
                />
                <SecureChat briefId={b.id} currentUserId={q.data.planner.owner_id} />
                <div className="w-full">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Update status
                  </Label>
                  <Select
                    value={b.status}
                    onValueChange={(v) =>
                      mut.mutate({ requestId: b.id, status: v })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BRIEF_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  </>
  );
}

function PlannerDashboard() {
  const fetchServices = useServerFn(getMyPlannerServices);
  const q = useSuspenseQuery({
    queryKey: ["planner", "services"],
    queryFn: () => fetchServices(),
  });

  useSpeiselyPing(q.data?.planner?.id, ["catering_briefs", "brief_messages", "planner_requests"]);

  const { hash } = useLocation();
  const activeTab = (hash || "#overview").replace("#", "");
  const qc = useQueryClient();


  
  if (!q.data?.planner) {
    return (
      <VendorLayout vertical="planner" title="Planner Dashboard">
        <EmptyCard
          title="Create your planner storefront"
          description="Set up your brand to start showcasing event service packages on Speisely."
        >
          <CreatePlannerForm />
        </EmptyCard>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout 
      vertical="planner" 
      title={`${q.data.planner.name} Dashboard`} 
      storefrontSlug={q.data.planner.slug}
    >
      {activeTab === "overview" && <OverviewSection />}
      {activeTab === "briefs" && <RequestsSection />}
      {activeTab === "calendar" && <BlackoutCalendarSection vendorType="planner" />}
      {activeTab === "packages" && <ServiceManagerSection planner={q.data.planner} services={q.data.services} />}
      {activeTab === "promotions" && <PromotionsSection vertical="planners" />}
      {activeTab === "logistics" && <LogisticsSection />}
      {activeTab === "profile" && (
        <div className="space-y-10">
          <CustomDomainSection 
            entity={q.data.planner} 
            onSave={async (slug, domain) => {
              const { updateMyPlannerSettings } = await import("@/lib/planner/mutations.functions");
              await updateMyPlannerSettings({
                data: {
                  name: q.data.planner.name,
                  slug: slug,
                  custom_domain: domain
                }
              });
              qc.invalidateQueries({ queryKey: ["planner", "services"] });
            }}
          />
          <BusinessProfileSection />
        </div>
      )}
    </VendorLayout>
  );
}
