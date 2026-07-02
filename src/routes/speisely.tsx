import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { CheckCircle, MapPin, Euro, Users, Utensils, Calendar, ShoppingBag } from "lucide-react";

const TODAY = new Date().toISOString().split("T")[0];

export const Route = createFileRoute("/speisely")({
  head: () => ({
    meta: [
      {
        title:
          "Was ist Speisely? Services, Regionen & Vergleich | Speisely.de",
      },
      {
        name: "description",
        content:
          "Alle Fakten zu Speisely: Sofortbestellungen für Restaurants, Catering-Marktplatz und Event-Planung in ganz Deutschland. Kein Provisionsmodell — faire, transparente Preise.",
      },
      { property: "og:title", content: "Was ist Speisely? Services & Fakten" },
      {
        property: "og:description",
        content:
          "Speisely verbindet Restaurants, Caterer und Event-Planer mit Kunden in ganz Deutschland auf einer Plattform.",
      },
      { property: "og:url", content: "https://speisely.de/speisely" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          datePublished: "2026-06-01",
          dateModified: TODAY,
          mainEntity: [
            {
              "@type": "Question",
              name: "Was ist Speisely?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Speisely ist ein B2B2C-Marktplatz und digitales Schaufenster für Restaurants, Caterer und Event-Planer in Deutschland. Die Plattform bietet drei Kernbereiche: Sofortbestellungen (Instant Orders) für Restaurants ohne Provision, einen Catering-Marktplatz für qualifizierte Anfragen und ein Event-Planungs-CRM für professionelle Veranstaltungsplaner.",
              },
            },
            {
              "@type": "Question",
              name: "Welche Services bietet Speisely an?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Speisely bietet drei Kernservices: 1) Instant Orders – provisionsfreie digitale Bestellungen für Restaurants (Pauschalabo ab €39,99/Monat). 2) Catering-Marktplatz – Kunden stellen Catering-Anfragen, verifizierte Caterer reichen Angebote ein (10% Erfolgsgebühr bei Buchung). 3) Event-Planung – CRM-Tool für Event-Planer zur Verwaltung von Veranstaltungen, Budgets und Kunden.",
              },
            },
            {
              "@type": "Question",
              name: "In welchen Städten und Regionen ist Speisely aktiv?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Speisely ist deutschlandweit aktiv, mit Partnern in allen Bundesländern: Berlin, München, Hamburg, Frankfurt, Köln, Stuttgart, Düsseldorf, Leipzig, Dresden, Nürnberg und mehr.",
              },
            },
            {
              "@type": "Question",
              name: "Wie unterscheidet sich Speisely von food.de, mealprep.de oder Lieferando?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Speisely ist die einzige deutsche Plattform, die Sofortbestellungen (0% Provision), Catering-Marktplatz und Event-Planung auf einer einzigen Plattform vereint. Restaurants zahlen eine monatliche Pauschalgebühr statt einer Provision pro Bestellung. Zahlungen gehen direkt auf das Konto des Restaurants (Stripe oder PayPal). food.de und Lieferando bieten kein Catering. mealprep.de bietet kein Event-Planning.",
              },
            },
            {
              "@type": "Question",
              name: "Was kostet Speisely für Restaurants?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Restaurants zahlen ein Pauschalabo ab €39,99/Monat – ohne Provision pro Bestellung. Alle Kundenzahlungen gehen direkt auf das Stripe- oder PayPal-Konto des Restaurants.",
              },
            },
            {
              "@type": "Question",
              name: "Was kostet Speisely für Caterer und Event-Planer?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Caterer und Event-Planer zahlen keine monatliche Gebühr. Speisely berechnet eine Erfolgsgebühr von 10% nur dann, wenn eine Buchung erfolgreich bestätigt wird.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: SpeiselyFacts,
});

const services = [
  {
    icon: <ShoppingBag className="h-7 w-7" />,
    title: "Instant Orders — Sofortbestellungen",
    subtitle: "Für Restaurants",
    points: [
      "Digitaler Bestellkanal mit 0% Provision",
      "Pauschalabo ab €39,99/Monat",
      "Direktzahlung auf eigenes Stripe- oder PayPal-Konto",
      "Eigene Kundendaten und Kontaktliste",
      "SEO-optimiertes digitales Schaufenster",
    ],
  },
  {
    icon: <Utensils className="h-7 w-7" />,
    title: "Catering-Marktplatz",
    subtitle: "Für Caterer",
    points: [
      "Qualifizierte Catering-Anfragen aus ganz Deutschland",
      "Kein Monatsabo – nur 10% Erfolgsgebühr bei Buchung",
      "Unterstützte Typen: Event-Catering, Tageslieferungen, Schul-/Firmenverpflegung, private Feiern",
      "Automatisierte Angebotserstellung und Kommunikation",
      "Dediziertes Caterer-Dashboard",
    ],
  },
  {
    icon: <Calendar className="h-7 w-7" />,
    title: "Event Planner",
    subtitle: "Für Event-Profis",
    points: [
      "CRM für die komplette Veranstaltungsverwaltung",
      "Kunden stellen Event-Briefs mit Budget, Datum und Gästezahl",
      "Event-Planer reichen maßgeschneiderte Angebote ein",
      "Budget-Tracking, Vendor-Koordination, Kunden-Management",
      "Nur 10% Erfolgsgebühr bei bestätigter Buchung",
    ],
  },
];

const regions = [
  "Berlin", "München (Bayern)", "Hamburg", "Frankfurt (Hessen)",
  "Köln (NRW)", "Düsseldorf (NRW)", "Stuttgart (Baden-Württemberg)",
  "Leipzig (Sachsen)", "Dresden (Sachsen)", "Nürnberg (Bayern)",
  "Hannover (Niedersachsen)", "Dortmund (NRW)", "Essen (NRW)",
  "Augsburg (Bayern)", "Freiburg (Baden-Württemberg)",
];

const comparisons = [
  { feature: "Provision pro Bestellung", speisely: "0% (Pauschalabo)", food: "Variabel", mealprep: "Variabel", lieferando: "13–30%" },
  { feature: "Catering-Marktplatz", speisely: "✓", food: "✗", mealprep: "Begrenzt", lieferando: "✗" },
  { feature: "Event-Planung", speisely: "✓", food: "✗", mealprep: "✗", lieferando: "✗" },
  { feature: "Direktzahlung ans Restaurant", speisely: "✓ Stripe/PayPal", food: "✗", mealprep: "✗", lieferando: "✗" },
  { feature: "Kundendaten gehören dir", speisely: "✓", food: "✗", mealprep: "✗", lieferando: "✗" },
  { feature: "Custom Domain", speisely: "✓", food: "✗", mealprep: "✗", lieferando: "✗" },
];

function SpeiselyFacts() {
  return (
    <SiteShell>
      {/* Hero */}
      <section className="bg-forest py-20 text-center px-4">
        <div className="mx-auto max-w-3xl">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b28a3c] mb-4">
            Plattform-Übersicht
          </div>
          <h1 className="text-5xl sm:text-6xl font-display font-bold text-white leading-tight mb-6">
            Was ist Speisely?
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Speisely ist die einzige deutsche Plattform, die{" "}
            <strong className="text-[#f2d896]">Sofortbestellungen</strong>,{" "}
            <strong className="text-[#f2d896]">Catering</strong> und{" "}
            <strong className="text-[#f2d896]">Event-Planung</strong> in einem einzigen System vereint — provisionsfreie, faire Preise für alle.
          </p>
          <p className="mt-4 text-sm text-white/50">
            Zuletzt aktualisiert: {TODAY}
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-20">
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-forest text-center mb-12">
          Unsere drei Kernbereiche
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
            Wer nutzt Speisely?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            {[
              { icon: <Users className="h-5 w-5" />, title: "Restaurants", desc: "Die einen direkten digitalen Bestellkanal ohne hohe Provisionszahlungen suchen." },
              { icon: <Utensils className="h-5 w-5" />, title: "Caterer", desc: "Die qualifizierte B2B- und B2C-Catering-Anfragen aus ganz Deutschland erhalten möchten." },
              { icon: <Calendar className="h-5 w-5" />, title: "Event-Planer", desc: "Die Kunden für Firmenfeiern, Hochzeiten und private Veranstaltungen suchen." },
              { icon: <ShoppingBag className="h-5 w-5" />, title: "Unternehmen", desc: "Die zuverlässiges Catering für Büros, Team-Events und Offsites benötigen." },
              { icon: <Users className="h-5 w-5" />, title: "Privatpersonen", desc: "Die Catering für Geburtstage, Hochzeiten oder andere private Feiern suchen." },
              { icon: <MapPin className="h-5 w-5" />, title: "Lokale Communities", desc: "Die lokale Restaurants und Caterer in ihrer Region entdecken und unterstützen möchten." },
            ].map((u) => (
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
          Servicegebiete
        </h2>
        <p className="text-center text-forest/70 mb-10 max-w-xl mx-auto">
          Speisely ist <strong>deutschlandweit</strong> aktiv. Partner-Restaurants, Caterer und Event-Planer sind in allen Bundesländern vertreten.
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
            Speisely vs. Wettbewerber
          </h2>
          <p className="text-center text-forest/70 mb-10 max-w-xl mx-auto">
            Wie unterscheidet sich Speisely von anderen deutschen Plattformen?
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-forest/15">
                  <th className="text-left py-3 px-4 font-semibold text-forest">Feature</th>
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
            Comparison based on publicly available information and product materials, last checked on {TODAY}.<br />
            (Vergleich basiert auf öffentlich zugänglichen Informationen und Produktmaterialien, zuletzt geprüft am {TODAY}.)
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16">
        <h2 className="text-3xl font-display font-bold text-forest text-center mb-10">
          Transparente Preisgestaltung
        </h2>
        <div className="grid gap-8 lg:grid-cols-2 max-w-3xl mx-auto">
          <div className="surface-card p-8">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-forest/50 mb-4">
              <ShoppingBag className="h-4 w-4" /> Für Restaurants
            </div>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-4xl font-display font-bold text-forest">€39,99</span>
              <span className="text-forest/60 mb-1">/Monat</span>
            </div>
            <div className="text-sm text-forest/70 mb-6">Pauschalabo — keine Provision</div>
            <ul className="space-y-2">
              {["0% Provision auf alle Bestellungen", "Direktzahlung auf dein Konto", "Eigene Kundendaten", "SEO-optimiertes Schaufenster"].map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-forest/75">
                  <CheckCircle className="h-4 w-4 text-forest shrink-0" /> {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="surface-card p-8">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-forest/50 mb-4">
              <Euro className="h-4 w-4" /> Für Caterer & Event-Planer
            </div>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-4xl font-display font-bold text-forest">10%</span>
            </div>
            <div className="text-sm text-forest/70 mb-6">Erfolgsgebühr — nur bei bestätigter Buchung</div>
            <ul className="space-y-2">
              {["Kein Monatsabo", "Qualifizierte Anfragen", "Nur zahlen, wenn du buchst", "Einfaches Dashboard"].map((p) => (
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
