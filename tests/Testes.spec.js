const { test, expect } = require("@playwright/test");

const url = "https://marcogarujo.netlify.app/";

test.beforeEach(async ({ page }) => {
  // @ts-ignore
  await page.goto(url);
  expect(await page.title()).toBe("Marco's Blog | QA Engineer");
  await page.screenshot({ path: 'screenshot.png' });
});

test("Toggle dark mode on and off", async ({page}) => {
    await page.locator('//*[@id="mode-toggle"]').click();
    await page.locator('//*[@id="mode-toggle"]').click();
    await page.waitForTimeout(5000);
});

test("Access Blog and Toggle dark mode on ", async ({page}) => {
    await page.locator('ul li').nth(1).click();
    await page.locator('//*[@id="mode-toggle"]').click();
    await page.locator('//*[@id="mode-toggle"]').click();
    const numberOfPosts = await page.locator('main section li').count();
    expect(numberOfPosts).toBeGreaterThan(0);
});

test("Access Blog and access the first blog post", async ({page}) => {
  await page.getByRole('link', { name: 'Blog', exact: true }).click();
  await page.getByRole('link', { name: 'Beyond Functional Testing: The Value of Non-Functional Testing'}).click();
  // Take a screenshot after the test
  await page.screenshot({ path: 'screenshot.png' });

  //When the step above is executed, a new page will be opened and in order to get to the new page we must follow the steps bellow 
  // We wait for the event to be triggered
  // When we click on the first blog post, a new page will be opened,
  // so we wait for the "popup" event to be triggered
  const newTabPromise = page.waitForEvent("popup");
  // We get the new page as a promise 
  const newTab = await newTabPromise;
  //Ensuring that we are redirected to the correct page and that the page title is correct
  console.log('The page title is: ' + await newTab.title());
  await newTab.evaluate(() => {
    window.scrollBy(0, -500); // Scroll up by 500 pixels
  });
  // await expect(newTab).toHaveURL("");
  expect(await newTab.title()).toBe("Beyond Functional Testing: The Value of Non-Functional Testing | by Marco Garujo | Nov, 2024 | Medium");


});

test.only('Implicetly Opening a new page', async ({page}) => {

 // In this step we listen to a page opening event
const [newPage] = await Promise.all([
  page.context().waitForEvent('page'), // Waiit for the new tab to open
  page.getByRole('link', { name: 'My LinkedIn' }).click(), // Click the intended link that opens in a new tab
]);
// Wait for the new page to load
await newPage.waitForLoadState('networkidle');

 // In this step we listen to a page opening event
const [newPage1] = await Promise.all([
  page.context().waitForEvent('page'), // Wait for the new tab to open
  page.getByRole('link', { name: 'My Github'}).click(), // Click the intended link that opens in a new tab
]);
// Wait for the new page to load
await newPage1.waitForLoadState('networkidle');

 // In this step we listen to a page opening event
const [newPage2] = await Promise.all([
  page.context().waitForEvent('page'), // Wait for the new tab to open
  page.getByRole('link', { name: 'My Medium ' }).click(), // Click the intended link that opens in a new tab
]);

// Wait for the new page to load
await newPage2.waitForLoadState('networkidle');

await newPage.close();
await newPage1.close();
await newPage2.close();

})