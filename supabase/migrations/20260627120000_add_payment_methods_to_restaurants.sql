-- Add payment method columns to restaurants table
ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS accepts_cash boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS accepts_paypal boolean NOT NULL DEFAULT false;
-- paypal_email already exists from previous migration
