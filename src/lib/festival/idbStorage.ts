/**
 * Schnitzel Schmiede Festival Cash Register — IndexedDB Persistence Engine
 * Database: SchnitzelSchmiedeCashRegisterDB (v1)
 * Source of truth for local shifts, transactions, void states, and settings.
 */

import type { FestivalShiftData, FestivalOrder } from "./types";

const DB_NAME = "SchnitzelSchmiedeCashRegisterDB";
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported in this environment"));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Shifts Store
      if (!db.objectStoreNames.contains("shifts")) {
        db.createObjectStore("shifts", { keyPath: "shiftId" });
      }

      // Orders Store
      if (!db.objectStoreNames.contains("orders")) {
        const orderStore = db.createObjectStore("orders", { keyPath: "id" });
        orderStore.createIndex("shiftId", "shiftId", { unique: false });
        orderStore.createIndex("operatingDate", "operatingDate", { unique: false });
        orderStore.createIndex("syncStatus", "syncStatus", { unique: false });
      }

      // Settings Store
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

// ----------------------------------------------------
// Shift Storage Operations
// ----------------------------------------------------

export async function saveShiftIDB(shift: FestivalShiftData): Promise<boolean> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("shifts", "readwrite");
      const store = tx.objectStore("shifts");
      const req = store.put(shift);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error("IndexedDB saveShift error:", err);
    return false;
  }
}

export async function getActiveShiftIDB(restaurantId: string): Promise<FestivalShiftData | null> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("shifts", "readonly");
      const store = tx.objectStore("shifts");
      const req = store.getAll();
      req.onsuccess = () => {
        const shifts = (req.result as FestivalShiftData[]) || [];
        // Active shift for restaurant or last created active shift
        const active = shifts
          .filter((s) => s.restaurantId === restaurantId && s.status === "active")
          .sort((a, b) => new Date(b.shiftStartedAt).getTime() - new Date(a.shiftStartedAt).getTime())[0];
        resolve(active || null);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error("IndexedDB getActiveShift error:", err);
    return null;
  }
}

export async function getShiftHistoryIDB(restaurantId: string): Promise<FestivalShiftData[]> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("shifts", "readonly");
      const store = tx.objectStore("shifts");
      const req = store.getAll();
      req.onsuccess = () => {
        const shifts = (req.result as FestivalShiftData[]) || [];
        resolve(shifts.filter((s) => s.restaurantId === restaurantId));
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error("IndexedDB getShiftHistory error:", err);
    return [];
  }
}

// ----------------------------------------------------
// Order Storage Operations (Persist Before Payment Success)
// ----------------------------------------------------

export async function saveOrderIDB(order: FestivalOrder): Promise<boolean> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("orders", "readwrite");
      const store = tx.objectStore("orders");
      const req = store.put(order);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error("IndexedDB saveOrder error:", err);
    return false;
  }
}

export async function getOrdersForShiftIDB(shiftId: string): Promise<FestivalOrder[]> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("orders", "readonly");
      const store = tx.objectStore("orders");
      const index = store.index("shiftId");
      const req = index.getAll(shiftId);
      req.onsuccess = () => {
        const orders = (req.result as FestivalOrder[]) || [];
        // Sort newest first
        orders.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        resolve(orders);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error("IndexedDB getOrdersForShift error:", err);
    return [];
  }
}

export async function updateOrderStatusIDB(
  orderId: string,
  status: "completed" | "voided",
  voidedAt?: string
): Promise<boolean> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("orders", "readwrite");
      const store = tx.objectStore("orders");
      const req = store.get(orderId);
      req.onsuccess = () => {
        const order = req.result as FestivalOrder | undefined;
        if (!order) {
          resolve(false);
          return;
        }
        order.status = status;
        if (voidedAt) order.voidedAt = voidedAt;
        const putReq = store.put(order);
        putReq.onsuccess = () => resolve(true);
        putReq.onerror = () => reject(putReq.error);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error("IndexedDB updateOrderStatus error:", err);
    return false;
  }
}

// ----------------------------------------------------
// Settings & Full Backup Operations
// ----------------------------------------------------

export async function saveSettingIDB(key: string, value: any): Promise<boolean> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("settings", "readwrite");
      const store = tx.objectStore("settings");
      const req = store.put({ key, value });
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error("IndexedDB saveSetting error:", err);
    return false;
  }
}

export async function getSettingIDB(key: string): Promise<any> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("settings", "readonly");
      const store = tx.objectStore("settings");
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ? req.result.value : null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error("IndexedDB getSetting error:", err);
    return null;
  }
}

export async function getAllDataBackupIDB(): Promise<{
  schemaVersion: number;
  backupCreatedAt: string;
  databaseName: string;
  shifts: FestivalShiftData[];
  orders: FestivalOrder[];
}> {
  const db = await getDB();
  const shifts: FestivalShiftData[] = await new Promise((resolve) => {
    const tx = db.transaction("shifts", "readonly");
    const req = tx.objectStore("shifts").getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => resolve([]);
  });

  const orders: FestivalOrder[] = await new Promise((resolve) => {
    const tx = db.transaction("orders", "readonly");
    const req = tx.objectStore("orders").getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => resolve([]);
  });

  return {
    schemaVersion: DB_VERSION,
    backupCreatedAt: new Date().toISOString(),
    databaseName: DB_NAME,
    shifts,
    orders,
  };
}
