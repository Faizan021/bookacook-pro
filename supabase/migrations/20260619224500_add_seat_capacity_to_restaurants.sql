-- Migration to add seat_capacity column to restaurants
ALTER TABLE public.restaurants ADD COLUMN seat_capacity integer DEFAULT 30;
