import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/partner")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/partner" || location.pathname === "/partner/") {
      throw redirect({
        to: "/partners",
      });
    }
  },
  component: () => <Outlet />,
});

