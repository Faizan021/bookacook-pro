const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const publicDir = path.join(__dirname, '..', 'public');

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

server.listen(4173, async () => {
  console.log('Static server listening on port 4173');
  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2
    });
    const page = await context.newPage();

    await page.goto('http://127.0.0.1:4173/speisely-magazin-edition.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // 1. Flip to Spread 02-03 (Pro)
    await page.click('#btn-next');
    await page.waitForTimeout(1000);

    // Capture Page 2 Ad (German)
    const pages = await page.$$('.page');
    if (pages[1]) {
      await pages[1].screenshot({ path: path.join(publicDir, 'page2_speisely_pro_live_de.png') });
      console.log('Saved page2_speisely_pro_live_de.png');
    }

    // Switch to English
    await page.click('#lang-btn-en');
    await page.waitForTimeout(800);
    if (pages[1]) {
      await pages[1].screenshot({ path: path.join(publicDir, 'page2_speisely_pro_live_en.png') });
      console.log('Saved page2_speisely_pro_live_en.png');
    }

    // Capture Spread 02-03
    const flipbook = await page.$('#flipbook');
    if (flipbook) {
      await flipbook.screenshot({ path: path.join(publicDir, 'spread_02_03_pro_live.png') });
      console.log('Saved spread_02_03_pro_live.png');
    }

    // 2. Flip to Spread 06-07 (Digital)
    await page.click('#btn-next'); // to 4-5
    await page.waitForTimeout(600);
    await page.click('#btn-next'); // to 6-7
    await page.waitForTimeout(1000);

    // Capture Spread 06-07 (Digital)
    if (flipbook) {
      await flipbook.screenshot({ path: path.join(publicDir, 'spread_06_07_digital_live.png') });
      console.log('Saved spread_06_07_digital_live.png');
    }

    await browser.close();
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    server.close();
    console.log('Test completed and server closed.');
  }
});
