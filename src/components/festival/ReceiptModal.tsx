import { useI18n } from "@/i18n/I18nProvider";
import { X, Printer, CheckCircle2 } from "lucide-react";
import type { FestivalOrder, FestivalEventConfig } from "@/lib/festival/types";

interface ReceiptModalProps {
  isOpen: boolean;
  order: FestivalOrder | null;
  config: FestivalEventConfig;
  onClose: () => void;
}

export function ReceiptModal({ isOpen, order, config, onClose }: ReceiptModalProps) {
  const { t } = useI18n();

  if (!isOpen || !order) return null;

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    });
  };

  const formatDate = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "--.--.----";
    }
  };

  const formatTime = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) + " Uhr";
    } catch {
      return "--:--";
    }
  };

  const handlePrintTrigger = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4 animate-in fade-in duration-200">
      <div className="bg-white text-forest border border-[#eadfce] w-full max-w-sm rounded-3xl p-6 shadow-2xl relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-forest/60 hover:text-forest hover:bg-forest/10 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Digital Thermal Receipt Preview Box */}
        <div className="bg-[#fcfbfa] p-5 rounded-2xl border border-[#eadfce] font-mono text-xs space-y-4 shadow-inner">
          {/* Header */}
          <div className="text-center space-y-1 border-b border-dashed border-forest/30 pb-3">
            <h3 className="font-extrabold text-base tracking-wider uppercase">{config.restaurantName}</h3>
            <p className="text-[11px] text-forest/70">{config.eventName}</p>
            {config.eventNameSecondary && <p className="text-[10px] text-forest/60">{config.eventNameSecondary}</p>}
          </div>

          {/* Mandatory Date & Time Stamp Block */}
          <div className="flex justify-between items-center text-[11px] border-b border-dashed border-forest/30 pb-3">
            <div>
              <span className="text-forest/60">Datum: </span>
              <span className="font-bold">{formatDate(order.timestamp)}</span>
            </div>
            <div>
              <span className="text-forest/60">Uhrzeit: </span>
              <span className="font-bold">{formatTime(order.timestamp)}</span>
            </div>
          </div>

          {/* Order ID & Payment Method */}
          <div className="flex justify-between items-center text-[11px] font-bold">
            <span>Bestellung: {order.orderId}</span>
            <span className="uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
              {order.paymentMethod === "cash" ? "BAR" : "KARTE"}
            </span>
          </div>

          {/* Item Breakdown */}
          <div className="space-y-1.5 pt-1 border-b border-dashed border-forest/30 pb-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-[11px]">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span className="font-bold">{formatPrice(item.priceCents * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center text-sm font-extrabold font-display pt-1">
            <span>SUMME (BAR)</span>
            <span className="text-base text-emerald-900">{formatPrice(order.totalCents)}</span>
          </div>

          {/* Footer */}
          <div className="text-center text-[10px] text-forest/50 pt-2 border-t border-dashed border-forest/30">
            Vielen Dank für Ihren Besuch!
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={onClose}
            className="py-2.5 rounded-xl bg-cream border border-[#eadfce] text-forest font-bold text-xs hover:bg-forest/10 transition cursor-pointer"
          >
            {t("Schließen", "Close")}
          </button>
          <button
            onClick={handlePrintTrigger}
            className="py-2.5 rounded-xl bg-forest text-white font-bold text-xs hover:bg-forest/90 transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t("Beleg Drucken", "Print Receipt")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
