import { useState, useMemo } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { History, RotateCcw, AlertTriangle, CheckCircle2, XCircle, Search, Printer } from "lucide-react";
import type { FestivalOrder } from "@/lib/festival/types";

interface TransactionHistoryProps {
  orders: FestivalOrder[];
  onVoidLastOrder: () => void;
  onSelectOrder?: (order: FestivalOrder) => void;
}

export function TransactionHistory({
  orders,
  onVoidLastOrder,
  onSelectOrder,
}: TransactionHistoryProps) {
  const { t } = useI18n();
  const [showVoidConfirm, setShowVoidConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const activeOrders = orders.filter((o) => o.status === "completed");
  const lastActiveOrder = activeOrders[0];
  const hasActiveOrders = activeOrders.length > 0;

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
    });
  };

  const formatConciseTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "--:--";
    }
  };

  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;
    const query = searchQuery.toLowerCase().trim();
    return orders.filter((order) => {
      const orderIdMatch = order.orderId.toLowerCase().includes(query);
      const tableMatch = order.tableNumber?.toLowerCase().includes(query);
      const timeMatch = formatConciseTime(order.timestamp).includes(query);
      const itemMatch = order.items.some((i) => i.name.toLowerCase().includes(query));
      return orderIdMatch || tableMatch || timeMatch || itemMatch;
    });
  }, [orders, searchQuery]);

  const handleConfirmVoid = () => {
    onVoidLastOrder();
    setShowVoidConfirm(false);
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#eadfce] shadow-xs space-y-4">
      {/* Header & Void Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#eadfce] pb-3">
        <div className="flex items-center gap-2">
          <History className="w-4.5 h-4.5 text-forest/70" />
          <h3 className="font-display font-bold text-base text-forest">
            {t("Letzte Verkäufe", "Recent Transactions")}
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-cream text-forest/70 font-sans border border-[#eadfce]">
            {orders.length}
          </span>
        </div>

        {/* Void Last Transaction Button with Red Safety Warning */}
        <button
          disabled={!hasActiveOrders}
          onClick={() => setShowVoidConfirm(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 text-rose-800 hover:bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs transition border border-rose-300 shadow-xs cursor-pointer min-h-[44px]"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
          <span>{t("Letzten Verkauf Stornieren", "Void Last Order")}</span>
        </button>
      </div>

      {/* Search Input Filter (#012, Tisch 5, 13:42) */}
      <div className="relative">
        <Search className="w-4 h-4 text-forest/40 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("Suche nach #Bon, Tisch oder Uhrzeit (z.B. #012, Tisch 5, 13:42)...", "Search order #, table or time (e.g. #012, Table 5, 13:42)...")}
          className="w-full bg-[#fdfaf5] pl-9 pr-4 py-2.5 rounded-xl border border-[#eadfce] text-xs font-semibold text-forest placeholder:text-forest/40 outline-none focus:ring-1 focus:ring-emerald-600"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-forest/40 hover:text-forest font-bold"
          >
            ✕
          </button>
        )}
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
              className="flex-1 py-2.5 rounded-xl bg-white border border-rose-300 text-rose-900 font-bold text-xs hover:bg-rose-100 transition cursor-pointer min-h-[44px]"
            >
              {t("Abbrechen", "Cancel")}
            </button>
            <button
              onClick={handleConfirmVoid}
              className="flex-1 py-2.5 rounded-xl bg-rose-700 text-white font-bold text-xs hover:bg-rose-800 transition shadow-sm cursor-pointer min-h-[44px]"
            >
              {t("Ja, Stornieren", "Yes, Void Order")}
            </button>
          </div>
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <p className="text-xs text-forest/50 italic text-center py-4">
          {searchQuery
            ? t("Keine passenden Verkäufe gefunden.", "No matching orders found.")
            : t("Noch keine Bestellungen in dieser Schicht.", "No orders recorded in this shift yet.")}
        </p>
      ) : (
        <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
          {filteredOrders.slice(0, 15).map((order) => {
            const isVoided = order.status === "voided";

            return (
              <div
                key={order.id || order.orderId + order.timestamp}
                onClick={() => onSelectOrder && onSelectOrder(order)}
                className={`p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 text-xs transition cursor-pointer hover:border-emerald-600 ${
                  isVoided
                    ? "bg-rose-50/60 border-rose-200 text-rose-800 line-through opacity-70"
                    : "bg-[#fdfaf5] border-[#eadfce] text-forest hover:bg-emerald-50/40"
                }`}
              >
                {/* Line 1: Order ID, Time, Table, Status, Price */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-extrabold font-display text-sm">{order.orderId}</span>
                    <span className="text-forest/70 font-mono text-xs font-bold bg-cream px-1.5 py-0.5 rounded border border-[#eadfce]">
                      {formatConciseTime(order.timestamp)}
                    </span>
                    {order.tableNumber && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300">
                        🍽 {order.tableNumber}
                      </span>
                    )}
                    {/* Status Pills */}
                    {isVoided ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded-full border border-rose-300">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        🔴 Storniert
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        🟢 Abkassiert
                      </span>
                    )}
                  </div>

                  <span className="font-extrabold text-sm text-forest font-display sm:hidden">
                    {formatPrice(order.totalCents)}
                  </span>
                </div>

                {/* Line 2: Items & Total & Reprint Icon */}
                <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto pt-0.5 sm:pt-0">
                  <span className="truncate max-w-[200px] sm:max-w-[180px] font-medium text-forest/80">
                    {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-forest font-display hidden sm:inline">
                      {formatPrice(order.totalCents)}
                    </span>
                    <Printer className="w-4 h-4 text-forest/40 hover:text-emerald-700 transition shrink-0" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
