'use client';

import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-20 px-4 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Giỏ hàng của bạn đang trống</h2>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Có vẻ như bạn chưa chọn sản phẩm nào. Khám phá các thiết bị chuyên nghiệp ngay hôm nay!
        </p>
        <Link href="/products">
          <Button size="lg" className="px-8">Khám Phá Sản Phẩm</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Giỏ Hàng</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row shadow-sm">
                <div className="relative w-full sm:w-40 aspect-square bg-muted">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-secondary">
                      <span className="text-xs text-muted-foreground">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
                      <div className="text-sm font-medium text-primary mt-1">
                        {item.type === 'BUY' ? 'Mua đứt' : 'Thuê thiết bị'}
                        {item.type === 'RENT' && item.rentDays && ` (${item.rentDays} ngày)`}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                    <div className="font-bold text-lg">
                      {formatCurrency(item.price)}
                      {item.type === 'RENT' && <span className="text-xs font-normal text-muted-foreground ml-1">/ ngày</span>}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        className="h-8 w-14 text-center p-0"
                        value={item.quantity}
                        readOnly
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          <div className="flex justify-start pt-4">
            <Button variant="outline" className="text-muted-foreground" onClick={clearCart}>
              Xóa Toàn Bộ Giỏ Hàng
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20 shadow-md border-primary/20">
            <CardHeader className="bg-muted/50 pb-4">
              <CardTitle>Tổng Quan Đơn Hàng</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Số lượng sản phẩm</span>
                <span>{items.reduce((total, item) => total + item.quantity, 0)} mục</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Giao hàng</span>
                <span>Miễn phí</span>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-end">
                  <span className="font-semibold text-lg">Tổng cộng</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{formatCurrency(getTotal())}</p>
                    <p className="text-xs text-muted-foreground">(Đã bao gồm VAT nếu có)</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/checkout" className="w-full">
                <Button className="w-full" size="lg">Tiến Hành Thanh Toán</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
