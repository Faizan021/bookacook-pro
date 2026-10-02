const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const publicDir = path.join(__dirname, '..', 'public');
const visualDir = path.join(__dirname, 'visual_audit');
if (!fs.existsSync(visualDir)) fs.mkdirSync(visualDir, { recursive: true });

const mimeTypes = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.webp': 'image/webp'
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
    res.writeHead(404); res.end('Not Found');
  }
});

server.listen(4199, async () => {
  console.log('Static server on port 4199');
  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
    const page = await context.newPage();

    await page.goto('http://127.0.0.1:4199/speisely-magazin-edition.html', { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(2000);

    // Overflow check  
    const overflowReport = await page.evaluate(() => {
      const pageElements = document.querySelectorAll('.page');
      return Array.from(pageElements).map((p, idx) => {
        const content = p.querySelector('.page-content');
        return { page: idx + 1, hasOverflow: content ? content.scrollHeight > content.clientHeight + 2 : false };
      });
    });
    const overflowPages = overflowReport.filter(r => r.hasOverflow);
    console.log('Overflow pages:', overflowPages.length === 0 ? 'NONE ✅' : JSON.stringify(overflowPages));

    // Capture cover (page 1)
    await page.screenshot({ path: path.join(visualDir, 'p01_cover.png') });
    console.log('Screenshot: cover saved');

    // Spreads: each btn-next advances one page
    const nextBtn = page.locator('#btn-next');

    // Navigate to 06-07 (Digital + Community) — 3 clicks
    await nextBtn.click(); await page.waitForTimeout(900);
    await nextBtn.click(); await page.waitForTimeout(900);
    await nextBtn.click(); await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(visualDir, 'p06_07_digital_community.png') });
    console.log('Screenshot: P06-07 saved');

    // P08-09 Thronburger Left+Right
    await nextBtn.click(); await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(visualDir, 'p08_09_thronburger.png') });
    console.log('Screenshot: P08-09 Thronburger saved');

    // P10-11 Alzaeem Left+Right
    await nextBtn.click(); await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(visualDir, 'p10_11_alzaeem.png') });
    console.log('Screenshot: P10-11 Alzaeem saved');

    // P12-13 Mandy Left+Right
    await nextBtn.click(); await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(visualDir, 'p12_13_mandy.png') });
    console.log('Screenshot: P12-13 Mandy saved');

    // P14 Back cover
    await nextBtn.click(); await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(visualDir, 'p14_back_cover.png') });
    console.log('Screenshot: P14 back cover saved');

    await browser.close();
    console.log('All screenshots captured!');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    server.close();
  }
});
