CREATE TYPE surplus_offer_status AS ENUM ('draft', 'scheduled', 'active', 'paused', 'sold_out', 'expired', 'cancelled');

CREATE TABLE surplus_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES restaurant_products(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL, -- Denormalized snapshot of menu_item name at creation
    original_price_cents INTEGER NOT NULL CHECK (original_price_cents > 0),
    surplus_price_cents INTEGER NOT NULL CHECK (surplus_price_cents > 0),
    initial_quantity INTEGER NOT NULL CHECK (initial_quantity > 0),
    current_quantity INTEGER NOT NULL CHECK (current_quantity >= 0),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status surplus_offer_status NOT NULL DEFAULT 'draft',
    fulfillment_mode VARCHAR(50) NOT NULL DEFAULT 'pickup', -- 'pickup' or 'delivery_eligible'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT chk_price_discount CHECK (surplus_price_cents < original_price_cents),
    CONSTRAINT chk_time_range CHECK (start_time < end_time)
);

-- Indexing for fast storefront lookups of active offers based on server time
CREATE INDEX idx_surplus_offers_restaurant_lookup ON surplus_offers(restaurant_id, status, start_time, end_time)
WHERE status = 'active';

-- 1. Database Transaction Guard: Create surplus offer with exclusive advisory lock
-- Uses pg_advisory_xact_lock (transaction-scoped) which is automatically released on commit/rollback.
-- Session-level locks (e.g. pg_advisory_lock) are explicitly forbidden to prevent connection-pool leaks.
CREATE OR REPLACE FUNCTION create_surplus_offer_with_lock(
    p_restaurant_id UUID,
    p_menu_item_id UUID,
    p_item_name VARCHAR,
    p_original_price_cents INTEGER,
    p_surplus_price_cents INTEGER,
    p_initial_quantity INTEGER,
    p_start_time TIMESTAMP WITH TIME ZONE,
    p_end_time TIMESTAMP WITH TIME ZONE,
    p_fulfillment_mode VARCHAR,
    p_daily_limit INTEGER
) RETURNS UUID AS $$
DECLARE
    v_lock_id BIGINT;
    v_count INTEGER;
    v_offer_id UUID;
    v_initial_status surplus_offer_status;
BEGIN
    -- Verify the caller owns the restaurant profile
    IF NOT EXISTS (
        SELECT 1 FROM restaurants
        WHERE id = p_restaurant_id
          AND owner_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    -- Generate a unique 64-bit integer hash from restaurant_id and start_time date to lock on
    v_lock_id := ('x' || substr(md5(p_restaurant_id::text || date(p_start_time)::text), 1, 16))::bit(64)::bigint;
    
    -- Try to acquire transactional exclusive advisory lock immediately. 
    -- If locked by another concurrent process, return null to prompt a clean retryable client validation error.
    IF NOT pg_try_advisory_xact_lock(v_lock_id) THEN
        RAISE EXCEPTION 'LOCK_CONFLICT';
    END IF;
    
    -- Check the count of existing uncancelled offers on the same day
    SELECT COUNT(*) INTO v_count
    FROM surplus_offers
    WHERE restaurant_id = p_restaurant_id
      AND DATE(start_time) = DATE(p_start_time)
      AND status != 'cancelled';
      
    IF v_count >= p_daily_limit THEN
        RAISE EXCEPTION 'DAILY_LIMIT_REACHED';
    END IF;
    
    -- Determine initial status based on start_time comparison with server time (NOW())
    IF p_start_time <= NOW() THEN
        v_initial_status := 'active'::surplus_offer_status;
    ELSE
        v_initial_status := 'scheduled'::surplus_offer_status;
    END IF;
    
    -- Insert new offer
    INSERT INTO surplus_offers (
        restaurant_id, menu_item_id, item_name, original_price_cents, surplus_price_cents,
        initial_quantity, current_quantity, start_time, end_time, status, fulfillment_mode
    ) VALUES (
        p_restaurant_id, p_menu_item_id, p_item_name, p_original_price_cents, p_surplus_price_cents,
        p_initial_quantity, p_initial_quantity, p_start_time, p_end_time, v_initial_status, p_fulfillment_mode
    ) RETURNING id INTO v_offer_id;
    
    RETURN v_offer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Concurrency-Safe Stock Decrement: Atomic quantity deduction at purchase time
CREATE OR REPLACE FUNCTION decrement_surplus_stock(
    p_offer_id UUID,
    p_quantity_to_buy INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    v_updated INTEGER;
BEGIN
    UPDATE surplus_offers
    SET current_quantity = current_quantity - p_quantity_to_buy,
        status = CASE WHEN (current_quantity - p_quantity_to_buy) = 0 THEN 'sold_out'::surplus_offer_status ELSE status END
    WHERE id = p_offer_id
      AND status = 'active'
      AND start_time <= NOW()
      AND end_time > NOW()
      AND current_quantity >= p_quantity_to_buy;
      
    GET DIAGNOSTICS v_updated = ROW_COUNT;
    
    RETURN v_updated > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Enable RLS and define policies on surplus_offers table
ALTER TABLE surplus_offers ENABLE ROW LEVEL SECURITY;

-- Allow SELECT for active offers to anyone (storefront), and all offers to restaurant owners
CREATE POLICY select_surplus_offers ON surplus_offers
FOR SELECT USING (
    status = 'active'
    OR EXISTS (
        SELECT 1 FROM restaurants r
        WHERE r.id = surplus_offers.restaurant_id
          AND r.owner_id = auth.uid()
    )
);

-- Allow INSERT for restaurant owners
CREATE POLICY insert_surplus_offers ON surplus_offers
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM restaurants r
        WHERE r.id = surplus_offers.restaurant_id
          AND r.owner_id = auth.uid()
    )
);

-- Allow UPDATE for restaurant owners
CREATE POLICY update_surplus_offers ON surplus_offers
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM restaurants r
        WHERE r.id = surplus_offers.restaurant_id
          AND r.owner_id = auth.uid()
    )
) WITH CHECK (
    EXISTS (
        SELECT 1 FROM restaurants r
        WHERE r.id = surplus_offers.restaurant_id
          AND r.owner_id = auth.uid()
    )
);
