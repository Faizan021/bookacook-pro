import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/lib/auth/role-middleware";

export const getPartnerWorkspaces = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth()])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    // We can use standard supabase client since owner_id/planner_id should match RLS policies for the user
    const [
      { data: restaurant },
      { data: caterer },
      { data: planner }
    ] = await Promise.all([
      supabase.from("restaurants").select("id, name").eq("owner_id", userId).maybeSingle(),
      supabase.from("caterers").select("id, name").eq("owner_id", userId).maybeSingle(),
      supabase.from("planner_services").select("id, title").eq("planner_id", userId).maybeSingle()
    ]);

    return {
      restaurant: !!restaurant,
      caterer: !!caterer,
      planner: !!planner,
      restaurantName: restaurant?.name ?? null,
      catererName: caterer?.name ?? null,
      plannerName: planner?.title ?? null,
    };
  });
