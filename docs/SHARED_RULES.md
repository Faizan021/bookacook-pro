# Speisely Shared Business Rules

*Last verified against code, commit `4381605`, 2026-07-05.*

This document outlines the core business logic, boundaries, and validation rules that apply globally across the Speisely platform.

## 1. Authentication & Identity Boundaries

**Unified Partner Identity**
- **Rule:** A single user can act as a Customer, Restaurant Owner, Caterer, and Event Manager simultaneously.
- **Implementation:** `src/lib/auth/role-middleware.ts` automatically injects a `partner` role if the user holds any specific vendor role (`restaurant_owner`, `caterer`, `planner`). Self-healing from `user_metadata` applies to `customer`, `restaurant_owner`, `caterer`, `planner`, `partner` — explicitly NOT `admin`.
- **Status:** `Built` & Active. Verified exactly as described in code.

**Separation of Operational Workspaces**
- **Rule:** Despite unified identity, workspaces are strictly segregated. A user managing their Restaurant sees a different dashboard (`/_authenticated/restaurant`) than when managing Catering (`/_authenticated/caterer`).
- **Reasoning:** Keeps UI clean, prevents accidental mixing of distinct business models (Instant vs. Quoted).
- **Status:** `Built` & Active.

## 2. Anti-Fraud & Date Validation Logic

**No Past-Date Abuse**
- **Rule:** Customers cannot book tables, submit catering inquiries, or request planners for dates in the past.
- **Frontend Validation:** Native date-input `min` attributes and Zod-backed date pickers block past dates.
- **Backend Validation:** Server functions (`createServerFn`) enforce strict date rules via Zod.
- **Database Validation:** PL/pgSQL `BEFORE INSERT` (and in one migration, `BEFORE INSERT OR UPDATE`) triggers on `table_reservations`, `catering_bookings`, `event_bookings`.
- **Status:** `Built`, confirmed at all three layers. **Known duplication:** two separate migrations (`20260704200000_anti_fraud_date_constraints.sql`, `20260704204747_anti_fraud_date_triggers.sql`) each created their own trigger function and both are currently attached to the same three tables. Functionally harmless today (both just reject past dates) but should be consolidated to avoid future divergence if one gets edited without the other.

**Vendor Calendar Sync**
- **Rule:** Customers cannot book on days marked as unavailable by the vendor.
- **Data Source:** Validates against `availability` (recurring days) and `vendor_blackout_dates` (specific dates).
- **Status:** `Built`.

## 3. Promo Engine Rules

**Usage & Validation**
- **Rule:** Promo codes apply specifically to the total cart/booking value.
- **Types:** Percentage, Fixed Amount, Free Delivery, Free Item, BOGO.
- **Validation logic (as coded):** Must meet `min_order_value_cents`. Dates must be between `starts_at` and `ends_at`. A CHECK constraint additionally enforces `ends_at > starts_at` at the database level.
- **Status:** `implemented` - The storefront securely calculates and validates promotions on the server (`public.functions.ts`) using the real `promo_codes` table, and correctly calculates discount logic across percentage, fixed amount, free item, and free delivery types.

## 4. Payment, Revenue & Checkout Rules

**Customer-to-Partner Payment Flow (Restaurants)**
- **Rule:** Customers pay restaurants directly for orders. Speisely takes **0% commission** from these orders.
- **Methods:** Stripe Connect (Direct Charge model), Cash, or PayPal.
- **Checkout Implementation:** `startStorefrontCheckout` creates a real Stripe Checkout Session with `stripeAccount: restaurantStripeUserId`, and crucially, no `application_fee_amount`. Money and processing fees stay entirely between the customer and the restaurant. Cash and PayPal orders are confirmed client-side with no server-side payment verification.
- **Status:** `Built and confirmed working`.

**Partner-to-Speisely Revenue Flow (Restaurants)**
- **Rule:** Restaurants pay Speisely a flat **€34.99/month subscription fee** via Stripe to use the platform.
- **Status:** `implemented` — The subscription enforcement is active. Restaurants with a `canceled` or `unpaid` subscription are explicitly blocked from the public storefront. `active` and `past_due` subscriptions remain visible to allow for Stripe's built-in payment retry schedules without immediate disruption.

**Partner-to-Speisely Revenue Flow (Caterers & Event Planners)**
- **Rule:** Caterers and Planners do not pay a monthly subscription. Instead, Speisely earns a **10% commission** on the final deal/order value.
- **Lead Protection Rule:** To protect this 10% commission, customer contact details (email and phone number) must remain strictly hidden until the deal is commercially secured. The exact condition for the contact reveal is that the `catering_briefs` row `status` must strictly equal `"booked"`. Only at that point will the assigned vendor be able to fetch the contact details via a server-gated request.
- **Status:** `implemented` — The 10% automated deposit collection is wired via a SecureChat injection link. Vendors cannot manually move a deal to "booked". Only a successful Stripe webhook event can trigger the "booked" status, securely unlocking lead contact details.

**Stripe Storage Strategy**
- **Status:** `implemented` - The legacy public `restaurants.stripe_user_id` column has been successfully dropped from the database and the app code strictly reads from `restaurant_stripe_accounts`.

## 5. Notification & Communication Rules

**Email Triggers (Resend)**
- **Rule:** System-critical emails (confirmations, quotes, reset password) use a `sendEmail` helper.
- **Inbox Logic:** Messages between customers and partners are stored in `messages` and `brief_messages` (confirmed overlapping/duplicate tables, not consolidated).
- **Status:** `Partial`.

**Kitchen Display System (KDS) Alerts**
- **Rule:** Real-time order alerts for restaurant kitchen staff.
- **Status:** `Built and confirmed working` — `src/routes/_authenticated/restaurant.kitchen.tsx` subscribes to a Supabase Realtime channel and plays an audio alert (`/speisely_alert.mp3`) on new order events. A prior doc's claim that this was "[PARTIAL]" is stale; in-app audio alerts exist. If push notifications (outside the browser tab) are still desired, that remains a real, separate gap — don't conflate the two.

## 6. Immutable Core Principles

- **Do Not Break Legacy Logic:** When refactoring database columns, use a two-step zero-downtime migration approach. Maintain fallback to old columns during Stage 1, verify data integrity, and only execute the destructive drop in Stage 2.
- **No Re-opening Decisions:** Unified identity vs. strict workspace separation is a finalized decision. Do not attempt to merge operational dashboards.

## Security Rules
1. No financial data, passwords, secrets, payment identifiers, tokens, or unnecessary private personal data may leak through frontend props, API responses, database public tables, logs, query strings, analytics payloads, or error messages.
2. Public storefront queries must return only storefront-safe fields.
3. Financial and payment identifiers must live only in private tables or private server-side paths.
4. Secrets, API keys, tokens, and credentials must never appear in client code or repository files.
5. Passwords must never be stored, logged, echoed, or handled outside the auth provider's secure flow.
6. Customer/vendor contact details must be role-gated and stage-gated.
7. If a table mixes public and private data, treat it as a schema risk and propose a split or secure view/query layer.
8. Never rely on UI hiding alone for privacy.
9. Never rely on chat memory for security rules; document them in permanent docs.
