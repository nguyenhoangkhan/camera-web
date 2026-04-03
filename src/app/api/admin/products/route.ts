import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  brand: z.string().default('Canon'),
  type: z.string(),
  isBuyable: z.boolean().default(true),
  priceBuy: z.number().optional(),
  stockBuy: z.number().default(0),
  isRentable: z.boolean().default(false),
  priceRentPerDay: z.number().optional(),
  stockRent: z.number().default(0),
});

// GET /api/admin/products
export async function GET(req: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to list products", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/admin/products
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = productSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid data', details: result.error.format() }, { status: 400 });
    }
    
    const data = result.data;
    
    // Check slug uniqueness
    const existing = await prisma.product.findUnique({
      where: { slug: data.slug }
    });
    
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }
    
    const newProduct = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        imageUrl: data.imageUrl,
        brand: data.brand,
        type: data.type,
        isBuyable: data.isBuyable,
        priceBuy: data.priceBuy,
        stockBuy: data.stockBuy,
        isRentable: data.isRentable,
        priceRentPerDay: data.priceRentPerDay,
        stockRent: data.stockRent,
      }
    });
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Failed to create product", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
