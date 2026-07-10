# Speisely Confirmed Decisions

_Last verified against code: 2026-07-05, commit `4381605` on `github.com/Faizan021/bookacook-pro`._

This document is the immutable record of approved architecture choices, product rules, and UX decisions. AI agents (Antigravity, Claude, etc.) must **not** revisit or attempt to change these decisions without explicit user approval. If a task seems to require reopening one of these, stop and ask instead of proceeding.

## 1. Architecture & Tech Stack

- **Framework:** React with TanStack Router / TanStack Start (`@tanstack/react-start`) for full-stack routing and server functions (`createServerFn`).
- **Database / Backend:** Supabase (PostgreSQL, Auth, Edge Functions, Storage).
- **Styling:** Tailwind CSS with Radix UI components (shadcn/ui patterns).
- **Hosting:** Vercel (Vercel Edge/Serverless functions for SSR).
- **Status: SETTLED.** There is no Next.js code in the repository. A prior migration from an older Next.js codebase to this TanStack Start codebase is complete and pushed to `main` — do not reopen the framework question or attempt to reconcile against a Next.js version; none exists in the repo.

## 2. Storefront Routing (Custom Domains & Subdomains)

- **Decision:** The storefront dynamically resolves partner profiles based on the `host` header.
- **Logic (`src/server.ts`):**
  - If the host is a wildcard subdomain (e.g., `pizza.speisely.de`), it extracts `pizza` and matches it against the `slug` column in the database.
  - If the host is a custom domain (e.g., `pizzeria-napoli.com`), it matches against the `custom_domain` column.
- **Strict Rule:** Do not modify the `server.ts` request rewriting logic without high-level approval. It is critical for the white-label/SaaS offering.
- **Known external dependency (not in app code):** Actual SSL certificate issuance and DNS verification for custom domains rely entirely on Vercel's Domains API, configured manually/separately. Confirmed no SSL/DNS provisioning code exists in `src/`. This is not a gap to "fix" in-app — it's an intentional external dependency. Document it as such when onboarding new partners with custom domains.

## 3. Authentication & Account Structure

- **Decision:** A single user account can hold multiple roles simultaneously.
- **Rule:** Unified identity model. A user signs up once and can be a customer, a restaurant owner, and a caterer.
- **Middleware Execution:** `src/lib/auth/role-middleware.ts` self-heals roles by reading `user_metadata` on first authenticated call and inserting into `user_roles`, for roles in `SELF_HEALABLE_ROLES` (`customer`, `restaurant_owner`, `caterer`, `planner`, `partner`). `admin` is explicitly excluded from self-healing and must be assigned manually.
- It also injects a unified `partner` role at request time for any user holding `restaurant_owner`, `caterer`, or `planner`.
- **Strict Rule:** Do not attempt to split user accounts or force separate logins for different business verticals.
- **Verified in code exactly as described** — no drift found.

## 4. Operational Workspaces

- **Decision:** Dashboards are strictly separated by vertical.
- **Rule:** A Caterer manages catering inquiries in `/_authenticated/caterer`. A Restaurant manages instant orders in `/_authenticated/restaurant` (plus `/_authenticated/restaurant.kitchen` for the live KDS). A Planner manages leads in `/_authenticated/dashboard/planner`.
- **Strict Rule:** Do not merge the UI of these dashboards. The operational contexts (Quoting vs. Instant Fulfillment vs. Lead Negotiation) are too different.

## 5. Checkout & Payments & Business Model

- **Business Model (Restaurants):** Speisely takes **0% commission** on orders. Customers pay the restaurant directly (via Stripe Connect Direct Charge, Cash, or PayPal). Restaurants pay Speisely a flat **€34.99/month subscription fee** via Stripe.
  - _Status:_ `partial` — Database subscription tables exist (`subscriptions`), and public marketing text claims 0% commission, but strict subscription enforcement UI is not fully wired.
- **Business Model (Caterers & Event Planners):** **No monthly subscription**. Speisely earns a **10% commission** per deal/order. To protect this revenue, full customer contact details (email/phone) are strictly hidden from the partner until the deal is secured/deposit paid.
  - _Status:_ `missing` — 10% automated collection and lead-protection contact masking do not currently exist in the codebase (dashboards currently reveal phone/email early).
- **Restaurant Checkout Logic:** All restaurant storefront card payments run through Stripe Connect using the **Direct Charge model**: `stripe.checkout.sessions.create(..., { stripeAccount: restaurantStripeUserId })`, with no `application_fee_amount` set. Money and Stripe processing fees go directly to the connected restaurant account.
- **Status: IMPLEMENTED AND CONFIRMED IN CODE** (`src/lib/stripe.ts:209-239`, `src/lib/restaurant/public.functions.ts` `startStorefrontCheckout`). Do not change this charge model without explicit approval.
- **Cash and PayPal** are non-Stripe paths with no server-side payment verification — PayPal redirects to a `paypal.me` link, Cash is a client-side confirmation only. Speisely stores no payment credentials for either.
- **Publishing Gate:** A restaurant cannot set `is_published: true` unless `accepts_cash` OR `accepts_paypal` OR `stripe_connect_status === 'connected'`. Auto-unpublish fires if Stripe is deauthorized and no alternative method is configured. Confirmed implemented in `src/lib/restaurant/mutations.functions.ts`.
- **Security Rule:** Stripe Connect account IDs must be stored in secure, private tables. `restaurant_stripe_accounts` (private) was introduced as the source of truth; the legacy public `restaurants.stripe_user_id` column and its permissive RLS SELECT policy still exist as a fallback and remain a real, unresolved exposure — see `CONFIRMED_VS_ASSUMED.md`. Closing this (dropping the column or tightening the SELECT policy) requires an explicit decision, not a silent fix.

## 6. Anti-Fraud & Date Logic

- **Decision:** Strict server-side date validation is required for all bookings.
- **Rule:** Customers can never book a date in the past. Enforced via Zod schema validation in `createServerFn`, native date-input `min` attributes in the UI, AND database-level triggers.
- **Rule:** Availability logic must respect both recurring `availability` rules and specific `vendor_blackout_dates`.
- **Implementation note:** Two separate migrations currently implement overlapping trigger logic for this (`20260704200000_anti_fraud_date_constraints.sql` and `20260704204747_anti_fraud_date_triggers.sql`), both attached to `table_reservations`, `catering_bookings`, `event_bookings`. This is duplicated, not redundant-by-design — consolidating to one trigger function is a housekeeping task, not a decision to revisit the underlying rule.

## 7. Error Handling (404s)

- **Decision:** The storefront must gracefully handle missing slugs or unpublished restaurants.
- **Rule:** If `getRestaurant` (or equivalent) returns null for a slug, the loader must explicitly `throw notFound()`. Do not rely on empty component returns (`return null`), as TanStack Router requires the explicit throw to render the fallback 404 UI.

## 8. Roles & Moderation

- **Decision:** Five roles — Admin, Customer, Caterer, Restaurant, Event Manager — stay documented and operated separately even though Restaurant/Caterer/Planner share the unified `partner` identity (see §3).
- **Current state, not yet a ratified decision:** Partners currently self-publish; admin can force-toggle `is_published`/`status` after the fact but there is no pre-publish approval gate. If pre-publish moderation is actually wanted, that requires a new decision and a `pending_review` default state — it is not currently implemented, and should not be assumed to exist.
