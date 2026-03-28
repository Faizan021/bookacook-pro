-- Migration 007: Change service_area from TEXT to TEXT[] on packages table
-- Run in Supabase SQL Editor

ALTER TABLE public.packages
  ALTER COLUMN service_area TYPE TEXT[]
  USING CASE
    WHEN service_area IS NULL OR service_area = '' THEN NULL
    ELSE ARRAY[service_area]
  END;
