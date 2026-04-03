'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, Building2 } from 'lucide-react';
import { toast } from 'sonner';

interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function BrandsPage() {
  const queryClient = useQueryClient();
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandLogo, setNewBrandLogo] = useState('');

  const { data: brands = [], isLoading } = useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: async () => {
      const res = await fetch('/api/admin/brands');
      if (!res.ok) throw new Error('Failed to fetch brands');
      return res.json();
    },
  });

  const addMutation = useMutation({
    mutationFn: async (newBrand: { name: string; logoUrl: string }) => {
      const res = await fetch('/api/admin/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBrand),
      });
      if (!res.ok) throw new Error('Failed to create brand');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Đã thêm thương hiệu mới');
      setNewBrandName('');
      setNewBrandLogo('');
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
    onError: () => toast.error('Có lỗi xảy ra'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch('/api/admin/brands', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Đã xóa thương hiệu');
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
    onError: () => toast.error('Không thể xóa thương hiệu này (có thể đang có sản phẩm liên kết)'),
  });

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    addMutation.mutate({ name: newBrandName, logoUrl: newBrandLogo });
  };

  const handleDeleteBrand = (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản Lý Thương Hiệu</h1>
        <p className="text-muted-foreground mt-1">Quản lý danh mục các thương hiệu thiết bị camera.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Thêm Thương Hiệu Mới</CardTitle>
            <CardDescription>Tạo danh mục brand mới cho sản phẩm.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddBrand} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên thương hiệu *</Label>
                <Input 
                  id="name" 
                  placeholder="VD: Canon, Sony, Nikon..." 
                  value={newBrandName} 
                  onChange={(e) => setNewBrandName(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">URL Logo (Không bắt buộc)</Label>
                <Input 
                  id="logo" 
                  placeholder="https://..." 
                  value={newBrandLogo} 
                  onChange={(e) => setNewBrandLogo(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={addMutation.isPending}>
                <Plus className="w-4 h-4 mr-2" /> 
                {addMutation.isPending ? 'Đang lưu...' : 'Thêm Thương Hiệu'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Danh sách Thương hiệu</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên Thương Hiệu</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">Đang tải...</TableCell>
                  </TableRow>
                ) : brands.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">Chưa có thương hiệu nào.</TableCell>
                  </TableRow>
                ) : (
                  brands.map((brand: Brand) => (
                    <TableRow key={brand.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        {brand.name}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">{brand.slug}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteBrand(brand.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
