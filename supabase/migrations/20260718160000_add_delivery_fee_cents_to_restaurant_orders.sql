ALTER TABLE public.restaurant_orders ADD COLUMN IF NOT EXISTS delivery_fee_cents INTEGER DEFAULT 0;
NOTIFY pgrst, 'reload schema';
