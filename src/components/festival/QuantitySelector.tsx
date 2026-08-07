import { useState, useEffect } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { Plus, Minus, X, Check, ArrowLeft, MessageSquare } from "lucide-react";
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

const PRESET_MODIFIERS = [
  "Ohne Zwiebeln",
  "Extra Soße",
  "Mit Pommes",
  "Ohne Senf",
  "To Go / Zum Mitnehmen",
];

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

  // Local state for multi-select chips and custom free-text note
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [customNoteText, setCustomNoteText] = useState<string>("");

  // Sync internal chip & custom text states whenever active item or initial notes prop changes
  useEffect(() => {
    if (!notes) {
      setSelectedChips([]);
      setCustomNoteText("");
      return;
    }

    const parts = notes.split(",").map((s) => s.trim()).filter(Boolean);
    const chips: string[] = [];
    const custom: string[] = [];

    parts.forEach((part) => {
      if (PRESET_MODIFIERS.includes(part)) {
        chips.push(part);
      } else {
        custom.push(part);
      }
    });

    setSelectedChips(chips);
    setCustomNoteText(custom.join(", "));
  }, [item, notes]);

  // Combine selected chips and custom text into single comma-separated string for parent hook
  const updateCombinedNotes = (chips: string[], customText: string) => {
    const combined: string[] = [...chips];
    if (customText.trim()) {
      combined.push(customText.trim());
    }
    onNotesChange(combined.join(", "));
  };

  const handleToggleChip = (chip: string) => {
    const isSelected = selectedChips.includes(chip);
    const nextChips = isSelected
      ? selectedChips.filter((c) => c !== chip)
      : [...selectedChips, chip];

    setSelectedChips(nextChips);
    updateCombinedNotes(nextChips, customNoteText);
  };

  const handleCustomTextChange = (text: string) => {
    setCustomNoteText(text);
    updateCombinedNotes(selectedChips, text);
  };

  if (!item) return null;

  const totalCents = item.priceCents * quantity;
  const formattedPrice = (totalCents / 100).toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#fdfaf5] text-forest border border-[#eadfce] w-[calc(100vw-24px)] max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 rounded-full text-forest/60 hover:text-forest hover:bg-forest/10 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1 pr-6">
          <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-forest/70 bg-cream border border-[#eadfce] px-3 py-1 rounded-full">
            {t("Menge & Wünsche anpassen", "Customize Quantity & Notes")}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-forest">{item.name}</h3>
        </div>

        {/* Quantity Stepper & Presets */}
        <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#eadfce]">
          <label className="text-xs font-bold uppercase tracking-wider text-forest/70 block text-center">
            {t("Anzahl wählen", "Select Quantity")}
          </label>
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="w-12 h-12 rounded-full bg-cream border border-[#eadfce] text-forest font-bold text-xl flex items-center justify-center hover:bg-forest/10 active:scale-95 transition cursor-pointer"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-3xl font-extrabold text-forest min-w-[3rem] text-center font-display">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(quantity + 1)}
              className="w-12 h-12 rounded-full bg-forest text-white font-bold text-xl flex items-center justify-center hover:bg-forest/90 active:scale-95 transition cursor-pointer"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-center gap-2 pt-1">
            {[1, 2, 3, 5, 10].map((num) => (
              <button
                type="button"
                key={num}
                onClick={() => onQuantityChange(num)}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition border cursor-pointer min-h-[44px] ${
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

        {/* Multi-Select Preset Note Chips */}
        <div className="space-y-2.5 bg-white p-4 rounded-2xl border border-[#eadfce]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-forest/70 block">
              {t("Mehrfachauswahl Sonderwünsche", "Special Notes (Multi-Select)")}
            </label>
            <span className="text-[10px] text-forest/50 italic">
              {t("Beliebig viele tippen", "Tap to select multiple")}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {PRESET_MODIFIERS.map((chip) => {
              const isSelected = selectedChips.includes(chip);
              return (
                <button
                  type="button"
                  key={chip}
                  onClick={() => handleToggleChip(chip)}
                  className={`px-3 py-2 rounded-full text-xs font-extrabold border transition cursor-pointer flex items-center gap-1 min-h-[44px] ${
                    isSelected
                      ? "bg-amber-600 text-white border-amber-700 shadow-sm"
                      : "bg-[#fdfaf5] text-forest/80 border-[#eadfce] hover:bg-cream"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                  <span>{chip}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Free-Text Special Note Input */}
          <div className="pt-2">
            <div className="relative flex items-center">
              <MessageSquare className="w-4 h-4 text-forest/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customNoteText}
                onChange={(e) => handleCustomTextChange(e.target.value)}
                placeholder={t(
                  "Eigenen Wunsch eintragen (z.B. Extra scharf, Glutenfrei)...",
                  "Type custom note (e.g. Extra spicy, Gluten-free)..."
                )}
                className="w-full bg-[#fdfaf5] pl-9 pr-3 py-2.5 rounded-xl border border-[#eadfce] text-xs font-bold text-forest placeholder:text-forest/40 outline-none focus:ring-1 focus:ring-emerald-600 min-h-[44px]"
              />
            </div>
          </div>
        </div>

        {/* Primary Action & Back to Order Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3.5 rounded-2xl bg-forest text-white font-extrabold text-sm sm:text-base hover:bg-forest/90 transition shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-emerald-800 min-h-[48px]"
          >
            <Plus className="w-5 h-5 text-amber-300" />
            <span>
              {t("Artikel zur Bestellung hinzufügen", "Add Item to Order")} ({formattedPrice})
            </span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 rounded-xl bg-cream border border-[#eadfce] text-forest/80 font-bold text-xs hover:bg-forest/10 transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t("Zurück zur Speisekarte", "Back to Menu")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
