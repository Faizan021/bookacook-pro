import * as fs from "fs";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const SUPABASE_URL = "https://athwccvgdovglcpluwnu.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function main() {
  if (!SERVICE_KEY) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const sql = fs.readFileSync(
    "supabase/migrations/20260710024000_add_approval_status_and_role_settings.sql",
    "utf-8"
  );

  console.log("Applying migration SQL via exec_sql...");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql }),
  });

  console.log("Response Status:", res.status);
  const text = await res.text();
  console.log("Response Body:", text);

  if (res.status !== 200) {
    console.error("Failed to apply migration via RPC.");
    process.exit(1);
  } else {
    console.log("Migration applied successfully!");
  }
}

main().catch(console.error);
