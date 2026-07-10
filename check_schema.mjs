import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const env = fs.readFileSync(".env", "utf8");
const VITE_SUPABASE_URL = env.match(/VITE_SUPABASE_URL="?(.*?)"?$/m)?.[1]?.trim();
const SUPABASE_SERVICE_ROLE_KEY = env.match(/SUPABASE_SERVICE_ROLE_KEY="?(.*?)"?$/m)?.[1]?.trim();

const supabase = createClient(VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.from("restaurant_products").select("image_url").limit(1);
  console.log("Error:", error);
  console.log("Data:", data);
}

run();
