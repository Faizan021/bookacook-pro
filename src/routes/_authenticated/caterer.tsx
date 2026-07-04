import { createFileRoute, Link, useRouter, useLocation, redirect, isRedirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
import { useI18n } from "@/i18n/I18nProvider";
import { Checkbox } from "@/components/ui/checkbox";
import { updateMyConsent } from "@/lib/consent.functions";
import { CommunicationPreferences } from "@/components/vendor/CommunicationPreferences";
import { printEventBrief } from "@/utils/printEventBrief";
import { PrintOnboardingBanner } from "@/components/vendor/PrintOnboardingBanner";

import { getUserProfile } from "@/lib/auth/get-user-profile.functions";

export const Route = createFileRoute("/_authenticated/caterer")({
  ssr: false,
  beforeLoad: async () => {
    try {
      const profile = await getUserProfile();
      if (!profile.roles.includes("partner")) {
        throw redirect({
          to: "/auth",
          search: { 
            message: `Please sign in with a Business Partner account.`,
            logout: "true",
          },
        });
      }
    } catch (err) {
      if (isRedirect(err)) {
        throw err;
      }
      console.error("beforeLoad error on caterer dashboard:", err);
      throw redirect({
        to: "/auth",
        search: { 
          message: "Session expired or unauthorized. Please sign in again.",
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
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 shadow-sm text-xl">
        🥂
      </div>
      <h3 className="font-display text-lg font-bold text-forest">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground leading-relaxed">{description}</p>
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
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const mut = useMutation({
    mutationFn: (vars: { name: string; slug: string; custom_domain: string }) => create({ data: vars }),
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
        <Label htmlFor="cname" className="text-xs font-semibold text-forest/80">{t("Catering-Markenname", "Catering Brand Name")}</Label>
        <Input 
          id="cname" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder={t("z.B. Maison Verde Catering", "e.g. Maison Verde Catering")}
          required 
          className="bg-white border-[#eadfce] focus-visible:ring-emerald-500 rounded-xl"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cslug" className="text-xs font-semibold text-forest/80">{t("URL-Slug", "URL Slug")}</Label>
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
          className="bg-white border-[#eadfce] focus-visible:ring-emerald-500 rounded-xl"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="csubdomain" className="text-xs font-semibold text-forest/80">{t("Speisely Subdomain", "Speisely Subdomain")}</Label>
        <div className="flex items-center gap-2">
          <Input
            id="csubdomain"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            placeholder="maison-verde"
            required
            className="flex-1 bg-white border-[#eadfce] focus-visible:ring-emerald-500 rounded-xl"
          />
          <span className="text-muted-foreground text-sm font-semibold shrink-0">.speisely.de</span>
        </div>
        <p className="text-[10px] text-muted-foreground">{t("Dies wird die offizielle URL für deine Kunden sein.", "This will be your official client-facing storefront URL.")}</p>
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
          <Label htmlFor="signup-marketing-consent" className="text-xs font-medium text-forest cursor-pointer">
            {tt(
              "Ich möchte Updates, Branchen-Tipps und Angebote von Speisely erhalten (optional)",
              "I want to receive updates, industry tips, and promotions from Speisely (optional)"
            )}
          </Label>
        </div>
      </div>

      <Button type="submit" className="w-full rounded-full bg-forest hover:opacity-95 text-white py-2.5 font-semibold transition cursor-pointer mt-4" disabled={mut.isPending}>
        {mut.isPending ? t("Erstelle Storefront…", "Creating Storefront…") : t("Catering-Storefront erstellen", "Create Catering Storefront")}
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
    mutationFn: (vars: { briefId: string; status: BriefStatus }) =>
      updateStatus({ data: vars }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["caterer", "briefs"] }),
  });

  const [selectedBriefId, setSelectedBriefId] = useState<string | null>(
    q.data?.briefs?.[0]?.id || null
  );

  const [proposalBrief, setProposalBrief] = useState<any | null>(null);
  const [proposalAmount, setProposalAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [proposalNotes, setProposalNotes] = useState("");
  const proposalMut = useMutation({
    mutationFn: (vars: { briefId: string; proposalCents: number; depositCents: number; notes: string }) =>
      submitProposal({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["caterer", "briefs"] });
      setProposalBrief(null);
    },
  });

  const selectedBrief = q.data?.briefs?.find((b: any) => b.id === selectedBriefId);

  if (q.error) return <div className="surface-card p-8 text-center text-destructive">Could not load your leads. Please try again.</div>;
  if (!q.data?.caterer) return (
    <EmptyCard
      title="Create your storefront"
      description="Set up your brand to start receiving event briefs from customers on Speisely."
    >
      <CreateCatererForm />
    </EmptyCard>
  );

  if (q.data.briefs.length === 0) return (
    <div className="space-y-6">
      <div className="max-w-md mx-auto">
        <PrintOnboardingBanner type="a4" brandName={q.data.caterer.name} />
      </div>
      <EmptyCard
        title={t("No leads yet", "Noch keine Anfragen")}
        description={t(
          `When a customer routes a brief to ${q.data.caterer.name}, it will appear here.`,
          `Sobald ein Kunde eine Anfrage an ${q.data.caterer.name} sendet, erscheint sie hier.`
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
                notes: t("Buffet setup with vegan options, high-end tableware requested.", "Buffet-Aufbau mit veganen Optionen, hochwertiges Geschirr gewünscht."),
                status: "quote_requested",
                is_b2b: true,
                company_name: "TechCorp GmbH",
                milestones: [
                  { title: t("Inquiry Received", "Anfrage erhalten"), status: "received", created_at: new Date().toISOString() },
                  { title: t("Details Confirmed", "Details bestätigt"), status: "confirmed", created_at: new Date().toISOString() }
                ]
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
              "Nutze dies, um dein A4-Seitenlayout zu testen oder Eventzettel als PDF zu exportieren."
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
                  notes: t("Buffet setup with vegan options, high-end tableware requested.", "Buffet-Aufbau mit veganen Optionen, hochwertiges Geschirr gewünscht."),
                  status: "quote_requested",
                  is_b2b: true,
                  company_name: "TechCorp GmbH",
                  milestones: [
                    { title: t("Inquiry Received", "Anfrage erhalten"), status: "received", created_at: new Date().toISOString() },
                    { title: t("Details Confirmed", "Details bestätigt"), status: "confirmed", created_at: new Date().toISOString() }
                  ]
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
                      ? "border-emerald-600 bg-cream/15 ring-1 ring-emerald-600 shadow-sm"
                      : "border-border/60 hover:border-forest/40 hover:bg-cream/5"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      STATUS_STYLES[b.status as BriefStatus] || "bg-stone-200 text-stone-800"
                    }`}>
                      {b.status.replace(/_/g, " ")}
                    </span>
                    <div className="flex gap-1 shrink-0">
                      {b.is_b2b && <span className="bg-blue-100 text-blue-800 border border-blue-200 rounded px-1.5 py-0.2 text-[8px] font-bold">🏢 B2B</span>}
                      {b.is_recurring && <span className="bg-purple-100 text-purple-800 border border-purple-200 rounded px-1.5 py-0.2 text-[8px] font-bold">🔄 Rec</span>}
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-sm text-forest truncate">
                    {b.company_name ? `${b.company_name} — ` : ""}{b.event_type ?? "Event"}
                  </h3>
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
                    <span>👥 {b.guest_count || "—"} guests</span>
                    <span>📅 {b.event_date ? new Date(b.event_date).toLocaleDateString() : "—"}</span>
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
                      {selectedBrief.company_name ? `${selectedBrief.company_name} — ` : ""}{selectedBrief.event_type ?? "Event"}
                      {selectedBrief.guest_count ? ` · ${selectedBrief.guest_count} guests` : ""}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      #{selectedBrief.id.slice(0, 8)} · received {new Date(selectedBrief.created_at).toLocaleString()}
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
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Event Information</h4>
                      <dl className="mt-2 grid grid-cols-2 gap-3 text-xs">
                        {selectedBrief.event_date && (
                          <div className="bg-cream/10 p-2.5 rounded-xl border border-border/20">
                            <dt className="text-muted-foreground text-[10px]">Date</dt>
                            <dd className="font-semibold text-forest mt-0.5">{new Date(selectedBrief.event_date).toLocaleDateString()}</dd>
                          </div>
                        )}
                        {selectedBrief.location && (
                          <div className="bg-cream/10 p-2.5 rounded-xl border border-border/20">
                            <dt className="text-muted-foreground text-[10px]">Location</dt>
                            <dd className="font-semibold text-forest mt-0.5 truncate" title={selectedBrief.location}>{selectedBrief.location}</dd>
                          </div>
                        )}
                        {selectedBrief.budget_cents != null && (
                          <div className="bg-cream/10 p-2.5 rounded-xl border border-border/20 col-span-2 sm:col-span-1">
                            <dt className="text-muted-foreground text-[10px]">Budget</dt>
                            <dd className="font-semibold text-forest mt-0.5">{price(selectedBrief.budget_cents)}</dd>
                          </div>
                        )}
                      </dl>
                    </div>

                    {selectedBrief.notes && (
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Customer Notes</h4>
                        <div className="mt-2 p-3 bg-stone-50 border border-border/30 rounded-xl text-xs text-forest/90 italic leading-relaxed">
                          "{selectedBrief.notes}"
                        </div>
                      </div>
                    )}

                    <div className="border-t border-border/40 pt-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Milestone Progress</h4>
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
                          {BRIEF_STATUSES.map((s) => (
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
                          onClick={() => mut.mutate({ briefId: selectedBrief.id, status: "booked" })}
                        >
                          Confirm Booked
                        </Button>
                      </div>
                      {(selectedBrief.status === "quote_requested" || selectedBrief.status === "draft" || selectedBrief.status === "needs_more_info") && (
                        <Button 
                          size="sm" 
                          className="w-full mt-2 text-xs py-1 h-8 rounded-lg bg-forest text-white font-semibold" 
                          onClick={() => {
                            setProposalBrief(selectedBrief);
                            setProposalAmount(selectedBrief.budget_cents ? (selectedBrief.budget_cents / 100).toString() : "");
                            setDepositAmount("0");
                            setProposalNotes("");
                          }}
                        >
                          Convert to Proposal
                        </Button>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border/40">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Message Client</h4>
                      <div className="border border-border/40 rounded-2xl overflow-hidden bg-white shadow-sm">
                        <SecureChat briefId={selectedBrief.id} currentUserId={q.data.caterer.owner_id} />
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
              Submit an official proposal to the customer. This will update the brief's total and set its status to "Proposal Sent".
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
                  onChange={e => setProposalAmount(e.target.value)} 
                />
              </div>
              <div className="space-y-1.5">
                <Label>Required Deposit Amount (€)</Label>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0"
                  value={depositAmount} 
                  onChange={e => setDepositAmount(e.target.value)} 
                />
                <p className="text-xs text-muted-foreground">Amount due immediately to confirm booking.</p>
              </div>
              <div className="space-y-1.5">
                <Label>Milestone Terms & Notes</Label>
                <Textarea 
                  rows={4}
                  value={proposalNotes} 
                  onChange={e => setProposalNotes(e.target.value)} 
                  placeholder="e.g. 50% deposit required upon booking. Final payment due 7 days prior to event."
                />
              </div>
              <Button 
                className="w-full" 
                disabled={proposalMut.isPending || !proposalAmount}
                onClick={() => {
                  proposalMut.mutate({
                    briefId: proposalBrief.id,
                    proposalCents: Math.round(parseFloat(proposalAmount || "0") * 100),
                    depositCents: Math.round(parseFloat(depositAmount || "0") * 100),
                    notes: proposalNotes
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

function MenuForm({ catererId, onDone }: { catererId: string; onDone: () => void }) {
  const upsert = useServerFn(upsertCatererMenuItem);
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
  const [err, setErr] = useState<string | null>(null);

  const mut = useMutation({
    mutationFn: (vars: any) => upsert({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["caterer", "menu"] });
      onDone();
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
      <h3 className="font-display text-lg">Add Menu Item</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label>Category</Label>
          <Input value={category} onChange={(e) => setCategory(e.target.value)} required placeholder="Menü, Vorspeisen..." />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Description</Label>
        <Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label>Price (€)</Label>
          <Input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label>Unit</Label>
          <Input value={unit} onChange={(e) => setUnit(e.target.value)} required placeholder="Person, Platte..." />
        </div>
        <div className="space-y-1.5">
          <Label>Serves</Label>
          <Input type="number" min="1" value={serves} onChange={(e) => setServes(e.target.value)} required />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Image (Optional)</Label>
        {imagePreview && (
          <img src={imagePreview} alt="" className="h-24 w-full rounded-lg object-cover shadow-sm mb-2" />
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }} />
        <Button type="button" variant="outline" size="sm" className="w-full" disabled={uploading} onClick={() => fileRef.current?.click()}>
          {uploading ? "Uploading…" : imagePreview ? "Replace image" : "Upload image"}
        </Button>
      </div>
      {err && <p className="text-sm text-destructive">{err}</p>}
      <Button type="submit" className="w-full" disabled={mut.isPending || uploading}>
        {mut.isPending ? "Saving…" : "Add to menu"}
      </Button>
    </form>
  );
}

function CatererMenuSection() {
  const fetchMenu = useServerFn(getMyCatererMenu);
  const remove = useServerFn(deleteCatererMenuItem);
  const qc = useQueryClient();
  const q = useSuspenseQuery({
    queryKey: ["caterer", "menu"],
    queryFn: () => fetchMenu(),
  });
  const delMut = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["caterer", "menu"] }),
  });

  if (!q.data?.caterer) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-2xl">Menu Manager</h2>
        <span className="text-sm text-muted-foreground">{q.data.menu.length} items</span>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px] items-start">
        <div className="space-y-4">
          {q.data.menu.length === 0 ? (
            <div className="surface-card p-6 text-center border-2 border-dashed border-[#eadfce]/55 rounded-3xl bg-cream/5 flex flex-col items-center justify-center min-h-[300px] space-y-3">
              <span className="text-2xl">🍽️</span>
              <h3 className="font-display text-base font-bold text-forest">No catering packages yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm text-center leading-relaxed">
                Create your first menu item or buffet package using the builder form on the right. Once added, packages will show up here as client-facing menu cards.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {q.data.menu.map((m: any) => (
                <article key={m.id} className="surface-card overflow-hidden border border-[#eadfce]/35 rounded-3xl bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    {m.image_signed_url ? (
                      <img src={m.image_signed_url} alt="" className="h-32 w-full object-cover" />
                    ) : (
                      <div className="flex h-32 w-full items-center justify-center bg-mint/20 text-2xl">🥂</div>
                    )}
                    <div className="p-4 space-y-1.5 text-left">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-600 uppercase tracking-wider">
                          {m.category}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-base text-forest line-clamp-1">{m.name}</h4>
                      {m.description && <p className="line-clamp-2 text-[11px] text-muted-foreground leading-relaxed">{m.description}</p>}
                    </div>
                  </div>
                  <div className="p-4 pt-0 border-t border-[#eadfce]/20 mt-3 flex items-center justify-between">
                    <p className="text-xs">
                      <span className="font-display font-bold text-base text-forest">€{(m.price_cents / 100).toFixed(2)}</span>
                      <span className="text-muted-foreground text-[10px] ml-1">/ {m.unit} (serves ~{m.serves})</span>
                    </p>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-xs h-7 px-2.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      disabled={delMut.isPending} 
                      onClick={() => delMut.mutate(m.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
        <MenuForm catererId={q.data.caterer.id} onDone={() => {}} />
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

  if (q.error) return <div className="surface-card p-8 text-center text-destructive font-medium">{t("Übersichtsdetails konnten nicht geladen werden: ", "Could not load overview details: ")}{(q.error as any).message ?? "Unknown error"}</div>;
  if (!q.data) return <div className="surface-card p-8 text-center text-muted-foreground">{t("Keine Übersichtsdetails verfügbar.", "No overview details available.")}</div>;

  const steps = [
    { id: "storefront", label: t("Storefront erstellen", "Create storefront"), done: true, desc: t("Konfiguriere deinen Catering-Markennamen und die Subdomain.", "Configure your catering brand name and subdomain.") },
    { id: "profile", label: t("Unternehmensprofil vervollständigen", "Complete business profile"), done: !!(caterer.logo_url && caterer.description), desc: t("Füge ein Logo, Bannerbild und eine Beschreibung hinzu.", "Add a logo, banner image, and business description."), link: "#profile" },
    { id: "category", label: t("Service-Kategorie wählen", "Choose service category focus"), done: !!caterer.service_areas, desc: t("Konfiguriere Liefergebiete, um regionale Nachfrage zu sichern.", "Configure delivery zones to capture regional demand."), link: "#logistics" },
    { id: "menu", label: t("Erstes Paket oder Gericht hinzufügen", "Add first package or menu item"), done: !!(menuQ.data?.menu && menuQ.data.menu.length > 0), desc: t("Erstelle Menükarten und Preise für deine Kunden.", "Create menu cards and pricing for clients to view."), link: "#menu" },
    { id: "logistics", label: t("Verfügbarkeit & Logistik einrichten", "Set availability & logistics"), done: !!(caterer.delivery_fee_cents || caterer.min_delivery_cents), desc: t("Definiere Liefergebühren, Mindestbestellwert und Grenzen.", "Define pricing rules, delivery fees, and boundaries."), link: "#logistics" }
  ];

  const completedCount = steps.filter(s => s.done).length;
  const allDone = completedCount === steps.length;
  const nextStep = steps.find(s => !s.done);

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
                <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5"><span className="text-emerald-600">📈</span> {t("Umsatz (Gebucht)", "Revenue (Booked)")}</p>
                <p className="text-xl font-bold font-display text-forest mt-1">€{(q.data.revenueCents / 100).toFixed(2)}</p>
              </div>
              <div className="p-3 bg-cream/5 rounded-2xl border border-border/20 text-left">
                <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5"><span className="text-emerald-600">💶</span> {t("Ø Budget", "Avg Budget")}</p>
                <p className="text-xl font-bold font-display text-forest mt-1">€{(q.data.averageOrderCents / 100).toFixed(2)}</p>
              </div>
              <div className="p-3 bg-cream/5 rounded-2xl border border-border/20 text-left">
                <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5"><span className="text-emerald-600">📅</span> {t("Gebuchte Events", "Booked Events")}</p>
                <p className="text-xl font-bold font-display text-forest mt-1">{q.data.totalOrders}</p>
              </div>
              <div className="p-3 bg-cream/5 rounded-2xl border border-border/20 text-left">
                <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5"><span className="text-brand-orange">⏱️</span> {t("Aktive Anfragen", "Active Leads")}</p>
                <p className="text-xl font-bold font-display text-brand-orange mt-1">{q.data.pendingOrders}</p>
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
                <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5"><span className="text-sky-600">📊</span> {t("Konversion", "Conversion")}</p>
                <p className="text-xl font-bold font-display text-sky-600 mt-1">{q.data.conversionRate}%</p>
              </div>
              <div className="p-3 bg-cream/5 rounded-2xl border border-border/20 text-left">
                <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5"><span className="text-sky-600">👀</span> {t("Profilaufrufe", "Profile Views")}</p>
                <p className="text-xl font-bold font-display text-sky-600 mt-1">{q.data.profileViews || 0}</p>
              </div>
              <div className="p-3 bg-cream/5 rounded-2xl border border-border/20 text-left">
                <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5"><span className="text-emerald-600">🔄</span> {t("Kundenbindung", "Retention")}</p>
                <p className="text-xl font-bold font-display text-emerald-600 mt-1">{q.data.customerRetentionRate}%</p>
              </div>
              <div className="p-3 bg-cream/5 rounded-2xl border border-border/20 text-left col-span-1 sm:col-span-2 lg:col-span-1">
                <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5"><span className="text-emerald-600">⭐</span> {t("Beliebt", "Popular")}</p>
                <p className="text-xs font-bold font-display truncate mt-2.5" title={q.data.popularDish}>{q.data.popularDish || "N/A"}</p>
              </div>
              <div className="p-3 bg-cream/5 rounded-2xl border border-border/20 text-left">
                <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5"><span className="text-rose-600">❌</span> {t("Storniert", "Cancelled")}</p>
                <p className="text-xl font-bold font-display text-rose-600 mt-1">{q.data.cancelledOrders}</p>
              </div>
            </div>
          </div>

          {q.data.pendingOrders > 0 && (
            <div className="rounded-2xl bg-brand-orange/10 border border-brand-orange/20 p-4 text-left shadow-sm">
              <p className="text-brand-orange font-medium text-xs flex items-center gap-2">
                <span>⏱️</span> {t(`Sie haben ${q.data.pendingOrders} offene Anfragen, die Aufmerksamkeit erfordern. Gehen Sie zum Reiter "Anfragen", um Details zu sehen.`, `You have ${q.data.pendingOrders} pending leads that require attention. Go to the Leads tab to view details.`)}
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
                  className="bg-emerald-600 h-full transition-all duration-300"
                  style={{ width: `${(completedCount / 5) * 100}%` }}
                />
              </div>

              {/* Checklist Items */}
              <div className="space-y-3 pt-1">
                {steps.map((s, idx) => (
                  <div key={s.id} className="flex gap-2.5 items-start">
                    <div className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 text-[8px] font-bold mt-0.5 border ${
                      s.done 
                        ? "bg-emerald-600 border-emerald-600 text-white" 
                        : nextStep?.id === s.id
                          ? "border-emerald-600 text-emerald-600 bg-emerald-500/10"
                          : "border-muted text-muted-foreground"
                    }`}>
                      {s.done ? "✓" : idx + 1}
                    </div>
                    <div className="min-w-0">
                      <h4 className={`text-[11px] font-bold ${s.done ? "text-forest/60 line-through" : "text-forest"}`}>
                        {s.label}
                      </h4>
                      {!s.done && nextStep?.id === s.id && (
                        <p className="text-[10px] text-forest/75 mt-0.5 leading-relaxed bg-white/60 p-1.5 rounded-lg border border-border/20">
                          {s.desc}
                          {s.link && (
                            <a href={s.link} className="block mt-1 font-semibold text-brand-orange hover:underline text-[9px]">
                              {t("Jetzt einrichten →", "Configure now →")}
                            </a>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {!allDone && nextStep && (
                <div className="pt-2 border-t border-border/30">
                  <p className="text-[9px] text-muted-foreground">
                    {t("Nächster empfohlener Schritt: ", "Next recommended action: ")}<span className="font-semibold text-forest">{nextStep.label}</span>
                  </p>
                </div>
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
                <span className="text-muted-foreground text-[11px]">{t("Subdomain", "Subdomain")}</span>
                <span className="font-mono text-[10px] font-semibold text-forest">{caterer.slug}.speisely.de</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-border/30">
                <span className="text-muted-foreground text-[11px]">{t("Eigene Domain", "Custom Domain")}</span>
                <span className="font-mono text-[10px] font-semibold text-forest truncate max-w-[150px]" title={caterer.custom_domain || "None"}>
                  {caterer.custom_domain || t("Nicht konfiguriert", "Not configured")}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-muted-foreground text-[11px]">{t("Postleitzahlen", "Postal Codes")}</span>
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
  const qc = useQueryClient();
  const fetchBriefs = useServerFn(getCatererBriefs);
  const q = useQuery({ 
    queryKey: ["caterer", "briefs"],
    queryFn: () => fetchBriefs()
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
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serviceAreas, setServiceAreas] = useState((caterer as any).service_areas || "");
  const [certifications, setCertifications] = useState((caterer as any).certifications || "");

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
          service_areas: serviceAreas,
          certifications
        }
      });
      alert("Settings saved successfully!");
      qc.invalidateQueries({ queryKey: ["caterer"] });
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
            <Label>Caterer Name</Label>
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

      <div className="grid gap-6 md:grid-cols-[1fr_320px] items-start">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-left">Active Codes</h3>
          {codes.length === 0 ? (
            <div className="surface-card p-6 text-center border-2 border-dashed border-[#eadfce]/55 rounded-3xl bg-cream/5 flex flex-col items-center justify-center min-h-[220px] space-y-3">
              <span className="text-2xl">🎟️</span>
              <h4 className="font-display text-base font-bold text-forest">No active promotions</h4>
              <p className="text-xs text-muted-foreground max-w-sm text-center leading-relaxed">
                Create a promo code on the right. Once created, it will be styled as an active ticket and optionally shown on your storefront banner.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {codes.map((c: any) => (
                <div 
                  key={c.id} 
                  className={`relative p-4 rounded-2xl border-2 border-dashed flex items-center justify-between overflow-hidden transition ${
                    c.is_active 
                      ? "border-emerald-600/40 bg-cream/5" 
                      : "border-border/60 bg-stone-50/50 opacity-60"
                  }`}
                >
                  {/* Decorative Ticket Notches */}
                  <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border border-r-2 border-border/20" />
                  <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border border-l-2 border-border/20" />
                  
                  <div className="pl-3 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-lg text-forest tracking-wider uppercase bg-forest/5 px-2.5 py-0.5 rounded border border-forest/10">
                        {c.code}
                      </span>
                      {!c.is_active && (
                        <span className="text-[9px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-bold uppercase">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Value: <span className="font-bold text-forest">
                        {c.discount_type === "percentage" ? `${c.discount_value}% off total` : `€${c.discount_value.toFixed(2)} off total`}
                      </span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 pr-3">
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      {c.is_active ? 'Active' : 'Disabled'}
                    </span>
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

        <form className="surface-card h-fit space-y-4 p-5 text-left bg-white border border-[#eadfce]/35 rounded-3xl shadow-sm" onSubmit={handleCreate}>
          <h3 className="font-display font-semibold text-base text-forest mb-3">Create new code</h3>
          <div className="space-y-1.5">
            <Label className="text-xs text-forest/85 font-semibold">Code</Label>
            <Input 
              value={code} 
              onChange={e => setCode(e.target.value.toUpperCase().replace(/\s/g, ""))} 
              placeholder="e.g. SUMMER20" 
              required 
              className="bg-white border-border/40 focus-visible:ring-emerald-500 rounded-xl text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-forest/85 font-semibold">Type</Label>
              <Select value={type} onValueChange={(v: any) => setType(v)}>
                <SelectTrigger className="text-xs h-9 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage" className="text-xs">Percent (%)</SelectItem>
                  <SelectItem value="fixed" className="text-xs">Fixed (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-forest/85 font-semibold">Value</Label>
              <Input 
                type="number" 
                min="0" 
                step={type === "percentage" ? "1" : "0.5"} 
                value={value} 
                onChange={e => setValue(e.target.value)} 
                placeholder={type === "percentage" ? "10" : "5.00"} 
                required 
                className="bg-white border-border/40 focus-visible:ring-emerald-500 rounded-xl text-xs"
              />
            </div>
          </div>
          <div className="pt-2 pb-1 border-t border-border/30 mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="promote" className="text-xs text-forest/85 cursor-pointer font-semibold">Promote on Storefront Banner</Label>
              <Switch id="promote" checked={promote} onCheckedChange={setPromote} />
            </div>
            {promote && (
              <p className="text-[10px] text-muted-foreground bg-muted/60 p-2 rounded-xl">
                This will automatically update and turn on your public announcement banner to display this code.
              </p>
            )}
          </div>
          {err && <p className="text-xs text-rose-600 font-semibold">{err}</p>}
          <Button type="submit" className="w-full rounded-full bg-forest text-xs py-2 h-9 text-white font-semibold" disabled={creating || !code || !value}>
            {creating ? "Creating..." : "Create Code"}
          </Button>
        </form>
      </div>
    </section>
  );
}

function LogisticsSection() {
  const qc = useQueryClient();
  const fetchBriefs = useServerFn(getCatererBriefs);
  const q = useSuspenseQuery({ 
    queryKey: ["caterer", "briefs"],
    queryFn: () => fetchBriefs()
  });
  const upsert = useServerFn(updateMyCatererSettings);
  
  const caterer = q.data?.caterer;
  
  const [serviceAreas, setServiceAreas] = useState((caterer as any)?.service_areas || "");
  const [deliveryFee, setDeliveryFee] = useState(((caterer as any)?.delivery_fee_cents || 0) / 100);
  const [minDelivery, setMinDelivery] = useState(((caterer as any)?.min_delivery_cents || 0) / 100);
  const [maxDistance, setMaxDistance] = useState((caterer as any)?.max_delivery_distance_km || 0);
  const [saving, setSaving] = useState(false);

  if (!caterer) return null;

  async function handleSave() {
    setSaving(true);
    try {
      await upsert({
        data: {
          name: caterer!.name, // Required by schema
          service_areas: serviceAreas,
          delivery_fee_cents: Math.round(deliveryFee * 100),
          min_delivery_cents: Math.round(minDelivery * 100),
          max_delivery_distance_km: maxDistance
        }
      });
      alert("Logistics settings saved successfully!");
      qc.invalidateQueries({ queryKey: ["caterer"] });
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
        <p className="text-sm text-muted-foreground">Manage where you deliver, delivery fees, and minimum order requirements.</p>
      </div>
      <div className="surface-card p-6 space-y-8 max-w-3xl">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2"><span className="text-brand-orange">📍</span> Service Areas / Postal Codes</h3>
          <p className="text-sm text-muted-foreground">
            Enter a comma-separated list of postal codes (e.g., 10115, 10117, 10119, 10435). This ensures customers only see your catering brand if you can fulfill their order.
          </p>
          <Input 
            value={serviceAreas} 
            onChange={e => setServiceAreas(e.target.value)} 
            placeholder="e.g. 10115, 10117, 10119, 10435"
            className="text-lg py-6"
          />
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="font-semibold text-lg flex items-center gap-2"><span className="text-brand-orange">🚚</span> Delivery Rules</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Base Delivery Fee (€)</Label>
              <Input 
                type="number" 
                min="0" 
                step="1"
                value={deliveryFee || ""} 
                onChange={e => setDeliveryFee(parseFloat(e.target.value) || 0)} 
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">Fee added to the quote for delivery.</p>
            </div>
            <div className="space-y-2">
              <Label>Minimum Delivery Value (€)</Label>
              <Input 
                type="number" 
                min="0" 
                step="1"
                value={minDelivery || ""} 
                onChange={e => setMinDelivery(parseFloat(e.target.value) || 0)} 
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">Minimum subtotal required to accept an order.</p>
            </div>
            <div className="space-y-2">
              <Label>Max Delivery Distance (km)</Label>
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

function ServiceCategoriesGuidance() {
  const { t } = useI18n();
  return (
    <div className="space-y-6 text-left">
      <div className="border-t border-[#eadfce]/30 pt-8">
        <h3 className="font-display text-xl font-bold text-forest">{t("Service-Kategorien & Onboarding-Hilfe", "Service Categories & Setup Guidance")}</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
          {t("Konfiguriere dein Dashboard passend zu diesen Zielgruppen, um in entsprechenden Suchen zu erscheinen.", "To appear in specific client searches, configure your dashboard settings according to these target segment expectations.")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1: Event Catering */}
        <div className="surface-card p-6 border border-[#eadfce]/45 rounded-3xl bg-white flex flex-col justify-between hover:shadow-md transition">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
              {t("Einmalige Events", "One-Off Events")}
            </span>
            <h4 className="font-display text-base font-bold text-forest">{t("Event-Catering", "Event Catering")}</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {t("Für Hochzeiten, private Feiern und Firmen-Events.", "Targeting weddings, private parties, and corporate functions.")}
            </p>
            
            <div className="space-y-2 pt-1 text-[11px] leading-relaxed text-[#5c6f68]">
              <p>
                <strong>{t("Erwartung:", "Expectations:")}</strong> {t("Flexible Menüs, Diät-Anpassungen & Servicepersonal.", "Flexible menu selections, dietary options & service staffing.")}
              </p>
              <p>
                <strong>{t("Aktion:", "Action:")}</strong> {t("Erstelle modulare Pakete im Menü-Manager & verfeinere dein Profil.", "Create modular packages in Menu Manager & refine your profile.")}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#eadfce]/30 grid grid-cols-2 gap-3">
            <a
              href="#menu"
              className="inline-flex items-center justify-center rounded-full bg-forest text-[10px] font-semibold text-white px-3 py-2 hover:opacity-90 transition text-center cursor-pointer"
            >
              {t("Pakete anlegen", "Set up packages")}
            </a>
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
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
              {t("Wiederkehrende Teams", "Recurring Teams")}
            </span>
            <h4 className="font-display text-base font-bold text-forest">{t("Tägliche Catering-Abos", "Daily Catering Subscriptions")}</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {t("Für Büros, Team-Lunches und regelmäßige Firmen-Abos.", "Targeting offices, team lunches, and recurring corporate subscriptions.")}
            </p>
            
            <div className="space-y-2 pt-1 text-[11px] leading-relaxed text-[#5c6f68]">
              <p>
                <strong>{t("Erwartung:", "Expectations:")}</strong> {t("Pünktliche tägliche Lieferung, wöchentliche Rotation & Allergenangaben.", "Reliable daily delivery, weekly rotation & clear allergen info.")}
              </p>
              <p>
                <strong>{t("Aktion:", "Action:")}</strong> {t("Erstelle wöchentliche Menüpläne und pflege Postleitzahlen in der Logistik ein.", "Set up weekly menu plans and configure delivery zip codes in Logistics.")}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#eadfce]/30 grid grid-cols-2 gap-3">
            <a
              href="#logistics"
              className="inline-flex items-center justify-center rounded-full bg-forest text-[10px] font-semibold text-white px-3 py-2 hover:opacity-90 transition text-center cursor-pointer"
            >
              {t("Logistik einrichten", "Configure logistics")}
            </a>
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
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
              {t("Gemeinschaftsverpflegung", "Institutional Verpflegung")}
            </span>
            <h4 className="font-display text-base font-bold text-forest">{t("Care- & Schul-Catering", "Institutional Catering")}</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {t("Für Schulen, Kitas, Kliniken und Kantinen-Verpflegung.", "Targeting schools, kitas, clinics, and high-frequency canteen programs.")}
            </p>
            
            <div className="space-y-2 pt-1 text-[11px] leading-relaxed text-[#5c6f68]">
              <p>
                <strong>{t("Erwartung:", "Expectations:")}</strong> {t("Zertifizierungen (DGE, Bio), HACCP-Richtlinien & hohe Kapazität.", "Certifications (DGE, Bio), HACCP compliance & high volume capacity.")}
              </p>
              <p>
                <strong>{t("Aktion:", "Action:")}</strong> {t("Hinterlege Zertifikate und beschreibe deine HACCP-Abläufe im Profil.", "List certifications and describe your HACCP workflows in your profile.")}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#eadfce]/30 grid grid-cols-2 gap-3">
            <a
              href="#profile"
              className="inline-flex items-center justify-center rounded-full bg-forest text-[10px] font-semibold text-white px-3 py-2 hover:opacity-90 transition text-center cursor-pointer"
            >
              {t("Profil pflegen", "Update profile")}
            </a>
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

function CatererDashboard() {
  const { t } = useI18n();
  const fetchBriefs = useServerFn(getCatererBriefs);
  const q = useSuspenseQuery({
    queryKey: ["caterer", "briefs"],
    queryFn: () => fetchBriefs(),
  });

  useSpeiselyPing(q.data?.caterer?.id, ["catering_briefs", "brief_messages"]);

  const { hash } = useLocation();
  const activeTab = (hash || "#overview").replace("#", "");


  
  if (!q.data?.caterer) {
    return (
      <VendorLayout vertical="caterer" title={t("Caterer-Dashboard", "Caterer Dashboard")}>
        <div className="max-w-5xl mx-auto space-y-10 py-6">
          {/* Guided Split-Onboarding Block */}
          <div className="surface-card p-6 border border-[#eadfce]/50 bg-cream/15 rounded-3xl shadow-sm grid md:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
            <div className="space-y-4 text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                <Sparkles className="h-3 w-3 animate-pulse" /> {t("Onboarding-Checkliste", "Onboarding Checklist")}
              </span>
              <h2 className="text-2xl font-display font-bold text-forest leading-tight">
                {t("Willkommen bei Speisely", "Welcome to Speisely")}
              </h2>
              <p className="text-xs text-forest/75 leading-relaxed">
                {t("Veröffentliche dein Catering-Storefront und erreiche Kunden vor Ort in vier einfachen Schritten:", "Launch your catering storefront and reach local demand in four simple steps:")}
              </p>

              {/* Onboarding Sequence Steps */}
              <div className="space-y-3 pt-1">
                <div className="flex gap-2.5 items-start">
                  <div className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">✓</div>
                  <div>
                    <h4 className="text-[11px] font-bold text-forest">{t("1. Setup verstehen", "1. Understand the Setup")}</h4>
                    <p className="text-[10px] text-forest/65">{t("Verbinde dich direkt mit Privat- und Firmenkunden, die Catering suchen.", "Connect directly with private and corporate clients seeking catering.")}</p>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="h-5 w-5 rounded-full border-2 border-emerald-600 bg-cream text-emerald-600 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">2</div>
                  <div>
                    <h4 className="text-[11px] font-bold text-forest">{t("2. Storefront erstellen", "2. Create Storefront")} <span className="ml-1 text-[9px] font-normal text-brand-orange">{t("(Aktion erforderlich)", "(Action Required)")}</span></h4>
                    <p className="text-[10px] text-forest/65">{t("Fülle das Storefront-Registrierungsformular auf der rechten Seite aus.", "Complete the storefront registration form on the right.")}</p>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="h-5 w-5 rounded-full border-2 border-[#eadfce] bg-transparent text-muted-foreground flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">3</div>
                  <div>
                    <h4 className="text-[11px] font-bold text-muted-foreground">{t("3. Service-Kategorie wählen", "3. Choose Service Category Focus")}</h4>
                    <p className="text-[10px] text-muted-foreground/65">{t("Beachte die Onboarding-Hilfe für Service-Kategorien unten.", "Check the operational category guidance at the bottom.")}</p>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="h-5 w-5 rounded-full border-2 border-[#eadfce] bg-transparent text-muted-foreground flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">4</div>
                  <div>
                    <h4 className="text-[11px] font-bold text-muted-foreground">{t("4. Profil & Pakete einrichten", "4. Complete Profile & Package Setup")}</h4>
                    <p className="text-[10px] text-muted-foreground/65">{t("Definiere Lieferregeln, lade Bilder hoch und erstelle Menüs.", "Define delivery rules, upload assets, and list initial menus.")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#eadfce]/40 shadow-sm">
              <h3 className="font-display font-semibold text-base text-forest mb-3 text-left">{t("Storefront registrieren", "Register Storefront")}</h3>
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
      storefrontSlug={q.data.caterer.slug}
    >
      {activeTab === "overview" && <OverviewSection caterer={q.data.caterer} />}
      {activeTab === "briefs" && <BriefsSection />}
      {activeTab === "calendar" && <BlackoutCalendarSection vendorType="caterer" />}
      {activeTab === "menu" && <CatererMenuSection />}
      {activeTab === "promotions" && <PromotionsSection vertical="caterers" />}
      {activeTab === "logistics" && <LogisticsSection />}
      {activeTab === "profile" && (
        <div className="space-y-10">
          <CustomDomainSection 
            entity={q.data.caterer} 
            onSave={async (slug, domain) => {
              const { updateMyCatererSettings } = await import("@/lib/caterer/queries.functions");
              await updateMyCatererSettings({
                data: {
                  name: q.data.caterer.name,
                  slug: slug,
                  custom_domain: domain
                }
              });
              qc.invalidateQueries({ queryKey: ["caterer", "briefs"] });
            }}
          />
          <BusinessProfileSection />
        </div>
      )}
    </VendorLayout>
  );
}
