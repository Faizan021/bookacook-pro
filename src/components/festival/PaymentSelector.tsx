import { useI18n } from "@/i18n/I18nProvider";
import { Banknote, CreditCard, X } from "lucide-react";
import type { FestivalItem } from "@/lib/festival/types";

interface PaymentSelectorProps {
  item: FestivalItem | null;
  quantity: number;
  notes?: string;
  onSelectPayment: (method: "cash" | "card") => void;
  onCancel: () => void;
}

export function PaymentSelector({
  item,
  quantity,
  notes,
  onSelectPayment,
  onCancel,
}: PaymentSelectorProps) {
  const { t } = useI18n();

  if (!item) return null;

  const totalCents = item.priceCents * quantity;
  const formattedPrice = (totalCents / 100).toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#fdfaf5] text-forest border border-[#eadfce] w-full max-w-md rounded-3xl p-6 shadow-2xl relative space-y-5">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 rounded-full text-forest/60 hover:text-forest hover:bg-forest/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Selected Item Summary */}
        <div className="text-center space-y-1">
          <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full">
            {t("Schnellverkauf", "Quick Sale")}
          </span>
          <h3 className="text-2xl font-bold font-display text-forest">{item.name}</h3>
          {quantity > 1 && (
            <p className="text-sm text-forest/70 font-semibold">
              {quantity}x @ {(item.priceCents / 100).toFixed(2)} €
            </p>
          )}
          {notes && <p className="text-xs italic text-amber-800 bg-amber-50 px-2 py-1 rounded-lg">"{notes}"</p>}
          <div className="text-3xl font-extrabold text-forest pt-1">{formattedPrice}</div>
        </div>

        {/* 2-Tap Big Payment Method Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          {/* Cash Payment */}
          <button
            onClick={() => onSelectPayment("cash")}
            className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-emerald-700 text-white font-bold text-lg shadow-lg hover:bg-emerald-800 active:scale-95 transition cursor-pointer min-h-[100px]"
          >
            <Banknote className="w-8 h-8 text-emerald-200" />
            <span>{t("💵 BAR", "💵 CASH")}</span>
          </button>

          {/* Card Payment */}
          <button
            onClick={() => onSelectPayment("card")}
            className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-sky-700 text-white font-bold text-lg shadow-lg hover:bg-sky-800 active:scale-95 transition cursor-pointer min-h-[100px]"
          >
            <CreditCard className="w-8 h-8 text-sky-200" />
            <span>{t("💳 KARTE", "💳 CARD")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
