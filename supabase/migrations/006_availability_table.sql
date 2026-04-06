-- Migration 006: Caterer availability table
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.availability (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  caterer_id    UUID        NOT NULL REFERENCES public.caterers(id) ON DELETE CASCADE,
  available_date DATE       NOT NULL,
  is_available  BOOLEAN     NOT NULL DEFAULT true,
  note          TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (caterer_id, available_date)
);

ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

-- Caterers can manage their own availability rows
CREATE POLICY "caterers_manage_own_availability"
  ON public.availability FOR ALL
  USING (
    caterer_id IN (
      SELECT id FROM public.caterers WHERE user_id = auth.uid()
    )
  );

-- Authenticated users can read all availability (needed for booking flow)
CREATE POLICY "authenticated_read_availability"
  ON public.availability FOR SELECT
  TO authenticated
  USING (true);
