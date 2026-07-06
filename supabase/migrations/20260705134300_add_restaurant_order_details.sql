-- Add contact and fulfillment details to restaurant_orders
ALTER TABLE restaurant_orders
ADD COLUMN IF NOT EXISTS customer_phone text,
ADD COLUMN IF NOT EXISTS customer_email text,
ADD COLUMN IF NOT EXISTS delivery_address text,
ADD COLUMN IF NOT EXISTS order_type text DEFAULT 'pickup' CHECK (order_type IN ('pickup', 'delivery', 'dine_in')),
ADD COLUMN IF NOT EXISTS applied_promo_code text;
