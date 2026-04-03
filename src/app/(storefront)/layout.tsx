import Link from "next/link";
import CartBadge from "@/components/storefront/CartBadge";
import MainNav from "@/components/storefront/MainNav";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4 md:px-6 mx-auto">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold sm:inline-block text-primary text-xl">
              CANON STORE
            </span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-4">
              <MainNav />
              <div className="flex items-center space-x-2">
                <CartBadge />
              </div>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 md:px-6 mx-auto">
          <p className="text-sm leading-loose text-center text-muted-foreground md:text-left">
            Built for Canon E-commerce & Rental System.
          </p>
        </div>
      </footer>
    </div>
  );
}
