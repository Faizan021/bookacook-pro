"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

// --- DATA (Copied from your Caterers page) ---
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
};

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
  },
  {
    id: "freshbite-catering",
    name: "FreshBite Catering",
    city: "Munich",
    cuisine: "Corporate & Healthy Menus",
    description: "Modern business catering with fresh seasonal menus for office lunches, team events, and brand activations.",
    tags: ["Corporate", "Healthy Menus", "Business Events"],
    startingPrice: "from €24 p.p.",
    guestRange: "20–140 guests",
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
  },
];

const quickFilters = ["Berlin", "Corporate", "Wedding", "Vegetarian", "Fine Dining", "Private Party"];

// --- MAIN PAGE COMPONENT ---
export default function HomePage() {
  // Marketplace State
  const [city, setCity] = useState("");
  const [eventType, setEventType] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [dietary, setDietary] = useState("");

  // Filter Logic
  function applyQuickFilter(value: string) {
    const lower = value.toLowerCase();
    if (["berlin", "hamburg", "munich", "cologne", "frankfurt"].includes(lower)) { setCity(value); return; }
    if (["corporate", "wedding", "private party"].includes(lower)) { setEventType(value); return; }
    if (["vegetarian", "fine dining", "bbq"].includes(lower)) { setCuisine(value); return; }
  }

  function clearFilters() {
    setCity(""); setEventType(""); setCuisine(""); setDietary("");
  }

  const filteredCaterers = useMemo(() => {
    return sampleCaterers.filter((caterer) => {
      const haystack = [caterer.name, caterer.city, caterer.cuisine, caterer.description, ...caterer.tags].join(" ").toLowerCase();
      const cityMatch = !city.trim() || caterer.city.toLowerCase().includes(city.trim().toLowerCase());
      const eventMatch = !eventType || haystack.includes(eventType.toLowerCase()) || caterer.tags.some((tag) => tag.toLowerCase().includes(eventType.toLowerCase()));
      const cuisineMatch = !cuisine || caterer.cuisine.toLowerCase().includes(cuisine.toLowerCase()) || caterer.tags.some((tag) => tag.toLowerCase().includes(cuisine.toLowerCase()));
      const dietaryMatch = !dietary || haystack.includes(dietary.toLowerCase()) || caterer.tags.some((tag) => tag.toLowerCase().includes(dietary.toLowerCase()));
      return cityMatch && eventMatch && cuisineMatch && dietaryMatch;
    });
  }, [city, eventType, cuisine, dietary]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#192b1a]">
      {/* 1. DECORATIVE BACKGROUNDS */}
      <div className="grain-overlay" />
      <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at center, #2a4a2c 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 translate-y-1/2 rounded-full opacity-20 blur-[120px]" style={{ backgroundColor: "#c49840" }} />

      {/* 2. HEADER */}
      <header className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="text-2xl font-bold text-[#e4d9c2] tracking-tighter">Speisely</div>
        <nav className="hidden items-center gap-8 text-sm font-medium text-[#e4d9c2]/70 md:flex">
          <Link href="/caterers" className="transition hover:text-[#c49840]">Browse Caterers</Link>
          <Link href="/request/new" className="transition hover:text-[#c49840]">Plan Event</Link>
        </nav>
        <Link href="/login" className="text-sm font-bold text-[#e4d9c2]">Login</Link>
      </header>

      {/* 3. HERO SECTION (The Premium Look) */}
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
            Describe your vision in your own words. Our AI finds the perfect caterers for your weddings, corporate events, and celebrations.
          </p>
          
          {/* Quick Search Box */}
          <div className="relative mt-10 w-full max-w-xl">
            <div className="relative flex items-center rounded-[2rem] border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-2xl">
              <input
                type="text"
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
          </div>
        </div>
      </section>

      {/* 4. THE MARKETPLACE SECTION (The Real Functionality) */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-medium uppercase tracking-widest text-[#c49840]">Marketplace</div>
            <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Explore Premium Caterers</h2>
          </div>
          <Link href="/request/new" className="rounded-xl bg-[#c49840] px-6 py-3 font-semibold text-black transition hover:scale-105">
            Describe your event
          </Link>
        </div>

        {/* Filters Area */}
        <div className="mb-10 grid gap-4 md:grid-cols-4">
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="rounded-xl border border-white/10 bg-white/5 p-3 text-white focus:outline-none" />
          <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="rounded-xl border border-white/10 bg-[#192b1a] p-3 text-white">
            <option value="">Event type</option>
            <option value="Wedding">Wedding</option>
            <option value="Corporate">Corporate</option>
            <option value="Private Party">Private Party</option>
          </select>
          <select value={cuisine} onChange={(e) => setCuisine(e.target.value)} className="rounded-xl border border-white/10 bg-[#192b1a] p-3 text-white">
            <option value="">Cuisine</option>
            <option value="BBQ">BBQ</option>
            <option value="Fine Dining">Fine Dining</option>
            <option value="Vegetarian">Vegetarian</option>
          </select>
          <button onClick={clearFilters} className="text-sm text-[#7a9470] hover:text-white underline">Clear all filters</button>
        </div>

        {/* Quick Filter Tags */}
        <div className="mb-12 flex flex-wrap gap-2">
          {quickFilters.map((f) => (
            <button key={f} onClick={() => applyQuickFilter(f)} className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white hover:bg-[#c49840] hover:text-black transition">
              {f}
            </button>
          ))}
        </div>

        {/* THE GRID */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredCaterers.map((caterer) => (
            <div key={caterer.id} className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white">{caterer.name}</h3>
                  <p className="text-sm text-[#7a9470]">{caterer.city} • {caterer.cuisine}</p>
                </div>
                {caterer.verified && <span className="text-[10px] font-bold uppercase bg-[#c49840]/20 text-[#c49840] px-2 py-1 rounded">Verified</span>}
              </div>
              <p className="mt-4 text-sm text-[#7a9470] line-clamp-2">{caterer.description}</p>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase text-[#7a9470]">Starting at</div>
                  <div className="text-white font-semibold">{caterer.startingPrice}</div>
                </div>
                <Link href={`/caterers/${caterer.id}`} className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-black hover:bg-[#c49840] transition">
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-[2.5rem] bg-gradient-to-r from-[#2a4a2c] to-[#192b1a] p-12 text-center border border-white/10">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Need a faster match?</h2>
          <p className="mt-4 text-[#7a9470]">Describe your event and let Speisely guide the brief.</p>
          <Link href="/request/new" className="mt-8 inline-block rounded-full bg-[#c49840] px-8 py-4 font-bold text-black transition hover:scale-105">
            Start Guided Request
          </Link>
        </div>
      </section>
    </main>
  );
}
