import prisma from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      brand: true
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
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
              <TableHead>Trạng Thái Bán</TableHead>
              <TableHead>Trạng Thái Thuê</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!
                </TableCell>
              </TableRow>
            ) : (
              products.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative w-12 h-12 rounded bg-muted overflow-hidden">
                      {product.imageUrl ? (
                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary text-xs text-muted-foreground">No img</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.brand?.name || 'K/X'} • {product.category?.name || 'Chưa phân loại'}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 w-fit">
                      {product.isBuyable && <Badge variant="default" className="text-[10px]">Mua đứt</Badge>}
                      {product.isRentable && <Badge variant="outline" className="text-[10px] border-primary text-primary">Cho thuê</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.isBuyable ? (
                      <div>
                        <p className="font-semibold">{product.priceBuy ? formatCurrency(product.priceBuy) : '-'}</p>
                        <p className="text-xs text-muted-foreground">Kho: {product.stockBuy}</p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {product.isRentable ? (
                      <div>
                        <p className="font-semibold">{product.priceRentPerDay ? formatCurrency(product.priceRentPerDay) : '-'}/ngày</p>
                        <p className="text-xs text-muted-foreground">Kho: {product.stockRent}</p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
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
