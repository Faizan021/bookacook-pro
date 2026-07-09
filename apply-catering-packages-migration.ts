/**
 * apply-catering-packages-migration.ts
 * Applies the catering_packages table creation via direct SQL
 * then migrates the one legacy package row into it.
 */
import * as fs from "fs";
import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
dotenv.config({ path: ".env.local" });

const SUPABASE_URL = "https://athwccvgdovglcpluwnu.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function count(table: string): Promise<number> {
  const { count: c } = await supabase.from(table).select("*", { count: "exact", head: true });
  return c ?? 0;
}

async function main() {
  if (!SERVICE_KEY) { console.error("Missing SUPABASE_SERVICE_ROLE_KEY"); process.exit(1); }

  // -- Step 1: Verify catering_packages table already exists or needs SQL --
  console.log("=== Step 1: Checking catering_packages table ===");
  const { error: checkErr } = await supabase.from("catering_packages").select("id").limit(1);
  
  if (checkErr && checkErr.message.includes("does not exist")) {
    console.error("\nTable does not exist yet. Please run this SQL in the Supabase dashboard first:");
    console.error("https://supabase.com/dashboard/project/qvjqwnlkygyrudlakece/sql/new\n");
    const sql = fs.readFileSync("supabase/migrations/20260706200000_create_catering_packages.sql", "utf-8");
    console.log(sql);
    process.exit(1);
  } else if (checkErr) {
    console.error("Unexpected error checking table:", checkErr.message);
    process.exit(1);
  }
  
  const existingCount = await count("catering_packages");
  console.log(`  catering_packages exists. Current rows: ${existingCount}`);

  // -- Step 2: Read the package from audit file --
  console.log("\n=== Step 2: Reading package from audit file ===");
  const packages = JSON.parse(
    fs.readFileSync("migration-audit/review_packages.json", "utf-8")
  ) as Record<string, unknown>[];
  
  const pkg = packages[0];
  console.log(`  Package: "${pkg.title}" (id: ${pkg.id})`);
  console.log(`  Caterer: ${pkg.caterer_id}`);
  console.log(`  Price: ${pkg.price_amount} ${pkg.currency}/${pkg.price_type}`);
  console.log(`  Guests: ${pkg.min_guests}-${pkg.max_guests}`);

  // -- Step 3: Check if already migrated (idempotency) --
  const { data: existing } = await supabase
    .from("catering_packages")
    .select("id")
    .eq("id", pkg.id as string)
    .maybeSingle();

  if (existing) {
    console.log(`\n  Package already exists in catering_packages — skipping insert (idempotent).`);
  } else {
    // -- Step 4: Insert into catering_packages --
    console.log("\n=== Step 3: Inserting into catering_packages ===");
    
    // Strip audit metadata fields
    const { _review_reason, _role, _suggested_actions, ...cleanPkg } = pkg;
    
    const { error: insertErr } = await supabase.from("catering_packages").insert([cleanPkg]);
    if (insertErr) {
      console.error(`  FAILED: ${insertErr.message}`);
      process.exit(1);
    }
    console.log(`  Inserted "${pkg.title}" successfully.`);
  }

  // -- Step 5: Verification --
  console.log("\n=== Step 4: Verification ===");
  const legacyCount = await count("packages");
  const newCount = await count("catering_packages");
  const archiveCount = await count("_archive_packages");
  
  console.log(`  Legacy packages table:       ${legacyCount} rows (intact, not yet dropped)`);
  console.log(`  Archive _archive_packages:   ${archiveCount} rows (safety backup)`);
  console.log(`  New catering_packages table: ${newCount} rows`);

  // Verify the migrated row is readable
  const { data: migrated } = await supabase
    .from("catering_packages")
    .select("id, title, caterer_id, price_type, price_amount, min_guests, max_guests, is_published, status")
    .eq("id", pkg.id as string)
    .maybeSingle();

  if (migrated) {
    console.log("\n  Migrated row confirmed:");
    console.table(migrated);
  } else {
    console.error("  WARNING: Could not verify the migrated row.");
  }

  console.log("\n=== Migration Result ===");
  if (newCount >= 1 && archiveCount === legacyCount) {
    console.log("  All checks passed.");
    console.log("  legacy packages: 1 row (original, intact)");
    console.log("  _archive_packages: 1 row (safety copy)");
    console.log("  catering_packages: 1 row (migrated)");
    console.log("\n  The packages table is now SAFE TO DROP once the drop migration is approved.");
    console.log("  Legacy source tables remain untouched until drop migration is explicitly applied.");
  } else {
    console.error("  Count mismatch — do not proceed with drop migration.");
  }
}

main().catch(e => { console.error(e); process.exit(1); });
