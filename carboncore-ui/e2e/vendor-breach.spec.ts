import { test, expect } from "@playwright/test";

test("breach toast appears", async ({ page }) => {
  await page.goto("/org/acme/pulse");
  await page.request.post("/api/test/vendor-breach");
  await expect(page.locator(".toast-error, .toast-success")).toHaveText(/breached SLA/, {
    timeout: 3000
  });
});
