import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/magazin/speisely-visits")({
  component: () => <Outlet />,
});
