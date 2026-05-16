"use client";

import { useState } from "react";
import { useHydratedCart } from "@/lib/cart/hooks";
import { ShoppingCart, X, Trash2, Plus, Minus, CreditCard, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, updateQuantity, totalPrice, totalItems, isHydrated } = useHydratedCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const { url, error } = await response.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (err) {
      toast.error("Checkout konnte nicht gestartet werden. Bitte versuchen Sie es später erneut.");
    } finally {
      setLoading(false);
    }
  };

  if (!isHydrated) return null;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#16372f] text-white shadow-2xl hover:scale-105 transition-all duration-300"
      >
        <ShoppingCart size={24} />
        {totalItems() > 0 && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#d35f48] text-[10px] font-bold text-white shadow-sm animate-in zoom-in">
            {totalItems()}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end bg-black/40 backdrop-blur-sm transition-all" onClick={() => setIsOpen(false)}>
          <div className="w-full max-w-sm bg-[#faf6ee] p-6 shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#16372f]">Warenkorb</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-black/5 transition"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-[#5c6f68]">
                  <ShoppingBag size={48} className="mb-4 opacity-20" />
                  <p>Dein Warenkorb ist noch leer.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-[#eadfce]">
                    <div className="flex-1">
                      <p className="font-semibold text-[#16372f]">{item.name}</p>
                      <p className="text-sm font-medium text-[#b28a3c]">€{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-[#fbf7ef] rounded-full px-2 py-1">
                      <button onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))} className="p-1 hover:text-[#b28a3c] transition"><Minus size={14} /></button>
                      <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-[#b28a3c] transition"><Plus size={14} /></button>
                      <button onClick={() => removeItem(item.id)} className="ml-2 text-gray-400 hover:text-red-500 transition"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-[#eadfce] pt-6 mt-4">
                <div className="flex justify-between mb-6 text-xl font-bold text-[#16372f]">
                  <span>Gesamt</span>
                  <span>€{totalPrice().toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#16372f] text-white rounded-2xl font-bold hover:bg-[#1a443a] transition-all disabled:opacity-50"
                >
                  {loading ? "Checkout läuft..." : <><CreditCard size={20} /> Jetzt sicher bezahlen</>}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
