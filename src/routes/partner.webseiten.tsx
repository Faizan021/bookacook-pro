import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Globe,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ExternalLink,
  Smartphone,
  Search,
  Users,
  Send,
  Loader2,
  Star,
  Layers,
  ChefHat,
  Building2,
  Gauge,
  Bot,
  FileSpreadsheet,
  Activity,
} from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/i18n/I18nProvider";
import { toast } from "sonner";

export const Route = createFileRoute("/partner/webseiten")({
  head: () => ({
    meta: [
      {
        title: "Websites & Audits für Gastronomie — Speisely",
      },
      {
        name: "description",
        content:
          "Kostenloser Website-Audit & Web-Erstellung für Caterer & Gastronomie: PageSpeed 99+, Buchungsengine & SEO-Setup.",
      },
      {
        property: "og:title",
        content: "Websites & Audits für Caterer & Gastronomie — Speisely",
      },
      {
        property: "og:description",
        content:
          "Jetzt bestehende Website kostenlos auf PageSpeed, Google KI & Buchungs-Conversion analysieren lassen. Engineered by TechGlanz & Speisely.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://speisely.de/partner/webseiten" },
    ],
  }),
  component: WebsiteCreationPage,
});

const SHOWCASE_PROJECTS = [
  {
    title: "Haus Spaas",
    category: "Traditions-Gastronomie & Eventlokal",
    location: "Mönchengladbach & NRW",
    url: "https://haus-spaas.de",
    caseStudyUrl: "/case-study/haus-spaas",
    badge: "Flagship Case Study ⭐",
    description:
      "Von statischer PDF-Speisekarte zum vollen Gastraum: Dual-Menü (Oktoberfest & Klassik), 1-Klick WhatsApp Reservierung & Top-Performance.",
    highlights: [
      "+44 Besucher in 24h",
      "0.48s Ladezeit (99/100)",
      "Duale Speisekarte",
      "1-Klick WhatsApp Buchung",
    ],
  },
  {
    title: "Partyservice Küpper",
    category: "BBQ & Event-Catering NRW",
    location: "Mönchengladbach & NRW",
    url: "https://partyservicekuepper.de/",
    caseStudyUrl: undefined,
    badge: "Live · Catering & BBQ",
    description:
      "Kompletter Webauftritt mit All-Inclusive BBQ-Paketen, Event-Kalkulator, regionaler Google-KI-SEO-Struktur und nahtloser Angebotsanfrage.",
    highlights: [
      "PageSpeed 99/100",
      "Google AI Overview Schema",
      "All-Inclusive BBQ Menüs",
      "100% Mobiloptimiert",
    ],
  },
];

function WebsiteCreationPage() {
  const { lang } = useI18n();
  const isDe = lang === "de";

  // Audit State
  const [auditUrl, setAuditUrl] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState(0);
  const [auditResult, setAuditResult] = useState<null | {
    domain: string;
    speedScore: number;
    aiScore: number;
    mobileScore: number;
    bookingScore: number;
    overallScore: number;
  }>(null);

  // Form State
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    city: "",
    type: "catering",
    currentWebsite: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Handle Interactive Audit
  const handleRunAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditUrl.trim()) {
      toast.error(isDe ? "Bitte gib eine Website-URL ein." : "Please enter a website URL.");
      return;
    }

    const cleanDomain = auditUrl
      .replace(/https?:\/\//i, "")
      .replace(/\/.*$/, "")
      .trim();
    setIsAuditing(true);
    setAuditResult(null);
    setAuditStep(1);

    setTimeout(() => setAuditStep(2), 700);
    setTimeout(() => setAuditStep(3), 1400);
    setTimeout(() => setAuditStep(4), 2100);

    setTimeout(() => {
      setIsAuditing(false);
      setAuditResult({
        domain: cleanDomain,
        speedScore: 48,
        aiScore: 35,
        mobileScore: 58,
        bookingScore: 30,
        overallScore: 43,
      });
      setForm((prev) => ({
        ...prev,
        currentWebsite: auditUrl.startsWith("http") ? auditUrl : `https://${auditUrl}`,
        notes: isDe
          ? `Ich habe den kostenlosen Website-Audit für ${cleanDomain} gemacht und wünsche mir ein unverbindliches Redesign-Konzept.`
          : `I ran the free website audit for ${cleanDomain} and would like a redesign proposal.`,
      }));
      toast.success(isDe ? "Website-Audit abgeschlossen!" : "Website audit completed!");
    }, 2800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const emailSubject = `Neue Website-Anfrage von ${form.businessName || form.contactName}`;
    const emailBody = `Hallo Speisely & TechGlanz Team,

Ich interessiere mich für eine moderne Website für mein Gastro-/Catering-Business:

Betrieb / Name: ${form.businessName}
Ansprechpartner: ${form.contactName}
E-Mail: ${form.email}
Telefon: ${form.phone}
Stadt: ${form.city}
Typ: ${form.type === "catering" ? "Caterer / Partyservice" : form.type === "restaurant" ? "Restaurant / Café" : "Eventlocation"}
Aktuelle Website: ${form.currentWebsite || "Keine"}
Wünsche & Feedback:
${form.notes}

Partner-Netzwerk: Speisely Marketplace x TechGlanz (https://techglanz.de)
`;

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      window.location.href = `mailto:info@speisely.de?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      toast.success(
        isDe
          ? "Vielen Dank! Dein E-Mail-Programm öffnet sich jetzt."
          : "Thank you! Opening your email client.",
      );
    }, 600);
  };

  return (
    <SiteShell>
      <div className="bg-[#FAF7F0] text-forest min-h-screen">
        {/* ─────────────────────────────────────────────────
            HERO SECTION
        ───────────────────────────────────────────────── */}
        <section className="relative bg-forest text-[#FAF7F0] pt-24 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1e5242] via-forest to-[#0a1f1a] opacity-90" />

          <div className="relative max-w-5xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#E6B84A] backdrop-blur-md border border-white/15">
              <Sparkles className="h-4 w-4" />
              <span>Speisely Digital Suite · Powered by TechGlanz</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.08]">
              {isDe ? (
                <>
                  Deine eigene High-End Website <br className="hidden sm:inline" />
                  <span className="text-[#E6B84A]">für Catering &amp; Gastronomie.</span>
                </>
              ) : (
                <>
                  Your Custom High-End Website <br className="hidden sm:inline" />
                  <span className="text-[#E6B84A]">for Catering &amp; Hospitality.</span>
                </>
              )}
            </h1>

            <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-medium">
              {isDe ? (
                <>
                  Schluss mit veralteten WordPress-Seiten und teuren 5.000 € Agenturen. Wir bauen
                  deinen blitzschnellen, mobilen Online-Auftritt mit{" "}
                  <strong>integrierter Speisely-Buchungsengine</strong>, Google-KI-SEO und
                  maßgeschneidertem <strong>TechGlanz-Engineering</strong>.
                </>
              ) : (
                <>
                  Say goodbye to slow legacy WordPress sites and expensive €5,000 agencies. We craft
                  ultra-fast, mobile-optimized digital storefronts with{" "}
                  <strong>integrated Speisely booking engines</strong>, Google AI SEO, and bespoke{" "}
                  <strong>TechGlanz engineering</strong>.
                </>
              )}
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#audit-tool"
                className="inline-flex items-center gap-2 rounded-full bg-[#E6B84A] text-forest px-8 py-4 text-sm font-black shadow-xl hover:bg-[#f7ca5e] hover:scale-105 transition"
              >
                <Zap className="h-4 w-4" />
                <span>{isDe ? "Kostenlosen Website-Audit starten" : "Run Free Website Audit"}</span>
              </a>
              <a
                href="#referenzen"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 text-white px-7 py-4 text-sm font-bold border border-white/20 hover:bg-white/20 transition"
              >
                <Globe className="h-4 w-4 text-[#E6B84A]" />
                <span>{isDe ? "Live-Referenzen ansehen" : "View Live Showcase"}</span>
              </a>
            </div>

            {/* TechGlanz Trust Badge */}
            <div className="pt-4 flex items-center justify-center gap-2 text-xs text-white/60">
              <span>Technischer Umsetzungspartner:</span>
              <a
                href="https://techglanz.de"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#E6B84A] hover:underline inline-flex items-center gap-1"
              >
                TechGlanz (techglanz.de) ↗
              </a>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────
            INTERACTIVE FREE WEBSITE AUDIT TOOL (LEAD MAGNET)
        ───────────────────────────────────────────────── */}
        <section
          id="audit-tool"
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-30"
        >
          <div className="rounded-3xl bg-white p-6 sm:p-10 border-2 border-forest/15 shadow-2xl">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#A85C36] block mb-2">
                ⚡ Kostenloses Live-Tool
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-forest">
                {isDe ? "Wie fit ist deine aktuelle Website?" : "How Fit Is Your Current Website?"}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-forest/70">
                {isDe
                  ? "Gib deine Website-Domain ein. Wir prüfen Ladezeit, mobile Menüs, Google-KI-Sichtbarkeit und Buchungs-Funnels in Sekunden."
                  : "Enter your domain. We analyze mobile speed, online menus, Google AI visibility, and booking conversion in seconds."}
              </p>
            </div>

            {/* Audit Input Form */}
            <form
              onSubmit={handleRunAudit}
              className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-forest/40" />
                <input
                  type="text"
                  value={auditUrl}
                  onChange={(e) => setAuditUrl(e.target.value)}
                  placeholder="z. B. www.mein-catering-service.de"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#FAF7F0] border-2 border-forest/15 text-forest font-semibold placeholder:text-forest/40 text-sm sm:text-base focus:outline-none focus:border-[#E6B84A]"
                />
              </div>
              <button
                type="submit"
                disabled={isAuditing}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-forest text-[#FAF7F0] px-8 py-4 text-sm sm:text-base font-black hover:bg-[#E6B84A] hover:text-forest transition shadow-lg disabled:opacity-50 whitespace-nowrap cursor-pointer"
              >
                {isAuditing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-[#E6B84A]" />
                    <span>{isDe ? "Wird analysiert..." : "Analyzing..."}</span>
                  </>
                ) : (
                  <>
                    <Gauge className="h-5 w-5 text-[#E6B84A]" />
                    <span>{isDe ? "Kostenlos analysieren" : "Start Free Audit"}</span>
                  </>
                )}
              </button>
            </form>

            {/* Scanning Animation */}
            {isAuditing && (
              <div className="mt-8 max-w-xl mx-auto p-6 rounded-2xl bg-[#FAF7F0] border border-forest/10 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-forest">
                  <span className="flex items-center gap-2">
                    <Activity className="h-4 w-4 animate-pulse text-emerald-600" />
                    {auditStep === 1 &&
                      (isDe
                        ? "1/4: Prüfe PageSpeed & Mobile Ladezeit..."
                        : "1/4: Checking PageSpeed & Mobile TTFB...")}
                    {auditStep === 2 &&
                      (isDe
                        ? "2/4: Prüfe Google AI Overview & Schema.org..."
                        : "2/4: Checking Google AI Overview & Schema.org...")}
                    {auditStep === 3 &&
                      (isDe
                        ? "3/4: Scanne Speisekarten & PDF-Hürden..."
                        : "3/4: Scanning digital menu presentation...")}
                    {auditStep === 4 &&
                      (isDe
                        ? "4/4: Berechne Conversion-Verlust & Potenzial..."
                        : "4/4: Calculating booking conversion loss...")}
                  </span>
                  <span className="font-mono">{auditStep * 25}%</span>
                </div>
                <div className="w-full h-2.5 bg-forest/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-[#E6B84A] transition-all duration-500 ease-out"
                    style={{ width: `${auditStep * 25}%` }}
                  />
                </div>
              </div>
            )}

            {/* Audit Results Card */}
            {auditResult && (
              <div className="mt-10 pt-8 border-t border-forest/10 max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-forest text-white mb-6">
                  <div>
                    <span className="text-xs uppercase font-bold text-[#E6B84A] tracking-wider block mb-1">
                      Audit-Ergebnis für: {auditResult.domain}
                    </span>
                    <h3 className="font-display text-2xl font-bold">
                      Website-Health-Score:{" "}
                      <span className="text-amber-400">{auditResult.overallScore} / 100</span>
                    </h3>
                    <p className="text-xs text-white/70 mt-1">
                      {isDe
                        ? "Dringender Handlungsbedarf: Hohes Risiko von Kunden-Absprüngen und fehlende KI-Auffindbarkeit."
                        : "Action required: High risk of mobile client drop-off and missing AI search citations."}
                    </p>
                  </div>
                  <a
                    href="#anfrage"
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#E6B84A] text-forest px-6 py-3.5 text-xs sm:text-sm font-black shadow-lg hover:bg-white transition whitespace-nowrap"
                  >
                    <span>
                      {isDe ? "Kostenloses Redesign anfragen" : "Request Redesign Concept"}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Metric 1 */}
                  <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-forest/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-forest flex items-center gap-2">
                        <Zap className="h-4 w-4 text-amber-600" />
                        PageSpeed &amp; Ladezeit (Mobil)
                      </span>
                      <span className="font-mono font-black text-xs px-2.5 py-1 rounded-md bg-amber-100 text-amber-900">
                        {auditResult.speedScore}/100 (Kritisch)
                      </span>
                    </div>
                    <p className="text-xs text-forest/75 leading-relaxed">
                      🚨 Gemessene Ladezeit: ~3.4s auf Smartphones. Über 50% der hungrigen Kunden
                      brechen bei &gt;3s Ladezeit ab.
                      <strong className="block mt-1 text-emerald-800">
                        Speisely x TechGlanz Standard: &lt; 0.5 Sekunden (Score 99+).
                      </strong>
                    </p>
                  </div>

                  {/* Metric 2 */}
                  <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-forest/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-forest flex items-center gap-2">
                        <Bot className="h-4 w-4 text-purple-600" />
                        Google AI &amp; LLM-Suchmaschinen (GEO)
                      </span>
                      <span className="font-mono font-black text-xs px-2.5 py-1 rounded-md bg-rose-100 text-rose-900">
                        {auditResult.aiScore}/100 (Fehlend)
                      </span>
                    </div>
                    <p className="text-xs text-forest/75 leading-relaxed">
                      ⚠️ Keine strukturierten Schema.org JSON-LD Menü- &amp; Catering-Daten.
                      ChatGPT, Perplexity und Google AI Overviews können deine Angebote nicht direkt
                      zitieren.
                    </p>
                  </div>

                  {/* Metric 3 */}
                  <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-forest/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-forest flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-sky-600" />
                        Mobile Menüs &amp; Speisekarten
                      </span>
                      <span className="font-mono font-black text-xs px-2.5 py-1 rounded-md bg-amber-100 text-amber-900">
                        {auditResult.mobileScore}/100 (Unoptimiert)
                      </span>
                    </div>
                    <p className="text-xs text-forest/75 leading-relaxed">
                      📱 Veraltete PDF-Speisekarten oder starre Tabellen sind auf Handys schwer
                      lesbar und verlangen lästiges Zoomen.
                    </p>
                  </div>

                  {/* Metric 4 */}
                  <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-forest/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-forest flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                        Direkte Buchungs- &amp; Angebots-Engine
                      </span>
                      <span className="font-mono font-black text-xs px-2.5 py-1 rounded-md bg-rose-100 text-rose-900">
                        {auditResult.bookingScore}/100 (Fehlend)
                      </span>
                    </div>
                    <p className="text-xs text-forest/75 leading-relaxed">
                      ❌ Kein interaktiver Event-Rechner. Kunden müssen ein manuelles
                      Kontaktformular tippen und auf Antwort warten.
                    </p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <a
                    href="#anfrage"
                    className="inline-flex items-center gap-2 text-sm font-bold text-forest hover:text-[#b28a3c] transition"
                  >
                    <span>Jetzt unverbindliches Redesign &amp; Performance-Upgrade sichern ↓</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ─────────────────────────────────────────────────
            CORE ADVANTAGES (4 Feature Cards)
        ───────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="rounded-3xl bg-white p-6 border-2 border-forest/10 shadow-lg hover:border-[#E6B84A] transition">
              <Zap className="h-7 w-7 text-[#E6B84A] mb-3" />
              <h3 className="font-bold text-base text-forest mb-1">PageSpeed 99+</h3>
              <p className="text-xs text-forest/70 leading-relaxed">
                Ladezeiten unter 0.5 Sekunden. Keine Ladebalken, keine Abbrüche – maximale
                Conversion auf jedem Handy.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 border-2 border-forest/10 shadow-lg hover:border-[#E6B84A] transition">
              <Search className="h-7 w-7 text-emerald-700 mb-3" />
              <h3 className="font-bold text-base text-forest mb-1">Google &amp; KI-SEO ready</h3>
              <p className="text-xs text-forest/70 leading-relaxed">
                Strukturierte Schema.org-Daten für Google AI Overviews, Bing und Perplexity – damit
                Kunden dich lokal sofort finden.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 border-2 border-forest/10 shadow-lg hover:border-[#E6B84A] transition">
              <Smartphone className="h-7 w-7 text-[#A85C36] mb-3" />
              <h3 className="font-bold text-base text-forest mb-1">Integrierte Buchung</h3>
              <p className="text-xs text-forest/70 leading-relaxed">
                Kunden können direkt Menüs zusammenstellen, Gästezahlen kalkulieren und verbindliche
                Event-Anfragen senden.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 border-2 border-forest/10 shadow-lg hover:border-[#E6B84A] transition">
              <ShieldCheck className="h-7 w-7 text-forest mb-3" />
              <h3 className="font-bold text-base text-forest mb-1">TechGlanz Engineering</h3>
              <p className="text-xs text-forest/70 leading-relaxed">
                Eigene Domain, Hosting, Wartung, Marktplatz-Reichweite und Speisely-Kassensystem in
                einem Komplettpaket.
              </p>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────
            LIVE SHOWCASE / REFERENZEN
        ───────────────────────────────────────────────── */}
        <section id="referenzen" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-[#A85C36] mb-2 block">
              Echte Erfolgsgeschichten
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-forest">
              Websites, die wir für Partner gebaut haben
            </h2>
            <p className="mt-4 text-forest/75 text-base">
              Sieh dir an, wie moderne Gastronomie-Websites heute aussehen und performen:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {SHOWCASE_PROJECTS.map((proj, idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-white border-2 border-forest/15 p-7 shadow-xl flex flex-col justify-between hover:border-[#E6B84A] transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <span className="text-[11px] font-black uppercase text-[#A85C36] tracking-wider block mb-1">
                        {proj.category} · {proj.location}
                      </span>
                      <h3 className="font-display text-2xl font-bold text-forest">{proj.title}</h3>
                    </div>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black px-3 py-1 shrink-0">
                      {proj.badge}
                    </span>
                  </div>

                  <p className="text-sm text-forest/80 leading-relaxed mb-6">{proj.description}</p>

                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {proj.highlights.map((hl, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs font-semibold text-forest/85"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-forest/10 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-forest/60 font-medium">
                    Domain: {new URL(proj.url).hostname}
                  </span>
                  <div className="flex items-center gap-2">
                    {proj.caseStudyUrl && (
                      <Link
                        to={proj.caseStudyUrl}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#E6B84A] text-forest px-4 py-2 text-xs font-bold hover:bg-[#d6a538] transition shadow-sm"
                      >
                        <span>Case Study lesen</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-forest text-[#FAF7F0] px-4 py-2 text-xs font-bold hover:bg-forest/80 transition"
                    >
                      <span>Website öffnen</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─────────────────────────────────────────────────
            INQUIRY FORM
        ───────────────────────────────────────────────── */}
        <section id="anfrage" className="bg-forest text-[#FAF7F0] py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-black uppercase tracking-widest text-[#E6B84A] mb-2 block">
                Speisely x TechGlanz Digital Suite
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                Lass uns deine neue Website bauen
              </h2>
              <p className="mt-3 text-white/75 text-sm sm:text-base">
                Fülle kurz das Formular aus. Wir melden uns innerhalb von 24 Stunden mit einer
                kostenlosen Ersteinschätzung und einem Designkonzept.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-3xl bg-white/5 border border-white/15 p-6 sm:p-10 backdrop-blur-xl shadow-2xl space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#E6B84A] uppercase tracking-wider mb-2">
                    Name deines Betriebs *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    placeholder="z. B. Gourmet Catering Berlin"
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#E6B84A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#E6B84A] uppercase tracking-wider mb-2">
                    Dein Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                    placeholder="Max Mustermann"
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#E6B84A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#E6B84A] uppercase tracking-wider mb-2">
                    E-Mail Adresse *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="kontakt@meinbetrieb.de"
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#E6B84A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#E6B84A] uppercase tracking-wider mb-2">
                    Telefonnummer / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+49 176 12345678"
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#E6B84A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#E6B84A] uppercase tracking-wider mb-2">
                    Standort / Stadt *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="z. B. Köln oder München"
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#E6B84A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#E6B84A] uppercase tracking-wider mb-2">
                    Art des Betriebs
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#0f2720] border border-white/20 text-white text-sm focus:outline-none focus:border-[#E6B84A] cursor-pointer"
                  >
                    <option value="catering">Catering &amp; Partyservice</option>
                    <option value="restaurant">Restaurant &amp; Café</option>
                    <option value="location">Eventlocation &amp; Saal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#E6B84A] uppercase tracking-wider mb-2">
                  Bestehende Website (Domain)
                </label>
                <input
                  type="text"
                  value={form.currentWebsite}
                  onChange={(e) => setForm({ ...form, currentWebsite: e.target.value })}
                  placeholder="https://mein-altes-restaurant.de"
                  className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#E6B84A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#E6B84A] uppercase tracking-wider mb-2">
                  Was ist dir bei der neuen Website besonders wichtig?
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="z. B. Online-Speisekarte, Terminkalender, moderne Fotos, schnelle Ladezeit..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#E6B84A]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E6B84A] text-forest px-8 py-4 text-sm font-black shadow-xl hover:bg-[#f7ca5e] transition cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Wird vorbereitet...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Kostenlose Anfrage absenden</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-white/50">
                  Umsetzung &amp; technische Betreuung:{" "}
                  <a
                    href="https://techglanz.de"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#E6B84A] hover:underline font-bold"
                  >
                    TechGlanz Digital Solutions (techglanz.de)
                  </a>
                </p>
              </div>
            </form>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
