import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  "https://athwccvgdovglcpluwnu.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Test if setup_time_minutes column exists by trying to select it
async function main() {
  const { error } = await supabase.from("catering_packages").select("setup_time_minutes").limit(1);
  if (error && error.message.includes("setup_time_minutes")) {
    console.log("Column missing. Please run this in the Supabase SQL editor:");
    console.log(
      "ALTER TABLE public.catering_packages ADD COLUMN IF NOT EXISTS setup_time_minutes int;",
    );
  } else {
    console.log("Column already exists or table is accessible.");
  }
}
main();
