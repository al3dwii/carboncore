import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const backendURL = `${process.env.BACKEND_URL}/reports/download?${searchParams.toString()}`;
  const resp = await fetch(backendURL, {
    headers: { Authorization: req.headers.get("Authorization")! }
  });
  const data = await resp.arrayBuffer();
  return new NextResponse(data, {
    status: resp.status,
    headers: {
      "Content-Type": resp.headers.get("Content-Type") || "application/octet-stream",
      "Content-Disposition": resp.headers.get("Content-Disposition") || "attachment"
    }
  });
}
