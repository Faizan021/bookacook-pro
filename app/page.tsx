"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { 
  Sparkles, ArrowRight, Star, BrainCircuit, Compass, 
  CheckCircle2, Zap, Search, ChevronRight, Layers
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
  featured?: boolean;
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

const quickFilters = ["Berlin", "Wedding", "Corporate", "Vegan", "Fine Dining"];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function HomePage() {
  const [viewMode, setViewMode] = useState<"ai" | "browse">("ai");
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [thinkingText, setThinkingText] = useState("");
  
  // Browse State
  const [city, setCity] = useState("");
  const [eventType, setEventType] = useState("");
  const [cuisine, setCuisine] = useState("");

  const handleAISearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsProcessing(true);
    
    const phrases = ["Analyzing event atmosphere...", "Cross-referencing availability...", "Matching culinary aesthetics..."];
    let i = 0;
    const interval = setInterval(() => {
      setThinkingText(phrases[i % phrases.length]);
      i++;
    }, 1200);

    setTimeout(() => {
      clearInterval(interval);
      setIsProcessing(false);
      setViewMode("browse");
    }, 3000);
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
      
      {/* 1. LUXURY DEPTH LAYER (Gradients & Grain) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#c49840]/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#4a5d4e]/10 blur-[140px]" />
        <div className="absolute inset-0 grain-overlay opacity-[0.03]" />
      </div>

      {/* 2. NAVIGATION */}
      <header className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-8 py-10">
        <div className="text-2xl font-serif tracking-[0.4em] uppercase text-[#c49840]">Speisely</div>
        <nav className="hidden md:flex gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-[#f4f1ea]/40">
          <Link href="/caterers" className="hover:text-[#c49840] transition-colors">Marketplace</Link>
          <Link href="/how-it-works" className="hover:text-[#c49840] transition-colors">Intelligence</Link>
          <Link href="/philosophy" className="hover:text-[#c49840] transition-colors">Philosophy</Link>
        </nav>
        <Link href="/login" className="text-[10px] font-bold uppercase tracking-widest text-[#f4f1ea] border-b border-[#c49840] pb-1">Login</Link>
      </header>

      {/* 3. HERO SECTION: THE AI CONCIERGE */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pt-12 pb-32 text-center">
        {viewMode === "ai" ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/30 bg-[#c49840]/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#c49840] mb-12">
              <BrainCircuit className="h-3.5 w-3.5" /> Intelligent Culinary Concierge
            </div>
            
            <h1 className="text-6xl font-serif leading-[1.05] tracking-tight text-white sm:text-8xl mb-8">
              Exceptional <br />
              <span className="italic text-[#c49840]">Catering.</span>
            </h1>
            
            <p className="max-w-xl mx-auto text-lg leading-relaxed text-[#7a9470] font-light mb-16">
              Don't just search. Describe your vision, and let our AI curate a bespoke culinary experience tailored to your most important moments.
            </p>

            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleAISearch} className="relative group">
                <div className="relative flex items-center rounded-full border border-white/10 bg-white/[0.03] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all focus-within:border-[#c49840]/50">
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
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c49840] text-black transition hover:scale-110 shadow-lg disabled:opacity-50"
                  >
                    {isProcessing ? <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <ArrowRight className="h-6 w-6" />}
                  </button>
                </div>
                {isProcessing && (
                  <div className="h-8 mt-6">
                    <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#c49840] animate-pulse">
                      {thinkingText}
                    </p>
                  </div>
                )}
              </form>
              <div className="mt-12">
                 <button 
                   onClick={() => setViewMode("browse")}
                   className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#7a9470] hover:text-[#c49840] transition-colors"
                 >
                   Or browse our marketplace manually $\rightarrow$
                 </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-700">
             <button 
              onClick={() => setViewMode("ai")}
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c49840] hover:text-white transition-colors"
             >
               $\leftarrow$ Back to AI Concierge
             </button>
          </div>
        )}
      </section>

      {/* 4. THE MARKETPLACE (Visible in Browse Mode) */}
      {viewMode === "browse" && (
        <section className="relative z-10 mx-auto max-w-7xl px-6 pb-32 animate-in fade-in slide-in-from-bottom-12 duration-700">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="text-left">
              <h2 className="text-4xl font-serif text-white">Curated Selection</h2>
              <div className="h-px w-20 bg-[#c49840] mt-4" />
            </div>

            <div className="flex flex-wrap gap-3">
              {quickFilters.map(f => (
                <button key={f} onClick={() => setCity(f)} className="text-[10px] font-bold uppercase tracking-widest px-5 py-2 rounded-full border border-white/10 bg-white/5 text-white hover:bg-[#c49840] hover:text-black transition">
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {filteredCaterers.map((c) => (
              <div key={c.id} className="group relative bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] transition-all hover:bg-white/[0.05] hover:border-[#c49840]/30">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-serif text-white group-hover:text-[#c49840] transition-colors">{c.name}</h3>
                    <p className="text-xs uppercase tracking-widest text-[#7a9470] mt-1">{c.city} • {c.cuisine}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[#c49840] text-sm">
                    <Star className="h-3 w-3 fill-current" />
                    <span>{c.rating}</span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-[#7a9470] mb-8 min-h-[3rem]">{c.description}</p>
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-[#7a9470]">From</span>
                    <span className="text-xl font-medium text-white">{c.startingPrice}</span>
                  </div>
                  <Link href={`/caterers/${c.id}`} className="text-xs font-bold uppercase tracking-widest text-[#c49840] hover:text-white transition-colors">
                    Explore $\rightarrow$
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. THE INTELLIGENCE (Feature Section) */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 border-t border-white/5">
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
      </section>

      <footer className="relative z-10 border-t border-white/5 bg-[#081008] py-20 text-center">
        <div className="text-xl font-serif tracking-[0.4em] uppercase text-[#c49840] mb-4">Speisely</div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#7a9470]">The Art of Culinary Intelligence</p>
      </footer>
    </main>
  );
}
