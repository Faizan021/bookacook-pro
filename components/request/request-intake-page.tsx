"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRequestDraftAction } from "@/app/request/new/actions";

type Props = {
  initialQuery?: string;
  initialOccasion?: string;
  initialCaterer?: string;
};

export function RequestIntakePage({
  initialQuery = "",
  initialOccasion = "",
  initialCaterer = "",
}: Props) {
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
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.22em] text-primary">
              Event intake
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">
              Start your event request
            </h1>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              Describe your event and continue into the Speisely request flow.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Describe your event
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={6}
                placeholder="Wedding for 80 guests in Berlin, mostly vegetarian, elegant, around €35 per person"
                className="w-full rounded-2xl border border-border bg-background px-4 py-4 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Occasion
                </label>
                <input
                  type="text"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  placeholder="wedding / corporate / private_party / ramadan"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Preferred caterer ID
                </label>
                <input
                  type="text"
                  value={caterer}
                  onChange={(e) => setCaterer(e.target.value)}
                  placeholder="Optional"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleContinue}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Starting..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
