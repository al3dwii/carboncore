import { test, expect } from '@playwright/test';

test('drag job – success toast', async ({ page }) => {
  await page.goto('/org/acme/scheduler');
  const job = page.locator('.fc-event').first();
  const box = await job.boundingBox();
  await page.mouse.move(box!.x + 5, box!.y + 5);
  await page.mouse.down();
  await page.mouse.move(box!.x + 5, box!.y + 140);
  await page.mouse.up();
  await expect(page.getByText(/Job rescheduled/)).toBeVisible();
});
