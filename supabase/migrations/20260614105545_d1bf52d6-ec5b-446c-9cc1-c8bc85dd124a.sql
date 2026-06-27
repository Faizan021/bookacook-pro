CREATE TYPE public.brief_status AS ENUM ('submitted','reviewing','quoted','accepted','declined','cancelled');

CREATE TABLE public.catering_briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  caterer_slug text,
  planner_slug text,
  event_type text,
  event_date date,
  guest_count integer,
  budget_cents integer,
  location text,
  notes text,
  status public.brief_status NOT NULL DEFAULT 'submitted',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.catering_briefs TO authenticated;
GRANT ALL ON public.catering_briefs TO service_role;

ALTER TABLE public.catering_briefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "customer creates own briefs" ON public.catering_briefs
  FOR INSERT TO authenticated WITH CHECK (customer_id = auth.uid());

CREATE POLICY "customer reads own briefs" ON public.catering_briefs
  FOR SELECT TO authenticated USING (customer_id = auth.uid());

CREATE POLICY "customer updates own briefs" ON public.catering_briefs
  FOR UPDATE TO authenticated USING (customer_id = auth.uid()) WITH CHECK (customer_id = auth.uid());

CREATE TRIGGER catering_briefs_touch
  BEFORE UPDATE ON public.catering_briefs
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX catering_briefs_customer_idx ON public.catering_briefs(customer_id, created_at DESC);