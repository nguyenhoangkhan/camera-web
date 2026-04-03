'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  orderType: 'BUY' | 'RENT';
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
  createdAt: string;
}

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await fetch('/api/admin/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      return res.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error('Failed to update order status');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Đã cập nhật trạng thái đơn hàng');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      toast.error('Không thể cập nhật trạng thái: ' + error.message);
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-amber-500 border-amber-500';
      case 'CONFIRMED': return 'text-blue-500 border-blue-500';
      case 'SHIPPED': return 'text-purple-500 border-purple-500';
      case 'DELIVERED': return 'text-green-500 border-green-500';
      case 'CANCELLED': return 'text-destructive border-destructive';
      case 'RETURNED': return 'text-gray-500 border-gray-500';
      default: return 'text-muted-foreground';
    }
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
              <TableHead className="text-right">Cập Nhật Trạng Thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                  Đang tải danh sách đơn hàng...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  Chưa có đơn hàng nào
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order: Order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs font-semibold">{order.id.slice(0, 8).toUpperCase()}</TableCell>
                  <TableCell>
                    <p className="font-medium text-sm">{order.customerName}</p>
                    <p className="text-[10px] text-muted-foreground">{order.customerPhone}</p>
                  </TableCell>
                  <TableCell>
                    {order.orderType === 'BUY' ? (
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px]">Mua đứt</Badge>
                    ) : (
                      <Badge variant="outline" className="border-blue-500/50 text-blue-600 bg-blue-500/5 text-[10px]">Thuê máy</Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-bold text-sm">
                    {formatCurrency(order.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getStatusColor(order.status)} whitespace-nowrap text-[10px] uppercase font-bold py-0 h-5`}>
                      {order.status === 'PENDING' && <Clock className="w-2 h-2 mr-1" />}
                      {order.status === 'DELIVERED' && <CheckCircle className="w-2 h-2 mr-1" />}
                      {order.status === 'CANCELLED' && <AlertCircle className="w-2 h-2 mr-1" />}
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[11px] text-muted-foreground">
                    {dayjs(order.createdAt).format('DD/MM/YYYY')}
                    <br />
                    {dayjs(order.createdAt).format('HH:mm')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Select 
                      defaultValue={order.status} 
                      onValueChange={(v: string | null) => updateStatusMutation.mutate({ id: order.id, status: v ?? '' })}
                      disabled={updateStatusMutation.isPending}
                    >
                      <SelectTrigger className="w-[140px] h-8 text-[11px] ml-auto">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent align="end">
                        <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                        <SelectItem value="CONFIRMED">Xác nhận</SelectItem>
                        <SelectItem value="SHIPPED">Đang giao</SelectItem>
                        <SelectItem value="DELIVERED">Hoàn thành</SelectItem>
                        <SelectItem value="CANCELLED">Hủy đơn</SelectItem>
                        <SelectItem value="RETURNED">Đã trả</SelectItem>
                      </SelectContent>
                    </Select>
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
