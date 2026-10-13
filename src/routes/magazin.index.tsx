import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/PageHero";
import { ArrowRight, Calendar, Sparkles, MapPin, Eye } from "lucide-react";
import { useState, useMemo } from "react";
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

type FilterType = "all" | "speisely-visits" | "community" | "guides" | "festivals";

type Article = {
  id: string;
  slug: string;
  titleDe: string;
  titleEn: string;
  excerptDe: string;
  excerptEn: string;
  image: string;
  categoryBadgeDe: string;
  categoryBadgeEn: string;
  location: string;
  dateDe: string;
  dateEn: string;
  readTime: string;
  categories: FilterType[];
  to: string;
};

const articles: Article[] = [
  {
    id: "mandy-restaurant",
    slug: "mandy-restaurant-berlin-neukoelln",
    titleDe: "Warum wir bei Mandy natürlich Mandy bestellen mussten",
    titleEn: "Why at Mandy We Naturally Had to Order Mandy",
    excerptDe:
      "Speisely besucht Mandy in Berlin-Neukölln. Wir bestellen Mandy Lamm für zwei, Vorspeisen und Chai – und zahlen rund 45 Euro.",
    excerptEn:
      "Speisely visits Mandy in Berlin-Neukölln. We order Mandy Lamb for two, appetizers, and chai — paying around 45 Euros total.",
    image: "/magazin/mandy/mandy-lamm-fuer-zwei-berlin-neukoelln.webp",
    categoryBadgeDe: "Speisely Visits",
    categoryBadgeEn: "Speisely Visits",
    location: "Berlin-Neukölln",
    dateDe: "17. August 2026 · Wildenbruchstraße, Berlin",
    dateEn: "August 17, 2026 · Wildenbruchstraße, Berlin",
    readTime: "5 Min.",
    categories: ["speisely-visits"],
    to: "/magazin/speisely-visits/mandy-restaurant-berlin-neukoelln",
  },
  {
    id: "shawarma-albaik",
    slug: "shawarma-albaik-berlin",
    titleDe: "Ein Abend bei Shawarma Albaik auf der Sonnenallee",
    titleEn: "An Evening at Shawarma Albaik on Sonnenallee",
    excerptDe:
      "Chicken Shawarma, gelber Reis, Knoblauchsauce und ein gemeinsamer Abend mit Freunden auf der Sonnenallee in Berlin-Neukölln.",
    excerptEn:
      "Chicken shawarma, yellow rice, garlic sauce, and an evening shared with friends on Sonnenallee in Berlin-Neukölln.",
    image: "/magazin/albaik/albaik-shawarma-rice-hero.webp",
    categoryBadgeDe: "Speisely Visits",
    categoryBadgeEn: "Speisely Visits",
    location: "Berlin-Neukölln",
    dateDe: "16. August 2026 · Sonnenallee, Berlin",
    dateEn: "August 16, 2026 · Sonnenallee, Berlin",
    readTime: "4 Min.",
    categories: ["speisely-visits"],
    to: "/magazin/speisely-visits/shawarma-albaik-berlin",
  },
  {
    id: "king-tut-restaurant",
    slug: "king-tut-restaurant-berlin",
    titleDe: "Hawawshi & Holzkohlegrill auf Silberplatten: King Tut Berlin",
    titleEn: "Hawawshi & Charcoal Grill on Silver Platters: King Tut Berlin",
    excerptDe:
      "Knuspriges Hawawshi, dampfende Molokhia und kaiserliche Silberplatten mit Holzkohlegrill-Spezialitäten in Berlin-Wilmersdorf.",
    excerptEn:
      "Crisp hawawshi, steaming molokhia, and imperial silver platters of charcoal grill specialties in Berlin-Wilmersdorf.",
    image: "/magazin/king-tut-berlin/16_king_tut_hawawshi_molokhia_hd.jpg",
    categoryBadgeDe: "Community Story",
    categoryBadgeEn: "Community Story",
    location: "Berlin-Wilmersdorf",
    dateDe: "Oktober 2026 · Hohenzollerndamm, Berlin",
    dateEn: "October 2026 · Hohenzollerndamm, Berlin",
    readTime: "6 Min.",
    categories: ["community"],
    to: "/magazin/community/king-tut-restaurant-berlin",
  },
  {
    id: "baba-pirzola",
    slug: "baba-pirzola-berlin",
    titleDe: "Feuer, Meze & große Grillkunst: Ein Abend im Baba Pirzola",
    titleEn: "Fire, Meze & Masterful Grilling: An Evening at Baba Pirzola",
    excerptDe:
      "Zwischen KaDeWe und Wittenbergplatz: Kuzu Pirzola, rauchiges Nazik Ali, 300g Antrikot und warmes Katmer mit Eis.",
    excerptEn:
      "Between KaDeWe and Wittenbergplatz: Kuzu Pirzola, smoky Nazik Ali, 300g ribeye, and warm katmer with ice cream.",
    image: "/magazin/baba-pirzola-berlin/01_baba_pirzola_feast_table_hd.jpg",
    categoryBadgeDe: "Community Story",
    categoryBadgeEn: "Community Story",
    location: "Berlin-Schöneberg",
    dateDe: "September 2026 · Wittenbergplatz, Berlin",
    dateEn: "September 2026 · Wittenbergplatz, Berlin",
    readTime: "7 Min.",
    categories: ["community"],
    to: "/magazin/community/baba-pirzola-berlin",
  },
  {
    id: "bbq-chicken",
    slug: "bbq-chicken-berlin-kreuzberg",
    titleDe: "Korean Fried Chicken & Secret Glaze: BBQ Chicken Kreuzberg",
    titleEn: "Korean Fried Chicken & Secret Glaze: BBQ Chicken Kreuzberg",
    excerptDe:
      "Golden Olive Crunch, samtiges Cheesling-Puder und scharfe Secret Glaze in der Skalitzer Straße 97 in Berlin-Kreuzberg.",
    excerptEn:
      "Golden Olive crunch, velvet cheesling powder, and fiery secret glaze at Skalitzer Straße 97 in Berlin-Kreuzberg.",
    image: "/magazin/bbq-chicken-berlin/01_golden_fried_chicken_hero.jpg",
    categoryBadgeDe: "Community Story",
    categoryBadgeEn: "Community Story",
    location: "Berlin-Kreuzberg",
    dateDe: "September 2026 · Skalitzer Straße, Berlin",
    dateEn: "September 2026 · Skalitzer Straße, Berlin",
    readTime: "5 Min.",
    categories: ["community"],
    to: "/magazin/community/bbq-chicken-berlin-kreuzberg",
  },
  {
    id: "neumanns-cafe",
    slug: "neumanns-cafe-berlin",
    titleDe: "Handwerklicher Sauerteig & pochierte Bio-Eier: Neumanns Café",
    titleEn: "Artisanal Sourdough & Poached Bio Eggs: Neumanns Café",
    excerptDe:
      "Eigene Bäckerei im Friedrichshain: Pochierte Eier auf Blattspinat, Karotten-Stulle mit Ziegenkäse und Andraschko Espresso.",
    excerptEn:
      "In-house bakery in Friedrichshain: Poached eggs on spinach, carrot toast with goat cheese, and Andraschko espresso.",
    image: "/magazin/neumanns-cafe-berlin/05_poached_eggs_spinach_hd.jpg",
    categoryBadgeDe: "Community Story",
    categoryBadgeEn: "Community Story",
    location: "Berlin-Friedrichshain",
    dateDe: "August 2026 · Gabriel-Max-Straße, Berlin",
    dateEn: "August 2026 · Gabriel-Max-Straße, Berlin",
    readTime: "5 Min.",
    categories: ["community"],
    to: "/magazin/community/neumanns-cafe-berlin",
  },
  {
    id: "schnitzel-schmiede",
    slug: "schnitzel-schmiede",
    titleDe: "Schnitzel Schmiede beim EineStadt-Fest 2026",
    titleEn: "Schnitzel Schmiede at EineStadt-Fest 2026",
    excerptDe:
      "Ein vertrauter Partner auf der kulinarischen Meile von Mönchengladbach: 13 Jahre Fest-Tradition und frisches Handwerk.",
    excerptEn:
      "A trusted partner on Mönchengladbach's gourmet mile: 13 years of festival tradition and fresh craft.",
    image:
      "https://images.unsplash.com/photo-1599921841143-819065a55cc6?auto=format&fit=crop&w=1200&q=85",
    categoryBadgeDe: "Partner-Story",
    categoryBadgeEn: "Partner Story",
    location: "Mönchengladbach",
    dateDe: "14. – 16. August 2026 · EineStadt-Fest",
    dateEn: "August 14–16, 2026 · EineStadt-Fest",
    readTime: "5 Min.",
    categories: ["festivals", "community"],
    to: "/magazin/schnitzel-schmiede",
  },
];

function MagazinIndexPage() {
  const { lang } = useI18n();
  const isDe = lang === "de";
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredArticles = useMemo(() => {
    if (activeFilter === "all") return articles;
    return articles.filter((a) => a.categories.includes(activeFilter));
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
                          ? "bg-[#7FA46B] text-white"
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
                  <div className="flex items-center gap-2 text-xs text-[#173C32]/50 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#E6B84A]" aria-hidden="true" />
                    <span>{isDe ? article.dateDe : article.dateEn}</span>
                  </div>
                  <h2 className="font-serif text-xl font-black text-[#173C32] group-hover:text-[#b8860b] transition-colors leading-snug">
                    {isDe ? article.titleDe : article.titleEn}
                  </h2>
                  <p className="text-sm text-[#173C32]/65 leading-relaxed flex-1">
                    {isDe ? article.excerptDe : article.excerptEn}
                  </p>
                  <div className="pt-3 border-t border-[#173C32]/10 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-[#173C32] group-hover:text-[#b8860b] flex items-center gap-1.5 transition-colors">
                      {isDe ? "Story lesen" : "Read Story"}{" "}
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <span className="text-xs text-[#173C32]/45">
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
