"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createRequestDraftAction } from "@/app/request/new/actions";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
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

function parseIntent(input: string, selectedOccasion: string): ParsedIntent {
  const text = input.toLowerCase();

  const detectedOccasion =
    selectedOccasion ||
    (text.includes("christmas") ||
    text.includes("xmas") ||
    text.includes("weihnachten")
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
  };
}

export function RequestIntakePage({
  initialQuery = "",
  initialOccasion = "",
  initialCaterer = "",
}: Props) {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [occasion, setOccasion] = useState(initialOccasion);
  const [caterer] = useState(initialCaterer);
  const [loading, setLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (query.trim().length < 12) {
      setIsThinking(false);
      return;
    }

    setIsThinking(true);
    const timeout = setTimeout(() => {
      setIsThinking(false);
    }, 700);

    return () => clearTimeout(timeout);
  }, [query]);

  const understood = useMemo(() => parseIntent(query, occasion), [query, occasion]);

  async function handleContinue() {
    if (!query.trim()) {
      setError("Please describe your event so Speisely can prepare your briefing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const draft = await createRequestDraftAction({
        ai_query: query.trim(),
        event_type: occasion || null,
        preferred_caterer_id: caterer || null,
      });

      router.push(`/request/${draft.id}`);
    } catch (err) {
      console.error(err);
      setError("Speisely could not start your briefing right now. Please try again.");
      setLoading(false);
    }
  }

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
            AI-guided event intake
          </div>

          <h1 className="mt-8 text-4xl font-medium leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            Describe your event.
            <span className="mt-2 block italic text-[#c49840]">
              Speisely prepares the briefing.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#a4b29f]">
            Tell us what you are planning in natural language. Speisely translates your
            event intent into a clearer, more structured request for the right catering
            partners.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl md:p-7">
            <div className="flex flex-wrap gap-2">
              {OCCASION_OPTIONS.map((item) => {
                const active = occasion === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setOccasion(item.value)}
                    className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                      active
                        ? "border-[#c49840]/25 bg-[#c49840]/12 text-[#c49840]"
                        : "border-white/10 bg-white/[0.03] text-[#ddd5c6] hover:border-[#c49840]/25 hover:text-[#c49840]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-[1.6rem] border border-white/10 bg-black/10 p-4 md:p-5">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={7}
                placeholder="Wedding for 80 guests in Berlin, mostly vegetarian, elegant atmosphere, around €35 per person..."
                className="w-full resize-none bg-transparent text-lg leading-8 text-white placeholder:text-white/30 focus:outline-none"
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-[#d9d1c3]">
                  Natural-language input
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-[#d9d1c3]">
                  Curated hospitality brief
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-[#d9d1c3]">
                  Premium partner matching
                </span>
              </div>

              <button
                onClick={handleContinue}
                disabled={loading || !query.trim()}
                className={`inline-flex items-center gap-2 rounded-[1rem] px-6 py-3.5 text-sm font-semibold transition ${
                  loading || !query.trim()
                    ? "cursor-not-allowed bg-white/5 text-white/30"
                    : "bg-[#c49840] text-black hover:scale-[1.02]"
                }`}
              >
                {loading ? "Starting briefing..." : "Continue to briefing"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}
          </div>

          <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl md:p-7">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
                <Stars className="h-3.5 w-3.5" />
                Speisely understands
              </div>
              {isThinking && (
                <span className="text-xs font-medium text-[#c49840]">
                  Interpreting request...
                </span>
              )}
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-[1.3rem] border border-white/10 bg-black/10 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
                  Occasion
                </div>
                <div className="mt-2 text-lg font-semibold text-white">
                  {understood.occasion}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.3rem] border border-white/10 bg-black/10 p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
                    City
                  </div>
                  <div className="mt-2 text-base font-medium text-white">
                    {understood.city}
                  </div>
                </div>

                <div className="rounded-[1.3rem] border border-white/10 bg-black/10 p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
                    Budget
                  </div>
                  <div className="mt-2 text-base font-medium text-white">
                    {understood.budget}
                  </div>
                </div>
              </div>

              <div className="rounded-[1.3rem] border border-white/10 bg-black/10 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
                  Dietary preference
                </div>
                <div className="mt-2 text-base font-medium text-white">
                  {understood.dietary}
                </div>
              </div>

              <div className="rounded-[1.3rem] border border-white/10 bg-black/10 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
                  Event style
                </div>
                <div className="mt-2 text-base font-medium text-white">
                  {understood.style}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[1.4rem] border border-[#c49840]/15 bg-[#c49840]/8 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 text-[#c49840]" />
                <p className="text-sm leading-7 text-[#e7dcc7]">
                  Speisely uses your natural-language request as the starting point for a
                  more structured catering brief and a better shortlist of suitable
                  partners.
                </p>
              </div>
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
