import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { History, RotateCcw, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import type { FestivalOrder } from "@/lib/festival/types";

interface TransactionHistoryProps {
  orders: FestivalOrder[];
  onVoidLastOrder: () => void;
}

export function TransactionHistory({ orders, onVoidLastOrder }: TransactionHistoryProps) {
  const { t } = useI18n();
  const [showVoidConfirm, setShowVoidConfirm] = useState(false);

  const activeOrders = orders.filter((o) => o.status === "Recorded");
  const lastActiveOrder = activeOrders[0]; // Most recent active order
  const hasActiveOrders = activeOrders.length > 0;

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
    });
  };

  const formatRelativeTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      const timeStr = date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

      if (isToday) {
        return `Heute • ${timeStr}`;
      }

      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
        return `Gestern • ${timeStr}`;
      }

      const dateStr = date.toLocaleDateString("de-DE", { day: "2-digit", month: "short" });
      return `${dateStr} • ${timeStr}`;
    } catch {
      return "--:--";
    }
  };

  const handleConfirmVoid = () => {
    onVoidLastOrder();
    setShowVoidConfirm(false);
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#eadfce] shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[#eadfce] pb-3">
        <div className="flex items-center gap-2">
          <History className="w-4.5 h-4.5 text-forest/70" />
          <h3 className="font-display font-bold text-base text-forest">
            {t("Letzte Bestellungen", "Recent Transactions")}
          </h3>
        </div>

        {/* Void Last Transaction Button with Red Safety Warning */}
        <button
          disabled={!hasActiveOrders}
          onClick={() => setShowVoidConfirm(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 hover:bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs transition border border-rose-300 shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
          <span>{t("Letzte Stornieren", "Void Last Order")}</span>
        </button>
      </div>

      {/* Safety Confirmation Dialog for Voiding */}
      {showVoidConfirm && lastActiveOrder && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-400 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>
              {t("Bestellung", "Order")} {lastActiveOrder.orderId} ({formatPrice(lastActiveOrder.totalCents)}) {t("wirklich stornieren?", "really void?")}
            </span>
          </div>
          <p className="text-xs text-rose-800">
            {t(
              "Dieser Vorgang zieht den Betrag vom Schicht-Umsatz ab.",
              "This action will deduct the amount from shift revenue metrics."
            )}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setShowVoidConfirm(false)}
              className="flex-1 py-2 rounded-xl bg-white border border-rose-300 text-rose-900 font-bold text-xs hover:bg-rose-100 transition cursor-pointer"
            >
              {t("Abbrechen", "Cancel")}
            </button>
            <button
              onClick={handleConfirmVoid}
              className="flex-1 py-2 rounded-xl bg-rose-700 text-white font-bold text-xs hover:bg-rose-800 transition shadow-sm cursor-pointer"
            >
              {t("Ja, Stornieren", "Yes, Void Order")}
            </button>
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <p className="text-xs text-forest/50 italic text-center py-4">
          {t("Noch keine Bestellungen in dieser Schicht.", "No orders recorded in this shift yet.")}
        </p>
      ) : (
        <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
          {orders.slice(0, 10).map((order) => {
            const isVoided = order.status === "Voided";

            return (
              <div
                key={order.orderId + order.timestamp}
                className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition ${
                  isVoided
                    ? "bg-rose-50/60 border-rose-200 text-rose-800 line-through opacity-70"
                    : "bg-[#fdfaf5] border-[#eadfce] text-forest"
                }`}
              >
                {/* Order ID & Relative Timestamp & Status Pill */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold font-display text-sm">{order.orderId}</span>
                  <span className="text-forest/60 text-[11px] font-medium">{formatRelativeTimestamp(order.timestamp)}</span>
                  {order.tableNumber && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                      🪑 {order.tableNumber}
                    </span>
                  )}
                  {/* Status Pills */}
                  {isVoided ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full border border-rose-300">
                      <XCircle className="w-3 h-3 text-rose-600" />
                      🔴 Storniert
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      🟢 Abkassiert
                    </span>
                  )}
                </div>

                {/* Items & Total */}
                <div className="flex items-center gap-3">
                  <span className="truncate max-w-[130px] sm:max-w-[210px] font-medium text-forest/80">
                    {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                  </span>
                  <span className="font-extrabold text-sm text-forest font-display">
                    {formatPrice(order.totalCents)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
