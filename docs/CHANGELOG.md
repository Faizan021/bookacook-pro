# Changelog

All notable changes to this project will be documented in this file.

## [2026-07-05] - Project State Freeze
- **Reviews System:** Phase 1-4 fully implemented (Schema, Intake Form, Storefront Display, Vendor Dashboard Moderation).
- **Stripe Connect:** Legacy `stripe_user_id` dropped from `restaurants` table; RLS exposure risk closed.
- **Promo Codes:** Acknowledged gap in `src/routes/restaurant.$slug.tsx` where mock promo logic is used instead of the `promo_codes` table.
- **Documentation:** `CONFIRMED_VS_ASSUMED.md` frozen at commit `43816052a00ff5bce9d794c2cd96b37a6e3361cd` as the single source of truth for implementation states.
