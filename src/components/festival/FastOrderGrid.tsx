import { useState, useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { SlidersHorizontal, Zap } from "lucide-react";
import type { FestivalItem } from "@/lib/festival/types";

interface FastOrderGridProps {
  items: FestivalItem[];
  onQuickOrder: (item: FestivalItem) => void;
  onCustomizeOrder: (item: FestivalItem) => void;
}

export function FastOrderGrid({ items, onQuickOrder, onCustomizeOrder }: FastOrderGridProps) {
  const { t } = useI18n();

  // Debounce ref to prevent accidental rapid double-tapping
  const lastTapTimeRef = useRef<number>(0);

  const handleTap = (item: FestivalItem) => {
    const now = Date.now();
    if (now - lastTapTimeRef.current < 300) {
      return; // Ignore double-tap within 300ms
    }
    lastTapTimeRef.current = now;
    onQuickOrder(item);
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
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          {t("Schnellverkauf (2-Taps)", "Fast Counter Sales (2-Taps)")}
        </span>
        <span className="text-[11px] text-forest/60 italic">
          {t("Direkt antippen für Sofort-Bon", "Tap item for quick receipt")}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {items.slice(0, 6).map((item, idx) => {
          const formattedPrice = (item.priceCents / 100).toLocaleString("de-DE", {
            style: "currency",
            currency: "EUR",
          });

          return (
            <div
              key={item.id || idx}
              className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#eadfce] shadow-md hover:border-forest/40 hover:shadow-lg transition active:scale-[0.98] min-h-[110px] sm:min-h-[130px] cursor-pointer"
              onClick={() => handleTap(item)}
            >
              {/* Item Name & Description */}
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-1">
                  <h4 className="font-display font-bold text-base sm:text-lg text-forest line-clamp-2 leading-tight">
                    {item.name}
                  </h4>
                </div>
                {item.description && (
                  <p className="text-[11px] text-forest/65 line-clamp-1 leading-snug">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Price & Customization Action */}
              <div className="flex items-center justify-between pt-2 border-t border-[#eadfce]/60 mt-2">
                <span className="text-lg sm:text-xl font-extrabold text-forest font-display">
                  {formattedPrice}
                </span>

                {/* Optional Customize Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCustomizeOrder(item);
                  }}
                  title={t("Menge / Wunsch anpassen", "Customize Quantity / Note")}
                  className="p-2 rounded-xl bg-cream text-forest/70 hover:text-forest hover:bg-forest/10 transition"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
