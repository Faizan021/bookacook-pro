/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export interface UnifiedSearchResult {
  caterers: {
    id: string;
    name: string;
    slug: string;
    city: string;
    description: string;
    logo_url?: string;
    banner_image_url?: string;
    min_delivery_cents?: number;
    price_per_person_cents?: number;
    tags?: string[];
    rating?: number;
    review_count?: number;
  }[];
  restaurants: {
    id: string;
    name: string;
    slug: string;
    city: string;
    cuisine_type?: string;
    description?: string;
    logo_url?: string;
    banner_image_url?: string;
    min_order_amount?: number;
    rating?: number;
  }[];
  magazineStories: {
    title: string;
    slug: string;
    category: string;
    image_url: string;
    excerpt: string;
    venue_name?: string;
    city?: string;
  }[];
  estimatedBudget?: {
    guests: number;
    costPerPersonMin: number;
    costPerPersonMax: number;
    totalMin: number;
    totalMax: number;
    suggestedFormat: string;
  };
}

// In-memory micro-cache for high-frequency queries (< 20ms response)
const searchCache = new Map<string, { data: UnifiedSearchResult; timestamp: number }>();
const SEARCH_CACHE_TTL = 90 * 1000; // 90 seconds TTL

export const searchUnifiedPipeline = createServerFn({ method: "POST" })
  .validator(
    (input: {
      query?: string;
      city?: string;
      guests?: number;
      dietary?: string;
      occasion?: string;
    }) =>
      z
        .object({
          query: z.string().optional().default(""),
          city: z.string().optional().default(""),
          guests: z.number().optional().default(30),
          dietary: z.string().optional().default(""),
          occasion: z.string().optional().default(""),
        })
        .parse(input),
  )
  .handler(async ({ data }) => {
    const q = data.query.trim().toLowerCase();
    const city = data.city.trim().toLowerCase();
    const guests = Math.max(1, data.guests || 30);
    const dietary = data.dietary.trim().toLowerCase();
    const occasion = data.occasion.trim().toLowerCase();

    const cacheKey = `${q}|${city}|${guests}|${dietary}|${occasion}`;
    const now = Date.now();
    const cached = searchCache.get(cacheKey);
    if (cached && now - cached.timestamp < SEARCH_CACHE_TTL) {
      return cached.data;
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // ─────────────────────────────────────────────────────────────
    // STAGE 1 & 2: Parallel Multi-Entity Candidate Retrieval
    // (Caterers, Restaurants, Magazine Stories)
    // ─────────────────────────────────────────────────────────────
    const [catRes, restRes, magRes] = await Promise.all([
      // Caterers lookup
      (async () => {
        try {
          let query = supabaseAdmin
            .from("caterers")
            .select(
              "id, name, slug, city, description, logo_url, banner_image_url, min_delivery_cents, price_per_person_cents, tags",
            );

          if (city) {
            query = query.ilike("city", `%${city}%`);
          }
          if (q) {
            query = query.or(`name.ilike.%${q}%,city.ilike.%${q}%,description.ilike.%${q}%`);
          }
          const { data: res } = await query.limit(8);
          return res || [];
        } catch (e) {
          console.error("Error searching caterers:", e);
          return [];
        }
      })(),

      // Restaurants lookup
      (async () => {
        try {
          let query = supabaseAdmin
            .from("restaurants")
            .select(
              "id, name, slug, city, cuisine_type, description, logo_url, banner_image_url, min_order_amount",
            )
            .eq("is_published", true);

          if (city) {
            query = query.ilike("city", `%${city}%`);
          }
          if (q) {
            query = query.or(
              `name.ilike.%${q}%,city.ilike.%${q}%,cuisine_type.ilike.%${q}%,description.ilike.%${q}%`,
            );
          }
          const { data: res } = await query.limit(8);
          return res || [];
        } catch (e) {
          console.error("Error searching restaurants:", e);
          return [];
        }
      })(),

      // Magazine Editorial Stories
      (async () => {
        // High-value curated stories indexed for instant food-intent discovery
        const curatedStories = [
          {
            title:
              "San Sebastian The Original® Berlin — Wo baskische Tradition auf Schokofluss trifft",
            slug: "/magazin/community/san-sebastian-berlin",
            category: "Community Story",
            image_url: "/magazin/san-sebastian-berlin/san-sebastian-hd-01-choc-waterfall.webp?v=2",
            excerpt:
              "Karamellisierte Kruste, samtiger Kern und Schokofluss: Der Hype um Berlins cremigsten Cheesecake in Charlottenburg.",
            venue_name: "San Sebastian The Original®",
            city: "Berlin",
            keywords: [
              "cheesecake",
              "kuchen",
              "san sebastian",
              "schokolade",
              "dessert",
              "berlin",
              "ku'damm",
              "pistazie",
              "lotus",
            ],
          },
          {
            title: "Chicken Krush Prag — Das virale koreanische Crispy Fried Chicken Phänomen",
            slug: "/magazin/community/chicken-krush-prag",
            category: "Community Story",
            image_url: "/magazin/chicken-krush-prag/ck-hd-03-classic-fried.webp?v=2",
            excerpt:
              "Ultra-knuspriges Double-Fried Chicken mit Garlic Butter und Sweet Chilli Glaze.",
            venue_name: "Chicken Krush",
            city: "Prag / Berlin",
            keywords: [
              "chicken",
              "fried chicken",
              "korean",
              "burger",
              "wings",
              "crispy",
              "prag",
              "berlin",
            ],
          },
          {
            title:
              "Shawarma Albaik Berlin — Authentische arabische Grillspezialitäten & Knoblauchsauce",
            slug: "/magazin/speisely-visits/shawarma-albaik-berlin",
            category: "Speisely Visits",
            image_url: "/magazin/albaik/albaik-shawarma-rice-hero.webp?v=2",
            excerpt:
              "Frisch marinierte Fleischspieße, luftiges Fladenbrot und legendäre Knoblauchcreme.",
            venue_name: "Shawarma Albaik",
            city: "Berlin",
            keywords: ["shawarma", "halal", "grill", "arabisch", "fleisch", "berlin", "neukölln"],
          },
          {
            title: "Mandy Restaurant & Café Berlin — Edle orientalische Frühstücks- & Eventkultur",
            slug: "/magazin/speisely-visits/mandy-restaurant-berlin-neukoelln",
            category: "Speisely Visits",
            image_url: "/magazin/mandy/mandy-lamm-fuer-zwei-berlin-neukoelln.webp?v=2",
            excerpt:
              "Reichhaltige Frühstücksplatten, frisches Gebäck und großzügige Räumlichkeiten für Familien & Feiern.",
            venue_name: "Mandy Restaurant",
            city: "Berlin",
            keywords: ["frühstück", "brunch", "orientalisch", "halal", "event", "berlin", "feiern"],
          },
        ];

        if (!q && !city) {
          return curatedStories.slice(0, 3);
        }

        return curatedStories.filter((s) => {
          const matchQ =
            !q ||
            s.title.toLowerCase().includes(q) ||
            s.excerpt.toLowerCase().includes(q) ||
            s.keywords.some((k) => k.includes(q));
          const matchCity = !city || s.city.toLowerCase().includes(city);
          return matchQ && matchCity;
        });
      })(),
    ]);

    // ─────────────────────────────────────────────────────────────
    // STAGE 3: Real-Time Event Budget & Portion Calculator
    // ─────────────────────────────────────────────────────────────
    let costPerPersonMin = 18.5;
    let costPerPersonMax = 38.0;
    let suggestedFormat = "Fingerfood & Flying Buffet";

    if (occasion.includes("hochzeit") || occasion.includes("wedding")) {
      costPerPersonMin = 35.0;
      costPerPersonMax = 65.0;
      suggestedFormat = "Exklusives Hochzeits-Buffet & Menü";
    } else if (
      occasion.includes("business") ||
      occasion.includes("corporate") ||
      occasion.includes("firma")
    ) {
      costPerPersonMin = 22.0;
      costPerPersonMax = 45.0;
      suggestedFormat = "Business Lunch & Meeting Fingerfood";
    } else if (guests > 100) {
      costPerPersonMin = 16.5;
      costPerPersonMax = 32.0;
      suggestedFormat = "Großevent Buffet & Live Cooking";
    }

    const estimatedBudget = {
      guests,
      costPerPersonMin,
      costPerPersonMax,
      totalMin: Math.round(guests * costPerPersonMin),
      totalMax: Math.round(guests * costPerPersonMax),
      suggestedFormat,
    };

    const result: UnifiedSearchResult = {
      caterers: catRes as any[],
      restaurants: restRes as any[],
      magazineStories: magRes as any[],
      estimatedBudget,
    };

    searchCache.set(cacheKey, { data: result, timestamp: now });
    return result;
  });
