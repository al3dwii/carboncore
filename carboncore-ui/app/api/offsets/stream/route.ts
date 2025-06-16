import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { readable, writable } = new TransformStream();
  const backend = await fetch(`${process.env.BACKEND_URL}/offsets/stream`, {
    headers: { Accept: "text/event-stream" }
  });
  if (!backend.body) throw new Error("No stream");
  backend.body.pipeTo(writable);
  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache"
    }
  });
}
