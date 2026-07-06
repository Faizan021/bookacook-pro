import { createFileRoute, notFound, useRouter, Link } from "@tanstack/react-router";
import { getGeoPageData } from "@/lib/geo/server.functions";
import { SiteShell } from "@/components/SiteShell";
import { MapPin, Star, ChevronRight, Search, ChefHat, X, Banknote } from "lucide-react";
import { z } from "zod";
import { useState } from "react";

export const Route = createFileRoute("/catering/ort/$city")({
  validateSearch: z.object({
    sort: z.string().optional(),
    diet: z.string().optional(),
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ params, deps }) => {
    const data = await getGeoPageData({ data: { role: "caterer", citySlug: params.city } });
    if (data.indexStatus === "404") {
      throw notFound();
    }
    return { ...data, searchParams: deps };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const { seoData, indexStatus, location, searchParams } = loaderData;
    
    const isFiltered = Object.keys(searchParams).length > 0;
    const finalIndexStatus = isFiltered ? "noindex, follow" : (indexStatus === "index" ? "index, follow" : "noindex, follow");
    
    const canonicalUrl = `/catering/ort/${location.name.toLowerCase().replace(/\s+/g, '-')}`;

    return {
      meta: [
        { title: seoData?.meta_title || `Catering in ${location.name} - Speisely` },
        { name: "description", content: seoData?.meta_description || `Finde die besten Caterer in ${location.name}.` },
        { name: "robots", content: finalIndexStatus },
        { property: "og:title", content: seoData?.meta_title || `Catering in ${location.name}` },
        { property: "og:description", content: seoData?.meta_description || `Finde die besten Caterer in ${location.name}.` },
      ],
      links: [
        { rel: "canonical", href: canonicalUrl }
      ]
    };
  },
  component: GeoCateringPage,
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-4xl text-forest mb-4">Stadt nicht gefunden</h1>
        <p className="text-leaf">Wir konnten diesen Ort leider nicht in unserer Datenbank finden.</p>
      </div>
    </SiteShell>
  )
});

function GeoCateringPage() {
  const { location, seoData, vendors, aggregateRating, searchParams } = Route.useLoaderData() as any;
  const router = useRouter();

  // Client-side filtering states synced with URL
  const [query, setQuery] = useState("");
  
  const currentDiet = searchParams.diet || "all";
  
  const setDietFilter = (diet: string) => {
    router.navigate({
      search: { diet: diet === "all" ? undefined : diet, sort: searchParams.sort } as any,
      replace: true
    });
  };

  const filteredVendors = vendors.filter((v: any) => {
    const qMatch = !query || v.name.toLowerCase().includes(query.toLowerCase());
    // Diet filtering usually relies on a `tags` array or similar, defaulting to true if none present in caterer
    const dMatch = currentDiet === "all" || (v.description && v.description.toLowerCase().includes(currentDiet));
    return qMatch && dMatch;
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": seoData?.meta_title || `Catering in ${location.name}`,
    "description": seoData?.meta_description,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": filteredVendors.map((v: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "FoodEstablishment",
          "name": v.name,
          "image": v.logo_url || v.banner_image_url,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": location.name
          }
        }
      }))
    }
  };

  const isFiltered = filteredVendors.length !== vendors.length;

  if (aggregateRating && aggregateRating.count > 0 && !isFiltered) {
    (jsonLd as any).aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": aggregateRating.average,
      "reviewCount": aggregateRating.count
    };
  }

  const filters = [
    { id: "all", label: "Alle" },
    { id: "vegan", label: "Vegan" },
    { id: "vegetarian", label: "Vegetarisch" },
    { id: "buffet", label: "Buffet" },
    { id: "fingerfood", label: "Fingerfood" }
  ];

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/catering-hero.jpg"
            alt="Background"
            className="w-full h-full object-cover object-center scale-105"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/90 to-forest/40" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-2 text-sm text-[oklch(0.97_0.02_92)]/80 mb-6">
            <Link to="/catering" className="hover:text-white transition">Catering</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white font-medium">{location.name}</span>
          </div>

          <div className="max-w-2xl text-[oklch(0.97_0.02_92)]">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6">
              {seoData?.meta_title || `Catering in ${location.name}`}
            </h1>
            
            {aggregateRating && aggregateRating.count > 0 && !isFiltered && (
              <div className="flex items-center gap-2 mb-6">
                <Star className="h-5 w-5 fill-[#F5B82E] text-[#F5B82E]" />
                <span className="font-semibold text-white">{aggregateRating.average.toFixed(1)}</span>
                <span className="text-[oklch(0.97_0.02_92)]/80">({aggregateRating.count} Bewertungen)</span>
              </div>
            )}
            <p className="text-lg opacity-90 max-w-xl">
              {seoData?.meta_description || `Entdecke die besten Caterer in ${location.name} für dein nächstes Event.`}
            </p>
          </div>
        </div>
      </section>

      {/* Discovery & Filters */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 -mt-8 relative z-20">
        <div className="surface-card flex items-center gap-3 px-5 py-4 w-full md:w-96 shadow-lg rounded-2xl">
          <Search className="h-5 w-5 text-forest/60 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Suchen in ${location.name}...`}
            className="w-full bg-transparent outline-none text-forest placeholder:text-forest/50 text-lg"
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setDietFilter(f.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                currentDiet === f.id ? "bg-forest text-[oklch(0.97_0.02_92)]" : "bg-cream text-forest hover:bg-[#eadfce]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Vendor Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-12">
        {filteredVendors.length === 0 ? (
          <div className="mx-auto max-w-md text-center py-16">
            <div className="mx-auto h-16 w-16 grid place-items-center rounded-full bg-[#eadfce] text-[#b28a3c]">
              <ChefHat className="h-7 w-7" />
            </div>
            <h3 className="mt-5 font-display text-2xl text-forest">Keine Caterer gefunden</h3>
            <p className="mt-2 text-sm text-forest/70">Versuche eine andere Suche oder passe deine Filter an.</p>
            <button
              onClick={() => { setQuery(""); setDietFilter("all"); }}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-cream text-forest border border-[#eadfce] px-5 py-2.5 text-sm font-semibold hover:bg-[#eadfce]"
            >
              <X className="h-4 w-4" /> Filter zurücksetzen
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVendors.map((v: any) => (
              <Link
                key={v.id}
                to="/catering/$slug"
                params={{ slug: v.slug || v.id }}
                className="group flex flex-col surface-card p-3 transition hover:shadow-md hover:ring-[#b28a3c]/30 rounded-2xl"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-forest/5 rounded-xl">
                  {v.banner_image_url || v.logo_url ? (
                    <img
                      src={v.banner_image_url || v.logo_url}
                      alt={v.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-forest/20">
                      <ChefHat className="h-10 w-10" />
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <div className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-forest shadow-sm backdrop-blur-md">
                      <MapPin className="h-3 w-3" /> {v.city}
                    </div>
                  </div>
                </div>
                <div className="mt-4 px-1 pb-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-lg text-forest line-clamp-1">{v.name}</h3>
                  </div>
                  <p className="mt-1 text-sm text-forest/70 line-clamp-1">
                    {v.description || "Premium Catering"}
                  </p>
                  
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-forest/80 border-t border-forest/10 pt-3">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{v.min_delivery_cents ? `ab ${(v.min_delivery_cents / 100).toFixed(2)}€` : "Kein Mindestbestellwert"}</span>
                    </div>
                    {v.delivery_fee_cents !== undefined && (
                      <div className="flex items-center gap-1 text-forest/60">
                         <Banknote className="w-3.5 h-3.5" />
                         <span>{(v.delivery_fee_cents / 100).toFixed(2)}€ Lieferung</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* SEO Text Hydration */}
      {seoData?.content && (
        <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
          <div className="prose prose-lg prose-forest max-w-none prose-headings:font-display" dangerouslySetInnerHTML={{ __html: seoData.content }} />
        </section>
      )}
    </SiteShell>
  );
}
