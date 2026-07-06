export type Caterer = {
  id: string;
  name: string;
  tagline: { de: string; en: string };
  rating: number;
  reviewCount: number;
  minOrder: number;
  minGuests: number;
  perPerson: number;
  time: string;
  tags: string[];
  img: string;
  status: "available" | "busy";
  area: string;
  address: string;
  phone: string;
  cat: "wedding" | "corporate" | "private" | "ramadan" | "christmas" | "business" | "all";
  verified: boolean;
  dietary: string[];
  about: { de: string; en: string };
  packages: any[];
  menu?: { category?: string; [key: string]: any }[];
  announcement_active?: boolean;
  announcement_bg_color?: string;
  announcement_text?: string;
  isShowcase?: boolean;
};

export const fallbackCaterers: Caterer[] = [
  {
    id: "maison-verde",
    name: "Maison Verde",
    tagline: { de: "Fine Dining · Privates Dinner", en: "Fine Dining · Private Dinner" },
    rating: 4.9,
    reviewCount: 128,
    minOrder: 600,
    time: "7 Tage Vorlauf",
    tags: ["Fine Dining", "Französisch", "Exklusiv"],
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=900&fit=crop",
    status: "available",
    area: "Berlin Mitte",
    address: "Auguststraße 14, 10117 Berlin",
    phone: "+49 30 4567 1234",
    cat: "private",
    minGuests: 10,
    perPerson: 85,
    verified: true,
    dietary: ["Vegetarian", "Vegan"],
    about: {
      de: "Intime Fine-Dining-Erlebnisse bei dir zuhause — saisonal, regional und persönlich serviert.",
      en: "Intimate fine dining experiences at your home — seasonal, regional and personally served.",
    },
    announcement_active: true,
    announcement_bg_color: "secondary",
    announcement_text: "Available for last-minute bookings this weekend! 🥂",
    packages: [],
    menu: [
      { name: "6-Gänge Fine Dining", desc: { de: "Saisonales Menü", en: "Seasonal menu" }, price: 85, unit: { de: "Person", en: "person" }, serves: 1, category: "Menü" },
      { name: "Weinbegleitung", desc: { de: "Passende Weine", en: "Matching wines" }, price: 45, unit: { de: "Person", en: "person" }, serves: 1, category: "Getränke" },
    ],
  },
  {
    id: "stadt-tafel",
    name: "Stadt & Tafel",
    tagline: { de: "Modern Sharing · Corporate", en: "Modern Sharing · Corporate" },
    rating: 4.7,
    reviewCount: 340,
    minOrder: 350,
    time: "3 Tage Vorlauf",
    tags: ["Sharing", "Bowls", "Team Lunch"],
    img: "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&h=900&fit=crop",
    status: "busy",
    area: "Kreuzberg",
    address: "Lobeckstraße 30, 10969 Berlin",
    phone: "+49 30 4567 2345",
    cat: "business",
    minGuests: 20,
    perPerson: 25,
    verified: true,
    dietary: ["Vegetarian", "Gluten-free"],
    about: {
      de: "Sharing-Bowls und Plattenkonzepte für Team-Events, Konferenzen und Office-Lunches.",
      en: "Sharing bowls and platter concepts for team events, conferences and office lunches.",
    },
    packages: [],
    menu: [
      { name: "Sharing Bowl: Levantine", desc: { de: "Hummus, Falafel, Tabbouleh", en: "Hummus, falafel, tabbouleh" }, price: 25, unit: { de: "Person", en: "person" }, serves: 1, category: "Bowls" },
      { name: "Sharing Bowl: Asian", desc: { de: "Edamame, Teriyaki, Reis", en: "Edamame, teriyaki, rice" }, price: 28, unit: { de: "Person", en: "person" }, serves: 1, category: "Bowls" },
    ],
  },
  {
    id: "olivenhain",
    name: "Olivenhain",
    tagline: { de: "Levantinische Hochzeit", en: "Levantine Wedding" },
    rating: 4.8,
    reviewCount: 215,
    minOrder: 1500,
    time: "14 Tage Vorlauf",
    tags: ["Levantinisch", "Buffet", "Hochzeit"],
    img: "https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=1200&h=900&fit=crop",
    status: "available",
    area: "Neukölln",
    address: "Sonnenallee 88, 12045 Berlin",
    phone: "+49 30 4567 3456",
    cat: "wedding",
    minGuests: 50,
    perPerson: 45,
    verified: true,
    dietary: ["Halal", "Vegetarian"],
    about: {
      de: "Üppige levantinische Buffets für Hochzeiten — Mezze, Grill und süße Klassiker.",
      en: "Sumptuous Levantine buffets for weddings — mezze, grill and sweet classics.",
    },
    packages: [],
    menu: [
      { name: "Hochzeitsbuffet Premium", desc: { de: "Vollständiges Buffet mit Grillstation", en: "Full buffet with grill station" }, price: 45, unit: { de: "Person", en: "person" }, serves: 1, category: "Buffet" },
      { name: "Mezze Platte", desc: { de: "Verschiedene Mezze Variationen", en: "Various mezze variations" }, price: 18, unit: { de: "Person", en: "person" }, serves: 1, category: "Vorspeisen" },
    ],
  },
];

import { supabase } from "@/integrations/supabase/client";

function mapCaterer(r: any): Caterer {
  return {
    id: r.slug || r.id,
    name: r.business_name || "Caterer",
    tagline: { de: r.description || "Premium Catering", en: r.description || "Premium Catering" },
    rating: 4.8,
    reviewCount: 0,
    minOrder: Number(r.min_order_amount ?? 150),
    minGuests: 10,
    perPerson: 25,
    time: "3 Tage Vorlauf",
    tags: r.cuisine_type ? [r.cuisine_type] : ["Catering"],
    img: r.banner_image_url || "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200",
    status: r.is_active || r.status === "published" ? "available" : "busy",
    area: r.city || "Berlin",
    address: r.business_address || "",
    phone: r.phone || "",
    cat: "corporate",
    verified: true,
    dietary: [],
    about: { de: r.description || "", en: r.description || "" },
    packages: [],
    menu: (r.products || []).map((p: any) => ({
      name: p.name,
      desc: { de: p.description || "", en: p.description || "" },
      price: Number(p.price),
      category: p.category || "Menu",
      dietary: p.dietary_tags || [],
    })),
  };
}

export async function getCaterers(): Promise<Caterer[]> {
  const { data, error } = await supabase
    .from("storefront_settings")
    .select("id, caterer_id, slug, description, banner_image_url, accepts_delivery, accepts_pickup, delivery_fee, min_order_amount, estimated_prep_time_minutes, products(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching caterers:", error);
  }

  const liveCaterers = (data || []).map(mapCaterer);
  const MIN_DISPLAY_COUNT = 3; // Keep the threshold low for caterers since there's fewer
  
  if (liveCaterers.length >= MIN_DISPLAY_COUNT) {
    return liveCaterers;
  }

  const needed = MIN_DISPLAY_COUNT - liveCaterers.length;
  const showcaseItems = fallbackCaterers.slice(0, needed).map(c => ({
    ...c,
    isShowcase: true
  }));

  return [...liveCaterers, ...showcaseItems];
}

export async function getCaterer(id: string): Promise<Caterer | undefined> {
  const { data, error } = await supabase
    .from("storefront_settings")
    .select("id, caterer_id, slug, description, banner_image_url, accepts_delivery, accepts_pickup, delivery_fee, min_order_amount, estimated_prep_time_minutes, products(*)")
    .eq("slug", id)
    .eq("is_active", true)
    .maybeSingle();

  if (!error && data) {
    return mapCaterer(data);
  }

  const fallback = fallbackCaterers.find((c) => c.id === id);
  if (fallback) {
    return { ...fallback, isShowcase: true };
  }
  return undefined;
}

export type PromoCode = {
  code: string;
  discount_type: "percentage" | "fixed" | "free_delivery" | "free_item" | "bogo";
  discount_value: number;
  applies_to_product_name?: string;
  min_order_value_cents?: number;
  free_item_name?: string;
  required_qty?: number;
  starts_at?: string;
  ends_at?: string;
};

// Mock promo codes for Maison Verde
export const mockPromoCodes: Record<string, PromoCode[]> = {
  "maison-verde": [
    { code: "CATERING15", discount_type: "percentage", discount_value: 15 },
    { code: "WELCOME", discount_type: "fixed", discount_value: 50 },
  ]
};
