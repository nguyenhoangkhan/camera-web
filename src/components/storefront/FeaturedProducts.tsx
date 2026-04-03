'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Camera } from 'lucide-react';
import AddToCartButton from '@/components/storefront/AddToCartButton';
import { Skeleton } from '@/components/ui/skeleton';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  brand: { name: string };
  category: { name: string };
  isBuyable: boolean;
  priceBuy: number;
  stockBuy: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export default function FeaturedProducts() {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const response = await fetch('/api/products/featured');
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col rounded-2xl border shadow-sm overflow-hidden">
            <Skeleton className="aspect-4/3 w-full" />
            <div className="p-5 space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-10 w-full mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !products || products.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-3xl">
        <p className="text-muted-foreground">Không tìm thấy sản phẩm nổi bật nào.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="group flex flex-col rounded-2xl bg-card border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          <Link href={`/products/${product.slug}`} className="cursor-pointer">
            <div className="relative aspect-4/3 w-full bg-muted overflow-hidden">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-secondary">
                  <Camera className="w-10 h-10 text-muted-foreground opacity-50" />
                </div>
              )}
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge className="bg-background/80 backdrop-blur text-foreground border-none hover:bg-background/90">
                  {product.brand?.name || 'Canon'}
                </Badge>
              </div>
            </div>
          </Link>
          <div className="p-5 flex flex-col flex-1">
            <div className="mb-2">
              <Badge
                variant="outline"
                className="text-xs font-normal text-muted-foreground"
              >
                {product.category?.name || 'Thiết bị'}
              </Badge>
            </div>
            <Link href={`/products/${product.slug}`} className="mb-1">
              <h4 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {product.name}
              </h4>
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
              {product.description}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <p className="text-xl font-bold">
                {product.priceBuy ? formatCurrency(product.priceBuy) : 'Liên hệ'}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t">
              <AddToCartButton
                type="BUY"
                product={product}
                disabled={product.stockBuy <= 0}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
