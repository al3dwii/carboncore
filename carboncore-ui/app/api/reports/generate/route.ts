import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const backendURL = `${process.env.BACKEND_URL}/reports/generate`;
  const resp = await fetch(backendURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await req.text()
  });
  return NextResponse.json(await resp.json(), { status: resp.status });
}
