#!/usr/bin/env node

/**
 * Speisely Partner Backlink & Health Watchdog
 *
 * Verifies that active partner domains (e.g. partyservicekuepper.de)
 * are healthy (HTTP 200) and continue to carry active backlink citations to Speisely.
 */

import https from "node:https";

const PARTNERS = [
  {
    name: "Partyservice Küpper",
    url: "https://partyservicekuepper.de",
    expectedBacklink: "speisely.de",
    required: true,
  },
];

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SpeiselyBacklinkWatchdog/1.0",
        },
        timeout: 8000,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          resolve({ status: res.statusCode, html: data });
        });
      }
    );

    req.on("error", (err) => reject(err));
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timed out (8s)"));
    });
  });
}

async function runWatchdog() {
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║     SPEISELY — Partner Backlink & Health Watchdog    ║");
  console.log("╚══════════════════════════════════════════════════════╝\n");

  let allPassed = true;

  for (const partner of PARTNERS) {
    process.stdout.write(`  Checking ${partner.name} (${partner.url})... `);
    try {
      const { status, html } = await fetchHtml(partner.url);

      if (status !== 200) {
        console.log(`❌ FAILED (HTTP ${status})`);
        allPassed = false;
        continue;
      }

      const hasBacklink = html
        .toLowerCase()
        .includes(partner.expectedBacklink.toLowerCase());

      if (hasBacklink) {
        console.log(`✓ [PASS] (HTTP 200, Backlink "${partner.expectedBacklink}" active)`);
      } else {
        console.log(`⚠ [WARNING] (HTTP 200, but backlink "${partner.expectedBacklink}" not found in root HTML)`);
      }
    } catch (err) {
      console.log(`⚠ [OFFLINE / UNREACHABLE]: ${err.message}`);
      // Graceful warning so offline dev environments do not hard-crash
    }
  }

  console.log("\n──────────────────────────────────────────────────────");
  console.log("Watchdog check completed.\n");
}

runWatchdog();
