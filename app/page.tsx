"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  BrainCircuit, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Search, 
  Star,
  Layers,
  Zap
} from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────────────────────────
type CatererCard = {
  id: string;
  name: string;
  city: string;
  cuisine: string;
  description: string;
  tags: string[];
  startingPrice: string;
  guestRange: string;
  verified?: boolean;
  rating: number;
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const sampleCaterers: CatererCard[] = [
  {
    id: "berlin-bbq-house",
    name: "Berlin BBQ House",
    city: "Berlin",
    cuisine: "BBQ & Grill",
    description: "Authentic live grill catering for premium outdoor events and private celebrations.",
    tags: ["BBQ", "Outdoor", "Private"],
    startingPrice: "€29 p.p.",
    guestRange: "40–180 guests",
    verified: true,
    rating: 4.9
  },
  {
    id: "royal-events-catering",
    name: "Royal Events Catering",
    city: "Hamburg",
    cuisine: "Wedding & Fine Dining",
    description: "Elegant full-service catering for weddings and refined private celebrations.",
    tags: ["Weddings", "Fine Dining", "Luxury"],
    startingPrice: "€49 p.p.",
    guestRange: "50–250 guests",
    verified: true,
    rating: 5.0
  },
  {
    id: "atelier-table-berlin",
    name: "Atelier Table Berlin",
    city: "Berlin",
    cuisine: "Modern European",
    description: "Curated premium menus for intimate, design-led event concepts.",
    tags: ["Private Dining", "Modern", "Minimalist"],
    startingPrice: "€58 p.p.",
    guestRange: "15–80 guests",
    featured: true,
    rating: 4.8
  }
];

const quickFilters = ["Berlin", "Wedding", "Corporate", "Vegan", "Fine Dining"];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function HomePage() {
  const [viewMode, setViewMode] = useState<"ai" | "browse">("ai");
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Traditional Filter State
  const [city, setCity] = useState("");
  const [eventType, setEventType] = useState("");
  const [cuisine, setCuisine] = useState("");

  // Simulate AI "Thinking"
  const handleAISearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setViewMode("browse"); // After "thinking", show the results
    }, 2000);
  };

  const filteredCaterers = useMemo(() => {
    return sampleCaterers.filter((caterer) => {
      const haystack = [caterer.name, caterer.city, caterer.cuisine, caterer.description, ...caterer.tags].join(" ").toLowerCase();
      const cityMatch = !city.trim() || caterer.city.toLowerCase().includes(city.trim().toLowerCase());
      const eventMatch = !eventType || haystack.includes(eventType.toLowerCase());
      const cuisineMatch = !cuisine || caterer.cuisine.toLowerCase().includes(cuisine.toLowerCase());
      return cityMatch && eventMatch && cuisineMatch;
    });
  }, [city, eventType, cuisine]);

  return (
    <main className="relative min-h-screen bg-[#0a1a0a] text-[#f4f1ea] overflow-x-hidden font-sans">
      
      {/* 1. THE ATMOSPHERE (Background) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1a3a1a_0%,transparent_50%)] opacity-60" />
        <div className="absolute inset-0 grain-overlay opacity-[0.04]" />
      </div>

      {/* 2. ELEGANT NAVIGATION */}
      <header className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-8 py-8">
        <div className="text-2xl font-serif tracking-[0.3em] uppercase text-[#c49840]">Speisely</div>
        <nav className="hidden items-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f4f1ea]/50 md:flex">
          <Link href="/caterers" className="hover:text-[#c49840] transition-colors">Marketplace</Link>
          <Link href="/how-it-works" className="hover:text-[#c49840] transition-colors">Technology</Link>
          <Link href="/philosophy" className="hover:text-[#c49840] transition-colors">Philosophy</Link>
        </nav>
        <Link href="/login" className="text-[10px] font-bold uppercase tracking-widest text-[#f4f1ea] border-b border-[#c49840] pb-1">Login</Link>
      </header>

      {/* 3. HERO SECTION (The AI Interface) */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pt-24 pb-32 text-center">
        {viewMode === "ai" ? (
          <>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/30 bg-[#c49840]/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#c49840] mb-10">
              <BrainCircuit className="h-3.5 w-3.5" /> Intelligent Concierge
            </div>
            
            <h1 className="text-5xl font-serif leading-[1.1] tracking-tight text-white sm:text-7xl md:text-8xl mb-8">
              Crafting <br />
              <span className="italic text-[#c49840]">Unforgettable</span> <br />
              Moments.
            </h1>
            
            <p className="max-w-xl mx-auto text-lg leading-relaxed text-[#7a9470] font-light mb-12">
              Don't search. Describe. Our AI interprets your vision to curate the perfect culinary experience.
            </p>

            <form onSubmit={handleAISearch} className="relative max-w-2xl mx-auto">
              <div className="relative flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1.5 shadow-[0_0_60px_rgba(196,152,64,0.1)] backdrop-blur-xl transition-all focus-within:border-[#c49840]/50">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. A minimalist sushi experience for 30 guests in Berlin..."
                  className="w-full bg-transparent px-8 py-5 text-xl text-white placeholder:text-white/20 focus:outline-none font-light italic"
                />
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c49840] text-black transition hover:scale-110 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <ArrowRight className="h-6 w-6" />
                  )}
                </button>
              </div>
              <div className="mt-6 flex justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[#7a9470]">
                <span>Try:</span>
                <button type="button" onClick={() => setSearchQuery("A luxury wedding in Hamburg")} className="hover:text-white">Luxury Wedding</button>
                <span>•</span>
                <button type="button" onClick={() => setSearchQuery("Modern corporate lunch in Berlin")} className="hover:text-white">Corporate Lunch</button>
              </div>
            </form>
          </>
        ) : (
          /* MODE SWITCHER REVEAL (If they switch to Browse) */
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
             <h2 className="text-4xl font-serif text-white mb-4">Explore the Collection</h2>
             <p className="text-[#7a9470]">Manually browse our curated network of culinary masters.</p>
             <button 
              onClick={() => setViewMode("ai")}
              className="mt-6 text-[10px] font-bold uppercase tracking-widest text-[#c49840] border-b border-[#c49840] pb-1"
             >
               Return to AI Concierge
             </button>
          </div>
        )}
      </section>

      {/* 4. THE TECHNOLOGY (The "Grant-Winning" Section) */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 border-t border-white/5">
        <div className="grid gap-16 md:grid-cols-3">
          <div className="text-center group">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#c49840]/20 bg-[#c49840]/5 text-[#c49840] group-hover:scale-110 transition-transform">
              <BrainCircuit className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-serif text-white mb-3">Semantic Intent</h3>
            <p className="text-sm leading-relaxed text-[#7a9470]">
              Our engine transcends keywords. We analyze the emotion and context of your request to match culinary styles to your vision.
            </p>
          </div>
          <div className="text-center group">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#c49840]/20 bg-[#c49840]/5 text-[#c49840] group-hover:scale-110 transition-transform">
              <Layers className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-serif text-white mb-3">Logistical Precision</h3>
            <p className="text-sm leading-relaxed text-[#7a9470]">
              Real-time synchronization with caterer availability, dietary capabilities, and service logistics.
            </p>
          </div>
          <div className="text-center group">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#c49840]/20 bg-[#c49840]/5 text-[#c49840] group-hover:scale-110 transition-transform">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-serif text-white mb-3">Instant Curation</h3>
            <p className="text-sm leading-relaxed text-[#7a9470]">
              From complex vision to a curated shortlist in seconds. The intelligence of a planner, the speed of an algorithm.
            </p>
          </div>
        </div>
      </section>

      {/* 5. THE MARKETPLACE (Visible when in Browse mode or after AI search) */}
      {viewMode === "browse" && (
        <section className="relative z-10 mx-auto max-w-7xl px-6 pb-32 animate-in fade-in slide-in-from-bottom-12 duration-700">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="text-left">
              <h2 className="text-3xl font-serif text-white">Curated Selection</h2>
              <div className="h-px w-12 bg-[#c49840] mt-4" />
            </div>

            <div className="flex flex-wrap gap-2">
              {quickFilters.map(f => (
                <button 
                  key={f} 
                  onClick={() => {setCity(f); setEventType(""); setCuisine("");}}
                  className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white hover:bg-[#c49840] hover:text-black transition"
                >
                  {f}
                </button>
              ))}
              <button onClick={() => {setCity(""); setEventType(""); setCuisine("");}} className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 text-[#7a9470] hover:text-white">
                Reset
              </button>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredCaterers.map((caterer) => (
              <div key={caterer.id} className="group relative bg-white/[0.02] border border-white/5 p-8 transition-all hover:bg-white/[0.05] hover:border-[#c49840]/30">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-serif text-white group-hover:text-[#c49840] transition-colors">{caterer.name}</h3>
                    <p className="text-xs uppercase tracking-widest text-[#7a9470] mt-1">{caterer.city} • {caterer.cuisine}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[#c49840] text-sm">
                    <Star className="h-3 w-3 fill-current" />
                    <span>{caterer.rating}</span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-[#7a9470] mb-8 min-h-[3rem]">
                  {caterer.description}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-[#7a9470]">From</span>
                    <span className="text-lg font-medium text-white">{caterer.startingPrice}</span>
                  </div>
                  <Link href={`/caterers/${caterer.id}`} className="text-xs font-bold uppercase tracking-[0.2em] text-[#c49840] hover:text-white transition-colors">
                    Explore $\rightarrow$
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. FOOTER */}
      <footer className="relative z-10 border-t border-white/5 bg-[#081208] py-16 text-center">
        <div className="text-sm font-serif tracking-widest uppercase text-[#c49840] mb-4">Speisely</div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#7a9470]">The Art of Culinary Intelligence</p>
      </footer>
    </main>
  );
}
