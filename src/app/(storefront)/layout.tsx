import Link from "next/link";
import CartBadge from "@/components/storefront/CartBadge";
import MainNav from "@/components/storefront/MainNav";
import MobileNav from "@/components/storefront/MobileNav";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex h-16 items-center container mx-auto px-4 md:px-6">
          <MobileNav />
          <Link
            href="/"
            className="font-heading font-bold text-2xl tracking-tighter text-primary mr-6 ml-2 md:ml-0"
          >
            Canon Store
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="hidden md:flex items-center space-x-6 mr-4">
              <MainNav />
            </nav>
            <div className="flex items-center space-x-2">
              <CartBadge />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-12 bg-muted/40">
        <div className="container px-4 md:px-6 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              className="font-heading font-bold text-2xl tracking-tighter text-primary"
            >
              Canon Store
            </Link>
            <p className="text-sm text-muted-foreground">
              Hệ sinh thái thiết bị nhiếp ảnh Canon cũ/lướt chính hãng. Cam kết
              chất lượng, bảo hành uy tín.
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <h3 className="font-semibold text-foreground">Liên Hệ</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Nguyễn Hoàng Khan</li>
              <li>
                Hotline:{" "}
                <a
                  href="tel:0394696310"
                  className="hover:text-primary transition-colors"
                >
                  0394696310
                </a>
              </li>
              <li>
                Email:{" "}
                <a
                  href="mailto:hoangkhan.work@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  hoangkhan.work@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col space-y-4">
            <h3 className="font-semibold text-foreground">Liên Kết Nhanh</h3>
            <ul className="space-y-2 text-sm text-muted-foreground flex flex-col">
              <Link
                href="/products"
                className="hover:text-primary transition-colors w-fit"
              >
                Gian Hàng
              </Link>
              <Link
                href="/rent"
                className="hover:text-primary transition-colors w-fit"
              >
                Thuê Thiết Bị
              </Link>
              <Link
                href="/contact"
                className="hover:text-primary transition-colors w-fit"
              >
                Liên Hệ Cho Thu Mua
              </Link>
            </ul>
          </div>
        </div>

        <div className="container px-4 md:px-6 mx-auto mt-12 pt-8 border-t border-border/50">
          <p className="text-sm text-center text-muted-foreground">
            © 2024 Nguyễn Hoàng Khan. Built exactly for your camera ecosystem.
          </p>
        </div>
      </footer>
    </div>
  );
}
