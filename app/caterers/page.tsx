"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SpeiselyHeader } from "@/components/layout/SpeiselyHeader";
import { useT } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";

type GermanLocation = {
  id: string;
  name: string;
  postal_code: string | null;
  state: string | null;
  lat: string | number | null;
  lng: string | number | null;
  type: string | null;
};

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
  const t = useT();

  const [search, setSearch] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<GermanLocation | null>(null);
  const [locationResults, setLocationResults] = useState<GermanLocation[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [eventType, setEventType] = useState("all");
  const [style, setStyle] = useState("all");

  useEffect(() => {
    const term = cityInput.trim();

    if (term.length < 2) {
      setLocationResults([]);
      return;
    }

    const timeout = window.setTimeout(async () => {
      setLocationLoading(true);

      try {
        const supabase = createClient();

        const isPostalCode = /^\d+$/.test(term);

        let query = supabase
          .from("german_locations")
          .select("id,name,postal_code,state,lat,lng,type")
          .limit(8);

        if (isPostalCode) {
          query = query.ilike("postal_code", `${term}%`);
        } else {
          query = query.ilike("name", `%${term}%`);
        }

        const { data, error } = await query.order("name", {
          ascending: true,
        });

        if (error) {
          console.error("Location search failed:", error.message);
          setLocationResults([]);
          return;
        }

        setLocationResults(data ?? []);
      } catch (error) {
        console.error("Location search failed:", error);
        setLocationResults([]);
      } finally {
        setLocationLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [cityInput]);

  function selectLocation(location: GermanLocation) {
    setSelectedLocation(location);
    setCityInput(
      `${location.postal_code ? `${location.postal_code} ` : ""}${location.name}`
    );
    setLocationResults([]);
  }

  const filteredCaterers = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    const cityTerm = selectedLocation?.name?.toLowerCase();

    return caterers.filter((caterer) => {
      const text = `${caterer.name} ${caterer.type} ${caterer.tag}`.toLowerCase();

      const matchesSearch = searchTerm ? text.includes(searchTerm) : true;
      const matchesCity = cityTerm
        ? caterer.location.toLowerCase().includes(cityTerm)
        : true;

      const matchesEvent =
        eventType === "all"
          ? true
          : text.includes(eventType.toLowerCase());

      const matchesStyle =
        style === "all" ? true : text.includes(style.toLowerCase());

      return matchesSearch && matchesCity && matchesEvent && matchesStyle;
    });
  }, [search, selectedLocation, eventType, style]);

  const chips = [
    t("marketplace.quick.berlin", "Berlin"),
    t("marketplace.quick.wedding", "Hochzeit"),
    t("marketplace.quick.corporate", "Corporate"),
    t("marketplace.quick.vegetarian", "Vegetarisch"),
    t("marketplace.quick.fineDining", "Fine Dining"),
  ];

  return (
    <main className="min-h-screen bg-[#faf6ee] text-[#16372f]">
      <SpeiselyHeader />

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:py-24">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-[#eadfce] bg-white px-4 py-2 text-sm font-semibold text-[#8a6d35] shadow-sm">
            {t("marketplace.badge", "Kuratierte Premium-Partner")}
          </div>

          <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
            {t(
              "marketplace.heroTitle",
              "Entdecken Sie Catering-Partner für anspruchsvolle Events."
            )}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5c6f68]">
            {t(
              "marketplace.heroSubtitle",
              "Erkunden Sie ausgewählte Caterer für Hochzeiten, Corporate Events, private Feiern und hochwertige Hospitality-Formate."
            )}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {chips.map((chip) => (
              <Link
                key={chip}
                href={`/request/new?occasion=${encodeURIComponent(chip)}`}
                className="rounded-full border border-[#d8ccb9] bg-white px-4 py-2 text-sm font-semibold text-[#173f35] shadow-sm transition hover:bg-[#f4ead7]"
              >
                {chip}
              </Link>
            ))}
          </div>

          <Link
            href="/request/new"
            className="mt-8 inline-flex rounded-full bg-[#173f35] px-7 py-4 font-semibold text-white shadow-sm transition hover:bg-[#0f2f27]"
          >
            {t("marketplace.smartMatchCta", "Lieber intelligent matchen lassen")} →
          </Link>
        </div>

        <div className="relative h-[560px] overflow-hidden rounded-[2.5rem] shadow-sm">
          <Image
            src={images.hero}
            alt={t(
              "marketplace.heroImageAlt",
              "Premium private catering event table"
            )}
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
            {t("marketplace.filtersTitle", "Filter & Auswahl")}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t(
                "marketplace.searchPlaceholder",
                "z. B. Hochzeit, vegan, Berlin..."
              )}
              className="rounded-2xl border border-[#e8dcc8] bg-[#faf6ee] px-5 py-4 outline-none focus:border-[#c9a45c]"
            />

            <div className="relative">
              <input
                value={cityInput}
                onChange={(event) => {
                  setCityInput(event.target.value);
                  setSelectedLocation(null);
                }}
                placeholder={t(
                  "marketplace.cityPlaceholder",
                  "Stadt oder PLZ"
                )}
                className="w-full rounded-2xl border border-[#e8dcc8] bg-[#faf6ee] px-5 py-4 outline-none focus:border-[#c9a45c]"
              />

              {locationResults.length > 0 && (
                <div className="absolute z-40 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-[#eadfce] bg-white p-2 shadow-xl">
                  {locationResults.map((location) => (
                    <button
                      key={location.id}
                      type="button"
                      onClick={() => selectLocation(location)}
                      className="w-full rounded-xl px-4 py-3 text-left transition hover:bg-[#faf6ee]"
                    >
                      <div className="font-semibold text-[#173f35]">
                        {location.postal_code} {location.name}
                      </div>
                      <div className="text-sm text-[#5c6f68]">
                        {location.state ?? "Deutschland"} ·{" "}
                        {location.type ?? "location"}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {locationLoading && (
                <p className="mt-2 text-sm text-[#5c6f68]">
                  {t("request.locationSearching", "Suche Orte...")}
                </p>
              )}
            </div>

            <select
              value={eventType}
              onChange={(event) => setEventType(event.target.value)}
              className="rounded-2xl border border-[#e8dcc8] bg-[#faf6ee] px-5 py-4 outline-none focus:border-[#c9a45c]"
            >
              <option value="all">
                {t("marketplace.allEventTypes", "Alle Eventtypen")}
              </option>
              <option value="wedding">
                {t("marketplace.eventWedding", "Hochzeit")}
              </option>
              <option value="corporate">
                {t("marketplace.eventCorporate", "Corporate")}
              </option>
              <option value="private">
                {t("marketplace.eventPrivate", "Private Feier")}
              </option>
              <option value="christmas">
                {t("home.occasions.christmas", "Weihnachtsfeier")}
              </option>
              <option value="iftar">
                {t("home.occasions.ramadan", "Ramadan Iftar")}
              </option>
            </select>

            <select
              value={style}
              onChange={(event) => setStyle(event.target.value)}
              className="rounded-2xl border border-[#e8dcc8] bg-[#faf6ee] px-5 py-4 outline-none focus:border-[#c9a45c]"
            >
              <option value="all">
                {t("marketplace.allStyles", "Alle Richtungen")}
              </option>
              <option value="fine dining">
                {t("marketplace.styleFineDining", "Fine Dining")}
              </option>
              <option value="buffet">
                {t("marketplace.styleBuffet", "Buffet")}
              </option>
              <option value="vegetarian">
                {t("marketplace.styleVegetarian", "Vegetarisch")}
              </option>
              <option value="halal">
                {t("marketplace.styleHalal", "Halal")}
              </option>
            </select>
          </div>
        </div>

        <div className="mt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
            {t("marketplace.resultsLabel", "Partnerübersicht")}
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-tight">
            {filteredCaterers.length}{" "}
            {t("marketplace.resultsCountSuffix", "ausgewählte Partner")}
          </h2>
        </div>

        {filteredCaterers.length === 0 ? (
          <div className="mt-8 rounded-[2rem] border border-dashed border-[#d8ccb9] bg-white p-10 text-center shadow-sm">
            <h3 className="text-2xl font-semibold">
              {t("marketplace.emptyTitle", "Keine Partner gefunden")}
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-[#5c6f68]">
              {t(
                "marketplace.emptySubtitle",
                "Passen Sie Ihre Filter an oder beschreiben Sie Ihr Event direkt, damit Speisely Sie intelligenter zum passenden Catering-Partner führen kann."
              )}
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCaterers.map((caterer) => (
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
        )}
      </section>
    </main>
  );
}
