const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '/edition.html') reqPath = '/speisely-magazin-edition.html';
  const filePath = path.join(__dirname, '..', 'public', reqPath.replace(/^\//, ''));
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found: ' + reqPath);
  }
});

server.listen(4893, async () => {
  console.log('Static test server running at http://localhost:4893');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1400, height: 950 } });
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:4893/speisely-magazin-edition.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Flip to pages 2-3
    await page.click('#btn-next');
    await page.waitForTimeout(1200);

    // Flip to pages 4-5
    await page.click('#btn-next');
    await page.waitForTimeout(1200);

    // Flip to pages 6-7 (Spread 3: Page 6 Speisely Digital + Page 7 Alzaeem)
    await page.click('#btn-next');
    await page.waitForTimeout(1500);

    // Check overflow and heights on Page 6 (index 5)
    const page6Metrics = await page.evaluate(() => {
      const p6 = document.querySelectorAll('.page')[5];
      const content = p6 ? p6.querySelector('.page-content') : null;
      return {
        pageFound: !!p6,
        pageClientHeight: p6 ? p6.clientHeight : 0,
        pageScrollHeight: p6 ? p6.scrollHeight : 0,
        contentClientHeight: content ? content.clientHeight : 0,
        contentScrollHeight: content ? content.scrollHeight : 0,
        hasOverflow: content ? content.scrollHeight > content.clientHeight + 2 : false
      };
    });
    console.log('Page 6 Metrics:', JSON.stringify(page6Metrics, null, 2));

    // Capture German Spread 6-7
    const container = page.locator('#flipbook');
    await container.screenshot({ path: path.join(__dirname, '..', 'public', 'page6_speisely_digital_spread_de.png') });
    console.log('Saved public/page6_speisely_digital_spread_de.png');

    // Switch to English
    await page.click('button:has-text("EN")');
    await page.waitForTimeout(500);

    // Capture English Spread 6-7
    await container.screenshot({ path: path.join(__dirname, '..', 'public', 'page6_speisely_digital_spread_en.png') });
    console.log('Saved public/page6_speisely_digital_spread_en.png');

    // Also capture close-up of Page 6 individually
    const page6Locator = page.locator('.page').nth(5);
    await page6Locator.screenshot({ path: path.join(__dirname, '..', 'public', 'page6_speisely_digital_ad_en.png') });
    console.log('Saved public/page6_speisely_digital_ad_en.png');

  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await browser.close();
    server.close();
  }
});
