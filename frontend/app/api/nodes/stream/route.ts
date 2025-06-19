import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const backendURL = `${process.env.BACKEND_URL}/nodes/stream`;
  const resp = await fetch(backendURL, {
    headers: { Authorization: req.headers.get("Authorization")! }
  });
  return new NextResponse(resp.body, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache"
    }
  });
}
