import prisma from '@/lib/prisma';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản Lý Đơn Hàng</h1>
        <p className="text-muted-foreground mt-1">Lịch sử giao dịch và yêu cầu thuê thiết bị.</p>
      </div>

      <div className="border rounded-md bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[100px]">Mã Đơn</TableHead>
              <TableHead>Khách Hàng</TableHead>
              <TableHead>Phân Loại</TableHead>
              <TableHead>Tổng Tiền</TableHead>
              <TableHead>Trạng Thái</TableHead>
              <TableHead>Ngày Đặt</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  Chưa có đơn hàng nào
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id.slice(0, 8).toUpperCase()}</TableCell>
                  <TableCell>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                  </TableCell>
                  <TableCell>
                    {order.orderType === 'BUY' ? (
                      <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/30 border-0">Mua đứt</Badge>
                    ) : (
                      <Badge variant="outline" className="border-blue-500/50 text-blue-600 bg-blue-500/10">Thuê máy</Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(order.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 w-fit">
                      {order.status === 'PENDING' && (
                        <Badge variant="outline" className="text-amber-500 border-amber-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Chờ xử lý
                        </Badge>
                      )}
                      {(order.status === 'DELIVERED' || order.status === 'SHIPPED' || order.status === 'CONFIRMED') && (
                        <Badge variant="outline" className="text-green-500 border-green-500 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> {order.status === 'DELIVERED' ? 'Hoàn thành' : (order.status === 'SHIPPED' ? 'Đang giao' : 'Đã xác nhận')}
                        </Badge>
                      )}
                      {order.status === 'CANCELLED' && (
                        <Badge variant="outline" className="text-destructive border-destructive">Đã huỷ</Badge>
                      )}
                      {order.status === 'RETURNED' && (
                        <Badge variant="outline" className="text-gray-500 border-gray-500">Đã trả hàng</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </Button>
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
