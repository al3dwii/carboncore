import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const backendURL = `${process.env.BACKEND_URL}/integrations/webhooks`;
  const resp = await fetch(backendURL, {
    headers: { Authorization: req.headers.get("Authorization")! }
  });
  return NextResponse.json(await resp.json());
}

export async function POST(req: NextRequest) {
  const backendURL = `${process.env.BACKEND_URL}/integrations/webhooks`;
  const resp = await fetch(backendURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await req.text()
  });
  return NextResponse.json(await resp.json(), { status: resp.status });
}

export async function DELETE(req: NextRequest) {
  const { pathname } = req.nextUrl; // /api/integrations/webhooks/{id}
  const id = pathname.split("/").pop();
  const backendURL = `${process.env.BACKEND_URL}/integrations/webhooks/${id}`;
  const resp = await fetch(backendURL, { method: "DELETE" });
  return NextResponse.json(await resp.json(), { status: resp.status });
}
