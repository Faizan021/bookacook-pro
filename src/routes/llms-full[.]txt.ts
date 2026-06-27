import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getRestaurants } from "@/data/restaurants";
import { getCaterers } from "@/data/caterers";
import { getPlanners } from "@/data/planners";
import { blogPosts } from "@/data/blog";
import { cateringFaqData, plannerFaqData } from "@/data/faq";

const BASE = "https://speisely.de";

/** Strip HTML tags from a string and return plain text */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Return first ~300 words of plain text from HTML content */
function excerpt(html: string, wordLimit = 300): string {
  const plain = stripHtml(html);
  const words = plain.split(" ");
  if (words.length <= wordLimit) return plain;
  return words.slice(0, wordLimit).join(" ") + "...";
}

export const Route = createFileRoute("/llms-full.txt")({
  server: {
    handlers: {
      GET: async () => {
        const [restaurants, caterers, planners] = await Promise.all([
          getRestaurants(),
          getCaterers(),
          getPlanners(),
        ]);

        const restaurantUrls = restaurants
          .map((r: any) => `- ${BASE}/restaurant/${r.id}  (${r.name}, ${r.area})`)
          .join("\n");

        const catererUrls = caterers
          .map((c: any) => `- ${BASE}/catering/${c.id}  (${c.name}, ${c.area})`)
          .join("\n");

        const plannerUrls = planners
          .map((p: any) => `- ${BASE}/planner/${p.id}  (${p.name}, ${p.area ?? "Germany"})`)
          .join("\n");

        const blogSections = blogPosts
          .map((b) => {
            const ex = excerpt(b.content.de, 300);
            return `### ${b.title.de}
URL: ${BASE}/blog/${b.slug}
Date: ${b.date}
Author: ${b.author}
Category: ${b.category}

${ex}
`;
          })
          .join("\n---\n\n");

        const text = `# Speisely — Full Context Document

Speisely is a commission-free food ordering and catering marketplace for Germany.
Restaurants pay EUR 34.99/month flat -- no commission on orders.
Caterers and Event Planners receive qualified briefs and pay 10% per booking.

## Key Pages

- Homepage: ${BASE}
- Instant Order (restaurant discovery): ${BASE}/instant-order
- Catering Marketplace: ${BASE}/catering
- Event Planner Directory: ${BASE}/planner
- Partner / Pricing Page: ${BASE}/partners
- Blog: ${BASE}/blog
- About Us: ${BASE}/about

## Restaurant Storefronts

${restaurantUrls}

## Catering Listings

${catererUrls}

## Event Planner Listings

${plannerUrls}

## Blog Articles (with excerpts)

${blogSections}

## Language

Default: German (de). English available via language toggle.

## Service Area

Germany -- currently focused on North Rhine-Westphalia (NRW), including Moenchengladbach, Duesseldorf, Koeln.

## Frequently Asked Questions

### Catering FAQ
${cateringFaqData.de.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}

### Event Planner FAQ
${plannerFaqData.de.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}
`;

        return new Response(text, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
