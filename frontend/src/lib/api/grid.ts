// src/lib/api/grid.ts  (new file, or extend api.ts)
export interface GridSlot {
  start: string;   // ISO string
  end:   string;
  clean: boolean;  // true = green window
}

export async function getGridIntensity(
  orgId: string,
  from: Date,
  to: Date
): Promise<GridSlot[]> {
  const res = await fetch(
    `/api/proxy/org/${orgId}/grid-intensity?from=${from.toISOString()}&to=${to.toISOString()}`
  );
  if (!res.ok) throw new Error("grid-intensity fetch failed");
  return res.json();
}
