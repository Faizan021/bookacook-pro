import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/lib/auth/role-middleware";
import { z } from "zod";

export const getMyPromoCodes = createServerFn()
  .validator((d: { vertical: "restaurants" | "caterers" | "planners" }) =>
    z.object({ vertical: z.enum(["restaurants", "caterers", "planners"]) }).parse(d),
  )
  .middleware([requireSupabaseAuth()])
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const { data: promos, error } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("owner_id", userId)
      .eq("vertical", data.vertical)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return promos || [];
  });
