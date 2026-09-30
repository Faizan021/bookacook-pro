import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/partners/webseiten")({
  beforeLoad: () => {
    throw redirect({
      to: "/partner/webseiten",
    });
  },
});
