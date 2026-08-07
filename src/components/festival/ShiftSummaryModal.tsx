import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { X, FileText, AlertTriangle, Calendar, Store, MapPin, Download, Play, StopCircle, Printer, CheckCircle2 } from "lucide-react";
import type { FestivalEventConfig, FestivalOrder, FestivalShiftData } from "@/lib/festival/types";
import { exportShiftToCSV } from "@/lib/festival/exportUtils";
import { toast } from "sonner";

interface ShiftSummaryModalProps {
  isOpen: boolean;
  config: FestivalEventConfig;
  shiftData: FestivalShiftData | null;
  orders: FestivalOrder[];
  metrics: {
    openingCashCents: number;
    barUmsatzCents: number;
    stornierungenCents: number;
    sollKassenbestandCents: number;
    countedCashCents?: number;
    differenceCents?: number;
    orderCount: number;
    avgOrderCents: number;
  };
  shiftDurationText: string;
  itemizedSales: Array<{ name: string; quantity: number; totalCents: number }>;
  onClose: () => void;
  onStartShift: (openingCashCents: number) => Promise<void>;
  onCloseShift: (countedCashCents?: number) => Promise<void>;
}

export function ShiftSummaryModal({
  isOpen,
  config,
  shiftData,
  orders,
  metrics,
  shiftDurationText,
  itemizedSales,
  onClose,
  onStartShift,
  onCloseShift,
}: ShiftSummaryModalProps) {
  const { t } = useI18n();
  const [confirmClose, setConfirmClose] = useState(false);
  const [openingCashInput, setOpeningCashInput] = useState("0,00");
  const [countedCashInput, setCountedCashInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !shiftData) return null;

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    });
  };

  const formatProminentDate = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleDateString("de-DE", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  const formatTimeOnly = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) + " Uhr";
    } catch {
      return "--:--";
    }
  };

  const handleExportCSV = () => {
    try {
      exportShiftToCSV(shiftData, orders);
      toast.success("Schichtbericht (CSV) erfolgreich heruntergeladen!");
    } catch (err) {
      console.error("CSV Export error:", err);
      toast.error("Export konnte nicht erstellt werden.");
    }
  };

  const handlePrintShiftReport = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleExecuteStartShift = async () => {
    setIsProcessing(true);
    try {
      const cleanVal = openingCashInput.replace(".", "").replace(",", ".");
      const parsedFloat = parseFloat(cleanVal);
      const cents = Math.max(0, Math.round((isNaN(parsedFloat) ? 0 : parsedFloat) * 100));
      await onStartShift(cents);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteCloseShift = async () => {
    setIsProcessing(true);
    try {
      let countedCents: number | undefined = undefined;
      if (countedCashInput.trim()) {
        const cleanVal = countedCashInput.replace(".", "").replace(",", ".");
        const parsed = parseFloat(cleanVal);
        if (!isNaN(parsed)) {
          countedCents = Math.round(parsed * 100);
        }
      }
      await onCloseShift(countedCents);
      setConfirmClose(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const isShiftClosed = shiftData.status === "closed";

  // Calculate live cash count difference preview
  let liveDiffCents: number | undefined = metrics.differenceCents;
  if (!isShiftClosed && countedCashInput.trim()) {
    const cleanVal = countedCashInput.replace(".", "").replace(",", ".");
    const parsed = parseFloat(cleanVal);
    if (!isNaN(parsed)) {
      liveDiffCents = Math.round(parsed * 100) - metrics.sollKassenbestandCents;
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#fdfaf5] text-forest border border-[#eadfce] w-full max-w-lg rounded-3xl p-6 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:p-0">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-forest/60 hover:text-forest hover:bg-forest/10 transition cursor-pointer print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Schichtbericht Header */}
        <div className="text-center space-y-2 border-b border-[#eadfce] pb-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-forest text-cream grid place-items-center mb-1 shadow-md print:hidden">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold font-display text-forest">
            {t("Schichtbericht", "Shift Report")}
          </h2>

          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            {shiftData.shiftNumber || "Schicht #01"}
          </div>

          {/* Business Date */}
          <div className="pt-1">
            <div className="text-sm font-bold text-amber-900 flex items-center justify-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-700" />
              <span>{formatProminentDate(shiftData.shiftStartedAt)}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-forest/80 font-semibold pt-1">
            <span className="flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-forest/60" />
              {config.restaurantName}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-forest/60" />
              {config.eventName} {config.eventNameSecondary ? `(${config.eventNameSecondary})` : ""}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-emerald-800 bg-emerald-50 py-1 px-3 rounded-xl border border-emerald-200 inline-block">
            <span>
              {t("Zeitraum:", "Period:")} {formatTimeOnly(shiftData.shiftStartedAt)} –{" "}
              {isShiftClosed ? formatTimeOnly(shiftData.shiftEndedAt || "") : t("Aktiv", "Active")}
            </span>
            {shiftDurationText && (
              <>
                <span>•</span>
                <span className="font-bold text-forest">{t("Dauer:", "Duration:")} {shiftDurationText}</span>
              </>
            )}
          </div>
        </div>

        {/* German Gastronomy Accounting Breakdown */}
        <div className="bg-white p-4 rounded-2xl border border-[#eadfce] space-y-3">
          <div className="flex items-center justify-between border-b border-[#eadfce] pb-2 print:hidden">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest/70">
              {t("Kassensturz & Zähldifferenz", "Cash Reconciliation")}
            </h4>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrintShiftReport}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-forest bg-cream hover:bg-forest/10 px-2.5 py-1 rounded-xl border border-[#eadfce] transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t("🖨 Drucken", "🖨 Print")}</span>
              </button>
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-xl border border-emerald-300 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t("CSV", "CSV")}</span>
              </button>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-cream/50">
              <span className="text-forest/70 font-semibold">{t("Anfangskassenbestand (Wechselgeld):", "Opening Cash Float:")}</span>
              <span className="font-bold font-display text-sm">{formatPrice(metrics.openingCashCents)}</span>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-xl bg-emerald-50 text-emerald-950">
              <span className="font-bold">{t("Bar-Umsatz (Abkassiert):", "Cash Sales (Completed):")}</span>
              <span className="font-extrabold font-display text-sm text-emerald-900">
                + {formatPrice(metrics.barUmsatzCents)}
              </span>
            </div>

            {metrics.stornierungenCents > 0 && (
              <div className="flex justify-between items-center p-2 rounded-xl bg-rose-50 text-rose-800 text-[11px]">
                <span className="font-semibold">{t("Stornierungen (Zur Information):", "Voided Amount (Audit Display):")}</span>
                <span className="font-bold font-mono text-rose-700">{formatPrice(metrics.stornierungenCents)}</span>
              </div>
            )}

            <div className="flex justify-between items-center p-3 rounded-2xl bg-emerald-900 text-white font-extrabold">
              <span>{t("Soll-Kassenbestand (Bar):", "Expected Cash Drawer:")}</span>
              <span className="text-xl font-display text-amber-300">
                {formatPrice(metrics.sollKassenbestandCents)}
              </span>
            </div>

            {/* Cash Counted Input & Cash Difference Calculation */}
            {!isShiftClosed ? (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 space-y-2 print:hidden">
                <div className="flex items-center justify-between">
                  <label htmlFor="counted-cash-input" className="font-extrabold text-amber-950 text-xs">
                    {t("Gezählter Kassenbestand (Ist):", "Counted Cash Drawer (Actual):")}
                  </label>
                  <div className="relative flex items-center w-32">
                    <span className="absolute left-2.5 font-bold text-amber-900 text-xs">€</span>
                    <input
                      id="counted-cash-input"
                      type="text"
                      value={countedCashInput}
                      onChange={(e) => setCountedCashInput(e.target.value)}
                      placeholder={(metrics.sollKassenbestandCents / 100).toFixed(2)}
                      className="w-full pl-6 pr-2 py-1 rounded-xl border border-amber-400 bg-white font-bold text-xs text-right text-amber-950 outline-none focus:ring-1 focus:ring-amber-600"
                    />
                  </div>
                </div>

                {typeof liveDiffCents === "number" && (
                  <div className="flex justify-between items-center pt-1 border-t border-amber-200 text-xs font-bold">
                    <span className="text-amber-950">{t("Kassendifferenz:", "Cash Difference:")}</span>
                    <span
                      className={`font-mono text-sm px-2 py-0.5 rounded-lg ${
                        liveDiffCents === 0
                          ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          : liveDiffCents < 0
                          ? "bg-rose-100 text-rose-900 border border-rose-300"
                          : "bg-amber-200 text-amber-950 border border-amber-400"
                      }`}
                    >
                      {liveDiffCents > 0 ? `+${formatPrice(liveDiffCents)}` : formatPrice(liveDiffCents)}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              metrics.countedCashCents !== undefined && (
                <div className="space-y-1.5 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs">
                  <div className="flex justify-between items-center text-amber-950">
                    <span className="font-semibold">{t("Gezählter Kassenbestand (Ist):", "Counted Cash Drawer:")}</span>
                    <span className="font-bold font-display">{formatPrice(metrics.countedCashCents)}</span>
                  </div>
                  {metrics.differenceCents !== undefined && (
                    <div className="flex justify-between items-center font-extrabold pt-1 border-t border-amber-200">
                      <span>{t("Zähldifferenz:", "Cash Difference:")}</span>
                      <span
                        className={`font-mono ${
                          metrics.differenceCents === 0
                            ? "text-emerald-800"
                            : metrics.differenceCents < 0
                            ? "text-rose-700"
                            : "text-amber-900"
                        }`}
                      >
                        {metrics.differenceCents > 0
                          ? `+${formatPrice(metrics.differenceCents)}`
                          : formatPrice(metrics.differenceCents)}
                      </span>
                    </div>
                  )}
                </div>
              )
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3 rounded-xl bg-cream/60 border border-[#eadfce] space-y-0.5">
              <span className="text-forest/60 text-[11px] font-semibold">{t("Bestellungen", "Completed Orders")}</span>
              <div className="text-lg font-extrabold text-forest font-display">{metrics.orderCount}</div>
            </div>
            <div className="p-3 rounded-xl bg-cream/60 border border-[#eadfce] space-y-0.5">
              <span className="text-forest/60 text-[11px] font-semibold">{t("Ø Bon-Wert", "Avg Order Value")}</span>
              <div className="text-lg font-extrabold text-forest font-display">{formatPrice(metrics.avgOrderCents)}</div>
            </div>
          </div>
        </div>

        {/* Itemized Sales Breakdown */}
        <div className="bg-white p-4 rounded-2xl border border-[#eadfce] space-y-3">
          <div className="flex items-center justify-between border-b border-[#eadfce] pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest/70">
              {t("Verkaufte Portionen", "Items Sold Breakdown")}
            </h4>
            <span className="text-xs font-bold text-forest/60">
              {metrics.orderCount} {t("Verkäufe", "Sales")}
            </span>
          </div>

          {itemizedSales.length === 0 ? (
            <p className="text-xs text-forest/50 italic text-center py-2">
              {t("Keine Verkäufe in dieser Schicht.", "No sales recorded in this shift.")}
            </p>
          ) : (
            <div className="space-y-1.5 text-xs max-h-[140px] overflow-y-auto pr-1">
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

        {/* Start / Close Shift Controls */}
        <div className="pt-1 print:hidden">
          {isShiftClosed ? (
            <div className="bg-amber-50 p-5 rounded-2xl border-2 border-amber-300 space-y-4 text-left">
              <div className="flex items-center justify-center gap-2 text-amber-950 font-extrabold text-sm border-b border-amber-200 pb-2.5 text-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{t("Schicht beendet & abgeschlossen.", "Shift is closed & completed.")}</span>
              </div>

              {/* Labeled, Self-Explanatory Opening Cash Input for New Shift */}
              <div className="space-y-2">
                <label htmlFor="new-shift-opening-cash" className="block text-xs font-extrabold uppercase tracking-wider text-amber-950">
                  {t("Anfangskassenbestand für neue Schicht (Wechselgeld in €)", "Opening Cash Float for New Shift (in €)")} <span className="text-rose-600 font-bold">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 font-extrabold text-lg text-amber-900">
                    €
                  </span>
                  <input
                    id="new-shift-opening-cash"
                    type="text"
                    value={openingCashInput}
                    onChange={(e) => setOpeningCashInput(e.target.value)}
                    placeholder="0,00"
                    className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-emerald-600 bg-white font-extrabold text-lg text-forest outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                  />
                </div>
                <p className="text-[11px] font-medium text-amber-900/80 italic">
                  {t(
                    "PFLICHTFELD: Exakter Wechselgeldbetrag in der Kasse vor dem ersten Verkauf der neuen Schicht.",
                    "MANDATORY: Exact cash float in the register before starting sales for the new shift."
                  )}
                </p>
              </div>

              <button
                disabled={isProcessing}
                onClick={handleExecuteStartShift}
                className="w-full py-3.5 rounded-xl bg-forest hover:bg-forest/90 disabled:opacity-50 text-white font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer border border-emerald-800"
              >
                <Play className="w-4 h-4 text-amber-300" />
                <span>{isProcessing ? t("Neue Schicht wird gestartet...", "Starting New Shift...") : t("Neue Schicht jetzt starten", "Start New Shift Now")}</span>
              </button>
            </div>
          ) : !confirmClose ? (
            <button
              onClick={() => setConfirmClose(true)}
              className="w-full py-3.5 rounded-2xl bg-amber-100 text-amber-900 font-extrabold text-xs hover:bg-amber-200 transition border border-amber-300 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <StopCircle className="w-4.5 h-4.5 text-amber-700" />
              <span>{t("Schicht Beenden", "Close Shift")}</span>
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-400 space-y-3 text-center animate-in fade-in duration-150">
              <div className="flex items-center justify-center gap-2 text-rose-900 font-extrabold text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{t("Schicht wirklich beenden?", "Really close this shift?")}</span>
              </div>
              <p className="text-xs text-rose-800 leading-snug">
                {t(
                  "Nach dem Beenden können keine neuen Verkäufe mehr getätigt werden.",
                  "After closing this shift, no new sales can be performed."
                )}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setConfirmClose(false)}
                  className="py-2.5 rounded-xl bg-white border border-rose-300 text-rose-900 font-bold text-xs hover:bg-rose-100 transition cursor-pointer"
                >
                  {t("Abbrechen", "Cancel")}
                </button>
                <button
                  disabled={isProcessing}
                  onClick={handleExecuteCloseShift}
                  className="py-2.5 rounded-xl bg-rose-700 text-white font-bold text-xs hover:bg-rose-800 transition shadow-sm cursor-pointer"
                >
                  {t("Ja, Schicht Beenden", "Yes, Close Shift")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
