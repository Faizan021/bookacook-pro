/**
 * fill-archives.ts
 * Populates all _archive_* tables using INSERT (not upsert) since the
 * archive tables have no primary key constraint. Idempotent via TRUNCATE + INSERT.
 */
import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  "https://athwccvgdovglcpluwnu.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const PAIRS = [
  { src: "event_requests", dst: "_archive_event_requests" },
  { src: "event_request_matches", dst: "_archive_event_request_matches" },
  { src: "orders", dst: "_archive_orders" },
  { src: "order_items", dst: "_archive_order_items" },
  { src: "packages", dst: "_archive_packages" },
  { src: "availability", dst: "_archive_availability" },
];

async function count(table: string): Promise<number> {
  const { count: c } = await supabase.from(table).select("*", { count: "exact", head: true });
  return c ?? 0;
}

async function main() {
  console.log("=== Filling _archive_* tables (INSERT, no conflict logic) ===\n");

  for (const { src, dst } of PAIRS) {
    // Step 1: read all rows from source
    const { data, error: readErr } = await supabase.from(src).select("*");
    if (readErr) {
      console.error(`  Cannot read ${src}: ${readErr.message}`);
      continue;
    }
    if (!data || data.length === 0) {
      console.log(`  ${src}: 0 rows � nothing to archive.`);
      continue;
    }

    // Step 2: check if archive already has data (idempotency guard)
    const existingCount = await count(dst);
    if (existingCount > 0) {
      console.log(`  ${dst}: already has ${existingCount} rows � skipping to avoid duplicates.`);
      continue;
    }

    // Step 3: add _archived_at timestamp and insert
    const rows = data.map((r: Record<string, unknown>) => ({
      ...r,
      _archived_at: new Date().toISOString(),
    }));

    const { error: insertErr } = await supabase.from(dst).insert(rows);
    if (insertErr) {
      console.error(`  FAILED to insert into ${dst}: ${insertErr.message}`);
    } else {
      const newCount = await count(dst);
      console.log(`  ${src} -> ${dst}: ${data.length} rows inserted (verified: ${newCount}).`);
    }
  }

  console.log("\n=== Archive Table Verification ===");
  console.log("Source ? Archive (should match):");
  for (const { src, dst } of PAIRS) {
    const srcCount = await count(src);
    const dstCount = await count(dst);
    const match = srcCount === dstCount ? "?" : "? MISMATCH";
    console.log(`  ${src}: ${srcCount} rows  |  ${dst}: ${dstCount} rows  ${match}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
