import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { I18nProvider } from "../i18n/I18nProvider";
import { CookieBanner } from "../components/CookieBanner";
import { Analytics } from "@vercel/analytics/react";
import { initPostHog } from "../utils/posthog";
import posthog from "posthog-js";

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
      { title: "Speisely — Instant Food Order, Catering & Event Planning" },
      { name: "description", content: "Speisely connects spontaneous restaurant food orders, curated catering and professional event planning on one marketplace." },
      { property: "og:site_name", content: "Speisely" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
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
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Speisely",
            alternateName: "Speisely Marketplace",
            description: "Speisely ist ein provisionsfreier B2B2C-Marktplatz für direkte Essensbestellungen, Catering und Event-Planung in Deutschland. Restaurants zahlen eine monatliche Flatrate ohne Provision. Caterer und Event-Planer erhalten qualifizierte Anfragen.",
            url: "https://speisely.de",
            logo: "https://speisely.de/favicon.svg",
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
            },
            sameAs: [
              "https://www.linkedin.com/company/speisely",
            ],
            dateModified: new Date().toISOString().split("T")[0],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Speisely",
            url: "https://speisely.de",
            inLanguage: ["de", "en"],
            description: "Speisely verbindet Restaurants, Caterer und Event-Planer mit Kunden in ganz Deutschland — Sofortbestellung, Catering-Anfragen und Event-Planung auf einer Plattform.",
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
    <html lang="en">
      <head>
        <HeadContent />
        <meta name="ahrefs-site-verification" content="362cae8e8dd342e0ce0b9a43f7722ae70ab03598a54ef96dd42c673b4cb8e7f6" />
        <link rel="canonical" href={canonicalUrl} />
        <script src="https://analytics.ahrefs.com/analytics.js" data-key="m0ja41AgfTD2NuyNepW+LA" async></script>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const pathname = router.state.location.pathname;

  useEffect(() => {
    initPostHog();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      posthog.capture("$pageview", {
        $current_url: window.location.href,
        $pathname: pathname,
      });
    }
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <CookieBanner />
        <Analytics />
      </I18nProvider>
    </QueryClientProvider>
  );
}
