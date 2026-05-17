# Speisely GitHub Branch Review

Repository checked:

- `https://github.com/Faizan021/bookacook-pro.git`

Remote branches found:

- `main`
- `feature/storefront-mvp`
- `app/api/unsplash-image/route.ts`
- `components/request`
- `env.local`

## Branch Summary

### `main`

This is the current default branch.

Important current state:

- Has request intake and AI-style parsing.
- Has caterer signup, admin approval, dashboards, packages, availability, and payment dashboard UI.
- Has `supabase/migrations/011_storefront_checkout_rls_fix.sql`.
- Does not yet have the full storefront implementation from `feature/storefront-mvp`.

### `feature/storefront-mvp`

This is the most important branch for your new model.

It adds:

- `app/r/[slug]/page.tsx`
- `app/r/[slug]/StorefrontClient.tsx`
- `lib/storefront/actions.ts`
- `lib/storefront/queries.ts`
- `lib/storefront/types.ts`
- `supabase/migrations/010_storefront_orders_catering.sql`
- `SPEISELY_STOREFRONT_MVP.md`

What it supports:

- Free public storefronts at `/r/[slug]`.
- Storefront settings.
- Product categories.
- Products.
- Direct storefront orders.
- Order items.
- Catering briefs.
- Catering matches.
- Quotes and quote items.
- Source tracking for `direct_storefront`, `storefront_catering`, and `speisely_marketplace`.

Important problems:

- It deletes `supabase/migrations/011_storefront_checkout_rls_fix.sql` because the branch is behind `main`. Keep migration 011 when merging.
- `lib/storefront/actions.ts` uses `platformFeeRate = 3`, but your business model needs 10%.
- `app/caterer/orders/page.tsx` appears to contain a generic caterer marketing page, not an actual orders dashboard.
- No Stripe/payment processing yet.
- No caterer storefront editor yet.
- No analytics yet.
- Storefront path is `/r/[slug]`; for the catering-only brand, `/catering/[slug]` or `/caterers/[slug]` may be better.

Recommendation:

- Rebase or merge `feature/storefront-mvp` into `main`, but do not deploy it blindly.
- Keep migration `011`.
- Change the direct order platform fee from 3% to 10%.
- Fix `app/caterer/orders/page.tsx`.
- Add payment provider integration before calling it “booking + payment” publicly.

### `app/api/unsplash-image/route.ts`

This branch has broad unrelated UI changes, not just the Unsplash route.

It modifies or deletes many important files:

- Request pages.
- Header component.
- Admin login pages.
- Caterer pages.
- Dashboard components.
- Translations.

Recommendation:

- Do not merge as a branch.
- Cherry-pick only a specific commit/file if you know exactly what you want from it.

### `components/request`

This branch is a large UI/restructure branch.

It:

- Deletes many current app pages and assets.
- Adds `/app/demo/...` routes.
- Changes package files, dashboard files, request flow files, layout, package dependencies, and config.

Recommendation:

- Do not merge into production.
- Treat as experimental/demo work.
- Cherry-pick only known-good components after review.

### `env.local`

This branch contains one commit named `Update page.tsx`.

It does not appear to be a real environment branch despite the name.

Recommendation:

- Rename or delete this branch to avoid confusion.
- Do not use branch names like `env.local`; it looks like secrets/config and creates operational confusion.

## Priority Changes For Current Repo

### 1. Merge Storefront Foundation Carefully

Use `feature/storefront-mvp` as the base for the free website/direct order feature.

Bring over:

- `app/r/[slug]`
- `lib/storefront`
- `supabase/migrations/010_storefront_orders_catering.sql`
- `SPEISELY_STOREFRONT_MVP.md`

But keep:

- `supabase/migrations/011_storefront_checkout_rls_fix.sql`

### 2. Change Commission From 3% To 10%

In `feature/storefront-mvp`, `lib/storefront/actions.ts` has:

```ts
const platformFeeRate = 3;
```

Change to:

```ts
const platformFeeRate = 10;
```

Also rename fields or UI text from generic “platform fee” to match your actual commission model.

### 3. Fix Verification Status

Current mismatch:

- Migration allows `verified`.
- Some app code uses `approved`.

Use `verified` consistently.

Affected areas:

- Admin caterer approval.
- Public marketplace filtering.
- AI matching filtering.
- Dashboard labels.

### 4. Replace Hardcoded Marketplace

`app/caterers/page.tsx` on `main` uses demo caterer cards.

Change it to query real Supabase caterers:

- `is_active = true`
- `verification_status = verified`
- storefront/profile enabled

### 5. Decide URL Strategy

Current branch uses:

- `/r/[slug]`

For a catering-specific platform, better options:

- `/catering/[slug]`
- `/caterers/[slug]`

Recommendation:

- Use `/catering/[slug]` for free caterer websites.
- Keep `/r/[slug]` as a redirect if already shared.

### 6. Add Real Payments

The storefront branch creates unpaid orders only.

Needed:

- Stripe checkout route.
- Stripe webhook.
- Payment record creation.
- Commission calculation.
- Payout status tracking.
- Order status update after payment.

### 7. Build Caterer Website Editor

Needed route:

- `/caterer/website`

Fields:

- slug
- display name
- headline
- description
- hero image
- logo
- pickup/delivery/direct order settings
- catering CTA toggle
- minimum order amount
- opening hours

### 8. Fix `app/caterer/orders/page.tsx`

In `feature/storefront-mvp`, this file does not look like an orders page.

It should:

- Load authenticated caterer.
- Query `orders`.
- Show customer, items, total, status, requested time.
- Allow status changes: pending, confirmed, preparing, ready, completed, cancelled.

### 9. Add Analytics

For the free website pitch, caterers need proof.

Track:

- storefront views
- product views
- add-to-cart events
- order submissions
- direct order revenue
- AI marketplace leads

### 10. Update Live Messaging

Current live homepage should be updated to match the business model:

- Free catering website.
- Direct customer bookings.
- Secure payments through Speisely.
- 10% commission.
- AI matching for large catering events.

## Recommended Branch Plan

1. Create a new branch from `main`:

```bash
git checkout main
git pull
git checkout -b feature/catering-platform-mvp
```

2. Merge or cherry-pick the useful storefront branch:

```bash
git merge origin/feature/storefront-mvp
```

3. Resolve conflicts by keeping both migrations:

- Keep `010_storefront_orders_catering.sql`.
- Keep `011_storefront_checkout_rls_fix.sql`.

4. Immediately fix:

- 3% -> 10%.
- `approved` -> `verified`.
- broken `app/caterer/orders/page.tsx`.

5. Then implement:

- Real marketplace data.
- Payment checkout.
- Caterer website editor.
- Analytics.

## Bottom Line

The repo already contains most of the bones. The best next move is not to start over.

Use `feature/storefront-mvp` as the foundation for the free caterer website/direct order model, but merge it carefully into `main` and fix the business-critical issues before deployment:

- 10% commission.
- Verified status consistency.
- Real data marketplace.
- Real payment flow.
- Working caterer orders page.

