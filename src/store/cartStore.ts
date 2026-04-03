import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItemType = 'BUY' | 'RENT';

export interface CartItem {
  id: string; // unique item id in cart
  productId: string;
  name: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  type: CartItemType;
  rentDays?: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          // Check if same product & type (and rentDays if rent) exists
          const existingItemIndex = state.items.findIndex(
            (i) => i.productId === item.productId && i.type === item.type && i.rentDays === item.rentDays
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += item.quantity;
            return { items: newItems };
          }
          
          return { items: [...state.items, { ...item, id: Math.random().toString(36).substr(2, 9) }] };
        });
      },
      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
      },
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => {
          const multiplier = item.type === 'RENT' && item.rentDays ? item.rentDays : 1;
          return total + item.price * item.quantity * multiplier;
        }, 0);
      },
    }),
    {
      name: 'canon-cart-storage',
    }
  )
);
