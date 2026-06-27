import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/lib/auth/role-middleware";

export const getMyPromoCodes = createServerFn()
  .middleware([requireSupabaseAuth()])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const { data, error } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    
    return data || [];
  });
