import { createClient } from "@supabase/supabase-js";

const url = "https://athwccvgdovglcpluwnu.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0aHdjY3ZnZG92Z2xjcGx1d251Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MTc4NTIsImV4cCI6MjA1ODQ5Mzg1Mn0.S69pE8lXG-xJ26k8w4p61Z6GfR2_z0k1l2m3n4o5p6q";

// Read anon key from environment or default
const supabase = createClient(url, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0aHdjY3ZnZG92Z2xjcGx1d251Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NjE2MDMsImV4cCI6MjA1NzQzNzYwM30.rQyv4GZ_5m4d0V62XhT5B5V1b4Z5b5Z5b5Z5b5Z5b5Z");

async function run() {
  const { data: caterers } = await supabase.from("caterers").select("id, name, slug, approval_status");
  console.log("CATERERS IN DB:", caterers);

  const { data: sf } = await supabase.from("storefront_settings").select("id, caterer_id, slug, is_active");
  console.log("STOREFRONT SETTINGS IN DB:", sf);
}

run();
