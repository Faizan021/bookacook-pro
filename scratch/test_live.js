import { chromium } from "@playwright/test";

async function main() {
  console.log("Launching headless browser...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on("pageerror", (err) => {
    console.error("\n>>> PAGE EXCEPTION BOUNDARY CRASH:");
    console.error(err.stack || err.message);
  });

  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") {
      console.log(`[Console ${msg.type().toUpperCase()}]: ${msg.text()}`);
    }
  });

  console.log("Navigating to https://speisely.de/...");
  try {
    await page.goto("https://speisely.de/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);
    console.log("Successfully navigated. Page title:", await page.title());
  } catch (e) {
    console.error("Navigation failed:", e);
  }

  await browser.close();
}

main().catch(console.error);
