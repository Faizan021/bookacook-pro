"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Star,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LogoMark } from "@/components/ui/logo-mark";

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

const occasionCards = [
  {
    titleKey: "home.occasions.wedding",
    descKey: "home.occasions.weddingDesc",
    href: "/request/new?occasion=wedding",
    image: "/images/home-hero-catering.jpg",
  },
  {
    titleKey: "home.occasions.corporate",
    descKey: "home.occasions.corporateDesc",
    href: "/request/new?occasion=corporate",
    image: "/images/home-hero-catering.jpg",
  },
  {
    titleKey: "home.occasions.private",
    descKey: "home.occasions.privateDesc",
    href: "/request/new?occasion=private_party",
    image: "/images/home-hero-catering.jpg",
  },
  {
    titleKey: "home.occasions.ramadan",
    descKey: "home.occasions.ramadanDesc",
    href: "/request/new?occasion=ramadan",
    image: "/images/home-hero-catering.jpg",
  },
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

  return { event, city, guests, diet };
}

function getSuggestedMatches(event: string) {
  switch (event) {
    case "Corporate Event":
      return [
        {
          name: "Executive Table Catering",
          meta: "Corporate · Office Lunches",
          rating: "4.9",
          price: "from €28 p.p.",
        },
        {
          name: "City Business Events",
          meta: "Meetings · Conferences",
          rating: "4.8",
          price: "from €24 p.p.",
        },
      ];
    case "Ramadan / Iftar":
      return [
        {
          name: "Noor Event Catering",
          meta: "Iftar · Halal",
          rating: "4.9",
          price: "from €19 p.p.",
        },
        {
          name: "Saffron Table Events",
          meta: "Community Dining · Family Style",
          rating: "4.8",
          price: "from €23 p.p.",
        },
      ];
    case "Wedding":
    default:
      return [
        {
          name: "Berliner Genussküche",
          meta: "Fine Dining · Vegetarian",
          rating: "4.9",
          price: "from €35 p.p.",
        },
        {
          name: "Grüne Tafel Events",
          meta: "Weddings · Organic",
          rating: "4.8",
          price: "from €32 p.p.",
        },
      ];
  }
}

function SocialButton({
  href,
  label,
  short,
}: {
  href: string;
  label: string;
  short: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9d2c8] bg-white text-xs font-semibold text-[#2d4736] transition hover:border-[#c49840]/50 hover:text-[#c49840]"
    >
      {short}
    </a>
  );
}

export default function HomePage() {
  const t = useT();
  const router = useRouter();
  const [heroQuery, setHeroQuery] = useState("");

  const fallbackQuery = t(
    "home.aiDemo.request",
    "Wedding for 80 guests in Berlin, mostly vegetarian, elegant, around €35 per person"
  );

  const previewQuery = heroQuery.trim() || fallbackQuery;
  const parsedHero = useMemo(() => parseHeroIntent(previewQuery), [previewQuery]);
  const featuredMatches = useMemo(
    () => getSuggestedMatches(parsedHero.event),
    [parsedHero.event]
  );

  function handleHeroSearch() {
    const q = heroQuery.trim();
    if (!q) {
      router.push("/request/new");
      return;
    }
    router.push(`/request/new?q=${encodeURIComponent(q)}`);
  }

  return (
    <main className="bg-[#f5f1ea] text-[#201a17]">
      <header className="sticky top-0 z-50 border-b border-[#ddd4c8] bg-[#f5f1ea]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-3 text-[#2d4736]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2d4736]/15 bg-[#2d4736]/5">
              <LogoMark size={18} color="#2d4736" />
            </div>
            <div className="text-xl font-semibold tracking-tight">Speisely</div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-[#6f675f] md:flex">
            <Link href="/caterers" className="transition hover:text-[#2d4736]">
              {t("home.nav.browse")}
            </Link>
            <Link href="/for-caterers" className="transition hover:text-[#2d4736]">
              {t("home.nav.forCaterers")}
            </Link>
            <Link href="/about" className="transition hover:text-[#2d4736]">
              {t("nav.about")}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-sm text-[#2d4736] transition hover:text-[#c49840] md:inline-flex"
            >
              {t("home.nav.login")}
            </Link>
            <Link
              href="/request/new"
              className="rounded-full bg-[#2d4736] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {t("home.editorialCtaPrimary")}
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/home-hero-catering.jpg"
            alt="Premium catering event setup"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,20,14,0.62)_0%,rgba(34,25,18,0.58)_38%,rgba(27,20,14,0.66)_100%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-16 md:px-8 md:pb-28 md:pt-20">
          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#f2dfbf]">
              <Sparkles className="h-3.5 w-3.5" />
              {t("home.badge")}
            </div>

            <h1 className="mt-8 text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[82px]">
              {t(
                "home.editorialHeroTitle",
                "Describe your event. Find the right catering partners."
              )}
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-[#efe5da] md:text-xl">
              {t("home.editorialHeroSubtitle")}
            </p>

            <div className="mx-auto mt-10 max-w-4xl rounded-[2rem] border border-white/15 bg-white/10 p-3 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="flex h-16 flex-[1.9] items-center rounded-[1.35rem] bg-white px-5">
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
                    className="w-full bg-transparent text-[15px] text-[#201a17] placeholder:text-[#8a8076] focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleHeroSearch}
                  className="flex h-16 items-center justify-center gap-2 rounded-[1.3rem] bg-[#d6ddd0] px-8 font-semibold text-[#2d4736] transition hover:opacity-90 lg:flex-[0.75]"
                >
                  {t("home.heroSearchCta")}
                  <ArrowRight className="h-4 w-4" />
                </button>

                <Link
                  href="/caterers"
                  className="flex h-16 items-center justify-center rounded-[1.3rem] border border-white/20 bg-white/10 px-7 font-semibold text-white transition hover:border-[#c49840]/40 hover:text-[#f2dfbf] lg:flex-[0.8]"
                >
                  {t("home.editorialCtaSecondary")}
                </Link>
              </div>

              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {quickExamples.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setHeroQuery(t(key))}
                    className="rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs text-white transition hover:border-[#c49840]/35 hover:text-[#f2dfbf]"
                  >
                    {t(key)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {trustKeys.map((key) => (
                <span
                  key={key}
                  className="rounded-full border border-[#f0dfbf]/20 bg-[#c49840]/10 px-3.5 py-2 text-xs text-[#f0dfbf]"
                >
                  {t(key)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 mx-auto -mt-10 max-w-7xl px-6 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[2.2rem] border border-[#e3dbd0] bg-white p-7 shadow-[0_24px_70px_rgba(34,28,22,0.08)]">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
              <BrainCircuit className="h-3.5 w-3.5" />
              AI-guided matching
            </div>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#201a17] md:text-4xl">
              Speisely understands your event before you browse.
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-8 text-[#6f675f]">
              Instead of only showing generic listings, Speisely interprets your event
              intent, budget direction, guest count, city, and food preferences to
              create a smarter shortlist from the start.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {[parsedHero.event, parsedHero.city, parsedHero.guests, parsedHero.diet].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#ddd4c8] bg-[#faf7f2] px-3 py-1.5 text-xs font-medium text-[#3f3833]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-3">
              {featuredMatches.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-[1.25rem] border border-[#eee5da] bg-[#fcfaf7] px-4 py-4"
                >
                  <div>
                    <div className="text-sm font-semibold text-[#201a17]">{item.name}</div>
                    <div className="mt-1 text-xs text-[#7a726a]">{item.meta}</div>
                  </div>

                  <div className="text-right">
                    <div className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2d4736]">
                      <Star className="h-4 w-4 fill-[#c49840] text-[#c49840]" />
                      {item.rating}
                    </div>
                    <div className="mt-1 text-xs text-[#7a726a]">{item.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.2rem] border border-[#e3dbd0] bg-[#f8f5ef] p-7 shadow-[0_24px_70px_rgba(34,28,22,0.06)]">
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
              Premium platform principles
            </div>

            <div className="mt-6 space-y-5">
              {principleKeys.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.titleKey}
                    className="rounded-[1.4rem] border border-[#e6ddd1] bg-white p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#c49840]/20 bg-[#c49840]/10">
                        <Icon className="h-4.5 w-4.5 text-[#2d4736]" />
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-[#201a17]">
                          {t(item.titleKey)}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-[#6f675f]">
                          {t(item.descKey)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-24">
        <div className="mb-10 max-w-3xl">
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
            Anlässe
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-[#201a17] md:text-4xl">
            Starten Sie mit dem Anlass
          </h2>
          <p className="mt-4 text-base leading-8 text-[#6f675f]">
            Entdecken Sie Catering-Lösungen für Hochzeiten, Business-Events,
            private Dinner und festliche Anlässe.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {occasionCards.map((occasion) => (
            <div
              key={occasion.titleKey}
              className="group overflow-hidden rounded-[2rem] border border-[#e7dfd4] bg-white shadow-[0_18px_50px_rgba(34,28,22,0.05)] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(34,28,22,0.10)]"
            >
              <div className="relative h-64">
                <Image
                  src={occasion.image}
                  alt={t(occasion.titleKey)}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(18,13,10,0.68),rgba(18,13,10,0.10))]" />

                <div className="absolute bottom-5 left-5 right-5">
                  <h3 className="text-2xl font-semibold text-white">
                    {t(occasion.titleKey)}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/85">
                    {t(occasion.descKey)}
                  </p>
                  <div className="mt-4">
                    <Link
                      href={occasion.href}
                      className="text-sm font-semibold text-[#f0dfbf] transition hover:text-white"
                    >
                      Anfrage starten →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
              Featured caterers
            </div>
            <h2 className="mt-3 text-3xl font-semibold text-[#201a17] md:text-4xl">
              Curated caterers for premium occasions
            </h2>
          </div>

          <Link
            href="/caterers"
            className="hidden rounded-full border border-[#2d4736]/20 px-5 py-3 text-sm font-medium text-[#2d4736] transition hover:bg-[#2d4736] hover:text-white md:inline-flex"
          >
            Browse all caterers
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[
            {
              name: "Berliner Genussküche",
              cuisine: "Fine Dining",
              city: "Berlin",
              price: "From €35 / person",
            },
            {
              name: "Noor Event Catering",
              cuisine: "Halal",
              city: "Berlin",
              price: "From €24 / person",
            },
            {
              name: "Bella Cucina Catering",
              cuisine: "Italian",
              city: "Munich",
              price: "From €28 / person",
            },
          ].map((item) => (
            <div
              key={item.name}
              className="overflow-hidden rounded-[2rem] border border-[#e7dfd4] bg-white shadow-[0_18px_50px_rgba(34,28,22,0.05)]"
            >
              <div className="relative h-64">
                <Image
                  src="/images/home-hero-catering.jpg"
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-[#201a17]">
                  <Star className="h-3.5 w-3.5 fill-[#c49840] text-[#c49840]" />
                  4.9
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-semibold tracking-tight text-[#201a17]">
                  {item.name}
                </h3>

                <div className="mt-3 flex items-center gap-3 text-sm text-[#6f675f]">
                  <span className="rounded-full bg-[#f4efe8] px-3 py-1 text-xs font-medium text-[#2d4736]">
                    {item.cuisine}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {item.city}
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#efe7dc] pt-5">
                  <div className="text-base font-semibold text-[#201a17]">{item.price}</div>
                  <Link
                    href="/caterers"
                    className="text-sm font-semibold text-[#2d4736] transition hover:text-[#c49840]"
                  >
                    View profile →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#ddd5ca] bg-[#f3eee6]">
        <div className="mx-auto max-w-7xl px-6 py-14 md:px-8">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3 text-[#2d4736]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2d4736]/15 bg-[#2d4736]/5">
                  <LogoMark size={18} color="#2d4736" />
                </div>
                <div>
                  <div className="text-2xl font-semibold tracking-tight">Speisely</div>
                  <div className="mt-1 text-sm text-[#6f675f]">
                    KI-gestützter Catering-Marktplatz
                  </div>
                </div>
              </div>

              <p className="mt-6 max-w-md text-base leading-8 text-[#6f675f]">
                Speisely verbindet Event-Gastgeber mit kuratierten Catering-Partnern
                durch einen intelligenteren Anfrage- und Matchingprozess.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#201a17]">Für Kunden</h3>
              <div className="mt-5 flex flex-col gap-3 text-[#6f675f]">
                <Link href="/request/new" className="transition hover:text-[#2d4736]">
                  Event beschreiben
                </Link>
                <Link href="/caterers" className="transition hover:text-[#2d4736]">
                  Caterer entdecken
                </Link>
                <Link href="/about" className="transition hover:text-[#2d4736]">
                  Über Speisely
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#201a17]">Kontakt</h3>
              <div className="mt-5 space-y-3 text-[#6f675f]">
                <p>info@speisely.de</p>
                <p>Deutschland</p>
              </div>

              <div className="mt-8">
                <h4 className="text-sm font-medium uppercase tracking-[0.2em] text-[#c49840]">
                  Social
                </h4>
                <div className="mt-4 flex items-center gap-3">
                  <SocialButton href="#" label="Facebook" short="f" />
                  <SocialButton href="#" label="Instagram" short="ig" />
                  <SocialButton href="#" label="TikTok" short="tt" />
                  <SocialButton href="#" label="LinkedIn" short="in" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-[#ddd5ca] pt-6 text-sm text-[#8f8777] md:flex-row md:items-center md:justify-between">
            <p>© 2025 Speisely</p>
            <div className="flex flex-wrap items-center gap-6">
              <Link href="/impressum" className="transition hover:text-[#2d4736]">
                Impressum
              </Link>
              <Link href="/datenschutz" className="transition hover:text-[#2d4736]">
                Datenschutz
              </Link>
              <Link href="/request/new" className="transition hover:text-[#2d4736]">
                Anfrage starten
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
