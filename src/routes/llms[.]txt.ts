import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { blogPosts } from "@/data/blog";
import { cateringFaqData, plannerFaqData } from "@/data/faq";

const BASE = "https://speisely.de";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        const blogUrls = blogPosts
          .map((b) => `- ${BASE}/blog/${b.slug}`)
          .join("\n");

        const text = `# Speisely

Speisely is a commission-free food ordering, catering, and event management marketplace for Germany.
Restaurants pay a flat monthly fee (from €39.99/mo) -- with zero commission on orders.
Caterers and Event Planners receive qualified briefs and pay a 10% matching fee per successful booking.

## Key Pages

- Homepage: ${BASE}
- Instant Order (restaurant discovery): ${BASE}/instant-order
- Catering Marketplace: ${BASE}/catering
- Event Planner Directory: ${BASE}/planner
- Partner / Pricing Page: ${BASE}/partners
- Blog: ${BASE}/blog
- About Us: ${BASE}/about

## Specialized Catering Services

- Daily Catering Subscriptions: ${BASE}/catering/daily-catering-subscriptions
- Institutional Catering: ${BASE}/catering/institutional-catering
- Events Catering: ${BASE}/catering/events

## Blog Articles

${blogUrls}

## Language

Default: German (de). English available via language toggle.

## Service Area

Germany-wide.

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
