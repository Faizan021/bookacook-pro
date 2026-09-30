import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { I18nProvider } from "../i18n/I18nProvider";
import { CookieBanner } from "../components/CookieBanner";
import { Analytics } from "@vercel/analytics/react";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Speisely — Marktplatz für Catering, Restaurants & Eventplanung" },
      {
        name: "description",
        content:
          "Speisely verbindet spontane Restaurant-Bestellungen, erstklassiges Event-Catering und professionelle Eventplanung auf einer Plattform in ganz Deutschland.",
      },
      { property: "og:site_name", content: "Speisely" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "de_DE" },
      {
        property: "og:title",
        content: "Speisely — Marktplatz für Catering, Restaurants & Eventplanung",
      },
      {
        property: "og:description",
        content:
          "Speisely verbindet spontane Restaurant-Bestellungen, erstklassiges Event-Catering und professionelle Eventplanung auf einer Plattform in ganz Deutschland.",
      },
      { property: "og:url", content: "https://speisely.de" },
      { property: "og:image", content: "https://speisely.de/hero-cinematic.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Speisely — Marktplatz für Catering, Restaurants & Eventplanung",
      },
      {
        name: "twitter:description",
        content:
          "Catering buchen, Essen bei lokalen Restaurants bestellen und Eventplaner in ganz Deutschland finden.",
      },
      { name: "twitter:image", content: "https://speisely.de/hero-cinematic.webp" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,800&family=Inter:wght@400;500;600;700&display=swap",
      },
      { rel: "sitemap", type: "application/xml", href: "https://speisely.de/sitemap.xml" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": "https://speisely.de/#organization",
            name: "Speisely",
            alternateName: "Speisely Marketplace",
            description:
              "Speisely verbindet Restaurants, Caterer und Eventplaner in ganz Deutschland mit Kunden. Buchen Sie erstklassige Catering-Services, Eventplaner oder bestellen Sie Essen bei lokalen Restaurants.",
            url: "https://speisely.de",
            logo: {
              "@type": "ImageObject",
              url: "https://speisely.de/favicon.svg",
            },
            foundingDate: "2026",
            areaServed: {
              "@type": "Country",
              name: "Germany",
            },
            serviceType: [
              "Instant Food Ordering",
              "Catering Marketplace",
              "Event Planning Platform",
              "Restaurant Digital Storefront",
            ],
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer support",
              availableLanguage: ["German", "English"],
              email: "kontakt@speisely.de",
            },
            sameAs: [
              "https://www.linkedin.com/company/speisely",
              "https://www.instagram.com/speisely/",
            ],
            dateModified: new Date().toISOString().split("T")[0],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": "https://speisely.de/#website",
            name: "Speisely",
            url: "https://speisely.de",
            inLanguage: ["de-DE", "en-US"],
            publisher: {
              "@id": "https://speisely.de/#organization",
            },
            description:
              "Speisely verbindet Restaurants, Caterer und Event-Planer mit Kunden in ganz Deutschland — Sofortbestellung, Catering-Anfragen und Event-Planung auf einer Plattform.",
            datePublished: "2026-06-01",
            dateModified: new Date().toISOString().split("T")[0],
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: "https://speisely.de/catering?q={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": "https://speisely.de/#faq",
            mainEntity: [
              {
                "@type": "Question",
                name: "Was ist Speisely?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Speisely ist ein deutschlandweiter Marktplatz, der drei Services vereint: Direktbestellungen bei lokalen Restaurants (0 % Bestellprovision), ein Marktplatz für Event- und Firmen-Catering sowie ein Buchungstool für professionelle Eventplaner.",
                },
              },
              {
                "@type": "Question",
                name: "Was kostet Catering über Speisely?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Die Anfrage über Speisely ist für Kunden und Unternehmen zu 100 % kostenlos. Caterer erstellen individuelle, transparente Angebote je nach Personenzahl, Menüauswahl und Anlass.",
                },
              },
              {
                "@type": "Question",
                name: "In welchen Städten ist Speisely verfügbar?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Speisely ist deutschlandweit aktiv, darunter in Berlin, Hamburg, München, Köln, Frankfurt am Main, Stuttgart, Düsseldorf, Leipzig, Wiesbaden und Mönchengladbach.",
                },
              },
              {
                "@type": "Question",
                name: "Wie funktioniert die Buchung von Event-Catering?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Kunden geben Anlass, Gästezahl und Datum ein. Verifizierte regionale Caterer senden maßgeschneiderte Angebote. Nach Auswahl wird der Termin per Anzahlung sicher reserviert.",
                },
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": "https://speisely.de/#service-catering",
            serviceType: "Catering Marketplace & Event Food",
            provider: {
              "@id": "https://speisely.de/#organization",
            },
            areaServed: {
              "@type": "Country",
              name: "Germany",
            },
            description:
              "Vermittlung von verifizierten Event-Caterern, Fingerfood, Buffets, Hochzeits- und Business-Catering in ganz Deutschland.",
          },
        ]),
      },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = router.state.location.pathname;
  // Clean URL rule: root is exactly https://speisely.de, others have no trailing slash
  const canonicalUrl = pathname === "/" ? "https://speisely.de" : `https://speisely.de${pathname}`;

  return (
    <html lang="de">
      <head>
        <HeadContent />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="ahrefs-site-verification"
          content="362cae8e8dd342e0ce0b9a43f7722ae70ab03598a54ef96dd42c673b4cb8e7f6"
        ></meta>

        {/* Global Schema.org JSON-LD Graph for AI Crawlers & GlanzAI Detection */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://speisely.de/#organization",
                  name: "Speisely",
                  alternateName: "Speisely Marketplace",
                  url: "https://speisely.de",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://speisely.de/favicon.svg",
                  },
                  description:
                    "Speisely ist der führende deutsche Marktplatz für Event-Catering, Sofortbestellungen bei Restaurants und professionelle Eventplanung.",
                  foundingDate: "2026",
                  areaServed: {
                    "@type": "Country",
                    name: "Germany",
                  },
                  contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "customer service",
                    email: "kontakt@speisely.de",
                    availableLanguage: ["German", "English"],
                  },
                  sameAs: [
                    "https://www.linkedin.com/company/speisely",
                    "https://www.instagram.com/speisely/",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://speisely.de/#website",
                  name: "Speisely",
                  url: "https://speisely.de",
                  publisher: {
                    "@id": "https://speisely.de/#organization",
                  },
                  potentialAction: {
                    "@type": "SearchAction",
                    target: "https://speisely.de/catering?q={search_term_string}",
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "Service",
                  "@id": "https://speisely.de/#service-catering",
                  name: "Speisely Event Catering Marketplace",
                  provider: {
                    "@id": "https://speisely.de/#organization",
                  },
                  serviceType: "Catering Service & Event Booking",
                  areaServed: "Germany",
                  description:
                    "Vermittlung von handverlesenen Caterern, BBQ-Stationen, Hochzeits- und Business-Buffets mit transparentem Live-Budgetrechner.",
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "EUR",
                    description: "Kostenlose Anfrage und Angebotserstellung für Kunden",
                  },
                },
                {
                  "@type": "Service",
                  "@id": "https://speisely.de/#service-webseiten",
                  name: "Speisely Digital Suite by TechGlanz",
                  provider: {
                    "@id": "https://speisely.de/#organization",
                  },
                  serviceType: "B2B Website Development & AI SEO",
                  areaServed: "Germany",
                  description:
                    "High-End Website-Erstellung für Caterer und Gastronomen mit PageSpeed 99+, Google AI Overviews Schema und integrierter Speisely-Buchungsengine.",
                },
                {
                  "@type": "Product",
                  "@id": "https://speisely.de/#product-instant-orders",
                  name: "Speisely Restaurant Instant Orders",
                  description:
                    "Direktbestellungen für Restaurants mit 0 % Bestellprovision und sofortiger Auszahlung.",
                  brand: {
                    "@id": "https://speisely.de/#organization",
                  },
                  offers: {
                    "@type": "Offer",
                    price: "34.99",
                    priceCurrency: "EUR",
                    priceValidUntil: "2027-12-31",
                    availability: "https://schema.org/InStock",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { hasAnalyticsConsent, clearAnalyticsStorage } from "@/lib/consent/consent";

function sanitizeSentryUrl(rawUrl: string): string {
  if (!rawUrl) return rawUrl;
  try {
    const isFullUrl = rawUrl.startsWith("http://") || rawUrl.startsWith("https://");
    const parsed = isFullUrl ? new URL(rawUrl) : new URL(rawUrl, "https://speisely.de");

    // 1. Sanitize sensitive query parameters
    const sensitiveKeys = [
      "token",
      "code",
      "session_id",
      "email",
      "auth",
      "key",
      "password",
      "access_token",
      "refresh_token",
      "state",
    ];
    for (const key of sensitiveKeys) {
      parsed.searchParams.delete(key);
    }

    // 2. Sanitize path segments containing UUIDs or sensitive intake/deposit tokens
    let sanitizedPath = parsed.pathname;
    sanitizedPath = sanitizedPath.replace(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
      "[UUID_REDACTED]",
    );
    sanitizedPath = sanitizedPath.replace(
      /\/review\/intake\/[^/]+/gi,
      "/review/intake/[TOKEN_REDACTED]",
    );
    sanitizedPath = sanitizedPath.replace(
      /\/checkout\/deposit\/[^/]+/gi,
      "/checkout/deposit/[BOOKING_REDACTED]",
    );
    sanitizedPath = sanitizedPath.replace(/\/auth\/[^/]+\/[a-zA-Z0-9._-]+/gi, "/auth/[REDACTED]");

    parsed.pathname = sanitizedPath;
    return isFullUrl ? parsed.toString() : parsed.pathname + parsed.search;
  } catch {
    return "[URL_REDACTED]";
  }
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Safety shim for Instagram/in-app webview JS bridges
      type WebkitWindow = Window & { webkit?: { messageHandlers: object } };
      if (!(window as WebkitWindow).webkit) {
        const noOp = { postMessage: () => {} };
        const handlersProxy = new Proxy({}, { get: () => noOp });
        (window as WebkitWindow).webkit = { messageHandlers: handlersProxy };
      }

      // Register Service Worker for offline POS PWA
      if ("serviceWorker" in navigator && window.location.pathname.includes("/festival")) {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      }

      // 1. Initialize strictly necessary, anonymized error monitoring (Sentry)
      import("@sentry/react")
        .then((SentryModule) => {
          SentryModule.init({
            dsn: "https://9a2bcf7470d25fb0f32cdae74a09c335@o4511677378002944.ingest.de.sentry.io/4511677391306832",
            sendDefaultPii: false,
            replaysSessionSampleRate: 0,
            replaysOnErrorSampleRate: 0,
            ignoreErrors: [
              /window\.webkit\.messageHandlers/,
              "undefined is not an object (evaluating 'window.webkit.messageHandlers')",
              "ResizeObserver loop limit exceeded",
              "ResizeObserver loop completed with undelivered notifications",
              "NS_ERROR_FAILURE",
              "The operation is insecure",
              "Failed to fetch",
              "NetworkError when attempting to fetch resource.",
              "Load failed",
              "AbortError",
              /TypeError: Failed to fetch/,
              /Network request failed/,
              /Importing a module script failed/,
            ],
            beforeBreadcrumb(breadcrumb) {
              if (breadcrumb.data?.url) {
                breadcrumb.data.url = sanitizeSentryUrl(breadcrumb.data.url);
              }
              if (breadcrumb.message) {
                breadcrumb.message = sanitizeSentryUrl(breadcrumb.message);
              }
              return breadcrumb;
            },
            beforeSend(event) {
              // Strip all user and IP identifiers
              event.user = undefined;

              // Sanitize sensitive request URLs (paths & parameters)
              if (event.request?.url) {
                event.request.url = sanitizeSentryUrl(event.request.url);
              }

              // Sanitize sensitive headers
              if (event.request?.headers) {
                delete event.request.headers["authorization"];
                delete event.request.headers["cookie"];
              }

              // Drop third-party extension errors
              const frames = event.exception?.values?.[0]?.stacktrace?.frames ?? [];
              const hasOwnFrame = frames.some(
                (f) => f.filename && f.filename.includes("speisely.de"),
              );
              if (frames.length > 0 && !hasOwnFrame) {
                return null;
              }
              return event;
            },
          });
        })
        .catch(() => {});

      // 2. Gate optional analytics (PostHog, Ahrefs & Vercel Analytics) behind explicit cookie consent
      const isAllowed = hasAnalyticsConsent();
      if (isAllowed) {
        setHasConsent(true);
      }

      const loadOptionalAnalytics = () => {
        setHasConsent(true);

        // Idempotently load Ahrefs Analytics dynamically upon consent
        if (!document.getElementById("ahrefs-analytics-script")) {
          const ahrefsScript = document.createElement("script");
          ahrefsScript.id = "ahrefs-analytics-script";
          ahrefsScript.src = "https://analytics.ahrefs.com/analytics.js";
          ahrefsScript.setAttribute("data-key", "m0ja41AgfTD2NuyNepW+LA");
          ahrefsScript.async = true;
          document.head.appendChild(ahrefsScript);
        }

        // Initialize PostHog upon consent
        Promise.all([import("../utils/posthog"), import("posthog-js")])
          .then(([{ initPostHog }, posthogModule]) => {
            initPostHog();
            posthogModule.default.capture("$pageview", {
              $current_url: window.location.href,
              $pathname: pathname,
            });
          })
          .catch(() => {});
      };

      if (isAllowed) {
        loadOptionalAnalytics();
      }

      // Listen for consent granted/declined event from CookieBanner / /datenschutz
      const onConsentUpdated = (e: Event) => {
        const customEvent = e as CustomEvent<{ consent: string }>;
        if (customEvent.detail?.consent === "accepted") {
          loadOptionalAnalytics();
        } else if (customEvent.detail?.consent === "declined") {
          setHasConsent(false);
          clearAnalyticsStorage();
        }
      };

      window.addEventListener("speisely-consent-updated", onConsentUpdated);
      return () => {
        window.removeEventListener("speisely-consent-updated", onConsentUpdated);
      };
    }
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <CookieBanner />
        {hasConsent && <Analytics />}
      </I18nProvider>
    </QueryClientProvider>
  );
}
