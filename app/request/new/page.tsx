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

if (text.includes("berlin")) return "Berlin";
if (text.includes("hamburg")) return "Hamburg";
if (text.includes("munich") || text.includes("münchen")) return "München";
if (text.includes("frankfurt")) return "Frankfurt am Main";
if (text.includes("cologne") || text.includes("köln")) return "Köln";
if (text.includes("düsseldorf") || text.includes("duesseldorf")) return "Düsseldorf";
if (text.includes("dresden")) return "Dresden";
if (text.includes("leipzig")) return "Leipzig";
if (text.includes("stuttgart")) return "Stuttgart";
if (text.includes("dortmund")) return "Dortmund";
if (text.includes("essen")) return "Essen";
if (text.includes("bremen")) return "Bremen";
if (text.includes("hannover")) return "Hannover";
if (text.includes("nürnberg") || text.includes("nuremberg")) return "Nürnberg";
if (text.includes("duisburg")) return "Duisburg";
if (text.includes("bochum")) return "Bochum";
if (text.includes("wuppertal")) return "Wuppertal";
if (text.includes("bielefeld")) return "Bielefeld";
if (text.includes("bonn")) return "Bonn";
if (text.includes("münster") || text.includes("muenster")) return "Münster";
if (text.includes("karlsruhe")) return "Karlsruhe";
if (text.includes("mannheim")) return "Mannheim";
if (text.includes("augsburg")) return "Augsburg";
if (text.includes("wiesbaden")) return "Wiesbaden";
if (text.includes("gelsenkirchen")) return "Gelsenkirchen";
if (text.includes("mönchengladbach") || text.includes("moenchengladbach") || text.includes("munchengladbach")) return "Mönchengladbach";
if (text.includes("braunschweig")) return "Braunschweig";
if (text.includes("chemnitz")) return "Chemnitz";
if (text.includes("kiel")) return "Kiel";
if (text.includes("aachen")) return "Aachen";
if (text.includes("halle")) return "Halle";
if (text.includes("magdeburg")) return "Magdeburg";
if (text.includes("freiburg")) return "Freiburg";
if (text.includes("krefeld")) return "Krefeld";
if (text.includes("lübeck") || text.includes("luebeck")) return "Lübeck";
if (text.includes("oberhausen")) return "Oberhausen";
if (text.includes("erfurt")) return "Erfurt";
if (text.includes("mainz")) return "Mainz";
if (text.includes("rostock")) return "Rostock";
if (text.includes("kassel")) return "Kassel";
if (text.includes("hagen")) return "Hagen";
if (text.includes("hamm")) return "Hamm";
if (text.includes("saarbrücken") || text.includes("saarbruecken")) return "Saarbrücken";
if (text.includes("mülheim") || text.includes("muelheim")) return "Mülheim";
if (text.includes("potsdam")) return "Potsdam";
if (text.includes("ludwigshafen")) return "Ludwigshafen";
if (text.includes("oldenburg")) return "Oldenburg";
if (text.includes("leverkusen")) return "Leverkusen";
if (text.includes("osnabrück") || text.includes("osnabrueck")) return "Osnabrück";
if (text.includes("solingen")) return "Solingen";
if (text.includes("heidelberg")) return "Heidelberg";
if (text.includes("herne")) return "Herne";
if (text.includes("neuss")) return "Neuss";
if (text.includes("darmstadt")) return "Darmstadt";
if (text.includes("paderborn")) return "Paderborn";
if (text.includes("regensburg")) return "Regensburg";
if (text.includes("ingolstadt")) return "Ingolstadt";
if (text.includes("würzburg") || text.includes("wuerzburg")) return "Würzburg";
if (text.includes("fürth") || text.includes("fuerth")) return "Fürth";
if (text.includes("wolfsburg")) return "Wolfsburg";
if (text.includes("offenbach")) return "Offenbach";
if (text.includes("ulm")) return "Ulm";
if (text.includes("heilbronn")) return "Heilbronn";
if (text.includes("pforzheim")) return "Pforzheim";
if (text.includes("göttingen") || text.includes("goettingen")) return "Göttingen";
if (text.includes("bottrop")) return "Bottrop";
if (text.includes("trier")) return "Trier";
if (text.includes("recklinghausen")) return "Recklinghausen";
if (text.includes("reutlingen")) return "Reutlingen";
if (text.includes("bremerhaven")) return "Bremerhaven";
if (text.includes("koblenz")) return "Koblenz";
if (text.includes("bergisch gladbach")) return "Bergisch Gladbach";
if (text.includes("jena")) return "Jena";
if (text.includes("remscheid")) return "Remscheid";
if (text.includes("erlangen")) return "Erlangen";
if (text.includes("moers")) return "Moers";
if (text.includes("siegen")) return "Siegen";
if (text.includes("hildesheim")) return "Hildesheim";
if (text.includes("salzgitter")) return "Salzgitter";
if (text.includes("cottbus")) return "Cottbus";

  return "";
}

function detectAutoStartFromUrl() {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("start") === "1";
}

export default function NewRequestPage() {
  const t = useT();
  const router = useRouter();

  const bootedRef = useRef(false);
  const creatingRef = useRef(false);

  const [booting, setBooting] = useState(true);
  const [isAutoStart, setIsAutoStart] = useState(false);

  const [query, setQuery] = useState(occasionPrompts[0].query);
  const [locationInput, setLocationInput] = useState("Berlin");
  const [selectedLocation, setSelectedLocation] =
    useState<GermanLocation | null>(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState(
    "Speisely is reading your event details."
  );

  async function createDraftFromValues(input: {
    cleanQuery: string;
    cleanLocation: string;
    selectedLocation: GermanLocation | null;
  }) {
    if (creatingRef.current) return;
    creatingRef.current = true;

    setSaving(true);
    setStatusText("You are logged in. Speisely is creating your AI brief...");

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

    router.push(`/request/${result.id}`);
  }

  useEffect(() => {
    setIsAutoStart(detectAutoStartFromUrl());

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
            pending.locationInput || extractCityFromQuery(pendingQuery) || "Berlin";

          if (pendingQuery) setQuery(pendingQuery);
          setLocationInput(pendingCity);

          if (pending.selectedLocation) {
            setSelectedLocation(pending.selectedLocation);
          }

          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user && pendingQuery.trim().length >= 10) {
            setSaving(true);
            setStatusText(`Logged in as ${user.email}. Creating your AI brief...`);

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
      setStatusText("Checking your login and preparing the AI brief...");

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

        setStatusText(`Logged in as ${user.email}. Creating your AI brief...`);

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
      query.match(/(\d+)\s?(guests|guest|people|persons|personen|gäste)/i) ||
      query.match(/for\s+(\d+)/i) ||
      query.match(/für\s+(\d+)/i);

    const budgetMatch =
      query.match(/€\s?\d+/) ||
      query.match(/\d+\s?(€|eur|euros?)\s?(p\.p\.|pp|per person|pro person)?/i);

    const event = lower.includes("business")
      ? t("event.businessLunch", "Business lunch")
      : lower.includes("weihnacht") || lower.includes("christmas")
        ? t("event.christmas", "Christmas party")
        : lower.includes("iftar") || lower.includes("ramadan")
          ? t("event.ramadan", "Ramadan / Iftar")
          : lower.includes("birthday") || lower.includes("geburtstag")
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

    const style = lower.includes("fine")
      ? "Fine dining"
      : lower.includes("buffet")
        ? "Buffet"
        : lower.includes("bbq") || lower.includes("grill")
          ? "BBQ"
          : lower.includes("finger")
            ? "Finger food"
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

        router.push("/login?next=/request/new");
        return;
      }

      setStatusText(`Logged in as ${user.email}. Creating your AI brief...`);

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
                KI-Catering-Concierge
              </p>

              <h1 className="premium-heading mt-2 text-3xl text-[#173f35] md:text-4xl">
                Speisely prüft Ihre Anfrage
              </h1>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#5c6f68]">
                Wir lesen Ihre Eventbeschreibung, prüfen den Login und bereiten
                das KI-Briefing vor.
              </p>

              <div className="mt-6 grid gap-2 text-left sm:grid-cols-3">
                {["Event verstehen", "Ort erkennen", "Briefing vorbereiten"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-[#eadfce] bg-[#faf6ee] p-3 text-sm font-semibold text-[#173f35]"
                    >
                      <CheckCircle2 className="mb-2 h-4 w-4 text-[#b28a3c]" />
                      {item}
                    </div>
                  )
                )}
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
                  : "KI-Briefing erstellen"}
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
                KI analysiert Ihre Anfrage
              </p>
              <p className="mt-1 text-sm leading-6 text-[#5c6f68]">
                Speisely erkennt Ort, Gästezahl, Eventtyp und bereitet daraus ein
                kompaktes Catering-Briefing vor.
              </p>
            </div>
          </div>

          <div className="rounded-[1.8rem] bg-[#173f35] p-4 text-white shadow-[0_18px_50px_rgba(23,63,53,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d6b25e]">
              {t("request.flowLabel", "Next")}
            </p>
            <h3 className="premium-heading mt-1 text-xl text-white">
              Briefing prüfen → KI-Matches finden
            </h3>
            <p className="mt-1 text-sm leading-6 text-white/75">
              Speisely vergleicht passende Caterer nach Ort, Gästezahl,
              Catering-Stil und Budget.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
