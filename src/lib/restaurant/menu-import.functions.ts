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

      // Check if this website is hosted on Speisebaron
      const isSpeisebaron = html.includes("speisebaron") || html.includes("window.domain");
      if (isSpeisebaron) {
        // Extract domain name (e.g. window.domain="schnitzel-schmiede-mg.de";)
        const match = html.match(/window\.domain\s*=\s*["']([^"']+)["']/);
        const domain = match ? match[1] : new URL(data.url).hostname.replace("www.", "");

        // Fetch Speisebaron structured JSON API directly using anonymous public token
        const token =
          "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoiMSIsImFub255bW91cyI6dHJ1ZX0.iHuZJKs4ggxRs1eojVQtuDR7A3FrpMIUqTJofjVuu9zwRkAAmDp6MVD5cj7Dbwgdx5lQV8YiZyIt22a50-M0xplo_TZ-oFND0o7XBLV93iwiF7T3AG8FSLxbRD9ZYF_Yfgf7FfFKQvLfr8QyqoJB8cUTWAS6qzrn1cukMpYxS9M";
        const apiResponse = await fetch(`https://api-green.speisebaron.de/restaurant/${domain}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          },
        });

        if (apiResponse.ok) {
          const json = await apiResponse.json();
          const shopMenu = json.restaurant?.shopMenu || [];
          const items = [];

          for (const cat of shopMenu) {
            if (!cat.dishs) continue;
            for (const dish of cat.dishs) {
              if (!dish.active) continue;
              items.push({
                _id: Math.random().toString(36).slice(2, 10),
                name: dish.name,
                description: dish.description || "",
                price_cents: dish.price || 0,
                category: cat.name || "",
                tags: dish.tags?.join(", ") || "",
              });
            }
          }

          if (items.length > 0) {
            return { isSpeisebaron: true, items };
          }
        }
      }

      // Generic Fallback: Clean non-visible blocks from HTML before converting to text
      const cleanHtml = html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<head[\s\S]*?<\/head>/gi, " ")
        .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
        .replace(/<!--[\s\S]*?-->/gi, " ");

      // Replace common closing block tags with newlines to preserve lines structure
      const formattedHtml = cleanHtml
        .replace(/<\/(div|p|li|tr|h1|h2|h3|h4|h5|h6|section|header|footer)>/gi, "\n")
        .replace(/<[^>]+>/g, " ");

      return { isSpeisebaron: false, text: formattedHtml };
    } catch (e) {
      const err = e as Error;
      console.error("[fetchUrlContent] Error fetching url:", data.url, err);
      throw new Error(err.message || "Failed to fetch website content");
    }
  });
