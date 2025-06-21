import { NextResponse } from 'next/server';

export function GET() {
  // feature flags – leave empty for now
  return NextResponse.json({ items: [] });
}
