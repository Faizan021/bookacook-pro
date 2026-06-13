# Speisely Repo Change Review

Source inspected:

- Live site: https://www.speisely.de/
- Archive: `F:\CRM folder\2026\website\bookacook-pro-main (3).zip`
- Extracted review copy: `repo-review/bookacook-pro-main`

## Branch Check

The zip archive is not a git repository. It contains `.gitignore`, but no `.git` directory, no refs, and no branch metadata.

Result:

- `git status --short --branch` fails: not a git repository.
- `git branch -a` fails: not a git repository.
- Branch comparison is not possible from this zip.

To check all branches, use the GitHub repo URL or provide a cloned folder that includes `.git`.

## Current Product State

The repo is a Next.js 16 app using:

- Supabase auth and database.
- Caterer signup and admin approval.
- Customer request intake.
- Caterer dashboards.
- Package management.
- Availability management.
- Payment dashboard UI.
- Basic AI-like event parsing using local regex/rules.
- Package copy assistance through OpenAI if `OPENAI_API_KEY` exists.

The live site already communicates Speisely as an AI-powered catering marketplace, but it does not yet fully communicate the new hybrid business model:

- Free website for caterers.
- 10% commission on direct website orders.
- 10% commission on large AI-matched catering events.
- Booking and payment infrastructure as a core promise.

## Most Important Changes Needed

### 1. Fix Verification Status Mismatch

There is a critical inconsistency.

Migration `002_verification_payout.sql` allows:

- `pending`
- `under_review`
- `verified`
- `rejected`
- `suspended`

But `app/admin/caterers/page.tsx` writes:

- `approved`

And `lib/dashboard/event-request-matching.ts` filters:

- `verification_status = "approved"`

This can break admin approval and AI matching.

Recommended fix:

- Use `verified` everywhere.
- Update admin verify action to write `verification_status: "verified"`.
- Update matching query to filter `.eq("verification_status", "verified")`.
- Update labels that mention `approved`.

Priority: urgent.

### 2. Replace Demo Marketplace With Real Caterer Data

`app/caterers/page.tsx` currently uses a hardcoded local `caterers` array. This means the public marketplace does not show real onboarded caterers.

Recommended fix:

- Convert `/caterers` to load real Supabase caterers.
- Filter by active and verified caterers.
- Join or separately fetch active packages.
- Link cards to real public profiles.

Priority: urgent.

### 3. Add Slug-Based Free Caterer Websites

`app/caterers/[id]/page.tsx` already loads real caterer profiles by UUID. For the free website model, UUID URLs are not good enough.

Recommended fix:

- Add `slug` or `website_slug` to `caterers`.
- Create public URLs like `/catering/[slug]` or `/caterers/[slug]`.
- Keep UUID route as fallback or admin/internal route.
- Generate slug during caterer signup.
- Add uniqueness constraint and index.

Priority: high.

### 4. Build Direct Storefront Order Flow

Migration `011_storefront_checkout_rls_fix.sql` references `orders` and `order_items` with `source = 'direct_storefront'`, but the repo does not show the actual customer-facing direct checkout/order UI.

Recommended fix:

- Add package detail/order page.
- Allow customer to select package, date, guest count, add-ons, contact details.
- Create `orders` and `order_items`.
- Mark source as `direct_storefront`.
- Calculate gross, commission, and net payout.

Priority: high.

### 5. Connect Real Payment Provider

Payment dashboards exist, and 10% commission is described in the UI, but there is no obvious Stripe/checkout integration in `package.json` or app routes.

Recommended fix:

- Add Stripe or chosen payment provider.
- Create checkout session for direct storefront orders.
- Create payment records after successful payment webhook.
- Store:
  - `gross_amount`
  - `commission_amount`
  - `net_payout`
  - `held_amount`
  - `payout_status`
  - `booking_source`

Priority: high.

### 6. Separate Small Orders and Big Event Requests

The business model has two revenue channels, but the product currently blurs them.

Recommended fix:

- Small order path: browse caterer -> choose package -> book/pay.
- Big event path: AI event request -> matched caterers -> offer/booking/payment.
- Add clear source values:
  - `direct_storefront`
  - `ai_marketplace`

Priority: high.

### 7. Upgrade AI Event Understanding

Current customer request parsing is mostly regex/rules in `lib/dashboard/event-requests.ts`. That is useful for MVP, but not truly AI-powered matching.

Recommended fix:

- Add `/api/ai/understand-event`.
- Use structured JSON output from an AI model.
- Extract:
  - event type
  - guest count
  - city/postal code
  - date
  - budget
  - service style
  - cuisines
  - dietary needs
  - required extras
  - urgency/confidence
- Save extracted data to `event_requests`.

Priority: medium-high.

### 8. Improve Matching Scoring

`lib/dashboard/event-request-matching.ts` already has a good start, but it depends on inconsistent package/status fields and the `approved` bug.

Recommended fix:

- Fix `verified` status.
- Normalize package status rules around `status = 'active'`.
- Score service area more strongly.
- Add availability/date scoring.
- Add response time and completed booking history later.
- Normalize score to 0-100 before displaying as percentage.

Priority: medium-high.

### 9. Add Caterer Website Management

Caterers can manage packages and availability, but there is no obvious free website editor.

Recommended fix:

- Add `/caterer/website`.
- Allow caterers to edit:
  - slug
  - public description
  - hero image
  - gallery
  - service areas
  - cuisine types
  - minimum and maximum guests
  - SEO title/description
- Show preview link.

Priority: medium.

### 10. Add Analytics for Caterer Websites

The model depends on showing caterers that the free website creates value.

Recommended fix:

- Track profile views.
- Track package views.
- Track booking clicks.
- Track completed direct orders.
- Show dashboard cards:
  - website views
  - direct orders
  - marketplace leads
  - conversion rate
  - revenue by source

Priority: medium.

## Messaging Changes Needed On Live Site

The homepage currently says payments are later:

`Später: sichere Buchung und Plattform-Zahlung`

For the new business model, change messaging to:

- Free websites for caterers.
- Secure booking and payment through Speisely.
- 10% commission only when a paid booking happens.
- AI matching for large events.

Recommended homepage sections:

- For customers: describe event, compare caterers, book securely.
- For caterers: free website, direct orders, AI event leads, 10% commission.
- Two paths: direct order vs large event matching.

## Suggested Implementation Order

1. Fix verification status mismatch.
2. Make `/caterers` use real Supabase data.
3. Add slug-based public caterer websites.
4. Add direct package/order request flow.
5. Add payment provider checkout and webhook.
6. Add booking source and commission tracking everywhere.
7. Improve AI event parsing endpoint.
8. Improve matching scores and date availability.
9. Add caterer website editor.
10. Add analytics dashboard.

## Bottom Line

The repo is closer than it looks. You already have the foundation:

- Auth.
- Caterer onboarding.
- Admin approval.
- Package management.
- Availability.
- Request intake.
- Matching logic.
- Payment dashboard concept.

The biggest missing product pieces are:

- Real marketplace data instead of demo cards.
- Public free websites with slugs.
- Real direct ordering/checkout.
- Real payment processing.
- Clear source tracking for direct website orders vs AI marketplace bookings.
- Fixing the verification status bug.

