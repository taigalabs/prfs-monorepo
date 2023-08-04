import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();
  await page.goto("http://localhost:3000");

  // not implemented yet

  // Set screen size
  // await page.setViewport({ width: 1080, height: 1024 });
  //
  // const searchResultSelector = "body";
  // let selector = await page.waitForSelector(searchResultSelector);
  // const fullTitle = await selector?.evaluate(el => el.textContent);
  // console.log('The title of this blog post is "%s".', fullTitle);

  await browser.close();
})();
