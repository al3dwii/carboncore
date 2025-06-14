import { test, expect, injectAxe, checkA11y } from "@axe-core/playwright";
test("a11y home", async ({ page })=>{
  await page.goto("/");
  await injectAxe(page);
  await checkA11y(page, undefined, {includedImpacts:["critical","serious"]});
});
