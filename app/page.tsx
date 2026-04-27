"use client";

import Link from "next/link";
import { DynamicUnsplashImage } from "@/components/home/DynamicUnsplashImage";
import { SpeiselyHeader } from "@/components/layout/SpeiselyHeader";
import { useT } from "@/lib/i18n/context";

const occasionCards = [
  {
    titleKey: "home.occasions.wedding.title",
    titleFallback: "Hochzeiten",
    descKey: "home.occasions.wedding.desc",
    descFallback: "Elegantes Catering für intime Feiern und große Hochzeiten.",
    section: "wedding" as const,
  },
  {
    titleKey: "home.occasions.corporate.title",
    titleFallback: "Firmenevents",
    descKey: "home.occasions.corporate.desc",
    descFallback: "Premium-Catering für Meetings, Launches, Offsites und Empfänge.",
    section: "corporate" as const,
  },
  {
    titleKey: "home.occasions.christmas.title",
    titleFallback: "Weihnachtsfeiern",
    descKey: "home.occasions.christmas.desc",
    descFallback: "Festliches Catering für Firmenfeiern, Familienessen und Winterevents.",
    section: "christmas" as const,
  },
  {
    titleKey: "home.occasions.private.title",
    titleFallback: "Private Dinner",
    descKey: "home.occasions.private.desc",
    descFallback: "Kuratiertes Catering für Geburtstage, Familienfeiern und private Dinner.",
    section: "private" as const,
  },
];

const caterers = [
  {
    name: "Maison Verde Catering",
    type: "Modern European",
    location: "Berlin",
    price: "ab €38 p.P.",
  },
  {
    name: "Gold Table Events",
    type: "Wedding & Private Dining",
    location: "Berlin",
    price: "ab €52 p.P.",
  },
  {
    name: "Urban Feast Studio",
    type: "Corporate Catering",
    location: "Berlin",
    price: "ab €29 p.P.",
  },
];

export default function Home() {
  const t = useT();

  const chips = [
    t("home.hero.chipWedding", "Hochzeit"),
    t("home.hero.chipCorporate", "Business Lunch"),
    t("home.hero.chipPrivate", "Private Dinner"),
    t("home.hero.chipRamadan", "Ramadan Iftar"),
    t("home.hero.chipChristmas", "Weihnachtsfeier"),
  ];

  return (
    <main className="min-h-screen bg-[#faf6ee] text-[#16372f]">
      <SpeiselyHeader />

      <section className="relative overflow-hidden">
        <DynamicUnsplashImage
          section="hero"
          priority
          className="absolute inset-0 h-full w-full"
          imageClassName="scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#102f28]/90 via-[#102f28]/65 to-[#102f28]/20" />

        <div className="relative mx-auto grid min-h-[760px] max-w-7xl items-center px-6 py-24">
          <div className="max-w-3xl text-white">
            <div className="mb-6 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
              {t(
                "home.hero.badge",
                "KI-gestützter Catering-Marktplatz für Premium-Events"
              )}
            </div>

            <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
              {t(
                "home.hero.title",
                "Beschreiben Sie Ihr Event. Speisely findet passende Caterer."
              )}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">
              {t(
                "home.hero.description",
                "Von Hochzeiten bis Firmenevents: Speisely verwandelt Ihre Idee in ein strukturiertes Catering-Briefing und findet kuratierte Caterer."
              )}
            </p>

            <div className="mt-8 rounded-3xl bg-white p-3 shadow-2xl md:flex">
              <input
                className="min-h-14 flex-1 rounded-2xl px-5 text-base text-[#173f35] outline-none placeholder:text-[#8a9a94]"
                placeholder={t(
                  "home.hero.placeholder",
                  "Beispiel: Hochzeit für 80 Gäste in Berlin, elegantes Buffet, €45 p.P."
                )}
              />

              <Link
                href="/request/new"
                className="mt-3 inline-flex min-h-14 items-center justify-center rounded-2xl bg-[#c9a45c] px-7 font-semibold text-[#173f35] md:mt-0"
              >
                {t("home.hero.cta", "Caterer finden")}
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 font-medium text-white/90 backdrop-blur"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-3">
          {[
            {
              title: t("home.steps.describe.title", "1. Beschreiben"),
              text: t(
                "home.steps.describe.text",
                "Beschreiben Sie Ihr Event in natürlicher Sprache."
              ),
            },
            {
              title: t("home.steps.structure.title", "2. Strukturieren"),
              text: t(
                "home.steps.structure.text",
                "Die KI erkennt Eventtyp, Gästezahl, Ort, Budget und Wünsche."
              ),
            },
            {
              title: t("home.steps.match.title", "3. Matchen"),
              text: t(
                "home.steps.match.text",
                "Sie erhalten passende Caterer statt einer unübersichtlichen Liste."
              ),
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[2rem] border border-[#eadfce] bg-white p-8 shadow-sm"
            >
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-4 leading-7 text-[#5c6f68]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#173f35] py-24 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#d7b66d]">
              {t("home.premium.label", "Premium-Präsentation")}
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              {t(
                "home.premium.title",
                "Catering ist emotional. Die Buchung sollte hochwertig wirken."
              )}
            </h2>

            <p className="mt-6 text-lg leading-8 text-white/75">
              {t(
                "home.premium.text",
                "Speisely kombiniert elegante Präsentation mit klarer Marketplace-Logik: Pakete, strukturierte Anfragen, verifizierte Caterer und eine geführte Customer Journey."
              )}
            </p>
          </div>

          <DynamicUnsplashImage
            section="premium"
            className="h-[480px] rounded-[2rem] shadow-2xl"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
              {t("home.occasions.label", "Anlässe")}
            </p>

            <h2 className="mt-3 text-4xl font-semibold tracking-tight">
              {t(
                "home.occasions.title",
                "Für Events, die Menschen wirklich planen"
              )}
            </h2>
          </div>

          <Link href="/request/new" className="font-semibold text-[#173f35]">
            {t("home.occasions.cta", "Mit KI-Matching starten")} →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {occasionCards.map((card) => (
            <div
              key={card.titleKey}
              className="overflow-hidden rounded-[2rem] border border-[#eadfce] bg-white shadow-sm"
            >
              <DynamicUnsplashImage
                section={card.section}
                className="h-64"
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
              />

              <div className="p-7">
                <h3 className="text-2xl font-semibold">
                  {t(card.titleKey, card.titleFallback)}
                </h3>
                <p className="mt-3 leading-7 text-[#5c6f68]">
                  {t(card.descKey, card.descFallback)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-[2.5rem] bg-white p-8 shadow-sm md:p-12">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
                {t("home.caterers.label", "Kuratierte Caterer")}
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-tight">
                {t(
                  "home.caterers.title",
                  "Ein Marktplatz, der ausgewählt wirkt — nicht überfüllt."
                )}
              </h2>
            </div>

            <Link href="/caterers" className="font-semibold text-[#173f35]">
              {t("home.caterers.cta", "Caterer ansehen")} →
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {caterers.map((caterer) => (
              <div
                key={caterer.name}
                className="rounded-[1.5rem] border border-[#eadfce] bg-[#faf6ee] p-6"
              >
                <div className="mb-8 h-10 w-10 rounded-full bg-[#173f35]" />
                <h3 className="text-xl font-semibold">{caterer.name}</h3>
                <p className="mt-2 text-[#5c6f68]">{caterer.type}</p>

                <div className="mt-6 flex justify-between text-sm">
                  <span>{caterer.location}</span>
                  <span className="font-semibold">{caterer.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#eadfce] px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-[#5c6f68] md:flex-row">
          <p>
            © 2026 Speisely.{" "}
            {t(
              "footer.tagline",
              "Premium KI-gestützter Catering-Marktplatz."
            )}
          </p>

          <div className="flex gap-6">
            <Link href="/caterers">{t("nav.caterers", "Caterer")}</Link>
            <Link href="/request/new">{t("nav.planEvent", "Event planen")}</Link>
            <Link href="/caterer">{t("nav.forCaterers", "Für Caterer")}</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
