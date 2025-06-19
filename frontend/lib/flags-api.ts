import { Flag } from "@/types/flag";

export async function fetchFlags(): Promise<Flag[]> {
  const r = await fetch("/api/flags", { cache: "no-store" });
  return Flag.array().parse(await r.json());
}

export async function patchFlag(key: string, enabled: boolean) {
  await fetch(`/api/flags`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, enabled })
  });
}
