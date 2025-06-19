import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const backendURL = `${process.env.BACKEND_URL}/integrations/slack/budget`;
  const resp = await fetch(backendURL, { method: "POST" });
  return NextResponse.json(await resp.json(), { status: resp.status });
}
