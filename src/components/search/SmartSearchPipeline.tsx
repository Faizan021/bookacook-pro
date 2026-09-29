import { useState, useEffect, useTransition } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Search,
  Users,
  Sparkles,
  MapPin,
  UtensilsCrossed,
  BookOpen,
  ArrowRight,
  Calculator,
  Loader2,
  Check,
  ChevronRight,
  ShieldCheck,
  Star,
} from "lucide-react";
import { searchUnifiedPipeline, type UnifiedSearchResult } from "@/lib/search/unified.functions";
import { motion, AnimatePresence } from "framer-motion";

const DIETARY_TAGS = [
  { id: "all", label: "Alle Spezialitäten", icon: "✨" },
  { id: "fingerfood", label: "Fingerfood & Buffet", icon: "🍢" },
  { id: "vegan", label: "🌱 100% Vegan / Veggie", icon: "🌱" },
  { id: "halal", label: "🥩 Halal Catering", icon: "🥩" },
  { id: "wedding", label: "💍 Hochzeit", icon: "💍" },
  { id: "business", label: "🏢 Business & Office", icon: "🏢" },
  { id: "dessert", label: "🍰 Desserts & Kuchen", icon: "🍰" },
];

export function SmartSearchPipeline() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("Berlin");
  const [guests, setGuests] = useState(35);
  const [activeDietary, setActiveDietary] = useState("all");
  const [activeTab, setActiveTab] = useState<"all" | "catering" | "restaurants" | "magazine">(
    "all",
  );

  const [results, setResults] = useState<UnifiedSearchResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchResults = (q: string, c: string, g: number, d: string) => {
    startTransition(async () => {
      try {
        const res = await searchUnifiedPipeline({
          data: {
            query: q === "all" ? "" : q,
            city: c,
            guests: g,
            dietary: d === "all" ? "" : d,
            occasion: d === "wedding" || d === "business" ? d : "",
          },
        });
        setResults(res);
      } catch (e) {
        console.error("Search pipeline error:", e);
      }
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResults(query, city, guests, activeDietary);
    }, 180);
    return () => clearTimeout(timer);
  }, [query, city, guests, activeDietary]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Search Console Container */}
      <div className="relative rounded-3xl bg-white/95 backdrop-blur-xl border-2 border-forest/15 shadow-2xl p-6 sm:p-8">
        {/* Top Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#173C32]/10 px-4 py-1.5 text-xs font-black text-forest uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-[#E6B84A]" />
            <span>Next-Gen Event &amp; Food Search Pipeline</span>
          </div>

          <div className="text-xs font-bold text-forest/70 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Multi-Stage Matching (Catering · Food · Stories)</span>
          </div>
        </div>

        {/* Input Controls Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6">
          {/* Query Input */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-forest/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Was suchst du? (z. B. Fingerfood, Cheesecake, BBQ, Buffet...)"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#FAF7F0] border border-forest/15 text-forest text-sm font-semibold placeholder:text-forest/40 focus:outline-none focus:border-[#E6B84A] focus:ring-2 focus:ring-[#E6B84A]/30 transition"
            />
          </div>

          {/* City Selector */}
          <div className="md:col-span-3 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-forest/40" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-12 pr-8 py-3.5 rounded-2xl bg-[#FAF7F0] border border-forest/15 text-forest text-sm font-bold focus:outline-none focus:border-[#E6B84A] transition appearance-none cursor-pointer"
            >
              <option value="Berlin">📍 Berlin</option>
              <option value="München">📍 München</option>
              <option value="Hamburg">📍 Hamburg</option>
              <option value="Frankfurt">📍 Frankfurt</option>
              <option value="Köln">📍 Köln</option>
              <option value="Stuttgart">📍 Stuttgart</option>
              <option value="Düsseldorf">📍 Düsseldorf</option>
              <option value="Leipzig">📍 Leipzig</option>
            </select>
          </div>

          {/* Quick Submit CTA */}
          <div className="md:col-span-3">
            <button
              onClick={() => {
                navigate({
                  to: "/catering",
                  search: { q: query || undefined },
                });
              }}
              className="w-full h-full min-h-[50px] inline-flex items-center justify-center gap-2 rounded-2xl bg-forest text-[#FAF7F0] text-sm font-black hover:bg-[#0f2720] transition shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>Suchen</span>
              <ArrowRight className="h-4 w-4 text-[#E6B84A]" />
            </button>
          </div>
        </div>

        {/* Dietary & Occasion Quick Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {DIETARY_TAGS.map((tag) => {
            const isActive = activeDietary === tag.id;
            return (
              <button
                key={tag.id}
                onClick={() => setActiveDietary(tag.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? "bg-[#E6B84A] text-forest shadow-sm"
                    : "bg-[#FAF7F0] text-forest/75 hover:bg-forest/10"
                }`}
              >
                <span>{tag.label}</span>
              </button>
            );
          })}
        </div>

        {/* Real-Time Event Budget & Portion Engine */}
        <div className="rounded-2xl bg-[#FAF7F0] border border-forest/10 p-4 sm:p-5 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-[#A85C36]" />
              <span className="text-xs font-black text-forest uppercase tracking-wider">
                Live Event-Kalkulator: {guests} Gäste
              </span>
            </div>
            {results?.estimatedBudget && (
              <div className="text-xs font-bold text-forest/80">
                Geschätztes Budget:{" "}
                <span className="text-emerald-700 font-black">
                  ca. {results.estimatedBudget.totalMin.toLocaleString("de-DE")} € –{" "}
                  {results.estimatedBudget.totalMax.toLocaleString("de-DE")} €
                </span>{" "}
                ({results.estimatedBudget.costPerPersonMin}–
                {results.estimatedBudget.costPerPersonMax} € / Person)
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-forest/60">10 Gäste</span>
            <input
              type="range"
              min="10"
              max="250"
              step="5"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="flex-1 accent-[#E6B84A] cursor-pointer"
            />
            <span className="text-xs font-bold text-forest/60">250+ Gäste</span>
          </div>
        </div>

        {/* 3-in-1 View Tabs */}
        <div className="flex items-center justify-between border-b border-forest/10 pb-3 mb-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setActiveTab("all")}
              className={`text-xs sm:text-sm font-bold pb-1 border-b-2 transition cursor-pointer ${
                activeTab === "all"
                  ? "border-[#E6B84A] text-forest"
                  : "border-transparent text-forest/60"
              }`}
            >
              Alle Treffer
            </button>
            <button
              onClick={() => setActiveTab("catering")}
              className={`text-xs sm:text-sm font-bold pb-1 border-b-2 transition cursor-pointer ${
                activeTab === "catering"
                  ? "border-[#E6B84A] text-forest"
                  : "border-transparent text-forest/60"
              }`}
            >
              🚚 Event Catering ({results?.caterers.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("restaurants")}
              className={`text-xs sm:text-sm font-bold pb-1 border-b-2 transition cursor-pointer ${
                activeTab === "restaurants"
                  ? "border-[#E6B84A] text-forest"
                  : "border-transparent text-forest/60"
              }`}
            >
              🍽️ Restaurants ({results?.restaurants.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("magazine")}
              className={`text-xs sm:text-sm font-bold pb-1 border-b-2 transition cursor-pointer ${
                activeTab === "magazine"
                  ? "border-[#E6B84A] text-forest"
                  : "border-transparent text-forest/60"
              }`}
            >
              📖 Magazin &amp; Stories ({results?.magazineStories.length || 0})
            </button>
          </div>

          {isPending && <Loader2 className="h-4 w-4 animate-spin text-[#E6B84A]" />}
        </div>

        {/* Dynamic Result Cards */}
        <div className="space-y-6">
          {/* Magazine Stories Match */}
          {(activeTab === "all" || activeTab === "magazine") &&
            results?.magazineStories &&
            results.magazineStories.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="h-4 w-4 text-[#A85C36]" />
                  <span className="text-xs font-black uppercase text-forest/70 tracking-wider">
                    Redaktionelle Food-Stories &amp; Entdeckungen
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.magazineStories.map((story, i) => (
                    <Link
                      key={i}
                      to={story.slug}
                      className="group rounded-2xl bg-[#FAF7F0] border border-forest/10 p-3.5 flex gap-4 items-center hover:border-[#E6B84A] hover:bg-white hover:shadow-md transition"
                    >
                      <img
                        src={story.image_url}
                        alt={story.title}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-black uppercase text-[#A85C36] tracking-wider mb-1">
                          {story.category} · {story.city}
                        </div>
                        <h4 className="font-bold text-forest text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-[#b28a3c] transition">
                          {story.title}
                        </h4>
                        <p className="text-[11px] text-forest/60 line-clamp-1 mt-1">
                          {story.excerpt}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-forest/30 group-hover:text-[#E6B84A] shrink-0 transition" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

          {/* Catering Partners Match */}
          {(activeTab === "all" || activeTab === "catering") &&
            results?.caterers &&
            results.caterers.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="h-4 w-4 text-emerald-700" />
                    <span className="text-xs font-black uppercase text-forest/70 tracking-wider">
                      Verifizierte Caterer &amp; Event-Menüs in {city}
                    </span>
                  </div>
                  <Link
                    to="/catering"
                    className="text-xs font-bold text-forest hover:text-[#b28a3c] inline-flex items-center gap-1"
                  >
                    <span>Alle anzeigen</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.caterers.slice(0, 4).map((caterer) => (
                    <Link
                      key={caterer.id}
                      to="/catering/$slug"
                      params={{ slug: caterer.slug }}
                      className="group rounded-2xl bg-[#FAF7F0] border border-forest/10 p-4 hover:border-[#E6B84A] hover:bg-white hover:shadow-md transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-bold text-forest text-sm sm:text-base group-hover:text-[#b28a3c] transition">
                            {caterer.name}
                          </h4>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Geprüft
                          </span>
                        </div>
                        <p className="text-xs text-forest/70 line-clamp-2 mb-3">
                          {caterer.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-forest/10 text-xs font-bold text-forest/80">
                        <span>📍 {caterer.city}</span>
                        <span className="text-[#A85C36]">
                          ab ca.{" "}
                          {caterer.price_per_person_cents
                            ? (caterer.price_per_person_cents / 100).toFixed(2)
                            : "19,50"}{" "}
                          € / Pers.
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
