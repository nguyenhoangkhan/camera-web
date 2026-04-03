import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  imageUrl: z.string().optional().or(z.literal("")),
  brandId: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  images: z.array(z.string()).optional(),
  isBuyable: z.boolean(),
  priceBuy: z.number().optional().nullable(),
  stockBuy: z.number(),
  isRentable: z.boolean(),
  priceRentPerDay: z.number().optional().nullable(),
  stockRent: z.number(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const { productId } = await params;
    console.log("Fetching product with ID:", productId);

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
        category: true,
        brand: true,
      },
    });

    if (!product) {
      console.log("Product not found:", productId);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("DEBUG ERROR Failed to fetch product:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { productId: string } },
) {
  try {
    const { productId } = await params;
    const body = await req.json();
    const result = productSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: result.error.format() },
        { status: 400 },
      );
    }

    const data = result.data;

    // Check slug uniqueness (excluding current product)
    const existing = await prisma.product.findFirst({
      where: {
        slug: data.slug,
        id: { not: productId },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 },
      );
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        imageUrl: data.imageUrl,
        brandId: data.brandId,
        categoryId: data.categoryId,
        isBuyable: data.isBuyable,
        priceBuy: data.priceBuy,
        stockBuy: data.stockBuy,
        isRentable: data.isRentable,
        priceRentPerDay: data.priceRentPerDay,
        stockRent: data.stockRent,
        // Update images: delete all existing and recreate
        images: data.images
          ? {
              deleteMany: {},
              create: data.images.map((url) => ({ url })),
            }
          : undefined,
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Failed to update product", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { productId: string } },
) {
  try {
    const { productId } = await params;
    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Failed to delete product", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
