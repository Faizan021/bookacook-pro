# Speisely — System Project Truth

This document specifies the core project truths, architectural boundaries, business rules, and technical foundations for Speisely.

---

## 1. Core Platform Architecture

- **Framework:** Built strictly on **TanStack Start** (Vite + React SSR/CSR). Next.js is strictly forbidden and does not exist in this project.
- **Backend & Storage:** **Supabase** (PostgreSQL, RLS, Auth, Storage) + Server Functions via `@tanstack/react-start` (`createServerFn`).
- **Styling:** Vanilla Tailwind CSS v4 with custom design tokens (`forest`, `cream`, `sand`, `gold`, `clay`, etc.).
- **Multi-Role Separation:**
  1. **Admin:** Platform management, system CRUD, manual assignment.
  2. **Customer:** Public marketplace browsing, storefront ordering, inquiry submission, client dashboard.
  3. **Caterer:** B2B/B2C event catering, package management, logistics (zip codes, delivery radii), inquiry management, proposals.
  4. **Restaurant:** Direct ordering, table reservations, surplus food ("Too Good To Go" style bags), KDS (Kitchen Display System).
  5. **Event Manager / Planner:** Full event planning services, partner coordination, inquiry handling.

- **Unified Partner Identity:** Caterers, Restaurants, and Event Planners share a unified login/partner identity, but their specific management dashboards, data models, and public storefronts remain strictly separate.

---

## 2. Business Model & Security Strictness

- **Restaurant Vertical:** €34.99/mo subscription fee + 0% order commission.
- **Caterer & Planner Verticals:** 10% booking commission + lead protection.
- **Disintermediation & Lead Protection:**
  - Phone and business address details are optional and kept private on public vendor storefronts.
  - Customer contact details (PII) are stage-gated and revealed ONLY when an inquiry/proposal transitions to `"booked"` state after deposit capture.
- **Payment Processing:**
  - Direct Card Payments for Restaurants use **Stripe Connect Direct Charge**.
  - Caterer and Planner deposits use dynamically generated Stripe Checkout Sessions embedded into secure chat/proposal flows.
- **Anti-Fraud Rules:**
  - No past-date bookings, reservations, or promo periods allowed. Enforced at DB trigger, Zod schema, and UI layers.

---

## 3. Production Verification & Safety Standards

- **Build / Type Safety:** Every change must compile cleanly via `npm run build` before deployment.
- **Runtime Sanity:** Zero tolerance for `is not defined`, undefined property access, or broken route error boundaries.
- **Deploy Pipeline:** Changes committed to `main` branch are pushed and deployed to Vercel production (`https://speisely.de`), followed by automated smoke testing (`npm run smoke:test`).

---

## 4. AI Search & Content Discovery Rules (GEO / AEO)

- **Mandatory Synchronization:** Whenever ANY new article, blog post, Speisely Visit, community partner story, or public route is added, modified, or published, the following files MUST be updated in the same changeset:
  1. `src/routes/llms[.]txt.ts` (Dynamic API route)
  2. `public/llms.txt` & `public/llms-full.txt` (Static AI crawler files)
  3. `src/routes/sitemap[.]xml.ts` (XML sitemap)
- **Citable Authority:** Maintain high-E-E-A-T local reporting in Speisely Visits to ensure AI engines (Perplexity, ChatGPT Search, Gemini) cite Speisely as the definitive regional food & catering directory.

---

## 5. SEO, Asset & Sitemap Integrity Standards

- **Zero Duplicate Meta Tags:** All meta tags MUST be injected via TanStack Router's `Route.head` (`head: () => ({ meta: [...] })`). Never hardcode fallback meta tags directly inside JSX `<head>` in `__root.tsx` or layout wrappers.
- **Zero Broken Asset References:** Every image URL referenced in frontend components must point to a physically existing asset on disk in `public/`.
- **Strict Canonical XML Sitemaps:** Sitemaps must contain only `200 OK` HTML canonical routes with valid slugs (no API paths, no raw UUIDs when slugs exist, and no 301/302 redirects).
- **Automated Graph Enforcement:** All pre-build static verification is automated via `scripts/verify_agent_graph.js` (Node 3 in the Multi-Agent Execution Pipeline). Any violation automatically halts the build.

---

## 6. Supabase Infrastructure & Disk Protection Standard

- **Zero High-Frequency `pg_cron` / `pg_net` Polling:** Sub-hour or minute-level `pg_cron` jobs (`* * * * *`) and `pg_net` HTTP calls (`net.http_post` / `net.http_get`) inside cron loops are strictly forbidden to prevent `cron.job_run_details`, `net._http_response`, and `pg_wal` from exhausting the 8 GB volume.
- **Automated Daily Retention Purge:** The `cleanup-cron-and-net-logs` cron job (`0 4 * * *`) and Postgres configuration (`"cron.log_statement": false`, `"pg_net.batch_size": 0`, `wal_keep_size: "1MB"`) keep database size lean (~18 MB).
- **Build-Time Enforcement:** `scripts/verify_agent_graph.js` (Rule 13) scans all SQL migrations and halts the build if any dangerous `pg_cron` or `pg_net` pattern is introduced.

---

## 7. Zero-Trust Database & API Security Standard

- **100% RLS Enforcement:** All 46+ tables in `public` (including `_archive_*` tables) must have Row-Level Security enabled (`rls_off = 0`).
- **Locked `SECURITY DEFINER` RPCs & Views:** All `SECURITY DEFINER` functions must lock `SET search_path = public` and revoke `PUBLIC`/`anon` execution; all `public` views must enforce `security_invoker = true`.
- **Strict `service_role` Policy Scoping:** Internal/webhook policies (`stripe_webhook_events`) must explicitly target `TO service_role` (never default `PUBLIC`), and `supabaseAdmin` / `SUPABASE_SERVICE_ROLE_KEY` must never be imported in client routes or components.
- **Automated Build Gate:** Enforced on every build by `scripts/verify_agent_graph.js` (Rule 14).

---

## 8. Brand Identity & Official Logo Standard

- **Official Logo Asset Location:** `public/images/speisely-official-logo.jpg` (mirrored to `public/images/speisely-square-logo.jpg` and `public/speisely-logo.jpg`).
- **Brand Visual DNA:**
  - Background: Speisely Forest Green (`#083822` / `rgb(8, 56, 34)`).
  - Emblem: Clean crossed fork and spoon in creamy ivory (`#F6F4EB`).
  - Wordmark: "Speisely" in rounded geometric sans-serif, matching the creamy ivory tone.
- **Usage Rule:** Whenever generating decks, pitch materials, social carousels, or public headers, always reference this exact verified official logo. Never use placeholder icons, generic emoji utensils (`🍽️`), or unverified variations.


---

## 9. Social & Editorial Visual Brand Consistency Standard (60-30-10 Rule)

- **Mandatory 3-Tone Palette:**
  - 60% Speisely Forest Green (`#083822` / `rgb(8, 56, 34)`)
  - 30% Warm Ivory Cream (`#F6F4EB`)
  - 10% Speisely Antique Gold (`#E6B84A`)
- **Strict 2-Font Typography:**
  - Editorial Headlines: Serif (`Playfair Display` / `Georgia Bold`)
  - Badges, Pills & Body Text: Clean Sans-Serif (`Plus Jakarta Sans` / `Arial Bold`)
- **Mandatory Dedicated Reel Covers:** Every video reel must include a dedicated 9:16 cover thumbnail conforming to the 60-30-10 palette and safe zones to maintain an aesthetically consistent profile grid.
- **Pre-Publishing Gate:** All reels, carousels, and articles must be inspected against these criteria prior to user delivery.

---

## 10. Anti-AI Writing Framework & "Speisely Pro" Voice Standard

- **Hybrid Voice DNA:** Combines Lindt-level sensory micro-textures (*samtig-dicht, schmelzend, kristallin*), journalistic technical rigor (*fermentation hours, blade RPMs, transparent euro prices*), and the authentic unannounced perspective of a guest seated at the table.
- **Banned AI Tropes:** Zero tolerance for generic AI clichés (*„nestled in the heart of“, „culinary journey“, „symphony of flavors“, „hidden gem“, „tantalize your tastebuds“*).
- **Burstiness & Dynamic Cadence:** Sentences must alternate between short 2-to-4 word punchy statements and rich descriptive observations; uniform sentence lengths are prohibited.
- **Audit Requirement:** All articles must pass the 6-point Anti-AI checklist before publication.

---

## 11. Marketplace Role, Merchant of Record & Zero Pricing Liability Doctrine

- **Pure Technology Platform (Shopify / Airbnb Model):**
  - Speisely is strictly a software infrastructure and marketplace platform, **NOT** a caterer, restaurant, food operator, or ghost kitchen.
  - Speisely never prepares food, holds inventory, or employs culinary staff.
- **100% Vendor Price Autonomy:**
  - All menu prices, per-person packages, minimum order values (Mindestbestellwert), cancellation policies, and delivery radii are determined, configured, and updated exclusively by the individual restaurant, caterer, or event planner in their vendor dashboard.
  - Speisely has **zero responsibility, authority, or liability** over vendor pricing. Speisely never dictates, subsidizes, or guarantees partner prices.
- **Direct Contracting & Merchant of Record:**
  - The culinary sales contract is strictly between the **Customer** (corporate client or individual diner) and the **Partner** (caterer or restaurant).
  - Stripe Connect routes payments directly to the partner's verified bank account.
  - Speisely provides discovery, the digital ordering channel, the AI concierge, and payment routing, but assumes zero liability for food safety, ingredient changes, or pricing fluctuations.
- **Agentic Search & Google Data Pipeline Role:**
  - In all Google integrations (Schema.org, Google Merchant feeds, Universal Cart, UCP / WebMCP), Speisely acts solely as an automated technical conduit.
  - The `seller` entity in all structured data and feeds is strictly the individual partner (`seller: { @type: "FoodEstablishment", name: vendor.name }`). Speisely merely pipes through the vendor's own database values without altering or underwriting them.
