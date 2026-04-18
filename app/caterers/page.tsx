"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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
    description:
      "Authentic live grill catering for private parties, summer celebrations, and relaxed premium outdoor events.",
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
    description:
      "Elegant full-service catering for weddings, formal receptions, and refined private celebrations.",
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
    description:
      "Modern business catering with fresh seasonal menus for office lunches, team events, and brand activations.",
    tags: ["Corporate", "Healthy Menus", "Business Events"],
    startingPrice: "from €24 p.p.",
    guestRange: "20–140 guests",
  },
  {
    id: "atelier-table-berlin",
    name: "Atelier Table Berlin",
    city: "Berlin",
    cuisine: "Modern European",
    description:
      "Curated premium menus for intimate dinners, private celebrations, and design-led event concepts.",
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
    description:
      "Plant-forward catering concepts with elegant presentation for conscious weddings and premium corporate events.",
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
    description:
      "Warm, abundant sharing menus and stylish event catering for family gatherings, receptions, and cultural celebrations.",
    tags: ["Sharing Menus", "Middle Eastern", "Celebrations"],
    startingPrice: "from €34 p.p.",
    guestRange: "30–200 guests",
  },
];

const quickFilters = [
  "Berlin",
  "Corporate",
  "Wedding",
  "Vegetarian",
  "Fine Dining",
  "Private Party",
];

export default function CaterersPage() {
  const [city, setCity] = useState("");
  const [eventType, setEventType] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [dietary, setDietary] = useState("");

  function applyQuickFilter(value: string) {
    const lower = value.toLowerCase();

    if (["berlin", "hamburg", "munich", "cologne", "frankfurt"].includes(lower)) {
      setCity(value);
      return;
    }

    if (["corporate", "wedding", "private party"].includes(lower)) {
      setEventType(value);
      return;
    }

    if (["vegetarian", "fine dining", "bbq"].includes(lower)) {
      setCuisine(value);
      return;
    }
  }

  function clearFilters() {
    setCity("");
    setEventType("");
    setCuisine("");
    setDietary("");
  }

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

      const cityMatch = !city.trim() || caterer.city.toLowerCase().includes(city.trim().toLowerCase());

      const eventMatch =
        !eventType ||
        haystack.includes(eventType.toLowerCase()) ||
        caterer.tags.some((tag) => tag.toLowerCase().includes(eventType.toLowerCase()));

      const cuisineMatch =
        !cuisine ||
        caterer.cuisine.toLowerCase().includes(cuisine.toLowerCase()) ||
        caterer.tags.some((tag) => tag.toLowerCase().includes(cuisine.toLowerCase()));

      const dietaryMatch =
        !dietary ||
        haystack.includes(dietary.toLowerCase()) ||
        caterer.tags.some((tag) => tag.toLowerCase().includes(dietary.toLowerCase()));

      return cityMatch && eventMatch && cuisineMatch && dietaryMatch;
    });
  }, [city, eventType, cuisine, dietary]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="page-container section-shell-lg">
        <div className="premium-card overflow-hidden p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="eyebrow text-primary">Marketplace</div>
              <h1 className="section-title mt-3 text-3xl font-semibold sm:text-4xl">
                Browse premium caterers for weddings, corporate events, and private gatherings
              </h1>
              <p className="body-muted mt-4 max-w-2xl text-base">
                Discover curated caterers across Germany, compare styles and specialties, and continue
                into inquiry or booking. Prefer guidance? Start with an AI-assisted event brief.
              </p>
            </div>

            <Link
              href="/request/new"
              className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Describe your event
            </Link>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="field text-sm text-foreground placeholder:text-muted-foreground"
            />

            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="field text-sm text-foreground"
            >
              <option value="">Event type</option>
              <option value="Wedding">Wedding</option>
              <option value="Corporate">Corporate</option>
              <option value="Private Party">Private Party</option>
            </select>

            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="field text-sm text-foreground"
            >
              <option value="">Cuisine</option>
              <option value="BBQ">BBQ</option>
              <option value="Fine Dining">Fine Dining</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Middle Eastern">Middle Eastern</option>
              <option value="Modern European">Modern European</option>
            </select>

            <select
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              className="field text-sm text-foreground"
            >
              <option value="">Dietary preferences</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Healthy">Healthy</option>
              <option value="Sustainable">Sustainable</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {quickFilters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => applyQuickFilter(item)}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-secondary"
              >
                {item}
              </button>
            ))}

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-full border border-border bg-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-secondary"
            >
              Clear filters
            </button>
          </div>
        </div>
      </section>

      <section className="page-container section-shell">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="eyebrow text-primary">Curated Selection</div>
            <h2 className="section-title mt-3 text-2xl font-semibold sm:text-3xl">
              Caterers to explore
            </h2>
          </div>

          <div className="text-sm text-muted-foreground">
            {filteredCaterers.length} caterers
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCaterers.map((caterer) => (
            <article
              key={caterer.id}
              className="premium-card premium-card-hover p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    {caterer.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {caterer.city} · {caterer.cuisine}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {caterer.featured ? (
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      Featured
                    </span>
                  ) : null}

                  {caterer.verified ? (
                    <span className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                      Verified
                    </span>
                  ) : null}
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {caterer.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {caterer.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl bg-secondary/55 p-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Starting price
                  </div>
                  <div className="mt-1 text-sm font-semibold">
                    {caterer.startingPrice}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Event size
                  </div>
                  <div className="mt-1 text-sm font-semibold">
                    {caterer.guestRange}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/caterers/${caterer.id}`}
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  View profile
                </Link>

                <Link
                  href={`/request/new?caterer=${caterer.id}`}
                  className="btn-soft text-sm"
                >
                  Plan with this caterer
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filteredCaterers.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-border bg-card p-8 text-center">
            <h3 className="text-lg font-semibold">No caterers found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try changing or clearing your filters.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Reset filters
            </button>
          </div>
        ) : null}
      </section>

      <section className="page-container section-shell">
        <div className="dark-card overflow-hidden px-8 py-10">
          <div className="max-w-2xl">
            <div className="eyebrow text-accent-gold">Need a faster match?</div>
            <h2 className="section-title mt-3 text-3xl font-semibold text-surface-dark-foreground">
              Describe your event and let Speisely guide the brief
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-surface-dark-muted">
              Tell us your city, guest count, style, budget, and dietary needs. Speisely turns that
              into a structured request and helps you discover suitable caterers faster.
            </p>

            <div className="mt-6">
              <Link
                href="/request/new"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary"
              >
                Start guided request
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
