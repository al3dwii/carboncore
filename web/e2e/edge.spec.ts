import { test, expect } from "@playwright/test";
test("@edge latency", async ({ request }) => {
  const r = await request.get("/edge-route?ip=1.1.1.1");
  expect(r.status()).toBe(200);
});
