import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * /instant-order — permanently redirects to /restaurants.
 *
 * The old page used static mock data. /restaurants is now the canonical
 * live-database Restaurant discovery hub.
 */
export const Route = createFileRoute("/instant-order")({
  loader: () => {
    throw redirect({ to: "/restaurants", replace: true });
  },
});
