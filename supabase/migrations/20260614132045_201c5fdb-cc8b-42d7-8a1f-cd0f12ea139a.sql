
-- ============ Extend brief_status enum ============
ALTER TABLE public.catering_briefs ALTER COLUMN status DROP DEFAULT;
ALTER TYPE public.brief_status RENAME TO brief_status_old;
CREATE TYPE public.brief_status AS ENUM (
  'draft','needs_more_info','ready_for_matching','matched','quote_requested','booked',
  'submitted','reviewing','quoted','accepted','declined','cancelled'
);
ALTER TABLE public.catering_briefs
  ALTER COLUMN status TYPE public.brief_status USING status::text::public.brief_status;
ALTER TABLE public.catering_briefs
  ALTER COLUMN status SET DEFAULT 'draft'::public.brief_status;
DROP TYPE public.brief_status_old;

-- ============ Caterers storefront ============
CREATE TABLE public.caterers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (owner_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.caterers TO authenticated;
GRANT ALL ON public.caterers TO service_role;
ALTER TABLE public.caterers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Caterers readable by signed-in" ON public.caterers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Owner manages caterer" ON public.caterers FOR ALL TO authenticated
  USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE TRIGGER caterers_touch BEFORE UPDATE ON public.caterers
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ Planners storefront ============
CREATE TABLE public.planners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (owner_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.planners TO authenticated;
GRANT ALL ON public.planners TO service_role;
ALTER TABLE public.planners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Planners readable by signed-in" ON public.planners FOR SELECT TO authenticated USING (true);
CREATE POLICY "Owner manages planner" ON public.planners FOR ALL TO authenticated
  USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE TRIGGER planners_touch BEFORE UPDATE ON public.planners
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ Planner services ============
CREATE TABLE public.planner_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  planner_id uuid NOT NULL REFERENCES public.planners(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  starting_price_cents integer NOT NULL DEFAULT 0 CHECK (starting_price_cents >= 0),
  image_url text,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.planner_services TO authenticated;
GRANT ALL ON public.planner_services TO service_role;
GRANT SELECT ON public.planner_services TO anon;
ALTER TABLE public.planner_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Available services public" ON public.planner_services FOR SELECT
  USING (is_available = true);
CREATE POLICY "Planner owner manages services" ON public.planner_services FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.planners p WHERE p.id = planner_id AND p.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.planners p WHERE p.id = planner_id AND p.owner_id = auth.uid()));
CREATE TRIGGER planner_services_touch BEFORE UPDATE ON public.planner_services
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ Brief routing to caterers ============
ALTER TABLE public.catering_briefs
  ADD COLUMN preferred_caterer_id uuid REFERENCES public.caterers(id) ON DELETE SET NULL;
CREATE INDEX catering_briefs_preferred_caterer_idx
  ON public.catering_briefs(preferred_caterer_id);

CREATE POLICY "Caterer can view assigned briefs" ON public.catering_briefs FOR SELECT TO authenticated
  USING (
    preferred_caterer_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM public.caterers c WHERE c.id = preferred_caterer_id AND c.owner_id = auth.uid())
  );
CREATE POLICY "Caterer can update assigned briefs" ON public.catering_briefs FOR UPDATE TO authenticated
  USING (
    preferred_caterer_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM public.caterers c WHERE c.id = preferred_caterer_id AND c.owner_id = auth.uid())
  )
  WITH CHECK (
    preferred_caterer_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM public.caterers c WHERE c.id = preferred_caterer_id AND c.owner_id = auth.uid())
  );
