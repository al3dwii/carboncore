"use client";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useEffect, useState } from "react";
import { AdvisorEvent, api } from "@/lib/api";

export function EventDetailDialog({ id, onClose }: { id: string; onClose(): void }) {
  const [evt, setEvt] = useState<AdvisorEvent | null>(null);
  const [state, setState] = useState<"loading" | "error" | "ready">("loading");

  useEffect(() => {
    api.getAdvisorEvent(id)
       .then(setEvt)
       .then(() => setState("ready"))
       .catch(() => setState("error"));
  }, [id]);

  return (
    <Dialog open onClose={onClose} className="fixed inset-0 grid place-items-center bg-black/40">
      <DialogPanel className="w-[34rem] rounded-md bg-white p-6 shadow-xl">
        {state === "loading" && <p>Loading…</p>}
        {state === "error"   && <p className="text-red-600">Couldn’t load event.</p>}
        {state === "ready" && evt && (
          <>
            <h2 className="mb-4 text-lg font-medium">{evt.project} – {evt.feature}</h2>
            <table className="w-full text-sm">
              <tbody>
                <tr><td>CO₂ saved</td><td>{evt.kg_co2.toFixed(2)} kg</td></tr>
                <tr><td>USD saved</td><td>${evt.usd.toFixed(2)}</td></tr>
                <tr><td>Commit SHA</td><td><code>{evt.commit.slice(0,7)}</code></td></tr>
                <tr><td>Date</td><td>{new Date(evt.date).toLocaleString()}</td></tr>
              </tbody>
            </table>
          </>
        )}
      </DialogPanel>
    </Dialog>
  );
}
