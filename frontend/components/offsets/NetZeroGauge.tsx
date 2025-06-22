"use client";
import { GaugeCanvas } from "@/components/dashboard/GaugeCanvas";
import { useEventSource } from "@/lib/useEventSource";

export function NetZeroGauge({ initial }: { initial: number }) {
  const ev = useEventSource<{ residual: number }>("/api/proxy/offsets/stream", {
    reconnect: true,
  });
  const residual = ev[0]?.residual ?? initial;
  return <GaugeCanvas value={residual} dangerThreshold={0} unit="t CO₂" />;
}
