import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { handle: string } },
) {
  return NextResponse.json({
    enabled: false,
    lastActivity: "—",           // en-dash placeholder
  });
}
