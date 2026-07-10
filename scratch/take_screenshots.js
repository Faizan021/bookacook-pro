import { chromium } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const ARTIFACT_DIR =
  "C:/Users/ahmad/.gemini/antigravity/brain/372ead1d-4ca2-4bb7-bc70-5bfca3efade5";
const BASE_URL = "https://speisely.de";

const PAGES = [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "contact", path: "/contact" },
  { name: "partners", path: "/partners" },
  { name: "instant_order", path: "/instant-order" },
  { name: "catering", path: "/catering" },
  { name: "planner", path: "/planner" },
];

async function capture() {
  console.log(`Starting screenshot capture for ${BASE_URL}...`);
  if (!fs.existsSync(ARTIFACT_DIR)) {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });

  for (const pageInfo of PAGES) {
    const url = `${BASE_URL}${pageInfo.path}`;
    console.log(`\nProcessing Page: ${pageInfo.name} (${url})`);

    // 1. Desktop Viewport (1280x800)
    {
      const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();

      console.log(`[Desktop] Navigating to ${url}...`);
      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForTimeout(3000); // Allow full rendering

      // Unscrolled
      const unscrolledPath = path.join(ARTIFACT_DIR, `desktop_unscrolled_${pageInfo.name}.png`);
      await page.screenshot({ path: unscrolledPath });
      console.log(`Saved: ${unscrolledPath}`);

      // Scrolled
      console.log(`[Desktop] Scrolling page...`);
      await page.evaluate(() => window.scrollTo(0, 150));
      await page.waitForTimeout(1000); // Allow header transition

      const scrolledPath = path.join(ARTIFACT_DIR, `desktop_scrolled_${pageInfo.name}.png`);
      await page.screenshot({ path: scrolledPath });
      console.log(`Saved: ${scrolledPath}`);

      await context.close();
    }

    // 2. Mobile Viewport (390x844 - iPhone 12 Pro style)
    {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
        isMobile: true,
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
      });
      const page = await context.newPage();

      console.log(`[Mobile] Navigating to ${url}...`);
      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForTimeout(3000); // Allow full rendering

      // Unscrolled
      const unscrolledPath = path.join(ARTIFACT_DIR, `mobile_unscrolled_${pageInfo.name}.png`);
      await page.screenshot({ path: unscrolledPath });
      console.log(`Saved: ${unscrolledPath}`);

      // Scrolled
      console.log(`[Mobile] Scrolling page...`);
      await page.evaluate(() => window.scrollTo(0, 150));
      await page.waitForTimeout(1000); // Allow header transition

      const scrolledPath = path.join(ARTIFACT_DIR, `mobile_scrolled_${pageInfo.name}.png`);
      await page.screenshot({ path: scrolledPath });
      console.log(`Saved: ${scrolledPath}`);

      await context.close();
    }
  }

  await browser.close();
  console.log("\nAll screenshots captured successfully!");
}

capture().catch((err) => {
  console.error("Error during screenshot capture:", err);
  process.exit(1);
});
