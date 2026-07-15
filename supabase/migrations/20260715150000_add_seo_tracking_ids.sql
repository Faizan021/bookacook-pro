-- Migration: Add SEO Tracking IDs to restaurants
-- Description: Adds google_analytics_id and meta_pixel_id for Phase 5 Marketplace SEA Tracking

ALTER TABLE public.restaurants 
ADD COLUMN IF NOT EXISTS google_analytics_id text,
ADD COLUMN IF NOT EXISTS meta_pixel_id text;

-- Add a comment to columns for clarity
COMMENT ON COLUMN public.restaurants.google_analytics_id IS 'Google Analytics Measurement ID (e.g. G-XXXXXXX)';
COMMENT ON COLUMN public.restaurants.meta_pixel_id IS 'Meta Pixel ID for tracking conversions';
