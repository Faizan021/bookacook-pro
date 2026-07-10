# Speisely Restaurant Payments: Security & Implementation Audit

This audit evaluates the payments architecture, data minimisation, access control, and environment configuration of the Speisely restaurant storefront payments setup.

---

## 1. Executive Summary

### What are we doing right?

- **Data Minimisation (Rule 1 Compliant):** We never touch, process, or store raw card numbers, CVVs, or expiry dates. Subscription checkouts and catering deposit checkouts are handled entirely via Stripe Checkout redirected sessions.
- **Write Access Security:** RLS policies correctly restrict write/update operations on the `restaurants` table to the authenticated owner (`owner_id = auth.uid()`).
- **Stripe Connect Onboarding:** The onboarding flow uses a secure, standard Stripe-hosted Connect OAuth flow with signed, time-limited state tokens to prevent CSRF attacks.

### What is risky?

- **No Real Storefront Stripe Payments:** The Credit Card checkout option for restaurant storefront orders in `restaurant.$slug.tsx` is currently a mockup. When a customer selects Credit Card and clicks "Go to checkout," the app displays a JavaScript `alert("Order placed...")` without creating a Stripe Checkout Session or charging the card.
- **Missing Stripe Credentials on Vercel:** The Vercel project is missing `STRIPE_SECRET_KEY` and `STRIPE_CONNECT_CLIENT_ID` across all environments. Also, `STRIPE_CONNECT_STATE_SECRET` is only set for Production, which will crash Stripe Connect onboarding in the Preview staging environment.
- **Exposed Connected Account IDs:** The RLS SELECT policy on `restaurants` allows anyone (`USING (true)`) to read all columns, exposing `stripe_user_id` (connected Stripe account ID) and `paypal_email` publicly.

### Should I worry about financial leakage right now?

- **No.** There are no credentials, API keys, or raw card details stored in the database or exposed via logs, preventing any credential leak or financial theft.

### Are we correctly implementing the restaurant-owned payments model?

- **No.** While the backend validation gates storefront publishing on having at least one payment method (Cash, PayPal, or Stripe) configured, the checkout logic does not yet implement the Stripe Connect **Direct Charges** model to process card payments on behalf of the connected restaurant. It only mocks card payments.

---

## 2. Rule Compliance Matrix

### Rule 1: Sensitive Payment Data Rule

- **Compliance: YES**
- **Why:** The application code never handles raw card variables or forms. Card entry is fully delegated to Stripe Checkout. Speisely does not store PayPal passwords or merchant credentials.

### Rule 2: Restaurant-Owned Payment Accounts Rule

- **Compliance: NO**
- **Why:** Although the Settings UI and backend gates check for restaurant-owned configuration (Cash, PayPal, or connected Stripe), the storefront checkout does not execute card charges against the restaurant's connected Stripe account.

---

## 3. Data Storage Inventory

We audited where payment-related fields are stored:

| Location                             | Field Name                        | Description                                   | Classification                     |
| :----------------------------------- | :-------------------------------- | :-------------------------------------------- | :--------------------------------- |
| **Supabase (`restaurants` table)**   | `stripe_user_id`                  | Stripe Connected Account ID (e.g. `acct_...`) | Safe (Public, but keep minimized)  |
| **Supabase (`restaurants` table)**   | `stripe_connect_status`           | Status string (`connected`, `not_connected`)  | Safe (Public)                      |
| **Supabase (`restaurants` table)**   | `paypal_email`                    | Restaurant's PayPal.me link or email          | Safe (Public, needed for checkout) |
| **Supabase (`restaurants` table)**   | `accepts_cash` / `accepts_paypal` | Payment availability flags                    | Safe (Public)                      |
| **Supabase (`subscriptions` table)** | `stripe_customer_id`              | Stripe Customer ID for subscriptions          | Safe (Server-side/Owner only)      |
| **Supabase (`subscriptions` table)** | `stripe_subscription_id`          | Stripe Subscription ID for billing            | Safe (Server-side/Owner only)      |
| **Supabase (`payments` table)**      | `stripe_payment_intent_id`        | Stripe Payment ID for catering deposits       | Safe (Server-side/Owner only)      |
| **Vercel Env Variables**             | `STRIPE_SECRET_KEY`               | Stripe Platform Secret Key                    | Sensitive (Server-side only)       |
| **Vercel Env Variables**             | `STRIPE_CONNECT_CLIENT_ID`        | Stripe Connect Client ID                      | Safe (Server-side only)            |
| **Vercel Env Variables**             | `STRIPE_CONNECT_STATE_SECRET`     | Secret to sign state token                    | Sensitive (Server-side only)       |

---

## 4. Raw Card Data Handling Audit

- Checked: Frontend routes (`restaurant.$slug.tsx`, `checkout.deposit.$bookingId.tsx`), API endpoints, and webhooks.
- **Result:** **No raw card data is processed.** Customer card entries are done inside Stripe-hosted iframe/Checkout overlays. No inputs for card number, CVV, or expiry exist in the Speisely codebase, meaning logs, Supabase, and analytics are completely clean.

---

## 5. Stripe Connect Charge Model Audit

- Speisely acts as the merchant of record for **Catering/Event deposits** (the 10% platform service fee is paid directly to Speisely's main Stripe account).
- For **Restaurant storefront orders**, there is no Connect charge logic implemented. To correctly align with the no-commission subscription model:
  1. Payments must be processed as **Direct Charges** on the connected account.
  2. The connected restaurant account will be the merchant of record and bear Stripe processing fees directly.
  3. No `application_fee_amount` should be set on checkout sessions.

---

## 6. PayPal Implementation Audit

- When a customer selects PayPal, they are redirected to:
  `https://paypal.me/[restaurant-paypal-email]/[total-amount]EUR`
- The transaction is entirely direct between the customer and the restaurant. Speisely stores no credentials.
- **Wording:** The UI states: _"After placing your order you'll be redirected to PayPal."_ This is transparent and direct.

---

## 7. Gating & RLS Access Control Audit

- **Publish Gating:** Server-side gating is correctly implemented in `updateMyRestaurantSettings` (restricts publishing if no payment method is set).
- **RLS Policies:**
  - Owners can edit settings securely.
  - Public read (`USING (true)`) allows any client to read all columns. While `stripe_user_id` and `paypal_email` are public destination IDs, it is recommended to tighten SELECT policies so public queries only retrieve flags (`accepts_cash`, `accepts_paypal`, `stripe_connect_status`) and the checkout link (`paypal_email`), while hiding internal Stripe IDs like `stripe_user_id`.

---

## 8. Required Fixes

### Critical Fixes (Release Blocking)

1. **Missing Stripe Keys on Vercel:**
   - **Risk:** Stripe Connect onboarding and webhook verification will crash on staging.
   - **Location:** Vercel Environment Variables.
   - **Fix:** Add `STRIPE_SECRET_KEY` and `STRIPE_CONNECT_CLIENT_ID` to Vercel (Preview & Production) and extend `STRIPE_CONNECT_STATE_SECRET` to Preview.
2. **Missing Real Stripe Checkout for Storefront Orders:**
   - **Risk:** Customers can checkout for free with credit cards; no money is charged, causing financial loss.
   - **Location:** `src/routes/restaurant.$slug.tsx`.
   - **Fix:** Implement Stripe Checkout session creation using Direct Charges model (`stripeAccount: stripe_user_id`) to charge customers on behalf of the connected restaurant.

### Medium Fixes

3. **Exposed stripe_user_id in Public RLS Policy:**
   - **Risk:** Minor data exposure.
   - **Location:** `supabase/migrations/20260614103801_eb429e57-79f4-4e6e-9681-f4732a489c7d.sql`.
   - **Fix:** Restrict the SELECT policy on `restaurants` so it only returns necessary public fields, or move Stripe keys to a private table.

---

## 9. Final Decision

### **"Safe for staging only"**

The code has no raw card leakage risks and uses secure authentication/callbacks. However, **it is not safe for production launch** until the Stripe Connect storefront checkout flow is implemented and Vercel credentials are added.
