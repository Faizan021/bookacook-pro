"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Stars,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LogoMark } from "@/components/ui/logo-mark";

const occasionKeys = [
  {
    titleKey: "home.occasions.corporate",
    descKey: "home.occasions.corporateDesc",
  },
  {
    titleKey: "home.occasions.summerParty",
    descKey: "home.occasions.summerPartyDesc",
  },
  {
    titleKey: "home.occasions.wedding",
    descKey: "home.occasions.weddingDesc",
  },
  {
    titleKey: "home.occasions.birthday",
    descKey: "home.occasions.birthdayDesc",
  },
  {
    titleKey: "home.occasions.graduation",
    descKey: "home.occasions.graduationDesc",
  },
  {
    titleKey: "home.occasions.private",
    descKey: "home.occasions.privateDesc",
  },
  {
    titleKey: "home.occasions.christmas",
    descKey: "home.occasions.christmasDesc",
  },
  {
    titleKey: "home.occasions.largeEvents",
    descKey: "home.occasions.largeEventsDesc",
  },
];

const principleKeys = [
  {
    icon: BrainCircuit,
    titleKey: "home.principles.item1Title",
    descKey: "home.principles.item1Desc",
  },
  {
    icon: ShieldCheck,
    titleKey: "home.principles.item2Title",
    descKey: "home.principles.item2Desc",
  },
  {
    icon: CheckCircle2,
    titleKey: "home.principles.item3Title",
    descKey: "home.principles.item3Desc",
  },
];

const trustKeys = [
  "home.trust.curated",
  "home.trust.verified",
  "home.trust.transparent",
];

const quickExamples = [
  "home.chips.wedding",
  "home.chips.corporate",
  "home.chips.private",
  "home.chips.ramadan",
];

function parseHeroIntent(input: string) {
  const text = input.toLowerCase();

  const event =
    text.includes("wedding") || text.includes("hochzeit")
      ? "Wedding"
      : text.includes("corporate") ||
        text.includes("office") ||
        text.includes("business") ||
        text.includes("firma") ||
        text.includes("meeting")
      ? "Corporate Event"
      : text.includes("summer") || text.includes("bbq") || text.includes("garten")
      ? "Summer Party"
      : text.includes("birthday") || text.includes("geburtstag")
      ? "Birthday"
      : text.includes("graduation") || text.includes("abschluss")
      ? "Graduation"
      : text.includes("christmas") ||
        text.includes("weihnacht") ||
        text.includes("holiday")
      ? "Christmas Dinner"
      : text.includes("ramadan") || text.includes("iftar")
      ? "Ramadan / Iftar"
      : text.includes("festival") ||
        text.includes("fair") ||
        text.includes("messe") ||
        text.includes("large") ||
        text.includes("groß")
      ? "Large Event"
      : text.includes("private") ||
        text.includes("dinner") ||
        text.includes("party") ||
        text.includes("jubiläum")
      ? "Private Party"
      : "Event";

  const city =
    text.includes("berlin")
      ? "Berlin"
      : text.includes("hamburg")
      ? "Hamburg"
      : text.includes("munich") || text.includes("münchen")
      ? "Munich"
      : text.includes("frankfurt")
      ? "Frankfurt"
      : text.includes("cologne") || text.includes("köln")
      ? "Cologne"
      : text.includes("dortmund")
      ? "Dortmund"
      : text.includes("düsseldorf") || text.includes("duesseldorf")
      ? "Düsseldorf"
      : "City";

  const diet =
    text.includes("vegan")
      ? "Vegan"
      : text.includes("vegetarian") || text.includes("vegetar")
      ? "Vegetarian"
      : text.includes("halal")
      ? "Halal"
      : text.includes("gluten")
      ? "Gluten-free"
      : "Preferred menu";

  const guestMatch =
    input.match(/(\d+)\s*(guests|guest|people|persons)/i) ||
    input.match(/(\d+)\s*(gäste)/i) ||
    input.match(/for\s+(\d+)/i);

  const guests = guestMatch ? `${guestMatch[1]} guests` : "Guest count";

  const budgetMatch =
    input.match(/€\s?\d+/i) ||
    input.match(/\d+\s?€/i) ||
    input.match(/(\d+)\s*(eur|euro)/i);

  const budget = budgetMatch ? budgetMatch[0] : "Budget";

  return { event, city, guests, diet, budget };
}

function getSuggestedMatches(event: string) {
  switch (event) {
    case "Corporate Event":
      return [
        {
          name: "Executive Table Catering",
          meta: "Corporate · Office Lunches",
        },
        {
          name: "City Business Events",
          meta: "Meetings · Conferences",
        },
      ];
    case "Summer Party":
      return [
        {
          name: "Garden Grill Collective",
          meta: "BBQ · Outdoor Events",
        },
        {
          name: "Rooftop Feast Catering",
          meta: "Summer Events · Drinks",
        },
      ];
    case "Birthday":
    case "Private Party":
      return [
        {
          name: "Private Table Events",
          meta: "Celebrations · Family Style",
        },
        {
          name: "Villa Catering",
          meta: "Premium · Multi-cuisine",
        },
      ];
    case "Christmas Dinner":
      return [
        {
          name: "Winter Table Catering",
          meta: "Festive Menus · Seasonal",
        },
        {
          name: "Holiday Feast Events",
          meta: "Company Celebrations · Premium",
        },
      ];
    case "Ramadan / Iftar":
      return [
        {
          name: "Noor Event Catering",
          meta: "Iftar · Halal",
        },
        {
          name: "Saffron Table Events",
          meta: "Community Dining · Family Style",
        },
      ];
    case "Large Event":
      return [
        {
          name: "Grand Scale Catering",
          meta: "Festivals · High Capacity",
        },
        {
          name: "City Crowd Events",
          meta: "Public Events · Logistics",
        },
      ];
    case "Graduation":
      return [
        {
          name: "Ceremony Table Catering",
          meta: "Graduation · Academic Events",
        },
        {
          name: "Campus Feast Events",
          meta: "Buffet · Group Celebrations",
        },
      ];
    case "Wedding":
    default:
      return [
        {
          name: "Berliner Genussküche",
          meta: "Fine Dining · Vegetarian",
        },
        {
          name: "Grüne Tafel Events",
          meta: "Weddings · Organic",
        },
      ];
  }
}

export default function HomePage() {
  const t = useT();
  const router = useRouter();
  const [heroQuery, setHeroQuery] = useState("");

  const fallbackQuery = t("home.aiDemo.request");
  const previewQuery = heroQuery.trim() || fallbackQuery;
  const parsedHero = parseHeroIntent(previewQuery);
  const aiTags = [
    parsedHero.event,
    parsedHero.city,
    parsedHero.guests,
    parsedHero.diet,
  ];
  const featuredMatches = getSuggestedMatches(parsedHero.event);

  function handleHeroSearch() {
    const q = heroQuery.trim();
    if (!q) {
      router.push("/request/new");
      return;
    }

    router.push(`/request/new?q=${encodeURIComponent(q)}`);
  }

  function handleExampleClick(value: string) {
    setHeroQuery(value);
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#07110c] text-[#f6f1e8]">
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(circle at top center, rgba(196,152,64,0.16) 0%, transparent 30%), radial-gradient(circle at 15% 85%, rgba(72,101,82,0.18) 0%, transparent 24%), radial-gradient(circle at 85% 30%, rgba(40,60,48,0.18) 0%, transparent 18%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_22%,transparent_72%,rgba(255,255,255,0.02))]" />
      </div>

      <header className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-8">
        <Link href="/" className="flex items-center gap-3 text-[#eadfca]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c49840]/25 bg-[#c49840]/10">
            <LogoMark size={18} color="#e8ddc8" />
          </div>
          <div className="text-xl font-semibold tracking-tight">Speisely</div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-[#d8d1c2]/75 md:flex">
          <Link href="/caterers" className="transition hover:text-[#c49840]">
            {t("home.nav.browse")}
          </Link>
          <Link href="/request/new" className="transition hover:text-[#c49840]">
            {t("home.heroPlanCta")}
          </Link>
          <Link href="/about" className="transition hover:text-[#c49840]">
            {t("nav.about", "About Speisely")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-[#eadfca] transition hover:border-[#c49840]/40 hover:text-[#c49840] md:inline-flex"
          >
            {t("home.nav.login")}
          </Link>
          <Link
            href="/request/new"
            className="rounded-full bg-[#c49840] px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02]"
          >
            {t("home.editorialCtaPrimary")}
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-10 md:px-8 md:pb-24 md:pt-16">
        <div className="grid gap-12 lg:grid-cols-[1.18fr_0.82fr] lg:items-start">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/20 bg-[#c49840]/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
              <Sparkles className="h-3.5 w-3.5" />
              {t("home.badge")}
            </div>

            <h1 className="mt-8 max-w-5xl text-5xl font-medium leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[84px]">
              {t("home.editorialHeroTitle")}
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-[#a5b3a0] md:text-xl">
              {t("home.editorialHeroSubtitle")}
            </p>

            <div className="mt-10 max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="flex h-16 flex-[1.9] items-center rounded-[1.4rem] bg-black/10 px-5">
                  <input
                    type="text"
                    value={heroQuery}
                    onChange={(e) => setHeroQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleHeroSearch();
                      }
                    }}
                    placeholder={t("home.editorialSearchPlaceholder")}
                    className="w-full bg-transparent text-[15px] text-white placeholder:text-white/30 focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleHeroSearch}
                  className="flex h-16 items-center justify-center gap-2 rounded-[1.3rem] bg-[#c49840] px-8 font-semibold text-black transition hover:scale-[1.02] lg:flex-[0.75]"
                >
                  {t("home.heroSearchCta", "Start briefing")}
                  <ArrowRight className="h-4 w-4" />
                </button>

                <Link
                  href="/caterers"
                  className="flex h-16 items-center justify-center rounded-[1.3rem] border border-white/10 bg-white/[0.03] px-7 font-semibold text-white transition hover:border-[#c49840]/40 hover:text-[#c49840] lg:flex-[0.8]"
                >
                  {t("home.editorialCtaSecondary")}
                </Link>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {quickExamples.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleExampleClick(t(key))}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-[#d7cfbf] transition hover:border-[#c49840]/30 hover:text-[#f2e6cf]"
                  >
                    {t(key)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-[#d7cfbf]">
                {t("home.heroBenefit1")}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-[#d7cfbf]">
                {t("home.heroBenefit2")}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-[#d7cfbf]">
                {t("home.heroBenefit3")}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {trustKeys.map((key) => (
                <span
                  key={key}
                  className="rounded-full border border-[#c49840]/15 bg-[#c49840]/8 px-3.5 py-2 text-xs text-[#e5d8bf]"
                >
                  {t(key)}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:pt-24">
            <div className="rounded-[2.3rem] border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
                  {t("home.aiDemo.requestLabel", "Your request")}
                </div>
                <span className="rounded-full border border-[#c49840]/20 bg-[#c49840]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c49840]">
                  {t("home.heroPanel.badge")}
                </span>
              </div>

              <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-black/10 p-4">
                <p className="text-sm leading-7 text-white/90">“{previewQuery}”</p>
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#c49840]">
                  <Stars className="h-3.5 w-3.5" />
                  {t("home.aiDemo.understands")}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {aiTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#ddd5c6]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-7 border-t border-white/10 pt-6">
                <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#c49840]">
                  {t("home.aiDemo.recommended")}
                </div>

                <div className="mt-4 space-y-3">
                  {featuredMatches.map((item) => (
                    <div
                      key={item.name}
                      className="rounded-[1.2rem] border border-white/10 bg-black/10 px-4 py-3"
                    >
                      <div className="text-sm font-semibold text-white">{item.name}</div>
                      <div className="mt-1 text-xs text-[#9aaa96]">{item.meta}</div>
                    </div>
                  ))}

                  <div className="rounded-[1.2rem] border border-dashed border-[#c49840]/25 bg-[#c49840]/[0.04] px-4 py-3">
                    <div className="text-sm font-medium text-[#e6d8bd]">
                      + {t("home.aiDemo.moreMatches", "More curated matches")}
                    </div>
                    <div className="mt-1 text-xs text-[#9aaa96]">
                      {t(
                        "home.aiDemo.moreMatchesDesc",
                        "Continue to your event brief to unlock a more tailored shortlist."
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-14">
        <div className="mb-10 max-w-3xl">
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
            {t("home.principles.label")}
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
            {t("home.principles.title")}
          </h2>
          <p className="mt-4 text-base leading-8 text-[#96a592]">
            {t("home.principles.subtitle")}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {principleKeys.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.titleKey}
                className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c49840]/20 bg-[#c49840]/10">
                  <Icon className="h-4.5 w-4.5 text-[#c49840]" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">
                  {t(item.titleKey)}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#92a18f]">
                  {t(item.descKey)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[2.4rem] border border-white/10">
            <div className="absolute inset-0 z-10 bg-[linear-gradient(to_top,rgba(7,17,12,0.72),rgba(7,17,12,0.18))]" />
            <Image
              src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1400&q=80"
              alt={t("home.images.heroAlt")}
              width={1400}
              height={1000}
              className="h-[420px] w-full object-cover"
              priority
            />
            <div className="absolute bottom-0 left-0 z-20 p-7 md:p-8">
              <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
                {t("home.featured.label")}
              </div>
              <h3 className="mt-3 max-w-xl text-3xl font-semibold text-white md:text-4xl">
                {t("home.featured.title")}
              </h3>
              <p className="mt-4 max-w-lg text-sm leading-7 text-[#d6d0c3]">
                {t("home.featured.subtitle")}
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <div className="text-xs uppercase tracking-[0.18em] text-[#c49840]">
                {t("home.featured.card1Meta")}
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-white">
                {t("home.featured.card1Title")}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#92a18f]">
                {t("home.featured.card1Desc")}
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <div className="text-xs uppercase tracking-[0.18em] text-[#c49840]">
                {t("home.featured.card2Meta")}
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-white">
                {t("home.featured.card2Title")}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#92a18f]">
                {t("home.featured.card2Desc")}
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:col-span-2">
              <div className="text-xs uppercase tracking-[0.18em] text-[#c49840]">
                {t("home.featured.card3Meta", "Private Events")}
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-white">
                {t("home.featured.card3Title")}
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#92a18f]">
                {t("home.featured.card3Desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="mb-10 max-w-3xl">
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
            {t("home.occasions.label")}
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
            {t("home.editorialOccasionsTitle")}
          </h2>
          <p className="mt-4 text-base leading-8 text-[#96a592]">
            {t(
              "home.occasions.subtitle",
              "Explore catering solutions for weddings, business events, festive dinners, and private occasions."
            )}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {occasionKeys.map((occasion) => (
            <div
              key={occasion.titleKey}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl transition hover:-translate-y-1 hover:border-[#c49840]/20 hover:bg-white/[0.055]"
            >
              <h3 className="text-xl font-semibold text-white">
                {t(occasion.titleKey)}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#92a18f]">
                {t(occasion.descKey)}
              </p>
              <div className="mt-6">
                <Link
                  href="/request/new"
                  className="text-sm font-semibold text-[#c49840] transition hover:text-white"
                >
                  {t("home.occasions.cardCta")} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-6 md:px-8">
        <div className="overflow-hidden rounded-[2.4rem] border border-white/10 bg-white/[0.045] backdrop-blur-xl">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="px-8 py-12 md:px-12 md:py-16">
              <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
                {t("home.editorialCtaLabel")}
              </div>
              <h3 className="mt-4 text-3xl font-semibold text-white md:text-5xl">
                {t("home.editorialCtaTitle")}
              </h3>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#94a391]">
                {t("home.editorialCtaSubtitle")}
              </p>

              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/request/new"
                  className="inline-flex items-center gap-2 rounded-[1rem] bg-[#c49840] px-6 py-3.5 font-semibold text-black transition hover:scale-[1.02]"
                >
                  {t("home.editorialCtaPrimary")}
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/caterers"
                  className="inline-flex items-center rounded-[1rem] border border-white/10 bg-white/[0.03] px-6 py-3.5 font-semibold text-white transition hover:border-[#c49840]/40 hover:text-[#c49840]"
                >
                  {t("home.editorialCtaSecondary")}
                </Link>
              </div>
            </div>

            <div className="relative min-h-[320px] border-t border-white/10 lg:min-h-full lg:border-l lg:border-t-0">
              <Image
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80"
                alt={t("home.images.ctaAlt")}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,17,12,0.55),rgba(7,17,12,0.2))]" />
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 py-10 text-center">
        <p className="text-sm text-[#7f9380]">{t("home.editorialFooterTagline")}</p>
      </footer>
    </main>
  );
}
