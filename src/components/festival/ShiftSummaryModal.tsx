import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { X, FileText, AlertTriangle, Banknote, Clock, Calendar, Store, MapPin, Download, Play, StopCircle } from "lucide-react";
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
    orderCount: number;
    avgOrderCents: number;
  };
  itemizedSales: Array<{ name: string; quantity: number; totalCents: number }>;
  onClose: () => void;
  onStartShift: (openingCashCents: number) => Promise<void>;
  onCloseShift: () => Promise<void>;
}

export function ShiftSummaryModal({
  isOpen,
  config,
  shiftData,
  orders,
  metrics,
  itemizedSales,
  onClose,
  onStartShift,
  onCloseShift,
}: ShiftSummaryModalProps) {
  const { t } = useI18n();
  const [confirmClose, setConfirmClose] = useState(false);
  const [openingCashInput, setOpeningCashInput] = useState("150.00");
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

  const handleExecuteStartShift = async () => {
    setIsProcessing(true);
    try {
      const parsedFloat = parseFloat(openingCashInput.replace(",", "."));
      const cents = Math.round((isNaN(parsedFloat) ? 150 : parsedFloat) * 100);
      await onStartShift(cents);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteCloseShift = async () => {
    setIsProcessing(true);
    try {
      await onCloseShift();
      setConfirmClose(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const isShiftClosed = shiftData.status === "closed";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#fdfaf5] text-forest border border-[#eadfce] w-full max-w-lg rounded-3xl p-6 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-forest/60 hover:text-forest hover:bg-forest/10 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Schichtbericht Header */}
        <div className="text-center space-y-2 border-b border-[#eadfce] pb-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-forest text-cream grid place-items-center mb-1 shadow-md">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold font-display text-forest">
            {t("Schichtbericht", "Shift Report")}
          </h2>

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

          <div className="text-[11px] font-mono text-emerald-800 bg-emerald-50 py-1 px-3 rounded-xl border border-emerald-200 inline-block">
            {t("Schichtzeitraum:", "Shift Period:")} {formatTimeOnly(shiftData.shiftStartedAt)} –{" "}
            {isShiftClosed ? formatTimeOnly(shiftData.shiftEndedAt || "") : t("Aktiv", "Active")}
          </div>
        </div>

        {/* German Gastronomy Accounting Breakdown */}
        <div className="bg-white p-4 rounded-2xl border border-[#eadfce] space-y-3">
          <div className="flex items-center justify-between border-b border-[#eadfce] pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest/70">
              {t("Kassensturz & Abrechnung", "Cash Accounting")}
            </h4>
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-xl border border-emerald-300 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t("⬇ Schicht-Export (CSV)", "⬇ Export Shift (CSV)")}</span>
            </button>
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
        <div className="pt-1">
          {isShiftClosed ? (
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-300 space-y-3 text-center">
              <span className="text-xs font-bold text-amber-900 block">
                {t("Schicht ist aktuell beendet.", "Shift is currently closed.")}
              </span>
              <div className="flex items-center gap-2 max-w-xs mx-auto">
                <input
                  type="text"
                  value={openingCashInput}
                  onChange={(e) => setOpeningCashInput(e.target.value)}
                  placeholder="150.00"
                  className="w-24 px-3 py-2 rounded-xl border border-amber-300 bg-white font-bold text-xs text-center"
                />
                <button
                  disabled={isProcessing}
                  onClick={handleExecuteStartShift}
                  className="flex-1 py-2.5 rounded-xl bg-forest text-white font-bold text-xs hover:bg-forest/90 transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  <span>{t("Neue Schicht Starten", "Start New Shift")}</span>
                </button>
              </div>
            </div>
          ) : !confirmClose ? (
            <button
              onClick={() => setConfirmClose(true)}
              className="w-full py-3 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs hover:bg-amber-200 transition border border-amber-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <StopCircle className="w-4 h-4" />
              <span>{t("Schicht Beenden", "Close Shift")}</span>
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-3 text-center">
              <div className="flex items-center justify-center gap-2 text-amber-900 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>{t("Schicht wirklich beenden?", "Are you sure you want to close this shift?")}</span>
              </div>
              <p className="text-[11px] text-amber-800">
                {t(
                  "Der Schichtbericht wird geschlossen und im Verlauf gesichert.",
                  "The shift report will be closed and archived in local history."
                )}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setConfirmClose(false)}
                  className="py-2.5 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold text-xs hover:bg-amber-100 transition cursor-pointer"
                >
                  {t("Abbrechen", "Cancel")}
                </button>
                <button
                  disabled={isProcessing}
                  onClick={handleExecuteCloseShift}
                  className="py-2.5 rounded-xl bg-amber-800 text-white font-bold text-xs hover:bg-amber-900 transition shadow-sm cursor-pointer"
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
