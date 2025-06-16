import { test, expect } from "@playwright/test";

test("drag job & see toast", async ({ page }) => {
  await page.goto("/org/acme/scheduler");
  const event = page.locator(".fc-event").first();
  const box = await event.boundingBox();
  // drag 2 hours later (simplified)
  await page.mouse.move(box!.x + 5, box!.y + 5);
  await page.mouse.down();
  await page.mouse.move(box!.x + 5, box!.y + box!.height + 120, { steps: 5 });
  await page.mouse.up();

  await expect(page.locator(".toast-success")).toHaveText(/rescheduled/, {
    timeout: 3000
  });
});
