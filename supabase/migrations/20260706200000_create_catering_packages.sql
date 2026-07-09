-- Migration: create catering_packages table
-- Purpose: Dedicated table for service-level catering packages (distinct from
--          caterer_menu_items which are individual dishes/items).
--          A catering_package represents a full event catering offering
--          with guest minimums, pricing models, setup logistics, and policies.
--
-- This migration is a prerequisite for migrating the legacy packages table.

CREATE TABLE IF NOT EXISTS public.catering_packages (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caterer_id            uuid NOT NULL REFERENCES public.caterers(id) ON DELETE CASCADE,

  -- Identity
  title                 text NOT NULL,
  summary               text,
  short_summary         text,
  description           text,

  -- Pricing (service-level, not per-item)
  price_type            text NOT NULL DEFAULT 'per_person'
                          CHECK (price_type IN ('per_person', 'flat_rate', 'per_hour', 'custom')),
  price_amount          numeric(10,2) NOT NULL DEFAULT 0,
  currency              text NOT NULL DEFAULT 'EUR',

  -- Guest capacity
  min_guests            int,
  max_guests            int,

  -- Event classification
  event_type            text,
  event_types           text[],
  cuisine_type          text,
  category              text,           -- e.g. Buffet, Plated, Canapes

  -- Logistics
  setup_time_hours      numeric(5,2),
  cleanup_time_minutes  int,
  booking_notice_days   int DEFAULT 1,
  max_bookings_per_day  int,
  deposit_percentage    numeric(5,2),
  duration_hours        numeric(5,2),

  -- Service attributes
  dietary_options       text[],
  service_area          text[],
  includes              text[],
  add_ons               text[],
  included_items        text[],
  tags                  text[],
  keywords              text[],

  -- Media
  image_url             text,
  cover_image_url       text,
  images                text[],
  gallery_images        text[],

  -- Policies
  cancellation_policy   text,

  -- Publishing & status
  status                text NOT NULL DEFAULT 'draft'
                          CHECK (status IN ('draft', 'active', 'archived', 'paused')),
  is_active             boolean NOT NULL DEFAULT true,
  is_published          boolean NOT NULL DEFAULT false,
  featured              boolean NOT NULL DEFAULT false,

  -- Location
  location              text,

  -- Timestamps
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- Index for caterer lookups
CREATE INDEX IF NOT EXISTS catering_packages_caterer_id_idx
  ON public.catering_packages(caterer_id);

-- Index for published + active packages (storefront queries)
CREATE INDEX IF NOT EXISTS catering_packages_published_idx
  ON public.catering_packages(caterer_id, is_published, is_active)
  WHERE is_published = true AND is_active = true;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_catering_packages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER catering_packages_updated_at
  BEFORE UPDATE ON public.catering_packages
  FOR EACH ROW EXECUTE FUNCTION public.update_catering_packages_updated_at();

-- RLS: caterers manage their own packages; public can read published ones
ALTER TABLE public.catering_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Caterers can manage their own packages"
  ON public.catering_packages
  FOR ALL
  USING (
    caterer_id IN (
      SELECT id FROM public.caterers WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Public can view published packages"
  ON public.catering_packages
  FOR SELECT
  USING (is_published = true AND is_active = true);

COMMENT ON TABLE public.catering_packages IS
  'Full-service catering packages offered by caterers. Represents event-level '
  'service offerings (e.g. Wedding Buffet for 30-500 guests at 40 EUR/person). '
  'Distinct from caterer_menu_items which are individual food items.';
