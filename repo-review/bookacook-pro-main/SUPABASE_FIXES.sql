-- ============================================================================
-- BOOKACOOK SIGNUP FIXES
-- Run this if diagnostics revealed issues
-- ============================================================================

-- ============================================================================
-- FIX 1: Ensure all profiles table columns exist (Migration 001)
-- ============================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT;

-- ============================================================================
-- FIX 2: Ensure trigger function and trigger exist (Migration 005)
-- ============================================================================

-- Drop old trigger if it exists to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role TEXT;
BEGIN
  v_role := NEW.raw_user_meta_data->>'role';

  -- 1. Upsert profile row (covers caterer, customer, admin)
  INSERT INTO public.profiles (id, role, full_name, phone)
  VALUES (
    NEW.id,
    v_role,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO UPDATE
    SET role      = EXCLUDED.role,
        full_name = EXCLUDED.full_name,
        phone     = EXCLUDED.phone;

  -- 2. Create caterer row when role = 'caterer'
  IF v_role = 'caterer' THEN
    -- First ensure caterers columns exist
    INSERT INTO public.caterers (
      user_id,
      business_name,
      contact_person,
      phone,
      business_address,
      license_number,
      verification_status
    )
    VALUES (
      NEW.id,
      COALESCE(NULLIF(NEW.raw_user_meta_data->>'business_name', ''), 'Unknown'),
      COALESCE(NULLIF(NEW.raw_user_meta_data->>'full_name',     ''), 'Unknown'),
      COALESCE(NEW.raw_user_meta_data->>'phone',                     ''),
      COALESCE(NEW.raw_user_meta_data->>'business_address',          ''),
      COALESCE(NULLIF(NEW.raw_user_meta_data->>'license_number', ''), 'PENDING'),
      'pending'
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- FIX 3: Add RLS policy to allow trigger inserts
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing problematic policies if they exist
DROP POLICY IF EXISTS "Allow trigger to insert profiles" ON public.profiles;

-- Create permissive policy for trigger
CREATE POLICY "Service role can insert profiles"
ON public.profiles
FOR INSERT
WITH CHECK (true);

-- Ensure users can read their own profile
DROP POLICY IF EXISTS "users_read_own_profile" ON public.profiles;
CREATE POLICY "users_read_own_profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Ensure users can update their own profile
DROP POLICY IF EXISTS "users_update_own_profile" ON public.profiles;
CREATE POLICY "users_update_own_profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- ============================================================================
-- FIX 4: Ensure caterers table columns exist
-- ============================================================================

ALTER TABLE public.caterers
  ADD COLUMN IF NOT EXISTS contact_person    TEXT,
  ADD COLUMN IF NOT EXISTS phone             TEXT,
  ADD COLUMN IF NOT EXISTS business_address  TEXT,
  ADD COLUMN IF NOT EXISTS license_number    TEXT;

-- ============================================================================
-- VERIFICATION: Test that everything works
-- ============================================================================

-- This will fail if there's still a problem - the error message will tell you what's wrong
DO $$
DECLARE
  v_test_id UUID;
BEGIN
  v_test_id := gen_random_uuid();
  
  INSERT INTO public.profiles (id, role, full_name, phone)
  VALUES (
    v_test_id,
    'customer',
    'Verification Test',
    '+1-555-0000'
  );
  
  RAISE NOTICE 'SUCCESS: Direct insert to profiles table works! ID: %', v_test_id;
  
  -- Clean up the test row
  DELETE FROM public.profiles WHERE id = v_test_id;
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'ERROR: Insert failed with: %', SQLERRM;
END $$;

-- ============================================================================
-- FINAL STATUS CHECK
-- ============================================================================

SELECT 
  'Trigger exists' as check_item,
  EXISTS(SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created') as status
UNION ALL
SELECT 
  'Function exists',
  EXISTS(SELECT 1 FROM information_schema.routines WHERE routine_name = 'handle_new_user' AND routine_schema = 'public')
UNION ALL
SELECT 
  'Profiles table has full_name column',
  EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'full_name')
UNION ALL
SELECT 
  'Profiles table has phone column',
  EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone')
UNION ALL
SELECT 
  'RLS is enabled on profiles',
  EXISTS(SELECT 1 FROM pg_class WHERE relname = 'profiles' AND relrowsecurity = true);

-- ============================================================================
-- If all the above checks show TRUE, your database is ready!
-- ============================================================================
