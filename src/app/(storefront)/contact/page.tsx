import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, User, MapPin } from 'lucide-react';
import CopyPhone from '@/components/storefront/CopyPhone';

export const metadata: Metadata = {
  title: 'Liên hệ | Canon Store',
  description: 'Thông tin liên hệ mua bán máy ảnh cũ lướt chính hãng.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto py-20 px-4 md:px-6 min-h-[70vh]">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">Liên Hệ Với Chúng Tôi</h1>
          <p className="text-lg text-muted-foreground">
            Nếu bạn có nhu cầu mua bán, trao đổi hoặc cần thẩm định các thiết bị máy ảnh cũ, vui lòng liên hệ trực tiếp với chúng tôi qua thông tin bên dưới.
          </p>
        </div>

        <Card className="border-primary/20 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-48 h-48">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
          </div>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Thông Tin Cá Nhân</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Họ và tên</p>
                <p className="text-xl font-semibold">Nguyễn Hoàng Khan</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Số điện thoại / Zalo</p>
                <p className="text-xl font-semibold">
                  <CopyPhone phone="0394696310">0394696310</CopyPhone>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Email</p>
                <p className="text-xl font-semibold hover:text-primary transition-colors">
                  <a href="mailto:hoangkhan.work@gmail.com">hoangkhan.work@gmail.com</a>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Địa chỉ giao dịch</p>
                <p className="text-xl font-semibold">Liên hệ trực tiếp để hẹn lịch xem máy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
