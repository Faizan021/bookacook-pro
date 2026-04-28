"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Search,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { SpeiselyHeader } from "@/components/layout/SpeiselyHeader";
import { DynamicUnsplashImage } from "@/components/home/DynamicUnsplashImage";
import { useT } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";
import { createRequestDraftAction } from "./actions";

type GermanLocation = {
  id: string;
  name: string;
  postal_code: string | null;
  state: string | null;
  lat: string | number | null;
  lng: string | number | null;
  type: string | null;
};

const PENDING_REQUEST_KEY = "speisely_pending_request";

const occasionPrompts = [
  {
    id: "wedding",
    labelKey: "event.wedding",
    fallback: "Wedding",
    query:
      "Wedding for 80 guests in Berlin, vegetarian, elegant buffet, about €45 per person",
  },
  {
    id: "corporate",
    labelKey: "event.businessLunch",
    fallback: "Business lunch",
    query:
      "Business lunch for 45 people in Berlin, modern buffet, vegetarian options, about €30 per person",
  },
  {
    id: "private",
    labelKey: "event.privateDinner",
    fallback: "Private dinner",
    query:
      "Private dinner for 20 guests in Berlin, fine dining, Mediterranean, about €70 per person",
  },
  {
    id: "ramadan",
    labelKey: "event.ramadan",
    fallback: "Ramadan Iftar",
    query:
      "Ramadan Iftar for 60 guests in Berlin, halal buffet, warm dishes and desserts",
  },
  {
    id: "christmas",
    labelKey: "event.christmas",
    fallback: "Christmas party",
    query:
      "Christmas party for 70 guests in Berlin, festive buffet, warm dishes, desserts and drinks",
  },
];

function getPromptByOccasion(occasion: string | null) {
  if (!occasion) return null;
  return occasionPrompts.find((prompt) => prompt.id === occasion)?.query ?? null;
}

export default function NewRequestPage() {
  const t = useT();
  const router = useRouter();

  const bootedRef = useRef(false);
  const autoStartedRef = useRef(false);

  const [query, setQuery] = useState(occasionPrompts[0].query);
  const [locationInput, setLocationInput] = useState("Berlin");
  const [selectedLocation, setSelectedLocation] =
    useState<GermanLocation | null>(null);
  const [locationResults, setLocationResults] = useState<GermanLocation[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function createDraftFromValues(input: {
    cleanQuery: string;
    cleanLocation: string;
    selectedLocation: GermanLocation | null;
  }) {
    const result = await createRequestDraftAction({
      ai_query: input.cleanQuery,
      event_type: null,
      city: input.selectedLocation?.name ?? (input.cleanLocation || null),
      postal_code: input.selectedLocation?.postal_code ?? null,
      lat: input.selectedLocation?.lat ?? null,
      lng: input.selectedLocation?.lng ?? null,
    });

    try {
      localStorage.removeItem(PENDING_REQUEST_KEY);
    } catch {}

    router.push(`/request/${result.id}`);
  }

  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;

    async function bootRequestPage() {
      const params = new URLSearchParams(window.location.search);
      const incomingQuery = params.get("query");
      const incomingOccasion = params.get("occasion");
      const shouldStart = params.get("start") === "1";

      const occasionQuery = getPromptByOccasion(incomingOccasion);
      const urlQuery =
        incomingQuery && incomingQuery.trim().length > 0
          ? incomingQuery.trim()
          : occasionQuery;

      if (urlQuery) {
        setQuery(urlQuery);
      }

      try {
        const raw = localStorage.getItem(PENDING_REQUEST_KEY);

        if (shouldStart && urlQuery) {
          localStorage.removeItem(PENDING_REQUEST_KEY);
        } else if (raw) {
          const pending = JSON.parse(raw) as {
            query?: string;
            locationInput?: string;
            selectedLocation?: GermanLocation | null;
          };

          if (pending.query) setQuery(pending.query);
          if (pending.locationInput) setLocationInput(pending.locationInput);
          if (pending.selectedLocation) {
            setSelectedLocation(pending.selectedLocation);
          }

          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user && pending.query && pending.query.trim().length >= 10) {
            autoStartedRef.current = true;
            setSaving(true);

            await createDraftFromValues({
              cleanQuery: pending.query.trim(),
              cleanLocation: (pending.locationInput || "Berlin").trim(),
              selectedLocation: pending.selectedLocation ?? null,
            });
          }

          return;
        }
      } catch (error) {
        console.error("Failed to restore pending request:", error);
        try {
          localStorage.removeItem(PENDING_REQUEST_KEY);
        } catch {}
      }

      if (!shouldStart || !urlQuery || autoStartedRef.current) return;

      autoStartedRef.current = true;
      setSaving(true);

      try {
        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          localStorage.setItem(
            PENDING_REQUEST_KEY,
            JSON.stringify({
              query: urlQuery,
              locationInput: "Berlin",
              selectedLocation: null,
            })
          );

          router.push("/login?next=/request/new");
          return;
        }

        await createDraftFromValues({
          cleanQuery: urlQuery,
          cleanLocation: "Berlin",
          selectedLocation: null,
        });
      } catch (error) {
        console.error("Failed to auto-start request:", error);
        setSaveError(
          t(
            "request.saveError",
            "The request could not be saved. Please try again."
          )
        );
        setSaving(false);
      }
    }

    bootRequestPage();
  }, [router, t]);

  useEffect(() => {
    const term = locationInput.trim();

    if (term.length < 2) {
      setLocationResults([]);
      return;
    }

    const timeout = window.setTimeout(async () => {
      setLocationLoading(true);

      try {
        const supabase = createClient();
        const isPostalCode = /^\d+$/.test(term);

        let locationQuery = supabase
          .from("german_locations")
          .select("id,name,postal_code,state,lat,lng,type")
          .limit(8);

        locationQuery = isPostalCode
          ? locationQuery.ilike("postal_code", `${term}%`)
          : locationQuery.ilike("name", `%${term}%`);

        const { data, error } = await locationQuery.order("name", {
          ascending: true,
        });

        if (error) {
          console.error("Location search failed:", error.message);
          setLocationResults([]);
          return;
        }

        setLocationResults(data ?? []);
      } catch (error) {
        console.error("Location search failed:", error);
        setLocationResults([]);
      } finally {
        setLocationLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [locationInput]);

  const briefingItems = useMemo(() => {
    const lower = query.toLowerCase();
    const guestMatch = query.match(/(\d+)\s?(guests|people|personen|gäste)?/i);
    const budgetMatch = query.match(/€\s?\d+/);

    const event = lower.includes("business")
      ? t("event.businessLunch", "Business lunch")
      : lower.includes("weihnacht") || lower.includes("christmas")
        ? t("event.christmas", "Christmas party")
        : lower.includes("iftar") || lower.includes("ramadan")
          ? t("event.ramadan", "Ramadan / Iftar")
          : lower.includes("birthday")
            ? t("event.birthday", "Birthday")
            : lower.includes("private")
              ? t("event.privateDinner", "Private dinner")
              : t("event.wedding", "Wedding");

    const diet = lower.includes("vegetar")
      ? t("diet.vegetarian", "Vegetarian")
      : lower.includes("halal")
        ? t("diet.halal", "Halal")
        : t("common.open", "Open");

    const style = lower.includes("fine")
      ? "Fine dining"
      : lower.includes("buffet")
        ? "Buffet"
        : lower.includes("bbq")
          ? "BBQ"
          : t("request.aiStyle", "AI will infer");

    return [
      {
        label: t("request.brief.event", "Event"),
        value: event,
        icon: <Sparkles className="h-4 w-4" />,
      },
      {
        label: t("request.brief.location", "Location"),
        value: selectedLocation
          ? `${selectedLocation.postal_code ?? ""} ${selectedLocation.name}`.trim()
          : locationInput || t("common.open", "Open"),
        icon: <MapPin className="h-4 w-4" />,
      },
      {
        label: t("request.brief.guests", "Guests"),
        value: guestMatch?.[1] || t("common.open", "Open"),
        icon: <Users className="h-4 w-4" />,
      },
      {
        label: t("request.brief.budget", "Budget"),
        value: budgetMatch?.[0] || t("request.flexibleBudget", "Flexible"),
        icon: <Wallet className="h-4 w-4" />,
      },
      {
        label: t("request.brief.diet", "Diet"),
        value: diet,
        icon: <CheckCircle2 className="h-4 w-4" />,
      },
      {
        label: t("request.brief.style", "Style"),
        value: style,
        icon: <Search className="h-4 w-4" />,
      },
    ];
  }, [query, locationInput, selectedLocation, t]);

  function selectLocation(location: GermanLocation) {
    setSelectedLocation(location);
    setLocationInput(
      `${location.postal_code ? `${location.postal_code} ` : ""}${location.name}`
    );
    setLocationResults([]);
  }

  async function handleSaveRequest() {
    setSaveError(null);
    setSaving(true);

    const cleanQuery = query.trim();
    const cleanLocation = locationInput.trim();

    if (!cleanQuery || cleanQuery.length < 10) {
      setSaveError(
        t("request.validation.query", "Please describe your event a bit more.")
      );
      setSaving(false);
      return;
    }

    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        localStorage.setItem(
          PENDING_REQUEST_KEY,
          JSON.stringify({
            query: cleanQuery,
            locationInput: cleanLocation,
            selectedLocation,
          })
        );

        router.push("/login?next=/request/new");
        return;
      }

      await createDraftFromValues({
        cleanQuery,
        cleanLocation,
        selectedLocation,
      });
    } catch (error) {
      console.error(error);

      const message = error instanceof Error ? error.message : "";

      if (message === "Unauthorized") {
        localStorage.setItem(
          PENDING_REQUEST_KEY,
          JSON.stringify({
            query: cleanQuery,
            locationInput: cleanLocation,
            selectedLocation,
          })
        );

        router.push("/login?next=/request/new");
        return;
      }

      setSaveError(
        t(
          "request.saveError",
          "The request could not be saved. Please try again."
        )
      );
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fbf7ef] text-[#16372f]">
      <SpeiselyHeader />

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-12 lg:grid-cols-[1fr_0.92fr] lg:py-18">
        <div className="pt-4 lg:pt-10">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex rounded-full border border-[#e5d8c5] bg-white/80 px-4 py-2 text-sm font-semibold text-[#49645c] shadow-sm backdrop-blur transition hover:bg-white"
            >
              ← {t("request.backHome", "Back to homepage")}
            </Link>

            <span className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white/80 px-4 py-2 text-sm font-semibold text-[#8a6d35] shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              {t("request.label", "AI catering concierge")}
            </span>
          </div>

          <h1 className="premium-heading mt-10 max-w-4xl text-[3.25rem] leading-[0.95] text-[#123b32] md:text-[5.4rem]">
            {t("request.title", "Describe your event once.")}
            <span className="block pt-2 italic font-medium text-[#b28a3c]">
              {t("request.titleAccent", "Speisely builds the brief.")}
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5c6f68]">
            {t(
              "request.description",
              "Use natural language. Speisely detects event type, guests, location, budget, dietary needs and catering style before matching you with caterers."
            )}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {occasionPrompts.map((prompt) => (
              <button
                key={prompt.id}
                type="button"
                onClick={() => {
                  setQuery(prompt.query);
                  setSaveError(null);
                }}
                className="rounded-full border border-[#e5d8c5] bg-white/85 px-4 py-2 text-sm font-semibold text-[#173f35] shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
              >
                {t(prompt.labelKey, prompt.fallback)}
              </button>
            ))}
          </div>

          {saving ? (
            <div className="mt-9 rounded-[2rem] border border-[#eadfce] bg-white/90 p-6 shadow-[0_22px_70px_rgba(35,28,18,0.08)]">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173f35] text-[#d6b25e]">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
                    {t("request.autoStartLabel", "AI concierge")}
                  </p>
                  <h2 className="premium-heading mt-2 text-3xl text-[#173f35]">
                    {t("request.autoStartTitle", "Building your catering brief")}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-[#5c6f68]">
                    {t(
                      "request.autoStartText",
                      "Speisely is turning your event idea into a structured request and preparing the next step."
                    )}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-9 rounded-[2rem] border border-[#eadfce] bg-white/90 p-5 shadow-[0_22px_70px_rgba(35,28,18,0.08)] backdrop-blur">
            <label className="text-sm font-semibold text-[#173f35]">
              {t("request.inputLabel", "Event description")}
            </label>

            <textarea
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSaveError(null);
              }}
              className="mt-3 min-h-32 w-full resize-none rounded-[1.35rem] border border-[#e8dcc8] bg-[#faf6ee] p-5 text-base leading-7 text-[#173f35] outline-none transition placeholder:text-[#8a9a94] focus:border-[#c9a45c] focus:ring-4 focus:ring-[#c9a45c]/10"
            />

            <div className="relative mt-5">
              <label className="text-sm font-semibold text-[#173f35]">
                {t("request.locationLabel", "City or postal code")}
              </label>

              <input
                value={locationInput}
                onChange={(event) => {
                  setLocationInput(event.target.value);
                  setSelectedLocation(null);
                  setSaveError(null);
                }}
                placeholder={t(
                  "request.locationPlaceholder",
                  "e.g. Berlin, 10115, Paderborn..."
                )}
                className="mt-3 w-full rounded-[1.35rem] border border-[#e8dcc8] bg-[#faf6ee] px-5 py-4 text-[#173f35] outline-none transition placeholder:text-[#8a9a94] focus:border-[#c9a45c] focus:ring-4 focus:ring-[#c9a45c]/10"
              />

              {locationResults.length > 0 && (
                <div className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-[1.35rem] border border-[#eadfce] bg-white p-2 shadow-2xl">
                  {locationResults.map((location) => (
                    <button
                      key={location.id}
                      type="button"
                      onClick={() => selectLocation(location)}
                      className="w-full rounded-xl px-4 py-3 text-left transition hover:bg-[#faf6ee]"
                    >
                      <div className="font-semibold text-[#173f35]">
                        {location.postal_code} {location.name}
                      </div>
                      <div className="text-sm text-[#5c6f68]">
                        {location.state ?? "Germany"} ·{" "}
                        {location.type ?? "location"}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {locationLoading && (
                <p className="mt-2 text-sm text-[#5c6f68]">
                  {t("request.locationSearching", "Searching locations...")}
                </p>
              )}
            </div>

            {saveError ? (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                {saveError}
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleSaveRequest}
                disabled={saving}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#173f35] px-6 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#0f2f27] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? t("request.saving", "Speisely is preparing your AI brief...")
                  : t("request.continue", "Continue to AI brief")}
                <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                href="/caterers"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#d8ccb9] bg-white px-6 font-semibold text-[#173f35] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#f4ead7]"
              >
                {t("request.browse", "Browse caterers")}
              </Link>
            </div>
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28">
          <div className="overflow-hidden rounded-[2.5rem] border border-[#eadfce] bg-white shadow-[0_22px_70px_rgba(35,28,18,0.08)]">
            <DynamicUnsplashImage
              section="premium"
              className="h-72"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          </div>

          <div className="rounded-[2rem] border border-[#eadfce] bg-white/90 p-6 shadow-[0_22px_70px_rgba(35,28,18,0.08)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b28a3c]">
                  {t("request.previewLabel", "AI preview")}
                </p>
                <h2 className="premium-heading mt-2 text-3xl text-[#173f35]">
                  {t("request.previewTitle", "What Speisely understood")}
                </h2>
              </div>

              <div className="rounded-full bg-[#f4ead7] p-2 text-[#b28a3c]">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {briefingItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.35rem] border border-[#eadfce] bg-[#fbf7ef] p-4 transition hover:bg-[#f8efe1]"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-[#b28a3c]">{item.icon}</div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8a6d35]">
                        {item.label}
                      </p>
                      <p className="mt-1.5 text-[15px] font-semibold leading-6 text-[#173f35]">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.35rem] border border-dashed border-[#d8ccb9] bg-[#fbf7ef] p-4">
              <p className="text-sm font-semibold text-[#173f35]">
                {t("request.aiNoteTitle", "AI matching starts after this step")}
              </p>
              <p className="mt-2 text-sm leading-7 text-[#5c6f68]">
                {t(
                  "request.aiNote",
                  "You will review a compact event brief next. No repeated long form — only key details and suggested caterers."
                )}
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] bg-[#173f35] p-6 text-white shadow-[0_22px_70px_rgba(23,63,53,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d6b25e]">
              {t("request.flowLabel", "Next")}
            </p>
            <h3 className="premium-heading mt-3 text-3xl text-white">
              {t("request.flowTitle", "Review brief → see matches")}
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/75">
              {t(
                "request.flowText",
                "Speisely turns your message into a structured request and prepares caterer matching."
              )}
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
