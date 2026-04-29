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
    titleFallback: "Wedding",
    descKey: "home.occasions.wedding.desc",
    descFallback: "Elegant catering for intimate celebrations and large weddings.",
    image: images.wedding,
    alt: "Elegant wedding catering table",
    href: "/request/new?occasion=wedding&start=1",
  },
  {
    titleKey: "home.occasions.corporate.title",
    titleFallback: "Business Lunch",
    descKey: "home.occasions.corporate.desc",
    descFallback: "Premium catering for meetings, launches, offsites and receptions.",
    image: images.corporate,
    alt: "Corporate event catering space",
    href: "/request/new?occasion=corporate&start=1",
  },
  {
    titleKey: "home.occasions.private.title",
    titleFallback: "Private Dinner",
    descKey: "home.occasions.private.desc",
    descFallback: "Curated catering for birthdays, family celebrations and private dinners.",
    image: images.private,
    alt: "Private dinner table",
    href: "/request/new?occasion=private&start=1",
  },
  {
    titleKey: "home.occasions.ramadan.title",
    titleFallback: "Ramadan Iftar",
    descKey: "home.occasions.ramadan.desc",
    descFallback: "Elegant iftar catering for families, companies and communities.",
    image: images.ramadan,
    alt: "Iftar dinner table",
    href: "/request/new?occasion=ramadan&start=1",
  },
  {
    titleKey: "home.occasions.christmas.title",
    titleFallback: "Christmas party",
    descKey: "home.occasions.christmas.desc",
    descFallback: "Festive catering for company celebrations, family dinners and winter events.",
    image: images.christmas,
    alt: "Christmas dinner table",
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
    ["gelsenkirchen", "Gelsenkirchen"],
    ["braunschweig", "Braunschweig"],
    ["chemnitz", "Chemnitz"],
    ["halle", "Halle"],
    ["magdeburg", "Magdeburg"],
    ["freiburg", "Freiburg"],
    ["krefeld", "Krefeld"],
    ["lübeck", "Lübeck"],
    ["luebeck", "Lübeck"],
    ["oberhausen", "Oberhausen"],
    ["erfurt", "Erfurt"],
    ["mainz", "Mainz"],
    ["rostock", "Rostock"],
    ["kassel", "Kassel"],
    ["hagen", "Hagen"],
    ["hamm", "Hamm"],
    ["saarbrücken", "Saarbrücken"],
    ["saarbruecken", "Saarbrücken"],
    ["mülheim", "Mülheim"],
    ["muelheim", "Mülheim"],
    ["potsdam", "Potsdam"],
    ["ludwigshafen", "Ludwigshafen"],
    ["oldenburg", "Oldenburg"],
    ["leverkusen", "Leverkusen"],
    ["osnabrück", "Osnabrück"],
    ["osnabrueck", "Osnabrück"],
    ["solingen", "Solingen"],
    ["heidelberg", "Heidelberg"],
    ["herne", "Herne"],
    ["neuss", "Neuss"],
    ["darmstadt", "Darmstadt"],
    ["paderborn", "Paderborn"],
    ["regensburg", "Regensburg"],
    ["ingolstadt", "Ingolstadt"],
    ["würzburg", "Würzburg"],
    ["wuerzburg", "Würzburg"],
    ["fürth", "Fürth"],
    ["fuerth", "Fürth"],
    ["wolfsburg", "Wolfsburg"],
    ["offenbach", "Offenbach"],
    ["ulm", "Ulm"],
    ["heilbronn", "Heilbronn"],
    ["pforzheim", "Pforzheim"],
    ["göttingen", "Göttingen"],
    ["goettingen", "Göttingen"],
    ["bottrop", "Bottrop"],
    ["trier", "Trier"],
    ["recklinghausen", "Recklinghausen"],
    ["reutlingen", "Reutlingen"],
    ["bremerhaven", "Bremerhaven"],
    ["koblenz", "Koblenz"],
    ["jena", "Jena"],
    ["remscheid", "Remscheid"],
    ["erlangen", "Erlangen"],
    ["moers", "Moers"],
    ["siegen", "Siegen"],
    ["hildesheim", "Hildesheim"],
    ["salzgitter", "Salzgitter"],
    ["cottbus", "Cottbus"],
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
    query.match(/(\d+)\s?(gäste|gast|personen|person|guests|guest|people|persons|pax)/i) ||
    query.match(/für\s+(\d+)/i) ||
    query.match(/for\s+(\d+)/i);

  const budgetMatch =
    query.match(/€\s?\d+/) ||
    query.match(/\d+\s?(€|eur|euro|euros?)\s?(p\.p\.|pp|pro person|per person)?/i);

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
      ? t("home.aiHero.event.business", "Business event")
      : aiPreview.eventKey === "wedding"
        ? t("home.aiHero.event.wedding", "Wedding")
        : aiPreview.eventKey === "birthday"
          ? t("home.aiHero.event.birthday", "Birthday / Party")
          : aiPreview.eventKey === "ramadan"
            ? t("home.aiHero.event.ramadan", "Ramadan Iftar")
            : aiPreview.eventKey === "private"
              ? t("home.aiHero.event.private", "Private dinner")
              : aiPreview.eventKey === "christmas"
                ? t("home.aiHero.event.christmas", "Christmas party")
                : t("home.aiHero.event.unknown", "Event detected");

  const styleLabel =
    aiPreview.styleKey === "fineDining"
      ? t("home.aiHero.style.fineDining", "Fine dining")
      : aiPreview.styleKey === "buffet"
        ? t("home.aiHero.style.buffet", "Buffet")
        : aiPreview.styleKey === "fingerfood"
          ? t("home.aiHero.style.fingerfood", "Finger food")
          : aiPreview.styleKey === "bbq"
            ? t("home.aiHero.style.bbq", "BBQ")
            : aiPreview.styleKey === "elegant"
              ? t("home.aiHero.style.elegant", "Elegant")
              : aiPreview.styleKey === "modern"
                ? t("home.aiHero.style.modern", "Modern")
                : aiPreview.styleKey === "halal"
                  ? t("home.aiHero.style.halal", "Halal catering")
                  : aiPreview.styleKey === "vegetarian"
                    ? t("home.aiHero.style.vegetarian", "Vegetarian")
                    : aiPreview.styleKey === "vegan"
                      ? t("home.aiHero.style.vegan", "Vegan")
                      : t("home.aiHero.style.open", "Style open");

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
      label: t("home.hero.chipWedding", "Wedding"),
      href: "/request/new?occasion=wedding&start=1",
    },
    {
      label: t("home.hero.chipCorporate", "Business Lunch"),
      href: "/request/new?occasion=corporate&start=1",
    },
    {
      label: t("home.hero.chipPrivate", "Private Dinner"),
      href: "/request/new?occasion=private&start=1",
    },
    {
      label: t("home.hero.chipRamadan", "Ramadan Iftar"),
      href: "/request/new?occasion=ramadan&start=1",
    },
    {
      label: t("home.hero.chipChristmas", "Christmas party"),
      href: "/request/new?occasion=christmas&start=1",
    },
  ];

  return (
    <main className="min-h-screen bg-[#faf6ee] text-[#16372f]">
      <SpeiselyHeader />

      <section className="relative overflow-hidden">
        <Image
          src={images.hero}
          alt={t("home.aiHero.heroAlt", "Premium catering event table")}
          fill
          priority
          sizes="100vw"
          className="object-cover scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#102f28]/95 via-[#102f28]/78 to-[#102f28]/35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(215,182,109,0.22),transparent_32%),radial-gradient(circle_at_85%_35%,rgba(255,255,255,0.14),transparent_28%)]" />

        <div className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.08fr_0.72fr]">
          <div className="max-w-4xl text-white">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white/85 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#d7b66d]" />
              {t("home.aiHero.badge", "AI concierge active")}
            </div>

            <h1 className="premium-heading text-5xl leading-[0.95] md:text-7xl">
              {t("home.aiHero.titleLine1", "Describe your event.")}
              <span className="block text-[#d7b66d]">
                {t(
                  "home.aiHero.titleLine2",
                  "Speisely instantly builds your catering brief."
                )}
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">
              {t(
                "home.aiHero.subtitle",
                "No searching. No overwhelming lists. Speisely understands your event and finds suitable caterers by location, guest count, budget, style and dietary needs."
              )}
            </p>

            <div className="mt-8 rounded-[2rem] border border-white/20 bg-white p-3 shadow-2xl md:flex">
              <input
                value={heroQuery}
                onChange={(event) => setHeroQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") startRequest();
                }}
                className="min-h-14 flex-1 rounded-2xl px-5 text-base text-[#173f35] outline-none placeholder:text-[#8a9a94]"
                placeholder={t(
                  "home.aiHero.placeholder",
                  "e.g. Wedding for 80 guests in Berlin, buffet, €45 p.p."
                )}
              />

              <button
                type="button"
                onClick={startRequest}
                className="mt-3 inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#c9a45c] px-7 font-semibold text-[#173f35] transition hover:bg-[#d7b66d] md:mt-0"
              >
                {t("home.aiHero.cta", "Create AI brief")}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 text-sm text-white/75">
              {t(
                "home.aiHero.autoDetect",
                "AI detects automatically: occasion · guests · location · budget · catering style"
              )}
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm">
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

          <aside className="hidden rounded-[2rem] border border-white/20 bg-white/12 p-5 text-white shadow-2xl backdrop-blur-xl lg:block">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7b66d]">
                  {t("home.aiHero.previewLabel", "Live AI preview")}
                </p>
                <h2 className="premium-heading mt-2 text-3xl text-white">
                  {t("home.aiHero.previewTitle", "What Speisely understands")}
                </h2>
              </div>

              <div className="rounded-2xl bg-white/10 p-3 text-[#d7b66d]">
                <Sparkles className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {[
                {
                  icon: Sparkles,
                  label: t("home.aiHero.label.event", "Occasion"),
                  value: eventLabel,
                },
                {
                  icon: Users,
                  label: t("home.aiHero.label.guests", "Guests"),
                  value: aiPreview.guests || t("home.aiHero.value.open", "Open"),
                },
                {
                  icon: MapPin,
                  label: t("home.aiHero.label.city", "Location"),
                  value: aiPreview.city || t("home.aiHero.city.open", "Location open"),
                },
                {
                  icon: Wallet,
                  label: t("home.aiHero.label.budget", "Budget"),
                  value: aiPreview.budget || t("home.aiHero.budget.flexible", "Flexible"),
                },
                {
                  icon: WandSparkles,
                  label: t("home.aiHero.label.style", "Style"),
                  value: styleLabel,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-[1.25rem] border border-white/15 bg-white/10 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-[#d7b66d]" />
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                        {item.label}
                      </p>
                    </div>
                    <p className="mt-2 text-lg font-semibold">{item.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-[1.25rem] border border-[#d7b66d]/30 bg-[#d7b66d]/15 p-4">
              <p className="text-sm font-semibold text-[#ffe2a0]">
                {t("home.aiHero.nextStepTitle", "Next step")}
              </p>
              <p className="mt-1 text-sm leading-6 text-white/75">
                {t(
                  "home.aiHero.nextStepText",
                  "Speisely turns these details into a brief and then starts matching."
                )}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
            {t("home.aiHero.stepsLabel", "How Speisely works")}
          </p>

          <h2 className="premium-heading mt-3 text-5xl leading-[0.95]">
            {t("home.aiHero.stepsTitle", "An AI flow instead of a long catering search.")}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: t("home.aiHero.step1Title", "1. Describe"),
              text: t(
                "home.aiHero.step1Text",
                "Describe your event in natural language — like in a chat."
              ),
            },
            {
              icon: CheckCircle2,
              title: t("home.aiHero.step2Title", "2. AI understands"),
              text: t(
                "home.aiHero.step2Text",
                "Speisely detects occasion, guest count, location, budget, style and preferences."
              ),
            },
            {
              icon: ArrowRight,
              title: t("home.aiHero.step3Title", "3. AI matching"),
              text: t(
                "home.aiHero.step3Text",
                "You receive suitable caterers instead of an overwhelming list."
              ),
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[2rem] border border-[#eadfce] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173f35] text-[#d7b66d]">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-4 leading-7 text-[#5c6f68]">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
              {t("home.occasions.label", "Occasions")}
            </p>

            <h2 className="premium-heading mt-3 text-5xl leading-[0.95]">
              {t(
                "home.aiHero.occasionsTitle",
                "Start with an event — Speisely turns it into a brief."
              )}
            </h2>
          </div>

          <Link
            href="/request/new?start=1"
            className="inline-flex items-center gap-2 font-semibold text-[#173f35]"
          >
            {t("home.occasions.cta", "Start with AI matching")}{" "}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {occasionCards.map((card) => (
            <Link
              key={card.titleKey}
              href={card.href}
              className="group overflow-hidden rounded-[2rem] border border-[#eadfce] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-52 overflow-hidden">
  <Image
    src={card.image}
    alt={card.alt}
    fill
    sizes="(min-width: 1024px) 20vw, (min-width: 768px) 50vw, 100vw"
    className="object-cover transition duration-500 group-hover:scale-110"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-[#102f28]/60 to-transparent" />

  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#173f35]/0 transition duration-300 group-hover:bg-[#173f35]/35">
    <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-[#173f35] opacity-0 shadow-sm transition duration-300 group-hover:opacity-100">
      {t("home.aiHero.startWithAi", "Start with AI")}
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

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2.3rem] bg-[#173f35] p-8 text-white shadow-[0_24px_80px_rgba(23,63,53,0.16)] md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#d7b66d]">
              {t("home.why.label", "Why Speisely")}
            </p>

            <h2 className="premium-heading mt-4 text-5xl leading-[0.95]">
              {t("home.aiHero.whyTitle", "Stop searching. Start matching.")}
            </h2>

            <p className="mt-5 leading-8 text-white/75">
              {t(
                "home.aiHero.whyText",
                "Classic marketplaces show lists. Speisely first creates a structured event brief and uses it as the basis for suitable caterer matching."
              )}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              t("home.aiHero.point1", "AI brief from natural language"),
              t("home.aiHero.point2", "Matching by location, budget and guest count"),
              t("home.aiHero.point3", "Better inquiries for caterers"),
              t("home.aiHero.point4", "Later: secure booking and platform payment"),
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.6rem] border border-[#eadfce] bg-white p-6 shadow-sm"
              >
                <CheckCircle2 className="h-5 w-5 text-[#b28a3c]" />
                <p className="mt-4 font-semibold text-[#173f35]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#173f35] px-8 py-16 text-center text-white shadow-[0_24px_80px_rgba(23,63,53,0.18)] md:px-16">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#d7b66d]">
            {t("home.aiHero.finalLabel", "Speisely AI Concierge")}
          </p>

          <h2 className="premium-heading mx-auto mt-4 max-w-4xl text-5xl leading-[0.95] md:text-6xl">
            {t("home.final.title", "Plan your next catering event with AI guidance.")}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/75">
            {t(
              "home.final.text",
              "Start with a simple description. Speisely turns it into a clear brief and guides you to the right caterer."
            )}
          </p>

          <Link
            href="/request/new?start=1"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#d7b66d] px-8 py-4 font-semibold text-[#173f35] transition hover:bg-[#e3c57c]"
          >
            {t("home.final.cta", "Describe event")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#eadfce] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-[#5c6f68] md:flex-row">
          <p>
            © 2026 Speisely.{" "}
            {t("footer.tagline", "Premium AI-assisted catering marketplace.")}
          </p>

          <div className="flex gap-6">
            <Link href="/caterers">
              {t("nav.discoverCaterers", "Discover caterers")}
            </Link>
            <Link href="/for-caterers">
              {t("nav.forCaterers", "For caterers")}
            </Link>
            <Link href="/about">{t("nav.about", "About Speisely")}</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
