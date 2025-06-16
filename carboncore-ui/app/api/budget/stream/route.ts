import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const backend = await fetch(`${process.env.BACKEND_URL}/budget/stream`, {
    headers: { Accept: "text/event-stream" }
  });
  if (!backend.body) throw new Error("No stream");
  return new Response(backend.body, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache"
    }
  });
}
