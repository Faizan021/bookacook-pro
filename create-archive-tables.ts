import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const SUPABASE_URL = "https://athwccvgdovglcpluwnu.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const tables = [
  "event_requests",
  "event_request_matches",
  "orders",
  "order_items",
  "packages",
  "availability",
];

async function run() {
  if (!SERVICE_KEY) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  // Use Supabase SQL endpoint (available via management API or pg_net)
  // Fall back: create each table by inserting a fake row and rolling back
  // Safest approach with REST API: check if table exists via information_schema query

  const checkSql = `
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name LIKE '_archive_%'
  `;

  const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql: checkSql }),
  });

  if (checkRes.status === 404) {
    console.log("exec_sql RPC not available - will use direct SQL via pg connection string approach");
    console.log("\nThe archive tables must be created manually in the Supabase SQL Editor.");
    console.log("\nCopy and paste the following SQL into https://supabase.com/dashboard/project/qvjqwnlkygyrudlakece/sql/new :\n");

    for (const t of tables) {
      const archiveTable = `_archive_${t}`;
      console.log(`-- Archive: ${t}`);
      console.log(`CREATE TABLE IF NOT EXISTS public.${archiveTable} AS`);
      console.log(`  SELECT * FROM public.${t} LIMIT 0;`);
      console.log(`ALTER TABLE public.${archiveTable}`);
      console.log(`  ADD COLUMN IF NOT EXISTS _archived_at timestamptz DEFAULT now();`);
      console.log(`ALTER TABLE public.${archiveTable} DISABLE ROW LEVEL SECURITY;`);
      console.log(`COMMENT ON TABLE public.${archiveTable} IS 'Archive backup before legacy migration. Do not drop until drop migration is approved.';`);
      console.log("");
    }
    process.exit(0);
  }

  const text = await checkRes.text();
  console.log("Existing archive tables:", text);
}

run().catch((e) => { console.error(e); process.exit(1); });
