"use client";

import Link from "next/link";
import { DynamicUnsplashImage } from "@/components/home/DynamicUnsplashImage";
import { SpeiselyHeader } from "@/components/layout/SpeiselyHeader";

const caterers = [
  {
    name: "Maison Verde Catering",
    type: "Modern European",
    location: "Berlin",
    price: "ab €38 p.P.",
    section: "premium" as const,
    tag: "Corporate & Private",
  },
  {
    name: "Gold Table Events",
    type: "Wedding & Private Dining",
    location: "Berlin",
    price: "ab €52 p.P.",
    section: "wedding" as const,
    tag: "Wedding Specialist",
  },
  {
    name: "Urban Feast Studio",
    type: "Corporate Catering",
    location: "Berlin",
    price: "ab €29 p.P.",
    section: "corporate" as const,
    tag: "Business Catering",
  },
  {
    name: "Royal Iftar Kitchen",
    type: "Ramadan & Family Events",
    location: "Berlin",
    price: "ab €34 p.P.",
    section: "ramadan" as const,
    tag: "Iftar Catering",
  },
  {
    name: "Winter Table Catering",
    type: "Christmas & Seasonal Events",
    location: "Berlin",
    price: "ab €42 p.P.",
    section: "christmas" as const,
    tag: "Christmas Events",
  },
  {
    name: "Atelier Royal Dining",
    type: "Fine Dining & Private Chef",
    location: "Berlin",
    price: "ab €59 p.P.",
    section: "private" as const,
    tag: "Fine Dining",
  },
];

export default function CaterersPage() {
  return (
    <main className="min-h-screen bg-[#faf6ee] text-[#16372f]">
      <SpeiselyHeader />

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:py-24">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-[#eadfce] bg-white px-4 py-2 text-sm font-semibold text-[#8a6d35] shadow-sm">
            Kuratierte Premium-Partner
          </div>

          <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
            Entdecken Sie Catering-Partner für anspruchsvolle Events.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5c6f68]">
            Erkunden Sie ausgewählte Caterer für Hochzeiten, Corporate Events,
            private Feiern und hochwertige Hospitality-Formate.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {["Berlin", "Hochzeit", "Corporate", "Vegetarisch", "Fine Dining"].map(
              (chip) => (
                <Link
                  key={chip}
                  href={`/request/new?occasion=${encodeURIComponent(chip)}`}
                  className="rounded-full border border-[#d8ccb9] bg-white px-4 py-2 text-sm font-semibold text-[#173f35] shadow-sm transition hover:bg-[#f4ead7]"
                >
                  {chip}
                </Link>
              )
            )}
          </div>

          <Link
            href="/request/new"
            className="mt-8 inline-flex rounded-full bg-[#173f35] px-7 py-4 font-semibold text-white shadow-sm transition hover:bg-[#0f2f27]"
          >
            Lieber intelligent matchen lassen →
          </Link>
        </div>

        <DynamicUnsplashImage
          section="premium"
          priority
          className="h-[560px] rounded-[2.5rem] shadow-sm"
          imageClassName="scale-105"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-[2.5rem] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
            Filter & Auswahl
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <input
              placeholder="z. B. Hochzeit, vegan, Berlin..."
              className="rounded-2xl border border-[#e8dcc8] bg-[#faf6ee] px-5 py-4 outline-none focus:border-[#c9a45c]"
            />

            <input
              placeholder="Stadt"
              className="rounded-2xl border border-[#e8dcc8] bg-[#faf6ee] px-5 py-4 outline-none focus:border-[#c9a45c]"
            />

            <select className="rounded-2xl border border-[#e8dcc8] bg-[#faf6ee] px-5 py-4 outline-none focus:border-[#c9a45c]">
              <option>Alle Eventtypen</option>
              <option>Hochzeit</option>
              <option>Corporate</option>
              <option>Private Feier</option>
              <option>Weihnachtsfeier</option>
              <option>Ramadan Iftar</option>
            </select>

            <select className="rounded-2xl border border-[#e8dcc8] bg-[#faf6ee] px-5 py-4 outline-none focus:border-[#c9a45c]">
              <option>Alle Richtungen</option>
              <option>Fine Dining</option>
              <option>Buffet</option>
              <option>Vegetarisch</option>
              <option>Halal</option>
            </select>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
              Partnerübersicht
            </p>

            <h2 className="mt-3 text-4xl font-semibold tracking-tight">
              6 ausgewählte Partner
            </h2>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {caterers.map((caterer) => (
            <Link
              key={caterer.name}
              href="/request/new"
              className="group overflow-hidden rounded-[2rem] border border-[#eadfce] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <DynamicUnsplashImage
                section={caterer.section}
                className="h-60"
                imageClassName="transition duration-500 group-hover:scale-110"
                sizes="(min-width: 1024px) 33vw, 100vw"
              />

              <div className="p-6">
                <div className="mb-4 inline-flex rounded-full bg-[#f4ead7] px-3 py-1 text-xs font-semibold text-[#8a6d35]">
                  {caterer.tag}
                </div>

                <h3 className="text-2xl font-semibold">{caterer.name}</h3>

                <p className="mt-2 text-[#5c6f68]">{caterer.type}</p>

                <div className="mt-6 flex justify-between text-sm">
                  <span>{caterer.location}</span>
                  <span className="font-semibold">{caterer.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
