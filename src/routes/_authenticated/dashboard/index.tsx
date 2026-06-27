import { createFileRoute, redirect, isRedirect } from "@tanstack/react-router";
import { getUserProfile } from "@/lib/auth/get-user-profile.functions";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  ssr: false,
  beforeLoad: async () => {
    try {
      const profile = await getUserProfile();
      switch (profile.primaryRole) {
        case "restaurant_owner":
          throw redirect({ to: "/restaurant" });
        case "caterer":
          throw redirect({ to: "/caterer" });
        case "planner":
          throw redirect({ to: "/dashboard/planner" });
        default:
          throw redirect({ to: "/customer" });
      }
    } catch (err) {
      if (isRedirect(err)) {
        throw err;
      }
      console.error("beforeLoad error on main dashboard:", err);
      throw redirect({
        to: "/auth",
        search: { 
          message: "Session expired or unauthorized. Please sign in again.",
          logout: "true",
        },
      });
    }
  },
  component: () => null,
});
