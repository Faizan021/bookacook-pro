-- Migration to create customer_profiles CRM table and trigger links

CREATE TABLE IF NOT EXISTS public.customer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  phone text,
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add relation column to restaurant_orders
ALTER TABLE public.restaurant_orders ADD COLUMN IF NOT EXISTS customer_profile_id uuid REFERENCES public.customer_profiles(id) ON DELETE SET NULL;

-- Enable RLS and Grant Permissions
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_profiles TO authenticated;
GRANT ALL ON public.customer_profiles TO service_role;

CREATE POLICY "Users can view their own customer profile" ON public.customer_profiles 
  FOR SELECT TO authenticated USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own customer profile" ON public.customer_profiles 
  FOR UPDATE TO authenticated USING (auth.uid() = auth_user_id) WITH CHECK (auth.uid() = auth_user_id);

-- Create trigger for touch_updated_at on customer_profiles
CREATE TRIGGER customer_profiles_touch BEFORE UPDATE ON public.customer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Update trigger function handle_new_user to link pre-existing guest profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- Link existing customer profile if email matches and it wasn't linked yet
  UPDATE public.customer_profiles
  SET auth_user_id = NEW.id
  WHERE email = NEW.email AND auth_user_id IS NULL;

  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer')
  ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$;
