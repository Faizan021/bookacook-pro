const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  
  page.on('console', msg => console.log('PAGE CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('https://speisely.de/magazin/reader', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const frames = page.frames();
  console.log('Total page frames:', frames.length);
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    console.log(`Frame ${i}: url=${f.url()}`);
    try {
      const html = await f.content();
      console.log(`Frame ${i} html length:`, html.length);
      console.log(`Frame ${i} title/body preview:`, html.slice(0, 300));
    } catch (e) {
      console.log(`Frame ${i} content error:`, e.message);
    }
  }

  await browser.close();
})();
