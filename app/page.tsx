"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Sparkles,
  Users,
  Wallet,
  WandSparkles,
} from "lucide-react";
import { SpeiselyHeader } from "@/components/layout/SpeiselyHeader";
import { useT } from "@/lib/i18n/context";

const images = {
  hero:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=85",
  wedding:
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=85",
  corporate:
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=85",
  private:
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=900&q=85",
  ramadan:
    "https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=900&q=85",
  christmas:
    "https://images.unsplash.com/photo-1481930916222-5ec4696fc0f2?auto=format&fit=crop&w=900&q=85",
};

const examples = [
  "Hochzeit für 80 Gäste in Berlin, vegetarisch, elegantes Buffet, €45 p.P.",
  "Business Lunch für 45 Personen in Frankfurt, modern, vegetarische Optionen",
  "Private Dinner für 20 Gäste in München, Fine Dining, mediterran",
  "Ramadan Iftar für 60 Gäste in Berlin, halal Buffet, warme Speisen",
];

const occasionCards = [
  {
    titleKey: "home.occasions.wedding.title",
    titleFallback: "Hochzeit",
    descKey: "home.occasions.wedding.desc",
    descFallback: "Elegantes Catering für kleine Feiern und große Hochzeiten.",
    image: images.wedding,
    alt: "Eleganter Hochzeitstisch mit Catering",
    href: "/request/new?occasion=wedding&start=1",
  },
  {
    titleKey: "home.occasions.corporate.title",
    titleFallback: "Business Lunch",
    descKey: "home.occasions.corporate.desc",
    descFallback: "Premium Catering für Meetings, Offsites und Firmenevents.",
    image: images.corporate,
    alt: "Business Event Catering",
    href: "/request/new?occasion=corporate&start=1",
  },
  {
    titleKey: "home.occasions.private.title",
    titleFallback: "Privates Dinner",
    descKey: "home.occasions.private.desc",
    descFallback:
      "Individuelles Catering für Geburtstage, Familienfeiern und private Dinner.",
    image: images.private,
    alt: "Privates Dinner mit Catering",
    href: "/request/new?occasion=private&start=1",
  },
  {
    titleKey: "home.occasions.ramadan.title",
    titleFallback: "Ramadan Iftar",
    descKey: "home.occasions.ramadan.desc",
    descFallback:
      "Elegantes Iftar-Catering für Familien, Unternehmen und Communities.",
    image: images.ramadan,
    alt: "Iftar Dinner Tisch",
    href: "/request/new?occasion=ramadan&start=1",
  },
  {
    titleKey: "home.occasions.christmas.title",
    titleFallback: "Weihnachtsfeier",
    descKey: "home.occasions.christmas.desc",
    descFallback:
      "Festliches Catering für Firmenfeiern, Familienessen und Winterevents.",
    image: images.christmas,
    alt: "Weihnachtlicher Catering-Tisch",
    href: "/request/new?occasion=christmas&start=1",
  },
];

function extractCityFromText(query: string) {
  const text = query.trim();
  const lower = text.toLowerCase();

  const knownCities: Array<[string, string]> = [
    ["frankfurt am main", "Frankfurt am Main"],
    ["bergisch gladbach", "Bergisch Gladbach"],
    ["mönchengladbach", "Mönchengladbach"],
    ["moenchengladbach", "Mönchengladbach"],
    ["munchengladbach", "Mönchengladbach"],
    ["berlin", "Berlin"],
    ["hamburg", "Hamburg"],
    ["münchen", "München"],
    ["munich", "München"],
    ["frankfurt", "Frankfurt am Main"],
    ["köln", "Köln"],
    ["cologne", "Köln"],
    ["düsseldorf", "Düsseldorf"],
    ["duesseldorf", "Düsseldorf"],
    ["dresden", "Dresden"],
    ["leipzig", "Leipzig"],
    ["stuttgart", "Stuttgart"],
    ["dortmund", "Dortmund"],
    ["essen", "Essen"],
    ["bremen", "Bremen"],
    ["hannover", "Hannover"],
    ["nürnberg", "Nürnberg"],
    ["nuremberg", "Nürnberg"],
    ["duisburg", "Duisburg"],
    ["bochum", "Bochum"],
    ["wuppertal", "Wuppertal"],
    ["bielefeld", "Bielefeld"],
    ["bonn", "Bonn"],
    ["münster", "Münster"],
    ["muenster", "Münster"],
    ["karlsruhe", "Karlsruhe"],
    ["mannheim", "Mannheim"],
    ["augsburg", "Augsburg"],
    ["wiesbaden", "Wiesbaden"],
    ["paderborn", "Paderborn"],
  ];

  for (const [needle, label] of knownCities) {
    if (lower.includes(needle)) return label;
  }

  const cityMatch = text.match(
    /\b(?:in|at|near|bei|around|um)\s+([A-ZÄÖÜ][a-zA-ZäöüÄÖÜß\-\s]{2,35})/
  );

  if (cityMatch?.[1]) {
    const cleaned = cityMatch[1]
      .replace(/[,.;].*$/, "")
      .replace(
        /\b(fine|dining|dinning|buffet|elegant|elegantes|vegetarian|vegetarisch|vegan|halal|modern|birthday|party|wedding|hochzeit|business|lunch|dinner|ramadan|iftar).*$/i,
        ""
      )
      .trim();

    if (cleaned.length >= 2) return cleaned;
  }

  return "";
}

function extractPreview(query: string) {
  const lower = query.toLowerCase();

  const guestMatch =
    query.match(
      /(\d+)\s?(gäste|gast|personen|person|guests|guest|people|persons|pax)/i
    ) ||
    query.match(/für\s+(\d+)/i) ||
    query.match(/for\s+(\d+)/i);

  const budgetMatch =
    query.match(/€\s?\d+/) ||
    query.match(
      /\d+\s?(€|eur|euro|euros?)\s?(p\.p\.|pp|pro person|per person)?/i
    );

  const eventKey =
    lower.includes("business") ||
    lower.includes("corporate") ||
    lower.includes("office") ||
    lower.includes("firma") ||
    lower.includes("lunch")
      ? "business"
      : lower.includes("hochzeit") || lower.includes("wedding")
        ? "wedding"
        : lower.includes("birthday") ||
            lower.includes("geburtstag") ||
            lower.includes("party")
          ? "birthday"
          : lower.includes("ramadan") || lower.includes("iftar")
            ? "ramadan"
            : lower.includes("private") || lower.includes("dinner")
              ? "private"
              : lower.includes("weihnacht") || lower.includes("christmas")
                ? "christmas"
                : "unknown";

  const styleKey =
    lower.includes("fine dining") ||
    lower.includes("fine dinning") ||
    lower.includes("fine")
      ? "fineDining"
      : lower.includes("buffet")
        ? "buffet"
        : lower.includes("finger food") || lower.includes("fingerfood")
          ? "fingerfood"
          : lower.includes("bbq") || lower.includes("grill")
            ? "bbq"
            : lower.includes("elegant") || lower.includes("elegantes")
              ? "elegant"
              : lower.includes("modern")
                ? "modern"
                : lower.includes("halal")
                  ? "halal"
                  : lower.includes("vegetar")
                    ? "vegetarian"
                    : lower.includes("vegan")
                      ? "vegan"
                      : "open";

  return {
    eventKey,
    city: extractCityFromText(query),
    guests: guestMatch?.[1] || "",
    budget: budgetMatch?.[0] || "",
    styleKey,
  };
}

export default function Home() {
  const t = useT();
  const router = useRouter();
  const [heroQuery, setHeroQuery] = useState(examples[0]);

  const aiPreview = useMemo(() => extractPreview(heroQuery), [heroQuery]);

  const eventLabel =
    aiPreview.eventKey === "business"
      ? t("home.aiHero.event.business", "Business Event")
      : aiPreview.eventKey === "wedding"
        ? t("home.aiHero.event.wedding", "Hochzeit")
        : aiPreview.eventKey === "birthday"
          ? t("home.aiHero.event.birthday", "Geburtstag / Party")
          : aiPreview.eventKey === "ramadan"
            ? t("home.aiHero.event.ramadan", "Ramadan Iftar")
            : aiPreview.eventKey === "private"
              ? t("home.aiHero.event.private", "Privates Dinner")
              : aiPreview.eventKey === "christmas"
                ? t("home.aiHero.event.christmas", "Weihnachtsfeier")
                : t("home.aiHero.event.unknown", "Event erkannt");

  const styleLabel =
    aiPreview.styleKey === "fineDining"
      ? t("home.aiHero.style.fineDining", "Fine Dining")
      : aiPreview.styleKey === "buffet"
        ? t("home.aiHero.style.buffet", "Buffet")
        : aiPreview.styleKey === "fingerfood"
          ? t("home.aiHero.style.fingerfood", "Fingerfood")
          : aiPreview.styleKey === "bbq"
            ? t("home.aiHero.style.bbq", "BBQ")
            : aiPreview.styleKey === "elegant"
              ? t("home.aiHero.style.elegant", "Elegant")
              : aiPreview.styleKey === "modern"
                ? t("home.aiHero.style.modern", "Modern")
                : aiPreview.styleKey === "halal"
                  ? t("home.aiHero.style.halal", "Halal Catering")
                  : aiPreview.styleKey === "vegetarian"
                    ? t("home.aiHero.style.vegetarian", "Vegetarisch")
                    : aiPreview.styleKey === "vegan"
                      ? t("home.aiHero.style.vegan", "Vegan")
                      : t("home.aiHero.style.open", "Stil offen");

  function startRequest() {
    const query = heroQuery.trim();

    if (query.length > 0) {
      router.push(`/request/new?query=${encodeURIComponent(query)}&start=1`);
      return;
    }

    router.push("/request/new");
  }

  const chips = [
    {
      label: t("home.hero.chipWedding", "Hochzeit"),
      href: "/request/new?occasion=wedding&start=1",
    },
    {
      label: t("home.hero.chipCorporate", "Business Lunch"),
      href: "/request/new?occasion=corporate&start=1",
    },
    {
      label: t("home.hero.chipPrivate", "Privates Dinner"),
      href: "/request/new?occasion=private&start=1",
    },
    {
      label: t("home.hero.chipRamadan", "Ramadan Iftar"),
      href: "/request/new?occasion=ramadan&start=1",
    },
    {
      label: t("home.hero.chipChristmas", "Weihnachtsfeier"),
      href: "/request/new?occasion=christmas&start=1",
    },
  ];

  return (
    <main className="min-h-screen bg-[#faf6ee] text-[#16372f]">
      <SpeiselyHeader />

      <section className="relative overflow-hidden">
        <Image
          src={images.hero}
          alt={t("home.aiHero.heroAlt", "Premium Catering Event Tisch")}
          fill
          priority
          sizes="100vw"
          className="object-cover scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#102f28]/95 via-[#102f28]/82 to-[#102f28]/45" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(215,182,109,0.22),transparent_32%),radial-gradient(circle_at_85%_35%,rgba(255,255,255,0.14),transparent_28%)]" />

        <div className="relative mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-8 px-5 py-10 sm:px-6 lg:grid-cols-[1fr_0.82fr] lg:py-12 xl:min-h-[690px]">
          <div className="max-w-4xl text-white">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/85 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#d7b66d]" />
              {t("home.aiHero.badge", "KI-Concierge aktiv")}
            </div>

            <h1 className="premium-heading text-[clamp(2.7rem,5.8vw,5.6rem)] leading-[0.94]">
              {t("home.aiHero.titleLine1", "Beschreiben Sie Ihr Event.")}
              <span className="block text-[#d7b66d]">
                {t(
                  "home.aiHero.titleLine2",
                  "Speisely erstellt sofort Ihr Catering-Briefing."
                )}
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 md:text-lg md:leading-8">
              {t(
                "home.aiHero.subtitle",
                "Kein Suchen. Keine unübersichtlichen Listen. Speisely versteht Ihr Event und findet passende Caterer nach Ort, Gästezahl, Budget, Stil und Ernährungswünschen."
              )}
            </p>

            <div className="mt-7 max-w-3xl rounded-[1.65rem] border border-white/20 bg-white p-2.5 shadow-2xl md:flex">
              <input
                value={heroQuery}
                onChange={(event) => setHeroQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") startRequest();
                }}
                className="min-h-13 w-full flex-1 rounded-2xl px-4 text-[15px] leading-6 text-[#173f35] outline-none placeholder:text-[#8a9a94] md:px-5"
                placeholder={t(
                  "home.aiHero.placeholder",
                  "z. B. Hochzeit für 80 Gäste in Berlin, Buffet, €45 p.P."
                )}
              />

              <button
                type="button"
                onClick={startRequest}
                className="mt-3 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#c9a45c] px-6 text-sm font-semibold text-[#173f35] transition hover:bg-[#d7b66d] md:mt-0 md:w-auto"
              >
                {t("home.aiHero.cta", "KI-Briefing erstellen")}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 text-sm text-white/75">
              {t(
                "home.aiHero.autoDetect",
                "KI erkennt automatisch: Anlass · Gäste · Ort · Budget · Catering-Stil"
              )}
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5 text-sm">
              {chips.map((chip) => (
                <Link
                  key={chip.label}
                  href={chip.href}
                  className="rounded-full border border-white/25 bg-white/10 px-4 py-2 font-medium text-white/90 backdrop-blur transition hover:border-[#d7b66d] hover:bg-[#d7b66d] hover:text-[#102f28]"
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>

          <aside className="hidden rounded-[1.75rem] border border-white/20 bg-white/12 p-4 text-white shadow-2xl backdrop-blur-xl lg:block xl:p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#d7b66d]">
                  {t("home.aiHero.previewLabel", "Live KI-Preview")}
                </p>
                <h2 className="premium-heading mt-2 text-[clamp(1.55rem,2.2vw,2.25rem)] leading-tight text-white">
                  {t("home.aiHero.previewTitle", "Was Speisely versteht")}
                </h2>
              </div>

              <div className="rounded-2xl bg-white/10 p-3 text-[#d7b66d]">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 grid gap-2.5">
              {[
                {
                  icon: Sparkles,
                  label: t("home.aiHero.label.event", "Anlass"),
                  value: eventLabel,
                },
                {
                  icon: Users,
                  label: t("home.aiHero.label.guests", "Gäste"),
                  value: aiPreview.guests || t("home.aiHero.value.open", "Offen"),
                },
                {
                  icon: MapPin,
                  label: t("home.aiHero.label.city", "Ort"),
                  value: aiPreview.city || t("home.aiHero.city.open", "Ort offen"),
                },
                {
                  icon: Wallet,
                  label: t("home.aiHero.label.budget", "Budget"),
                  value:
                    aiPreview.budget ||
                    t("home.aiHero.budget.flexible", "Flexibel"),
                },
                {
                  icon: WandSparkles,
                  label: t("home.aiHero.label.style", "Stil"),
                  value: styleLabel,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-[1.15rem] border border-white/15 bg-white/10 p-3.5"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 shrink-0 text-[#d7b66d]" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                        {item.label}
                      </p>
                    </div>
                    <p className="mt-1.5 text-base font-semibold leading-6">
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 rounded-[1.15rem] border border-[#d7b66d]/30 bg-[#d7b66d]/15 p-4">
              <p className="text-sm font-semibold text-[#ffe2a0]">
                {t("home.aiHero.nextStepTitle", "Nächster Schritt")}
              </p>
              <p className="mt-1 text-sm leading-6 text-white/75">
                {t(
                  "home.aiHero.nextStepText",
                  "Speisely verwandelt diese Angaben in ein Briefing. Danach entscheiden Sie, ob Sie KI-Matches ansehen möchten."
                )}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:py-18">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
            {t("home.aiHero.stepsLabel", "So funktioniert Speisely")}
          </p>

          <h2 className="premium-heading mt-3 text-[clamp(2.25rem,4.5vw,4.4rem)] leading-[0.95]">
            {t(
              "home.aiHero.stepsTitle",
              "Ein KI-Flow statt langer Catering-Suche."
            )}
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: t("home.aiHero.step1Title", "1. Beschreiben"),
              text: t(
                "home.aiHero.step1Text",
                "Beschreiben Sie Ihr Event in natürlicher Sprache — wie in einem Chat."
              ),
            },
            {
              icon: CheckCircle2,
              title: t("home.aiHero.step2Title", "2. KI versteht"),
              text: t(
                "home.aiHero.step2Text",
                "Speisely erkennt Anlass, Gästezahl, Ort, Budget, Stil und Wünsche."
              ),
            },
            {
              icon: ArrowRight,
              title: t("home.aiHero.step3Title", "3. KI-Matching"),
              text: t(
                "home.aiHero.step3Text",
                "Sie erhalten passende Caterer statt einer unübersichtlichen Liste."
              ),
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[1.75rem] border border-[#eadfce] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173f35] text-[#d7b66d]">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 leading-7 text-[#5c6f68]">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 lg:pb-20">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
              {t("home.occasions.label", "Anlässe")}
            </p>

            <h2 className="premium-heading mt-3 max-w-4xl text-[clamp(2.25rem,4.5vw,4.4rem)] leading-[0.95]">
              {t(
                "home.aiHero.occasionsTitle",
                "Starten Sie mit einem Event — Speisely macht daraus ein Briefing."
              )}
            </h2>
          </div>

          <Link
            href="/request/new?start=1"
            className="inline-flex items-center gap-2 font-semibold text-[#173f35]"
          >
            {t("home.occasions.cta", "Mit KI-Matching starten")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {occasionCards.map((card) => (
            <Link
              key={card.titleKey}
              href={card.href}
              className="group overflow-hidden rounded-[1.75rem] border border-[#eadfce] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-44 overflow-hidden lg:h-48">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102f28]/60 to-transparent" />

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#173f35]/0 transition duration-300 group-hover:bg-[#173f35]/35">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-[#173f35] opacity-0 shadow-sm transition duration-300 group-hover:opacity-100">
                    {t("home.aiHero.startWithAi", "Mit KI starten")}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold">
                  {t(card.titleKey, card.titleFallback)}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#5c6f68]">
                  {t(card.descKey, card.descFallback)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 lg:pb-20">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] bg-[#173f35] p-7 text-white shadow-[0_24px_80px_rgba(23,63,53,0.16)] md:p-9">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#d7b66d]">
              {t("home.why.label", "Warum Speisely")}
            </p>

            <h2 className="premium-heading mt-4 text-[clamp(2.25rem,4.5vw,4.4rem)] leading-[0.95]">
              {t("home.aiHero.whyTitle", "Nicht suchen. Passend matchen.")}
            </h2>

            <p className="mt-5 leading-8 text-white/75">
              {t(
                "home.aiHero.whyText",
                "Klassische Marktplätze zeigen Listen. Speisely erstellt zuerst ein strukturiertes Event-Briefing und nutzt es als Grundlage für passende Caterer-Matches."
              )}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              t("home.aiHero.point1", "KI-Briefing aus natürlicher Sprache"),
              t(
                "home.aiHero.point2",
                "Matching nach Ort, Budget und Gästezahl"
              ),
              t("home.aiHero.point3", "Bessere Anfragen für Caterer"),
              t(
                "home.aiHero.point4",
                "Später: sichere Buchung und Plattform-Zahlung"
              ),
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-[#eadfce] bg-white p-6 shadow-sm"
              >
                <CheckCircle2 className="h-5 w-5 text-[#b28a3c]" />
                <p className="mt-4 font-semibold text-[#173f35]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-6 lg:pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#173f35] px-6 py-12 text-center text-white shadow-[0_24px_80px_rgba(23,63,53,0.18)] md:px-12 md:py-14">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#d7b66d]">
            {t("home.aiHero.finalLabel", "Speisely KI-Concierge")}
          </p>

          <h2 className="premium-heading mx-auto mt-4 max-w-4xl text-[clamp(2.3rem,5vw,5rem)] leading-[0.95]">
            {t(
              "home.final.title",
              "Planen Sie Ihr nächstes Catering-Event mit KI-Unterstützung."
            )}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/75 md:text-lg">
            {t(
              "home.final.text",
              "Starten Sie mit einer einfachen Beschreibung. Speisely verwandelt sie in ein klares Briefing und führt Sie zum passenden Caterer."
            )}
          </p>

          <Link
            href="/request/new?start=1"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#d7b66d] px-8 py-4 font-semibold text-[#173f35] transition hover:bg-[#e3c57c]"
          >
            {t("home.final.cta", "Event beschreiben")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#eadfce] px-5 py-8 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-[#5c6f68] md:flex-row">
          <p>
            © 2026 Speisely.{" "}
            {t("footer.tagline", "Premium KI-gestützter Catering-Marktplatz.")}
          </p>

          <div className="flex flex-wrap gap-5 md:gap-6">
            <Link href="/caterers">
              {t("nav.discoverCaterers", "Caterer entdecken")}
            </Link>
            <Link href="/for-caterers">
              {t("nav.forCaterers", "Für Caterer")}
            </Link>
            <Link href="/about">{t("nav.about", "Über Speisely")}</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
