export type ServicePackage = {
  name: string;
  desc: { de: string; en: string };
  startingFrom: number;
  unit: { de: string; en: string };
  category?: string;
};

export type Planner = {
  id: string;
  name: string;
  tagline: { de: string; en: string };
  rating: number;
  reviewCount: number;
  since: number;
  cat: "wedding" | "corporate" | "private" | "ramadan" | "christmas" | "festival";
  img: string | null;
  gallery: string[];
  area: string | null;
  address: string | null;
  phone: string | null;
  minGuests: number;
  leadTimeDays: number;
  minBudget: number;
  startingPrice: number;
  verified: boolean;
  about: { de: string; en: string };
  packages: ServicePackage[];
  announcement_active?: boolean;
  announcement_bg_color?: string;
  announcement_text?: string;
  isShowcase?: boolean;
};

export const fallbackPlanners: Planner[] = [
  {
    id: "lumen-events",
    name: "Lumen Events",
    tagline: { de: "Designgetriebene Hochzeitsplanung", en: "Design-driven wedding planning" },
    rating: 4.9,
    reviewCount: 42,
    since: 2018,
    cat: "wedding",
    img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&h=900&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&fit=crop",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&fit=crop",
    ],
    area: "Berlin & Brandenburg",
    address: "Kurfürstendamm 12, 10719 Berlin",
    phone: "+49 30 1234 5678",
    minGuests: 50,
    leadTimeDays: 90,
    minBudget: 15000,
    startingPrice: 4900,
    verified: true,
    about: {
      de: "Designgetriebene Eventplanung für Hochzeiten — von Konzept bis Cleanup. Mit über 200 realisierten Hochzeiten wissen wir, worauf es ankommt.",
      en: "Design-driven event planning for weddings — from concept to cleanup. With over 200 weddings realized, we know what matters.",
    },
    announcement_active: true,
    announcement_bg_color: "destructive",
    announcement_text: "Only 2 dates remaining for Summer 2026! 💍",
    packages: [
      {
        name: "Full-Service Wedding Planning",
        desc: { de: "Designgetriebene Eventplanung für Hochzeiten — von Konzept bis Cleanup.", en: "Design-driven event planning for weddings — from concept to cleanup." },
        startingFrom: 4900,
        unit: { de: "ab", en: "from" },
      },
      {
        name: "Month-of Coordination",
        desc: { de: "Übernahme 4 Wochen vor dem Event, vollständige Koordination am Tag.", en: "Takeover 4 weeks before the event, full coordination on the day." },
        startingFrom: 1800,
        unit: { de: "ab", en: "from" },
      },
    ],
  },
  {
    id: "north-collective",
    name: "North Collective",
    tagline: { de: "Corporate Event Production", en: "Corporate Event Production" },
    rating: 4.8,
    reviewCount: 156,
    since: 2015,
    cat: "corporate",
    img: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=900&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&fit=crop",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?w=800&fit=crop",
    ],
    area: "DACH Region",
    address: "Friedrichstraße 200, 10117 Berlin",
    phone: "+49 30 2345 6789",
    minGuests: 100,
    leadTimeDays: 60,
    minBudget: 25000,
    startingPrice: 7500,
    verified: true,
    about: {
      de: "End-to-end Produktion für Corporate Events, Produktlaunches und Konferenzen. Von der ersten Idee bis zur finalen Abrechnung.",
      en: "End-to-end production for corporate events, product launches and conferences. From the first idea to the final billing.",
    },
    packages: [
      {
        name: "Conference Production",
        desc: { de: "Bühne, AV, Run-of-show, Lieferanten. End-to-end Produktion für Corporate Events.", en: "Stage, AV, run-of-show, suppliers. End-to-end production for corporate events." },
        startingFrom: 7500,
        unit: { de: "ab", en: "from" },
      },
      {
        name: "Product Launch Event",
        desc: { de: "Kreativkonzept, Location, Medien für Ihren perfekten Produktlaunch.", en: "Creative concept, location, media for your perfect product launch." },
        startingFrom: 6200,
        unit: { de: "ab", en: "from" },
      },
    ],
  },
  {
    id: "atelier-soiree",
    name: "Atelier Soirée",
    tagline: { de: "Intime, kuratierte Privatdinner", en: "Intimate, curated private dinners" },
    rating: 5.0,
    reviewCount: 28,
    since: 2021,
    cat: "private",
    img: "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&h=900&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&fit=crop",
    ],
    area: "Berlin",
    address: "Torstraße 100, 10119 Berlin",
    phone: "+49 30 3456 7890",
    minGuests: 10,
    leadTimeDays: 14,
    minBudget: 2000,
    startingPrice: 1800,
    verified: true,
    about: {
      de: "Intime, kuratierte Privatdinner — Konzept, Caterer-Matching und Tag-Koordination. Wir schaffen einzigartige Momente für Ihre Feiern.",
      en: "Intimate, curated private dinners — concept, caterer matching and day coordination. We create unique moments for your celebrations.",
    },
    packages: [
      {
        name: "Curated Private Dinner",
        desc: { de: "Intime, kuratierte Privatdinner — Konzept, Caterer-Matching und Tag-Koordination.", en: "Intimate, curated private dinners — concept, caterer matching and day coordination." },
        startingFrom: 1800,
        unit: { de: "ab", en: "from" },
      },
      {
        name: "Milestone Birthday Party",
        desc: { de: "Themed Setup mit Entertainment für besondere runde Geburtstage.", en: "Themed setup with entertainment for special milestone birthdays." },
        startingFrom: 2400,
        unit: { de: "ab", en: "from" },
      },
    ],
  },
];

import { supabase } from "@/integrations/supabase/client";

function mapPlanner(r: any): Planner {
  return {
    id: r.planner_id || r.id,
    name: r.business_name || "Event Planner",
    tagline: { de: r.description || "Event Planner", en: r.description || "Event Planner" },
    rating: 4.8,
    reviewCount: 0,
    since: 2024,
    cat: r.category || "wedding",
    img: r.banner_image_url || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200",
    gallery: r.gallery_images || [],
    area: r.service_area || "Berlin",
    address: r.address || "",
    phone: r.phone || "",
    minGuests: Number(r.min_guests || 50),
    leadTimeDays: Number(r.lead_time_days || 30),
    minBudget: Number(r.min_budget || 1000),
    startingPrice: Number(r.starting_price || 1000),
    verified: true,
    about: { de: r.description || "", en: r.description || "" },
    packages: r.packages || [],
  };
}

export async function getPlanners(): Promise<Planner[]> {
  const { data, error } = await supabase
    .from("planner_services")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching planners:", error);
  }

  const livePlanners = (data || []).map(mapPlanner);
  const MIN_DISPLAY_COUNT = 3;
  
  if (livePlanners.length >= MIN_DISPLAY_COUNT) {
    return livePlanners;
  }

  const needed = MIN_DISPLAY_COUNT - livePlanners.length;
  const showcaseItems = fallbackPlanners.slice(0, needed).map(p => ({
    ...p,
    isShowcase: true
  }));

  return [...livePlanners, ...showcaseItems];
}

export async function getPlanner(id: string): Promise<Planner | undefined> {
  const { data, error } = await supabase
    .from("planner_services")
    .select("*")
    .eq("planner_id", id)
    .maybeSingle();

  if (!error && data) {
    return mapPlanner(data);
  }

  const fallback = fallbackPlanners.find((p) => p.id === id);
  if (fallback) {
    return { ...fallback, isShowcase: true };
  }
  return undefined;
}

export type PromoCode = {
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
};

// Mock promo codes for Lumen Events
export const mockPromoCodes: Record<string, PromoCode[]> = {
  "lumen-events": [
    { code: "LUMEN10", discount_type: "percentage", discount_value: 10 },
    { code: "EARLYBIRD", discount_type: "fixed", discount_value: 100 },
  ]
};
