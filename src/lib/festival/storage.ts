import type { IFestivalStorage, FestivalShiftData } from "./types";

const STORAGE_PREFIX = "speisely_festival_shift_v1_";

/**
 * LocalStorage implementation of IFestivalStorage.
 * Persists shift transactions across browser refreshes and tab closures.
 * Exposes a clean interface for future migration to Supabase Cloud or Offline Sync.
 */
export class LocalStorageFestivalStorage implements IFestivalStorage {
  private getKey(restaurantId: string): string {
    return `${STORAGE_PREFIX}${restaurantId}`;
  }

  async loadShiftData(restaurantId: string): Promise<FestivalShiftData | null> {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(this.getKey(restaurantId));
      if (!raw) return null;
      const data = JSON.parse(raw) as FestivalShiftData;
      if (!data.orders || !Array.isArray(data.orders)) return null;
      return data;
    } catch (err) {
      console.error("[FestivalStorage] Failed to load shift data:", err);
      return null;
    }
  }

  async saveShiftData(restaurantId: string, data: FestivalShiftData): Promise<boolean> {
    if (typeof window === "undefined") return false;
    try {
      localStorage.setItem(this.getKey(restaurantId), JSON.stringify(data));
      return true;
    } catch (err) {
      console.error("[FestivalStorage] Failed to save shift data:", err);
      return false;
    }
  }

  async clearShiftData(restaurantId: string): Promise<boolean> {
    if (typeof window === "undefined") return false;
    try {
      localStorage.removeItem(this.getKey(restaurantId));
      return true;
    } catch (err) {
      console.error("[FestivalStorage] Failed to clear shift data:", err);
      return false;
    }
  }
}

export const defaultFestivalStorage = new LocalStorageFestivalStorage();
