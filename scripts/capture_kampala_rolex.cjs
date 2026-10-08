const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, '../scratch/kampala_rolex');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  // 1. Desktop Viewport (1440x900)
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const url = 'http://localhost:8080/catering/kampala-rolex-germany';
  
  console.log('Navigating to', url);
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  } catch (e) {
    console.log('Falling back without networkidle');
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  }
  await page.waitForTimeout(2000);

  // Capture Hero & Trust Bar
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01_desktop_hero.png') });
  console.log('✓ Captured 01_desktop_hero.png');

  // Capture About Section with new 2-column layout
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01b_desktop_about.png') });
  console.log('✓ Captured 01b_desktop_about.png');

  // Scroll to Live Station Spotlight
  const liveStationEl = await page.$('#live-station');
  if (liveStationEl) {
    await liveStationEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '02a_desktop_live_station.png') });
    console.log('✓ Captured 02a_desktop_live_station.png');
  }

  // Scroll to Packages
  const packagesEl = await page.$('#packages');
  if (packagesEl) {
    await packagesEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '02_desktop_packages.png') });
    console.log('✓ Captured 02_desktop_packages.png');
  }

  // Scroll to Gallery
  const galleryEl = await page.$('#gallery');
  if (galleryEl) {
    await galleryEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '03_desktop_gallery.png') });
    console.log('✓ Captured 03_desktop_gallery.png');
  }

  // Scroll to Menu
  const menuEl = await page.$('#menu');
  if (menuEl) {
    await menuEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '04_desktop_menu.png') });
    console.log('✓ Captured 04_desktop_menu.png');
  }

  // Scroll to FAQ
  const faqEl = await page.$('#faq');
  if (faqEl) {
    await faqEl.scrollIntoViewIfNeeded();
    // Open first FAQ item to inspect expansion
    const firstDetails = await page.$('#faq details');
    if (firstDetails) {
      await firstDetails.click();
    }
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '04b_desktop_faq.png') });
    console.log('✓ Captured 04b_desktop_faq.png');
  }

  // 2. Mobile Viewport (390x844 iPhone 13)
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  try {
    await mobilePage.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  } catch (e) {
    await mobilePage.goto(url, { waitUntil: 'load', timeout: 30000 });
  }
  await mobilePage.waitForTimeout(2000);
  await mobilePage.screenshot({ path: path.join(OUTPUT_DIR, '05_mobile_hero.png') });
  console.log('✓ Captured 05_mobile_hero.png');

  await mobilePage.evaluate(() => window.scrollBy(0, 480));
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: path.join(OUTPUT_DIR, '05b_mobile_about.png') });
  console.log('✓ Captured 05b_mobile_about.png');

  const mobilePkg = await mobilePage.$('#packages');
  if (mobilePkg) {
    await mobilePkg.scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(1000);
    await mobilePage.screenshot({ path: path.join(OUTPUT_DIR, '06_mobile_packages.png') });
    console.log('✓ Captured 06_mobile_packages.png');
  }

  const mobileFaq = await mobilePage.$('#faq');
  if (mobileFaq) {
    await mobileFaq.scrollIntoViewIfNeeded();
    const firstMobileDetails = await mobilePage.$('#faq details');
    if (firstMobileDetails) {
      await firstMobileDetails.click();
    }
    await mobilePage.waitForTimeout(1000);
    await mobilePage.screenshot({ path: path.join(OUTPUT_DIR, '07_mobile_faq.png') });
    console.log('✓ Captured 07_mobile_faq.png');
  }

  await browser.close();
  console.log('Done capturing Kampala Rolex visuals!');
})();
