const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  const fileUrl = 'file:///' + path.resolve(__dirname, '..', 'public', 'speisely-magazin-edition.html').replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Flip to Spread 02-03 via btn-next
  await page.click('#btn-next');
  await page.waitForTimeout(1000);

  // Check overflow on Page 2
  const page2Metrics = await page.evaluate(() => {
    const pages = document.querySelectorAll('.page');
    const p2 = pages[1]; // Page 2 is index 1
    const content = p2.querySelector('.page-content');
    return {
      p2ClientHeight: p2.clientHeight,
      p2ScrollHeight: p2.scrollHeight,
      contentClientHeight: content ? content.clientHeight : null,
      contentScrollHeight: content ? content.scrollHeight : null,
      hasOverflow: p2.scrollHeight > p2.clientHeight || (content && content.scrollHeight > content.clientHeight)
    };
  });
  console.log('Page 2 Metrics (German):', JSON.stringify(page2Metrics, null, 2));

  // Take screenshot of spread 02-03 in German
  const spreadElem = await page.$('#flipbook');
  if (spreadElem) {
    await spreadElem.screenshot({ path: path.join(__dirname, '..', 'public', 'page2_page3_pro_spread_de.png') });
    console.log('Captured public/page2_page3_pro_spread_de.png');
  }

  // Switch to English
  await page.evaluate(() => {
    document.getElementById('lang-btn-en').click();
  });
  await page.waitForTimeout(800);

  const page2MetricsEn = await page.evaluate(() => {
    const pages = document.querySelectorAll('.page');
    const p2 = pages[1];
    const content = p2.querySelector('.page-content');
    return {
      p2ClientHeight: p2.clientHeight,
      p2ScrollHeight: p2.scrollHeight,
      contentClientHeight: content ? content.clientHeight : null,
      contentScrollHeight: content ? content.scrollHeight : null,
      hasOverflow: p2.scrollHeight > p2.clientHeight || (content && content.scrollHeight > content.clientHeight)
    };
  });
  console.log('Page 2 Metrics (English):', JSON.stringify(page2MetricsEn, null, 2));

  // Take screenshot of spread 02-03 in English
  if (spreadElem) {
    await spreadElem.screenshot({ path: path.join(__dirname, '..', 'public', 'page2_page3_pro_spread_en.png') });
    console.log('Captured public/page2_page3_pro_spread_en.png');
  }

  // Close-up of Page 2 alone
  const pages = await page.$$('.page');
  if (pages[1]) {
    await pages[1].screenshot({ path: path.join(__dirname, '..', 'public', 'page2_speisely_pro_new_ad_en.png') });
    console.log('Captured public/page2_speisely_pro_new_ad_en.png');
  }

  await browser.close();
  console.log('Verification completed successfully!');
})();
