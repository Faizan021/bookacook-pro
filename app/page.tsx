"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { 
  Sparkles, ArrowRight, Star, BrainCircuit, Compass, 
  CheckCircle2, Zap, Search
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
  { id: "1", name: "Berlin BBQ House", city: "Berlin", cuisine: "BBQ & Grill", description: "Authentic live grill catering for premium events.", tags: ["BBQ"], startingPrice: "€29 p.p.", guestRange: "40-180", verified: true, rating: 4.9 },
  { id: "2", name: "Royal Events", city: "Hamburg", cuisine: "Fine Dining", description: "Elegant wedding and reception services.", tags: ["Luxury"], startingPrice: "€49 p.p.", guestRange: "50-250", verified: true, rating: 5.0 },
  { id: "3", name: "Atelier Table", city: "Berlin", cuisine: "Modern", description: "Curated design-led menus.", tags: ["Minimalist"], startingPrice: "€58 p.p.", guestRange: "15-80", featured: true, rating: 4.8 },
];

const quickFilters = ["Berlin", "Wedding", "Corporate", "Vegan", "Fine Dining"];

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
    return sampleCaterers.filter((c) => {
      const haystack = [c.name, c.city, c.cuisine, c.description, ...c.tags].join(" ").toLowerCase();
      return (!city || c.city.toLowerCase().includes(city.toLowerCase())) &&
             (!eventType || haystack.includes(eventType.toLowerCase())) &&
             (!cuisine || c.cuisine.toLowerCase().includes(cuisine.toLowerCase()));
    });
  }, [city, eventType, cuisine]);

  return (
    <main className="relative min-h-screen bg-[#0a120a] text-[#f4f1ea] overflow-x-hidden font-sans">
      {/* BACKGROUND LAYER */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#c49840]/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#4a5d4e]/10 blur-[140px]" />
        <div className="absolute inset-0 grain-overlay opacity-[0.03]" />
      </div>

      {/* 1. HEADER (Contained) */}
      <header className="relative z-50 mx-auto max-w-7xl px-8 py-10 flex items-center justify-between">
        <div className="text-2xl font-serif tracking-[0.3em] uppercase text-[#c49840]">Speisely</div>
        <nav className="hidden md:flex gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f4f1ea]/40">
          <Link href="/caterers">Marketplace</Link>
          <Link href="/how-it-works">Intelligence</Link>
        </nav>
        <Link href="/login" className="text-[10px] font-bold uppercase tracking-widest text-[#f4f1ea] border-b border-[#c49840] pb-1">Login</Link>
      </header>

      {/* 2. HERO SECTION (Contained + Vertical Padding) */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/30 bg-[#c49840]/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#c49840] mb-12">
          <BrainCircuit className="h-3.5 w-3.5" /> Intelligent Concierge
        </div>
        
        <h1 className="text-5xl font-serif leading-[1.1] tracking-tight text-white sm:text-7xl md:text-8xl mb-8">
          Exceptional <br />
          <span className="italic text-[#c49840]">Catering.</span>
        </h1>
        
        <p className="max-w-xl mx-auto text-lg leading-relaxed text-[#7a9470] font-light mb-16">
          Don't just search. Describe your vision, and let our AI curate a bespoke culinary experience.
        </p>

        <div className="max-w-2xl mx-auto">
          {viewMode === "ai" ? (
            <form onSubmit={handleAISearch} className="relative">
              <div className="relative flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1.5 shadow-2xl backdrop-blur-xl transition-all focus-within:border-[#c49840]/50">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. 'An intimate sunset dinner for 20 in Berlin'..."
                  className="w-full bg-transparent px-8 py-5 text-xl text-white placeholder:text-white/20 focus:outline-none font-light italic"
                />
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c49840] text-black transition hover:scale-110 disabled:opacity-50"
                >
                  {isProcessing ? <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <ArrowRight className="h-6 w-6" />}
                </button>
              </div>
              {isProcessing && <p className="mt-6 text-xs font-medium uppercase tracking-widest text-[#c49840] animate-pulse">Analyzing your vision...</p>}
            </form>
          ) : (
            <button onClick={() => setViewMode("ai")} className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#7a9470] hover:text-[#c49840]">
              $\leftarrow$ Return to AI Concierge
            </button>
          )}
        </div>
      </section>

      {/* 3. FEATURES SECTION (Contained + Massive Vertical Padding) */}
      <section className="relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-32">
          <div className="grid gap-16 md:grid-cols-3">
            {[
              { icon: <BrainCircuit />, title: "Semantic Intent", desc: "Our engine understands the nuance of your request, matching mood to culinary style." },
              { icon: <Layers />, title: "Precision Logistics", desc: "Real-time synchronization with caterer availability and dietary capabilities." },
              { icon: <Zap />, title: "Instant Curation", desc: "From complex vision to a curated shortlist in seconds." }
            ].map((feat, idx) => (
              <div key={idx} className="text-center group">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#c49840]/10 text-[#c49840] group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-serif text-white mb-3">{feat.title}</h3>
                <p className="text-sm leading-relaxed text-[#7a9470]">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MARKETPLACE (Only visible in Browse Mode) */}
      {viewMode === "browse" && (
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
           <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <h2 className="text-4xl font-serif text-white">Curated Marketplace</h2>
              <div className="flex flex-wrap gap-2">
                {quickFilters.map(f => (
                  <button key={f} onClick={() => setCity(f)} className="text-[10px] font-bold uppercase tracking-widest px-5 py-2 rounded-full border border-white/10 bg-white/5 text-white hover:bg-[#c49840] hover:text-black transition">
                    {f}
                  </button>
                ))}
              </div>
           </div>

           <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
             {filteredCaterers.map((c) => (
               <div key={c.id} className="group bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] transition-all hover:bg-white/[0.05] hover:border-[#c49840]/30">
                 <div className="flex justify-between items-start mb-6">
                   <h3 className="text-2xl font-serif text-white group-hover:text-[#c49840] transition-colors">{c.name}</h3>
                   <div className="flex items-center gap-1 text-[#c49840] text-sm"><Star className="h-3 w-3 fill-current" /><span>{c.rating}</span></div>
                 </div>
                 <p className="text-sm text-[#7a9470] mb-8">{c.description}</p>
                 <div className="flex items-center justify-between pt-6 border-t border-white/5">
                   <span className="text-lg font-medium text-white">{c.startingPrice}</span>
                   <Link href={`/caterers/${c.id}`} className="text-[10px] font-bold uppercase tracking-widest text-[#c49840]">Explore $\rightarrow$</Link>
                 </div>
               </div>
             ))}
           </div>
        </section>
      )}

      {/* 5. FOOTER (Contained) */}
      <footer className="relative z-10 border-t border-white/5 bg-[#081008] py-20 text-center">
        <div className="text-xl font-serif tracking-[0.4em] uppercase text-[#c49840] mb-4">Speisely</div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#7a9470]">The Art of Culinary Intelligence</p>
      </footer>
    </main>
  );
}
