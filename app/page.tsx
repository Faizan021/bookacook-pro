"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BrainCircuit,
  ShieldCheck,
  Star,
} from "lucide-react";

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

const sampleCaterers: CatererCard[] = [
  {
    id: "1",
    name: "Berlin BBQ House",
    city: "Berlin",
    cuisine: "BBQ & Grill",
    description:
      "Authentic live grill catering for premium outdoor events and private celebrations.",
    tags: ["BBQ", "Outdoor Events", "Private Parties"],
    startingPrice: "from €29 p.p.",
    guestRange: "40–180 guests",
    verified: true,
    rating: 4.9,
  },
  {
    id: "2",
    name: "Royal Events Catering",
    city: "Hamburg",
    cuisine: "Wedding & Fine Dining",
    description:
      "Elegant full-service catering for weddings, formal receptions, and refined private celebrations.",
    tags: ["Weddings", "Fine Dining", "Full Service"],
    startingPrice: "from €49 p.p.",
    guestRange: "50–250 guests",
    verified: true,
    featured: true,
    rating: 5.0,
  },
  {
    id: "3",
    name: "Atelier Table Berlin",
    city: "Berlin",
    cuisine: "Modern European",
    description:
      "Curated premium menus for intimate dinners, private celebrations, and design-led event concepts.",
    tags: ["Private Dining", "Modern European", "Curated Menus"],
    startingPrice: "from €58 p.p.",
    guestRange: "15–80 guests",
    featured: true,
    rating: 4.8,
  },
];

const quickFilters = ["Berlin", "Corporate", "Wedding", "Vegetarian", "Fine Dining"];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [city, setCity] = useState("");
  const [eventType, setEventType] = useState("");
  const [cuisine, setCuisine] = useState("");

  const applyQuickFilter = (val: string) => {
    if (["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt"].includes(val)) {
      setCity(val);
    } else if (["Corporate", "Wedding", "Private Party"].includes(val)) {
      setEventType(val);
    } else {
      setCuisine(val);
    }
  };

  const filteredCaterers = useMemo(() => {
    return sampleCaterers.filter((caterer) => {
      const haystack = [
        caterer.name,
        caterer.city,
        caterer.cuisine,
        caterer.description,
        ...caterer.tags,
      ]
        .join(" ")
        .toLowerCase();

      const cityMatch =
        !city.trim() || caterer.city.toLowerCase().includes(city.trim().toLowerCase());
      const eventMatch =
        !eventType ||
        haystack.includes(eventType.toLowerCase()) ||
        caterer.tags.some((tag) => tag.toLowerCase().includes(eventType.toLowerCase()));
      const cuisineMatch =
        !cuisine ||
        caterer.cuisine.toLowerCase().includes(cuisine.toLowerCase()) ||
        caterer.tags.some((tag) => tag.toLowerCase().includes(cuisine.toLowerCase()));

      return cityMatch && eventMatch && cuisineMatch;
    });
  }, [city, eventType, cuisine]);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#07110b] text-[#f6f1e8]">
      {/* background */}
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(circle at top center, rgba(196,152,64,0.14) 0%, transparent 35%), radial-gradient(circle at bottom left, rgba(74,108,78,0.18) 0%, transparent 30%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_30%,transparent_70%,rgba(255,255,255,0.02))]" />
      </div>

      {/* header */}
      <header className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="text-2xl font-semibold tracking-tight text-[#eadfca]">
          Speisely
        </div>

        <nav className="hidden items-center gap-8 text-sm text-[#e4d9c2]/75 md:flex">
          <Link href="/caterers" className="transition hover:text-[#c49840]">
            Browse Caterers
          </Link>
          <Link href="/request/new" className="transition hover:text-[#c49840]">
            Plan Event
          </Link>
        </nav>

        <Link
          href="/login"
          className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-[#eadfca] transition hover:border-[#c49840] hover:text-[#c49840]"
        >
          Login
        </Link>
      </header>

      {/* hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-24 md:pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/20 bg-[#c49840]/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#c49840]">
            <Sparkles className="h-3.5 w-3.5" />
            AI-powered premium catering marketplace
          </div>

          <h1 className="mt-8 text-5xl font-medium leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
            Find the right caterer
            <span className="block italic text-[#c49840]">with elegance, not effort.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#9aae97]">
            Speisely helps customers describe their event in natural language and get
            matched with curated caterers for weddings, corporate events, and private
            celebrations.
          </p>

          {/* AI search */}
          <div className="mx-auto mt-10 max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Elegant wedding dinner for 80 guests in Berlin with vegetarian options..."
                className="h-16 w-full bg-transparent px-5 text-base text-white placeholder:text-white/30 focus:outline-none"
              />
              <Link
                href="/request/new"
                className="flex h-14 items-center justify-center gap-2 rounded-full bg-[#c49840] px-6 font-semibold text-black transition hover:scale-[1.02]"
              >
                Start with AI
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* trust row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-[#d7cfbf]">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              Curated caterers
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              Verified businesses
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              AI-guided requests
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              Premium event matching
            </span>
          </div>
        </div>

        {/* premium info cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <BrainCircuit className="h-5 w-5 text-[#c49840]" />
            <h3 className="mt-4 text-lg font-semibold text-white">AI event intake</h3>
            <p className="mt-2 text-sm leading-6 text-[#8ea18b]">
              Customers describe the event naturally instead of filling a cold, generic form.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <ShieldCheck className="h-5 w-5 text-[#c49840]" />
            <h3 className="mt-4 text-lg font-semibold text-white">Trusted marketplace</h3>
            <p className="mt-2 text-sm leading-6 text-[#8ea18b]">
              Showcase verified caterers, polished profiles, and premium service credibility.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <CheckCircle2 className="h-5 w-5 text-[#c49840]" />
            <h3 className="mt-4 text-lg font-semibold text-white">Better matching</h3>
            <p className="mt-2 text-sm leading-6 text-[#8ea18b]">
              Help users reach the right caterer faster based on event type, style, and budget.
            </p>
          </div>
        </div>
      </section>

      {/* marketplace */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-white">Curated caterers</h2>
            <p className="mt-2 text-[#8ea18b]">
              Browse premium catering partners or start with AI-guided matching.
            </p>
          </div>

          <Link
            href="/request/new"
            className="rounded-xl bg-[#c49840] px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
          >
            Describe your event
          </Link>
        </div>

        {/* filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="" className="bg-[#0f1b13]">
              All event types
            </option>
            <option value="Wedding" className="bg-[#0f1b13]">
              Wedding
            </option>
            <option value="Corporate" className="bg-[#0f1b13]">
              Corporate
            </option>
          </select>

          <select
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="" className="bg-[#0f1b13]">
              All cuisines
            </option>
            <option value="BBQ" className="bg-[#0f1b13]">
              BBQ
            </option>
            <option value="Fine Dining" className="bg-[#0f1b13]">
              Fine Dining
            </option>
          </select>

          <div className="flex flex-wrap gap-2">
            {quickFilters.map((f) => (
              <button
                key={f}
                onClick={() => applyQuickFilter(f)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white transition hover:border-[#c49840] hover:bg-[#c49840] hover:text-black"
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCaterers.map((caterer) => (
            <div
              key={caterer.id}
              className="group rounded-[2rem] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{caterer.name}</h3>
                  <p className="mt-1 text-sm text-[#8ea18b]">
                    {caterer.city} · {caterer.cuisine}
                  </p>
                </div>

                {caterer.verified && (
                  <span className="rounded-full bg-[#c49840]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#c49840]">
                    Verified
                  </span>
                )}
              </div>

              <p className="mt-4 text-sm leading-6 text-[#9aae97]">
                {caterer.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {caterer.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#d8d1c3]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                <div>
                  <div className="flex items-center gap-1 text-sm text-[#d8d1c3]">
                    <Star className="h-4 w-4 fill-[#c49840] text-[#c49840]" />
                    {caterer.rating}
                  </div>
                  <div className="mt-2 text-sm text-[#8ea18b]">{caterer.guestRange}</div>
                  <div className="mt-1 font-semibold text-white">{caterer.startingPrice}</div>
                </div>

                <Link
                  href={`/caterers/${caterer.id}`}
                  className="rounded-xl bg-[#c49840] px-4 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.03]"
                >
                  View profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 py-10 text-center">
        <p className="text-sm text-[#7f9380]">
          © 2026 Speisely. Premium Catering Intelligence.
        </p>
      </footer>
    </main>
  );
}
