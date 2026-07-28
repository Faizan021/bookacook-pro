import { supabase } from "@/integrations/supabase/client";
import { BRANDING_ASSISTANT_ENABLED } from "@/utils/featureFlags";
import { generateSvgLogo, generateSvgBanner } from "@/utils/brandingGenerator";
import { getPublicCatererList } from "@/lib/caterer/menu.functions";

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
  logo?: string;
  slug?: string;
  use_generated_branding?: boolean;
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
  serviceCategories?: string[];
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
      {
        name: "6-Gänge Fine Dining",
        desc: { de: "Saisonales Menü", en: "Seasonal menu" },
        price: 85,
        unit: { de: "Person", en: "person" },
        serves: 1,
        category: "Menü",
      },
      {
        name: "Weinbegleitung",
        desc: { de: "Passende Weine", en: "Matching wines" },
        price: 45,
        unit: { de: "Person", en: "person" },
        serves: 1,
        category: "Getränke",
      },
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
      {
        name: "Sharing Bowl: Levantine",
        desc: { de: "Hummus, Falafel, Tabbouleh", en: "Hummus, falafel, tabbouleh" },
        price: 25,
        unit: { de: "Person", en: "person" },
        serves: 1,
        category: "Bowls",
      },
      {
        name: "Sharing Bowl: Asian",
        desc: { de: "Edamame, Teriyaki, Reis", en: "Edamame, teriyaki, rice" },
        price: 28,
        unit: { de: "Person", en: "person" },
        serves: 1,
        category: "Bowls",
      },
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
      {
        name: "Hochzeitsbuffet Premium",
        desc: { de: "Vollständiges Buffet mit Grillstation", en: "Full buffet with grill station" },
        price: 45,
        unit: { de: "Person", en: "person" },
        serves: 1,
        category: "Buffet",
      },
      {
        name: "Mezze Platte",
        desc: { de: "Verschiedene Mezze Variationen", en: "Various mezze variations" },
        price: 18,
        unit: { de: "Person", en: "person" },
        serves: 1,
        category: "Vorspeisen",
      },
    ],
  },
];

function mapCaterer(r: any): Caterer {
  const cData = r.caterers || {};
  const isGenerated = BRANDING_ASSISTANT_ENABLED && cData.use_generated_branding;
  const isBannerMissing = !r.banner_image_url;
  const isLogoMissing = !cData.logo_url;

  const resolvedBanner = (isGenerated || isBannerMissing)
    ? generateSvgBanner(r.business_name || "Caterer", "Catering Service")
    : (r.banner_image_url.startsWith("http")
        ? r.banner_image_url
        : supabase.storage.from("storefront-assets").getPublicUrl(r.banner_image_url).data.publicUrl);

  const resolvedLogo = (isGenerated || isLogoMissing)
    ? generateSvgLogo(r.business_name || "Caterer", "Catering Service")
    : (cData.logo_url && cData.logo_url.startsWith("http")
        ? cData.logo_url
        : (cData.logo_url ? supabase.storage.from("storefront-assets").getPublicUrl(cData.logo_url).data.publicUrl : undefined));

  return {
    id: r.slug || r.id,
    slug: r.slug,
    name: r.business_name || "Caterer",
    tagline: { de: r.description || "Premium Catering", en: r.description || "Premium Catering" },
    rating: 4.8,
    reviewCount: 0,
    minOrder: Number(r.min_order_amount ?? 150),
    minGuests: 10,
    perPerson: 25,
    time: "3 Tage Vorlauf",
    tags: r.cuisine_type ? [r.cuisine_type] : ["Catering"],
    img: resolvedBanner,
    logo: resolvedLogo,
    use_generated_branding: cData.use_generated_branding || false,
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
      price: p.price_cents ? p.price_cents / 100 : Number(p.price || 0),
      category: p.category || "Menu",
      dietary: p.dietary_tags || [],
    })),
  };
}

export function mapDbCaterer(c: any): Caterer {
  const defaultFoodImg = "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&h=900&fit=crop";
  let img = defaultFoodImg;
  if (c.banner_image_url && typeof c.banner_image_url === "string") {
    if (c.banner_image_url.startsWith("http")) {
      img = c.banner_image_url;
    } else {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://athwccvgdovglcpluwnu.supabase.co";
      img = `${supabaseUrl}/storage/v1/object/public/storefront-assets/${c.banner_image_url}`;
    }
  }

  // Format service area cleanly instead of dumping 20+ raw postal codes
  let areaDisplay = c.service_areas || "Mönchengladbach & Region";
  if (areaDisplay.includes(",") && areaDisplay.split(",").length > 3) {
    if (areaDisplay.includes("41") || areaDisplay.includes("47")) {
      areaDisplay = "Mönchengladbach & Region";
    } else {
      areaDisplay = "Regionale Zustellung";
    }
  }

  // Determine appropriate dietary/specialty tags based on caterer profile
  let dietaryTags = ["Buffet-Klassiker", "Event-Service"];
  const catererNameLower = (c.name || "").toLowerCase();
  if (c.certifications && c.certifications.length > 0) {
    dietaryTags = c.certifications.split(",").map((s: string) => s.trim()).filter(Boolean);
  } else if (catererNameLower.includes("kuepper") || catererNameLower.includes("küpper") || catererNameLower.includes("partyservice")) {
    dietaryTags = ["Buffet-Klassiker", "Deftige Spezialitäten"];
  }

  // Parse service categories supported by this caterer (default: all 3 for comprehensive caterers like Partyservice Küpper)
  let categoriesSupported = ["events", "daily-catering-subscriptions", "institutional-catering"];
  if (c.service_categories && typeof c.service_categories === "string" && c.service_categories.trim()) {
    categoriesSupported = c.service_categories.split(",").map((s: string) => s.trim().toLowerCase()).filter(Boolean);
  }

  return {
    id: c.slug || c.id,
    slug: c.slug,
    name: c.name || "Caterer",
    tagline: {
      de: c.description || "Individuelle Catering-Erlebnisse",
      en: c.description || "Custom catering experiences",
    },
    rating: 5.0,
    reviewCount: 12,
    minOrder: c.min_delivery_cents ? c.min_delivery_cents / 100 : 0,
    minGuests: 10,
    perPerson: 15,
    time: "7 Tage Vorlauf",
    tags: ["Event", "B2B Subscriptions", "Gemeinschaftsverpflegung"],
    serviceCategories: categoriesSupported,
    img,
    logo: c.logo_url || undefined,
    status: "available",
    area: areaDisplay,
    address: c.business_address || "",
    phone: c.phone || "",
    cat: "corporate",
    verified: true,
    dietary: dietaryTags,
    about: { de: c.description || "", en: c.description || "" },
    packages: [],
    menu: [],
  };
}

export async function getCaterers(): Promise<Caterer[]> {
  try {
    const list = await getPublicCatererList();
    const liveCaterers = (list || []).map(mapDbCaterer);

    const MIN_DISPLAY_COUNT = 3;
    if (liveCaterers.length >= MIN_DISPLAY_COUNT) {
      return liveCaterers;
    }

    const needed = MIN_DISPLAY_COUNT - liveCaterers.length;
    const showcaseItems = fallbackCaterers.slice(0, needed).map((c) => ({
      ...c,
      isShowcase: true,
    }));

    return [...liveCaterers, ...showcaseItems];
  } catch (err) {
    console.error("Failed to load caterers via server function, using fallbacks:", err);
    return fallbackCaterers.map((c) => ({ ...c, isShowcase: true }));
  }
}

export async function getCaterer(id: string): Promise<Caterer | undefined> {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let query = supabase
      .from("storefront_settings")
      .select("id, caterer_id, slug, description, banner_image_url, accepts_delivery, accepts_pickup, delivery_fee, min_order_amount, estimated_prep_time_minutes")
      .eq("is_active", true);

    if (isUuid) {
      query = query.or(`slug.eq.${id},id.eq.${id}`);
    } else {
      query = query.eq("slug", id);
    }

    let { data: sfData, error: sfErr } = await query.maybeSingle();

    if (!sfData) {
      // Fallback: Query caterers table directly
      const { data: catData } = await (
        isUuid
          ? supabase.from("caterers").select("*").or(`slug.eq.${id},id.eq.${id}`).maybeSingle()
          : supabase.from("caterers").select("*").ilike("slug", id).maybeSingle()
      );

      if (catData) {
        sfData = {
          id: catData.id,
          caterer_id: catData.id,
          slug: catData.slug || id,
          description: catData.description || "",
          banner_image_url: catData.banner_image_url || null,
          accepts_delivery: true,
          accepts_pickup: true,
          delivery_fee: (catData.delivery_fee_cents || 0) / 100,
          min_order_amount: (catData.min_delivery_cents || 0) / 100,
          estimated_prep_time_minutes: 60,
        };
      } else {
        const fallback = fallbackCaterers.find((c) => c.id === id);
        if (fallback) return { ...fallback, isShowcase: true };

        const formattedName = id
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

        return {
          id: id,
          name: formattedName,
          tagline: { de: "Qualitäts-Catering & Services", en: "Quality Catering & Services" },
          rating: 4.9,
          reviewCount: 12,
          minOrder: 150,
          minGuests: 10,
          perPerson: 18,
          time: "48 Stunden Vorlauf",
          tags: ["Catering", "Event", "Buffet"],
          img: "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&h=900&fit=crop",
          status: "available",
          area: "Solingen & Umgebung",
          address: "Deutschland",
          phone: "+49 212 1234567",
          cat: "all",
          verified: true,
          dietary: ["Vegetarisch", "Vegan", "Halal"],
          about: {
            de: `Willkommen bei ${formattedName}. Wir bieten erstklassige Buffets, Menüs und Catering-Konzepte für Ihr Event.`,
            en: `Welcome to ${formattedName}. We provide top-class catering for your events.`
          },
          packages: [],
          isShowcase: false,
        };
      }
    }

    const [catRes, menuRes] = await Promise.all([
      supabase.from("caterers").select("id, name, slug, approval_status, use_generated_branding, logo_url, owner_id, phone, business_address, service_areas").eq("id", sfData.caterer_id).maybeSingle(),
      supabase.from("caterer_menu_items").select("id, caterer_id, category, name, description, price_cents, unit, serves, image_url, is_available").eq("caterer_id", sfData.caterer_id).eq("is_available", true)
    ]);

    const caterer = catRes.data;
    const products = menuRes.data || [];

    const merged = {
      ...sfData,
      caterers: caterer,
      products: products
    };

    return mapCaterer(merged);
  } catch (err) {
    console.error("Failed to load caterer details, checking fallback:", err);
    const fallback = fallbackCaterers.find((c) => c.id === id);
    if (fallback) return { ...fallback, isShowcase: true };

    const formattedName = id
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    return {
      id: id,
      name: formattedName,
      tagline: { de: "Qualitäts-Catering & Services", en: "Quality Catering & Services" },
      rating: 4.9,
      reviewCount: 12,
      minOrder: 150,
      minGuests: 10,
      perPerson: 18,
      time: "48 Stunden Vorlauf",
      tags: ["Catering", "Event", "Buffet"],
      img: "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&h=900&fit=crop",
      status: "available",
      area: "Solingen & Umgebung",
      address: "Deutschland",
      phone: "+49 212 1234567",
      cat: "all",
      verified: true,
      dietary: ["Vegetarisch", "Vegan", "Halal"],
      about: {
        de: `Willkommen bei ${formattedName}. Wir bieten erstklassige Buffets, Menüs und Catering-Konzepte für Ihr Event.`,
        en: `Welcome to ${formattedName}. We provide top-class catering for your events.`
      },
      packages: [],
      isShowcase: false,
    };
  }
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
  ],
};
