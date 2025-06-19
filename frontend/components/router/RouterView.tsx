"use client";
import { EdgeMap } from "./Map";
import { PolicySlider } from "./PolicySlider";

export default function RouterView({ initial, orgId }: { initial: any; orgId: string }) {
  // This is a placeholder since real-time updates not defined.
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">EcoEdge Router</h1>
      <PolicySlider initial={initial.weight} />
      <EdgeMap />
    </section>
  );
}
