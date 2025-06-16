import { test, expect } from "@playwright/test";

test("slider saves and toast appears", async ({ page }) => {
  await page.goto("/router");
  const slider = page.getByRole("slider");
  await slider.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator(".toast-success")).toContainText(/Prioritising/);
});
