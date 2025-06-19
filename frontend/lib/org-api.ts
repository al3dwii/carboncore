import { Org } from "@/types/org";

export async function fetchOrgs(): Promise<Org[]> {
  const r = await fetch("/api/orgs", { cache: "no-store" });
  if (!r.ok) throw new Error("Org fetch failed");
  return Org.array().parse(await r.json());
}
