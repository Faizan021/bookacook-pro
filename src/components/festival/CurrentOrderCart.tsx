import { useI18n } from "@/i18n/I18nProvider";
import { Banknote, Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
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
        <p className="text-xs text-forest/60 font-medium flex items-center justify-center gap-1.5">
          <ShoppingCart className="w-4 h-4 text-forest/40" />
          <span>
            {t(
              "Aktuelle Bestellung ist leer. Tippe oben auf Speisen & Getränke.",
              "Current order tray is empty. Tap items above to build an order."
            )}
          </span>
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
      {/* Header & Clear Action */}
      <div className="flex items-center justify-between border-b border-[#eadfce] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-900 grid place-items-center font-bold text-base font-display">
            🛒
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-forest flex items-center gap-2">
              <span>{t("Aktuelle Bestellung", "Current Order")}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-sans">
                {totalQuantity} {totalQuantity === 1 ? t("Artikel", "Item") : t("Artikel", "Items")}
              </span>
            </h3>
            <p className="text-[11px] text-forest/60 font-medium">
              {cartItems.length} {cartItems.length === 1 ? t("Position", "position") : t("Positionen", "positions")}
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

      {/* Cart Item Detail Rows (Shows 4 × Item @ Price = Total) */}
      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
        {cartItems.map((entry) => {
          const unitPrice = (entry.item.priceCents / 100).toFixed(2);
          const itemTotal = ((entry.item.priceCents * entry.quantity) / 100).toFixed(2);

          return (
            <div
              key={entry.item.id + (entry.notes || "")}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-[#fdfaf5] border border-[#eadfce]"
            >
              <div className="space-y-1 max-w-[55%]">
                <div className="flex items-center gap-1.5">
                  {entry.item.icon && <span className="text-base">{entry.item.icon}</span>}
                  <h4 className="font-bold text-xs sm:text-sm text-forest truncate">
                    {entry.item.name}
                  </h4>
                </div>
                {/* Clear Math Formula Breakdown (e.g. 4 × 8,50 € = 34,00 €) */}
                <div className="text-xs font-bold text-forest/80">
                  <span className="text-emerald-800 font-extrabold">{entry.quantity} ×</span> {unitPrice} €{" "}
                  <span className="text-forest/40 font-normal">=</span>{" "}
                  <span className="font-extrabold text-forest font-display">{itemTotal} €</span>
                </div>
                {entry.notes && (
                  <span className="inline-block text-[10px] italic text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    "{entry.notes}"
                  </span>
                )}
              </div>

              {/* Large Touch Quantity Steppers [-] 4 [+] */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(entry.item.id, -1)}
                  className="w-10 h-10 rounded-2xl bg-white border border-[#eadfce] text-forest font-bold text-lg grid place-items-center hover:bg-cream active:scale-95 transition shadow-xs cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-extrabold text-base text-forest min-w-[24px] text-center font-display">
                  {entry.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(entry.item.id, 1)}
                  className="w-10 h-10 rounded-2xl bg-white border border-[#eadfce] text-forest font-bold text-lg grid place-items-center hover:bg-cream active:scale-95 transition shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveItem(entry.item.id)}
                  className="p-2 text-forest/40 hover:text-rose-600 transition ml-1 cursor-pointer"
                  title="Entfernen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Unmistakable Big Cash Payment Button: 💵 Pay Cash • 34,00 € */}
      <button
        type="button"
        onClick={onCheckout}
        className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-lg sm:text-xl shadow-lg active:scale-[0.98] transition flex items-center justify-between cursor-pointer border border-emerald-500"
      >
        <div className="flex items-center gap-2.5">
          <Banknote className="w-7 h-7 text-emerald-200" />
          <span className="tracking-tight">{t("💵 Pay Cash", "💵 Pay Cash")}</span>
        </div>
        <div className="font-display font-extrabold text-2xl sm:text-3xl text-amber-300">
          {formattedTotal}
        </div>
      </button>
    </div>
  );
}
