import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Return the feature-flag map for a given org.
 * For now we just send static flags; replace with real lookup later.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { orgId: string } }
) {
  // Example: you could look at params.orgId and tailor flags
  const flags = {
    router: true,
    pulse: true,
    scheduler: true,
    "iac-advisor": true,
    budget: true,
  };
  return NextResponse.json(flags);
}
