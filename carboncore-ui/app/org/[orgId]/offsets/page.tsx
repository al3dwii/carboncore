import { ThresholdSlider } from "@/components/offsets/ThresholdSlider";
import { NetZeroGauge } from "@/components/offsets/NetZeroGauge";
import { OffsetLedgerTable } from "@/components/offsets/OffsetLedgerTable";
import { fetchThreshold, fetchResidual } from "@/lib/offsets-api";

export const dynamic = "force-dynamic";
export default async function OffsetsPage() {
  const [th, residual] = await Promise.all([fetchThreshold(), fetchResidual()]);
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">OffsetSync Autopilot</h1>
      <ThresholdSlider initial={th} />
      <NetZeroGauge initial={residual} />
      <OffsetLedgerTable />
    </section>
  );
}
