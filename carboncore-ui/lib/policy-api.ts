export async function fetchPolicy(): Promise<{ weight: number }> {
  const res = await fetch("/api/router/policy", { cache: "no-store" });
  if (!res.ok) throw new Error("Policy fetch failed");
  return res.json();
}

export async function patchPolicy(body: { weight: number }) {
  const res = await fetch("/api/router/policy", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error("Policy update failed");
  return res.json();
}
