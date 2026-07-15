import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

// CloudPRNT endpoint - defaults to local Vite server, override via env for staging/prod
const SERVER_URL = process.env.CLOUDPRNT_SERVER_URL || "http://localhost:8080/api/print/star";
const PRINTER_MAC = "AA:BB:CC:11:22:33"; // Simulator MAC
const RESTAURANT_ID = "21b79ce4-e0b6-4df0-b2cc-37eb872a9ab9"; // Test restaurant

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

async function setupTestData() {
  if (!supabase) return;
  console.log("🛠️  Setting up test data...");

  // 1. Get any restaurant
  const { data: restaurant } = await supabase.from("restaurants").select("id").limit(1).single();
  if (!restaurant) {
    console.log("❌ No restaurant found in DB.");
    return;
  }
  const rId = restaurant.id;

  // 2. Register printer
  await supabase.from("restaurant_printers").upsert({
    restaurant_id: rId,
    mac_address: PRINTER_MAC,
    status: "offline",
    poll_interval_seconds: 5,
  }, { onConflict: "restaurant_id" });
  console.log(`✅ Registered printer ${PRINTER_MAC} to restaurant ${rId}`);

  // 3. Insert a mock order and print job
  const mockOrderId = crypto.randomUUID();
  await supabase.from("restaurant_orders").insert({
    id: mockOrderId,
    restaurant_id: rId,
    status: "confirmed",
    customer_email: "simulator@speisely.com",
    customer_first_name: "Sim",
    customer_last_name: "Tester",
    total_amount: 15.50,
    items: [{ name: "Test Schnitzel", price: 15.50, quantity: 1 }]
  });

  await supabase.from("restaurant_print_jobs").insert({
    order_id: mockOrderId,
    restaurant_id: rId,
    status: "pending",
  });
  console.log(`✅ Inserted pending print job for mock order ${mockOrderId}`);
}

async function simulateCloudPRNT() {
  console.log(`\n🖨️  Starting CloudPRNT Simulator loop for MAC: ${PRINTER_MAC}\n`);
  
  // Single pass loop for the test to ensure we test it immediately, then exit after success.
  let cycles = 0;
  
  const poll = async () => {
    cycles++;
    if (cycles > 5) {
       console.log("❌ Simulator timed out waiting for job.");
       process.exit(1);
    }

    try {
      console.log(`[Cycle ${cycles}] 📡 Polling POST ${SERVER_URL}...`);
      
      const postRes = await fetch(SERVER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          printerMAC: PRINTER_MAC,
          statusCode: "",
          clientAction: null,
          printingInProgress: false
        })
      });

      if (!postRes.ok) {
        console.log(`❌ POST failed: ${postRes.status} ${await postRes.text()}`);
        setTimeout(poll, 3000);
        return;
      }

      const postData = await postRes.json();
      console.log(`✅ POST Response:`, postData);

      if (postData.jobReady && postData.jobToken) {
        const jobToken = postData.jobToken;
        console.log(`\n📄 Job Ready! Fetching print data for token: ${jobToken}...`);
        
        // GET
        const getRes = await fetch(`${SERVER_URL}?jobToken=${jobToken}`, {
          method: "GET"
        });

        if (!getRes.ok) {
          console.log(`❌ GET failed: ${getRes.status} ${await getRes.text()}`);
          process.exit(1);
        }
        
        const contentType = getRes.headers.get("content-type");
        const arrayBuffer = await getRes.arrayBuffer();
        console.log(`✅ GET Response: Received ${arrayBuffer.byteLength} bytes of ${contentType}`);
        
        // Simulate printing delay
        console.log("🖨️  Simulating 2 seconds of printing...");
        await new Promise(r => setTimeout(r, 2000));
        
        // DELETE
        console.log(`\n🗑️  Confirming job printed with DELETE for token: ${jobToken}...`);
        const delRes = await fetch(`${SERVER_URL}?jobToken=${jobToken}`, {
          method: "DELETE"
        });

        if (!delRes.ok) {
          console.log(`❌ DELETE failed: ${delRes.status} ${await delRes.text()}`);
          process.exit(1);
        }
        console.log(`✅ DELETE Response: Job ${jobToken} successfully completed.`);
        console.log(`🎉 Simulator test passed successfully!`);
        process.exit(0);
      } else {
        // No job ready, poll again
        setTimeout(poll, 3000);
      }
    } catch (e) {
      console.error(`❌ Network error:`, e);
      setTimeout(poll, 3000);
    }
  };

  poll();
}

async function run() {
  await setupTestData();
  await simulateCloudPRNT();
}

run();
