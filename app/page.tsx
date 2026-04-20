"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Search,
  ShieldCheck,
  Sparkles,
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
    name: "Maison Ember",
    city: "Berlin",
    cuisine: "Live Fire & Contemporary European",
    description:
      "Refined live-fire catering for elevated private celebrations, design-led receptions, and outdoor hospitality experiences.",
    tags: ["Live Fire", "Private Celebrations", "Outdoor Hospitality"],
    startingPrice: "from €49 p.p.",
    guestRange: "40–180 guests",
    verified: true,
    rating: 4.9,
  },
  {
    id: "2",
    name: "Atelier Royal Dining",
    city: "Hamburg",
    cuisine: "Wedding & Fine Dining",
    description:
      "Elegant full-service catering for weddings, formal dinners, and premium receptions with polished hospitality execution.",
    tags: ["Weddings", "Fine Dining", "Full Service"],
    startingPrice: "from €69 p.p.",
    guestRange: "50–250 guests",
    verified: true,
    featured: true,
    rating: 5.0,
  },
  {
    id: "3",
    name: "Studio Table Berlin",
    city: "Berlin",
    cuisine: "Modern European",
    description:
      "Curated premium menus for intimate dinners, executive gatherings, and private events with a strong editorial aesthetic.",
    tags: ["Private Dining", "Modern European", "Curated Menus"],
    startingPrice: "from €58 p.p.",
    guestRange: "15–80 guests",
    featured: true,
    rating: 4.8,
  },
];

const quickFilters = ["Berlin", "Corporate", "Wedding", "Vegetarian", "Fine Dining"];

const intelligenceSignals = [
  {
    icon: BrainCircuit,
    title: "Natural-language event capture",
    description:
      "Capture hospitality requirements the way clients naturally describe them, not through rigid forms.",
  },
  {
    icon: Search,
    title: "Semantic qualification engine",
    description:
      "Translate event intent into qualified catering matches based on style, scale, cuisine, and service expectations.",
  },
  {
    icon: ShieldCheck,
    title: "Curated premium supply",
    description:
      "Surface verified hospitality partners in a more trusted, design-led, and premium discovery experience.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Describe the event",
    description:
      "Share the event in natural language, including tone, guest count, cuisine direction, service format, and special requirements.",
  },
  {
    number: "02",
    title: "Interpret the intent",
    description:
      "Speisely structures the request semantically to understand hospitality fit beyond simple keyword matching.",
  },
  {
    number: "03",
    title: "Match with precision",
    description:
      "Receive curated catering partners aligned with event style, execution needs, and premium expectations.",
  },
];

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
    <main className="relative min-h-screen overflow-x-hidden bg-[#06110c] text-[#f6f1e8]">
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(circle at top center, rgba(196,152,64,0.15) 0%, transparent 30%), radial-gradient(circle at 15% 85%, rgba(77,103,84,0.18) 0%, transparent 25%), radial-gradient(circle at 85% 30%, rgba(40,60,48,0.18) 0%, transparent 20%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_25%,transparent_70%,rgba(255,255,255,0.02))]" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(rgba(255,255,255,0.8)_0.5px,transparent_0.5px)] [background-size:18px_18px]" />
      </div>

      <header className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-8">
        <Link href="/" className="text-2xl font-semibold tracking-tight text-[#eadfca]">
          Speisely
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-[#d6cfbf]/70 md:flex">
          <Link href="/caterers" className="transition hover:text-[#c49840]">
            Selected Partners
          </Link>
          <Link href="/request/new" className="transition hover:text-[#c49840]">
            Plan Event
          </Link>
        </nav>

        <Link
          href="/login"
          className="rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm font-medium text-[#eadfca] transition hover:border-[#c49840]/40 hover:text-[#c49840]"
        >
          Login
        </Link>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-14 pt-14 md:px-8 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/20 bg-[#c49840]/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
            <Sparkles className="h-3.5 w-3.5" />
            NLP-powered hospitality intelligence
          </div>

          <h1 className="mt-8 text-5xl font-medium leading-[0.98] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[84px]">
            From event intent to
            <span className="mt-2 block italic text-[#c49840]">
              exceptional catering matches.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-[#a5b3a0] md:text-xl">
            Speisely is a natural-language platform for premium hospitality discovery.
            We interpret event requirements in semantic detail and match them with
            curated catering partners based on style, scale, cuisine, service format,
            and guest expectations.
          </p>

          <form className="mx-auto mt-12 max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex h-16 flex-1 items-center rounded-[1.4rem] bg-black/10 px-5">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Private wedding in Berlin for 90 guests, elegant plated service, vegetarian-friendly, modern European menu..."
                  className="w-full bg-transparent text-[15px] text-white placeholder:text-white/30 focus:outline-none"
                />
              </div>

              <Link
                href="/request/new"
                className="flex h-16 items-center justify-center gap-2 rounded-[1.3rem] bg-[#c49840] px-7 font-semibold text-black transition hover:scale-[1.02]"
              >
                Start with Speisely AI
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </form>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-sm text-[#d7cfbf]">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
              Natural-language input
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
              Verified hospitality partners
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
              Semantic event matching
            </span>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10 md:px-8 md:py-14">
        <div className="grid gap-5 lg:grid-cols-3">
          {intelligenceSignals.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c49840]/20 bg-[#c49840]/10">
                  <Icon className="h-4.5 w-4.5 text-[#c49840]" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-7 text-[#92a18f]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
              Platform intelligence
            </div>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-white md:text-5xl">
              Designed to resolve the semantic gap in premium hospitality discovery.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#9dac98]">
              Traditional marketplaces rely on filters and fragmented browsing.
              Speisely is built to understand what clients actually mean when they
              describe an event, then map that intent to the right hospitality supply
              with more precision and confidence.
            </p>
          </div>

          <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
            <div className="grid gap-4 md:grid-cols-3">
              {processSteps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-[1.6rem] border border-white/10 bg-black/10 p-5"
                >
                  <div className="text-sm font-medium tracking-[0.2em] text-[#c49840]">
                    {step.number}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#8fa08d]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-6 md:px-8">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
              Selected partners
            </div>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
              Featured hospitality partners
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#8ea18b]">
              Explore a refined set of catering partners or begin with a
              natural-language request to receive a more qualified match.
            </p>
          </div>

          <Link
            href="/request/new"
            className="rounded-[1rem] bg-[#c49840] px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
          >
            Describe your event
          </Link>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="rounded-[1rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
          >
            <option value="" className="bg-[#0d1711]">
              All event types
            </option>
            <option value="Wedding" className="bg-[#0d1711]">
              Wedding
            </option>
            <option value="Corporate" className="bg-[#0d1711]">
              Corporate
            </option>
          </select>

          <select
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="rounded-[1rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
          >
            <option value="" className="bg-[#0d1711]">
              All cuisines
            </option>
            <option value="BBQ" className="bg-[#0d1711]">
              BBQ
            </option>
            <option value="Fine Dining" className="bg-[#0d1711]">
              Fine Dining
            </option>
          </select>

          <div className="flex flex-wrap gap-2">
            {quickFilters.map((f) => (
              <button
                key={f}
                onClick={() => applyQuickFilter(f)}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-[#e7e0d3] transition hover:border-[#c49840]/40 hover:bg-[#c49840] hover:text-black"
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCaterers.map((caterer) => (
            <div
              key={caterer.id}
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.06]"
            >
              <div className="relative border-b border-white/10 px-6 pb-5 pt-6">
                <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(196,152,64,0.12),transparent_70%)]" />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
                      {caterer.city}
                    </div>
                    <h3 className="mt-2 text-2xl font-semibold text-white">{caterer.name}</h3>
                    <p className="mt-2 text-sm text-[#9baa98]">{caterer.cuisine}</p>
                  </div>

                  {caterer.verified && (
                    <span className="rounded-full border border-[#c49840]/20 bg-[#c49840]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c49840]">
                      Verified
                    </span>
                  )}
                </div>
              </div>

              <div className="px-6 py-6">
                <p className="text-sm leading-7 text-[#9faf9b]">{caterer.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {caterer.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-[#ddd5c6]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-7 border-t border-white/10 pt-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-sm text-[#ddd5c6]">
                        <Star className="h-4 w-4 fill-[#c49840] text-[#c49840]" />
                        {caterer.rating}
                      </div>
                      <div className="mt-3 text-sm text-[#8ea18b]">{caterer.guestRange}</div>
                      <div className="mt-1 text-lg font-semibold text-white">
                        {caterer.startingPrice}
                      </div>
                    </div>

                    <Link
                      href={`/caterers/${caterer.id}`}
                      className="rounded-[0.9rem] bg-[#c49840] px-4 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.03]"
                    >
                      View profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 rounded-[2.3rem] border border-white/10 bg-white/[0.04] px-8 py-10 text-center backdrop-blur-xl md:px-12 md:py-14">
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
            Premium event planning
          </div>
          <h3 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
            Plan with precision. Book with confidence.
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#94a391]">
            Describe your event once. Let Speisely translate it into a more refined,
            qualified, and premium catering discovery experience.
          </p>
          <div className="mt-8">
            <Link
              href="/request/new"
              className="inline-flex items-center gap-2 rounded-[1rem] bg-[#c49840] px-6 py-3.5 font-semibold text-black transition hover:scale-[1.02]"
            >
              Start your request
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 py-10 text-center">
        <p className="text-sm text-[#7f9380]">
          © 2026 Speisely. Natural-language hospitality intelligence.
        </p>
      </footer>
    </main>
  );
}
