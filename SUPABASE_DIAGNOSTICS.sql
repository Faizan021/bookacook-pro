-- ============================================================================
-- BOOKACOOK SIGNUP DIAGNOSTICS
-- Run this entire script in your Supabase SQL Editor to diagnose the signup issue
-- Copy all of it, paste into SQL Editor, and run
-- ============================================================================

-- ==== SECTION 1: Check if trigger and function exist ====
SELECT 
  'SECTION 1: Trigger & Function Status' as check_name,
  99 as section_order
UNION ALL
SELECT trigger_name as check_name, 1 as section_order
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

SELECT routine_name as check_name, 2 as section_order
FROM information_schema.routines
WHERE routine_name = 'handle_new_user'
  AND routine_schema = 'public';

-- ==== SECTION 2: Check profiles table schema ====
SELECT 
  'SECTION 2: Profiles Table Schema' as check_name,
  99 as section_order
UNION ALL
SELECT 
  column_name || ' (' || data_type || ', nullable=' || is_nullable || ')' as check_name,
  3 as section_order
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- ==== SECTION 3: Check RLS on profiles table ====
SELECT 
  'SECTION 3: RLS Policies on Profiles' as check_name,
  99 as section_order
UNION ALL
SELECT 
  policyname || ' [' || qual || ']' as check_name,
  4 as section_order
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- ==== SECTION 4: Check RLS enabled on profiles ====
SELECT 
  'SECTION 4: RLS Enabled Status' as check_name,
  99 as section_order
UNION ALL
SELECT 
  relname || ' - RLS enabled: ' || relrowsecurity::text as check_name,
  5 as section_order
FROM pg_class
WHERE relname IN ('profiles', 'caterers', 'auth');

-- ==== SECTION 5: Test direct insert into profiles ====
SELECT 
  'SECTION 5: Testing Direct Insert (Simulating Trigger)' as check_name,
  99 as section_order;

-- Try to insert a test row - if this fails, you'll see the exact error
BEGIN;
  INSERT INTO public.profiles (id, role, full_name, phone)
  VALUES (
    gen_random_uuid(),
    'customer',
    'Diagnostic Test User',
    '+1-555-0000'
  );
  ROLLBACK; -- Don't keep the test record
END;

-- ==== SECTION 6: Check auth.users to see if any signups were attempted ====
SELECT 
  'SECTION 6: Recent Auth Users' as check_name,
  99 as section_order
UNION ALL
SELECT 
  'Total users in auth.users: ' || count(*)::text as check_name,
  6 as section_order
FROM auth.users;

-- ==== SECTION 7: Check for any error logs in auth schema ====
SELECT 
  'SECTION 7: Profile Creation Status' as check_name,
  99 as section_order
UNION ALL
SELECT 
  'Total profiles in public.profiles: ' || count(*)::text as check_name,
  7 as section_order
FROM public.profiles;

-- ==== SECTION 8: Check caterers table schema ====
SELECT 
  'SECTION 8: Caterers Table Schema' as check_name,
  99 as section_order
UNION ALL
SELECT 
  column_name || ' (' || data_type || ', nullable=' || is_nullable || ')' as check_name,
  8 as section_order
FROM information_schema.columns
WHERE table_name = 'caterers'
ORDER BY ordinal_position;

-- ============================================================================
-- END OF DIAGNOSTIC SCRIPT
-- Copy the output below and share with support/debugging
-- ============================================================================
