const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const filePath = "file:///" + process.cwd().replace(/\\/g, "/") + "/public/speisely-magazin-edition.html";
  await page.goto(filePath, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  await page.click("#btn-last");
  await page.waitForTimeout(1200);

  const testResult = await page.evaluate(() => {
    const p10 = document.querySelectorAll(".page")[9];
    const wrapper = document.createElement("div");
    wrapper.style.height = "100%";
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.justifyContent = "space-between";

    while (p10.firstChild) {
      wrapper.appendChild(p10.firstChild);
    }
    p10.appendChild(wrapper);

    const wrapperH = wrapper.offsetHeight;
    const firstTop = wrapper.firstElementChild.offsetTop;
    const last = wrapper.lastElementChild;
    const lastBottom = last.offsetTop + last.offsetHeight;
    return {
      p10_height: p10.offsetHeight,
      wrapper_height: wrapperH,
      firstTop,
      lastBottom
    };
  });

  console.log("Wrapper test result:", JSON.stringify(testResult, null, 2));
  await browser.close();
})();
