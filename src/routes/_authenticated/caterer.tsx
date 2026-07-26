/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createFileRoute,
  Link,
  useRouter,
  useLocation,
  redirect,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Sparkles, Plus, Loader2, Tag, Ticket, Pencil, X, Info, ChevronRight } from "lucide-react";
import { generateGastronomyCopy } from "@/lib/restaurant/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import { BRANDING_ASSISTANT_ENABLED } from "@/utils/featureFlags";
import { generateSvgLogo, generateSvgBanner } from "@/utils/brandingGenerator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getMyCatererMenu,
  upsertCatererMenuItem,
  deleteCatererMenuItem,
} from "@/lib/caterer/menu.functions";
import {
  getCatererBriefs,
  updateCatererBriefStatus,
  createMyCaterer,
  getCatererKPIs,
  updateMyCatererSettings,
  submitCatererProposal,
  getBriefContactDetails,
  BRIEF_STATUSES,
  type BriefStatus,
} from "@/lib/caterer/queries.functions";
import { getMyPromoCodes } from "@/lib/promotions/queries.functions";
import { createPromoCode, togglePromoCode } from "@/lib/promotions/mutations.functions";
import { useSpeiselyPing } from "@/lib/vendor/useSpeiselyPing";
import { SecureChat } from "@/components/SecureChat";
import { MilestoneTimeline } from "@/components/vendor/MilestoneTimeline";
import { BlackoutCalendarSection } from "@/components/vendor/BlackoutCalendarSection";
import { CustomDomainSection } from "@/components/vendor/CustomDomainSection";
import { VendorLayout, DashboardSkeleton } from "@/components/vendor/VendorLayout";
import { toast } from "sonner";
import { useI18n } from "@/i18n/I18nProvider";
import { Checkbox } from "@/components/ui/checkbox";
import { updateMyConsent } from "@/lib/consent.functions";
import { CommunicationPreferences } from "@/components/vendor/CommunicationPreferences";
import { printEventBrief } from "@/utils/printEventBrief";
import { PrintOnboardingBanner } from "@/components/vendor/PrintOnboardingBanner";
import { CatererOnlinePresence } from "@/components/vendor/CatererOnlinePresence";
import { MenuImportWizard } from "@/components/vendor/MenuImportWizard";



export const Route = createFileRoute("/_authenticated/caterer")({
  ssr: false,
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    tab?: string;
    section?: "social" | "visibility" | "promo";
  } => {
    const rawSection = search.section as string | undefined;
    const validatedSection =
      rawSection === "social" || rawSection === "visibility" || rawSection === "promo"
        ? rawSection
        : "social";

    return {
      tab: search.tab as string | undefined,
      section: validatedSection,
    };
  },
  beforeLoad: async ({ context }) => {
    // Role enforcement is handled server-side by requireRole("caterer") on every
    // server function. This lightweight guard just prevents non-partners from
    // seeing the dashboard shell, using cached session data (no network call).
    const { data: { session } } = await supabase.auth.getSession();
    const metaRole = session?.user?.user_metadata?.role;
    if (!session?.user || !metaRole || metaRole === "customer") {
      throw redirect({
        to: "/auth",
        search: {
          signup: undefined,
          message: "Please sign in with a Business Partner account.",
          logout: "true",
        },
      });
    }
  },
  head: () => ({ meta: [{ title: "Caterer Dashboard — Speisely" }] }),
  component: CatererDashboard,
});

const STATUS_STYLES: Record<BriefStatus, string> = {
  draft: "bg-stone-200 text-stone-800",
  needs_more_info: "bg-amber-100 text-amber-900",
  ready_for_matching: "bg-sky-100 text-sky-900",
  matched: "bg-indigo-100 text-indigo-900",
  quote_requested: "bg-violet-100 text-violet-900",
  quoted: "bg-teal-100 text-teal-900",
  booked: "bg-green-100 text-green-900",
  cancelled: "bg-rose-100 text-rose-900",
};

function price(cents: number | null | undefined) {
  if (cents == null) return "—";
  return `€${(cents / 100).toFixed(2)}`;
}

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
    <div className="surface-card p-6 md:p-8 text-center border border-[#eadfce]/35 max-w-xl mx-auto rounded-3xl bg-cream/10">
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-forest/10 text-forest shadow-sm text-xl">
        🥂
      </div>
      <h3 className="font-display text-lg font-bold text-forest">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground leading-relaxed">
        {description}
      </p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

function CreateCatererForm() {
  const { t, lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
  const create = useServerFn(createMyCaterer);
  const saveConsent = useServerFn(updateMyConsent);
  const qc = useQueryClient();
  const fetchMenu = useServerFn(getMyCatererMenu);
  const menuQ = useQuery({
    queryKey: ["caterer", "menu"],
    queryFn: () => fetchMenu(),
  });
  const availableItems = (menuQ.data?.menu || []).map((m: any) => m.name);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const mut = useMutation({
    mutationFn: (vars: { name: string; slug: string; custom_domain: string }) =>
      create({ data: vars }),
    onSuccess: async () => {
      try {
        await saveConsent({ data: { marketing_opt_in: marketingOptIn, source: "caterer_signup" } });
      } catch (e) {
        console.error("Failed to save marketing consent during signup:", e);
      }
      qc.invalidateQueries({ queryKey: ["caterer"] });
    },
    onError: (e: any) => setErr(e.message ?? "Failed"),
  });
  return (
    <form
      className="mx-auto mt-2 max-w-md space-y-4 text-left"
      onSubmit={(e) => {
        e.preventDefault();
        setErr(null);
        mut.mutate({ name, slug, custom_domain: subdomain + ".speisely.de" });
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="cname" className="text-xs font-semibold text-forest/80">
          {t("Catering-Markenname", "Catering Brand Name")}
        </Label>
        <Input
          id="cname"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("z.B. Maison Verde Catering", "e.g. Maison Verde Catering")}
          required
          className="bg-white border-[#eadfce] focus-visible:ring-forest rounded-xl"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cslug" className="text-xs font-semibold text-forest/80">
          {t("URL-Slug", "URL Slug")}
        </Label>
        <Input
          id="cslug"
          value={slug}
          onChange={(e) => {
            const v = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
            setSlug(v);
            if (!subdomain || subdomain === slug) {
              setSubdomain(v);
            }
          }}
          placeholder="maison-verde"
          required
          className="bg-white border-[#eadfce] focus-visible:ring-forest rounded-xl"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="csubdomain" className="text-xs font-semibold text-forest/80">
          {t("Speisely Subdomain", "Speisely Subdomain")}
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="csubdomain"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            placeholder="maison-verde"
            required
            className="flex-1 bg-white border-[#eadfce] focus-visible:ring-forest rounded-xl"
          />
          <span className="text-muted-foreground text-sm font-semibold shrink-0">.speisely.de</span>
        </div>
        <p className="text-[10px] text-muted-foreground">
          {t(
            "Dies wird die offizielle URL für deine Kunden sein.",
            "This will be your official client-facing storefront URL.",
          )}
        </p>
      </div>
      {err && <p className="text-xs text-rose-600 font-medium">{err}</p>}

      {/* Optional Marketing Consent */}
      <div className="flex items-start gap-2.5 pt-1 pb-2">
        <Checkbox
          id="signup-marketing-consent"
          checked={marketingOptIn}
          onCheckedChange={(checked) => setMarketingOptIn(!!checked)}
          className="mt-0.5 border-forest/20 text-forest data-[state=checked]:bg-forest data-[state=checked]:border-forest"
        />
        <div className="grid gap-1 leading-none">
          <Label
            htmlFor="signup-marketing-consent"
            className="text-xs font-medium text-forest cursor-pointer"
          >
            {tt(
              "Ich möchte Updates, Branchen-Tipps und Angebote von Speisely erhalten (optional)",
              "I want to receive updates, industry tips, and promotions from Speisely (optional)",
            )}
          </Label>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full rounded-full bg-forest hover:opacity-95 text-white py-2.5 font-semibold transition cursor-pointer mt-4"
        disabled={mut.isPending}
      >
        {mut.isPending
          ? t("Erstelle Storefront…", "Creating Storefront…")
          : t("Catering-Storefront erstellen", "Create Catering Storefront")}
      </Button>
    </form>
  );
}

function StatusPill({ status }: { status: BriefStatus }) {
  const cls = STATUS_STYLES[status] ?? "bg-stone-200 text-stone-800";
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${cls}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function CustomerContactReveal({ briefId, status }: { briefId: string; status: BriefStatus }) {
  const fetchContact = useServerFn(getBriefContactDetails);

  const { data, isLoading, error } = useQuery({
    queryKey: ["caterer", "brief", briefId, "contact"],
    queryFn: () => fetchContact({ data: { briefId } }),
    enabled: status === "booked",
    retry: false,
  });

  if (status !== "booked") {
    return (
      <div className="mt-6 p-4 rounded-xl border border-dashed border-stone-300 bg-stone-50 flex flex-col items-center justify-center text-center">
        <div className="space-y-1">
          <div className="flex justify-center text-stone-400 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <p className="text-sm font-medium text-stone-600">Contact Details Locked</p>
          <p className="text-xs text-stone-500">
            Customer contact details will be revealed once the deal is booked.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-6 p-4 rounded-xl border border-stone-200 bg-white shadow-sm flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-forest" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mt-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm">
        Failed to load contact details.
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 rounded-xl border border-forest/20 bg-forest/5 shadow-sm">
      <h4 className="text-xs font-bold uppercase tracking-wider text-forest mb-3 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        Customer Contact Info
      </h4>
      <div className="space-y-2 text-sm text-stone-800">
        <div className="flex items-center gap-2">
          <span className="text-stone-500 w-16">Name:</span>
          <span className="font-medium">
            {data.first_name} {data.last_name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-stone-500 w-16">Email:</span>
          <a href={`mailto:${data.email}`} className="font-medium text-forest hover:underline">
            {data.email}
          </a>
        </div>
        {data.phone && (
          <div className="flex items-center gap-2">
            <span className="text-stone-500 w-16">Phone:</span>
            <a href={`tel:${data.phone}`} className="font-medium text-forest hover:underline">
              {data.phone}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function BriefsSection() {
  const { t } = useI18n();
  const fetchBriefs = useServerFn(getCatererBriefs);
  const updateStatus = useServerFn(updateCatererBriefStatus);
  const submitProposal = useServerFn(submitCatererProposal);
  const qc = useQueryClient();
  const q = useSuspenseQuery({
    queryKey: ["caterer", "briefs"],
    queryFn: () => fetchBriefs(),
  });
  const mut = useMutation({
    mutationFn: (vars: { briefId: string; status: BriefStatus }) => updateStatus({ data: vars }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["caterer", "briefs"] }),
  });

  const [selectedBriefId, setSelectedBriefId] = useState<string | null>(
    q.data?.briefs?.[0]?.id || null,
  );

  const [proposalBrief, setProposalBrief] = useState<any | null>(null);
  const [proposalAmount, setProposalAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [proposalNotes, setProposalNotes] = useState("");
  const proposalMut = useMutation({
    mutationFn: (vars: {
      briefId: string;
      proposalCents: number;
      depositCents: number;
      notes: string;
      origin: string;
    }) => submitProposal({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["caterer", "briefs"] });
      setProposalBrief(null);
    },
  });

  const selectedBrief = q.data?.briefs?.find((b: any) => b.id === selectedBriefId);

  if (q.error)
    return (
      <div className="surface-card p-8 text-center text-destructive">
        Could not load your leads. Please try again.
      </div>
    );
  if (!q.data?.caterer)
    return (
      <EmptyCard
        title="Create your storefront"
        description="Set up your brand to start receiving event briefs from customers on Speisely."
      >
        <CreateCatererForm />
      </EmptyCard>
    );

  if (q.data.briefs.length === 0)
    return (
      <div className="space-y-6">
        <div className="max-w-md mx-auto">
          <PrintOnboardingBanner type="a4" brandName={q.data.caterer.name} />
        </div>
        <EmptyCard
          title={t("No leads yet", "Noch keine Anfragen")}
          description={t(
            `When a customer routes a brief to ${q.data.caterer.name}, it will appear here.`,
            `Sobald ein Kunde eine Anfrage an ${q.data.caterer.name} sendet, erscheint sie hier.`,
          )}
        >
          <div className="flex flex-col items-center justify-center gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                const mockBrief = {
                  id: "test-lead-12345",
                  created_at: new Date().toISOString(),
                  event_type: t("Company Anniversary", "Firmenjubiläum"),
                  guest_count: 75,
                  event_date: new Date(Date.now() + 86400000 * 30).toISOString(),
                  location: "Berlin City Center Hall",
                  budget_cents: 350000,
                  notes: t(
                    "Buffet setup with vegan options, high-end tableware requested.",
                    "Buffet-Aufbau mit veganen Optionen, hochwertiges Geschirr gewünscht.",
                  ),
                  status: "quote_requested",
                  is_b2b: true,
                  company_name: "TechCorp GmbH",
                  milestones: [
                    {
                      title: t("Inquiry Received", "Anfrage erhalten"),
                      status: "received",
                      created_at: new Date().toISOString(),
                    },
                    {
                      title: t("Details Confirmed", "Details bestätigt"),
                      status: "confirmed",
                      created_at: new Date().toISOString(),
                    },
                  ],
                };
                printEventBrief(mockBrief, q.data.caterer.name, "caterer");
              }}
              className="rounded-full gap-2 border-forest/20 text-forest hover:bg-cream"
            >
              🖨️ {t("Print Test Brief", "Test-Brief drucken")}
            </Button>
            <p className="text-[10px] text-muted-foreground max-w-sm">
              {t(
                "Use this to test your A4 page styling or export event summaries to PDF.",
                "Nutze dies, um dein A4-Seitenlayout zu testen oder Eventzettel als PDF zu exportieren.",
              )}
            </p>
          </div>
        </EmptyCard>
      </div>
    );

  return (
    <>
      <div className="mb-4 max-w-xl text-left">
        <PrintOnboardingBanner type="a4" brandName={q.data.caterer.name} />
      </div>
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl">{t("Leads", "Anfragen")}</h2>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const mockBrief = {
                  id: "test-lead-12345",
                  created_at: new Date().toISOString(),
                  event_type: t("Company Anniversary", "Firmenjubiläum"),
                  guest_count: 75,
                  event_date: new Date(Date.now() + 86400000 * 30).toISOString(),
                  location: "Berlin City Center Hall",
                  budget_cents: 350000,
                  notes: t(
                    "Buffet setup with vegan options, high-end tableware requested.",
                    "Buffet-Aufbau mit veganen Optionen, hochwertiges Geschirr gewünscht.",
                  ),
                  status: "quote_requested",
                  is_b2b: true,
                  company_name: "TechCorp GmbH",
                  milestones: [
                    {
                      title: t("Inquiry Received", "Anfrage erhalten"),
                      status: "received",
                      created_at: new Date().toISOString(),
                    },
                    {
                      title: t("Details Confirmed", "Details bestätigt"),
                      status: "confirmed",
                      created_at: new Date().toISOString(),
                    },
                  ],
                };
                printEventBrief(mockBrief, q.data.caterer.name, "caterer");
              }}
              className="h-8 rounded-full text-xs gap-1.5 border-forest/20 text-forest hover:bg-cream"
            >
              🖨️ {t("Test Print A4", "Test-Druck A4")}
            </Button>
            <span className="text-sm text-muted-foreground">
              {q.data.briefs.length} {t("total", "gesamt")}
            </span>
          </div>
        </div>

        {/* Master-Detail Layout */}
        <div className="grid lg:grid-cols-[360px_1fr] gap-6 items-start">
          {/* Left Column: Leads list */}
          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {q.data.briefs.map((b: any) => {
              const isActive = b.id === selectedBriefId;
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBriefId(b.id)}
                  className={`surface-card p-4 text-left border rounded-2xl cursor-pointer transition-all ${
                    isActive
                      ? "border-forest bg-cream/15 ring-1 ring-emerald-600 shadow-sm"
                      : "border-border/60 hover:border-forest/40 hover:bg-cream/5"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        STATUS_STYLES[b.status as BriefStatus] || "bg-stone-200 text-stone-800"
                      }`}
                    >
                      {b.status.replace(/_/g, " ")}
                    </span>
                    <div className="flex gap-1 shrink-0">
                      {b.is_b2b && (
                        <span className="bg-blue-100 text-blue-800 border border-blue-200 rounded px-1.5 py-0.2 text-[8px] font-bold">
                          🏢 B2B
                        </span>
                      )}
                      {b.is_recurring && (
                        <span className="bg-purple-100 text-purple-800 border border-purple-200 rounded px-1.5 py-0.2 text-[8px] font-bold">
                          🔄 Rec
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-sm text-forest truncate">
                    {b.company_name ? `${b.company_name} — ` : ""}
                    {b.event_type ?? "Event"}
                  </h3>
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
                    <span>👥 {b.guest_count || "—"} guests</span>
                    <span>
                      📅 {b.event_date ? new Date(b.event_date).toLocaleDateString() : "—"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Lead Details */}
          <div className="space-y-6">
            {selectedBrief ? (
              <div className="surface-card p-6 border border-[#eadfce]/35 rounded-3xl bg-white shadow-sm space-y-6 text-left">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/40 pb-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <StatusPill status={selectedBrief.status as BriefStatus} />
                      {selectedBrief.is_b2b && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-800 border border-blue-200">
                          🏢 B2B
                        </span>
                      )}
                      {selectedBrief.is_recurring && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-800 border border-purple-200 capitalize">
                          🔄 {selectedBrief.recurrence_pattern}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-xl font-bold text-forest mt-2">
                      {selectedBrief.company_name ? `${selectedBrief.company_name} — ` : ""}
                      {selectedBrief.event_type ?? "Event"}
                      {selectedBrief.guest_count ? ` · ${selectedBrief.guest_count} guests` : ""}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      #{selectedBrief.id.slice(0, 8)} · received{" "}
                      {new Date(selectedBrief.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => printEventBrief(selectedBrief, q.data.caterer.name, "caterer")}
                    className="h-8 rounded-full text-xs gap-1 border-forest/20 text-forest hover:bg-cream"
                  >
                    🖨️ {t("Print Summary", "Ausdrucken")}
                  </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px]">
                  {/* Left Detail Body */}
                  <div className="space-y-5">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Event Information
                      </h4>
                      <dl className="mt-2 grid grid-cols-2 gap-3 text-xs">
                        {selectedBrief.event_date && (
                          <div className="bg-cream/10 p-2.5 rounded-xl border border-border/20">
                            <dt className="text-muted-foreground text-[10px]">Date</dt>
                            <dd className="font-semibold text-forest mt-0.5">
                              {new Date(selectedBrief.event_date).toLocaleDateString()}
                            </dd>
                          </div>
                        )}
                        {selectedBrief.location && (
                          <div className="bg-cream/10 p-2.5 rounded-xl border border-border/20">
                            <dt className="text-muted-foreground text-[10px]">Location</dt>
                            <dd
                              className="font-semibold text-forest mt-0.5 truncate"
                              title={selectedBrief.location}
                            >
                              {selectedBrief.location}
                            </dd>
                          </div>
                        )}
                        {selectedBrief.budget_cents != null && (
                          <div className="bg-cream/10 p-2.5 rounded-xl border border-border/20 col-span-2 sm:col-span-1">
                            <dt className="text-muted-foreground text-[10px]">Budget</dt>
                            <dd className="font-semibold text-forest mt-0.5">
                              {price(selectedBrief.budget_cents)}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>

                    {selectedBrief.notes && (
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Customer Notes
                        </h4>
                        <div className="mt-2 p-3 bg-stone-50 border border-border/30 rounded-xl text-xs text-forest/90 italic leading-relaxed">
                          "{selectedBrief.notes}"
                        </div>
                      </div>
                    )}

                    <CustomerContactReveal
                      briefId={selectedBrief.id}
                      status={selectedBrief.status as BriefStatus}
                    />

                    <div className="border-t border-border/40 pt-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                        Milestone Progress
                      </h4>
                      <MilestoneTimeline
                        briefId={selectedBrief.id}
                        milestones={selectedBrief.milestones}
                        onUpdate={() => qc.invalidateQueries({ queryKey: ["caterer", "briefs"] })}
                        isVendor={true}
                      />
                    </div>
                  </div>

                  {/* Right Chat & Actions Sidebar */}
                  <div className="space-y-4 border-t md:border-t-0 md:border-l border-border/40 pt-5 md:pt-0 md:pl-5">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                        Brief Status Control
                      </Label>
                      <Select
                        value={selectedBrief.status}
                        onValueChange={(v) =>
                          mut.mutate({ briefId: selectedBrief.id, status: v as BriefStatus })
                        }
                      >
                        <SelectTrigger className="w-full text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BRIEF_STATUSES.filter((s) => s !== "booked").map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">
                              {s.replace(/_/g, " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[10px] py-1 h-8 rounded-lg font-semibold border-forest/20 text-forest"
                          disabled={mut.isPending}
                          onClick={() =>
                            mut.mutate({ briefId: selectedBrief.id, status: "needs_more_info" })
                          }
                        >
                          Request Info
                        </Button>
                        <Button
                          size="sm"
                          className="text-[10px] py-1 h-8 rounded-lg font-semibold bg-forest text-white"
                          disabled={mut.isPending}
                          onClick={() =>
                            mut.mutate({ briefId: selectedBrief.id, status: "booked" })
                          }
                        >
                          Confirm Booked
                        </Button>
                      </div>
                      {(selectedBrief.status === "quote_requested" ||
                        selectedBrief.status === "draft" ||
                        selectedBrief.status === "needs_more_info") && (
                        <Button
                          size="sm"
                          className="w-full mt-2 text-xs py-1 h-8 rounded-lg bg-forest text-white font-semibold"
                          onClick={() => {
                            setProposalBrief(selectedBrief);
                            setProposalAmount(
                              selectedBrief.budget_cents
                                ? (selectedBrief.budget_cents / 100).toString()
                                : "",
                            );
                            setDepositAmount("0");
                            setProposalNotes("");
                          }}
                        >
                          Convert to Proposal
                        </Button>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border/40">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        Message Client
                      </h4>
                      <div className="border border-border/40 rounded-2xl overflow-hidden bg-white shadow-sm">
                        <SecureChat
                          briefId={selectedBrief.id}
                          currentUserId={q.data.caterer.owner_id}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="surface-card p-12 text-center border border-dashed border-border rounded-3xl text-muted-foreground">
                Select a lead from the left to view details and chat with the client.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Proposal Dialog */}
      <Dialog open={!!proposalBrief} onOpenChange={(open) => !open && setProposalBrief(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Proposal</DialogTitle>
            <DialogDescription>
              Submit an official proposal to the customer. This will update the brief's total and
              set its status to "Proposal Sent".
            </DialogDescription>
          </DialogHeader>
          {proposalBrief && (
            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label>Total Proposal Amount (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={proposalAmount}
                  onChange={(e) => setProposalAmount(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Required Deposit Amount (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Amount due immediately to confirm booking.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label>Milestone Terms & Notes</Label>
                <Textarea
                  rows={4}
                  value={proposalNotes}
                  onChange={(e) => setProposalNotes(e.target.value)}
                  placeholder="e.g. 50% deposit required upon booking. Final payment due 7 days prior to event."
                />
              </div>
              <Button
                className="w-full bg-forest text-white rounded-full flex-1"
                disabled={!proposalAmount || !depositAmount || proposalMut.isPending}
                onClick={() => {
                  if (!proposalAmount || !depositAmount) return;
                  proposalMut.mutate({
                    briefId: proposalBrief.id,
                    proposalCents: Math.round(parseFloat(proposalAmount) * 100),
                    depositCents: Math.round(parseFloat(depositAmount) * 100),
                    notes: proposalNotes,
                    origin: window.location.origin,
                  });
                }}
              >
                {proposalMut.isPending ? "Sending..." : "Send Proposal"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

const FOOD_PHOTO_PRESETS = [
  {
    id: "meat",
    title_de: "🥩 Fleisch & Braten",
    title_en: "🥩 Meat & Roast",
    keywords: ["rinder", "beef", "filet", "speck", "braten", "roast", "steak", "fleisch", "schwein", "pork"],
    url: "/images/business_lunch_plating.webp",
  },
  {
    id: "burger",
    title_de: "🍔 Burger & BBQ",
    title_en: "🍔 Burger & BBQ",
    keywords: ["burger", "bbq", "grill", "pulled", "fries", "pommes"],
    url: "/images/banner_burger.webp",
  },
  {
    id: "sushi",
    title_de: "🍣 Sushi & Asia",
    title_en: "🍣 Sushi & Asian",
    keywords: ["sushi", "maki", "nigiri", "lachs", "salmon", "asia", "wok", "ramen"],
    url: "/images/banner_sushi.webp",
  },
  {
    id: "healthy",
    title_de: "🥗 Salat & Bowls",
    title_en: "🥗 Salads & Bowls",
    keywords: ["salat", "salad", "bowl", "healthy", "vegan", "veggie", "vegetarisch", "gemüse"],
    url: "/images/banner_healthy.webp",
  },
  {
    id: "schnitzel",
    title_de: "🍖 Schnitzel",
    title_en: "🍖 Schnitzel",
    keywords: ["schnitzel", "cordon", "kartoffel", "klassiker", "jäger"],
    url: "/images/banner_schnitzel.webp",
  },
  {
    id: "catering_event",
    title_de: "🥂 Buffet & Event",
    title_en: "🥂 Buffet & Event",
    keywords: ["buffet", "catering", "event", "platte", "fingerfood", "auswahl"],
    url: "/images/event_catering_hero.webp",
  },
  {
    id: "office_lunch",
    title_de: "💼 Business Lunch",
    title_en: "💼 Business Lunch",
    keywords: ["business", "lunch", "häppchen", "canapé", "brötchen", "bites", "office"],
    url: "/images/office_catering_hero.webp",
  },
  {
    id: "fine_dining",
    title_de: "🍽️ Fine Dining",
    title_en: "🍽️ Fine Dining",
    keywords: ["gourmet", "fine", "dining", "menü", "gang", "dessert", "kuchen", "vorspeise"],
    url: "/images/restaurant_hero_food.webp",
  },
];

function isAiPresetImage(url?: string | null): boolean {
  if (!url) return false;
  return (
    url.includes("/images/") ||
    url.includes("banner_") ||
    url.includes("preset") ||
    url.includes("hero_") ||
    url.includes("restaurant_hero")
  );
}

function MenuForm({
  catererId,
  editing,
  onDone,
  onCancel,
}: {
  catererId: string;
  editing?: any | null;
  onDone: () => void;
  onCancel?: () => void;
}) {
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
  const upsert = useServerFn(upsertCatererMenuItem);
  const generateAiCopy = useServerFn(generateGastronomyCopy);
  const qc = useQueryClient();
  const fileRef = React.useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState("Menü");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("Person");
  const [serves, setServes] = useState("1");
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  React.useEffect(() => {
    if (editing) {
      setName(editing.name ?? "");
      setCategory(editing.category ?? "Menü");
      setDescription(editing.description ?? "");
      setPrice(editing.price_cents ? (editing.price_cents / 100).toString() : "");
      setUnit(editing.unit ?? "Person");
      setServes((editing.serves ?? 1).toString());
      setImagePath(editing.image_url ?? null);
      setImagePreview(editing.image_signed_url ?? editing.image_url ?? null);
    } else {
      resetForm();
    }
  }, [editing]);

  function resetForm() {
    setName("");
    setCategory("Menü");
    setDescription("");
    setPrice("");
    setUnit("Person");
    setServes("1");
    setImagePath(null);
    setImagePreview(null);
  }

  function handleSuggestAiPhoto() {
    const query = `${name} ${category}`.toLowerCase();
    const matched = FOOD_PHOTO_PRESETS.find((p) =>
      p.keywords.some((k) => query.includes(k)),
    );
    const selected = matched || FOOD_PHOTO_PRESETS[0];
    setImagePath(selected.url);
    setImagePreview(selected.url);
    toast.success(
      tt(
        `KI hat das Foto "${lang === "de" ? selected.title_de : selected.title_en}" vorgeschlagen!`,
        `AI suggested "${lang === "de" ? selected.title_de : selected.title_en}" photo!`,
      ),
    );
  }

  async function handleGenerateAiDescription() {
    if (!name.trim()) {
      toast.error(
        tt(
          "Bitte geben Sie zuerst einen Namen für das Menü/Gericht ein.",
          "Please enter a menu item name first.",
        ),
      );
      return;
    }
    setGeneratingAi(true);
    try {
      const res = await generateAiCopy({
        data: {
          type: "menu_item",
          name: name.trim(),
          category: category || "Catering",
        },
      });
      const text = lang === "de" ? res.desc_de : res.desc_en;
      if (text) {
        setDescription(text);
        toast.success(
          tt("KI-Beschreibung erfolgreich erstellt!", "AI description generated successfully!"),
        );
      }
    } catch (e: any) {
      toast.error(
        e.message ||
          tt("Fehler beim Generieren der KI-Beschreibung", "Failed to generate AI description"),
      );
    } finally {
      setGeneratingAi(false);
    }
  }

  const mut = useMutation({
    mutationFn: (vars: any) => upsert({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["caterer", "menu"] });
      resetForm();
      onDone();
      toast.success(
        editing
          ? tt("Angebot erfolgreich aktualisiert!", "Item updated successfully!")
          : tt("Neues Angebot hinzugefügt!", "New item added!"),
      );
    },
    onError: (e: any) => setErr(e.message ?? "Failed"),
  });

  async function handleFile(file: File) {
    setErr(null);
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${catererId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("caterer-menu")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data: signed } = await supabase.storage
        .from("caterer-menu")
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
        if (!name || !category) return;
        mut.mutate({
          id: editing?.id,
          category,
          name,
          description,
          price_cents: cents,
          unit,
          serves: parseInt(serves || "1", 10),
          image_url: imagePath,
        });
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg">
          {editing
            ? tt("Menüartikel bearbeiten", "Edit Menu Item")
            : tt("Menüartikel hinzufügen", "Add Menu Item")}
        </h3>
        {editing && onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-xs text-muted-foreground hover:text-foreground h-7"
          >
            {tt("Abbrechen", "Cancel")}
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>{tt("Name", "Name")}</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label>{tt("Kategorie", "Category")}</Label>
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            placeholder="Menü, Vorspeisen..."
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label>{tt("Beschreibung", "Description")}</Label>
          <button
            type="button"
            onClick={handleGenerateAiDescription}
            disabled={generatingAi || !name.trim()}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-forest hover:opacity-80 disabled:opacity-50 transition-all cursor-pointer"
          >
            {generatingAi ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{tt("Generiere...", "Generating...")}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{tt("Mit KI schreiben", "Write with AI")}</span>
              </>
            )}
          </button>
        </div>
        <Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label>{tt("Preis (€)", "Price (€)")}</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label>{tt("Einheit", "Unit")}</Label>
          <Input
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
            placeholder="Person, Platte..."
          />
        </div>
        <div className="space-y-1.5">
          <Label>{tt("Portionen", "Serves")}</Label>
          <Input
            type="number"
            min="1"
            value={serves}
            onChange={(e) => setServes(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>{tt("Bild (Optional)", "Image (Optional)")}</Label>
          <button
            type="button"
            onClick={handleSuggestAiPhoto}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-forest hover:opacity-80 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{tt("KI-Bild vorschlagen", "Suggest AI Photo")}</span>
          </button>
        </div>
        {imagePreview && (
          <div className="relative group rounded-xl overflow-hidden border border-border">
            <img
              src={imagePreview}
              alt=""
              className="h-32 w-full object-cover shadow-sm"
            />
            {isAiPresetImage(imagePath || imagePreview) && (
              <span className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-md text-white text-[9px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-white/15">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                <span>{tt("Symbolbild (Serviervorschlag)", "Illustrative Sample Photo")}</span>
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setImagePath(null);
                setImagePreview(null);
                toast.info(tt("Bild entfernt", "Picture removed"));
              }}
              className="absolute top-2 right-2 bg-black/80 hover:bg-rose-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow backdrop-blur-sm transition-all flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>{tt("Bild entfernen", "Remove picture")}</span>
            </button>
          </div>
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
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading
              ? "Uploading…"
              : imagePreview
                ? tt("Eigenes Bild ändern", "Replace custom image")
                : tt("Eigenes Bild hochladen", "Upload custom image")}
          </Button>
          {imagePreview && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-semibold px-3 border border-rose-200 cursor-pointer"
              onClick={() => {
                setImagePath(null);
                setImagePreview(null);
                toast.info(tt("Bild entfernt", "Picture removed"));
              }}
            >
              {tt("Kein Bild", "No picture")}
            </Button>
          )}
        </div>
        <div className="pt-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-[11px] text-muted-foreground">{tt("Oder 1-Klick Food-Foto Galerie:", "Or select 1-click food photo preset:")}</Label>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {FOOD_PHOTO_PRESETS.map((preset) => {
              const isSelected = imagePath === preset.url;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setImagePath(preset.url);
                    setImagePreview(preset.url);
                    toast.success(
                      tt(
                        `Preset "${lang === "de" ? preset.title_de : preset.title_en}" ausgewählt!`,
                        `Selected "${lang === "de" ? preset.title_de : preset.title_en}" preset!`,
                      ),
                    );
                  }}
                  className={`group relative overflow-hidden rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-forest ring-2 ring-forest/30 scale-[1.02]"
                      : "border-border hover:border-forest/50"
                  }`}
                >
                  <img src={preset.url} alt={preset.title_en} className="h-12 w-full object-cover" />
                  <div className="p-1 text-[9px] font-medium truncate bg-white/95 dark:bg-card text-foreground">
                    {lang === "de" ? preset.title_de : preset.title_en}
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-muted-foreground/80 flex items-start gap-1 pt-1 leading-normal">
            <Info className="w-3 h-3 text-forest/70 shrink-0 mt-0.5" />
            <span>
              {tt(
                "Hinweis: Vorlagensequenzen dienen als professionelle Serviervorschläge (Symbolfotos).",
                "Note: Preset images act as professional marketing sample photos (Illustrative sample).",
              )}
            </span>
          </p>
        </div>
      </div>
      {err && <p className="text-sm text-destructive">{err}</p>}
      <div className="flex gap-2">
        {editing && onCancel && (
          <Button
            type="button"
            variant="outline"
            className="w-1/3 text-xs"
            onClick={onCancel}
          >
            {tt("Abbrechen", "Cancel")}
          </Button>
        )}
        <Button type="submit" className="flex-1" disabled={mut.isPending || uploading}>
          {mut.isPending
            ? "Saving…"
            : editing
              ? tt("Änderungen speichern", "Save changes")
              : tt("Hinzufügen", "Add to menu")}
        </Button>
      </div>
    </form>
  );
}

function CatererMenuSection() {
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
  const [showImportWizard, setShowImportWizard] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const fetchMenu = useServerFn(getMyCatererMenu);
  const remove = useServerFn(deleteCatererMenuItem);
  const qc = useQueryClient();
  const q = useSuspenseQuery({
    queryKey: ["caterer", "menu"],
    queryFn: () => fetchMenu(),
  });
  const delMut = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["caterer", "menu"] });
      if (editingItem) setEditingItem(null);
    },
  });

  const menuItems = q.data?.menu ?? [];

  // Extract unique categories dynamically from menu items
  const categories = React.useMemo(() => {
    const cats = Array.from(new Set(menuItems.map((m: any) => m.category).filter(Boolean)));
    return cats as string[];
  }, [menuItems]);

  // Filter items based on selected category tab
  const filteredMenu = React.useMemo(() => {
    if (selectedCategory === "ALL") return menuItems;
    return menuItems.filter((m: any) => m.category === selectedCategory);
  }, [menuItems, selectedCategory]);

  if (!q.data?.caterer) return null;

  return (
    <section className="space-y-4">
      {showImportWizard && (
        <MenuImportWizard
          vertical="caterer"
          onClose={() => setShowImportWizard(false)}
          onImported={() => {
            qc.invalidateQueries({ queryKey: ["caterer", "menu"] });
            setShowImportWizard(false);
          }}
        />
      )}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="font-display text-2xl text-forest">
            {tt("Speisekarte verwalten", "Menu Manager")}
          </h2>
          <p className="text-xs text-muted-foreground">
            {tt(
              "Verwalte hier deine Catering-Angebote und Buffet-Pakete.",
              "Manage your catering offerings and buffet packages here.",
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowImportWizard(true)}
            className="gap-2 border-forest/20 text-forest hover:bg-forest/5 rounded-xl text-xs font-semibold shrink-0"
          >
            📋 {tt("Speisekarte importieren", "Import Menu")}
          </Button>
          <span className="text-xs font-medium bg-forest/5 text-forest/70 px-2.5 py-1 rounded-full border border-forest/10 shrink-0">
            {menuItems.length} {tt("Angebote", "Items")}
          </span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      {categories.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-border/40 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory("ALL")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              selectedCategory === "ALL"
                ? "bg-forest text-cream shadow-sm"
                : "bg-forest/5 text-forest hover:bg-forest/10"
            }`}
          >
            {tt("Alle Angebote", "All Items")} ({menuItems.length})
          </button>
          {categories.map((cat) => {
            const count = menuItems.filter((m: any) => m.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-forest text-cream shadow-sm"
                    : "bg-forest/5 text-forest hover:bg-forest/10"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] items-start">
        <div className="space-y-4">
          {filteredMenu.length === 0 ? (
            <div className="surface-card p-6 text-center border-2 border-dashed border-[#eadfce]/55 rounded-3xl bg-cream/5 flex flex-col items-center justify-center min-h-[300px] space-y-3">
              <span className="text-2xl">🍽️</span>
              <h3 className="font-display text-base font-bold text-forest">
                {selectedCategory === "ALL"
                  ? tt("Noch keine Angebote erstellt", "No catering packages yet")
                  : tt(`Keine Angebote in Kategorie "${selectedCategory}"`, `No items in category "${selectedCategory}"`)}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm text-center leading-relaxed">
                {tt(
                  "Erstelle deine Speisen und Pakete mit dem Formular auf der rechten Seite.",
                  "Create your menu items or buffet packages using the builder form on the right.",
                )}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredMenu.map((m: any) => {
                const isCurrentlyEditing = editingItem?.id === m.id;
                return (
                  <article
                    key={m.id}
                    className={`surface-card overflow-hidden border rounded-3xl bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition ${
                      isCurrentlyEditing ? "ring-2 ring-forest border-forest" : "border-[#eadfce]/35"
                    }`}
                  >
                    <div>
                      {m.image_signed_url ? (
                        <div className="relative group">
                          <img src={m.image_signed_url} alt="" className="h-32 w-full object-cover" />
                          {isAiPresetImage(m.image_url || m.image_signed_url) && (
                            <span
                              title={tt("Serviervorschlag — Marketing-Symbolbild", "Illustrative sample photo — For marketing presentation")}
                              className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-md text-white text-[9px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-white/15"
                            >
                              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                              <span>{tt("Symbolbild (Serviervorschlag)", "Symbolic Photo (AI)")}</span>
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex h-32 w-full items-center justify-center bg-mint/20 text-2xl">
                          🥂
                        </div>
                      )}
                      <div className="p-4 space-y-1.5 text-left">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center rounded-full bg-forest/10 px-2 py-0.5 text-[9px] font-bold text-forest uppercase tracking-wider">
                            {m.category}
                          </span>
                          {isCurrentlyEditing && (
                            <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              {tt("Wird bearbeitet", "Editing")}
                            </span>
                          )}
                        </div>
                        <h4 className="font-display font-bold text-base text-forest line-clamp-1">
                          {m.name}
                        </h4>
                        {m.description && (
                          <p className="line-clamp-2 text-[11px] text-muted-foreground leading-relaxed">
                            {m.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="p-4 pt-0 border-t border-[#eadfce]/20 mt-3 flex items-center justify-between">
                      <p className="text-xs">
                        <span className="font-display font-bold text-base text-forest">
                          €{(m.price_cents / 100).toFixed(2)}
                        </span>
                        <span className="text-muted-foreground text-[10px] ml-1">
                          / {m.unit} (serves ~{m.serves})
                        </span>
                      </p>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7 px-2.5 rounded-lg border-forest/20 text-forest hover:bg-forest/5 gap-1 font-semibold cursor-pointer"
                          onClick={() => setEditingItem(m)}
                        >
                          <Pencil className="w-3 h-3" />
                          <span>{tt("Bearbeiten", "Edit")}</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs h-7 px-2.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                          disabled={delMut.isPending}
                          onClick={() => delMut.mutate(m.id)}
                        >
                          {tt("Löschen", "Delete")}
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
        <MenuForm
          catererId={q.data.caterer.id}
          editing={editingItem}
          onDone={() => setEditingItem(null)}
          onCancel={() => setEditingItem(null)}
        />
      </div>
    </section>
  );
}

function OverviewSection({ caterer }: { caterer: any }) {
  const { t } = useI18n();
  const fetchKPIs = useServerFn(getCatererKPIs);
  const q = useSuspenseQuery({
    queryKey: ["caterer", "kpis"],
    queryFn: () => fetchKPIs(),
  });
  const fetchMenu = useServerFn(getMyCatererMenu);
  const menuQ = useQuery({
    queryKey: ["caterer", "menu"],
    queryFn: () => fetchMenu(),
  });

  const [checklistCollapsed, setChecklistCollapsed] = useState(false);

  if (q.error)
    return (
      <div className="surface-card p-8 text-center text-destructive font-medium">
        {t("Übersichtsdetails konnten nicht geladen werden: ", "Could not load overview details: ")}
        {(q.error as any).message ?? "Unknown error"}
      </div>
    );
  if (!q.data)
    return (
      <div className="surface-card p-8 text-center text-muted-foreground">
        {t("Keine Übersichtsdetails verfügbar.", "No overview details available.")}
      </div>
    );

  const steps = [
    {
      id: "storefront",
      label: t("Storefront erstellen", "Create storefront"),
      done: true,
      desc: t(
        "Konfiguriere deinen Catering-Markennamen und die Subdomain.",
        "Configure your catering brand name and subdomain.",
      ),
      tab: "settings",
    },
    {
      id: "profile",
      label: t("Unternehmensprofil vervollständigen", "Complete business profile"),
      done: !!(caterer.logo_url && caterer.description),
      desc: t(
        "Füge ein Logo, Bannerbild und eine Beschreibung hinzu.",
        "Add a logo, banner image, and business description.",
      ),
      tab: "settings",
    },
    {
      id: "category",
      label: t("Service-Kategorie wählen", "Choose service category focus"),
      done: !!caterer.service_areas,
      desc: t(
        "Konfiguriere Liefergebiete, um regionale Nachfrage zu sichern.",
        "Configure delivery zones to capture regional demand.",
      ),
      tab: "settings",
    },
    {
      id: "menu",
      label: t("Erstes Paket oder Gericht hinzufügen", "Add first package or menu item"),
      done: !!(menuQ.data?.menu && menuQ.data.menu.length > 0),
      desc: t(
        "Erstelle Menükarten und Preise für deine Kunden.",
        "Create menu cards and pricing for clients to view.",
      ),
      tab: "menu",
    },
    {
      id: "logistics",
      label: t("Verfügbarkeit & Logistik einrichten", "Set availability & logistics"),
      done: !!(
        (caterer.service_areas && caterer.service_areas.trim().length > 0) ||
        caterer.delivery_fee_cents ||
        caterer.min_delivery_cents ||
        caterer.max_delivery_distance_km ||
        caterer.seo_logistics_details
      ),
      desc: t(
        "Definiere Liefergebühren, Mindestbestellwert und Grenzen.",
        "Define pricing rules, delivery fees, and boundaries.",
      ),
      tab: "logistics",
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const allDone = completedCount === steps.length;
  const nextStep = steps.find((s) => !s.done);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">{t("Übersicht", "Overview")}</h2>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Left Column: KPI Metrics Grid */}
        <div className="space-y-6">
          {/* Core Business Performance */}
          <div className="surface-card p-5 border border-[#eadfce]/35 rounded-3xl bg-white shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 text-left border-b border-border/40 pb-2">
              {t("Kernleistung", "Core Performance")}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="p-3 bg-cream/5 rounded-2xl border border-border/20 text-left">
                <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5">
                  <span className="text-forest">📈</span>{" "}
                  {t("Umsatz (Gebucht)", "Revenue (Booked)")}
                </p>
                <p className="text-xl font-bold font-display text-forest mt-1">
                  €{(q.data.revenueCents / 100).toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-cream/5 rounded-2xl border border-border/20 text-left">
                <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5">
                  <span className="text-forest">💶</span> {t("Ø Budget", "Avg Budget")}
                </p>
                <p className="text-xl font-bold font-display text-forest mt-1">
                  €{(q.data.averageOrderCents / 100).toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-cream/5 rounded-2xl border border-border/20 text-left">
                <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5">
                  <span className="text-forest">📅</span> {t("Gebuchte Events", "Booked Events")}
                </p>
                <p className="text-xl font-bold font-display text-forest mt-1">
                  {q.data.totalOrders}
                </p>
              </div>
              <div className="p-3 bg-cream/5 rounded-2xl border border-border/20 text-left">
                <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5">
                  <span className="text-forest">⏱️</span> {t("Aktive Anfragen", "Active Leads")}
                </p>
                <p className="text-xl font-bold font-display text-forest mt-1">
                  {q.data.pendingOrders}
                </p>
              </div>
            </div>
          </div>

          {/* Marketplace / Engagement Metrics */}
          <div className="surface-card p-5 border border-[#eadfce]/35 rounded-3xl bg-white shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 text-left border-b border-border/40 pb-2">
              {t("Marktplatz-Statistiken & Engagement", "Marketplace Metrics & Engagement")}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="p-3 bg-cream/5 rounded-2xl border border-border/20 text-left">
                <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5">
                  <span className="text-sky-600">📊</span> {t("Konversion", "Conversion")}
                </p>
                <p className="text-xl font-bold font-display text-sky-600 mt-1">
                  {q.data.conversionRate}%
                </p>
              </div>
              <div className="p-3 bg-cream/5 rounded-2xl border border-border/20 text-left">
                <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5">
                  <span className="text-sky-600">👀</span> {t("Profilaufrufe", "Profile Views")}
                </p>
                <p className="text-xl font-bold font-display text-sky-600 mt-1">
                  {q.data.profileViews || 0}
                </p>
              </div>
              <div className="p-3 bg-cream/5 rounded-2xl border border-border/20 text-left">
                <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5">
                  <span className="text-forest">🔄</span> {t("Kundenbindung", "Retention")}
                </p>
                <p className="text-xl font-bold font-display text-forest mt-1">
                  {q.data.customerRetentionRate}%
                </p>
              </div>
              <div className="p-3 bg-cream/5 rounded-2xl border border-border/20 text-left col-span-1 sm:col-span-2 lg:col-span-1">
                <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5">
                  <span className="text-forest">⭐</span> {t("Beliebt", "Popular")}
                </p>
                <p
                  className="text-xs font-bold font-display truncate mt-2.5"
                  title={q.data.popularDish}
                >
                  {q.data.popularDish || "N/A"}
                </p>
              </div>
              <div className="p-3 bg-cream/5 rounded-2xl border border-border/20 text-left">
                <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5">
                  <span className="text-rose-600">❌</span> {t("Storniert", "Cancelled")}
                </p>
                <p className="text-xl font-bold font-display text-rose-600 mt-1">
                  {q.data.cancelledOrders}
                </p>
              </div>
            </div>
          </div>

          {q.data.pendingOrders > 0 && (
            <div className="rounded-2xl bg-forest/10 border border-forest/20 p-4 text-left shadow-sm">
              <p className="text-forest font-medium text-xs flex items-center gap-2">
                <span>⏱️</span>{" "}
                {t(
                  `Sie haben ${q.data.pendingOrders} offene Anfragen, die Aufmerksamkeit erfordern. Gehen Sie zum Reiter "Anfragen", um Details zu sehen.`,
                  `You have ${q.data.pendingOrders} pending leads that require attention. Go to the Leads tab to view details.`,
                )}
              </p>
            </div>
          )}

          {/* Service Categories Guidance */}
          <ServiceCategoriesGuidance />
        </div>

        {/* Right Column: Operations Sidebar & Onboarding */}
        <aside className="space-y-6">
          {/* Onboarding Checklist Card */}
          {(!allDone || !checklistCollapsed) && (
            <div className="surface-card p-5 border border-[#eadfce]/45 bg-cream/10 rounded-3xl shadow-sm text-left space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-sm text-forest flex items-center gap-2">
                  <span>🏁</span> {t("Einrichtungs-Checkliste", "Setup Checklist")}
                </h3>
                <span className="text-[10px] bg-forest/10 text-forest px-2 py-0.5 rounded-full font-bold">
                  {completedCount}/5 {t("Erledigt", "Done")}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-border/40 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-forest h-full transition-all duration-300"
                  style={{ width: `${(completedCount / 5) * 100}%` }}
                />
              </div>

              {/* Checklist Items */}
              <div className="space-y-1.5 pt-1">
                {steps.map((s, idx) => {
                  const isNext = nextStep?.id === s.id;
                  return (
                    <Link
                      key={s.id}
                      to="/caterer"
                      search={{ tab: s.tab }}
                      className={`group flex items-start gap-2.5 p-2 rounded-xl border transition-all cursor-pointer ${
                        isNext
                          ? "bg-white border-forest/30 shadow-sm hover:border-forest hover:bg-forest/5"
                          : s.done
                            ? "bg-transparent border-transparent hover:bg-forest/5"
                            : "bg-transparent border-transparent hover:bg-forest/5"
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 text-[8px] font-bold mt-0.5 border ${
                          s.done
                            ? "bg-forest border-forest text-white"
                            : isNext
                              ? "border-forest text-forest bg-forest/10"
                              : "border-muted text-muted-foreground"
                        }`}
                      >
                        {s.done ? "✓" : idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-[11px] font-bold group-hover:text-forest transition-colors ${
                              s.done ? "text-forest/60 line-through" : "text-forest"
                            }`}
                          >
                            {s.label}
                          </h4>
                          <span className="text-[10px] text-forest/70 font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 shrink-0 ml-1">
                            <span>{t("Öffnen", "Open")}</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                        {isNext && (
                          <div className="mt-1 space-y-1">
                            <p className="text-[10px] text-forest/75 leading-relaxed bg-forest/5 p-1.5 rounded-lg border border-forest/10">
                              {s.desc}
                            </p>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-forest group-hover:underline">
                              <span>{t("Jetzt konfigurieren", "Configure now")}</span>
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>

              {!allDone && nextStep && (
                <Link
                  to="/caterer"
                  search={{ tab: nextStep.tab }}
                  className="block pt-2 border-t border-border/30 group hover:opacity-90 cursor-pointer"
                >
                  <p className="text-[10px] text-muted-foreground flex items-center justify-between">
                    <span>
                      {t("Nächster empfohlener Schritt: ", "Next recommended action: ")}
                      <span className="font-semibold text-forest underline">{nextStep.label}</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-forest group-hover:translate-x-0.5 transition-transform" />
                  </p>
                </Link>
              )}
            </div>
          )}

          {/* Storefront Operations card */}
          <div className="surface-card p-5 border border-[#eadfce]/45 bg-white rounded-3xl shadow-sm text-left space-y-4">
            <h3 className="font-display font-bold text-sm text-forest">
              {t("Storefront-Status", "Storefront Status")}
            </h3>

            <div className="space-y-2.5 text-xs text-forest/80">
              <div className="flex justify-between items-center py-1.5 border-b border-border/30">
                <span className="text-muted-foreground text-[11px]">
                  {t("Subdomain", "Subdomain")}
                </span>
                <span className="font-mono text-[10px] font-semibold text-forest">
                  {caterer.slug}.speisely.de
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-border/30">
                <span className="text-muted-foreground text-[11px]">
                  {t("Eigene Domain", "Custom Domain")}
                </span>
                <span
                  className="font-mono text-[10px] font-semibold text-forest truncate max-w-[150px]"
                  title={caterer.custom_domain || "None"}
                >
                  {caterer.custom_domain || t("Nicht konfiguriert", "Not configured")}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-muted-foreground text-[11px]">
                  {t("Postleitzahlen", "Postal Codes")}
                </span>
                <span className="font-mono text-[10px] font-semibold text-forest truncate max-w-[150px]">
                  {caterer.service_areas || t("Nicht konfiguriert", "Not configured")}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={`https://${caterer.slug}.speisely.de`}
                target="_blank"
                rel="noreferrer"
                className="w-full text-center rounded-full bg-forest text-[10px] font-bold text-white py-2 hover:opacity-90 transition cursor-pointer"
              >
                {t("Storefront öffnen ↗", "Open Storefront ↗")}
              </a>
              <a
                href="#profile"
                className="w-full text-center rounded-full border border-forest/25 text-[10px] font-bold text-forest py-2 hover:bg-forest/5 transition"
              >
                {t("Domain-Setup bearbeiten", "Edit Domain Setup")}
              </a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function BusinessProfileSection() {
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
  const qc = useQueryClient();
  const fetchBriefs = useServerFn(getCatererBriefs);
  const q = useQuery({
    queryKey: ["caterer", "briefs"],
    queryFn: () => fetchBriefs(),
  });
  const upsert = useServerFn(updateMyCatererSettings);

  const caterer = q.data?.caterer;

  const [name, setName] = useState(caterer?.name || "");
  const [desc, setDesc] = useState(caterer?.description || "");
  const [phone, setPhone] = useState(caterer?.phone || "");
  const [address, setAddress] = useState(caterer?.business_address || "");
  const [logoPreview, setLogoPreview] = useState(caterer?.logo_url || null);
  const [bannerPreview, setBannerPreview] = useState(caterer?.banner_image_url || null);
  const [logoPath, setLogoPath] = useState(caterer?.logo_url || null);
  const [bannerPath, setBannerPath] = useState(caterer?.banner_image_url || null);
  const [useGeneratedBranding, setUseGeneratedBranding] = useState(
    caterer?.use_generated_branding || false,
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serviceAreas, setServiceAreas] = useState((caterer as any)?.service_areas || "");
  const [certifications, setCertifications] = useState((caterer as any)?.certifications || "");

  const logoRef = React.useRef<HTMLInputElement>(null);
  const bannerRef = React.useRef<HTMLInputElement>(null);

  if (!caterer) return null;

  async function handleImage(file: File, type: "logo" | "banner") {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${caterer!.id}/${type}-${crypto.randomUUID()}.${ext}`;
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
      toast.error("Upload failed: " + e.message);
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
          service_areas: serviceAreas,
          certifications,
          use_generated_branding: useGeneratedBranding,
        },
      });
      toast.success("Settings saved successfully!");
      qc.invalidateQueries({ queryKey: ["caterer"] });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  const CATERING_BANNER_PRESETS = [
    {
      id: "event",
      title: tt("Event & Buffet Catering", "Event & Buffet Catering"),
      url: "/images/event_catering_hero.webp",
      tag: "🥂 Event Buffet",
    },
    {
      id: "office",
      title: tt("Business & Office Catering", "Business & Office Catering"),
      url: "/images/office_catering_hero.webp",
      tag: "💼 Office Catering",
    },
    {
      id: "bbq",
      title: tt("BBQ & Grill Catering", "BBQ & Grill Catering"),
      url: "/images/banner_burger.webp",
      tag: "🍖 BBQ & Grill",
    },
    {
      id: "fine_dining",
      title: tt("Fine Dining & Plated", "Fine Dining & Plated"),
      url: "/images/business_lunch_plating.webp",
      tag: "🍽️ Plated Menu",
    },
    {
      id: "institutional",
      title: tt("Großverpflegung & Kantine", "Institutional & Event"),
      url: "/images/institutional_catering_hero.webp",
      tag: "🏫 Institutional",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl">Business Profile</h2>
        <p className="text-sm text-muted-foreground">
          Manage your storefront presence, business details, and delivery operations.
        </p>
      </div>
      <div className="surface-card p-6 space-y-8 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2 flex flex-col items-start">
            <Label>{tt("Logo Bild", "Logo Image")}</Label>
            <div
              onClick={() => !uploading && logoRef.current?.click()}
              className="cursor-pointer border border-dashed border-[#e2e8e4] hover:border-forest/40 hover:bg-[#f8faf9] rounded-full p-1 flex items-center justify-center w-32 h-32 bg-[#f8faf9] transition-all duration-200 overflow-hidden relative group"
            >
              {logoPreview ? (
                <>
                  <img
                    src={logoPreview}
                    className="object-contain w-full h-full rounded-full p-1 bg-white"
                    alt="Logo"
                  />
                  <div className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[10px] font-semibold rounded-full">
                    {tt("Ändern", "Change")}
                  </div>
                </>
              ) : (
                <div className="text-center space-y-1">
                  <span className="text-xl block">📸</span>
                  <span className="text-[9px] font-semibold text-forest/70 block">
                    {tt("Logo wählen", "Choose Logo")}
                  </span>
                </div>
              )}
              <input
                ref={logoRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleImage(e.target.files[0], "logo");
                }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {tt(
                "Empfohlen: Quadratisches Logo/Icon (512x512 px). Wenn Ihr Logo breiten Text enthält, laden Sie es als Banner hoch.",
                "Recommended: Square Logo or Icon (512x512 px). If your logo has wide text, upload it as Banner Image.",
              )}
            </p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>{tt("Banner Bild", "Banner Image")}</Label>
            <div
              onClick={() => !uploading && bannerRef.current?.click()}
              className="cursor-pointer border border-dashed border-[#e2e8e4] hover:border-forest/40 hover:bg-[#f8faf9] rounded-2xl p-1 flex flex-col items-center justify-center w-full h-32 bg-[#f8faf9] transition-all duration-200 overflow-hidden relative group"
            >
              {bannerPreview ? (
                <>
                  <img
                    src={bannerPreview}
                    className="object-cover w-full h-full rounded-2xl"
                    alt="Banner"
                  />
                  <div className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs font-semibold rounded-2xl">
                    {tt("Bild ändern", "Change Image")}
                  </div>
                </>
              ) : (
                <div className="text-center space-y-1">
                  <span className="text-2xl block">🖼️</span>
                  <span className="text-[10px] font-semibold text-forest/70 block">
                    {tt("Banner wählen", "Choose Banner")}
                  </span>
                </div>
              )}
              <input
                ref={bannerRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleImage(e.target.files[0], "banner");
                }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {tt(
                "Empfohlen: Breites Banner-Bild (1200x400 px, 3:1 Format) oder wählen Sie eine Vorlage unten.",
                "Recommended: Wide Banner Image (1200x400 px, 3:1 Aspect Ratio) or select a preset below.",
              )}
            </p>
          </div>
        </div>

        {/* Catering Banner Presets Gallery */}
        <div className="pt-3 space-y-2">
          <Label className="text-xs font-bold text-forest flex items-center gap-1.5">
            ✨ {tt("Catering-Banner Galerie", "Catering Banner Presets Gallery")}
          </Label>
          <p className="text-[11px] text-forest/60">
            {tt(
              "Wählen Sie aus verschiedenen hochauflösenden Catering-Fotografien für Ihre Event-Ausrichtung:",
              "Choose from distinct high-resolution catering photography themes matching your service:",
            )}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1">
            {CATERING_BANNER_PRESETS.map((preset) => {
              const isSelected = bannerPath === preset.url;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setBannerPath(preset.url);
                    setBannerPreview(preset.url);
                    setUseGeneratedBranding(false);
                    toast.success(
                      tt(
                        `Catering-Vorlage ausgewählt: ${preset.title}`,
                        `Preset selected: ${preset.title}`,
                      ),
                    );
                  }}
                  className={`group relative rounded-xl overflow-hidden border-2 text-left transition-all cursor-pointer aspect-[3/1.8] flex flex-col justify-between p-2 ${
                    isSelected
                      ? "border-forest ring-2 ring-forest/20 shadow-md"
                      : "border-stone-200 hover:border-forest/50 hover:shadow-sm"
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <span className="relative z-10 text-[9px] font-bold text-white bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded self-start">
                    {preset.tag}
                  </span>
                  <span className="relative z-10 text-[10px] font-bold text-white leading-tight drop-shadow">
                    {preset.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {BRANDING_ASSISTANT_ENABLED && (
          <div className="p-4 bg-muted/40 border border-border rounded-lg space-y-4 text-left">
            <div>
              <h4 className="text-sm font-bold text-foreground">Speisely Branding Assistant</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Choose between your manually uploaded images or a clean Speisely-generated logo and
                banner.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setUseGeneratedBranding(false)}
                className={`cursor-pointer p-3 rounded-lg border-2 text-left transition-all ${
                  !useGeneratedBranding
                    ? "border-primary bg-background shadow-sm"
                    : "border-border bg-muted/50 hover:bg-muted"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    checked={!useGeneratedBranding}
                    onChange={() => setUseGeneratedBranding(false)}
                    className="mt-0.5 accent-primary"
                  />
                  <div>
                    <span className="text-xs font-bold block text-foreground">
                      My Uploaded Branding
                    </span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">
                      Uses uploaded files. Automatically falls back to Speisely default design if
                      files are missing.
                    </span>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setUseGeneratedBranding(true)}
                className={`cursor-pointer p-3 rounded-lg border-2 text-left transition-all ${
                  useGeneratedBranding
                    ? "border-primary bg-background shadow-sm"
                    : "border-border bg-muted/50 hover:bg-muted"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    checked={useGeneratedBranding}
                    onChange={() => setUseGeneratedBranding(true)}
                    className="mt-0.5 accent-primary"
                  />
                  <div>
                    <span className="text-xs font-bold block text-foreground">
                      Speisely-Generated Branding
                    </span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">
                      Automatically generates a clean logo monogram and geometric banner background
                      using your name.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {useGeneratedBranding && (
              <div className="p-3 bg-background border border-border rounded-lg space-y-3">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Live Preview of Generated Branding
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <img
                    src={generateSvgLogo(name || "Caterer", "Catering")}
                    className="w-14 h-14 rounded-full border border-border shadow-sm"
                    alt="Generated Logo Preview"
                  />
                  <img
                    src={generateSvgBanner(name || "Caterer", "Catering")}
                    className="w-full sm:w-60 h-14 rounded-lg object-cover border border-border shadow-sm"
                    alt="Generated Banner Preview"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4 pt-4 border-t border-border">
          <div className="space-y-1.5">
            <Label>Caterer Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="flex items-center justify-between text-xs font-semibold text-forest">
                <span>{tt("Telefon", "Phone")}</span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  ({tt("Optional & Geschützt", "Optional & Private")})
                </span>
              </Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={tt(
                  "Nicht öffentlich (Plattform-Schutz)",
                  "Hidden from public customers",
                )}
                className="bg-white border-[#eadfce] focus-visible:ring-forest rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center justify-between text-xs font-semibold text-forest">
                <span>{tt("Adresse", "Address")}</span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  ({tt("Optional & Geschützt", "Optional & Private")})
                </span>
              </Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={tt(
                  "Nicht öffentlich (Plattform-Schutz)",
                  "Hidden from public customers",
                )}
                className="bg-white border-[#eadfce] focus-visible:ring-forest rounded-xl"
              />
            </div>
          </div>
          <div className="p-3 bg-forest/5 rounded-xl border border-forest/15 text-left space-y-1">
            <p className="text-[11px] font-semibold text-forest flex items-center gap-1.5">
              <span>🔒</span>{" "}
              {tt("Plattform-Datenschutz & Anfragenschutz", "Platform Privacy & Disintermediation Protection")}
            </p>
            <p className="text-[10px] text-forest/75 leading-relaxed">
              {tt(
                "Telefon und Adresse sind optional und werden niemals öffentlich auf Ihrem Storefront angezeigt. Alle Kundenanfragen, Angebote und Verträge laufen sicher über Speisely.",
                "Phone and Address are optional and never published on your public storefront. All customer inquiries, proposals, and bookings are handled securely through Speisely.",
              )}
            </p>
          </div>
          <div className="space-y-1.5">
            <Label>Zertifizierungen & Standards / Certifications & Standards (Optional)</Label>
            <Input
              value={certifications}
              onChange={(e) => setCertifications(e.target.value)}
              placeholder="z.B. Bio, HACCP, Halal, DGE-orientiert, Vegan, Allergy-Aware"
            />
            <p className="text-[10px] text-muted-foreground">
              Geben Sie Zertifizierungen durch Komma getrennt ein. Sie werden als storefront Badges
              angezeigt. (Comma-separated, e.g. Bio, HACCP, Halal)
            </p>
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

function PromotionsSection({
  vertical,
  availableItems = [],
}: {
  vertical: "restaurants" | "caterers" | "planners";
  availableItems?: string[];
}) {
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
  const fetchPromos = useServerFn(getMyPromoCodes);
  const createPromo = useServerFn(createPromoCode);
  const togglePromo = useServerFn(togglePromoCode);
  const qc = useQueryClient();

  const q = useSuspenseQuery({
    queryKey: ["promotions", vertical],
    queryFn: () => fetchPromos({ data: { vertical } }),
  });

  const [code, setCode] = useState("");
  const [type, setType] = useState<"percentage" | "fixed" | "free_delivery" | "free_item" | "bogo">(
    "percentage",
  );
  const [value, setValue] = useState("");
  const [promote, setPromote] = useState(true);
  const [appliesTo, setAppliesTo] = useState<string>("all");
  const [minOrder, setMinOrder] = useState("");
  const [freeItemName, setFreeItemName] = useState<string>("");
  const [requiredQty, setRequiredQty] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    if (!code.trim()) return setErr(tt("Code fehlt", "Missing code"));
    if ((type === "percentage" || type === "fixed") && (!value || isNaN(Number(value)))) {
      return setErr(tt("Ungültiger Wert", "Invalid value"));
    }
    if (type === "free_item" && !freeItemName) {
      return setErr(tt("Bitte ein Gratis-Produkt auswählen", "Please select a free product"));
    }
    if (type === "bogo" && (!requiredQty || isNaN(Number(requiredQty)))) {
      return setErr(tt("Ungültige Menge für BOGO", "Invalid quantity for BOGO"));
    }

    setCreating(true);
    try {
      await createPromo({
        data: {
          code: code.trim(),
          discount_type: type,
          discount_value: type === "percentage" || type === "fixed" ? Number(value) : 0,
          promote_on_storefront: promote,
          vertical,
          applies_to_product_name: appliesTo !== "all" ? appliesTo : undefined,
          min_order_value_cents:
            minOrder && !isNaN(Number(minOrder)) ? Math.round(Number(minOrder) * 100) : undefined,
          free_item_name: type === "free_item" ? freeItemName : undefined,
          required_qty: type === "bogo" ? Number(requiredQty) : undefined,
          starts_at: startsAt ? new Date(startsAt).toISOString() : undefined,
          ends_at: endsAt ? new Date(endsAt).toISOString() : undefined,
        },
      });
      await qc.invalidateQueries({ queryKey: ["promotions", vertical] });
      setCode("");
      setValue("");
      setAppliesTo("all");
      setMinOrder("");
      setFreeItemName("");
      setRequiredQty("");
      setStartsAt("");
      setEndsAt("");
      toast.success(tt("Promo-Code erstellt", "Promo code created"));
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setCreating(false);
    }
  };

  const getStatusBadge = (promo: any) => {
    const now = new Date();
    if (!promo.is_active) {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
          {tt("Inaktiv", "Inactive")}
        </span>
      );
    }
    if (promo.starts_at && new Date(promo.starts_at) > now) {
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
          {tt("Geplant", "Scheduled")}
        </span>
      );
    }
    if (promo.ends_at && new Date(promo.ends_at) < now) {
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
          {tt("Abgelaufen", "Expired")}
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
        {tt("Aktiv", "Active")}
      </span>
    );
  };

  const getPromoSummary = (promo: any) => {
    let text = "";
    if (promo.discount_type === "percentage") text = `${promo.discount_value}% OFF`;
    else if (promo.discount_type === "fixed") text = `€${promo.discount_value} OFF`;
    else if (promo.discount_type === "free_delivery")
      text = tt("Kostenlose Lieferung", "Free Delivery");
    else if (promo.discount_type === "free_item")
      text = tt(`Gratis ${promo.free_item_name}`, `Free ${promo.free_item_name}`);
    else if (promo.discount_type === "bogo")
      text = tt(
        `Kaufe ${promo.required_qty} erhalte 1 gratis`,
        `Buy ${promo.required_qty} get 1 free`,
      );

    if (promo.applies_to_product_name) text += ` (${promo.applies_to_product_name})`;
    return text;
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-bold text-black mb-1">
          {tt("Promotions & Gutscheine", "Promotions & Vouchers")}
        </h2>
        <p className="text-gray-500 text-sm">
          {tt(
            "Erstellen Sie Rabattcodes für Ihre Kunden.",
            "Create discount codes for your customers.",
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 border border-gray-100 bg-white shadow-sm rounded-2xl p-6 h-fit">
          <h3 className="font-semibold text-black mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-forest" />
            {tt("Neuen Code erstellen", "Create New Code")}
          </h3>
          <form onSubmit={handleCreate} className="space-y-4">
            {err && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">{err}</div>}

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Code</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="z.B. SOMMER20"
                className="w-full border-gray-200 rounded-xl focus:border-forest focus:ring-forest uppercase text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {tt("Rabatt-Typ", "Discount Type")}
              </label>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value as any);
                  setValue("");
                }}
                className="w-full border-gray-200 rounded-xl focus:border-forest focus:ring-forest text-sm"
              >
                <option value="percentage">{tt("Prozentsatz", "Percentage")}</option>
                <option value="fixed">{tt("Fester Betrag", "Fixed Amount")}</option>
                <option value="free_delivery">{tt("Kostenlose Lieferung", "Free Delivery")}</option>
                <option value="free_item">{tt("Gratis-Artikel", "Free Item")}</option>
                <option value="bogo">{tt("Kauf X erhalte 1 gratis", "Buy X Get 1 Free")}</option>
              </select>
            </div>

            {(type === "percentage" || type === "fixed") && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {tt("Wert", "Value")} {type === "percentage" ? "(%)" : "(€)"}
                </label>
                <input
                  type="number"
                  step="any"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="z.B. 10"
                  className="w-full border-gray-200 rounded-xl focus:border-forest focus:ring-forest text-sm"
                />
              </div>
            )}

            {type === "bogo" && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {tt("Benötigte Menge (X)", "Required Quantity (X)")}
                </label>
                <input
                  type="number"
                  min="1"
                  value={requiredQty}
                  onChange={(e) => setRequiredQty(e.target.value)}
                  placeholder="z.B. 2"
                  className="w-full border-gray-200 rounded-xl focus:border-forest focus:ring-forest text-sm"
                />
              </div>
            )}

            {type === "free_item" && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {tt("Gratis-Artikel", "Free Item")}
                </label>
                <select
                  value={freeItemName}
                  onChange={(e) => setFreeItemName(e.target.value)}
                  className="w-full border-gray-200 rounded-xl focus:border-forest focus:ring-forest text-sm"
                >
                  <option value="">{tt("Auswählen...", "Select...")}</option>
                  {availableItems.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {type !== "free_delivery" && type !== "free_item" && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {tt("Gilt für", "Applies to")}
                </label>
                <select
                  value={appliesTo}
                  onChange={(e) => setAppliesTo(e.target.value)}
                  className="w-full border-gray-200 rounded-xl focus:border-forest focus:ring-forest text-sm"
                >
                  <option value="all">{tt("Gesamte Bestellung", "Entire Order")}</option>
                  {availableItems.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {tt("Mindestbestellwert (€) (Optional)", "Min. Order Value (€) (Optional)")}
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                placeholder="z.B. 50"
                className="w-full border-gray-200 rounded-xl focus:border-forest focus:ring-forest text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {tt("Gültig ab (Optional)", "Valid From (Optional)")}
                </label>
                <input
                  type="datetime-local"
                  min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
                    .toISOString()
                    .slice(0, 16)}
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  className="w-full border-gray-200 rounded-xl focus:border-forest focus:ring-forest text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {tt("Gültig bis (Optional)", "Valid Until (Optional)")}
                </label>
                <input
                  type="datetime-local"
                  min={
                    startsAt ||
                    new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
                      .toISOString()
                      .slice(0, 16)
                  }
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                  className="w-full border-gray-200 rounded-xl focus:border-forest focus:ring-forest text-sm"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer mt-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <input
                type="checkbox"
                checked={promote}
                onChange={(e) => setPromote(e.target.checked)}
                className="rounded text-forest focus:ring-forest bg-white"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">
                  {tt("Im Shop ankündigen", "Announce on storefront")}
                </span>
                <span className="text-[10px] text-gray-500">
                  {tt("Zeigt ein Banner für alle Besucher", "Shows a banner to all visitors")}
                </span>
              </div>
            </label>

            <button
              disabled={creating}
              type="submit"
              className="w-full bg-forest hover:bg-forest/90 text-white font-medium py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {creating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Tag className="w-4 h-4" />
              )}
              {tt("Code Speichern", "Save Code")}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-semibold text-black flex items-center gap-2 px-1">
            <Ticket className="w-4 h-4 text-forest" />
            {tt("Ihre Codes", "Your Codes")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {q.data?.map((p: any) => (
              <div
                key={p.id}
                className={`bg-white border rounded-2xl p-5 transition-all shadow-sm ${p.is_active ? "border-gray-200" : "border-gray-100 opacity-60"}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg text-black">{p.code}</span>
                      {getStatusBadge(p)}
                    </div>
                    <span className="text-forest font-semibold text-sm">{getPromoSummary(p)}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={p.is_active}
                      onChange={async (e) => {
                        const active = e.target.checked;
                        await togglePromo({ data: { id: p.id, is_active: active } });
                        qc.invalidateQueries({ queryKey: ["promotions", vertical] });
                        if (active) toast.success(tt("Aktiviert", "Activated"));
                        else toast.success(tt("Deaktiviert", "Deactivated"));
                      }}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-forest"></div>
                  </label>
                </div>
                <div className="space-y-1 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                  {p.min_order_value_cents > 0 && (
                    <p>
                      • {tt("Mindestbestellwert:", "Min. Spend:")} €
                      {(p.min_order_value_cents / 100).toFixed(2)}
                    </p>
                  )}
                  {p.starts_at && (
                    <p>
                      • {tt("Start:", "Starts:")} {new Date(p.starts_at).toLocaleString()}
                    </p>
                  )}
                  {p.ends_at && (
                    <p>
                      • {tt("Ende:", "Ends:")} {new Date(p.ends_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {q.data?.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50/50 rounded-2xl border border-gray-100 border-dashed">
                <Ticket className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                <p>{tt("Noch keine Codes erstellt", "No codes created yet")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LogisticsSection() {
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
  const qc = useQueryClient();
  const fetchBriefs = useServerFn(getCatererBriefs);
  const q = useSuspenseQuery({
    queryKey: ["caterer", "briefs"],
    queryFn: () => fetchBriefs(),
  });
  const upsert = useServerFn(updateMyCatererSettings);

  const caterer = q.data?.caterer;

  // Initialize service areas token chips
  const rawAreas = (caterer as any)?.service_areas || "";
  const initialChips = React.useMemo(() => {
    return rawAreas
      .split(/[,;\n\s]+/)
      .map((s: string) => s.trim())
      .filter(Boolean);
  }, [rawAreas]);

  const [postalChips, setPostalChips] = useState<string[]>(initialChips);
  const [chipInput, setChipInput] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(((caterer as any)?.delivery_fee_cents || 0) / 100);
  const [minDelivery, setMinDelivery] = useState(((caterer as any)?.min_delivery_cents || 0) / 100);
  const [maxDistance, setMaxDistance] = useState((caterer as any)?.max_delivery_distance_km || 0);
  const [acceptsInquiries, setAcceptsInquiries] = useState(
    (caterer as any)?.accepts_inquiries ?? true,
  );

  // Option B: Outside-Area Inquiry Intake Toggle
  const [acceptsOutsideAreas, setAcceptsOutsideAreas] = useState<boolean>(
    (caterer as any)?.seo_logistics_details?.includes("outside_areas:false") ? false : true,
  );

  // Option B: Logistics Pricing Mode ("custom_quote" vs "fixed_fee")
  const [pricingMode, setPricingMode] = useState<"custom_quote" | "fixed_fee">(
    (caterer as any)?.seo_logistics_details?.includes("pricing_mode:fixed") ? "fixed_fee" : "custom_quote",
  );

  const [saving, setSaving] = useState(false);

  if (!caterer) return null;

  function handleAddChip() {
    const trimmed = chipInput.trim();
    if (!trimmed) return;
    const newItems = trimmed
      .split(/[,;\n\s]+/)
      .map((s) => s.trim())
      .filter((s) => s && !postalChips.includes(s));

    if (newItems.length > 0) {
      setPostalChips([...postalChips, ...newItems]);
      setChipInput("");
    }
  }

  function handleRemoveChip(indexToRemove: number) {
    setPostalChips(postalChips.filter((_, idx) => idx !== indexToRemove));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      handleAddChip();
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const combinedServiceAreas = postalChips.join(", ");
      const logisticsMetaStr = `pricing_mode:${pricingMode};outside_areas:${acceptsOutsideAreas}`;

      await upsert({
        data: {
          name: caterer!.name, // Required by schema
          service_areas: combinedServiceAreas,
          delivery_fee_cents: pricingMode === "custom_quote" ? 0 : Math.round(deliveryFee * 100),
          min_delivery_cents: Math.round(minDelivery * 100),
          max_delivery_distance_km: maxDistance,
          accepts_inquiries: acceptsInquiries,
          seo_logistics_details: logisticsMetaStr,
        },
      });
      toast.success(
        tt("Logistik-Einstellungen erfolgreich gespeichert!", "Logistics settings saved successfully!"),
      );
      qc.invalidateQueries({ queryKey: ["caterer"] });
    } catch (e: any) {
      toast.error(e.message || tt("Fehler beim Speichern", "Failed to save settings"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6 text-left">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl text-forest">
          {tt("Logistik & Lieferoptionen", "Logistics & Delivery")}
        </h2>
        <p className="text-xs text-muted-foreground">
          {tt(
            "Verwalte deine primären Liefergebiete, Anfragen-Regeln und Catering-Logistikpreise.",
            "Manage your primary service zones, inquiry preferences, and catering logistics pricing.",
          )}
        </p>
      </div>

      <div className="surface-card p-6 space-y-8 max-w-3xl bg-white border border-[#eadfce]/40 rounded-3xl shadow-sm">
        {/* Toggle 1: General Inquiry Acceptance */}
        <div className="flex items-center justify-between border border-[#eadfce]/60 rounded-2xl p-4 bg-[#f8faf9]">
          <div>
            <Label htmlFor="accepts-inquiries" className="font-semibold text-forest text-sm">
              {tt("Neue Catering-Anfragen annehmen", "Accept New Inquiries")}
            </Label>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {tt(
                "Ermöglicht Kunden, neue Anfragen für Catering-Events einzureichen.",
                "Allows clients to submit new event inquiries on your storefront.",
              )}
            </p>
          </div>
          <Switch
            id="accepts-inquiries"
            checked={acceptsInquiries}
            onCheckedChange={setAcceptsInquiries}
          />
        </div>

        {/* Toggle 2: Option B Out-of-Area Leads Intake */}
        <div className="flex items-center justify-between border border-[#eadfce]/60 rounded-2xl p-4 bg-[#f8faf9]">
          <div>
            <Label htmlFor="accepts-outside-areas" className="font-semibold text-forest text-sm flex items-center gap-1.5">
              <span>🌐</span>
              {tt(
                "Anfragen außerhalb der primären Gebiete erlauben?",
                "Accept inquiries from outside primary areas?",
              )}
            </Label>
            <p className="text-[11px] text-muted-foreground mt-0.5 max-w-lg leading-relaxed">
              {tt(
                "Ermöglicht Kunden aus Nachbarregionen, individuelle Anfragen zu stellen. Du kannst jedes Angebot flexibel annehmen oder ablehnen.",
                "Allows potential clients from neighboring regions to send inquiry requests. You maintain full flexibility to accept or decline each proposal based on event scale.",
              )}
            </p>
          </div>
          <Switch
            id="accepts-outside-areas"
            checked={acceptsOutsideAreas}
            onCheckedChange={setAcceptsOutsideAreas}
          />
        </div>

        {/* Section 2: Tokenized Postal Codes / Service Areas */}
        <div className="space-y-3 pt-2">
          <h3 className="font-semibold text-base text-forest flex items-center gap-2">
            <span>📍</span> {tt("Primäre Liefergebiete & Postleitzahlen", "Primary Service Areas & Postal Codes")}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {tt(
              "Gib Postleitzahlen oder Ortsteile ein (z. B. 41061, 41063, Düsseldorf, Köln). Drücke Komma, Leerzeichen oder Eingabe zum Hinzufügen.",
              "Enter postal codes or zone names (e.g. 41061, 41063, Düsseldorf). Press Enter, Space, or Comma to add.",
            )}
          </p>

          {/* Postal Code Chips Display */}
          <div className="border border-[#eadfce] rounded-2xl p-3 bg-white space-y-3">
            <div className="flex flex-wrap gap-2 items-center min-h-[38px]">
              {postalChips.map((chip, idx) => (
                <span
                  key={chip + idx}
                  className="inline-flex items-center gap-1.5 bg-forest/10 border border-forest/20 text-forest font-medium text-xs px-3 py-1 rounded-full shadow-xs transition hover:bg-forest/15"
                >
                  <span>{chip}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChip(idx)}
                    className="text-forest/60 hover:text-rose-600 font-bold ml-0.5 text-xs rounded-full w-4 h-4 inline-flex items-center justify-center"
                    title={tt("Entfernen", "Remove")}
                  >
                    ×
                  </button>
                </span>
              ))}
              {postalChips.length === 0 && (
                <span className="text-xs text-muted-foreground/60 italic">
                  {tt("Noch keine Gebiete hinzugefügt. Gib oben PLZs ein.", "No service areas added yet. Enter zip codes above.")}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-[#eadfce]/40">
              <Input
                value={chipInput}
                onChange={(e) => setChipInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={tt("z. B. 41061 oder Düsseldorf eingeben…", "e.g. enter 41061 or Düsseldorf…")}
                className="text-sm bg-gray-50/50 border-[#eadfce] focus-visible:ring-forest rounded-xl"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddChip}
                className="shrink-0 text-xs border-forest/20 text-forest hover:bg-forest/5 rounded-xl font-medium"
              >
                + {tt("Hinzufügen", "Add")}
              </Button>
            </div>
          </div>
        </div>

        {/* Section 3: Catering Delivery Pricing Mode */}
        <div className="space-y-4 pt-4 border-t border-[#eadfce]/40">
          <h3 className="font-semibold text-base text-forest flex items-center gap-2">
            <span>🚚</span> {tt("Catering-Lieferkosten & Logistik-Modell", "Catering Logistics & Delivery Pricing")}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mode 1: Custom Quote Delivery Pricing */}
            <div
              onClick={() => setPricingMode("custom_quote")}
              className={`cursor-pointer border rounded-2xl p-4 transition-all flex flex-col justify-between space-y-2 ${
                pricingMode === "custom_quote"
                  ? "border-forest bg-forest/5 ring-1 ring-forest/30"
                  : "border-[#eadfce] bg-white hover:border-forest/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-forest">
                  {tt("Individuelles Angebot", "Custom Quote Pricing")}
                </span>
                <input
                  type="radio"
                  name="pricing_mode"
                  checked={pricingMode === "custom_quote"}
                  onChange={() => setPricingMode("custom_quote")}
                  className="accent-forest"
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {tt(
                  "Lieferkosten werden im Angebot individuell berechnet (basierend auf Entfernung, Personal & Transport).",
                  "Delivery & logistics costs will be calculated individually per event proposal.",
                )}
              </p>
            </div>

            {/* Mode 2: Fixed Base Fee */}
            <div
              onClick={() => setPricingMode("fixed_fee")}
              className={`cursor-pointer border rounded-2xl p-4 transition-all flex flex-col justify-between space-y-2 ${
                pricingMode === "fixed_fee"
                  ? "border-forest bg-forest/5 ring-1 ring-forest/30"
                  : "border-[#eadfce] bg-white hover:border-forest/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-forest">
                  {tt("Feste Grundgebühr", "Fixed Base Fee")}
                </span>
                <input
                  type="radio"
                  name="pricing_mode"
                  checked={pricingMode === "fixed_fee"}
                  onChange={() => setPricingMode("fixed_fee")}
                  className="accent-forest"
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {tt(
                  "Festpreis für Anfahrt + Mindestbestellwert für alle Bestellungen festlegen.",
                  "Set a fixed base delivery fee and minimum subtotal for all bookings.",
                )}
              </p>
            </div>
          </div>

          {/* Conditional Delivery Fee Controls when Fixed Fee mode active */}
          {pricingMode === "fixed_fee" ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{tt("Liefergebühr (€)", "Delivery Fee (€)")}</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={deliveryFee || ""}
                  onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="bg-white border-[#eadfce] rounded-xl text-sm"
                />
                <p className="text-[10px] text-muted-foreground">
                  {tt("Pauschale Anfahrtsgebühr", "Flat rate delivery fee")}
                </p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{tt("Mindestbestellwert (€)", "Minimum Order (€)")}</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={minDelivery || ""}
                  onChange={(e) => setMinDelivery(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="bg-white border-[#eadfce] rounded-xl text-sm"
                />
                <p className="text-[10px] text-muted-foreground">
                  {tt("Mindestwert pro Auftrag", "Minimum event subtotal")}
                </p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{tt("Max. Radius (km)", "Max Radius (km)")}</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={maxDistance || ""}
                  onChange={(e) => setMaxDistance(parseFloat(e.target.value) || 0)}
                  placeholder="20"
                  className="bg-white border-[#eadfce] rounded-xl text-sm"
                />
                <p className="text-[10px] text-muted-foreground">
                  {tt("Maximaler Lieferradius", "Maximum delivery radius")}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-forest/5 rounded-2xl border border-forest/15 text-left text-[11px] text-forest/80 leading-relaxed flex items-center gap-2">
              <span className="text-base">💡</span>
              <span>
                {tt(
                  "Individuelles Angebot gewählt: Liefer- und Transportkosten werden für jede Anfrage direkt bei der Angebotserstellung kalkuliert.",
                  "Custom quote mode active: Transport and staffing logistics will be entered individually when creating event proposals.",
                )}
              </span>
            </div>
          )}
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-4 bg-forest hover:bg-forest/90 text-white font-semibold py-3 rounded-2xl transition shadow-sm"
        >
          {saving
            ? tt("Wird gespeichert…", "Saving Logistics…")
            : tt("Logistik-Einstellungen speichern", "Save Logistics Settings")}
        </Button>
      </div>
    </section>
  );
}

function ServiceCategoriesGuidance() {
  const { t } = useI18n();
  return (
    <div className="space-y-6 text-left">
      <div className="border-t border-[#eadfce]/30 pt-8">
        <h3 className="font-display text-xl font-bold text-forest">
          {t("Service-Kategorien & Onboarding-Hilfe", "Service Categories & Setup Guidance")}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
          {t(
            "Konfiguriere dein Dashboard passend zu diesen Zielgruppen, um in entsprechenden Suchen zu erscheinen.",
            "To appear in specific client searches, configure your dashboard settings according to these target segment expectations.",
          )}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1: Event Catering */}
        <div className="surface-card p-6 border border-[#eadfce]/45 rounded-3xl bg-white flex flex-col justify-between hover:shadow-md transition">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-forest/10 px-2.5 py-0.5 text-[10px] font-bold text-forest uppercase tracking-wider">
              {t("Einmalige Events", "One-Off Events")}
            </span>
            <h4 className="font-display text-base font-bold text-forest">
              {t("Event-Catering", "Event Catering")}
            </h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {t(
                "Für Hochzeiten, private Feiern und Firmen-Events.",
                "Targeting weddings, private parties, and corporate functions.",
              )}
            </p>

            <div className="space-y-2 pt-1 text-[11px] leading-relaxed text-[#5c6f68]">
              <p>
                <strong>{t("Erwartung:", "Expectations:")}</strong>{" "}
                {t(
                  "Flexible Menüs, Diät-Anpassungen & Servicepersonal.",
                  "Flexible menu selections, dietary options & service staffing.",
                )}
              </p>
              <p>
                <strong>{t("Aktion:", "Action:")}</strong>{" "}
                {t(
                  "Erstelle modulare Pakete im Menü-Manager & verfeinere dein Profil.",
                  "Create modular packages in Menu Manager & refine your profile.",
                )}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#eadfce]/30 grid grid-cols-2 gap-3">
            <Link
              to="/caterer"
              search={{ tab: "menu" }}
              className="inline-flex items-center justify-center rounded-full bg-forest text-[10px] font-semibold text-white px-3 py-2 hover:opacity-90 transition text-center cursor-pointer"
            >
              {t("Pakete anlegen", "Set up packages")}
            </Link>
            <Link
              to="/catering/events"
              className="inline-flex items-center justify-center rounded-full border border-forest/20 text-[10px] font-semibold text-forest px-3 py-2 hover:bg-forest/5 transition text-center"
            >
              {t("Vorschau", "Preview page")}
            </Link>
          </div>
        </div>

        {/* Card 2: Daily Catering Subscriptions */}
        <div className="surface-card p-6 border border-[#eadfce]/45 rounded-3xl bg-white flex flex-col justify-between hover:shadow-md transition">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-forest/10 px-2.5 py-0.5 text-[10px] font-bold text-forest uppercase tracking-wider">
              {t("Wiederkehrende Teams", "Recurring Teams")}
            </span>
            <h4 className="font-display text-base font-bold text-forest">
              {t("Tägliche Catering-Abos", "Daily Catering Subscriptions")}
            </h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {t(
                "Für Büros, Team-Lunches und regelmäßige Firmen-Abos.",
                "Targeting offices, team lunches, and recurring corporate subscriptions.",
              )}
            </p>

            <div className="space-y-2 pt-1 text-[11px] leading-relaxed text-[#5c6f68]">
              <p>
                <strong>{t("Erwartung:", "Expectations:")}</strong>{" "}
                {t(
                  "Pünktliche tägliche Lieferung, wöchentliche Rotation & Allergenangaben.",
                  "Reliable daily delivery, weekly rotation & clear allergen info.",
                )}
              </p>
              <p>
                <strong>{t("Aktion:", "Action:")}</strong>{" "}
                {t(
                  "Erstelle wöchentliche Menüpläne und pflege Postleitzahlen in der Logistik ein.",
                  "Set up weekly menu plans and configure delivery zip codes in Logistics.",
                )}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#eadfce]/30 grid grid-cols-2 gap-3">
            <Link
              to="/caterer"
              search={{ tab: "logistics" }}
              className="inline-flex items-center justify-center rounded-full bg-forest text-[10px] font-semibold text-white px-3 py-2 hover:opacity-90 transition text-center cursor-pointer"
            >
              {t("Logistik einrichten", "Configure logistics")}
            </Link>
            <Link
              to="/catering/daily-catering-subscriptions"
              className="inline-flex items-center justify-center rounded-full border border-forest/20 text-[10px] font-semibold text-forest px-3 py-2 hover:bg-forest/5 transition text-center"
            >
              {t("Vorschau", "Preview page")}
            </Link>
          </div>
        </div>

        {/* Card 3: Institutional Catering */}
        <div className="surface-card p-6 border border-[#eadfce]/45 rounded-3xl bg-white flex flex-col justify-between hover:shadow-md transition">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-forest/10 px-2.5 py-0.5 text-[10px] font-bold text-forest uppercase tracking-wider">
              {t("Gemeinschaftsverpflegung", "Institutional Verpflegung")}
            </span>
            <h4 className="font-display text-base font-bold text-forest">
              {t("Care- & Schul-Catering", "Institutional Catering")}
            </h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {t(
                "Für Schulen, Kitas, Kliniken und Kantinen-Verpflegung.",
                "Targeting schools, kitas, clinics, and high-frequency canteen programs.",
              )}
            </p>

            <div className="space-y-2 pt-1 text-[11px] leading-relaxed text-[#5c6f68]">
              <p>
                <strong>{t("Erwartung:", "Expectations:")}</strong>{" "}
                {t(
                  "Zertifizierungen (DGE, Bio), HACCP-Richtlinien & hohe Kapazität.",
                  "Certifications (DGE, Bio), HACCP compliance & high volume capacity.",
                )}
              </p>
              <p>
                <strong>{t("Aktion:", "Action:")}</strong>{" "}
                {t(
                  "Hinterlege Zertifikate und beschreibe deine HACCP-Abläufe im Profil.",
                  "List certifications and describe your HACCP workflows in your profile.",
                )}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#eadfce]/30 grid grid-cols-2 gap-3">
            <Link
              to="/caterer"
              search={{ tab: "settings" }}
              className="inline-flex items-center justify-center rounded-full bg-forest text-[10px] font-semibold text-white px-3 py-2 hover:opacity-90 transition text-center cursor-pointer"
            >
              {t("Profil pflegen", "Update profile")}
            </Link>
            <Link
              to="/catering/institutional-catering"
              className="inline-flex items-center justify-center rounded-full border border-forest/20 text-[10px] font-semibold text-forest px-3 py-2 hover:bg-forest/5 transition text-center"
            >
              {t("Vorschau", "Preview page")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

class DashboardErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; isAuthError: boolean; message: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, isAuthError: false, message: "" };
  }

  static getDerivedStateFromError(error: unknown) {
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
    console.error("[CatererDashboardErrorBoundary]", error);
    if (this.state.isAuthError) {
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
            <p className="text-muted-foreground font-semibold text-sm">Session expired. Redirecting to sign in…</p>
          </div>
        </div>
      );
    }
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream p-6">
        <div className="surface-card p-8 text-center max-w-md space-y-4">
          <h3 className="font-display text-xl text-forest">Dashboard Section Loading Error</h3>
          <p className="text-xs text-muted-foreground">{this.state.message || "An unexpected error occurred while rendering this section."}</p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => this.setState({ hasError: false, isAuthError: false, message: "" })}
              className="px-4 py-2 bg-forest text-white text-xs font-semibold rounded-full hover:bg-forest/90"
            >
              Try Again
            </button>
            <a href="/caterer" className="px-4 py-2 border border-forest/20 text-forest text-xs font-semibold rounded-full hover:bg-forest/5">
              Reset Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }
}

function CatererDashboardInner() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const fetchBriefs = useServerFn(getCatererBriefs);
  const q = useSuspenseQuery({
    queryKey: ["caterer", "briefs"],
    queryFn: () => fetchBriefs(),
  });

  useSpeiselyPing(q.data?.caterer?.id, ["catering_briefs", "brief_messages"]);
  const search = Route.useSearch();
  let activeTab = search.tab || "overview";
  if (activeTab === "settings" || activeTab === "settings-general" || activeTab === "settings-storefront" || activeTab.startsWith("settings-")) {
    activeTab = "profile";
  }
  if (!q.data?.caterer) {
    return (
      <VendorLayout
        vertical="caterer"
        title={t("Caterer-Dashboard", "Caterer Dashboard")}
        activeTab={activeTab}
      >
        <div className="max-w-5xl mx-auto space-y-10 py-6">
          {/* Guided Split-Onboarding Block */}
          <div className="surface-card p-6 border border-[#eadfce]/50 bg-cream/15 rounded-3xl shadow-sm grid md:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
            <div className="space-y-4 text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-forest">
                <Sparkles className="h-3 w-3 animate-pulse" />{" "}
                {t("Onboarding-Checkliste", "Onboarding Checklist")}
              </span>
              <h2 className="text-2xl font-display font-bold text-forest leading-tight">
                {t("Willkommen bei Speisely", "Welcome to Speisely")}
              </h2>
              <p className="text-xs text-forest/75 leading-relaxed">
                {t(
                  "Veröffentliche dein Catering-Storefront und erreiche Kunden vor Ort in vier einfachen Schritten:",
                  "Launch your catering storefront and reach local demand in four simple steps:",
                )}
              </p>

              {/* Onboarding Sequence Steps */}
              <div className="space-y-3 pt-1">
                <div className="flex gap-2.5 items-start">
                  <div className="h-5 w-5 rounded-full bg-forest text-white flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-forest">
                      {t("1. Setup verstehen", "1. Understand the Setup")}
                    </h4>
                    <p className="text-[10px] text-forest/65">
                      {t(
                        "Verbinde dich direkt mit Privat- und Firmenkunden, die Catering suchen.",
                        "Connect directly with private and corporate clients seeking catering.",
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="h-5 w-5 rounded-full border-2 border-forest bg-cream text-forest flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-forest">
                      {t("2. Storefront erstellen", "2. Create Storefront")}{" "}
                      <span className="ml-1 text-[9px] font-normal text-forest">
                        {t("(Aktion erforderlich)", "(Action Required)")}
                      </span>
                    </h4>
                    <p className="text-[10px] text-forest/65">
                      {t(
                        "Fülle das Storefront-Registrierungsformular auf der rechten Seite aus.",
                        "Complete the storefront registration form on the right.",
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="h-5 w-5 rounded-full border-2 border-[#eadfce] bg-transparent text-muted-foreground flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-muted-foreground">
                      {t("3. Service-Kategorie wählen", "3. Choose Service Category Focus")}
                    </h4>
                    <p className="text-[10px] text-muted-foreground/65">
                      {t(
                        "Beachte die Onboarding-Hilfe für Service-Kategorien unten.",
                        "Check the operational category guidance at the bottom.",
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="h-5 w-5 rounded-full border-2 border-[#eadfce] bg-transparent text-muted-foreground flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-muted-foreground">
                      {t("4. Profil & Pakete einrichten", "4. Complete Profile & Package Setup")}
                    </h4>
                    <p className="text-[10px] text-muted-foreground/65">
                      {t(
                        "Definiere Lieferregeln, lade Bilder hoch und erstelle Menüs.",
                        "Define delivery rules, upload assets, and list initial menus.",
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#eadfce]/40 shadow-sm">
              <h3 className="font-display font-semibold text-base text-forest mb-3 text-left">
                {t("Storefront registrieren", "Register Storefront")}
              </h3>
              <CreateCatererForm />
            </div>
          </div>

          {/* Service Categories Guidance */}
          <ServiceCategoriesGuidance />
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout
      vertical="caterer"
      title={`${q.data.caterer.name} ${t("Dashboard", "Dashboard")}`}
      storefrontSlug={q.data.caterer.slug || q.data.caterer.id}
      activeTab={activeTab}
    >
      <React.Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center min-h-[400px]">
            <div className="w-8 h-8 rounded-full border-4 border-forest/20 border-t-forest animate-spin" />
          </div>
        }
      >
        {activeTab === "overview" && <OverviewSection caterer={q.data.caterer} />}
        {activeTab === "briefs" && <BriefsSection />}
        {activeTab === "calendar" && <BlackoutCalendarSection vendorType="caterer" />}
        {activeTab === "menu" && <CatererMenuSection />}
        {activeTab === "promotions" && <PromotionsSection vertical="caterers" />}
        {activeTab === "marketing-seo" && (
          <CatererOnlinePresence
            caterer={q.data.caterer}
            onSave={async (slug, domain, seoTitle, seoDescription) => {
              const { updateMyCatererSettings } = await import("@/lib/caterer/queries.functions");
              await updateMyCatererSettings({
                data: {
                  name: q.data.caterer.name,
                  slug,
                  custom_domain: domain,
                  seo_title: seoTitle,
                  seo_description: seoDescription,
                },
              });
              qc.invalidateQueries({ queryKey: ["caterer"] });
            }}
          />
        )}
        {activeTab === "logistics" && <LogisticsSection />}
        {activeTab === "profile" && (
          <div className="space-y-10">
            <BusinessProfileSection />
          </div>
        )}
      </React.Suspense>
    </VendorLayout>
  );
}

function CatererDashboard() {
  return (
    <DashboardErrorBoundary>
      <CatererDashboardInner />
    </DashboardErrorBoundary>
  );
}
