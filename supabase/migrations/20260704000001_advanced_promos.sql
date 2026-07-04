DO $$ 
DECLARE 
  constraint_name text;
BEGIN
  -- Find the check constraint on discount_type
  SELECT conname INTO constraint_name
  FROM pg_constraint
  WHERE conrelid = 'public.promo_codes'::regclass
  AND contype = 'c';

  IF constraint_name IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.promo_codes DROP CONSTRAINT ' || constraint_name;
  END IF;
END $$;

ALTER TABLE public.promo_codes
  ADD COLUMN min_order_value_cents INTEGER,
  ADD COLUMN free_item_name TEXT,
  ADD COLUMN required_qty INTEGER,
  ADD COLUMN starts_at TIMESTAMPTZ,
  ADD COLUMN ends_at TIMESTAMPTZ,
  ADD COLUMN max_redemptions INTEGER,
  ADD COLUMN max_redemptions_per_user INTEGER,
  ADD COLUMN first_order_only BOOLEAN DEFAULT false,
  ADD COLUMN cannot_combine BOOLEAN DEFAULT false,
  ADD COLUMN exclude_discounted_items BOOLEAN DEFAULT false;
