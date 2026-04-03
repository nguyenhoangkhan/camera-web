import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface OrderSuccessPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const resolvedParams = await params;
  
  return (
    <div className="container mx-auto py-20 px-4 md:px-6 flex flex-col items-center min-h-[70vh]">
      <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-lg">
        <div className="text-green-500">
          <CheckCircle className="w-24 h-24" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">Đặt Hàng Thành Công!</h1>
        <p className="text-lg text-muted-foreground">
          Cảm ơn bạn đã tin tưởng hệ sinh thái Canon. Đơn hàng của bạn đã được ghi nhận và đang chờ xử lý.
        </p>
        
        <Card className="w-full mt-8 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">Mã Đơn Hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-lg break-all bg-muted p-2 rounded-md font-semibold text-primary">
              {resolvedParams.id}
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Chúng tôi sẽ sớm liên hệ với bạn để xác nhận đơn hàng qua số điện thoại/email bạn đã cung cấp.
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 w-full mt-8">
          <Link href="/products" className="w-full">
            <Button className="w-full" size="lg">Tiếp Tục Mua Sắm</Button>
          </Link>
          <Link href="/rent" className="w-full">
            <Button variant="outline" className="w-full" size="lg">Thuê Thiết Bị</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
