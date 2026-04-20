"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { 
  Sparkles, ArrowRight, Star, BrainCircuit, 
  CheckCircle2, Search, ChevronRight
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
    id: "1",
    name: "Berlin BBQ House",
    city: "Berlin",
    cuisine: "BBQ & Grill",
    description: "Authentic live grill catering for premium outdoor events and private celebrations.",
    tags: ["BBQ", "Outdoor Events"],
    startingPrice: "€29 p.p.",
    guestRange: "40–180 guests",
    verified: true,
    rating: 4.9
  },
  {
    id: "2",
    name: "Royal Events Catering",
    city: "Hamburg",
    cuisine: "Wedding & Fine Dining",
    description: "Elegant full-service catering for weddings, formal receptions, and refined private celebrations.",
    tags: ["Weddings", "Fine Dining"],
    startingPrice: "€49 p.p.",
    guestRange: "50–250 guests",
    verified: true,
    featured: true,
    rating: 5.0
  },
  {
    id: "3",
    name: "Atelier Table Berlin",
    city: "Berlin",
    cuisine: "Modern European",
    description: "Curated premium menus for intimate dinners, private celebrations, and design-led event concepts.",
    tags: ["Private Dining", "Modern"],
    startingPrice: "€58 p.p.",
    guestRange: "15–80 guests",
    featured: true,
    rating: 4.8
  }
];

const quickFilters = ["Berlin", "Corporate", "Wedding", "Vegetarian", "Fine Dining"];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function HomePage() {
  const [viewMode, setViewMode] = useState<"ai" | "browse">("ai");
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [city, setCity] = useState("");
  const [eventType, setEventType] = useState("");
  const [cuisine, setCuisine] = useState("");

  const handleAISearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setViewMode("browse");
    }, 2500);
  };

  const filteredCaterers = useMemo(() => {
    return sampleCaterers.filter((caterer) => {
      const haystack = [caterer.name, caterer.city, caterer.cuisine, caterer.description, ...caterer.tags].join(" ").toLowerCase();
      return (!city || caterer.city.toLowerCase().includes(city.toLowerCase())) &&
             (!eventType || haystack.includes(eventType.toLowerCase())) &&
             (!cuisine || caterer.cuisine.toLowerCase().includes(cuisine.toLowerCase()));
    });
  }, [city, eventType, cuisine]);

  return (
    <main className="relative min-h-screen bg-[#0a120a] text-[#f4f1ea] overflow-x-hidden font-sans">
      
      {/* 1. THE HERO (The "Dream" Atmosphere) */}
      <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
        {/* The Image Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop"
            className="h-full w-full object-cover"
            alt="Luxury Catering"
          />
          {/* THE SCRIM: This is the most important part. It creates the contrast. */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a120a]/80 via-[#0a120a]/60 to-[#0a120a] z-10" />
        </div>

        {/* The Content Layer */}
        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/30 bg-[#c49840]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#c49840] mb-8">
            <Sparkles className="h-3.5 w-3.5" /> Intelligent Concierge
          </div>
          
          <h1 className="text-5xl font-serif leading-[1.1] tracking-tight text-white sm:text-7xl md:text-8xl mb-8">
            Exceptional <br />
            <span className="italic text-[#c49840]">Catering.</span>
          </h1>
          
          <p className="max-w-xl mx-auto text-lg leading-relaxed text-[#7a9470] font-light mb-12">
            Describe your vision. Our AI finds the perfect caterers for your most important moments.
          </p>

          {/* The AI Search Box */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleAISearch} className="relative group">
              <div className="relative flex items-center rounded-full border border-white/10 bg-white/[0.05] p-2 shadow-2xl backdrop-blur-md transition-all focus-within:border-[#c49840]/50">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. 'An elegant wedding for 80 guests in Berlin'..."
                  className="w-full bg-transparent px-8 py-4 text-xl text-white placeholder:text-white/30 focus:outline-none font-light italic"
                />
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c49840] text-black transition hover:scale-105 disabled:opacity-50"
                >
                  {isProcessing ? <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <ArrowRight className="h-6 w-6" />}
                </button>
              </div>
              {isProcessing && <p className="mt-4 text-xs font-medium uppercase tracking-widest text-[#c49840] animate-pulse">Synthesizing your vision...</p>}
            </form>
            
            <button 
              onClick={() => setViewMode("browse")}
              className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a9470] hover:text-[#c49840] transition-colors"
            >
              Or browse our marketplace manually $\rightarrow$
            </button>
          </div>
        </div>
      </section>

      {/* 2. THE MARKETPLACE (The "Reality" Atmosphere - Solid Background) */}
      <section className="relative z-20 bg-[#0a120a] py-32">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header & Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10">
            <div className="text-left">
              <h2 className="text-4xl font-serif text-white">Curated Selection</h2>
              <div className="h-px w-16 bg-[#c49840] mt-4" />
            </div>

            <div className="flex flex-wrap gap-3">
              {quickFilters.map(f => (
                <button 
                  key={f} 
                  onClick={() => setCity(f)}
                  className={`text-[10px] font-bold uppercase tracking-widest px-5 py-2 rounded-full border transition-all ${
                    city === f ? 'bg-[#c49840] text-black border-[#c49840]' : 'border-white/10 text-white hover:border-[#c49840]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* The Grid */}
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {filteredCaterers.map((caterer) => (
              <div key={caterer.id} className="group relative bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] transition-all hover:bg-white/[0.05] hover:border-[#c49840]/30">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-serif text-white group-hover:text-[#c49840] transition-colors">{caterer.name}</h3>
                    <p className="text-xs uppercase tracking-widest text-[#7a9470] mt-1">{caterer.city} • {caterer.cuisine}</p>
                  </div>
                  {caterer.verified && <span className="text-[10px] font-bold bg-[#c49840]/20 text-[#c49840] px-2 py-1 rounded">VERIFIED</span>}
                </div>
                <p className="text-sm leading-relaxed text-[#7a9470] mb-8 line-clamp-2">{caterer.description}</p>
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-[#7a9470]">Starting at</span>
                    <span className="text-lg font-medium text-white">{caterer.startingPrice}</span>
                  </div>
                  <Link href={`/caterers/${caterer.id}`} className="text-[10px] font-bold uppercase tracking-widest text-[#c49840] hover:text-white transition-colors">
                    Explore $\rightarrow$
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredCaterers.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[#7a9470]">No matches found. Try resetting your filters.</p>
              <button onClick={() => {setCity(""); setEventType(""); setCuisine("");}} className="mt-4 text-[#c49840] underline text-sm">Reset Filters</button>
            </div>
          )}
        </div>
      </section>

      {/* 3. FOOTER */}
      <footer className="relative z-20 border-t border-white/5 bg-[#081008] py-20 text-center">
        <div className="text-xl font-serif tracking-[0.4em] uppercase text-[#c49840] mb-4">Speisely</div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#7a9470]">The Art of Culinary Intelligence</p>
      </footer>
    </main>
  );
}
