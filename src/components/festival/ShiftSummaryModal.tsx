import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { X, FileText, AlertTriangle, RotateCcw, Banknote, ShoppingBag } from "lucide-react";
import type { FestivalEventConfig } from "@/lib/festival/types";

interface ShiftSummaryModalProps {
  isOpen: boolean;
  config: FestivalEventConfig;
  shiftStartedAt: string;
  metrics: {
    totalCents: number;
    cashCents: number;
    cardCents: number;
    orderCount: number;
    avgOrderCents: number;
  };
  itemizedSales: Array<{ name: string; quantity: number; totalCents: number }>;
  onClose: () => void;
  onResetShift: () => Promise<void>;
}

export function ShiftSummaryModal({
  isOpen,
  config,
  shiftStartedAt,
  metrics,
  itemizedSales,
  onClose,
  onResetShift,
}: ShiftSummaryModalProps) {
  const { t } = useI18n();
  const [confirmReset, setConfirmReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  if (!isOpen) return null;

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    });
  };

  const formatShiftStart = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  const handleExecuteReset = async () => {
    setIsResetting(true);
    try {
      await onResetShift();
      setConfirmReset(false);
      onClose();
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#fdfaf5] text-forest border border-[#eadfce] w-full max-w-lg rounded-3xl p-6 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-forest/60 hover:text-forest hover:bg-forest/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="mx-auto w-12 h-12 rounded-full bg-forest/10 grid place-items-center mb-2 text-forest">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold font-display text-forest">
            {t("Schichtabschluss", "Shift Summary")}
          </h3>
          <p className="text-xs text-forest/70 font-medium">
            {config.restaurantName} • {config.eventName}
          </p>
          <p className="text-[11px] text-forest/50">
            {t("Schichtbeginn:", "Shift Started:")} {formatShiftStart(shiftStartedAt)}
          </p>
        </div>

        {/* Cash Reconciliation Summary */}
        <div className="bg-white p-4 rounded-2xl border border-[#eadfce] space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-forest/70 border-b border-[#eadfce] pb-2">
            {t("Kassensturz & Soll-Bestand", "Cash Reconciliation")}
          </h4>
          
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex justify-between items-center">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold uppercase tracking-wider">
                <Banknote className="w-4 h-4" />
                <span>{t("Soll-Kassenbestand (Bar)", "Expected Cash Total")}</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                {t("Berechneter Kasseninhalt für diese Schicht", "Calculated drawer content for this shift")}
              </p>
            </div>
            <div className="text-2xl font-extrabold text-emerald-900 font-display">
              {formatPrice(metrics.totalCents)}
            </div>
          </div>
        </div>

        {/* Itemized Sales Breakdown Table */}
        <div className="bg-white p-4 rounded-2xl border border-[#eadfce] space-y-3">
          <div className="flex items-center justify-between border-b border-[#eadfce] pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest/70">
              {t("Verkaufte Artikel", "Items Sold Breakdown")}
            </h4>
            <span className="text-xs font-bold text-forest/60">
              {metrics.orderCount} {t("Portionen", "Items")}
            </span>
          </div>

          {itemizedSales.length === 0 ? (
            <p className="text-xs text-forest/50 italic text-center py-2">
              {t("Keine Artikel verkauft.", "No items sold yet.")}
            </p>
          ) : (
            <div className="space-y-1.5 text-xs max-h-[160px] overflow-y-auto pr-1">
              {itemizedSales.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-1 border-b border-cream">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-forest">{item.quantity}x</span>
                    <span className="text-forest/80 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold font-display">{formatPrice(item.totalCents)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shift Reset Section with 2-Step Confirmation */}
        <div className="pt-2">
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="w-full py-3 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs hover:bg-amber-200 transition border border-amber-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t("Schicht zurücksetzen", "Reset Shift")}</span>
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-3 text-center">
              <div className="flex items-center justify-center gap-2 text-amber-900 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>
                  {t("Schicht wirklich zurücksetzen?", "Are you sure you want to reset the shift?")}
                </span>
              </div>
              <p className="text-[11px] text-amber-800">
                {t(
                  "Alle bisherigen Bestellungen und Kassenstände dieser Schicht werden gelöscht.",
                  "All orders and financial totals for this shift will be cleared."
                )}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setConfirmReset(false)}
                  className="py-2.5 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold text-xs hover:bg-amber-100 transition cursor-pointer"
                >
                  {t("Abbrechen", "Cancel")}
                </button>
                <button
                  disabled={isResetting}
                  onClick={handleExecuteReset}
                  className="py-2.5 rounded-xl bg-amber-800 text-white font-bold text-xs hover:bg-amber-900 transition shadow-sm cursor-pointer"
                >
                  {t("Ja, Zurücksetzen", "Yes, Reset Shift")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
