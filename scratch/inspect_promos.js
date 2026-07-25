import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envContent = fs.readFileSync(".env.local", "utf8");
const envVars = {};
envContent.split(/\r?\n/).forEach(line => {
  const parts = line.split("=");
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join("=").trim();
    envVars[key] = val.replace(/^["']|["']$/g, "");
  }
});

const SUPABASE_URL = envVars.SUPABASE_URL || envVars.VITE_SUPABASE_URL;
const ANON_KEY = envVars.SUPABASE_PUBLISHABLE_KEY || envVars.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function main() {
  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .limit(10);
  
  if (error) {
    console.error("Error fetching:", error);
    return;
  }

  console.log("Promo codes found:", data.length);
  console.log(JSON.stringify(data, null, 2));
}

main();
