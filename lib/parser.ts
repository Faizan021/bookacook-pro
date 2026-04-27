/**
 * Logic Layer for Speisely Event Parsing
 */

const CITY_MAPPING: Record<string, string> = {
  berlin: "Berlin",
  hamburg: "Hamburg",
  munich: "Munich",
  münchen: "Munich",
  frankfurt: "Frankfurt",
  köln: "Cologne",
  cologne: "Cologne",
};

const EVENT_TYPE_MAPPING: Record<string, string> = {
  wedding: "Wedding",
  hochzeit: "Wedding",
  corporate: "Corporate",
  office: "Corporate",
  firma: "Corporate",
  birthday: "Birthday",
  geburtstag: "Birthday",
  ramadan: "Ramadan / Iftar",
};

export function parseHeroIntent(input: string) {
  if (!input) return { event: "Event", city: "City", guests: "Guest count", diet: "Preferred menu" };

  const text = input.toLowerCase();

  const city = Object.entries(CITY_MAPPING).find(([key]) => text.includes(key))?.[1] || "City";
  const event = Object.entries(EVENT_TYPE_MAPPING).find(([key]) => text.includes(key))?.[1] || "Event";
  const guestMatch = text.match(/(\d+)/);
  const guests = guestMatch ? `${guestMatch[0]} guests` : "Guest count";
  
  const diet = text.includes("vegan") ? "Vegan" 
             : text.includes("vegetar") ? "Vegetarian" 
             : "Preferred menu";

  return { event, city, guests, diet };
}
