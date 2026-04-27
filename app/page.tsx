"use client";

import Image from "next/image";
import Link from "next/link";
import { DynamicUnsplashImage } from "@/components/home/DynamicUnsplashImage";
import { SpeiselyHeader } from "@/components/layout/SpeiselyHeader";
import { useT } from "@/lib/i18n/context";

const occasionCards = [
  {
    titleKey: "home.occasions.wedding.title",
    titleFallback: "Hochzeit",
    descKey: "home.occasions.wedding.desc",
    descFallback: "Elegantes Catering für intime Feiern und große Hochzeiten.",
    section: "wedding" as const,
    href: "/request/new?occasion=wedding",
  },
  {
    titleKey: "home.occasions.corporate.title",
    titleFallback: "Business Lunch",
    descKey: "home.occasions.corporate.desc",
    descFallback: "Premium-Catering für Meetings, Launches, Offsites und Empfänge.",
    section: "corporate" as const,
    href: "/request/new?occasion=corporate",
  },
  {
    titleKey: "home.occasions.private.title",
    titleFallback: "Private Dinner",
    descKey: "home.occasions.private.desc",
    descFallback: "Kuratiertes Catering für Geburtstage, Familienfeiern und private Dinner.",
    section: "private" as const,
    href: "/request/new?occasion=private",
  },
  {
    titleKey: "home.occasions.ramadan.title",
    titleFallback: "Ramadan Iftar",
    descKey: "home.occasions.ramadan.desc",
    descFallback: "Stilvolles Iftar-Catering für Familien, Unternehmen und Communities.",
    section: "ramadan" as const,
    href: "/request/new?occasion=ramadan",
  },
  {
    titleKey: "home.occasions.christmas.title",
    titleFallback: "Weihnachtsfeier",
    descKey: "home.occasions.christmas.desc",
    descFallback: "Festliches Catering für Firmenfeiern, Familienessen und Winterevents.",
    section: "christmas" as const,
    href: "/request/new?occasion=christmas",
  },
];

const featuredCaterers = [
  {
    name: "Maison Verde Catering",
    type: "Modern European",
    location: "Berlin",
    price: "ab €38 p.P.",
    tag: "Corporate & Private",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=85",
    alt: "Modern European plated food",
  },
  {
    name: "Gold Table Events",
    type: "Wedding & Private Dining",
    location: "Berlin",
    price: "ab €52 p.P.",
    tag: "Wedding Specialist",
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=900&q=85",
    alt: "Elegant wedding catering food",
  },
  {
    name: "Urban Feast Studio",
    type: "Corporate Catering",
    location: "Berlin",
    price: "ab €29 p.P.",
    tag: "Business Catering",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=85",
    alt: "Corporate catering food",
  },
];

export default function Home() {
  const t = useT();

  const chips = [
    {
      label: t("home.hero.chipWedding", "Hochzeit"),
      href: "/request/new?occasion=wedding",
    },
    {
      label: t("home.hero.chipCorporate", "Business Lunch"),
      href: "/request/new?occasion=corporate",
    },
    {
      label: t("home.hero.chipPrivate", "Private Dinner"),
      href: "/request/new?occasion=private",
    },
    {
      label: t("home.hero.chipRamadan", "Ramadan Iftar"),
      href: "/request/new?occasion=ramadan",
    },
    {
      label: t("home.hero.chipChristmas", "Weihnachtsfeier"),
      href: "/request/new?occasion=christmas",
    },
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

        <div className="absolute inset-0 bg-gradient-to-r from-[#102f28]/90 via-[#102f28]/70 to-[#102f28]/20" />

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
                className="mt-3 inline-flex min-h-14 items-center justify-center rounded-2xl bg-[#c9a45c] px-7 font-semibold text-[#173f35] transition hover:bg-[#d7b66d] md:mt-0"
              >
                {t("home.hero.cta", "Caterer finden")}
              </Link>
            </div>

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
              className="rounded-[2rem] border border-[#eadfce] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-4 leading-7 text-[#5c6f68]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#faf6ee] py-24 text-[#16372f]">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
              {t("home.premium.label", "Premium-Präsentation")}
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              {t(
                "home.premium.title",
                "Catering ist emotional. Die Buchung sollte hochwertig wirken."
              )}
            </h2>

            <p className="mt-6 text-lg leading-8 text-[#5c6f68]">
              {t(
                "home.premium.text",
                "Speisely kombiniert elegante Präsentation mit klarer Marketplace-Logik: Pakete, strukturierte Anfragen, verifizierte Caterer und eine geführte Customer Journey."
              )}
            </p>
          </div>

          <DynamicUnsplashImage
            section="premium"
            className="h-[480px] rounded-[2rem] shadow-sm"
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {occasionCards.map((card) => (
            <Link
              key={card.titleKey}
              href={card.href}
              className="group overflow-hidden rounded-[2rem] border border-[#eadfce] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <DynamicUnsplashImage
                section={card.section}
                className="h-56"
                imageClassName="transition duration-500 group-hover:scale-110"
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 50vw, 100vw"
              />

              <div className="p-6">
                <h3 className="text-xl font-semibold">
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

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-sm ring-1 ring-[#eadfce]">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="bg-white p-8 text-[#16372f] md:p-12">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
                {t("home.caterers.label", "Kuratierte Caterer")}
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight">
                {t(
                  "home.caterers.title",
                  "Ein Marktplatz, der ausgewählt wirkt — nicht überfüllt."
                )}
              </h2>

              <p className="mt-5 leading-8 text-[#5c6f68]">
                {t(
                  "home.caterers.text",
                  "Entdecken Sie geprüfte Catering-Partner mit klaren Paketen, hochwertigen Bildern und passenden Event-Spezialisierungen."
                )}
              </p>

              <Link
                href="/caterers"
                className="mt-8 inline-flex rounded-full bg-[#173f35] px-6 py-3 font-semibold text-white transition hover:bg-[#0f2f27]"
              >
                {t("home.caterers.cta", "Caterer ansehen")} →
              </Link>
            </div>

            <div className="grid gap-5 bg-[#faf6ee] p-6 md:grid-cols-3 md:p-8">
              {featuredCaterers.map((caterer) => (
                <Link
                  key={caterer.name}
                  href="/caterers"
                  className="group overflow-hidden rounded-[1.75rem] border border-[#eadfce] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={caterer.image}
                      alt={caterer.alt}
                      fill
                      sizes="(min-width: 768px) 25vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="p-5">
                    <div className="mb-4 inline-flex rounded-full bg-[#f4ead7] px-3 py-1 text-xs font-semibold text-[#8a6d35]">
                      {caterer.tag}
                    </div>

                    <h3 className="text-lg font-semibold">{caterer.name}</h3>
                    <p className="mt-2 text-sm text-[#5c6f68]">
                      {caterer.type}
                    </p>

                    <div className="mt-5 flex justify-between text-sm">
                      <span>{caterer.location}</span>
                      <span className="font-semibold">{caterer.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 md:grid-cols-2">
        <DynamicUnsplashImage
          section="caterer-inquiries"
          className="h-[460px] rounded-[2rem] shadow-sm"
          sizes="(min-width: 768px) 50vw, 100vw"
        />

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
            {t("home.forCaterers.label", "Für Caterer")}
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight">
            {t(
              "home.forCaterers.title",
              "Erhalten Sie bessere Anfragen, nicht nur zufällige Leads."
            )}
          </h2>

          <p className="mt-6 text-lg leading-8 text-[#5c6f68]">
            {t(
              "home.forCaterers.text",
              "Speisely hilft Caterern, strukturierte Anfragen mit Eventdetails, Budget, Gästezahl und Service-Erwartungen zu erhalten."
            )}
          </p>

          <Link
            href="/for-caterers"
            className="mt-8 inline-flex rounded-full bg-[#173f35] px-6 py-3 font-semibold text-white transition hover:bg-[#0f2f27]"
          >
            {t("home.forCaterers.cta", "Als Caterer beitreten")}
          </Link>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-[#173f35] px-8 py-16 text-center text-white md:px-16">
          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
            {t(
              "home.final.title",
              "Planen Sie Ihr nächstes Catering mit KI-Unterstützung."
            )}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/75">
            {t(
              "home.final.text",
              "Starten Sie mit einer einfachen Beschreibung. Speisely macht daraus ein klares Briefing und führt Sie zum passenden Caterer."
            )}
          </p>

          <Link
            href="/request/new"
            className="mt-8 inline-flex rounded-full bg-[#d7b66d] px-8 py-4 font-semibold text-[#173f35]"
          >
            {t("home.final.cta", "Event beschreiben")}
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#eadfce] px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-[#5c6f68] md:flex-row">
          <p>
            © 2026 Speisely.{" "}
            {t("footer.tagline", "Premium KI-gestützter Catering-Marktplatz.")}
          </p>

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
