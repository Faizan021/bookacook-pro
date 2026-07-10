import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  "https://athwccvgdovglcpluwnu.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function main() {
  // Query list of all columns in restaurant_orders
  const { data, error } = await supabase.from("restaurant_orders").select("*").limit(1);
  if (error) {
    console.error("Error querying restaurant_orders:", error.message);
  } else {
    console.log("restaurant_orders columns:", Object.keys(data[0] || {}));
  }

  // Check if reviews table exists
  const { error: revError } = await supabase.from("reviews").select("*").limit(1);
  console.log("reviews table check:", revError ? revError.message : "Exists!");

  // Check if table_reservations exists
  const { error: resError } = await supabase.from("table_reservations").select("*").limit(1);
  console.log("table_reservations check:", resError ? resError.message : "Exists!");
}

main().catch(console.error);
