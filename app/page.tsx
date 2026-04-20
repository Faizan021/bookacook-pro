"use client";

import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const valuePillars = [
  {
    icon: BrainCircuit,
    title: "Natürlichsprachiges Event-Verständnis",
    description:
      "Speisely erfasst Event-Anforderungen so, wie Kunden sie tatsächlich formulieren – nicht nur über starre Filter oder Kategorien.",
  },
  {
    icon: ShieldCheck,
    title: "Kuratiertes Premium-Netzwerk",
    description:
      "Wir verbinden Event-Anfragen mit ausgewählten Catering-Partnern, die zu Qualität, Stil und Anspruch passen.",
  },
  {
    icon: CheckCircle2,
    title: "Präzisere Vermittlung",
    description:
      "Aus Anlass, Gästezahl, Budget, Küche und Serviceformat entstehen qualifiziertere und hochwertigere Matches.",
  },
];

const howItWorks = [
  {
    number: "01",
    title: "Event beschreiben",
    description:
      "Teilen Sie Anlass, Gästezahl, kulinarische Richtung, Servicewünsche und besondere Anforderungen in natürlicher Sprache mit.",
  },
  {
    number: "02",
    title: "Bedarf intelligent verstehen",
    description:
      "Speisely interpretiert Ihre Anfrage semantisch – mit mehr Kontext, Stilverständnis und Hospitality-Fit als klassische Marktplätze.",
  },
  {
    number: "03",
    title: "Passende Partner erhalten",
    description:
      "Sie erhalten qualifizierte Catering-Matches, die besser zu Eventtyp, Anspruch und Durchführung passen.",
  },
];

const occasions = [
  {
    title: "Hochzeiten",
    description:
      "Elegante Catering-Lösungen für unvergessliche Feiern mit gehobenem Anspruch.",
  },
  {
    title: "Corporate Events",
    description:
      "Professionelle Hospitality für Business-Dinner, Team-Events, Empfänge und Firmenveranstaltungen.",
  },
  {
    title: "Private Feiern",
    description:
      "Hochwertige Catering-Optionen für stilvolle persönliche Anlässe und besondere Momente.",
  },
  {
    title: "Brand Events",
    description:
      "Kuratiertes Catering für Launches, Showrooms, Presse-Events und exklusive Gästebetreuung.",
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#07110c] text-[#f6f1e8]">
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(circle at top center, rgba(196,152,64,0.16) 0%, transparent 28%), radial-gradient(circle at 15% 85%, rgba(72,101,82,0.18) 0%, transparent 24%), radial-gradient(circle at 85% 30%, rgba(40,60,48,0.18) 0%, transparent 18%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_22%,transparent_72%,rgba(255,255,255,0.02))]" />
      </div>

      <header className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-8">
        <Link href="/" className="flex items-center gap-3 text-[#eadfca]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c49840]/25 bg-[#c49840]/10 text-sm font-semibold">
            S
          </div>
          <div>
            <div className="text-xl font-semibold tracking-tight">Speisely</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-[#d8d1c2]/75 md:flex">
          <Link href="/caterers" className="transition hover:text-[#c49840]">
            Partner entdecken
          </Link>
          <Link href="/request/new" className="transition hover:text-[#c49840]">
            Event beschreiben
          </Link>
          <Link href="/about" className="transition hover:text-[#c49840]">
            Über Speisely
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-[#eadfca] transition hover:border-[#c49840]/40 hover:text-[#c49840] md:inline-flex"
          >
            Login
          </Link>
          <Link
            href="/request/new"
            className="rounded-full bg-[#c49840] px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02]"
          >
            Jetzt starten
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-14 md:px-8 md:pb-24 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/20 bg-[#c49840]/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
            <Sparkles className="h-3.5 w-3.5" />
            KI-gestützte Hospitality Intelligence
          </div>

          <h1 className="mt-8 text-5xl font-medium leading-[0.98] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[82px]">
            Wo außergewöhnliche Events auf
            <span className="mt-2 block italic text-[#c49840]">
              intelligente Catering-Vermittlung treffen.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-[#a5b3a0] md:text-xl">
            Speisely hilft Kunden, Events in natürlicher Sprache zu beschreiben,
            und übersetzt diese Anforderungen in qualifizierte Catering-Matches
            für Hochzeiten, Corporate Events und private Feiern.
          </p>

          <div className="mx-auto mt-12 max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex h-16 flex-1 items-center rounded-[1.4rem] bg-black/10 px-5">
                <input
                  type="text"
                  placeholder="Hochzeit in Berlin für 90 Gäste, elegantes Dinner, vegetarische Optionen, moderner europäischer Stil..."
                  className="w-full bg-transparent text-[15px] text-white placeholder:text-white/30 focus:outline-none"
                />
              </div>

              <Link
                href="/request/new"
                className="flex h-16 items-center justify-center gap-2 rounded-[1.3rem] bg-[#c49840] px-7 font-semibold text-black transition hover:scale-[1.02]"
              >
                Event beschreiben
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/caterers"
                className="flex h-16 items-center justify-center rounded-[1.3rem] border border-white/10 bg-white/[0.03] px-7 font-semibold text-white transition hover:border-[#c49840]/40 hover:text-[#c49840]"
              >
                Partner entdecken
              </Link>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-sm text-[#d7cfbf]">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
              Natürlichsprachige Anfrage
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
              Kuratierte Premium-Partner
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
              Intelligentere Vermittlung
            </span>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10 md:px-8 md:py-16">
        <div className="grid gap-5 lg:grid-cols-3">
          {valuePillars.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c49840]/20 bg-[#c49840]/10">
                  <Icon className="h-4.5 w-4.5 text-[#c49840]" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#92a18f]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
              So funktioniert Speisely
            </div>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-white md:text-5xl">
              Entwickelt, um den semantischen Abstand zwischen Event-Wunsch und Catering-Angebot zu schließen.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#9dac98]">
              Klassische Catering-Plattformen setzen auf Kategorien, Filter und manuelle
              Suche. Speisely versteht, was Kunden tatsächlich meinen, wenn sie ein Event
              beschreiben – und übersetzt diesen Bedarf in präzisere, hochwertigere Matches.
            </p>
          </div>

          <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
            <div className="grid gap-4 md:grid-cols-3">
              {howItWorks.map((step) => (
                <div
                  key={step.number}
                  className="rounded-[1.6rem] border border-white/10 bg-black/10 p-5"
                >
                  <div className="text-sm font-medium tracking-[0.2em] text-[#c49840]">
                    {step.number}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#8fa08d]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10 md:px-8 md:py-16">
        <div className="mb-10 max-w-3xl">
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
            Für besondere Anlässe
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
            Premium Catering für Events mit Anspruch
          </h2>
          <p className="mt-4 text-base leading-8 text-[#96a592]">
            Speisely ist für Anlässe konzipiert, bei denen Qualität, Stil und ein
            stimmiger Hospitality-Fit entscheidend sind.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {occasions.map((occasion) => (
            <div
              key={occasion.title}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl"
            >
              <h3 className="text-xl font-semibold text-white">{occasion.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#92a18f]">
                {occasion.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-12 md:px-8">
        <div className="rounded-[2.4rem] border border-white/10 bg-white/[0.045] px-8 py-12 text-center backdrop-blur-xl md:px-12 md:py-16">
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
            Premium Event Planning
          </div>
          <h3 className="mt-4 text-3xl font-semibold text-white md:text-5xl">
            Planen Sie Ihr Event mit mehr Präzision.
          </h3>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#94a391]">
            Beschreiben Sie Ihr Event einmal – Speisely übersetzt Ihre Anforderungen
            in eine hochwertigere, intelligentere Catering-Vermittlung.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/request/new"
              className="inline-flex items-center gap-2 rounded-[1rem] bg-[#c49840] px-6 py-3.5 font-semibold text-black transition hover:scale-[1.02]"
            >
              Jetzt starten
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/caterers"
              className="inline-flex items-center rounded-[1rem] border border-white/10 bg-white/[0.03] px-6 py-3.5 font-semibold text-white transition hover:border-[#c49840]/40 hover:text-[#c49840]"
            >
              Partner entdecken
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 py-10 text-center">
        <p className="text-sm text-[#7f9380]">
          © 2026 Speisely. Natürlichsprachige Hospitality Intelligence.
        </p>
      </footer>
    </main>
  );
}
