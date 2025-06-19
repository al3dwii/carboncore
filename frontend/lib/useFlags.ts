"use client";
import useSWR from "swr";
import { fetchFlags } from "./flags-api";

export function useFlags() {
  const { data: flags = [] } = useSWR("flags", fetchFlags);
  const map = Object.fromEntries(flags.map((f) => [f.key, f.enabled]));
  return map as Record<string, boolean>;
}
