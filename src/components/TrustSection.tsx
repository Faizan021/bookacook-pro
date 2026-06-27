import React from "react";

export interface TrustItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

export interface TrustSectionProps {
  badgeText?: string;
  headline: string;
  items: TrustItem[];
  className?: string;
}

export function TrustSection({ badgeText, headline, items, className = "" }: TrustSectionProps) {
  return (
    <section className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16 md:py-24 border-b border-[#eadfce]/30 ${className}`}>
      <div className="text-center max-w-2xl mx-auto space-y-4">
        {badgeText && (
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">
            {badgeText}
          </span>
        )}
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-forest">
          {headline}
        </h2>
      </div>

      <div className="mt-12 md:mt-16 grid sm:grid-cols-3 gap-8 md:gap-12">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex flex-col items-center text-center space-y-4 group">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 transition-colors group-hover:bg-emerald-500/20">
                <Icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-display font-bold text-forest">{item.title}</h3>
              <p className="text-sm text-forest/70 leading-relaxed max-w-sm">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
