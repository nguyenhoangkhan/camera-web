import { Metadata } from 'next';
import { Product } from '@prisma/client';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from '@/components/storefront/AddToCartButton';

export const metadata: Metadata = {
  title: 'Máy ảnh Canon chính hãng',
  description: 'Danh sách các dòng máy ảnh Canon chuyên nghiệp. Hỗ trợ mua mới và thuê thiết bị theo ngày giá tốt nhất.',
};

export default async function ProductsPage() {
  let products: Product[] = [];
  try {
    products = await prisma.product.findMany({
      where: { isBuyable: true },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Database connection error or no data:", error);
  }

  // Fallback dummy data
  if (products.length === 0) {
    products = [
      {
        id: '1', name: 'Canon EOS R5', slug: 'canon-eos-r5', description: 'Máy ảnh Mirrorless Full-frame chuyên nghiệp',
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop',
        brand: 'Canon', type: 'Mirrorless', isBuyable: true, priceBuy: 85000000, stockBuy: 5,
        isRentable: true, priceRentPerDay: 800000, stockRent: 2, createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: '2', name: 'Canon RF 24-70mm f/2.8L IS USM', slug: 'canon-rf-24-70mm', description: 'Ống kính zoom đa dụng',
        imageUrl: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=800&auto=format&fit=crop',
        brand: 'Canon', type: 'Lens', isBuyable: true, priceBuy: 55000000, stockBuy: 3,
        isRentable: true, priceRentPerDay: 400000, stockRent: 4, createdAt: new Date(), updatedAt: new Date()
      }
    ] as unknown as Product[];
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Sản phẩm Thiết bị Canon</h1>
        <p className="text-muted-foreground">Khám phá các thiết bị chuyên nghiệp. Hệ sinh thái toàn diện dành cho bạn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
            <Link href={`/products/${product.slug}`} className="cursor-pointer">
              <div className="relative aspect-4/3 w-full bg-muted">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-secondary">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
              </div>
            </Link>
            <CardHeader>
              <div className="flex justify-between items-start gap-2 mb-2">
                <Badge variant="outline">{product.type}</Badge>
                {product.stockBuy > 0 ? (
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">Còn hàng</Badge>
                ) : (
                  <Badge variant="secondary">Hết hàng</Badge>
                )}
              </div>
              <Link href={`/products/${product.slug}`} className="hover:text-primary">
                <CardTitle className="line-clamp-1">{product.name}</CardTitle>
              </Link>
              <CardDescription className="line-clamp-2 min-h-10">{product.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <p className="text-2xl font-bold text-foreground">
                {product.priceBuy ? formatCurrency(product.priceBuy) : 'Liên hệ'}
              </p>
            </CardContent>
            <CardFooter>
              <AddToCartButton 
                type="BUY" 
                product={{
                  id: product.id,
                  name: product.name,
                  imageUrl: product.imageUrl,
                  priceBuy: product.priceBuy,
                  priceRentPerDay: product.priceRentPerDay
                }} 
                disabled={product.stockBuy <= 0} 
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
