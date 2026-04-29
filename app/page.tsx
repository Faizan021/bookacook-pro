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
    descFallback: "Elegantes Catering für intime Feiern und große Hochzeiten.",
    image: images.wedding,
    alt: "Elegant wedding catering table",
    href: "/request/new?occasion=wedding&start=1",
  },
  {
    titleKey: "home.occasions.corporate.title",
    titleFallback: "Business Lunch",
    descKey: "home.occasions.corporate.desc",
    descFallback:
      "Premium-Catering für Meetings, Launches, Offsites und Empfänge.",
    image: images.corporate,
    alt: "Corporate event catering space",
    href: "/request/new?occasion=corporate&start=1",
  },
  {
    titleKey: "home.occasions.private.title",
    titleFallback: "Private Dinner",
    descKey: "home.occasions.private.desc",
    descFallback:
      "Kuratiertes Catering für Geburtstage, Familienfeiern und private Dinner.",
    image: images.private,
    alt: "Private dinner table",
    href: "/request/new?occasion=private&start=1",
  },
  {
    titleKey: "home.occasions.ramadan.title",
    titleFallback: "Ramadan Iftar",
    descKey: "home.occasions.ramadan.desc",
    descFallback:
      "Stilvolles Iftar-Catering für Familien, Unternehmen und Communities.",
    image: images.ramadan,
    alt: "Iftar dinner table",
    href: "/request/new?occasion=ramadan&start=1",
  },
  {
    titleKey: "home.occasions.christmas.title",
    titleFallback: "Weihnachtsfeier",
    descKey: "home.occasions.christmas.desc",
    descFallback:
      "Festliches Catering für Firmenfeiern, Familienessen und Winterevents.",
    image: images.christmas,
    alt: "Christmas dinner table",
    href: "/request/new?occasion=christmas&start=1",
  },
];

function extractPreview(query: string) {
  const lower = query.toLowerCase();

  const guestMatch =
    query.match(/(\d+)\s?(gäste|personen|guests|people|persons)/i) ||
    query.match(/für\s+(\d+)/i) ||
    query.match(/for\s+(\d+)/i);

  const budgetMatch =
    query.match(/€\s?\d+/) ||
    query.match(/\d+\s?(€|eur|euros?)\s?(p\.p\.|pp|pro person|per person)?/i);

  const city =
    lower.includes("frankfurt")
      ? "Frankfurt"
      : lower.includes("berlin")
        ? "Berlin"
        : lower.includes("münchen") || lower.includes("munich")
          ? "München"
          : lower.includes("hamburg")
            ? "Hamburg"
            : lower.includes("köln") || lower.includes("cologne")
              ? "Köln"
              : lower.includes("düsseldorf") || lower.includes("duesseldorf")
                ? "Düsseldorf"
                : "Ort offen";

  const event =
    lower.includes("business") || lower.includes("lunch")
      ? "Business Event"
      : lower.includes("hochzeit") || lower.includes("wedding")
        ? "Hochzeit"
        : lower.includes("ramadan") || lower.includes("iftar")
          ? "Ramadan Iftar"
          : lower.includes("private") || lower.includes("dinner")
            ? "Private Dinner"
            : lower.includes("weihnacht") || lower.includes("christmas")
              ? "Weihnachtsfeier"
              : "Event erkannt";

  const style =
    lower.includes("buffet")
      ? "Buffet"
      : lower.includes("fine")
        ? "Fine Dining"
        : lower.includes("finger")
          ? "Fingerfood"
          : lower.includes("bbq") || lower.includes("grill")
            ? "BBQ"
            : "Stil offen";

  return {
    event,
    city,
    guests: guestMatch?.[1] || "offen",
    budget: budgetMatch?.[0] || "flexibel",
    style,
  };
}

export default function Home() {
  const t = useT();
  const router = useRouter();
  const [heroQuery, setHeroQuery] = useState(examples[0]);

  const aiPreview = useMemo(() => extractPreview(heroQuery), [heroQuery]);

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
      label: t("home.hero.chipPrivate", "Private Dinner"),
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
          alt="Premium catering event table"
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
              KI-Concierge aktiv
            </div>

            <h1 className="premium-heading text-5xl leading-[0.95] md:text-7xl">
              Beschreiben Sie Ihr Event.
              <span className="block text-[#d7b66d]">
                Speisely erstellt sofort Ihr Catering-Briefing.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">
              Kein Suchen. Keine unübersichtlichen Listen. Speisely versteht Ihr
              Event und findet passende Caterer nach Ort, Gästezahl, Budget,
              Stil und Ernährungswünschen.
            </p>

            <div className="mt-8 rounded-[2rem] border border-white/20 bg-white p-3 shadow-2xl md:flex">
              <input
                value={heroQuery}
                onChange={(event) => setHeroQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") startRequest();
                }}
                className="min-h-14 flex-1 rounded-2xl px-5 text-base text-[#173f35] outline-none placeholder:text-[#8a9a94]"
                placeholder="z.B. Hochzeit für 80 Gäste in Berlin, Buffet, €45 p.P."
              />

              <button
                type="button"
                onClick={startRequest}
                className="mt-3 inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#c9a45c] px-7 font-semibold text-[#173f35] transition hover:bg-[#d7b66d] md:mt-0"
              >
                KI-Briefing erstellen
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 text-sm text-white/75">
              KI erkennt automatisch: Anlass · Gäste · Ort · Budget ·
              Catering-Stil
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
                  Live KI-Preview
                </p>
                <h2 className="premium-heading mt-2 text-3xl text-white">
                  Was Speisely versteht
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
                  label: "Anlass",
                  value: aiPreview.event,
                },
                {
                  icon: Users,
                  label: "Gäste",
                  value: aiPreview.guests,
                },
                {
                  icon: MapPin,
                  label: "Ort",
                  value: aiPreview.city,
                },
                {
                  icon: Wallet,
                  label: "Budget",
                  value: aiPreview.budget,
                },
                {
                  icon: WandSparkles,
                  label: "Stil",
                  value: aiPreview.style,
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
                Nächster Schritt
              </p>
              <p className="mt-1 text-sm leading-6 text-white/75">
                Speisely wandelt diese Angaben in ein Briefing um und startet
                danach das Matching.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
            So funktioniert Speisely
          </p>

          <h2 className="premium-heading mt-3 text-5xl leading-[0.95]">
            Ein AI-Flow statt langer Catering-Suche.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: "1. Beschreiben",
              text: "Sie beschreiben Ihr Event in natürlicher Sprache — wie in einem Chat.",
            },
            {
              icon: CheckCircle2,
              title: "2. KI versteht",
              text: "Speisely erkennt Anlass, Gästezahl, Ort, Budget, Stil und Wünsche.",
            },
            {
              icon: ArrowRight,
              title: "3. KI-Matching",
              text: "Sie erhalten passende Caterer statt einer unübersichtlichen Liste.",
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
              Anlässe
            </p>

            <h2 className="premium-heading mt-3 text-5xl leading-[0.95]">
              Starten Sie mit einem Event — Speisely macht daraus ein Briefing.
            </h2>
          </div>

          <Link
            href="/request/new"
            className="inline-flex items-center gap-2 font-semibold text-[#173f35]"
          >
            Mit KI-Matching starten <ArrowRight className="h-4 w-4" />
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
                <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#173f35]">
                  KI-Start
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
              Warum Speisely
            </p>

            <h2 className="premium-heading mt-4 text-5xl leading-[0.95]">
              Nicht mehr suchen. Besser matchen.
            </h2>

            <p className="mt-5 leading-8 text-white/75">
              Klassische Marktplätze zeigen Listen. Speisely erstellt zuerst ein
              strukturiertes Event-Briefing und nutzt es als Grundlage für
              passende Caterer.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              "AI-Briefing aus natürlicher Sprache",
              "Matching nach Ort, Budget und Gästezahl",
              "Bessere Anfragen für Caterer",
              "Später: sichere Buchung und Plattform-Zahlung",
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
            Speisely AI Concierge
          </p>

          <h2 className="premium-heading mx-auto mt-4 max-w-4xl text-5xl leading-[0.95] md:text-6xl">
            Planen Sie Ihr nächstes Catering mit KI-Unterstützung.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/75">
            Starten Sie mit einer einfachen Beschreibung. Speisely macht daraus
            ein klares Briefing und führt Sie zum passenden Caterer.
          </p>

          <Link
            href="/request/new"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#d7b66d] px-8 py-4 font-semibold text-[#173f35] transition hover:bg-[#e3c57c]"
          >
            Jetzt KI-Matching starten
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#eadfce] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-[#5c6f68] md:flex-row">
          <p>© 2026 Speisely. Premium KI-gestützter Catering-Marktplatz.</p>

          <div className="flex gap-6">
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
