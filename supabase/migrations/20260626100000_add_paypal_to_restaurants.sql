-- Add PayPal email to restaurants table
ALTER TABLE public.restaurants
ADD COLUMN IF NOT EXISTS paypal_email text;
