import { useState, useMemo } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { LiveMetricsBanner } from "./LiveMetricsBanner";
import { FastOrderGrid } from "./FastOrderGrid";
import { CurrentOrderCart } from "./CurrentOrderCart";
import { QuantitySelector } from "./QuantitySelector";
import { TransactionHistory } from "./TransactionHistory";
import { ShiftSummaryModal } from "./ShiftSummaryModal";
import { SettingsModal } from "./SettingsModal";
import { ReceiptModal } from "./ReceiptModal";
import { useFestivalCashRegister } from "@/lib/festival/useFestivalCashRegister";
import type { FestivalEventConfig, FestivalItem, FestivalOrder } from "@/lib/festival/types";
import { FileText, Settings as SettingsIcon, Globe, CheckCircle2, HardDrive, Printer, ShieldCheck, Clock } from "lucide-react";
import { toast } from "sonner";

interface FestivalCashRegisterProps {
  config: FestivalEventConfig;
  items: FestivalItem[];
}

export function FestivalCashRegister({ config, items }: FestivalCashRegisterProps) {
  const { t, lang, setLang } = useI18n();
  const [shiftSummaryOpen, setShiftSummaryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<FestivalOrder | null>(null);

  // Payment Success Overlay Transient State
  const [successOverlay, setSuccessOverlay] = useState<{
    orderId: string;
    totalCents: number;
  } | null>(null);

  const {
    isLoaded,
    isOnline,
    shiftData,
    orders,
    metrics,
    itemizedSales,
    cartItems,
    cartTotalCents,
    cartTotalQuantity,
    tableModeEnabled,
    setTableModeSetting,
    tableNumber,
    setTableNumber,
    isCheckoutProcessing,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    checkoutCart,
    selectedQuantity,
    setSelectedQuantity,
    selectedNotes,
    setSelectedNotes,
    activeItemForCustomization,
    setActiveItemForCustomization,
    voidLastOrder,
    startNewShift,
    closeCurrentShift,
  } = useFestivalCashRegister({ config });

  // Map cart items for FastOrderGrid quantity badge (e.g. 2x in cart)
  const cartSummary = useMemo(() => {
    return cartItems.map((entry) => ({
      itemId: entry.item.id,
      quantity: entry.quantity,
    }));
  }, [cartItems]);

  const handleAddToCart = (item: FestivalItem) => {
    addToCart(item, 1);
    toast.success(`1x ${item.name} hinzugefügt`);
  };

  const handleCustomizeOrderTap = (item: FestivalItem) => {
    setActiveItemForCustomization(item);
    setSelectedQuantity(1);
    setSelectedNotes("");
  };

  const handleConfirmCustomization = () => {
    if (activeItemForCustomization) {
      addToCart(activeItemForCustomization, selectedQuantity, selectedNotes);
      toast.success(`${selectedQuantity}x ${activeItemForCustomization.name} hinzugefügt`);
      setActiveItemForCustomization(null);
    }
  };

  const handleExecuteCheckout = async () => {
    if (cartItems.length === 0 || isCheckoutProcessing) return;

    const res = await checkoutCart();

    if (res) {
      // Show payment success overlay ONLY AFTER INDEXEDDB SAVED SUCCESSFULLY
      setSuccessOverlay({ orderId: res.orderId, totalCents: res.totalCents });
      setTimeout(() => {
        setSuccessOverlay(null);
      }, 700);
    }
  };

  const formatOperatingDateDisplay = (isoStr?: string) => {
    if (!isoStr) return "";
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString("de-DE", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return isoStr;
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#fdfaf5] grid place-items-center font-sans">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-forest">{t("Lade Kasse...", "Loading Cash Register...")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf5] text-forest font-sans select-none px-3 py-4 sm:p-6 max-w-6xl mx-auto space-y-5 pb-20 relative">
      {/* Satisfying Payment Success Overlay */}
      {successOverlay && (
        <div className="fixed inset-0 z-50 bg-emerald-950/70 backdrop-blur-md grid place-items-center animate-in fade-in zoom-in-95 duration-150">
          <div className="bg-white p-8 rounded-3xl text-center space-y-3 shadow-2xl border-4 border-emerald-500 max-w-xs">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 grid place-items-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold font-display text-forest">
              {t("Zahlung Erfolgreich!", "Payment Complete!")}
            </h3>
            <div className="text-3xl font-extrabold text-emerald-800 font-display">
              {(successOverlay.totalCents / 100).toFixed(2)} €
            </div>
            <p className="text-xs font-bold text-forest/70 font-mono">
              {t("Bestellung", "Order")} {successOverlay.orderId}
            </p>
          </div>
        </div>
      )}

      {/* Operational Clean Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-[#eadfce] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-forest text-white grid place-items-center font-bold text-xl shadow-md shrink-0">
            🍽
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display font-bold text-lg sm:text-xl text-forest">
                {config.restaurantName}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                🎪 Festival Cash Register
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-forest/70 font-medium pt-0.5">
              <span>{config.eventName} {config.eventNameSecondary ? `· ${config.eventNameSecondary}` : ""}</span>
              <span className="text-forest/30">•</span>
              <span className="inline-flex items-center gap-1 text-amber-900 font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                {formatOperatingDateDisplay(shiftData?.operatingDate)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          {/* Connection Status Badge (Online vs Offline Saved) */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs border ${
              isOnline
                ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                : "bg-amber-50 text-amber-900 border-amber-300"
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isOnline ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            ></span>
            <span>
              {isOnline
                ? t("🟢 Online · Saved", "🟢 Online · Saved")
                : t("🟠 Offline · Saved on this device", "🟠 Offline · Saved on this device")}
            </span>
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 rounded-xl bg-cream border border-[#eadfce] text-forest font-bold hover:bg-forest/10 transition cursor-pointer"
            title="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === "de" ? "en" : "de")}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-cream border border-[#eadfce] text-forest font-bold text-xs hover:bg-forest/10 transition cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* Schichtbericht Button */}
          <button
            onClick={() => setShiftSummaryOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-forest text-white hover:bg-forest/90 font-bold text-xs shadow-sm transition cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>{t("Schichtbericht", "Shift Report")}</span>
          </button>
        </div>
      </div>

      {/* Live Metrics Banner */}
      <LiveMetricsBanner metrics={metrics} />

      {/* 6-Item Counter Touch Grid */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#eadfce] shadow-xs">
        <FastOrderGrid
          items={items}
          cartSummary={cartSummary}
          onAddToCart={handleAddToCart}
          onCustomizeOrder={handleCustomizeOrderTap}
        />
      </div>

      {/* Current Customer Order Tray / Cart */}
      <CurrentOrderCart
        cartItems={cartItems}
        totalCents={cartTotalCents}
        totalQuantity={cartTotalQuantity}
        tableModeEnabled={tableModeEnabled}
        tableNumber={tableNumber}
        onTableNumberChange={setTableNumber}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        onCheckout={handleExecuteCheckout}
        isCheckoutProcessing={isCheckoutProcessing}
      />

      {/* Transaction History */}
      <TransactionHistory orders={orders} onVoidLastOrder={voidLastOrder} />

      {/* Footer System Badges */}
      <div className="bg-white/60 p-3 rounded-2xl border border-[#eadfce] flex flex-wrap items-center justify-between text-xs text-forest/70 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-semibold">
            <HardDrive className="w-3.5 h-3.5 text-forest/60" />
            {t("Datenbank: IndexedDB Gesichert", "Storage: IndexedDB Local")}
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <Printer className="w-3.5 h-3.5 text-forest/60" />
            {t("Drucker: 80mm Bereit", "Printer: 80mm Ready")}
          </span>
        </div>
        <span className="flex items-center gap-1 font-bold text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Schnitzel Schmiede Festival Cash Register v1.0</span>
        </span>
      </div>

      {/* Customization Modal */}
      <QuantitySelector
        item={activeItemForCustomization}
        quantity={selectedQuantity}
        notes={selectedNotes}
        onQuantityChange={setSelectedQuantity}
        onNotesChange={setSelectedNotes}
        onConfirm={handleConfirmCustomization}
        onCancel={() => setActiveItemForCustomization(null)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        restaurantName={config.restaurantName}
        eventName={config.eventName}
        standName={config.eventNameSecondary || "Stand #4"}
        tableModeEnabled={tableModeEnabled}
        onToggleTableMode={setTableModeSetting}
        onClose={() => setSettingsOpen(false)}
      />

      {/* Shift Summary Report Modal */}
      <ShiftSummaryModal
        isOpen={shiftSummaryOpen}
        config={config}
        shiftData={shiftData}
        orders={orders}
        metrics={metrics}
        itemizedSales={itemizedSales}
        onClose={() => setShiftSummaryOpen(false)}
        onStartShift={startNewShift}
        onCloseShift={closeCurrentShift}
      />

      {/* Digital 80mm Thermal Receipt Modal */}
      <ReceiptModal
        isOpen={!!receiptOrder}
        order={receiptOrder}
        config={config}
        onClose={() => setReceiptOrder(null)}
      />
    </div>
  );
}
