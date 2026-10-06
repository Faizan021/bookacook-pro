import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getCaterers } from "@/data/caterers";
import { getRestaurants } from "@/data/restaurants";
import { getPlanners } from "@/data/planners";
import { blogPosts } from "@/data/blog";
import { getValidGeoLocations } from "@/lib/geo/server.functions";

const BASE_URL = "https://speisely.de";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().split("T")[0];

        const [restaurants, caterers, planners, validGeoLocations] = await Promise.all([
          getRestaurants(),
          getCaterers(),
          getPlanners(),
          getValidGeoLocations(),
        ]);

        const entries: SitemapEntry[] = [
          { path: "/", lastmod: today, changefreq: "weekly", priority: "1.0" },
          { path: "/restaurants", lastmod: today, changefreq: "daily", priority: "0.9" },
          { path: "/catering", lastmod: today, changefreq: "weekly", priority: "0.9" },
          { path: "/planner", lastmod: today, changefreq: "weekly", priority: "0.9" },
          { path: "/speisely", lastmod: today, changefreq: "daily", priority: "0.9" },
          { path: "/partners", lastmod: "2026-06-15", changefreq: "monthly", priority: "0.7" },
          { path: "/partner/webseiten", lastmod: today, changefreq: "weekly", priority: "0.8" },
          { path: "/case-study/haus-spaas", lastmod: today, changefreq: "weekly", priority: "0.8" },
          {
            path: "/case-study/partyservice-kuepper",
            lastmod: today,
            changefreq: "weekly",
            priority: "0.8",
          },
          {
            path: "/architecture-simulator",
            lastmod: today,
            changefreq: "monthly",
            priority: "0.6",
          },
          { path: "/blog", lastmod: today, changefreq: "weekly", priority: "0.8" },
          { path: "/about", lastmod: "2026-06-01", changefreq: "monthly", priority: "0.5" },
          { path: "/impressum", lastmod: "2026-06-01", changefreq: "yearly", priority: "0.3" },
          { path: "/datenschutz", lastmod: today, changefreq: "monthly", priority: "0.5" },
          { path: "/faq", lastmod: today, changefreq: "monthly", priority: "0.6" },
          { path: "/contact", lastmod: today, changefreq: "monthly", priority: "0.5" },
          { path: "/magazin", lastmod: "2026-08-16", changefreq: "monthly", priority: "0.8" },
          {
            path: "/magazin/schnitzel-schmiede",
            lastmod: "2026-08-16",
            changefreq: "monthly",
            priority: "0.7",
          },
          {
            path: "/magazin/speisely-visits",
            lastmod: "2026-08-16",
            changefreq: "weekly",
            priority: "0.8",
          },
          {
            path: "/magazin/speisely-visits/shawarma-albaik-berlin",
            lastmod: "2026-08-16",
            changefreq: "monthly",
            priority: "0.8",
          },
          {
            path: "/magazin/speisely-visits/mandy-restaurant-berlin-neukoelln",
            lastmod: "2026-08-17",
            changefreq: "monthly",
            priority: "0.8",
          },
          {
            path: "/community",
            lastmod: "2026-08-18",
            changefreq: "weekly",
            priority: "0.8",
          },
          {
            path: "/magazin/community/harput-wiesbaden",
            lastmod: "2026-08-18",
            changefreq: "monthly",
            priority: "0.8",
          },
          {
            path: "/magazin/community/ariana-restaurant-frankfurt",
            lastmod: "2026-08-20",
            changefreq: "monthly",
            priority: "0.8",
          },
          {
            path: "/magazin/community/alzaeem-restaurant-berlin",
            lastmod: "2026-08-26",
            changefreq: "monthly",
            priority: "0.8",
          },
          {
            path: "/magazin/community/kokio-berlin",
            lastmod: "2026-08-30",
            changefreq: "monthly",
            priority: "0.8",
          },
          {
            path: "/magazin/community/thronburger-berlin",
            lastmod: "2026-08-30",
            changefreq: "monthly",
            priority: "0.8",
          },
          {
            path: "/magazin/community/garcon-de-cafe-berlin",
            lastmod: "2026-09-05",
            changefreq: "monthly",
            priority: "0.8",
          },
          {
            path: "/magazin/community/chicken-krush-prag",
            lastmod: "2026-09-29",
            changefreq: "monthly",
            priority: "0.8",
          },
          {
            path: "/magazin/community/san-sebastian-berlin",
            lastmod: "2026-09-29",
            changefreq: "monthly",
            priority: "0.8",
          },
          {
            path: "/magazin/community/king-tut-restaurant-berlin",
            lastmod: "2026-10-06",
            changefreq: "monthly",
            priority: "0.8",
          },
          ...restaurants
            .filter((r) => r.slug || r.id)
            .map((r) => ({
              path: `/restaurant/${r.slug || r.id}`,
              lastmod: today,
              changefreq: "weekly" as const,
              priority: "0.8",
            })),
          ...caterers
            .filter((c) => c.slug || c.id)
            .map((c) => ({
              path: `/catering/${c.slug || c.id}`,
              lastmod: today,
              changefreq: "weekly" as const,
              priority: "0.8",
            })),
          ...planners
            .filter((p) => p.slug || p.id)
            .map((p) => ({
              path: `/planner/${p.slug || p.id}`,
              lastmod: today,
              changefreq: "weekly" as const,
              priority: "0.7",
            })),
          ...blogPosts.map((b) => ({
            path: `/blog/${b.slug}`,
            lastmod: b.date,
            changefreq: "monthly" as const,
            priority: "0.7",
          })),
          ...validGeoLocations.map(({ path }: { path: string }) => ({
            path,
            lastmod: today,
            changefreq: "weekly" as const,
            priority: "0.8",
          })),
        ];

        const urls = entries.map((e) => {
          const fullUrl = e.path === "/" ? BASE_URL : `${BASE_URL}${e.path}`;
          return [
            `  <url>`,
            `    <loc>${fullUrl}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n");
        });

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
          },
        });
      },
    },
  },
});
