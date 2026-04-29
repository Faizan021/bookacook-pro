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

function extractCityFromQuery(query?: string | null) {
  const text = (query || "").toLowerCase();

  const cities: Array<[string[], string]> = [
    [["berlin"], "Berlin"],
    [["hamburg"], "Hamburg"],
    [["munich", "münchen", "muenchen"], "München"],
    [["frankfurt am main", "frankfurt"], "Frankfurt am Main"],
    [["cologne", "köln", "koeln"], "Köln"],
    [["düsseldorf", "duesseldorf"], "Düsseldorf"],
    [["dresden"], "Dresden"],
    [["leipzig"], "Leipzig"],
    [["stuttgart"], "Stuttgart"],
    [["dortmund"], "Dortmund"],
    [["essen"], "Essen"],
    [["bremen"], "Bremen"],
    [["hannover"], "Hannover"],
    [["nürnberg", "nuremberg", "nuernberg"], "Nürnberg"],
    [["duisburg"], "Duisburg"],
    [["bochum"], "Bochum"],
    [["wuppertal"], "Wuppertal"],
    [["bielefeld"], "Bielefeld"],
    [["bonn"], "Bonn"],
    [["münster", "muenster"], "Münster"],
    [["karlsruhe"], "Karlsruhe"],
    [["mannheim"], "Mannheim"],
    [["augsburg"], "Augsburg"],
    [["wiesbaden"], "Wiesbaden"],
    [["gelsenkirchen"], "Gelsenkirchen"],
    [["mönchengladbach", "moenchengladbach", "munchengladbach"], "Mönchengladbach"],
    [["braunschweig"], "Braunschweig"],
    [["chemnitz"], "Chemnitz"],
    [["kiel"], "Kiel"],
    [["aachen"], "Aachen"],
    [["halle"], "Halle"],
    [["magdeburg"], "Magdeburg"],
    [["freiburg"], "Freiburg"],
    [["krefeld"], "Krefeld"],
    [["lübeck", "luebeck"], "Lübeck"],
    [["oberhausen"], "Oberhausen"],
    [["erfurt"], "Erfurt"],
    [["mainz"], "Mainz"],
    [["rostock"], "Rostock"],
    [["kassel"], "Kassel"],
    [["hagen"], "Hagen"],
    [["hamm"], "Hamm"],
    [["saarbrücken", "saarbruecken"], "Saarbrücken"],
    [["mülheim", "muelheim"], "Mülheim"],
    [["potsdam"], "Potsdam"],
    [["ludwigshafen"], "Ludwigshafen"],
    [["oldenburg"], "Oldenburg"],
    [["leverkusen"], "Leverkusen"],
    [["osnabrück", "osnabrueck"], "Osnabrück"],
    [["solingen"], "Solingen"],
    [["heidelberg"], "Heidelberg"],
    [["herne"], "Herne"],
    [["neuss"], "Neuss"],
    [["darmstadt"], "Darmstadt"],
    [["paderborn"], "Paderborn"],
    [["regensburg"], "Regensburg"],
    [["ingolstadt"], "Ingolstadt"],
    [["würzburg", "wuerzburg"], "Würzburg"],
    [["fürth", "fuerth"], "Fürth"],
    [["wolfsburg"], "Wolfsburg"],
    [["offenbach"], "Offenbach"],
    [["ulm"], "Ulm"],
    [["heilbronn"], "Heilbronn"],
    [["pforzheim"], "Pforzheim"],
    [["göttingen", "goettingen"], "Göttingen"],
    [["bottrop"], "Bottrop"],
    [["trier"], "Trier"],
    [["recklinghausen"], "Recklinghausen"],
    [["reutlingen"], "Reutlingen"],
    [["bremerhaven"], "Bremerhaven"],
    [["koblenz"], "Koblenz"],
    [["bergisch gladbach"], "Bergisch Gladbach"],
    [["jena"], "Jena"],
    [["remscheid"], "Remscheid"],
    [["erlangen"], "Erlangen"],
    [["moers"], "Moers"],
    [["siegen"], "Siegen"],
    [["hildesheim"], "Hildesheim"],
    [["salzgitter"], "Salzgitter"],
    [["cottbus"], "Cottbus"],
  ];

  for (const [needles, city] of cities) {
    if (needles.some((needle) => text.includes(needle))) return city;
  }

  return "";
}

export default function NewRequestPage() {
  const t = useT();
  const router = useRouter();

  const bootedRef = useRef(false);
  const creatingRef = useRef(false);

  const [booting, setBooting] = useState(true);
  const [query, setQuery] = useState(occasionPrompts[0].query);
  const [locationInput, setLocationInput] = useState("Berlin");
  const [selectedLocation, setSelectedLocation] =
    useState<GermanLocation | null>(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("");

  async function createDraftFromValues(input: {
    cleanQuery: string;
    cleanLocation: string;
    selectedLocation: GermanLocation | null;
  }) {
    if (creatingRef.current) return;
    creatingRef.current = true;

    setSaving(true);
    setStatusText(t("request.autoStartText", "Speisely is turning your event idea into a structured request."));

    const result = await createRequestDraftAction({
      ai_query: input.cleanQuery,
      event_type: null,
      city: input.selectedLocation?.name ?? input.cleanLocation ?? null,
      postal_code: input.selectedLocation?.postal_code ?? null,
      lat: input.selectedLocation?.lat ?? null,
      lng: input.selectedLocation?.lng ?? null,
    });

    try {
      localStorage.removeItem(PENDING_REQUEST_KEY);
    } catch {}

    router.replace(`/request/${result.id}`);
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

      try {
        const rawPending = localStorage.getItem(PENDING_REQUEST_KEY);

        if (rawPending) {
          const pending = JSON.parse(rawPending) as {
            query?: string;
            locationInput?: string;
            selectedLocation?: GermanLocation | null;
          };

          const pendingQuery = pending.query || "";
          const pendingCity =
            pending.locationInput ||
            extractCityFromQuery(pendingQuery) ||
            "Berlin";

          if (pendingQuery) setQuery(pendingQuery);
          setLocationInput(pendingCity);
          if (pending.selectedLocation) setSelectedLocation(pending.selectedLocation);

          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user && pendingQuery.trim().length >= 10) {
            setSaving(true);
            setStatusText(
              t(
                "request.autoStartText",
                "Speisely is turning your event idea into a structured request."
              )
            );

            await createDraftFromValues({
              cleanQuery: pendingQuery.trim(),
              cleanLocation: pendingCity.trim(),
              selectedLocation: pending.selectedLocation ?? null,
            });
            return;
          }

          setBooting(false);
          return;
        }
      } catch (error) {
        console.error("Failed to restore pending request:", error);
        try {
          localStorage.removeItem(PENDING_REQUEST_KEY);
        } catch {}
      }

      if (urlQuery) {
        const cityFromQuery = extractCityFromQuery(urlQuery) || "Berlin";
        setQuery(urlQuery);
        setLocationInput(cityFromQuery);
      }

      if (!shouldStart || !urlQuery) {
        setBooting(false);
        return;
      }

      setSaving(true);
      setStatusText(
        t(
          "request.autoStartText",
          "Speisely is turning your event idea into a structured request."
        )
      );

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const cityFromQuery = extractCityFromQuery(urlQuery) || "Berlin";

        if (!user) {
          localStorage.setItem(
            PENDING_REQUEST_KEY,
            JSON.stringify({
              query: urlQuery,
              locationInput: cityFromQuery,
              selectedLocation: null,
            })
          );

          router.replace("/login?next=/request/new");
          return;
        }

        await createDraftFromValues({
          cleanQuery: urlQuery,
          cleanLocation: cityFromQuery,
          selectedLocation: null,
        });
      } catch (error) {
        console.error("Failed to auto-start request:", error);
        creatingRef.current = false;
        setSaveError(
          t(
            "request.saveError",
            "The request could not be saved. Please try again."
          )
        );
        setSaving(false);
        setBooting(false);
      }
    }

    bootRequestPage();
  }, [router, t]);

  const briefingItems = useMemo(() => {
    const lower = query.toLowerCase();

    const cityFromQuery = extractCityFromQuery(query);
    const shownLocation = selectedLocation?.name || cityFromQuery || locationInput;

    const guestMatch =
      query.match(/(\d+)\s?(guests|guest|people|persons|personen|gäste|gast|pax)/i) ||
      query.match(/for\s+(\d+)/i) ||
      query.match(/für\s+(\d+)/i);

    const budgetMatch =
      query.match(/€\s?\d+/) ||
      query.match(/\d+\s?(€|eur|euro|euros?)\s?(p\.p\.|pp|per person|pro person)?/i);

    const event = lower.includes("business") || lower.includes("corporate") || lower.includes("lunch")
      ? t("event.businessLunch", "Business lunch")
      : lower.includes("weihnacht") || lower.includes("christmas")
        ? t("event.christmas", "Christmas party")
        : lower.includes("iftar") || lower.includes("ramadan")
          ? t("event.ramadan", "Ramadan / Iftar")
          : lower.includes("birthday") || lower.includes("geburtstag") || lower.includes("party")
            ? t("event.birthday", "Birthday")
            : lower.includes("private")
              ? t("event.privateDinner", "Private dinner")
              : lower.includes("wedding") || lower.includes("hochzeit")
                ? t("event.wedding", "Wedding")
                : t("request.aiStyle", "AI will infer");

    const diet = lower.includes("vegetar")
      ? t("diet.vegetarian", "Vegetarian")
      : lower.includes("vegan")
        ? t("diet.vegan", "Vegan")
        : lower.includes("halal")
          ? t("diet.halal", "Halal")
          : t("common.open", "Open");

    const style = lower.includes("fine dining") || lower.includes("fine dinning") || lower.includes("fine")
      ? "Fine dining"
      : lower.includes("buffet")
        ? "Buffet"
        : lower.includes("bbq") || lower.includes("grill")
          ? "BBQ"
          : lower.includes("finger")
            ? "Finger food"
            : lower.includes("elegant") || lower.includes("elegantes")
              ? "Elegant"
              : lower.includes("modern")
                ? "Modern"
                : t("request.aiStyle", "AI will infer");

    return [
      {
        label: t("request.brief.event", "Event"),
        value: event,
        icon: <Sparkles className="h-4 w-4" />,
      },
      {
        label: t("request.brief.location", "Location"),
        value: shownLocation || t("common.open", "Open"),
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

  async function handleSaveRequest() {
    setSaveError(null);
    setSaving(true);

    const cleanQuery = query.trim();
    const cityFromQuery = extractCityFromQuery(cleanQuery);
    const cleanLocation = cityFromQuery || locationInput.trim() || "Berlin";

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

        router.replace("/login?next=/request/new");
        return;
      }

      setStatusText(
        t(
          "request.autoStartText",
          "Speisely is turning your event idea into a structured request."
        )
      );

      await createDraftFromValues({
        cleanQuery,
        cleanLocation,
        selectedLocation,
      });
    } catch (error) {
      console.error(error);
      creatingRef.current = false;

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

        router.replace("/login?next=/request/new");
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

  if (booting) {
    return (
      <main className="min-h-screen bg-[#fbf7ef] text-[#173f35]">
        <SpeiselyHeader />
        <section className="mx-auto flex min-h-[72vh] max-w-4xl items-center justify-center px-6">
          <div className="relative overflow-hidden rounded-[2.2rem] border border-[#eadfce] bg-white/90 p-8 text-center shadow-[0_24px_80px_rgba(23,63,53,0.10)]">
            <div className="absolute left-[-20%] top-[-30%] h-72 w-72 rounded-full bg-[#b28a3c]/10 blur-3xl" />
            <div className="absolute right-[-20%] bottom-[-30%] h-72 w-72 rounded-full bg-[#173f35]/10 blur-3xl" />

            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#173f35] text-[#d8b76a]">
                <Sparkles className="h-7 w-7 animate-pulse" />
              </div>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.28em] text-[#b28a3c]">
                {t("request.autoStartLabel", "AI concierge")}
              </p>

              <h1 className="premium-heading mt-2 text-3xl text-[#173f35] md:text-4xl">
                {t("request.autoStartTitle", "Building your catering brief")}
              </h1>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#5c6f68]">
                {statusText ||
                  t(
                    "request.autoStartText",
                    "Speisely is turning your event idea into a structured request."
                  )}
              </p>

              <div className="mt-6 grid gap-2 text-left sm:grid-cols-3">
                {[
                  t("request.loadingStep1", "Understanding event"),
                  t("request.loadingStep2", "Detecting location"),
                  t("request.loadingStep3", "Preparing brief"),
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[#eadfce] bg-[#faf6ee] p-3 text-sm font-semibold text-[#173f35]"
                  >
                    <CheckCircle2 className="mb-2 h-4 w-4 text-[#b28a3c]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbf7ef] text-[#16372f]">
      <SpeiselyHeader />

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-5 lg:grid-cols-[1fr_0.85fr] lg:gap-7 lg:py-4">
        <div className="pt-1">
          <div className="flex flex-wrap items-center gap-2">
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

          <h1 className="premium-heading mt-5 max-w-4xl text-[2.35rem] leading-[0.98] text-[#123b32] md:text-[3.15rem] xl:text-[3.45rem]">
            {t("request.title", "Describe your event once.")}
            <span className="block pt-1 italic font-medium text-[#b28a3c]">
              {t("request.titleAccent", "Speisely builds the brief.")}
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-[15px] leading-6 text-[#5c6f68]">
            {t(
              "request.description",
              "Use natural language. Speisely detects event type, guests, location, budget, dietary needs and catering style."
            )}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {occasionPrompts.map((prompt) => (
              <button
                key={prompt.id}
                type="button"
                onClick={() => {
                  setQuery(prompt.query);
                  setLocationInput(extractCityFromQuery(prompt.query) || "Berlin");
                  setSaveError(null);
                }}
                className="rounded-full border border-[#e5d8c5] bg-white/85 px-3.5 py-2 text-sm font-semibold text-[#173f35] shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
              >
                {t(prompt.labelKey, prompt.fallback)}
              </button>
            ))}
          </div>

          {saving ? (
            <div className="mt-4 rounded-[1.6rem] border border-[#eadfce] bg-white/90 p-4 shadow-[0_18px_50px_rgba(35,28,18,0.08)]">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#173f35] text-[#d6b25e]">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
                    {t("request.autoStartLabel", "AI concierge")}
                  </p>
                  <h2 className="premium-heading mt-1 text-xl text-[#173f35]">
                    {t("request.autoStartTitle", "Building your catering brief")}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-[#5c6f68]">
                    {statusText}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-4 rounded-[1.8rem] border border-[#eadfce] bg-white/90 p-4 shadow-[0_18px_50px_rgba(35,28,18,0.08)] backdrop-blur">
            <label className="text-sm font-semibold text-[#173f35]">
              {t("request.inputLabel", "Event description")}
            </label>

            <textarea
              value={query}
              onChange={(event) => {
                const value = event.target.value;
                setQuery(value);

                const city = extractCityFromQuery(value);
                if (city) setLocationInput(city);

                setSaveError(null);
              }}
              className="mt-2 min-h-24 w-full resize-none rounded-[1.2rem] border border-[#e8dcc8] bg-[#faf6ee] p-4 text-[15px] leading-6 text-[#173f35] outline-none transition placeholder:text-[#8a9a94] focus:border-[#c9a45c] focus:ring-4 focus:ring-[#c9a45c]/10"
            />

            <div className="mt-3">
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
                className="mt-2 w-full rounded-[1.2rem] border border-[#e8dcc8] bg-[#faf6ee] px-4 py-3.5 text-[#173f35] outline-none transition placeholder:text-[#8a9a94] focus:border-[#c9a45c] focus:ring-4 focus:ring-[#c9a45c]/10"
              />
            </div>

            {saveError ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                {saveError}
              </div>
            ) : null}

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleSaveRequest}
                disabled={saving}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#173f35] px-6 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#0f2f27] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? t("request.saving", "Speisely is preparing your AI brief...")
                  : t("request.continue", "Continue to AI brief")}
                <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                href="/caterers"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#d8ccb9] bg-white px-6 font-semibold text-[#173f35] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#f4ead7]"
              >
                {t("request.browse", "Browse caterers")}
              </Link>
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20">
          <div className="overflow-hidden rounded-[1.8rem] border border-[#eadfce] bg-white shadow-[0_18px_50px_rgba(35,28,18,0.08)]">
            <DynamicUnsplashImage
              section="premium"
              className="h-40 lg:h-44"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>

          <div className="rounded-[1.8rem] border border-[#eadfce] bg-white/90 p-4 shadow-[0_18px_50px_rgba(35,28,18,0.08)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
                  {t("request.previewLabel", "AI preview")}
                </p>
                <h2 className="premium-heading mt-1 text-xl text-[#173f35]">
                  {t("request.previewTitle", "What Speisely understood")}
                </h2>
              </div>

              <div className="rounded-full bg-[#f4ead7] p-2 text-[#b28a3c]">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {briefingItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.05rem] border border-[#eadfce] bg-[#fbf7ef] p-3 transition hover:bg-[#f8efe1]"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 text-[#b28a3c]">{item.icon}</div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a6d35]">
                        {item.label}
                      </p>
                      <p className="mt-1 text-[13px] font-semibold leading-5 text-[#173f35]">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-[1.05rem] border border-dashed border-[#d8ccb9] bg-[#fbf7ef] p-3">
              <p className="text-sm font-semibold text-[#173f35]">
                {t("request.aiNoteTitle", "AI matching starts after this step")}
              </p>
              <p className="mt-1 text-sm leading-6 text-[#5c6f68]">
                {t(
                  "request.aiNote",
                  "You will review a compact event brief next."
                )}
              </p>
            </div>
          </div>

          <div className="rounded-[1.8rem] bg-[#173f35] p-4 text-white shadow-[0_18px_50px_rgba(23,63,53,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d6b25e]">
              {t("request.flowLabel", "Next")}
            </p>
            <h3 className="premium-heading mt-1 text-xl text-white">
              {t("request.flowTitle", "Review brief → see matches")}
            </h3>
            <p className="mt-1 text-sm leading-6 text-white/75">
              {t(
                "request.flowText",
                "Speisely prepares your structured request and caterer matching."
              )}
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
