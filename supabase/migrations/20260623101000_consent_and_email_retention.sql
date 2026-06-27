CREATE TABLE IF NOT EXISTS public.user_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL UNIQUE,
  audience_type text NOT NULL CHECK (audience_type IN ('customer', 'restaurant', 'caterer', 'planner', 'guest')),
  
  marketing_opt_in boolean DEFAULT false,
  marketing_unsubscribed_at timestamptz,
  
  double_opt_in_confirmed boolean DEFAULT false,
  double_opt_in_token text,
  token_expires_at timestamptz,
  
  terms_acknowledged boolean DEFAULT false,
  
  source_detail text,
  locale text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.consent_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consent_id uuid REFERENCES public.user_consents(id) ON DELETE CASCADE,
  email text NOT NULL,
  action_type text NOT NULL,
  source text NOT NULL,
  source_detail text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_logs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous and authenticated inserts (since guests can submit forms)
CREATE POLICY "Enable insert for all" ON public.user_consents
  FOR INSERT WITH CHECK (true);

-- Allow users to view their own consent
CREATE POLICY "Enable read for users based on user_id" ON public.user_consents
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to update their own consent
CREATE POLICY "Enable update for users based on user_id" ON public.user_consents
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Consent logs are append-only
CREATE POLICY "Enable insert for all" ON public.consent_logs
  FOR INSERT WITH CHECK (true);

-- Allow users to read their own logs via the consent_id relation
CREATE POLICY "Enable read for users based on consent_id" ON public.consent_logs
  FOR SELECT USING (
    consent_id IN (
      SELECT id FROM public.user_consents WHERE user_id = auth.uid()
    )
  );

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_consents_modtime
BEFORE UPDATE ON public.user_consents
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
