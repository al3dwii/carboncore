import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const limit = req.nextUrl.searchParams.get("limit") ?? "50";
  const backendURL = `${process.env.BACKEND_URL}/ledger?limit=${limit}`;
  const resp = await fetch(backendURL, { headers: { Authorization: req.headers.get("Authorization")! } });
  const data = await resp.json();
  return NextResponse.json(data);
}
