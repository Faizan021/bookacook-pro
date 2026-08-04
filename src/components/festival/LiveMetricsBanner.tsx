import { useI18n } from "@/i18n/I18nProvider";
import { Banknote, ShoppingBag, TrendingUp, DollarSign } from "lucide-react";

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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
        {/* Total Cash Revenue */}
        <div className="bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/10 flex flex-col justify-center items-center col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-cream/90 uppercase tracking-wider">
            <Banknote className="w-4 h-4 text-emerald-300" />
            <span>{t("Tages-Umsatz (Bar)", "Total Cash Sales")}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
            {formatPrice(metrics.totalCents)}
          </div>
        </div>

        {/* Order Count */}
        <div className="bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/10 flex flex-col justify-center items-center">
          <div className="flex items-center gap-1.5 text-xs font-medium text-cream/90 uppercase tracking-wider">
            <ShoppingBag className="w-4 h-4 text-amber-300" />
            <span>{t("Verkaufte Portionen", "Orders Count")}</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-display text-amber-300 mt-1">
            {metrics.orderCount}
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/10 flex flex-col justify-center items-center">
          <div className="flex items-center gap-1.5 text-xs font-medium text-cream/90 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-teal-300" />
            <span>{t("Ø Bon-Wert", "Avg Order Value")}</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-display text-teal-300 mt-1">
            {formatPrice(metrics.avgOrderCents)}
          </div>
        </div>
      </div>
    </div>
  );
}
