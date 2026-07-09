import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://athwccvgdovglcpluwnu.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const legacyTables = [
  "messages",
  "quotes",
  "quote_items",
  "orders",
  "order_items",
  "products",
  "product_categories",
  "packages",
  "event_requests",
  "event_request_matches",
  "availability",
  "reviews"
];

async function checkTables() {
  console.log("Checking legacy tables row counts...");
  for (const table of legacyTables) {
    try {
      const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
      if (error) {
        console.error(`Error querying ${table}: ${error.message}`);
      } else {
        console.log(`Table '${table}' has ${count} rows.`);
      }
    } catch (err: any) {
      console.error(`Failed to query ${table}: ${err.message}`);
    }
  }
}

checkTables();
