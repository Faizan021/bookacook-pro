import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/i18n/I18nProvider";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [{ title: "Impressum & Legal — Speisely" }],
  }),
  component: Impressum,
});

function Impressum() {
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);

  return (
    <SiteShell>
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <h1 className="text-4xl sm:text-5xl font-display text-forest mb-8">
          {tt("Impressum & Rechtliches", "Imprint & Legal")}
        </h1>

        <div className="prose prose-forest max-w-none text-forest/80 space-y-6">
          <p>
            {tt(
              "Diese Seite enthält vorläufige Anbieterinformationen für das Speisely-Projekt. Speisely befindet sich derzeit in einer frühen Projektphase. Vollständige rechtliche Informationen werden hinzugefügt, sobald die organisatorische und rechtliche Struktur finalisiert ist.",
              "This page contains preliminary provider information for the Speisely project. Speisely is currently in an early project phase. Full legal information will be added once the organizational and legal structure is finalized.",
            )}
          </p>
          <div className="rounded-xl bg-cream p-5 text-sm ring-1 ring-[#eadfce]">
            <p className="font-semibold text-forest">
              {tt(
                "Hinweis: Diese rechtlichen Hinweise sind vorläufig und stellen keine Rechtsberatung dar. Für geschäftliche, rechtliche oder datenschutzrechtliche Anfragen kontaktieren Sie uns bitte unter info@speisely.de.",
                "Note: This legal notice is preliminary and does not constitute legal advice. For business, legal, or data protection inquiries, please contact us at info@speisely.de.",
              )}
            </p>
          </div>

          <h2 className="text-2xl font-display text-forest mt-8 mb-4">
            {tt("Projektdetails", "Project details")}
          </h2>
          <p>
            {tt(
              "Speisely ist ein frühes digitales Produktprojekt im Bereich Food-Ordering, Catering und Eventplanung. Ziel ist es, Restaurants, Caterer und Eventplaner mit einem kuratierten Marktplatz zu unterstützen.",
              "Speisely is an early digital product project in the field of food ordering, catering, and event planning. Its goal is to support restaurants, caterers, and event planners with a curated marketplace.",
            )}
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4">
            <li>
              <strong>{tt("Projektname:", "Project name:")}</strong> Speisely
            </li>
            <li>
              <strong>{tt("Webseite:", "Website:")}</strong>{" "}
              <a href="https://speisely.de" className="text-[#b28a3c] hover:underline">
                https://speisely.de
              </a>
            </li>
            <li>
              <strong>{tt("Kontakt:", "Contact:")}</strong>{" "}
              <a href="mailto:info@speisely.de" className="text-[#b28a3c] hover:underline">
                info@speisely.de
              </a>
            </li>
          </ul>

          <h2 className="text-2xl font-display text-forest mt-8 mb-4">
            {tt("Anbieterinformationen", "Provider information")}
          </h2>
          <p>
            {tt(
              "Speisely wird derzeit als frühes Startup- und Produktprojekt entwickelt. Eine endgültige rechtliche Struktur, Handelsregistereintragung oder vollständige Anbieterstruktur wurde noch nicht veröffentlicht.",
              "Speisely is currently being developed as an early-stage startup and product project. A final legal structure, commercial register entry, or complete provider structure has not yet been published.",
            )}
          </p>
          <p>
            {tt(
              "Sobald die Betreiberstruktur finalisiert ist, werden die vollständigen gesetzlich vorgeschriebenen Informationen auf dieser Seite hinzugefügt.",
              "Once the operator structure is finalized, the complete legally required information will be added to this page.",
            )}
          </p>

          <h2 className="text-2xl font-display text-forest mt-8 mb-4">
            {tt("Kontakt", "Contact")}
          </h2>
          <p>
            {tt(
              "Für allgemeine Anfragen, Interesse an Pilotprojekten, Partnerschaften, Datenschutzfragen oder rechtliche Informationen erreichen Sie Speisely derzeit per E-Mail:",
              "For general inquiries, pilot interest, partnerships, data protection issues or legal information, you can currently reach Speisely by email:",
            )}
            <br />
            <a
              href="mailto:info@speisely.de"
              className="font-semibold text-[#b28a3c] hover:underline"
            >
              info@speisely.de
            </a>
          </p>

          <h2 className="text-2xl font-display text-forest mt-8 mb-4">
            {tt("Verantwortlich für den Inhalt", "Responsible for content")}
          </h2>
          <p>
            {tt(
              "Das Speisely-Projektteam ist verantwortlich für den Inhalt dieser Webseite. Vollständige Informationen bezüglich der verantwortlichen Person oder juristischen Person werden hinzugefügt, sobald die rechtliche Betreiberstruktur finalisiert ist.",
              "The Speisely project team is responsible for the content of this website. Complete information regarding the responsible person or legal entity will be added once the legal operator structure is finalized.",
            )}
          </p>

          <h2 className="text-2xl font-display text-forest mt-8 mb-4">
            {tt("Haftung für Inhalte", "Liability for content")}
          </h2>
          <p>
            {tt(
              "Die Inhalte dieser Webseite wurden mit Sorgfalt erstellt. Speisely übernimmt jedoch keine Gewähr für die Richtigkeit, Vollständigkeit und Aktualität der bereitgestellten Informationen. Inhalte können sich im Rahmen der Produktentwicklung ändern.",
              "The content of this website has been created with care. However, Speisely assumes no liability for the accuracy, completeness, and timeliness of the information provided. Content may change as part of product development.",
            )}
          </p>

          <h2 className="text-2xl font-display text-forest mt-8 mb-4">
            {tt("Haftung für Links", "Liability for external links")}
          </h2>
          <p>
            {tt(
              "Diese Webseite kann Links zu externen Webseiten enthalten. Wir haben keinen Einfluss auf den Inhalt externer Seiten. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.",
              "This website may contain links to external websites. We have no control over the content of external sites. The operators of the linked sites are solely responsible for their content.",
            )}
          </p>

          <h2 className="text-2xl font-display text-forest mt-8 mb-4">
            {tt("Urheberrecht", "Copyright")}
          </h2>
          <p>
            {tt(
              "Die auf dieser Webseite veröffentlichten Inhalte, Texte, Designs und Grafiken sind urheberrechtlich geschützt. Jede Nutzung, Vervielfältigung oder Weiterverarbeitung ist nur mit vorheriger Zustimmung oder im Rahmen der gesetzlich zulässigen Nutzung gestattet.",
              "The content, texts, designs, and graphics published on this website are protected by copyright. Use, reproduction, or further processing is only permitted with prior consent or within the scope of legally permissible use.",
            )}
          </p>

          <h2 className="text-2xl font-display text-forest mt-8 mb-4">
            {tt("Streitschlichtung", "Dispute resolution")}
          </h2>
          <p>
            {tt(
              "Speisely ist derzeit kein registrierter Anbieter mit einer finalen Betriebsstruktur. Informationen zur Streitschlichtung oder zuständigen Behörden werden hinzugefügt, sobald sie gesetzlich vorgeschrieben sind.",
              "Speisely is currently not a registered provider with a final operating structure. Information regarding dispute resolution or competent authorities will be added if and when legally required.",
            )}
          </p>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-[#eadfce] pt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#b28a3c] text-[#16372f] px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {tt("Zur Startseite", "Go to homepage")} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/impressum"
            className="inline-flex items-center gap-2 rounded-full bg-cream text-forest px-6 py-3 text-sm font-medium hover:bg-[#eadfce] transition-colors"
          >
            {tt("Datenschutzerklärung ansehen", "View privacy policy")}
          </Link>
        </div>
      </main>
    </SiteShell>
  );
}
