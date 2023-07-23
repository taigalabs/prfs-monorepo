import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();

  await page.goto('http://localhost:3000');

  // Set screen size
  // await page.setViewport({ width: 1080, height: 1024 });

  // Type into search box
  // await page.type('.search-box__input', 'automate beyond recorder');

  // Wait and click on first result
  const searchResultSelector = 'body';
  let selector = await page.waitForSelector(searchResultSelector);
  const fullTitle = await selector?.evaluate(el => el.textContent);
  console.log('The title of this blog post is "%s".', fullTitle);
  // await page.click(searchResultSelector);

  // // Locate the full title with a unique string
  // const textSelector = await page.waitForSelector(
  //   'text/Customize and automate'
  // );
  // const fullTitle = await textSelector?.evaluate(el => el.textContent);

  // // Print the full title
  // console.log('The title of this blog post is "%s".', fullTitle);

  await browser.close();
})();
