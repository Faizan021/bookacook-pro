-- Migration to add subscription plans to restaurants
ALTER TABLE public.restaurants ADD COLUMN plan_name text DEFAULT 'starter';
ALTER TABLE public.restaurants ADD COLUMN subscription_status text DEFAULT 'active';
ALTER TABLE public.restaurants ADD COLUMN billing_cycle_start timestamptz DEFAULT now();
