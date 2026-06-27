import { QueryClient } from "@tanstack/react-query";
import { createRouter, createBrowserHistory, createMemoryHistory } from "@tanstack/react-router";
import { parseHref } from "@tanstack/history";
import { routeTree } from "./routeTree.gen";

function createAppHistory() {
  if (typeof window === 'undefined') {
    return createMemoryHistory({ initialEntries: ['/'] });
  }

  const tenantPath = (window as any).__TENANT_PATH__;

  if (tenantPath) {
    const baseUrl = (window as any).__TSS_SERVER_BASE_URL__ || "https://www.speisely.de";

    const history = createBrowserHistory({
      parseLocation: () => {
        let path = window.location.pathname;
        if (path === '/') {
          path = tenantPath;
        }
        return parseHref(
          path + window.location.search + window.location.hash,
          window.history.state
        );
      },
      createHref: (path: string) => {
        if (path === tenantPath) {
          return '/';
        }
        return path;
      }
    });

    // Intercept push/replace to redirect off-tenant navigations
    // to the main marketplace domain instead of rendering them
    // within the partner's subdomain.
    const origPush = history.push.bind(history);
    const origReplace = history.replace.bind(history);

    const guardNav = (path: string) => {
      // Extract just the pathname (path may include ?search and #hash)
      const pathname = path.split('?')[0].split('#')[0];
      if (pathname !== tenantPath) {
        window.location.href = baseUrl + path;
        return true; // blocked
      }
      return false;
    };

    history.push = (path: string, state?: any, opts?: any) => {
      if (!guardNav(path)) origPush(path, state, opts);
    };
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
    defaultPreloadStaleTime: 0,
  });

  return router;
};
