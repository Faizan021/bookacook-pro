-- Migration: Add marketplace discovery
-- Phase: 3
-- Scope: Restaurant product only

ALTER TABLE "public"."restaurants"
  ADD COLUMN IF NOT EXISTS "marketplace_discovery" boolean DEFAULT false;

COMMENT ON COLUMN "public"."restaurants"."marketplace_discovery" IS 'Opt-in flag for restaurants to participate in Speiselys discovery program to reach new customers through marketplace promotion. Marketplace fees may apply.';
