import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const backendURL = `${process.env.BACKEND_URL}/kpi`;
  const resp = await fetch(backendURL, { headers: { Authorization: req.headers.get("Authorization")! } });
  const data = await resp.json();
  return NextResponse.json(data);
}
