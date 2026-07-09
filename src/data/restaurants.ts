import { supabase } from "@/integrations/supabase/client";

export type Dietary = "vegetarian" | "vegan" | "gluten-free";

export type MenuItem = {
  id?: string;
  name: string;
  desc: { de: string; en: string };
  price: number;
  img: string | null;
  category?: string;
  dietary?: Dietary[];
};

export type Restaurant = {
  id: string;
  slug?: string;
  name: string;
  tags: string[];
  rating: number;
  time: string;
  fee: string;
  img: string;
  status: "Open" | "Closed";
  area: string;
  address: string;
  phone: string;
  distanceKm: number;
  minOrder: number;
  about: { de: string; en: string };
  menu: MenuItem[];
  announcement_active?: boolean;
  announcement_bg_color?: string;
  announcement_text?: string;
  isShowcase?: boolean;
};

export const fallbackRestaurants: Restaurant[] = [
  {
    id: "verde-grain",
    name: "Verde & Grain",
    tags: ["Healthy", "Bowls", "Salads"],
    rating: 4.8,
    time: "20-30 min",
    fee: "€1.49",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&h=900&fit=crop",
    status: "Open",
    area: "Berlin Mitte",
    address: "Linienstraße 142, 10115 Berlin",
    phone: "+49 30 1234 5678",
    distanceKm: 2.5,
    minOrder: 15,
    about: {
      de: "Saisonale Bio-Bowls und Salate, frisch zubereitet aus regionalen Zutaten.",
      en: "Seasonal organic bowls and salads, freshly prepared from regional ingredients.",
    },
    announcement_active: true,
    announcement_bg_color: "primary",
    announcement_text: "All you can eat bowls on Mondays! 🥗",
    menu: [
      {
        name: "Tuscan Kale & Pecorino",
        desc: { de: "Bio-Grünkohl, Pecorino, Pinienkerne", en: "Organic kale, pecorino, pine nuts" },
        price: 14.50,
        img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop",
        category: "Bowls",
        dietary: ["vegetarian", "gluten-free"],
      },
      {
        name: "Mediterranean Quinoa",
        desc: { de: "Quinoa, Gurke, Tomate, Tahini", en: "Quinoa, cucumber, tomato, tahini" },
        price: 15.50,
        img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop",
        category: "Bowls",
        dietary: ["vegan", "gluten-free"],
      },
      {
        name: "Fig & Prosciutto",
        desc: { de: "Feigen, Prosciutto, Rucola, Balsamico", en: "Figs, prosciutto, arugula, balsamic" },
        price: 17.00,
        img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop",
        category: "Salads",
        dietary: ["gluten-free"],
      },
      {
        name: "Roasted Beet & Goat Cheese",
        desc: { de: "Rote Bete, Ziegenkäse, Walnüsse", en: "Roasted beets, goat cheese, walnuts" },
        price: 13.50,
        img: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400&h=400&fit=crop",
        category: "Salads",
        dietary: ["vegetarian", "gluten-free"],
      },
      {
        name: "Cold Pressed Green Juice",
        desc: { de: "Sellerie, Apfel, Ingwer, Zitrone", en: "Celery, apple, ginger, lemon" },
        price: 6.50,
        img: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=400&fit=crop",
        category: "Drinks",
        dietary: ["vegan", "gluten-free"],
      },
    ],
  },
  {
    id: "casa-limone",
    name: "Casa Limone",
    tags: ["Italian", "Pasta", "Antipasti"],
    rating: 4.6,
    time: "35-45 min",
    fee: "€2.49",
    img: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=1200&h=900&fit=crop",
    status: "Open",
    area: "Prenzlauer Berg",
    address: "Kollwitzstraße 58, 10405 Berlin",
    phone: "+49 30 2345 6789",
    distanceKm: 3.8,
    minOrder: 20,
    about: {
      de: "Authentische italienische Küche mit hausgemachter Pasta und Klassikern.",
      en: "Authentic Italian cuisine with homemade pasta and classics.",
    },
    menu: [
      {
        name: "Cacio e Pepe",
        desc: { de: "Tonnarelli, Pecorino Romano, schwarzer Pfeffer", en: "Tonnarelli, Pecorino Romano, black pepper" },
        price: 13.90,
        img: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&h=400&fit=crop",
        category: "Pasta",
        dietary: ["vegetarian"],
      },
      {
        name: "Tagliatelle al Ragù",
        desc: { de: "Bolognese-Ragù, Parmigiano", en: "Bolognese ragù, Parmigiano" },
        price: 15.90,
        img: "https://images.unsplash.com/photo-1572441713132-c542fc4fe282?w=400&h=400&fit=crop",
        category: "Pasta",
      },
      {
        name: "Antipasti Misti",
        desc: { de: "Wurstwaren, Oliven, Focaccia", en: "Cured meats, olives, focaccia" },
        price: 16.50,
        img: "https://images.unsplash.com/photo-1626202373052-9cb1490ff7e8?w=400&h=400&fit=crop",
        category: "Antipasti",
      },
      {
        name: "Burrata Pugliese",
        desc: { de: "Burrata, Kirschtomaten, Basilikum", en: "Burrata, cherry tomatoes, basil" },
        price: 12.00,
        img: "https://images.unsplash.com/photo-1633437756091-3acff8d92b62?w=400&h=400&fit=crop",
        category: "Antipasti",
        dietary: ["vegetarian", "gluten-free"],
      },
      {
        name: "Tiramisu Classico",
        desc: { de: "Mascarpone, Espresso, Savoiardi", en: "Mascarpone, espresso, ladyfingers" },
        price: 7.50,
        img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop",
        category: "Dolci",
        dietary: ["vegetarian"],
      },
    ],
  },
  {
    id: "miso-social",
    name: "Miso Social",
    tags: ["Japanese", "Sushi", "Ramen"],
    rating: 4.9,
    time: "25-40 min",
    fee: "€0.99",
    img: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=1200&h=900&fit=crop",
    status: "Closed",
    area: "Kreuzberg",
    address: "Oranienstraße 22, 10999 Berlin",
    phone: "+49 30 3456 7890",
    distanceKm: 1.2,
    minOrder: 10,
    about: {
      de: "Modernes Izakaya mit Ramen, Sushi und saisonalen Kleinigkeiten.",
      en: "Modern izakaya with ramen, sushi and seasonal bites.",
    },
    menu: [
      {
        name: "Tonkotsu Ramen",
        desc: { de: "Schweinebrühe, Chashu, weiches Ei", en: "Pork broth, chashu, soft egg" },
        price: 15.90,
        img: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400&h=400&fit=crop",
        category: "Ramen",
      },
      {
        name: "Spicy Miso Ramen",
        desc: { de: "Miso-Brühe, Chili-Öl, Mais", en: "Miso broth, chili oil, corn" },
        price: 14.90,
        img: "https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=400&h=400&fit=crop",
        category: "Ramen",
      },
      {
        name: "Salmon Nigiri (6 St.)",
        desc: { de: "Sashimi-Lachs, Sushi-Reis", en: "Sashimi salmon, sushi rice" },
        price: 12.50,
        img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=400&fit=crop",
        category: "Sushi",
        dietary: ["gluten-free"],
      },
      {
        name: "Spicy Tuna Maki",
        desc: { de: "Gelbflossen-Thunfisch, Chili-Mayo", en: "Yellowfin tuna, chili mayo" },
        price: 11.00,
        img: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=400&fit=crop",
        category: "Sushi",
      },
      {
        name: "Edamame",
        desc: { de: "Meersalz, Sesam", en: "Sea salt, sesame" },
        price: 5.50,
        img: "https://images.unsplash.com/photo-1564844536311-de546a28c87d?w=400&h=400&fit=crop",
        category: "Sides",
        dietary: ["vegan", "gluten-free"],
      },
    ],
  },
];

function mapRestaurant(r: any): Restaurant {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name || r.business_name || "Restaurant",
    tags: r.cuisine_type ? [r.cuisine_type] : [],
    rating: 4.5,
    time: "25-35 min",
    fee: r.delivery_fee != null ? `€${Number(r.delivery_fee).toFixed(2)}` : "€0.00",
    minOrder: Number(r.min_order_amount ?? 10),
    distanceKm: 2.0,
    status: r.is_active ? "Open" : "Closed",
    img: r.banner_image_url 
      ? (r.banner_image_url.startsWith('http') ? r.banner_image_url : supabase.storage.from('storefront-assets').getPublicUrl(r.banner_image_url).data.publicUrl)
      : "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200",
    area: r.city || "Berlin",
    address: r.business_address || "",
    phone: r.phone || "",
    about: { de: r.description || "", en: r.description || "" },
    menu: (r.restaurant_products || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      desc: { de: p.description || "", en: p.description || "" },
      price: (p.price_cents || 0) / 100,
      img: p.image_url 
        ? (p.image_url.startsWith('http') ? p.image_url : supabase.storage.from('restaurant-products').getPublicUrl(p.image_url).data.publicUrl)
        : null,
      category: p.category || "Menu",
      dietary: p.dietary_tags || [],
    })),
  };
}

function isSubscriptionBlocked(status: string | null): boolean {
  if (status === 'canceled' || status === 'unpaid') return true;
  return false;
}

export async function getRestaurants(): Promise<Restaurant[]> {
  const { data, error } = await supabase
    .from("restaurants")
    .select("id, name, slug, description, logo_url, banner_image_url, city, cuisine_type, service_areas, custom_domain, announcement_active, announcement_text, announcement_bg_color, is_published, accepts_cash, accepts_paypal, stripe_connect_status, accepts_delivery, accepts_pickup, certifications, delivery_fee, delivery_radius_km, min_order_amount, operating_hours, seat_capacity, subscription_status, subscriptions(current_period_end), restaurant_products(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching restaurants:", error);
  }

  const validData = (data || []).filter(r => {
    return !isSubscriptionBlocked(r.subscription_status);
  });

  const liveRestaurants = validData.map(mapRestaurant);
  const MIN_DISPLAY_COUNT = 6;
  
  if (liveRestaurants.length >= MIN_DISPLAY_COUNT) {
    return liveRestaurants;
  }

  const needed = MIN_DISPLAY_COUNT - liveRestaurants.length;
  const showcaseItems = fallbackRestaurants.slice(0, needed).map(r => ({
    ...r,
    isShowcase: true
  }));

  return [...liveRestaurants, ...showcaseItems];
}

export async function getRestaurant(slugOrId: string): Promise<Restaurant | undefined> {
  // Try by slug first (URL-based lookup), fallback to id
  const { data, error } = await supabase
    .from("restaurants")
    .select("id, name, slug, description, logo_url, banner_image_url, city, cuisine_type, service_areas, custom_domain, announcement_active, announcement_text, announcement_bg_color, is_published, accepts_cash, accepts_paypal, stripe_connect_status, accepts_delivery, accepts_pickup, certifications, delivery_fee, delivery_radius_km, min_order_amount, operating_hours, seat_capacity, subscription_status, subscriptions(current_period_end), restaurant_products(*)")
    .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
    .maybeSingle();

  if (!error && data) {
    if (isSubscriptionBlocked(data.subscription_status)) {
      return undefined;
    }
    return mapRestaurant(data);
  }

  const fallback = fallbackRestaurants.find((r) => r.id === slugOrId);
  if (fallback) {
    return { ...fallback, isShowcase: true };
  }
  return undefined;
}


