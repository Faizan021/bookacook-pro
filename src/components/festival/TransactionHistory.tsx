import { useI18n } from "@/i18n/I18nProvider";
import { History, RotateCcw, Banknote, CreditCard } from "lucide-react";
import type { FestivalOrder } from "@/lib/festival/types";

interface TransactionHistoryProps {
  orders: FestivalOrder[];
  onVoidLastOrder: () => void;
}

export function TransactionHistory({ orders, onVoidLastOrder }: TransactionHistoryProps) {
  const { t } = useI18n();

  const activeOrders = orders.filter((o) => o.status === "Recorded");
  const hasActiveOrders = activeOrders.length > 0;

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
    });
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "--:--";
    }
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#eadfce] shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-forest/70" />
          <h3 className="font-display font-bold text-sm text-forest uppercase tracking-wider">
            {t("Letzte Bestellungen", "Recent Transactions")}
          </h3>
        </div>

        {/* Void Last Transaction Button */}
        <button
          disabled={!hasActiveOrders}
          onClick={onVoidLastOrder}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 hover:bg-amber-200 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs transition border border-amber-300 shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t("Letzte Bestellung stornieren", "Void Last Order")}</span>
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-xs text-forest/50 italic text-center py-4">
          {t("Noch keine Bestellungen in dieser Schicht.", "No orders recorded in this shift yet.")}
        </p>
      ) : (
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {orders.slice(0, 10).map((order) => {
            const isVoided = order.status === "Voided";

            return (
              <div
                key={order.orderId + order.timestamp}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs transition ${
                  isVoided
                    ? "bg-rose-50 border-rose-200 text-rose-800 line-through opacity-60"
                    : "bg-[#fdfaf5] border-[#eadfce] text-forest"
                }`}
              >
                {/* Order ID & Time */}
                <div className="flex items-center gap-2">
                  <span className="font-extrabold font-display text-sm">{order.orderId}</span>
                  <span className="text-forest/60 text-[11px]">{formatTime(order.timestamp)}</span>
                  {order.paymentMethod === "cash" ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                      <Banknote className="w-3 h-3" />
                      BAR
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md border border-sky-200">
                      <CreditCard className="w-3 h-3" />
                      KARTE
                    </span>
                  )}
                </div>

                {/* Items & Total */}
                <div className="flex items-center gap-3">
                  <span className="truncate max-w-[150px] sm:max-w-[220px] font-medium text-forest/80">
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
