import { useI18n } from "@/i18n/I18nProvider";
import { Plus, Minus, X, Check } from "lucide-react";
import type { FestivalItem } from "@/lib/festival/types";

interface QuantitySelectorProps {
  item: FestivalItem | null;
  quantity: number;
  notes: string;
  onQuantityChange: (qty: number) => void;
  onNotesChange: (notes: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const PRESET_MODIFIERS = ["Ohne Zwiebeln", "Extra Soße", "Mit Pommes", "To Go / Zum Mitnehmen"];

export function QuantitySelector({
  item,
  quantity,
  notes,
  onQuantityChange,
  onNotesChange,
  onConfirm,
  onCancel,
}: QuantitySelectorProps) {
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

        <div className="text-center space-y-1">
          <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-forest/70 bg-cream border border-[#eadfce] px-3 py-1 rounded-full">
            {t("Menge & Wünsche anpassen", "Customize Quantity & Notes")}
          </span>
          <h3 className="text-2xl font-bold font-display text-forest">{item.name}</h3>
        </div>

        {/* Quantity Stepper & Presets */}
        <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#eadfce]">
          <label className="text-xs font-bold uppercase tracking-wider text-forest/70 block text-center">
            {t("Anzahl wählen", "Select Quantity")}
          </label>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="w-12 h-12 rounded-full bg-cream border border-[#eadfce] text-forest font-bold text-xl flex items-center justify-center hover:bg-forest/10 active:scale-95 transition"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-3xl font-extrabold text-forest min-w-[3rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="w-12 h-12 rounded-full bg-forest text-white font-bold text-xl flex items-center justify-center hover:bg-forest/90 active:scale-95 transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-center gap-2 pt-1">
            {[1, 2, 3, 5, 10].map((num) => (
              <button
                key={num}
                onClick={() => onQuantityChange(num)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition border ${
                  quantity === num
                    ? "bg-forest text-white border-forest shadow-sm"
                    : "bg-cream text-forest border-[#eadfce] hover:bg-forest/10"
                }`}
              >
                {num}x
              </button>
            ))}
          </div>
        </div>

        {/* Preset Note Chips */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-forest/70 block">
            {t("Hinweis / Sonderwunsch", "Special Note")}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_MODIFIERS.map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  if (notes === chip) onNotesChange("");
                  else onNotesChange(chip);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                  notes === chip
                    ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                    : "bg-white text-forest/80 border-[#eadfce] hover:bg-cream"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onConfirm}
          className="w-full py-4 rounded-2xl bg-forest text-white font-bold text-base hover:bg-forest/90 transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <Check className="w-5 h-5" />
          <span>
            {t("Weiter zur Zahlungsart", "Continue to Payment")} ({formattedPrice})
          </span>
        </button>
      </div>
    </div>
  );
}
