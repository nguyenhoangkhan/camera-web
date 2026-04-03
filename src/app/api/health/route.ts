import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  
  const status = {
    env: {
      DATABASE_URL: dbUrl ? 'Defined (starts with ' + dbUrl.slice(0, 10) + '...)' : 'Undefined',
    },
    database: 'Checking...',
    error: null as string | null,
    timestamp: new Date().toISOString(),
  };

  try {
    // Try a simple query
    await prisma.$queryRaw`SELECT 1`;
    status.database = 'Connected Successfully';
  } catch (error: any) {
    status.database = 'Connection Failed';
    status.error = error.message;
    console.error('Health check database error:', error);
  }

  return NextResponse.json(status);
}
