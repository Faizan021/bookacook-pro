-- 1. Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stripe_session_id TEXT UNIQUE NOT NULL,
    caterer_id UUID REFERENCES caterers(id),
    customer_email TEXT,
    customer_details JSONB,
    payment_status TEXT DEFAULT 'pending',
    fulfillment_status TEXT DEFAULT 'pending',
    total_amount DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL
);

-- 3. Create event_requests table
CREATE TABLE IF NOT EXISTS event_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT,
    guest_count INTEGER,
    budget DECIMAL(10, 2),
    dietary_preferences TEXT[],
    city TEXT,
    preferred_cuisines TEXT[],
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
