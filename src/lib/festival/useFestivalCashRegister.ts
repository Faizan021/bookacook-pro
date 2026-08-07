import { useState, useEffect, useCallback, useMemo } from "react";
import type {
  FestivalEventConfig,
  FestivalItem,
  FestivalOrder,
  FestivalShiftData,
} from "./types";
import {
  getActiveShiftIDB,
  getOrdersForShiftIDB,
  saveOrderIDB,
  saveShiftIDB,
  updateOrderStatusIDB,
  getSettingIDB,
  saveSettingIDB,
} from "./idbStorage";
import { toast } from "sonner";

export interface CartItemEntry {
  item: FestivalItem;
  quantity: number;
  notes?: string;
}

export interface UseFestivalCashRegisterOptions {
  config: FestivalEventConfig;
}

export function useFestivalCashRegister({ config }: UseFestivalCashRegisterOptions) {
  const [shiftData, setShiftData] = useState<FestivalShiftData | null>(null);
  const [orders, setOrders] = useState<FestivalOrder[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Online / Offline Network Status Indicator
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  // Operational Settings
  const [tableModeEnabled, setTableModeEnabled] = useState<boolean>(true);
  const [tableNumber, setTableNumber] = useState<string>("");

  // Double Checkout Guard State
  const [isCheckoutProcessing, setIsCheckoutProcessing] = useState<boolean>(false);

  // Active Customer Cart
  const [cartItems, setCartItems] = useState<CartItemEntry[]>([]);

  // Item Customization Transient State
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [selectedNotes, setSelectedNotes] = useState<string>("");
  const [activeItemForCustomization, setActiveItemForCustomization] = useState<FestivalItem | null>(null);

  // Listen to network status online/offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Load active shift & orders & settings from IndexedDB on mount
  useEffect(() => {
    let isMounted = true;

    async function initStorage() {
      try {
        // Load Table Mode setting
        const savedTableMode = await getSettingIDB("tableModeEnabled");
        if (isMounted && savedTableMode !== null) {
          setTableModeEnabled(Boolean(savedTableMode));
        }

        // Get Active Shift
        let activeShift = await getActiveShiftIDB(config.restaurantId);

        if (!activeShift) {
          const todayIso = new Date().toISOString();
          const todayDateStr = todayIso.split("T")[0]; // "YYYY-MM-DD"
          const newShiftId = `shift_${todayDateStr.replace(/-/g, "")}_${Date.now()}`;

          activeShift = {
            shiftId: newShiftId,
            operatingDate: todayDateStr,
            shiftStartedAt: todayIso,
            openingCashCents: 15000, // Default 150.00 € float
            restaurantId: config.restaurantId,
            lastOrderNumber: 0,
            status: "active",
          };

          await saveShiftIDB(activeShift);
        }

        const shiftOrders = await getOrdersForShiftIDB(activeShift.shiftId);

        if (isMounted) {
          setShiftData(activeShift);
          setOrders(shiftOrders);
          setIsLoaded(true);
        }
      } catch (err) {
        console.error("Cash Register storage init error:", err);
        if (isMounted) setIsLoaded(true);
      }
    }

    initStorage();

    return () => {
      isMounted = false;
    };
  }, [config.restaurantId]);

  // Toggle Table Mode Setting
  const setTableModeSetting = useCallback(async (enabled: boolean) => {
    setTableModeEnabled(enabled);
    if (!enabled) setTableNumber("");
    await saveSettingIDB("tableModeEnabled", enabled);
  }, []);

  // German Gastronomy Accounting Metrics
  const activeOrders = useMemo(() => {
    return orders.filter((o) => o.status === "completed");
  }, [orders]);

  const voidedOrders = useMemo(() => {
    return orders.filter((o) => o.status === "voided");
  }, [orders]);

  const metrics = useMemo(() => {
    const openingCashCents = shiftData?.openingCashCents || 0;

    let barUmsatzCents = 0; // Completed cash sales
    for (const order of activeOrders) {
      barUmsatzCents += order.totalCents;
    }

    let stornierungenCents = 0; // Voided amount for audit transparency
    for (const order of voidedOrders) {
      stornierungenCents += order.totalCents;
    }

    const sollKassenbestandCents = openingCashCents + barUmsatzCents;
    const orderCount = activeOrders.length;
    const avgOrderCents = orderCount > 0 ? Math.round(barUmsatzCents / orderCount) : 0;

    return {
      openingCashCents,
      barUmsatzCents,
      stornierungenCents,
      sollKassenbestandCents,
      orderCount,
      avgOrderCents,
    };
  }, [activeOrders, voidedOrders, shiftData?.openingCashCents]);

  // Itemized sales breakdown for Schichtbericht
  const itemizedSales = useMemo(() => {
    const itemMap: Record<string, { name: string; quantity: number; totalCents: number }> = {};

    for (const order of activeOrders) {
      for (const item of order.items) {
        if (!itemMap[item.id]) {
          itemMap[item.id] = { name: item.name, quantity: 0, totalCents: 0 };
        }
        itemMap[item.id].quantity += item.quantity;
        itemMap[item.id].totalCents += item.priceCents * item.quantity;
      }
    }

    return Object.values(itemMap).sort((a, b) => b.quantity - a.quantity);
  }, [activeOrders]);

  // Cart Calculations
  const cartTotalCents = useMemo(() => {
    return cartItems.reduce((acc, entry) => acc + entry.item.priceCents * entry.quantity, 0);
  }, [cartItems]);

  const cartTotalQuantity = useMemo(() => {
    return cartItems.reduce((acc, entry) => acc + entry.quantity, 0);
  }, [cartItems]);

  // Cart Actions
  const addToCart = useCallback((item: FestivalItem, quantity = 1, notes?: string) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (entry) => entry.item.id === item.id && entry.notes === (notes || undefined)
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { item, quantity, notes: notes || undefined }];
    });
  }, []);

  const updateCartQuantity = useCallback((itemId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((entry) => {
          if (entry.item.id === itemId) {
            const newQty = entry.quantity + delta;
            return newQty > 0 ? { ...entry, quantity: newQty } : null;
          }
          return entry;
        })
        .filter(Boolean) as CartItemEntry[];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems((prev) => prev.filter((entry) => entry.item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setTableNumber(""); // Reset table on cart clear
  }, []);

  // Checkout Workflow: Persist to IndexedDB BEFORE payment success, Double-Checkout Guarded
  const checkoutCart = useCallback(async (): Promise<{ orderId: string; totalCents: number } | null> => {
    if (cartItems.length === 0 || isCheckoutProcessing || !shiftData) {
      return null;
    }

    setIsCheckoutProcessing(true);

    try {
      // Transaction-safe sequential order number calculation
      const maxExistingNum = orders.reduce((max, o) => Math.max(max, o.orderNumber), 0);
      const nextNum = Math.max(maxExistingNum, shiftData.lastOrderNumber, 0) + 1;
      const formattedNum = `#${String(nextNum).padStart(3, "0")}`;
      const totalCents = cartItems.reduce((acc, e) => acc + e.item.priceCents * e.quantity, 0);

      const uniqueId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const orderItems = cartItems.map((entry) => ({
        id: entry.item.id,
        name: entry.item.name,
        quantity: entry.quantity,
        priceCents: entry.item.priceCents,
        notes: entry.notes,
      }));

      const newOrder: FestivalOrder = {
        id: uniqueId,
        orderNumber: nextNum,
        orderId: formattedNum,
        shiftId: shiftData.shiftId,
        operatingDate: shiftData.operatingDate,
        timestamp: new Date().toISOString(),
        restaurantId: config.restaurantId,
        paymentMethod: "cash",
        tableNumber: tableNumber.trim() || undefined,
        items: orderItems,
        totalCents,
        status: "completed",
        syncStatus: "local_only",
        restaurantNameSnapshot: config.restaurantName,
        eventNameSnapshot: `${config.eventName} ${config.eventNameSecondary || ""}`.trim(),
      };

      // 1. MUST PERSIST TO INDEXEDDB BEFORE SHOWING SUCCESS
      const savedSuccess = await saveOrderIDB(newOrder);

      if (!savedSuccess) {
        toast.error("Speicherfehler: Bestellung konnte nicht in der lokalen Datenbank gesichert werden!");
        setIsCheckoutProcessing(false);
        return null;
      }

      // Update shift lastOrderNumber
      const updatedShift: FestivalShiftData = {
        ...shiftData,
        lastOrderNumber: nextNum,
      };
      await saveShiftIDB(updatedShift);

      // Update React state
      setShiftData(updatedShift);
      setOrders((prev) => [newOrder, ...prev]);

      // Reset cart and auto-reset table number immediately
      setCartItems([]);
      setTableNumber("");

      const formattedPrice = (totalCents / 100).toFixed(2);
      toast.success(`Bestellung ${formattedNum} (${formattedPrice} €) abkassiert!`);

      return { orderId: formattedNum, totalCents };
    } catch (err) {
      console.error("Checkout process error:", err);
      toast.error("Abkassieren fehlgeschlagen. Bitte erneut versuchen.");
      return null;
    } finally {
      setIsCheckoutProcessing(false);
    }
  }, [cartItems, isCheckoutProcessing, shiftData, orders, config, tableNumber]);

  // Non-Destructive Voiding
  const voidLastOrder = useCallback(async () => {
    const lastActive = orders.find((o) => o.status === "completed");
    if (!lastActive) {
      toast.info("Keine aktiven Bestellungen zum Stornieren vorhanden.");
      return;
    }

    const voidedAt = new Date().toISOString();
    const success = await updateOrderStatusIDB(lastActive.id, "voided", voidedAt);

    if (success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === lastActive.id ? { ...o, status: "voided", voidedAt } : o))
      );
      toast.success(`Bestellung ${lastActive.orderId} wurde storniert.`);
    } else {
      toast.error("Stornierung fehlgeschlagen.");
    }
  }, [orders]);

  // Shift Lifecycle: Start New Shift
  const startNewShift = useCallback(
    async (openingCashCents: number) => {
      const todayIso = new Date().toISOString();
      const todayDateStr = todayIso.split("T")[0];
      const newShiftId = `shift_${todayDateStr.replace(/-/g, "")}_${Date.now()}`;

      const newShift: FestivalShiftData = {
        shiftId: newShiftId,
        operatingDate: todayDateStr,
        shiftStartedAt: todayIso,
        openingCashCents,
        restaurantId: config.restaurantId,
        lastOrderNumber: 0,
        status: "active",
      };

      await saveShiftIDB(newShift);
      setShiftData(newShift);
      setOrders([]);
      setCartItems([]);
      setTableNumber("");
      toast.success(`Neue Schicht gestartet (Start-Kassenbestand: ${(openingCashCents / 100).toFixed(2)} €)`);
    },
    [config.restaurantId]
  );

  // Shift Lifecycle: Close Current Shift
  const closeCurrentShift = useCallback(async () => {
    if (!shiftData) return;

    const endedAt = new Date().toISOString();
    const closedShift: FestivalShiftData = {
      ...shiftData,
      shiftEndedAt: endedAt,
      status: "closed",
    };

    await saveShiftIDB(closedShift);
    setShiftData(closedShift);
    toast.success("Schicht wurde erfolgreich beendet & abgeschlossen.");
  }, [shiftData]);

  return {
    isLoaded,
    isOnline,
    shiftData,
    orders,
    metrics,
    itemizedSales,
    cartItems,
    cartTotalCents,
    cartTotalQuantity,
    tableModeEnabled,
    setTableModeSetting,
    tableNumber,
    setTableNumber,
    isCheckoutProcessing,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    checkoutCart,
    selectedQuantity,
    setSelectedQuantity,
    selectedNotes,
    setSelectedNotes,
    activeItemForCustomization,
    setActiveItemForCustomization,
    voidLastOrder,
    startNewShift,
    closeCurrentShift,
  };
}
