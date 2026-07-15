-- =============================================================================
-- Migration: Kitchen Print Queue — Phase 1 Auto Printing
-- Scope: Restaurant product ONLY.
-- These tables must NEVER reference catering_bookings or event_bookings.
-- Print failure must NEVER block or reverse a confirmed restaurant order.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Add order_source to restaurant_orders
--    Supports: 'storefront' (current), 'voice' (Speisely AI, future), 'pos' (future)
--    Default is 'storefront' so all existing orders are correctly classified.
-- ---------------------------------------------------------------------------
ALTER TABLE public.restaurant_orders
  ADD COLUMN IF NOT EXISTS order_source text NOT NULL DEFAULT 'storefront'
  CHECK (order_source IN ('storefront', 'voice', 'pos'));

-- ---------------------------------------------------------------------------
-- 2. restaurant_printers
--    One row per physical printer device, linked to a restaurant.
--    poll_interval_seconds is used by the watchdog to compute offline threshold
--    dynamically (6 × poll_interval_seconds), rather than a hard-coded value.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.restaurant_printers (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id         uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  mac_address           text NOT NULL UNIQUE,
  poll_interval_seconds int  NOT NULL DEFAULT 5 CHECK (poll_interval_seconds BETWEEN 1 AND 7200),
  last_heartbeat_at     timestamptz,
  status                text NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline')),
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  -- One printer record per restaurant (can relax to multi-printer later)
  CONSTRAINT restaurant_printers_restaurant_unique UNIQUE (restaurant_id)
);

CREATE INDEX IF NOT EXISTS idx_restaurant_printers_restaurant_id
  ON public.restaurant_printers (restaurant_id);

-- Auto-touch updated_at
CREATE TRIGGER restaurant_printers_touch
  BEFORE UPDATE ON public.restaurant_printers
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- RLS
ALTER TABLE public.restaurant_printers ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.restaurant_printers TO authenticated;
GRANT ALL ON public.restaurant_printers TO service_role;

-- Restaurant owners can manage their own printer
CREATE POLICY "Restaurant owner manages own printer"
  ON public.restaurant_printers
  FOR ALL TO authenticated
  USING (
    restaurant_id IN (
      SELECT id FROM public.restaurants WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    restaurant_id IN (
      SELECT id FROM public.restaurants WHERE owner_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- 3. restaurant_print_jobs
--    One row per order confirmation event. The UNIQUE constraint on order_id
--    is the idempotency anchor: INSERT ... ON CONFLICT (order_id) DO NOTHING
--    prevents duplicate jobs on Stripe webhook retries or double-fires.
--
--    Boundary rule: order_id references restaurant_orders ONLY.
--    It is a FK violation (enforced by Postgres) to insert a catering or
--    event booking ID here.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.restaurant_print_jobs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- FK to restaurant_orders — enforces Restaurant-only scope at DB level
  order_id      uuid NOT NULL UNIQUE REFERENCES public.restaurant_orders(id) ON DELETE CASCADE,
  -- Denormalised for fast printer-polling queries without a join
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  status        text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'printed', 'failed')),
  attempts      int  NOT NULL DEFAULT 0,
  error_log     text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Index for the printer polling query: find oldest pending job for a restaurant
-- Note: status is in the WHERE clause so omitted from the index columns to avoid redundancy.
CREATE INDEX IF NOT EXISTS idx_print_jobs_restaurant_pending
  ON public.restaurant_print_jobs (restaurant_id, created_at)
  WHERE status = 'pending';

-- Index for watchdog stale-job sweep
CREATE INDEX IF NOT EXISTS idx_print_jobs_pending_created
  ON public.restaurant_print_jobs (created_at)
  WHERE status = 'pending';

-- Auto-touch updated_at
CREATE TRIGGER restaurant_print_jobs_touch
  BEFORE UPDATE ON public.restaurant_print_jobs
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- RLS — restaurant owners can read their own print jobs via dashboard.
-- INSERT and UPDATE are intentionally not granted to authenticated.
-- All writes to this table go through supabaseAdmin (service_role) server functions only.
-- If that assumption changes, add server-function-scoped INSERT/UPDATE policies here.
ALTER TABLE public.restaurant_print_jobs ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.restaurant_print_jobs TO authenticated;
GRANT ALL ON public.restaurant_print_jobs TO service_role;

CREATE POLICY "Restaurant owner reads own print jobs"
  ON public.restaurant_print_jobs
  FOR SELECT TO authenticated
  USING (
    restaurant_id IN (
      SELECT id FROM public.restaurants WHERE owner_id = auth.uid()
    )
  );
