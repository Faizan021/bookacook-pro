-- Migration 005: Trigger to auto-create profile + caterer rows on signup
-- Run this in the Supabase SQL Editor.
--
-- Why: Client-side inserts after auth.signUp() fail when email confirmation
-- is enabled (no session yet) or when RLS blocks an unauthenticated insert.
-- A SECURITY DEFINER trigger runs as the function owner and always succeeds.

-- ─── Trigger function ─────────────────────────────────────────────────────────

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

-- ─── Attach trigger to auth.users ─────────────────────────────────────────────

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ─── RLS: allow caterers to read their own row ─────────────────────────────────
-- (insert/update via trigger only; no client-side write needed)

ALTER TABLE public.caterers ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'caterers' AND policyname = 'caterers_read_own'
  ) THEN
    EXECUTE 'CREATE POLICY caterers_read_own ON public.caterers
      FOR SELECT USING (user_id = auth.uid())';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'caterers' AND policyname = 'admins_read_all_caterers'
  ) THEN
    EXECUTE 'CREATE POLICY admins_read_all_caterers ON public.caterers
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role = ''admin''
        )
      )';
  END IF;
END $$;
