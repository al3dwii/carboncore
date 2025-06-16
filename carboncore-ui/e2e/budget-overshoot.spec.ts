import { test, expect } from "@playwright/test";

test("overshoot alert toast arrives", async ({ page }) => {
  await page.goto("/org/acme/budget");
  await page.request.post("/api/test/trigger-budget-alert");
  await expect(page.locator(".toast-error")).toContainText(/Budget exceed/, {
    timeout: 3000
  });
});
