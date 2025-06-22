"use client";
import { Vendor } from "@/types/vendor";
import { Dialog } from "@headlessui/react";
import { Line } from "react-chartjs-2";
import { Button } from "@/components/ui/Button";
import { toastSuccess, toastError } from "@/lib/toast";

export function VendorModal({ v, onClose }: { v: Vendor; onClose: () => void }) {
  async function handleEmail() {
    const r = await fetch(`/api/proxy/vendors/${v.id}/email`, { method: "POST" });
    r.ok ? toastSuccess("Remediation email sent") : toastError("Failed");
  }

  return (
    <Dialog open onClose={onClose} className="fixed inset-0 grid place-items-center">
      <Dialog.Panel className="bg-cc-base p-6 rounded max-w-lg w-full">
        <Dialog.Title className="text-lg font-bold mb-4">{v.name}</Dialog.Title>
        {/* placeholder sparkline */}
        <Line
          data={{
            labels: Array(30).fill(""),
            datasets: [
              {
                data: Array(30)
                  .fill(0)
                  .map(() => Math.random()),
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
