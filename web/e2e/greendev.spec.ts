import { test, expect } from "@playwright/test";
test("GreenDev advice", async ({ request })=>{
  const r = await request.get("/advice/sku?sku=t3.large");
  expect(r.status()).toBe(200);
});
