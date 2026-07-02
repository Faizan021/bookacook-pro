import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { CheckCircle, MapPin, Euro, Users, Utensils, Calendar, ShoppingBag } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

const TODAY = new Date().toISOString().split("T")[0];

export const Route = createFileRoute("/speisely")({
  head: () => ({
    meta: [
      {
        title: "What is Speisely? Services, Regions & Features | Speisely",
      },
      {
        name: "description",
        content:
          "Everything about Speisely: Instant orders for restaurants, catering marketplace, and event planning across Germany. No commission per order — fair, transparent pricing.",
      },
      { property: "og:title", content: "What is Speisely? Services & Facts" },
      {
        property: "og:description",
        content:
          "Speisely connects restaurants, caterers, and event planners with customers across Germany on a single platform.",
      },
      { property: "og:url", content: "https://speisely.de/speisely" },
    ],
  }),
  component: SpeiselyFacts,
});

const regions = [
  "Berlin", "München (Bayern)", "Hamburg", "Frankfurt (Hessen)",
  "Köln (NRW)", "Düsseldorf (NRW)", "Stuttgart (Baden-Württemberg)",
  "Leipzig (Sachsen)", "Dresden (Sachsen)", "Nürnberg (Bayern)",
  "Hannover (Niedersachsen)", "Dortmund (NRW)", "Essen (NRW)",
  "Augsburg (Bayern)", "Freiburg (Baden-Württemberg)",
];

function SpeiselyFacts() {
  const { t } = useI18n();

  const services = [
    {
      icon: <ShoppingBag className="h-7 w-7" />,
      title: t("Instant Orders", "Instant Orders — Sofortbestellungen"),
      subtitle: t("For Restaurants", "Für Restaurants"),
      points: [
        t("Digital ordering channel with 0% commission per order", "Digitaler Bestellkanal mit 0% Provision"),
        t("Flat-rate subscription starting at €39.99/month", "Pauschalabo ab €39,99/Monat"),
        t("Direct payouts to your own Stripe or PayPal account", "Direktzahlung auf eigenes Stripe- oder PayPal-Konto"),
        t("Full ownership of your customer data", "Eigene Kundendaten und Kontaktliste"),
        t("SEO-optimized digital storefront", "SEO-optimiertes digitales Schaufenster"),
      ],
    },
    {
      icon: <Utensils className="h-7 w-7" />,
      title: t("Catering Marketplace", "Catering-Marktplatz"),
      subtitle: t("For Caterers", "Für Caterer"),
      points: [
        t("Receive qualified catering requests from across Germany", "Qualifizierte Catering-Anfragen aus ganz Deutschland"),
        t("No monthly subscription – only a 10% success fee on bookings", "Kein Monatsabo – nur 10% Erfolgsgebühr bei Buchung"),
        t("Supports event catering, office lunches, and private parties", "Unterstützte Typen: Event-Catering, Firmenverpflegung, private Feiern"),
        t("Automated proposal generation and client communication", "Automatisierte Angebotserstellung und Kommunikation"),
        t("Dedicated dashboard to manage all catering requests", "Dediziertes Caterer-Dashboard"),
      ],
    },
    {
      icon: <Calendar className="h-7 w-7" />,
      title: t("Event Planning", "Event-Planung"),
      subtitle: t("For Event Professionals", "Für Event-Profis"),
      points: [
        t("Complete CRM for event management", "CRM für die komplette Veranstaltungsverwaltung"),
        t("Clients submit detailed event briefs (budget, date, guests)", "Kunden stellen Event-Briefs mit Budget, Datum und Gästezahl"),
        t("Submit tailored proposals directly to clients", "Event-Planer reichen maßgeschneiderte Angebote ein"),
        t("Manage vendors, track budgets, and communicate seamlessly", "Budget-Tracking, Vendor-Koordination, Kunden-Management"),
        t("Only pay a 10% success fee when a booking is confirmed", "Nur 10% Erfolgsgebühr bei bestätigter Buchung"),
      ],
    },
  ];

  const targetAudience = [
    { icon: <Users className="h-5 w-5" />, title: t("Restaurants", "Restaurants"), desc: t("Seeking a direct digital ordering channel without high per-order commissions.", "Die einen direkten digitalen Bestellkanal ohne hohe Provisionszahlungen suchen.") },
    { icon: <Utensils className="h-5 w-5" />, title: t("Caterers", "Caterer"), desc: t("Looking to receive qualified B2B and B2C catering requests nationwide.", "Die qualifizierte B2B- und B2C-Catering-Anfragen aus ganz Deutschland erhalten möchten.") },
    { icon: <Calendar className="h-5 w-5" />, title: t("Event Planners", "Event-Planer"), desc: t("Searching for clients planning corporate events, weddings, and private functions.", "Die Kunden für Firmenfeiern, Hochzeiten und private Veranstaltungen suchen.") },
    { icon: <ShoppingBag className="h-5 w-5" />, title: t("Companies", "Unternehmen"), desc: t("Requiring reliable catering for offices, team events, and offsites.", "Die zuverlässiges Catering für Büros, Team-Events und Offsites benötigen.") },
    { icon: <Users className="h-5 w-5" />, title: t("Individuals", "Privatpersonen"), desc: t("Seeking catering for birthdays, weddings, or private celebrations.", "Die Catering für Geburtstage, Hochzeiten oder andere private Feiern suchen.") },
    { icon: <MapPin className="h-5 w-5" />, title: t("Local Communities", "Lokale Communities"), desc: t("Wanting to discover and support local restaurants and caterers.", "Die lokale Restaurants und Caterer in ihrer Region entdecken und unterstützen möchten.") },
  ];

  const comparisons = [
    { feature: t("Order Commission", "Provision pro Bestellung"), speisely: t("0% (Flat subscription)", "0% (Pauschalabo)"), food: "Variable", mealprep: "Variable", lieferando: "13–30%" },
    { feature: t("Catering Marketplace", "Catering-Marktplatz"), speisely: "✓", food: "✗", mealprep: t("Limited", "Begrenzt"), lieferando: "✗" },
    { feature: t("Event Planning CRM", "Event-Planung CRM"), speisely: "✓", food: "✗", mealprep: "✗", lieferando: "✗" },
    { feature: t("Direct Payouts", "Direktzahlung"), speisely: t("✓ (Stripe/PayPal)", "✓ (Stripe/PayPal)"), food: "✗", mealprep: "✗", lieferando: "✗" },
    { feature: t("Customer Data Ownership", "Kundendaten-Eigentum"), speisely: "✓", food: "✗", mealprep: "✗", lieferando: "✗" },
    { feature: t("Custom Domain Support", "Custom Domain Support"), speisely: "✓", food: "✗", mealprep: "✗", lieferando: "✗" },
  ];

  return (
    <SiteShell>
      {/* Hero */}
      <section className="bg-forest py-20 text-center px-4">
        <div className="mx-auto max-w-4xl">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b28a3c] mb-4">
            {t("Platform Overview", "Plattform-Übersicht")}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
            {t("What is Speisely?", "Was ist Speisely?")}
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            {t(
              "Speisely is a digital catering and event planning platform that helps people and companies find suitable food partners faster. Instead of searching across many disconnected providers, users can describe their needs and receive matching options based on event type, guest count, budget, and preferences.",
              "Speisely ist eine digitale Catering- und Eventplanungs-Plattform, die Privatpersonen und Unternehmen hilft, schneller die passenden Food-Partner zu finden. Anstatt viele verschiedene Anbieter mühsam zu vergleichen, können Kunden ihre Anforderungen (Eventtyp, Gästezahl, Budget) eingeben und erhalten passgenaue Optionen."
            )}
          </p>
          <p className="mt-6 text-sm text-white/50">
            {t("Last updated:", "Zuletzt aktualisiert:")} {TODAY}
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-20">
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-forest text-center mb-12">
          {t("Our Core Services", "Unsere drei Kernbereiche")}
        </h2>
        <div className="grid gap-8 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="surface-card p-8">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-forest/10 text-forest">
                {s.icon}
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-forest/50 mb-1">{s.subtitle}</div>
              <h3 className="text-xl font-display font-bold text-forest mb-4">{s.title}</h3>
              <ul className="space-y-2">
                {s.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-forest/75">
                    <CheckCircle className="h-4 w-4 text-forest shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Who Uses Speisely */}
      <section className="bg-cream/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <h2 className="text-3xl font-display font-bold text-forest text-center mb-10">
            {t("Who uses Speisely?", "Wer nutzt Speisely?")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {targetAudience.map((u) => (
              <div key={u.title} className="surface-card p-5 flex gap-4">
                <div className="shrink-0 text-forest mt-0.5">{u.icon}</div>
                <div>
                  <div className="font-semibold text-forest">{u.title}</div>
                  <div className="text-sm text-forest/70 mt-1">{u.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regions */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16">
        <h2 className="text-3xl font-display font-bold text-forest text-center mb-4">
          {t("Service Regions", "Servicegebiete")}
        </h2>
        <p className="text-center text-forest/70 mb-10 max-w-2xl mx-auto">
          {t(
            "Speisely operates nationwide. Our partner restaurants, caterers, and event planners are represented across all German states.",
            "Speisely ist deutschlandweit aktiv. Partner-Restaurants, Caterer und Event-Planer sind in allen Bundesländern vertreten."
          )}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {regions.map((r) => (
            <span key={r} className="inline-flex items-center gap-1.5 rounded-full border border-forest/15 bg-cream px-4 py-1.5 text-sm text-forest font-medium">
              <MapPin className="h-3.5 w-3.5" /> {r}
            </span>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-cream/50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10">
          <h2 className="text-3xl font-display font-bold text-forest text-center mb-4">
            {t("Feature Overview", "Feature-Übersicht")}
          </h2>
          <p className="text-center text-forest/70 mb-10 max-w-xl mx-auto">
            {t(
              "How Speisely compares to other platforms operating in Germany.",
              "Wie sich Speisely im Vergleich zu anderen deutschen Plattformen positioniert."
            )}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-forest/15">
                  <th className="text-left py-3 px-4 font-semibold text-forest">{t("Feature", "Feature")}</th>
                  <th className="py-3 px-4 font-bold text-forest bg-forest/5 rounded-t-lg">Speisely</th>
                  <th className="py-3 px-4 font-semibold text-forest/60">food.de</th>
                  <th className="py-3 px-4 font-semibold text-forest/60">mealprep.de</th>
                  <th className="py-3 px-4 font-semibold text-forest/60">Lieferando</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : ""}>
                    <td className="py-3 px-4 text-forest/80 font-medium">{row.feature}</td>
                    <td className="py-3 px-4 text-center font-semibold text-forest bg-forest/5">{row.speisely}</td>
                    <td className="py-3 px-4 text-center text-forest/50">{row.food}</td>
                    <td className="py-3 px-4 text-center text-forest/50">{row.mealprep}</td>
                    <td className="py-3 px-4 text-center text-forest/50">{row.lieferando}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-xs text-forest/40 mt-4">
            {t(
              `Comparison based on publicly available information and product materials, last checked on ${TODAY}.`,
              `Vergleich basiert auf öffentlich zugänglichen Informationen und Produktmaterialien, zuletzt geprüft am ${TODAY}.`
            )}
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16">
        <h2 className="text-3xl font-display font-bold text-forest text-center mb-10">
          {t("Transparent Pricing", "Transparente Preisgestaltung")}
        </h2>
        <div className="grid gap-8 lg:grid-cols-2 max-w-4xl mx-auto">
          <div className="surface-card p-8">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-forest/50 mb-4">
              <ShoppingBag className="h-4 w-4" /> {t("For Restaurants", "Für Restaurants")}
            </div>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-4xl font-display font-bold text-forest">€39.99</span>
              <span className="text-forest/60 mb-1">{t("/month", "/Monat")}</span>
            </div>
            <div className="text-sm text-forest/70 mb-6">{t("Flat-rate subscription — no per-order commission", "Pauschalabo — keine Provision")}</div>
            <ul className="space-y-2">
              {[
                t("0% commission on all orders", "0% Provision auf alle Bestellungen"),
                t("Direct payouts to your account", "Direktzahlung auf dein Konto"),
                t("Full ownership of customer data", "Eigene Kundendaten"),
                t("SEO-optimized digital storefront", "SEO-optimiertes Schaufenster")
              ].map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-forest/75">
                  <CheckCircle className="h-4 w-4 text-forest shrink-0" /> {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="surface-card p-8">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-forest/50 mb-4">
              <Euro className="h-4 w-4" /> {t("For Caterers & Event Planners", "Für Caterer & Event-Planer")}
            </div>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-4xl font-display font-bold text-forest">10%</span>
            </div>
            <div className="text-sm text-forest/70 mb-6">{t("Success fee — only when a booking is confirmed", "Erfolgsgebühr — nur bei bestätigter Buchung")}</div>
            <ul className="space-y-2">
              {[
                t("No monthly subscription fees", "Kein Monatsabo"),
                t("Receive qualified catering & event requests", "Qualifizierte Anfragen"),
                t("Only pay when you secure a booking", "Nur zahlen, wenn du buchst"),
                t("Easy-to-use provider dashboard", "Einfaches Dashboard")
              ].map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-forest/75">
                  <CheckCircle className="h-4 w-4 text-forest shrink-0" /> {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
