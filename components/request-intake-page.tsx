"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n/context";
import { createRequestDraftAction } from "@/app/request/new/actions";

type Props = {
  initialQuery?: string;
  initialOccasion?: string;
  initialCaterer?: string;
};

const OCCASIONS = [
  { value: "wedding", label: "Wedding" },
  { value: "corporate", label: "Corporate Event" },
  { value: "private_party", label: "Private Party" },
  { value: "ramadan", label: "Ramadan / Iftar" },
];

export function RequestIntakePage({
  initialQuery = "",
  initialOccasion = "",
  initialCaterer = "",
}: Props) {
  const t = useT();
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [occasion, setOccasion] = useState(initialOccasion);
  const [caterer, setCaterer] = useState(initialCaterer);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleContinue() {
    setLoading(true);
    setError("");

    try {
      const draft = await createRequestDraftAction({
        ai_query: query,
        event_type: occasion || null,
        preferred_caterer_id: caterer || null,
      });

      router.push(`/request/${draft.id}`);
    } catch (err) {
      console.error(err);
      setError("Could not start your request. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-12 lg:py-16">
        <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm lg:p-10">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.24em] text-primary">
              Event intake
            </div>

            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Plan your event with a clearer starting point
            </h1>

            <p className="mt-5 text-base leading-8 text-muted-foreground">
              Tell Speisely what you are planning. We will turn it into a structured
              event request so you can continue to the matching and booking flow.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Describe your event
                </label>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  rows={6}
                  placeholder={t("home.editorialSearchPlaceholder")}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Occasion
                  </label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  >
                    <option value="">Select an occasion</option>
                    {OCCASIONS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Preferred caterer ID
                  </label>
                  <input
                    type="text"
                    value={caterer}
                    onChange={(e) => setCaterer(e.target.value)}
                    placeholder="Optional"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>

              {error ? (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Starting..." : "Continue to event brief"}
                </button>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-border bg-secondary/40 p-6">
              <div className="text-xs uppercase tracking-[0.22em] text-primary">
                What happens next
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-background p-4">
                  <div className="text-sm font-semibold">1. Draft request created</div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Speisely creates a draft event request for your account.
                  </p>
                </div>

                <div className="rounded-2xl bg-background p-4">
                  <div className="text-sm font-semibold">2. Complete event details</div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Add guest count, location, budget, catering type, and preferences.
                  </p>
                </div>

                <div className="rounded-2xl bg-background p-4">
                  <div className="text-sm font-semibold">3. Discover relevant caterers</div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Continue into the request flow and generate suitable matches.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
