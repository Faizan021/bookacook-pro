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
  Search,
  MessageCircle,
  Award,
  ArrowRight,
  UtensilsCrossed,
  ShieldCheck,
  Flame,
  ChefHat,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/case-study/schnitzelschmiede")({
  head: () => ({
    meta: [
      {
        title: "Schnitzel Schmiede: Case Study | Speisely",
      },
      {
        name: "description",
        content:
          "Case Study Schnitzel Schmiede MG: 1-Klick WhatsApp Bestellung, Butterschmalz-Handwerk & 0% Provision an Lieferportale.",
      },
      {
        property: "og:title",
        content: "Case Study: Schnitzel Schmiede — 0% Provision & WhatsApp-Bestellung",
      },
      {
        property: "og:description",
        content:
          "Wie die Schnitzel Schmiede Mönchengladbach mit Speisely auf Unabhängigkeit von Lieferplattformen setzt: 1-Klick WhatsApp, PageSpeed 99 & Partyservice.",
      },
      { property: "og:image", content: "https://speisely.de/slide1_schnitzel_hero.webp" },
      { property: "og:url", content: "https://speisely.de/case-study/schnitzelschmiede" },
    ],
    links: [{ rel: "canonical", href: "https://speisely.de/case-study/schnitzelschmiede" }],
  }),
  component: SchnitzelschmiedeCaseStudyPage,
});

function SchnitzelschmiedeCaseStudyPage() {
  const { lang } = useI18n();
  const isDe = lang === "de";

  return (
    <SiteShell>
      <div className="bg-[#FAF8F5] text-forest min-h-screen pt-20 pb-20 selection:bg-[#E6B84A] selection:text-forest">
        {/* 1. BREADCRUMB & BACK LINK */}
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

        {/* 2. HERO SECTION */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="border-b border-forest/15 pb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-forest/5 border border-forest/10 px-3.5 py-1 text-xs font-bold text-forest mb-4">
              <Award className="h-3.5 w-3.5 text-[#E6B84A]" />
              <span>Schnitzel-Manufaktur & Lieferservice · Mönchengladbach</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-forest leading-[1.1] tracking-tight max-w-4xl mb-6">
              {isDe ? (
                <>
                  Handwerk statt Plattform-Abhängigkeit: Wie die{" "}
                  <span className="text-[#A85C36] underline decoration-[#E6B84A]/60 underline-offset-8">
                    Schnitzel Schmiede
                  </span>{" "}
                  0% Provision zahlt.
                </>
              ) : (
                <>
                  True Craft Over Aggregator Dependence: How{" "}
                  <span className="text-[#A85C36] underline decoration-[#E6B84A]/60 underline-offset-8">
                    Schnitzel Schmiede
                  </span>{" "}
                  Pays 0% Commission.
                </>
              )}
            </h1>

            <p className="text-base sm:text-xl text-forest/75 font-sans leading-relaxed max-w-3xl mb-8">
              {isDe
                ? "Frisch geklopftes Fleisch, reines Butterschmalz und 1-Klick-Direktbestellungen: Speisely hat für die Schnitzel Schmiede Mönchengladbach eine moderne Web-Engine entwickelt, die Zwischenhändler überflüssig macht und den Partyservice digitalisiert."
                : "Hand-pounded fresh meats, pure clarified butter, and 1-click direct ordering: Speisely engineered a high-speed web engine for Schnitzel Schmiede Mönchengladbach that bypasses middleman commissions and scales catering orders."}
            </p>

            {/* Live Web Links */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://www.schnitzelschmiede-mg.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-forest text-[#FAF7F0] px-5 py-3 text-xs sm:text-sm font-bold shadow-lg hover:bg-[#E6B84A] hover:text-forest transition"
              >
                <span>
                  {isDe
                    ? "Offizielle Website (schnitzelschmiede-mg.de)"
                    : "Official Website (schnitzelschmiede-mg.de)"}
                </span>
                <ExternalLink className="h-4 w-4" />
              </a>

              <a
                href="https://www.schnitzelschmiede-mg.de/reservierung"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#E6B84A] text-forest px-5 py-3 text-xs sm:text-sm font-bold shadow-lg hover:bg-forest hover:text-[#FAF7F0] transition"
              >
                <span>{isDe ? "Tisch online reservieren" : "Reserve a Table Online"}</span>
                <ExternalLink className="h-4 w-4" />
              </a>

              <Link
                to="/partner/webseiten"
                className="inline-flex items-center gap-2 rounded-xl bg-white border-2 border-forest/20 text-forest px-5 py-3 text-xs sm:text-sm font-bold hover:border-[#E6B84A] transition"
              >
                <span>
                  {isDe
                    ? "Website für Ihr Restaurant anfragen"
                    : "Request Website for Your Restaurant"}
                </span>
                <ArrowRight className="h-4 w-4 text-[#A85C36]" />
              </Link>
            </div>
          </div>

          {/* PROOF METRICS BAR */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="rounded-2xl bg-white p-5 border-2 border-forest/10 shadow-md">
              <div className="flex items-center gap-2 text-emerald-700 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                  Plattform-Kosten
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-forest font-display">
                0% Provision
              </div>
              <p className="text-[11px] text-forest/70 mt-1 leading-snug">
                Keine 15–30% Abzüge an Liefergiganten bei Direktbestellungen.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 border-2 border-forest/10 shadow-md">
              <div className="flex items-center gap-2 text-[#A85C36] mb-1">
                <Zap className="h-4 w-4" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                  Ladezeit Mobil
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-forest font-display">
                0.42s
              </div>
              <p className="text-[11px] text-forest/70 mt-1 leading-snug">
                Google PageSpeed Score 99/100 für sofortiges Bestellen.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 border-2 border-forest/10 shadow-md">
              <div className="flex items-center gap-2 text-amber-700 mb-1">
                <MessageCircle className="h-4 w-4" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                  Bestellkanal
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-forest font-display">
                1-Klick
              </div>
              <p className="text-[11px] text-forest/70 mt-1 leading-snug">
                WhatsApp Direkt-Order & Anruf ohne Medienbruch.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 border-2 border-forest/10 shadow-md">
              <div className="flex items-center gap-2 text-indigo-700 mb-1">
                <Users className="h-4 w-4" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                  Partyservice
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-forest font-display">
                10–40 Pers.
              </div>
              <p className="text-[11px] text-forest/70 mt-1 leading-snug">
                Vorkalkulierte Schnitzelpartys für Events und Firmen.
              </p>
            </div>
          </div>
        </section>

        {/* 3. VISUAL SHOWCASE: FOOD & TECH CRAFT */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="rounded-3xl bg-forest p-6 sm:p-10 lg:p-12 text-[#FAF7F0] shadow-2xl relative overflow-hidden border-2 border-[#E6B84A]/30">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#E6B84A]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6">
                <span className="text-xs font-mono font-bold text-[#E6B84A] tracking-widest uppercase mb-2 block">
                  Das Handwerks-Versprechen
                </span>
                <h2 className="font-display text-2xl sm:text-4xl font-bold leading-tight mb-4">
                  {isDe
                    ? "Goldbraun souffliert in Butterschmalz — digital inszeniert"
                    : "Golden Pan-Fried in Clarified Butter — Digitally Showcased"}
                </h2>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-6 font-sans">
                  {isDe
                    ? "Die Schnitzel Schmiede ist kein beliebiger Imbiss: Jedes Schnitzel wird frisch geschnitten, sorgfältig geklopft und in reinem Butterschmalz gebraten. Speisely hat diesen Qualitätsunterschied im digitalen Raum spürbar gemacht — mit appetitlicher Food-Inszenierung, Sauce-Alchemy-Labor und separater Knusper-Verpackung für die Lieferung."
                    : "Schnitzel Schmiede is no ordinary fast food joint: Every cutlet is sliced fresh, carefully tenderized, and pan-fried in pure clarified butter. Speisely brought this culinary craftsmanship online with mouthwatering food presentation, sauce alchemy, and crisp delivery packaging guarantees."}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2.5 text-xs text-white/90">
                    <CheckCircle2 className="h-4 w-4 text-[#E6B84A] shrink-0 mt-0.5" />
                    <span>
                      <strong>100% Butterschmalz-Garantie:</strong> Unverwechselbarer nussiger
                      Geschmack und perfekte Wellensoufflierung.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-white/90">
                    <CheckCircle2 className="h-4 w-4 text-[#E6B84A] shrink-0 mt-0.5" />
                    <span>
                      <strong>Sauce-Alchemy-Lab:</strong> Hausgemachte Champignon-Rahmsauce,
                      Jägersauce und Gladbacher Art mit Pfefferrahmsauce.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-white/90">
                    <CheckCircle2 className="h-4 w-4 text-[#E6B84A] shrink-0 mt-0.5" />
                    <span>
                      <strong>Knusper-Verpackung:</strong> Getrennte Schalen für Fleisch und
                      Beilagen verhindern das Aufweichen auf dem Lieferweg.
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-md rounded-2xl overflow-hidden border-2 border-[#E6B84A]/40 shadow-2xl bg-white/5 p-3">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden relative">
                    <img
                      src="/slide1_schnitzel_hero.webp"
                      alt="Goldbraunes Schnitzel Wiener Art in Butterschmalz souffliert"
                      className="w-full h-full object-cover"
                      loading="eager"
                      width={800}
                      height={600}
                    />
                    <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-md rounded-lg p-2.5 text-xs text-white flex items-center justify-between border border-white/20">
                      <span className="font-bold flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-[#E6B84A]" />
                        Schnitzel Schmiede MG
                      </span>
                      <span className="font-mono text-[#E6B84A]">Dohler Str. 269</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. THE 3 CORE PILLARS */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold text-[#A85C36] uppercase tracking-wider block mb-2">
              Die 3 Transformations-Säulen
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-forest">
              {isDe
                ? "Vom Drittportal zur eigenen Umsatzhoheit"
                : "From Platform Fee to Direct Profit"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="rounded-2xl bg-white p-6 border-2 border-forest/10 shadow-lg space-y-4">
              <div className="w-12 h-12 rounded-xl bg-forest/10 text-forest flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6 text-[#A85C36]" />
              </div>
              <h3 className="font-display text-xl font-bold text-forest">
                1. Marge schützen statt teilen
              </h3>
              <p className="text-xs sm:text-sm text-forest/75 leading-relaxed font-sans">
                Drittplattformen verlangen bis zu 30 % Gebühr pro Bestellung. Mit der eigenen
                Speisely-Webengine bestellen Stammkunden per WhatsApp oder Telefon direkt beim
                Betrieb — jeder Euro Gewinn bleibt beim Gastronomen.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-2xl bg-white p-6 border-2 border-forest/10 shadow-lg space-y-4">
              <div className="w-12 h-12 rounded-xl bg-forest/10 text-forest flex items-center justify-center font-bold">
                <Zap className="w-6 h-6 text-[#E6B84A]" />
              </div>
              <h3 className="font-display text-xl font-bold text-forest">
                2. PageSpeed 99 & Google AI
              </h3>
              <p className="text-xs sm:text-sm text-forest/75 leading-relaxed font-sans">
                Next.js SSR-Rendering garantiert blitzschnelle Ladezeiten unter 0.5 Sekunden auf
                jedem Smartphone. Gleichzeitig erfassen strukturierte Schema.org-Daten
                Speisekartenpreise für Google KI-Suchergebnisse.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-2xl bg-white p-6 border-2 border-forest/10 shadow-lg space-y-4">
              <div className="w-12 h-12 rounded-xl bg-forest/10 text-forest flex items-center justify-center font-bold">
                <ChefHat className="w-6 h-6 text-emerald-700" />
              </div>
              <h3 className="font-display text-xl font-bold text-forest">
                3. B2B Partyservice & Catering
              </h3>
              <p className="text-xs sm:text-sm text-forest/75 leading-relaxed font-sans">
                Die Schnitzelparty-Module (10, 20 und 40 Personen) eröffnen lukrative B2B-Umsätze
                für Firmenfeiern, Vereinstreffen und Familienfeste in Mönchengladbach, Rheydt und
                Umgebung.
              </p>
            </div>
          </div>
        </section>

        {/* 5. GASTRO-DOSSIER & FACTS */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="rounded-3xl bg-white p-6 sm:p-10 border-2 border-forest/15 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-forest/10">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A85C36]">
                  Gastro-Dossier & Partnerprofil
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-forest">
                  Schnitzel Schmiede Mönchengladbach
                </h3>
              </div>
              <a
                href="https://www.schnitzelschmiede-mg.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-forest text-[#FAF7F0] hover:bg-[#E6B84A] hover:text-forest transition font-sans text-xs font-semibold shadow-md"
              >
                <span>Website besuchen (schnitzelschmiede-mg.de)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-sans">
              <div className="space-y-3">
                <h4 className="font-mono text-xs uppercase tracking-wider text-forest font-bold">
                  Standort & Betriebsprofil
                </h4>
                <ul className="space-y-2 text-forest/85 text-xs sm:text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#E6B84A] shrink-0 mt-0.5" />
                    <span>
                      <strong>Adresse:</strong> Dohler Straße 269, 41238 Mönchengladbach
                      (Bonnenbroich/Dohr)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#E6B84A] shrink-0 mt-0.5" />
                    <span>
                      <strong>Zubereitung:</strong> Täglich frisch geklopftes Fleisch, gebraten in
                      reinem Butterschmalz ohne künstliche Zusätze.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#E6B84A] shrink-0 mt-0.5" />
                    <span>
                      <strong>Spezialitäten:</strong> Original Wiener Schnitzel, Schnitzel
                      Gladbacher Art, Cordon Bleu & hausgemachte Saucen.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-mono text-xs uppercase tracking-wider text-forest font-bold">
                  Speisely Technologie-Integration
                </h4>
                <ul className="space-y-2 text-forest/85 text-xs sm:text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-[#E6B84A] font-bold">•</span>
                    <span>
                      <strong>1-Klick WhatsApp Bestellschnittstelle:</strong> Kunden wählen ihr
                      Schnitzel und senden die Bestellung ohne Registrierung direkt an die Küche.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E6B84A] font-bold">•</span>
                    <span>
                      <strong>Partyservice-Pakete:</strong> Fest kalkulierte Gruppen-Catering-Menüs
                      für 10 bis 40 Gäste inklusive knusprigen Beilagen.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E6B84A] font-bold">•</span>
                    <span>
                      <strong>Automatischer Backlink & SEO-Schutz:</strong> Vollständige Verlinkung
                      mit{" "}
                      <Link
                        to="/catering/ort/$city"
                        params={{ city: "moenchengladbach" }}
                        className="underline decoration-[#E6B84A] decoration-2 underline-offset-2 hover:text-[#A85C36] font-bold"
                      >
                        Speiselys regionalem Mönchengladbach Gastro-Hub
                      </Link>
                      .
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 6. CALL TO ACTION: GET YOUR OWN ENGINE */}
        <section id="anfrage" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl bg-forest p-8 sm:p-12 text-[#FAF7F0] shadow-2xl border-2 border-[#E6B84A]/30 space-y-6">
            <span className="text-xs font-mono font-bold text-[#E6B84A] uppercase tracking-widest block">
              Für Restaurants, Caterer & Lieferdienste
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold leading-tight">
              {isDe
                ? "Möchten auch Sie unabhängig von Lieferplattformen werden?"
                : "Ready to Break Free from Delivery Platform Commissions?"}
            </h2>
            <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto font-sans leading-relaxed">
              {isDe
                ? "Wir bauen Ihnen eine maßgeschneiderte, blitzschnelle Webpräsenz mit direkter WhatsApp-Bestellung, Speisekarten-SEO und Google AI Overview Integration. Sprechen Sie mit uns."
                : "We engineer custom high-speed web presence with direct WhatsApp ordering, menu SEO, and Google AI Overview integration. Let us talk."}
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/partner/webseiten"
                className="inline-flex items-center gap-2 rounded-xl bg-[#E6B84A] text-forest font-bold px-6 py-3.5 text-sm shadow-xl hover:bg-white transition"
              >
                <span>
                  {isDe ? "Kostenlosen Website-Audit anfragen" : "Request Free Website Audit"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/partners"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 text-white font-bold px-6 py-3.5 text-sm hover:bg-white/20 transition"
              >
                <span>{isDe ? "Mehr über Partnerprogramme" : "More About Partnerships"}</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
