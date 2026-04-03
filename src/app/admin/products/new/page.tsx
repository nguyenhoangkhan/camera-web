'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    brand: 'Canon',
    type: 'Mirrorless',
    isBuyable: true,
    priceBuy: '',
    stockBuy: '',
    isRentable: false,
    priceRentPerDay: '',
    stockRent: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleNameBlur = () => {
    if (!formData.slug && formData.name) {
      setFormData(prev => ({ ...prev, slug: generateSlug(prev.name) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.isBuyable && !formData.isRentable) {
      toast.error('Thiếu thông tin', { description: 'Sản phẩm phải được thiết lập để Bán hoặc Cho thuê.' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Clean up string inputs into numbers
      const payload = {
        ...formData,
        priceBuy: formData.priceBuy ? parseFloat(formData.priceBuy) : null,
        stockBuy: formData.stockBuy ? parseInt(formData.stockBuy, 10) : 0,
        priceRentPerDay: formData.priceRentPerDay ? parseFloat(formData.priceRentPerDay) : null,
        stockRent: formData.stockRent ? parseInt(formData.stockRent, 10) : 0,
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Failed to create product');
      }

      toast.success('Đã Tạo Sản Phẩm!', {
        description: `${formData.name} đã được thêm vào hệ thống.`
      });
      router.push('/admin/products');
      router.refresh();
      
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra', { description: 'Không thể lưu sản phẩm vào database.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Thêm Thiết Bị Mới</h1>
          <p className="text-muted-foreground mt-1">Cấu hình thông số và giá cho sản phẩm.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Thông Tin Chung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên sản phẩm *</Label>
                  <Input id="name" name="name" required value={formData.name} onChange={handleChange} onBlur={handleNameBlur} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Đường dẫn tĩnh (Slug) *</Label>
                  <Input id="slug" name="slug" required value={formData.slug} onChange={handleChange} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Thương hiệu</Label>
                  <Input id="brand" name="brand" value={formData.brand} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Loại hình (Mirrorless, Lens, v.v.)</Label>
                  <Input id="type" name="type" value={formData.type} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL Hình ảnh</Label>
                <Input id="imageUrl" name="imageUrl" placeholder="https://..." value={formData.imageUrl} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả sản phẩm</Label>
                <Textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bán Sản Phẩm</CardTitle>
                  <CardDescription>Thiết lập để khách hàng có thể mua đứt.</CardDescription>
                </div>
                <Switch 
                  checked={formData.isBuyable} 
                  onCheckedChange={(c) => handleSwitchChange('isBuyable', c)} 
                />
              </div>
            </CardHeader>
            {formData.isBuyable && (
              <CardContent className="space-y-4 pt-0 border-t mt-4">
                <div className="space-y-2 mt-4">
                  <Label htmlFor="priceBuy">Giá bán lẻ (VNĐ) *</Label>
                  <Input id="priceBuy" name="priceBuy" type="number" required={formData.isBuyable} value={formData.priceBuy} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stockBuy">Số lượng kho bán *</Label>
                  <Input id="stockBuy" name="stockBuy" type="number" required={formData.isBuyable} value={formData.stockBuy} onChange={handleChange} />
                </div>
              </CardContent>
            )}
          </Card>

          <Card className="border-blue-500/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Cho Thuê Thiết Bị</CardTitle>
                  <CardDescription>Cho phép khách thuê máy theo ngày.</CardDescription>
                </div>
                <Switch 
                  checked={formData.isRentable} 
                  onCheckedChange={(c) => handleSwitchChange('isRentable', c)} 
                />
              </div>
            </CardHeader>
            {formData.isRentable && (
              <CardContent className="space-y-4 pt-0 border-t mt-4">
                <div className="space-y-2 mt-4">
                  <Label htmlFor="priceRentPerDay">Giá thuê 1 ngày (VNĐ) *</Label>
                  <Input id="priceRentPerDay" name="priceRentPerDay" type="number" required={formData.isRentable} value={formData.priceRentPerDay} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stockRent">Số lượng thiết bị cho thuê *</Label>
                  <Input id="stockRent" name="stockRent" type="number" required={formData.isRentable} value={formData.stockRent} onChange={handleChange} />
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin/products">
            <Button variant="outline" type="button">Huỷ bỏ</Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
            <Save className="w-4 h-4" /> {isSubmitting ? 'Đang lưu...' : 'Lưu Sản Phẩm'}
          </Button>
        </div>
      </form>
    </div>
  );
}
