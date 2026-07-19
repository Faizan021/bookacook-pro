const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log("=== Checking Database Schema for Surplus Offers ===");

  // 1. Verify table exists by fetching 1 row
  console.log("\n1. Querying surplus_offers table...");
  const { data: offers, error: offersErr } = await supabase
    .from('surplus_offers')
    .select('*')
    .limit(1);

  if (offersErr) {
    if (offersErr.message.includes("does not exist") || offersErr.status === 404) {
      console.warn("⚠️  Table 'surplus_offers' does not exist in the database yet. This is expected if the migration has not been applied.");
    } else {
      console.error("❌ Unexpected error querying table:", offersErr.message);
    }
  } else {
    console.log("✅ Table 'surplus_offers' exists!");
    console.log("   Existing offers count in query limit:", offers ? offers.length : 0);
  }

  // 2. Query Postgres RPC functions from catalog
  console.log("\n2. Checking PostgreSQL RPC Functions...");

  // Let's call create_surplus_offer_with_lock with invalid UUID to test signature match
  const { error: lockErr } = await supabase.rpc('create_surplus_offer_with_lock', {
    p_restaurant_id: '00000000-0000-0000-0000-000000000000',
    p_menu_item_id: '00000000-0000-0000-0000-000000000000',
    p_item_name: 'test',
    p_original_price_cents: 1000,
    p_surplus_price_cents: 500,
    p_initial_quantity: 5,
    p_start_time: new Date().toISOString(),
    p_end_time: new Date(Date.now() + 3600000).toISOString(),
    p_fulfillment_mode: 'pickup',
    p_daily_limit: 1
  });

  if (lockErr) {
    if (lockErr.message.includes("function") && lockErr.message.includes("does not exist")) {
      console.warn("⚠️  RPC function 'create_surplus_offer_with_lock' does not exist in the database yet.");
    } else {
      console.log("✅ RPC function 'create_surplus_offer_with_lock' exists! (returned code:", lockErr.code, "-", lockErr.message, ")");
    }
  } else {
    console.log("✅ RPC function 'create_surplus_offer_with_lock' exists and returned success!");
  }

  // Check decrement_surplus_stock RPC function
  const { error: decErr } = await supabase.rpc('decrement_surplus_stock', {
    p_offer_id: '00000000-0000-0000-0000-000000000000',
    p_quantity_to_buy: 1
  });

  if (decErr) {
    if (decErr.message.includes("function") && decErr.message.includes("does not exist")) {
      console.warn("⚠️  RPC function 'decrement_surplus_stock' does not exist in the database yet.");
    } else {
      console.log("✅ RPC function 'decrement_surplus_stock' exists! (returned code:", decErr.code, "-", decErr.message, ")");
    }
  } else {
    console.log("✅ RPC function 'decrement_surplus_stock' exists and returned success!");
  }
}

checkSchema().catch(console.error);
