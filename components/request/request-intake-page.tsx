"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createRequestDraftAction } from "@/app/request/new/actions";

type Props = {
  initialQuery?: string;
  initialOccasion?: string;
  initialCaterer?: string;
};

const OCCASIONS = [
  "Wedding",
  "Corporate Event",
  "Private Party",
  "Birthday",
  "Reception",
  "Dinner",
];

export function RequestIntakePage({
  initialQuery = "",
  initialOccasion = "",
  initialCaterer = "",
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(initialQuery);
  const [occasion, setOccasion] = useState(initialOccasion);
  const [caterer, setCaterer] = useState(initialCaterer);
  const [error, setError] = useState("");

  function handleContinue() {
    setError("");

    startTransition(async () => {
      try {
        const draft = await createRequestDraftAction({
          ai_query: query,
          event_type: occasion || null,
          preferred_caterer_id: caterer || null,
        });

        if (!draft?.id) {
          setError("Could not create your event request. Please try again.");
          return;
        }

        router.push(`/request/${draft.id}`);
      } catch {
        setError("Could not create your event request. Please try again.");
      }
    });
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="page-container section-shell-lg">
        <div className="mx-auto max-w-5xl">
          <div className="premium-card overflow-hidden">
            <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
              <div className="p-8 lg:p-10">
                <div className="eyebrow text-primary">AI-assisted planning</div>

                <h1 className="section-title mt-3 text-3xl font-semibold sm:text-4xl">
                  Start your catering request
                </h1>

                <p className="body-muted mt-4 max-w-2xl text-base">
                  Describe your event in your own words or start with a few
                  details. Speisely turns your request into a structured brief
                  that you can refine before matching with caterers.
                </p>

                <div className="mt-8 space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Describe your event
                    </label>
                    <textarea
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      rows={5}
                      placeholder="Wedding for 80 guests in Berlin, mostly vegetarian, elegant, around €35 per person."
                      className="field"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        Occasion
                      </label>
                      <select
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        className="field"
                      >
                        <option value="">Select an event type</option>
                        {OCCASIONS.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        Preferred caterer
                      </label>
                      <input
                        type="text"
                        value={caterer}
                        onChange={(e) => setCaterer(e.target.value)}
                        placeholder="Optional"
                        className="field"
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
                      disabled={isPending}
                      className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                    >
                      {isPending ? "Creating request..." : "Continue"}
                    </button>

                    <Link href="/caterers" className="btn-soft text-sm">
                      Browse caterers instead
                    </Link>
                  </div>
                </div>
              </div>

              <div className="section-dark px-8 py-10">
                <div className="eyebrow text-accent-gold">
                  What happens next
                </div>

                <div className="mt-6 space-y-5">
                  <div className="dark-card p-4">
                    <div className="text-sm font-semibold text-surface-dark-foreground">
                      1. We structure your brief
                    </div>
                    <p className="mt-2 text-sm leading-7 text-surface-dark-muted">
                      Your request becomes an editable event brief with key
                      details like style, guest count, city, and budget.
                    </p>
                  </div>

                  <div className="dark-card p-4">
                    <div className="text-sm font-semibold text-surface-dark-foreground">
                      2. You refine important details
                    </div>
                    <p className="mt-2 text-sm leading-7 text-surface-dark-muted">
                      Add dietary needs, extra services, schedule details, and
                      preferences before submitting.
                    </p>
                  </div>

                  <div className="dark-card p-4">
                    <div className="text-sm font-semibold text-surface-dark-foreground">
                      3. Match with suitable caterers
                    </div>
                    <p className="mt-2 text-sm leading-7 text-surface-dark-muted">
                      Speisely helps you continue toward discovery, inquiry, and
                      booking with better-fit caterers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
