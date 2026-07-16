import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { EVENT_TYPES, isValidCateringCity } from "@/data/geo/taxonomy";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const loadPlannerCityGeoData = createServerFn({ method: "GET" })
  .validator(z.object({ citySlug: z.string() }))
  .handler(async ({ data }) => {
    if (!isValidCateringCity(data.citySlug)) {
      return { status: "404" };
    }
    return { status: "200", city: data.citySlug };
  });

export const Route = createFileRoute("/planner/$city")({
  loader: async ({ params }) => {
    const res = await loadPlannerCityGeoData({ data: { citySlug: params.city } });
    if (res.status === "404") {
      throw notFound();
    }
    return { city: params.city };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const { city } = loaderData;
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    
    return {
      meta: [
        { title: `Event-Manager & Hochzeitsplaner in ${capitalize(city)}` },
        { name: "description", content: `Finden Sie den perfekten Planer für Ihr Event in ${capitalize(city)}.` },
      ],
      links: [{ rel: "canonical", href: `https://speisely.de/planner/${city}` }],
    };
  },
  component: PlannerCityHubPage,
});

function PlannerCityHubPage() {
  const { city } = Route.useLoaderData();
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const cityName = capitalize(city);

  return (
    <SiteShell>
      <div className="bg-sand text-foreground pt-32 pb-24 relative overflow-hidden min-h-[60vh] flex flex-col justify-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest/10 text-forest text-sm font-medium mb-6">
            <MapPin className="h-4 w-4" />
            <span>Event-Planung in {cityName}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight mb-6 leading-tight text-forest">
            Welches Event planen Sie in {cityName}?
          </h1>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Wählen Sie den Anlass, um spezialisierte Event-Manager für Ihre Feier zu finden und eine kostenlose Erstberatung anzufragen.
          </p>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {EVENT_TYPES.map((eventType) => (
              <Button 
                key={eventType} 
                variant="outline" 
                size="lg" 
                className="h-auto py-6 border-forest/20 hover:border-forest hover:bg-forest/5 text-forest flex flex-col gap-2" 
                asChild
              >
                <Link to="/planner/$city-$eventType" params={{ "city-$eventType": `${city}-${eventType}` }}>
                  <span className="capitalize text-lg font-serif">{eventType}</span>
                  <span className="text-sm text-muted-foreground font-sans">Planer anzeigen <ArrowRight className="inline h-3 w-3 ml-1" /></span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
