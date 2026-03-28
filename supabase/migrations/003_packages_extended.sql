-- Migration 003: Extended packages table for the shared content model
-- Run in Supabase SQL Editor after 001 and 002.
--
-- The packages table is the single source of truth used by:
--   - Caterer Dashboard (create / manage packages)
--   - Public Website (listing & booking pages — coming later)

-- Create packages table if it doesn't exist yet
CREATE TABLE IF NOT EXISTS public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caterer_id UUID REFERENCES public.caterers(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Core fields ───────────────────────────────────────────────────────────────
ALTER TABLE public.packages
  ADD COLUMN IF NOT EXISTS title           TEXT,
  ADD COLUMN IF NOT EXISTS summary         TEXT,
  ADD COLUMN IF NOT EXISTS description     TEXT,
  ADD COLUMN IF NOT EXISTS category        TEXT,
  ADD COLUMN IF NOT EXISTS cuisine_type    TEXT,
  ADD COLUMN IF NOT EXISTS status          TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'active', 'paused'));

-- ─── Pricing & capacity ────────────────────────────────────────────────────────
ALTER TABLE public.packages
  ADD COLUMN IF NOT EXISTS price_amount        NUMERIC(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS min_guests          INTEGER       NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS max_guests          INTEGER       NOT NULL DEFAULT 100;

-- ─── Categorisation (JSONB arrays) ────────────────────────────────────────────
ALTER TABLE public.packages
  ADD COLUMN IF NOT EXISTS event_types      JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS dietary_options  JSONB NOT NULL DEFAULT '[]';

-- ─── Inclusions ────────────────────────────────────────────────────────────────
-- included_items: ["Served bread", "Unlimited drinks", ...]
-- add_ons:        [{"name": "Live station", "price": 5.00}, ...]
ALTER TABLE public.packages
  ADD COLUMN IF NOT EXISTS included_items  JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS add_ons         JSONB NOT NULL DEFAULT '[]';

-- ─── Logistics ────────────────────────────────────────────────────────────────
ALTER TABLE public.packages
  ADD COLUMN IF NOT EXISTS service_area         TEXT,
  ADD COLUMN IF NOT EXISTS setup_time_hours     NUMERIC(4,1) DEFAULT 2,
  ADD COLUMN IF NOT EXISTS booking_notice_days  INTEGER      DEFAULT 3;

-- ─── Media ────────────────────────────────────────────────────────────────────
-- images: [{"url": "...", "alt": "...", "order": 0}, ...]
ALTER TABLE public.packages
  ADD COLUMN IF NOT EXISTS images           JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS cover_image_url  TEXT;

-- ─── Discovery / SEO ──────────────────────────────────────────────────────────
ALTER TABLE public.packages
  ADD COLUMN IF NOT EXISTS tags      JSONB   NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS featured  BOOLEAN NOT NULL DEFAULT false;

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_packages_caterer_id  ON public.packages (caterer_id);
CREATE INDEX IF NOT EXISTS idx_packages_status      ON public.packages (status);
CREATE INDEX IF NOT EXISTS idx_packages_featured    ON public.packages (featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_packages_category    ON public.packages (category);

-- ─── Auto-update updated_at ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_packages_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_packages_updated_at ON public.packages;
CREATE TRIGGER trg_packages_updated_at
  BEFORE UPDATE ON public.packages
  FOR EACH ROW EXECUTE FUNCTION update_packages_updated_at();

-- ─── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- Caterers can CRUD their own packages
CREATE POLICY IF NOT EXISTS "Caterers manage own packages"
  ON public.packages
  FOR ALL
  USING (
    caterer_id IN (
      SELECT id FROM public.caterers WHERE user_id = auth.uid()
    )
  );

-- Anyone can read active packages (for public website)
CREATE POLICY IF NOT EXISTS "Public read active packages"
  ON public.packages
  FOR SELECT
  USING (status = 'active');

-- Admins can read all packages
CREATE POLICY IF NOT EXISTS "Admins read all packages"
  ON public.packages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
