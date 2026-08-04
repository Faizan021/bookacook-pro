import { useI18n } from "@/i18n/I18nProvider";
import { Banknote, Trash2, Plus, Minus, ShoppingBag, Check } from "lucide-react";
import type { CartItemEntry } from "@/lib/festival/useFestivalPos";

interface CurrentOrderCartProps {
  cartItems: CartItemEntry[];
  totalCents: number;
  totalQuantity: number;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export function CurrentOrderCart({
  cartItems,
  totalCents,
  totalQuantity,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
}: CurrentOrderCartProps) {
  const { t } = useI18n();

  if (cartItems.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-[#eadfce] text-center shadow-xs">
        <p className="text-xs text-forest/60 font-medium">
          {t(
            "Aktuelle Bestellung ist leer. Tippe oben auf Speisen & Getränke, um eine Bestellung aufzunehmen.",
            "Current order tray is empty. Tap items above to build an order."
          )}
        </p>
      </div>
    );
  }

  const formattedTotal = (totalCents / 100).toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });

  return (
    <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-emerald-600 shadow-xl space-y-4 animate-in slide-in-from-bottom-3 duration-200">
      {/* Header & Clear Tray Action */}
      <div className="flex items-center justify-between border-b border-[#eadfce] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 grid place-items-center font-bold text-sm">
            {totalQuantity}
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-forest">
              {t("Aktuelle Kunde-Bestellung", "Current Customer Order")}
            </h3>
            <p className="text-[11px] text-forest/60 font-medium">
              {cartItems.length} {cartItems.length === 1 ? t("Position", "item") : t("Positionen", "items")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClearCart}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 hover:bg-rose-100 font-bold text-xs border border-rose-200 transition cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t("Leeren", "Clear")}</span>
        </button>
      </div>

      {/* Cart Item Chips */}
      <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
        {cartItems.map((entry) => {
          const itemTotal = (entry.item.priceCents * entry.quantity) / 100;

          return (
            <div
              key={entry.item.id + (entry.notes || "")}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#fdfaf5] border border-[#eadfce]"
            >
              <div className="space-y-0.5 max-w-[50%]">
                <h4 className="font-bold text-xs sm:text-sm text-forest truncate">{entry.item.name}</h4>
                {entry.notes && (
                  <span className="inline-block text-[10px] italic text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    "{entry.notes}"
                  </span>
                )}
                <div className="text-xs font-semibold text-forest/70">
                  {itemTotal.toFixed(2)} €
                </div>
              </div>

              {/* Item Stepper (+ / -) */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(entry.item.id, -1)}
                  className="w-8 h-8 rounded-xl bg-white border border-[#eadfce] text-forest font-bold text-sm grid place-items-center hover:bg-cream active:scale-95 transition cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-extrabold text-sm text-forest min-w-[20px] text-center font-display">
                  {entry.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(entry.item.id, 1)}
                  className="w-8 h-8 rounded-xl bg-white border border-[#eadfce] text-forest font-bold text-sm grid place-items-center hover:bg-cream active:scale-95 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveItem(entry.item.id)}
                  className="p-1.5 text-forest/40 hover:text-rose-600 transition ml-1 cursor-pointer"
                  title="Entfernen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Large Checkout Button (BAR KASSIEREN) */}
      <button
        type="button"
        onClick={onCheckout}
        className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-lg sm:text-xl shadow-lg active:scale-[0.98] transition flex items-center justify-between cursor-pointer border border-emerald-500"
      >
        <div className="flex items-center gap-2">
          <Banknote className="w-6 h-6 text-emerald-200" />
          <span>{t("BAR KASSIEREN", "CASH CHECKOUT")}</span>
        </div>
        <div className="font-display font-extrabold text-xl sm:text-2xl text-amber-300">
          {formattedTotal}
        </div>
      </button>
    </div>
  );
}
