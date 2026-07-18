/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link } from "@tanstack/react-router";
import { getMarketplaceRestaurants } from "@/lib/restaurant/public.functions";
import { getValidGeoLocations } from "@/lib/geo/server.functions";
import {
  Store,
  ArrowRight,
  MapPin,
  Utensils,
  Search,
  CheckCircle2,
  ChevronDown,
  Navigation,
} from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { useMemo, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/restaurants")({
  component: RestaurantsDirectory,
  loader: async () => {
    const [marketplaceData, validGeoLocations] = await Promise.all([
      getMarketplaceRestaurants(),
      getValidGeoLocations(),
    ]);
    return { ...marketplaceData, validGeoLocations };
  },
  head: () => ({
    meta: [
      { title: "Restaurants Marketplace | Speisely" },
      {
        name: "description",
        content:
          "Entdecke unabhängige Restaurants auf dem Speisely Marketplace und bestelle direkt. Fair für die Restaurants, besser für dich.",
      },
      { property: "og:title", content: "Restaurants Marketplace | Speisely" },
      {
        property: "og:description",
        content:
          "Entdecke unabhängige Restaurants auf dem Speisely Marketplace und bestelle direkt.",
      },
      { property: "og:image", content: "https://speisely.de/og-marketplace.jpg" },
      { property: "og:url", content: "https://speisely.de/restaurants" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://speisely.de/restaurants" }],
  }),
});

/** Haversine formula to compute distance in kilometers */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function RestaurantsDirectory() {
  const { restaurants, validGeoLocations } = Route.useLoaderData() as any;
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const { lang } = useI18n();

  // Browser Geolocation state
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<
    "idle" | "loading" | "active" | "denied" | "unavailable" | "timeout"
  >("idle");

  const tt = (de: string, en: string) => (lang === "de" ? de : en);

  // City entries come back as { path, label } — label is the official German city name
  const cityLinks = useMemo(() => {
    if (!validGeoLocations) return [];
    return (validGeoLocations as { path: string; label: string }[])
      .filter((e) => e.path.startsWith("/restaurant/ort/"))
      .map((e) => ({ slug: e.path.replace("/restaurant/ort/", ""), label: e.label, path: e.path }))
      .sort((a, b) => a.label.localeCompare(b.label, "de"));
  }, [validGeoLocations]);

  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return cityLinks;
    const q = citySearch.toLowerCase();
    return cityLinks.filter((c) => c.label.toLowerCase().includes(q));
  }, [cityLinks, citySearch]);

  const handleNearMeClick = () => {
    if (!navigator.geolocation) {
      setGeoStatus("unavailable");
      return;
    }
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGeoStatus("active");
        setLocation(""); // Clear manual city filter when active
      },
      (error) => {
        console.error("Geolocation error:", error);
        if (error.code === error.PERMISSION_DENIED) {
          setGeoStatus("denied");
        } else if (error.code === error.TIMEOUT) {
          setGeoStatus("timeout");
        } else {
          setGeoStatus("unavailable");
        }
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const handleResetLocation = () => {
    setUserCoords(null);
    setGeoStatus("idle");
  };

  const filteredAndSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const l = location.trim().toLowerCase();

    // 1. Filter
    const filteredList = restaurants.filter((rest: any) => {
      if (
        q &&
        !`${rest.name} ${rest.cuisine_type || ""} ${rest.city || ""} ${rest.description || ""}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }

      if (l) {
        const areaMatch = rest.city?.toLowerCase().includes(l);
        const addressMatch = rest.business_address?.toLowerCase().includes(l);
        const serviceAreas = rest.service_areas
          ? rest.service_areas.split(",").map((x: string) => x.trim().toLowerCase())
          : [];
        const serviceAreaMatch = serviceAreas.some(
          (area: string) => l.includes(area) || area.includes(l),
        );

        if (!areaMatch && !addressMatch && !serviceAreaMatch) {
          return false;
        }
      }

      return true;
    });

    // 2. Map distances and Sort if geolocation is active
    if (geoStatus === "active" && userCoords) {
      const listWithDistance = filteredList.map((rest: any) => {
        let distance: number | null = null;
        if (rest.lat != null && rest.lng != null) {
          distance = calculateDistance(userCoords.lat, userCoords.lng, rest.lat, rest.lng);
        }
        return { ...rest, distance };
      });

      // Sort by distance (restaurants with distance first, then null distances at the end)
      return listWithDistance.sort((a: any, b: any) => {
        if (a.distance === null && b.distance === null) return 0;
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    }

    return filteredList;
  }, [restaurants, query, location, geoStatus, userCoords]);

  const formatDistance = (dist: number) => {
    if (dist < 1) {
      return `${Math.round(dist * 1000)} m`;
    }
    return `${dist.toFixed(1)} km`;
  };

  return (
    <SiteShell>
      <div className="min-h-screen flex flex-col bg-[#fcfdfc]">
        <main className="flex-grow">
          {/* Hero Section — matches Catering & Planner cinematic style */}
          <div className="relative min-h-[420px] md:min-h-[500px] flex items-center overflow-hidden">
            {/* Cinematic background image */}
            <img
              src="/hero-cinematic.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Forest gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/90 to-forest/40" />
            <div className="absolute inset-0 bg-black/20" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
              {/* Gold pill badge */}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-white/90 shadow-sm mb-6">
                🍽 {tt("Speisely Marktplatz", "Speisely Marketplace")}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 tracking-tight max-w-2xl leading-tight">
                {tt("Lokales Essen bestellen. ", "Order local food. ")}
                <span className="text-[#f2d896]">{tt("Direkt & Fair.", "Direct & Fair.")}</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-xl mb-8">
                {tt(
                  "Entdecke unabhängige Restaurants in deiner Stadt und bestelle direkt — ohne Zwischenhändler, bessere Preise, fairer für alle.",
                  "Discover independent restaurants in your city and order directly — no middlemen, better prices, fairer for everyone.",
                )}
              </p>
            </div>
          </div>

          {/* Browse by City — collapsible accordion */}
          {cityLinks.length > 0 && (
            <section className="mx-auto max-w-7xl px-6 mt-10 mb-2">
              <div className="bg-white border border-[#e2e8e4] rounded-3xl shadow-sm overflow-hidden">
                {/* Header toggle */}
                <button
                  onClick={() => setCityOpen((o) => !o)}
                  className="w-full flex items-center justify-between px-8 py-5 hover:bg-cream/20 transition-colors cursor-pointer"
                  aria-expanded={cityOpen}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-leaf" />
                    <div className="text-left">
                      <h2 className="font-display text-xl font-bold text-forest">
                        {tt("Nach Stadt durchsuchen", "Browse by City")}
                      </h2>
                      <p className="text-sm text-forest/50">
                        {cityLinks.length} {tt("Städte verfügbar", "cities available")}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-forest/40 transition-transform duration-200 ${
                      cityOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Expandable panel */}
                {cityOpen && (
                  <div className="border-t border-[#e2e8e4] px-8 pb-8">
                    {/* City search */}
                    <div className="py-4">
                      <input
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                        placeholder={tt("Städte suchen...", "Search cities...")}
                        className="w-full bg-cream/40 border border-[#e2e8e4] rounded-xl px-4 py-2.5 text-sm text-forest placeholder:text-forest/40 outline-none focus:border-forest/30 transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-1">
                      {filteredCities.map(({ slug, label }) => (
                        <Link
                          key={slug}
                          to="/restaurant/ort/$city"
                          params={{ city: slug }}
                          className="flex items-center gap-2 py-2 px-2 rounded-lg text-sm text-forest/80 hover:text-forest hover:bg-cream/60 transition-colors duration-150 group"
                          aria-label={`Restaurants in ${label}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-leaf/50 group-hover:bg-leaf shrink-0 transition-colors" />
                          <span className="truncate font-medium">{label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Discovery Filter Controls */}
          <section className="mx-auto max-w-7xl px-6 mt-6 relative z-20">
            <div className="bg-white border border-[#e2e8e4] p-4 rounded-3xl shadow-xl flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-3 px-4 py-3 bg-cream/30 rounded-2xl w-full md:flex-1 border border-[#eadfce]/20">
                <Search className="h-5 w-5 text-forest/60 shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={tt(
                    "Restaurants, Küchen, Beschreibungen suchen...",
                    "Search restaurants, cuisines, descriptions...",
                  )}
                  className="w-full bg-transparent outline-none text-forest placeholder:text-forest/40 text-sm"
                />
              </div>

              <div className="flex items-center gap-3 px-4 py-3 bg-cream/30 rounded-2xl w-full md:w-80 border border-[#eadfce]/20 relative">
                <MapPin className="h-5 w-5 text-forest/60 shrink-0" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={
                    geoStatus === "active"
                      ? tt("Mein Standort (Aktiv)", "My Location (Active)")
                      : tt("Stadt oder PLZ eingeben...", "Enter city or ZIP code...")
                  }
                  className="w-full bg-transparent outline-none text-forest placeholder:text-forest/40 text-sm pr-8"
                  disabled={geoStatus === "active"}
                />

                {/* Geolocation Locator Button */}
                <button
                  type="button"
                  onClick={geoStatus === "active" ? handleResetLocation : handleNearMeClick}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-cream/80 ${
                    geoStatus === "active"
                      ? "text-leaf"
                      : geoStatus === "loading"
                        ? "text-leaf animate-pulse"
                        : "text-forest/40 hover:text-forest"
                  }`}
                  title={tt("Meinen Standort verwenden", "Use my current location")}
                >
                  <Navigation className="h-4 w-4" />
                </button>
              </div>

              {(query || location || geoStatus === "active") && (
                <button
                  onClick={() => {
                    setQuery("");
                    setLocation("");
                    handleResetLocation();
                  }}
                  className="text-xs text-forest/60 hover:text-forest underline font-medium shrink-0 cursor-pointer"
                >
                  {tt("Filter zurücksetzen", "Clear Filters")}
                </button>
              )}
            </div>
          </section>

          {/* Geolocation status messages */}
          {geoStatus !== "idle" && (
            <section className="mx-auto max-w-7xl px-6 mt-4">
              <div
                className={`p-3 rounded-2xl border text-xs md:text-sm font-medium flex items-center justify-between transition-all ${
                  geoStatus === "active"
                    ? "bg-leaf/5 border-leaf/20 text-forest"
                    : geoStatus === "loading"
                      ? "bg-cream/40 border-[#e2e8e4] text-forest/70 animate-pulse"
                      : "bg-red-50 border-red-100 text-red-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full bg-current ${geoStatus === "loading" ? "animate-ping" : ""}`}
                  />
                  <span>
                    {geoStatus === "active" &&
                      tt(
                        "Standort aktiv — Restaurants nach Nähe zum Stadtzentrum sortiert.",
                        "Location active — restaurants sorted by proximity to city center.",
                      )}
                    {geoStatus === "loading" &&
                      tt("Standort wird ermittelt...", "Determining your location...")}
                    {geoStatus === "denied" &&
                      tt(
                        "Standort-Freigabe wurde blockiert. Bitte gib die Erlaubnis in den Browsereinstellungen frei oder nutze die manuelle Suche.",
                        "Location permission denied. Please enable location access in browser settings or search manually.",
                      )}
                    {geoStatus === "timeout" &&
                      tt(
                        "Zeitüberschreitung bei Standortsuche. Bitte versuche es erneut oder suche manuell.",
                        "Location request timed out. Please try again or search manually.",
                      )}
                    {geoStatus === "unavailable" &&
                      tt(
                        "Standortbestimmung ist in diesem Browser nicht verfügbar.",
                        "Location discovery is not supported in this browser.",
                      )}
                  </span>
                </div>
                {geoStatus !== "loading" && (
                  <button
                    onClick={handleResetLocation}
                    className="text-xs underline font-semibold cursor-pointer hover:opacity-80"
                  >
                    {geoStatus === "active"
                      ? tt("Deaktivieren", "Disable")
                      : tt("Schließen", "Dismiss")}
                  </button>
                )}
              </div>
            </section>
          )}

          {/* Directory Grid */}
          <div className="max-w-7xl mx-auto px-6 py-16 w-full">
            {filteredAndSorted.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-[#e2e8e4]">
                <Store className="w-16 h-16 mx-auto text-[#cbd5e1] mb-6" />
                <h3 className="text-2xl font-display text-forest mb-2">
                  {tt("Keine Restaurants gefunden", "No restaurants found")}
                </h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  {tt(
                    "Versuche, deine Suchkriterien anzupassen oder lösche die Filter, um alle Restaurants zu sehen.",
                    "Try adjusting your search criteria or clear filters to browse our full list of partner venues.",
                  )}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredAndSorted.map((rest: any) => (
                  <Link
                    key={rest.id}
                    to="/restaurant/$slug"
                    params={{ slug: rest.slug || rest.id }}
                    search={{ ref: "speisely_marketplace" } as any}
                    className="group flex flex-col surface-card p-3 transition hover:shadow-md hover:ring-[#b28a3c]/30 rounded-2xl bg-white"
                  >
                    {/* Banner / Cover */}
                    {(() => {
                      const initials = rest.name
                        .split(" ")
                        .slice(0, 2)
                        .map((w: string) => w[0])
                        .join("")
                        .toUpperCase();
                      const hasRealBanner = rest.banner_image_url && !rest.use_generated_branding;
                      return (
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-forest/5 rounded-xl">
                          {hasRealBanner ? (
                            <img
                              src={rest.banner_image_url}
                              alt={`${rest.name} Cover`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            /* Generated branding — premium monogram layout */
                            <div
                              className="absolute inset-0 flex items-center justify-center"
                              style={{
                                background:
                                  "linear-gradient(135deg, #1e3a2f 0%, #122a20 55%, #09180f 100%)",
                              }}
                            >
                              {/* Decorative concentric rings */}
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-28 h-28 rounded-full border border-white/8 absolute" />
                                <div className="w-20 h-20 rounded-full border border-white/12 absolute" />
                              </div>
                              {/* Monogram */}
                              <div className="flex flex-col items-center gap-1.5 z-10">
                                <span className="font-display font-bold text-white text-3xl tracking-widest drop-shadow-lg">
                                  {initials}
                                </span>
                                <span className="text-[9px] text-white/50 font-semibold tracking-[0.2em] uppercase text-center px-4 line-clamp-1">
                                  {rest.name}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Verified Badge */}
                          {rest.approval_status === "approved" && (
                            <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-forest/90 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm backdrop-blur-md uppercase tracking-wider border border-white/10">
                              <CheckCircle2 className="h-3 w-3 text-leaf" />{" "}
                              {tt("Geprüft", "Verified")}
                            </div>
                          )}

                          {/* Distance or City Badge */}
                          {rest.distance != null ? (
                            <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold text-forest shadow-sm backdrop-blur-md border border-[#e2e8e4]/40">
                              <Navigation className="h-2.5 w-2.5 text-leaf rotate-45 shrink-0" />
                              <span>
                                ~{formatDistance(rest.distance)} ({tt("Mitte", "Center")})
                              </span>
                            </div>
                          ) : (
                            rest.city && (
                              <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-forest shadow-sm backdrop-blur-md">
                                <MapPin className="h-2.5 w-2.5 text-leaf shrink-0" />
                                <span className="truncate max-w-[100px]">{rest.city}</span>
                              </div>
                            )
                          )}
                        </div>
                      );
                    })()}

                    {/* Card Content */}
                    <div className="mt-4 px-1 pb-1 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="font-display text-lg text-forest line-clamp-1 mb-1 font-bold group-hover:text-[#b28a3c] transition-colors">
                          {rest.name}
                        </h3>
                        <p className="text-sm text-forest/70 line-clamp-1 mb-4">
                          {rest.cuisine_type || tt("Restaurant", "Restaurant")}
                        </p>

                        {/* Specs */}
                        <div className="flex items-center gap-3 text-xs font-semibold text-forest/70 border-t border-forest/10 pt-3">
                          <span>
                            {tt("Mind.", "Min.")} €{rest.min_order_amount ?? 10}
                          </span>
                          <span className="text-forest/30">•</span>
                          <span>
                            {tt("Lieferung:", "Delivery:")} €
                            {Number(rest.delivery_fee || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-forest/10 flex items-center justify-between text-forest font-semibold text-xs group-hover:text-[#b28a3c] transition-colors">
                        <span>{tt("Direkt bestellen", "Order Direct")}</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </SiteShell>
  );
}
