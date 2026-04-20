"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { 
  Sparkles, ArrowRight, Star, BrainCircuit, Compass, 
  CheckCircle2, Zap, Search
} from "lucide-react";

// ─── THE RULEBOOK (TYPES) ───────────────────────────────────────────────────
// This is the most important part. If a property exists in the data below, 
// it MUST be listed here, or the build will fail.
type CatererCard = {
  id: string;
  name: string;
  city: string;
  cuisine: string;
  description: string;
  tags: string[];
  startingPrice: string;
  guestRange: string;
  verified?: boolean; // The '?' means it is optional
  featured?: boolean; // ADDED THIS TO FIX THE ERROR
  rating: number;     // ADDED THIS TO FIX THE ERROR
};

// ─── THE DATA (MATCHING THE RULEBOOK) ───────────────────────────────────────
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

// ─── MAIN PAGE COMPONENT ─────────────────────────────────────────────────────
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
      setViewMode("browse"); 
    }, 2500);
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

  const applyQuickFilter = (val: string) => {
    if (["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt"].includes(val)) setCity(val);
    else if (["Corporate", "Wedding", "Private Party"].includes(val)) setEventType(val);
    else setCuisine(val);
  };

  return (
    <main className="relative min-h-screen bg-[#0a120a] text-[#f4f1ea] overflow-x-hidden">
      {/* 1. BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at center, #2a4a2c 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 translate-y-1/2 rounded-full opacity-20 blur-[120px]" style={{ backgroundColor: "#c49840" }} />
        <div className="absolute inset-0 grain-overlay opacity-[0.04]" />
      </div>

      {/* 2. HEADER */}
      <header className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="text-2xl font-bold text-[#e4d9c2] tracking-tighter">Speisely</div>
        <nav className="hidden items-center gap-8 text-sm font-medium text-[#e4d9c2]/70 md:flex">
          <Link href="/caterers" className="transition hover:text-[#c49840]">Browse Caterers</Link>
          <Link href="/request/new" className="transition hover:text-[#c49840]">Plan Event</Link>
        </nav>
        <Link href="/login" className="text-sm font-bold text-[#e4d9c2]">Login</Link>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-120px)] max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        <div className="order-2 text-left lg:order-1">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#c49840]">
            <Sparkles className="h-3.5 w-3.5" /> Digital Concierge
          </div>
          <h1 className="text-5xl font-medium leading-[1.1] tracking-tight text-white sm:text-7xl">
            Premium Catering, <br />
            <span className="italic text-[#c49840]">Intelligently Matched.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#7a9470]">
            Describe your vision in your own words. Our AI finds the perfect
            caterers for your weddings, corporate events, and celebrations.
          </p>

          <div className="relative mt-10 w-full max-w-xl">
            <div className="relative flex items-center rounded-[2rem] border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Elegant wedding for 80 guests in Berlin..."
                className="w-full bg-transparent px-6 py-4 text-lg text-white placeholder:text-white/30 focus:outline-none"
              />
              <button className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c49840] text-black transition hover:scale-105 flex-shrink-0">
                <ArrowRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative order-1 h-[450px] w-full lg:order-2 lg:h-[650px]">
          <div className="absolute inset-0 overflow-hidden rounded-[3rem] border border-white/10 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop"
              alt="Luxury Catering"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#192b1a] via-transparent to-transparent opacity-60" />
          </div>
        </div>
      </section>

      {/* 4. MARKETPLACE SECTION */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-white">Explore Our Curated Caterers</h2>
            <p className="text-[#7a9470] mt-2">Filter by event type or cuisine to find your match.</p>
          </div>
          <Link href="/request/new" className="mt-6 md:mt-0 rounded-xl bg-[#c49840] px-6 py-3 font-semibold text-black transition hover:scale-105">
            Describe your event
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-10 flex flex-wrap gap-4">
          <select 
            value={eventType} 
            onChange={(e) => setEventType(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none"
          >
            <option value="" className="bg-[#192b1a]">All Event Types</option>
            <option value="Wedding" className="bg-[#192b1a]">Wedding</option>
            <option value="Corporate" className="bg-[#192b1a]">Corporate</option>
          </select>

          <select 
            value={cuisine} 
            onChange={(e) => setCuisine(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none"
          >
            <option value="" className="bg-[#192b1a]">All Cuisines</option>
            <option value="BBQ" className="bg-[#192b1a]">BBQ</option>
            <option value="Fine Dining" className="bg-[#192b1a]">Fine Dining</option>
          </select>

          <div className="flex gap-2">
            {quickFilters.map(f => (
              <button 
                key={f} 
                onClick={() => applyQuickFilter(f)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white hover:bg-[#c49840] hover:text-black transition"
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredCaterers.map((caterer) => (
            <div key={caterer.id} className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white">{caterer.name}</h3>
                  <p className="text-sm text-[#7a9470]">{caterer.city} • {caterer.cuisine}</p>
                </div>
                {caterer.verified && <span className="text-[10px] font-bold bg-[#c49840]/20 text-[#c49840] px-2 py-1 rounded">VERIFIED</span>}
              </div>
              <p className="mt-4 text-sm text-[#7a9470] line-clamp-2">{caterer.description}</p>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase text-[#7a9470]">Starting at</div>
                  <div className="text-white font-semibold">{caterer.startingPrice}</div>
                </div>
                <Link href={`/caterers/${caterer.id}`} className="rounded-xl bg-[#c49840] px-4 py-2 text-sm font-bold text-black hover:scale-105 transition">
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 bg-[#081008] py-12 text-center">
        <p className="text-[#7a9470] text-sm">© 2024 Speisely. Premium Catering Intelligence.</p>
      </footer>
    </main>
  );
}
