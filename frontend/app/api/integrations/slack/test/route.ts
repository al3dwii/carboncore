import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const backendURL = `${process.env.BACKEND_URL}/integrations/slack/test`;
  const resp = await fetch(backendURL, {
    headers: { Authorization: req.headers.get("Authorization")! }
  });
  return NextResponse.json(await resp.json(), { status: resp.status });
}
