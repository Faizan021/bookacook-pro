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
          getValidGeoLocations()
        ]);

        const entries: SitemapEntry[] = [
          { path: "/", lastmod: today, changefreq: "weekly", priority: "1.0" },
          { path: "/instant-order", lastmod: today, changefreq: "daily", priority: "0.9" },
          { path: "/catering", lastmod: today, changefreq: "weekly", priority: "0.9" },
          { path: "/planner", lastmod: today, changefreq: "weekly", priority: "0.9" },
          { path: "/speisely", lastmod: today, changefreq: "daily", priority: "0.9" },
          { path: "/partners", lastmod: "2026-06-15", changefreq: "monthly", priority: "0.7" },
          { path: "/blog", lastmod: today, changefreq: "weekly", priority: "0.8" },
          { path: "/about", lastmod: "2026-06-01", changefreq: "monthly", priority: "0.5" },
          { path: "/impressum", lastmod: "2026-06-01", changefreq: "yearly", priority: "0.3" },
          ...restaurants.map((r) => ({
            path: `/restaurant/${r.id}`,
            lastmod: today,
            changefreq: "weekly" as const,
            priority: "0.8",
          })),
          ...caterers.map((c) => ({
            path: `/catering/${c.id}`,
            lastmod: today,
            changefreq: "weekly" as const,
            priority: "0.8",
          })),
          ...planners.map((p) => ({
            path: `/planner/${p.id}`,
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
          ...validGeoLocations.map((path) => ({
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
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
