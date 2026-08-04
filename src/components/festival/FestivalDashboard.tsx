import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { SiteShell } from "@/components/SiteShell";
import { LiveMetricsBanner } from "./LiveMetricsBanner";
import { FastOrderGrid } from "./FastOrderGrid";
import { PaymentSelector } from "./PaymentSelector";
import { QuantitySelector } from "./QuantitySelector";
import { TransactionHistory } from "./TransactionHistory";
import { ShiftSummaryModal } from "./ShiftSummaryModal";
import { useFestivalPos } from "@/lib/festival/useFestivalPos";
import type { FestivalEventConfig, FestivalItem } from "@/lib/festival/types";
import { FileText, Sparkles, Store, Globe } from "lucide-react";

interface FestivalDashboardProps {
  config: FestivalEventConfig;
  items: FestivalItem[];
}

export function FestivalDashboard({ config, items }: FestivalDashboardProps) {
  const { t, lang, setLang } = useI18n();
  const [shiftSummaryOpen, setShiftSummaryOpen] = useState(false);

  const {
    isLoaded,
    shiftData,
    metrics,
    itemizedSales,
    selectedQuantity,
    setSelectedQuantity,
    selectedNotes,
    setSelectedNotes,
    activeItemForCustomization,
    setActiveItemForCustomization,
    recordOrder,
    voidLastOrder,
    resetShift,
  } = useFestivalPos({ config });

  // State for instant payment modal
  const [pendingQuickItem, setPendingQuickItem] = useState<FestivalItem | null>(null);

  const handleQuickOrderTap = (item: FestivalItem) => {
    setPendingQuickItem(item);
  };

  const handleCustomizeOrderTap = (item: FestivalItem) => {
    setActiveItemForCustomization(item);
    setSelectedQuantity(1);
    setSelectedNotes("");
  };

  const handleConfirmCustomization = () => {
    if (activeItemForCustomization) {
      setPendingQuickItem(activeItemForCustomization);
      setActiveItemForCustomization(null);
    }
  };

  const handlePaymentSelected = (method: "cash" | "card") => {
    if (pendingQuickItem) {
      recordOrder(pendingQuickItem, method, selectedQuantity, selectedNotes);
      setPendingQuickItem(null);
    }
  };

  return (
    <SiteShell dotted={false}>
      <div className="min-h-screen bg-[#fdfaf5] text-forest px-4 py-6 sm:py-8 max-w-5xl mx-auto space-y-6">
        {/* Branding Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#eadfce] shadow-sm">
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
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-forest bg-mint/40 px-2 py-0.5 rounded-full border border-forest/20">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  {t("Festival Mode", "Festival Mode")}
                </span>
              </div>
              <p className="text-xs text-forest/70 font-medium">
                {config.eventName} {config.eventNameSecondary ? `• ${config.eventNameSecondary}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === "de" ? "en" : "de")}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-cream border border-[#eadfce] text-forest font-bold text-xs hover:bg-forest/10 transition"
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

        {/* 6-Item Fast Counter Touch Grid */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#eadfce] shadow-sm">
          <FastOrderGrid
            items={items}
            onQuickOrder={handleQuickOrderTap}
            onCustomizeOrder={handleCustomizeOrderTap}
          />
        </div>

        {/* Transaction History & Void Action */}
        <TransactionHistory orders={shiftData.orders} onVoidLastOrder={voidLastOrder} />

        {/* Payment Modal (2-Tap Fast Path) */}
        <PaymentSelector
          item={pendingQuickItem}
          quantity={selectedQuantity}
          notes={selectedNotes}
          onSelectPayment={handlePaymentSelected}
          onCancel={() => setPendingQuickItem(null)}
        />

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

        {/* Shift Summary Modal */}
        <ShiftSummaryModal
          isOpen={shiftSummaryOpen}
          config={config}
          shiftStartedAt={shiftData.shiftStartedAt}
          metrics={metrics}
          itemizedSales={itemizedSales}
          onClose={() => setShiftSummaryOpen(false)}
          onResetShift={resetShift}
        />
      </div>
    </SiteShell>
  );
}
