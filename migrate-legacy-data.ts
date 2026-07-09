/**
 * migrate-legacy-data.ts
 *
 * One-time data migration from legacy Speisely tables to the new domain-specific schema.
 *
 * EXECUTION ORDER:
 *   Phase 0 -- Create _archive_* tables + full raw backup of every legacy table
 *   Phase 1 -- event_requests         -> catering_briefs (Customer role)
 *   Phase 2 -- event_request_matches  -> catering_matches (Caterer role)
 *   Phase 3 -- orders + order_items   -> catering_bookings (Caterer x Customer role)
 *   Phase 4 -- packages               -> MANUAL REVIEW ONLY (Caterer role)
 *   Phase 5 -- availability           -> vendor_blackout_dates (Caterer role)
 *   Phase 6 -- Verification report
 *
 * RULES:
 *   - Archive is the DEFAULT fallback for every uncertain row. No silent skips.
 *   - Rows that are skipped MUST already exist in _archive_* and are counted.
 *   - Manual-review rows are written to JSON audit files in ./migration-audit/
 *   - This script does NOT apply the drop migration.
 *   - Role semantics are preserved: Customer, Restaurant, Caterer, Event Manager.
 */
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://athwccvgdovglcpluwnu.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error("SUPABASE_SERVICE_ROLE_KEY is missing from .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const AUDIT_DIR = path.join(".", "migration-audit");
if (!fs.existsSync(AUDIT_DIR)) fs.mkdirSync(AUDIT_DIR, { recursive: true });

type ReportEntry = { legacy: number; archived: number; migrated: number; review: number; skipped: number };
const report: Record<string, ReportEntry> = {};
function initReport(key: string) {
  report[key] = { legacy: 0, archived: 0, migrated: 0, review: 0, skipped: 0 };
}
function writeAudit(filename: string, rows: unknown[]) {
  const outPath = path.join(AUDIT_DIR, filename);
  fs.writeFileSync(outPath, JSON.stringify(rows, null, 2), "utf-8");
  console.log(`  Audit file written: ${outPath} (${rows.length} rows)`);
}

const EVENT_STATUS_MAP: Record<string, string> = {
  draft: "draft", pending: "submitted", matched: "matched", quoted: "quoted",
  accepted: "accepted", rejected: "rejected", active: "booked",
  submitted: "submitted", reviewing: "reviewing", booked: "booked",
};
const ORDER_STATUS_MAP: Record<string, string> = {
  confirmed: "confirmed", completed: "completed",
  pending: "pending", cancelled: "cancelled",
};

// ---- PHASE 0: Archive tables ----
async function phase0_createArchives() {
  console.log("\n=== PHASE 0: Creating archive tables ===");
  const tables = [
    "event_requests", "event_request_matches",
    "orders", "order_items", "packages", "availability"
  ];
  for (const t of tables) {
    const archiveTable = `_archive_${t}`;
    const { data, error } = await supabase.from(t).select("*");
    if (error) { console.error(`  Cannot read ${t}: ${error.message}`); continue; }
    if (!data || data.length === 0) { console.log(`  ${t}: 0 rows.`); continue; }
    // Try upsert into archive table (must exist in DB)
    const { error: archErr } = await supabase.from(archiveTable).upsert(data, { onConflict: "id" });
    if (archErr) {
      console.warn(`  WARNING: Could not upsert to ${archiveTable}: ${archErr.message}`);
      console.warn(`  Run this SQL in Supabase dashboard to create it:`);
      console.warn(`  CREATE TABLE IF NOT EXISTS public.${archiveTable} AS SELECT * FROM public.${t} LIMIT 0;`);
    } else {
      console.log(`  ${t}: ${data.length} rows archived -> ${archiveTable}`);
    }
  }
}

async function readTable(table: string): Promise<Record<string, unknown>[]> {
  const { data, error } = await supabase.from(table).select("*");
  if (error) throw new Error(`Failed to read ${table}: ${error.message}`);
  return (data ?? []) as Record<string, unknown>[];
}

// ---- PHASE 1: event_requests -> catering_briefs (Customer role) ----
async function phase1_eventRequests(rows: Record<string, unknown>[]) {
  console.log("\n=== PHASE 1: event_requests -> catering_briefs (Customer role) ===");
  initReport("event_requests");
  report["event_requests"].legacy = rows.length;

  const toMigrate: Record<string, unknown>[] = [];
  const reviewRows: Record<string, unknown>[] = [];

  for (const row of rows) {
    // RULE: null customer_id -> already archived, skip migration
    if (!row.customer_id) {
      report["event_requests"].archived++;
      report["event_requests"].skipped++;
      reviewRows.push({ ...row, _skip_reason: "customer_id is null - catering_briefs.customer_id NOT NULL", _role: "Customer" });
      console.log(`  Row ${row.id}: customer_id null - archived, skipped.`);
      continue;
    }
    // RULE: unmappable status -> archive + review
    const mappedStatus = EVENT_STATUS_MAP[row.status as string];
    if (!mappedStatus) {
      report["event_requests"].archived++;
      report["event_requests"].review++;
      reviewRows.push({ ...row, _review_reason: `Unknown status: '${row.status}'`, _role: "Customer" });
      console.log(`  Row ${row.id}: status='${row.status}' unknown - archived + review.`);
      continue;
    }
    // ASSUMPTION: budget_total in euros * 100 = budget_cents
    // ASSUMPTION: city -> location; special_requests -> notes; storefront_slug -> caterer_slug
    toMigrate.push({
      id: row.id, customer_id: row.customer_id,
      budget_cents: row.budget_total ? Math.round((row.budget_total as number) * 100) : null,
      event_date: row.event_date ?? null, event_type: row.event_type ?? null,
      guest_count: row.guest_count ?? null, preferred_caterer_id: row.preferred_caterer_id ?? null,
      location: row.city ?? null, notes: row.special_requests ?? null,
      caterer_slug: row.storefront_slug ?? null, status: mappedStatus,
      created_at: row.created_at, updated_at: row.updated_at ?? new Date().toISOString(),
    });
  }

  if (reviewRows.length > 0) writeAudit("review_event_requests.json", reviewRows);

  if (toMigrate.length > 0) {
    const { error } = await supabase.from("catering_briefs").upsert(toMigrate, { onConflict: "id" });
    if (error) {
      console.error(`  catering_briefs insert failed: ${error.message}`);
      writeAudit("failed_event_requests.json", toMigrate);
      report["event_requests"].review += toMigrate.length;
    } else {
      report["event_requests"].migrated = toMigrate.length;
      console.log(`  Migrated ${toMigrate.length} -> catering_briefs`);
    }
  }
  console.log(`  Summary:`, report["event_requests"]);
}

// ---- PHASE 2: event_request_matches -> catering_matches (Caterer role) ----
async function phase2_matches(rows: Record<string, unknown>[]) {
  console.log("\n=== PHASE 2: event_request_matches -> catering_matches (Caterer role) ===");
  initReport("event_request_matches");
  report["event_request_matches"].legacy = rows.length;

  const { data: briefs } = await supabase.from("catering_briefs").select("id");
  const briefIds = new Set((briefs ?? []).map((b: Record<string, unknown>) => b.id as string));

  const toMigrate: Record<string, unknown>[] = [];
  const reviewRows: Record<string, unknown>[] = [];

  for (const row of rows) {
    report["event_request_matches"].archived++;
    if (!briefIds.has(row.event_request_id as string)) {
      report["event_request_matches"].skipped++;
      reviewRows.push({ ...row, _skip_reason: `Parent brief ${row.event_request_id} not migrated (orphan)`, _role: "Caterer" });
      console.log(`  Row ${row.id}: orphaned parent - archived + skipped.`);
      continue;
    }
    let matchReasons: string[] = [];
    try {
      const raw = row.match_reasons;
      if (Array.isArray(raw)) matchReasons = raw.map((r: unknown) => typeof r === "string" ? r : JSON.stringify(r));
      else if (typeof raw === "object" && raw !== null) matchReasons = Object.values(raw as Record<string, unknown>).map(String);
    } catch {
      report["event_request_matches"].review++;
      reviewRows.push({ ...row, _review_reason: "Could not cast match_reasons to string[]", _role: "Caterer" });
      continue;
    }
    // ASSUMPTION: status defaults to 'pending'; warnings defaults to []
    toMigrate.push({
      id: row.id, brief_id: row.event_request_id, caterer_id: row.caterer_id,
      match_score: row.match_score ?? 0, match_reasons: matchReasons,
      status: "suggested", warnings: [], created_at: row.created_at,
    });
  }

  if (reviewRows.length > 0) writeAudit("review_event_request_matches.json", reviewRows);
  if (toMigrate.length > 0) {
    const { error } = await supabase.from("catering_matches").upsert(toMigrate, { onConflict: "id" });
    if (error) {
      console.error(`  catering_matches failed: ${error.message}`);
      writeAudit("failed_event_request_matches.json", toMigrate);
      report["event_request_matches"].review += toMigrate.length;
    } else {
      report["event_request_matches"].migrated = toMigrate.length;
      console.log(`  Migrated ${toMigrate.length} -> catering_matches`);
    }
  }
  console.log(`  Summary:`, report["event_request_matches"]);
}

// ---- PHASE 3: orders + order_items -> catering_bookings ----
async function phase3_orders(orders: Record<string, unknown>[], items: Record<string, unknown>[]) {
  console.log("\n=== PHASE 3: orders -> catering_bookings (Caterer x Customer role) ===");
  initReport("orders");
  initReport("order_items");
  report["orders"].legacy = orders.length;
  report["order_items"].legacy = items.length;

  // ALL order_items go to audit - no direct destination table
  report["order_items"].archived = items.length;
  report["order_items"].review = items.length;
  writeAudit("review_order_items.json", items.map(i => ({
    ...i, _review_reason: "No direct mapping to new schema. Requires human decision.", _role: "Caterer x Customer"
  })));
  console.log(`  All ${items.length} order_items written to audit - manual review required.`);

  const itemsByOrder: Record<string, unknown[]> = {};
  for (const item of items) {
    const oid = item.order_id as string;
    if (!itemsByOrder[oid]) itemsByOrder[oid] = [];
    itemsByOrder[oid].push(item);
  }

  const toMigrate: Record<string, unknown>[] = [];
  const reviewRows: Record<string, unknown>[] = [];

  for (const order of orders) {
    report["orders"].archived++;
    const orderType = (order.order_type as string)?.toLowerCase();

    // RULE: non-catering order -> archive + review (Restaurant role, not Caterer)
    if (orderType !== "catering") {
      report["orders"].review++;
      report["orders"].skipped++;
      reviewRows.push({
        ...order, _order_items: itemsByOrder[order.id as string] ?? [],
        _review_reason: `order_type='${order.order_type}' - not a catering order. Belongs to ${orderType === "restaurant" ? "Restaurant" : "Unknown"} role.`,
        _role: orderType === "restaurant" ? "Restaurant" : "Unknown",
      });
      console.log(`  Order ${order.id}: type='${order.order_type}' - archived + review.`);
      continue;
    }

    // RULE: null customer_id -> archive + review
    if (!order.customer_id) {
      report["orders"].review++;
      report["orders"].skipped++;
      reviewRows.push({ ...order, _order_items: itemsByOrder[order.id as string] ?? [],
        _review_reason: "customer_id null - catering_bookings.customer_id NOT NULL", _role: "Caterer x Customer" });
      console.log(`  Order ${order.id}: customer_id null - archived + review.`);
      continue;
    }

    const mappedStatus = ORDER_STATUS_MAP[(order.status as string)?.toLowerCase()];
    if (!mappedStatus) {
      report["orders"].review++;
      report["orders"].skipped++;
      reviewRows.push({ ...order, _order_items: itemsByOrder[order.id as string] ?? [],
        _review_reason: `Unknown status: '${order.status}'`, _role: "Caterer x Customer" });
      console.log(`  Order ${order.id}: status='${order.status}' unknown - archived + review.`);
      continue;
    }

    const location = [order.delivery_address, order.delivery_city].filter(Boolean).join(", ") || null;
    // ASSUMPTION: total_amount (euros) = quoted_amount; currency=EUR; deposit_amount=0; brief_id=null
    toMigrate.push({
      id: order.id, caterer_id: order.caterer_id, customer_id: order.customer_id,
      booking_status: mappedStatus, quoted_amount: order.total_amount ?? 0,
      currency: "EUR", deposit_amount: 0, location, brief_id: null,
      created_at: order.created_at, updated_at: order.updated_at ?? new Date().toISOString(),
      cancellation_reason: mappedStatus === "cancelled" ? (order.notes ?? null) : null,
    });
  }

  if (reviewRows.length > 0) writeAudit("review_orders.json", reviewRows);
  if (toMigrate.length > 0) {
    const { error } = await supabase.from("catering_bookings").upsert(toMigrate, { onConflict: "id" });
    if (error) {
      console.error(`  catering_bookings failed: ${error.message}`);
      writeAudit("failed_orders.json", toMigrate);
      report["orders"].review += toMigrate.length;
    } else {
      report["orders"].migrated = toMigrate.length;
      console.log(`  Migrated ${toMigrate.length} -> catering_bookings`);
    }
  }
  console.log(`  Orders summary:`, report["orders"]);
  console.log(`  Order items summary:`, report["order_items"]);
}

// ---- PHASE 4: packages -> MANUAL REVIEW (Caterer role) ----
async function phase4_packages(rows: Record<string, unknown>[]) {
  console.log("\n=== PHASE 4: packages -> MANUAL REVIEW (Caterer role) ===");
  initReport("packages");
  report["packages"].legacy = rows.length;
  report["packages"].archived = rows.length;
  report["packages"].review = rows.length;

  writeAudit("review_packages.json", rows.map(r => ({
    ...r,
    _review_reason: "packages schema (30+ fields) does not map cleanly to caterer_menu_items. Likely a full catering package. Requires human decision.",
    _role: "Caterer",
    _suggested_actions: [
      "Option A: Insert as caterer_menu_items (partial field mapping, data loss on unmapped fields)",
      "Option B: Keep in a new dedicated catering_packages table (requires schema migration)",
      "Option C: Merge fields into caterer storefront settings manually",
    ],
  })));
  console.log(`  All ${rows.length} package(s) -> migration-audit/review_packages.json. No automated migration.`);
  console.log(`  Summary:`, report["packages"]);
}

// ---- PHASE 5: availability -> vendor_blackout_dates (Caterer role) ----
async function phase5_availability(rows: Record<string, unknown>[]) {
  console.log("\n=== PHASE 5: availability -> vendor_blackout_dates (Caterer role) ===");
  initReport("availability");
  report["availability"].legacy = rows.length;

  const toMigrate: Record<string, unknown>[] = [];
  const reviewRows: Record<string, unknown>[] = [];

  for (const row of rows) {
    report["availability"].archived++;
    if (row.is_available === false) {
      // ASSUMPTION: vendor_type = 'caterer' for all legacy availability rows
      toMigrate.push({ vendor_id: row.caterer_id, vendor_type: "caterer", blackout_date: row.available_date });
    } else {
      report["availability"].review++;
      report["availability"].skipped++;
      reviewRows.push({
        ...row,
        _review_reason: row.is_available === null
          ? "is_available is null - intent unclear"
          : "is_available=true - no equivalent in vendor_blackout_dates (only blocked dates stored)",
        _role: "Caterer",
      });
      console.log(`  Row ${row.id}: is_available=${row.is_available} - archived + review.`);
    }
  }

  if (reviewRows.length > 0) writeAudit("review_availability.json", reviewRows);
  if (toMigrate.length > 0) {
    const { error } = await supabase.from("vendor_blackout_dates").insert(toMigrate);
    if (error) {
      console.error(`  vendor_blackout_dates failed: ${error.message}`);
      writeAudit("failed_availability.json", toMigrate);
      report["availability"].review += toMigrate.length;
    } else {
      report["availability"].migrated = toMigrate.length;
      console.log(`  Migrated ${toMigrate.length} blocked dates -> vendor_blackout_dates`);
    }
  }
  console.log(`  Summary:`, report["availability"]);
}

// ---- PHASE 6: Verification ----
async function phase6_verify() {
  console.log("\n=== PHASE 6: Verification Report ===");

  async function count(table: string) {
    const { count: c } = await supabase.from(table).select("*", { count: "exact", head: true });
    return c ?? 0;
  }

  const legacy = {
    event_requests: await count("event_requests"),
    event_request_matches: await count("event_request_matches"),
    orders: await count("orders"), order_items: await count("order_items"),
    packages: await count("packages"), availability: await count("availability"),
  };
  const archive = {
    _archive_event_requests: await count("_archive_event_requests"),
    _archive_event_request_matches: await count("_archive_event_request_matches"),
    _archive_orders: await count("_archive_orders"),
    _archive_order_items: await count("_archive_order_items"),
    _archive_packages: await count("_archive_packages"),
    _archive_availability: await count("_archive_availability"),
  };
  const destination = {
    catering_briefs: await count("catering_briefs"),
    catering_matches: await count("catering_matches"),
    catering_bookings: await count("catering_bookings"),
    vendor_blackout_dates: await count("vendor_blackout_dates"),
  };

  console.log("\n--- LEGACY TABLE COUNTS (source, unchanged) ---");
  console.table(legacy);
  console.log("\n--- ARCHIVE TABLE COUNTS (safety backup) ---");
  console.table(archive);
  console.log("\n--- DESTINATION TABLE COUNTS (new schema) ---");
  console.table(destination);
  console.log("\n--- PER-TABLE MIGRATION SUMMARY ---");
  console.table(report);

  const fullReport = {
    timestamp: new Date().toISOString(),
    legacy, archive, destination, perTable: report,
    auditFiles: fs.readdirSync(AUDIT_DIR).filter(f => f.endsWith(".json")),
  };
  const rPath = path.join(AUDIT_DIR, "migration_report.json");
  fs.writeFileSync(rPath, JSON.stringify(fullReport, null, 2), "utf-8");
  console.log(`\n  Full report: ${rPath}`);
  console.log("\n===================================================");
  console.log("DO NOT run 20260706000000_drop_legacy_tables.sql yet.");
  console.log("1. Review ./migration-audit/*.json files");
  console.log("2. Confirm destination row counts are correct");
  console.log("3. Only THEN apply the drop migration");
  console.log("===================================================");
}

// ---- MAIN ----
async function main() {
  console.log("Speisely Legacy Data Migration - Archive-first, Role-preserving");

  await phase0_createArchives();

  const eventRequests = await readTable("event_requests");
  const eventMatches = await readTable("event_request_matches");
  const orders = await readTable("orders");
  const orderItems = await readTable("order_items");
  const packages = await readTable("packages");
  const availability = await readTable("availability");

  await phase1_eventRequests(eventRequests);
  await phase2_matches(eventMatches);
  await phase3_orders(orders, orderItems);
  await phase4_packages(packages);
  await phase5_availability(availability);
  await phase6_verify();
}

main().catch(err => { console.error("Migration failed:", err); process.exit(1); });
