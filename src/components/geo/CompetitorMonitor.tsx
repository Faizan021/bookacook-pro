import { useState, useCallback } from "react";
import {
  ClipboardCopy,
  Check,
  Zap,
  Globe,
  BarChart2,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ChevronRight,
  Sparkles,
  Save
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { saveSeoDraft } from "@/lib/admin/mutations.functions";
import { toast } from "sonner";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface ComparisonRow {
  feature: string;
  speisely: string;
  competitor: string;
  speiselyWins: boolean;
}

interface CompetitorData {
  displayName: string;
  tagline: string;
  category: string;
  founded?: string;
  comparisonRows: ComparisonRow[];
  differentiators: string[];
  weaknesses: string[];
  targetAudience: string;
  ctaHeadline: string;
  ctaBody: string;
  accentColor: string; // tailwind bg class for the avatar circle
}

type Status = "idle" | "generating" | "generated" | "action-required";

// ─────────────────────────────────────────────
// Competitor database
// ─────────────────────────────────────────────

const COMPETITOR_DB: Record<string, CompetitorData> = {
  "food.de": {
    displayName: "food.de",
    tagline: "Recipes & meal inspiration portal",
    category: "Recipe Portal",
    founded: "2005",
    accentColor: "bg-orange-500",
    targetAudience: "Home cooks looking for recipe inspiration",
    comparisonRows: [
      { feature: "B2B Catering Orders", speisely: "✅ Full platform", competitor: "❌ Not available", speiselyWins: true },
      { feature: "Live Order Tracking", speisely: "✅ Real-time GPS", competitor: "❌ None", speiselyWins: true },
      { feature: "Corporate Meal Planning", speisely: "✅ Built-in planner", competitor: "❌ Recipe-only", speiselyWins: true },
      { feature: "Vendor Marketplace", speisely: "✅ 100+ partners", competitor: "❌ No ordering", speiselyWins: true },
      { feature: "Recipe Content", speisely: "⚡ Curated tips", competitor: "✅ Extensive library", speiselyWins: false },
      { feature: "Mobile App", speisely: "✅ iOS & Android", competitor: "✅ iOS & Android", speiselyWins: true },
      { feature: "Dietary Filters", speisely: "✅ 14 filter types", competitor: "✅ Basic filters", speiselyWins: true },
      { feature: "Invoice & Billing", speisely: "✅ Automated PDF", competitor: "❌ None", speiselyWins: true },
    ],
    differentiators: [
      "Speisely is a **full-stack ordering platform** — not just content. Customers can browse, order, and pay in minutes.",
      "Our **B2B catering module** is purpose-built for corporate events, with bulk pricing and dedicated account managers.",
      "**Automated invoicing** eliminates admin overhead — food.de users have to handle billing completely manually.",
      "With **100+ vetted local vendors**, Speisely offers genuine choice, not just recipe inspiration without fulfilment.",
    ],
    weaknesses: [
      "food.de has no ordering or fulfilment capability",
      "No corporate or B2B features",
      "Revenue model relies on ads — UX is cluttered",
    ],
    ctaHeadline: "Stop Browsing Recipes. Start Ordering Real Food.",
    ctaBody:
      "food.de can inspire you, but Speisely delivers. Switch to a platform that handles the full journey — from menu browsing to hot food at your door — built specifically for businesses that need reliable, scalable catering.",
  },

  "mealprep.de": {
    displayName: "mealprep.de",
    tagline: "Weekly meal prep subscription service",
    category: "Meal Prep Subscription",
    founded: "2019",
    accentColor: "bg-emerald-600",
    targetAudience: "Fitness-focused individuals wanting pre-portioned weekly kits",
    comparisonRows: [
      { feature: "On-Demand Ordering", speisely: "✅ Order anytime", competitor: "❌ Weekly subscription only", speiselyWins: true },
      { feature: "Corporate / Group Orders", speisely: "✅ Up to 500 pax", competitor: "❌ Individual only", speiselyWins: true },
      { feature: "Cuisine Variety", speisely: "✅ 12+ cuisines", competitor: "⚡ Health-focused only", speiselyWins: true },
      { feature: "No Lock-in Contract", speisely: "✅ Cancel anytime", competitor: "⚠️ Weekly auto-renew", speiselyWins: true },
      { feature: "Live Vendor Chat", speisely: "✅ In-app messaging", competitor: "❌ Email only", speiselyWins: true },
      { feature: "Calorie Tracking", speisely: "⚡ Basic macros", competitor: "✅ Full nutrition data", speiselyWins: false },
      { feature: "Delivery Speed", speisely: "✅ Same-day available", competitor: "❌ Next-week only", speiselyWins: true },
      { feature: "Custom Branding (white-label)", speisely: "✅ Available", competitor: "❌ Not available", speiselyWins: true },
    ],
    differentiators: [
      "**No subscription lock-in** — Speisely gives you total flexibility. Order once, daily, or weekly on your schedule.",
      "**Corporate catering at scale** — mealprep.de is designed for individuals; Speisely serves entire company cafeterias.",
      "**Same-day delivery** from local vendors means fresh meals whenever you need them, not just on scheduled delivery days.",
      "**White-label options** for large clients let companies brand the ordering experience as their own.",
    ],
    weaknesses: [
      "mealprep.de forces weekly subscriptions with no flexibility",
      "Zero B2B or event catering support",
      "Narrow health-food niche limits audience",
    ],
    ctaHeadline: "More Than Meal Prep — A Complete Food Platform",
    ctaBody:
      "mealprep.de locks you into a weekly cadence that doesn't match real business needs. Speisely adapts to you — same-day catering, event ordering, or recurring office lunches. No subscriptions. No surprises.",
  },

  "getcater.de": {
    displayName: "getcater.de",
    tagline: "Event catering booking marketplace",
    category: "Event Catering Marketplace",
    founded: "2017",
    accentColor: "bg-purple-600",
    targetAudience: "Event planners booking one-off catering for parties and weddings",
    comparisonRows: [
      { feature: "Daily Office Catering", speisely: "✅ Recurring orders", competitor: "⚠️ Event-only focus", speiselyWins: true },
      { feature: "Instant Booking", speisely: "✅ Book in 2 min", competitor: "⚡ Quote-based (48h)", speiselyWins: true },
      { feature: "Transparent Pricing", speisely: "✅ Live menu prices", competitor: "❌ Hidden until quote", speiselyWins: true },
      { feature: "Vendor Count (DE)", speisely: "✅ 100+ nationwide", competitor: "⚡ ~60 vendors", speiselyWins: true },
      { feature: "Wedding Catering", speisely: "✅ Available", competitor: "✅ Specialist focus", speiselyWins: false },
      { feature: "Order Management Dashboard", speisely: "✅ Full analytics", competitor: "⚡ Basic history", speiselyWins: true },
      { feature: "Dietary Requirement Mgmt", speisely: "✅ Per-person config", competitor: "⚡ Notes field only", speiselyWins: true },
      { feature: "Integration (Slack/Teams)", speisely: "✅ Native webhooks", competitor: "❌ None", speiselyWins: true },
    ],
    differentiators: [
      "**Instant pricing, no quote waiting** — Speisely shows live vendor prices so you can book in under 2 minutes.",
      "**Daily recurring orders** are a Speisely specialty; getcater.de is optimised for one-off events only.",
      "**Per-person dietary configuration** means no more allergy spreadsheets — handled directly in the order flow.",
      "**Slack & MS Teams integration** lets office managers order lunch without ever leaving their workflow tools.",
    ],
    weaknesses: [
      "getcater.de requires 48-hour quote turnaround — unsuitable for urgent orders",
      "No recurring/daily order support",
      "Pricing opacity frustrates corporate procurement teams",
    ],
    ctaHeadline: "Skip the Waiting. Book Catering in 2 Minutes.",
    ctaBody:
      "getcater.de's quote-based model adds unnecessary friction. Speisely gives you real prices, real availability, and instant booking — whether you're feeding 10 people for lunch or 500 at a company event.",
  },

  "gourmet.de": {
    displayName: "gourmet.de",
    tagline: "Premium restaurant discovery & reservation platform",
    category: "Restaurant Discovery",
    founded: "2010",
    accentColor: "bg-amber-700",
    targetAudience: "Diners looking for upscale restaurant reservations",
    comparisonRows: [
      { feature: "Delivery & Catering", speisely: "✅ Full fulfilment", competitor: "❌ Dine-in only", speiselyWins: true },
      { feature: "B2B Corporate Accounts", speisely: "✅ Dedicated portal", competitor: "❌ Consumer-only", speiselyWins: true },
      { feature: "Group Ordering (20+ pax)", speisely: "✅ Native support", competitor: "❌ Call-only", speiselyWins: true },
      { feature: "Restaurant Partnerships (DE)", speisely: "✅ 100+ vendors", competitor: "✅ 500+ listings", speiselyWins: false },
      { feature: "Reservation System", speisely: "⚡ Via vendors", competitor: "✅ Native OpenTable", speiselyWins: false },
      { feature: "Real-time Order Tracking", speisely: "✅ GPS tracking", competitor: "❌ No delivery", speiselyWins: true },
      { feature: "Custom Menu Curation", speisely: "✅ Event menus", competitor: "❌ Fixed restaurant menus", speiselyWins: true },
      { feature: "Flat-fee Pricing Model", speisely: "✅ No hidden fees", competitor: "⚡ Commission-based", speiselyWins: true },
    ],
    differentiators: [
      "**Delivery and catering fulfilment** — gourmet.de is a discovery platform only; Speisely handles the full supply chain.",
      "**B2B corporate portal** with invoicing, budget controls, and team management — completely absent on gourmet.de.",
      "**Flat-fee pricing** protects vendor margins and keeps customer prices consistent, unlike commission models.",
      "**Custom event menus** can be curated per occasion — gourmet.de restaurants offer only their standard menus.",
    ],
    weaknesses: [
      "gourmet.de is discovery-only — no delivery or catering",
      "No corporate or group ordering features",
      "Commission model creates price inflation for consumers",
    ],
    ctaHeadline: "Beyond Discovery — Food That Arrives at Your Door",
    ctaBody:
      "gourmet.de helps you find great restaurants. Speisely goes further — bringing premium food directly to your office or event, with corporate billing, custom menus, and real-time tracking. Discover AND deliver.",
  },

  "lieferando.de": {
    displayName: "lieferando.de",
    tagline: "Germany's largest consumer food delivery app",
    category: "Consumer Delivery",
    founded: "2010",
    accentColor: "bg-red-600",
    targetAudience: "Consumers ordering individual takeaway meals",
    comparisonRows: [
      { feature: "B2B / Corporate Catering", speisely: "✅ Full B2B platform", competitor: "❌ Consumer-only", speiselyWins: true },
      { feature: "Group Orders (50+ pax)", speisely: "✅ Native bulk tools", competitor: "⚠️ Workarounds needed", speiselyWins: true },
      { feature: "Vendor Commission Fees", speisely: "✅ Low flat fee", competitor: "❌ Up to 30% per order", speiselyWins: true },
      { feature: "Custom Catering Menus", speisely: "✅ Event-specific menus", competitor: "❌ Standard menus only", speiselyWins: true },
      { feature: "Market Reach (DE)", speisely: "⚡ Growing", competitor: "✅ Market leader", speiselyWins: false },
      { feature: "Restaurant Count", speisely: "⚡ 100+ curated", competitor: "✅ 15,000+ listings", speiselyWins: false },
      { feature: "Invoice & PO Support", speisely: "✅ Automated invoicing", competitor: "❌ No PO support", speiselyWins: true },
      { feature: "Dedicated Account Manager", speisely: "✅ For B2B clients", competitor: "❌ No B2B support", speiselyWins: true },
      { feature: "Dietary Config (per person)", speisely: "✅ Granular settings", competitor: "❌ Note field only", speiselyWins: true },
      { feature: "White-Label Options", speisely: "✅ Available", competitor: "❌ Not available", speiselyWins: true },
    ],
    differentiators: [
      "**Built for business, not consumers** — Speisely's entire platform is designed around the needs of companies, not individual takeaway orders.",
      "**Vendor-friendly commission model** — Lieferando charges up to 30%; Speisely's flat-fee model keeps more revenue with the vendor.",
      "**Purchase order & invoicing support** — essential for corporate procurement, entirely absent on Lieferando.",
      "**Dedicated B2B account managers** ensure large clients always have a human contact, not just a chatbot.",
      "**Per-person dietary configuration** eliminates the allergy-management nightmare common with large group orders.",
    ],
    weaknesses: [
      "Lieferando charges vendors up to 30% commission, inflating menu prices",
      "Zero B2B or corporate procurement features",
      "Group ordering is cumbersome and unsupported natively",
      "No purchase order, invoice, or budget-control tooling",
    ],
    ctaHeadline: "Lieferando for Dinner. Speisely for Business.",
    ctaBody:
      "Lieferando dominates consumer delivery — but the moment your team needs catering, corporate invoicing, or bulk orders, it falls short. Speisely was built from day one for exactly those needs. Give your business the food platform it deserves.",
  },
};

// ─────────────────────────────────────────────
// Template engine
// ─────────────────────────────────────────────

function buildMarkdownPost(domain: string, data: CompetitorData): string {
  const slug = domain.replace(/\./g, "-");
  const today = new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const tableHeader = `| Feature | **Speisely** | **${data.displayName}** |
|:--------|:------------|:${"".padEnd(data.displayName.length + 2, "-")}|`;

  const tableRows = data.comparisonRows
    .map((r) => `| ${r.feature} | ${r.speisely} | ${r.competitor} |`)
    .join("\n");

  const differentiatorList = data.differentiators
    .map((d, i) => `${i + 1}. ${d}`)
    .join("\n");

  const weaknessList = data.weaknesses.map((w) => `- ${w}`).join("\n");

  return `
# Alternative zu ${data.displayName} — Der ehrliche Vergleich (${new Date().getFullYear()})

> **TL;DR:** ${data.displayName} richtet sich an ${data.targetAudience}.
> Speisely wurde von Grund auf für Gastronomen und Unternehmenskunden gebaut —
> mit echter Bestellung, B2B-Tools und transparenten Preisen.

---

## Was ist ${data.displayName}?

${data.displayName} ist eine **${data.category}**-Plattform mit dem Fokus auf
*"${data.tagline}"*. ${data.founded ? `Gegründet ${data.founded}, ` : ""}positioniert sich die Plattform
im ${data.category}-Segment des deutschen Marktes.

---

## Speisely vs. ${data.displayName}: Funktionsvergleich

${tableHeader}
${tableRows}

---

## 🏆 Warum Speisely gewinnt: Die wichtigsten Differenzierungsmerkmale

${differentiatorList}

---

## ⚠️ Bekannte Schwächen von ${data.displayName}

${weaknessList}

---

## Für wen ist welche Lösung geeignet?

| Anwendungsfall | Empfehlung |
|:---------------|:-----------|
| Privatpersonen / Hobby-Köche | ${data.displayName} |
| Unternehmens-Catering (10–500 Pax) | **Speisely** ✅ |
| Tägliche Büroverpflegung | **Speisely** ✅ |
| Veranstaltungs-Catering mit Budget-Kontrolle | **Speisely** ✅ |
| Automatisierte Rechnungsstellung / PO-Support | **Speisely** ✅ |

---

## ${data.ctaHeadline}

${data.ctaBody}

👉 **[Jetzt kostenlos starten auf speisely.de](https://speisely.de/auth?signup=partner)**
👉 **[Demo für Ihr Unternehmen anfragen](https://speisely.de/catering)**

---

*Dieser Vergleich wurde am ${today} erstellt und spiegelt den aktuellen
Funktionsumfang beider Plattformen wider. Alle Angaben ohne Gewähr.*
`;
}

// ─────────────────────────────────────────────
// Status badge component
// ─────────────────────────────────────────────

function StatusBadge({ status }: { status: Status }) {
  if (status === "idle") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
        <Clock size={11} />
        Awaiting Input
      </span>
    );
  }
  if (status === "generating") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-forest/30 bg-forest/10 px-3 py-1 text-xs font-semibold text-forest animate-pulse">
        <Sparkles size={11} />
        Generating…
      </span>
    );
  }
  if (status === "generated") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        <ShieldCheck size={11} />
        Content Generated
      </span>
    );
  }
  // action-required
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-red-400/40 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
      <AlertTriangle size={11} />
      Competitor Detected — Action Required
    </span>
  );
}

// ─────────────────────────────────────────────
// Competitor avatar
// ─────────────────────────────────────────────

function CompetitorAvatar({
  domain,
  accentColor,
}: {
  domain: string;
  accentColor?: string;
}) {
  const letter = domain.charAt(0).toUpperCase();
  const color = accentColor ?? "bg-slate-500";
  return (
    <span
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${color} text-sm font-bold text-white shadow-sm`}
    >
      {letter}
    </span>
  );
}

// ─────────────────────────────────────────────
// Quick-select preset card
// ─────────────────────────────────────────────

function PresetCard({
  domain,
  data,
  onSelect,
}: {
  domain: string;
  data: CompetitorData;
  onSelect: (d: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(domain)}
      className="group flex w-full items-center gap-3 rounded-xl border border-forest/10 bg-white/60 px-4 py-3 text-left transition-all hover:border-forest/30 hover:bg-cream hover:shadow-sm"
    >
      <CompetitorAvatar domain={domain} accentColor={data.accentColor} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-forest">{data.displayName}</p>
        <p className="truncate text-xs text-forest/50">{data.category}</p>
      </div>
      <ChevronRight
        size={15}
        className="shrink-0 text-forest/30 transition-transform group-hover:translate-x-0.5 group-hover:text-forest/60"
      />
    </button>
  );
}

// ─────────────────────────────────────────────
// Comparison table preview (inline, not code)
// ─────────────────────────────────────────────

function ComparisonTablePreview({ rows }: { rows: ComparisonRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-forest/10">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-forest text-white">
            <th className="px-4 py-2.5 text-left font-semibold text-xs uppercase tracking-wide">
              Feature
            </th>
            <th className="px-4 py-2.5 text-left font-semibold text-xs uppercase tracking-wide">
              Speisely
            </th>
            <th className="px-4 py-2.5 text-left font-semibold text-xs uppercase tracking-wide">
              Competitor
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-t border-forest/[0.08] ${
                i % 2 === 0 ? "bg-white/70" : "bg-cream/40"
              } ${row.speiselyWins ? "" : "opacity-80"}`}
            >
              <td className="px-4 py-2.5 text-forest/80 font-medium">
                {row.feature}
              </td>
              <td
                className={`px-4 py-2.5 font-semibold ${
                  row.speiselyWins ? "text-emerald-700" : "text-forest/60"
                }`}
              >
                {row.speisely}
              </td>
              <td
                className={`px-4 py-2.5 ${
                  !row.speiselyWins
                    ? "font-semibold text-forest"
                    : "text-red-500"
                }`}
              >
                {row.competitor}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

export function CompetitorMonitor() {
  const [inputDomain, setInputDomain] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [activeData, setActiveData] = useState<CompetitorData | null>(null);
  const [markdown, setMarkdown] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const saveDraft = useServerFn(saveSeoDraft);
  const [activeTab, setActiveTab] = useState<"preview" | "markdown">("preview");
  const [unknownDomain, setUnknownDomain] = useState(false);

  // Resolve domain to known entry (fuzzy — strips www, checks key includes)
  const resolveDomain = (raw: string): [string, CompetitorData] | null => {
    const cleaned = raw
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/.*$/, "");

    if (COMPETITOR_DB[cleaned]) return [cleaned, COMPETITOR_DB[cleaned]];

    const partialKey = Object.keys(COMPETITOR_DB).find(
      (k) => cleaned.includes(k) || k.includes(cleaned)
    );
    if (partialKey) return [partialKey, COMPETITOR_DB[partialKey]];

    return null;
  };

  const handleGenerate = useCallback(() => {
    const raw = inputDomain.trim();
    if (!raw) return;

    setStatus("generating");
    setActiveDomain(null);
    setActiveData(null);
    setMarkdown("");
    setUnknownDomain(false);

    setTimeout(() => {
      const resolved = resolveDomain(raw);
      if (!resolved) {
        const fakeDomain = raw
          .replace(/^https?:\/\//, "")
          .replace(/^www\./, "");
        const genericData: CompetitorData = {
          displayName: fakeDomain,
          tagline: "Competitor food platform",
          category: "Food Platform",
          accentColor: "bg-slate-500",
          targetAudience: "General food market customers",
          comparisonRows: [
            { feature: "B2B Corporate Catering", speisely: "✅ Full platform", competitor: "❓ Unknown", speiselyWins: true },
            { feature: "Instant Online Ordering", speisely: "✅ 2-minute booking", competitor: "❓ Unknown", speiselyWins: true },
            { feature: "Transparent Pricing", speisely: "✅ Live prices", competitor: "❓ Unknown", speiselyWins: true },
            { feature: "Invoice & PO Support", speisely: "✅ Automated", competitor: "❓ Unknown", speiselyWins: true },
            { feature: "Dietary Config (per pax)", speisely: "✅ 14 filter types", competitor: "❓ Unknown", speiselyWins: true },
            { feature: "Dedicated Account Manager", speisely: "✅ For B2B clients", competitor: "❓ Unknown", speiselyWins: true },
          ],
          differentiators: [
            "Speisely is purpose-built for **B2B catering** — most competitors focus on consumer delivery.",
            "Our **flat-fee pricing model** keeps vendor margins healthy and customer prices fair.",
            "**Same-day delivery** from 100+ vetted local partners across Germany.",
            "**Full procurement support** — purchase orders, automated invoicing, and budget controls.",
          ],
          weaknesses: [
            `${fakeDomain} may lack dedicated B2B features`,
            "Pricing transparency is often lower on competitor platforms",
            "Corporate account management tools may be absent",
          ],
          ctaHeadline: "Speisely vs. " + fakeDomain + ": The Business Choice",
          ctaBody: `Whatever ${fakeDomain} offers, Speisely is built differently — with every feature designed for the realities of corporate food management. From one-off events to daily office catering, Speisely handles it all.`,
        };
        setActiveDomain(fakeDomain);
        setActiveData(genericData);
        setMarkdown(buildMarkdownPost(fakeDomain, genericData));
        setStatus("action-required");
        setUnknownDomain(true);
      } else {
        const [domain, data] = resolved;
        setActiveDomain(domain);
        setActiveData(data);
        setMarkdown(buildMarkdownPost(domain, data));
        setStatus("generated");
      }
    }, 1500);
  }, [inputDomain]);

  const handlePresetSelect = useCallback((domain: string) => {
    setInputDomain(domain);
    setStatus("generating");
    setActiveDomain(null);
    setActiveData(null);
    setMarkdown("");
    setUnknownDomain(false);

    setTimeout(() => {
      const data = COMPETITOR_DB[domain];
      setActiveDomain(domain);
      setActiveData(data);
      setMarkdown(buildMarkdownPost(domain, data));
      setStatus("generated");
    }, 1500);
  }, []);

  const handleSaveDraft = useCallback(async () => {
    if (!activeData || !activeDomain || !markdown) return;
    
    setIsSaving(true);
    try {
      const slug = activeDomain.replace(/\./g, "-");
      await saveDraft({
        data: {
          type: "competitor",
          target_keyword: activeDomain,
          title: `Alternative zu ${activeData.displayName}: Warum Restaurants zu Speisely wechseln`,
          slug: `alternative-zu-${slug}`,
          meta_title: `Alternative zu ${activeData.displayName} für B2B Catering`,
          meta_description: `${activeData.displayName} ist eine ${activeData.category}-Lösung – aber für Gastronomen und B2B-Kunden bietet Speisely klare Vorteile. Hier ist der Vergleich.`,
          content: markdown,
          cta_text: activeData.ctaHeadline,
          internal_links: []
        }
      });
      toast.success("Draft saved successfully to the Review Queue");
      setCopied(true); // Re-using copied state for success UI
      setTimeout(() => setCopied(false), 2000);
    } catch (err: any) {
      toast.error(err.message || "Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  }, [activeData, activeDomain, markdown]);

  const speiselyWinCount =
    activeData?.comparisonRows.filter((r) => r.speiselyWins).length ?? 0;
  const totalRows = activeData?.comparisonRows.length ?? 0;

  return (
    <div className="min-h-screen bg-cream px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* ── Header ── */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest">
              <BarChart2 size={12} />
              Competitor Intelligence
            </div>
            <h1 className="font-display text-3xl font-bold text-forest">
              Competitor Map
            </h1>
            <p className="mt-1 text-sm text-forest/60">
              Generate an "Alternative to [Competitor]" blog post in seconds —
              powered by Speisely's competitive intelligence engine.
            </p>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* ── Input panel ── */}
        <div className="surface-card rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
          <label className="mb-2 block text-sm font-semibold text-forest">
            Competitor Domain
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Globe
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/40"
              />
              <input
                type="text"
                value={inputDomain}
                onChange={(e) => setInputDomain(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                placeholder="z.B. mealprep.de, food.de, lieferando.de"
                className="w-full rounded-xl border border-forest/15 bg-cream/60 py-3 pl-9 pr-4 text-sm text-forest placeholder-forest/35 outline-none ring-0 transition focus:border-forest/40 focus:bg-white focus:ring-2 focus:ring-forest/10"
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={status === "generating" || !inputDomain.trim()}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-forest px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "generating" ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Generating…
                </>
              ) : (
                <>
                  <Zap size={15} />
                  Analyse &amp; Generate
                </>
              )}
            </button>
          </div>
          <p className="mt-2 text-xs text-forest/40">
            Enter a competitor's domain. Press Enter or click the button.
          </p>
        </div>

        {/* ── Pre-loaded competitor templates ── */}
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-forest/50">
            Pre-loaded Templates
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(COMPETITOR_DB).map(([domain, data]) => (
              <PresetCard
                key={domain}
                domain={domain}
                data={data}
                onSelect={handlePresetSelect}
              />
            ))}
          </div>
        </div>

        {/* ── Generating pulse overlay ── */}
        {status === "generating" && (
          <div className="surface-card flex flex-col items-center justify-center gap-4 rounded-2xl border border-forest/10 bg-white py-16 text-center shadow-sm">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <span className="absolute h-full w-full animate-ping rounded-full bg-forest/20" />
              <span className="absolute h-10 w-10 animate-ping rounded-full bg-forest/30 delay-75" />
              <Sparkles size={24} className="relative z-10 text-forest" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-forest">
                Generating Post…
              </p>
              <p className="mt-1 text-sm text-forest/50">
                Building comparison table, differentiators &amp; CTA
              </p>
            </div>
            <div className="flex gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-forest/40"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Results panel ── */}
        {(status === "generated" || status === "action-required") &&
          activeData &&
          activeDomain && (
            <div className="space-y-6">
              {/* Result header */}
              <div className="flex flex-col gap-4 rounded-2xl border border-forest/10 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
                <CompetitorAvatar
                  domain={activeDomain}
                  accentColor={activeData.accentColor}
                />
                <div className="flex-1">
                  <h2 className="font-display text-xl font-bold text-forest">
                    Alternative to {activeData.displayName}
                  </h2>
                  <p className="text-sm text-forest/55">
                    {activeData.tagline} · {activeData.category}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {unknownDomain && (
                    <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                      Generic Template Used
                    </span>
                  )}
                  <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-700">
                      Speisely wins {speiselyWinCount}/{totalRows} features
                    </span>
                  </div>
                </div>
              </div>

              {/* Score strip */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Speisely Wins",
                    value: speiselyWinCount,
                    color: "text-emerald-700",
                    bg: "bg-emerald-50 border-emerald-200",
                  },
                  {
                    label: "Competitor Wins",
                    value: totalRows - speiselyWinCount,
                    color: "text-red-600",
                    bg: "bg-red-50 border-red-200",
                  },
                  {
                    label: "Win Rate",
                    value: `${Math.round((speiselyWinCount / totalRows) * 100)}%`,
                    color: "text-forest",
                    bg: "bg-cream border-forest/15",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className={`rounded-xl border ${s.bg} px-4 py-3 text-center`}
                  >
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-forest/50">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Tab switcher */}
              <div className="flex gap-1 rounded-xl border border-forest/10 bg-cream/60 p-1">
                {(["preview", "markdown"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 rounded-lg py-2 text-sm font-semibold capitalize transition-all ${
                      activeTab === tab
                        ? "bg-white text-forest shadow-sm"
                        : "text-forest/50 hover:text-forest"
                    }`}
                  >
                    {tab === "preview" ? "📊 Visual Preview" : "📝 Markdown Source"}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              {activeTab === "preview" ? (
                <div className="space-y-6">
                  {/* Comparison table */}
                  <div className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-forest">
                      <BarChart2 size={18} />
                      Feature Comparison
                    </h3>
                    <ComparisonTablePreview rows={activeData.comparisonRows} />
                  </div>

                  {/* Key differentiators */}
                  <div className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 font-display text-lg font-bold text-forest">
                      🏆 Key Differentiators
                    </h3>
                    <ol className="space-y-3">
                      {activeData.differentiators.map((d, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest text-[10px] font-bold text-white">
                            {i + 1}
                          </span>
                          <p
                            className="text-sm text-forest/75 leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: d.replace(
                                /\*\*(.+?)\*\*/g,
                                '<strong class="text-forest font-semibold">$1</strong>'
                              ),
                            }}
                          />
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* CTA section */}
                  <div className="rounded-2xl border border-forest/20 bg-forest p-6 text-white shadow-sm">
                    <h3 className="font-display text-xl font-bold">
                      {activeData.ctaHeadline}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">
                      {activeData.ctaBody}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <a
                        href="https://speisely.de/auth?signup=partner"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-forest transition hover:opacity-90"
                      >
                        Jetzt kostenlos starten
                      </a>
                      <a
                        href="https://speisely.de/catering"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        Demo anfragen
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                /* Markdown source */
                <div className="rounded-2xl border border-forest/10 bg-[#0d1117] shadow-sm">
                  <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-red-500/70" />
                      <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
                      <span className="h-3 w-3 rounded-full bg-green-500/70" />
                      <span className="ml-2 font-mono text-xs text-white/40">
                        alternative-zu-{activeDomain?.replace(/\./g, "-")}.md
                      </span>
                    </div>
                    <button
                      onClick={handleSaveDraft}
                      disabled={isSaving}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                        copied
                          ? "bg-emerald-500 text-white"
                          : "bg-emerald-600 text-white hover:bg-emerald-500"
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check size={12} />
                          Saved!
                        </>
                      ) : (
                        <>
                          <Save size={12} />
                          {isSaving ? "Saving..." : "Save Draft"}
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-emerald-300 whitespace-pre">
                    <code>{markdown}</code>
                  </pre>
                </div>
              )}

              {/* Save button (always visible below) */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition disabled:opacity-50 ${
                    copied
                      ? "bg-emerald-500 text-white"
                      : "bg-forest text-white hover:opacity-90"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check size={15} />
                      Saved to Draft Queue
                    </>
                  ) : (
                    <>
                      <Save size={15} />
                      {isSaving ? "Saving..." : "Save to Draft Queue"}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
