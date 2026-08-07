/**
 * Schnitzel Schmiede Festival Cash Register — Shared Type Definitions & Schemas
 * Cash-Only Standalone Operational Specification
 */

export type FestivalOrderStatus = "completed" | "voided";

export interface FestivalItem {
  id: string;
  name: string;
  priceCents: number;
  category?: "food" | "drink" | "special" | string;
  icon?: string; // Emoji e.g. "🥪", "🍺"
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
  id: string; // Immutable unique identifier e.g. "ord_178584391"
  orderNumber: number; // Sequential integer e.g. 12
  orderId: string; // Formatted visible string e.g. "#012"
  shiftId: string; // Parent shift ID
  operatingDate: string; // Business date e.g. "2026-08-07"
  timestamp: string; // ISO string
  restaurantId: string;
  paymentMethod: "cash"; // Pilot is strictly cash-only
  tableNumber?: string; // e.g. "Tisch 4", optional
  items: FestivalOrderItem[]; // Immutable historical snapshot
  totalCents: number;
  status: FestivalOrderStatus;
  voidedAt?: string;
  syncStatus: "local_only";
  restaurantNameSnapshot: string;
  eventNameSnapshot: string;
}

export interface FestivalShiftData {
  shiftId: string; // e.g. "shift_20260807_0900"
  shiftNumber: string; // e.g. "Schicht #20260807-01"
  operatingDate: string; // e.g. "2026-08-07"
  shiftStartedAt: string; // ISO string
  shiftEndedAt?: string; // ISO string
  openingCashCents: number; // Anfangskassenbestand float
  countedCashCents?: number; // Gezählter Ist-Kassenbestand
  differenceCents?: number; // Zähldifferenz (Ist - Soll)
  restaurantId: string;
  lastOrderNumber: number; // Highest order number allocated in shift
  status: "active" | "closed";
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
  tableModeEnabled?: boolean;
}
