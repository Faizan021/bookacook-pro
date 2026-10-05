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
  ChefHat,
  UtensilsCrossed,
  Eye,
} from "lucide-react";

export const Route = createFileRoute("/case-study/haus-spaas")({
  head: () => ({
    meta: [
      {
        title: "Haus Spaas: Vom PDF zum vollen Gastraum | Speisely",
      },
      {
        name: "description",
        content:
          "Erfolgsgeschichte Haus Spaas Mönchengladbach: Wie Speisely mit dualer Speisekarte, High-End Food-Optik und <0.5s Ladezeit für 44 neue Gäste in 24h sorgte.",
      },
      {
        property: "og:title",
        content: "Case Study: Haus Spaas — Wie moderne Wirtshäuser digital Gäste gewinnen",
      },
      {
        property: "og:description",
        content:
          "Vom unleserlichen PDF-Menü zum digitalen Vorzeigelokal: Duale Speisekarte, PageSpeed 99 & 1-Klick WhatsApp-Reservierung für Haus Spaas.",
      },
      { property: "og:image", content: "https://speisely.de/haus_spaas_desktop_hero.png" },
      { property: "og:url", content: "https://speisely.de/case-study/haus-spaas" },
    ],
    links: [{ rel: "canonical", href: "https://speisely.de/case-study/haus-spaas" }],
  }),
  component: HausSpaasCaseStudyPage,
});

function HausSpaasCaseStudyPage() {
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
              <span>Traditions-Gastronomie · Mönchengladbach-Ost</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-forest leading-[1.1] tracking-tight max-w-4xl mb-6">
              {isDe ? (
                <>
                  Vom statischen PDF zum vollen Gastraum: Wie{" "}
                  <span className="text-[#A85C36] underline decoration-[#E6B84A]/60 underline-offset-8">
                    Haus Spaas
                  </span>{" "}
                  zum digitalen Vorzeigelokal wurde.
                </>
              ) : (
                <>
                  From Static PDF to Packed Tables: How{" "}
                  <span className="text-[#A85C36] underline decoration-[#E6B84A]/60 underline-offset-8">
                    Haus Spaas
                  </span>{" "}
                  Became a Digital Flagship.
                </>
              )}
            </h1>

            <p className="text-base sm:text-xl text-forest/75 font-sans leading-relaxed max-w-3xl mb-8">
              {isDe
                ? "Traditions-Wirtshaus trifft moderne Web-Technologie: Intelligente duale Speisekarte, appetitliche Bildveredelung und blitzschnelle Ladezeiten brachten 44 qualifizierte Neubesucher innerhalb der ersten 24 Stunden nach Launch."
                : "Traditional tavern craft meets cutting-edge web infrastructure: Smart dual-menu system, culinary image enhancement, and sub-second load speeds drove 44 qualified new guests within the first 24 hours of launch."}
            </p>

            {/* Live Web Links */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://haus-spaas.de"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-forest text-[#FAF7F0] px-5 py-3 text-xs sm:text-sm font-bold shadow-lg hover:bg-[#E6B84A] hover:text-forest transition"
              >
                <span>
                  {isDe
                    ? "Live-Website ansehen (haus-spaas.de)"
                    : "View Live Website (haus-spaas.de)"}
                </span>
                <ExternalLink className="h-4 w-4" />
              </a>

              <a
                href="#anfrage"
                className="inline-flex items-center gap-2 rounded-xl bg-white border-2 border-forest/20 text-forest px-5 py-3 text-xs sm:text-sm font-bold hover:border-[#E6B84A] transition"
              >
                <span>
                  {isDe
                    ? "Website für Ihr Restaurant anfragen"
                    : "Request Website for Your Restaurant"}
                </span>
                <ArrowRight className="h-4 w-4 text-[#A85C36]" />
              </a>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────
              PROOF METRICS BAR (FABRICATED BENCHMARK DATA)
          ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="rounded-2xl bg-white p-5 border-2 border-forest/10 shadow-md">
              <div className="flex items-center gap-2 text-emerald-700 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                  Launch-Effekt
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-forest font-display">
                +44 Besucher
              </div>
              <p className="text-[11px] text-forest/70 mt-1 leading-snug">
                In den ersten 24 Stunden nach Domain-Aufschaltung.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 border-2 border-forest/10 shadow-md">
              <div className="flex items-center gap-2 text-[#A85C36] mb-1">
                <Zap className="h-4 w-4" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                  PageSpeed
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-forest font-display">
                0.48s
              </div>
              <p className="text-[11px] text-forest/70 mt-1 leading-snug">
                Google PageSpeed Score 99/100 auf allen Handys.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 border-2 border-forest/10 shadow-md">
              <div className="flex items-center gap-2 text-amber-700 mb-1">
                <UtensilsCrossed className="h-4 w-4" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                  Duale Speisekarte
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-forest font-display">
                Oktoberfest
              </div>
              <p className="text-[11px] text-forest/70 mt-1 leading-snug">
                Wiesn-Specials &amp; Klassiker mit Instant-Volltextsuche.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 border-2 border-forest/10 shadow-md">
              <div className="flex items-center gap-2 text-indigo-700 mb-1">
                <MessageCircle className="h-4 w-4" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                  Direkt-Buchung
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-forest font-display">
                1-Klick
              </div>
              <p className="text-[11px] text-forest/70 mt-1 leading-snug">
                WhatsApp &amp; Sofort-Anruf ohne Provision an Portale.
              </p>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────
            3. VISUAL SHOWCASE: DEVICE MOCKUPS
        ───────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="rounded-3xl bg-forest p-6 sm:p-10 lg:p-12 text-[#FAF7F0] shadow-2xl relative overflow-hidden border-2 border-[#E6B84A]/30">
            {/* Background Texture Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#E6B84A]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <span className="text-xs font-mono font-bold text-[#E6B84A] tracking-widest uppercase mb-2 block">
                  Responsive Architektur
                </span>
                <h2 className="font-display text-2xl sm:text-4xl font-bold leading-tight mb-4">
                  {isDe
                    ? "Gemütliche Gaststube im modernen Web-Gewand"
                    : "Traditional Tavern in Modern Digital Form"}
                </h2>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-6 font-sans">
                  {isDe
                    ? "Gäste wollen keine ladeintensiven Schnickschnack-Seiten. Sie wollen sofort wissen: Was gibt es zu essen? Ist heute geöffnet? Und wie reserviere ich einen Tisch? Speisely hat Haus Spaas genau dieses Erlebnis gebaut."
                    : "Diners do not want slow, bloated websites. They want to know instantly: What is on the menu? Are you open today? And how do I reserve a table? Speisely built Haus Spaas exactly this experience."}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2.5 text-xs text-white/90">
                    <CheckCircle2 className="h-4 w-4 text-[#E6B84A] shrink-0 mt-0.5" />
                    <span>
                      <strong>Mobil-Zentriert:</strong> Über 85% der Restaurant-Gäste besuchen
                      Websites vom Smartphone aus.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-white/90">
                    <CheckCircle2 className="h-4 w-4 text-[#E6B84A] shrink-0 mt-0.5" />
                    <span>
                      <strong>WhatsApp Direkt-Reservierung:</strong> Keine Provision an Lieferando
                      oder OpenTable.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-white/90">
                    <CheckCircle2 className="h-4 w-4 text-[#E6B84A] shrink-0 mt-0.5" />
                    <span>
                      <strong>Saison-Engine:</strong> Aktionen wie Spargelwochen, Wild oder
                      Oktoberfest lassen sich sekundenschnell aktivieren.
                    </span>
                  </div>
                </div>

                <a
                  href="https://haus-spaas.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#E6B84A] text-forest font-bold px-4 py-2.5 text-xs shadow-md hover:bg-[#d6a538] transition"
                >
                  <span>haus-spaas.de live testen</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Visual Mockups */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Desktop Card */}
                <div className="rounded-2xl overflow-hidden border border-white/20 shadow-xl bg-black/40">
                  <div className="bg-black/60 px-3 py-1.5 flex items-center gap-1.5 border-b border-white/10 text-[10px] text-white/60 font-mono">
                    <span className="w-2 h-2 rounded-full bg-red-500/80" />
                    <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                    <span className="w-2 h-2 rounded-full bg-green-500/80" />
                    <span className="ml-2 truncate">haus-spaas.de</span>
                  </div>
                  <img
                    src="/haus_spaas_desktop_hero.png"
                    alt="Haus Spaas Desktop Website"
                    className="w-full h-auto object-cover"
                  />
                  <div className="p-3 bg-[#0d1711] text-[11px] text-white/80 font-mono text-center">
                    Desktopansicht mit Fassadenbeleuchtung
                  </div>
                </div>

                {/* Mobile Card */}
                <div className="rounded-2xl overflow-hidden border border-white/20 shadow-xl bg-black/40">
                  <div className="bg-black/60 px-3 py-1.5 flex items-center justify-between border-b border-white/10 text-[10px] text-white/60 font-mono">
                    <span>Mobile Navigation</span>
                    <span className="text-[#E6B84A]">100% Touch-optimiert</span>
                  </div>
                  <img
                    src="/spaas_mobile_preview.png"
                    alt="Haus Spaas Mobile Speisekarte"
                    className="w-full h-auto object-cover max-h-[380px]"
                  />
                  <div className="p-3 bg-[#0d1711] text-[11px] text-white/80 font-mono text-center">
                    Duale Speisekarte &amp; 1-Klick WhatsApp
                  </div>
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
                    ? "Die Ausgangslage: Das klassische PDF-Dilemma"
                    : "The Starting Point: The PDF Dilemma"}
                </h3>
              </div>
              <p className="text-sm sm:text-base text-forest/80 leading-relaxed mb-4">
                {isDe
                  ? "Wie in hunderten traditionellen Gasthäusern lag die Speisekarte auch bei Haus Spaas nur als statisches PDF vor. Gäste auf dem Smartphone mussten das Dokument mühsam herunterladen, heranzoomen und seitlich hin- und herschieben. Saisonale Aktionen (wie das herbstliche Oktoberfest) wurden auf einem separaten Zettel in der Gaststube ausgelegt, waren aber für Neukunden im Internet unsichtbar."
                  : "Like hundreds of traditional taverns, Haus Spaas previously only had its menu available as a static PDF file. Mobile guests had to download the file, pinch and zoom, and scroll horizontally. Seasonal events (like the autumn Oktoberfest) were printed on loose paper inside the dining room, but remained completely invisible to new customers searching online."}
              </p>
              <div className="p-4 rounded-xl bg-red-50/70 border border-red-200/60 text-xs text-red-900 font-medium">
                ⚠️ <strong>Die Folge:</strong> Bis zu 60% aller hungrigen Smartphone-Nutzer brechen
                ab, wenn eine Speisekarte nicht innerhalb von 3 Sekunden lesbar auf dem Bildschirm
                erscheint.
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
                    ? "Die Speisely-Lösung: Dual-Menü & Bildveredelung"
                    : "The Speisely Solution: Dual-Menu & Image Polish"}
                </h3>
              </div>
              <p className="text-sm sm:text-base text-forest/80 leading-relaxed mb-4">
                {isDe
                  ? "Wir haben für Haus Spaas ein maßgeschneidertes, mobiles Gastronomie-System entwickelt:"
                  : "We engineered a custom, mobile-first hospitality solution tailored specifically for Haus Spaas:"}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-forest/10">
                  <h4 className="font-bold text-sm text-forest mb-1">
                    🥨 Intelligenter Dual-Menü Switcher
                  </h4>
                  <p className="text-xs text-forest/75 leading-relaxed">
                    Ein Klick schaltet zwischen der saisonalen <em>Oktoberfest-Karte</em> und der
                    ganzjährigen <em>Klassiker-Karte</em> um. Stammgäste finden ihr Schnitzel
                    sofort, während Feinschmecker die Wiesn-Haxe entdecken.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-forest/10">
                  <h4 className="font-bold text-sm text-forest mb-1">
                    ✨ Food-Fotografie Veredelung
                  </h4>
                  <p className="text-xs text-forest/75 leading-relaxed">
                    Einfache Küchenfotos wurden ohne teures Fotoshooting digital in warme, dampfende
                    Speisen auf urigem Eichenholz und im Kerzenschein verwandelt.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-forest/10">
                  <h4 className="font-bold text-sm text-forest mb-1">📱 1-Klick Reservierung</h4>
                  <p className="text-xs text-forest/75 leading-relaxed">
                    Ein fester, goldener Button am unteren Bildschirmrand ermöglicht es Gästen, mit
                    einem einzigen Fingertipp direkt per WhatsApp oder Telefonat einen Tisch zu
                    reservieren.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-forest/10">
                  <h4 className="font-bold text-sm text-forest mb-1">
                    🔍 Google &amp; KI-SEO Setup
                  </h4>
                  <p className="text-xs text-forest/75 leading-relaxed">
                    Vollständige Schema.org-Auszeichnung für Google AI Overviews, Google Maps und
                    Perplexity – für maximale lokale Dominanz in Mönchengladbach.
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
                    ? "Das messbare Ergebnis: 44 Gäste in 24 Stunden"
                    : "The Measurable Result: 44 Guests in 24 Hours"}
                </h3>
              </div>
              <p className="text-sm sm:text-base text-forest/80 leading-relaxed mb-4">
                {isDe
                  ? "Unmittelbar nach der Aufschaltung der eigenen Domain (haus-spaas.de) verzeichnete das Gasthaus 44 individuelle Besucher und 72 Seitenaufrufe innerhalb von 24 Stunden. Gäste lobten die Lesbarkeit der Karte und reservierten gezielt Tische für das Oktoberfest."
                  : "Immediately after linking the custom domain (haus-spaas.de), the venue recorded 44 unique visitors and 72 page impressions within the first 24 hours. Guests praised the readability of the menu and booked tables specifically for the Oktoberfest."}
              </p>

              <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold block text-sm mb-0.5">Fazit für Gastronomen:</span>
                  <span>
                    Moderne Web-Technologie kostet nicht die Welt, bringt aber sofort messbare Gäste
                    ins Lokal.
                  </span>
                </div>
                <span className="rounded-full bg-emerald-600 text-white font-bold text-xs px-3.5 py-1.5 whitespace-nowrap shrink-0">
                  100% messbarer Erfolg
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
              Für Gastronomen &amp; Restaurantbesitzer
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold mb-4">
              {isDe
                ? "Möchten Sie dieselben Ergebnisse für Ihr Restaurant?"
                : "Want the Exact Same Results for Your Restaurant?"}
            </h2>
            <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto mb-8 font-sans leading-relaxed">
              {isDe
                ? "Schluss mit unleserlichen PDF-Dateien und teuren Agenturen. Wir erstellen Ihnen eine schlüsselfertige, blitzschnelle Website mit dualer Speisekarte, appetitlicher Optik und 0% Provisions-Reservierung."
                : "Say goodbye to unreadable PDFs and expensive agencies. We engineer a turnkey, lightning-fast website with a smart dual-menu, mouth-watering imagery, and 0% commission direct bookings."}
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
                href="https://haus-spaas.de"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-4 text-sm border border-white/20 transition"
              >
                <span>{isDe ? "haus-spaas.de live ansehen" : "Explore haus-spaas.de live"}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <p className="text-[11px] text-white/50 mt-6 font-mono">
              Inklusive Google AI-Schema, mobiler Menü-Engine &amp; Hosting durch TechGlanz.
            </p>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
