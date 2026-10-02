const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PUBLIC_DIR = path.resolve(__dirname, '../public');
const PORT = 3899;

// Simple static server for public directory
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = decodeURI(req.url.split('?')[0]);
      if (reqPath === '/') reqPath = '/speisely-magazin-edition.html';
      const filePath = path.join(PUBLIC_DIR, reqPath);

      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml'
      };

      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    });

    server.listen(PORT, () => {
      console.log(`Local test server running at http://127.0.0.1:${PORT}`);
      resolve(server);
    });
  });
}

async function run() {
  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to magazine edition...');
  await page.goto(`http://127.0.0.1:${PORT}/speisely-magazin-edition.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Navigate to Page 4-5: Next from Cover (p1) -> p2-3, then Next again -> p4-5
  console.log('Flipping to Pages 4-5...');
  await page.click('#btn-next');
  await page.waitForTimeout(900);
  await page.click('#btn-next');
  await page.waitForTimeout(1400);

  const outDir = path.resolve(__dirname, '../scratch/visual_audit');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 1. Capture German Spread
  console.log('Capturing German Spread with live images...');
  const flipbookEl = await page.$('#flipbook');
  const deFlipbookPath = path.join(outDir, 'pages_04_05_flipbook_de.png');
  await flipbookEl.screenshot({ path: deFlipbookPath });
  console.log('✓ German Flipbook saved to:', deFlipbookPath);

  // 2. Switch to English
  console.log('Switching to English...');
  await page.click('#lang-btn-en');
  await page.waitForTimeout(900);

  // 3. Capture English Spread
  console.log('Capturing English Spread with live images...');
  const enFlipbookPath = path.join(outDir, 'pages_04_05_flipbook_en.png');
  await flipbookEl.screenshot({ path: enFlipbookPath });
  console.log('✓ English Flipbook saved to:', enFlipbookPath);

  // 4. Capture individual pages for ultra-sharp inspection
  const pages = await page.$$('.page');
  // index 3 is Page 4, index 4 is Page 5
  if (pages[3]) {
    await pages[3].screenshot({ path: path.join(outDir, 'page_04_hendl_en.png') });
    console.log('✓ Page 4 (Wiesn-Hendl) saved.');
  }
  if (pages[4]) {
    await pages[4].screenshot({ path: path.join(outDir, 'page_05_kaiserschmarrn_en.png') });
    console.log('✓ Page 5 (Kaiserschmarrn) saved.');
  }

  await browser.close();
  server.close();
  console.log('Visual audit finished successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
