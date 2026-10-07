# Active Work Notes

_This document serves as the active working memory for ongoing tasks, context updates, and immediate implementation states. Permanent decisions are moved to core documentation once finalized._

## Current Status (2026-10-07)

**Active Focus:**
- **Community Partner Story: BBQ Chicken Berlin-Kreuzberg (100% Completed & Verified):**
  - *Route:* `/magazin/community/bbq-chicken-berlin-kreuzberg` (`src/routes/magazin.community.bbq-chicken-berlin-kreuzberg.tsx`)
  - *Layout Architecture:* Strictly mirrors King Tut Berlin standard (Breadcrumb bar, 3-column quick facts, 4:3 double-border hero feast, 6 official scraped menu classics, authentic K-food streetfood section with Rosé Tteokbokki and Bulgogi Mandu, Chicken-Mu palate cleanser feature, combined Insider Ordering Guide & Görli Picnic Vibe, official factsheet and community mailto box).
  - *Instagram Carousel Standard (Rule 12 & 13):* 7 slides generated in 1080×1350 portrait format (both clean and with_text overlay versions with circular Speisely brand seal) in `public/magazin/bbq-chicken-berlin/instagram/` along with high-engagement SEO caption (`caption.txt`).
  - *Sitemaps & GEO Synchronization (Rule 9 & 11):* Synced across `src/routes/sitemap[.]xml.ts`, `src/routes/llms[.]txt.ts`, `public/llms.txt`, and featured in `src/routes/community.index.tsx`.
- **New Caterer Partner Onboarding: Kampala Rolex Germany (München) (In Progress):**
  - *Partner Name:* Kampala Rolex Germany
  - *Cuisine & Niche:* Authentisches ugandisches & ostafrikanisches Catering (Ugandan & East African)
  - *Location:* München & Umgebung (Munich & surrounding region)
  - *Contact / Socials:* WhatsApp: `+49 152 14438923`, Instagram / TikTok: `@kampala.rolex1`
  - *Signature Live Station:* Live-Ugandan-Rolex-Station (Freshly rolled Chapati with seasoned vegetable/egg omelette, spiced chicken/beef options)
  - *Core Menu Selection:* Pilau (aromatic spiced rice), White Rice, Chicken Stew, Beef Stew, Matooke (steamed cooking bananas), Chapati, Samosas, Mandazi (Swahili pastries), Kachumbari (fresh East African tomato-onion-chili salad), traditional sauces
  - *Service Formats:* Warmservice with Chafing-Dishes (Buffet), Live-Food-Station, Foodtruck & Festival setups (Private parties, corporate events, Christmas parties, weddings)
  - *Assets Stored (12 HD Photos + Transparent Logo + Brochure):* `public/caterers/kampala-rolex-muenchen/`
    - `logo.png` (Official transparent Gorilla Chef logo)
    - `01_live_station_foodtruck.jpg` (Live cooking & DJ foodtruck station)
    - `02_ugandan_rolex_signature.jpg` & `03_ugandan_rolex_closeup.jpg` (Signature Ugandan Rolex street food wrap)
    - `04_pilau_rice_buffet.png` & `09_pilau_and_white_rice.png` (Spiced Pilau & Basmati rice in chafing dishes)
    - `05_beef_meat_stew_chafing.jpg`, `07_meat_and_pilau_heatlamp.png`, `10_beef_stew_portrait_heatlamp.png` (Slow-cooked rich beef stew under heat lamps)
    - `06_buffet_event_guests.jpg` (Atmospheric catering event scene with guests at buffet)
    - `08_chapati_potatoes_sauce.png` & `11_chapati_close_up.png` (Flaky East African Chapati, roasted potatoes & traditional sauce)
    - `12_hanging_grill_crisp_chicken.jpg` (Hanging carousel grill piled with golden crispy chicken)
    - `pdf_p1_img1.jpeg` - `pdf_p4_img1.jpeg` (4-page official catering brochure)
- **Speisely Journal (Ausgabe 04): Page-by-Page Editorial Content Review** (Ongoing)

**Completed Sprint Task (2026-10-02):**
- **Magazine Architecture & Layout Geometry Harmonization (100% Complete & Live):**
  - **Root Cause Solved:** StPageFlip injected inline `display: block` on `.page`, disabling vertical flex distribution (`justify-between`). Resolved by wrapping all 10 pages in an inner `.page-content` flex container (`y = 24px` to `y = 716px` exact padding bounds).
  - **Unconstrained Images Resolved:** Standardized Tailwind spacing tokens across Pages 2, 8, and 9 (`w-24 h-20`, `w-28 h-24`, etc.), locking natural aspect ratios within passe-partout gallery frames.
  - **Blank Voids Eliminated:** Bottom voids on Pages 5, 8, 9, and 10 eliminated using verified repository records (TOC focus panel on Page 5, Ariana Frankfurt community dispatch on Page 8, TechGlanz serverless metrics on Page 9, Speisely quality standards and colophon on Page 10).
  - **Dual Language Synchronization:** DE/EN toggle instant state toggle active on all 10 pages.
  - **Node 4.5 Visual QA Pipeline:** Automated Playwright screenshots generated and visually inspected via `view_file` across Desktop (1440×900), Laptop (1280×800), and Reader Embed (`/magazin/reader`). Passed 100%.
  - **Production State:** Commit `2192c73` merged and live on Vercel at `https://speisely.de/magazin/edition.html` and `https://speisely.de/magazin/reader`.

---

## Next Session Agenda: Page-by-Page Editorial Content Polish

**Goal:** Go through each page (Page 1 to Page 10) systematically with the user to refine, audit, and finalize all editorial text, headlines, teasers, and translation nuances.

### Mandatory Rules for the Session:
1. **Zero Invented Facts:**
   - Only use facts verified in the codebase, database, or existing partner route content.
   - If existing content does not contain enough verified facts, **reduce copy and let spacing/typography carry the layout** rather than fabricating numbers, equipment claims, or partner metrics.
2. **Synchronized Dual-Language (DE & EN):**
   - Every single text change must be applied to both `.lang-de` and `.lang-en` blocks simultaneously.
3. **Single Source of Truth Sync:**
   - Edits must be made to `public/speisely-magazin-edition.html` and synced to `src/routes/magazin.edition[.]html.ts` via `node scripts/sync_magazin_route.cjs`.
4. **Automated Verification Pipeline (Node 3 -> 4 -> 4.5):**
   - Run `npm run verify:graph`, `npm run build`, and `npm run qa:visual` with direct multimodal inspection before concluding any review round.

### Page Review Plan:
- **Page 1 (Cover):** Title typography, headline, subtitles, date/issue badge, 3 teaser cards.
- **Page 2 (Speisely Pro Ad):** B2B proposition, 3 module captions (Order Engine, Outdoor POS, Cloud KDS), bullet points, CTA URL.
- **Page 3 (Impressum & Editor's Note):** Masthead team list, colophon, Managing Editor's Letter (Ahmad F.), partner network references.
- **Page 4 (B2B Enterprise Feature):** Corporate catering report copy, pricing starting point (€18/head), corporate benefits, inquiry box.
- **Page 5 (Table of Contents):** Story descriptions for pages 06–10, Schwerpunkte & Redaktionsfokus editorial cards, metadata bar.
- **Page 6 (Schnitzel Schmiede Feature):** Headline, drop-cap body text, pull-quote, Gastro-Dossier factsheet, 3 Event Catering Takeaways.
- **Page 7 (Alzaeem Charcoal Grill Feature):** Headline, body copy, Mezze Spread highlight, Culinary Profile, 3 Insights for Groups & Events.
- **Page 8 (Community Dispatches):** 4 restaurant stories (Chicken Krush Prag, Garçon de Café Berlin, Thronburger Berlin, Ariana Frankfurt), contact strip.
- **Page 9 (Dessert & FoodTech Architecture):** San Sebastian Cheesecake description, TechGlanz serverless study, 3-metric dashboard, Simulator trigger.
- **Page 10 (Back Cover):** Comparison matrix (Traditional Brokers vs. Speisely Direct), event inquiry CTA, Speisely Zertifizierungs-Standard, colophon.

---

## 2. Core Architecture & Payment Hardening (Background Context)

### Recently Completed
- **PayPal exposure hardening = implemented** (PayPal link generation moved to server inside `submitStorefrontOrder`, `paypal_email` removed from public payloads).
  - _Order status gap documented:_ PayPal.me orders currently auto-confirm due to lack of a webhook for capture verification. This is an accepted gap to preserve current payment behavior.
- **Restaurant checkout rebuild = implemented**
- **Promo Code Realization = implemented**
- **KDS storefront visibility fix = implemented**
  - Wired up storefront checkout to real promo codes.
  - Hardened backend checkout with `submitStorefrontOrder` and `restaurant_orders` customer details migration.
  - Implemented KDS and webhook payment method validation for Stripe, Cash, and PayPal.

### Pending Follow-up Hardening:
- **webhook replay/dedup hardening = partial** (Idempotency currently relies on status updates, but event IDs are not strictly persisted in a dedicated table to prevent replay.)
- **Business Model Strictness (Commissions & Subscriptions):**
  - Blocked manual `"booked"` transitions. Webhooks now exclusively control this state upon deposit capture.
  - Deployed dynamic Stripe checkout session generation for Caterer and Planner proposals, directly injecting deposit links into SecureChat.
  - Restricted public restaurant showcase based on `subscription_status` (`canceled` and `unpaid` are blocked, `active` and `past_due` remain visible to rely on Stripe's retry schedules).
- **Lead Protection:** PII reveal is explicitly tied to the `"booked"` status, fully protecting the 10% commission.
- **Stripe ID Hardening (Stages 1 & 2):** Successfully decoupled application code from `restaurants.stripe_user_id`, ran a verification query, and dropped the column from the database. Types regenerated.

### Recently Verified System Truths (Not yet fully resolved in code):
- Restaurant storefront promos evaluate against `mockPromoCodes`, not the real `promo_codes` table (Status: `missing`).
- Reviews UI is purely mocked with `const reviews: any[] = [];` (Status: `missing`).
- Programmatic GEO pages do not exist publicly; `seo_content_pages` is admin CRUD only (Status: `missing`).

### Active: Permanent Security Rule & Exposure Remediation
- **Goal:** Eliminate data leaks via select(*) on mixed public/private tables and enforce stage-gated lead protection.
- **Status:** Storefront public data leak remediation is `implemented` (all three loaders refactored to explicit safe fields). Lead protection is `implemented` (stage-gated reveal of PII at the "booked" status).

## 3. Current Temporary Lead-Capture State
- VeeDo’s Kitchen and Partyservice Küpper currently use storefront slugs: `veedos-kitchen` and `partyservice-kuepper`.
- The identifier `9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0001` has valid UUID syntax but is not a verified production `caterers.id`.
- UUID-format validation does not prove that a corresponding caterer exists. The server queries the production `caterers` table first before assigning `preferred_caterer_id`.
- Until a verified database record exists, `preferred_caterer_id` remains `null` and the storefront slug is handled non-relationally.
- Enquiries are routed to `faizan.ahmed01213@gmail.com` through the temporary notification workflow.
- Faizan manually reviews each enquiry and forwards it to the appropriate caterer in accordance with customer privacy notices.
- The migration `20260808000001_caterer_multitenant_pipeline.sql` remains unapplied in production until schema, RLS, and onboarding checks are completed.
