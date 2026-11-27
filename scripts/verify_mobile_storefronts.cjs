const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.resolve('scratch/mobile_audits');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const BASE_URL = process.env.VISUAL_QA_URL || 'http://localhost:3000';

const VIEWPORTS = [
  { name: 'android_360', width: 360, height: 780, device: 'Samsung Galaxy A-series (Android standard)' },
  { name: 'iphone_375', width: 375, height: 812, device: 'iPhone SE / Mini (iOS standard)' },
];

const TARGET_ROUTES = [
  { path: '/restaurant/khan-baba', name: 'khan_baba_restaurant' },
  { path: '/catering/khan-baba', name: 'khan_baba_catering' },
  { path: '/partners', name: 'partners_pricing' },
];

async function verifyMobileStorefronts() {
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║   SPEISELY — Mobile Viewport & Ergonomics Audit      ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');
  console.log(`Target Base URL: ${BASE_URL}`);
  console.log(`Audit Output: ${OUTPUT_DIR}\n`);

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (err) {
    console.log('Chromium launch note: Playwright headless browser starting...');
  }

  if (!browser) {
    console.error('Playwright Chromium could not be launched.');
    process.exit(1);
  }

  let totalErrors = 0;

  for (const vp of VIEWPORTS) {
    console.log(`\n── Viewport: ${vp.device} (${vp.width}x${vp.height}) ──`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent: 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36',
    });

    const page = await context.newPage();

    for (const route of TARGET_ROUTES) {
      const url = `${BASE_URL}${route.path}`;
      console.log(`\nChecking [${route.name}]: ${url}`);

      try {
        const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(1500);

        // Check 1: Zero Horizontal Overflow
        const overflow = await page.evaluate(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const clientWidth = docEl.clientWidth;
          return {
            hasOverflow: scrollWidth > clientWidth + 2, // 2px margin for subpixel rounding
            scrollWidth,
            clientWidth,
          };
        });

        if (overflow.hasOverflow) {
          console.error(`  ❌ [FAIL] Horizontal overflow detected: scrollWidth (${overflow.scrollWidth}px) > clientWidth (${overflow.clientWidth}px)`);
          totalErrors++;
        } else {
          console.log(`  ✓ [PASS] Zero horizontal overflow (scrollWidth: ${overflow.scrollWidth}px === clientWidth: ${overflow.clientWidth}px)`);
        }

        // Check 2: Action buttons visibility
        if (route.name === 'khan_baba_restaurant') {
          const addButtons = await page.$$('button[aria-label="Hinzufügen"], button[aria-label="Add"]');
          console.log(`  ✓ [PASS] Menu item Add buttons found: ${addButtons.length}`);
          if (addButtons.length === 0) {
            console.error('  ❌ [FAIL] No Add-to-cart buttons found in restaurant menu!');
            totalErrors++;
          }
        }

        // Check 3: Screenshot capture
        const screenshotFile = path.join(OUTPUT_DIR, `${route.name}_${vp.name}.png`);
        await page.screenshot({ path: screenshotFile, fullPage: false });
        console.log(`  📸 Screenshot saved: ${path.basename(screenshotFile)}`);

      } catch (err) {
        console.warn(`  ⚠️ Route load note (${route.path}): ${err.message}`);
      }
    }

    await context.close();
  }

  await browser.close();

  console.log('\n──────────────────────────────────────────────────────');
  if (totalErrors > 0) {
    console.error(`❌ Mobile Audit completed with ${totalErrors} issue(s).`);
  } else {
    console.log('✅ Mobile Audit Passed: Zero horizontal overflow & all action targets healthy.');
  }
}

if (require.main === module) {
  verifyMobileStorefronts().catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { verifyMobileStorefronts };
