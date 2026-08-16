import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/PageHero";
import { ArrowRight, Calendar, Sparkles, BookOpen, MapPin, Filter } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/magazin/")({
  head: () => ({
    meta: [
      { title: "Speisely Magazin — Partner-Stories, Stadtfeste & Kulinarisches Handwerk" },
      {
        name: "description",
        content:
          "Das offizielle Speisely Magazin: Authentische Reportagen, Feste und kulinarisches Handwerk aus Mönchengladbach, Düsseldorf, Köln und ganz Deutschland.",
      },
      {
        name: "keywords",
        content:
          "Speisely Magazin, Food Magazin Deutschland, Catering Reportagen, Schnitzel Schmiede Mönchengladbach, EineStadt-Fest 2026, Restaurant Geschichten",
      },
      {
        property: "og:title",
        content: "Speisely Magazin — Partner-Stories & Kulinarische Einblicke",
      },
      {
        property: "og:description",
        content:
          "Authentische Reportagen, traditionsreiche Feste und kulinarisches Handwerk aus ganz Deutschland.",
      },
      { property: "og:image", content: "https://speisely.de/speisely_magazine_cover_v2.png" },
      { property: "og:url", content: "https://speisely.de/magazin" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Speisely Magazin",
          url: "https://speisely.de/magazin",
          description:
            "Das redaktionelle Magazin von Speisely mit Partner-Porträts, Stadtfesten und kulinarischem Handwerk.",
          publisher: {
            "@type": "Organization",
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

function MagazinIndexPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "festivals" | "portraits">("all");

  return (
    <SiteShell>
      <PageHero
        eyebrow="Speisely Magazin · Ausgabe 01 · 2026"
        heading="Geschichten & Partner-Porträts"
        subtext="Authentische Reportagen, traditionsreiche Stadtfeste und kulinarisches Handwerk aus ganz Deutschland."
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-24 pt-8">
        {/* Navigation / Filter Tabs */}
        <div className="flex items-center gap-2 pb-8 border-b border-[#173C32]/10 mb-10 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === "all"
                ? "bg-[#173C32] text-white shadow"
                : "bg-white/80 text-[#173C32] hover:bg-[#173C32]/10 border border-[#173C32]/15"
            }`}
          >
            Alle Ausgaben
          </button>
          <button
            onClick={() => setActiveFilter("festivals")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === "festivals"
                ? "bg-[#173C32] text-white shadow"
                : "bg-white/80 text-[#173C32] hover:bg-[#173C32]/10 border border-[#173C32]/15"
            }`}
          >
            Stadtfeste & Gourmet-Meilen
          </button>
          <button
            onClick={() => setActiveFilter("portraits")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === "portraits"
                ? "bg-[#173C32] text-white shadow"
                : "bg-white/80 text-[#173C32] hover:bg-[#173C32]/10 border border-[#173C32]/15"
            }`}
          >
            Partner-Stories
          </button>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Pilot Story Card: Schnitzel Schmiede */}
          <Link
            to="/magazin/schnitzel-schmiede"
            className="group surface-card flex flex-col md:flex-row overflow-hidden hover:ring-2 hover:ring-[#173C32] transition rounded-3xl shadow-xl border border-[#173C32]/10 bg-white md:col-span-2 lg:col-span-3"
          >
            {/* Authentic Food Photo */}
            <div className="relative md:w-5/12 lg:w-5/12 overflow-hidden bg-[#173C32] min-h-[260px] md:min-h-[340px]">
              <img
                src="https://images.unsplash.com/photo-1599921841143-819065a55cc6?auto=format&fit=crop&w=1200&q=85"
                alt="Schnitzel Schmiede beim EineStadt-Fest 2026"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#173C32]/95 backdrop-blur text-[#E6B84A] px-3.5 py-1 text-xs font-extrabold shadow-lg border border-white/10">
                  <Sparkles className="w-3 h-3" /> Story 01 · 2026
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur text-[#173C32] px-3 py-1 text-xs font-bold shadow-md">
                  <MapPin className="w-3 h-3 text-[#173C32]" /> Mönchengladbach
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-6 sm:p-10 justify-between md:w-7/12 lg:w-7/12">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#173C32]/60">
                  <Calendar className="w-3.5 h-3.5 text-[#E6B84A]" />
                  <span>14. – 16. August 2026 · EineStadt-Fest</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-4xl font-black text-[#173C32] group-hover:text-[#b8860b] transition-colors leading-tight">
                  Schnitzel Schmiede beim EineStadt-Fest 2026
                </h2>
                <p className="text-base text-[#173C32]/75 leading-relaxed">
                  Ein vertrauter Partner auf der kulinarischen Meile von Mönchengladbach: 13 Jahre
                  Fest-Tradition, handwerkliche Frische und Live-Gastronomie.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#173C32]/10 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-sm font-extrabold text-[#173C32] group-hover:text-[#b8860b]">
                  <span>Vollständige Story lesen</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
                <span className="text-xs text-[#173C32]/50 font-medium">5 Min. Lesezeit</span>
              </div>
            </div>
          </Link>
        </div>

        {/* GEO Location & Regional Index Box for SEO / AI Discovery */}
        <div className="mt-20 rounded-3xl bg-[#173C32] text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="text-xs font-bold text-[#E6B84A] uppercase tracking-widest">
              Regionale Partner entdecken
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
