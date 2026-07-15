export const EVENT_TYPES = [
  "hochzeit",
  "firmenevent",
  "geburtstag",
  "messe-event",
  "private-feier",
] as const;

export type EventType = typeof EVENT_TYPES[number];

export const isValidEventType = (slug: string): slug is EventType => {
  return EVENT_TYPES.includes(slug as EventType);
};

export const CATERING_CITIES = [
  "berlin",
  "hamburg",
  "muenchen",
  "koeln",
  "frankfurt",
] as const;

export type CateringCity = typeof CATERING_CITIES[number];

export const isValidCateringCity = (slug: string): slug is CateringCity => {
  return CATERING_CITIES.includes(slug as CateringCity);
};
