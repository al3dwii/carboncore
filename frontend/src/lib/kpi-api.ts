export async function fetchKpis(orgId: string) {
  // TODO replace with real fetch
  return {
    items: [
      { name: "Events / day", value: 4200, trend: [3500, 3700, 3900, 4000, 4200] },
      { name: "Failed jobs",  value: 3,    trend: [5,4,4,4,3] },
    ],
  };
}
