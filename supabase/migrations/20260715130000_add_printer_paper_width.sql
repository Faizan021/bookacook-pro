-- =============================================================================
-- Migration: Add paper_width to restaurant_printers
-- Supports switching receipt rendering widths for standard kitchen printers.
-- =============================================================================

ALTER TABLE public.restaurant_printers
  ADD COLUMN IF NOT EXISTS paper_width integer NOT NULL DEFAULT 80
  CHECK (paper_width IN (58, 80));
