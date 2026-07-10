import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Heart,
  Award,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/i18n/I18nProvider";
import { B2bCateringDialog } from "@/components/B2bCateringDialog";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/catering/institutional-catering")({
  head: () => ({
    meta: [
      { title: "Gesunde Großverpflegung für Kitas, Schulen & Kliniken — Speisely" },
      {
        name: "description",
        content:
          "Zuverlässige, nährstoffreiche Großverpflegung nach höchsten Qualitäts- und Hygienestandards. DGE-konforme Menüpläne für Kitas, Schulen, Kliniken und Pflegeeinrichtungen.",
      },
      {
        property: "og:title",
        content: "Gesunde Großverpflegung & Institutional Catering — Speisely",
      },
      {
        property: "og:description",
        content:
          "Ausgewogene Mahlzeiten für Schulen, Kitas und Heime. Zertifizierte Frischeküche, kindgerechte Rezepturen und zuverlässige Logistik.",
      },
      { property: "og:url", content: "/catering/institutional-catering" },
    ],
    links: [{ rel: "canonical", href: "/catering/institutional-catering" }],
  }),
  component: InstitutionalCatering,
});

function InstitutionalCatering() {
  const { lang } = useI18n();
  const [b2bOpen, setB2bOpen] = useState(false);

  return (
    <SiteShell>
      <PageHero
        eyebrow={lang === "de" ? "GROSSVERPFLEGUNG & BETREUUNG" : "LARGE SCALE & CARE DINING"}
        heading={
          lang === "de" ? (
            <>
              Ausgewogene Ernährung für
              <br />
              <span className="text-[#f2d896]">Schulen, Kitas &amp; Pflege.</span>
            </>
          ) : (
            <>
              Balanced nutrition for
              <br />
              <span className="text-[#f2d896]">schools, daycares &amp; care.</span>
            </>
          )
        }
        subtext={
          lang === "de"
            ? "Wir sichern eine gesunde und leckere Versorgung für deine Institution. DGE-konforme Menülinien, frische regionale Zutaten und allergikersichere Zubereitung kombiniert mit logistischer Zuverlässigkeit."
            : "We secure healthy and tasty nutrition for your institution. DGE-compliant menus, fresh regional ingredients, and allergen-safe preparation combined with absolute logistical reliability."
        }
        primaryCta={{
          label: lang === "de" ? "Konzept anfordern" : "Request a Concept",
          onClick: () => setB2bOpen(true),
        }}
        secondaryCta={{
          label: lang === "de" ? "Großcaterer entdecken" : "Discover Caterers",
          href: "/catering",
        }}
        imageUrl="/images/institutional_catering_hero.png"
        imageAlt="Nutritious institutional meal serving tray set"
      />

      {/* Target Audiences (Schools, Kitas, Care Homes) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16 md:py-24 border-b border-[#eadfce]/30">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest">
            {lang === "de" ? "EINRICHTUNGEN" : "INSTITUTIONS"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-forest">
            {lang === "de"
              ? "Spezialisierte Konzepte für jede Altersgruppe"
              : "Specialized Concepts for Every Age Group"}
          </h2>
          <p className="text-sm text-forest/70 leading-relaxed">
            {lang === "de"
              ? "Ob spielerisches Heranführen an Gemüse in der Kita oder bedarfsgerechte, leicht verdauliche Kost in Pflegeeinrichtungen – wir decken alle Anforderungen ab."
              : "Whether introducing veggies to toddlers in daycares or providing nutrient-dense, digestible options in care environments – we cover all requirements."}
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Daycares & Kitas */}
          <div className="surface-card p-8 rounded-3xl border border-[#eadfce]/45 flex flex-col justify-between text-left">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-forest">
                {lang === "de" ? "Kitas & Kindergärten" : "Kitas & Daycares"}
              </h3>
              <p className="text-sm text-forest/75 leading-relaxed">
                {lang === "de"
                  ? "Kindgerechte, abwechslungsreiche Speisepläne mit geringem Salzgehalt. Spielerische Rezepte, die Lust auf gesundes Essen machen."
                  : "Child-friendly, varied menus with minimal salt. Playful recipes that inspire toddlers to love healthy, fresh food."}
              </p>
            </div>
          </div>

          {/* Schools */}
          <div className="surface-card p-8 rounded-3xl border border-[#eadfce]/45 flex flex-col justify-between text-left">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-forest">
                {lang === "de" ? "Schulen & Horte" : "Schools & Daycare"}
              </h3>
              <p className="text-sm text-forest/75 leading-relaxed">
                {lang === "de"
                  ? "Energiegeladene Menüs für Schüler und Teenager zur Unterstützung der Konzentration im Unterricht. DGE-zertifizierte Nährstoffprofile."
                  : "Nutritionally balanced menus for students and teenagers to support classroom focus. DGE-certified nutrient levels."}
              </p>
            </div>
          </div>

          {/* Clinics & Care */}
          <div className="surface-card p-8 rounded-3xl border border-[#eadfce]/45 flex flex-col justify-between text-left">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-forest">
                {lang === "de" ? "Kliniken & Seniorenpflege" : "Clinics & Senior Care"}
              </h3>
              <p className="text-sm text-forest/75 leading-relaxed">
                {lang === "de"
                  ? "Bedarfsgerechte, leicht verdauliche Kost und Sonderdiäten (z.B. pürierte Speisen) unter Einhaltung strengster Hygienevorschriften."
                  : "Digestible nutrition and special diets (e.g. pureed meals) complying with the highest hygiene regulations."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mid-Page Call-To-Action (Institutional Theme) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16">
        <div className="rounded-[2.5rem] bg-forest p-8 sm:p-12 text-cream flex flex-col md:flex-row items-center gap-8 justify-between relative overflow-hidden shadow-xl border border-forest/10">
          <div className="relative z-10 max-w-xl space-y-4 text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-cream/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cream backdrop-blur-sm">
              <Award className="h-3 w-3 fill-current" /> QUALITY & CERTIFICATION
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-mint leading-tight">
              {lang === "de"
                ? "DGE-zertifizierte Menülinien für deine Einrichtung"
                : "DGE-Certified Menus for Your Institution"}
            </h2>
            <p className="text-cream/80 text-sm sm:text-base leading-relaxed">
              {lang === "de"
                ? "Biete deinen Schülern oder Heimbewohnern gesunde Vielfalt. Lass uns ein passendes, abwechslungsreiches Verpflegungskonzept für euer Budget erarbeiten."
                : "Offer healthy variety to your students or care residents. Let us build a compliant, balanced dining concept matching your budget."}
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => setB2bOpen(true)}
                className="rounded-full bg-mint px-6 py-3.5 text-sm font-semibold text-forest hover:bg-white transition cursor-pointer shadow-md flex items-center gap-2"
              >
                {lang === "de" ? "Programm anfragen" : "Daily Catering Subscriptions"}
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
            <img
              src="/images/institutional_catering_hero.png"
              alt="Institutional serving tray"
              className="rounded-2xl shadow-2xl aspect-[4/3] object-cover border-2 border-white/10"
            />
          </div>
        </div>
      </section>

      {/* Safety and nutrition standards */}
      <section className="bg-cream/10 py-16 md:py-24 border-t border-b border-[#eadfce]/30 text-left">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] order-last md:order-first">
              <img
                src="/images/office_catering_hero.png"
                alt="Clean organized catering server logistics"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest">
                {lang === "de" ? "HYGIENE & NÄHRSTOFFE" : "SAFETY & HEALTH"}
              </span>
              <h2 className="text-3xl font-display font-bold text-forest">
                {lang === "de"
                  ? "Höchste Standards bei Hygiene und Qualität"
                  : "Highest Hygiene and Quality Standards"}
              </h2>
              <p className="text-sm text-forest/70 leading-relaxed">
                {lang === "de"
                  ? "Unsere Partner-Caterer befolgen strikt die HACCP-Richtlinien und sind DGE-geschult, um eine gesunde und sichere Verpflegung zu gewährleisten."
                  : "Our partner caterers strictly comply with HACCP guidelines and are DGE-trained to guarantee secure and healthy meals."}
              </p>

              <ul className="space-y-3.5">
                {[
                  lang === "de"
                    ? "HACCP-konforme Warmhalte-Logistik bis zur Ausgabe"
                    : "HACCP-compliant temperature-controlled distribution logistics",
                  lang === "de"
                    ? "Transparente Allergenkennzeichnung und Nährwerttabellen"
                    : "Transparent allergen labeling and full nutritional sheets",
                  lang === "de"
                    ? "Regelmäßige mikrobiologische Qualitätskontrollen"
                    : "Regular microbiological quality controls",
                  lang === "de"
                    ? "Regionale Bio-Zutaten und Verzicht auf Zusatzstoffe"
                    : "Regional organic ingredients and zero artificial additives",
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
          </div>
        </div>
      </section>

      {/* Bottom CTA Block */}
      <section className="bg-cream/40 py-16 border-t border-[#eadfce]/30 text-center">
        <div className="mx-auto max-w-3xl px-4 space-y-6">
          <h2 className="text-3xl font-display font-bold text-forest">
            {lang === "de"
              ? "Sichere Versorgung für deine Institution."
              : "Secure Reliable Dining for Your Institution."}
          </h2>
          <p className="text-sm text-forest/75 max-w-lg mx-auto">
            {lang === "de"
              ? "Fordere jetzt ein unverbindliches Ernährungskonzept an oder finde passende Großcaterer auf unserem Marktplatz."
              : "Request a custom dining concept today or discover large-scale partner caterers on our marketplace."}
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
              {lang === "de" ? "Großcaterer entdecken" : "Discover Caterers"}
            </Link>
          </div>
        </div>
      </section>

      {/* Reusable B2b Dialog */}
      <B2bCateringDialog open={b2bOpen} onOpenChange={setB2bOpen} />
    </SiteShell>
  );
}
