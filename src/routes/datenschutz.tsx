import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/i18n/I18nProvider";
import {
  ShieldAlert,
  ArrowRight,
  Lock,
  Eye,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { getConsent, setConsent } from "@/lib/consent/consent";
import posthog from "posthog-js";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutzerklärung (Technischer Entwurf) — Speisely" },
      {
        name: "description",
        content:
          "Technische Datenschutzdokumentation der Speisely-Plattform. Übersicht über implementierte Drittanbieter, Datenverarbeitung und Einwilligungs-Widerruf.",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Datenschutzerklärung — Speisely" },
      { property: "og:url", content: "https://speisely.de/datenschutz" },
    ],
    links: [{ rel: "canonical", href: "https://speisely.de/datenschutz" }],
  }),
  component: Datenschutz,
});

function Datenschutz() {
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);

  const [consentState, setConsentState] = useState<string | null>(null);
  const [revokedMessage, setRevokedMessage] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const record = getConsent();
      setConsentState(record ? record.consent : "not_set");
    }
  }, []);

  const handleWithdrawConsent = () => {
    if (typeof window === "undefined") return;

    // 1. Opt out from PostHog
    try {
      posthog.opt_out_capturing();
      posthog.stopSessionRecording();
    } catch (e) {
      void e;
    }

    // 2. Set structured consent to declined and clear all analytics storage
    setConsent("declined");
    setConsentState("declined");
    setRevokedMessage(true);

    // Optional page reload to completely flush memory of loaded third-party SDKs
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <SiteShell>
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Header */}
        <div className="mb-12 border-b border-forest/10 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#faedd8] text-[#8c6b2d] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider mb-4 border border-[#ecd2a9]">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>
              {tt(
                "Technischer Entwurf — Juristische Prüfung ausstehend",
                "Technical Draft — Legal Review Pending",
              )}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-forest tracking-tight">
            {tt("Datenschutzerklärung", "Privacy Policy")}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-forest/75 leading-relaxed">
            {tt(
              "Stand: 26. August 2026. Technische Dokumentation der auf der Plattform Speisely implementierten Datenverarbeitungsprozesse, Drittanbieter und Speicherstrukturen.",
              "Last updated: August 26, 2026. Technical documentation of implemented data processing, third-party providers, and storage on the Speisely platform.",
            )}
          </p>

          {/* Legal Status Callout */}
          <div className="mt-6 rounded-2xl bg-cream/90 p-5 border border-forest/15 text-xs text-forest/80 space-y-1.5 leading-relaxed">
            <strong className="font-bold text-forest block flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-[#b28a3c]" />
              {tt("Hinweis zum Rechtsstatus", "Legal Status Notice")}
            </strong>
            <p>
              {tt(
                "Dieser Text dokumentiert den tatsächlichen technischen Implementierungsstand für Entwickler, Prüfer und Nutzer. Er stellt keine Rechtsberatung dar und ersetzt nicht die abschließende juristische Prüfung durch einen Fachanwalt für IT- und Datenschutzrecht vor Aufnahme des uneingeschränkten kommerziellen Regelbetriebs.",
                "This document reflects the actual technical implementation status. It does not constitute legal advice and requires formal legal review by qualified data protection counsel prior to full commercial operations.",
              )}
            </p>
          </div>
        </div>

        <div className="prose prose-forest max-w-none text-forest/85 space-y-10 leading-relaxed font-normal">
          {/* Interactive Consent Management Box */}
          <section className="surface-card p-6 rounded-3xl border-2 border-forest/15 shadow-sm bg-white">
            <h2 className="text-xl font-display font-bold text-forest mb-3 flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-[#b28a3c]" />
              <span>{tt("Einwilligungs-Status & Widerruf", "Consent Status & Revocation")}</span>
            </h2>
            <p className="text-sm text-forest/80 mb-4">
              {tt(
                "Hier können Sie Ihren aktuellen Cookie- und Analyse-Einwilligungsstatus einsehen und eine erteilte Einwilligung mit sofortiger Wirkung widerrufen.",
                "View your current analytics consent status and revoke previously granted consent at any time.",
              )}
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-cream/70 border border-forest/10">
              <div>
                <span className="text-xs font-semibold text-forest/60 uppercase tracking-wider block">
                  {tt("Aktueller Status", "Current Status")}
                </span>
                <span className="text-sm font-bold text-forest">
                  {consentState === "accepted"
                    ? tt("✓ Erweiterte Analyse akzeptiert", "✓ Analytics Accepted")
                    : consentState === "declined"
                      ? tt("✕ Analyse abgelehnt / widerrufen", "✕ Analytics Declined / Withdrawn")
                      : tt(
                          "○ Keine Entscheidung getroffen (Standard: blockiert)",
                          "○ No Choice Made (Default: Blocked)",
                        )}
                </span>
              </div>

              {consentState === "accepted" && (
                <button
                  type="button"
                  onClick={handleWithdrawConsent}
                  className="rounded-full bg-forest text-white px-5 py-2.5 text-xs font-semibold hover:bg-forest/90 transition shadow-sm cursor-pointer shrink-0"
                >
                  {tt("Einwilligung widerrufen", "Withdraw Consent")}
                </button>
              )}
            </div>

            {revokedMessage && (
              <div className="mt-3 p-3 rounded-xl bg-green-50 border border-green-200 text-xs text-green-800 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />
                <span>
                  {tt(
                    "Einwilligung erfolgreich widerrufen. Seite wird aktualisiert...",
                    "Consent revoked. Refreshing page context...",
                  )}
                </span>
              </div>
            )}
          </section>

          {/* 1. Verantwortliche Stelle */}
          <section>
            <h2 className="text-2xl font-display font-bold text-forest mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-[#b28a3c]" />
              <span>{tt("1. Verantwortliche Stelle", "1. Responsible Controller")}</span>
            </h2>
            <p>
              {tt(
                "Verantwortlich für die Datenverarbeitung auf dieser Webseite im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:",
                "The controller responsible for data processing on this website within the meaning of the General Data Protection Regulation (GDPR) is:",
              )}
            </p>
            <div className="surface-card p-5 rounded-2xl border border-forest/10 my-4 text-sm">
              <strong className="font-bold text-forest block">Speisely</strong>
              <span className="block text-forest/80">Projektteam Speisely</span>
              <span className="block text-forest/80">
                E-Mail:{" "}
                <a
                  href="mailto:info@speisely.de"
                  className="text-[#b28a3c] font-semibold underline"
                >
                  info@speisely.de
                </a>
              </span>
              <span className="block text-forest/80">Webseite: https://speisely.de</span>
            </div>
            <p className="text-xs text-forest/60 italic">
              {tt(
                "Hinweis: Speisely befindet sich in einer Vorbereitungsphase. Die Benennung der finalen Trägergesellschaft erfolgt vor dem kommerziellen Produktivstart.",
                "Note: Speisely is in a pre-launch phase. Corporate incorporation details will be published prior to commercial rollout.",
              )}
            </p>
          </section>

          {/* 2. Grundsätze */}
          <section>
            <h2 className="text-2xl font-display font-bold text-forest mb-4">
              {tt(
                "2. Zwecke und Rechtsgrundlagen der Verarbeitung",
                "2. Purposes & Legal Bases of Processing",
              )}
            </h2>
            <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
              <li>
                <strong>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung):</strong>{" "}
                {tt(
                  "Für optionale Web-Analyse (PostHog, Ahrefs).",
                  "For optional analytics telemetry (PostHog, Ahrefs).",
                )}
              </li>
              <li>
                <strong>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung):</strong>{" "}
                {tt(
                  "Für die technische Abwicklung von Bestellungen, Catering-Anfragen und Partner-Accounts.",
                  "For processing orders, catering briefs, and partner accounts.",
                )}
              </li>
              <li>
                <strong>Art. 6 Abs. 1 lit. f DSGVO (Berechtigtes Interesse):</strong>{" "}
                {tt(
                  "Für IT-Sicherheit, CDN-Auslieferung und funktionale Fehlerüberwachung (Sentry mit PII-Filterung).",
                  "For security, CDN routing, and error monitoring (Sentry with PII stripping).",
                )}
              </li>
            </ul>
          </section>

          {/* 3. Hosting & Bereitstellung */}
          <section>
            <h2 className="text-2xl font-display font-bold text-forest mb-4">
              {tt("3. Hosting, Infrastruktur & Datenbank", "3. Hosting, Infrastructure & Database")}
            </h2>
            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-2xl bg-cream/70 border border-forest/10">
                <h3 className="font-bold text-forest text-base mb-1">
                  Vercel Inc. (Hosting, CDN & Serverless)
                </h3>
                <p className="text-forest/80">
                  {tt(
                    "Hosting und Serverless Edge Functions werden über Vercel Inc., Covina, USA bereitgestellt. Server-Logs verarbeiten IP-Adressen und Request-Header zur Auslieferung.",
                    "Hosting and serverless functions are provided by Vercel Inc. Server logs process technical headers for content delivery.",
                  )}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-cream/70 border border-forest/10">
                <h3 className="font-bold text-forest text-base mb-1">
                  Supabase Inc. (Datenbank & Auth)
                </h3>
                <p className="text-forest/80">
                  {tt(
                    "Bestelldaten, Partner-Storefronts und Nutzerkonten werden in PostgreSQL-Datenbanken bei Supabase mit Row-Level Security (RLS) gespeichert. Passwörter sind gehasht.",
                    "Orders, storefront records, and accounts are stored in PostgreSQL on Supabase with Row-Level Security (RLS).",
                  )}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-cream/70 border border-forest/10">
                <h3 className="font-bold text-forest text-base mb-1">
                  Upstash Inc. (Rate Limiting)
                </h3>
                <p className="text-forest/80">
                  {tt(
                    "Zum Schutz vor Missbrauch und Brute-Force-Angriffen verarbeiten wir anonymisierte IP-Hashes zur Anfragedrosselung.",
                    "For brute-force abuse protection, temporary hashed IP tokens are processed for rate limiting.",
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* 4. Fehlerüberwachung (Sentry) */}
          <section>
            <h2 className="text-2xl font-display font-bold text-forest mb-4">
              {tt(
                "4. Technische Fehlerüberwachung (Sentry)",
                "4. Technical Error Monitoring (Sentry)",
              )}
            </h2>
            <p className="text-sm">
              {tt(
                "Zur Identifikation von JavaScript-Laufzeitfehlern nutzen wir Sentry (Functional Software Inc. / Sentry EU Ingest). Sentry ist so konfiguriert, dass sendDefaultPii deaktiviert ist, Session-Replays deaktiviert sind, URL-Query-Parameter (Tokens/Passwörter) vor der Übertragung gefiltert werden und keine IP-Adressen gespeichert werden.",
                "To detect JavaScript errors, we use Sentry with sendDefaultPii disabled, zero session replays, and URL/header sanitization.",
              )}
            </p>
          </section>

          {/* 5. Cookie-Einwilligung & Web-Analyse */}
          <section>
            <h2 className="text-2xl font-display font-bold text-forest mb-4">
              {tt(
                "5. Optionale Web-Analyse (PostHog, Ahrefs, Vercel Analytics)",
                "5. Optional Web Analytics (PostHog, Ahrefs, Vercel Analytics)",
              )}
            </h2>
            <p className="text-sm">
              {tt(
                "Optionale Analyse-Skripte werden strikt erst nach Klick auf 'Alle akzeptieren' im Cookie-Banner geladen (§ 25 Abs. 1 TDDDG / Art. 6 Abs. 1 lit. a DSGVO). Vor der Einwilligung oder nach einem Widerruf finden keine Analyse-Anfragen an PostHog, Ahrefs oder Vercel Analytics statt.",
                "Optional analytics are loaded strictly after positive consent via the cookie banner. Before consent or after revocation, zero analytics requests occur.",
              )}
            </p>
          </section>

          {/* 6. Zahlungsabwicklung */}
          <section>
            <h2 className="text-2xl font-display font-bold text-forest mb-4">
              {tt("6. Zahlungsabwicklung (Stripe)", "6. Payment Processing (Stripe)")}
            </h2>
            <p className="text-sm">
              {tt(
                "Kartenzahlungen und Catering-Anzahlungen erfolgen über Stripe Payments Europe Ltd. Speisely speichert keine Kreditkartennummern oder CVV-Codes.",
                "Card transactions are processed directly via Stripe Payments Europe Ltd. Speisely never stores card credentials.",
              )}
            </p>
          </section>

          {/* 7. E-Mail */}
          <section>
            <h2 className="text-2xl font-display font-bold text-forest mb-4">
              {tt("7. Transaktions-E-Mails (Resend)", "7. Transactional Emails (Resend)")}
            </h2>
            <p className="text-sm">
              {tt(
                "Transaktions-E-Mails für Bestellbestätigungen und Statusbenachrichtigungen werden über Resend Inc. versendet.",
                "Transactional order notifications are dispatched via Resend Inc.",
              )}
            </p>
          </section>

          {/* 8. Betroffenenrechte */}
          <section>
            <h2 className="text-2xl font-display font-bold text-forest mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5 text-[#7FA46B]" />
              <span>
                {tt("8. Ihre Rechte als betroffene Person", "8. Your Rights as a Data Subject")}
              </span>
            </h2>
            <p className="text-sm">
              {tt(
                "Sie haben jederzeit das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20 DSGVO) sowie das Recht auf jederzeitigen Widerruf einer erteilten Einwilligung (Art. 7 Abs. 3 DSGVO).",
                "You have the right of access (Art. 15 GDPR), rectification (Art. 16 GDPR), erasure (Art. 17 GDPR), restriction (Art. 18 GDPR), portability (Art. 20 GDPR), and revocation of consent at any time (Art. 7 (3) GDPR).",
              )}
            </p>
            <p className="mt-4 text-sm">
              {tt("Kontakt für Datenschutzanfragen: ", "Contact for data inquiries: ")}
              <a href="mailto:info@speisely.de" className="text-[#b28a3c] font-bold underline">
                info@speisely.de
              </a>
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-forest/10 pt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#b28a3c] text-white px-6 py-3 text-sm font-semibold hover:bg-[#9a7633] transition shadow-md"
          >
            {tt("Zur Startseite", "Back to homepage")} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/impressum"
            className="inline-flex items-center gap-2 rounded-full bg-cream text-forest px-6 py-3 text-sm font-medium hover:bg-[#eadfce] transition border border-forest/10"
          >
            {tt("Zum Impressum", "View Imprint")}
          </Link>
        </div>
      </main>
    </SiteShell>
  );
}
