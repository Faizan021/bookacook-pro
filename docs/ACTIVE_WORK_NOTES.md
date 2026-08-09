# Active Work Notes

_This document serves as the active working memory for ongoing tasks, context updates, and immediate implementation states. Permanent decisions are moved to core documentation once finalized._

## Current Status (2026-07-05)

**Active Focus:**

- Business Model Strictness & Lead Protection

**Pending Implementation:**

- Reviews System: Real read/write flow for reviews.
- Programmatic GEO pages: Public routes for `seo_content_pages`.

### Recently Completed

- **PayPal exposure hardening = implemented** (PayPal link generation moved to server inside `submitStorefrontOrder`, `paypal_email` removed from public payloads).
  - _Order status gap documented:_ PayPal.me orders currently auto-confirm due to lack of a webhook for capture verification. This is an accepted gap to preserve current payment behavior.
- **Restaurant checkout rebuild = implemented**
- **Promo Code Realization = implemented**
- **KDS storefront visibility fix = implemented**
  - Wired up storefront checkout to real promo codes.
  - Hardened backend checkout with `submitStorefrontOrder` and `restaurant_orders` customer details migration.
  - Implemented KDS and webhook payment method validation for Stripe, Cash, and PayPal.

**Pending Follow-up Hardening:**

- **webhook replay/dedup hardening = partial** (Idempotency currently relies on status updates, but event IDs are not strictly persisted in a dedicated table to prevent replay.)
- **Business Model Strictness (Commissions & Subscriptions):**
  - Blocked manual `"booked"` transitions. Webhooks now exclusively control this state upon deposit capture.
  - Deployed dynamic Stripe checkout session generation for Caterer and Planner proposals, directly injecting deposit links into SecureChat.
  - Restricted public restaurant showcase based on `subscription_status` (`canceled` and `unpaid` are blocked, `active` and `past_due` remain visible to rely on Stripe's retry schedules).
- **Lead Protection:** PII reveal is explicitly tied to the `"booked"` status, fully protecting the 10% commission.
- **Stripe ID Hardening (Stages 1 & 2):** Successfully decoupled application code from `restaurants.stripe_user_id`, ran a verification query, and dropped the column from the database. Types regenerated.

**Recently Verified System Truths (Not yet fully resolved in code):**

- Restaurant storefront promos evaluate against `mockPromoCodes`, not the real `promo_codes` table (Status: `missing`).
- Reviews UI is purely mocked with `const reviews: any[] = [];` (Status: `missing`).
- Programmatic GEO pages do not exist publicly; `seo_content_pages` is admin CRUD only (Status: `missing`).

**Recent Documentation Actions:**

- Paused Stripe Stage 1 implementation to document business rules (Restaurant 0% order commission + €34.99/mo subscription, Caterer/Planner 10% commission + lead protection). Docs updated before code execution.

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

### Active: Permanent Security Rule & Exposure Remediation

- **Follow-up Hardening:** Add manual Stripe state reconciliation sync buttons for vendors to pull lost webhook states. Webhooks are idempotent, but explicit drift reconciliation paths are missing.
