test("Live budget tile turns red on overspend", async ({ page }) => {
  await page.route("**/budget/stream", (route) => {
    route.fulfill({
      status: 200,
      body: "data: {\"remaining\": 100}\n\n", // initial
    });
  });

  await page.goto("http://localhost:3000/org/1/dashboard");
  await expect(page.getByText("100 USD")).toBeVisible();

  // Push overspend
  await page.evaluate(() =>
    new EventSource("/api/org/1/budget/stream").dispatchEvent(
      new MessageEvent("message", {
        data: JSON.stringify({ remaining: -50 }),
      }),
    ),
  );
  await expect(page.locator("text=-50 USD")).toHaveCSS("background-color", /rgb\(254,226,226/); // red-100
});
