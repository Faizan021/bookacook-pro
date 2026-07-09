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
    z.object({ items: z.array(parsedItemSchema).min(1).max(200) }).parse(input),
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

    const { error } = await supabase.from("restaurant_products").insert(rows as any);

    if (error) throw new Error(error.message);
    return { ok: true, count: rows.length };
  });

/**
 * Fetches HTML/Text content of a website on the server side to bypass CORS restrictions.
 */
export const fetchUrlContent = createServerFn({ method: "POST" })
  .middleware([requireRole("restaurant_owner")])
  .validator((input: { url: string }) => z.object({ url: z.string().url() }).parse(input))
  .handler(async ({ data }) => {
    try {
      const response = await fetch(data.url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        },
      });
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}: ${response.statusText}`);
      }
      const html = await response.text();
      return { text: html };
    } catch (e) {
      const err = e as Error;
      console.error("[fetchUrlContent] Error fetching url:", data.url, err);
      throw new Error(err.message || "Failed to fetch website content");
    }
  });
