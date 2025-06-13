import { test, expect } from "@playwright/test";
test("Widget badge appears", async ({ page })=>{
  await page.goto("/widget/widget.js"); // loads badge via script tag
  await expect(page.locator("text=/CO₂/")).toBeVisible();
});
