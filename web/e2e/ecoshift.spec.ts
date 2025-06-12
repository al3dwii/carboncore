import { test, expect } from "@playwright/test";
test("EcoShift suggest", async ({ request }) => {
  const body={vcpu_hours:1,earliest:new Date().toISOString(),
    latest:new Date(Date.now()+2*3600*1000).toISOString(),preferred_region:"DE"};
  const resp=await request.post("/suggest",{data:body});
  expect(resp.status()).toBe(200);
});
