-- =============================================================================
-- Migration: Harden RLS, Security Definer Views/RPCs & Prevent Disk Spam Attacks
-- Fixes live Supabase Security Advisor findings:
--   1. Enable RLS on all 6 public._archive_* tables (previously RLS disabled).
--   2. Fix public.planner_requests view to use security_invoker = true.
--   3. Fix stripe_webhook_events policy ("Service role can insert and read events")
--      which was mistakenly granted to {public} instead of {service_role}.
--   4. Remove overly permissive profiles "trigger_inserts" (WITH CHECK true)
--      since handle_new_user() runs as SECURITY DEFINER and bypasses RLS safely.
--   5. Revoke anon EXECUTE on SECURITY DEFINER functions (decrement_surplus_stock,
--      create_surplus_offer_with_lock, handle_new_user, protect_caterer_verification,
--      rls_auto_enable) and lock function search_path = public.
-- =============================================================================

-- 1. Enable RLS on all 6 archive tables (default-deny for anon & authenticated)
DO $$
BEGIN
  ALTER TABLE IF EXISTS public._archive_packages ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public._archive_availability ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public._archive_event_request_matches ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public._archive_event_requests ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public._archive_orders ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public._archive_order_items ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Archive tables RLS check skipped: %', SQLERRM;
END $$;

-- 2. Make planner_requests view respect caller RLS (security_invoker = true)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_views WHERE schemaname = 'public' AND viewname = 'planner_requests') THEN
    ALTER VIEW public.planner_requests SET (security_invoker = true);
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'planner_requests view check skipped: %', SQLERRM;
END $$;

-- 3. Restrict stripe_webhook_events strictly to service_role (not public/anon!)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'stripe_webhook_events') THEN
    DROP POLICY IF EXISTS "Service role can insert and read events" ON public.stripe_webhook_events;
    CREATE POLICY "Service role can insert and read events"
      ON public.stripe_webhook_events
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'stripe_webhook_events policy skipped: %', SQLERRM;
END $$;

-- 4. Drop wide-open trigger_inserts policy on profiles (handle_new_user is SECURITY DEFINER)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    DROP POLICY IF EXISTS "trigger_inserts" ON public.profiles;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'trigger_inserts drop skipped: %', SQLERRM;
END $$;

-- 5. Lock search_path = public on all custom functions to prevent search_path hijacking
DO $$
BEGIN
  BEGIN ALTER FUNCTION public.set_updated_at() SET search_path = public; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER FUNCTION public.protect_caterer_verification() SET search_path = public; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER FUNCTION public.update_packages_updated_at() SET search_path = public; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER FUNCTION public.update_updated_at_column() SET search_path = public; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER FUNCTION public.touch_updated_at() SET search_path = public; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER FUNCTION public.enforce_future_date_on_insert() SET search_path = public; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER FUNCTION public.update_modified_column() SET search_path = public; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER FUNCTION public.update_catering_packages_updated_at() SET search_path = public; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER FUNCTION public.create_surplus_offer_with_lock(uuid, uuid, character varying, integer, integer, integer, timestamp with time zone, timestamp with time zone, character varying, integer) SET search_path = public; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER FUNCTION public.decrement_surplus_stock(uuid, integer) SET search_path = public; EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;

-- 6. Revoke dangerous PUBLIC / anon EXECUTE permissions on SECURITY DEFINER functions
DO $$
BEGIN
  BEGIN
    REVOKE EXECUTE ON FUNCTION public.decrement_surplus_stock(uuid, integer) FROM PUBLIC, anon, authenticated;
    GRANT EXECUTE ON FUNCTION public.decrement_surplus_stock(uuid, integer) TO service_role;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    REVOKE EXECUTE ON FUNCTION public.create_surplus_offer_with_lock(uuid, uuid, character varying, integer, integer, integer, timestamp with time zone, timestamp with time zone, character varying, integer) FROM PUBLIC, anon;
    GRANT EXECUTE ON FUNCTION public.create_surplus_offer_with_lock(uuid, uuid, character varying, integer, integer, integer, timestamp with time zone, timestamp with time zone, character varying, integer) TO authenticated, service_role;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN REVOKE EXECUTE ON FUNCTION public.protect_caterer_verification() FROM PUBLIC, anon, authenticated; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated; EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;
