const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const filePath = "file:///" + process.cwd().replace(/\\/g, "/") + "/public/speisely-magazin-edition.html";
  await page.goto(filePath, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  
  // Spread 0: Cover (Page 1)
  // Spread 1: Page 2 & 3
  // Spread 2: Page 4 & 5
  // Spread 3: Page 6 & 7
  // Spread 4: Page 8 & 9
  // Spread 5: Page 10
  
  async function auditCurrentSpread(spreadName) {
    return await page.evaluate((sName) => {
      const pages = Array.from(document.querySelectorAll(".page"));
      const visiblePages = pages.map((p, idx) => {
        if (p.offsetWidth > 0 && p.offsetHeight > 0) {
          const children = Array.from(p.children).map(c => ({
            tag: c.tagName,
            cls: c.className.slice(0, 30),
            h: c.offsetHeight,
            top: c.offsetTop,
            bottom: c.offsetTop + c.offsetHeight
          }));
          const lastChild = children[children.length - 1];
          return {
            pageNumber: idx + 1,
            spread: sName,
            pageHeight: p.offsetHeight,
            contentBottom: lastChild ? lastChild.bottom : 0,
            emptySpaceAtBottom: 740 - (lastChild ? lastChild.bottom : 0),
            childrenCount: children.length,
            children
          };
        }
        return null;
      }).filter(Boolean);
      return visiblePages;
    }, spreadName);
  }

  const allAudits = [];
  allAudits.push(...await auditCurrentSpread("Cover (1)"));

  for (let s = 1; s <= 5; s++) {
    await page.click("#btn-next");
    await page.waitForTimeout(1000);
    allAudits.push(...await auditCurrentSpread(`Spread ${s}`));
  }

  console.log(JSON.stringify(allAudits, null, 2));
  await browser.close();
})();
