ALTER TABLE restaurant_products ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE restaurant_products ADD COLUMN IF NOT EXISTS dietary_tags text[];
