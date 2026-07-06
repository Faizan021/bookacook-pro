import { createFileRoute, Link } from "@tanstack/react-router";
import { trackEvent } from "@/utils/posthog";
import { useMemo, useState } from "react";
import {
  Search,
  Star,
  Clock,
  MapPin,
  ChevronDown,
  Navigation,
  UtensilsCrossed,
  X,
  Zap,
  ShieldCheck,
  MapPin as MapPinIcon,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/i18n/I18nProvider";
import { getRestaurants, type Dietary, type Restaurant } from "@/data/restaurants";
import { TrustSection } from "@/components/TrustSection";
import { MarketplacePromiseCTA } from "@/components/MarketplacePromiseCTA";

import { z } from "zod";

export const Route = createFileRoute("/instant-order")({
  head: () => ({
    meta: [
      { title: "Sofort bestellen — Restaurants in deiner Nähe · Speisely" },
      {
        name: "description",
        content:
          "Restaurants in deiner Nähe mit Live-Verfügbarkeit, transparenten Preisen und schnellen Lieferzeiten.",
      },
      { property: "og:title", content: "Sofort bestellen — Speisely" },
      {
        property: "og:description",
        content: "Live-Verfügbarkeit und transparente Preise bei Restaurants in deiner Nähe.",
      },
      { property: "og:url", content: "/instant-order" },
    ],
    links: [{ rel: "canonical", href: "/instant-order" }],
  }),
  validateSearch: z.object({
    q: z.string().optional(),
  }),
  loader: async () => await getRestaurants(),
  component: InstantOrder,
});

type SortKey = "time" | "fee";

const parseMinutes = (s: string) => {
  const m = s.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 999;
};
const parseFee = (s: string) => parseFloat(s.replace(/[^\d.]/g, "")) || 0;

function InstantOrder() {
  const search = Route.useSearch();
  const restaurants = Route.useLoaderData() as Restaurant[];
  const { t, lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);

  const [activeFilter, setActiveFilter] = useState("all");
  const [sort, setSort] = useState<SortKey>("time");
  const [query, setQuery] = useState(search.q || "");
  const [location, setLocation] = useState("");
  const [locOpen, setLocOpen] = useState(false);
  const [locDraft, setLocDraft] = useState("");

  const suggestedCities = [
    "Berlin",
    "Hamburg",
    "München",
    "Köln",
    "Frankfurt",
    "Stuttgart",
    "Düsseldorf",
    "Leipzig",
  ];

  const DEFAULT_FILTER = "all";
  const DEFAULT_SORT: SortKey = "time";

  const filters: { id: string; label: string }[] = [
    { id: "all", label: t("io.filter.all") },
    { id: "fast", label: t("io.filter.fast") },
    { id: "healthy", label: t("io.filter.healthy") },
    { id: "italian", label: t("io.filter.italian") },
    { id: "asian", label: t("io.filter.asian") },
    { id: "vegan", label: t("io.filter.vegan") },
    { id: "vegetarian", label: tt("Vegetarisch", "Vegetarian") },
    { id: "gluten-free", label: tt("Glutenfrei", "Gluten-free") },
  ];

  const hasDietary = (rId: string, d: Dietary) =>
    restaurants.find((r) => r.id === rId)?.menu.some((m) => (m.dietary ?? []).includes(d)) ?? false;

  const filtered = useMemo(() => {
    const lowerQ = query.trim().toLowerCase();
    let list = restaurants.filter((r) => {
      if (lowerQ && !`${r.name} ${r.tags.join(" ")} ${r.area}`.toLowerCase().includes(lowerQ))
        return false;
      const tagSet = r.tags.map((x) => x.toLowerCase());
      switch (activeFilter) {
        case "all":
          return true;
        case "fast":
          return parseMinutes(r.time) <= 30;
        case "healthy":
          return tagSet.includes("healthy");
        case "italian":
          return tagSet.includes("italian");
        case "asian":
          return tagSet.some((x) =>
            ["japanese", "asian", "chinese", "thai", "vietnamese"].includes(x),
          );
        case "vegan":
          return hasDietary(r.id, "vegan");
        case "vegetarian":
          return hasDietary(r.id, "vegetarian");
        case "gluten-free":
          return hasDietary(r.id, "gluten-free");
        default:
          return true;
      }
    });
    list = [...list].sort((a, b) => {
      if (sort === "time") return parseMinutes(a.time) - parseMinutes(b.time);
      return parseFee(a.fee) - parseFee(b.fee);
    });
    return list;
  }, [activeFilter, sort, query]);

  const resetFilters = () => {
    setActiveFilter(DEFAULT_FILTER);
    setSort(DEFAULT_SORT);
    setQuery("");
  };

  const sortOptions: { id: SortKey; label: string }[] = [
    { id: "time", label: tt("Lieferzeit (schnellste zuerst)", "Delivery time (fastest first)") },
    { id: "fee", label: tt("Liefergebühr (niedrigste zuerst)", "Delivery fee (lowest first)") },
  ];

  const instantOrderFaqs = [
    {
      question: {
        de: "Was ist der Unterschied zwischen Speisely und anderen Lieferdiensten?",
        en: "What's the difference between Speisely and other delivery apps?",
      },
      answer: {
        de: "Bei Speisely bestellen Sie provisionsfrei. Die Restaurants zahlen 0% Gebühren an uns, wodurch sie Ihnen oft bessere Preise oder größere Portionen anbieten können.",
        en: "With Speisely, you order commission-free. Restaurants pay 0% fees to us, which often allows them to offer you better prices or larger portions.",
      },
    },
    {
      question: {
        de: "Wie lange dauert die Lieferung im Durchschnitt?",
        en: "How long does delivery take on average?",
      },
      answer: {
        de: "Die Lieferzeit hängt vom gewählten Restaurant und Ihrer Entfernung ab. Die meisten Bestellungen werden innerhalb von 30 bis 45 Minuten geliefert.",
        en: "The delivery time depends on the chosen restaurant and your distance. Most orders are delivered within 30 to 45 minutes.",
      },
    },
    {
      question: {
        de: "Gibt es einen Mindestbestellwert für Sofortbestellungen?",
        en: "Is there a minimum order value for instant orders?",
      },
      answer: {
        de: "Jedes Restaurant legt seinen eigenen Mindestbestellwert fest. Sie sehen diesen direkt in der Übersichtskarte des jeweiligen Restaurants.",
        en: "Each restaurant sets its own minimum order value. You can see this directly in the overview card of the respective restaurant.",
      },
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: filtered.map((r, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Restaurant",
          name: r.name,
          url: `https://speisely.de/restaurant/${r.id}`,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: instantOrderFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.question[lang as "de" | "en"],
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer[lang as "de" | "en"],
        },
      })),
    },
  ];

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[60vh] flex items-center  pt-16 pb-24 lg:pt-20 lg:pb-36">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-cinematic.png"
            alt="Background"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/90 to-forest/40" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-white/90 shadow-sm">
              <Zap className="h-3.5 w-3.5 text-[#b28a3c]" /> {tt("0% Provision", "0% Commission")}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-[1.05] tracking-tight drop-shadow-sm">
              {tt("Lokal essen bestellen.", "Order local food.")} <br />
              <span className="text-[#b28a3c]">
                {tt("100% provisionsfrei.", "100% commission-free.")}
              </span>
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-xl leading-relaxed">
              {tt(
                "Unterstütze deine Lieblingsrestaurants direkt. Bei Speisely zahlst du keine versteckten Servicegebühren und die Restaurants zahlen 0% Provision pro Bestellung. Entdecke Top-Lokale in deiner Nähe.",
                "Support your favorite restaurants directly. With Speisely, you pay no hidden service fees and restaurants pay 0% commission per order. Discover top spots near you.",
              )}
            </p>

            <ul className="space-y-2.5 pt-2 text-sm sm:text-base text-white/90 font-medium">
              <li className="flex items-center gap-2.5">
                <BadgeCheck className="h-5 w-5 text-[#b28a3c] shrink-0" />
                {tt("0% Provision für Restaurants", "0% commission for restaurants")}
              </li>
              <li className="flex items-center gap-2.5">
                <BadgeCheck className="h-5 w-5 text-[#b28a3c] shrink-0" />
                {tt("Keine versteckten Servicegebühren", "No hidden service fees")}
              </li>
              <li className="flex items-center gap-2.5">
                <BadgeCheck className="h-5 w-5 text-[#b28a3c] shrink-0" />
                {tt("Direkte Unterstützung für Lokale", "Direct support for local spots")}
              </li>
            </ul>

            <div className="pt-4">
              <button
                onClick={() =>
                  document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" })
                }
                className="group flex items-center gap-2 rounded-full bg-[#b28a3c] hover:bg-[#9a7633] text-white px-7 py-3.5 text-sm sm:text-base font-semibold shadow-xl shadow-[#b28a3c]/20 transition-all cursor-pointer w-full sm:w-auto justify-center"
              >
                {tt("Jetzt Restaurants entdecken", "Discover restaurants now")}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 aspect-[4/3] max-h-[360px] group">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80"
              alt="Fast restaurant delivery"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md rounded-xl p-3 shadow-xl border border-white/20 flex items-center gap-3">
              <div className="p-2 bg-[#b28a3c]/20 rounded-lg text-[#f2d896]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-[12px] font-bold text-white leading-none">
                <div>100% {tt("Transparent", "Transparent")}</div>
                <div className="text-[10px] text-white/60 font-medium mt-1">
                  {tt("Keine versteckten Gebühren", "No hidden fees")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Input / Engine Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pt-10" id="listings">
        <div className="relative inline-block">
          <button
            type="button"
            onClick={() => {
              setLocDraft(location);
              setLocOpen((o) => !o);
            }}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-forest/60 hover:text-forest"
          >
            <MapPin className="h-3.5 w-3.5" />
            {location
              ? t("io.deliveryToSelected").replace("{location}", location)
              : t("io.deliveryToPlaceholder")}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {locOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setLocOpen(false)} />
              <div className="absolute left-0 top-full mt-2 z-40 w-[320px] rounded-2xl bg-white shadow-xl ring-1 ring-forest/10 p-4">
                <label
                  htmlFor="delivery-address"
                  className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-forest/60"
                >
                  {tt("Lieferadresse", "Delivery address")}
                </label>
                <input
                  id="delivery-address"
                  autoFocus
                  aria-label={tt("Lieferadresse", "Delivery address")}
                  value={locDraft}
                  onChange={(e) => setLocDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && locDraft.trim()) {
                      setLocation(locDraft.trim());
                      setLocOpen(false);
                    }
                  }}
                  placeholder={tt("Adresse, PLZ oder Stadt", "Address, postal code or city")}
                  className="mt-2 w-full rounded-full bg-cream/60 border border-[#eadfce] px-4 py-2.5 text-sm text-forest placeholder:text-forest/40 focus:outline-none focus:ring-2 focus:ring-[#b28a3c]/40"
                />

                <button
                  type="button"
                  onClick={() => {
                    setLocation(tt("Aktueller Standort", "Current location"));
                    setLocOpen(false);
                  }}
                  className="mt-3 inline-flex items-center gap-2 text-sm text-forest hover:text-[#b28a3c]"
                >
                  <Navigation className="h-4 w-4" />{" "}
                  {tt("Aktuellen Standort verwenden", "Use current location")}
                </button>
                <div className="mt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-forest/50">
                    {t("io.popularCities")}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {suggestedCities.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => {
                          setLocation(city);
                          setLocOpen(false);
                        }}
                        className={`rounded-full px-3 py-1.5 text-sm transition ${
                          location === city
                            ? "bg-[#b28a3c] text-[#16372f] font-semibold"
                            : "bg-cream text-forest hover:bg-[#eadfce]"
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => setLocOpen(false)}
                    className="rounded-full px-4 py-2 text-sm text-forest/70 hover:text-forest"
                  >
                    {tt("Abbrechen", "Cancel")}
                  </button>
                  <button
                    onClick={() => {
                      if (locDraft.trim()) {
                        setLocation(locDraft.trim());
                        setLocOpen(false);
                      }
                    }}
                    className="rounded-full bg-[#b28a3c] text-[#16372f] px-4 py-2 text-sm font-semibold hover:opacity-90"
                  >
                    {tt("Übernehmen", "Apply")}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-forest leading-[0.95]">
            {t("io.nearYou")}
          </h2>
          <div className="surface-card flex items-center gap-3 px-5 py-3 lg:w-[380px]">
            <Search className="h-4 w-4 text-forest/60 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("io.search")}
              className="w-full bg-transparent outline-none text-sm placeholder:text-forest/50"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                activeFilter === f.id
                  ? "bg-forest text-[oklch(0.97_0.02_92)]"
                  : "bg-cream text-forest hover:bg-[oklch(0.93_0.04_92)]"
              }`}
            >
              {f.label}
            </button>
          ))}
          <div className="ml-auto inline-flex items-center gap-2 text-sm text-forest/70">
            <label htmlFor="sortby" className="whitespace-nowrap">
              {tt("Sortieren nach", "Sort by")}
            </label>
            <div className="relative">
              <select
                id="sortby"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="appearance-none rounded-full bg-cream text-forest pl-4 pr-9 py-2 text-sm hover:bg-[oklch(0.93_0.04_92)] focus:outline-none focus:ring-2 focus:ring-[#b28a3c]/40 cursor-pointer"
              >
                {sortOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-forest/60" />
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 mt-10 pb-16">
        {filtered.length === 0 ? (
          <div className="mx-auto max-w-md text-center py-16">
            <div className="mx-auto h-16 w-16 grid place-items-center rounded-full bg-[#eadfce] text-[#b28a3c]">
              <UtensilsCrossed className="h-7 w-7" />
            </div>
            <h3 className="mt-5 font-display text-2xl text-forest">
              {tt("Keine Restaurants gefunden", "No restaurants found")}
            </h3>
            <p className="mt-2 text-sm text-forest/70">
              {tt(
                "Versuche eine andere Suche oder passe deine Filter an.",
                "Try a different search or adjust your filters.",
              )}
            </p>
            <button
              onClick={resetFilters}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#b28a3c] text-[#16372f] px-5 py-2.5 text-sm font-semibold hover:opacity-90"
            >
              <X className="h-4 w-4" />
              {tt("Filter zurücksetzen", "Reset filters")}
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <Link
                key={r.id}
                to="/restaurant/$slug"
                params={{ slug: r.id }}
                className="group flex flex-col surface-card p-3 transition hover:shadow-md hover:ring-[#b28a3c]/30"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-forest/5 rounded-2xl">
                  <img
                    src={r.img}
                    alt={r.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <button
                    className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-forest/40 shadow-sm backdrop-blur-sm transition hover:text-[#b28a3c]"
                    aria-label={tt("Zu Favoriten hinzufügen", "Add to favorites")}
                  >
                    <Star className="h-4 w-4" />
                  </button>
                  {r.isShowcase && (
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-forest/90 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm backdrop-blur-md uppercase tracking-wider">
                      {tt("Demo Provider", "Demo Provider")}
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-forest shadow-sm backdrop-blur-md uppercase tracking-wider">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {tt("Geprüft", "Verified")}
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-forest shadow-sm backdrop-blur-md">
                      <Clock className="h-3.5 w-3.5 text-forest/70" />
                      {r.time}
                    </div>
                  </div>
                </div>
                <div className="mt-4 px-1 pb-1">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-display text-lg font-bold text-forest truncate">
                      {r.name}
                    </h3>
                  </div>
                  <p className="text-xs text-forest/60 font-medium mb-3 truncate">
                    {r.tags?.join(" · ")}
                  </p>
                  <div className="flex items-center gap-3 text-xs font-semibold text-forest/70">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {r.distanceKm.toFixed(1)} km
                    </span>
                    <span className="text-forest/30">•</span>
                    <span>
                      {t("io.delivery")} {r.fee}
                    </span>
                    <span className="text-forest/30">•</span>
                    <span>
                      {tt("Mind.", "Min.")} €{r.minOrder}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Visible FAQ Section */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-10 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-forest mb-4">
            {tt(
              "Häufig gestellte Fragen zur Sofortbestellung",
              "Frequently Asked Questions about Instant Orders",
            )}
          </h2>
        </div>
        <div className="space-y-6">
          {instantOrderFaqs.map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-[#eadfce] shadow-sm">
              <h3 className="text-lg font-bold text-forest mb-2">
                {faq.question[lang as "de" | "en"]}
              </h3>
              <p className="text-forest/80 leading-relaxed">{faq.answer[lang as "de" | "en"]}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 rounded-full border border-forest/20 text-forest px-6 py-3 font-medium hover:bg-forest/5 transition"
          >
            {tt("Alle FAQs ansehen", "View all FAQs")}
          </Link>
        </div>
      </section>

      <MarketplacePromiseCTA vertical="restaurant" />
    </SiteShell>
  );
}
