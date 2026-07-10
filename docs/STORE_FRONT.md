# Speisely Storefront Architecture & Routing Map

_Last verified against code, commit `4381605`, 2026-07-05._

This document provides a strictly structured map of all public storefront routes, their underlying data sources, SEO strategies, and anti-fraud booking rules.

---

## 1. Directory & Discovery Routes

### Homepage

- **Route:** `/index.tsx`
- **Purpose:** Primary landing page for the Speisely platform. Funnels traffic into the three core verticals.
- **Audience:** All incoming public traffic.
- **Primary CTA:** Quick links / search inputs for Instant Food, Catering, and Event Planning.
- **Exact Data Sources:** Static content; JSON-LD present per `SEO_GEO.md`.
- **Status:** `Built` (static).

### Instant Order Directory

- **Route:** `/instant-order.tsx`
- **Purpose:** Browse restaurants offering instant takeaway/delivery.
- **Audience:** Customers wanting immediate food.
- **Primary CTA:** "View Menu" / "Order Now" leading to Restaurant Storefronts.
- **Exact Data Sources:** `restaurants` table (`is_published=true`), `product_categories`.
- **Booking / Checkout Logic:** Discovery only.
- **Status:** `Built`.

### Catering Directories

- **Route:** `/catering.index.tsx` (and sub-routes: `/catering/events`, `/catering/institutional-catering`, `/catering/daily-catering-subscriptions`)
- **Purpose:** Browse and discover event and B2B caterers based on event type.
- **Audience:** Private event hosts, B2B office managers.
- **Primary CTA:** "Request Quote" / "View Caterer".
- **Exact Data Sources:** `caterers` table, gated by `storefront_settings.status` (publish state lives here, not on `caterers` — see `DATA_MAP.md`).
- **Booking / Checkout Logic:** Discovery only.
- **Status:** `Built`.

---

## 2. Partner Storefront Routes (Booking Origins)

### Restaurant Storefront

- **Route:** `/restaurant/$slug.tsx`
- **Purpose:** Display a restaurant's menu, hours, and accept instant orders or table reservations.
- **Audience:** Diners and delivery customers.
- **Primary CTA:** "Add to Cart" or "Book Table".
- **Exact Data Sources:**
  - Reads: `restaurants` (via `getRestaurantBySlug`, explicit column allowlist — does not select `stripe_user_id`/`paypal_email` directly, though RLS still permits it for other direct queries), `restaurant_products`, `table_reservations` (for capacity).
  - Writes: `restaurant_orders`, `order_items`, `table_reservations`.
- **Booking / Checkout Logic (verified in code):**
  - **Card payment:** `startStorefrontCheckout` creates a real Stripe Checkout Session using the Direct Charge model (`stripeAccount` param), then redirects via `window.location.href`. This is real, not a mock.
  - **PayPal:** Opens a `paypal.me` link in a new tab, then shows a client-side confirmation alert. No server-side payment verification.
  - **Cash:** Client-side confirmation alert only, no payment verification.
  - **Promo codes:** Evaluated client-side against a hardcoded `mockPromoCodes` object — NOT the real `promo_codes` table. Any promo a restaurant configures in their dashboard currently has no effect at real checkout.
- **SEO / GEO Value:** JSON-LD (`Restaurant` schema) and canonical URL confirmed present via route `head()`.
- **Validation Rules (Anti-Fraud):**
  - **Table Booking:** Rejects past dates (DB trigger + Zod + UI `min` date). Requires available `seat_capacity` for the exact HH:MM slot.
  - **Orders:** Publish gate requires at least one configured payment method before the storefront can go live at all.
- **Reviews:** UI renders from a hardcoded empty array (`const reviews: any[] = []`) with a TODO comment in the code — no real review data is shown regardless of what's in the `reviews` table.
- **Status:** `Built`, with the promo-mock and reviews-mock caveats above.

### Caterer Storefront

- **Route:** `/caterer/$slug.tsx` (and `/catering/$slug.tsx`)
- **Purpose:** Display catering packages and capture detailed event briefs.
- **Audience:** Event hosts.
- **Primary CTA:** "Request a Quote".
- **Exact Data Sources:**
  - Reads: `caterers`, `caterer_menu_items`, `vendor_blackout_dates`, `availability`.
  - Writes: `catering_bookings`, `catering_briefs`.
- **Booking / Checkout Logic:** Submits a brief → pending status. Payment occurs later via dashboard-generated link (not re-verified directly this pass — carried forward from prior audit).
- **SEO / GEO Value:** JSON-LD and canonical URL confirmed present via route `head()`.
- **Validation Rules (Anti-Fraud):** No past dates; lead-time rules against `lead_time_days`; cross-checks `availability`/`vendor_blackout_dates`.
- **Status:** `Built`.

### Event Planner Storefront

- **Route:** `/planner/$slug.tsx`
- **Purpose:** Showcase portfolio and services, capture event leads.
- **Audience:** Event hosts looking for organization/decoration.
- **Primary CTA:** "Contact Planner" / "Book Service".
- **Exact Data Sources:**
  - Reads: `planners`, `planner_services`.
  - Writes: `event_bookings`, `planner_requests` (previously undocumented table — see `DATA_MAP.md`).
- **Booking / Checkout Logic:** Submits a lead → in-app chat negotiation. Payment pipeline for planners specifically not confirmed as live in code this pass — carry forward prior assessment that it likely relies on off-platform billing.
- **SEO / GEO Value:** JSON-LD and canonical URL confirmed present via route `head()`.
- **Validation Rules (Anti-Fraud):** No past dates.
- **Status:** `Partial` — portfolio/payment flow gaps carried forward from prior audit, not directly re-verified this pass.

---

## 3. Storefront Routing vs. Unified Partner Architecture

Speisely operates a **Unified Partner Identity** model internally, but presents **Isolated Operational Workspaces** to the user and the public. This split is confirmed unchanged in code:

1. **Public Face (Storefront):** `src/server.ts` isolates the public experience by host header, querying only the relevant vertical's table.
2. **Dashboard Face (Workspaces):** A Partner logs in with a single email; `role-middleware.ts` grants the `partner` role.
3. **Operational Isolation:** Dashboards never mix data sources across verticals — `/_authenticated/restaurant`, `/_authenticated/caterer`, `/_authenticated/dashboard/planner` remain fully separate route trees.

**What changed from the previous version of this doc:** Card checkout is confirmed real (Stripe Direct Charge), not a mock. Promo code evaluation is confirmed still mocked at the restaurant storefront specifically. Reviews are confirmed still fully mocked. Caterer publish status is clarified to live in `storefront_settings`, not on the `caterers` row.
