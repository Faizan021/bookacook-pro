import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

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
        if (!url.pathname.startsWith("/_server") && !url.pathname.startsWith("/_build") && !url.pathname.startsWith("/_assets") && !url.pathname.startsWith("/public")) {
          const host = url.hostname;
          const currentAppHost = process.env.VITE_APP_URL ? new URL(process.env.VITE_APP_URL).host : "localhost:3000";
          const isCustomDomain = 
            host !== "localhost:3000" && 
            host !== currentAppHost && 
            !host.includes("speisely.de") && 
            !host.includes("vercel.app");

          // Handle Wildcard Subdomains (e.g., pizzeria-napoli.speisely.de)
          isSpeiselySubdomain = host.endsWith(".speisely.de") && host !== "www.speisely.de" && host !== "app.speisely.de" && host !== "speisely.de";
          let searchColumn = "custom_domain";
          let searchValue = host;

          if (isSpeiselySubdomain) {
            targetSlug = host.replace(".speisely.de", "");
            searchColumn = "slug";
            searchValue = targetSlug;
          }
          const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
          const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "";
          
          let targetPath = null;
          
          // Check restaurants
          let res = await fetch(`${supabaseUrl}/rest/v1/restaurants?${searchColumn}=eq.${searchValue}&select=slug`, {
            headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
          });
          let data = await res.json();
          if (data && data.length > 0) {
            targetPath = `/restaurant/${data[0].slug}`;
          }

          // Check caterers
          if (!targetPath) {
            res = await fetch(`${supabaseUrl}/rest/v1/caterers?${searchColumn}=eq.${searchValue}&select=slug`, {
              headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
            });
            data = await res.json();
            if (data && data.length > 0) {
              targetPath = `/catering/${data[0].slug}`;
            }
          }

          // Check planners
          if (!targetPath) {
            res = await fetch(`${supabaseUrl}/rest/v1/planners?${searchColumn}=eq.${searchValue}&select=slug`, {
              headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
            });
            data = await res.json();
            if (data && data.length > 0) {
              targetPath = `/planner/${data[0].slug}`;
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
          // Dynamically import data fetchers
          const { getRestaurants } = await import("./data/restaurants");
          const { getCaterers } = await import("./data/caterers");
          const { getPlanners } = await import("./data/planners");
          
          const restaurants = await getRestaurants();
          const caterers = await getCaterers();
          const planners = await getPlanners();
          
          if (restaurants.find(r => r.id === targetSlug)) staticPath = `/restaurant/${targetSlug}`;
          else if (caterers.find(r => r.id === targetSlug)) staticPath = `/catering/${targetSlug}`;
          else if (planners.find(r => r.id === targetSlug)) staticPath = `/planner/${targetSlug}`;

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
          const rewrittenPath = new URL(currentRequest.url).pathname;
          const html = await finalResponse.text();
          const baseUrl = process.env.VITE_APP_URL || "https://www.speisely.de";
          const injected = html.replace(
            '<script',
            `<script>window.__TENANT_PATH__=${JSON.stringify(rewrittenPath)}; window.__TSS_SERVER_BASE_URL__=${JSON.stringify(baseUrl)};</script>\n<script`
          );
          finalResponse = new Response(injected, {
            status: finalResponse.status,
            headers: finalResponse.headers,
          });
        }
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
