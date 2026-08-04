import { useI18n } from "@/i18n/I18nProvider";
import { Banknote, CreditCard, ShoppingBag, TrendingUp, DollarSign } from "lucide-react";

interface LiveMetricsBannerProps {
  metrics: {
    totalCents: number;
    cashCents: number;
    cardCents: number;
    orderCount: number;
    avgOrderCents: number;
  };
}

export function LiveMetricsBanner({ metrics }: LiveMetricsBannerProps) {
  const { t } = useI18n();

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    });
  };

  return (
    <div className="bg-forest text-white p-3.5 sm:p-4 rounded-2xl shadow-lg border border-emerald-800/40">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 text-center">
        {/* Total Revenue */}
        <div className="bg-white/10 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-white/10 flex flex-col justify-center items-center col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-cream/80 uppercase tracking-wider">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t("Tages-Umsatz", "Total Sales")}</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-display text-white mt-0.5">
            {formatPrice(metrics.totalCents)}
          </div>
        </div>

        {/* Cash Revenue */}
        <div className="bg-white/10 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-white/10 flex flex-col justify-center items-center">
          <div className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-cream/80 uppercase tracking-wider">
            <Banknote className="w-3.5 h-3.5 text-emerald-300" />
            <span>{t("Bar", "Cash")}</span>
          </div>
          <div className="text-base sm:text-lg font-bold font-display text-emerald-300 mt-0.5">
            {formatPrice(metrics.cashCents)}
          </div>
        </div>

        {/* Card Revenue */}
        <div className="bg-white/10 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-white/10 flex flex-col justify-center items-center">
          <div className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-cream/80 uppercase tracking-wider">
            <CreditCard className="w-3.5 h-3.5 text-sky-300" />
            <span>{t("Karte", "Card")}</span>
          </div>
          <div className="text-base sm:text-lg font-bold font-display text-sky-300 mt-0.5">
            {formatPrice(metrics.cardCents)}
          </div>
        </div>

        {/* Order Count */}
        <div className="bg-white/10 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-white/10 flex flex-col justify-center items-center">
          <div className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-cream/80 uppercase tracking-wider">
            <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
            <span>{t("Bestellungen", "Orders")}</span>
          </div>
          <div className="text-base sm:text-lg font-bold font-display text-amber-300 mt-0.5">
            {metrics.orderCount}
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white/10 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-white/10 flex flex-col justify-center items-center">
          <div className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-cream/80 uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5 text-teal-300" />
            <span>{t("Ø Bon-Wert", "Avg Order")}</span>
          </div>
          <div className="text-base sm:text-lg font-bold font-display text-teal-300 mt-0.5">
            {formatPrice(metrics.avgOrderCents)}
          </div>
        </div>
      </div>
    </div>
  );
}
