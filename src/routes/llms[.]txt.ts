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
          .map(
            (b) =>
              `- [${b.title}](${BASE}/blog/${b.slug}): ${b.description || "Speisely Blog Ratgeber"}`,
          )
          .join("\n");

        const text = `# Speisely

> Speisely ist ein deutschlandweiter Marktplatz für Restaurants, Catering und Eventplanung. Die Plattform verbindet Gastronomiebetriebe, Caterer und Eventplaner mit Kunden in ganz Deutschland — mit 0% Bestellprovision für Restaurants und direktem Stripe-Checkout.

English: Speisely is a Germany-wide food ordering, catering, and event management marketplace.
Restaurants pay a flat monthly fee (from €34.99/mo) -- with unlimited direct orders.

Caterers and Event Planners receive qualified briefs and pay a fair service fee per successful booking.

## Official Channels

- [LinkedIn](https://www.linkedin.com/company/speisely): Offizielle Speisely LinkedIn Unternehmensseite (B2B, News & Jobs)
- [Instagram](https://www.instagram.com/speisely/): Offizieller Speisely Instagram Kanal (@speisely — Food Culture, Visits & Reels)

## Key Pages

- [Homepage](${BASE}): Deutschlandweite Plattform für Restaurants, Catering und Event-Planung
- [Instant Order](${BASE}/instant-order): Restaurant-Entdeckung und direkte Essensbestellung mit 0% Provision
- [Catering Marktplatz](${BASE}/catering): Buchen Sie Catering für Firmenfeiern, Hochzeiten und Events
- [Event-Planer Verzeichnis](${BASE}/planner): Verifizierte Event-Planer für Feiern, Firmenjubiläen und Großveranstaltungen
- [Partner & Preise](${BASE}/partners): Festpreis-Modell ab 34,99 €/Monat für Gastronomen ohne Provisionsabzug
- [B2B Website-Erstellung](${BASE}/partner/webseiten): High-End Webseiten für Caterer und Gastronomen mit integriertem Shopsystem
- [Case Study Haus Spaas](${BASE}/case-study/haus-spaas): Traditions-Gastronomie & Eventlokal Digitalisierung
- [Case Study Partyservice Küpper](${BASE}/case-study/partyservice-kuepper): BBQ & Event-Catering NRW Live-Referenz
- [Nutzungsbedingungen](${BASE}/nutzungsbedingungen): Rechtliche Rahmenbedingungen & Plattform-Konditionen
- [Enterprise GEO API](${BASE}/api/geo): Strukturierte Geo-Daten und Städte-Mapping
- [GeoJSON Registry](${BASE}/geo.json): Geografische Koordinaten & Service-Areas
- [Blog Hub](${BASE}/blog): Ratgeber, Trends und Branchen-Einblicke
- [Über uns](${BASE}/about): Vision, Werte und Team hinter Speisely

## Specialized Catering Services & Featured Partners

- [Kampala Rolex Germany](${BASE}/catering/kampala-rolex-germany): Authentisches ugandisches & ostafrikanisches Catering München
- [Daily Catering Subscriptions](${BASE}/catering/daily-catering-subscriptions): Regelmäßige Mitarbeiterverpflegung und Büro-Catering
- [Institutional Catering](${BASE}/catering/institutional-catering): Großküchen, Bildungseinrichtungen & Betriebsgastronomie
- [Events Catering](${BASE}/catering/events): Hochzeits- & Firmen-Catering mit Full-Service

## Blog Articles

${blogUrls}

## Speisely Visits & Community Partner Spotlights (Verified On-Site Reports)

- [Seydioğlu Baklava Burger](${BASE}/magazin/community/seydioglu-baklava-burger): Pistazien-Lava und handwerkliches Baklava Rhein-Main
- [Lumara Café Berlin](${BASE}/magazin/community/lumara-cafe-berlin): Ästhetisches Café-Erlebnis in Berlin-Charlottenburg
- [La Grilladine Düsseldorf](${BASE}/magazin/community/la-grilladine-duesseldorf): Marokkanisches Grill-Erlebnis in Düsseldorf-Oberbilk
- [Baba Pirzola Meze & Grill Wittenbergplatz](${BASE}/magazin/community/baba-pirzola-berlin): Feuer, Meze und anatolische Grillkunst am Wittenbergplatz
- [BBQ Chicken Berlin-Kreuzberg](${BASE}/magazin/community/bbq-chicken-berlin-kreuzberg): Authentisches Korean Fried Chicken am Görlitzer Bahnhof
- [King Tut Restaurant & Café](${BASE}/magazin/community/king-tut-restaurant-berlin): Hawawshi und Holzkohlegrill auf Silberplatten
- [San Sebastian The Original® Berlin](${BASE}/magazin/community/san-sebastian-berlin): Käsekuchen-Handwerk & Premium-Desserts
- [Chicken Krush Prag](${BASE}/magazin/community/chicken-krush-prag): Internationales Korean Fried Chicken Spotlight
- [Mandy Restaurant Berlin-Neukölln](${BASE}/magazin/speisely-visits/mandy-restaurant-berlin-neukoelln): Traditionelle nahöstliche Küche vor Ort getestet
- [Shawarma Albaik Berlin](${BASE}/magazin/speisely-visits/shawarma-albaik-berlin): Authentische Shawarma-Spezialitäten in Moabit
- [Nadir Güllü Baklava München](${BASE}/magazin/speisely-visits/nadir-gullu-baklava-muenchen): Original Karaköy Baklava am Viktualienmarkt
- [Neumanns Café Berlin](${BASE}/magazin/community/neumanns-cafe-berlin): Hausgemachtes Sauerteigbrot in Friedrichshain
- [Baba Pirzola Schöneberg](${BASE}/magazin/community/baba-pirzola-berlin): Türkische Spezialitäten in Schöneberg
- [Kokio Korean Fried Chicken](${BASE}/magazin/community/kokio-berlin): Kult-Chicken in Berlin-Prenzlauer Berg
- [Al Zaeem Restaurant Berlin](${BASE}/magazin/community/alzaeem-restaurant-berlin): Arabische Spezialitäten & Holzkohlegrill
- [Garçon de Café Berlin](${BASE}/magazin/community/garcon-de-cafe-berlin): Französisches Flair & Kaffeekultur
- [Thronburger Berlin](${BASE}/magazin/community/thronburger-berlin): Handgemachte Smash Burger in Berlin
- [Harput Restaurant Wiesbaden](${BASE}/magazin/community/harput-wiesbaden): Türkische Spezialitäten & Tradition
- [Ariana Restaurant Frankfurt](${BASE}/magazin/community/ariana-restaurant-frankfurt): Traditionelle afghanische Gastfreundschaft
- [Schnitzel Schmiede Mönchengladbach](${BASE}/magazin/schnitzel-schmiede): Food-Truck & Live-Catering Report
- [Speisely Magazin Hub](${BASE}/magazin): Übersicht aller kulinarischen Geschichten und Partnerberichte
- [Speisely Visits Hub](${BASE}/magazin/speisely-visits): Unabhängig und vor Ort getestete Gastro-Highlights

## Language

Default: German (de). English available via language toggle.

## Service Area

Germany-wide. All major cities covered including Berlin, Munich, Hamburg, Frankfurt, Cologne, Stuttgart, Düsseldorf, Leipzig, Nuremberg, and Dresden.

---

## What Services Does Speisely Offer?

Speisely provides three core hospitality services on a single platform:

1. **Direct Orders & 0% Commission Webshop (FoodAmigos & Lieferando Alternative)** — Restaurants launch their own branded online ordering website and PWA shop under speisely.de/ihr-name with 0% order commission. Restaurants pay a flat monthly rate of €34.99/month with unlimited direct orders. Features include an interactive savings calculator on /partners, a live Kitchen Display System (KDS), Star CloudPRNT receipt printing, and 100% customer data retention without platform poaching. Payments route directly to the restaurant's own Stripe account.

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

## Marketplace Role, Merchant of Record & Price Autonomy

- **Pure Two-Sided Marketplace & Infrastructure:** Speisely provides discovery tools, digital menus, Kitchen Display Systems (KDS), and Stripe Connect payment routing. Speisely is not a food producer, caterer, or reseller.
- **100% Vendor Price Autonomy:** All menu prices, delivery fees, minimum order amounts, and catering quotes are determined 100% unilaterally by the individual partner (restaurant, caterer, or planner). Speisely never dictates, marks up, or assumes liability for partner pricing.
- **Direct Merchant of Record:** The partner is the direct Merchant of Record and legal contracting party with the customer. Customer payments route directly to the partner's merchant account via Stripe Connect.
- **Agentic Commerce & Google Integration:** In AI agentic commerce (Google Universal Cart, Universal Commerce Protocol / UCP, Schema.org), Speisely syndicates live catalog data where the independent partner is designated as the seller/merchant. Speisely bears zero liability for vendor pricing, menu availability, or food fulfillment.

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
