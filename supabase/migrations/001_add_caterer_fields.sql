-- Migration: add fields required for caterer onboarding
-- Run this in your Supabase SQL editor

-- 1. Extend the caterers table with onboarding fields
ALTER TABLE public.caterers
  ADD COLUMN IF NOT EXISTS contact_person    TEXT,
  ADD COLUMN IF NOT EXISTS phone             TEXT,
  ADD COLUMN IF NOT EXISTS business_address  TEXT,
  ADD COLUMN IF NOT EXISTS license_number    TEXT;

-- 2. Add a CHECK constraint so license_number can never be empty once set
--    (the app also enforces this client-side before insert)
ALTER TABLE public.caterers
  DROP CONSTRAINT IF EXISTS caterers_license_number_nonempty;

ALTER TABLE public.caterers
  ADD CONSTRAINT caterers_license_number_nonempty
    CHECK (license_number IS NULL OR length(trim(license_number)) > 0);

-- 3. Extend the profiles table with fields used during customer/caterer signup
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS phone     TEXT;

-- 4. (Recommended) After backfilling any existing rows, enforce NOT NULL:
--    ALTER TABLE public.caterers ALTER COLUMN license_number SET NOT NULL;
