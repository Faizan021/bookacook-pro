/**
 * Speisely Festival Mode — Shared Type Definitions & Schemas
 */

export type FestivalOrderState = "Recorded" | "Voided";

export interface FestivalItem {
  id: string;
  name: string;
  priceCents: number;
  category?: "food" | "drink" | "special" | string;
  icon?: string; // Emoji or icon identifier e.g. "🥪", "🍺"
  badge?: string; // e.g. "🔥 Best Seller", "⭐ Popular"
  imageUrl?: string;
  description?: string;
}

export interface FestivalOrderItem {
  id: string;
  name: string;
  quantity: number;
  priceCents: number;
  notes?: string;
}

export interface FestivalOrder {
  orderId: string; // e.g. "#001"
  timestamp: string; // ISO string
  restaurantId: string;
  userId?: string;
  paymentMethod: "cash" | "card";
  items: FestivalOrderItem[];
  totalCents: number;
  status: FestivalOrderState;
}

export interface FestivalShiftData {
  shiftStartedAt: string; // ISO string
  orders: FestivalOrder[];
  lastOrderNumber: number;
}

export interface FestivalEventConfig {
  restaurantId: string;
  restaurantName: string;
  eventName: string;
  eventNameSecondary?: string;
  logoUrl?: string;
  defaultLanguage: "de" | "en";
  pinnedItemIds: string[];
  customItems?: FestivalItem[];
}

export interface IFestivalStorage {
  loadShiftData(restaurantId: string): Promise<FestivalShiftData | null>;
  saveShiftData(restaurantId: string, data: FestivalShiftData): Promise<boolean>;
  clearShiftData(restaurantId: string): Promise<boolean>;
}
