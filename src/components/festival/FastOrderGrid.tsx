import { useState, useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { SlidersHorizontal, Plus, ShoppingBag, Flame, Sparkles } from "lucide-react";
import type { FestivalItem } from "@/lib/festival/types";

interface CartItemSummary {
  itemId: string;
  quantity: number;
}

interface FastOrderGridProps {
  items: FestivalItem[];
  cartSummary?: CartItemSummary[];
  onAddToCart: (item: FestivalItem) => void;
  onCustomizeOrder: (item: FestivalItem) => void;
}

export function FastOrderGrid({
  items,
  cartSummary = [],
  onAddToCart,
  onCustomizeOrder,
}: FastOrderGridProps) {
  const { t } = useI18n();

  // Debounce ref to prevent accidental rapid double-tapping
  const lastTapTimeRef = useRef<number>(0);

  const handleTap = (item: FestivalItem) => {
    const now = Date.now();
    if (now - lastTapTimeRef.current < 250) {
      return; // Ignore double-tap within 250ms
    }
    lastTapTimeRef.current = now;
    onAddToCart(item);
  };

  const getCartQuantity = (itemId: string) => {
    const found = cartSummary.find((c) => c.itemId === itemId);
    return found ? found.quantity : 0;
  };

  const getCategoryBorder = (category?: string) => {
    if (category === "drink") return "hover:border-amber-400";
    if (category === "special") return "hover:border-purple-400";
    return "hover:border-emerald-500";
  };

  if (!items || items.length === 0) {
    return (
      <div className="p-8 text-center bg-cream/40 rounded-2xl border border-[#eadfce]">
        <p className="text-forest/70 font-medium">
          {t("Keine Artikel für Festival-Kasse konfiguriert.", "No items configured for festival POS.")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-forest/70 flex items-center gap-1.5">
          <ShoppingBag className="w-4 h-4 text-emerald-600" />
          {t("Speisen & Getränke antippen", "Tap to add items to order")}
        </span>
        <span className="text-[11px] text-forest/60 italic">
          {t("Mehrere Artikel pro Kunde wählbar", "Multiple items per customer")}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {items.slice(0, 6).map((item, idx) => {
          const formattedPrice = (item.priceCents / 100).toLocaleString("de-DE", {
            style: "currency",
            currency: "EUR",
          });
          const cartQty = getCartQuantity(item.id);
          const isInCart = cartQty > 0;
          const categoryClass = getCategoryBorder(item.category);

          return (
            <div
              key={item.id || idx}
              className={`group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl border-2 transition active:scale-[0.98] min-h-[125px] sm:min-h-[145px] cursor-pointer select-none ${categoryClass} ${
                isInCart
                  ? "bg-emerald-50/90 border-emerald-500 shadow-md ring-2 ring-emerald-400/30"
                  : "bg-white border-[#eadfce] shadow-md hover:shadow-lg"
              }`}
              onClick={() => handleTap(item)}
            >
              {/* Active Cart Badge Count */}
              {isInCart && (
                <div className="absolute -top-2.5 -right-2.5 bg-emerald-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-md animate-in zoom-in-50 duration-150 z-10">
                  {cartQty}x
                </div>
              )}

              {/* Item Top Row: Badge & Name */}
              <div className="space-y-1">
                {item.badge && (
                  <div className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full w-fit mb-1">
                    <span>{item.badge}</span>
                  </div>
                )}
                <div className="flex items-start gap-1.5">
                  {item.icon && <span className="text-xl leading-none">{item.icon}</span>}
                  <h4 className="font-display font-bold text-base sm:text-lg text-forest line-clamp-2 leading-tight">
                    {item.name}
                  </h4>
                </div>
                {item.description && (
                  <p className="text-[11px] text-forest/65 line-clamp-1 leading-snug pt-0.5">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Price & Action Row */}
              <div className="flex items-center justify-between pt-2 border-t border-[#eadfce]/60 mt-2">
                <span className="text-lg sm:text-xl font-extrabold text-forest font-display">
                  {formattedPrice}
                </span>

                <div className="flex items-center gap-1">
                  {/* Customize Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCustomizeOrder(item);
                    }}
                    title={t("Menge / Hinweis anpassen", "Customize Quantity / Note")}
                    className="p-2 rounded-xl bg-cream text-forest/70 hover:text-forest hover:bg-forest/10 transition cursor-pointer"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>

                  {/* Plus Icon Button */}
                  <div className="p-2 rounded-xl bg-emerald-700 text-white shadow-xs group-hover:bg-emerald-800 transition">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
