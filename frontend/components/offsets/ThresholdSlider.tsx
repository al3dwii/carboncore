"use client";
import { Slider } from "@/components/ui/Slider";
import { withAsync } from "@/lib/withAsync";
import { request } from "@/lib/api";
import { useState } from "react";

export default function ThresholdSlider({
  orgId,
  initial,
}: {
  orgId: string;
  initial: number;
}) {
  const [value, setValue] = useState(initial);

  const save = (v: number) =>
    withAsync(
      () => request("/org/{orgId}/offset-threshold", "patch", { orgId }, { value: v }),
      "Threshold updated ✅",
    );

  return (
    <div className="space-y-2">
      <p className="text-sm">Purchase offsets when tCO₂e &gt; {value}</p>
      <Slider
        min={0}
        max={5000}
        step={100}
        defaultValue={[initial]}
        onValueCommit={(val) => {
          setValue(val[0]);
          save(val[0]);
        }}
      />
    </div>
  );
}
