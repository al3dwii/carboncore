import { test, expect } from "@playwright/test";

test("user can login and see dashboard", async ({ page }) => {
  await page.goto("/api/auth/signin");
  // Stub: Bypass real GitHub OAuth using test provider
  await page.click("text=Sign in as test user");
  await expect(page).toHaveURL("/org/acme/dashboard");
  await expect(page.getByText(/CO₂-saved/i)).toBeVisible();
});
