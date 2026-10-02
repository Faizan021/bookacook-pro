const { chromium } = require('playwright');
const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = 8098;

function createStaticServer() {
  const publicDir = path.resolve(__dirname, '../public');
  return http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/' || reqPath === '') reqPath = '/speisely-magazin-edition.html';
    const filePath = path.join(publicDir, reqPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml'
      };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not found: ' + reqPath);
    }
  });
}

async function verifyFirstPublication() {
  console.log('Verifying First Publication (Ausgabe 01 · Erstausgabe)...');
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(PORT, resolve));

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const outDir = path.resolve(__dirname, '../scratch/visual_audit');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  try {
    await page.goto(`http://localhost:${PORT}/speisely-magazin-edition.html`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    // 1. Cover (Page 1)
    await page.screenshot({ path: path.join(outDir, 'pub01_01_cover_de.png') });
    console.log('✓ Saved pub01_01_cover_de.png');

    // Switch to EN on cover
    await page.click('#lang-btn-en');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, 'pub01_01_cover_en.png') });
    console.log('✓ Saved pub01_01_cover_en.png');

    // Switch back to DE
    await page.click('#lang-btn-de');
    await page.waitForTimeout(500);

    // 2. Spread 2-3 (Editorial & Masthead)
    await page.click('#btn-next');
    await page.waitForTimeout(1000);
    const flipbook = await page.$('#flipbook');
    if (flipbook) {
      await flipbook.screenshot({ path: path.join(outDir, 'pub01_02_spread_2_3_de.png') });
      console.log('✓ Saved pub01_02_spread_2_3_de.png');
    }

    // Switch to EN on Spread 2-3
    await page.click('#lang-btn-en');
    await page.waitForTimeout(500);
    if (flipbook) {
      await flipbook.screenshot({ path: path.join(outDir, 'pub01_02_spread_2_3_en.png') });
      console.log('✓ Saved pub01_02_spread_2_3_en.png');
    }

    // 3. Spread 4-5 (Oktoberfest Feast)
    await page.click('#lang-btn-de');
    await page.waitForTimeout(500);
    await page.click('#btn-next');
    await page.waitForTimeout(1000);
    if (flipbook) {
      await flipbook.screenshot({ path: path.join(outDir, 'pub01_03_spread_4_5_de.png') });
      console.log('✓ Saved pub01_03_spread_4_5_de.png');
    }

    // 4. Back Cover (Page 10)
    await page.click('#btn-last');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, 'pub01_04_back_cover_de.png') });
    console.log('✓ Saved pub01_04_back_cover_de.png');

  } catch (e) {
    console.error('Error during test:', e);
  } finally {
    await browser.close();
    server.close();
  }
}

verifyFirstPublication();
