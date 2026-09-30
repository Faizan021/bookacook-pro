import { createFileRoute } from "@tanstack/react-router";
import { getValidGeoLocations } from "@/lib/geo/server.functions";

export const Route = createFileRoute("/api/geo")({
  server: {
    handlers: {
      GET: async () => {
        const geoLocations = await getValidGeoLocations();

        const data = {
          status: "success",
          provider: "Speisely Enterprise GEO API",
          country: "Germany",
          countryCode: "DE",
          totalHubs: geoLocations.length,
          generatedAt: new Date().toISOString(),
          regions: [
            {
              state: "Berlin",
              stateCode: "BE",
              capital: "Berlin",
              hubs: ["berlin"],
              services: ["catering", "restaurant", "planner"],
            },
            {
              state: "Nordrhein-Westfalen",
              stateCode: "NW",
              capital: "Düsseldorf",
              hubs: ["koeln", "duesseldorf", "dortmund", "essen", "moenchengladbach"],
              services: ["catering", "restaurant", "planner"],
            },
            {
              state: "Bayern",
              stateCode: "BY",
              capital: "München",
              hubs: ["muenchen", "nuernberg", "augsburg"],
              services: ["catering", "restaurant", "planner"],
            },
            {
              state: "Hessen",
              stateCode: "HE",
              capital: "Wiesbaden",
              hubs: ["frankfurt", "wiesbaden", "kassel"],
              services: ["catering", "restaurant", "planner"],
            },
            {
              state: "Baden-Württemberg",
              stateCode: "BW",
              capital: "Stuttgart",
              hubs: ["stuttgart", "mannheim", "karlsruhe", "freiburg"],
              services: ["catering", "restaurant", "planner"],
            },
            {
              state: "Hamburg",
              stateCode: "HH",
              capital: "Hamburg",
              hubs: ["hamburg"],
              services: ["catering", "restaurant", "planner"],
            },
            {
              state: "Sachsen",
              stateCode: "SN",
              capital: "Dresden",
              hubs: ["leipzig", "dresden"],
              services: ["catering", "restaurant", "planner"],
            },
          ],
          endpoints: {
            sitemap: "https://speisely.de/sitemap.xml",
            llms: "https://speisely.de/llms.txt",
            llmsFull: "https://speisely.de/llms-full.txt",
            geoIndex: "https://speisely.de/geo.json",
          },
        };

        return new Response(JSON.stringify(data, null, 2), {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
            "Access-Control-Allow-Origin": "*",
          },
        });
      },
    },
  },
});
