import PulseVendors from "@/components/pulse/VendorTable";
import { request }  from "@/lib/client";
import { Suspense } from 'react';
import { Loading } from '@/components/Loading';

export default function Pulse({ params: { orgId } }: { params: { orgId: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <Content orgId={orgId} />
    </Suspense>
  );
}

async function Content({ orgId }: { orgId: string }) {
  const vendors = await request("/org/{orgId}/vendors", "get", { orgId });
  return <PulseVendors initial={vendors as any} orgId={orgId} />;
}
