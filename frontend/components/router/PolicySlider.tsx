"use client";
import { Slider } from "@/components/ui/Slider";
import { useState } from "react";
import { patchPolicy } from "@/lib/policy-api";
import { toastSuccess, toastError } from "@/lib/toast";

export function PolicySlider({ initial }: { initial: number }) {
  const [value, setValue] = useState(initial);

  async function onChange(v: number[]) {
    const weight = v[0];
    setValue(weight);
    try {
      await patchPolicy({ weight });
      toastSuccess(weight < 50 ? "Prioritising low carbon 🌱" : "Prioritising low latency ⚡️");
    } catch {
      toastError("Failed to update policy");
    }
  }

  return (
    <div className="max-w-md">
      <Slider defaultValue={[initial]} onValueCommit={onChange} />
      <p className="mt-2 text-sm text-white/70">
        {value < 50 ? "Cleaner grid first" : "Faster response first"}
      </p>
    </div>
  );
}
