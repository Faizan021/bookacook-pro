import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// We use supabaseAdmin so we can bypass RLS for inserting page views anonymously
export const recordPageView = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { vendorId: string; vendorType: "restaurant" | "caterer" | "planner"; url: string }) =>
      z
        .object({
          vendorId: z.string(),
          vendorType: z.enum(["restaurant", "caterer", "planner"]),
          url: z.string().max(255),
        })
        .parse(input),
  )
  .handler(async ({ data }) => {
    // Record page view async, don't wait for response to speed up frontend
    supabaseAdmin
      .from("storefront_page_views")
      .insert({
        vendor_id: data.vendorId,
        vendor_type: data.vendorType,
        url_path: data.url,
      })
      .then(({ error }) => {
        if (error) console.error("Error recording page view:", error.message);
      });

    return { ok: true };
  });
