import { useState, useMemo } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { Play, Calendar, Store, MapPin, CheckCircle2, ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";
import type { FestivalEventConfig } from "@/lib/festival/types";
import { numberToGermanWords, numberToEnglishWords } from "@/lib/festival/numberToWords";

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
  const { t, lang } = useI18n();

  // START WITH AN EMPTY INPUT (DO NOT PREFILL PREVIOUS AMOUNT)
  const [openingCashInput, setOpeningCashInput] = useState("");
  const [showConfirmStep, setShowConfirmStep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute exact cents and formatted previews
  const { parsedCents, formattedEuroStr, wordsStr, isValid } = useMemo(() => {
    if (!openingCashInput.trim()) {
      return { parsedCents: 0, formattedEuroStr: "0,00 €", wordsStr: "", isValid: false };
    }

    const cleanVal = openingCashInput.replace(".", "").replace(",", ".");
    const parsedFloat = parseFloat(cleanVal);

    if (isNaN(parsedFloat) || parsedFloat < 0) {
      return { parsedCents: 0, formattedEuroStr: "0,00 €", wordsStr: "", isValid: false };
    }

    const cents = Math.round(parsedFloat * 100);
    const euroStr = (cents / 100).toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    });

    const words = lang === "de" ? numberToGermanWords(cents) : numberToEnglishWords(cents);

    return {
      parsedCents: cents,
      formattedEuroStr: euroStr,
      wordsStr: words,
      isValid: cents >= 0,
    };
  }, [openingCashInput, lang]);

  if (!isOpen) return null;

  const handleSelectPreset = (euroAmount: number) => {
    setOpeningCashInput(euroAmount.toString());
  };

  const handleOpenConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!openingCashInput.trim()) return;
    setShowConfirmStep(true);
  };

  const handleFinalizeStartShift = async () => {
    setIsSubmitting(true);
    try {
      await onStartShift(parsedCents);
      setShowConfirmStep(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md grid place-items-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#fdfaf5] text-forest border border-[#eadfce] w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[95vh] overflow-y-auto">
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

        {/* STEP 2: CONFIRMATION MODAL STATE */}
        {showConfirmStep ? (
          <div className="space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-400 space-y-4 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-900 mb-1">
                <AlertCircle className="w-7 h-7 text-amber-800" />
              </div>
              <h3 className="text-lg font-extrabold font-display text-amber-950">
                {t("Anfangskassenbestand bestätigen", "Confirm Opening Cash Float")}
              </h3>

              {/* Large Formatted Amount & Words */}
              <div className="p-4 rounded-xl bg-white border border-amber-300 space-y-1 shadow-xs">
                <span className="text-xs font-bold text-forest/60 uppercase tracking-wider block">
                  {t("Eingegebener Betrag", "Entered Amount")}
                </span>
                <div className="text-3xl font-extrabold text-emerald-900 font-display">
                  {formattedEuroStr}
                </div>
                {wordsStr && (
                  <div className="text-xs font-bold text-amber-900 italic font-mono pt-1">
                    "{wordsStr}"
                  </div>
                )}
              </div>

              <p className="text-xs text-amber-950 leading-relaxed font-medium">
                {t(
                  "Dieser Betrag wird unveränderlich als Wechselgeld-Startguthaben gespeichert.",
                  "This amount will be saved as the immutable cash float for this shift."
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmStep(false)}
                className="py-3.5 rounded-2xl bg-white border border-[#eadfce] text-forest font-bold text-xs hover:bg-cream transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-4 h-4 text-forest/60" />
                <span>{t("Korrigieren", "Edit Amount")}</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalizeStartShift}
                className="py-3.5 rounded-2xl bg-forest hover:bg-forest/90 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-800"
              >
                <Play className="w-4 h-4 text-amber-300" />
                <span>
                  {isSubmitting
                    ? t("Wird gestartet...", "Starting...")
                    : t("Ja, Schicht jetzt starten", "Yes, Start Shift Now")}
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* STEP 1: INITIAL ENTRY FORM */
          <form onSubmit={handleOpenConfirmation} className="space-y-5">
            <div className="bg-white p-5 rounded-2xl border-2 border-[#eadfce] space-y-4">
              <div className="flex items-center justify-between border-b border-[#eadfce] pb-2.5">
                <label
                  htmlFor="opening-cash-input"
                  className="block text-xs font-extrabold uppercase tracking-wider text-forest"
                >
                  {t("Anfangskassenbestand (Wechselgeld)", "Opening Cash Float")} <span className="text-rose-600 font-bold">*</span>
                </label>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  {t("Pflichtfeld", "Required")}
                </span>
              </div>

              {/* Input field with clear placeholder */}
              <div className="relative flex items-center">
                <span className="absolute left-4 font-display font-extrabold text-2xl text-forest/60">
                  €
                </span>
                <input
                  id="opening-cash-input"
                  type="text"
                  value={openingCashInput}
                  onChange={(e) => setOpeningCashInput(e.target.value)}
                  placeholder={t("z.B. 250,00", "e.g. 250.00")}
                  autoFocus
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-emerald-600 bg-[#fdfaf5] font-display font-extrabold text-2xl text-forest outline-none focus:ring-2 focus:ring-emerald-500 transition text-right shadow-xs placeholder:text-forest/30"
                />
              </div>

              {/* Quick Tap Presets */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-extrabold text-forest/60 uppercase tracking-wider block text-center">
                  {t("Schnellauswahl Betrag:", "Quick Select Amount:")}
                </span>
                <div className="flex justify-center gap-2 flex-wrap">
                  {[100, 200, 300, 500].map((amount) => (
                    <button
                      type="button"
                      key={amount}
                      onClick={() => handleSelectPreset(amount)}
                      className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs transition border cursor-pointer ${
                        openingCashInput === amount.toString()
                          ? "bg-emerald-800 text-amber-300 border-emerald-900 shadow-sm"
                          : "bg-cream text-forest border-[#eadfce] hover:bg-forest/10"
                      }`}
                    >
                      {amount} €
                    </button>
                  ))}
                </div>
              </div>

              {/* STEP 1: LARGE FORMATTED AMOUNT & WORDS PREVIEW */}
              {openingCashInput.trim() && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border-2 border-emerald-300 space-y-1 text-center animate-in fade-in duration-150">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900 block">
                    {t("Formatiertes Startguthaben", "Formatted Opening Cash")}
                  </span>
                  <div className="text-3xl font-extrabold text-emerald-950 font-display">
                    {formattedEuroStr}
                  </div>
                  {wordsStr && (
                    <div className="text-xs font-bold text-emerald-900 font-mono italic pt-0.5">
                      "{wordsStr}"
                    </div>
                  )}
                </div>
              )}

              {/* Clear Explanation */}
              <p className="text-xs text-forest/70 font-medium leading-relaxed bg-[#fdfaf5] p-3 rounded-xl border border-[#eadfce]">
                {t(
                  "Dies ist das Bargeld, das sich vor Beginn der heutigen Verkäufe in der Kassenlade befindet.",
                  "This is the cash currently inside the cash drawer before you start today's sales."
                )}
              </p>

              {/* Live Checklist Summary Card */}
              <div className="space-y-1.5 pt-1 text-[11px] font-semibold text-forest/80">
                <div className="flex items-center gap-1.5 text-emerald-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{t("Erfasst als Wechselgeld-Startguthaben", "Recorded as cash drawer float")}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{t("Dient zur Berechnung des Soll-Kassenbestands", "Used to calculate expected cash drawer")}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{t("Nach Schichtstart schreibgeschützt", "Read-only after shift starts")}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isValid}
              className="w-full py-4 rounded-2xl bg-forest hover:bg-forest/90 disabled:opacity-40 text-white font-extrabold text-base shadow-lg transition flex items-center justify-center gap-2 cursor-pointer border border-emerald-800"
            >
              <Play className="w-5 h-5 text-amber-300" />
              <span>{t("Schichtüberprüfung fortfahren", "Continue to Shift Start")}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
