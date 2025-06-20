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

  const url  = `${backend}/orgs`;
  const resp = await fetch(url, {
    headers: { Authorization: req.headers.get("Authorization")! },
    cache:   "no-store",
  });

  return NextResponse.json(await resp.json(), { status: resp.status });
}
