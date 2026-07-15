-- Migration: Add SEO metadata columns to restaurants table
-- Phase: 2
-- Scope: Restaurant product only

ALTER TABLE "public"."restaurants"
  ADD COLUMN IF NOT EXISTS "seo_title" text,
  ADD COLUMN IF NOT EXISTS "seo_description" text;

COMMENT ON COLUMN "public"."restaurants"."seo_title" IS 'Custom SEO title override for the restaurant storefront page.';
COMMENT ON COLUMN "public"."restaurants"."seo_description" IS 'Custom SEO meta description override for the restaurant storefront page.';
