import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ShieldCheck, Truck, Zap, ArrowRight, Star } from "lucide-react";
import FeaturedProducts from "@/components/storefront/FeaturedProducts";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 
        HERO SECTION
        Sử dụng Hero với background Moody tối (nền DSLR), text Glow, thẻ Glassmorphism.
      */}
      <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden bg-black text-white">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=2000&auto=format&fit=crop"
            alt="Canon Camera setup"
            fill
            className="object-cover opacity-50 scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-100"></div>
        </div>

        <div className="relative z-10 container px-4 md:px-6 mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Glassmorphism Card */}
          <div className="flex flex-col gap-6 p-6 lg:p-8 md:p-12 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl animate-in slide-in-from-left-8 fade-in duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 w-fit">
              <Star className="w-4 h-4 fill-primary" />
              <span className="text-sm font-semibold tracking-wide uppercase">
                Chuyên Thiết Bị Lướt Chất Lượng Cao
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter xl:text-7xl leading-tight">
              Khai Phóng <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                Lăng Kính
              </span>{" "}
              Mới
            </h1>

            <p className="text-zinc-300 text-lg md:text-xl font-light leading-relaxed max-w-lg">
              Chuyên trao đổi, mua bán và cho thuê các dòng máy ảnh nguyên bản.
              Cung cấp thiết bị mức giá tốt nhất để bạn kể câu chuyện hình ảnh
              của riêng mình.
            </p>

            <div className="flex flex-col lg:flex-row gap-4 mt-4">
              <Link href="/products" className="group">
                <Button
                  size="xl"
                  className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 rounded-full text-base flex items-center gap-2 group-hover:shadow-[0_0_20px_rgba(196,18,48,0.4)] transition-all"
                >
                  Khám Phá Gian Hàng
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/rent" className="group">
                <Button
                  size="xl"
                  variant="outline"
                  className="w-full sm:w-auto text-white border-white/30 bg-black/20 backdrop-blur-sm hover:bg-white hover:text-black font-semibold px-8 rounded-full text-base transition-all"
                >
                  Thuê Thiết Bị
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 
        FEATURED PRODUCTS SECTION
      */}
      <section className="w-full py-24 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div className="space-y-2">
              <h2 className="text-sm font-bold tracking-widest text-primary uppercase">
                Thiết Bị Nổi Bật
              </h2>
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Lựa Chọn Hàng Đầu
              </h3>
            </div>
            <Link
              href="/products"
              className="hidden md:flex items-center text-primary font-medium hover:underline underline-offset-4"
            >
              Xem tất cả <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <FeaturedProducts />
          <div className="mt-8 flex justify-center md:hidden">
            <Link href="/products">
              <Button variant="outline" className="rounded-full px-8">
                Xem tất cả kho hàng
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 
        VALUE PROPOSITION SECTION
        Thiết kế dạng thẻ dark mode với icon neon đỏ.
      */}
      <section className="w-full py-24 bg-zinc-950 text-zinc-50 relative overflow-hidden">
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Vì Sao Chọn Chúng Tôi?
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              Hệ thống phân phối và cho thuê uy tín hàng đầu, mang lại sự tậm
              tâm trong từng khung hình của bạn.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="group relative p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-900 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/20 group-hover:shadow-[0_0_30px_rgba(196,18,48,0.3)] transition-all duration-300 mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Kiểm Định Khắt Khe</h3>
              <p className="text-zinc-400 leading-relaxed">
                Mọi sản phẩm cũ/lướt đều trải qua quy trình test thẩm định
                nghiêm ngặt. Cam kết hoạt động hoàn hảo, bao test và bảo hành uy
                tín.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group relative p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-900 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/20 group-hover:shadow-[0_0_30px_rgba(196,18,48,0.3)] transition-all duration-300 mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Giá Trị Đích Thực</h3>
              <p className="text-zinc-400 leading-relaxed">
                Chúng tôi cam kết mang lại mức giá bán lẻ và giá thuê theo ngày
                cạnh tranh nhất cho creator.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group relative p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-900 transition-colors sm:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/20 group-hover:shadow-[0_0_30px_rgba(196,18,48,0.3)] transition-all duration-300 mb-6">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Giao Nhận Thần Tốc</h3>
              <p className="text-zinc-400 leading-relaxed">
                Hỗ trợ giao hàng siêu tốc trong nội thành bán kính 20km và hỏa
                tốc toàn quốc không lo hư hại thiết bị.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-background border-t">
        <div className="container px-4 md:px-6 mx-auto text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
            Bắt Đầu Hành Trình Sáng Tạo
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
            Đừng để ý tưởng trôi qua đi mà không được ghi lại sắc nét nhất. Lên
            đồ nghề và xuống phố ngay hôm nay.
          </p>
          <Link href="/products">
            <Button
              size="lg"
              className="rounded-full px-12 h-14 text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all"
            >
              Mua Sắm Ngay
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
