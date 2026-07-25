import { QueryClient } from "@tanstack/react-query";
import { createRouter, createBrowserHistory, createMemoryHistory } from "@tanstack/react-router";
import { parseHref } from "@tanstack/history";
import { routeTree } from "./routeTree.gen";

function createAppHistory() {
  if (typeof window === "undefined") {
    return createMemoryHistory({ initialEntries: ["/"] });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tenantPath = (window as any).__TENANT_PATH__;

  if (tenantPath) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const baseUrl = (window as any).__TSS_SERVER_BASE_URL__ || "https://www.speisely.de";

    // Extract base tenant path (e.g., /restaurant/schnitzel-schmiede)
    const parts = tenantPath.split("/");
    const baseTenantPath = parts.length >= 3 ? `/${parts[1]}/${parts[2]}` : tenantPath;

    const history = createBrowserHistory({
      parseLocation: () => {
        let path = window.location.pathname;
        if (path === "/") {
          path = baseTenantPath;
        } else if (
          !path.startsWith("/restaurant/") &&
          !path.startsWith("/catering/") &&
          !path.startsWith("/planner/")
        ) {
          path = `${baseTenantPath}${path}`;
        }
        return parseHref(
          path + window.location.search + window.location.hash,
          window.history.state,
        );
      },
      createHref: (path: string) => {
        if (path === baseTenantPath) {
          return "/";
        }
        if (path.startsWith(baseTenantPath)) {
          const sub = path.slice(baseTenantPath.length);
          return sub || "/";
        }
        return path;
      },
    });

    // Intercept push/replace to redirect off-tenant navigations
    // to the main marketplace domain instead of rendering them
    // within the partner's subdomain.
    const origPush = history.push.bind(history);
    const origReplace = history.replace.bind(history);

    const guardNav = (path: string) => {
      // Extract just the pathname (path may include ?search and #hash)
      const pathname = path.split("?")[0].split("#")[0];
      if (pathname !== baseTenantPath && !pathname.startsWith(`${baseTenantPath}/`)) {
        window.location.href = baseUrl + path;
        return true; // blocked
      }
      return false;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    history.push = (path: string, state?: any, opts?: any) => {
      if (!guardNav(path)) origPush(path, state, opts);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    history.replace = (path: string, state?: any, opts?: any) => {
      if (!guardNav(path)) origReplace(path, state, opts);
    };

    return history;
  }

  return createBrowserHistory();
}

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  const router = createRouter({
    routeTree,
    history: createAppHistory(),
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 30000,
  });

  return router;
};
