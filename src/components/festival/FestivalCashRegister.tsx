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
import { StartShiftModal } from "./StartShiftModal";
import { useFestivalCashRegister } from "@/lib/festival/useFestivalCashRegister";
import type { FestivalEventConfig, FestivalItem, FestivalOrder } from "@/lib/festival/types";
import { FileText, Settings as SettingsIcon, Globe, CheckCircle2, HardDrive, Printer, ShieldCheck, Clock, Lock, Play } from "lucide-react";
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
    shiftDurationText,
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

  const isShiftClosed = shiftData?.status === "closed";
  const isShiftActive = shiftData !== null && shiftData.status === "active";

  const handleAddToCart = (item: FestivalItem) => {
    if (isShiftClosed) {
      toast.error("Schicht beendet — Starte eine neue Schicht um fortzufahren.");
      return;
    }
    addToCart(item, 1);
    toast.success(`1x ${item.name} hinzugefügt`);
  };

  const handleCustomizeOrderTap = (item: FestivalItem) => {
    if (isShiftClosed) {
      toast.error("Schicht beendet — Starte eine neue Schicht um fortzufahren.");
      return;
    }
    setActiveItemForCustomization(item);
    setSelectedQuantity(1);
    setSelectedNotes("");
  };

  const handleConfirmCustomization = () => {
    if (activeItemForCustomization && !isShiftClosed) {
      addToCart(activeItemForCustomization, selectedQuantity, selectedNotes);
      toast.success(`${selectedQuantity}x ${activeItemForCustomization.name} hinzugefügt`);
      setActiveItemForCustomization(null);
    }
  };

  const handleExecuteCheckout = async () => {
    if (cartItems.length === 0 || isCheckoutProcessing || isShiftClosed) return;

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
    const targetDate = isoStr ? new Date(isoStr) : new Date();
    try {
      return targetDate.toLocaleDateString("de-DE", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return isoStr || "";
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
    <div className="min-h-screen bg-[#fdfaf5] text-forest font-sans select-none px-3 sm:px-6 py-3 sm:py-6 max-w-6xl mx-auto space-y-4 sm:space-y-5 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:pb-6 overflow-x-hidden relative">
      {/* Required Start Shift Overlay when no active shift is running */}
      <StartShiftModal
        isOpen={!isShiftActive && !isShiftClosed}
        config={config}
        operatingDateStr={formatOperatingDateDisplay()}
        onStartShift={startNewShift}
      />

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

      {/* Operational Clean Header (Reflows into 2 rows on mobile) */}
      <div className="flex flex-col gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-[#eadfce] shadow-xs">
        {/* Row 1: Brand, App Title, Actions */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-forest text-white grid place-items-center font-bold text-lg sm:text-xl shadow-md shrink-0">
              🍽
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="font-display font-bold text-base sm:text-xl text-forest">
                  {config.restaurantName}
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                  🎪 Festival Cash
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Settings Button (44px target) */}
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="w-11 h-11 rounded-xl bg-cream border border-[#eadfce] text-forest font-bold hover:bg-forest/10 transition cursor-pointer flex items-center justify-center"
              title="Settings"
            >
              <SettingsIcon className="w-4.5 h-4.5" />
            </button>

            {/* Language Switcher (44px target) */}
            <button
              type="button"
              onClick={() => setLang(lang === "de" ? "en" : "de")}
              className="h-11 px-3 rounded-xl bg-cream border border-[#eadfce] text-forest font-bold text-xs hover:bg-forest/10 transition cursor-pointer flex items-center gap-1"
            >
              <Globe className="w-4 h-4" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* Schichtbericht Button (44px target) */}
            <button
              type="button"
              onClick={() => setShiftSummaryOpen(true)}
              className="h-11 px-3.5 rounded-xl bg-forest text-white hover:bg-forest/90 font-bold text-xs shadow-sm transition cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">{t("Schichtbericht", "Shift Report")}</span>
              <span className="inline sm:hidden">{t("Bericht", "Report")}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Status & Shift Info */}
        <div className="flex items-center justify-between border-t border-[#eadfce]/60 pt-2.5 text-xs text-forest/70 font-medium flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-forest">{config.eventName}</span>
            {shiftData?.shiftNumber && (
              <span className="inline-flex items-center text-[10px] font-extrabold uppercase tracking-wider text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                {shiftData.shiftNumber}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-amber-900 font-bold">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              {formatOperatingDateDisplay(shiftData?.operatingDate)}
            </span>
            {shiftDurationText && (
              <span className="font-bold text-emerald-800">⏱ {shiftDurationText}</span>
            )}
          </div>

          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[11px] border ${
              isOnline
                ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                : "bg-amber-50 text-amber-900 border-amber-300"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            ></span>
            <span>
              {isOnline
                ? t("🟢 Online", "🟢 Online")
                : t("🟠 Offline", "🟠 Offline")}
            </span>
          </div>
        </div>
      </div>

      {/* Locked Register Banner when shift is closed */}
      {isShiftClosed && (
        <div className="bg-amber-100/90 border-2 border-amber-400 p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3 text-amber-950">
            <Lock className="w-6 h-6 text-amber-800 shrink-0" />
            <div>
              <h3 className="font-bold text-base">
                {t("Schicht beendet & Kasse gesperrt.", "Shift closed & cash register locked.")}
              </h3>
              <p className="text-xs text-amber-900 font-medium">
                {t(
                  "Starte eine neue Schicht um fortzufahren und neue Verkäufe abzukassieren.",
                  "Start a new shift to continue taking customer orders."
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShiftSummaryOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-forest text-white font-extrabold text-xs hover:bg-forest/90 transition shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Play className="w-4 h-4 text-amber-300" />
            <span>{t("Neue Schicht starten", "Start New Shift")}</span>
          </button>
        </div>
      )}

      {/* Live Metrics Banner */}
      <LiveMetricsBanner metrics={metrics} />

      {/* 6-Item Counter Touch Grid */}
      <div className={`bg-white p-3 sm:p-6 rounded-3xl border border-[#eadfce] shadow-xs ${isShiftClosed ? "opacity-60 pointer-events-none" : ""}`}>
        <FastOrderGrid
          items={items}
          cartSummary={cartSummary}
          onAddToCart={handleAddToCart}
          onCustomizeOrder={handleCustomizeOrderTap}
        />
      </div>

      {/* Current Customer Order Tray / Cart */}
      <div className={isShiftClosed ? "opacity-60 pointer-events-none" : ""}>
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
      </div>

      {/* Transaction History (Tap order to preview/reprint receipt) */}
      <TransactionHistory
        orders={orders}
        onVoidLastOrder={voidLastOrder}
        onSelectOrder={(order) => setReceiptOrder(order)}
      />

      {/* Footer System Badges */}
      <div className="bg-white/60 p-3 rounded-2xl border border-[#eadfce] flex flex-wrap items-center justify-between text-xs text-forest/70 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-semibold">
            <HardDrive className="w-3.5 h-3.5 text-forest/60" />
            {t("IndexedDB Gesichert", "IndexedDB Saved")}
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <Printer className="w-3.5 h-3.5 text-forest/60" />
            {t("80mm Drucker Bereit", "80mm Printer Ready")}
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
        shiftDurationText={shiftDurationText}
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
