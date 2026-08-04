import { useState, useMemo } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { SiteShell } from "@/components/SiteShell";
import { LiveMetricsBanner } from "./LiveMetricsBanner";
import { FastOrderGrid } from "./FastOrderGrid";
import { CurrentOrderCart } from "./CurrentOrderCart";
import { QuantitySelector } from "./QuantitySelector";
import { TransactionHistory } from "./TransactionHistory";
import { ShiftSummaryModal } from "./ShiftSummaryModal";
import { ReceiptModal } from "./ReceiptModal";
import { useFestivalPos } from "@/lib/festival/useFestivalPos";
import type { FestivalEventConfig, FestivalItem, FestivalOrder } from "@/lib/festival/types";
import { FileText, Sparkles, Store, Globe, CheckCircle2, HardDrive, Printer, ShieldCheck, Clock } from "lucide-react";
import { toast } from "sonner";

interface FestivalDashboardProps {
  config: FestivalEventConfig;
  items: FestivalItem[];
}

export function FestivalDashboard({ config, items }: FestivalDashboardProps) {
  const { t, lang, setLang } = useI18n();
  const [shiftSummaryOpen, setShiftSummaryOpen] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<FestivalOrder | null>(null);

  // Success Overlay Transient State
  const [successOverlay, setSuccessOverlay] = useState<{
    orderId: string;
    totalCents: number;
  } | null>(null);

  const {
    isLoaded,
    shiftData,
    metrics,
    itemizedSales,
    cartItems,
    cartTotalCents,
    cartTotalQuantity,
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
    resetShift,
  } = useFestivalPos({ config });

  // Map cart items for FastOrderGrid badge indicator (e.g. 2x in Bon)
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

  const handleExecuteCheckout = () => {
    if (cartItems.length === 0) return;
    const pendingTotal = cartTotalCents;
    const nextOrderId = `#${String(shiftData.lastOrderNumber + 1).padStart(3, "0")}`;

    // Trigger Payment
    checkoutCart("cash");

    // Trigger brief satisfying 0.7s payment success overlay
    setSuccessOverlay({ orderId: nextOrderId, totalCents: pendingTotal });
    setTimeout(() => {
      setSuccessOverlay(null);
    }, 700);
  };

  const lastOrderTimestamp = shiftData.orders.length > 0 ? shiftData.orders[0].timestamp : undefined;

  return (
    <SiteShell dotted={false}>
      <div className="min-h-screen bg-[#fdfaf5] text-forest px-4 py-6 sm:py-8 max-w-5xl mx-auto space-y-6 pb-24 relative">
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

        {/* Subtle & Clean Branding Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-[#eadfce] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-forest text-white grid place-items-center font-bold text-xl shadow-md">
              {config.logoUrl ? (
                <img src={config.logoUrl} alt="" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <Store className="w-6 h-6 text-cream" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-lg sm:text-xl text-forest">
                  {config.restaurantName}
                </h1>
                {/* Subtle Product Branding Badge */}
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 shadow-xs">
                  <span>🎪 FESTIVAL MODE</span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-forest/70 font-medium pt-0.5">
                <span>{config.eventName} {config.eventNameSecondary ? `• ${config.eventNameSecondary}` : ""}</span>
                <span className="hidden sm:inline text-forest/30">•</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-forest/60">
                  <Clock className="w-3 h-3 text-amber-600" />
                  {t("Schicht: Heute", "Shift: Today")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {/* Live Auto-Save Connection Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{t("Online • Gesichert", "Online • Auto Saved")}</span>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === "de" ? "en" : "de")}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-cream border border-[#eadfce] text-forest font-bold text-xs hover:bg-forest/10 transition cursor-pointer"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* Schichtabschluss Button */}
            <button
              onClick={() => setShiftSummaryOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest text-white hover:bg-forest/90 font-bold text-xs shadow-sm transition cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{t("Schichtabschluss", "Shift Summary")}</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Banner */}
        <LiveMetricsBanner metrics={metrics} />

        {/* 6-Item Counter Touch Grid */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#eadfce] shadow-sm">
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
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
          onCheckout={handleExecuteCheckout}
        />

        {/* Transaction History & Safe Void Action */}
        <TransactionHistory orders={shiftData.orders} onVoidLastOrder={voidLastOrder} />

        {/* Enterprise Hardware & System Footer Badges */}
        <div className="bg-white/60 p-3 rounded-2xl border border-[#eadfce] flex flex-wrap items-center justify-between text-xs text-forest/70 gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-semibold">
              <HardDrive className="w-3.5 h-3.5 text-forest/60" />
              {t("Speicher: Lokal Gesichert", "Storage: Local Persistent")}
            </span>
            <span className="flex items-center gap-1 font-semibold">
              <Printer className="w-3.5 h-3.5 text-forest/60" />
              {t("Drucker: Bereit (App)", "Printer: Ready (App)")}
            </span>
          </div>
          <span className="flex items-center gap-1 font-bold text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Speisely Festival OS v1.3</span>
          </span>
        </div>

        {/* Customization Modal (Quantity & Notes) */}
        <QuantitySelector
          item={activeItemForCustomization}
          quantity={selectedQuantity}
          notes={selectedNotes}
          onQuantityChange={setSelectedQuantity}
          onNotesChange={setSelectedNotes}
          onConfirm={handleConfirmCustomization}
          onCancel={() => setActiveItemForCustomization(null)}
        />

        {/* Prominent Official Shift Summary Report Modal */}
        <ShiftSummaryModal
          isOpen={shiftSummaryOpen}
          config={config}
          shiftStartedAt={shiftData.shiftStartedAt}
          lastOrderTimestamp={lastOrderTimestamp}
          metrics={metrics}
          itemizedSales={itemizedSales}
          onClose={() => setShiftSummaryOpen(false)}
          onResetShift={resetShift}
        />

        {/* Printable Digital Receipt Preview Modal */}
        <ReceiptModal
          isOpen={!!receiptOrder}
          order={receiptOrder}
          config={config}
          onClose={() => setReceiptOrder(null)}
        />
      </div>
    </SiteShell>
  );
}
