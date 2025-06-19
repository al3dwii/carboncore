"use client";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { useNodes, colourForCO2 } from "@/lib/nodes-api";
import "leaflet/dist/leaflet.css";

export function EdgeMap() {
  const { data: nodes = [] } = useNodes();

  return (
    <MapContainer className="h-[70vh] w-full" center={[20, 0]} zoom={2} scrollWheelZoom>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      {nodes.map((n) => (
        <CircleMarker
          key={n.id}
          center={[n.lat, n.lng]}
          pathOptions={{ className: colourForCO2(n.grid_g_co2_kwh) }}
          radius={6}
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
    </MapContainer>
  );
}
