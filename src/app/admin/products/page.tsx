'use client';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, error } = useQuery<any[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/api/admin/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete product');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Đã xoá sản phẩm thành công');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: Error) => {
      toast.error('Lỗi khi xoá sản phẩm: ' + error.message);
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xoá sản phẩm "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản Lý Sản Phẩm</h1>
          <p className="text-muted-foreground mt-1">Quản lý kho thiết bị bán và cho thuê của bạn.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Thêm Thiết Bị Mới
          </Button>
        </Link>
      </div>

      <div className="border rounded-md bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px]">Ảnh</TableHead>
              <TableHead>Tên Thiết Bị</TableHead>
              <TableHead>Phân Loại</TableHead>
              <TableHead>Bán (Giá/Kho)</TableHead>
              <TableHead>Thuê (Giá/Kho)</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Đang tải danh sách...
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-destructive">
                  <div className="flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Có lỗi xảy ra khi tải dữ liệu.
                  </div>
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative w-12 h-12 rounded bg-muted overflow-hidden border">
                      {product.imageUrl ? (
                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary text-[10px] text-muted-foreground">No img</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {product.brand?.name || 'K/X'} • {product.category?.name || 'K/X'}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 w-fit">
                      {product.isBuyable && <Badge variant="outline" className="text-[9px] bg-primary/5 text-primary border-primary/20">MUA</Badge>}
                      {product.isRentable && <Badge variant="outline" className="text-[9px] border-blue-500/50 text-blue-600 bg-blue-500/5">THUÊ</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.isBuyable ? (
                      <div className="text-xs">
                        <p className="font-bold">{product.priceBuy ? formatCurrency(product.priceBuy) : '-'}</p>
                        <p className="text-muted-foreground opacity-70">Kho: {product.stockBuy}</p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs italic opacity-40">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {product.isRentable ? (
                      <div className="text-xs">
                        <p className="font-bold">{product.priceRentPerDay ? formatCurrency(product.priceRentPerDay) : '-'}/ngày</p>
                        <p className="text-muted-foreground opacity-70">Kho: {product.stockRent}</p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs italic opacity-40">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
