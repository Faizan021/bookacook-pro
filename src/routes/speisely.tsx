import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { CheckCircle, MapPin, Euro, Users, Utensils, Calendar, ShoppingBag } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

const TODAY = new Date().toISOString().split("T")[0];

export const Route = createFileRoute("/speisely")({
  head: () => ({
    meta: [
      {
        title: "Was ist Speisely? Services, Regionen & Features | Speisely",
      },
      {
        name: "description",
        content:
          "Everything about Speisely: Instant orders for restaurants, catering marketplace, and event planning across Germany. No commission per order — fair, transparent pricing.",
      },
      { property: "og:title", content: "Was ist Speisely? Services & Facts" },
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
      title: t("Instant Orders — Sofortbestellungen", "Instant Orders"),
      subtitle: t("Für Restaurants", "For Restaurants"),
      points: [
        t("Digitaler Bestellkanal mit 0% Provision", "Digital ordering channel with 0% commission per order"),
        t("Pauschalabo ab €34,99/Monat", "Flat-rate subscription starting at €34.99/month"),

        t("Direktzahlung auf eigenes Stripe- oder PayPal-Konto", "Direct payouts to your own Stripe or PayPal account"),
        t("Eigene Kundendaten und Kontaktliste", "Full ownership of your customer data"),
        t("SEO-optimiertes digitales Schaufenster", "SEO-optimized digital storefront"),
      ],
    },
    {
      icon: <Utensils className="h-7 w-7" />,
      title: t("Catering-Marktplatz", "Catering Marketplace"),
      subtitle: t("Für Caterer", "For Caterers"),
      points: [
        t("Qualifizierte Catering-Anfragen aus ganz Deutschland", "Receive qualified catering requests from across Germany"),
        t("Kein Monatsabo – nur 10% Erfolgsgebühr bei Buchung", "No monthly subscription – only a 10% success fee on bookings"),
        t("Unterstützte Typen: Event-Catering, Firmenverpflegung, private Feiern", "Supports event catering, office lunches, and private parties"),
        t("Automatisierte Angebotserstellung und Kommunikation", "Automated proposal generation and client communication"),
        t("Dediziertes Caterer-Dashboard", "Dedicated dashboard to manage all catering requests"),
      ],
    },
    {
      icon: <Calendar className="h-7 w-7" />,
      title: t("Event-Planung", "Event Planning"),
      subtitle: t("Für Event-Profis", "For Event Professionals"),
      points: [
        t("CRM für die komplette Veranstaltungsverwaltung", "Complete CRM for event management"),
        t("Kunden stellen Event-Briefs mit Budget, Datum und Gästezahl", "Clients submit detailed event briefs (budget, date, guests)"),
        t("Event-Planer reichen maßgeschneiderte Angebote ein", "Submit tailored proposals directly to clients"),
        t("Budget-Tracking, Vendor-Koordination, Kunden-Management", "Manage vendors, track budgets, and communicate seamlessly"),
        t("Nur 10% Erfolgsgebühr bei bestätigter Buchung", "Only pay a 10% success fee when a booking is confirmed"),
      ],
    },
  ];

  const targetAudience = [
    { icon: <Users className="h-5 w-5" />, title: t("Restaurants", "Restaurants"), desc: t("Die einen direkten digitalen Bestellkanal ohne hohe Provisionszahlungen suchen.", "Seeking a direct digital ordering channel without high per-order commissions.") },
    { icon: <Utensils className="h-5 w-5" />, title: t("Caterer", "Caterers"), desc: t("Die qualifizierte B2B- und B2C-Catering-Anfragen aus ganz Deutschland erhalten möchten.", "Looking to receive qualified B2B and B2C catering requests nationwide.") },
    { icon: <Calendar className="h-5 w-5" />, title: t("Event-Planer", "Event Planners"), desc: t("Die Kunden für Firmenfeiern, Hochzeiten und private Veranstaltungen suchen.", "Searching for clients planning corporate events, weddings, and private functions.") },
    { icon: <ShoppingBag className="h-5 w-5" />, title: t("Unternehmen", "Companies"), desc: t("Die zuverlässiges Catering für Büros, Team-Events und Offsites benötigen.", "Requiring reliable catering for offices, team events, and offsites.") },
    { icon: <Users className="h-5 w-5" />, title: t("Privatpersonen", "Individuals"), desc: t("Die Catering für Geburtstage, Hochzeiten oder andere private Feiern suchen.", "Seeking catering for birthdays, weddings, or private celebrations.") },
    { icon: <MapPin className="h-5 w-5" />, title: t("Lokale Communities", "Local Communities"), desc: t("Die lokale Restaurants und Caterer in ihrer Region entdecken und unterstützen möchten.", "Wanting to discover and support local restaurants and caterers.") },
  ];

  return (
    <SiteShell>
      {/* Hero */}
      <section className="bg-forest py-20 text-center px-4">
        <div className="mx-auto max-w-4xl">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b28a3c] mb-4">
            {t("Plattform-Übersicht", "Platform Overview")}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
            {t("Was ist Speisely?", "What is Speisely?")}
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            {t(
              "Speisely ist eine digitale Catering- und Eventplanungs-Plattform, die Privatpersonen und Unternehmen hilft, schneller die passenden Event-Planer und Food-Partner (Caterer und Restaurants für Sofortbestellungen) zu finden. Anstatt viele verschiedene Anbieter mühsam zu vergleichen, können Kunden ihre Anforderungen (Eventtyp, Gästezahl, Budget) eingeben und erhalten passgenaue Optionen.",
              "Speisely is a digital catering and event planning platform that helps people and companies find suitable event planners and food partners (caterers and restaurants for instant orders) faster. Instead of searching across many disconnected providers, users can describe their needs and receive matching options based on event type, guest count, budget, and preferences."
            )}
          </p>
          <p className="mt-6 text-sm text-white/50">
            {t("Zuletzt aktualisiert:", "Last updated:")} {TODAY}
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-20">
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-forest text-center mb-12">
          {t("Unsere drei Kernbereiche", "Our Core Services")}
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
            {t("Wer nutzt Speisely?", "Who uses Speisely?")}
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
          {t("Servicegebiete", "Service Regions")}
        </h2>
        <p className="text-center text-forest/70 mb-10 max-w-2xl mx-auto">
          {t(
            "Speisely ist deutschlandweit aktiv. Partner-Restaurants, Caterer und Event-Planer sind in allen Bundesländern vertreten.",
            "Speisely operates nationwide. Our partner restaurants, caterers, and event planners are represented across all German states."
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

      {/* Pricing */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16">
        <h2 className="text-3xl font-display font-bold text-forest text-center mb-10">
          {t("Transparente Preisgestaltung", "Transparent Pricing")}
        </h2>
        <div className="grid gap-8 lg:grid-cols-2 max-w-4xl mx-auto">
          <div className="surface-card p-8">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-forest/50 mb-4">
              <ShoppingBag className="h-4 w-4" /> {t("Für Restaurants", "For Restaurants")}
            </div>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-4xl font-display font-bold text-forest">€34.99</span>

              <span className="text-forest/60 mb-1">{t("/Monat", "/month")}</span>
            </div>
            <div className="text-sm text-forest/70 mb-6">{t("Pauschalabo — keine Provision", "Flat-rate subscription — no per-order commission")}</div>
            <ul className="space-y-2">
              {[
                t("0% Provision auf alle Bestellungen", "0% commission on all orders"),
                t("Direktzahlung auf dein Konto", "Direct payouts to your account"),
                t("Eigene Kundendaten", "Full ownership of customer data"),
                t("SEO-optimiertes Schaufenster", "SEO-optimized digital storefront")
              ].map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-forest/75">
                  <CheckCircle className="h-4 w-4 text-forest shrink-0" /> {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="surface-card p-8">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-forest/50 mb-4">
              <Euro className="h-4 w-4" /> {t("Für Caterer & Event-Planer", "For Caterers & Event Planners")}
            </div>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-4xl font-display font-bold text-forest">10%</span>
            </div>
            <div className="text-sm text-forest/70 mb-6">{t("Erfolgsgebühr — nur bei bestätigter Buchung", "Success fee — only when a booking is confirmed")}</div>
            <ul className="space-y-2">
              {[
                t("Kein Monatsabo", "No monthly subscription fees"),
                t("Qualifizierte Anfragen", "Receive qualified catering & event requests"),
                t("Nur zahlen, wenn du buchst", "Only pay when you secure a booking"),
                t("Einfaches Dashboard", "Easy-to-use provider dashboard")
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
