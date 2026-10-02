const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 850 } });
  
  // Test local static file directly
  const filePath = 'file:///' + path.resolve(__dirname, '../public/speisely-magazin-edition.html').replace(/\\/g, '/');
  console.log('Navigating to', filePath);
  await page.goto(filePath, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Flip to Pages 6-7
  console.log('Flipping to Pages 6-7...');
  await page.click('#btn-next');
  await page.waitForTimeout(800);
  await page.click('#btn-next');
  await page.waitForTimeout(800);
  await page.click('#btn-next');
  await page.waitForTimeout(1500);

  await page.screenshot({ path: path.join(__dirname, 'qa_pages_06_07_verified_de.png') });
  console.log('Saved scratch/qa_pages_06_07_verified_de.png');

  // Toggle to EN
  await page.click('#lang-btn-en');
  await page.waitForTimeout(800);

  await page.screenshot({ path: path.join(__dirname, 'qa_pages_06_07_verified_en.png') });
  console.log('Saved scratch/qa_pages_06_07_verified_en.png');

  await browser.close();
})();
