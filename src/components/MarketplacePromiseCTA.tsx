import React from "react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n/I18nProvider";
import { UtensilsCrossed, PartyPopper, CalendarDays } from "lucide-react";

export function MarketplacePromiseCTA({ vertical }: { vertical?: "restaurant" | "caterer" | "planner" | string }) {
  const { lang } = useI18n();

  return (
    <section className="bg-forest text-cream py-16 md:py-24 border-t border-[#eadfce]/10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10 text-center">
        <span className="inline-block rounded-full bg-cream/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-mint mb-6">
          {lang === "de" ? "Made in Germany" : "Made in Germany"}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold leading-tight max-w-4xl mx-auto">
          {lang === "de"
            ? "Ein Marktplatz für spontane Bestellungen, kuratiertes Catering und professionelle Eventplanung."
            : "One marketplace for spontaneous restaurant orders, curated catering moments and professional event planning."}
        </h2>
        <p className="mt-6 text-base md:text-lg text-cream/70 max-w-2xl mx-auto">
          {lang === "de"
            ? "Immer kostenlos anfragen. Direkte Buchung ohne versteckte Servicegebühren."
            : "Always free to inquire. Direct bookings with no hidden service fees."}
        </p>

        <div className="mt-12 grid sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          <Link
            to="/instant-order"
            className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <UtensilsCrossed className="h-6 w-6 text-mint" />
            <h3 className="font-display font-semibold text-lg">{lang === "de" ? "Essen sofort bestellen" : "Instant Food Order"}</h3>
            <p className="text-sm text-cream/60">{lang === "de" ? "Restaurants in der Nähe" : "Nearby restaurants"}</p>
          </Link>
          <Link
            to="/catering"
            className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <PartyPopper className="h-6 w-6 text-mint" />
            <h3 className="font-display font-semibold text-lg">{lang === "de" ? "Catering" : "Catering"}</h3>
            <p className="text-sm text-cream/60">{lang === "de" ? "Büro & Event Verpflegung" : "Office & Event food"}</p>
          </Link>
          <Link
            to="/planner"
            className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <CalendarDays className="h-6 w-6 text-mint" />
            <h3 className="font-display font-semibold text-lg">{lang === "de" ? "Event Planner" : "Event Planner"}</h3>
            <p className="text-sm text-cream/60">{lang === "de" ? "Kostenlos planen lassen" : "Free concierge planning"}</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
