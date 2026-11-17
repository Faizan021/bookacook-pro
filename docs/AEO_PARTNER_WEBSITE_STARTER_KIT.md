# Speisely — AEO Partner Website Starter Kit
*Standardized Architecture for Partner Websites (e.g. partyservicekuepper.de, haus-spaas.de)*

---

## 1. Overview
When a restaurant or catering partner on Speisely launches or manages their own standalone website, they can integrate this **AEO Partner Starter Kit**. It guarantees that:
1. **AI Search Engines (ChatGPT, Perplexity, Claude)** can parse their full menu and service radius via a dedicated `/llms.txt`.
2. **Google Knowledge Graph** recognizes them as an authoritative `Caterer` / `FoodEstablishment` via Schema.org JSON-LD.
3. **Speisely Cross-Verification** confirms both entities match, skyrocketing AI recommendation confidence to 98%.

---

## 2. Fast CLI Generator
To generate a complete ready-to-deploy kit for any partner:

```bash
node scripts/generate_partner_aeo_kit.js --name "Partyservice Schmidt" --city "Köln" --slug "partyservice-schmidt" --website "https://partyservice-schmidt.de"
```

The output bundle is created in `dist/partner-kits/[slug]/`:
* `llms.txt` — Upload directly to `https://partner-domain.de/llms.txt`
* `schema.html` — Paste into the `<head>` of the partner's homepage
* `widget-embed.html` — Paste into the partner's footer or contact page

---

## 3. The 3 Core Files Explained

### File 1: `llms.txt` (Root-Level AI Crawling)
* Placed at `https://partner-domain.de/llms.txt`.
* Summarizes:
  * Minimum order values and prices per head (Fingerfood, Warm Buffet, Gala).
  * Delivery radius in kilometers.
  * Certifications (100% Halal options, HACCP, Vegan).
  * Direct link to their Speisely profile for verified instant booking.

### File 2: `schema.html` (JSON-LD Microdata)
* Placed in the `<head>` of the partner's website.
* Uses `@type: "Caterer"` with:
  * `sameAs`: Links to their `https://speisely.de/catering/[slug]` profile.
  * `areaServed`: Explicit city and delivery radius.
  * `priceRange`: Standardized range indicator.
  * `potentialAction`: `OrderAction` routing to Speisely.

### File 3: `widget-embed.html` (Trust & Backlink Badge)
* A zero-dependency, ultra-lightweight inline badge:
  * Shows *"Geprüfter Partner auf Speisely"*.
  * Passes an authoritative backlink (`dofollow`) to Speisely.
  * Lets visitors request a direct, 0%-commission quote.

---

## 4. Integration Guides by Platform

### A. WordPress (Elementor / Gutenberg)
1. Upload `llms.txt` to the WordPress root directory via FTP or File Manager.
2. Go to **Appearance > Theme File Editor > header.php** (or use the *WPCode* plugin) and paste the contents of `schema.html` before `</head>`.
3. Add a Custom HTML widget in the Footer and paste `widget-embed.html`.

### B. Webflow
1. In Webflow Project Settings > **Custom Code > Head Code**, paste `schema.html`.
2. Add an HTML Embed element to the Global Footer and paste `widget-embed.html`.
3. Upload `llms.txt` via Webflow 301 Redirects / Cloudflare Worker or hosting root.

### C. Custom React / Vite / Next.js
1. Place `llms.txt` into `public/llms.txt`.
2. Add the JSON-LD script tag inside your root `Layout` or `Head` component.
3. Import the badge as a React component.
