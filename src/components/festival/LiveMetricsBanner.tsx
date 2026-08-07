import { useI18n } from "@/i18n/I18nProvider";
import { Banknote, ShoppingBag, TrendingUp } from "lucide-react";

interface LiveMetricsBannerProps {
  metrics: {
    barUmsatzCents: number;
    openingCashCents: number;
    sollKassenbestandCents: number;
    stornierungenCents: number;
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
    <div className="bg-forest text-white p-2.5 sm:p-4 rounded-2xl shadow-lg border border-emerald-800/40">
      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
        {/* Total Cash Revenue */}
        <div className="bg-white/10 backdrop-blur-md p-2.5 sm:p-4 rounded-xl border border-white/10 flex flex-col justify-center items-center">
          <div className="flex items-center justify-center gap-1 text-[10px] sm:text-xs font-bold text-cream/90 uppercase tracking-wider">
            <Banknote className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span className="hidden sm:inline">{t("Bar-Umsatz", "Cash Sales")}</span>
            <span className="inline sm:hidden">{t("Umsatz", "Sales")}</span>
          </div>
          <div className="text-sm sm:text-2xl font-extrabold font-display text-white mt-0.5 truncate max-w-full">
            {formatPrice(metrics.barUmsatzCents)}
          </div>
        </div>

        {/* Order Count */}
        <div className="bg-white/10 backdrop-blur-md p-2.5 sm:p-4 rounded-xl border border-white/10 flex flex-col justify-center items-center">
          <div className="flex items-center justify-center gap-1 text-[10px] sm:text-xs font-bold text-cream/90 uppercase tracking-wider">
            <ShoppingBag className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>{t("Verkäufe", "Orders")}</span>
          </div>
          <div className="text-sm sm:text-2xl font-extrabold font-display text-amber-300 mt-0.5">
            {metrics.orderCount}
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white/10 backdrop-blur-md p-2.5 sm:p-4 rounded-xl border border-white/10 flex flex-col justify-center items-center">
          <div className="flex items-center justify-center gap-1 text-[10px] sm:text-xs font-bold text-cream/90 uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5 text-teal-300 shrink-0" />
            <span>{t("Ø Bon", "Avg Order")}</span>
          </div>
          <div className="text-sm sm:text-2xl font-extrabold font-display text-teal-300 mt-0.5 truncate max-w-full">
            {formatPrice(metrics.avgOrderCents)}
          </div>
        </div>
      </div>
    </div>
  );
}
