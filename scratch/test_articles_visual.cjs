const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const publicDir = path.join(__dirname, '..', 'public');
const visualDir = path.join(__dirname, 'visual_audit');
if (!fs.existsSync(visualDir)) fs.mkdirSync(visualDir, { recursive: true });

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/speisely-magazin-edition.html';
  const filePath = path.join(publicDir, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(4174, async () => {
  console.log('Static server listening on port 4174');
  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2
    });
    const page = await context.newPage();

    await page.goto('http://127.0.0.1:4174/speisely-magazin-edition.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Check overflow across all pages
    const overflowReport = await page.evaluate(() => {
      const pageElements = document.querySelectorAll('.page');
      return Array.from(pageElements).map((p, idx) => {
        const content = p.querySelector('.page-content');
        return {
          page: idx + 1,
          pageHeight: p.clientHeight,
          contentScrollHeight: content ? content.scrollHeight : p.scrollHeight,
          contentClientHeight: content ? content.clientHeight : p.clientHeight,
          hasOverflow: content ? content.scrollHeight > content.clientHeight + 2 : false
        };
      });
    });
    console.log('--- Overflow Report ---');
    console.table(overflowReport);

    const flipbook = await page.$('#flipbook');

    // 1. Flip to 6-7 (Digital & Thronburger)
    await page.click('#btn-next'); // to 2-3
    await page.waitForTimeout(500);
    await page.click('#btn-next'); // to 4-5
    await page.waitForTimeout(500);
    await page.click('#btn-next'); // to 6-7
    await page.waitForTimeout(1000);

    // Capture Spread 06-07 German
    if (flipbook) {
      await flipbook.screenshot({ path: path.join(visualDir, 'spread_06_07_thronburger_de.png') });
      console.log('Saved spread_06_07_thronburger_de.png');
    }

    // Switch to English
    await page.click('#lang-btn-en');
    await page.waitForTimeout(600);
    if (flipbook) {
      await flipbook.screenshot({ path: path.join(visualDir, 'spread_06_07_thronburger_en.png') });
      console.log('Saved spread_06_07_thronburger_en.png');
    }

    // Switch back to German
    await page.click('#lang-btn-de');
    await page.waitForTimeout(600);

    // 2. Flip to 8-9 (Alzaeem & Mandy)
    await page.click('#btn-next'); // to 8-9
    await page.waitForTimeout(1000);

    // Capture Spread 08-09 German
    if (flipbook) {
      await flipbook.screenshot({ path: path.join(visualDir, 'spread_08_09_alzaeem_mandy_de.png') });
      console.log('Saved spread_08_09_alzaeem_mandy_de.png');
    }

    // Switch to English
    await page.click('#lang-btn-en');
    await page.waitForTimeout(600);
    if (flipbook) {
      await flipbook.screenshot({ path: path.join(visualDir, 'spread_08_09_alzaeem_mandy_en.png') });
      console.log('Saved spread_08_09_alzaeem_mandy_en.png');
    }

    await browser.close();
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    server.close();
    console.log('Test completed and server closed.');
  }
});
