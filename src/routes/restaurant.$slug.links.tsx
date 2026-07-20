import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Phone, MapPin, Calendar, ShoppingBag, ArrowRight } from "lucide-react";
import { getRestaurantBySlug } from "@/lib/restaurant/public.functions";
import { getRestaurant } from "@/data/restaurants";
import { getActiveSurplusOffer } from "@/lib/restaurant/surplus.functions";
import { trackEvent } from "@/utils/posthog";

export const Route = createFileRoute("/restaurant/$slug/links")({
  loader: async ({ params }) => {
    let dbRestaurant = null;
    try {
      const res = await getRestaurantBySlug({ data: { slug: params.slug } });
      dbRestaurant = res.restaurant;
    } catch (e) {
      console.error("Error loading restaurant db record", e);
    }
    const fullRestaurant = await getRestaurant(params.slug);
    if (!fullRestaurant) {
      throw notFound();
    }
    return { dbRestaurant, fullRestaurant };
  },
  component: LinksComponent,
});

function LinksComponent() {
  const { dbRestaurant, fullRestaurant } = Route.useLoaderData();

  // Fetch active surplus offer
  const { data: activeOffer } = useQuery({
    queryKey: ["activeSurplusOffer", dbRestaurant?.id],
    queryFn: async () => {
      if (!dbRestaurant?.id) return null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = (await getActiveSurplusOffer({ data: { restaurantId: dbRestaurant.id } })) as any;
      return res || null;
    },
    enabled: !!dbRestaurant?.id,
  });

  // Track page view event
  useEffect(() => {
    if (dbRestaurant?.id) {
      trackEvent("links_page_viewed", { restaurantId: dbRestaurant.id });
    }
  }, [dbRestaurant?.id]);

  if (!fullRestaurant) return null;

  const accentColor = dbRestaurant?.theme_accent_color || "#2a4d3e"; // Speisely forest green fallback
  const logoUrl = fullRestaurant.logo || fullRestaurant.img;

  // Extract postal code from visible address string
  const postalCodeMatch = fullRestaurant.address?.match(/\b\d{5}\b/);
  const postalCode = postalCodeMatch ? postalCodeMatch[0] : undefined;

  // JSON-LD structured schema for search crawler indexing
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: fullRestaurant.name,
    image: logoUrl,
    url: `https://speisely.de/restaurant/${fullRestaurant.id}`,
    telephone: fullRestaurant.phone || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: fullRestaurant.address || undefined,
      addressLocality: fullRestaurant.area || undefined,
      postalCode: postalCode,
      addressCountry: "DE",
    },
    acceptsReservations: "true",
    potentialAction: [
      {
        "@type": "ReserveAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `https://speisely.de/restaurant/${fullRestaurant.id}?action=reserve`,
          inLanguage: "de",
          actionPlatform: [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform",
          ],
        },
      },
      {
        "@type": "OrderAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `https://speisely.de/restaurant/${fullRestaurant.id}`,
          inLanguage: "de",
          actionPlatform: [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform",
          ],
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] text-forest flex flex-col justify-between items-center py-10 px-4">
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Main Container */}
      <div className="w-full max-w-md flex flex-col items-center text-center space-y-8">
        {/* Restaurant Profile Header */}
        <div className="space-y-4">
          <div className="h-24 w-24 rounded-full border border-[#eadfce] overflow-hidden bg-white mx-auto shadow-md">
            <img
              src={logoUrl}
              alt={`${fullRestaurant.name} Logo`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-display font-bold text-forest">{fullRestaurant.name}</h1>
            <p className="text-xs text-forest/60 max-w-xs mx-auto">
              {fullRestaurant.about?.de ||
                fullRestaurant.about?.en ||
                "Willkommen auf unserer offiziellen Link-Seite!"}
            </p>
          </div>
        </div>

        {/* Buttons Stack */}
        <div className="w-full flex flex-col gap-4">
          {/* 1. Speisekarte & Online bestellen */}
          <Link
            to="/restaurant/$slug"
            params={{ slug: fullRestaurant.id }}
            className="w-full py-4 px-6 rounded-2xl bg-forest hover:bg-forest/90 text-white font-bold shadow-lg shadow-forest/10 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-between cursor-pointer"
            style={{ backgroundColor: accentColor }}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5" />
              <span className="text-sm font-semibold">Speisekarte & Online bestellen</span>
            </div>
            <ArrowRight className="h-4 w-4" />
          </Link>

          {/* 2. Tisch reservieren */}
          <Link
            to="/restaurant/$slug"
            params={{ slug: fullRestaurant.id }}
            search={{ action: "reserve" }}
            className="w-full py-4 px-6 rounded-2xl bg-white border border-[#eadfce] hover:bg-[#eadfce]/15 text-forest font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-forest" />
              <span className="text-sm font-semibold">Tisch reservieren</span>
            </div>
            <ArrowRight className="h-4 w-4" />
          </Link>

          {/* 3. Active Surplus Offer Card (Conditional) */}
          {activeOffer && (
            <Link
              to="/restaurant/$slug"
              params={{ slug: fullRestaurant.id }}
              className="w-full p-4 rounded-2xl border-2 border-[#10b981]/40 bg-[#10b981]/5 hover:bg-[#10b981]/10 text-left transition-all flex flex-col gap-2 relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute top-0 right-0 bg-[#10b981] text-white text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-bl-xl">
                Chef's Special Deal
              </div>
              <div className="pr-16">
                <span className="text-[10px] text-[#10b981] font-bold tracking-wider uppercase">
                  Aktuelles Angebot:
                </span>
                <h4 className="text-sm font-bold text-forest mt-0.5 line-clamp-1">
                  {activeOffer.item_name}
                </h4>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-extrabold text-[#10b981]">
                    {(activeOffer.surplus_price_cents / 100).toFixed(2)}€
                  </span>
                  <span className="text-xs text-forest/40 line-through">
                    {(activeOffer.original_price_cents / 100).toFixed(2)}€
                  </span>
                </div>
                <span className="text-[10px] bg-[#10b981]/10 text-[#10b981] font-bold px-2 py-0.5 rounded-full">
                  Nur noch {activeOffer.current_quantity} übrig!
                </span>
              </div>
            </Link>
          )}

          {/* 4. Anrufen */}
          {fullRestaurant.phone && (
            <a
              href={`tel:${fullRestaurant.phone}`}
              className="w-full py-4 px-6 rounded-2xl bg-white border border-[#eadfce] hover:bg-[#eadfce]/15 text-forest font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-forest" />
                <span className="text-sm font-semibold">Anrufen</span>
              </div>
              <span className="text-xs text-forest/50 font-normal">{fullRestaurant.phone}</span>
            </a>
          )}

          {/* 5. Route planen */}
          {fullRestaurant.address && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullRestaurant.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 rounded-2xl bg-white border border-[#eadfce] hover:bg-[#eadfce]/15 text-forest font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-forest" />
                <span className="text-sm font-semibold">Route planen</span>
              </div>
              <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </div>

        {/* Visible Address & Contact Info (Aligned with JSON-LD) */}
        <div className="w-full pt-4 border-t border-[#eadfce]/60 text-xs text-forest/50 space-y-1">
          {fullRestaurant.address && (
            <div className="flex items-center justify-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{fullRestaurant.address}</span>
            </div>
          )}
          {fullRestaurant.phone && (
            <div className="flex items-center justify-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{fullRestaurant.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="mt-12 text-[10px] text-forest/40 tracking-wider flex flex-col items-center gap-1">
        <span>Powered by</span>
        <Link to="/" className="font-extrabold text-forest/60 hover:text-forest transition">
          SPEISELY.DE
        </Link>
      </footer>
    </div>
  );
}
