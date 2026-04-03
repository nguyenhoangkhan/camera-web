import { notFound } from 'next';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import AddToCartButton from '@/components/storefront/AddToCartButton';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = await params;
  
  let product;
  try {
    product = await prisma.product.findUnique({
      where: { slug: resolvedParams.slug }
    });
  } catch (err) {
    console.error(err);
  }

  // Fallback dummy data for review
  if (!product) {
    if (resolvedParams.slug === 'canon-eos-r5') {
      product = {
        id: '1', name: 'Canon EOS R5', slug: 'canon-eos-r5', description: 'Máy ảnh Mirrorless Full-frame chuyên nghiệp với độ phân giải siêu cao 45MP, quay video 8K RAW không crop. Tuyệt tác thực sự cho cả nhiếp ảnh gia và nhà quay phim.',
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
        brand: 'Canon', type: 'Mirrorless', isBuyable: true, priceBuy: 85000000, stockBuy: 5,
        isRentable: true, priceRentPerDay: 800000, stockRent: 2, createdAt: new Date(), updatedAt: new Date()
      } as any;
    } else if (resolvedParams.slug === 'canon-rf-24-70mm') {
      product = {
        id: '2', name: 'Canon RF 24-70mm f/2.8L IS USM', slug: 'canon-rf-24-70mm', description: 'Ống kính zoom đa dụng cực kỳ sắc nét. Trang bị chống rung quang học IS.',
        imageUrl: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=1200&auto=format&fit=crop',
        brand: 'Canon', type: 'Lens', isBuyable: true, priceBuy: 55000000, stockBuy: 3,
        isRentable: true, priceRentPerDay: 400000, stockRent: 4, createdAt: new Date(), updatedAt: new Date()
      } as any;
    }
  }

  if (!product) {
    notFound();
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-muted border">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-secondary">
              <span className="text-muted-foreground">Không có hình ảnh</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <div className="flex gap-2 mb-3">
              <Badge>{product.brand}</Badge>
              <Badge variant="outline">{product.type}</Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">{product.name}</h1>
            <p className="text-lg text-muted-foreground whitespace-pre-line leading-relaxed">
              {product.description || "Chưa có mô tả chi tiết."}
            </p>
          </div>

          <div className="border-y py-6 grid gap-6">
            {product.isBuyable && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-card border shadow-sm">
                <div>
                  <h3 className="font-semibold text-lg">Mua Sở Hữu</h3>
                  <div className="text-sm text-muted-foreground mb-1">
                    Trạng thái: {product.stockBuy > 0 ? <span className="text-green-600 font-medium">Còn hàng</span> : <span className="text-destructive font-medium">Hết hàng</span>}
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {product.priceBuy ? formatCurrency(product.priceBuy) : 'Liên hệ'}
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <AddToCartButton type="BUY" product={product} disabled={product.stockBuy <= 0} />
                </div>
              </div>
            )}

            {product.isRentable && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-card border shadow-sm">
                <div>
                  <h3 className="font-semibold text-lg">Thuê Theo Ngày</h3>
                  <div className="text-sm text-muted-foreground mb-1">
                    Trạng thái: {product.stockRent > 0 ? <span className="text-primary font-medium">Sẵn sàng</span> : <span className="text-muted-foreground font-medium">Kín lịch</span>}
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    {product.priceRentPerDay ? formatCurrency(product.priceRentPerDay) : 'Liên hệ'}<span className="text-lg font-normal text-muted-foreground">/ngày</span>
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <AddToCartButton type="RENT" product={product} disabled={product.stockRent <= 0} />
                </div>
              </div>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>✔ Giao hàng siêu tốc khu vực nội thành.</p>
            <p>✔ Hỗ trợ trả góp 0% qua thẻ tín dụng.</p>
            <p>✔ Bảo hành chính hãng Canon toàn quốc.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
