import { NextResponse } from "next/server";

export async function GET() {
  // return an empty array so the VirtualTable renders nothing instead of 404
  return NextResponse.json([]);
}
