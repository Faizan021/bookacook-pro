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
    fallback: "Hochzeit",
    query:
      "Hochzeit für 80 Gäste in Berlin, vegetarisch, elegantes Buffet, ca. €45 pro Person",
  },
  {
    id: "corporate",
    labelKey: "event.businessLunch",
    fallback: "Business Lunch",
    query:
      "Business Lunch für 45 Personen in Berlin, modernes Buffet, vegetarische Optionen, ca. €30 pro Person",
  },
  {
    id: "private",
    labelKey: "event.privateDinner",
    fallback: "Private Dinner",
    query:
      "Private Dinner für 20 Gäste in Berlin, Fine Dining, mediterran, ca. €70 pro Person",
  },
  {
    id: "ramadan",
    labelKey: "event.ramadan",
    fallback: "Ramadan Iftar",
    query:
      "Ramadan Iftar für 60 Gäste in Berlin, halal Buffet, warme Speisen und Desserts",
  },
  {
    id: "christmas",
    labelKey: "event.christmas",
    fallback: "Weihnachtsfeier",
    query:
      "Weihnachtsfeier für 70 Gäste in Berlin, festliches Buffet, warme Speisen, Desserts und Getränke",
  },
];

function getPromptByOccasion(occasion: string | null) {
  if (!occasion) return null;
  return occasionPrompts.find((prompt) => prompt.id === occasion)?.query ?? null;
}

function extractCityFromQuery(query?: string | null) {
  const text = (query || "").toLowerCase();

  const cities: Array<[string[], string]> = [
    [["frankfurt am main", "frankfurt"], "Frankfurt am Main"],
    [["mönchengladbach", "moenchengladbach", "munchengladbach"], "Mönchengladbach"],
    [["bergisch gladbach"], "Bergisch Gladbach"],
    [["berlin"], "Berlin"],
    [["hamburg"], "Hamburg"],
    [["munich", "münchen", "muenchen"], "München"],
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
    [["paderborn"], "Paderborn"],
  ];

  for (const [needles, city] of cities) {
    if (needles.some((needle) => text.includes(needle))) return city;
  }

  return "";
}

function shouldShowBootingImmediately() {
  if (typeof window === "undefined") return true;

  const params = new URLSearchParams(window.location.search);
  const hasStart = params.get("start") === "1";
  const hasQuery = Boolean(params.get("query")?.trim());
  const hasOccasion = Boolean(params.get("occasion")?.trim());
  const hasPending = Boolean(window.localStorage.getItem(PENDING_REQUEST_KEY));

  return hasPending || (hasStart && (hasQuery || hasOccasion));
}

export default function NewRequestPage() {
  const t = useT();
  const router = useRouter();

  const bootedRef = useRef(false);
  const creatingRef = useRef(false);

  const [booting, setBooting] = useState(shouldShowBootingImmediately);
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

    setBooting(true);
    setSaving(true);
    setStatusText(
      t(
        "request.autoStartText",
        "Speisely verwandelt Ihre Event-Idee in ein strukturiertes Catering-Briefing."
      )
    );

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
      const incomingQuery = params.get("query")?.trim() || "";
      const incomingOccasion = params.get("occasion");
      const occasionQuery = getPromptByOccasion(incomingOccasion);
      const urlQuery = incomingQuery || occasionQuery || "";
      const shouldStart = params.get("start") === "1";

      try {
        const rawPending = localStorage.getItem(PENDING_REQUEST_KEY);

        if (rawPending) {
          setBooting(true);

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

          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user && pendingQuery.trim().length >= 10) {
            await createDraftFromValues({
              cleanQuery: pendingQuery.trim(),
              cleanLocation: pendingCity.trim(),
              selectedLocation: pending.selectedLocation ?? null,
            });
            return;
          }

          setQuery(pendingQuery || occasionPrompts[0].query);
          setLocationInput(pendingCity);
          setSelectedLocation(pending.selectedLocation ?? null);
          setBooting(false);
          return;
        }
      } catch {
        localStorage.removeItem(PENDING_REQUEST_KEY);
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

      setBooting(true);
      setStatusText(
        t(
          "request.autoStartChecking",
          "Speisely prüft Ihre Anmeldung und bereitet das KI-Briefing vor."
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
        setSaving(false);
        setBooting(false);
        setSaveError(
          t(
            "request.saveError",
            "Die Anfrage konnte nicht gespeichert werden. Bitte versuchen Sie es erneut."
          )
        );
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

    return [
      {
        label: t("request.brief.event", "Event"),
        value:
          lower.includes("wedding") || lower.includes("hochzeit")
            ? t("event.wedding", "Hochzeit")
            : lower.includes("business") || lower.includes("corporate")
              ? t("event.businessLunch", "Business Lunch")
              : lower.includes("ramadan") || lower.includes("iftar")
                ? t("event.ramadan", "Ramadan / Iftar")
                : t("request.aiStyle", "KI erkennt es"),
        icon: <Sparkles className="h-4 w-4" />,
      },
      {
        label: t("request.brief.location", "Ort"),
        value: shownLocation || t("common.open", "Offen"),
        icon: <MapPin className="h-4 w-4" />,
      },
      {
        label: t("request.brief.guests", "Gäste"),
        value: guestMatch?.[1] || t("common.open", "Offen"),
        icon: <Users className="h-4 w-4" />,
      },
      {
        label: t("request.brief.budget", "Budget"),
        value: budgetMatch?.[0] || t("request.flexibleBudget", "Flexibel"),
        icon: <Wallet className="h-4 w-4" />,
      },
      {
        label: t("request.brief.style", "Stil"),
        value: lower.includes("buffet")
          ? "Buffet"
          : lower.includes("fine")
            ? "Fine Dining"
            : lower.includes("modern")
              ? "Modern"
              : t("request.aiStyle", "KI erkennt es"),
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
        t("request.validation.query", "Bitte beschreiben Sie Ihr Event etwas genauer.")
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
        setBooting(true);

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

      await createDraftFromValues({
        cleanQuery,
        cleanLocation,
        selectedLocation,
      });
    } catch (error) {
      console.error(error);
      creatingRef.current = false;
      setSaveError(
        t(
          "request.saveError",
          "Die Anfrage konnte nicht gespeichert werden. Bitte versuchen Sie es erneut."
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
          <div className="rounded-[2.2rem] border border-[#eadfce] bg-white/90 p-8 text-center shadow-[0_24px_80px_rgba(23,63,53,0.10)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#173f35] text-[#d8b76a]">
              <Sparkles className="h-7 w-7 animate-pulse" />
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.28em] text-[#b28a3c]">
              {t("request.autoStartLabel", "KI-Concierge")}
            </p>

            <h1 className="premium-heading mt-2 text-3xl text-[#173f35] md:text-4xl">
              {t("request.autoStartTitle", "Ihr Catering-Briefing wird erstellt")}
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#5c6f68]">
              {statusText ||
                t(
                  "request.autoStartText",
                  "Speisely verwandelt Ihre Event-Idee in ein strukturiertes Catering-Briefing."
                )}
            </p>

            <div className="mt-6 grid gap-2 text-left sm:grid-cols-3">
              {[
                t("request.loadingStep1", "Event verstehen"),
                t("request.loadingStep2", "Ort erkennen"),
                t("request.loadingStep3", "Briefing vorbereiten"),
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
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbf7ef] text-[#16372f]">
      <SpeiselyHeader />

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-5 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <Link
            href="/"
            className="inline-flex rounded-full border border-[#e5d8c5] bg-white/80 px-4 py-2 text-sm font-semibold text-[#49645c]"
          >
            ← {t("request.backHome", "Zurück zur Startseite")}
          </Link>

          <h1 className="premium-heading mt-5 max-w-4xl text-[2.35rem] leading-[0.98] text-[#123b32] md:text-[3.15rem]">
            {t("request.title", "Beschreiben Sie Ihr Event einmal.")}
            <span className="block pt-1 italic font-medium text-[#b28a3c]">
              {t("request.titleAccent", "Speisely erstellt das Briefing.")}
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-[15px] leading-6 text-[#5c6f68]">
            {t(
              "request.description",
              "Nutzen Sie natürliche Sprache. Speisely erkennt Eventtyp, Gästezahl, Ort, Budget, Ernährungswünsche und Catering-Stil."
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
                className="rounded-full border border-[#e5d8c5] bg-white/85 px-3.5 py-2 text-sm font-semibold text-[#173f35]"
              >
                {t(prompt.labelKey, prompt.fallback)}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-[1.8rem] border border-[#eadfce] bg-white/90 p-4 shadow-[0_18px_50px_rgba(35,28,18,0.08)]">
            <label className="text-sm font-semibold text-[#173f35]">
              {t("request.inputLabel", "Eventbeschreibung")}
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
              className="mt-2 min-h-24 w-full resize-none rounded-[1.2rem] border border-[#e8dcc8] bg-[#faf6ee] p-4 text-[15px] leading-6 text-[#173f35] outline-none"
            />

            <div className="mt-3">
              <label className="text-sm font-semibold text-[#173f35]">
                {t("request.locationLabel", "Stadt oder Postleitzahl")}
              </label>

              <input
                value={locationInput}
                onChange={(event) => {
                  setLocationInput(event.target.value);
                  setSelectedLocation(null);
                  setSaveError(null);
                }}
                className="mt-2 w-full rounded-[1.2rem] border border-[#e8dcc8] bg-[#faf6ee] px-4 py-3.5 text-[#173f35] outline-none"
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
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#173f35] px-6 font-semibold text-white disabled:opacity-60"
              >
                {saving
                  ? t("request.saving", "Speisely bereitet Ihr KI-Briefing vor...")
                  : t("request.continue", "Weiter zum KI-Briefing")}
                <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                href="/caterers"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#d8ccb9] bg-white px-6 font-semibold text-[#173f35]"
              >
                {t("request.browse", "Caterer ansehen")}
              </Link>
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20">
          <div className="overflow-hidden rounded-[1.8rem] border border-[#eadfce] bg-white">
            <DynamicUnsplashImage
              section="premium"
              className="h-40 lg:h-44"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>

          <div className="rounded-[1.8rem] border border-[#eadfce] bg-white/90 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
              {t("request.previewLabel", "KI-Vorschau")}
            </p>

            <h2 className="premium-heading mt-1 text-xl text-[#173f35]">
              {t("request.previewTitle", "Was Speisely verstanden hat")}
            </h2>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {briefingItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.05rem] border border-[#eadfce] bg-[#fbf7ef] p-3"
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
          </div>
        </aside>
      </section>
    </main>
  );
}
