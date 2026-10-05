import { Link } from "@tanstack/react-router";
import { UtensilsCrossed, GlassWater, PartyPopper } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

interface UnifiedMarketplaceTabsProps {
  active: "restaurants" | "catering" | "planner";
}

export function UnifiedMarketplaceTabs({ active }: UnifiedMarketplaceTabsProps) {
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);

  const tabs = [
    {
      key: "restaurants" as const,
      label: tt("Restaurants", "Restaurants"),
      sublabel: tt("Direkt bestellen", "Order direct"),
      to: "/restaurants" as const,
      icon: <UtensilsCrossed className="w-4 h-4" />,
    },
    {
      key: "catering" as const,
      label: tt("Catering", "Catering"),
      sublabel: tt("Events & Buffets", "Events & Buffets"),
      to: "/catering" as const,
      icon: <GlassWater className="w-4 h-4" />,
    },
    {
      key: "planner" as const,
      label: tt("Event-Planung", "Event Planning"),
      sublabel: tt("Full-Service", "Full-Service"),
      to: "/planner" as const,
      icon: <PartyPopper className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <Link
            key={tab.key}
            to={tab.to}
            className={`inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 shadow-sm border ${
              isActive
                ? "bg-forest text-white border-forest shadow-md ring-2 ring-[#b28a3c]/40 font-bold"
                : "bg-white text-forest/75 border-[#e2e8e4] hover:bg-cream/60 hover:text-forest hover:border-forest/20"
            }`}
          >
            <span className={isActive ? "text-[#f4d58d]" : "text-[#b28a3c]"}>{tab.icon}</span>
            <span>{tab.label}</span>
            <span
              className={`hidden sm:inline text-[10px] font-medium ${
                isActive ? "text-white/60" : "text-forest/40"
              }`}
            >
              • {tab.sublabel}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
