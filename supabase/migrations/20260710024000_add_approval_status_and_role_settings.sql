-- Create partner_approval_status enum
CREATE TYPE public.partner_approval_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');

-- Add approval columns to restaurants
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS approval_status public.partner_approval_status DEFAULT 'pending';
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS accepts_orders BOOLEAN DEFAULT true;

-- Add approval columns to caterers
ALTER TABLE public.caterers ADD COLUMN IF NOT EXISTS approval_status public.partner_approval_status DEFAULT 'pending';
ALTER TABLE public.caterers ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE public.caterers ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;
ALTER TABLE public.caterers ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.caterers ADD COLUMN IF NOT EXISTS accepts_inquiries BOOLEAN DEFAULT true;

-- Add approval columns to planners
ALTER TABLE public.planners ADD COLUMN IF NOT EXISTS approval_status public.partner_approval_status DEFAULT 'pending';
ALTER TABLE public.planners ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE public.planners ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;
ALTER TABLE public.planners ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.planners ADD COLUMN IF NOT EXISTS available_for_bookings BOOLEAN DEFAULT true;

-- Update existing records to approved status to prevent breaking them
UPDATE public.restaurants SET approval_status = 'approved' WHERE approval_status IS NULL OR approval_status = 'pending';
UPDATE public.caterers SET approval_status = 'approved' WHERE approval_status IS NULL OR approval_status = 'pending';
UPDATE public.planners SET approval_status = 'approved' WHERE approval_status IS NULL OR approval_status = 'pending';

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';
