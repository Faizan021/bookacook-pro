-- Migration: Add marketplace opt-in and referral tracking
-- Phase: 3
-- Scope: Restaurant product only

ALTER TABLE "public"."restaurants"
  ADD COLUMN IF NOT EXISTS "show_in_marketplace" boolean DEFAULT false;

ALTER TABLE "public"."restaurant_orders"
  ADD COLUMN IF NOT EXISTS "referral_source" text DEFAULT 'direct';

COMMENT ON COLUMN "public"."restaurants"."show_in_marketplace" IS 'Opt-in flag for restaurants to appear in the Speisely public marketplace discovery directory.';
COMMENT ON COLUMN "public"."restaurant_orders"."referral_source" IS 'Tracks where the order originated. Defaults to direct. Can be marketplace or other future sources.';
