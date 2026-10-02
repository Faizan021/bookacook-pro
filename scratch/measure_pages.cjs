const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const filePath = "file:///" + process.cwd().replace(/\\/g, "/") + "/public/speisely-magazin-edition.html";
  await page.goto(filePath, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  
  await page.click("#btn-last");
  await page.waitForTimeout(1200);
  
  const res = await page.evaluate(() => {
    const p10 = document.querySelectorAll(".page")[9];
    const computed = window.getComputedStyle(p10);
    const children = Array.from(p10.children).map(c => ({
      tag: c.tagName,
      cls: c.className.slice(0, 30),
      h: c.offsetHeight,
      top: c.offsetTop,
      bottom: c.offsetTop + c.offsetHeight
    }));
    return {
      p10_style: p10.getAttribute("style"),
      p10_offsetHeight: p10.offsetHeight,
      computed_display: computed.display,
      computed_justifyContent: computed.justifyContent,
      children
    };
  });
  console.log(JSON.stringify(res, null, 2));
  await browser.close();
})();
