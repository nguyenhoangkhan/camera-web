"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MainNav() {
  const pathname = usePathname();

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
    // {
    //   href: '/admin',
    //   label: 'Admin (Demo)',
    //   active: pathname === '/admin' || pathname.startsWith('/admin/'),
    // },
  ];

  return (
    <>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={`text-sm font-medium transition-colors hover:text-primary ${
            route.active ? "text-primary font-bold" : "text-muted-foreground"
          } ${route.href === "/admin" ? "mr-4" : ""}`}
        >
          {route.label}
        </Link>
      ))}
    </>
  );
}
