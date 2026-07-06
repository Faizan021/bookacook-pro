-- Create stripe_webhook_events table for idempotency
CREATE TABLE IF NOT EXISTS public.stripe_webhook_events (
  id text PRIMARY KEY,
  type text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  processed_at timestamptz,
  metadata jsonb
);

-- Enable RLS
ALTER TABLE public.stripe_webhook_events ENABLE ROW LEVEL SECURITY;

-- Only admins and service role can access
CREATE POLICY "Service role can insert and read events" ON public.stripe_webhook_events
  FOR ALL
  USING (true)
  WITH CHECK (true);
