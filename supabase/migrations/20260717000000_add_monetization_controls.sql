-- =============================================================================
-- Migration: Admin Monetization Controls
-- Adds is_featured, is_sponsored, indexability_override, ranking_boost,
-- campaign_window, seasonal_boost_tags to restaurants/caterers/planners.
-- Adds featured_slot_limits governance table.
-- Adds admin_audit_log table.
-- Schedules nightly sponsorship expiration via pg_cron.
-- All steps are fully idempotent.
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Shared enum for indexability override
-- ─────────────────────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE public.indexability_mode AS ENUM ('index', 'noindex', 'default');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Add monetization columns (IF NOT EXISTS — idempotent)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS is_featured           boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_sponsored          boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS indexability_override public.indexability_mode NOT NULL DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS ranking_boost         float   NOT NULL DEFAULT 1.0,
  ADD COLUMN IF NOT EXISTS campaign_window_start timestamptz,
  ADD COLUMN IF NOT EXISTS campaign_window_end   timestamptz,
  ADD COLUMN IF NOT EXISTS seasonal_boost_tags   text[];

ALTER TABLE public.caterers
  ADD COLUMN IF NOT EXISTS is_featured           boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_sponsored          boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS indexability_override public.indexability_mode NOT NULL DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS ranking_boost         float   NOT NULL DEFAULT 1.0,
  ADD COLUMN IF NOT EXISTS campaign_window_start timestamptz,
  ADD COLUMN IF NOT EXISTS campaign_window_end   timestamptz,
  ADD COLUMN IF NOT EXISTS seasonal_boost_tags   text[];

ALTER TABLE public.planners
  ADD COLUMN IF NOT EXISTS is_featured           boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_sponsored          boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS indexability_override public.indexability_mode NOT NULL DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS ranking_boost         float   NOT NULL DEFAULT 1.0,
  ADD COLUMN IF NOT EXISTS campaign_window_start timestamptz,
  ADD COLUMN IF NOT EXISTS campaign_window_end   timestamptz,
  ADD COLUMN IF NOT EXISTS seasonal_boost_tags   text[];

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. CHECK constraints (all guarded with IF NOT EXISTS — idempotent)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$ BEGIN

  -- ranking_boost 0.8–1.5
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'restaurants_ranking_boost_range') THEN
    ALTER TABLE public.restaurants ADD CONSTRAINT restaurants_ranking_boost_range
      CHECK (ranking_boost BETWEEN 0.8 AND 1.5);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'caterers_ranking_boost_range') THEN
    ALTER TABLE public.caterers ADD CONSTRAINT caterers_ranking_boost_range
      CHECK (ranking_boost BETWEEN 0.8 AND 1.5);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'planners_ranking_boost_range') THEN
    ALTER TABLE public.planners ADD CONSTRAINT planners_ranking_boost_range
      CHECK (ranking_boost BETWEEN 0.8 AND 1.5);
  END IF;

  -- campaign_window: end >= start when both are set
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'restaurants_campaign_window_check') THEN
    ALTER TABLE public.restaurants ADD CONSTRAINT restaurants_campaign_window_check
      CHECK (campaign_window_end IS NULL OR campaign_window_start IS NULL
             OR campaign_window_end >= campaign_window_start);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'caterers_campaign_window_check') THEN
    ALTER TABLE public.caterers ADD CONSTRAINT caterers_campaign_window_check
      CHECK (campaign_window_end IS NULL OR campaign_window_start IS NULL
             OR campaign_window_end >= campaign_window_start);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'planners_campaign_window_check') THEN
    ALTER TABLE public.planners ADD CONSTRAINT planners_campaign_window_check
      CHECK (campaign_window_end IS NULL OR campaign_window_start IS NULL
             OR campaign_window_end >= campaign_window_start);
  END IF;

  -- seasonal_boost_tags: max 20 entries
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'restaurants_seasonal_tags_max') THEN
    ALTER TABLE public.restaurants ADD CONSTRAINT restaurants_seasonal_tags_max
      CHECK (array_length(seasonal_boost_tags, 1) IS NULL
             OR array_length(seasonal_boost_tags, 1) <= 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'caterers_seasonal_tags_max') THEN
    ALTER TABLE public.caterers ADD CONSTRAINT caterers_seasonal_tags_max
      CHECK (array_length(seasonal_boost_tags, 1) IS NULL
             OR array_length(seasonal_boost_tags, 1) <= 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'planners_seasonal_tags_max') THEN
    ALTER TABLE public.planners ADD CONSTRAINT planners_seasonal_tags_max
      CHECK (array_length(seasonal_boost_tags, 1) IS NULL
             OR array_length(seasonal_boost_tags, 1) <= 20);
  END IF;

END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Indexes for Admin and public-query paths
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_restaurants_featured
  ON public.restaurants (is_featured);
CREATE INDEX IF NOT EXISTS idx_restaurants_sponsored
  ON public.restaurants (is_sponsored, campaign_window_end);
CREATE INDEX IF NOT EXISTS idx_caterers_featured
  ON public.caterers (is_featured);
CREATE INDEX IF NOT EXISTS idx_caterers_sponsored
  ON public.caterers (is_sponsored, campaign_window_end);
CREATE INDEX IF NOT EXISTS idx_planners_featured
  ON public.planners (is_featured);
CREATE INDEX IF NOT EXISTS idx_planners_sponsored
  ON public.planners (is_sponsored, campaign_window_end);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Featured slot governance table
--    event_type uses sentinel '__city__' for city-wide limits,
--    enabling a simple, non-expression UNIQUE constraint.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.featured_slot_limits (
  id          uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  role        text    NOT NULL CHECK (role IN ('restaurant', 'caterer', 'planner')),
  city_slug   text    NOT NULL,
  event_type  text    NOT NULL DEFAULT '__city__',
  max_slots   integer NOT NULL DEFAULT 3 CHECK (max_slots > 0),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (role, city_slug, event_type)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.featured_slot_limits TO service_role;

CREATE INDEX IF NOT EXISTS idx_featured_slot_limits_lookup
  ON public.featured_slot_limits (role, city_slug, event_type);

-- Trigger: reuse existing public.touch_updated_at(). DROP IF EXISTS first for idempotency.
DROP TRIGGER IF EXISTS featured_slot_limits_touch ON public.featured_slot_limits;
CREATE TRIGGER featured_slot_limits_touch
  BEFORE UPDATE ON public.featured_slot_limits
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Admin audit log table
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    uuid NOT NULL,
  role        text NOT NULL CHECK (role IN ('restaurant', 'caterer', 'planner')),
  listing_id  uuid NOT NULL,
  field       text NOT NULL,
  old_value   text,
  new_value   text,
  reason      text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT, SELECT ON public.admin_audit_log TO service_role;

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_listing
  ON public.admin_audit_log (listing_id, created_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Nightly cron: expire sponsorships + write audit rows
--    Three separate named CTEs, then one unioned INSERT.
--    Unschedule-then-schedule pattern ensures idempotency.
-- ─────────────────────────────────────────────────────────────────────────────
SELECT cron.unschedule('expire-sponsorships');

SELECT cron.schedule(
  'expire-sponsorships',
  '0 3 * * *',
  $$
    WITH
      expired_restaurants AS (
        UPDATE public.restaurants
          SET is_sponsored = false
          WHERE is_sponsored = true
            AND campaign_window_end IS NOT NULL
            AND campaign_window_end < now()
          RETURNING id, 'restaurant'::text AS role
      ),
      expired_caterers AS (
        UPDATE public.caterers
          SET is_sponsored = false
          WHERE is_sponsored = true
            AND campaign_window_end IS NOT NULL
            AND campaign_window_end < now()
          RETURNING id, 'caterer'::text AS role
      ),
      expired_planners AS (
        UPDATE public.planners
          SET is_sponsored = false
          WHERE is_sponsored = true
            AND campaign_window_end IS NOT NULL
            AND campaign_window_end < now()
          RETURNING id, 'planner'::text AS role
      ),
      all_expired AS (
        SELECT id, role FROM expired_restaurants
        UNION ALL
        SELECT id, role FROM expired_caterers
        UNION ALL
        SELECT id, role FROM expired_planners
      )
    INSERT INTO public.admin_audit_log
      (actor_id, role, listing_id, field, old_value, new_value, reason)
    SELECT
      '00000000-0000-0000-0000-000000000000'::uuid,
      role,
      id,
      'is_sponsored',
      'true',
      'false',
      'campaign_window_end expired (nightly cleanup)'
    FROM all_expired;
  $$
);
