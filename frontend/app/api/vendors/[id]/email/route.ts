import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const backendURL = `${process.env.BACKEND_URL}/vendors/${params.id}/email`;
  const resp = await fetch(backendURL, { method: "POST" });
  return NextResponse.json(await resp.json(), { status: resp.status });
}
