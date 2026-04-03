import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import {
  Package,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  TrendingUp,
  HandCoins,
} from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // Aggregate stats
  const totalProducts = await prisma.product.count();
  const totalOrders = await prisma.order.count();

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      items: true,
    },
  });

  const aggregateResult = await prisma.order.aggregate({
    _sum: {
      totalAmount: true,
    },
  });

  const totalRevenue = aggregateResult._sum.totalAmount || 0;

  // Additional stats: Sold vs Rented counts
  const buyItemsStat = await prisma.orderItem.aggregate({
    _sum: { quantity: true },
    where: { order: { orderType: "BUY" } },
  });
  const totalSold = buyItemsStat._sum.quantity || 0;

  const rentItemsStat = await prisma.orderItem.aggregate({
    _sum: { quantity: true },
    where: { order: { orderType: "RENT" } },
  });
  const totalRented = rentItemsStat._sum.quantity || 0;

  // Top Selling Products
  const topSellersQuery = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    where: { order: { orderType: "BUY" } },
    orderBy: { _sum: { quantity: "desc" } },
    take: 3,
  });

  const topSellers = await Promise.all(
    topSellersQuery.map(
      async (item: {
        productId: string;
        _sum: { quantity: number | null };
      }) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        return { ...item, name: product?.name || "Unknown" };
      },
    ),
  );

  // Top Rented Products
  const topRentalsQuery = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    where: { order: { orderType: "RENT" } },
    orderBy: { _sum: { quantity: "desc" } },
    take: 3,
  });

  const topRentals = await Promise.all(
    topRentalsQuery.map(
      async (item: {
        productId: string;
        _sum: { quantity: number | null };
      }) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        return { ...item, name: product?.name || "Unknown" };
      },
    ),
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Tổng Quan Hệ Thống
        </h1>
        <p className="text-muted-foreground">
          Hello Khan, đây là tình hình hoạt động kinh doanh lướt máy ảnh của
          bạn.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng Doanh Thu
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Sẵn sàng để xoay vòng vốn mới
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lượng Đơn Nhận
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Đơn mua và đơn thuê tổng hợp
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đã Bán / Cho Thuê
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{totalSold}</span>
              <span className="text-xs text-muted-foreground">bán</span>
              <span className="text-xl font-semibold opacity-20">/</span>
              <span className="text-2xl font-bold text-blue-500">
                {totalRented}
              </span>
              <span className="text-xs text-muted-foreground">thuê</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tổng thiết bị đã rời kho
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kho Hiện Tại</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Mẫu mã đang trưng bày
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-sm h-fit">
          <CardHeader>
            <CardTitle>Đơn Hàng Gần Đây</CardTitle>
            <CardDescription>
              Danh sách 5 đơn hàng vừa được khách chốt.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentOrders.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground">
                  Chưa có đơn hàng nào phát sinh
                </div>
              ) : (
                recentOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold leading-none">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono uppercase">
                        {order.id.slice(0, 8)} • {order.customerPhone}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">
                          {formatCurrency(order.totalAmount)}
                        </p>
                        <p
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full w-fit ml-auto mt-1 ${order.orderType === "BUY" ? "bg-primary/10 text-primary" : "bg-blue-100 text-blue-600"}`}
                        >
                          {order.orderType === "BUY"
                            ? "Mua máy"
                            : "Thuê thiết bị"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {recentOrders.length > 0 && (
              <div className="mt-8 pt-4 border-t">
                <Link
                  href="/admin/orders"
                  className="text-xs text-primary flex items-center justify-center font-bold hover:underline gap-1 uppercase tracking-wider"
                >
                  Xem tất cả đơn hàng <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          <Card className="shadow-sm border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Top Máy Bán Chạy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topSellers.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  Chưa có dữ liệu bán máy
                </p>
              ) : (
                topSellers.map((item, idx) => (
                  <div key={item.productId} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium truncate max-w-45">
                        {item.name}
                      </span>
                      <span className="font-bold text-primary">
                        {item._sum.quantity} bộ
                      </span>
                    </div>
                    <Progress
                      value={
                        idx === 0
                          ? 100
                          : (item._sum.quantity! /
                              topSellers[0]._sum.quantity!) *
                            100
                      }
                      className="h-1"
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-blue-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-blue-600">
                <HandCoins className="w-4 h-4" />
                Top Thuê Nhiều Nhất
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topRentals.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  Chưa có dữ liệu cho thuê
                </p>
              ) : (
                topRentals.map((item, idx) => (
                  <div key={item.productId} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-blue-900">
                      <span className="font-medium truncate max-w-45">
                        {item.name}
                      </span>
                      <span className="font-bold">
                        {item._sum.quantity} lượt
                      </span>
                    </div>
                    <Progress
                      value={
                        idx === 0
                          ? 100
                          : (item._sum.quantity! /
                              topRentals[0]._sum.quantity!) *
                            100
                      }
                      className="h-1 bg-blue-100 [&>div]:bg-blue-500"
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
