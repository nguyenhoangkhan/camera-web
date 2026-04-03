import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const checkoutSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(8),
  customerAddress: z.string().min(5),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
    type: z.enum(['BUY', 'RENT']),
    rentDays: z.number().optional()
  })).min(1),
  totalAmount: z.number().positive()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = checkoutSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid data', details: result.error.format() }, { status: 400 });
    }
    
    const data = result.data;
    
    // Determine the main type logic based on first item, as an approximation
    const orderType = data.items.some(i => i.type === 'RENT') ? 'RENT' : 'BUY';
    
    // Create the order with items
    const newOrder = await prisma.order.create({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        totalAmount: data.totalAmount,
        orderType: orderType,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            itemType: item.type,
            // If rental, we just calculate endDate generically by adding `rentDays` to now
            rentStartDate: item.type === 'RENT' ? new Date() : undefined,
            rentEndDate: item.type === 'RENT' && item.rentDays 
              ? new Date(new Date().setDate(new Date().getDate() + item.rentDays)) 
              : undefined
          }))
        }
      }
    });
    
    return NextResponse.json({ success: true, orderId: newOrder.id }, { status: 201 });
  } catch (error) {
    console.error("Checkout failed:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
