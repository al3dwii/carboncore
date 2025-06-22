import OffsetLedger from "@/components/offsets/OffsetLedger";
import { NetZeroGauge } from "@/components/offsets/NetZeroGauge";
import { ThresholdSlider } from "@/components/offsets/ThresholdSlider";
import { api } from "@/lib/api";
import { Suspense } from 'react';
import { Loading } from '@/components/Loading';

export const revalidate = 60;

export default function Page({ params: { orgId } }: { params: { orgId: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <Content orgId={orgId} />
    </Suspense>
  );
}

async function Content({ orgId }: { orgId: string }) {
  const initial = await api.currentResidual(orgId);
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Offsets & Net Zero</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <NetZeroGauge initial={initial.residual} />
        <ThresholdSlider orgId={orgId} />
      </div>

      <OffsetLedger orgId={orgId} />
    </>
  );
}
