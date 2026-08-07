import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { Play, Banknote, Calendar, Store, MapPin } from "lucide-react";
import type { FestivalEventConfig } from "@/lib/festival/types";

interface StartShiftModalProps {
  isOpen: boolean;
  config: FestivalEventConfig;
  operatingDateStr: string;
  onStartShift: (openingCashCents: number) => Promise<void>;
}

export function StartShiftModal({
  isOpen,
  config,
  operatingDateStr,
  onStartShift,
}: StartShiftModalProps) {
  const { t } = useI18n();
  const [openingCashInput, setOpeningCashInput] = useState("0,00");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const cleanVal = openingCashInput.replace(".", "").replace(",", ".");
      const parsedFloat = parseFloat(cleanVal);
      const cents = Math.max(0, Math.round((isNaN(parsedFloat) ? 0 : parsedFloat) * 100));
      await onStartShift(cents);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md grid place-items-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#fdfaf5] text-forest border border-[#eadfce] w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 border-b border-[#eadfce] pb-4">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-forest text-amber-300 grid place-items-center mb-1 shadow-md text-2xl font-bold font-display">
            🎪
          </div>
          <h2 className="text-2xl font-extrabold font-display text-forest">
            {t("Schicht starten", "Start Shift")}
          </h2>

          <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-amber-900 pt-1">
            <Calendar className="w-4 h-4 text-amber-700" />
            <span>{operatingDateStr}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-forest/70 font-semibold pt-1">
            <span className="flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-forest/50" />
              {config.restaurantName}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-forest/50" />
              {config.eventName} {config.eventNameSecondary ? `(${config.eventNameSecondary})` : ""}
            </span>
          </div>
        </div>

        {/* Start Shift Form */}
        <form onSubmit={handleStart} className="space-y-5">
          <div className="bg-white p-4 rounded-2xl border border-[#eadfce] space-y-3">
            <label htmlFor="opening-cash-input" className="block text-xs font-bold uppercase tracking-wider text-forest/70">
              {t("Anfangskassenbestand (Wechselgeld)", "Opening Cash Float")}
            </label>

            <div className="relative flex items-center">
              <span className="absolute left-4 font-display font-extrabold text-xl text-forest/60">
                €
              </span>
              <input
                id="opening-cash-input"
                type="text"
                value={openingCashInput}
                onChange={(e) => setOpeningCashInput(e.target.value)}
                placeholder="0,00"
                className="w-full pl-10 pr-4 py-3.5 rounded-xl border-2 border-emerald-600 bg-[#fdfaf5] font-display font-extrabold text-2xl text-forest outline-none focus:ring-2 focus:ring-emerald-500 transition text-right"
              />
            </div>

            <p className="text-[11px] text-forest/60 italic leading-snug">
              {t(
                "Bargeld, das sich zu Beginn bereits in der Kasse befindet.",
                "Cash already present in the drawer float at shift start."
              )}
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-forest hover:bg-forest/90 disabled:opacity-50 text-white font-extrabold text-base shadow-lg transition flex items-center justify-center gap-2 cursor-pointer border border-emerald-800"
          >
            <Play className="w-5 h-5 text-amber-300" />
            <span>{isSubmitting ? t("Schicht wird gestartet...", "Starting Shift...") : t("Schicht starten", "Start Shift")}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
