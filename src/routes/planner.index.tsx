import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { useMemo, useState } from "react";
import {
  Sparkles,
  PartyPopper,
  Calendar as CalendarIcon,
  Users,
  Wallet,
  Leaf,
  Utensils,
  ClipboardCheck,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  MapPin as MapPinIcon,
  Briefcase,
  Star,
  BadgeCheck,
  ArrowUpDown,
  UtensilsCrossed,
  ChevronDown,
} from "lucide-react";
import { getPlanners, type Planner } from "@/data/planners";
import { useI18n } from "@/i18n/I18nProvider";
import { MarketplacePromiseCTA } from "@/components/MarketplacePromiseCTA";
import { TrustSection } from "@/components/TrustSection";
import { SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/planner/")({
  head: () => ({
    meta: [
      { title: "Event Planner — Speisely AI Concierge" },
      {
        name: "description",
        content:
          "Describe your event in a few steps — our AI concierge creates the perfect catering brief and matches you with verified planners.",
      },
      { property: "og:title", content: "Event Planner — Speisely AI Concierge" },
      {
        property: "og:description",
        content:
          "From event wish to concrete brief: type, date, guests, budget, diet, cuisine — matched with verified planners.",
      },
      { property: "og:url", content: "/planner" },
    ],
    links: [
      { rel: "preload", href: "/planner-clean.png", as: "image", fetchpriority: "high" },
    ],
  }),
  loader: async () => await getPlanners(),
  component: PlannerPage,
});


type EventType = "wedding" | "corporate" | "private" | "ramadan" | "festival" | "other";
type Budget = "low" | "mid" | "premium" | "luxury";
type Cuisine =
  | "mediterranean"
  | "italian"
  | "asian"
  | "german"
  | "french"
  | "vegan"
  | "mixed";

type Brief = {
  event_type: EventType | "";
  date: string;
  time: string;
  guest_count: number;
  budget: Budget | "";
  dietary: string[];
  cuisine: Cuisine | "";
  notes: string;
};

function PlannerPage() {
  const planners = Route.useLoaderData() as Planner[];
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);

  const STEPS = [
    { key: "type" as const, label: tt("Event", "Event"), icon: PartyPopper },
    { key: "date" as const, label: tt("Datum", "Date"), icon: CalendarIcon },
    { key: "guests" as const, label: tt("Gäste", "Guests"), icon: Users },
    { key: "budget" as const, label: tt("Budget", "Budget"), icon: Wallet },
    { key: "diet" as const, label: tt("Diät", "Diet"), icon: Leaf },
    { key: "cuisine" as const, label: tt("Küche", "Cuisine"), icon: Utensils },
    { key: "review" as const, label: tt("Briefing", "Briefing"), icon: ClipboardCheck },
  ];

  const eventTypes: { id: EventType; title: string; sub: string }[] = [
    { id: "wedding", title: tt("Hochzeit", "Wedding"), sub: tt("Magische Momente, persönliches Menü", "Magical moments, personal menu") },
    { id: "corporate", title: tt("Corporate", "Corporate"), sub: tt("Meetings, Konferenzen, Team-Dinner", "Meetings, conferences, team dinners") },
    { id: "private", title: tt("Privates Dinner", "Private Dinner"), sub: tt("Geburtstag, Jubiläum, Familie", "Birthday, anniversary, family") },
    { id: "ramadan", title: tt("Ramadan Iftar", "Ramadan Iftar"), sub: tt("Festliches Abendessen zur Fastenbrechung", "Festive evening gathering") },
    { id: "festival", title: tt("Festival", "Festival"), sub: tt("Großveranstaltung, mehrtägige Feiern", "Large-scale celebration, multi-day events") },
    { id: "other", title: tt("Anderes", "Other"), sub: tt("Erzähl uns mehr im Briefing", "Tell us more in the brief") },
  ];

  const budgets: { id: Budget; title: string; sub: string }[] = [
    { id: "low", title: "€", sub: tt("bis €40 / Gast", "up to €40 / guest") },
    { id: "mid", title: "€€", sub: tt("€40–€80 / Gast", "€40–€80 / guest") },
    { id: "premium", title: "€€€", sub: tt("€80–€150 / Gast", "€80–€150 / guest") },
    { id: "luxury", title: "€€€€", sub: tt("ab €150 / Gast", "from €150 / guest") },
  ];

  const dietOptions = [
    tt("Vegetarisch", "Vegetarian"),
    tt("Vegan", "Vegan"),
    tt("Glutenfrei", "Gluten-free"),
    tt("Laktosefrei", "Lactose-free"),
    tt("Halal", "Halal"),
    tt("Koscher", "Kosher"),
    tt("Nussallergie", "Nut allergy"),
  ];

  const cuisines: { id: Cuisine; label: string }[] = [
    { id: "mediterranean", label: tt("Mediterran", "Mediterranean") },
    { id: "italian", label: tt("Italienisch", "Italian") },
    { id: "asian", label: tt("Asiatisch", "Asian") },
    { id: "german", label: tt("Deutsch & Saisonal", "German & Seasonal") },
    { id: "french", label: tt("Französisch", "French") },
    { id: "vegan", label: tt("Plant-based", "Plant-based") },
    { id: "mixed", label: tt("Gemischt / Überrasche mich", "Mixed / Surprise me") },
  ];

  const [step, setStep] = useState(0);
  const [brief, setBrief] = useState<Brief>({
    event_type: "",
    date: "",
    time: "",
    guest_count: 50,
    budget: "",
    dietary: [],
    cuisine: "",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [errors, setErrors] = useState<string | null>(null);

  const autoAdvanceTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const clearAdvance = () => {
    if (autoAdvanceTimeout.current) {
      clearTimeout(autoAdvanceTimeout.current);
      autoAdvanceTimeout.current = null;
    }
  };

  const update = <K extends keyof Brief>(k: K, v: Brief[K]) => {
    clearAdvance();
    setBrief((b) => ({ ...b, [k]: v }));
    setErrors(null);
  };

  const selectAndAdvance = <K extends keyof Brief>(k: K, v: Brief[K]) => {
    update(k, v);
    if (autoAdvanceTimeout.current) {
      clearTimeout(autoAdvanceTimeout.current);
    }
    // Sleek 350ms delay so selection is visible before step change
    autoAdvanceTimeout.current = setTimeout(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, 350);
  };

  const toggleDiet = (d: string) => {
    clearAdvance();
    setBrief((b) => ({
      ...b,
      dietary: b.dietary.includes(d)
        ? b.dietary.filter((x) => x !== d)
        : [...b.dietary, d],
    }));
    setErrors(null);
  };

  const validateStep = (): string | null => {
    switch (STEPS[step].key) {
      case "type":
        return brief.event_type ? null : tt("Bitte wähle einen Event-Typ.", "Please select an event type.");
      case "date":
        if (!brief.date) return tt("Bitte wähle ein Datum.", "Please select a date.");
        if (new Date(brief.date) < new Date(new Date().toDateString()))
          return tt("Das Datum muss in der Zukunft liegen.", "The date must be in the future.");
        return null;
      case "guests":
        return brief.guest_count > 0 && brief.guest_count <= 5000
          ? null
          : tt("Gästezahl muss zwischen 1 und 5000 liegen.", "Guest count must be between 1 and 5000.");
      case "budget":
        return brief.budget ? null : tt("Bitte wähle eine Budget-Stufe.", "Please select a budget level.");
      case "cuisine":
        return brief.cuisine ? null : tt("Bitte wähle eine Küchenrichtung.", "Please select a cuisine.");
      default:
        return null;
    }
  };

  const next = () => {
    clearAdvance();
    const e = validateStep();
    if (e) return setErrors(e);
    setErrors(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => {
    clearAdvance();
    setErrors(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  const submit = async () => {
    clearAdvance();
    setStatus("loading");
    const payload = {
      event_type: brief.event_type,
      date: brief.date,
      guest_count: brief.guest_count,
      budget: brief.budget,
      requirements: {
        time: brief.time,
        dietary: brief.dietary,
        cuisine: brief.cuisine,
        notes: brief.notes,
      },
    };
    // eslint-disable-next-line no-console
    console.log("[catering_briefs] insert →", payload);
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("success");
  };

  const progress = ((step + 1) / STEPS.length) * 100;
  const CurrentIcon = STEPS[step]?.icon || PartyPopper;

  const getStepQuestion = () => {
    if (step >= STEPS.length) return "";
    switch (STEPS[step].key) {
      case "type":
        return tt("Welche Art von Event planst du?", "What kind of event are you planning?");
      case "date":
        return tt("Wann findet dein Event statt?", "When is your event taking place?");
      case "guests":
        return tt("Wie viele Gäste erwartest du?", "How many guests are you expecting?");
      case "budget":
        return tt("Wie hoch ist dein Budget pro Gast?", "What is your budget per guest?");
      case "diet":
        return tt("Gibt es Ernährungsanforderungen?", "Are there any dietary requirements?");
      case "cuisine":
        return tt("Welche Küchenrichtung bevorzugst du?", "Which cuisine do you prefer?");
      case "review":
        return tt("Überprüfe dein Event-Briefing", "Review your event brief");
      default:
        return STEPS[step].label;
    }
  };

  return (
    <SiteShell>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/planner-clean.png"
            fetchPriority="high"
            alt="Event Planner Background"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/90 to-forest/40" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-white/90 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#b28a3c]" />
              {tt("Kostenloses Guided Briefing", "Free Guided Briefing")}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-[1.05] tracking-tight drop-shadow-sm">
              {tt("Der perfekte Planner für dein ", "The perfect planner for your ")}
              <span className="text-[#b28a3c]">{tt("Event.", "event.")}</span>
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-xl leading-relaxed">
              {tt(
                "Plane dein Event stressfrei. Beantworte ein paar Fragen in unserem kostenlosen Concierge-Briefing und wir matchen dich mit verifizierten Experten.",
                "Plan your event stress-free. Answer a few questions in our free concierge briefing and we match you with verified experts."
              )}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => document.getElementById("guided-briefing")?.scrollIntoView({ behavior: "smooth" })}
                className="rounded-full bg-[#b28a3c] hover:bg-[#9a7633] text-white px-6 py-3.5 text-sm font-semibold shadow-xl shadow-[#b28a3c]/20 transition-all cursor-pointer"
              >
                {tt("Kostenlos starten", "Start for free")}
              </button>
            </div>
          </div>
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 aspect-[4/3] max-h-[360px] group">
             <img src="/planner-clean.png" fetchPriority="high" alt="Premium Event Planner" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
             <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-transparent to-transparent opacity-60" />
             <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md rounded-xl p-3 shadow-xl border border-white/20 flex items-center gap-3">
                <div className="p-2 bg-[#b28a3c]/20 rounded-lg text-[#f2d896]">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <div className="text-[12px] font-bold text-white leading-none">
                  <div>100% {tt("Kostenlos", "Free")}</div>
                  <div className="text-[10px] text-white/60 font-medium mt-1">{tt("Unverbindliches Matching", "No obligation matching")}</div>
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* Main Directory & Discovery Workspace */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 mt-12 pb-8 relative z-10">
        <PlannerDirectory lang={lang} tt={tt} planners={planners} />
      </section>

      {/* AI Concierge Section */}
      <section id="guided-briefing" className="relative mt-8 lg:mt-12 py-24 lg:py-32 scroll-mt-24 overflow-hidden rounded-[2.5rem] lg:rounded-[4rem] mx-4 sm:mx-6 lg:mx-10 mb-16 shadow-2xl group">
        <div className="absolute inset-0 z-0">
          <img
            src="/planner-clean.png"
            loading="lazy"
            alt="Event Planner Assistant"
            className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a120c] via-forest/90 to-forest/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-forest/40 via-transparent to-black/60 opacity-90" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-4xl px-4 md:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#f2d896] mb-6 shadow-xl ring-1 ring-[#b28a3c]/30">
              <Sparkles className="h-4 w-4" />
              {tt("Guided Assistant", "Guided Assistant")}
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white drop-shadow-2xl mb-6 leading-[1.1]">
              {tt("Erstelle dein guided Briefing", "Build your guided brief")}
            </h2>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-md leading-relaxed">
              {tt("Beantworte ein paar Fragen und wir matchen dich mit passenden Planern.", "Answer a few questions and we will match you with suitable planners.")}
            </p>
          </div>
          
          {/* Sleek concierge wizard card with top pinned progress bar */}
          <div className="surface-card bg-white/95 backdrop-blur-2xl border border-white/60 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden rounded-[2rem] ring-1 ring-white/40">
            <div className="absolute top-0 left-0 right-0 h-[4px] bg-forest/10">
              <div
                className="h-full bg-gradient-to-r from-[#b28a3c] to-[#f2d896] shadow-[0_0_12px_rgba(178,138,60,0.8)] transition-all duration-500 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

          <div className="p-6 sm:p-10 pt-8 sm:pt-12">
            {step === STEPS.length ? (
              <>
                <SuccessView brief={brief} lang={lang} />
                <div className="mt-12 border-t border-forest/10 pt-12" id="listings">
                  <PlannerDirectory lang={lang} tt={tt} planners={planners} />
                </div>
              </>
            ) : (
              <>
                {/* Stepper Header */}
                <div className="flex items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="grid place-items-center h-10 w-10 rounded-full bg-forest/5 text-forest">
                      <CurrentIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-forest/40">
                        {tt("Schritt", "Step")} {step + 1} {tt("von", "of")} {STEPS.length}
                      </span>
                      <h3 className="font-display text-xl text-forest font-bold leading-tight">
                        {getStepQuestion()}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Step body */}
                <div key={step} className="animate-fade-in min-h-[250px]">
                  {STEPS[step].key === "type" && (
                    <CardGrid>
                      {eventTypes.map((e) => (
                        <ChoiceCard
                          key={e.id}
                          active={brief.event_type === e.id}
                          onClick={() => selectAndAdvance("event_type", e.id)}
                          title={e.title}
                          sub={e.sub}
                        />
                      ))}
                    </CardGrid>
                  )}

                  {STEPS[step].key === "date" && (
                    <div className="grid sm:grid-cols-2 gap-6">
                      <Field label={tt("Datum", "Date")}>
                        <input
                          type="date"
                          value={brief.date}
                          min={new Date().toISOString().slice(0, 10)}
                          onChange={(e) => update("date", e.target.value)}
                          className="w-full bg-transparent border-b border-forest/30 py-2 outline-none focus:border-forest text-forest font-semibold"
                        />
                      </Field>
                      <Field label={tt("Startzeit (optional)", "Start time (optional)")}>
                        <input
                          type="time"
                          value={brief.time}
                          onChange={(e) => update("time", e.target.value)}
                          className="w-full bg-transparent border-b border-forest/30 py-2 outline-none focus:border-forest text-forest font-semibold"
                        />
                      </Field>
                    </div>
                  )}

                  {STEPS[step].key === "guests" && (
                    <div className="max-w-md">
                      <Field label={tt("Anzahl Gäste", "Number of guests")}>
                        <input
                          type="number"
                          min={1}
                          max={5000}
                          value={brief.guest_count}
                          onChange={(e) =>
                            update("guest_count", Number(e.target.value) || 0)
                          }
                          className="w-full bg-transparent border-b border-forest/30 py-2 text-2xl font-display text-forest outline-none focus:border-forest font-bold"
                        />
                      </Field>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {[20, 50, 100, 200, 500].map((n) => (
                          <button
                            key={n}
                            onClick={() => selectAndAdvance("guest_count", n)}
                            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition cursor-pointer ${
                              brief.guest_count === n
                                ? "bg-forest text-[oklch(0.97_0.02_92)]"
                                : "bg-forest/5 text-forest hover:bg-forest/10"
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {STEPS[step].key === "budget" && (
                    <CardGrid>
                      {budgets.map((b) => (
                        <ChoiceCard
                          key={b.id}
                          active={brief.budget === b.id}
                          onClick={() => selectAndAdvance("budget", b.id)}
                          title={b.title}
                          sub={b.sub}
                        />
                      ))}
                    </CardGrid>
                  )}

                  {STEPS[step].key === "diet" && (
                    <div>
                      <p className="text-sm text-forest/70 mb-4">
                        {tt("Mehrfachauswahl möglich — überspringen, falls keine Einschränkungen.", "Multiple selection possible — skip if no restrictions.")}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {dietOptions.map((d) => {
                          const on = brief.dietary.includes(d);
                          return (
                            <button
                              key={d}
                              onClick={() => toggleDiet(d)}
                              className={`rounded-full px-4 py-2 text-sm font-semibold transition inline-flex items-center gap-1.5 cursor-pointer ${
                                on
                                  ? "bg-forest text-[oklch(0.97_0.02_92)]"
                                  : "bg-forest/5 text-forest hover:bg-forest/10"
                              }`}
                            >
                              {on && <Check className="h-3.5 w-3.5" />}
                              {d}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {STEPS[step].key === "cuisine" && (
                    <CardGrid>
                      {cuisines.map((c) => (
                        <ChoiceCard
                          key={c.id}
                          active={brief.cuisine === c.id}
                          onClick={() => selectAndAdvance("cuisine", c.id)}
                          title={c.label}
                        />
                      ))}
                    </CardGrid>
                  )}

                  {STEPS[step].key === "review" && (
                    <div>
                      <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                        <Row label={tt("Event", "Event")}>
                          {eventTypes.find((e) => e.id === brief.event_type)?.title || "—"}
                        </Row>
                        <Row label={tt("Datum", "Date")}>
                          {brief.date || "—"}
                          {brief.time ? ` · ${brief.time}` : ""}
                        </Row>
                        <Row label={tt("Gäste", "Guests")}>{brief.guest_count}</Row>
                        <Row label={tt("Budget", "Budget")}>
                          {budgets.find((b) => b.id === brief.budget)?.sub || "—"}
                        </Row>
                        <Row label={tt("Diät", "Diet")}>
                          {brief.dietary.length ? brief.dietary.join(", ") : tt("Keine", "None")}
                        </Row>
                        <Row label={tt("Küche", "Cuisine")}>
                          {cuisines.find((c) => c.id === brief.cuisine)?.label || "—"}
                        </Row>
                      </dl>
                      <div className="mt-6">
                        <Field label={tt("Zusätzliche Wünsche (optional)", "Additional wishes (optional)")}>
                          <textarea
                            rows={3}
                            value={brief.notes}
                            onChange={(e) => update("notes", e.target.value)}
                            placeholder={tt("z. B. Live-Cooking-Station, glutenfreie Torte, Bar-Setup …", "e.g. live cooking station, gluten-free cake, bar setup …")}
                            className="w-full bg-transparent border border-forest/20 rounded-lg p-3 outline-none focus:border-forest text-forest text-sm font-medium"
                          />
                        </Field>
                      </div>
                    </div>
                  )}
                </div>

                {errors && (
                  <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {errors}
                  </div>
                )}

                {/* Footer nav */}
                <div className="mt-8 flex items-center justify-between gap-3 border-t border-forest/10 pt-6">
                  <button
                    onClick={back}
                    disabled={step === 0}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-forest hover:bg-forest/5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" /> {tt("Zurück", "Back")}
                  </button>
                  {step < STEPS.length - 1 ? (
                    <button
                      onClick={next}
                      className="inline-flex items-center gap-2 rounded-full bg-forest text-[oklch(0.97_0.02_92)] px-6 py-3 text-sm font-semibold hover:opacity-90 cursor-pointer shadow-sm"
                    >
                      {tt("Weiter", "Next")} <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={submit}
                      disabled={status === "loading"}
                      className="inline-flex items-center gap-2 rounded-full bg-forest text-[oklch(0.97_0.02_92)] px-6 py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-60 cursor-pointer shadow-md"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> {tt("Sende …", "Sending …")}
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" /> {tt("Briefing senden", "Send brief")}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        </div>
      </section>

      {/* Trust Section */}
      <TrustSection
        badgeText={tt("SICHERHEIT & VERTRAUEN", "TRUST & QUALITY")}
        headline={tt("Professionelle Event-Planung", "Professional Event Planning")}
        items={[
          {
            icon: Briefcase,
            title: tt("Expert Consultation", "Expert Consultation"),
            description: tt("Profitieren Sie von der Erfahrung verifizierter Profis.", "Benefit from the experience of verified professionals."),
          },
          {
            icon: Sparkles,
            title: tt("Better Vendor Matching", "Better Vendor Matching"),
            description: tt("Wir matchen Sie genau mit den passenden Planern für Ihr Budget und Event.", "We match you perfectly with planners for your budget and event."),
          },
          {
            icon: ClipboardCheck,
            title: tt("Less Planning Stress", "Less Planning Stress"),
            description: tt("Lehnen Sie sich zurück. Ihre Pläne werden detailliert in die Tat umgesetzt.", "Sit back. Your plans are put into action with detail."),
          },
        ]}
      />

      {/* FAQ Section CTA */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-10 py-16 md:py-24 text-center">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-forest mb-4">
          {tt("Noch Fragen?", "Have Questions?")}
        </h2>
        <p className="text-forest/70 mb-8 max-w-xl mx-auto">
          {tt(
            "Wir haben die wichtigsten Antworten für dich in unserem umfangreichen FAQ-Bereich zusammengestellt.",
            "We've compiled the most important answers for you in our comprehensive FAQ section."
          )}
        </p>
        <Link 
          to="/faq" 
          className="inline-flex items-center gap-2 rounded-full bg-cream text-forest px-6 py-3 font-medium hover:bg-cream/80 transition"
        >
          {tt("Zum FAQ Bereich", "Read our FAQs")}
        </Link>
      </section>

      {/* Footer Promise CTA */}
      <MarketplacePromiseCTA />
    </SiteShell>
  );
}

function CardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

function ChoiceCard({
  active,
  onClick,
  title,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  sub?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-2xl border p-5 transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:outline-none ${
        active
          ? "border-forest bg-forest text-[oklch(0.97_0.02_92)] shadow-md"
          : "border-forest/15 bg-cream/70 hover:border-forest/40 hover:bg-cream text-forest"
      }`}
    >
      <div className="font-display text-lg font-bold">{title}</div>
      {sub && (
        <div className={`mt-1.5 text-xs leading-relaxed ${active ? "opacity-80" : "text-forest/60"}`}>
          {sub}
        </div>
      )}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-forest/50 mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-forest/10 py-2">
      <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-forest/50">
        {label}
      </dt>
      <dd className="text-forest font-semibold text-right">{children}</dd>
    </div>
  );
}

function SuccessView({ brief, lang }: { brief: Brief; lang: string }) {
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
  return (
    <div className="text-center py-8 animate-fade-in">
      <div className="mx-auto grid place-items-center h-16 w-16 rounded-full bg-forest text-[oklch(0.97_0.02_92)]">
        <Check className="h-8 w-8" />
      </div>
      <h2 className="mt-5 font-display text-3xl text-forest font-bold">
        {tt("Briefing gesendet!", "Brief sent!")}
      </h2>
      <p className="mt-3 max-w-md mx-auto text-forest/70 text-sm">
        {tt(
          `Wir matchen deine Anfrage mit passenden Caterern für ${brief.guest_count} Gäste. Du hörst innerhalb von 24 h von uns.`,
          `We are matching your request with suitable caterers for ${brief.guest_count} guests. You will hear from us within 24 hours.`,
        )}
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          to="/catering"
          className="inline-flex items-center gap-2 rounded-full bg-forest text-[oklch(0.97_0.02_92)] px-6 py-3 text-sm font-semibold hover:opacity-90 shadow-sm"
        >
          {tt("Caterer entdecken", "Discover caterers")} <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-forest/5 text-forest px-6 py-3 text-sm font-semibold hover:bg-forest/10"
        >
          {tt("Zur Startseite", "Back to home")}
        </Link>
      </div>
    </div>
  );
}

type PlannerCat = "all" | "wedding" | "corporate" | "private" | "ramadan" | "christmas" | "festival";
type PlannerSort = "price-asc" | "price-desc" | "experience";
type ServiceType = "all" | "full" | "day-of" | "consulting";

const PLANNER_CITIES = ["Berlin", "Hamburg", "München", "Köln", "Frankfurt", "Stuttgart", "Düsseldorf", "Leipzig"];

function PlannerDirectory({ lang, tt, planners }: { lang: string; tt: (de: string, en: string) => string; planners: Planner[] }) {
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");
  const [cat, setCat] = useState<PlannerCat>("all");
  const [city, setCity] = useState("");
  const [service, setService] = useState<ServiceType>("all");
  const [sort, setSort] = useState<PlannerSort>("price-asc");

  const cats: { id: PlannerCat; label: string }[] = [
    { id: "all", label: tt("Alle", "All") },
    { id: "wedding", label: tt("Hochzeit", "Wedding") },
    { id: "corporate", label: tt("Corporate", "Corporate") },
    { id: "private", label: tt("Privates Dinner", "Private Dinner") },
    { id: "ramadan", label: tt("Ramadan Iftar", "Ramadan Iftar") },
    { id: "christmas", label: tt("Weihnachtsfeier", "Christmas Party") },
    { id: "festival", label: tt("Festival", "Festival") },
  ];

  const services: { id: ServiceType; label: string }[] = [
    { id: "all", label: tt("Alle", "All") },
    { id: "full", label: tt("Full-Service Planung", "Full-service planning") },
    { id: "day-of", label: tt("Tag-Koordination", "Day-of coordination") },
    { id: "consulting", label: tt("Nur Beratung", "Consulting only") },
  ];

  const filtered = useMemo(() => {
    return planners.filter((p) => {
      if (cat !== "all" && p.cat !== cat) return false;
      if (city && !p.area?.toLowerCase().includes(city.toLowerCase())) return false;
      if (guests && p.minGuests > Number(guests)) return false;
      return true;
    });
  }, [cat, city, guests]);

  const visible = useMemo(() => {
    const arr = [...filtered];
    if (sort === "price-asc") arr.sort((a, b) => a.startingPrice - b.startingPrice);
    else if (sort === "price-desc") arr.sort((a, b) => b.startingPrice - a.startingPrice);
    else arr.sort((a, b) => a.since - b.since);
    return arr;
  }, [filtered, sort]);

  // Compute live category counts based on city & guest filters (excluding cat filter itself)
  const catCounts = useMemo(() => {
    const counts: Record<PlannerCat, number> = {
      all: planners.length,
      wedding: 0,
      corporate: 0,
      private: 0,
      ramadan: 0,
      christmas: 0,
      festival: 0,
    };

    counts.all = planners.filter((p) => {
      if (city && !p.area?.toLowerCase().includes(city.toLowerCase())) return false;
      if (guests && p.minGuests > Number(guests)) return false;
      return true;
    }).length;

    (Object.keys(counts) as PlannerCat[]).forEach((k) => {
      if (k === "all") return;
      counts[k] = planners.filter((p) => {
        if (p.cat !== k) return false;
        if (city && !p.area?.toLowerCase().includes(city.toLowerCase())) return false;
        if (guests && p.minGuests > Number(guests)) return false;
        return true;
      }).length;
    });

    return counts;
  }, [city, guests]);

  const reset = () => {
    setDate(""); setGuests(""); setCat("all"); setCity(""); setService("all"); setSort("price-asc");
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": visible.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "LocalBusiness",
        "name": p.name,
        "url": `https://speisely.de/planner/${p.id}`
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Widescreen search bar with dividers */}
      <div className="surface-card bg-cream/90 p-3 shadow-lg border border-[#eadfce]/45 grid gap-2 sm:grid-cols-2 lg:grid-cols-5 rounded-2xl md:rounded-full divide-y md:divide-y-0 md:divide-x divide-[#eadfce]/30">
        <PField icon={<CalendarIcon className="h-4 w-4 text-forest/70" />} label={tt("Datum", "Date")}>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-forest font-semibold cursor-pointer"
          />
        </PField>
        <PField icon={<Users className="h-4 w-4 text-forest/70" />} label={tt("Gäste", "Guests")}>
          <input
            type="number"
            min={1}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            placeholder="50"
            className="w-full bg-transparent outline-none text-sm text-forest font-semibold placeholder:text-forest/30"
          />
        </PField>
        <PField icon={<PartyPopper className="h-4 w-4 text-forest/70" />} label={tt("Anlass", "Purpose")}>
          <select 
            value={cat} 
            onChange={(e) => setCat(e.target.value as PlannerCat)} 
            className="w-full bg-transparent outline-none text-sm text-forest font-semibold cursor-pointer"
          >
            {cats.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </PField>
        <PField icon={<MapPinIcon className="h-4 w-4 text-forest/70" />} label={tt("Stadt", "City")}>
          <select 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            className="w-full bg-transparent outline-none text-sm text-forest font-semibold cursor-pointer"
          >
            <option value="">{tt("Alle", "All")}</option>
            {PLANNER_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </PField>
        <PField icon={<Briefcase className="h-4 w-4 text-forest/70" />} label={tt("Service-Typ", "Service type")}>
          <select 
            value={service} 
            onChange={(e) => setService(e.target.value as ServiceType)} 
            className="w-full bg-transparent outline-none text-sm text-forest font-semibold cursor-pointer"
          >
            {services.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </PField>
      </div>

      {/* Category chips with live, non-wrapping counts */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 shrink-0 ${
                cat === c.id 
                  ? "bg-forest text-[oklch(0.97_0.02_92)] shadow-sm" 
                  : "bg-cream text-forest hover:bg-[oklch(0.93_0.04_92)] border border-forest/10"
              }`}
            >
              <span>{c.label}</span>
              <span className={`text-[10px] rounded px-1.5 py-0.5 leading-none transition-colors font-bold ${
                cat === c.id
                  ? "bg-[#16372f] text-[#eadfce]"
                  : "bg-forest/5 text-forest/70"
              }`}>
                {catCounts[c.id]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Clearly readable active filter pills */}
      {(cat !== "all" || city !== "" || service !== "all" || date !== "" || guests !== "") && (
        <div className="mt-4 flex flex-wrap items-center gap-2 p-3 bg-cream/90 border border-[#eadfce]/45 shadow-sm rounded-2xl animate-fade-in text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider text-forest/60 mr-1">
            {tt("Aktive Filter:", "Active Filters:")}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {cat !== "all" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#16372f] px-3 py-1 text-xs font-semibold text-[#eadfce] shadow-sm">
                <span>{cats.find(c => c.id === cat)?.label}</span>
                <button
                  onClick={() => setCat("all")}
                  className="hover:text-white hover:bg-white/10 rounded-full h-4 w-4 inline-flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
                  aria-label="Remove filter"
                >
                  ×
                </button>
              </span>
            )}
            {city !== "" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#16372f] px-3 py-1 text-xs font-semibold text-[#eadfce] shadow-sm">
                <span>{city}</span>
                <button
                  onClick={() => setCity("")}
                  className="hover:text-white hover:bg-white/10 rounded-full h-4 w-4 inline-flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
                  aria-label="Remove filter"
                >
                  ×
                </button>
              </span>
            )}
            {service !== "all" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#16372f] px-3 py-1 text-xs font-semibold text-[#eadfce] shadow-sm">
                <span>{services.find(s => s.id === service)?.label}</span>
                <button
                  onClick={() => setService("all")}
                  className="hover:text-white hover:bg-white/10 rounded-full h-4 w-4 inline-flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
                  aria-label="Remove filter"
                >
                  ×
                </button>
              </span>
            )}
            {date !== "" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#16372f] px-3 py-1 text-xs font-semibold text-[#eadfce] shadow-sm">
                <span>📅 {new Date(date).toLocaleDateString()}</span>
                <button
                  onClick={() => setDate("")}
                  className="hover:text-white hover:bg-white/10 rounded-full h-4 w-4 inline-flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
                  aria-label="Remove filter"
                >
                  ×
                </button>
              </span>
            )}
            {guests !== "" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#16372f] px-3 py-1 text-xs font-semibold text-[#eadfce] shadow-sm">
                <span>👥 {guests} {tt("Gäste", "guests")}</span>
                <button
                  onClick={() => setGuests("")}
                  className="hover:text-white hover:bg-white/10 rounded-full h-4 w-4 inline-flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
                  aria-label="Remove filter"
                >
                  ×
                </button>
              </span>
            )}
          </div>
          <button 
            onClick={reset} 
            className="text-xs font-bold text-brand-orange hover:underline ml-auto cursor-pointer"
          >
            {tt("Alle zurücksetzen", "Reset all")}
          </button>
        </div>
      )}

      {/* Directory Section */}
      <div className="mt-12 pb-16">
        {/* Results Metadata & Sort Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eadfce]/30 pb-4 mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-display font-bold text-forest">
              {tt("Top Event-Planer", "Top event planners")}
            </h2>
            <span className="inline-flex items-center rounded-full bg-[#16372f]/10 px-3 py-1 text-xs font-bold text-forest border border-[#16372f]/15">
              {visible.length} {visible.length === 1 ? tt("Planer", "planner") : tt("Planer", "planners")}
            </span>
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-forest/40">{tt("Sortieren", "Sort by")}</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as PlannerSort)}
              className="bg-cream border border-[#eadfce]/45 rounded-full px-4 py-1.5 text-xs font-semibold text-forest outline-none focus:border-forest cursor-pointer shadow-sm"
            >

              <option value="price-asc">{tt("Preis (aufsteigend)", "Price (low to high)")}</option>
              <option value="price-desc">{tt("Preis (absteigend)", "Price (high to low)")}</option>
              <option value="experience">{tt("Erfahrung (älteste zuerst)", "Most experienced (oldest first)")}</option>
            </select>
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="surface-card flex flex-col items-center justify-center text-center py-16 px-6 bg-cream border border-[#eadfce]/40">
            <UtensilsCrossed className="h-10 w-10 text-forest/50" />
            <h3 className="mt-4 font-display text-xl text-forest">{tt("Keine Planer gefunden", "No planners found")}</h3>
            <p className="mt-2 text-sm text-forest/70 max-w-md">
              {tt("Versuche andere Filter oder ein anderes Datum.", "Try different filters or another date.")}
            </p>
            <button
              onClick={reset}
              className="mt-5 rounded-full bg-forest px-5 py-2 text-sm text-[oklch(0.97_0.02_92)] hover:opacity-90 transition cursor-pointer"
            >
              {tt("Filter zurücksetzen", "Reset filters")}
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <Link
                key={p.id}
                to="/planner/$slug"
                params={{ slug: p.id }}
                className="surface-card group bg-cream border border-[#eadfce]/40 overflow-hidden flex flex-col transition-all duration-300 hover:ring-2 hover:ring-forest hover:shadow-lg focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <div className="overflow-hidden relative w-full aspect-[16/10]">
                  <img
                    src={p.img || undefined}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    width={600}
                    height={375}
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-700 shadow-md flex items-center gap-1 border border-emerald-500/20 uppercase tracking-wider">
                    {tt("Buchbar", "Bookable")}
                  </div>
                  {p.isShowcase && (
                    <div className="absolute top-3 left-3 bg-forest/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-md flex items-center gap-1 uppercase tracking-wider">
                      Demo Provider
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-xl text-forest font-bold truncate group-hover:text-emerald-800 transition-colors">{p.name}</h3>
                    {p.verified && (
                      <BadgeCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-forest/70 font-semibold line-clamp-1">{p.tagline[lang as "de" | "en"]}</p>
                  
                  {/* Category Pill */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    <span className="text-[10px] bg-cream/30 border border-forest/10 px-2 py-0.5 rounded text-forest font-bold capitalize">
                      {p.cat} Planner
                    </span>
                  </div>

                  {p.gallery.length > 1 && (
                    <div className="mt-4 flex gap-1.5 flex-wrap">
                      {p.gallery.slice(1, 5).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt=""
                          className="h-10 w-10 rounded-md object-cover border border-[#eadfce] hover:border-forest/50 transition-colors"
                          loading="lazy"
                        />
                      ))}
                    </div>
                  )}

                  {/* Fully mobile-safe layout-stable footer metadata */}
                  <div className="mt-auto pt-4 border-t border-[#eadfce]/20 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 text-xs text-forest/60 font-sans">
                    <div className="flex flex-col gap-0.5 min-w-[140px] flex-1">
                      <span className="font-bold text-forest truncate" title={p.area || ""}>{p.area}</span>
                      <span className="text-[11px] font-semibold whitespace-nowrap">{tt(`ab ${p.minGuests} Gäste`, `from ${p.minGuests} guests`)} · {tt("seit", "since")} {p.since}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[9px] uppercase tracking-wider text-forest/40 leading-none">{tt("Start", "Starts")}</div>
                      <div className="text-base text-forest font-bold mt-0.5 whitespace-nowrap">
                        {tt(`ab €${p.startingPrice.toLocaleString("de-DE")}`, `from €${p.startingPrice.toLocaleString("en-US")}`)}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function PField({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-3 px-4 py-2 hover:bg-cream/20 transition rounded-xl md:rounded-full cursor-pointer focus-within:ring-1 focus-within:ring-forest/30">
      <span className="text-forest/70 shrink-0">{icon}</span>
      <span className="flex-1 min-w-0 text-left">
        <span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-forest/40 leading-none mb-1">{label}</span>
        {children}
      </span>
    </label>
  );
}

