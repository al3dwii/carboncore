import { test, expect } from "@playwright/test";

test.describe("Ledger live stream", () => {
  test("shows new event without refresh", async ({ page }) => {
    await page.goto("/dashboard");
    await page.goto("/ledger");

    // Count rows now
    const initialCount = await page.locator("div[data-row]").count();

    // Trigger fake event (test helper endpoint or fixture)
    await page.request.post("/api/test/fake-ledger-event");

    // Expect +1 row
    await expect(page.locator("div[data-row]")).toHaveCount(initialCount + 1, {
      timeout: 2000
    });
  });
});
