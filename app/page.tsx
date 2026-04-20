"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Sparkles, ArrowRight, Search, Star, BrainCircuit, MapPin, Calendar, CheckCircle2 } from "lucide-react";

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
    description: "Authentic live grill catering for premium outdoor events.",
    tags: ["BBQ", "Outdoor"],
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
    description: "Elegant full-service catering for refined celebrations.",
    tags: ["Weddings", "Fine Dining"],
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
    description: "Curated premium menus for intimate, design-led dinners.",
    tags: ["Private Dining", "Modern"],
    startingPrice: "€58 p.p.",
    guestRange: "15–80 guests",
    featured: true,
    rating: 4.8
  }
];

const quickFilters = ["Berlin", "Wedding", "Corporate", "Vegan", "Fine Dining"];

// ─── MAIN PAGE COMPONENT ─────────────────────────────────────────────────────
export default function HomePage() {
  const [viewMode, setViewMode] = useState<"ai" | "browse">("ai");
  const [searchQuery, setSearchQuery] = useState("");
  const [city, setCity] = useState("");
  const [eventType, setEventType] = useState("");
  const [cuisine, setCuisine] = useState("");

  // Filtering Logic for Browse Mode
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
    <main className="relative min-h-screen bg-[#0a1a0a] text-[#f4f1ea] overflow-x-hidden">
      {/* 1. ATMOSPHERIC BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#2a4a2c_0%,transparent_50%)] opacity-40" />
        <div className="absolute inset-0 grain-overlay opacity-[0.04]" />
      </div>

      {/* 2. ELEGANT HEADER */}
      <header className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-8 py-8">
        <div className="text-2xl font-serif tracking-[0.3em] uppercase text-[#c49840]">Speisely</div>
        <nav className="hidden items-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f4f1ea]/60 md:flex">
          <Link href="/caterers" className="hover:text-[#c49840] transition-colors">The Marketplace</Link>
          <Link href="/how-it-works" className="hover:text-[#c49840] transition-colors">Our Intelligence</Link>
        </nav>
        <Link href="/login" className="text-[10px] font-bold uppercase tracking-widest text-[#f4f1ea] border-b border-[#c49840] pb-1">Login</Link>
      </header>

      {/* 3. THE HERO (The "Cash the AI" Section) */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/30 bg-[#c49840]/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#c49840] mb-10">
          <BrainCircuit className="h-3.5 w-3.5" /> Powered by Culinary Intelligence
        </div>
        
        <h1 className="text-5xl font-serif leading-[1.1] tracking-tight text-white sm:text-7xl md:text-8xl">
          Crafting <br />
          <span className="italic text-[#c49840]">Unforgettable</span> <br />
          Moments.
        </h1>
        
        <p className="mt-8 max-w-2xl mx-auto text-lg leading-relaxed text-[#7a9470] font-light">
          Beyond simple search. Our AI Concierge understands your vision, 
          matching you with elite culinary masters tailored to your exact needs.
        </p>

        {/* THE MODE SWITCHER (AI vs Browse) */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <button 
              onClick={() => setViewMode("ai")}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${viewMode === "ai" ? "bg-[#c49840] text-black shadow-lg" : "text-white/50 hover:text-white"}`}
            >
              AI Concierge
            </button>
            <button 
              onClick={() => setViewMode("browse")}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${viewMode === "browse" ? "bg-[#c49840] text-black shadow-lg" : "text-white/50 hover:text-white"}`}
            >
              Browse Marketplace
            </button>
          </div>
        </div>

        {/* DYNAMIC SEARCH INTERFACE */}
        <div className="mt-12 max-w-2xl mx-auto transition-all duration-500">
          {viewMode === "ai" ? (
            /* AI CONCIERGE MODE */
            <div className="relative">
              <div className="absolute -top-4 left-6 bg-[#0a1a0a] px-2 text-[10px] uppercase tracking-widest text-[#c49840] font-bold border-x border-t border-[#c49840]/30 py-1">
                AI Input
              </div>
              <div className="relative flex items-center rounded-[2.5rem] border border-[#c49840]/40 bg-white/[0.03] p-2 shadow-[0_0_50px_rgba(196,152,64,0.1)] backdrop-blur-xl">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. An elegant garden wedding for 50 guests in Berlin..."
                  className="w-full bg-transparent px-8 py-5 text-xl text-white placeholder:text-white/20 focus:outline-none font-light italic"
                />
                <button className="flex h-16 w-16 items-center justify-center rounded-full bg-[#c49840] text-black transition hover:scale-110 shadow-xl">
                  <ArrowRight className="h-6 w-6" />
                </button>
              </div>
              <p className="mt-4 text-xs text-[#7a9470] italic">Try: "A minimalist sushi experience for a corporate launch in Munich"</p>
            </div>
          ) : (
            /* TRADITIONAL BROWSE MODE */
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="City..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-white outline-none border border-white/10"
                />
                <select 
                  value={eventType} 
                  onChange={(e) => setEventType(e.target.value)}
                  className="bg-white/5 rounded-xl px-4 py-3 text-white outline-none border border-white/10"
                >
                  <option value="" className="bg-[#0a1a0a]">All Events</option>
                  <option value="Wedding" className="bg-[#0a1a0a]">Wedding</option>
                  <option value="Corporate" className="bg-[#0a1a0a]">Corporate</option>
                </select>
                <button className="bg-[#c49840] text-black px-8 py-3 rounded-xl font-bold text-sm">Search</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. HOW IT WORKS (The "Grants & Trust" Section) */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 border-t border-white/5">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-serif text-white">The Speisely Intelligence</h2>
          <p className="text-[#7a9470] mt-4">How we bridge the gap between vision and reality.</p>
        </div>

        <div className="grid gap-16 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#c49840]/30 bg-[#c49840]/10 text-[#c49840]">
              <BrainCircuit className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-serif text-white mb-4">1. Natural Intent</h3>
            <p className="text-sm leading-relaxed text-[#7a9470]">
              Our AI doesn't just look for keywords. It understands the mood, the scale, and the culinary nuances of your request.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#c49840]/30 bg-[#c49840]/10 text-[#c49840]">
              <MapPin className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-serif text-white mb-4">2. Precision Match</h3>
            <p className="text-sm leading-relaxed text-[#7a9470]">
              We scan our vetted network of elite caterers to find the exact match for your specific logistics and taste.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#c49840]/30 bg-[#c49840]/10 text-[#c49840]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-serif text-white mb-4">3. Seamless Execution</h3>
            <p className="text-sm leading-relaxed text-[#7a9470]">
              From inquiry to plate, the entire booking process is managed through our intelligent concierge platform.
            </p>
          </div>
        </div>
      </section>

      {/* 6. MARKETPLACE (The "Curated" Grid) */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-32">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
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

      <footer className="relative z-10 border-t border-white/5 bg-[#081208] py-16 text-center">
        <div className="text-sm font-serif tracking-widest uppercase text-[#c49840] mb-4">Speisely</div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#7a9470]">The Art of Culinary Intelligence</p>
      </footer>
    </main>
  );
}
