import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Gets blackout dates for the logged-in vendor
export const getMyBlackoutDates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth()])
  .validator((input: { vendorType: "caterer" | "planner" }) => z.object({ vendorType: z.enum(["caterer", "planner"]) }).parse(input))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    // First get the vendor ID
    const table = data.vendorType === "caterer" ? "caterers" : "planners";
    const { data: vendor } = await supabase
      .from(table)
      .select("id")
      .eq("owner_id", userId)
      .maybeSingle();

    if (!vendor) return [];

    const { data: dates, error } = await supabase
      .from("vendor_blackout_dates")
      .select("id, blackout_date, reason")
      .eq("vendor_type", data.vendorType)
      .eq("vendor_id", vendor.id);

    if (error) throw new Error(error.message);
    return dates || [];
  });

export const addBlackoutDate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth()])
  .inputValidator((input: { vendorType: "caterer" | "planner"; date: string; reason?: string }) =>
    z.object({
      vendorType: z.enum(["caterer", "planner"]),
      date: z.string(), // YYYY-MM-DD
      reason: z.string().optional(),
    }).parse(input)
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    const table = data.vendorType === "caterer" ? "caterers" : "planners";
    const { data: vendor } = await supabase
      .from(table)
      .select("id")
      .eq("owner_id", userId)
      .maybeSingle();

    if (!vendor) throw new Error("No storefront found for this account");

    const { error } = await supabase
      .from("vendor_blackout_dates")
      .insert({
        vendor_type: data.vendorType,
        vendor_id: vendor.id,
        blackout_date: data.date,
        reason: data.reason || null
      });

    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const removeBlackoutDate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth()])
  .inputValidator((input: { blackoutId: string }) =>
    z.object({ blackoutId: z.string().uuid() }).parse(input)
  )
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    const { error } = await supabase
      .from("vendor_blackout_dates")
      .delete()
      .eq("id", data.blackoutId);

    if (error) throw new Error(error.message);
    return { ok: true };
  });
