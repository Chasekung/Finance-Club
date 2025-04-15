import { NextResponse } from 'next/server';

export function GET() {
  return new NextResponse(
    JSON.stringify({ message: 'Authentication not available in static build' }),
    { status: 404, headers: { 'content-type': 'application/json' } }
  );
}

export { GET as POST }; 