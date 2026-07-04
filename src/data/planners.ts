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
  cat: "wedding" | "corporate" | "private" | "ramadan" | "christmas" | "festival" | "conference" | "seminar" | "concert" | "trade-show";
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
  {
    id: "expo-masters",
    name: "Expo Masters",
    tagline: { de: "Messe- & Konferenzplanung", en: "Trade Show & Conference Planning" },
    rating: 4.9,
    reviewCount: 88,
    since: 2012,
    cat: "conference",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=900&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&fit=crop",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&fit=crop",
    ],
    area: "Frankfurt & München",
    address: "Messeplatz 1, 60327 Frankfurt",
    phone: "+49 69 123456",
    minGuests: 200,
    leadTimeDays: 120,
    minBudget: 30000,
    startingPrice: 10000,
    verified: true,
    about: {
      de: "Ihr Spezialist für großangelegte Fachkonferenzen und Messeauftritte. Wir sorgen für einen reibungslosen Ablauf und professionelle Repräsentation.",
      en: "Your specialist for large-scale professional conferences and trade show appearances. We ensure smooth operations and professional representation.",
    },
    packages: [
      {
        name: "Full Conference Management",
        desc: { de: "Komplette Organisation von Kongressen inklusive Speaker-Management.", en: "Complete organization of congresses including speaker management." },
        startingFrom: 15000,
        unit: { de: "ab", en: "from" },
      },
    ],
  },
  {
    id: "sound-live-agency",
    name: "Sound Live Agency",
    tagline: { de: "Konzert & Festival Produktion", en: "Concert & Festival Production" },
    rating: 4.7,
    reviewCount: 210,
    since: 2010,
    cat: "concert",
    img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=900&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&fit=crop",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&fit=crop",
    ],
    area: "Bundesweit",
    address: "Reeperbahn 1, 20359 Hamburg",
    phone: "+49 40 987654",
    minGuests: 500,
    leadTimeDays: 180,
    minBudget: 50000,
    startingPrice: 20000,
    verified: true,
    about: {
      de: "Wir bringen die Bühne zum Beben. Von der Künstlerbetreuung bis zur Bühnentechnik organisieren wir Konzerte und Live-Shows auf höchstem Niveau.",
      en: "We make the stage shake. From artist management to stage technology, we organize concerts and live shows at the highest level.",
    },
    packages: [
      {
        name: "Live Show Production",
        desc: { de: "Komplette technische und organisatorische Umsetzung.", en: "Complete technical and organizational implementation." },
        startingFrom: 20000,
        unit: { de: "ab", en: "from" },
      },
    ],
  },
  {
    id: "workshop-wizards",
    name: "Workshop Wizards",
    tagline: { de: "Seminare & Teambuilding", en: "Seminars & Teambuilding" },
    rating: 4.9,
    reviewCount: 65,
    since: 2019,
    cat: "seminar",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=900&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&fit=crop",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&fit=crop",
    ],
    area: "Düsseldorf & NRW",
    address: "Königsallee 10, 40212 Düsseldorf",
    phone: "+49 211 555666",
    minGuests: 20,
    leadTimeDays: 14,
    minBudget: 2000,
    startingPrice: 1500,
    verified: true,
    about: {
      de: "Spezialisiert auf interaktive Workshops, Seminare und Teambuilding-Events. Wir schaffen Räume für Innovation und Zusammenarbeit.",
      en: "Specialized in interactive workshops, seminars, and teambuilding events. We create spaces for innovation and collaboration.",
    },
    packages: [
      {
        name: "Seminar Planning",
        desc: { de: "Location-Scouting, Catering und technisches Setup für Seminare.", en: "Location scouting, catering, and technical setup for seminars." },
        startingFrom: 1500,
        unit: { de: "ab", en: "from" },
      },
    ],
  }
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
  const MIN_DISPLAY_COUNT = fallbackPlanners.length; // Show all mock data if needed
  
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
  discount_type: "percentage" | "fixed" | "free_delivery" | "free_item" | "bogo";
  discount_value: number;
  applies_to_product_name?: string;
  min_order_value_cents?: number;
  free_item_name?: string;
  required_qty?: number;
  starts_at?: string;
  ends_at?: string;
};

// Mock promo codes for Lumen Events
export const mockPromoCodes: Record<string, PromoCode[]> = {
  "lumen-events": [
    { code: "LUMEN10", discount_type: "percentage", discount_value: 10 },
    { code: "EARLYBIRD", discount_type: "fixed", discount_value: 100 },
  ]
};
