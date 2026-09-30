/**
 * Speisely System 1 Decision Engine
 * 
 * Inspired by Laya & Jev non-autoregressive decision models.
 * Performs deterministic, sub-millisecond typed intent classification,
 * entity extraction, and lead scoring without token-by-token generation overhead.
 */

// Major German Cities and PLZ Hubs
export const GERMAN_CITIES = [
  "berlin", "münchen", "muenchen", "hamburg", "köln", "koeln", "frankfurt",
  "stuttgart", "düsseldorf", "duesseldorf", "dortmund", "essen", "leipzig",
  "dresden", "hannover", "nürnberg", "nuernberg", "duisburg", "bochum",
  "wuppertal", "bielefeld", "bonn", "münster", "muenster", "karlsruhe",
  "mannheim", "augsburg", "wiesbaden", "mönchengladbach", "moenchengladbach",
  "braunschweig", "chemnitz", "kiel", "aachen", "halle", "magdeburg",
  "freiburg", "krefeld", "lübeck", "luebeck", "oberhausen", "erfurt",
  "mainz", "rostock", "kassel", "hagen", "saarbrücken", "potsdam", "prag", "prague"
];

// Catering & Group Keywords
export const CATERING_KEYWORDS = [
  "catering", "caterer", "buffet", "fingerfood", "firmenfeier", "firmenevent",
  "business lunch", "office catering", "mittagessen firma", "platten",
  "canapés", "flying buffet", "messe", "messecatering", "tagung", "seminar",
  "jubiläum", "sommerfest", "weihnachtsfeier", "corporate", "partyservice",
  "großbestellung", "gruppe", "geburtstag", "hochzeit", "hochzeitscatering",
  "polterabend", "taufe", "konfirmation", "schulverpflegung", "menü", "menue"
];

// Event Planner Keywords
export const PLANNER_KEYWORDS = [
  "eventplaner", "event planer", "event planning", "hochzeitsplaner",
  "wedding planner", "location gesucht", "ganzes event", "komplettplanung",
  "eventagentur", "agentur", "organisation", "moderation", "deko", "dekoration",
  "technik", "bühne", "full service event", "eventmanagement"
];

// Common Cuisines & Dietary Tags
export const CUISINES = [
  "vegan", "vegetarisch", "vegetarian", "halal", "kosher", "glutenfrei",
  "laktosefrei", "burger", "smashburger", "pizza", "sushi", "pasta",
  "italienisch", "italian", "asiatisch", "asian", "türkisch", "tuerkisch",
  "orientalisch", "syrisch", "jemenitisch", "afghanisch", "koreanisch",
  "bbq", "barbecue", "grill", "käsekuchen", "cheesecake", "schnitzel", "tapas"
];

export interface ExtractedEntities {
  location?: string;
  guests?: number;
  cuisine?: string;
  isB2B: boolean;
  rawQuery: string;
}

export interface System1Classification {
  intent: "B2C" | "B2B";
  vertical: "restaurants" | "catering" | "events";
  parameters: {
    location?: string;
    guests?: number;
    cuisine?: string;
  };
  confidence: number;
  engine: "system1_reflex" | "system2_fallback";
  latencyMs: number;
}

/**
 * System 1 Fast-Path Decision & Entity Extractor (Sub-5ms Execution)
 */
export function classifyWithSystem1(query: string): System1Classification {
  const start = performance.now();
  const clean = query.trim().toLowerCase();

  // 1. Extract Guest Count (e.g. "50 personen", "30 gäste", "100 pax", "für 25 leute")
  let guests: number | undefined;
  const guestMatch = clean.match(/(\d+)\s*(personen|person|gäste|gaeste|gast|pax|leute|mitarbeiter)/i);
  if (guestMatch) {
    guests = parseInt(guestMatch[1], 10);
  }

  // 2. Extract Location
  let location: string | undefined;
  for (const city of GERMAN_CITIES) {
    // Match whole words or preceded by 'in', 'bei', 'nahe'
    const cityRegex = new RegExp(`\\b${city}\\b`, "i");
    if (cityRegex.test(clean)) {
      // Normalize city display name
      location = city.charAt(0).toUpperCase() + city.slice(1);
      if (location === "Koeln") location = "Köln";
      if (location === "Muenchen") location = "München";
      if (location === "Duesseldorf") location = "Düsseldorf";
      if (location === "Nuernberg") location = "Nürnberg";
      if (location === "Moenchengladbach") location = "Mönchengladbach";
      if (location === "Luebeck") location = "Lübeck";
      break;
    }
  }

  // 3. Extract Cuisine / Food Style
  let cuisine: string | undefined;
  for (const c of CUISINES) {
    if (clean.includes(c)) {
      cuisine = c.charAt(0).toUpperCase() + c.slice(1);
      break;
    }
  }

  // 4. Intent & Vertical Scoring (Non-autoregressive probability weights)
  let cateringScore = 0;
  let plannerScore = 0;
  let restaurantScore = 0;

  // Guest count strongly indicates Catering or Events
  if (guests && guests >= 10) {
    cateringScore += 45;
  }
  if (guests && guests >= 80) {
    plannerScore += 30;
  }

  // Check Catering Keywords
  for (const kw of CATERING_KEYWORDS) {
    if (clean.includes(kw)) {
      cateringScore += 35;
    }
  }

  // Check Planner Keywords
  for (const kw of PLANNER_KEYWORDS) {
    if (clean.includes(kw)) {
      plannerScore += 50;
    }
  }

  // Check B2C Immediate food ordering hints
  if (clean.includes("bestellen") || clean.includes("liefern") || clean.includes("abholen") || clean.includes("hunger") || clean.includes("jetzt")) {
    restaurantScore += 25;
  }

  // Default baseline
  restaurantScore += 10;

  // 5. Final Decision Projection
  let intent: "B2C" | "B2B" = "B2C";
  let vertical: "restaurants" | "catering" | "events" = "restaurants";
  let maxScore = restaurantScore;

  if (plannerScore > cateringScore && plannerScore > restaurantScore) {
    intent = "B2B";
    vertical = "events";
    maxScore = plannerScore;
  } else if (cateringScore >= plannerScore && cateringScore > restaurantScore) {
    intent = "B2B";
    vertical = "catering";
    maxScore = cateringScore;
  } else {
    intent = "B2C";
    vertical = "restaurants";
  }

  const confidence = Math.min(1.0, Math.max(0.4, maxScore / 60));
  const latencyMs = Number((performance.now() - start).toFixed(2));

  return {
    intent,
    vertical,
    parameters: {
      location,
      guests,
      cuisine,
    },
    confidence,
    engine: "system1_reflex",
    latencyMs,
  };
}

/**
 * High-Speed B2B Lead Scoring Engine (<1ms)
 */
export function scoreB2BLead(data: {
  businessType?: string;
  websiteUrl?: string;
  guestCount?: number;
  budget?: number;
  message?: string;
}): { score: number; priority: "standard" | "high" | "vip"; signals: string[] } {
  let score = 30; // base
  const signals: string[] = [];

  if (data.businessType === "caterer" || data.businessType === "event_planner") {
    score += 25;
    signals.push("B2B Hospitality Vendor");
  }

  if (data.budget && data.budget >= 2500) {
    score += 25;
    signals.push("High-Ticket Budget (>€2.5k)");
  }

  if (data.guestCount && data.guestCount >= 50) {
    score += 15;
    signals.push("Large Event Scale (50+ Pax)");
  }

  if (data.websiteUrl && data.websiteUrl.includes(".")) {
    score += 10;
    signals.push("Verified Domain Provided");
  }

  let priority: "standard" | "high" | "vip" = "standard";
  if (score >= 75) priority = "vip";
  else if (score >= 50) priority = "high";

  return {
    score: Math.min(100, score),
    priority,
    signals,
  };
}
