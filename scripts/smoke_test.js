import https from "node:https";

const BASE_URL = process.env.PRODUCTION_URL || "https://speisely.de";

async function fetchUrl(urlPath, options = {}) {
  const fullUrl = `${BASE_URL}${urlPath}`;
  console.log(`[Smoke Test] Checking: ${fullUrl}...`);

  return new Promise((resolve, reject) => {
    const req = https.get(fullUrl, { timeout: 15000, ...options }, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });

    req.on("error", (err) => reject(err));
    req.on("timeout", () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${fullUrl}`));
    });
  });
}

async function runSmokeTest() {
  console.log(`\n==============================================`);
  console.log(`🔥 RUNNING SPEISELY PRODUCTION SMOKE TEST 🔥`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`==============================================\n`);

  let failures = 0;

  // Test 1: Production Root URL returns 200
  try {
    const rootRes = await fetchUrl("/");
    if (rootRes.status === 200) {
      console.log(`✅ [PASS] Homepage HTTP status 200 OK`);
    } else {
      console.error(`❌ [FAIL] Homepage returned HTTP status ${rootRes.status}`);
      failures++;
    }

    // Verify Homepage DOM content loads and contains key brand terms
    if (rootRes.body.includes("Speisely") && !rootRes.body.includes("Something went wrong on our end")) {
      console.log(`✅ [PASS] Homepage DOM content contains brand signature & clean render marker`);
    } else {
      console.error(`❌ [FAIL] Homepage contains error markers or missing brand payload`);
      failures++;
    }
  } catch (err) {
    console.error(`❌ [FAIL] Homepage fetch failed:`, err.message);
    failures++;
  }

  // Test 2: Public Storefront Route (/catering) loads cleanly
  try {
    const catRes = await fetchUrl("/catering");
    if (catRes.status === 200) {
      console.log(`✅ [PASS] Public Storefront (/catering) HTTP status 200 OK`);
    } else {
      console.error(`❌ [FAIL] Public Storefront returned HTTP status ${catRes.status}`);
      failures++;
    }
  } catch (err) {
    console.error(`❌ [FAIL] Public Storefront fetch failed:`, err.message);
    failures++;
  }

  // Test 3: Protected Dashboard Route (/restaurant) returns 200/302 auth shell or redirect
  try {
    const dashRes = await fetchUrl("/restaurant");
    if (dashRes.status === 200 || dashRes.status === 302 || dashRes.status === 307) {
      console.log(`✅ [PASS] Dashboard route (/restaurant) returned expected status ${dashRes.status} (Auth Guard Shell active)`);
    } else {
      console.error(`❌ [FAIL] Dashboard route returned status ${dashRes.status}`);
      failures++;
    }
  } catch (err) {
    console.error(`❌ [FAIL] Dashboard route fetch failed:`, err.message);
    failures++;
  }

  // Test 4: Crash Marker Check (no unhandled SSR exception markers)
  try {
    const testRes = await fetchUrl("/contact");
    if (!testRes.body.includes("h3 swallowed SSR error") && !testRes.body.includes('"unhandled":true')) {
      console.log(`✅ [PASS] No catastrophic SSR crash markers detected`);
    } else {
      console.error(`❌ [FAIL] Catastrophic SSR error marker found on /contact`);
      failures++;
    }
  } catch (err) {
    console.error(`❌ [FAIL] Contact page check failed:`, err.message);
    failures++;
  }

  console.log(`\n==============================================`);
  if (failures === 0) {
    console.log(`🎉 SMOKE TEST PASSED! All 4 production checks healthy.`);
    console.log(`==============================================\n`);
    process.exit(0);
  } else {
    console.error(`🚨 SMOKE TEST FAILED with ${failures} failure(s).`);
    console.log(`==============================================\n`);
    process.exit(1);
  }
}

runSmokeTest().catch((err) => {
  console.error("Unhandled smoke test exception:", err);
  process.exit(1);
});
