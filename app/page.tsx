"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { 
  Sparkles, ArrowRight, Star, BrainCircuit, Compass, 
  CheckCircle2, Zap, MapPin, Calendar, MessageSquareQuote
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
const MOODS = [
  { id: "gala", name: "The Midnight Gala", img: "https://images.unsplash.com/photo-1519671482749-fd09be7cpa", prompt: "A high-end, glamorous evening gala with gold accents and champagne service" },
  { id: "garden", name: "The Organic Garden", img: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e", prompt: "An intimate, sustainable outdoor garden party with fresh, seasonal vegetarian menus" },
  { id: "minimal", name: "Urban Minimalist", img: "https://images.unsplash.com/photo-1550966842-28af93f09f1", prompt: "A clean, modern, minimalist corporate lunch in a high-rise Berlin office" },
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
  {
    id: "1",
    name: "Berlin BBQ House",
    city: "Berlin",
    cuisine: "BBQ & Grill",
    description: "Authentic live grill catering for premium outdoor events and private celebrations.",
    tags: ["BBQ", "Outdoor Events", "Private Parties"],
    startingPrice: "from €29 p.p.",
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
    tags: ["Weddings", "Fine Dining", "Full Service"],
    startingPrice: "from €49 p.p.",
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
    tags: ["Private Dining", "Modern European", "Curated Menus"],
    startingPrice: "from €58 p.p.",
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
  const [thinkingText, setThinkingText] = useState("");
  const [city, setCity] = useState("");
  const [eventType, setEventType] = useState("");
  const [cuisine, setCuisine] = useState("");

  const handleAISearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsProcessing(true);
    let phraseIdx = 0;
    const phrases = ["Analyzing event atmosphere...", "Cross-referencing availability...", "Filtering for dietary precision...", "Matching culinary aesthetics...", "Synthesizing your vision..."];
    const interval = setInterval(() => {
      setThinkingText(phrases[phraseIdx % phrases.length]);
      phraseIdx++;
    }, 1500);
    setTimeout(() => {
      clearInterval(interval);
      setIsProcessing(false);
      setViewMode("browse");
    }, 3500);
  };

  const filteredCaterers = useMemo(() => {
    return sampleCaterers.filter((caterer) => {
      const haystack = [caterer.name, caterer.city, caterer.cuisine, caterer.description, ...caterer.tags].join(" ").toLowerCase();
      const cityMatch = !city.trim() || caterer.city.toLowerCase().includes(city.trim().toLowerCase());
      const eventMatch = !eventType || haystack.includes(eventType.toLowerCase()) || caterer.tags.some(tag => tag.toLowerCase().includes(eventType.toLowerCase()));
      const cuisineMatch = !cuisine || caterer.cuisine.toLowerCase().includes(cuisine.toLowerCase()) || caterer.tags.some(tag => tag.toLowerCase().includes(cuisine.toLowerCase()));
      return cityMatch && eventMatch && cuisineMatch;
    });
  }, [city, eventType, cuisine]);

  return (
    <main className="relative min-h-screen bg-[#faf9f6] text-[#2d2926] overflow-x-hidden font-sans">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#c49840]/5 blur-[120px]" />
        <div className="absolute inset-0 grain-overlay opacity-[0.03]" />
      </div>

      <header className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-8 py-8">
        <div className="text-2xl font-serif tracking-[0.3em] uppercase text-[#4a5d4e]">Speisely</div>
        <nav className="hidden md:flex gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-[#2d2926]/50">
          <Link href="/caterers">Marketplace</Link>
          <Link href="/how-it-works">Technology</Link>
        </nav>
        <Link href="/login" className="text-[10px] font-bold uppercase tracking-widest text-[#2d2926] border-b border-[#c49840] pb-1">Login</Link>
      </header>

      <section className="relative z-10 mx-auto max-w-5xl px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/20 bg-[#c49840]/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#c49840] mb-10">
          <BrainCircuit className="h-3.5 w-3.5" /> Intelligent Concierge
        </div>
        <h1 className="text-5xl font-serif leading-[1.1] tracking-tight text-[#2d2926] sm:text-7xl md:text-8xl mb-8">
          Crafting <br /><span className="italic text-[#c49840]">Unforgettable</span> <br /> Moments.
        </h1>
        <p className="max-w-xl mx-auto text-lg leading-relaxed text-[#4a5d4e]/80 font-light mb-12">
          Don't just search for catering. Describe your vision, and let our AI curate a bespoke culinary experience.
        </p>

        <div className="max-w-2xl mx-auto">
          {viewMode === "ai" ? (
            <form onSubmit={handleAISearch} className="relative">
              <div className="relative flex items-center rounded-[2rem] border border-[#e0ddd5] bg-white p-1.5 shadow-xl backdrop-blur-sm transition-all focus-within:border-[#c49840]/50">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. 'A luxury garden wedding in Berlin'..."
                  className="w-full bg-transparent px-8 py-5 text-xl text-[#2d2926] placeholder:text-[#4a5d4e]/30 focus:outline-none font-light italic"
                />
                <button type="submit" disabled={isProcessing} className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c49840] text-white transition hover:scale-105 disabled:opacity-50">
                  {isProcessing ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowRight className="h-6 w-6" />}
                </button>
              </div>
              <div className="h-8 mt-4">
                {isProcessing && <p className="text-xs font-medium uppercase tracking-widest text-[#c49840] animate-pulse">{thinkingText}</p>}
              </div>
            </form>
          ) : (
            <button onClick={() => setViewMode("ai")} className="text-sm font-bold uppercase tracking-widest text-[#4a5d4e] hover:text-[#c49840] transition-colors">
              $\leftarrow$ Return to AI Concierge
            </button>
          )}
          {viewMode === "ai" && !isProcessing && (
            <div className="mt-12 flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[#4a5d4e]/40">
              <span>Prefer the traditional way?</span>
              <button onClick={() => setViewMode("browse")} className="text-[#c49840] hover:underline">Browse Marketplace $\rightarrow$</button>
            </div>
          )}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 border-t border-[#e0ddd5]">
        <div className="grid gap-16 md:grid-cols-3">
          <div className="text-center group">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#c49840]/10 text-[#c49840] group-hover:scale-110 transition-transform"><BrainCircuit className="h-8 w-8" /></div>
            <h3 className="text-xl font-serif text-[#2d2926] mb-3">Semantic Intent</h3>
            <p className="text-sm leading-relaxed text-[#4a5d4e]">Our engine understands the nuance of your request, matching "mood" to culinary style.</p>
          </div>
          <div className="text-center group">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#c49840]/10 text-[#c49840] group-hover:scale-110 transition-transform"><Compass className="h-8 w-8" /></div>
            <h3 className="text-xl font-serif text-[#2d2926] mb-3">Curated Matching</h3>
            <p className="text-sm leading-relaxed text-[#4a5d4e]">We don't just find food; we find the perfect partner for your specific event logistics.</p>
          </div>
          <div className="text-center group">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#c49840]/10 text-[#c49840] group-hover:scale-110 transition-transform"><CheckCircle2 className="h-8 w-8" /></div>
            <h3 className="text-xl font-serif text-[#2d2926] mb-3">Vetted Excellence</h3>
            <p className="text-sm leading-relaxed text-[#4a5d4e]">Every partner in our network is hand-selected for quality, reliability, and style.</p>
          </div>
        </div>
      </section>

      {viewMode === "browse" && (
        <section className="relative z-10 mx-auto max-w-7xl px-6 pb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <h2 className="text-3xl font-serif text-[#2d2926]">Curated Selection</h2>
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
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-serif text-[#2d2926] group-hover:text-[#c49840] transition-colors">{c.name}</h3>
                  <div className="flex items-center gap-1 text-[#c49840] text-sm"><Star className="h-3 w-3 fill-current" /><span>{c.rating}</span></div>
                </div>
                <p className="text-sm text-[#4a5d4e] mb-8">{c.description}</p>
                <div className="flex items-center justify-between pt-6 border-t border-[#f4f1ea]">
                  <span className="text-lg font-bold text-[#2d2926]">{c.startingPrice}</span>
                  <Link href={`/caterers/${c.id}`} className="text-[10px] font-bold uppercase tracking-widest text-[#c49840]">Explore $\rightarrow$</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="relative z-10 border-t border-[#e0ddd5] bg-[#f4f1ea] py-16 text-center">
        <div className="text-sm font-serif tracking-widest uppercase text-[#c49840] mb-4">Speisely</div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#4a5d4e]/50">The Art of Culinary Intelligence</p>
      </footer>
    </main>
  );
}
