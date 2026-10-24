import { Link } from "@tanstack/react-router";
import { UtensilsCrossed, CalendarHeart, ChefHat, ArrowRight, MapPin } from "lucide-react";

interface CityCrossLinksProps {
  cityName: string;
  citySlug: string;
  currentVertical: "catering" | "restaurant" | "planner";
}

const ACTIVE_HUBS = [
  { name: "Berlin", slug: "berlin" },
  { name: "München", slug: "muenchen" },
  { name: "Hamburg", slug: "hamburg" },
  { name: "Frankfurt", slug: "frankfurt" },
  { name: "Köln", slug: "koeln" },
  { name: "Düsseldorf", slug: "duesseldorf" },
  { name: "Stuttgart", slug: "stuttgart" },
];

export function CityCrossLinks({ cityName, citySlug, currentVertical }: CityCrossLinksProps) {
  const normSlug = citySlug.toLowerCase().trim();

  // Cross-vertical options for this city using strictly typed TanStack routes
  const crossVerticals = [
    {
      key: "catering" as const,
      label: `Catering & Buffets in ${cityName}`,
      sublabel: "Fingerfood, Messecatering, Business Lunch & Hochzeitsbuffets",
      to: "/catering/ort/$city" as const,
      params: { city: normSlug },
      icon: <ChefHat className="h-5 w-5 text-[#E6B84A]" />,
    },
    {
      key: "restaurant" as const,
      label: `Restaurants in ${cityName}`,
      sublabel: "Tagesmenüs, Fine Dining, lokale Spezialitäten & Tischreservierung",
      to: "/restaurant/ort/$city" as const,
      params: { city: normSlug },
      icon: <UtensilsCrossed className="h-5 w-5 text-[#E6B84A]" />,
    },
    {
      key: "planner" as const,
      label: `Event-Planer in ${cityName}`,
      sublabel: "Locationsuche, Hochzeitsplanung, Event-Deko, Floristik & Musik",
      to: "/planner/ort/$city" as const,
      params: { city: normSlug },
      icon: <CalendarHeart className="h-5 w-5 text-[#E6B84A]" />,
    },
  ].filter((v) => v.key !== currentVertical);

  // Other verified German hubs for the current vertical
  const otherHubs = ACTIVE_HUBS.filter(
    (hub) => hub.slug !== normSlug && hub.name.toLowerCase() !== cityName.toLowerCase(),
  );

  const getVerticalMeta = () => {
    switch (currentVertical) {
      case "catering":
        return { to: "/catering/ort/$city" as const, label: "Catering" };
      case "restaurant":
        return { to: "/restaurant/ort/$city" as const, label: "Restaurants" };
      case "planner":
        return { to: "/planner/ort/$city" as const, label: "Event-Planung" };
    }
  };

  const verticalMeta = getVerticalMeta();

  return (
    <section className="border-t border-forest/10 bg-[#FAF7F0] py-14 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#b28a3c] mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E6B84A]" />
            Lokales Gastronomie-Netzwerk {cityName}
          </div>
          <h2 className="font-display text-2xl sm:text-3xl text-forest">
            Weitere Genuss- & Event-Services in {cityName}
          </h2>
          <p className="mt-2 text-sm text-forest/70 max-w-2xl">
            Verbinde dein Event mit passenden Partnern vor Ort: Von frisch zubereiteten Buffets über
            handverlesene Restaurants bis zur vollständigen Event-Organisation.
          </p>
        </div>

        {/* 2 Cross-Vertical Cards */}
        <div className="grid gap-4 sm:grid-cols-2 mb-10">
          {crossVerticals.map((cv) => (
            <Link
              key={cv.key}
              to={cv.to}
              params={cv.params}
              className="group flex flex-col justify-between p-5 rounded-2xl bg-white border border-forest/10 shadow-sm hover:shadow-md hover:border-[#E6B84A]/60 transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-forest/5 flex items-center justify-center shrink-0 group-hover:bg-[#E6B84A]/10 transition-colors">
                      {cv.icon}
                    </div>
                    <h3 className="font-display text-lg text-forest group-hover:text-[#9a7633] transition-colors font-semibold">
                      {cv.label}
                    </h3>
                  </div>
                  <ArrowRight className="h-4 w-4 text-forest/40 group-hover:text-[#E6B84A] group-hover:translate-x-1 transition-all shrink-0" />
                </div>
                <p className="text-xs text-forest/70 leading-relaxed pl-11">{cv.sublabel}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Cross-City Mesh Strip */}
        <div className="pt-6 border-t border-forest/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-forest/80 flex items-center gap-1.5 shrink-0">
            <MapPin className="h-3.5 w-3.5 text-[#E6B84A]" />
            {verticalMeta.label} in weiteren Top-Städten:
          </span>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-forest/70">
            {otherHubs.map((hub, idx) => (
              <span key={hub.slug} className="flex items-center gap-3">
                <Link
                  to={verticalMeta.to}
                  params={{ city: hub.slug }}
                  className="hover:text-forest hover:underline underline-offset-4 transition-colors font-medium"
                >
                  {hub.name}
                </Link>
                {idx < otherHubs.length - 1 && <span className="text-forest/20">·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
