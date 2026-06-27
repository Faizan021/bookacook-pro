-- Migration: Partner & Payment Architecture

-- 1. Update restaurants table with Stripe Connect fields
ALTER TABLE public.restaurants ADD COLUMN stripe_user_id text;
ALTER TABLE public.restaurants ADD COLUMN stripe_connect_status text DEFAULT 'not_connected' CHECK (stripe_connect_status IN ('connected', 'not_connected', 'deauthorized'));
ALTER TABLE public.restaurants ADD COLUMN stripe_connected_at timestamptz;
ALTER TABLE public.restaurants ADD COLUMN is_published boolean DEFAULT false;

-- 2. Create subscriptions table
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID UNIQUE REFERENCES public.restaurants(id) ON DELETE CASCADE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'trialing')),
    plan TEXT NOT NULL CHECK (plan IN ('starter', 'growth', 'premium')),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_reads_subscriptions" ON public.subscriptions 
    FOR SELECT TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = restaurant_id AND r.owner_id = auth.uid()));

CREATE TRIGGER subscriptions_touch_updated_at 
    BEFORE UPDATE ON public.subscriptions 
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 3. Catering & Event bookings tables
-- First drop old empty bookings table
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;

-- Create catering_bookings table
CREATE TABLE public.catering_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    caterer_id UUID NOT NULL REFERENCES public.caterers(id) ON DELETE CASCADE,
    brief_id UUID REFERENCES public.catering_briefs(id) ON DELETE SET NULL,
    event_date DATE,
    guest_count INTEGER,
    event_type TEXT,
    location TEXT,
    quoted_amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'EUR',
    booking_status TEXT NOT NULL DEFAULT 'pending' CHECK (booking_status IN ('pending', 'awaiting_deposit', 'confirmed', 'cancelled', 'completed')),
    deposit_amount NUMERIC NOT NULL,
    deposit_paid_at TIMESTAMPTZ,
    deposit_refunded_at TIMESTAMPTZ,
    cancellation_by TEXT CHECK (cancellation_by IN ('customer', 'vendor', 'platform')),
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on catering_bookings
ALTER TABLE public.catering_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "customer_reads_catering_bookings" ON public.catering_bookings 
    FOR SELECT TO authenticated 
    USING (customer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.caterers c WHERE c.id = caterer_id AND c.owner_id = auth.uid()));

CREATE POLICY "manage_catering_bookings" ON public.catering_bookings 
    FOR ALL TO authenticated 
    USING (customer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.caterers c WHERE c.id = caterer_id AND c.owner_id = auth.uid())) 
    WITH CHECK (customer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.caterers c WHERE c.id = caterer_id AND c.owner_id = auth.uid()));

CREATE TRIGGER catering_bookings_touch_updated_at 
    BEFORE UPDATE ON public.catering_bookings 
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Create event_bookings table
CREATE TABLE public.event_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    planner_id UUID NOT NULL REFERENCES public.planners(id) ON DELETE CASCADE,
    brief_id UUID REFERENCES public.catering_briefs(id) ON DELETE SET NULL,
    event_date DATE,
    guest_count INTEGER,
    event_type TEXT,
    location TEXT,
    quoted_amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'EUR',
    booking_status TEXT NOT NULL DEFAULT 'pending' CHECK (booking_status IN ('pending', 'awaiting_deposit', 'confirmed', 'cancelled', 'completed')),
    deposit_amount NUMERIC NOT NULL,
    deposit_paid_at TIMESTAMPTZ,
    deposit_refunded_at TIMESTAMPTZ,
    cancellation_by TEXT CHECK (cancellation_by IN ('customer', 'vendor', 'platform')),
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on event_bookings
ALTER TABLE public.event_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "customer_reads_event_bookings" ON public.event_bookings 
    FOR SELECT TO authenticated 
    USING (customer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.planners p WHERE p.id = planner_id AND p.owner_id = auth.uid()));

CREATE POLICY "manage_event_bookings" ON public.event_bookings 
    FOR ALL TO authenticated 
    USING (customer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.planners p WHERE p.id = planner_id AND p.owner_id = auth.uid())) 
    WITH CHECK (customer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.planners p WHERE p.id = planner_id AND p.owner_id = auth.uid()));

CREATE TRIGGER event_bookings_touch_updated_at 
    BEFORE UPDATE ON public.event_bookings 
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 4. Recreate payments table
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL,
    catering_booking_id UUID REFERENCES public.catering_bookings(id) ON DELETE SET NULL,
    event_booking_id UUID REFERENCES public.event_bookings(id) ON DELETE SET NULL,
    stripe_payment_intent_id TEXT UNIQUE NOT NULL,
    amount_total NUMERIC NOT NULL,
    platform_fee_amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'EUR',
    status TEXT NOT NULL CHECK (status IN ('pending', 'captured', 'refunded', 'disputed')),
    refund_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "view_payments" ON public.payments 
    FOR SELECT TO authenticated 
    USING (
        EXISTS (SELECT 1 FROM public.catering_bookings cb WHERE cb.id = catering_booking_id AND (cb.customer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.caterers c WHERE c.id = cb.caterer_id AND c.owner_id = auth.uid()))) OR 
        EXISTS (SELECT 1 FROM public.event_bookings eb WHERE eb.id = event_booking_id AND (eb.customer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.planners p WHERE p.id = eb.planner_id AND p.owner_id = auth.uid())))
    );

CREATE TRIGGER payments_touch_updated_at 
    BEFORE UPDATE ON public.payments 
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Grant permissions
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.catering_bookings TO authenticated;
GRANT ALL ON public.catering_bookings TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_bookings TO authenticated;
GRANT ALL ON public.event_bookings TO service_role;

GRANT SELECT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
