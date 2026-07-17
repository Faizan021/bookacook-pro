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
  ChevronRight,
} from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { useMemo, useState } from "react";

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

/** Convert a URL slug like "frankfurt-am-main" to "Frankfurt Am Main" */
function slugToTitle(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function RestaurantsDirectory() {
  const { restaurants, validGeoLocations } = Route.useLoaderData() as any;
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  // Extract and sort city entries from valid geo paths (format: /restaurant/ort/$slug)
  const cityLinks = useMemo(() => {
    if (!validGeoLocations) return [];
    return (validGeoLocations as string[])
      .filter((p) => p.startsWith("/restaurant/ort/"))
      .map((p) => {
        const slug = p.replace("/restaurant/ort/", "");
        return { slug, label: slugToTitle(slug), path: p };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [validGeoLocations]);

  const getRestaurantUrl = (rest: any) => {
    return `/restaurant/${rest.slug}?ref=speisely_marketplace`;
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const l = location.trim().toLowerCase();

    return restaurants.filter((rest: any) => {
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
  }, [restaurants, query, location]);

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
            {/* Forest gradient overlay — identical to catering.index.tsx */}
            <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/90 to-forest/40" />
            <div className="absolute inset-0 bg-black/20" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
              {/* Gold pill badge */}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-white/90 shadow-sm mb-6">
                🍽 Speisely Marketplace
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 tracking-tight max-w-2xl leading-tight">
                Order local food. <span className="text-[#f2d896]">Direct & Fair.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-xl mb-8">
                Discover independent restaurants in your city and order directly — no middlemen,
                better prices, fairer for everyone.
              </p>
            </div>
          </div>

          {/* Browse by City Hub Section */}
          {cityLinks.length > 0 && (
            <section className="mx-auto max-w-7xl px-6 mt-12">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="font-display text-2xl text-forest">Browse Restaurants by City</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {cityLinks.map(({ slug, label, path }) => (
                  <Link
                    key={slug}
                    to="/restaurant/ort/$city"
                    params={{ city: slug }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#e2e8e4] bg-white px-4 py-2 text-sm font-medium text-forest shadow-sm hover:border-forest/30 hover:bg-cream/40 transition duration-200"
                    aria-label={`Restaurants in ${label}`}
                  >
                    <MapPin className="h-3.5 w-3.5 text-leaf shrink-0" />
                    {label}
                    <ChevronRight className="h-3 w-3 opacity-40" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Discovery Filter Controls */}
          <section className="mx-auto max-w-7xl px-6 -mt-8 relative z-20">
            <div className="bg-white border border-[#e2e8e4] p-4 rounded-3xl shadow-xl flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-3 px-4 py-3 bg-cream/30 rounded-2xl w-full md:flex-1 border border-[#eadfce]/20">
                <Search className="h-5 w-5 text-forest/60 shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search restaurants, cuisines, descriptions..."
                  className="w-full bg-transparent outline-none text-forest placeholder:text-forest/40 text-sm"
                />
              </div>

              <div className="flex items-center gap-3 px-4 py-3 bg-cream/30 rounded-2xl w-full md:w-80 border border-[#eadfce]/20">
                <MapPin className="h-5 w-5 text-forest/60 shrink-0" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter city or ZIP code..."
                  className="w-full bg-transparent outline-none text-forest placeholder:text-forest/40 text-sm"
                />
              </div>

              {(query || location) && (
                <button
                  onClick={() => {
                    setQuery("");
                    setLocation("");
                  }}
                  className="text-xs text-forest/60 hover:text-forest underline font-medium shrink-0 cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </section>

          {/* Directory Grid */}
          <div className="max-w-7xl mx-auto px-6 py-16 w-full">
            {filtered.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-[#e2e8e4]">
                <Store className="w-16 h-16 mx-auto text-[#cbd5e1] mb-6" />
                <h3 className="text-2xl font-display text-forest mb-2">No restaurants found</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  Try adjusting your search criteria or clear postcode filters to browse our full
                  list of partner venues.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filtered.map((rest: any) => (
                  <a
                    key={rest.id}
                    href={getRestaurantUrl(rest)}
                    className="group flex flex-col bg-white rounded-3xl border border-[#e2e8e4] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                  >
                    {/* Banner / Cover */}
                    <div className="h-48 bg-leaf/10 flex items-center justify-center relative overflow-hidden">
                      {rest.banner_image_url ? (
                        <img
                          src={rest.banner_image_url}
                          alt={`${rest.name} Cover`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-forest/20 to-leaf/20" />
                      )}

                      {/* Dark Overlay for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-80" />

                      {/* Verified Badge */}
                      {rest.approval_status === "approved" && (
                        <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-forest/90 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm backdrop-blur-md uppercase tracking-wider border border-white/10">
                          <CheckCircle2 className="h-3 w-3 text-leaf" /> Verified
                        </div>
                      )}

                      {/* Logo Overlay */}
                      <div className="absolute -bottom-8 left-6 z-20">
                        {rest.logo_url ? (
                          <div className="w-16 h-16 rounded-full border-4 border-white shadow-md bg-white overflow-hidden">
                            <img
                              src={rest.logo_url}
                              alt={`${rest.name} Logo`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-full border-4 border-white shadow-md bg-forest flex items-center justify-center">
                            <Store className="w-8 h-8 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="pt-12 p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-forest mb-2.5 line-clamp-1">
                          {rest.name}
                        </h3>

                        <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs text-gray-500 mb-4">
                          {rest.city && (
                            <div className="flex items-center">
                              <MapPin className="w-3.5 h-3.5 mr-1 text-leaf shrink-0" />
                              <span className="truncate max-w-[120px]">{rest.city}</span>
                            </div>
                          )}
                          {rest.cuisine_type && (
                            <div className="flex items-center">
                              <Utensils className="w-3.5 h-3.5 mr-1 text-leaf shrink-0" />
                              <span className="truncate max-w-[120px]">{rest.cuisine_type}</span>
                            </div>
                          )}
                        </div>

                        {/* Premium Specs */}
                        <div className="flex gap-4 text-xs font-semibold text-gray-500 border-t border-[#f1f5f9] pt-3 mb-2">
                          <span>Min: €{rest.min_order_amount ?? 10}</span>
                          <span>•</span>
                          <span>
                            Delivery:{" "}
                            {rest.delivery_fee != null
                              ? `€${Number(rest.delivery_fee).toFixed(2)}`
                              : "€0.00"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-[#f1f5f9] flex items-center justify-between text-forest font-semibold text-sm">
                        <span>Order Direct</span>
                        <div className="w-8 h-8 rounded-full bg-leaf/10 flex items-center justify-center group-hover:bg-leaf group-hover:text-white transition-colors duration-300">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </SiteShell>
  );
}
