import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/PageHero";
import {
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Flame,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { digitalEditions, type DigitalEdition } from "@/data/digitalEditions";

export const Route = createFileRoute("/magazin/digital")({
  head: () => ({
    meta: [
      {
        title: "Digital Magazine — Speisely E-Paper Archiv & Ausgaben",
      },
      {
        name: "description",
        content:
          "Das offizielle E-Paper-Archiv von Speisely: Blättere interaktiv durch Food-Dossiers, Restaurant-Reportagen und Genusskultur im responsiven 3D-Viewer.",
      },
      {
        name: "keywords",
        content:
          "Speisely Digital Magazine, E-Paper Gastronomie, Food Journal Deutschland, Digitalausgabe Speisely, Restaurant Magazin Archiv",
      },
      {
        property: "og:title",
        content: "Speisely Digital Magazine — Interaktives E-Paper & Ausgaben-Archiv",
      },
      {
        property: "og:description",
        content:
          "Blättere durch das offizielle Speisely Magazin im hochauflösenden 3D E-Paper Viewer. Exklusive Food-Reportagen, Hotspots und Audio.",
      },
      {
        property: "og:image",
        content: "https://speisely.de/magazin/oktoberfest/oktoberfest_hendl_feast.jpg",
      },
      { property: "og:url", content: "https://speisely.de/magazin/digital" },
    ],
    links: [{ rel: "canonical", href: "https://speisely.de/magazin/digital" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Periodical",
          "@id": "https://speisely.de/magazin/digital#periodical",
          name: "Speisely Digital Magazine",
          issn: "SPEISELY-DIGITAL-JOURNAL-2026",
          publisher: {
            "@type": "Organization",
            name: "Speisely Marketplace",
            url: "https://speisely.de",
          },
          description:
            "Das führende deutsche Digital-Magazin für kuratierte Gastronomie, FoodTech und authentische Genusskultur.",
        }),
      },
    ],
  }),
  component: DigitalMagazinePage,
});

function DigitalMagazinePage() {
  const { lang } = useI18n();
  const isDe = lang === "de";
  const tt = (de: string, en: string) => (isDe ? de : en);

  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filterOptions = [
    { id: "all", labelDe: "Alle Ausgaben", labelEn: "All Issues" },
    { id: "2026", labelDe: "Jahrgang 2026", labelEn: "Volume 2026" },
    { id: "herbst", labelDe: "Herbst 2026", labelEn: "Autumn 2026" },
  ];

  const filteredEditions = useMemo(() => {
    if (activeFilter === "all") return digitalEditions;
    if (activeFilter === "2026") return digitalEditions.filter((e) => e.year === 2026);
    if (activeFilter === "herbst") return digitalEditions.filter((e) => e.seasonDe.includes("Herbst"));
    return digitalEditions;
  }, [activeFilter]);

  const featuredEdition = digitalEditions.find((e) => e.status === "published") || digitalEditions[0];

  return (
    <SiteShell>
      {/* 1. Page Hero */}
      <PageHero
        badge={tt("✦ DAS OFFIZIELLE E-PAPER ARCHIV", "✦ OFFICIAL E-PAPER ARCHIVE")}
        title={tt(
          "Speisely Digital Magazine — Ausgaben & E-Paper",
          "Speisely Digital Magazine — Issues & E-Paper Archive"
        )}
        subtitle={tt(
          "Blättere durch das Speisely Journal im responsiven 3D-Magazinleser: Hochauflösende Reportagen, interaktive Food-Hotspots, Hintergrundgespräche und B2B-Insights.",
          "Browse through Speisely Journal in the responsive 3D reader: High-resolution editorial stories, interactive hotspots, behind-the-scenes features, and B2B insights."
        )}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* 2. Top Banner: Current Hero Issue Showcase (ISJ Spotlight Standard) */}
        <div className="relative overflow-hidden rounded-3xl bg-[#083822] text-[#FAF8F5] p-6 sm:p-10 mb-16 shadow-2xl border border-[#E6B84A]/30">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-[#E6B84A]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Cover 3D Mockup Container */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-sm w-full">
                <div className="relative rounded-2xl overflow-hidden border-2 border-[#E6B84A]/60 shadow-[0_20px_50px_rgba(0,0,0,0.6)] aspect-[3/4] bg-forest/40">
                  <img
                    src={`${featuredEdition.coverImage}?v=3`}
                    alt={isDe ? featuredEdition.titleDe : featuredEdition.titleEn}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  
                  {/* Spine Highlight Effect */}
                  <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-white/30 via-white/5 to-transparent shadow-inner pointer-events-none" />

                  {/* Badge & Edition Info Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-black tracking-widest bg-[#E6B84A] text-forest uppercase shadow-lg">
                      {isDe ? featuredEdition.statusBadgeDe : featuredEdition.statusBadgeEn}
                    </span>
                    <span className="text-xs font-bold text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                      {featuredEdition.pageCount} {tt("Seiten", "Pages")}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[#E6B84A] text-xs font-serif font-black tracking-wider uppercase mb-1">
                      {isDe ? featuredEdition.seasonDe : featuredEdition.seasonEn} · {tt("Ausgabe", "Issue")} #{featuredEdition.issueNumber}
                    </p>
                    <h3 className="text-white font-serif text-lg font-bold leading-snug drop-shadow-md">
                      {isDe ? featuredEdition.titleDe : featuredEdition.titleEn}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Issue Highlights & Deep Dive */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E6B84A]/20 border border-[#E6B84A]/40 text-[#E6B84A] text-xs font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5" />
                <span>{tt("Aktuelle E-Paper Ausgabe", "Current E-Paper Issue")}</span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#F6F4EB] tracking-tight leading-tight">
                  {isDe ? featuredEdition.titleDe : featuredEdition.titleEn}
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[#DDEEE3] leading-relaxed">
                  {isDe ? featuredEdition.sublineDe : featuredEdition.sublineEn}
                </p>
              </div>

              {/* Story Bullets */}
              <div className="bg-forest/40 rounded-2xl p-4 sm:p-5 border border-forest/40 backdrop-blur-sm space-y-2.5">
                <p className="text-xs font-bold text-[#E6B84A] uppercase tracking-wider">
                  {tt("Schwerpunktthemen in dieser Ausgabe:", "Key Stories in this Issue:")}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[#F6F4EB]/90">
                  {featuredEdition.featuredStories.map((story, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[#E6B84A] font-bold">S. {story.page.toString().padStart(2, "0")}</span>
                      <span className="truncate">{story.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/magazin/reader"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#E6B84A] text-forest font-bold text-sm hover:bg-[#F2C965] shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{tt("📖 E-Paper im 3D-Leser öffnen", "📖 Open E-Paper in 3D Reader")}</span>
                </Link>
                <Link
                  to="/magazin"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-sm transition-all"
                >
                  <span>{tt("Alle Artikel im Magazin-Feed", "All Articles in Feed")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Filter Navigation (ISJ Archive Pattern) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-forest/10 mb-10">
          <div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-forest">
              {tt("Archiv aller Digitalausgaben", "All Digital Editions Archive")}
            </h3>
            <p className="text-xs sm:text-sm text-forest/70 mt-1">
              {tt(
                "Wähle einen Jahrgang oder eine Ausgabe zum interaktiven Durchblättern.",
                "Select a year or edition to read interactively."
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {filterOptions.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeFilter === f.id
                    ? "bg-forest text-white shadow-md"
                    : "bg-white text-forest/80 hover:bg-forest/5 border border-forest/15"
                }`}
              >
                {isDe ? f.labelDe : f.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Edition Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEditions.map((edition) => {
            const isAvailable = edition.status === "published";
            return (
              <div
                key={edition.id}
                className="group relative flex flex-col bg-white rounded-3xl border border-forest/15 overflow-hidden shadow-lg hover:shadow-2xl hover:border-[#E6B84A] transition-all duration-300"
              >
                {/* Cover Image Container */}
                <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                  <img
                    src={`${edition.coverImage}?v=3`}
                    alt={isDe ? edition.titleDe : edition.titleEn}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      isAvailable ? "group-hover:scale-105" : "filter grayscale opacity-75"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Top Status Badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase shadow-md ${
                        edition.status === "published"
                          ? "bg-[#E6B84A] text-forest"
                          : edition.status === "in_production"
                          ? "bg-blue-600 text-white"
                          : "bg-stone-700 text-white"
                      }`}
                    >
                      {isDe ? edition.statusBadgeDe : edition.statusBadgeEn}
                    </span>
                    <span className="text-[10px] font-bold text-white/90 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                      {edition.pageCount} {tt("Seiten", "Pages")}
                    </span>
                  </div>

                  {/* Bottom Spine & Title Preview */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-[#E6B84A] text-[11px] font-bold uppercase tracking-wider">
                      {isDe ? edition.seasonDe : edition.seasonEn} · #{edition.issueNumber}
                    </p>
                    <h4 className="text-white font-serif font-bold text-base leading-snug drop-shadow-sm">
                      {isDe ? edition.titleDe : edition.titleEn}
                    </h4>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-forest/80 line-clamp-2 leading-relaxed">
                    {isDe ? edition.sublineDe : edition.sublineEn}
                  </p>

                  {/* Stories Preview */}
                  <div className="space-y-1.5 pt-2 border-t border-forest/10">
                    <p className="text-[10px] font-black text-forest/60 uppercase tracking-wider">
                      {tt("Story-Highlights:", "Story Highlights:")}
                    </p>
                    <div className="space-y-1">
                      {edition.featuredStories.slice(0, 3).map((story, idx) => (
                        <div key={idx} className="flex items-center text-xs text-forest/90">
                          <span className="text-[#E6B84A] font-bold text-[11px] w-8">
                            S.{story.page.toString().padStart(2, "0")}
                          </span>
                          <span className="truncate flex-1">{story.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="pt-3">
                    {isAvailable ? (
                      <Link
                        to="/magazin/reader"
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-forest text-[#F6F4EB] font-bold text-xs hover:bg-[#0c4b2e] hover:text-[#E6B84A] transition-colors shadow"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{tt("Ausgabe im E-Paper lesen", "Read Issue in E-Paper")}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <div className="w-full py-2.5 px-4 rounded-xl bg-stone-100 text-stone-500 font-bold text-xs text-center border border-stone-200">
                        {edition.status === "in_production"
                          ? tt("🔨 Erscheint in Kürze (Nov 2026)", "🔨 Coming Soon (Nov 2026)")
                          : tt("✦ Winter-Ausgabe in Planung", "✦ Winter Issue in Planning")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 5. B2B Publisher Banner (ISJ Media Partnership Callout) */}
        <div className="mt-20 rounded-3xl bg-[#FAF8F5] border-2 border-forest/15 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A85C36]">
              <Sparkles className="w-3.5 h-3.5" />
              {tt("Für Gastronomen & B2B-Marken", "For Gastronomers & B2B Brands")}
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-forest">
              {tt("Möchtest du Teil der nächsten Ausgabe sein?", "Want to be featured in the next issue?")}
            </h3>
            <p className="text-xs sm:text-sm text-forest/70 max-w-xl">
              {tt(
                "Präsentiere dein Restaurant, deine Spezialität oder deine FoodTech-Lösung in der kommenden November-Ausgabe von Speisely.",
                "Feature your restaurant, craft specialty, or FoodTech solution in Speisely's upcoming November edition."
              )}
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-3">
            <Link
              to="/magazin/mediadaten"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#083822] text-[#F6F4EB] font-bold text-xs hover:bg-[#E6B84A] hover:text-forest transition-colors shadow-md"
            >
              <span>{tt("Mediadaten ansehen", "View Media Kit")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
