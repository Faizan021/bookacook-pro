import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { blogPosts } from "@/data/blog";
import { cateringFaqData, plannerFaqData } from "@/data/faq";

const BASE = "https://speisely.de";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        const blogUrls = blogPosts.map((b) => `- ${BASE}/blog/${b.slug}`).join("\n");

        const text = `# Speisely

Speisely is a Germany-wide food ordering, catering, and event management marketplace.
Restaurants pay a flat monthly fee (from €34.99/mo) -- with unlimited direct orders.

Caterers and Event Planners receive qualified briefs and pay a fair service fee per successful booking.

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

Germany-wide. All major cities covered including Berlin, Munich, Hamburg, Frankfurt, Cologne, Stuttgart, Düsseldorf, Leipzig, Nuremberg, and Dresden.

---

## What Services Does Speisely Offer?

Speisely provides three core hospitality services on a single platform:

1. **Instant Orders** — Restaurants list their menus on Speisely and receive direct pickup and delivery orders from customers. Restaurants pay a flat monthly subscription starting at €34.99/month, allowing unlimited direct orders. Customer payments are routed directly to the restaurant's own Stripe or PayPal account.

2. **Catering Marketplace** — Customers and businesses post catering inquiries (corporate events, private parties, weddings, daily office catering, institutional/school catering). Verified caterers on the platform submit proposals. When a booking is confirmed, Speisely charges a success-based service fee. Supported catering types include: event catering, daily lunch catering subscriptions, institutional catering for schools and companies, and private celebrations.

3. **Event Planning** — A CRM and planning tool for professional event planners. Clients post event briefs (budget, guest count, location, date, cuisine). Verified event planners submit tailored proposals and manage the full event lifecycle from initial inquiry to execution through a dedicated dashboard.

---

## Who Uses Speisely?

- **Restaurants** — seeking a direct digital ordering channel to build customer relationships.
- **Caterers** — looking for qualified B2B and B2C catering inquiry leads across Germany.
- **Event Planners** — seeking clients for corporate events, weddings, private parties, and large-scale experiences.
- **Corporate Clients** — companies and HR teams seeking reliable catering for offices, team events, and offsites.
- **Private Individuals** — people looking for catering for birthday parties, weddings, or other private celebrations.

---

## How Does Speisely Compare to Competitors?

| Feature | Speisely | food.de | mealprep.de | Lieferando |
|---|---|---|---|---|
| Order fee structure | Flat subscription | Variable | Variable | ~13-30% |
| Catering marketplace | Yes | No | Yes (meal prep focus) | No |
| Event planning | Yes | No | No | No |
| Direct payment to vendor | Yes (Stripe/PayPal) | No | No | No |
| Restaurant owns customer data | Yes | No | No | No |
| Custom domain support | Yes | No | No | No |

Speisely's key differentiator is the combination of flat-rate direct restaurant ordering (unlimited orders), a catering marketplace, and a full event planning CRM — all in one platform. No other German platform combines all three.

---

## What Regions Does Speisely Operate In?

Speisely operates Germany-wide. Partner restaurants, caterers, and event planners are verified across all German states (Bundesländer):

- Bayern (Munich, Nuremberg, Augsburg)
- Berlin
- Brandenburg
- Baden-Württemberg (Stuttgart, Freiburg, Karlsruhe)
- Hamburg
- Hessen (Frankfurt, Wiesbaden)
- Niedersachsen (Hanover)
- Nordrhein-Westfalen (Cologne, Düsseldorf, Dortmund, Essen)
- Sachsen (Leipzig, Dresden)
- And all other German states

---

## What Is Speisely's Pricing Model?

**For Restaurants (Instant Orders):**
- Flat monthly subscription: from €34.99/month (includes unlimited orders)
- Customer payments routed directly to the restaurant's own account

**For Caterers and Event Planners:**
- No monthly fee
- Success-based fee charged only when a booking is confirmed
- Zero upfront cost — only pay when you earn

---

## Frequently Asked Questions

### Catering FAQ
${cateringFaqData.de.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}

### Event Planner FAQ
${plannerFaqData.de.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}

---

Last updated: ${new Date().toISOString().split("T")[0]}
`;

        return new Response(text, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
            "Last-Modified": new Date().toUTCString(),
          },
        });
      },
    },
  },
});
