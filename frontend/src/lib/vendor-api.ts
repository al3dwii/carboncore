import { request } from "@/lib/client";
import { Vendor } from "@/types/vendor";

export async function fetchVendors(orgId: string): Promise<Vendor[]> {
  const data = await request(`/org/${orgId}/vendors`, "get", { orgId }) as any;
  return Array.isArray(data) ? data : [];
}

export async function sendRemediationEmail(id: string) {
  await request(`/vendors/${id}/email`, "post", { id } as any);
}

export async function vendorTrend(orgId: string, vendorId: string) {
  return request(`/org/${orgId}/vendors/${vendorId}/trend?days=30`, 'get');
}
