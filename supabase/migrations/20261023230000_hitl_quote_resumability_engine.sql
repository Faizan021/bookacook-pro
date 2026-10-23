-- =========================================================================
-- SPEISELY HITL QUOTE RESUMABILITY ENGINE (Google ADK Checkpoint Architecture)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.quote_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  
  -- Workflow / Checkpoint State
  status TEXT NOT NULL DEFAULT 'PENDING_APPROVAL' 
    CHECK (status IN ('DRAFTING', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'DISPATCHED')),
  is_resumable BOOLEAN NOT NULL DEFAULT true,
  approval_token TEXT NOT NULL DEFAULT encode(gen_random_bytes(24), 'hex'),
  
  -- Customer / Inquiry Details
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  event_type TEXT NOT NULL DEFAULT 'Catering Event',
  event_date DATE,
  guest_count INTEGER NOT NULL DEFAULT 10,
  city TEXT NOT NULL DEFAULT 'Deutschland',
  caterer_id TEXT NOT NULL,
  caterer_name TEXT NOT NULL DEFAULT 'Speisely Catering Partner',
  
  -- Calculated Quote Breakdown (Inspectable Session State)
  portions_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  suggested_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal_cents INTEGER NOT NULL DEFAULT 0,
  deposit_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'EUR',
  
  -- Admin notes / edits
  admin_notes TEXT,
  dispatched_at TIMESTAMPTZ
);

-- Index for instant token lookup on 1-click WhatsApp approvals
CREATE INDEX IF NOT EXISTS idx_quote_drafts_token ON public.quote_drafts(approval_token);
CREATE INDEX IF NOT EXISTS idx_quote_drafts_status ON public.quote_drafts(status);

-- Enable 100% RLS (Rule 14 & 15 Compliance)
ALTER TABLE public.quote_drafts ENABLE ROW LEVEL SECURITY;

-- Service role & Admin full access
CREATE POLICY "service_role_full_access_quote_drafts" 
  ON public.quote_drafts 
  FOR ALL 
  TO service_role 
  USING (true) 
  WITH CHECK (true);

-- Authenticated Admin Read/Update Access
CREATE POLICY "admin_manage_quote_drafts" 
  ON public.quote_drafts 
  FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
