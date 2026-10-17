import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/PageHero";
import { useI18n } from "@/i18n/I18nProvider";
import { ShieldCheck, FileText, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/nutzungsbedingungen")({
  head: () => ({
    meta: [
      { title: "Nutzungsbedingungen & Rechtliche Hinweise — Speisely" },
      {
        name: "description",
        content:
          "Allgemeine Nutzungsbedingungen, Plattformhinweise und rechtliche Rahmenbedingungen für die Nutzung des Speisely Marktplatzes und Magazins.",
      },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://speisely.de/nutzungsbedingungen" }],
  }),
  component: NutzungsbedingungenPage,
});

function NutzungsbedingungenPage() {
  const { lang } = useI18n();
  const isDe = lang === "de";

  return (
    <SiteShell>
      <PageHero
        eyebrow={isDe ? "Rechtliche Hinweise" : "Legal Terms"}
        heading={isDe ? "Nutzungsbedingungen" : "Terms of Service"}
        subtext={
          isDe
            ? "Transparente Grundsätze für die Nutzung der Speisely Plattform, unserer redaktionellen Food-Guides und der Vermittlungsdienste."
            : "Transparent principles governing your use of the Speisely platform, editorial food guides, and partner services."
        }
      />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="surface-card rounded-3xl p-8 sm:p-12 border border-forest/10 space-y-8 text-forest/85 leading-relaxed text-sm sm:text-base">
          <div className="flex items-center gap-2 text-xs font-mono text-forest/50 uppercase tracking-wider pb-4 border-b border-forest/10">
            <FileText className="w-4 h-4 text-[#E6B84A]" />
            <span>
              {isDe ? "Stand: Oktober 2026 · Version 1.1" : "As of: October 2026 · Version 1.1"}
            </span>
          </div>

          <section className="space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-forest">
              1. Geltungsbereich &amp; Plattformzweck
            </h2>
            <p>
              Diese Nutzungsbedingungen gelten für den Besuch und die Inanspruchnahme der Dienste
              von <strong>Speisely</strong> (nachfolgend „Plattform“), erreichbar über speisely.de.
            </p>
            <p>
              Speisely fungiert als kuratierte Plattform für kulinarische Entdeckungen,
              Event-Catering, Planungs-Dienstleistungen sowie als technischer Vermittler für
              Direktbestellungen und Tischreservierungen zwischen Gästen („Nutzern“) und
              teilnehmenden Gastronomen, Caterern und Planern („Partnern“).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-forest">
              2. Vermittlungsmodell &amp; 0 % Provision auf Direktbestellungen
            </h2>
            <p>Speisely verfolgt einen transparenten, partnerschaftlichen Ansatz:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Direktbestellungen:</strong> Speisely erhebt auf reine Direktbestellungen
                über teilnehmende Partner-Websites <strong>0 % Transaktionsprovision</strong>. Die
                Zahlungsabwicklung erfolgt direkt über zugelassene Payment-Dienstleister (z.B.
                Stripe Connect) direkt an den Partner.
              </li>
              <li>
                <strong>Vertragsschluss:</strong> Verträge über die Lieferung oder Bereitstellung
                von Speisen, Getränken oder Catering-Leistungen kommen ausschließlich unmittelbar
                zwischen dem Nutzer und dem jeweiligen Gastronomie- bzw. Catering-Betrieb zustande.
              </li>
              <li>
                <strong>B2B-Catering &amp; Event-Planung:</strong> Für vermittelte Großaufträge und
                Catering-Arrangements gelten die in den jeweiligen Angeboten gesondert ausgewiesenen
                Konditionen und Stornierungsbedingungen der ausführenden Betriebe.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-forest">
              3. Redaktioneller Grundsatz &amp; Speisely Visits
            </h2>
            <p>
              Speisely legt höchsten Wert auf Glaubwürdigkeit und saubere Trennung redaktioneller
              Inhalte:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Speisely Visits:</strong> Alle unter dieser Kategorie veröffentlichten
                Restaurantbesuche sind{" "}
                <strong>zu 100 % unabhängig besucht und selbst bezahlt</strong>. Es bestehen zum
                Besuchszeitpunkt keinerlei Kooperationsverträge oder Honorarvereinbarungen.
              </li>
              <li>
                <strong>Community Stories:</strong> Von Lesern und Foodies eingereichte Berichte
                werden redaktionell kuratiert und mit entsprechenden Hinweisen („Selbst bezahlt“,
                „Eingeladen“ oder „Gesponsert“) offengelegt.
              </li>
              <li>
                <strong>Partner Stories:</strong> Zusammenarbeit und Kooperationen mit gelisteten
                Partnern werden eindeutig als solche deklariert.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-forest">
              4. Gewährleistung &amp; Haftungsbegrenzung
            </h2>
            <p>
              Speisely haftet für eigene Inhalte nach den allgemeinen gesetzlichen Bestimmungen
              gemäß § 7 Abs. 1 DDG / TMG. Für Angaben zu Allergenen, Zutaten, Öffnungszeiten,
              Preisen sowie die Qualität der zubereiteten Speisen sind ausschließlich die jeweiligen
              Restaurant- und Catering-Inhaber verantwortlich.
            </p>
            <p>
              Eine Haftung für leichte Fahrlässigkeit wird ausgeschlossen, sofern keine wesentlichen
              Vertragspflichten (Kardinalpflichten), Schäden aus der Verletzung des Lebens, des
              Körpers oder der Gesundheit betroffen sind.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-forest">
              5. Geistiges Eigentum &amp; Urheberrechte
            </h2>
            <p>
              Die auf Speisely veröffentlichten redaktionellen Texte, Fotografien, Logos und
              Designsysteme sind urheberrechtlich geschützt. Jede unbefugte Verwertung,
              Vervielfältigung oder automatisierte Vervielfältigung (Scraping) zu kommerziellen
              Zwecken ohne schriftliche Zustimmung ist untersagt.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-forest">
              6. Anwendbares Recht &amp; Gerichtsstand
            </h2>
            <p>
              Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts
              (CISG). Verbraucher mit Wohnsitz in der EU behalten den Schutz der zwingenden
              Bestimmungen ihres Aufenthaltsstaates.
            </p>
          </section>

          <div className="pt-6 border-t border-forest/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-4 text-xs font-semibold">
              <Link to="/impressum" className="text-forest hover:text-[#E6B84A] transition">
                Impressum
              </Link>
              <Link to="/datenschutz" className="text-forest hover:text-[#E6B84A] transition">
                Datenschutz
              </Link>
              <Link to="/contact" className="text-forest hover:text-[#E6B84A] transition">
                Kontakt
              </Link>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-forest hover:text-[#E6B84A] transition"
            >
              <span>Zurück zur Startseite</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
