const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('Launching browser for Visual QA...');
  const browser = await chromium.launch({ headless: true });
  
  // Test 1: Laptop viewport (1280x800) matching user's screen
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  console.log('Navigating to https://speisely.de/magazin/reader ...');
  await page.goto('https://speisely.de/magazin/reader', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(4000);

  // Take screenshot of reader shell
  await page.screenshot({ path: path.join(__dirname, 'qa_live_reader_laptop.png') });
  console.log('Saved qa_live_reader_laptop.png');

  // Locate the iframe
  const iframeElement = await page.$('iframe');
  if (!iframeElement) {
    console.error('ERROR: No iframe found on /magazin/reader!');
    await browser.close();
    process.exit(1);
  }
  const frame = await iframeElement.contentFrame();
  if (!frame) {
    console.error('ERROR: Could not access iframe content frame!');
    await browser.close();
    process.exit(1);
  }

  console.log('Iframe loaded successfully.');
  await frame.waitForSelector('#flipbook', { timeout: 15000 });
  await page.waitForTimeout(1500);

  // Take screenshot of cover in auto-fit
  await page.screenshot({ path: path.join(__dirname, 'qa_live_cover_autofit.png') });

  // Navigate to Pages 2-3 (the ones user reported clipped)
  console.log('Flipping to Pages 2-3...');
  await frame.click('#btn-next');
  await page.waitForTimeout(1800);

  // Take screenshot of Pages 2-3 in DE
  await page.screenshot({ path: path.join(__dirname, 'qa_live_pages_02_03_de.png') });
  console.log('Saved qa_live_pages_02_03_de.png');

  // Test language toggle: Click EN
  console.log('Clicking EN language switcher...');
  await frame.click('#lang-btn-en');
  await page.waitForTimeout(800);

  // Check data-lang on body
  const bodyLang = await frame.$eval('body', el => el.getAttribute('data-lang'));
  console.log('Body data-lang after clicking EN:', bodyLang);

  // Take screenshot of Pages 2-3 in EN
  await page.screenshot({ path: path.join(__dirname, 'qa_live_pages_02_03_en.png') });
  console.log('Saved qa_live_pages_02_03_en.png');

  // Test flipping forward to Pages 6-7 (features) in EN
  await frame.click('#btn-next');
  await page.waitForTimeout(1000);
  await frame.click('#btn-next');
  await page.waitForTimeout(1800);

  await page.screenshot({ path: path.join(__dirname, 'qa_live_pages_06_07_en.png') });
  console.log('Saved qa_live_pages_06_07_en.png');

  // Toggle back to DE
  await frame.click('#lang-btn-de');
  await page.waitForTimeout(800);
  const bodyLangDE = await frame.$eval('body', el => el.getAttribute('data-lang'));
  console.log('Body data-lang after clicking DE:', bodyLangDE);

  await page.screenshot({ path: path.join(__dirname, 'qa_live_pages_06_07_de.png') });
  console.log('Saved qa_live_pages_06_07_de.png');

  await browser.close();
  console.log('Visual QA completed successfully!');
})();
