import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Return the enabled feature-flags for a given organisation.
 * Replace the static object with a DB / LaunchDarkly lookup when ready.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { orgId: string } }
) {
  // quick demo: enable everything for every org
  const flags = {
    router: true,
    pulse: true,
    scheduler: true,
    budget: true,
    "iac-advisor": true,
    greendev: true,
    offsets: true,
  };
  return NextResponse.json(flags);
}