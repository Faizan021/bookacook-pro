const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  console.log('Navigating to https://speisely.de/magazin/reader...');
  await page.goto('https://speisely.de/magazin/reader', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Scroll to iframe so lazy-loading triggers immediately
  console.log('Scrolling to iframe...');
  await page.evaluate(() => {
    const iframe = document.querySelector('iframe');
    if (iframe) iframe.scrollIntoView({ behavior: 'instant', block: 'center' });
  });

  await page.waitForTimeout(3000);

  const iframeElement = await page.$('iframe');
  const frame = await iframeElement.contentFrame();
  if (!frame) {
    console.error('No content frame found!');
    await browser.close();
    process.exit(1);
  }

  console.log('Waiting for frame to load...');
  await frame.waitForLoadState('load');
  console.log('Frame loaded. Waiting for #flipbook inside iframe...');
  await frame.waitForSelector('#flipbook', { timeout: 30000 });
  await page.waitForTimeout(3000);

  // Take screenshot of embedded reader
  await page.screenshot({ path: path.join(__dirname, 'verified_reader_embed.png') });
  console.log('Saved scratch/verified_reader_embed.png');

  // Flip to Pages 2-3 (which the user reported clipped)
  console.log('Flipping to Pages 2-3...');
  await frame.click('#btn-next');
  await page.waitForTimeout(2000);

  // Take screenshot of Pages 2-3 in DE
  await page.screenshot({ path: path.join(__dirname, 'verified_pages_02_03_de.png') });
  console.log('Saved scratch/verified_pages_02_03_de.png');

  // Toggle language to EN
  console.log('Toggling to EN...');
  await frame.click('#lang-btn-en');
  await page.waitForTimeout(1000);

  // Take screenshot of Pages 2-3 in EN
  await page.screenshot({ path: path.join(__dirname, 'verified_pages_02_03_en.png') });
  console.log('Saved scratch/verified_pages_02_03_en.png');

  // Flip forward to Pages 6-7 (Features)
  console.log('Flipping to Pages 6-7 in EN...');
  await frame.click('#btn-next');
  await page.waitForTimeout(1000);
  await frame.click('#btn-next');
  await page.waitForTimeout(2000);

  await page.screenshot({ path: path.join(__dirname, 'verified_pages_06_07_en.png') });
  console.log('Saved scratch/verified_pages_06_07_en.png');

  // Flip forward to Pages 8-9 (Community & Tech)
  console.log('Flipping to Pages 8-9 in EN...');
  await frame.click('#btn-next');
  await page.waitForTimeout(2000);

  await page.screenshot({ path: path.join(__dirname, 'verified_pages_08_09_en.png') });
  console.log('Saved scratch/verified_pages_08_09_en.png');

  await browser.close();
  console.log('All QA screenshots captured and verified!');
})();
