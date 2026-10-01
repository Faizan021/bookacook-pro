const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, '../scratch/visual_audit');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const TARGET_BASE_URL = process.env.VISUAL_QA_URL || 'https://speisely.de';

async function runVisualQA() {
  console.log('====================================================');
  console.log('👁️  RUNNING AUTOMATED VISUAL QA JUDGE PIPELINE');
  console.log(`Target: ${TARGET_BASE_URL}`);
  console.log(`Audit Directory: ${OUTPUT_DIR}`);
  console.log('====================================================\n');

  const browser = await chromium.launch({ headless: true });
  let visualErrors = [];

  try {
    // -------------------------------------------------------------
    // AUDIT 1: Laptop Screen (1280x800) - Primary User Device
    // -------------------------------------------------------------
    console.log('[Audit 1/3] Testing Laptop Viewport (1280x800)...');
    const pageLaptop = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await pageLaptop.goto(`${TARGET_BASE_URL}/magazin/edition.html`, { waitUntil: 'domcontentloaded' });
    await pageLaptop.waitForTimeout(2500);

    // Check 1: Top Bar & Flipbook Container visibility
    const topBar = await pageLaptop.$('header');
    if (!topBar) {
      visualErrors.push('Top navigation bar is missing from magazine view.');
    }

    // Capture Cover
    await pageLaptop.screenshot({ path: path.join(OUTPUT_DIR, '01_laptop_cover.png') });
    console.log('  ✓ Saved: 01_laptop_cover.png');

    // Flip to Pages 2-3 (Advertorial & Editorial)
    await pageLaptop.click('#btn-next');
    await pageLaptop.waitForTimeout(1000);

    // Verify top clipping: Bounding box of running header must be below the top bar
    const page3Header = await pageLaptop.$('.page-right');
    if (page3Header) {
      const box = await page3Header.boundingBox();
      if (box && box.y < 35) {
        visualErrors.push(`Page 2-3 content is clipped behind the top bar (y = ${box.y}px, expected >= 36px).`);
      }
    }

    await pageLaptop.screenshot({ path: path.join(OUTPUT_DIR, '02_laptop_pages_02_03_de.png') });
    console.log('  ✓ Saved: 02_laptop_pages_02_03_de.png');

    // Test Language Switcher Toggle to EN
    await pageLaptop.click('#lang-btn-en');
    await pageLaptop.waitForTimeout(800);
    const langAttr = await pageLaptop.$eval('body', el => el.getAttribute('data-lang'));
    if (langAttr !== 'en') {
      visualErrors.push('Language switcher failed to set body[data-lang="en"].');
    }
    await pageLaptop.screenshot({ path: path.join(OUTPUT_DIR, '03_laptop_pages_02_03_en.png') });
    console.log('  ✓ Saved: 03_laptop_pages_02_03_en.png');

    // Flip to Pages 6-7 (The Critical Reportage Spread)
    await pageLaptop.click('#btn-next');
    await pageLaptop.waitForTimeout(700);
    await pageLaptop.click('#btn-next');
    await pageLaptop.waitForTimeout(1000);

    // Check for empty space: Page 6 should have the Dossier and Takeaways rendered
    const hasDossier = await pageLaptop.$('.page-left dl');
    if (!hasDossier) {
      visualErrors.push('Page 6 is missing the bottom Editorial Dossier factsheet.');
    }

    // Verify images rendered and have natural dimensions
    const imagesHealthy = await pageLaptop.$$eval('.page img', imgs => {
      return imgs.every(img => img.complete && img.naturalWidth > 0);
    });
    if (!imagesHealthy) {
      visualErrors.push('One or more images failed to load or have broken sources.');
    }

    await pageLaptop.screenshot({ path: path.join(OUTPUT_DIR, '04_laptop_pages_06_07_spread.png') });
    console.log('  ✓ Saved: 04_laptop_pages_06_07_spread.png');

    await pageLaptop.close();

    // -------------------------------------------------------------
    // AUDIT 2: Desktop Screen (1440x900) - Full Widescreen
    // -------------------------------------------------------------
    console.log('\n[Audit 2/3] Testing Desktop Viewport (1440x900)...');
    const pageDesktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await pageDesktop.goto(`${TARGET_BASE_URL}/magazin/edition.html`, { waitUntil: 'domcontentloaded' });
    await pageDesktop.waitForTimeout(2000);

    // Flip to Pages 8-9 (Community & Tech)
    await pageDesktop.click('#btn-next');
    await pageDesktop.waitForTimeout(500);
    await pageDesktop.click('#btn-next');
    await pageDesktop.waitForTimeout(500);
    await pageDesktop.click('#btn-next');
    await pageDesktop.waitForTimeout(500);
    await pageDesktop.click('#btn-next');
    await pageDesktop.waitForTimeout(1000);

    await pageDesktop.screenshot({ path: path.join(OUTPUT_DIR, '05_desktop_pages_08_09.png') });
    console.log('  ✓ Saved: 05_desktop_pages_08_09.png');

    // Flip to Page 10 (Back Cover)
    await pageDesktop.click('#btn-next');
    await pageDesktop.waitForTimeout(1000);
    await pageDesktop.screenshot({ path: path.join(OUTPUT_DIR, '06_desktop_page_10_back.png') });
    console.log('  ✓ Saved: 06_desktop_page_10_back.png');

    await pageDesktop.close();

    // -------------------------------------------------------------
    // AUDIT 3: Embedded Reader Route (/magazin/reader)
    // -------------------------------------------------------------
    console.log('\n[Audit 3/3] Testing Embedded Reader (/magazin/reader)...');
    const pageReader = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await pageReader.goto(`${TARGET_BASE_URL}/magazin/reader`, { waitUntil: 'domcontentloaded' });
    await pageReader.waitForTimeout(2000);

    // Scroll to iframe
    await pageReader.evaluate(() => {
      const iframe = document.querySelector('iframe');
      if (iframe) iframe.scrollIntoView({ behavior: 'instant', block: 'center' });
    });

    const iframeEl = await pageReader.$('iframe');
    if (!iframeEl) {
      visualErrors.push('No iframe found on /magazin/reader.');
    } else {
      const frame = await iframeEl.contentFrame();
      if (!frame) {
        visualErrors.push('Could not access iframe content frame.');
      } else {
        await frame.waitForLoadState('load');
        await frame.waitForSelector('#flipbook', { timeout: 25000 });
        console.log('  ✓ Iframe embedded successfully with same-origin permissions.');
      }
    }

    await pageReader.screenshot({ path: path.join(OUTPUT_DIR, '07_reader_embed_live.png') });
    console.log('  ✓ Saved: 07_reader_embed_live.png');

    await pageReader.close();

  } catch (err) {
    visualErrors.push(`Visual QA execution crashed: ${err.message}`);
  } finally {
    await browser.close();
  }

  console.log('\n====================================================');
  if (visualErrors.length === 0) {
    console.log('🎉 VISUAL QA JUDGE: 100% PASS! All visual checks healthy.');
    console.log('All screenshots ready for multimodal inspection in scratch/visual_audit/');
    console.log('====================================================\n');
    process.exit(0);
  } else {
    console.error('❌ VISUAL QA JUDGE DETECTED FLAWS:');
    visualErrors.forEach((e, idx) => console.error(`   ${idx + 1}. ${e}`));
    console.error('====================================================\n');
    process.exit(1);
  }
}

runVisualQA();
