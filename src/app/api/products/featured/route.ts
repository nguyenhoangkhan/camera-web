import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isBuyable: true },
      include: {
        category: true,
        brand: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 4,
    });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error('FAILED TO FETCH FEATURED PRODUCTS ON VERCEL:', 
      '\nError Message:', error.message, 
      '\nError Code:', error.code,
      '\nEnv DATABASE_URL starts with:', process.env.DATABASE_URL ? process.env.DATABASE_URL.slice(0, 10) : 'MISSING'
    );
    
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
