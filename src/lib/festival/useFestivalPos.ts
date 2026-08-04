import { useState, useEffect, useCallback, useMemo } from "react";
import type {
  FestivalEventConfig,
  FestivalItem,
  FestivalOrder,
  FestivalShiftData,
  IFestivalStorage,
} from "./types";
import { defaultFestivalStorage } from "./storage";
import { trackEvent } from "@/utils/posthog";
import { toast } from "sonner";

export interface CartItemEntry {
  item: FestivalItem;
  quantity: number;
  notes?: string;
}

export interface UseFestivalPosOptions {
  config: FestivalEventConfig;
  storage?: IFestivalStorage;
}

export function useFestivalPos({ config, storage = defaultFestivalStorage }: UseFestivalPosOptions) {
  const [shiftData, setShiftData] = useState<FestivalShiftData>({
    shiftStartedAt: new Date().toISOString(),
    orders: [],
    lastOrderNumber: 0,
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [selectedNotes, setSelectedNotes] = useState<string>("");
  const [activeItemForCustomization, setActiveItemForCustomization] = useState<FestivalItem | null>(null);
  const [tableNumber, setTableNumber] = useState<string>("");

  // Active Multi-Item Cart for Current Customer
  const [cartItems, setCartItems] = useState<CartItemEntry[]>([]);

  // Load shift data on mount
  useEffect(() => {
    let isMounted = true;
    storage.loadShiftData(config.restaurantId).then((data) => {
      if (isMounted) {
        if (data) {
          setShiftData(data);
        } else {
          setShiftData({
            shiftStartedAt: new Date().toISOString(),
            orders: [],
            lastOrderNumber: 0,
          });
        }
        setIsLoaded(true);
        trackEvent("festival_started", { restaurantId: config.restaurantId, eventName: config.eventName });
      }
    });
    return () => {
      isMounted = false;
    };
  }, [config.restaurantId, config.eventName, storage]);

  // Persist shift data whenever it changes (after initial load)
  useEffect(() => {
    if (!isLoaded) return;
    storage.saveShiftData(config.restaurantId, shiftData).then((success) => {
      if (!success) {
        toast.error("Speicherwarnung: Schichtdaten konnten nicht gesichert werden.");
      }
    });
  }, [shiftData, isLoaded, config.restaurantId, storage]);

  // Calculate live shift KPIs
  const activeOrders = useMemo(() => {
    return shiftData.orders.filter((o) => o.status === "Recorded");
  }, [shiftData.orders]);

  const metrics = useMemo(() => {
    let totalCents = 0;
    let cashCents = 0;
    let cardCents = 0;

    for (const order of activeOrders) {
      totalCents += order.totalCents;
      if (order.paymentMethod === "cash") {
        cashCents += order.totalCents;
      } else {
        cardCents += order.totalCents;
      }
    }

    const orderCount = activeOrders.length;
    const avgOrderCents = orderCount > 0 ? Math.round(totalCents / orderCount) : 0;

    return {
      totalCents,
      cashCents,
      cardCents,
      orderCount,
      avgOrderCents,
    };
  }, [activeOrders]);

  // Itemized sales breakdown for Schichtabschluss modal
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

  // Add Item to Cart
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

  // Adjust Cart Quantity
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

  // Remove Item from Cart
  const removeFromCart = useCallback((itemId: string) => {
    setCartItems((prev) => prev.filter((entry) => entry.item.id !== itemId));
  }, []);

  // Clear Cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Checkout Current Cart (Creates a SINGLE order with all cart items!)
  const checkoutCart = useCallback(
    (paymentMethod: "cash" | "card" = "cash") => {
      if (cartItems.length === 0) return;

      const nextNum = shiftData.lastOrderNumber + 1;
      const formattedNum = `#${String(nextNum).padStart(3, "0")}`;
      const totalCents = cartItems.reduce((acc, e) => acc + e.item.priceCents * e.quantity, 0);

      const orderItems = cartItems.map((entry) => ({
        id: entry.item.id,
        name: entry.item.name,
        quantity: entry.quantity,
        priceCents: entry.item.priceCents,
        notes: entry.notes,
      }));

      const newOrder: FestivalOrder = {
        orderId: formattedNum,
        timestamp: new Date().toISOString(),
        restaurantId: config.restaurantId,
        paymentMethod,
        tableNumber: tableNumber.trim() || undefined,
        items: orderItems,
        totalCents,
        status: "Recorded",
      };

      setShiftData((prev) => ({
        ...prev,
        lastOrderNumber: nextNum,
        orders: [newOrder, ...prev.orders],
      }));

      // Clear active cart for next customer (keep table number sticky)
      setCartItems([]);

      const formattedPrice = (totalCents / 100).toFixed(2);
      toast.success(`Bestellung ${formattedNum} (${formattedPrice} €) erfolgreich abkassiert!`);

      trackEvent("festival_order_created", {
        restaurantId: config.restaurantId,
        orderId: formattedNum,
        totalCents,
        paymentMethod,
        itemCount: orderItems.reduce((a, b) => a + b.quantity, 0),
        tableNumber: tableNumber.trim() || undefined,
      });
    },
    [cartItems, shiftData.lastOrderNumber, config.restaurantId, tableNumber]
  );

  // Void single most recent active order
  const voidLastOrder = useCallback(() => {
    const lastActiveIndex = shiftData.orders.findIndex((o) => o.status === "Recorded");
    if (lastActiveIndex === -1) {
      toast.info("Keine aktiven Bestellungen zum Stornieren vorhanden.");
      return;
    }

    const orderToVoid = shiftData.orders[lastActiveIndex];

    setShiftData((prev) => {
      const updatedOrders = [...prev.orders];
      updatedOrders[lastActiveIndex] = {
        ...orderToVoid,
        status: "Voided",
      };
      return { ...prev, orders: updatedOrders };
    });

    toast.success(`Bestellung ${orderToVoid.orderId} wurde storniert.`);

    trackEvent("festival_order_voided", {
      restaurantId: config.restaurantId,
      orderId: orderToVoid.orderId,
    });
  }, [shiftData.orders, config.restaurantId]);

  // Reset shift data
  const resetShift = useCallback(async () => {
    await storage.clearShiftData(config.restaurantId);
    setShiftData({
      shiftStartedAt: new Date().toISOString(),
      orders: [],
      lastOrderNumber: 0,
    });
    setCartItems([]);
    toast.success("Schicht erfolgreich zurückgesetzt.");
    trackEvent("festival_shift_reset", { restaurantId: config.restaurantId });
  }, [config.restaurantId, storage]);

  return {
    isLoaded,
    shiftData,
    metrics,
    itemizedSales,
    cartItems,
    cartTotalCents,
    cartTotalQuantity,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    checkoutCart,
    tableNumber,
    setTableNumber,
    selectedQuantity,
    setSelectedQuantity,
    selectedNotes,
    setSelectedNotes,
    activeItemForCustomization,
    setActiveItemForCustomization,
    voidLastOrder,
    resetShift,
  };
}
