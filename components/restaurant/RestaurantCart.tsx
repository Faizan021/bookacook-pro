"use client";

import { useCartStore } from "@/lib/cart/store";

export function RestaurantCart() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  return (
    <div className="bg-white rounded-2xl border border-[#eadfce] p-6 shadow-sm">
      <h2 className="font-bold text-xl mb-4">Ihre Bestellung</h2>
      {items.length === 0 ? (
        <p className="text-gray-500 text-sm italic">Der Warenkorb ist leer.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <div>
                <p className="font-semibold">{item.name}</p>
                <div className="flex gap-2 items-center mt-1">
                  <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="text-gray-400">-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-400">+</button>
                </div>
              </div>
              <span className="font-bold">€{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-4 font-bold flex justify-between">
            <span>Summe</span>
            <span>€{totalPrice().toFixed(2)}</span>
          </div>
          <button className="w-full bg-[#16372f] text-white py-3 rounded-full font-bold hover:bg-[#0f2f27] transition">
            Jetzt bestellen
          </button>
        </div>
      )}
    </div>
  );
}
