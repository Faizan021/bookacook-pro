-- One-time archive tables for legacy data migration
-- These tables serve as a rollback-safe backup before any legacy data is dropped.
-- Do NOT drop these tables until you have fully verified the migration and approved
-- the 20260706000000_drop_legacy_tables.sql migration.

-- Archive: event_requests
CREATE TABLE IF NOT EXISTS public._archive_event_requests AS
  SELECT * FROM public.event_requests LIMIT 0;
ALTER TABLE public._archive_event_requests
  ADD COLUMN IF NOT EXISTS _archived_at timestamptz DEFAULT now();

-- Archive: event_request_matches
CREATE TABLE IF NOT EXISTS public._archive_event_request_matches AS
  SELECT * FROM public.event_request_matches LIMIT 0;
ALTER TABLE public._archive_event_request_matches
  ADD COLUMN IF NOT EXISTS _archived_at timestamptz DEFAULT now();

-- Archive: orders
CREATE TABLE IF NOT EXISTS public._archive_orders AS
  SELECT * FROM public.orders LIMIT 0;
ALTER TABLE public._archive_orders
  ADD COLUMN IF NOT EXISTS _archived_at timestamptz DEFAULT now();

-- Archive: order_items
CREATE TABLE IF NOT EXISTS public._archive_order_items AS
  SELECT * FROM public.order_items LIMIT 0;
ALTER TABLE public._archive_order_items
  ADD COLUMN IF NOT EXISTS _archived_at timestamptz DEFAULT now();

-- Archive: packages
CREATE TABLE IF NOT EXISTS public._archive_packages AS
  SELECT * FROM public.packages LIMIT 0;
ALTER TABLE public._archive_packages
  ADD COLUMN IF NOT EXISTS _archived_at timestamptz DEFAULT now();

-- Archive: availability
CREATE TABLE IF NOT EXISTS public._archive_availability AS
  SELECT * FROM public.availability LIMIT 0;
ALTER TABLE public._archive_availability
  ADD COLUMN IF NOT EXISTS _archived_at timestamptz DEFAULT now();

-- Disable RLS on archive tables (they are internal admin tables, not user-facing)
ALTER TABLE public._archive_event_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public._archive_event_request_matches DISABLE ROW LEVEL SECURITY;
ALTER TABLE public._archive_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public._archive_order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public._archive_packages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public._archive_availability DISABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public._archive_event_requests IS 'Archive backup of event_requests before legacy migration. Do not drop until migration is verified.';
COMMENT ON TABLE public._archive_event_request_matches IS 'Archive backup of event_request_matches before legacy migration.';
COMMENT ON TABLE public._archive_orders IS 'Archive backup of orders before legacy migration.';
COMMENT ON TABLE public._archive_order_items IS 'Archive backup of order_items before legacy migration.';
COMMENT ON TABLE public._archive_packages IS 'Archive backup of packages before legacy migration.';
COMMENT ON TABLE public._archive_availability IS 'Archive backup of availability before legacy migration.';
