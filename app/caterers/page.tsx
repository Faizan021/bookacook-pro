"use client";

import Image from "next/image";
import Link from "next/link";
import { SpeiselyHeader } from "@/components/layout/SpeiselyHeader";

const images = {
  hero:
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1400&q=85",
  maison:
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=85",
  gold:
    "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1000&q=85",
  urban:
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=85",
  iftar:
    "https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=1000&q=85",
  christmas:
    "https://images.unsplash.com/photo-1481930916222-5ec4696fc0f2?auto=format&fit=crop&w=1000&q=85",
  fineDining:
    "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1000&q=85",
};

const caterers = [
  {
    name: "Maison Verde Catering",
    type: "Modern European",
    location: "Berlin",
    price: "ab €38 p.P.",
    tag: "Corporate & Private",
    image: images.maison,
    alt: "Modern European plated food",
  },
  {
    name: "Gold Table Events",
    type: "Wedding & Private Dining",
    location: "Berlin",
    price: "ab €52 p.P.",
    tag: "Wedding Specialist",
    image: images.gold,
    alt: "Elegant catered wedding food",
  },
  {
    name: "Urban Feast Studio",
    type: "Corporate Catering",
    location: "Berlin",
    price: "ab €29 p.P.",
    tag: "Business Catering",
    image: images.urban,
    alt: "Corporate catering food",
  },
  {
    name: "Royal Iftar Kitchen",
    type: "Ramadan & Family Events",
    location: "Berlin",
    price: "ab €34 p.P.",
    tag: "Iftar Catering",
    image: images.iftar,
    alt: "Iftar dinner table",
  },
  {
    name: "Winter Table Catering",
    type: "Christmas & Seasonal Events",
    location: "Berlin",
    price: "ab €42 p.P.",
    tag: "Christmas Events",
    image: images.christmas,
    alt: "Festive Christmas dinner table",
  },
  {
    name: "Atelier Royal Dining",
    type: "Fine Dining & Private Chef",
    location: "Berlin",
    price: "ab €59 p.P.",
    tag: "Fine Dining",
    image: images.fineDining,
    alt: "Fine dining plated dish",
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

        <div className="relative h-[560px] overflow-hidden rounded-[2.5rem] shadow-sm">
          <Image
            src={images.hero}
            alt="Premium private catering event table"
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
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

        <div className="mt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
            Partnerübersicht
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-tight">
            6 ausgewählte Partner
          </h2>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {caterers.map((caterer) => (
            <Link
              key={caterer.name}
              href="/request/new"
              className="group overflow-hidden rounded-[2rem] border border-[#eadfce] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-60 overflow-hidden">
                <Image
                  src={caterer.image}
                  alt={caterer.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
              </div>

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
