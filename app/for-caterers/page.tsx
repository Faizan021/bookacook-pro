"use client";

import Image from "next/image";
import Link from "next/link";
import { SpeiselyHeader } from "@/components/layout/SpeiselyHeader";

const images = {
  hero:
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1400&q=85",
  leads:
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=85",
};

export default function ForCaterersPage() {
  return (
    <main className="min-h-screen bg-[#faf6ee] text-[#16372f]">
      <SpeiselyHeader />

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 md:grid-cols-2">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-[#e8dcc8] bg-white px-4 py-2 text-sm font-semibold text-[#8a6d35] shadow-sm">
            Für Premium-Caterer
          </div>

          <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
            Wachsen Sie mit besserer Sichtbarkeit für Ihr Catering.
          </h1>

          <p className="mt-6 text-lg leading-8 text-[#5c6f68]">
            Speisely hilft Caterern, strukturierte Event-Anfragen zu erhalten,
            Pakete professionell zu präsentieren und Chancen über eine
            hochwertige Plattform zu verwalten.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="rounded-full bg-[#173f35] px-7 py-4 font-semibold text-white shadow-sm transition hover:bg-[#0f2f27]"
            >
              Speisely beitreten →
            </Link>

            <Link
              href="/login"
              className="rounded-full border border-[#d8ccb9] bg-white px-7 py-4 font-semibold text-[#173f35] shadow-sm transition hover:bg-[#f4ead7]"
            >
              Caterer-Login
            </Link>
          </div>
        </div>

        <div className="relative h-[560px] overflow-hidden rounded-[2.5rem] shadow-sm">
          <Image
            src={images.hero}
            alt="Professional caterer preparing food"
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
          Warum mitmachen
        </p>

        <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
          Für Caterer gebaut, die bessere Anfragen wollen
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Hochwertige Sichtbarkeit",
              text: "Präsentieren Sie Ihre Marke, Pakete und Stärken auf einer Premium-Plattform.",
            },
            {
              title: "Klarere Event-Anfragen",
              text: "Erhalten Sie strukturierte Anfragen mit Anlass, Gästezahl, Stadt, Budget und Wünschen.",
            },
            {
              title: "Mehr passende Leads",
              text: "Speisely bringt Sie näher an Kunden, die wirklich zu Ihrem Angebot passen.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[2rem] border border-[#eadfce] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-6 h-12 w-12 rounded-full bg-[#173f35]" />
              <h3 className="text-2xl font-semibold">{item.title}</h3>
              <p className="mt-4 leading-7 text-[#5c6f68]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 md:grid-cols-2">
        <div className="relative h-[460px] overflow-hidden rounded-[2.5rem] shadow-sm">
          <Image
            src={images.leads}
            alt="Catering team serving event food"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
            Besser qualifizierte Anfragen
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight">
            Weniger zufällige Leads. Mehr passende Events.
          </h2>

          <p className="mt-6 text-lg leading-8 text-[#5c6f68]">
            Kunden beschreiben ihr Event mit Budget, Gästezahl, Ort, Stil und
            besonderen Anforderungen. Speisely strukturiert diese Informationen,
            bevor Caterer kontaktiert werden.
          </p>

          <Link
            href="/signup"
            className="mt-8 inline-flex rounded-full bg-[#173f35] px-7 py-4 font-semibold text-white"
          >
            Jetzt beitreten →
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#eadfce] px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-[#5c6f68] md:flex-row">
          <p>© 2026 Speisely. Premium KI-gestützter Catering-Marktplatz.</p>

          <div className="flex gap-6">
            <Link href="/caterers">Caterer entdecken</Link>
            <Link href="/for-caterers">Für Caterer</Link>
            <Link href="/about">Über Speisely</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
