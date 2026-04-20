"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  BrainCircuit, 
  Compass, 
  Star,
  Zap,
  CheckCircle2
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
    tags: ["BBQ", "Outdoor Events", "Private Parties"],
    startingPrice: "from €29 p.p.",
    guestRange: "40–180 guests",
    verified: true,
    rating: 4.9
  },
  {
    id: "royal-events-catering",
    name: "Royal Events Catering",
    city: "Hamburg",
    cuisine: "Wedding & Fine Dining",
    description: "Elegant full-service catering for weddings, formal receptions, and refined private celebrations.",
    tags: ["Weddings", "Fine Dining", "Full Service"],
    startingPrice: "from €49 p.p.",
    guestRange: "50–250 guests",
    verified: true,
    rating: 5.0
  },
  {
    id: "atelier-table-berlin",
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
    }, 2000);
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
      {/* 1. ATMOSPHERIC BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#c49840]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#4a5d4e]/5 blur-[120px]" />
        <div className="absolute inset-0 grain-overlay opacity-[0.02]" />
      </div>

      {/* 2. NAVIGATION */}
      <header className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-8 py-8">
        <div className="text-2xl font-serif tracking-[0.3em] uppercase text-[#4a5d4e]">Speisely</div>
        <nav className="hidden items-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-[#2d2926]/50 md:flex">
          <Link href="/caterers" className="hover:text-[#c49840] transition-colors">Marketplace</Link>
          <Link href="/how-it-works" className="hover:text-[#c49840] transition-colors">Technology</Link>
          <Link href="/philosophy" className="hover:text-[#c49840] transition-colors">Philosophy</Link>
        </nav>
        <Link href="/login" className="text-[10px] font-bold uppercase tracking-widest text-[#2d2926] border-b border-[#c49840] pb-1">Login</Link>
      </header>

      {/* 3. HERO SECTION (The emotional hook) */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/20 bg-[#c49840]/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#c49840] mb-10">
          <Sparkles className="h-3.5 w-3.5" /> Intelligent Concierge
        </div>
        
        <h1 className="text-5xl font-serif leading-[1.1] tracking-tight text-[#2d2926] sm:text-7xl md:text-8xl mb-8">
          Crafting <br />
          <span className="italic text-[#c49840]">Unforgettable</span> <br />
          Moments.
        </h1>
        
        <p className="max-w-xl mx-auto text-lg leading-relaxed text-[#4a5d4e]/80 font-light mb-12">
          Don't just search for catering. Describe your vision, and let our AI curate a bespoke culinary experience tailored to your soul.
        </p>

        <div className="max-w-2xl mx-auto">
          {viewMode === "ai" ? (
            <form onSubmit={handleAISearch} className="relative">
              <div className="relative flex items-center rounded-[2rem] border border-[#e0ddd5] bg-white p-1.5 shadow-xl backdrop-blur-sm transition-all focus-within:border-[#c49840]/50">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Describe your dream event (e.g. 'A luxury garden wedding in Berlin')..."
                  className="w-full bg-transparent px-8 py-5 text-xl text-[#2d2926] placeholder:text-[#4a5d4e]/30 focus:outline-none font-light italic"
                />
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c49840] text-white transition hover:scale-105 shadow-lg disabled:opacity-50"
                >
                  {isProcessing ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowRight className="h-6 w-6" />}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-4">
               <p className="text-sm font-medium text-[#4a5d4e]">Or explore the curated collection manually</p>
               <Link href="/caterers" className="text-sm font-bold uppercase tracking-widest text-[#c49840] border-b border-[#c49840] pb-1">
                 Browse Marketplace $\rightarrow$
               </Link>
            </div>
          )}
        </div>
      </section>

      {/* 4. THE FEATURES (The "Card-Based" Fix) */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-[#e0ddd5] shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#c49840]/10 text-[#c49840]">
              <BrainCircuit className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-serif text-[#2d2926] mb-3">Semantic Intent</h3>
            <p className="text-sm leading-relaxed text-[#4a5d4e]">
              Our engine understands the nuance of your request, matching "mood" to culinary style.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-[#e0ddd5] shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#c49840]/10 text-[#c49840]">
              <Compass className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-serif text-[#2d2926] mb-3">Curated Matching</h3>
            <p className="text-sm leading-relaxed text-[#4a5d4e]">
              We don't just find food; we find the perfect partner for your specific event logistics.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-[#e0ddd5] shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#c49840]/10 text-[#c49840]">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-serif text-[#2d2926] mb-3">Vetted Excellence</h3>
            <p className="text-sm leading-relaxed text-[#4a5d4e]">
              Every partner in our network is hand-selected for quality, reliability, and style.
            </p>
          </div>
        </div>
      </section>

      {/* 5. THE MARKETPLACE (The Result) */}
      {viewMode === "browse" && (
        <section className="relative z-10 mx-auto max-w-7xl px-6 pb-32">
           {/* ... rest of marketplace code (remains same as previous version) ... */}
           {/* Note: I'm including the marketplace logic here to keep the file complete */}
           <div className="text-center mb-12">
              <h2 className="text-3xl font-serif text-[#2d2926]">Curated Selection</h2>
           </div>
           <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredCaterers.map(c => (
                <div key={c.id} className="bg-white p-6 rounded-2xl border border-[#e0ddd5] shadow-sm">
                  <h3 className="font-serif text-xl text-[#2d2926]">{c.name}</h3>
                  <p className="text-sm text-[#4a5d4e]">{c.city} • {c.cuisine}</p>
                  <p className="text-sm text-[#4a5d4e]/70 mt-4">{c.description}</p>
                  <div className="mt-6 flex justify-between items-center">
                    <span className="font-bold text-[#c49840]">{c.startingPrice}</span>
                    <Link href={`/caterers/${c.id}`} className="text-xs font-bold uppercase tracking-widest text-[#2d2926] hover:text-[#c49840]">View $\rightarrow$</Link>
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
