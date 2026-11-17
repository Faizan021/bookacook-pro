import { Banknote, Truck, Clock, Sparkles, CheckCircle2 } from "lucide-react";

interface CityAeoQuickFactsProps {
  cityName: string;
}

export function CityAeoQuickFacts({ cityName }: CityAeoQuickFactsProps) {
  return (
    <section
      aria-labelledby="aeo-quick-facts-heading"
      className="surface-card p-6 sm:p-8 rounded-3xl border border-forest/10 shadow-sm mb-10 transition-all"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-forest/10 pb-5 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#b28a3c]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AEO Quick Answer · Schnell-Fakten</span>
          </div>
          <h2
            id="aeo-quick-facts-heading"
            className="font-display text-xl sm:text-2xl font-bold text-forest mt-1"
          >
            Catering in {cityName} auf einen Blick
          </h2>
        </div>
        <div className="inline-flex items-center gap-2 text-xs text-forest/70 bg-cream/70 px-3 py-1.5 rounded-full border border-forest/10 self-start md:self-auto">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
          <span>Verifizierte Standards für {cityName} & Umland</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Richtpreise */}
        <div className="p-4 rounded-2xl bg-white/70 border border-forest/10 flex flex-col justify-between">
          <div className="flex items-center gap-2.5 text-forest mb-2">
            <div className="h-8 w-8 rounded-lg bg-[#b28a3c]/15 text-[#b28a3c] grid place-items-center shrink-0">
              <Banknote className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-sm">Richtpreise / Pers.</h3>
          </div>
          <p className="text-xs text-forest/75 leading-relaxed">
            Fingerfood ab <strong>14,50 €</strong> · Business Lunch ab <strong>18,50 €</strong> ·
            Gala & Buffet ab <strong>32,00 €</strong>.
          </p>
        </div>

        {/* Card 2: Lieferradius */}
        <div className="p-4 rounded-2xl bg-white/70 border border-forest/10 flex flex-col justify-between">
          <div className="flex items-center gap-2.5 text-forest mb-2">
            <div className="h-8 w-8 rounded-lg bg-[#b28a3c]/15 text-[#b28a3c] grid place-items-center shrink-0">
              <Truck className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-sm">Lieferradius</h3>
          </div>
          <p className="text-xs text-forest/75 leading-relaxed">
            Pünktliche Anlieferung im Umkreis von bis zu <strong>80 km</strong> um {cityName} in
            HACCP-zertifizierten Thermoboxen.
          </p>
        </div>

        {/* Card 3: Vorlauf & Schnelligkeit */}
        <div className="p-4 rounded-2xl bg-white/70 border border-forest/10 flex flex-col justify-between">
          <div className="flex items-center gap-2.5 text-forest mb-2">
            <div className="h-8 w-8 rounded-lg bg-[#b28a3c]/15 text-[#b28a3c] grid place-items-center shrink-0">
              <Clock className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-sm">Vorlaufzeit & Angebote</h3>
          </div>
          <p className="text-xs text-forest/75 leading-relaxed">
            Kostenlose Angebote binnen <strong>24 Stunden</strong>. Express-Catering je nach Menü ab{" "}
            <strong>48h Vorlauf</strong> realisierbar.
          </p>
        </div>

        {/* Card 4: Ernährungsformen */}
        <div className="p-4 rounded-2xl bg-white/70 border border-forest/10 flex flex-col justify-between">
          <div className="flex items-center gap-2.5 text-forest mb-2">
            <div className="h-8 w-8 rounded-lg bg-[#b28a3c]/15 text-[#b28a3c] grid place-items-center shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-sm">Ernährungskonzepte</h3>
          </div>
          <p className="text-xs text-forest/75 leading-relaxed">
            100% <strong>Halal-zertifiziert</strong>, <strong>vegan</strong>, vegetarisch sowie
            laktose- und glutenfreie Menüs verfügbar.
          </p>
        </div>
      </div>
    </section>
  );
}
