"use client";
import { useEffect, useRef } from "react";

export function GaugeCanvas({ value, dangerThreshold, unit }: { value: number; dangerThreshold: number; unit: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.lineWidth = 8;
    ctx.strokeStyle = value > dangerThreshold ? "#34d399" : "#f87171";
    ctx.beginPath();
    ctx.arc(50, 50, 40, Math.PI, Math.PI + (value / 100) * Math.PI, false);
    ctx.stroke();
  }, [value, dangerThreshold]);

  return (
    <div className="w-24 text-center">
      <canvas ref={ref} width={100} height={60} />
      <p className="mt-1 text-xs">
        {value.toFixed(1)} {unit}
      </p>
    </div>
  );
}
