'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Save, Plus, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useMutation } from '@tanstack/react-query';

interface Brand {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    brandId: '',
    categoryId: '',
    isBuyable: true,
    priceBuy: '',
    stockBuy: '',
    isRentable: false,
    priceRentPerDay: '',
    stockRent: '',
  });

  const [images, setImages] = useState<string[]>([]);

  // Fetch product data
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/products/${productId}`);
      if (!res.ok) throw new Error('Failed to fetch product');
      const data = await res.json();
      return data;
    },
  });

  // Populate form when data arrives
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        brandId: product.brandId || '',
        categoryId: product.categoryId || '',
        isBuyable: product.isBuyable,
        priceBuy: product.priceBuy?.toString() || '',
        stockBuy: product.stockBuy?.toString() || '',
        isRentable: product.isRentable,
        priceRentPerDay: product.priceRentPerDay?.toString() || '',
        stockRent: product.stockRent?.toString() || '',
      });
      setImages(product.images?.map((img: any) => img.url) || []);
    }
  }, [product]);

  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: async () => {
      const res = await fetch('/api/admin/brands');
      if (!res.ok) throw new Error('Failed to fetch brands');
      return res.json();
    },
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/admin/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (formDataUpload: FormData) => {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      if (!res.ok) throw new Error('Upload failed');
      return res.json();
    },
    onSuccess: (data) => {
      const newUrls = data.urls;
      setImages(prev => [...prev, ...newUrls]);
      if (!formData.imageUrl && newUrls.length > 0) {
        setFormData(prev => ({ ...prev, imageUrl: newUrls[0] }));
      }
      toast.success(`Đã tải thêm ${newUrls.length} ảnh`);
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update product');
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success('Đã cập nhật sản phẩm thành công');
      router.push('/admin/products');
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error('Lỗi khi cập nhật: ' + error.message);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    const formDataUpload = new FormData();
    files.forEach(file => formDataUpload.append('files', file));
    uploadMutation.mutate(formDataUpload);
    e.target.value = '';
  };

  const removeImage = (url: string) => {
    setImages(prev => prev.filter(i => i !== url));
    if (formData.imageUrl === url) {
      setFormData(prev => ({ ...prev, imageUrl: images.find(i => i !== url) || '' }));
    }
  };

  const setAsPrimary = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
    toast.info('Đã đặt làm ảnh chính');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.isBuyable && !formData.isRentable) {
      toast.error('Thiếu thông tin', { description: 'Sản phẩm phải được thiết lập để Bán hoặc Cho thuê.' });
      return;
    }

    const payload: any = {
      ...formData,
      images: images
    };

    if (formData.isBuyable) {
      payload.priceBuy = formData.priceBuy ? parseFloat(formData.priceBuy) : 0;
      payload.stockBuy = formData.stockBuy ? parseInt(formData.stockBuy, 10) : 0;
    } else {
      payload.priceBuy = null;
      payload.stockBuy = 0;
    }

    if (formData.isRentable) {
      payload.priceRentPerDay = formData.priceRentPerDay ? parseFloat(formData.priceRentPerDay) : 0;
      payload.stockRent = formData.stockRent ? parseInt(formData.stockRent, 10) : 0;
    } else {
      payload.priceRentPerDay = null;
      payload.stockRent = 0;
    }

    saveMutation.mutate(payload);
  };

  if (isLoadingProduct) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sửa Sản Phẩm</h1>
          <p className="text-muted-foreground mt-1">Cập nhật thông số và hình ảnh thiết bị.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông Tin Chung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên sản phẩm *</Label>
                <Input id="name" name="name" required value={formData.name} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL) *</Label>
                <Input id="slug" name="slug" required value={formData.slug} onChange={handleChange} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Thương hiệu</Label>
                <Select value={formData.brandId || ""} onValueChange={(v) => handleSelectChange("brandId", v || "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thương hiệu" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand: Brand) => (
                      <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Danh mục</Label>
                <Select value={formData.categoryId || ""} onValueChange={(v) => handleSelectChange("categoryId", v || "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: Category) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        {/* Gallery */}
        <Card>
          <CardHeader>
            <CardTitle>Hình Ảnh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {images.map((url: string, index: number) => (
                <div key={index} className="relative group aspect-square rounded-lg border overflow-hidden bg-muted">
                  <Image src={url} alt={`Product ${index}`} fill className="object-cover" />
                  {formData.imageUrl === url && (
                    <div className="absolute top-0 left-0 bg-primary text-white text-[10px] px-2 py-0.5 rounded-br-lg font-bold">Primary</div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button type="button" variant="destructive" size="icon" className="h-8 w-8" onClick={() => removeImage(url)}><X className="w-4 h-4" /></Button>
                    <Button type="button" variant="secondary" size="icon" className="h-8 w-8" onClick={() => setAsPrimary(url)}><ImageIcon className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
              <label className="cursor-pointer border-2 border-dashed rounded-lg flex flex-col items-center justify-center aspect-square gap-2 bg-muted/30 hover:bg-muted/50 transition-colors">
                <Plus className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium">Thêm ảnh</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Bán Hàng</CardTitle>
                <Switch checked={formData.isBuyable} onCheckedChange={(c) => handleSwitchChange('isBuyable', c)} />
              </div>
            </CardHeader>
            {formData.isBuyable && (
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-1">
                  <Label htmlFor="priceBuy" className="text-xs uppercase font-bold text-muted-foreground">Giá bán (VNĐ)</Label>
                  <Input id="priceBuy" name="priceBuy" type="number" value={formData.priceBuy} onChange={handleChange} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="stockBuy" className="text-xs uppercase font-bold text-muted-foreground">Tồn kho bán</Label>
                  <Input id="stockBuy" name="stockBuy" type="number" value={formData.stockBuy} onChange={handleChange} />
                </div>
              </CardContent>
            )}
          </Card>

          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-blue-700">Cho Thuê</CardTitle>
                <Switch checked={formData.isRentable} onCheckedChange={(c) => handleSwitchChange('isRentable', c)} />
              </div>
            </CardHeader>
            {formData.isRentable && (
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-1">
                  <Label htmlFor="priceRentPerDay" className="text-xs uppercase font-bold text-blue-600/70">Giá thuê/ngày</Label>
                  <Input id="priceRentPerDay" name="priceRentPerDay" type="number" value={formData.priceRentPerDay} onChange={handleChange} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="stockRent" className="text-xs uppercase font-bold text-blue-600/70">Số lượng máy thuê</Label>
                  <Input id="stockRent" name="stockRent" type="number" value={formData.stockRent} onChange={handleChange} />
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        <div className="flex justify-end gap-4 border-t pt-6">
          <Link href="/admin/products">
            <Button variant="outline" type="button">Huỷ bỏ</Button>
          </Link>
          <Button type="submit" disabled={saveMutation.isPending} className="px-8 font-bold">
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Lưu Thay Đổi
          </Button>
        </div>
      </form>
    </div>
  );
}
