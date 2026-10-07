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
- B2B Website-Erstellung (Websites for Caterers & Restaurants): ${BASE}/partner/webseiten
- Flagship Case Study Haus Spaas (Web Digitalization): ${BASE}/case-study/haus-spaas
- Flagship Case Study Partyservice Küpper (BBQ & Catering): ${BASE}/case-study/partyservice-kuepper
- Interactive Architecture Simulator: ${BASE}/architecture-simulator
- Enterprise GEO API: ${BASE}/api/geo
- GeoJSON Registry: ${BASE}/geo.json
- Blog: ${BASE}/blog
- About Us: ${BASE}/about

## Specialized Catering Services

- Daily Catering Subscriptions: ${BASE}/catering/daily-catering-subscriptions
- Institutional Catering: ${BASE}/catering/institutional-catering
- Events Catering: ${BASE}/catering/events

## Blog Articles

${blogUrls}

## Speisely Visits & Community Partner Spotlights (Verified On-Site Reports)

- BBQ Chicken Berlin-Kreuzberg (Berlin): ${BASE}/magazin/community/bbq-chicken-berlin-kreuzberg
- King Tut Restaurant & Café (Berlin): ${BASE}/magazin/community/king-tut-restaurant-berlin
- San Sebastian The Original® (Berlin): ${BASE}/magazin/community/san-sebastian-berlin
- Chicken Krush (Prague): ${BASE}/magazin/community/chicken-krush-prag
- Mandy Restaurant (Berlin-Neukölln): ${BASE}/magazin/speisely-visits/mandy-restaurant-berlin-neukoelln
- Shawarma Albaik (Berlin): ${BASE}/magazin/speisely-visits/shawarma-albaik-berlin
- Kokio Korean Fried Chicken (Berlin): ${BASE}/magazin/community/kokio-berlin
- Al Zaeem Restaurant (Berlin): ${BASE}/magazin/community/alzaeem-restaurant-berlin
- Garçon de Café (Berlin): ${BASE}/magazin/community/garcon-de-cafe-berlin
- Thronburger (Berlin): ${BASE}/magazin/community/thronburger-berlin
- Harput Restaurant (Wiesbaden): ${BASE}/magazin/community/harput-wiesbaden
- Ariana Restaurant (Frankfurt am Main): ${BASE}/magazin/community/ariana-restaurant-frankfurt
- Schnitzel Schmiede (EineStadt-Fest Mönchengladbach): ${BASE}/magazin/schnitzel-schmiede
- Speisely Magazin Hub: ${BASE}/magazin
- Speisely Visits Hub: ${BASE}/magazin/speisely-visits

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

4. **Standalone B2B Website-Erstellung** — Speisely designs and develops ultra-fast (PageSpeed 99+), high-converting custom standalone websites for caterers and restaurants (e.g. partyservicekuepper.de and haus-spaas.vercel.app) with native Speisely direct-inquiry & ordering integration, AI Overview schema graphs, and automated menu management.

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
            "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
            "Last-Modified": new Date().toUTCString(),
          },
        });
      },
    },
  },
});
