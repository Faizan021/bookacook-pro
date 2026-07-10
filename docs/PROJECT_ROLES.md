# Speisely Project Roles & Permissions

_Last verified against code, commit `4381605`, 2026-07-05._

This document maps the real, current state of the codebase for the 5 primary user roles in the Speisely platform.

## 1. Admin

**Role Purpose:** Superuser role for managing platform-wide settings, user roles, moderation, and SEO content.

**Account Type / Login / Onboarding Flow:**

- Logs in via standard Supabase auth.
- Must have the `admin` role assigned manually in `user_roles`. Confirmed in `role-middleware.ts`: `admin` is explicitly excluded from `SELF_HEALABLE_ROLES` — it will never be granted from `user_metadata` automatically.

**Dashboard / Workspace Structure:**

- Centralized control panel with tabs for Users, Restaurants, Caterers, Planners, and SEO Content.

**Pages & Routes:** `/admin`

**Actions (confirmed in `src/lib/admin/mutations.functions.ts`):**

- Force-toggle `is_published` on restaurants and `status` on caterers' `storefront_settings` row.
- Manage `seo_content_pages` (draft → in_review → approved → published → rejected → archived workflow).
- **Not confirmed:** platform-wide statistics dashboard, dispute resolution, payout approvals.

**Notifications:** No system-wide alert-on-new-registration logic found in code.

**Permissions & Restrictions:** Full read/write access to admin tables. **Important clarification:** admin's publish-toggle capability is an _override_, not a _gate_ — restaurants and caterers can self-publish by default; admin has no built-in pre-publish approval step. Do not assume moderation-before-launch exists.

**Related Database Tables:** `user_roles`, `seo_content_pages`, `german_locations`, `storefront_settings` (caterer publish status specifically).

**Status & Gaps:**

- **Status:** `Partial`
- **Gaps/Risks:** No pre-publish moderation gate exists — this is confirmed, not assumed. If required, it needs a new default state (`pending_review`) and a decision to implement it, not just documentation.

---

## 2. Customer

**Role Purpose:** End-user who browses the storefront, orders food, books tables, and requests event services.

**Account Type / Login / Onboarding Flow:**

- Standard email/password or magic link auth.
- Defaults to `customer` role if no other role is assigned (self-healable, confirmed in `role-middleware.ts`).

**Dashboard / Workspace Structure:** `/_authenticated/customer`

**Booking / Ordering / Inquiry Flows (re-verified):**

- **Restaurant:** Instant order checkout is a real Stripe Checkout Session (Direct Charge) for card, or a client-side-only confirmation for Cash/PayPal. Table reservation form is DB-trigger-and-Zod-validated against past dates and capacity.
- **Caterer:** Two-step quote request → accept quote → pay deposit → final payment.
- **Planner:** Lead capture form (`planner_requests` table — previously undocumented, confirmed used) → messaging → booking.

**Promo / Offer / Coupon Logic:** Schema and admin-side logic exist in `promo_codes`, but at the restaurant storefront specifically, applied promos are evaluated against a hardcoded mock object, not this table — confirmed in `restaurant.$slug.tsx`.

**Date Validation Rules:** Cannot book past dates (triple-layer enforcement — DB trigger, Zod, UI).

**Related Database Tables:** `profiles`, `restaurant_orders`, `table_reservations`, `catering_bookings`, `event_bookings`, `planner_requests`, `saved_caterers`, `payments`.

**Status & Gaps:**

- **Status:** `Built` (mostly functional), with the promo-mock caveat above.
- **Gaps/Risks:** Reviews cannot actually be left or seen anywhere in the storefront UI (hardcoded empty mock array) — this affects customer trust signals, not just partner-side reporting.

---

## 3. Caterer

**Role Purpose:** Provides food catering services for events, either daily (B2B) or one-off events.

**Account Type / Login / Onboarding Flow:**

- Registers as a partner. Self-healing assigns `caterer` metadata role, which middleware upgrades to `caterer` + unified `partner` role.
- Connects Stripe for payouts.

**Dashboard / Workspace Structure:** `/_authenticated/caterer` — Inquiries, Bookings, Menu, Calendar, Settings.

**Data Stored:** Business details, menu items, dietary tags, service radius, minimum order values. **Publish status specifically lives in `storefront_settings`, not on the `caterers` row** — previously undocumented, confirmed by code.

**Revenue & Inquiry Flows:**

- **Revenue Model:** No monthly subscription. Speisely takes a 10% commission upon booking.
- **Lead Protection:** Full customer contact details must remain hidden until the deal is secured (deposit paid).
- **Flow:** `catering_bookings` moves pending → quote_sent → deposit_paid → completed.

**Related Database Tables:** `caterers`, `storefront_settings`, `caterer_menu_items`, `catering_bookings`, `availability`, `vendor_blackout_dates`, `promo_codes`, `messages`.

**Status & Gaps:**

- **Status:** `Built` (for basic flow)
- **Gaps/Risks:** Lead protection is `missing` (dashboards reveal phone/email early). 10% automated collection logic is `missing`. Complex calendar logic needs robust UI testing.

---

## 4. Restaurant

**Role Purpose:** Local dining establishments offering table reservations and instant food ordering (takeaway/delivery).

**Account Type / Login / Onboarding Flow:**

- Registers as a partner. Assigned `restaurant_owner` + unified `partner` role.
- Must configure a payment method (Cash, PayPal, or connected Stripe) before publishing — confirmed enforced server-side in `mutations.functions.ts`.

**Dashboard / Workspace Structure:**

- `/_authenticated/restaurant` — Settings, Menu Builder, Promo Codes, Reservations.
- `/_authenticated/restaurant.kitchen` — Live Kitchen Display System (KDS).

**Revenue & Ordering Flows:**

- **Revenue Model:** 0% commission on orders. The restaurant pays a €34.99/mo subscription to Speisely (Status: `partial` — DB exists, but strict UI enforcement is incomplete).
- **Reservations:** Auto-confirmed if under capacity limit.
- **Orders (card):** Real Stripe Checkout Session via Direct Charge, redirect to Stripe-hosted page. Customer pays restaurant directly.
- **Orders (cash/PayPal):** Client-side confirmation only, no server verification. Customer pays restaurant directly.

**Promo / Offer Logic:** Extensive types exist in schema (`promo_codes`) and the restaurant's own dashboard, but real-checkout evaluation is currently mocked — see `SHARED_RULES.md` §3. A restaurant creating a promo code today will not see it apply to real customer orders.

**Notifications:** **Real-time KDS audio alerts ARE implemented** — `restaurant.kitchen.tsx` subscribes to a Supabase Realtime channel and plays `/speisely_alert.mp3` on new orders. A prior version of this doc marking this "[PARTIAL]" is stale. If push notifications outside the browser tab are still wanted, that is a separate, real gap — don't conflate with the in-tab audio alert, which works.

**Related Database Tables:** `restaurants`, `restaurant_stripe_accounts` (private, current source of truth for Stripe IDs — legacy public column still exists as fallback, see `DATA_MAP.md`), `restaurant_products`, `product_categories`, `restaurant_orders`, `order_items`, `table_reservations`.

**Status & Gaps:**

- **Status:** `Built`
- **Gaps/Risks:** Custom domain SSL/DNS provisioning is entirely external (Vercel Domains API), confirmed zero related code in `src/`. Promo mock and reviews mock (see above) are real functional gaps, not documentation issues.

---

## 5. Event Manager (Planner)

**Role Purpose:** Professionals who plan and coordinate events (weddings, corporate parties).

**Account Type / Login / Onboarding Flow:** Registers as partner. Assigned `planner` + unified `partner` role.

**Dashboard / Workspace Structure:** `/_authenticated/dashboard/planner` — Kanban-style lead tracking, Services manager, Calendar, Settings.

**Revenue & Inquiry Flows:**

- **Revenue Model:** No monthly subscription. Speisely takes a 10% commission upon booking.
- **Lead Protection:** Full customer contact details must remain hidden until the deal is secured.
- **Flow:** Customer submits inquiry via `planner_requests` → Planner receives lead → chats with customer → manual contract/booking.

**Promo / Offer Logic:** Planners typically use custom quotes, not coupon codes — not contradicted by code, carried forward as-is.

**Related Database Tables:** `planners`, `planner_services`, `planner_requests`, `event_bookings`. Note: `event_requests` and `event_request_matches` exist in schema but have zero code references — treat as legacy, not part of the active planner flow (see `DATA_MAP.md`).

**Status & Gaps:**

- **Status:** `Partial`
- **Gaps/Risks:** Lead protection is `missing` (dashboards reveal contact info). 10% automated collection logic is `missing`. Formal quoting/payment flow for Planners remains weak compared to Caterers.

---

## Permissions Matrix & Key Routes

| Role          | Auth Role String              | Dashboard Route                     | Key Owned Tables                                                                        | Self-Healable?                      |
| ------------- | ----------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------- |
| Admin         | `admin`                       | `/admin`                            | `seo_content_pages`                                                                     | **No — confirmed excluded in code** |
| Customer      | `customer`                    | `/_authenticated/customer`          | `profiles`, `table_reservations`, `planner_requests`                                    | Yes                                 |
| Caterer       | `caterer`, `partner`          | `/_authenticated/caterer`           | `caterers`, `storefront_settings`, `caterer_menu_items`, `catering_bookings`            | Yes                                 |
| Restaurant    | `restaurant_owner`, `partner` | `/_authenticated/restaurant`        | `restaurants`, `restaurant_stripe_accounts`, `restaurant_products`, `restaurant_orders` | Yes                                 |
| Event Manager | `planner`, `partner`          | `/_authenticated/dashboard/planner` | `planners`, `planner_services`, `planner_requests`, `event_bookings`                    | Yes                                 |

_Note: The unified `partner` role is injected by middleware for any user possessing `caterer`, `restaurant_owner`, or `planner`. Confirmed exactly as described in `role-middleware.ts`._

**What changed from the previous version of this doc:** KDS real-time sound alerts are confirmed implemented (previously marked partial/missing). `storefront_settings` and `planner_requests` added as active, previously-undocumented tables. Admin's publish-toggle is clarified as an override, not a pre-publish gate.
