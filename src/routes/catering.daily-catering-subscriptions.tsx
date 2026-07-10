import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles,
  Building,
  Utensils,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Clock,
  Star,
} from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/i18n/I18nProvider";
import { B2bCateringDialog } from "@/components/B2bCateringDialog";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/catering/daily-catering-subscriptions")({
  head: () => ({
    meta: [
      { title: "Flexible Büro-Mittagsverpflegung & Team-Lunch — Speisely" },
      {
        name: "description",
        content:
          "Unterstütze dein Team mit leckerem, gesundem Mittagessen im Büro. Flexible tägliche oder wöchentliche Pläne, pünktliche Lieferung und konsolidierte monatliche Rechnungsstellung.",
      },
      { property: "og:title", content: "Daily Office Catering Subscriptions — Speisely" },
      {
        property: "og:description",
        content:
          "Warmes, frisches Mittagessen direkt geliefert für dein Büro. Konfiguriere deinen wöchentlichen oder täglichen Essensplan.",
      },
      { property: "og:url", content: "/catering/daily-catering-subscriptions" },
    ],
    links: [{ rel: "canonical", href: "/catering/daily-catering-subscriptions" }],
  }),
  component: DailySubscriptions,
});

function DailySubscriptions() {
  const { lang } = useI18n();
  const [b2bOpen, setB2bOpen] = useState(false);

  return (
    <SiteShell>
      <PageHero
        eyebrow={lang === "de" ? "WIEDERKEHRENDE BÜRO-VERPFLEGUNG" : "RECURRING TEAM CATERING"}
        heading={
          lang === "de" ? (
            <>
              Das flexible Food-Abo
              <br />
              für dein <span className="text-[#f2d896]">Office &amp; Team.</span>
            </>
          ) : (
            <>
              The flexible meal plan
              <br />
              for your <span className="text-[#f2d896]">office &amp; team.</span>
            </>
          )
        }
        subtext={
          lang === "de"
            ? "Steigere Mitarbeiterzufriedenheit und Produktivität mit gesundem Mittagessen. Ohne feste Kantinenbindung. Plane euer Lunch-Programm flexibel (täglich bis monatlich) mit monatlicher Sammelrechnung."
            : "Boost employee satisfaction and productivity with healthy lunches. Without fixed canteen commitments. Plan your lunch program flexibly (daily to monthly) with consolidated monthly invoicing."
        }
        primaryCta={{
          label: lang === "de" ? "Büro-Abo anfragen" : "Request Office Catering",
          onClick: () => setB2bOpen(true),
        }}
        secondaryCta={{
          label: lang === "de" ? "Partner-Caterer ansehen" : "Discover Caterers",
          href: "/catering",
        }}
        imageUrl="/images/office_catering_hero.png"
        imageAlt="Corporate Office Lunch Buffet Plating Setup"
      />

      {/* Subscription Features (Invoicing, Logistics, Dietaries) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16 md:py-24 border-b border-[#eadfce]/30">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest">
            {lang === "de" ? "VORTEILE" : "BENEFITS"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-forest">
            {lang === "de"
              ? "Entlastung für Office Manager & HR"
              : "Relief for Office Managers & HR"}
          </h2>
          <p className="text-sm text-forest/70 leading-relaxed">
            {lang === "de"
              ? "Wir übernehmen die gesamte Abstimmung und Logistik. Speisely vereinfacht die Büro-Verpflegung für Startups, Agenturen und Großkonzerne."
              : "We take care of all coordination and logistics. Speisely simplifies workspace lunch rotations for startups, agencies, and major corporations."}
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Billing */}
          <div className="surface-card p-8 rounded-3xl border border-[#eadfce]/45 flex flex-col justify-between text-left">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
                <Building className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-forest">
                {lang === "de" ? "Konsolidierte Sammelrechnung" : "Consolidated Invoicing"}
              </h3>
              <p className="text-sm text-forest/75 leading-relaxed">
                {lang === "de"
                  ? "Schluss mit Zettelwirtschaft. Egal wie viele unterschiedliche Caterer liefern: Du erhältst am Monatsende eine einzige, finanzamtkonforme Rechnung."
                  : "No more paper chaos. No matter how many different caterers deliver: You receive a single, tax-compliant invoice at the end of the month."}
              </p>
            </div>
          </div>

          {/* Flexible Scheduling */}
          <div className="surface-card p-8 rounded-3xl border border-[#eadfce]/45 flex flex-col justify-between text-left">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-forest">
                {lang === "de" ? "Flexible Turnusplanung" : "Flexible Frequencies"}
              </h3>
              <p className="text-sm text-forest/75 leading-relaxed">
                {lang === "de"
                  ? "Täglich warm geliefert, einmal pro Woche als Social Team Lunch oder als Ergänzung zu eurer Küchen-Kantine. Passe Lieferzeiten und Quoten jederzeit an."
                  : "Warmly delivered daily, once a week as a social team lunch, or as a supplement to your pantry. Adjust times and splits at any time."}
              </p>
            </div>
          </div>

          {/* Dietaries */}
          <div className="surface-card p-8 rounded-3xl border border-[#eadfce]/45 flex flex-col justify-between text-left">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
                <Utensils className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-forest">
                {lang === "de" ? "Vielfalt für jede Ernährungsform" : "Dietary Flexibility"}
              </h3>
              <p className="text-sm text-forest/75 leading-relaxed">
                {lang === "de"
                  ? "Vegane, vegetarische, laktosefreie und halal Optionen sind fester Bestandteil unserer Pläne. Alle Allergene werden transparent ausgewiesen."
                  : "Vegan, vegetarian, lactose-free, and halal options are standard parts of our schedules. All allergen details are clearly highlighted."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mid-Page Call-To-Action (Subscription-Led Theme) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16">
        <div className="rounded-[2.5rem] bg-forest p-8 sm:p-12 text-cream flex flex-col md:flex-row items-center gap-8 justify-between relative overflow-hidden shadow-xl border border-forest/10">
          <div className="relative z-10 max-w-xl space-y-4 text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-cream/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cream backdrop-blur-sm">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> B2B OFFICE PLANS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-mint leading-tight">
              {lang === "de"
                ? "Starte dein unverbindliches Lunch-Abo Briefing"
                : "Configure Your Custom Lunch Plan"}
            </h2>
            <p className="text-cream/80 text-sm sm:text-base leading-relaxed">
              {lang === "de"
                ? "Teile uns deine Team-Größe, bevorzugten Wochentage und Wünsche mit. Unsere Corporate-Caterer erstellen ein maßgeschneidertes Rotationsangebot für euer Büro."
                : "Share your team size, preferred delivery days, and dietary needs. Our corporate partners will create a tailored rotating offer for your workspace."}
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => setB2bOpen(true)}
                className="rounded-full bg-mint px-6 py-3.5 text-sm font-semibold text-forest hover:bg-white transition cursor-pointer shadow-md flex items-center gap-2"
              >
                {lang === "de" ? "Corporate Abo anfragen" : "Daily Catering Subscriptions"}
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                to="/catering"
                className="rounded-full border border-cream/20 bg-transparent hover:bg-cream/10 px-6 py-3.5 text-sm font-semibold text-cream transition"
              >
                {lang === "de" ? "Caterer entdecken" : "Discover Caterers"}
              </Link>
            </div>
          </div>
          <div className="relative z-10 hidden md:block w-1/3 min-w-[280px]">
            <div className="absolute -inset-2 bg-gradient-to-tr from-mint/15 to-transparent rounded-[2rem] blur-2xl -z-10" />
            <img
              src="/images/office_catering_hero.png"
              alt="Workspace buffet plating setup"
              className="rounded-2xl shadow-2xl aspect-[4/3] object-cover border-2 border-white/10"
            />
          </div>
        </div>
      </section>

      {/* Checklist / Features list */}
      <section className="bg-cream/10 py-16 md:py-24 border-t border-b border-[#eadfce]/30 text-left">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest">
                {lang === "de" ? "UNSER VERSPRECHEN" : "OUR COMMITMENT"}
              </span>
              <h2 className="text-3xl font-display font-bold text-forest">
                {lang === "de"
                  ? "Sorgenfreie Verpflegung garantiert"
                  : "Worry-Free Catering Guaranteed"}
              </h2>
              <p className="text-sm text-forest/70 leading-relaxed">
                {lang === "de"
                  ? "Wir stellen sicher, dass eure Essenslieferung pünktlich ankommt, perfekt verpackt ist und die höchsten Hygienestandards erfüllt."
                  : "We ensure your meal delivery arrives on time, is perfectly packaged, and meets the highest hygiene guidelines."}
              </p>

              <ul className="space-y-3.5">
                {[
                  lang === "de"
                    ? "Pünktliche Anlieferung und fachgerechte Ausrüstung (Chafing Dishes)"
                    : "On-time delivery and professional equipment (chafing dishes)",
                  lang === "de"
                    ? "Monatlich wechselnde Menüpläne für maximale kulinarische Abwechslung"
                    : "Monthly rotating menus for ultimate culinary variety",
                  lang === "de"
                    ? "Kurzfristige Stornierungen von Portionen bei Homeoffice-Tagen"
                    : "Flexible portion changes to support work-from-home schedules",
                  lang === "de"
                    ? "Direkter persönlicher Support bei Fragen oder Wünschen"
                    : "Direct personal account support for changes or requests",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm text-forest/80 font-medium"
                  >
                    <CheckCircle2 className="h-5 w-5 text-forest shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
              <img
                src="/images/business_lunch_plating.png"
                alt="Vibrant healthy workspace lunch dish plating"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Block */}
      <section className="bg-cream/40 py-16 border-t border-[#eadfce]/30 text-center">
        <div className="mx-auto max-w-3xl px-4 space-y-6">
          <h2 className="text-3xl font-display font-bold text-forest">
            {lang === "de"
              ? "Bereit für das neue Team-Lunch Erlebnis?"
              : "Ready for a Smarter Office Lunch?"}
          </h2>
          <p className="text-sm text-forest/75 max-w-lg mx-auto">
            {lang === "de"
              ? "Starte jetzt eure Anfrage. Ein persönlicher Ansprechpartner wird sich in Kürze mit Menü-Vorschlägen bei dir melden."
              : "Launch your custom brief today. A dedicated account manager will get back to you with menu options shortly."}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => setB2bOpen(true)}
              className="rounded-full bg-[#22C55E] hover:bg-[#22C55E]/90 text-white px-6 py-3.5 text-sm font-semibold shadow-md transition cursor-pointer flex items-center gap-2"
            >
              {lang === "de" ? "Daily Catering Subscriptions" : "Daily Catering Subscriptions"}
              <ArrowRight className="h-4 w-4" />
            </button>
            <Link
              to="/catering"
              className="rounded-full bg-forest text-cream hover:opacity-95 px-6 py-3.5 text-sm font-semibold shadow-md transition cursor-pointer"
            >
              {lang === "de" ? "Caterer entdecken" : "Discover Caterers"}
            </Link>
          </div>
        </div>
      </section>

      {/* Reusable B2b Dialog */}
      <B2bCateringDialog open={b2bOpen} onOpenChange={setB2bOpen} />
    </SiteShell>
  );
}
