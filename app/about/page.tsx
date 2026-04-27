"use client";

import Image from "next/image";
import Link from "next/link";
import { SpeiselyHeader } from "@/components/layout/SpeiselyHeader";

const images = {
  hero:
    "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1400&q=85",
  trust:
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1400&q=85",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#faf6ee] text-[#16372f]">
      <SpeiselyHeader />

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:py-24">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-[#e8dcc8] bg-white px-4 py-2 text-sm font-semibold text-[#8a6d35] shadow-sm">
            Über Speisely
          </div>

          <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
            Catering-Suche soll sich nicht wie ein altes Branchenbuch anfühlen.
          </h1>

          <p className="mt-6 text-lg leading-8 text-[#5c6f68]">
            Speisely verbindet Premium-Präsentation mit KI-gestützter
            Eventplanung. Kunden beschreiben ihr Event in natürlicher Sprache,
            Speisely strukturiert daraus ein klares Briefing und verbindet sie
            mit passenden Catering-Partnern.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/request/new"
              className="rounded-full bg-[#173f35] px-7 py-4 font-semibold text-white shadow-sm transition hover:bg-[#0f2f27]"
            >
              Event beschreiben →
            </Link>

            <Link
              href="/caterers"
              className="rounded-full border border-[#d8ccb9] bg-white px-7 py-4 font-semibold text-[#173f35] shadow-sm transition hover:bg-[#f4ead7]"
            >
              Caterer entdecken
            </Link>
          </div>
        </div>

        <div className="relative h-[560px] overflow-hidden rounded-[2.5rem] shadow-sm">
          <Image
            src={images.hero}
            alt="Premium catering food presentation"
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-[2.5rem] border border-[#eadfce] bg-white p-8 shadow-sm md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
            Unsere Richtung
          </p>

          <h2 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
            Speisely ist kein generisches Verzeichnis. Es ist ein geführter Weg
            vom Eventwunsch zur passenden Catering-Lösung.
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "KI-gestützte Entdeckung",
                text: "Speisely verwandelt natürliche Event-Anfragen in ein klares Catering-Briefing.",
              },
              {
                title: "Kuratiert und hochwertig",
                text: "Wir setzen auf ein selektiveres, vertrauenswürdigeres Catering-Erlebnis.",
              },
              {
                title: "Besser für beide Seiten",
                text: "Kunden erhalten Orientierung, Caterer erhalten klarere und passendere Anfragen.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[2rem] border border-[#eadfce] bg-[#faf6ee] p-8"
              >
                <div className="mb-6 h-12 w-12 rounded-full bg-[#173f35]" />
                <h3 className="text-2xl font-semibold">{item.title}</h3>
                <p className="mt-4 leading-7 text-[#5c6f68]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 md:grid-cols-2">
        <div className="relative h-[460px] overflow-hidden rounded-[2.5rem] shadow-sm">
          <Image
            src={images.trust}
            alt="Professional catering kitchen preparation"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
            Warum Speisely
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight">
            Weil Catering mehr Vertrauen braucht als eine einfache Liste.
          </h2>

          <p className="mt-6 text-lg leading-8 text-[#5c6f68]">
            Event-Catering ist beratungsintensiv: Budget, Gästezahl, Küche,
            Serviceart, Location und Atmosphäre müssen zusammenpassen. Speisely
            macht diese Informationen früh sichtbar und hilft Kunden, bessere
            Entscheidungen zu treffen.
          </p>
        </div>
      </section>
    </main>
  );
}
