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

      <section className="relative overflow-hidden">
        <DynamicUnsplashImage
          section="premium"
          priority
          className="absolute inset-0 h-full w-full"
          imageClassName="scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#102f28]/90 via-[#102f28]/65 to-[#102f28]/15" />

        <div className="relative mx-auto max-w-7xl px-6 py-28 text-white">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
              Kuratierte Premium-Partner
            </div>

            <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
              Entdecken Sie Catering-Partner für anspruchsvolle Events.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">
              Erkunden Sie ausgewählte Caterer für Hochzeiten, Corporate Events,
              private Feiern und hochwertige Hospitality-Formate.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {["Berlin", "Hochzeit", "Corporate", "Vegetarisch", "Fine Dining"].map(
                (chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur"
                  >
                    {chip}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
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
            </select>
            <select className="rounded-2xl border border-[#e8dcc8] bg-[#faf6ee] px-5 py-4 outline-none focus:border-[#c9a45c]">
              <option>Alle Richtungen</option>
              <option>Fine Dining</option>
              <option>Buffet</option>
              <option>Vegetarisch</option>
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

          <Link
            href="/request/new"
            className="inline-flex rounded-full bg-[#173f35] px-6 py-3 font-semibold text-white"
          >
            Lieber intelligent matchen lassen →
          </Link>
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
