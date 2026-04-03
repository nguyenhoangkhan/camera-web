'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Camera, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings,
  LayoutGrid,
  Building2
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const routes = [
    {
      label: 'Tổng Quan',
      icon: LayoutDashboard,
      href: '/admin',
      active: pathname === '/admin',
    },
    {
      label: 'Quản Lý Sản Phẩm',
      icon: Package,
      href: '/admin/products',
      active: pathname.startsWith('/admin/products'),
    },
    {
      label: 'Danh Mục',
      icon: LayoutGrid,
      href: '/admin/categories',
      active: pathname.startsWith('/admin/categories'),
    },
    {
      label: 'Thương Hiệu',
      icon: Building2,
      href: '/admin/brands',
      active: pathname.startsWith('/admin/brands'),
    },
    {
      label: 'Quản Lý Đơn Hàng',
      icon: ShoppingCart,
      href: '/admin/orders',
      active: pathname.startsWith('/admin/orders'),
    },
    {
      label: 'Cấu Hình Vận Hành',
      icon: Settings,
      href: '/admin/settings',
      active: pathname.startsWith('/admin/settings'),
    },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/20">
      <div className="flex h-16 items-center px-6 border-b">
        <Link href="/" className="font-heading font-bold text-xl tracking-tighter flex items-center gap-2 text-primary">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <Camera className="w-5 h-5" />
          </div>
          Canon<span className="text-foreground">Admin</span>
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-6 flex flex-col gap-2 px-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium text-sm ${
              route.active 
                ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <route.icon className="w-5 h-5" />
            {route.label}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 rounded-lg border bg-card p-3 shadow-sm">
          <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold">K</div>
          <div className="flex flex-col">
            <span className="text-sm font-bold">Khan Nguyễn</span>
            <span className="text-xs text-muted-foreground">Administrator</span>
          </div>
        </div>
      </div>
    </div>
  );
}
