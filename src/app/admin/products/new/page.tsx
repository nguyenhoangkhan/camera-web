'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

interface Brand {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

import { useQuery, useMutation } from '@tanstack/react-query';

export default function NewProductPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '', // Primary image
    brandId: '',
    categoryId: '',
    isBuyable: true,
    priceBuy: '',
    stockBuy: '',
    isRentable: false,
    priceRentPerDay: '',
    stockRent: '',
  });

  const [images, setImages] = useState<string[]>([]); // Gallery images

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
      toast.success(`Đã tải lên ${newUrls.length} ảnh`);
    },
    onError: () => toast.error('Lỗi khi tải ảnh lên'),
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create product');
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast.success('Đã Tạo Sản Phẩm!', {
        description: `${formData.name} đã được thêm vào hệ thống.`
      });
      router.push('/admin/products');
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error('Có lỗi xảy ra', { description: error.message || 'Không thể lưu sản phẩm.' });
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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameBlur = () => {
    if (!formData.slug && formData.name) {
      setFormData(prev => ({ ...prev, slug: generateSlug(prev.name) }));
    }
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

    if (!formData.brandId) {
      toast.error('Thiếu thông tin', { description: 'Vui lòng chọn thương hiệu cho sản phẩm.' });
      return;
    }

    const payload = {
      ...formData,
      priceBuy: formData.priceBuy ? parseFloat(formData.priceBuy) : null,
      stockBuy: formData.stockBuy ? parseInt(formData.stockBuy, 10) : 0,
      priceRentPerDay: formData.priceRentPerDay ? parseFloat(formData.priceRentPerDay) : null,
      stockRent: formData.stockRent ? parseInt(formData.stockRent, 10) : 0,
      images: images // Gallery URLs
    };

    saveMutation.mutate(payload);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Thêm Thiết Bị Mới</h1>
          <p className="text-muted-foreground mt-1">Cấu hình thông số, thương hiệu và hình ảnh.</p>
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
                <Input id="name" name="name" required value={formData.name} onChange={handleChange} onBlur={handleNameBlur} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Đường dẫn tĩnh (Slug) *</Label>
                <Input id="slug" name="slug" required value={formData.slug} onChange={handleChange} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Thương hiệu *</Label>
                <Select value={formData.brandId} onValueChange={(v: string | null) => handleSelectChange('brandId', v ?? '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thương hiệu" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand: Brand) => (
                      <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                    ))}
                    {brands.length === 0 && (
                      <SelectItem value="none" disabled>Chưa có thương hiệu nào</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <Link href="/admin/brands" className="text-xs text-primary hover:underline block mt-1">
                  Quản lý danh sách thương hiệu
                </Link>
              </div>
              <div className="space-y-2">
                <Label>Danh mục *</Label>
                <Select value={formData.categoryId} onValueChange={(v: string | null) => handleSelectChange('categoryId', v ?? '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: Category) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                    {categories.length === 0 && (
                      <SelectItem value="none" disabled>Chưa có danh mục nào</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <Link href="/admin/categories" className="text-xs text-primary hover:underline block mt-1">
                  Quản lý danh sách danh mục
                </Link>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả sản phẩm</Label>
              <Textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        {/* Image Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hình Ảnh Sản Phẩm</CardTitle>
            <CardDescription>Tải lên nhiều ảnh (JPG, PNG). Ảnh đầu tiên sẽ được đặt làm đại diện.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {images.map((url: string, index: number) => (
                <div key={index} className="relative group aspect-square rounded-lg border overflow-hidden bg-muted">
                  <Image src={url} alt={`Product ${index}`} fill className="object-cover" />
                  {formData.imageUrl === url && (
                    <div className="absolute top-0 left-0 bg-primary text-white text-[10px] px-2 py-0.5 rounded-br-lg font-bold">
                      Ảnh chính
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => removeImage(url)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setAsPrimary(url)}
                      title="Đặt làm ảnh chính"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <label className="cursor-pointer border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors rounded-lg flex flex-col items-center justify-center aspect-square gap-2 bg-muted/30">
                {uploadMutation.isPending ? (
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                ) : (
                  <Plus className="w-6 h-6 text-muted-foreground" />
                )}
                <span className="text-xs text-muted-foreground">{uploadMutation.isPending ? 'Đang tải...' : 'Thêm ảnh'}</span>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileUpload} 
                  disabled={uploadMutation.isPending}
                />
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-primary/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bán Sản Phẩm</CardTitle>
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
          <Button type="submit" disabled={saveMutation.isPending || uploadMutation.isPending} className="flex items-center gap-2">
            <Save className="w-4 h-4" /> {saveMutation.isPending ? 'Đang lưu...' : 'Lưu Sản Phẩm'}
          </Button>
        </div>
      </form>
    </div>
  );
}
