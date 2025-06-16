import { test, expect } from "@playwright/test";

test("generate & download report", async ({ page }) => {
  await page.goto("/org/acme/reports");
  await page.selectOption("select", "2024");
  await page.click("text=Generate report");

  // fake backend triggers done
  await page.request.post("/api/test/mark-report-complete");

  await expect(page.locator("text=Download")).toHaveCount(4, { timeout: 5000 });
});
