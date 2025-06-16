import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const backendURL = `${process.env.BACKEND_URL}/jobs?${searchParams.toString()}`;
  const resp = await fetch(backendURL, { headers: { Authorization: req.headers.get("Authorization")! } });
  return NextResponse.json(await resp.json());
}

export async function PATCH(req: NextRequest) {
  const { pathname } = req.nextUrl;           // /api/jobs/123
  const id = pathname.split("/").pop();
  const backendURL = `${process.env.BACKEND_URL}/jobs/${id}`;
  const resp = await fetch(backendURL, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: await req.text()
  });
  return NextResponse.json(await resp.json(), { status: resp.status });
}
