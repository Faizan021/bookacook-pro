-- Migration to create the service_leads table for the SEA Quote Request funnel

CREATE TYPE public.lead_status AS ENUM ('new', 'admin_reviewed', 'matched', 'closed');
CREATE TYPE public.lead_visibility AS ENUM ('locked', 'unlocked');

CREATE TABLE IF NOT EXISTS public.service_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- Nullable for guests
  
  -- Raw Contact Info (Hidden pre-unlock)
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  
  -- Masked / Summary Info
  city text NOT NULL,
  event_type text NOT NULL,
  event_date date,
  guest_count integer,
  budget_range text,
  venue_address text,
  notes text,
  
  -- Tracking & Attribution
  source_route text,
  source_channel text,
  
  -- Visibility & Status
  status public.lead_status NOT NULL DEFAULT 'new',
  lead_visibility_status public.lead_visibility NOT NULL DEFAULT 'locked',
  contact_unlocked_at timestamptz,
  unlocked_by_partner_id uuid REFERENCES public.restaurants(id) ON DELETE SET NULL,
  unlock_payment_id text,
  
  -- Audit
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.service_leads ENABLE ROW LEVEL SECURITY;

-- Only service_role (Admin/Server) can access this directly for now.
-- We will handle partner visibility via secure server functions to ensure 
-- raw data is strictly masked before unlock.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_leads TO service_role;

-- Allow anon and authenticated to insert (via RLS policy) so the server function or client can insert directly
CREATE POLICY "Anyone can insert leads" ON public.service_leads
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Create touch trigger
CREATE TRIGGER service_leads_touch
  BEFORE UPDATE ON public.service_leads
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Index for admin queries and matching
CREATE INDEX service_leads_status_idx ON public.service_leads(status);
CREATE INDEX service_leads_city_idx ON public.service_leads(city);
CREATE INDEX service_leads_event_date_idx ON public.service_leads(event_date);
