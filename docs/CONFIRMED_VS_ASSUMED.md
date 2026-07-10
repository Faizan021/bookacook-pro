# Speisely Confirmed vs. Assumed Logic

_Last verified against code, commit `4381605`, 2026-07-05. This pass re-checked every item below directly against the repo rather than trusting the previous version of this doc._

This document separates **verified facts** (traced directly in the codebase) from **inferred or assumed logic** (features that seem intended but lack complete implementation).

## 1. Authentication & Roles

### ✅ Confirmed (Fact)

- The system supports `admin`, `customer`, `restaurant_owner`, `caterer`, and `planner` roles.
- `role-middleware.ts` reads auth claims, checks `user_roles`, and self-heals missing roles from metadata for `customer`, `restaurant_owner`, `caterer`, `planner`, `partner` only. `admin` is explicitly excluded.
- A unified `partner` role is automatically injected for any vendor role.
- RLS protects mutations across most tables based on user ID matching.

### ❓ Assumed / Missing

- **Assumed:** Admin moderation workflows (e.g., manually approving a restaurant before it goes live).
- **Reality (re-confirmed):** Partners self-publish by default. Admin has a force-toggle for `is_published`/`storefront_settings.status`, which is an override capability, not a gate — there is no default `pending_review` state and no code path that blocks a partner from publishing themselves.

## 2. Storefront Routing

### ✅ Confirmed (Fact)

- `src/server.ts` intercepts requests and performs Edge/Server-level routing based on the `host` header — wildcard subdomains and custom domains both handled.
- The 404 logic for missing restaurant slugs throws `notFound()`, triggering the TanStack fallback UI.

### ❓ Assumed / Missing

- **Assumed:** SSL provisioning for custom domains.
- **Reality (re-confirmed):** No SSL/DNS provisioning code exists anywhere in `src/`. This relies entirely on Vercel's Domains API, configured outside the app. This is a stable, expected external dependency — not a bug to fix in-app.

## 3. SEO and GEO Strategy

### ✅ Confirmed (Fact) — CHANGED FROM PRIOR VERSION

- The database contains `german_locations` and `seo_content_pages`.
- The sitemap (`sitemap.xml.ts`) dynamically pulls live slugs from the database.
- **JSON-LD schema markup IS implemented** on restaurant, caterer, and planner profile routes via TanStack's `head()` callback — confirmed in `restaurant.$slug.tsx`, `catering.$slug.tsx`, `planner.$slug.tsx`. A prior version of this doc calling this "completely missing" was stale.
- **Canonical URLs ARE implemented** on the same three route files via `<link rel="canonical">`. A prior version calling this "Missing/Partial" was stale.

### ❓ Assumed / Missing

- **Assumed:** The frontend dynamically renders localized pages (e.g., `/catering/berlin`) utilizing `seo_content_pages` data.
- **Reality (re-confirmed, unchanged):** No public route anywhere consumes `seo_content_pages`. It has full admin CRUD and zero public rendering. This is the one SEO/GEO claim from the original doc that holds up completely.
- **New finding:** `AggregateRating` and `Product` schema types are genuinely missing (not just JSON-LD in general, which is now confirmed present at the base level).

## 4. Bookings & Checkout

### ✅ Confirmed (Fact) — CHANGED FROM PRIOR VERSION

- `startStorefrontCheckout` correctly creates real Stripe Checkout Sessions using the Direct Charge model (`stripeAccount` parameter, no `application_fee_amount`) — confirmed in `src/lib/stripe.ts` and `src/lib/restaurant/public.functions.ts`. **A prior security audit's finding that this was a JS `alert()` mock is stale as of current code** — the `alert()` calls that exist are for Cash/PayPal confirmation and error states only, not the card path.
- `createTableReservation` enforces `seat_capacity` and blocks past dates.
- Caterer quote flow shifts states `pending` → `quote_sent` → `deposit_paid`.

### ❓ Assumed / Missing

- **Assumed:** Event Planners have a functional payment pipeline.
- **Reality (not re-verified this pass, carried forward):** Event Planners capture leads via `event_bookings`/`planner_requests`; payment mechanics specific to Planners were not found and are assumed to rely on off-platform billing.
- **New finding:** Promo codes at the restaurant storefront checkout are evaluated against a hardcoded `mockPromoCodes` object, not the real `promo_codes` table — confirmed in `restaurant.$slug.tsx`. This is a genuine functional gap: promo codes created via the dashboard do not apply at real checkout.
- **Assumed:** Real-time KDS alerts were previously marked missing/partial.
- **Reality (re-confirmed, CHANGED):** Real-time audio alerts ARE implemented — Supabase Realtime channel subscription plus an `Audio` element playing `/speisely_alert.mp3` on new orders, confirmed in `restaurant.kitchen.tsx`. If push notifications outside the browser tab are still desired, that's a distinct, real gap.

## 5. Reviews System

### ✅ Confirmed (Fact)

- The `reviews` table exists in Supabase.

### ❓ Assumed / Missing

- **Assumed:** Customers can leave reviews after an order, and the storefront displays aggregate ratings.
- **Reality (re-confirmed, unchanged):** `restaurant.$slug.tsx` contains a literal TODO comment and `const reviews: any[] = []`. No read or write path for real review data exists anywhere in the code found. This is the one reviews-related claim from the original doc that holds up completely, unchanged.

## 6. Data Layer Gaps (new section — not in prior version)

### ✅ Confirmed (Fact)

- Three tables are actively used in code but were entirely undocumented before this pass: `partner_profiles` (auth/profile resolution), `storefront_settings` (caterer publish status — NOT stored on the `caterers` row itself), `planner_requests` (planner lead intake).
- Eight tables exist in the live schema with zero code references anywhere in `src/`: `orders`, `quotes`, `quote_items`, `catering_matches`, `event_requests`, `event_request_matches`, `products`, `packages`. Treat as legacy pending a production-data check (code silence ≠ confirmed-empty in the live database).
- **Status:** `implemented` - The `restaurant_stripe_accounts` migration to move Stripe Connect IDs off the public `restaurants` table is complete. The legacy `stripe_user_id` column has been dropped from the database. The previous RLS exposure risk is definitively closed.

## 7. Business Models & Commissions (New Findings)

### ✅ Confirmed (Fact)

- The database schema includes a `subscriptions` table explicitly tied to restaurants (`restaurant_id`).

### ❓ Assumed / Missing

- **Assumed:** Restaurants are billed €34.99/mo automatically, and caterers/planners are billed 10% commission per deal.
- **Reality (implemented):** The subscription enforcement is active. Restaurants with a `canceled` or `unpaid` subscription are hidden, while `active` and `past_due` remain visible. For caterers and planners, the 10% commission is collected via a Stripe deposit link injected into SecureChat when an official proposal is sent.
- **Assumed:** Partner dashboards protect Speisely's 10% cut by masking lead contact info until a deal is struck.
- **Reality (implemented):** Lead protection is enforced via backend status gating. Only a successful Stripe webhook payment transitions a brief to `booked`, which is required to unlock contact details.

**Summary of what changed in this revision:** Card checkout, JSON-LD schema markup, canonical URLs, and KDS real-time alerts all moved from `missing` to `implemented`. Promo-code-at-checkout mocking is a new finding, not previously documented. Three active-but-undocumented tables were added. The RLS exposure risk on `stripe_user_id` is confirmed resolved and closed (`implemented`). New rules for subscriptions, 10% commissions, and lead protection were documented and confirmed missing from the UI/logic layer.

### 8. Security Exposures (Audit Findings)

- **Storefront Data Exposure (Status: `implemented`):** `src/data/restaurants.ts`, `src/data/caterers.ts`, and `src/data/planners.ts` have been refactored to strictly select explicitly whitelisted storefront-safe fields. Private operational fields, internal statuses, and PII (`owner_id`, `subscription_status`, vendor `phone`/`address`) no longer leak into the frontend payload.
  - _Pending Follow-up_: `paypal_email` is currently still exposed in the restaurant payload to construct client-side checkout links; review shifting this to server-side generation.
- **Lead Protection (Status: `implemented`):** Lead contact data (client name/email/phone) in planner and catering requests is correctly omitted in the initial list query (`mutations.functions.ts`). Furthermore, vendor contact info is successfully scrubbed from the public storefront. Stage-gated reveal logic allowing vendors to view customer contact info ONLY post-confirmation (when status strictly equals `"booked"`) is now implemented end-to-end on both Caterer and Planner dashboards via secure server functions.
