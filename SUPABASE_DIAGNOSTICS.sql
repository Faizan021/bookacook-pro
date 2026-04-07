-- ============================================================================
-- BOOKACOOK SIGNUP DIAGNOSTICS (Supabase Compatible)
-- Run this entire script in your Supabase SQL Editor to diagnose the signup issue
-- Copy all of it, paste into SQL Editor, and run
-- ============================================================================

-- ==== SECTION 1: Trigger & Function Status ====
SELECT trigger_name as check_name FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

SELECT routine_name as check_name FROM information_schema.routines
WHERE routine_name = 'handle_new_user' AND routine_schema = 'public';

-- ==== SECTION 2: Profiles Table Schema ====
SELECT column_name || ' (' || data_type || ', nullable=' || is_nullable || ')' as check_name
FROM information_schema.columns WHERE table_name = 'profiles';

-- ==== SECTION 3: RLS Policies on Profiles (fixed v2) ====
SELECT polname || ' [cmd=' || polcmd::text || ']' as check_name
FROM pg_policy
JOIN pg_class ON pg_class.oid = pg_policy.polrelid
WHERE pg_class.relname = 'profiles';

-- ==== SECTION 4: RLS Enabled Status ====
SELECT relname || ' - RLS enabled: ' || relrowsecurity::text as check_name
FROM pg_class WHERE relname IN ('profiles', 'caterers');

-- ==== SECTION 5: Test Direct Insert (rolls back - safe) ====
BEGIN;
  INSERT INTO public.profiles (id, role, phone)
  VALUES (gen_random_uuid(), 'customer', '+1-555-0000');
ROLLBACK;

-- ==== SECTION 6: Recent Auth Users Count ====
SELECT 'Total users in auth.users: ' || count(*)::text FROM auth.users;

-- ==== SECTION 7: Profile Creation Status ====
SELECT 'Total profiles in public.profiles: ' || count(*)::text FROM public.profiles;

-- ==== SECTION 8: Caterers Table Schema ====
SELECT column_name || ' (' || data_type || ', nullable=' || is_nullable || ')' as check_name
FROM information_schema.columns WHERE table_name = 'caterers';

-- ==== SECTION 9: Trigger Function Body ====
SELECT prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- ==== SECTION 10: Full Profiles Schema (including generated columns) ====
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  is_generated,
  generation_expression,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
