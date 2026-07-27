import { createClient } from "@supabase/supabase-js";

const url = "https://athwccvgdovglcpluwnu.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0aHdjY3ZnZG92Z2xjcGx1d251Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjY3NTEsImV4cCI6MjA5MDEwMjc1MX0.-hdc4Oof8qS-CT6i5Xohe3NjMw8VYD0jctqieh4Zjy8";
const supabase = createClient(url, key);

async function run() {
  const { data: sfData, error: sfErr } = await supabase
    .from("storefront_settings")
    .select("*");
  console.log("SF DATA:", sfData, sfErr);

  const { data: catData, error: catErr } = await supabase
    .from("caterers")
    .select("*");
  console.log("CAT DATA:", catData, catErr);
}

run();
