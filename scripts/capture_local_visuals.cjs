const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, '../scratch/visual_audit');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const fileUrl = 'file:///' + path.resolve(__dirname, '../public/speisely-magazin-edition.html').replace(/\\/g, '/');
  
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // 1. Cover
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'local_01_cover.png') });
  console.log('✓ Captured local_01_cover.png');

  // 2. Spread 2-3
  await page.click('#btn-next');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'local_02_spread_02_03.png') });
  console.log('✓ Captured local_02_spread_02_03.png');

  // 3. Spread 4-5
  await page.click('#btn-next');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'local_03_spread_04_05.png') });
  console.log('✓ Captured local_03_spread_04_05.png');

  // 4. Spread 6-7
  await page.click('#btn-next');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'local_04_spread_06_07.png') });
  console.log('✓ Captured local_04_spread_06_07.png');

  // 5. Spread 8-9
  await page.click('#btn-next');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'local_05_spread_08_09.png') });
  console.log('✓ Captured local_05_spread_08_09.png');

  // 6. Page 10 (Back Cover)
  await page.click('#btn-next');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'local_06_page_10_back.png') });
  console.log('✓ Captured local_06_page_10_back.png');

  await browser.close();
})();
