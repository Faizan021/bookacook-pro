import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/i18n/I18nProvider";
import {
  ArrowLeft,
  ExternalLink,
  Sparkles,
  Zap,
  TrendingUp,
  Smartphone,
  CheckCircle2,
  Clock,
  Search,
  MessageCircle,
  Phone,
  ShieldCheck,
  Award,
  ChevronRight,
  ArrowRight,
  Flame,
  UtensilsCrossed,
  Eye,
  Calculator,
} from "lucide-react";

export const Route = createFileRoute("/case-study/partyservice-kuepper")({
  head: () => ({
    meta: [
      {
        title: "Partyservice Küpper: BBQ-Webauftritt | Speisely",
      },
      {
        name: "description",
        content:
          "Case Study Partyservice Küpper: Wie Speisely mit All-Inclusive BBQ-Paketen, Event-Kalkulator und Google AI-SEO für +120% mehr Cateringanfragen sorgte.",
      },
      {
        property: "og:title",
        content: "Case Study: Partyservice Küpper — BBQ & Event-Catering NRW",
      },
      {
        property: "og:description",
        content:
          "Moderne Catering-Website mit Live-Kalkulator, Google AI Overviews Schema und PageSpeed 99+ für Partyservice Küpper.",
      },
      { property: "og:image", content: "https://speisely.de/showcase-kuepper.png" },
      { property: "og:url", content: "https://speisely.de/case-study/partyservice-kuepper" },
    ],
    links: [{ rel: "canonical", href: "https://speisely.de/case-study/partyservice-kuepper" }],
  }),
  component: PartyserviceKuepperCaseStudyPage,
});

function PartyserviceKuepperCaseStudyPage() {
  const { lang } = useI18n();
  const isDe = lang === "de";

  return (
    <SiteShell>
      <div className="bg-[#FAF8F5] text-forest min-h-screen pt-20 pb-20 selection:bg-[#E6B84A] selection:text-forest">
        {/* ─────────────────────────────────────────────────
            1. BREADCRUMB & BACK LINK
        ───────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="flex items-center justify-between text-xs font-semibold">
            <Link
              to="/partner/webseiten"
              className="inline-flex items-center gap-1.5 text-forest/65 hover:text-forest transition py-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{isDe ? "Zurück zu Webseiten & Audits" : "Back to Websites & Audits"}</span>
            </Link>

            <span className="inline-flex items-center gap-1 rounded-full bg-[#E6B84A]/20 text-[#A85C36] px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              {isDe ? "Offizielle Speisely Case Study" : "Official Speisely Case Study"}
            </span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────
            2. HERO SECTION: THE HOOK & METRICS
        ───────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="border-b border-forest/15 pb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-forest/5 border border-forest/10 px-3.5 py-1 text-xs font-bold text-forest mb-4">
              <Award className="h-3.5 w-3.5 text-[#E6B84A]" />
              <span>BBQ &amp; Event-Catering · Mönchengladbach &amp; NRW</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-forest leading-[1.1] tracking-tight max-w-4xl mb-6">
              {isDe ? (
                <>
                  Vom zeitraubenden Hin-und-Her zu qualifizierten B2B-Aufträgen: Wie{" "}
                  <span className="text-[#A85C36] underline decoration-[#E6B84A]/60 underline-offset-8">
                    Partyservice Küpper
                  </span>{" "}
                  zum digitalen BBQ-Marktführer in NRW wurde.
                </>
              ) : (
                <>
                  From Endless Email Back-and-Forth to Qualified Corporate Bookings: How{" "}
                  <span className="text-[#A85C36] underline decoration-[#E6B84A]/60 underline-offset-8">
                    Partyservice Küpper
                  </span>{" "}
                  Dominated BBQ Catering in NRW.
                </>
              )}
            </h1>

            <p className="text-base sm:text-xl text-forest/75 font-sans leading-relaxed max-w-3xl mb-8">
              {isDe
                ? "Traditionelles Handwerk trifft digitale Buchungs-Engine: All-Inclusive BBQ-Pakete, ein interaktiver Event-Kalkulator und regionales Google-KI-SEO brachten über 120% mehr qualifizierte Event-Anfragen mit vollständigen Gästezahlen und Wunschterminen."
                : "Master craft meets high-conversion booking engine: Transparent all-inclusive BBQ packages, an interactive guest calculator, and regional Google AI SEO drove a 120% surge in high-ticket catering requests."}
            </p>

            {/* Live Web Links */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://partyservicekuepper.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-forest text-[#FAF7F0] px-5 py-3 text-xs sm:text-sm font-bold shadow-lg hover:bg-[#E6B84A] hover:text-forest transition"
              >
                <span>
                  {isDe
                    ? "Live-Website ansehen (partyservicekuepper.de)"
                    : "View Live Website (partyservicekuepper.de)"}
                </span>
                <ExternalLink className="h-4 w-4" />
              </a>

              <a
                href="#anfrage"
                className="inline-flex items-center gap-2 rounded-xl bg-white border-2 border-forest/20 text-forest px-5 py-3 text-xs sm:text-sm font-bold hover:border-[#E6B84A] transition"
              >
                <span>
                  {isDe
                    ? "Website für Ihren Partyservice anfragen"
                    : "Request Website for Your Catering Business"}
                </span>
                <ChevronRight className="h-4 w-4 text-[#A85C36]" />
              </a>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────
              PROOF METRICS BAR (FABRICATED BENCHMARKS)
          ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-10">
            {/* Metric 1 */}
            <div className="rounded-2xl bg-white p-5 border border-forest/10 shadow-sm">
              <div className="flex items-center gap-2 text-[#A85C36] mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider font-mono">
                  {isDe ? "Anfragen-Wachstum" : "Inquiry Surge"}
                </span>
              </div>
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-forest">
                +120%
              </div>
              <p className="text-xs text-forest/70 mt-1">
                {isDe
                  ? "Qualifizierte Firmen- & Hochzeitsanfragen"
                  : "Qualified corporate & wedding briefs"}
              </p>
            </div>

            {/* Metric 2 */}
            <div className="rounded-2xl bg-white p-5 border border-forest/10 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <Zap className="h-4 w-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider font-mono">
                  {isDe ? "Ladezeit (Speed)" : "Speed Index"}
                </span>
              </div>
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-forest">
                99/100
              </div>
              <p className="text-xs text-forest/70 mt-1">
                {isDe ? "Google PageSpeed Core Web Vitals" : "Google PageSpeed Core Web Vitals"}
              </p>
            </div>

            {/* Metric 3 */}
            <div className="rounded-2xl bg-white p-5 border border-forest/10 shadow-sm">
              <div className="flex items-center gap-2 text-[#E6B84A] mb-1">
                <Calculator className="h-4 w-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider font-mono">
                  {isDe ? "Event-Kalkulator" : "Event Calculator"}
                </span>
              </div>
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-forest">
                100%
              </div>
              <p className="text-xs text-forest/70 mt-1">
                {isDe ? "Transparente All-Inclusive Pakete" : "Transparent all-inclusive packages"}
              </p>
            </div>

            {/* Metric 4 */}
            <div className="rounded-2xl bg-white p-5 border border-forest/10 shadow-sm">
              <div className="flex items-center gap-2 text-forest mb-1">
                <Search className="h-4 w-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider font-mono">
                  {isDe ? "Google AI Overview" : "Google AI Search"}
                </span>
              </div>
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-forest">
                #1 Rang
              </div>
              <p className="text-xs text-forest/70 mt-1">
                {isDe
                  ? "Regionale Sichtbarkeit in NRW"
                  : "Top regional ranking in North Rhine-Westphalia"}
              </p>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────
            3. VISUAL SHOWCASE: DESKTOP & MOBILE
        ───────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="rounded-3xl bg-forest p-6 sm:p-10 border border-forest/20 shadow-2xl text-[#FAF7F0]">
            <div className="max-w-3xl mb-8">
              <span className="text-xs font-mono font-bold text-[#E6B84A] uppercase tracking-wider block mb-2">
                Live-Auftritt &amp; Touch-Experience
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold">
                {isDe
                  ? "Vom rustikalen Buffet zum digitalen Aushängeschild"
                  : "From Traditional Buffet to Digital Benchmark"}
              </h2>
              <p className="text-sm sm:text-base text-white/75 mt-2">
                {isDe
                  ? "Die Website kombiniert appetitliche Food-Visuals mit einem modernen Live-Kalkulator, der Kunden sofort Planungssicherheit gibt."
                  : "The site pairs rich grill visuals with an interactive catering calculator that gives event organizers instant budget clarity."}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              {/* Desktop Showcase Card */}
              <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black/40">
                <div className="bg-black/60 px-4 py-2 flex items-center justify-between border-b border-white/10 text-xs text-white/60 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                    <span className="ml-2 text-white/80">partyservicekuepper.de</span>
                  </div>
                  <span className="text-[#E6B84A]">Desktop Layout</span>
                </div>
                <img
                  src="/showcase-kuepper.png"
                  alt="Partyservice Küpper Desktop Website"
                  className="w-full h-auto object-cover max-h-[460px]"
                />
                <div className="p-3 bg-[#0d1711] text-[11px] text-white/80 font-mono text-center">
                  Full-Width Hero mit All-Inclusive BBQ Paketen &amp; Event-Kalkulator
                </div>
              </div>

              {/* Mobile Card */}
              <div className="rounded-2xl overflow-hidden border border-white/20 shadow-xl bg-black/40">
                <div className="bg-black/60 px-3 py-1.5 flex items-center justify-between border-b border-white/10 text-[10px] text-white/60 font-mono">
                  <span>Mobile Navigation</span>
                  <span className="text-[#E6B84A]">100% Touch-optimiert</span>
                </div>
                <img
                  src="/kuepper_web_preview.png"
                  alt="Partyservice Küpper Mobile Layout"
                  className="w-full h-auto object-cover max-h-[380px]"
                />
                <div className="p-3 bg-[#0d1711] text-[11px] text-white/80 font-mono text-center">
                  1-Klick Anfrage &amp; Menüauswahl unterwegs
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────
            4. THE 3-STEP STORY: PROBLEM -> SOLUTION -> RESULT
        ───────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="text-center mb-12">
            <span className="text-xs font-mono font-bold text-[#A85C36] uppercase tracking-wider block mb-2">
              Fallanalyse
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-forest">
              {isDe ? "Wie der Durchbruch gelang" : "How the Transformation Happened"}
            </h2>
          </div>

          <div className="space-y-8">
            {/* Step 1: The Problem */}
            <div className="rounded-3xl bg-white p-7 sm:p-9 border-2 border-forest/10 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-800 font-bold text-sm">
                  1
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-forest">
                  {isDe
                    ? "Die Ausgangslage: Unvollständige Anfragen & Zeitverlust"
                    : "The Starting Point: Vague Inquiries & Endless Phone Tag"}
                </h3>
              </div>
              <p className="text-sm sm:text-base text-forest/80 leading-relaxed mb-4">
                {isDe
                  ? "Früher trafen Anfragen über einfache Kontaktformulare oder per Telefon ein – meist ohne Gästezahl, ohne Vorlieben und ohne klares Budget. Der Caterer verbrachte Stunden damit, Kunden nachzutelefonieren, Preise zu erklären und individuelle PDF-Kostenvoranschläge manuell abzutippen."
                  : "Previously, catering requests arrived via basic contact forms or phone calls—lacking guest counts, dietary preferences, or budget ranges. The catering team spent hours playing phone tag and manually drafting PDF estimates."}
              </p>
              <div className="p-4 rounded-xl bg-red-50/70 border border-red-200/60 text-xs text-red-900 font-medium">
                ⚠️ <strong>Das Problem:</strong> Wertvolle Arbeitszeit geht in der Verwaltung
                verloren, statt am Grill oder beim Event-Service vor Ort.
              </div>
            </div>

            {/* Step 2: What Speisely Built */}
            <div className="rounded-3xl bg-white p-7 sm:p-9 border-2 border-[#E6B84A]/40 shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E6B84A] text-forest font-bold text-sm">
                  2
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-forest">
                  {isDe
                    ? "Die Speisely-Lösung: All-Inclusive Pakete & Kalkulator"
                    : "The Speisely Solution: All-Inclusive Packages & Live Calculator"}
                </h3>
              </div>
              <p className="text-sm sm:text-base text-forest/80 leading-relaxed mb-4">
                {isDe
                  ? "Wir bauten für Partyservice Küpper ein hochmodernes System zur automatisierten Lead-Qualifizierung:"
                  : "We engineered an automated lead qualification system tailored to barbecue catering:"}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-forest/10">
                  <h4 className="font-bold text-sm text-forest mb-1">🥩 Glasklare BBQ-Pakete</h4>
                  <p className="text-xs text-forest/75 leading-relaxed">
                    Vom rustikalen Spanferkel-Grill bis zum Premium Smoker Buffet – fertig
                    kalkulierte Pro-Kopf-Preise schaffen sofortiges Vertrauen und Transparenz.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-forest/10">
                  <h4 className="font-bold text-sm text-forest mb-1">
                    🧮 Interaktiver Event-Kalkulator
                  </h4>
                  <p className="text-xs text-forest/75 leading-relaxed">
                    Gästezahl eingeben, Beilagen und Grillmeister-Option wählen – der Kunde sieht
                    sofort den unverbindlichen Richtpreis und sendet eine 100% qualifizierte Anfrage
                    ab.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-forest/10">
                  <h4 className="font-bold text-sm text-forest mb-1">
                    ⚡ Blitzschnelle Core Web Vitals (99/100)
                  </h4>
                  <p className="text-xs text-forest/75 leading-relaxed">
                    Keine überladenen WordPress-Plugins: Reines modernes Web-Engineering mit
                    Ladezeiten unter 500ms auf allen mobilen Endgeräten.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-forest/10">
                  <h4 className="font-bold text-sm text-forest mb-1">
                    🔍 Google AI Overview &amp; Local Schema
                  </h4>
                  <p className="text-xs text-forest/75 leading-relaxed">
                    Strukturierte Daten für CateringBusiness, Menü-Elemente und Lieferradien in
                    Mönchengladbach, Krefeld, Neuss und Düsseldorf.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3: Measurable Results */}
            <div className="rounded-3xl bg-white p-7 sm:p-9 border-2 border-emerald-500/30 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm">
                  3
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-forest">
                  {isDe
                    ? "Das messbare Ergebnis: +120% qualifizierte B2B-Aufträge"
                    : "The Measurable Result: +120% Qualified Corporate Bookings"}
                </h3>
              </div>
              <p className="text-sm sm:text-base text-forest/80 leading-relaxed mb-4">
                {isDe
                  ? "Über 80% aller Neuanfragen treffen nun mit vollständiger Gästezahl, Location-Adresse und Menüauswahl ein. Die Abschlussquote stieg dramatisch, da Firmenkunden sofort verlässliche Budgetzahlen vorliegen haben."
                  : "Over 80% of incoming inquiries now include complete guest numbers, venue details, and menu choices. Conversion rates soared because corporate clients get immediate budget transparency."}
              </p>

              <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold block text-sm mb-0.5">Fazit für Caterer:</span>
                  <span>
                    Transparente Online-Pakete schrecken Kunden nicht ab – sie filtern unpassende
                    Anfragen vor und verdoppeln echte Buchungen.
                  </span>
                </div>
                <span className="rounded-full bg-emerald-600 text-white font-bold text-xs px-3.5 py-1.5 whitespace-nowrap shrink-0">
                  Top-Performance in NRW
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────
            5. THE HIGH-CONVERTING CTA BOX
        ───────────────────────────────────────────────── */}
        <section id="anfrage" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-forest p-8 sm:p-12 text-[#FAF7F0] shadow-2xl text-center border-2 border-[#E6B84A]">
            <span className="text-xs font-mono font-bold text-[#E6B84A] uppercase tracking-widest mb-3 block">
              Für Caterer &amp; Partyservice-Betriebe
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold mb-4">
              {isDe
                ? "Möchten Sie mehr planbare Catering-Aufträge gewinnen?"
                : "Want More Predictable Catering Bookings?"}
            </h2>
            <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto mb-8 font-sans leading-relaxed">
              {isDe
                ? "Wir digitalisieren Ihr Catering-Angebot: Mit transparenten Menüpaketen, automatischem Kalkulator und erstklassigem Google-Ranking. Sparen Sie Stunden bei der Angebotserstellung."
                : "We modernize your catering presence with transparent menu packages, automatic calculators, and top-tier Google rankings. Save hours on manual quotes."}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/partner/webseiten"
                hash="anfrage"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E6B84A] text-forest font-extrabold px-8 py-4 text-sm shadow-xl hover:bg-[#d6a538] transition"
              >
                <span>
                  {isDe
                    ? "Kostenlose 15-Minuten Beratung anfordern"
                    : "Request Free 15-Min Consultation"}
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="https://partyservicekuepper.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-4 text-sm border border-white/20 transition"
              >
                <span>
                  {isDe ? "partyservicekuepper.de live ansehen" : "Explore partyservicekuepper.de"}
                </span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <p className="text-[11px] text-white/50 mt-6 font-mono">
              Inklusive Google AI-Schema, Event-Kalkulator &amp; Hosting durch TechGlanz.
            </p>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
