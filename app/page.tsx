"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
// I have added 'Star' to this import line below
import { Sparkles, ArrowRight, Star } from "lucide-react";

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
    id: "berlin-bbq-house",
    name: "Berlin BBQ House",
    city: "Berlin",
    cuisine: "BBQ & Grill",
    description: "Authentic live grill catering for private parties, summer celebrations, and relaxed premium outdoor events.",
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
    featured: true,
    rating: 5.0
  },
  {
    id: "freshbite-catering",
    name: "FreshBite Catering",
    city: "Munich",
    cuisine: "Corporate & Healthy Menus",
    description: "Modern business catering with fresh seasonal menus for office lunches, team events, and brand activations.",
    tags: ["Corporate", "Healthy Menu", "Business Events"],
    startingPrice: "from €24 p.p.",
    guestRange: "20–140 guests",
    rating: 4.7
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
  },
  {
    id: "green-plate-events",
    name: "Green Plate Events",
    city: "Cologne",
    cuisine: "Vegetarian & Vegan",
    description: "Plant-forward catering concepts with elegant presentation for conscious weddings and premium corporate events.",
    tags: ["Vegetarian", "Vegan", "Sustainable"],
    startingPrice: "from €31 p.p.",
    guestRange: "30–160 guests",
    verified: true,
    rating: 4.9
  },
  {
    id: "levant-feast-studio",
    name: "Levant Feast Studio",
    city: "Frankfurt",
    cuisine: "Middle Eastern",
    description: "Warm, abundant sharing menus and stylish event catering for family gatherings, receptions, and cultural celebrations.",
    tags: ["Sharing Menus", "Middle Eastern", "Celebrations"],
    startingPrice: "from €34 p.p.",
    guestRange: "30–200 guests",
    rating: 4.6
  },
];

const quickFilters = ["Berlin", "Corporate", "Wedding", "Vegetarian", "Fine Dining", "Private Party"];

// ─── MAIN PAGE COMPONENT ─────────────────────────────────────────────────────
export default function HomePage() {
  const [city, setCity] = useState("");
  const [eventType, setEventType] = useState("");
  const [cuisine, setCuisine] = useState("");

  const filteredCaterers = useMemo(() => {
    return sampleCaterers.filter((caterer) => {
      const haystack = [caterer.name, caterer.city, caterer.cuisine, caterer.description, ...caterer.tags]
        .join(" ").toLowerCase();

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
    <main className="relative min-h-screen overflow-x-hidden bg-[#0a1a0a]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#2a4a2c_0%,transparent_50%)] opacity-50" />
        <div className="absolute inset-0 grain-overlay opacity-[0.03]" />
      </div>

      <header className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-8 py-8">
        <div className="text-2xl font-serif tracking-widest uppercase text-[#c49840]">Speisely</div>
        <nav className="hidden items-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f4f1ea]/60 md:flex">
          <Link href="/caterers" className="hover:text-[#c49840] transition-colors">Browse</Link>
          <Link href="/request/new" className="hover:text-[#c49840] transition-colors">Plan</Link>
        </nav>
        <Link href="/login" className="text-[10px] font-bold uppercase tracking-widest text-[#f4f1ea] border-b border-[#c49840] pb-1">Login</Link>
      </header>

      <section className="relative z-10 mx-auto max-w-5xl px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/30 bg-[#c49840]/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#c49840] mb-10">
          <Sparkles className="h-3 w-3" /> Digital Concierge
        </div>
        
        <h1 className="text-5xl font-serif leading-[1.1] tracking-tight text-white sm:text-7xl md:text-8xl">
          Exceptional <br />
          <span className="italic text-[#c49840]">Catering.</span>
        </h1>
        
        <p className="mt-8 max-w-xl mx-auto text-lg leading-relaxed text-[#7a9470] font-light">
          The intelligent way to discover and book elite culinary experiences for your most important moments.
        </p>

        <div className="mt-12 max-w-xl mx-auto">
          <div className="relative flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1.5 shadow-2xl backdrop-blur-md">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search by city..."
              className="w-full bg-transparent px-6 py-4 text-lg text-white placeholder:text-white/20 focus:outline-none"
            />
            <button className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c49840] text-black transition hover:scale-105">
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-32">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="text-left">
            <h2 className="text-3xl font-serif text-white">Curated Selection</h2>
            <div className="h-px w-12 bg-[#c49840] mt-4" />
          </div>

          <div className="flex flex-wrap gap-2">
            {quickFilters.map(f => (
              <button key={f} onClick={() => applyQuickFilter(f)} className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white hover:bg-[#c49840] hover:text-black transition">
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
