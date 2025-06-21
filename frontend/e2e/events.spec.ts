import { test } from '@playwright/test';

test('open events and click first row', async ({ page }) => {
  await page.goto('/events');
  await page.locator('div.grid').first().click();
});
