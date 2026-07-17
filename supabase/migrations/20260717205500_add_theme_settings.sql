-- Migration: Add theme settings columns to public.restaurants
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS theme_accent_color text;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS theme_header_font text;
