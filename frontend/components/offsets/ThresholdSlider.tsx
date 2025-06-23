"use client";
import { Slider } from "@headlessui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { apiFetch } from "@/lib/api/_fetch";

export function ThresholdSlider({ orgId }: { orgId: string }) {
  const q = useQuery({
    queryKey: ["offset-threshold", orgId],
    queryFn: () => apiFetch<number>(`/org/${orgId}/offset-threshold`),
  });

  const m = useMutation({
    mutationFn: (v: number) =>
      apiFetch(`/org/${orgId}/offset-threshold`, {
        method: "PATCH",
        body: JSON.stringify({ threshold: v }),
      }),
    onSuccess: () => toast.success("Threshold saved"),
  });

  if (!q.data) return null;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">
        Auto-purchase when residual ≥ {q.data} t CO₂
      </label>
      <Slider
        min={0}
        max={5000}
        step={100}
        value={q.data}
        onChange={m.mutate}
        className="h-2 w-full rounded bg-gray-200"
      />
    </div>
  );
}
