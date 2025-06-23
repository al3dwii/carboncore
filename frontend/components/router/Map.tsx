"use client";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { useNodes } from "@/lib/nodes-api";
import { usePolicyWeight } from "@/lib/usePolicyWeight";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

function intensityToColor(g: number) {
  if (g < 100) return "green";
  if (g < 300) return "yellow";
  return "red";
}

export function EdgeMap() {
  const { data: nodes = [] } = useNodes();
  const { data: policyWeight } = usePolicyWeight();
  const [activeNode, setActiveNode] = useState<string | null>(null);

  useEffect(() => {
    if (policyWeight === undefined || !nodes.length) return;
    const chosen = nodes.reduce(
      (best, n) => {
        const score = n.avg_latency_ms * (1 - policyWeight) + n.grid_g_co2_kwh * policyWeight;
        return score < best.score ? { id: n.id, score } : best;
      },
      { id: "", score: Infinity }
    ).id;
    setActiveNode(chosen);
  }, [policyWeight, nodes]);

  return (
    <MapContainer className="h-[70vh] w-full" center={[20, 0] as any} zoom={2} scrollWheelZoom {...({} as any)}>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      {nodes.map((n) => (
        <CircleMarker
          key={n.id}
          center={[n.lat, n.lng] as any}
          pathOptions={{ color: n.id === activeNode ? "gold" : intensityToColor(n.grid_g_co2_kwh) }}
          radius={6 as any}
          {...({} as any)}
        >
          <Tooltip>
            <div className="text-sm">
              {n.city}, {n.country}
              <br />⏱ {n.avg_latency_ms} ms
              <br />🌱 {n.grid_g_co2_kwh} g CO₂/kWh
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
      <div className="absolute bottom-4 right-4 rounded bg-white/90 p-3 text-xs">
        <p className="mb-1 font-medium">Colour = grid intensity</p>
        <p><span className="mr-1 inline-block size-2 bg-green-500"/> 0-100 g</p>
        <p><span className="mr-1 inline-block size-2 bg-yellow-500"/> 100-300 g</p>
        <p><span className="mr-1 inline-block size-2 bg-red-600"/> &gt;300 g</p>
        <p className="mt-1"><span className="inline-block size-2 border-2 border-yellow-500"/> chosen</p>
      </div>
    </MapContainer>
  );
}
