"use client";

import Link from "next/link";
import { useState } from "react";
import { SpeiselyHeader } from "@/components/layout/SpeiselyHeader";
import { DynamicUnsplashImage } from "@/components/home/DynamicUnsplashImage";
import { useT } from "@/lib/i18n/context";

export default function NewRequestPage() {
  const t = useT();

  const [query, setQuery] = useState(
    "Hochzeit für 80 Gäste in Berlin, vegetarisch, elegantes Buffet, ca. €45 pro Person"
  );

  return (
    <main className="min-h-screen bg-[#faf6ee] text-[#16372f]">
      <SpeiselyHeader />

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div>
          <Link
            href="/"
            className="mb-8 inline-flex rounded-full border border-[#d8ccb9] bg-white px-4 py-2 text-sm font-semibold text-[#49645c]"
          >
            ← {t("request.back", "Zurück zur Startseite")}
          </Link>

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
            {t("request.label", "KI-gestützte Catering-Suche")}
          </p>

          <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-6xl">
            {t("request.title", "Speisely versteht Ihr Event.")}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5c6f68]">
            {t(
              "request.description",
              "Beschreiben Sie Ihr Event in natürlicher Sprache. Speisely erstellt daraus ein klares Briefing und schlägt passende Caterer vor."
            )}
          </p>

          <div className="mt-10 rounded-[2rem] border border-[#eadfce] bg-white p-5 shadow-sm">
            <label className="text-sm font-semibold text-[#173f35]">
              {t("request.inputLabel", "Ihre Eventbeschreibung")}
            </label>

            <textarea
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="mt-3 min-h-40 w-full resize-none rounded-2xl border border-[#e8dcc8] bg-[#faf6ee] p-5 text-base leading-7 outline-none focus:border-[#c9a45c]"
            />

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/customer"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#173f35] px-6 font-semibold text-white"
              >
                {t("request.continue", "Anfrage speichern und fortfahren")}
              </Link>

              <Link
                href="/caterers"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#d8ccb9] bg-white px-6 font-semibold text-[#173f35]"
              >
                {t("request.browse", "Caterer ansehen")}
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <DynamicUnsplashImage
            section="premium"
            className="h-72 rounded-[2rem] shadow-sm"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />

          <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
              {t("request.previewLabel", "Event-Briefing Vorschau")}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["Event", "Hochzeit"],
                ["Ort", "Berlin"],
                ["Gäste", "80"],
                ["Budget", "€45 p.P."],
                ["Ernährung", "Vegetarisch"],
                ["Stil", "Elegant"],
              ].map(([label, value]) => (
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
                  className="rounded-2xl border border-[#eadfce] bg-[#faf6ee] p-4"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{name}</h3>
                      <p className="mt-1 text-sm text-[#5c6f68]">
                        Berlin · Premium Catering · Verifiziert
                      </p>
                    </div>
                    <span className="font-semibold text-[#b28a3c]">
                      {4.9 - index * 0.1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
