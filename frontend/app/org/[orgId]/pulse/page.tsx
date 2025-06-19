import { VendorTable } from "@/components/pulse/VendorTable";
import { PulseAlertToasts } from "@/components/pulse/PulseAlertToasts";

export default function SupplyCarbonPulsePage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">SupplyCarbon Pulse</h1>
      <VendorTable />
      <PulseAlertToasts />
    </section>
  );
}
