import { test, expect } from "@playwright/test";
test("Widget badge appears", async ({ page }) => {
  await page.goto("/test_widget.html");
  await expect(page.locator("text=/CO₂/")).toBeVisible();
});
