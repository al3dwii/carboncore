import useSWR from "swr";
import { request } from "@/lib/api";
import { EdgeNode } from "@/types/node";

const fetcher = (path: string) => request(path as any, "get", {}) as Promise<EdgeNode[]>;

export function useNodes() {
  return useSWR<EdgeNode[]>("/nodes", fetcher, { refreshInterval: 300_000 });
}

export function colourForCO2(g: number) {
  if (g < 200) return "bg-cc-green";
  if (g < 400) return "bg-cc-amber";
  return "bg-cc-red";
}
