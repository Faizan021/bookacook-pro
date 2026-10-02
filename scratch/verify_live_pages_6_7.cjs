const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('Launching browser for Live Verification of Pages 6-7...');
  const browser = await chromium.launch({ headless: true });

  // Test 1: Desktop Viewport (1440 x 900)
  const pageDesktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  console.log('Testing Desktop 1440x900 on https://speisely.de/magazin/edition.html ...');
  await pageDesktop.goto('https://speisely.de/magazin/edition.html', { waitUntil: 'domcontentloaded' });
  await pageDesktop.waitForTimeout(3000);

  // Flip to Pages 6-7
  await pageDesktop.click('#btn-next');
  await pageDesktop.waitForTimeout(800);
  await pageDesktop.click('#btn-next');
  await pageDesktop.waitForTimeout(800);
  await pageDesktop.click('#btn-next');
  await pageDesktop.waitForTimeout(2000);

  await pageDesktop.screenshot({ path: path.join(__dirname, 'live_desktop_pages_06_07_de.png') });
  console.log('Saved scratch/live_desktop_pages_06_07_de.png');

  // Toggle to EN on Desktop
  await pageDesktop.click('#lang-btn-en');
  await pageDesktop.waitForTimeout(1000);
  await pageDesktop.screenshot({ path: path.join(__dirname, 'live_desktop_pages_06_07_en.png') });
  console.log('Saved scratch/live_desktop_pages_06_07_en.png');
  await pageDesktop.close();

  // Test 2: Laptop Viewport (1280 x 800) matching user's screen
  const pageLaptop = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  console.log('Testing Laptop 1280x800 on https://speisely.de/magazin/edition.html ...');
  await pageLaptop.goto('https://speisely.de/magazin/edition.html', { waitUntil: 'domcontentloaded' });
  await pageLaptop.waitForTimeout(3000);

  await pageLaptop.click('#btn-next');
  await pageLaptop.waitForTimeout(800);
  await pageLaptop.click('#btn-next');
  await pageLaptop.waitForTimeout(800);
  await pageLaptop.click('#btn-next');
  await pageLaptop.waitForTimeout(2000);

  await pageLaptop.screenshot({ path: path.join(__dirname, 'live_laptop_pages_06_07_de.png') });
  console.log('Saved scratch/live_laptop_pages_06_07_de.png');

  // Toggle to EN on Laptop
  await pageLaptop.click('#lang-btn-en');
  await pageLaptop.waitForTimeout(1000);
  await pageLaptop.screenshot({ path: path.join(__dirname, 'live_laptop_pages_06_07_en.png') });
  console.log('Saved scratch/live_laptop_pages_06_07_en.png');
  await pageLaptop.close();

  // Test 3: Embedded reader verification on https://speisely.de/magazin/reader
  const pageReader = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  console.log('Testing Live Reader embed on https://speisely.de/magazin/reader ...');
  await pageReader.goto('https://speisely.de/magazin/reader', { waitUntil: 'domcontentloaded' });
  await pageReader.waitForTimeout(2000);

  // Scroll to iframe to trigger load
  await pageReader.evaluate(() => {
    const iframe = document.querySelector('iframe');
    if (iframe) iframe.scrollIntoView({ behavior: 'instant', block: 'center' });
  });

  const iframeEl = await pageReader.$('iframe');
  const frame = await iframeEl.contentFrame();
  if (frame) {
    await frame.waitForLoadState('load');
    await frame.waitForSelector('#flipbook', { timeout: 30000 });
    await pageReader.waitForTimeout(2000);

    // Flip to Pages 6-7 inside embedded reader
    await frame.click('#btn-next');
    await pageReader.waitForTimeout(800);
    await frame.click('#btn-next');
    await pageReader.waitForTimeout(800);
    await frame.click('#btn-next');
    await pageReader.waitForTimeout(2000);

    await pageReader.screenshot({ path: path.join(__dirname, 'live_reader_pages_06_07_verified.png') });
    console.log('Saved scratch/live_reader_pages_06_07_verified.png');
  }

  await browser.close();
  console.log('Live Verification completed successfully!');
})();
