"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Stars,
} from "lucide-react";

type Props = {
  initialQuery?: string;
  initialOccasion?: string;
  initialCaterer?: string;
};

type ParsedIntent = {
  occasion: string;
  city: string;
  dietary: string;
  style: string;
  budget: string;
  guests: string;
};

type PreviewMatch = {
  id: string;
  name: string;
  city: string;
  meta: string;
  price: string;
  rating: string;
  verified?: boolean;
};

const OCCASION_OPTIONS = [
  { value: "wedding", label: "Wedding" },
  { value: "corporate", label: "Corporate Event" },
  { value: "private_party", label: "Private Party" },
  { value: "christmas", label: "Christmas Dinner" },
  { value: "ramadan", label: "Ramadan / Iftar" },
];

function getOccasionLabel(value: string) {
  const found = OCCASION_OPTIONS.find((item) => item.value === value);
  return found?.label ?? "Event";
}

function normalizeOccasionValue(value: string) {
  if (!value) return "";

  const lower = value.toLowerCase();

  if (lower === "wedding") return "wedding";
  if (lower === "corporate" || lower === "corporate event") return "corporate";
  if (lower === "private_party" || lower === "private party") return "private_party";
  if (lower === "christmas" || lower === "christmas dinner") return "christmas";
  if (lower === "ramadan" || lower === "ramadan / iftar") return "ramadan";

  return value;
}

function parseBudget(input: string) {
  const euroRangeMatch = input.match(/€\s?\d+\s?-\s?€?\s?\d+|\d+\s?-\s?\d+\s?€/i);
  if (euroRangeMatch) return euroRangeMatch[0];

  const euroMatch = input.match(/€\s?\d+|\d+\s?€/i);
  if (euroMatch) return euroMatch[0];

  const perPersonMatch = input.match(/\d+\s?(€|eur|euros?)\s?(per person|pp|p\.p\.)/i);
  if (perPersonMatch) return perPersonMatch[0];

  if (input.toLowerCase().includes("budget")) return "Budget mentioned";
  return "Flexible budget";
}

function parseGuests(input: string) {
  const guestMatch =
    input.match(/(\d+)\s*(guests|guest|people|persons)/i) ||
    input.match(/(\d+)\s*(gäste)/i) ||
    input.match(/for\s+(\d+)/i);

  return guestMatch ? `${guestMatch[1]} guests` : "Guest count to be confirmed";
}

function parseIntent(input: string, selectedOccasion: string): ParsedIntent {
  const text = input.toLowerCase();

  const detectedOccasion =
    selectedOccasion ||
    (text.includes("christmas") || text.includes("xmas") || text.includes("weihnachten")
      ? "christmas"
      : text.includes("ramadan") || text.includes("iftar")
        ? "ramadan"
        : text.includes("wedding") || text.includes("hochzeit")
          ? "wedding"
          : text.includes("corporate") ||
              text.includes("office") ||
              text.includes("business") ||
              text.includes("firma") ||
              text.includes("company")
            ? "corporate"
            : text.includes("birthday") ||
                text.includes("private") ||
                text.includes("dinner") ||
                text.includes("party")
              ? "private_party"
              : "");

  const city = text.includes("berlin")
    ? "Berlin"
    : text.includes("hamburg")
      ? "Hamburg"
      : text.includes("munich") || text.includes("münchen")
        ? "Munich"
        : text.includes("frankfurt")
          ? "Frankfurt"
          : text.includes("cologne") || text.includes("köln")
            ? "Cologne"
            : text.includes("dortmund")
              ? "Dortmund"
              : text.includes("düsseldorf") || text.includes("duesseldorf")
                ? "Düsseldorf"
                : "To be confirmed";

  const dietary = text.includes("vegan")
    ? "Vegan"
    : text.includes("vegetarian") || text.includes("vegetar")
      ? "Vegetarian"
      : text.includes("halal")
        ? "Halal"
        : text.includes("gluten")
          ? "Gluten-free"
          : text.includes("kosher")
            ? "Kosher"
            : "No specific preference yet";

  const style = text.includes("elegant")
    ? "Elegant"
    : text.includes("fine dining")
      ? "Fine Dining"
      : text.includes("buffet")
        ? "Buffet"
        : text.includes("sharing")
          ? "Sharing Style"
          : text.includes("casual")
            ? "Casual"
            : text.includes("luxury") || text.includes("premium")
              ? "Premium Hospitality"
              : "Refined hospitality";

  return {
    occasion: getOccasionLabel(detectedOccasion),
    city,
    dietary,
    style,
    budget: parseBudget(input),
    guests: parseGuests(input),
  };
}

function getPreviewMatches(intent: ParsedIntent): PreviewMatch[] {
  const city = intent.city === "To be confirmed" ? "Germany" : intent.city;

  if (intent.occasion === "Corporate Event") {
    return [
      {
        id: "executive-table",
        name: "Executive Table Catering",
        city,
        meta: "Corporate dining · Board lunches · Premium service",
        price: "from €28 p.p.",
        rating: "4.9",
        verified: true,
      },
      {
        id: "city-business",
        name: "City Business Events",
        city,
        meta: "Meetings · Conferences · Business hospitality",
        price: "from €24 p.p.",
        rating: "4.8",
        verified: true,
      },
      {
        id: "atelier-office",
        name: "Atelier Office Catering",
        city,
        meta: "Buffets · Finger food · Team events",
        price: "from €22 p.p.",
        rating: "4.7",
      },
    ];
  }

  if (intent.occasion === "Ramadan / Iftar") {
    return [
      {
        id: "noor-events",
        name: "Noor Event Catering",
        city,
        meta: "Iftar menus · Halal · Community dining",
        price: "from €19 p.p.",
        rating: "4.9",
        verified: true,
      },
      {
        id: "saffron-table",
        name: "Saffron Table Events",
        city,
        meta: "Sharing menus · Family style · Middle Eastern",
        price: "from €23 p.p.",
        rating: "4.8",
        verified: true,
      },
      {
        id: "levant-feast",
        name: "Levant Feast Studio",
        city,
        meta: "Warm mezze · Celebrations · Premium presentation",
        price: "from €26 p.p.",
        rating: "4.7",
      },
    ];
  }

  if (intent.occasion === "Christmas Dinner") {
    return [
      {
        id: "winter-table",
        name: "Winter Table Catering",
        city,
        meta: "Seasonal menus · Festive dinners · Elegant service",
        price: "from €34 p.p.",
        rating: "4.9",
        verified: true,
      },
      {
        id: "holiday-feast",
        name: "Holiday Feast Events",
        city,
        meta: "Company celebrations · Premium buffets",
        price: "from €29 p.p.",
        rating: "4.8",
      },
      {
        id: "ember-seasonal",
        name: "Ember Seasonal Dining",
        city,
        meta: "Winter hospitality · Fine dining",
        price: "from €39 p.p.",
        rating: "4.8",
        verified: true,
      },
    ];
  }

  if (intent.occasion === "Private Party") {
    return [
      {
        id: "private-table",
        name: "Private Table Events",
        city,
        meta: "Celebrations · Family style · Flexible menus",
        price: "from €21 p.p.",
        rating: "4.8",
        verified: true,
      },
      {
        id: "villa-catering",
        name: "Villa Catering",
        city,
        meta: "Premium private events · Multi-cuisine",
        price: "from €31 p.p.",
        rating: "4.9",
      },
      {
        id: "studio-supper",
        name: "Studio Supper Co.",
        city,
        meta: "Dinner parties · Curated hospitality",
        price: "from €27 p.p.",
        rating: "4.7",
      },
    ];
  }

  return [
    {
      id: "berliner-genuss",
      name: "Berliner Genussküche",
      city,
      meta: "Weddings · Fine dining · Vegetarian-friendly",
      price: "from €35 p.p.",
      rating: "4.9",
      verified: true,
    },
    {
      id: "gruene-tafel",
      name: "Grüne Tafel Events",
      city,
      meta: "Organic weddings · Elegant service · Seasonal menus",
      price: "from €32 p.p.",
      rating: "4.8",
      verified: true,
    },
    {
      id: "atelier-royal",
      name: "Atelier Royal Dining",
      city,
      meta: "Wedding dinners · Premium hospitality",
      price: "from €39 p.p.",
      rating: "5.0",
      verified: true,
    },
  ];
}

export function RequestIntakePage({
  initialQuery = "",
  initialOccasion = "",
}: Props) {
  const normalizedOccasion = normalizeOccasionValue(initialOccasion);
  const safeQuery =
    initialQuery.trim() ||
    "Wedding for 80 guests in Berlin, mostly vegetarian, elegant atmosphere, around €35 per person";

  const understood = useMemo(
    () => parseIntent(safeQuery, normalizedOccasion),
    [safeQuery, normalizedOccasion]
  );

  const previewMatches = useMemo(() => getPreviewMatches(understood), [understood]);

  const caterersHref = `/caterers?q=${encodeURIComponent(
    safeQuery
  )}&city=${encodeURIComponent(understood.city === "To be confirmed" ? "" : understood.city)}`;

  const signupHref = `/signup/customer?next=${encodeURIComponent(
    `/request/new?q=${encodeURIComponent(safeQuery)}`
  )}`;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#07110c] text-[#f6f1e8]">
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(circle at top center, rgba(196,152,64,0.15) 0%, transparent 28%), radial-gradient(circle at 15% 85%, rgba(72,101,82,0.18) 0%, transparent 24%), radial-gradient(circle at 85% 30%, rgba(40,60,48,0.16) 0%, transparent 18%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_22%,transparent_72%,rgba(255,255,255,0.02))]" />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-10 md:px-8 md:pb-24 md:pt-14">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-[#d8d1c2] transition hover:border-[#c49840]/30 hover:text-[#c49840]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to homepage
          </Link>
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/20 bg-[#c49840]/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
            <Sparkles className="h-3.5 w-3.5" />
            Speisely preview
          </div>

          <h1 className="mt-8 text-4xl font-medium leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            Speisely understood your event.
            <span className="mt-2 block italic text-[#c49840]">
              Here is your first shortlist.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#a4b29f]">
            We translated your natural-language request into a clearer catering brief
            and prepared a preview of suitable partners.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl md:p-7">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
              <Stars className="h-3.5 w-3.5" />
              Parsed event brief
            </div>

            <div className="mt-5 rounded-[1.35rem] border border-white/10 bg-black/10 p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
                Your request
              </div>
              <p className="mt-3 text-sm leading-7 text-white/90">“{safeQuery}”</p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.3rem] border border-white/10 bg-black/10 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
                  Occasion
                </div>
                <div className="mt-2 text-base font-semibold text-white">
                  {understood.occasion}
                </div>
              </div>

              <div className="rounded-[1.3rem] border border-white/10 bg-black/10 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
                  City
                </div>
                <div className="mt-2 text-base font-semibold text-white">
                  {understood.city}
                </div>
              </div>

              <div className="rounded-[1.3rem] border border-white/10 bg-black/10 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
                  Guests
                </div>
                <div className="mt-2 text-base font-semibold text-white">
                  {understood.guests}
                </div>
              </div>

              <div className="rounded-[1.3rem] border border-white/10 bg-black/10 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
                  Budget
                </div>
                <div className="mt-2 text-base font-semibold text-white">
                  {understood.budget}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.3rem] border border-white/10 bg-black/10 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
                  Dietary preference
                </div>
                <div className="mt-2 text-base font-semibold text-white">
                  {understood.dietary}
                </div>
              </div>

              <div className="rounded-[1.3rem] border border-white/10 bg-black/10 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
                  Event style
                </div>
                <div className="mt-2 text-base font-semibold text-white">
                  {understood.style}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[1.4rem] border border-[#c49840]/15 bg-[#c49840]/8 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 text-[#c49840]" />
                <p className="text-sm leading-7 text-[#e7dcc7]">
                  This is a preview shortlist. To save the request, contact caterers,
                  and continue in your dashboard, the customer should create an account
                  or sign in.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href={signupHref}
                className="inline-flex items-center justify-center gap-2 rounded-[1rem] bg-[#c49840] px-6 py-3.5 text-sm font-semibold text-black transition hover:scale-[1.02]"
              >
                Create account to continue
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-[1rem] border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white transition hover:border-[#c49840]/40 hover:text-[#c49840]"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl md:p-7">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Suggested catering partners
              </div>

              <Link
                href={caterersHref}
                className="text-xs font-semibold uppercase tracking-[0.14em] text-[#c49840] transition hover:text-[#eadfca]"
              >
                View all
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {previewMatches.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[1.35rem] border border-white/10 bg-black/10 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                        {item.verified ? (
                          <span className="rounded-full border border-[#c49840]/20 bg-[#c49840]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#c49840]">
                            Verified
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-xs text-[#8ea18b]">
                        <MapPin className="h-3.5 w-3.5" />
                        {item.city}
                      </div>

                      <p className="mt-3 text-sm leading-7 text-[#9faf9b]">{item.meta}</p>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1.5 text-sm text-[#ddd5c6]">
                        <Star className="h-4 w-4 fill-[#c49840] text-[#c49840]" />
                        {item.rating}
                      </div>
                      <div className="mt-3 text-sm font-semibold text-white">
                        {item.price}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="rounded-[1.35rem] border border-dashed border-[#c49840]/25 bg-[#c49840]/[0.04] p-4">
                <p className="text-sm font-medium text-[#e6d8bd]">
                  More suitable partners can appear after login and request saving.
                </p>
                <p className="mt-2 text-xs leading-6 text-[#9aaa96]">
                  Once the request is saved to a customer account, Speisely can continue
                  the structured matching flow and bring it into the dashboard.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href={caterersHref}
                className="inline-flex items-center justify-center rounded-[1rem] border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white transition hover:border-[#c49840]/40 hover:text-[#c49840]"
              >
                Browse caterers
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-[1rem] border border-white/10 bg-black/10 px-6 py-3.5 text-sm font-medium text-[#eadfca] transition hover:border-white/15 hover:bg-white/[0.03]"
              >
                Edit request on homepage
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-[11px] uppercase tracking-[0.22em] text-[#7f9380]">
          Speisely — premium catering intelligence
        </p>
      </section>
    </main>
  );
}
