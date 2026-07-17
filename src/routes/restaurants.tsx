/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { getMarketplaceRestaurants } from "@/lib/restaurant/public.functions";
import { Store, ArrowRight, MapPin, Utensils } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { useMemo } from "react";

export const Route = createFileRoute("/restaurants")({
  component: RestaurantsDirectory,
  loader: async () => {
    return await getMarketplaceRestaurants();
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

function RestaurantsDirectory() {
  const { restaurants } = Route.useLoaderData();

  // Helper to build the referral URL
  const getRestaurantUrl = (rest: any) => {
    return `/restaurant/${rest.slug}?ref=speisely_marketplace`;
  };

  return (
    <SiteShell>
      <div className="min-h-screen flex flex-col bg-[#fcfdfc]">
        <main className="flex-grow">
          {/* Hero Section */}
          <div className="bg-forest pt-32 pb-20 px-6 text-center text-white relative overflow-hidden">
            {/* Subtle background pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            ></div>

            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
                Speisely Marketplace
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90">
                Discover independent restaurants and order directly. Fair for them, better for you.
              </p>
            </div>
          </div>

          {/* Directory Grid */}
          <div className="max-w-7xl mx-auto px-6 py-16 w-full">
            {restaurants.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-[#e2e8e4]">
                <Store className="w-16 h-16 mx-auto text-[#cbd5e1] mb-6" />
                <h3 className="text-2xl font-display text-forest mb-2">
                  No restaurants available yet
                </h3>
                <p className="text-gray-500">
                  Check back soon as more local partners join the marketplace.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {restaurants.map((rest: any) => (
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

                      {/* Dark Overlay for readability if there is no logo and text is over banner */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-80" />

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
                        <h3 className="text-xl font-bold text-forest mb-3 line-clamp-1">
                          {rest.name}
                        </h3>

                        <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600 mb-4">
                          {rest.city && (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1.5 text-leaf" />
                              <span className="truncate">{rest.city}</span>
                            </div>
                          )}
                          {rest.cuisine_type && (
                            <div className="flex items-center">
                              <Utensils className="w-4 h-4 mr-1.5 text-leaf" />
                              <span className="truncate">{rest.cuisine_type}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-[#f1f5f9] flex items-center justify-between text-forest font-semibold">
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
