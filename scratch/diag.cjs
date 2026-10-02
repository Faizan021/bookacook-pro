const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('https://speisely.de/magazin/reader', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const iframes = await page.$$('iframe');
  console.log('Total iframes found:', iframes.length);
  for (let i = 0; i < iframes.length; i++) {
    const src = await iframes[i].getAttribute('src');
    console.log(`iframe[${i}] src:`, src);
  }

  // Also navigate directly to https://speisely.de/magazin/edition.html
  console.log('Navigating directly to edition.html...');
  const page2 = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page2.on('console', msg => console.log('EDITION LOG:', msg.text()));
  page2.on('pageerror', err => console.log('EDITION ERROR:', err.message));
  
  await page2.goto('https://speisely.de/magazin/edition.html', { waitUntil: 'domcontentloaded' });
  await page2.waitForTimeout(3000);
  
  const hasFlipbook = await page2.$('#flipbook');
  console.log('Direct edition has #flipbook:', !!hasFlipbook);

  await page2.screenshot({ path: 'scratch/direct_edition_test.png' });
  console.log('Saved scratch/direct_edition_test.png');

  await browser.close();
})();
