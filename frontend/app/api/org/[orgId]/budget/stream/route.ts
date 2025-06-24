import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { sse } from "@/src/lib/sse"; // helper that pipes a ReadableStream

export async function GET(
  _req: NextRequest,
  { params }: { params: { orgId: string } },
) {
  const { orgId } = params;

  // sse() wraps headers and returns a ReadableStream
  return sse(async (send) => {
    let remaining = await getRemainingBudget(orgId); // your DB
    send({ remaining });

    // fake stream every 10 s
    const id = setInterval(async () => {
      remaining = await getRemainingBudget(orgId);
      send({ remaining });
    }, 10_000);

    return () => clearInterval(id);
  });
}

async function getRemainingBudget(orgId: string): Promise<number> {
  // TODO: replace with real DB call
  return 1000;
}
