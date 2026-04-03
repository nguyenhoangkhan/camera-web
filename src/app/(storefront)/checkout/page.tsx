'use client';

import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          totalAmount: getTotal(),
          items: items.map(i => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
            type: i.type,
            rentDays: i.rentDays
          }))
        }),
      });

      if (response.ok) {
        const data = await response.json();
        clearCart();
        router.push(`/order/${data.orderId}/success`);
      } else {
        alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      alert('Không thể kết nối đến máy chủ.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Thanh Toán</h1>

      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin giao hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Họ và tên</Label>
                  <Input id="customerName" name="customerName" required value={formData.customerName} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input id="customerEmail" name="customerEmail" type="email" required value={formData.customerEmail} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Số điện thoại</Label>
                  <Input id="customerPhone" name="customerPhone" type="tel" required value={formData.customerPhone} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerAddress">Địa chỉ nhận hàng</Label>
                  <Input id="customerAddress" name="customerAddress" required value={formData.customerAddress} onChange={handleInputChange} />
                </div>
                <Button type="submit" className="w-full mt-6" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang xử lý...' : 'Xác nhặt Đặt Hàng'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.type === 'BUY' ? 'Mua đứt' : `Thuê x ${item.rentDays} ngày`} 
                      {' x '} {item.quantity}
                    </p>
                  </div>
                  <div className="font-medium">
                    {formatCurrency(item.price * item.quantity * (item.type === 'RENT' && item.rentDays ? item.rentDays : 1))}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between items-center pt-4">
                <span className="font-bold text-lg">Tổng tiền</span>
                <span className="font-bold text-2xl text-primary">{formatCurrency(getTotal())}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
