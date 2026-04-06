-- Migration 008: Operational fields for packages table
-- Already applied manually via Supabase SQL Editor.
-- Kept here for schema history.

ALTER TABLE public.packages
  ADD COLUMN IF NOT EXISTS max_bookings_per_day  INTEGER,
  ADD COLUMN IF NOT EXISTS cancellation_policy   TEXT,
  ADD COLUMN IF NOT EXISTS setup_time_minutes    INTEGER,
  ADD COLUMN IF NOT EXISTS cleanup_time_minutes  INTEGER;

-- Note: add_ons text[] and booking_notice_days were no-ops
-- (add_ons already exists as JSONB; booking_notice_days already exists from 003).

notify pgrst, 'reload schema';
