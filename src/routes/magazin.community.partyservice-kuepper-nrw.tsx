import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/PageHero";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Flame,
  Award,
  UtensilsCrossed,
  ShieldCheck,
  TrendingUp,
  Calculator,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/magazin/community/partyservice-kuepper-nrw")({
  head: () => ({
    meta: [
      {
        title: "Partyservice Küpper: BBQ-Catering NRW | Speisely",
      },
      {
        name: "description",
        content:
          "Partyservice Küpper: Ehrliches Grill-Handwerk, All-Inclusive BBQ-Pakete und Fest-Catering für Firmen & Hochzeiten in ganz NRW im Speisely Porträt.",
      },
      {
        name: "keywords",
        content:
          "Partyservice Küpper, BBQ Catering NRW, Catering Mönchengladbach, Grillbuffet Hochzeit, Firmencatering NRW, Speisely Community Story",
      },
      { name: "geo.region", content: "DE-NW" },
      { name: "geo.placename", content: "Mönchengladbach & NRW" },
      {
        property: "og:title",
        content: "Partyservice Küpper: Echtes Grill-Handwerk & Premium BBQ-Catering in NRW",
      },
      {
        property: "og:description",
        content:
          "Von zarten Grillspießen bis zu All-Inclusive Buffets: Wie Partyservice Küpper mit Leidenschaft und digitaler Frische Events in ganz NRW begeistert.",
      },
      {
        property: "og:image",
        content: "https://speisely.de/magazin/partyservice-kuepper/kuepper_bbq_grill_platter.webp",
      },
      {
        property: "og:url",
        content: "https://speisely.de/magazin/community/partyservice-kuepper-nrw",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://speisely.de/magazin/community/partyservice-kuepper-nrw",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "@id": "https://speisely.de/magazin/community/partyservice-kuepper-nrw#article",
          headline: "Echtes Grill-Handwerk & Premium BBQ: Partyservice Küpper im Speisely Porträt",
          description:
            "Ein redaktioneller Einblick in das BBQ- und Event-Catering von Partyservice Küpper: All-Inclusive Pakete, faire Mengenberechnung und Grill-Leidenschaft in ganz NRW.",
          image: "https://speisely.de/magazin/partyservice-kuepper/kuepper_bbq_grill_platter.webp",
          datePublished: "2026-10-25T16:00:00+01:00",
          dateModified: "2026-10-25T16:00:00+01:00",
          author: {
            "@type": "Organization",
            name: "Speisely Redaktion",
            url: "https://speisely.de",
          },
          publisher: {
            "@type": "Organization",
            name: "Speisely Marketplace",
            url: "https://speisely.de",
            logo: {
              "@type": "ImageObject",
              url: "https://speisely.de/speisely_logo.png",
            },
          },
          contentLocation: {
            "@type": "CateringService",
            name: "Partyservice Küpper",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Mönchengladbach",
              addressRegion: "NRW",
              addressCountry: "DE",
            },
            url: "https://partyservicekuepper.de",
            servesCuisine: "BBQ, Grillbuffet, Event-Catering",
          },
        }),
      },
    ],
  }),
  component: PartyserviceKuepperArticlePage,
});

function PartyserviceKuepperArticlePage() {
  const { lang } = useI18n();
  const isDe = lang === "de";
  const tt = (de: string, en: string) => (isDe ? de : en);

  return (
    <SiteShell>
      <div className="bg-[#FAF8F5] text-forest min-h-screen selection:bg-[#E6B84A] selection:text-forest">
        {/* ─────────────────────────────────────────────────
            1. EDITORIAL HEADER & METADATA BAR
        ───────────────────────────────────────────────── */}
        <PageHero
          eyebrow={tt(
            "Speisely Community Partner · Mönchengladbach & NRW",
            "Speisely Community Partner · Mönchengladbach & NRW",
          )}
          heading={tt(
            "Feuer, Rauch & Frische: Wie Partyservice Küpper BBQ-Catering in NRW definiert",
            "Fire, Smoke & Precision: How Partyservice Küpper Defines BBQ Catering in NRW",
          )}
          subtext={tt(
            "Zwischen zischenden Grillstationen, handwerklich mariniertem Fleisch und einem modernen Online-Kalkulator: Ein Blick hinter die Kulissen eines der gefragtesten BBQ-Caterer des Rheinlands.",
            "Between sizzling barbecue stations, house-marinated meats, and digital event planning: Behind the scenes with one of North Rhine-Westphalia's premier event caterers.",
          )}
        />

        {/* ─────────────────────────────────────────────────
            2. EDITORIAL META STRIP
        ───────────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 mb-12 relative z-10">
          <div className="bg-white rounded-2xl border border-forest/10 p-4 sm:p-5 shadow-lg flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-forest/75">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-forest">
                <Calendar className="h-4 w-4 text-[#A85C36]" />
                25. Oktober 2026
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#A85C36]" />
                {tt("5 Min. Lesezeit", "5 min read")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[#A85C36]" />
                Mönchengladbach &amp; ganz NRW
              </span>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/5 border border-forest/15 px-3 py-1 text-[#083822] text-[11px] font-mono uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5 text-[#E6B84A]" />
              {tt("Geprüfter Partner", "Verified Partner")}
            </span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────
            3. MAIN ARTICLE BODY
        ───────────────────────────────────────────────── */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Breadcrumb Navigation */}
          <div className="mb-8">
            <Link
              to="/magazin"
              className="inline-flex items-center gap-2 text-xs font-bold text-forest/60 hover:text-forest transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{tt("Zurück zur Magazin-Übersicht", "Back to Magazine")}</span>
            </Link>
          </div>

          {/* Lead Paragraph */}
          <div className="prose prose-lg max-w-none text-forest/85 font-serif leading-relaxed mb-12">
            <p className="text-xl sm:text-2xl font-sans font-medium text-forest leading-snug border-l-4 border-[#E6B84A] pl-5 py-1 mb-8">
              {tt(
                "Wenn der Duft von Buchenholzkohle in die Luft steigt und zarte Spieße über offener Flamme goldbraun bräunen, beginnt für das Team von Partyservice Küpper der Arbeitstag. Was hier serviert wird, ist kein 08/15-Partyservice, sondern ein kompromissloses Bekenntnis zu handwerklicher Frische und verlässlicher Mengenplanung.",
                "When the aroma of natural beech charcoal fills the air and marinated skewers caramelize over open flames, Partyservice Küpper's workday begins. What is served here is not standard event catering, but an uncompromising commitment to artisan freshness and transparent portion planning.",
              )}
            </p>

            <p className="font-sans text-base sm:text-lg text-forest/80 leading-relaxed mb-6">
              {tt(
                "Egal ob Firmenjubiläum mit 300 Gästen im Industrie-Park, Sommerfest eines Mittelständlers oder eine romantische Scheunenhochzeit: Das Catering ist der emotionale Höhepunkt jeder Feier. Bei Partyservice Küpper hat man verstanden, dass Gastgeber vor allem zwei Dinge suchen: Erstklassigen Geschmack, der den Gästen noch Wochen später im Gedächtnis bleibt – und absolute Sorgenfreiheit bei der Mengen- und Budgetplanung.",
                "Whether a corporate anniversary with 300 guests, a summer celebration, or a romantic rustic barn wedding: catering is the emotional highlight of any event. Partyservice Küpper understands that hosts look for two things: remarkable flavor that guests remember for weeks, and complete peace of mind regarding portions and budgets.",
              )}
            </p>
          </div>

          {/* ─────────────────────────────────────────────────
              IMAGE 1: LUXURY PASSE-PARTOUT RETINA FRAME
          ───────────────────────────────────────────────── */}
          <div className="my-12">
            <figure className="max-w-2xl mx-auto">
              <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
                <img
                  src="/magazin/partyservice-kuepper/kuepper_bbq_grill_platter.webp?v=1"
                  alt="Partyservice Küpper BBQ Grillplatte mit Fleischspießen und Beilagen"
                  className="w-full aspect-[4/3] object-cover rounded-2xl"
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-3 flex items-center justify-between text-xs text-forest/70 px-2 font-sans">
                <span className="font-medium">
                  {tt(
                    "Das Signature-Grillbuffet: Saftige Spieße, Grillfleisch & hausgemachte Dips",
                    "The Signature Grill Platter: Tender skewers, steaks & house-made dips",
                  )}
                </span>
                <span className="font-mono text-[11px] text-forest/50">
                  Foto: Partyservice Küpper
                </span>
              </figcaption>
            </figure>
          </div>

          {/* ─────────────────────────────────────────────────
              SECTION: DAS GEHEIMNIS DER ALL-INCLUSIVE PAKETE
          ───────────────────────────────────────────────── */}
          <div className="prose prose-lg max-w-none text-forest/85 font-sans leading-relaxed mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E6B84A]/20 px-3.5 py-1 text-xs font-bold text-[#A85C36] mb-4">
              <Flame className="h-3.5 w-3.5" />
              <span>{tt("Transparente Menü-Struktur", "Transparent Menu Concepts")}</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest mb-4">
              {tt(
                "Kein Kleingedrucktes: Die beliebtesten BBQ-Pakete im Überblick",
                "No Fine Print: The Most Popular BBQ Packages at a Glance",
              )}
            </h2>

            <p className="text-base sm:text-lg text-forest/80 mb-6">
              {tt(
                "Ein häufiger Kritikpunkt an traditionellen Catering-Unternehmen sind unübersichtliche Kostenvoranschläge, bei denen Brot, Saucen, Teller oder Beilagen separat berechnet werden. Partyservice Küpper geht einen transparenten Weg mit kalkulationssicheren All-Inclusive Paketen:",
                "A common frustration with traditional caterers is convoluted quotes where bread, sauces, or setup incur surprise surcharges. Partyservice Küpper takes a refreshingly transparent approach with clear all-inclusive packages:",
              )}
            </p>

            {/* Menu Highlight Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 not-prose my-8">
              {/* Package 1 */}
              <div className="rounded-2xl bg-white border border-forest/15 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#A85C36] font-mono">
                      BBQ Klassiker
                    </span>
                    <span className="text-sm font-bold text-forest bg-forest/5 px-2.5 py-0.5 rounded-full">
                      ab 13,50 € p.P.
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-forest mb-2">
                    {tt("Der Party-Favorit", "The Crowd Favorite")}
                  </h3>
                  <p className="text-xs text-forest/75 leading-relaxed">
                    {tt(
                      "Kräftig marinierte Nackensteaks, saftige Bratwürste, hausgemachter Kartoffel- und Krautsalat sowie frisches Steinofenbaguette.",
                      "Marinated pork steaks, crisp sausages, hearty potato salad, coleslaw, and freshly baked baguette.",
                    )}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-forest/10 flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {tt("Ideal für Sommerfeste", "Ideal for summer parties")}
                </div>
              </div>

              {/* Package 2 */}
              <div className="rounded-2xl bg-[#083822] text-[#FAF7F0] p-5 shadow-lg border border-[#E6B84A]/30 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#E6B84A]/10 rounded-full blur-xl pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#E6B84A] font-mono">
                      BBQ Rustika
                    </span>
                    <span className="text-sm font-bold text-forest bg-[#E6B84A] px-2.5 py-0.5 rounded-full">
                      ab 13,90 € p.P.
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-2">
                    {tt("Deftig & Herzhaft", "Hearty & Traditional")}
                  </h3>
                  <p className="text-xs text-white/80 leading-relaxed">
                    {tt(
                      "Zarte Hähnchen- und Rinderspieße, Grillgemüse, Rosmarinkartoffeln und eine Auswahl an hausgemachten Kräuterdips.",
                      "Tender chicken & beef skewers, grilled Mediterranean vegetables, rosemary potatoes, and artisanal dips.",
                    )}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/15 flex items-center gap-1 text-[11px] font-semibold text-[#E6B84A]">
                  <Sparkles className="h-3.5 w-3.5" />
                  {tt("Bestseller für Firmenevents", "Bestseller for corporate events")}
                </div>
              </div>

              {/* Package 3 */}
              <div className="rounded-2xl bg-white border border-forest/15 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#A85C36] font-mono">
                      BBQ Venezia
                    </span>
                    <span className="text-sm font-bold text-forest bg-forest/5 px-2.5 py-0.5 rounded-full">
                      ab 29,90 € p.P.
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-forest mb-2">
                    {tt("Premium Hochzeits-Buffet", "Premium Wedding Buffet")}
                  </h3>
                  <p className="text-xs text-forest/75 leading-relaxed">
                    {tt(
                      "Edle Rumpsteaks, Lachsfilets von der Zedernholz-Planke, mediterrane Antipasti-Platten, Grill-Dessert und Service-Equipment.",
                      "Fine rump steaks, cedar plank salmon, antipasti boards, warm dessert, and complete catering gear.",
                    )}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-forest/10 flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {tt("Für Hochzeiten & Galas", "For weddings & formal galas")}
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────
              IMAGE 2: PASSE-PARTOUT FRAME (EVENT SETUP)
          ───────────────────────────────────────────────── */}
          <div className="my-12">
            <figure className="max-w-2xl mx-auto">
              <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
                <img
                  src="/magazin/partyservice-kuepper/kuepper_event_setup.webp?v=1"
                  alt="Live Catering Event Setup von Partyservice Küpper"
                  className="w-full aspect-[4/3] object-cover rounded-2xl"
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-3 flex items-center justify-between text-xs text-forest/70 px-2 font-sans">
                <span className="font-medium">
                  {tt(
                    "Frisch vor Ort gegrillt: Live-Catering für 20 bis 500 Gäste in ganz NRW",
                    "Freshly grilled on-site: Live catering for 20 to 500 guests across NRW",
                  )}
                </span>
                <span className="font-mono text-[11px] text-forest/50">Partyservice Küpper</span>
              </figcaption>
            </figure>
          </div>

          {/* ─────────────────────────────────────────────────
              SECTION: MENGENPLANUNG & FACHARTIKEL RATGEBER
          ───────────────────────────────────────────────── */}
          <div className="prose prose-lg max-w-none text-forest/85 font-sans leading-relaxed mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest mb-4">
              {tt(
                "Keine Reste, keine hungrigen Gäste: Der neue Küpper Mengen-Ratgeber",
                "Zero Waste, Zero Hungry Guests: The New Küpper Portion Guide",
              )}
            </h2>

            <p className="text-base sm:text-lg text-forest/80 mb-6">
              {tt(
                "Mit der Veröffentlichung ihres neuen Leitfadens „BBQ-Catering Mengen berechnen: Wie viel Fleisch, Beilagen & Salate pro Person?“ liefert Partyservice Küpper Event-Planern ein unverzichtbares Werkzeug. Von exakten Grammzahlen für unterschiedliche Event-Laufzeiten bis zu ausgewogenen Anteilen für vegetarische Gäste setzt der Caterer Maßstäbe für ehrliche Beratung.",
                "With the launch of their comprehensive guide 'Calculating BBQ Catering Quantities: How Much Meat, Sides & Salads Per Guest?', Partyservice Küpper provides event planners with an indispensable tool, setting new standards for transparent planning across North Rhine-Westphalia.",
              )}
            </p>

            {/* Speisely Case Study Bridge Card */}
            <div className="not-prose my-8 p-6 rounded-3xl bg-gradient-to-br from-forest/5 to-white border-2 border-forest/15 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E6B84A]/20 flex items-center justify-center text-[#A85C36] shrink-0">
                  <Calculator className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#A85C36] block">
                    {tt("Digitale Transformation", "Digital Transformation")}
                  </span>
                  <h4 className="font-display text-lg font-bold text-forest">
                    {tt(
                      "Die offizielle Speisely Case Study zu Küpper",
                      "The Official Speisely Case Study on Küpper",
                    )}
                  </h4>
                  <p className="text-xs text-forest/75 mt-1 max-w-md">
                    {tt(
                      "Erfahren Sie, wie Speisely mit All-Inclusive BBQ-Paketen, Live-Kalkulator und Google AI-SEO für +120% mehr qualifizierte Firmenanfragen sorgte.",
                      "Read how Speisely's booking engine and Google AI SEO drove a 120% surge in qualified corporate event briefs.",
                    )}
                  </p>
                </div>
              </div>

              <Link
                to="/case-study/partyservice-kuepper"
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-forest text-[#FAF7F0] px-5 py-3 text-xs font-bold hover:bg-[#E6B84A] hover:text-forest transition shadow"
              >
                <span>{tt("Case Study lesen", "Read Case Study")}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────
              PARTNER FACTSHEET & DIRECT CONTACT
          ───────────────────────────────────────────────── */}
          <div className="bg-white rounded-3xl border-2 border-forest/15 p-6 sm:p-8 shadow-xl my-12 not-prose">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-forest/10 pb-6 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A85C36] uppercase tracking-wider font-mono mb-1">
                  <Award className="h-4 w-4 text-[#E6B84A]" />
                  <span>Speisely Factsheet</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-forest">
                  Partyservice Küpper · BBQ &amp; Event-Catering
                </h3>
              </div>

              <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3.5 py-1 text-xs font-bold inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {tt("Jetzt Buchungen für 2026/2027", "Booking open for 2026/2027")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-forest/85 mb-8">
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-forest/10">
                <span className="font-bold text-forest block mb-1">
                  📍 {tt("Einsatzgebiet", "Service Area")}:
                </span>
                <span>Mönchengladbach, Krefeld, Neuss, Düsseldorf, Viersen &amp; ganz NRW</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-forest/10">
                <span className="font-bold text-forest block mb-1">
                  🥩 {tt("Spezialitäten", "Specialties")}:
                </span>
                <span>
                  BBQ Klassiker, Rustika, Venezia, Spanferkel, Grillbuffet &amp; Fingerfood
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-forest/10">
                <span className="font-bold text-forest block mb-1">
                  👥 {tt("Kapazitäten", "Capacity")}:
                </span>
                <span>Events ab 8 Personen bis 500+ Gäste</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-forest/10">
                <span className="font-bold text-forest block mb-1">
                  💻 {tt("Website & Live-Kalkulator", "Website & Calculator")}:
                </span>
                <a
                  href="https://partyservicekuepper.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A85C36] font-bold hover:underline inline-flex items-center gap-1"
                >
                  partyservicekuepper.de
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-forest/10">
              <a
                href="https://partyservicekuepper.de/#angebot"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-forest text-[#FAF7F0] px-6 py-3.5 text-xs sm:text-sm font-bold shadow-lg hover:bg-[#E6B84A] hover:text-forest transition"
              >
                <span>{tt("Catering unverbindlich anfragen", "Request Catering Quote")}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </article>
      </div>
    </SiteShell>
  );
}
