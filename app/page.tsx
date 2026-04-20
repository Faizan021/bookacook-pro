"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { 
  Sparkles, ArrowRight, Star, BrainCircuit, Compass, 
  CheckCircle2, Zap, MapPin, Calendar, MessageSquareQuote,
  Search, ChevronRight
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
const MOODS = [
  { id: "gala", name: "The Midnight Gala", img: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80", prompt: "A high-end, glamorous evening gala with gold accents and champagne service" },
  { id: "garden", name: "The Organic Garden", img: "https সেকেন্ড.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=800&q=80", prompt: "An intimate, sustainable outdoor garden party with fresh, seasonal vegetarian menus" },
  { id: "minimal", name: "Urban Minimalist", img: "https://images.unsplash.com/photo-1550966842-28af93f099f1?auto=format&fit=crop&w=800&q=80", prompt: "A clean, modern, minimalist corporate lunch in a high-rise Berlin office" },
];

const CASE_STUDIES = [
  {
    challenge: "A high-profile tech launch in Berlin requiring strict vegan-only, zero-waste logistics.",
    match: "Atelier Table Berlin — Selected for their precision in sustainable fine dining.",
    result: "Seamless execution for 200 guests with zero waste footprint."
  },
  {
    challenge: "An intimate, multi-course wedding in a remote Tuscan villa for 40 guests.",
    match: "Levant Feast Studio — Selected for their ability to cook in remote locations with high-end equipment.",
    result: "A flawless 7-course experience that exceeded guest expectations."
  }
];

const sampleCaterers: CatererCard[] = [
  { id: "1", name: "Berlin BBQ House", city: "Berlin", cuisine: "BBQ", description: "Authentic live grill catering.", tags: ["BBQ"], startingPrice: "€29 p.p.", guestRange: "40-180", verified: true, rating: 4.9 },
  { id: "2", name: "Royal Events", city: "Hamburg", cuisine: "Fine Dining", description: "Elegant wedding services.", tags: ["Luxury"], startingPrice: "€49 p.p.", guestRange: "50-250", verified: true, rating: 5.0 },
  { id: "3", name: "Atelier Table", city: "Berlin", cuisine: "Modern", description: "Curated design-led menus.", tags: ["Minimalist"], startingPrice: "€58 p.p.", guestRange: "15-80", rating: 4.8 },
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function HomePage() {
  const [viewMode, setViewMode] = useState<"ai" | "browse">("ai");
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [thinkingText, setThinkingText] = useState("");
  const [city, setCity] = useState("");
  const [eventType, setEventType] = useState("");
  const [cuisine, setCuisine] = useState("");

  // 1. AI "Thinking" Trace Logic
  const thinkingPhrases = [
    "Analyzing event atmosphere...",
    "Cross-referencing seasonal availability...",
    "Filtering for dietary precision...",
    "Matching culinary aesthetics...",
    "Synthesizing your vision..."
  ];

  const handleAISearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsProcessing(true);
    
    let phraseIdx = 0;
    const interval = setInterval(() => {
      setThinkingText(thinkingPhrases[phraseIdx % thinkingPhrases.length]);
      phraseIdx++;
    }, 1500);

    setTimeout(() => {
      clearInterval(interval);
      setIsProcessing(false);
      setViewMode("browse");
    }, 3500);
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
    <main className="relative min-h-screen bg-[#faf9f6] text-[#2d2926] overflow-x-hidden font-sans">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#c49840]/5 blur-[120px]" />
        <div className="absolute inset-0 grain-overlay opacity-[0.03]" />
      </div>

      {/* HEADER */}
      <header className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-8 py-8">
        <div className="text-2xl font-serif tracking-[0.3em] uppercase text-[#4a5d4e]">Speisely</div>
        <nav className="hidden md:flex gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-[#2d2926]/50">
          <Link href="/how-it-works">Intelligence</Link>
          <Link href="/philosophy">Philosophy</Link>
        </nav>
        <Link href="/login" className="text-[10px] font-bold uppercase tracking-widest text-[#2d2926] border-b border-[#c49840] pb-1">Login</Link>
      </header>

      {/* 2. HERO: THE AI CONCIERGE */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/20 bg-[#c49840]/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#c49840] mb-10">
          <BrainCircuit className="h-3.5 w-3.5" /> Intelligent Culinary Concierge
        </div>
        
        <h1 className="text-5xl font-serif leading-[1.1] tracking-tight text-[#2d2926] sm:text-7xl md:text-8xl mb-8">
          Crafting <br />
          <span className="italic text-[#c49840]">Unforgettable</span> <br />
          Moments.
        </h1>
        
        <p className="max-w-xl mx-auto text-lg leading-relaxed text-[#4a5d4e]/80 font-light mb-12">
          Don't just search for catering. Describe your vision, and let our AI curate a bespoke culinary experience.
        </p>

        <div className="max-w-2xl mx-auto">
          {viewMode === "ai" ? (
            <form onSubmit={handleAISearch} className="relative">
              <div className="relative flex items-center rounded-[2rem] border border-[#e0ddd5] bg-white p-1.5 shadow-2xl shadow-[#c49840]/5 backdrop-blur-sm transition-all focus-within:border-[#c49840]/50">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. 'A luxury garden wedding in Berlin'..."
                  className="w-full bg-transparent px-8 py-5 text-xl text-[#2d2926] placeholder:text-[#4a5d4e]/30 focus:outline-none font-light italic"
                />
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c49840] text-white transition hover:scale-105 disabled:opacity-50"
                >
                  {isProcessing ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowRight className="h-6 w-6" />}
                </button>
              </div>
              {/* THE INTELLIGENCE TRACE (The Grant-Winner) */}
              <div className="h-8 mt-4">
                {isProcessing && (
                  <p className="text-xs font-medium uppercase tracking-widest text-[#c49840] animate-pulse">
                    {thinkingText}
                  </p>
                )}
              </div>
            </form>
          ) : (
            <button 
              onClick={() => setViewMode("ai")}
              className="text-sm font-bold uppercase tracking-widest text-[#4a5d4e] hover:text-[#c49840] transition-colors underline underline-offset-8"
            >
              Return to AI Concierge
            </button>
          )}

          {/* The "Switch" to Traditional */}
          {viewMode === "ai" && !isProcessing && (
            <div className="mt-12 flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#4a5d4e]/40">
              <span>Prefer the traditional way?</span>
              <button onClick={() => setViewMode("browse")} className="text-[#c49840] hover:underline">Browse Marketplace $\rightarrow$</button>
            </div>
          )}
        </div>
      </section>

      {/* 3. INSPIRATION ATELIER (The Visual Discovery) */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 border-t border-[#e0ddd5]">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif text-[#2d2926]">The Inspiration Atelier</h2>
          <p className="text-[#4a5d4e]/70 mt-4">Select a mood to begin your journey</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {MOODS.map((mood) => (
            <button 
              key={mood.id}
              onClick={() => {setSearchQuery(mood.prompt); handleAISearch({ preventDefault: () => {} } as any);}}
              className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#e0ddd5]"
            >
              <img src={mood.img} alt={mood.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110 group-hover:rotate-1" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2d2926]/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 text-left">
                <h3 className="text-2xl font-serif text-white">{mood.name}</h3>
                <p className="text-xs uppercase tracking-widest text-[#c49840] opacity-0 group-hover:opacity-100 transition-opacity">Discover Mood $\rightarrow$</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. CASE STUDIES (The Proof of Success) */}
      <section className="relative z-10 bg-[#4a5d4e] py-24 text-[#f4f1ea]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-serif">Orchestrated Excellence</h2>
            <p className="text-[#f4f1ea]/60 mt-4">Real challenges, solved by intelligence.</p>
          </div>

          <div className="grid gap-12 md:grid-cols-2">
            {CASE_STUDIES.map((study, idx) => (
              <div key={idx} className="relative p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
                <div className="absolute top-8 right-8 text-[#c49840]/20">
                  <MessageSquareQuote className="h-12 w-12" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#c49840] mb-4">The Challenge</h3>
                <p className="text-xl font-serif leading-relaxed mb-8 italic">"{study.challenge}"</p>
                
                <div className="space-y-4 border-t border-white/10 pt-8">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="h-5 w-5 text-[#c49840] mt-1" />
                    <div>
                      <span className="block text-xs font-bold uppercase tracking-widest text-white/40">The Speisely Match</span>
                      <p className="text-sm text-[#f4f1ea]">{study.match}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="h-5 w-5 text-[#c49840] mt-1" />
                    <div>
                      <span className="block text-xs font-bold uppercase tracking-widest text-white/40">The Result</span>
                      <p className="text-sm text-[#f4f1ea]">{study.result}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. THE MARKETPLACE (The Result) */}
      {viewMode === "browse" && (
        <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-serif text-[#2d2926]">Curated Marketplace</h2>
              <div className="h-px w-12 bg-[#c49840] mt-4" />
            </div>
            <div className="flex flex-wrap gap-2">
              {quickFilters.map(f => (
                <button key={f} onClick={() => {setCity(f); setEventType(""); setCuisine("");}} className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-[#e0ddd5] text-[#4a5d4e] hover:bg-[#c49840] hover:text-white transition">
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredCaterers.map((c) => (
              <div key={c.id} className="group bg-white border border-[#e0ddd5] p-8 rounded-3xl transition-all hover:shadow-xl hover:border-[#c49840]/30">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-serif text-[#2d2926]">{c.name}</h3>
                    <p className="text-xs text-[#4a5d4e] mt-1">{c.city} • {c.cuisine}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[#c49840] text-sm"><Star className="h-3 w-3 fill-current" /><span>{c.rating}</span></div>
                </div>
                <p className="text-sm text-[#4a5d4e] mb-6 line-clamp-2">{c.description}</p>
                <div className="flex items-center justify-between pt-6 border-t border-[#f4f1ea]">
                  <span className="text-lg font-bold text-[#2d2926]">{c.startingPrice}</span>
                  <Link href={`/caterers/${c.id}`} className="text-[10px] font-bold uppercase tracking-widest text-[#c49840] hover:text-[#2d2926]">Explore $\rightarrow$</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. THE VITALITY FOOTER (The Live Ecosystem) */}
      <footer className="relative z-10 border-t border-[#e0ddd5] bg-[#f4f1ea] py-16 text-center">
        <div className="mb-8 flex justify-center items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#4a5d4e]/40">
          <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" /> 14 events matching in Europe</span>
          <span className="w-px h-4 bg-[#4a5d4e]/20" />
          <span>32 new masters this week</span>
        </div>
        <div className="text-sm font-serif tracking-widest uppercase text-[#c49840] mb-4">Speisely</div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#4a5d4e]/50">The Art of Culinary Intelligence</p>
      </footer>
    </main>
  );
}
