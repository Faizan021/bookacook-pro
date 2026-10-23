import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/PageHero";
import { ArrowRight, Calendar, Sparkles, MapPin, Eye } from "lucide-react";
import { useState, useMemo, useTransition } from "react";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/magazin/")({
  head: () => ({
    meta: [
      {
        title: "Speisely Magazin — Food Stories & Einblicke",
      },
      {
        name: "description",
        content:
          "Das Speisely Magazin: Echte Restaurantbesuche, Partner-Stories und kulinarische Empfehlungen aus ganz Deutschland.",
      },
      {
        name: "keywords",
        content:
          "Speisely Magazin, Speisely Visits, Food Stories Deutschland, Restaurantbesuch Berlin, Partner-Stories, Schnitzel Schmiede Mönchengladbach",
      },
      {
        property: "og:title",
        content: "Speisely Magazin — Partner-Stories & Kulinarische Einblicke",
      },
      {
        property: "og:description",
        content:
          "Echte Restaurantbesuche, Partner-Stories und kulinarische Entdeckungen aus Deutschland.",
      },
      {
        property: "og:image",
        content: "https://speisely.de/speisely_magazine_cover_v2.webp",
      },
      { property: "og:url", content: "https://speisely.de/magazin" },
    ],
    links: [{ rel: "canonical", href: "https://speisely.de/magazin" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": "https://speisely.de/magazin#page",
          name: "Speisely Magazin",
          url: "https://speisely.de/magazin",
          description:
            "Das redaktionelle Magazin von Speisely mit echten Restaurantbesuchen, Partner-Porträts und kulinarischen Einblicken.",
          publisher: {
            "@type": "Organization",
            "@id": "https://speisely.de/#organization",
            name: "Speisely",
            url: "https://speisely.de",
            logo: "https://speisely.de/speisely_logo.png",
          },
        }),
      },
    ],
  }),
  component: MagazinIndexPage,
});

import {
  magazineArticles,
  type ArticleCategory,
  type MagazineArticle,
} from "@/data/magazineArticles";

type FilterType = ArticleCategory;

function MagazinIndexPage() {
  const { lang } = useI18n();
  const isDe = lang === "de";
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  // React 18/19 INP Optimization: Defer article grid re-render on tab click
  const [, startTransition] = useTransition();

  const handleFilterChange = (key: FilterType) => {
    startTransition(() => {
      setActiveFilter(key);
    });
  };

  const filteredArticles = useMemo(() => {
    if (activeFilter === "all") return magazineArticles;
    return magazineArticles.filter((a) => a.categories.includes(activeFilter));
  }, [activeFilter]);

  const filterTabs = isDe
    ? [
        { key: "all" as const, label: "Alle Ausgaben" },
        { key: "speisely-visits" as const, label: "Speisely Visits (Vor-Ort)" },
        { key: "community" as const, label: "Community-Stories" },
        { key: "festivals" as const, label: "Stadtfeste & Gourmet-Meilen" },
      ]
    : [
        { key: "all" as const, label: "All Stories" },
        { key: "speisely-visits" as const, label: "Speisely Visits (On-Site)" },
        { key: "community" as const, label: "Community Stories" },
        { key: "festivals" as const, label: "City Festivals & Gourmet Miles" },
      ];

  return (
    <SiteShell>
      <PageHero
        eyebrow={isDe ? "Einblicke, Feste & Handwerk" : "Insights, Festivals & Craft"}
        heading="Speisely Magazin"
        subtext={
          isDe
            ? "Authentische Reportagen, traditionsreiche Stadtfeste und kulinarisches Handwerk aus ganz Deutschland."
            : "Authentic culinary reports, traditional city festivals, and culinary craft from across Germany."
        }
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-24 pt-8">
        {/* Navigation / Filter Tabs */}
        <div
          className="flex items-center gap-2 pb-8 border-b border-[#173C32]/10 mb-8 overflow-x-auto no-scrollbar"
          role="tablist"
          aria-label="Artikel-Kategorien filtern"
        >
          {filterTabs.map(({ key, label }) => (
            <button
              key={key}
              role="tab"
              aria-selected={activeFilter === key}
              onClick={() => handleFilterChange(key)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === key
                  ? key === "speisely-visits"
                    ? "bg-[#16382b] text-white shadow border border-[#7FA46B]/50"
                    : "bg-[#173C32] text-white shadow"
                  : "bg-white/80 text-[#173C32] hover:bg-[#173C32]/10 border border-[#173C32]/15"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 3D Flip Magazine Feature Banner */}
        <div className="mb-10 rounded-3xl overflow-hidden bg-gradient-to-r from-[#0d1813] via-[#14281D] to-[#1c3829] border-2 border-[#E6B84A]/30 p-6 sm:p-8 text-white shadow-2xl relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E6B84A]/10 border border-[#E6B84A]/30 px-3 py-1 text-[11px] font-bold text-[#E6B84A] uppercase tracking-wider mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              {isDe ? "Neu: Interaktives E-Paper" : "New: Interactive E-Paper"}
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              {isDe
                ? "Speisely Magazin — Digital Flip Edition"
                : "Speisely Magazine — Digital Flip Edition"}
            </h3>
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-4">
              {isDe
                ? "Erlebe unsere Reportagen im luxuriösen 3D-Doppelseiten-Layout mit realistischem Blättern, Audio-Feedback und Q&A-Interviews."
                : "Experience our reports in luxury dual-page 3D flipbook layout with realistic page curl, audio feedback, and Q&A interviews."}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/magazin/reader"
                className="inline-flex items-center gap-2 rounded-xl bg-[#E6B84A] text-black px-5 py-2.5 text-xs font-bold shadow-lg shadow-[#E6B84A]/20 hover:bg-[#c49638] transition"
              >
                <span>{isDe ? "Digital Edition öffnen 📖" : "Open Digital Edition 📖"}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="/magazin/edition.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white transition px-3 py-2"
              >
                <span>{isDe ? "Vollbildmodus ↗" : "Fullscreen ↗"}</span>
              </a>
            </div>
          </div>

          <div
            className="relative z-10 w-full md:w-64 h-36 rounded-2xl overflow-hidden border border-white/20 shadow-xl flex-shrink-0 bg-black/40 flex items-center justify-center group cursor-pointer"
            onClick={() => window.open("/magazin/edition.html", "_blank")}
          >
            <img
              src="/hero-cinematic.webp"
              alt="Digital Edition Preview"
              className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="p-3 rounded-full bg-[#E6B84A] text-black shadow-xl group-hover:scale-110 transition">
                <ArrowRight className="h-5 w-5" />
              </span>
            </div>
          </div>
        </div>

        {/* B2B Media Kit & Partner Banner (Commercial Inquiries for Gastro & HoReCa) */}
        <div className="mb-10 rounded-3xl bg-[#FAF8F5] border-2 border-forest/15 p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#A85C36]">
              {isDe ? "Für Gastronomie, POS & HoReCa-Marken" : "For Hospitality & Food-Tech Brands"}
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-forest">
              {isDe
                ? "Präsentiere dein Restaurant oder Produkt im Speisely Magazin"
                : "Feature Your Restaurant or Brand in Speisely Magazine"}
            </h3>
            <p className="text-xs sm:text-sm text-forest/75 leading-relaxed">
              {isDe
                ? "Erreiche monatlich über 25.000 Gastronomie-Entscheider, Event-Planer und Feinschmecker mit exklusiven Editorials, Vor-Ort-Besuchen und B2B-Spotlights."
                : "Reach over 25,000 monthly food lovers, caterers, and restaurant owners with tailored editorial features and B2B spotlights."}
            </p>
          </div>
          <div className="shrink-0 flex flex-wrap items-center gap-3">
            <Link
              to="/magazin/mediadaten"
              className="inline-flex items-center gap-2 rounded-2xl bg-forest text-[#FAF8F5] px-5 py-3 text-xs font-bold shadow-md hover:bg-[#1a382b] transition"
            >
              <span>{isDe ? "Mediadaten & Pakete ↗" : "Media Kit & Packages ↗"}</span>
            </Link>
          </div>
        </div>

        {/* Stories Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          role="tabpanel"
          aria-live="polite"
        >
          {filteredArticles.map((article) => {
            const isVisit = article.categories.includes("speisely-visits");
            return (
              <Link
                key={article.id}
                to={article.to}
                className="group flex flex-col overflow-hidden hover:ring-2 hover:ring-[#E6B84A] transition-all duration-300 rounded-3xl shadow-xl border border-[#173C32]/10 bg-white hover:-translate-y-1"
              >
                <div className="relative overflow-hidden h-60 bg-[#0c1813]">
                  <img
                    src={`${article.image}${article.image.includes("?") ? "&" : "?"}v=2`}
                    alt={isDe ? article.titleDe : article.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    width="800"
                    height="600"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold shadow ${
                        isVisit
                          ? "bg-[#16382b] text-white border border-[#7FA46B]/50"
                          : "bg-[#173C32]/95 backdrop-blur text-[#E6B84A] border border-white/10"
                      }`}
                    >
                      {isVisit ? (
                        <Eye className="w-3 h-3" aria-hidden="true" />
                      ) : (
                        <Sparkles className="w-3 h-3" aria-hidden="true" />
                      )}
                      {isDe ? article.categoryBadgeDe : article.categoryBadgeEn}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur text-[#173C32] px-2.5 py-1 text-xs font-bold shadow">
                      <MapPin className="w-3 h-3 text-[#173C32]" aria-hidden="true" />
                      {article.location}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#173C32]/80 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-[#b8860b]" aria-hidden="true" />
                    <span>{isDe ? article.dateDe : article.dateEn}</span>
                  </div>
                  <h2 className="font-serif text-xl font-black text-[#173C32] group-hover:text-[#b8860b] transition-colors leading-snug">
                    {isDe ? article.titleDe : article.titleEn}
                  </h2>
                  <p className="text-sm text-[#173C32]/85 leading-relaxed flex-1">
                    {isDe ? article.excerptDe : article.excerptEn}
                  </p>
                  <div className="pt-3 border-t border-[#173C32]/10 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-[#173C32] group-hover:text-[#b8860b] flex items-center gap-1.5 transition-colors">
                      {isDe ? "Story lesen" : "Read Story"}{" "}
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <span className="text-xs text-[#173C32]/75 font-medium">
                      {article.readTime} {isDe ? "Lesezeit" : "read"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Empty state */}
          {filteredArticles.length === 0 && (
            <div className="col-span-full py-16 text-center text-[#173C32]/40 font-medium">
              {isDe ? "Keine Artikel in dieser Kategorie." : "No articles found in this category."}
            </div>
          )}
        </div>

        {/* Speisely Visits category link */}
        <div className="mt-10 pt-8 border-t border-[#173C32]/10">
          <Link
            to="/magazin/speisely-visits"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1b4d3e] hover:text-[#b8860b] transition-colors"
          >
            <Eye className="w-4 h-4" aria-hidden="true" />
            {isDe ? "Alle Speisely Visits ansehen" : "View all Speisely Visits"}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* GEO Location & Regional Index Box for SEO / AI Discovery */}
        <div className="mt-20 rounded-3xl bg-[#173C32] text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="text-xs font-bold text-[#E6B84A] uppercase tracking-widest">
              {isDe ? "Regionale Partner entdecken" : "Discover Regional Partners"}
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
              Gastronomie & Catering in deiner Region
            </h3>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Speisely stellt inhabergeführte Gastronomiebetriebe, Food Trucks und Event-Caterer in
              ganz Nordrhein-Westfalen und Deutschland vor. Entdecke geprüfte Partner in
              Mönchengladbach, Krefeld, Neuss, Düsseldorf, Köln und darüber hinaus.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/catering"
                className="px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-[#173C32] rounded-full text-xs font-bold transition"
              >
                Catering finden
              </Link>
              <Link
                to="/restaurants"
                className="px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-[#173C32] rounded-full text-xs font-bold transition"
              >
                Restaurants entdecken
              </Link>
              <Link
                to="/partners"
                className="px-4 py-2 bg-[#E6B84A] hover:bg-white text-[#173C32] rounded-full text-xs font-bold transition"
              >
                Als Partner bewerben
              </Link>
            </div>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
