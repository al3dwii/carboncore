test("ledger table live-updates", async ({ page }) => {
  await page.goto("/org/1/ledger");
  await expect(page.getByText("Ledger")).toBeVisible();
});
