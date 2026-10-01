# Active Work Notes

_This document serves as the active working memory for ongoing tasks, context updates, and immediate implementation states. Permanent decisions are moved to core documentation once finalized._

## Current Status (2026-10-02)

**Active Focus:**
- **Speisely Journal (Ausgabe 04): Page-by-Page Editorial Content Review** (Scheduled for next session)

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
