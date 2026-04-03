'use client';

import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';
import { ShoppingCart, Calendar } from 'lucide-react';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    imageUrl?: string;
    priceBuy?: number | null;
    priceRentPerDay?: number | null;
  };
  type: 'BUY' | 'RENT';
  disabled?: boolean;
}

export default function AddToCartButton({ product, type, disabled }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    if (type === 'BUY' && product.priceBuy) {
      addItem({
        productId: product.id,
        name: product.name,
        imageUrl: product.imageUrl || undefined,
        price: product.priceBuy,
        quantity: 1,
        type: 'BUY'
      });
    } else if (type === 'RENT' && product.priceRentPerDay) {
      addItem({
        productId: product.id,
        name: product.name,
        imageUrl: product.imageUrl || undefined,
        price: product.priceRentPerDay,
        quantity: 1,
        type: 'RENT',
        rentDays: 3 // Default 3 days for initial add
      });
    }

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const isBuy = type === 'BUY';

  return (
    <Button 
      className="w-full" 
      variant={isBuy ? "default" : "secondary"} 
      disabled={disabled}
      onClick={handleAdd}
    >
      {isAdded ? (
        <span>Đã thêm ✓</span>
      ) : (
        <span className="flex items-center gap-2">
          {isBuy ? <ShoppingCart className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
          {isBuy ? 'Thêm vào giỏ' : 'Đặt lịch thuê'}
        </span>
      )}
    </Button>
  );
}
