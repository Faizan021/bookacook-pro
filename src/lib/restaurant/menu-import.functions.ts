import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireRole } from "@/lib/auth/role-middleware";

const parsedItemSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional().default(""),
  price_cents: z.number().int().min(0).max(10_000_00),
  category: z.string().max(120).optional().default(""),
  tags: z.string().max(500).optional().default(""),
});

export type ParsedMenuItem = z.infer<typeof parsedItemSchema>;

/**
 * Bulk-inserts reviewed menu items for the authenticated restaurant owner.
 * No item is saved before the user explicitly calls this after reviewing.
 */
export const bulkImportMenuItems = createServerFn({ method: "POST" })
  .middleware([requireRole("restaurant_owner")])
  .validator((input: { items: ParsedMenuItem[] }) =>
    z
      .object({ items: z.array(parsedItemSchema).min(1).max(200) })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context as any;

    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("owner_id", userId)
      .maybeSingle();

    if (!restaurant) throw new Error("No restaurant for this account");

    const rows = data.items.map((item: ParsedMenuItem) => ({
      restaurant_id: restaurant.id,
      name: item.name.trim(),
      description: item.description?.trim() || null,
      price_cents: item.price_cents,
      is_available: true,
      image_url: null,
    }));

    const { error } = await supabase
      .from("restaurant_products")
      .insert(rows as any);

    if (error) throw new Error(error.message);
    return { ok: true, count: rows.length };
  });
