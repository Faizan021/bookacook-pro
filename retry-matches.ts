import * as fs from "fs";
import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  "https://athwccvgdovglcpluwnu.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const rows = JSON.parse(fs.readFileSync("migration-audit/failed_event_request_matches.json", "utf-8"));
  console.log(`Retrying ${rows.length} catering_matches rows with status='suggested'...`);

  const fixed = rows.map((r: Record<string,unknown>) => ({ ...r, status: "suggested" }));
  const { error } = await supabase.from("catering_matches").upsert(fixed, { onConflict: "id" });

  if (error) {
    console.error("Still failed:", error.message);
  } else {
    const { count } = await supabase.from("catering_matches").select("*", { count: "exact", head: true });
    console.log(`Success! catering_matches now has ${count} rows.`);
    // Remove from failed audit, write to completed audit
    fs.writeFileSync("migration-audit/migrated_event_request_matches.json", JSON.stringify(fixed, null, 2));
    fs.unlinkSync("migration-audit/failed_event_request_matches.json");
    console.log("Audit file updated: failed_event_request_matches.json -> migrated_event_request_matches.json");
  }
}
main().catch(e => { console.error(e); process.exit(1); });
