-- Migration to add certifications column to caterers and restaurants
ALTER TABLE public.caterers ADD COLUMN IF NOT EXISTS certifications text;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS certifications text;
