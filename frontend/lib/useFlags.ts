"use client";
import useSWR from "swr";
import { fetchFlags } from "./flags-api";
import { useOrg } from "./useOrg";

export function useFlags() {
  const { orgId } = useOrg();
  const { data: flags = [] } = useSWR(["flags", orgId], () => fetchFlags(orgId));
  const map = Object.fromEntries(flags.map((f) => [f.key, f.enabled]));
  return map as Record<string, boolean>;
}
