import useSWR from "swr";
import { EdgeNode } from "@/types/node";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useNodes() {
  return useSWR<EdgeNode[]>("/api/nodes", fetcher, { refreshInterval: 300_000 });
}

export function colourForCO2(g: number) {
  if (g < 200) return "bg-cc-green";
  if (g < 400) return "bg-cc-amber";
  return "bg-cc-red";
}
