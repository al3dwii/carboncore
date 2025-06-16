"use client";
import { Slider } from "@/components/ui/Slider";
import { useState } from "react";
import { saveThreshold } from "@/lib/offsets-api";
import { toastSuccess } from "@/lib/toast";

export function ThresholdSlider({ initial }: { initial: number }) {
  const [v, setV] = useState(initial);

  async function commit([val]: number[]) {
    setV(val);
    await saveThreshold(val);
    toastSuccess("Threshold saved");
  }

  return (
    <div className="max-w-md">
      <p className="mb-2 text-sm">Auto-purchase when residual tCO₂ &gt;</p>
      <Slider defaultValue={[v]} step={1} min={5} max={50} onValueCommit={commit} />
      <p className="mt-1 text-xs">{v} t CO₂</p>
    </div>
  );
}
