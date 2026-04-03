import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Thuê Thiết Bị | Canon Store',
  description: 'Tính năng thuê máy ảnh Canon sắp ra mắt.',
};

export default function RentPage() {
  return (
    <div className="container mx-auto py-20 px-4 md:px-6 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="relative p-12 overflow-hidden rounded-2xl bg-muted/50 border shadow-lg max-w-2xl text-center flex flex-col items-center">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-md pointer-events-none opacity-20 blur-[100px] bg-primary rounded-full"></div>
        
        <div className="w-20 h-20 bg-background/80 backdrop-blur rounded-2xl border flex items-center justify-center mb-6 shadow-xl relative z-10">
          <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 relative z-10">
          Tính Năng Đang Nâng Cấp
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8 max-w-md relative z-10">
          Chức năng <strong className="text-foreground">Thuê Thiết Bị theo ngày</strong> đang được chúng tôi cấu trúc lại hệ thống khoá vận trực tuyến để mang đến trải nghiệm tốt nhất. Vui lòng quay lại sau!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full sm:w-auto">
          <Link href="/products" className="w-full">
            <Button size="lg" className="w-full px-8 shadow-md">
              Tham Quan Gian Hàng
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="outline" size="lg" className="w-full px-8 bg-background/50 backdrop-blur">
              Trở Về Trang Chủ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
