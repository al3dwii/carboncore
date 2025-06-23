"use client";
import { Vendor } from "@/types/vendor";
import { Dialog } from "@headlessui/react";
import { Line } from "react-chartjs-2";
import { Button } from "@/components/ui/Button";
import { toastSuccess, toastError } from "@/lib/toast";
import useSWR from "swr";
import { vendorTrend } from "@/lib/vendor-api";

export function VendorModal({ v, orgId, onClose }: { v: Vendor; orgId: string; onClose: () => void }) {
  const { data, error } = useSWR(`/vendors/${v.id}/trend`, () => vendorTrend(orgId, v.id));
  const trend = data;
  async function handleEmail() {
    if (!confirm("Send remediation email to vendor?")) return;
    const r = await fetch(`/api/proxy/vendors/${v.id}/email`, { method: "POST" });
    r.ok ? toastSuccess("Remediation email sent") : toastError("Failed");
  }

  return (
    <Dialog open onClose={onClose} className="fixed inset-0 grid place-items-center">
      <Dialog.Panel className="bg-cc-base w-full max-w-lg rounded p-6">
        <Dialog.Title className="mb-4 text-lg font-bold">{v.name}</Dialog.Title>
        <Line
          data={{
            labels: (trend ?? []).map((_,i)=>String(i)),
            datasets: [
              {
                data: trend ?? [],
                borderColor: "#34d399"
              }
            ]
          }}
          options={{
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } }
          }}
          height={80}
        />
        <div className="mt-6 flex justify-end gap-4">
          <Button variant="ghost" onClick={onClose} {...({} as any)}>
            Close
          </Button>
          <Button variant="secondary" onClick={handleEmail} {...({} as any)}>
            Send remediation email
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
