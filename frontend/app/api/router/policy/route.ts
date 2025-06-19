import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const backendURL = `${process.env.BACKEND_URL}/router/policy`;
  const resp = await fetch(backendURL, {
    headers: { Authorization: req.headers.get("Authorization")! }
  });
  return NextResponse.json(await resp.json());
}

export async function PATCH(req: NextRequest) {
  const backendURL = `${process.env.BACKEND_URL}/router/policy`;
  const resp = await fetch(backendURL, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: await req.text()
  });
  return NextResponse.json(await resp.json(), { status: resp.status });
}
