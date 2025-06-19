import PulseVendors from "@/components/pulse/VendorTable";
import { request }  from "@/lib/api";

export default async function Pulse({ params:{orgId} }) {
  const vendors = await request("/org/{orgId}/vendors", "get",{orgId});
  return <PulseVendors initial={vendors} orgId={orgId} />;
}
