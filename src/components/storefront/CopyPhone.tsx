'use client';

import { toast } from 'sonner';

export default function CopyPhone({ phone, children }: { phone: string, children: React.ReactNode }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(phone);
    toast.success('Đã copy số điện thoại!', {
      description: `Đã sao chép ${phone} vào bộ nhớ tạm.`,
    });
  };

  return (
    <span onClick={handleCopy} className="cursor-pointer hover:text-primary transition-colors">
      {children}
    </span>
  );
}
