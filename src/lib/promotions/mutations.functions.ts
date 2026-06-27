import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const createPromoCode = createServerFn()
  .validator((d: { 
    code: string; 
    discount_type: "percentage" | "fixed"; 
    discount_value: number;
    promote_on_storefront: boolean;
    vertical: "restaurants" | "caterers" | "planners";
  }) => d)
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const uppercaseCode = data.code.trim().toUpperCase();

    // 1. Insert the promo code
    const { error: insertErr } = await supabase
      .from("promo_codes")
      .insert({
        code: uppercaseCode,
        owner_id: userId,
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        is_active: true
      });

    if (insertErr) {
      if (insertErr.code === '23505') { // Unique violation
        throw new Error("A promo code with this name already exists.");
      }
      throw new Error(insertErr.message);
    }

    // 2. If promote_on_storefront is true, update the banner
    if (data.promote_on_storefront) {
      const discountText = data.discount_type === "percentage" 
        ? `${data.discount_value}%` 
        : `€${data.discount_value}`;
        
      const bannerText = `Use code ${uppercaseCode} for ${discountText} off! 🎁`;

      const { error: updateErr } = await supabase
        .from(data.vertical)
        .update({
          announcement_active: true,
          announcement_text: bannerText,
          announcement_bg_color: "default"
        })
        .eq("owner_id", userId);

      if (updateErr) {
        console.error("Failed to update storefront banner:", updateErr);
        // We don't throw here because the promo code was successfully created.
      }
    }

    return { success: true };
  });

export const togglePromoCode = createServerFn()
  .validator((d: { id: string; is_active: boolean }) => d)
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const { error } = await supabase
      .from("promo_codes")
      .update({ is_active: data.is_active })
      .eq("id", data.id)
      .eq("owner_id", userId); // Ensure they only toggle their own codes

    if (error) throw new Error(error.message);
    
    return { success: true };
  });
