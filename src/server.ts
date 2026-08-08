import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

const domainCache = new Map<string, string>();

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();

      // Custom Domain Routing
      let currentRequest = request;
      try {
        const url = new URL(request.url);
        let isSpeiselySubdomain = false;
        let targetSlug: string | null = null;

        // Skip API routes and assets
        if (
          !url.pathname.startsWith("/_server") &&
          !url.pathname.startsWith("/_build") &&
          !url.pathname.startsWith("/_assets") &&
          !url.pathname.startsWith("/public")
        ) {
          const host = url.hostname;
          const currentAppHost = process.env.VITE_APP_URL
            ? new URL(process.env.VITE_APP_URL).host
            : "localhost:3000";
          const isCustomDomain =
            host !== "localhost:3000" &&
            host !== currentAppHost &&
            !host.includes("speisely.de") &&
            !host.includes("vercel.app");

          // Handle Wildcard Subdomains (e.g., pizzeria-napoli.speisely.de)
          isSpeiselySubdomain =
            host.endsWith(".speisely.de") &&
            host !== "www.speisely.de" &&
            host !== "app.speisely.de" &&
            host !== "admin.speisely.de" &&
            host !== "speisely.de";
          let searchColumn = "custom_domain";
          let searchValue = host;

          if (isSpeiselySubdomain) {
            targetSlug = host.replace(".speisely.de", "");
            searchColumn = "slug";
            searchValue = targetSlug;
          }
          const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
          const supabaseKey =
            process.env.SUPABASE_SERVICE_ROLE_KEY ||
            process.env.VITE_SUPABASE_ANON_KEY ||
            process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
            process.env.SUPABASE_PUBLISHABLE_KEY ||
            "";

          let targetPath = null;

          const subPath = url.pathname === "/" ? "" : url.pathname;

          // Check domain cache first
          const domainCacheKey = `${searchColumn}:${searchValue}`;
          const cachedPath = domainCache.get(domainCacheKey);

          if (cachedPath) {
            targetPath = `${cachedPath}${subPath}`;
          } else {
            const fetchOpts = {
              headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
            };

            // Query restaurants, caterers, planners concurrently
            const [resRest, resCat, resPlan] = await Promise.all([
              fetch(
                `${supabaseUrl}/rest/v1/restaurants?${searchColumn}=eq.${searchValue}&select=slug`,
                fetchOpts,
              )
                .then((r) => r.json())
                .catch(() => []),
              fetch(
                `${supabaseUrl}/rest/v1/caterers?${searchColumn}=eq.${searchValue}&select=slug`,
                fetchOpts,
              )
                .then((r) => r.json())
                .catch(() => []),
              fetch(
                `${supabaseUrl}/rest/v1/planners?${searchColumn}=eq.${searchValue}&select=slug`,
                fetchOpts,
              )
                .then((r) => r.json())
                .catch(() => []),
            ]);

            if (resRest && resRest.length > 0) {
              domainCache.set(domainCacheKey, `/restaurant/${resRest[0].slug}`);
              targetPath = `/restaurant/${resRest[0].slug}${subPath}`;
            } else if (resCat && resCat.length > 0) {
              domainCache.set(domainCacheKey, `/catering/${resCat[0].slug}`);
              targetPath = `/catering/${resCat[0].slug}${subPath}`;
            } else if (resPlan && resPlan.length > 0) {
              domainCache.set(domainCacheKey, `/planner/${resPlan[0].slug}`);
              targetPath = `/planner/${resPlan[0].slug}${subPath}`;
            }
          }

          if (targetPath) {
            const newUrl = new URL(targetPath, request.url);
            newUrl.search = url.search;

            // Rewrite the request internally for SSR
            currentRequest = new Request(newUrl, request);
          }
        }

        // Static Fallback
        if (isSpeiselySubdomain && currentRequest === request) {
          let staticPath = null;
          const subPath = url.pathname === "/" ? "" : url.pathname;

          // Dynamically import data fetchers concurrently
          const [{ getRestaurants }, { getCaterers }, { getPlanners }] = await Promise.all([
            import("./data/restaurants"),
            import("./data/caterers"),
            import("./data/planners"),
          ]);

          const [restaurants, caterers, planners] = await Promise.all([
            getRestaurants(),
            getCaterers(),
            getPlanners(),
          ]);

          // Compare against slug (the URL-friendly name), not id (UUID)
          if (restaurants.find((r) => (r.slug ?? r.id) === targetSlug))
            staticPath = `/restaurant/${targetSlug}${subPath}`;
          else if (caterers.find((r) => (r.slug ?? r.id) === targetSlug))
            staticPath = `/catering/${targetSlug}${subPath}`;
          else if (planners.find((r) => (r.slug ?? r.id) === targetSlug))
            staticPath = `/planner/${targetSlug}${subPath}`;
          else {
            // Final fallback: treat the subdomain itself as a catering slug
            staticPath = `/catering/${targetSlug}${subPath}`;
          }

          if (staticPath) {
            const newUrl = new URL(staticPath, request.url);
            newUrl.search = url.search;
            currentRequest = new Request(newUrl, request);
          }
        }
      } catch (err) {
        console.error("Custom domain routing error:", err);
      }

      const response = await handler.fetch(currentRequest, env, ctx);

      // Inject __TENANT_PATH__ if request was rewritten and response is HTML
      let finalResponse = await normalizeCatastrophicSsrResponse(response);
      if (currentRequest !== request) {
        const contentType = finalResponse.headers.get("content-type") || "";
        if (contentType.includes("text/html")) {
          const fullRewrittenPath = new URL(currentRequest.url).pathname;
          const parts = fullRewrittenPath.split("/");
          const tenantBasePath = parts.length >= 3 ? `/${parts[1]}/${parts[2]}` : fullRewrittenPath;
          const html = await finalResponse.text();
          const baseUrl = process.env.VITE_APP_URL || "https://www.speisely.de";
          const injected = html.replace(
            "<script",
            `<script>window.__TENANT_PATH__=${JSON.stringify(tenantBasePath)}; window.__TSS_SERVER_BASE_URL__=${JSON.stringify(baseUrl)};</script>\n<script`,
          );
          const newHeaders = new Headers(finalResponse.headers);
          newHeaders.delete("content-length");
          finalResponse = new Response(injected, {
            status: finalResponse.status,
            headers: newHeaders,
          });
        }
      }

      const reqUrl = new URL(request.url);
      const isPublicRoute =
        request.method === "GET" &&
        !reqUrl.pathname.startsWith("/_authenticated") &&
        !reqUrl.pathname.startsWith("/api") &&
        !reqUrl.pathname.startsWith("/_server");

      const contentType = finalResponse.headers.get("content-type") || "";
      if (
        isPublicRoute &&
        contentType.includes("text/html") &&
        !finalResponse.headers.has("cache-control")
      ) {
        const newHeaders = new Headers(finalResponse.headers);
        newHeaders.set(
          "Cache-Control",
          "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
        );
        finalResponse = new Response(finalResponse.body, {
          status: finalResponse.status,
          headers: newHeaders,
        });
      }

      return finalResponse;
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
