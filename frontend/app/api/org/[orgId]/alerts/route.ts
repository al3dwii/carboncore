import { NextResponse } from "next/server";

export async function GET() {
  /* Empty list → count = 0 */
  return NextResponse.json({ items: [], count: 0 });
}
