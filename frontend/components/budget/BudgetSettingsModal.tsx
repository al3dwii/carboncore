"use client";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { api } from "@/lib/api";
export function BudgetSettingsModal({ budget, onClose }:{budget:number; onClose():void}) {
  const [value,setValue]=useState(budget);
  return (
    <Dialog open onClose={onClose} className="fixed inset-0 grid place-items-center bg-black/40">
      <Dialog.Panel className="w-80 rounded bg-white p-6">
        <h2 className="mb-3 font-medium">Edit carbon budget (t CO₂)</h2>
        <input type="number" value={value} onChange={e=>setValue(+e.target.value)}
               className="w-full rounded border px-2 py-1"/>
        <button className="mt-4 rounded bg-emerald-600 px-4 py-1 text-white"
                onClick={()=>api.patchBudget({budget:value}).then(onClose)}>
          Save
        </button>
      </Dialog.Panel>
    </Dialog>
  );
}
