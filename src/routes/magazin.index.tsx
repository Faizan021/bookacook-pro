import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/PageHero";
import { ArrowRight, Calendar, Sparkles, MapPin, Eye } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/magazin/")({
  head: () => ({
    meta: [
      {
        title: "Speisely Magazin — Partner-Stories, Speisely Visits & Kulinarische Einblicke",
      },
      {
        name: "description",
        content:
          "Das offizielle Speisely Magazin: Echte Restaurantbesuche (Speisely Visits), Partner-Stories und kulinarische Einblicke aus Berlin, Mönchengladbach und ganz Deutschland.",
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
        content: "https://speisely.de/speisely_magazine_cover_v2.png",
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

type FilterType = "all" | "festivals" | "portraits" | "speisely-visits";

type Article = {
  id: string;
  categories: FilterType[];
};

const articles: Article[] = [
  { id: "schnitzel-schmiede", categories: ["festivals", "portraits"] },
  { id: "shawarma-albaik", categories: ["speisely-visits"] },
  { id: "mandy-restaurant", categories: ["speisely-visits"] },
];

function MagazinIndexPage() {
  const { lang } = useI18n();
  const isDe = lang === "de";
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const showSchnitzelSchmiede =
    activeFilter === "all" ||
    articles.find((a) => a.id === "schnitzel-schmiede")?.categories.includes(activeFilter);

  const showAlbaik =
    activeFilter === "all" ||
    articles.find((a) => a.id === "shawarma-albaik")?.categories.includes(activeFilter);

  const showMandy =
    activeFilter === "all" ||
    articles.find((a) => a.id === "mandy-restaurant")?.categories.includes(activeFilter);

  const filterTabs = isDe
    ? [
        { key: "all" as const, label: "Alle Ausgaben" },
        { key: "speisely-visits" as const, label: "Speisely Visits" },
        { key: "portraits" as const, label: "Partner-Stories" },
        { key: "festivals" as const, label: "Stadtfeste & Gourmet-Meilen" },
      ]
    : [
        { key: "all" as const, label: "All Issues" },
        { key: "speisely-visits" as const, label: "Speisely Visits" },
        { key: "portraits" as const, label: "Partner Stories" },
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
          className="flex items-center gap-2 pb-8 border-b border-[#173C32]/10 mb-10 overflow-x-auto no-scrollbar"
          role="tablist"
          aria-label="Artikel-Kategorien filtern"
        >
          {filterTabs.map(({ key, label }) => (
            <button
              key={key}
              role="tab"
              aria-selected={activeFilter === key}
              onClick={() => setActiveFilter(key)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === key
                  ? key === "speisely-visits"
                    ? "bg-[#7FA46B] text-white shadow"
                    : "bg-[#173C32] text-white shadow"
                  : "bg-white/80 text-[#173C32] hover:bg-[#173C32]/10 border border-[#173C32]/15"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Stories Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          role="tabpanel"
          aria-live="polite"
        >
          {/* Speisely Visits: Mandy */}
          {showMandy && (
            <Link
              to="/magazin/speisely-visits/mandy-restaurant-berlin-neukoelln"
              className="group flex flex-col overflow-hidden hover:ring-2 hover:ring-[#7FA46B] transition rounded-3xl shadow-xl border border-[#173C32]/10 bg-white"
            >
              <div className="relative overflow-hidden h-60 bg-[#0c1813]">
                <img
                  src="/magazin/mandy/mandy-lamm-fuer-zwei-berlin-neukoelln.jpg"
                  alt={
                    isDe
                      ? "Mandy Lamm für zwei mit Reis, Cashews, Kräutern und roter Sauce in Berlin-Neukölln"
                      : "Mandy Lamb for two with rice, cashews, herbs and red spicy sauce in Berlin-Neukölln"
                  }
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  width="800"
                  height="600"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#7FA46B] text-white px-3 py-1 text-xs font-extrabold shadow">
                    <Eye className="w-3 h-3" aria-hidden="true" />
                    Speisely Visits
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/90 text-[#173C32] px-2.5 py-1 text-xs font-bold shadow">
                    <MapPin className="w-3 h-3" aria-hidden="true" />
                    Berlin-Neukölln
                  </span>
                </div>
              </div>
              <div className="flex flex-col flex-1 p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#173C32]/50 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#E6B84A]" aria-hidden="true" />
                  <span>
                    {isDe
                      ? "17. August 2026 · Wildenbruchstraße, Berlin"
                      : "August 17, 2026 · Wildenbruchstraße, Berlin"}
                  </span>
                </div>
                <h2 className="font-serif text-xl font-black text-[#173C32] group-hover:text-[#b8860b] transition-colors leading-snug">
                  {isDe
                    ? "Warum wir bei Mandy natürlich Mandy bestellen mussten"
                    : "Why at Mandy We Naturally Had to Order Mandy"}
                </h2>
                <p className="text-sm text-[#173C32]/65 leading-relaxed flex-1">
                  {isDe
                    ? "Speisely besucht Mandy in Berlin-Neukölln. Wir bestellen Mandy Lamm für zwei, Getränke und Chai – und zahlen zusammen rund 45 Euro."
                    : "Speisely visits Mandy in Berlin-Neukölln. We order Mandy Lamb for two, drinks, and chai — paying around 45 Euros total."}
                </p>
                <div className="pt-2 border-t border-[#173C32]/10 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-[#173C32] group-hover:text-[#b8860b] flex items-center gap-1.5 transition-colors">
                    {isDe ? "Story lesen" : "Read Story"}{" "}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <span className="text-xs text-[#173C32]/40">
                    {isDe ? "5 Min. Lesezeit" : "5 min read"}
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Speisely Visits: Shawarma Albaik */}
          {showAlbaik && (
            <Link
              to="/magazin/speisely-visits/shawarma-albaik-berlin"
              className="group flex flex-col overflow-hidden hover:ring-2 hover:ring-[#7FA46B] transition rounded-3xl shadow-xl border border-[#173C32]/10 bg-white"
            >
              <div className="relative overflow-hidden h-60 bg-[#0c1813]">
                <img
                  src="/magazin/albaik/albaik-shawarma-rice-hero.jpg"
                  alt={
                    isDe
                      ? "Chicken Shawarma und gelber Reis bei Shawarma Albaik, Sonnenallee 28, Berlin-Neukölln"
                      : "Chicken Shawarma and yellow rice at Shawarma Albaik, Sonnenallee 28, Berlin-Neukölln"
                  }
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  width="800"
                  height="600"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#7FA46B] text-white px-3 py-1 text-xs font-extrabold shadow">
                    <Eye className="w-3 h-3" aria-hidden="true" />
                    Speisely Visits
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/90 text-[#173C32] px-2.5 py-1 text-xs font-bold shadow">
                    <MapPin className="w-3 h-3" aria-hidden="true" />
                    Berlin-Neukölln
                  </span>
                </div>
              </div>
              <div className="flex flex-col flex-1 p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#173C32]/50 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#E6B84A]" aria-hidden="true" />
                  <span>
                    {isDe
                      ? "16. August 2026 · Sonnenallee, Berlin"
                      : "August 16, 2026 · Sonnenallee, Berlin"}
                  </span>
                </div>
                <h2 className="font-serif text-xl font-black text-[#173C32] group-hover:text-[#b8860b] transition-colors leading-snug">
                  {isDe
                    ? "Ein Abend bei Shawarma Albaik auf der Sonnenallee"
                    : "An Evening at Shawarma Albaik on Sonnenallee"}
                </h2>
                <p className="text-sm text-[#173C32]/65 leading-relaxed flex-1">
                  {isDe
                    ? "Chicken Shawarma, gelber Reis, Fladenbrot und ein gemeinsamer Abend mit Freunden auf der Sonnenallee in Berlin-Neukölln."
                    : "Chicken shawarma, yellow rice, flatbread, and an evening shared with friends on Sonnenallee in Berlin-Neukölln."}
                </p>
                <div className="pt-2 border-t border-[#173C32]/10 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-[#173C32] group-hover:text-[#b8860b] flex items-center gap-1.5 transition-colors">
                    {isDe ? "Story lesen" : "Read Story"}{" "}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <span className="text-xs text-[#173C32]/40">
                    {isDe ? "4 Min. Lesezeit" : "4 min read"}
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Partner-Story: Schnitzel Schmiede */}
          {showSchnitzelSchmiede && (
            <Link
              to="/magazin/schnitzel-schmiede"
              className="group flex flex-col overflow-hidden hover:ring-2 hover:ring-[#173C32] transition rounded-3xl shadow-xl border border-[#173C32]/10 bg-white"
            >
              <div className="relative overflow-hidden h-60 bg-[#173C32]">
                <img
                  src="https://images.unsplash.com/photo-1599921841143-819065a55cc6?auto=format&fit=crop&w=1200&q=85"
                  alt={
                    isDe
                      ? "Schnitzel Schmiede beim EineStadt-Fest 2026 in Mönchengladbach"
                      : "Schnitzel Schmiede at EineStadt-Fest 2026 in Mönchengladbach"
                  }
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  width="1200"
                  height="800"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#173C32]/95 backdrop-blur text-[#E6B84A] px-3.5 py-1 text-xs font-extrabold shadow-lg border border-white/10">
                    <Sparkles className="w-3 h-3" aria-hidden="true" />{" "}
                    {isDe ? "Partner-Story" : "Partner Story"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur text-[#173C32] px-3 py-1 text-xs font-bold shadow-md">
                    <MapPin className="w-3 h-3 text-[#173C32]" aria-hidden="true" /> Mönchengladbach
                  </span>
                </div>
              </div>
              <div className="flex flex-col flex-1 p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#173C32]/60">
                  <Calendar className="w-3.5 h-3.5 text-[#E6B84A]" aria-hidden="true" />
                  <span>
                    {isDe
                      ? "14. – 16. August 2026 · EineStadt-Fest"
                      : "August 14–16, 2026 · EineStadt-Fest"}
                  </span>
                </div>
                <h2 className="font-serif text-xl font-black text-[#173C32] group-hover:text-[#b8860b] transition-colors leading-snug">
                  {isDe
                    ? "Schnitzel Schmiede beim EineStadt-Fest 2026"
                    : "Schnitzel Schmiede at EineStadt-Fest 2026"}
                </h2>
                <p className="text-sm text-[#173C32]/65 leading-relaxed flex-1">
                  {isDe
                    ? "Ein vertrauter Partner auf der kulinarischen Meile von Mönchengladbach: 13 Jahre Fest-Tradition und ein vertrauter Platz auf der kulinarischen Meile."
                    : "A familiar partner on Mönchengladbach's gourmet mile: 13 years of festival tradition and a dedicated culinary spot."}
                </p>
                <div className="pt-2 border-t border-[#173C32]/10 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-[#173C32] group-hover:text-[#b8860b] flex items-center gap-1.5 transition-colors">
                    {isDe ? "Story lesen" : "Read Story"}{" "}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <span className="text-xs text-[#173C32]/40">
                    {isDe ? "5 Min. Lesezeit" : "5 min read"}
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Empty state */}
          {!showAlbaik && !showSchnitzelSchmiede && (
            <div className="col-span-full py-16 text-center text-[#173C32]/40 font-medium">
              {isDe ? "Keine Artikel in dieser Kategorie." : "No articles found in this category."}
            </div>
          )}
        </div>

        {/* Speisely Visits category link */}
        <div className="mt-10 pt-8 border-t border-[#173C32]/10">
          <Link
            to="/magazin/speisely-visits"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#7FA46B] hover:text-[#173C32] transition-colors"
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
