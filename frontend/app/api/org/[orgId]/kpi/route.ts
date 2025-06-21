import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    items: [
      { name: 'Events / day', value: 4200 },
      { name: 'Failed jobs', value: 3 },
    ],
  });
}
