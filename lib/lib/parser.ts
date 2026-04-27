/**
 * Logic Layer for Speisely Event Parsing
 * This handles the extraction of intent from raw user strings.
 */

const CITY_MAPPING: Record<string, string> = {
  berlin: "Berlin",
  hamburg: "Hamburg",
  munich: "Munich",
  münchen: "Munich",
  frankfurt: "Frankfurt",
  köln: "Cologne",
  cologne: "Cologne",
  düsseldorf: "Düsseldorf",
};

const EVENT_TYPE_MAPPING: Record<string, string> = {
  wedding: "Wedding",
  hochzeit: "Wedding",
  corporate: "Corporate",
  office: "Corporate",
  firma: "Corporate",
  business: "Corporate",
  birthday: "Birthday",
  geburtstag: "Birthday",
  ramadan: "Ramadan / Iftar",
  iftar: "Ramadan / Iftar",
  private: "Private Party",
};

export function parseHeroIntent(input: string) {
  if (!input) return { event: "Event", city: "City", guests: "Guest count", diet: "Preferred menu" };

  const text = input.toLowerCase();

  // 1. Extract City
  const city = Object.entries(CITY_MAPPING).find(([key]) => 
    text.includes(key)
  )?.[1] || "City";

  // 2. Extract Event Type
  const event = Object.entries(EVENT_TYPE_MAPPING).find(([key]) => 
    text.includes(key)
  )?.[1] || "Event";

  // 3. Extract Guest Count (Looks for numbers)
  const guestMatch = text.match(/(\d+)/);
  const guests = guestMatch ? `${guestMatch[0]} guests` : "Guest count";

  // 4. Extract Dietary Preferences
  const diet = text.includes("vegan") ? "Vegan" 
             : text.includes("vegetar") ? "Vegetarian" 
             : text.includes("halal") ? "Halal" 
             : text.includes("gluten") ? "Gluten-free" 
             : "Preferred menu";

  return { event, city, guests, diet };
}
