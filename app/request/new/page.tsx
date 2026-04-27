"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SpeiselyHeader } from "@/components/layout/SpeiselyHeader";
import { DynamicUnsplashImage } from "@/components/home/DynamicUnsplashImage";
import { useT } from "@/lib/i18n/context";

const occasionPrompts = [
  {
    label: "Hochzeit",
    query:
      "Hochzeit für 80 Gäste in Berlin, vegetarisch, elegantes Buffet, ca. €45 pro Person",
  },
  {
    label: "Business Lunch",
    query:
      "Business Lunch für 45 Personen in Berlin Mitte, modern, vegetarische Optionen, ca. €30 pro Person",
  },
  {
    label: "Private Dinner",
    query:
      "Private Dinner für 20 Gäste in Berlin, Fine Dining, mediterran, ca. €70 pro Person",
  },
  {
    label: "Ramadan Iftar",
    query:
      "Ramadan Iftar für 60 Gäste in Berlin, halal, Buffet, warme Speisen und Desserts",
  },
  {
    label: "Weihnachtsfeier",
    query:
      "Weihnachtsfeier für 100 Mitarbeitende in Berlin, festliches Buffet, Getränke und Dessert",
  },
];

export default function NewRequestPage() {
  const t = useT();

  const [query, setQuery] = useState(occasionPrompts[0].query);

  const briefingItems = useMemo(
    () => [
      ["Event", query.toLowerCase().includes("business") ? "Business Lunch" : query.toLowerCase().includes("weihnacht") ? "Weihnachtsfeier" : query.toLowerCase().includes("iftar") ? "Ramadan Iftar" : query.toLowerCase().includes("private") ? "Private Dinner" : "Hochzeit"],
      ["Ort", query.toLowerCase().includes("berlin") ? "Berlin" : "Noch offen"],
      ["Gäste", query.match(/\d+/)?.[0] || "Noch offen"],
      ["Budget", query.includes("€") ? query.match(/€\s?\d+/)?.[0] || "Noch offen" : "Noch offen"],
      ["Ernährung", query.toLowerCase().includes("vegetar") ? "Vegetarisch" : query.toLowerCase().includes("halal") ? "Halal" : "Noch offen"],
      ["Stil", query.toLowerCase().includes("fine") ? "Fine Dining" : query.toLowerCase().includes("buffet") ? "Buffet" : "Elegant"],
    ],
    [query]
  );

  return (
    <main className="min-h-screen bg-[#faf6ee] text-[#16372f]">
      <SpeiselyHeader />

      <section className="mx-auto grid max-w-7xl items-start gap-14 px-6 py-16 lg:grid-cols-[1.03fr_0.97fr] lg:py-24">
        <div>
          <Link
            href="/"
            className="mb-8 inline-flex rounded-full border border-[#d8ccb9] bg-white px-4 py-2 text-sm font-semibold text-[#49645c] shadow-sm transition hover:bg-[#f4ead7]"
          >
            ← {t("request.back", "Zurück zur Startseite")}
          </Link>

          <div className="inline-flex rounded-full border border-[#eadfce] bg-white px-4 py-2 text-sm font-semibold text-[#8a6d35] shadow-sm">
            {t("request.label", "KI-gestützte Catering-Suche")}
          </div>

          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
            {t("request.title", "Beschreiben Sie Ihr Event. Speisely strukturiert den Rest.")}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5c6f68]">
            {t(
              "request.description",
              "Starten Sie mit natürlicher Sprache. Speisely erkennt Anlass, Gästezahl, Ort, Budget, Stil und Anforderungen — und führt Sie zu passenden Caterern."
            )}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {occasionPrompts.map((prompt) => (
              <button
                key={prompt.label}
                type="button"
                onClick={() => setQuery(prompt.query)}
                className="rounded-full border border-[#d8ccb9] bg-white px-4 py-2 text-sm font-semibold text-[#173f35] shadow-sm transition hover:bg-[#f4ead7]"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          <div className="mt-10 rounded-[2rem] border border-[#eadfce] bg-white p-5 shadow-sm">
            <label className="text-sm font-semibold text-[#173f35]">
              {t("request.inputLabel", "Ihre Eventbeschreibung")}
            </label>

            <textarea
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="mt-3 min-h-44 w-full resize-none rounded-2xl border border-[#e8dcc8] bg-[#faf6ee] p-5 text-base leading-7 outline-none transition focus:border-[#c9a45c]"
            />

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/customer"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#173f35] px-6 font-semibold text-white shadow-sm transition hover:bg-[#0f2f27]"
              >
                {t("request.continue", "Anfrage speichern und fortfahren")}
              </Link>

              <Link
                href="/caterers"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#d8ccb9] bg-white px-6 font-semibold text-[#173f35] shadow-sm transition hover:bg-[#f4ead7]"
              >
                {t("request.browse", "Caterer ansehen")}
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <DynamicUnsplashImage
            section="premium"
            className="h-80 rounded-[2.5rem] shadow-sm"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />

          <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
              {t("request.previewLabel", "Event-Briefing Vorschau")}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {briefingItems.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[#eadfce] bg-[#faf6ee] p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6d35]">
                    {label}
                  </p>
                  <p className="mt-2 font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
              {t("request.matchesLabel", "Passende Caterer")}
            </p>

            <div className="mt-6 space-y-4">
              {[
                "Berliner Genussküche",
                "Grüne Tafel Events",
                "Atelier Royal Dining",
              ].map((name, index) => (
                <div
                  key={name}
                  className="rounded-2xl border border-[#eadfce] bg-[#faf6ee] p-4 transition hover:bg-[#f4ead7]"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{name}</h3>
                      <p className="mt-1 text-sm text-[#5c6f68]">
                        Berlin · Premium Catering · Verifiziert
                      </p>
                    </div>
                    <span className="font-semibold text-[#b28a3c]">
                      {(4.9 - index * 0.1).toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/caterers"
              className="mt-5 inline-flex rounded-full bg-[#173f35] px-5 py-3 text-sm font-semibold text-white"
            >
              {t("request.viewMatches", "Alle passenden Caterer ansehen")} →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
