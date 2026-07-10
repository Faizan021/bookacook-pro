import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  "https://athwccvgdovglcpluwnu.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function main() {
  const email = "faizan.ahmed01213+schnitzel@gmail.com";
  console.log("Checking email:", email);

  const { data: users, error: err1 } = await supabase.auth.admin.listUsers();
  if (err1) {
    console.log("Error fetching users. Are we using service role key?", err1.message);
  } else {
    const user = users.users.find((u) => u.email === email);
    console.log("Auth User:", user ? `Exists, id=${user.id}` : "Not found");
  }

  const { data: p1, error: e1 } = await supabase.from("profiles").select("*").limit(1);
  console.log("Profiles schema:", p1 ? Object.keys(p1[0] || {}) : "No rows", e1);

  const { data: p2, error: e2 } = await supabase.from("partner_profiles").select("*").limit(1);
  console.log("Partner Profiles schema:", p2 ? Object.keys(p2[0] || {}) : "No rows", e2);
}

main().catch(console.error);
