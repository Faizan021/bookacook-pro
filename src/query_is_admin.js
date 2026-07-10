import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://athwccvgdovglcpluwnu.supabase.co";
const serviceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0aHdjY3ZnZG92Z2xjcGx1d251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDUyNjc1MSwiZXhwIjoyMDkwMTAyNzUxfQ.wGRxIMTBMoP04Gdsy63hm7e_mBfy4gQHgzYGkwesHQI";

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function run() {
  const { data: profiles, error: pError } = await supabase.from("profiles").select("*").limit(1);
  if (pError) {
    console.error("Error fetching profile:", pError);
  } else {
    console.log("Profile columns:", profiles[0] ? Object.keys(profiles[0]) : "No profiles found");
    console.log("Sample profile:", profiles[0]);
  }

  const { data: roles, error: rError } = await supabase.from("user_roles").select("*").limit(5);
  if (rError) {
    console.error("Error fetching user_roles:", rError);
  } else {
    console.log("Sample user_roles:", roles);
  }
}

run();
