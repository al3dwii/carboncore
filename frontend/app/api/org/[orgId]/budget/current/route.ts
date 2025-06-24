export async function GET(
  _req: Request,
  { params }: { params: { orgId: string } },
) {
  const remaining = await getRemainingBudget(params.orgId);
  return Response.json({ remaining });
}

async function getRemainingBudget(orgId: string): Promise<number> {
  // TODO: replace with real DB call
  return 1000;
}
