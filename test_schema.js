import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://athwccvgdovglcpluwnu.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0aHdjY3ZnZG92Z2xjcGx1d251Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjY3NTEsImV4cCI6MjA5MDEwMjc1MX0.-hdc4Oof8qS-CT6i5Xohe3NjMw8VYD0jctqieh4Zjy8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Querying restaurant_products schema...");
  const { data, error } = await supabase
    .from("restaurant_products")
    .select("*")
    .limit(1);
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Product columns:", Object.keys(data[0] || {}));
    console.log("Sample product:", JSON.stringify(data[0], null, 2));
  }
}

main().catch(console.error);
