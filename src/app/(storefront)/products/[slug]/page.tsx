import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import AddToCartButton from "@/components/storefront/AddToCartButton";

export const dynamic = "force-dynamic";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const resolvedParams = await params;

  let product;
  try {
    product = await prisma.product.findUnique({
      where: { slug: resolvedParams.slug },
      include: {
        brand: true,
        category: true,
        images: true,
      },
    });
  } catch (err) {
    console.error(err);
  }

  // Fallback dummy data for review

  if (!product) {
    notFound();
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const allImages =
    product.images.length > 0
      ? product.images.map((img: any) => img.url)
      : [product.imageUrl || ""];

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-4">
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

          {allImages.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {allImages.map((url: any, i: number) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-md overflow-hidden border bg-muted cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={url}
                    alt={`${product.name} ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <div className="flex gap-2 mb-3">
              <Badge>{product.brand?.name || "K/X"}</Badge>
              <Badge variant="outline">{product.category?.name || "K/X"}</Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
              {product.name}
            </h1>
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
                    Trạng thái:{" "}
                    {product.stockBuy > 0 ? (
                      <span className="text-green-600 font-medium">
                        Còn hàng
                      </span>
                    ) : (
                      <span className="text-destructive font-medium">
                        Hết hàng
                      </span>
                    )}
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {product.priceBuy
                      ? formatCurrency(product.priceBuy)
                      : "Liên hệ"}
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <AddToCartButton
                    type="BUY"
                    product={{
                      id: product.id,
                      name: product.name,
                      imageUrl: product.imageUrl,
                      priceBuy: (product as any).priceBuy,
                      priceRentPerDay: (product as any).priceRentPerDay,
                    }}
                    disabled={(product as any).stockBuy <= 0}
                  />
                </div>
              </div>
            )}

            {product.isRentable && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-card border shadow-sm">
                <div>
                  <h3 className="font-semibold text-lg">Thuê Theo Ngày</h3>
                  <div className="text-sm text-muted-foreground mb-1">
                    Trạng thái:{" "}
                    {product.stockRent > 0 ? (
                      <span className="text-primary font-medium">Sẵn sàng</span>
                    ) : (
                      <span className="text-muted-foreground font-medium">
                        Kín lịch
                      </span>
                    )}
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    {product.priceRentPerDay
                      ? formatCurrency(product.priceRentPerDay)
                      : "Liên hệ"}
                    <span className="text-lg font-normal text-muted-foreground">
                      /ngày
                    </span>
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <AddToCartButton
                    type="RENT"
                    product={{
                      id: product.id,
                      name: product.name,
                      imageUrl: product.imageUrl,
                      priceBuy: (product as any).priceBuy,
                      priceRentPerDay: (product as any).priceRentPerDay,
                    }}
                    disabled={(product as any).stockRent <= 0}
                  />
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
