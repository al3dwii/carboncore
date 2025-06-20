import { NextRequest, NextResponse } from "next/server";

const backend = process.env.BACKEND_URL;

export async function GET(req: NextRequest) {
  if (!backend) {
    console.error("BACKEND_URL env var is missing");
    return NextResponse.json(
      { error: "BACKEND_URL not set" },
      { status: 500 }
    );
  }

  const url  = `${backend}/budget/stream`;
  const resp = await fetch(url, {
    headers: { Authorization: req.headers.get("Authorization")! },
    // keep-alive for SSE
  });

  // Simply pipe the stream through
  return new Response(resp.body, {
    headers: { "Content-Type": "text/event-stream" },
    status:  resp.status,
  });
}


// import { NextRequest } from "next/server";

// export const dynamic = "force-dynamic";

// export async function GET(req: NextRequest) {
//   const backend = await fetch(`${process.env.BACKEND_URL}/budget/stream`, {
//     headers: { Accept: "text/event-stream" }
//   });
//   if (!backend.body) throw new Error("No stream");
//   return new Response(backend.body, {
//     headers: {
//       "Content-Type": "text/event-stream",
//       Connection: "keep-alive",
//       "Cache-Control": "no-cache"
//     }
//   });
// }
