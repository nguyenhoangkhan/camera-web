"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const routes = [
    {
      href: "/products",
      label: "Mua sắm",
      active: pathname === "/products" || pathname.startsWith("/products/"),
    },
    {
      href: "/rent",
      label: "Thuê máy",
      active: pathname === "/rent" || pathname.startsWith("/rent/"),
    },
    {
      href: "/contact",
      label: "Liên hệ",
      active: pathname === "/contact" || pathname.startsWith("/contact/"),
    },
    {
      href: "/admin",
      label: "Admin (Demo)",
      active: pathname === "/admin" || pathname.startsWith("/admin/"),
    },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        }
      />
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader className="mb-8">
          <SheetTitle className="text-left font-heading font-bold text-2xl">
            Canon Store
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-6 px-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setOpen(false)}
              className={`text-lg font-medium transition-colors hover:text-primary ${
                route.active
                  ? "text-primary font-bold"
                  : "text-muted-foreground"
              }`}
            >
              {route.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
