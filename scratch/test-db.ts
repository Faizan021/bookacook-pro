import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const SUPABASE_URL = "https://athwccvgdovglcpluwnu.supabase.co";
const PUBLISHABLE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

async function main() {
  if (!PUBLISHABLE_KEY) {
    console.error("Missing publishable key");
    return;
  }
  const supabase = createClient(SUPABASE_URL, PUBLISHABLE_KEY);
  const { data, error } = await supabase.from("restaurants").select("theme_accent_color").limit(1);
  if (error) {
    console.log("Columns do not exist or query failed:", error.message);
  } else {
    console.log("Columns exist in the database! Data:", data);
  }
}

main().catch(console.error);
