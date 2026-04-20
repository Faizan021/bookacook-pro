"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { useT } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LogoMark } from "@/components/ui/logo-mark";

type CatererCard = {
  id: string;
  name: string;
  city: string;
  cuisine: string;
  description: string;
  tags: string[];
  startingPrice: string;
  guestRange: string;
  verified?: boolean;
  featured?: boolean;
  rating?: number;
};

export default function CaterersPage() {
  const t = useT();

  const sampleCaterers: CatererCard[] = [
    {
      id: "maison-ember",
      name: "Maison Ember",
      city: "Berlin",
      cuisine: "Live Fire & Contemporary European",
      description:
        "Elegantes Live-Fire-Catering für private Feiern, gehobene Outdoor-Events und designorientierte Hospitality-Konzepte.",
      tags: ["Live Fire", "Private Feiern", "Outdoor Hospitality"],
      startingPrice: "ab 49 € p. P.",
      guestRange: "40–180 Gäste",
      verified: true,
      featured: true,
      rating: 4.9,
    },
    {
      id: "atelier-royal-dining",
      name: "Atelier Royal Dining",
      city: "Hamburg",
      cuisine: "Wedding & Fine Dining",
      description:
        "Full-Service-Catering für Hochzeiten, elegante Dinner und anspruchsvolle Empfänge mit hochwertiger Ausführung.",
      tags: ["Hochzeiten", "Fine Dining", "Full Service"],
      startingPrice: "ab 69 € p. P.",
      guestRange: "50–250 Gäste",
      verified: true,
      featured: true,
      rating: 5.0,
    },
    {
      id: "studio-table-berlin",
      name: "Studio Table Berlin",
      city: "Berlin",
      cuisine: "Modern European",
      description:
        "Kuratiertes Premium-Catering für intime Dinner, private Anlässe und designorientierte Eventformate.",
      tags: ["Private Dining", "Modern European", "Kuratiert"],
      startingPrice: "ab 58 € p. P.",
      guestRange: "15–80 Gäste",
      featured: true,
      rating: 4.8,
    },
    {
      id: "green-plate-collective",
      name: "Green Plate Collective",
      city: "Köln",
      cuisine: "Vegetarisch & Vegan",
      description:
        "Pflanzenbasierte Catering-Konzepte mit gehobener Präsentation für moderne Corporate Events und stilvolle Feiern.",
      tags: ["Vegetarisch", "Vegan", "Saisonal"],
      startingPrice: "ab 36 € p. P.",
      guestRange: "30–160 Gäste",
      verified: true,
      rating: 4.7,
    },
    {
      id: "nordic-boardroom-catering",
      name: "Nordic Boardroom Catering",
      city: "München",
      cuisine: "Corporate & Executive Dining",
      description:
        "Professionelles Business-Catering für Board-Dinner, Team-Lunches und hochwertige Unternehmensveranstaltungen.",
      tags: ["Corporate", "Business Dining", "Executive"],
      startingPrice: "ab 42 € p. P.",
      guestRange: "20–140 Gäste",
      verified: true,
      rating: 4.8,
    },
    {
      id: "levant-feast-studio",
      name: "Levant Feast Studio",
      city: "Frankfurt",
      cuisine: "Middle Eastern",
      description:
        "Warme Sharing-Menüs und stilvolle Event-Begleitung für Empfänge, Familienfeiern und kulturelle Anlässe.",
      tags: ["Sharing Menüs", "Middle Eastern", "Celebrations"],
      startingPrice: "ab 39 € p. P.",
      guestRange: "30–200 Gäste",
      rating: 4.6,
    },
  ];

  const quickFilters = [
    t("marketplace.quick.berlin", "Berlin"),
    t("marketplace.quick.corporate", "Corporate"),
    t("marketplace.quick.wedding", "Hochzeit"),
    t("marketplace.quick.vegetarian", "Vegetarisch"),
    t("marketplace.quick.fineDining", "Fine Dining"),
    t("marketplace.quick.privateParty", "Private Feier"),
  ];

  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [eventType, setEventType] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");

  function applyQuickFilter(value: string) {
    const lower = value.toLowerCase();

    if (
      ["berlin", "hamburg", "münchen", "munich", "köln", "cologne", "frankfurt"].includes(
        lower,
      )
    ) {
      setCity(value);
      return;
    }

    if (
      ["corporate", "hochzeit", "wedding", "private feier", "private party"].includes(
        lower,
      )
    ) {
      setEventType(value);
      return;
    }

    if (["vegetarisch", "vegetarian", "fine dining"].includes(lower)) {
      setCuisine(value);
    }
  }

  function clearFilters() {
    setQuery("");
    setCity("");
    setEventType("");
    setCuisine("");
    setSpecialRequest("");
  }

  const filteredCaterers = useMemo(() => {
    return sampleCaterers.filter((caterer) => {
      const haystack = [
        caterer.name,
        caterer.city,
        caterer.cuisine,
        caterer.description,
        ...caterer.tags,
      ]
        .join(" ")
        .toLowerCase();

      const queryMatch = !query.trim() || haystack.includes(query.trim().toLowerCase());
      const cityMatch =
        !city.trim() || caterer.city.toLowerCase().includes(city.trim().toLowerCase());
      const eventMatch =
        !eventType ||
        haystack.includes(eventType.toLowerCase()) ||
        caterer.tags.some((tag) => tag.toLowerCase().includes(eventType.toLowerCase()));
      const cuisineMatch =
        !cuisine ||
        haystack.includes(cuisine.toLowerCase()) ||
        caterer.tags.some((tag) => tag.toLowerCase().includes(cuisine.toLowerCase()));
      const specialMatch =
        !specialRequest ||
        haystack.includes(specialRequest.toLowerCase()) ||
        caterer.tags.some((tag) =>
          tag.toLowerCase().includes(specialRequest.toLowerCase()),
        );

      return queryMatch && cityMatch && eventMatch && cuisineMatch && specialMatch;
    });
  }, [query, city, eventType, cuisine, specialRequest]);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#07110c] text-[#f6f1e8]">
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(circle at top center, rgba(196,152,64,0.15) 0%, transparent 28%), radial-gradient(circle at 15% 85%, rgba(72,101,82,0.18) 0%, transparent 24%), radial-gradient(circle at 85% 30%, rgba(40,60,48,0.16) 0%, transparent 18%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_22%,transparent_72%,rgba(255,255,255,0.02))]" />
      </div>

      <header className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-8">
        <Link href="/" className="flex items-center gap-3 text-[#eadfca]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c49840]/25 bg-[#c49840]/10">
            <LogoMark size={18} color="#e8ddc8" />
          </div>
          <div className="text-xl font-semibold tracking-tight">Speisely</div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-[#d8d1c2]/75 md:flex">
          <Link href="/caterers" className="text-[#c49840]">
            {t("home.nav.browse", "Caterer entdecken")}
          </Link>
          <Link href="/for-caterers" className="transition hover:text-[#c49840]">
            {t("home.nav.forCaterers", "Für Caterer")}
          </Link>
          <Link href="/about" className="transition hover:text-[#c49840]">
            {t("nav.about", "Über Speisely")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-[#eadfca] transition hover:border-[#c49840]/40 hover:text-[#c49840] md:inline-flex"
          >
            {t("home.nav.login", "Anmelden")}
          </Link>
          <Link
            href="/request/new"
            className="rounded-full bg-[#c49840] px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02]"
          >
            {t("home.editorialCtaPrimary", "Event beschreiben")}
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-10 pt-14 md:px-8 md:pb-14 md:pt-20">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/20 bg-[#c49840]/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t("marketplace.badge", "Kuratierte Premium-Partner")}
          </div>

          <h1 className="mt-8 text-4xl font-medium leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            {t("marketplace.title", "Entdecken Sie Catering-Partner")}
            <span className="mt-2 block italic text-[#c49840]">
              {t("marketplace.titleAccent", "für anspruchsvolle Events.")}
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#a4b29f]">
            {t(
              "marketplace.subtitle",
              "Erkunden Sie ausgewählte Catering-Partner für Hochzeiten, Corporate Events, private Feiern und hochwertige Hospitality-Formate — oder beschreiben Sie Ihr Event und lassen Sie Speisely intelligenter vermitteln.",
            )}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/request/new"
              className="inline-flex items-center justify-center gap-2 rounded-[1rem] bg-[#c49840] px-6 py-3.5 font-semibold text-black transition hover:scale-[1.02]"
            >
              {t("home.editorialCtaPrimary", "Event beschreiben")}
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              onClick={clearFilters}
              className="inline-flex items-center justify-center rounded-[1rem] border border-white/10 bg-white/[0.03] px-6 py-3.5 font-semibold text-white transition hover:border-[#c49840]/40 hover:text-[#c49840]"
            >
              {t("marketplace.clearFilters", "Filter zurücksetzen")}
            </button>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-8 md:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl md:p-6">
          <div className="mb-5 flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-[#c49840]">
            <SlidersHorizontal className="h-4 w-4" />
            {t("marketplace.filtersTitle", "Filter & Auswahl")}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-[1.2rem] border border-white/10 bg-black/10 px-4 py-3 xl:col-span-2">
              <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#8fa08d]">
                <Search className="h-3.5 w-3.5" />
                {t("marketplace.searchLabel", "Suche")}
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t(
                  "marketplace.searchPlaceholder",
                  "z. B. Hochzeit, Fine Dining, vegan, Berlin...",
                )}
                className="w-full bg-transparent text-white placeholder:text-white/30 focus:outline-none"
              />
            </div>

            <div className="rounded-[1.2rem] border border-white/10 bg-black/10 px-4 py-3">
              <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-[#8fa08d]">
                {t("marketplace.cityLabel", "Stadt")}
              </div>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={t("marketplace.cityPlaceholder", "z. B. Berlin")}
                className="w-full bg-transparent text-white placeholder:text-white/30 focus:outline-none"
              />
            </div>

            <div className="rounded-[1.2rem] border border-white/10 bg-black/10 px-4 py-3">
              <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-[#8fa08d]">
                {t("marketplace.eventTypeLabel", "Eventtyp")}
              </div>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-transparent text-white focus:outline-none"
              >
                <option value="" className="bg-[#0d1711]">
                  {t("marketplace.allEventTypes", "Alle Eventtypen")}
                </option>
                <option value="Hochzeit" className="bg-[#0d1711]">
                  {t("marketplace.eventWedding", "Hochzeit")}
                </option>
                <option value="Corporate" className="bg-[#0d1711]">
                  {t("marketplace.eventCorporate", "Corporate")}
                </option>
                <option value="Private Feier" className="bg-[#0d1711]">
                  {t("marketplace.eventPrivate", "Private Feier")}
                </option>
              </select>
            </div>

            <div className="rounded-[1.2rem] border border-white/10 bg-black/10 px-4 py-3">
              <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-[#8fa08d]">
                {t("marketplace.cuisineLabel", "Küche / Stil")}
              </div>
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full bg-transparent text-white focus:outline-none"
              >
                <option value="" className="bg-[#0d1711]">
                  {t("marketplace.allStyles", "Alle Richtungen")}
                </option>
                <option value="Fine Dining" className="bg-[#0d1711]">
                  {t("marketplace.styleFineDining", "Fine Dining")}
                </option>
                <option value="Vegetarisch" className="bg-[#0d1711]">
                  {t("marketplace.styleVegetarian", "Vegetarisch")}
                </option>
                <option value="Modern European" className="bg-[#0d1711]">
                  {t("marketplace.styleModernEuropean", "Modern European")}
                </option>
              </select>
            </div>

            <div className="rounded-[1.2rem] border border-white/10 bg-black/10 px-4 py-3 md:col-span-2 xl:col-span-5">
              <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-[#8fa08d]">
                {t("marketplace.specialLabel", "Besondere Wünsche")}
              </div>
              <input
                type="text"
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                placeholder={t(
                  "marketplace.specialPlaceholder",
                  "z. B. vegan, sharing, executive dining, plated service...",
                )}
                className="w-full bg-transparent text-white placeholder:text-white/30 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {quickFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => applyQuickFilter(filter)}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-[#e7e0d3] transition hover:border-[#c49840]/40 hover:bg-[#c49840] hover:text-black"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-10 md:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
              {t("marketplace.resultsLabel", "Partnerübersicht")}
            </div>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
              {filteredCaterers.length}{" "}
              {t("marketplace.resultsCountSuffix", "ausgewählte Partner")}
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#90a08d]">
              {t(
                "marketplace.resultsSubtitle",
                "Eine kuratierte Auswahl für Premium-Events, hochwertige Anlässe und anspruchsvolle Hospitality-Erlebnisse.",
              )}
            </p>
          </div>

          <Link
            href="/request/new"
            className="rounded-[1rem] border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-[#c49840]/40 hover:text-[#c49840]"
          >
            {t("marketplace.smartMatchCta", "Lieber intelligent matchen lassen")}
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCaterers.map((caterer) => (
            <div
              key={caterer.id}
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.06]"
            >
              <div className="relative border-b border-white/10 px-6 pb-5 pt-6">
                <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(196,152,64,0.12),transparent_70%)]" />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
                      <MapPin className="h-3.5 w-3.5" />
                      {caterer.city}
                    </div>
                    <h3 className="mt-3 text-2xl font-semibold text-white">
                      {caterer.name}
                    </h3>
                    <p className="mt-2 text-sm text-[#9baa98]">{caterer.cuisine}</p>
                  </div>

                  {caterer.verified && (
                    <span className="rounded-full border border-[#c49840]/20 bg-[#c49840]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c49840]">
                      {t("marketplace.verified", "Verifiziert")}
                    </span>
                  )}
                </div>
              </div>

              <div className="px-6 py-6">
                <p className="text-sm leading-7 text-[#9faf9b]">{caterer.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {caterer.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-[#ddd5c6]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-7 border-t border-white/10 pt-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-sm text-[#ddd5c6]">
                        <Star className="h-4 w-4 fill-[#c49840] text-[#c49840]" />
                        {caterer.rating ?? "4.8"}
                      </div>
                      <div className="mt-3 text-sm text-[#8ea18b]">{caterer.guestRange}</div>
                      <div className="mt-1 text-lg font-semibold text-white">
                        {caterer.startingPrice}
                      </div>
                    </div>

                    <Link
                      href={`/caterers/${caterer.id}`}
                      className="rounded-[0.9rem] bg-[#c49840] px-4 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.03]"
                    >
                      {t("marketplace.viewProfile", "Profil ansehen")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCaterers.length === 0 && (
          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center backdrop-blur-xl">
            <h3 className="text-2xl font-semibold text-white">
              {t("marketplace.emptyTitle", "Keine Partner gefunden")}
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#92a18f]">
              {t(
                "marketplace.emptySubtitle",
                "Passen Sie die Filter an oder beschreiben Sie Ihr Event direkt, damit Speisely Sie intelligenter zum passenden Catering-Partner führen kann.",
              )}
            </p>
            <Link
              href="/request/new"
              className="mt-6 inline-flex items-center gap-2 rounded-[1rem] bg-[#c49840] px-6 py-3.5 font-semibold text-black transition hover:scale-[1.02]"
            >
              {t("home.editorialCtaPrimary", "Event beschreiben")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
