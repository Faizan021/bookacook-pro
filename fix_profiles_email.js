import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  "https://athwccvgdovglcpluwnu.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function main() {
  const sql = `
    -- Fix existing profiles
    UPDATE public.profiles p
    SET email = u.email
    FROM auth.users u
    WHERE p.id = u.id AND p.email IS NULL;

    -- Update trigger to include email
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
    BEGIN
      INSERT INTO public.profiles (id, full_name, email)
      VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.email);
      
      INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer')
      ON CONFLICT DO NOTHING;
      
      RETURN NEW;
    END;
    $$;
  `;

  // Since we don't have direct SQL execution from supabase-js, we can use an Edge Function or rpc.
  // Wait, supabase-js doesn't have a generic `query` method.
  console.log("SQL to execute:");
  console.log(sql);
}

main().catch(console.error);
