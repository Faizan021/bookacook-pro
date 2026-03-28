-- Migration 004: RLS policies for profiles + get_user_role RPC
-- Run this in your Supabase SQL Editor

-- 1. Enable RLS on profiles (safe even if already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Allow authenticated users to SELECT their own profile row
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'profiles'
      AND policyname = 'users_read_own_profile'
  ) THEN
    EXECUTE 'CREATE POLICY users_read_own_profile ON public.profiles
      FOR SELECT USING (auth.uid() = id)';
  END IF;
END $$;

-- 3. Allow authenticated users to UPDATE their own profile row
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'profiles'
      AND policyname = 'users_update_own_profile'
  ) THEN
    EXECUTE 'CREATE POLICY users_update_own_profile ON public.profiles
      FOR UPDATE USING (auth.uid() = id)';
  END IF;
END $$;

-- 4. Allow INSERT for new signups (trigger or app code creates the row)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'profiles'
      AND policyname = 'users_insert_own_profile'
  ) THEN
    EXECUTE 'CREATE POLICY users_insert_own_profile ON public.profiles
      FOR INSERT WITH CHECK (auth.uid() = id)';
  END IF;
END $$;

-- 5. SECURITY DEFINER function so the app can always fetch its own role
--    even before the RLS SELECT policy exists (bypasses RLS entirely)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated;
