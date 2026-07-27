import { createClient } from "@supabase/supabase-js";
import fs from "fs";

let serviceKey = "";
try {
  const env = fs.readFileSync(".env.production", "utf8");
  serviceKey = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]?.trim() || "";
} catch (e) {}

if (!serviceKey) {
  try {
    const env = fs.readFileSync(".env", "utf8");
    serviceKey = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]?.trim() || "";
  } catch (e) {}
}

const url = "https://athwccvgdovglcpluwnu.supabase.co";

async function run() {
  const supabase = createClient(url, serviceKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0aHdjY3ZnZG92Z2xjcGx1d251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDUyNjc1MSwiZXhwIjoyMDkxMDEwNzUxfQ.dummy");

  const { data: caterers } = await supabase.from("caterers").select("*");
  console.log("ALL CATERERS IN DB:", caterers);

  const { data: sf } = await supabase.from("storefront_settings").select("*");
  console.log("ALL STOREFRONT SETTINGS IN DB:", sf);
}

run();
