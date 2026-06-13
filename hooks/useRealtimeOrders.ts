"use client";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
export function useRealtimeOrders(restaurantId: string | undefined, onNewOrder: () => void) {
  useEffect(() => {
    if (!restaurantId) return;
    const supabase = createClient();
    const channel = supabase
      .channel("restaurant_orders_changes")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "restaurant_orders",
        filter: `restaurant_id=eq.${restaurantId}`
      }, () => {
        onNewOrder();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [restaurantId, onNewOrder]);
}
