import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function main() {
  console.log("Verifying legacy reviews table...");
  const { data, error, count } = await supabase
    .from("reviews")
    .select("*", { count: "exact" });

  if (error) {
    console.error("Error querying reviews table:", error);
    return;
  }

  console.log(`Found ${count} reviews in the legacy table.`);
  if (data && data.length > 0) {
    console.log("Sample data:", data.slice(0, 3));
    console.log("MIGRATION NEEDED: Real data exists in the legacy reviews table.");
  } else {
    console.log("NO MIGRATION NEEDED: The legacy reviews table is empty.");
  }
}

main().catch(console.error);
