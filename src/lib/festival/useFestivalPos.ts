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

  // Process a new transaction (Instant 2-tap fast path or customized path)
  const recordOrder = useCallback(
    (item: FestivalItem, paymentMethod: "cash" | "card", quantity = 1, notes?: string) => {
      const nextNum = shiftData.lastOrderNumber + 1;
      const formattedNum = `#${String(nextNum).padStart(3, "0")}`;
      const itemTotal = item.priceCents * quantity;

      const newOrder: FestivalOrder = {
        orderId: formattedNum,
        timestamp: new Date().toISOString(),
        restaurantId: config.restaurantId,
        paymentMethod,
        items: [
          {
            id: item.id,
            name: item.name,
            quantity,
            priceCents: item.priceCents,
            notes: notes || undefined,
          },
        ],
        totalCents: itemTotal,
        status: "Recorded",
      };

      setShiftData((prev) => ({
        ...prev,
        lastOrderNumber: nextNum,
        orders: [newOrder, ...prev.orders],
      }));

      // Reset transient options
      setSelectedQuantity(1);
      setSelectedNotes("");
      setActiveItemForCustomization(null);

      // Track analytics
      trackEvent("festival_order_created", {
        restaurantId: config.restaurantId,
        orderId: formattedNum,
        totalCents: itemTotal,
        paymentMethod,
        itemCount: quantity,
      });
    },
    [shiftData.lastOrderNumber, config.restaurantId]
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

  // Reset shift data (with double confirmation)
  const resetShift = useCallback(async () => {
    const success = await storage.clearShiftData(config.restaurantId);
    setShiftData({
      shiftStartedAt: new Date().toISOString(),
      orders: [],
      lastOrderNumber: 0,
    });
    if (success) {
      toast.success("Schicht erfolgreich zurückgesetzt.");
    }
    trackEvent("festival_shift_reset", { restaurantId: config.restaurantId });
  }, [config.restaurantId, storage]);

  return {
    isLoaded,
    shiftData,
    metrics,
    itemizedSales,
    selectedQuantity,
    setSelectedQuantity,
    selectedNotes,
    setSelectedNotes,
    activeItemForCustomization,
    setActiveItemForCustomization,
    recordOrder,
    voidLastOrder,
    resetShift,
  };
}
