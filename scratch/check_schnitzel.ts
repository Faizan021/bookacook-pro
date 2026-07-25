import { supabase } from "../src/integrations/supabase/client";

async function check() {
  const { data, error } = await supabase
    .from("restaurants")
    .select("id, name, slug, approval_status, is_published, is_active")
    .eq("slug", "schnitzel-schmiede")
    .maybeSingle();

  console.log("DB Restaurant:", data);
  console.log("Error:", error);
}

check();
