import { NextResponse } from "next/server";

export async function GET() {
  // 30 zero points – keeps the chart happy
  const today = new Date();
  const points = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));
    return { ts: d.toISOString().slice(0, 10), kg: 0, usd: 0 };
  });
  return NextResponse.json(points);
}
