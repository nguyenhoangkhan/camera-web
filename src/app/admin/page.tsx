import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/prisma';
import { Package, ShoppingCart, Users, DollarSign, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  // Aggregate stats
  const totalProducts = await prisma.product.count();
  const totalOrders = await prisma.order.count();
  
  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      items: true
    }
  });

  const aggregateResult = await prisma.order.aggregate({
    _sum: {
      totalAmount: true
    }
  });
  
  const totalRevenue = aggregateResult._sum.totalAmount || 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tổng Quan Hệ Thống</h1>
        <p className="text-muted-foreground mt-1">Hello Khan, đây là tình hình hoạt động kinh doanh hôm nay.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Doanh Thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">Từ các đơn Mua & Thuê</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn Hàng Mới</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">Tổng cộng các đơn đặt hàng</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kho Thiết Bị</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">Sản phẩm đang được quản lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách Hàng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">~</div>
            <p className="text-xs text-muted-foreground mt-1">Số liệu đang thu thập</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Đơn Hàng Gần Đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentOrders.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">Chưa có đơn hàng nào</div>
              ) : (
                recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">{formatCurrency(order.totalAmount)}</p>
                        <p className={`text-xs font-medium ${order.orderType === 'BUY' ? 'text-primary' : 'text-blue-500'}`}>
                          {order.orderType === 'BUY' ? 'Mua máy' : 'Thuê thiết bị'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {recentOrders.length > 0 && (
              <div className="mt-6">
                <Link href="/admin/orders" className="text-sm text-primary flex items-center font-medium hover:underline">
                  Xem tất cả đơn hàng <ArrowUpRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
