import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ueber-uns")({
  beforeLoad: () => {
    throw redirect({
      to: "/about",
      replace: true,
    });
  },
});
