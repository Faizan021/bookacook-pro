import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartState, CartItem } from "./types";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item: CartItem) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (id: string) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQuantity: (id: string, quantity: number) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),
      clearCart: () => set({ items: [] }),
      totalPrice: () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
    }),
    { name: "speisely-cart" }
  )
);
