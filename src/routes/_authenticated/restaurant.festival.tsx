import { createFileRoute, redirect } from "@tanstack/react-router";
import { FestivalCashRegister } from "@/components/festival/FestivalCashRegister";
import type { FestivalEventConfig, FestivalItem } from "@/lib/festival/types";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/restaurant/festival")({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw redirect({ to: "/auth" });
    }
  },
  head: () => ({
    meta: [{ title: "Festival Cash Register — Standalonemodus" }],
  }),
  component: RestaurantFestivalProductionPage,
});

function RestaurantFestivalProductionPage() {
  const config: FestivalEventConfig = {
    restaurantId: "restaurant-partner-festival",
    restaurantName: "Mein Restaurant",
    eventName: "Festival & Event Mode",
    eventNameSecondary: "Deutschland",
    defaultLanguage: "de",
    pinnedItemIds: [],
  };

  const items: FestivalItem[] = [
    {
      id: "p1",
      name: "Hauptgericht / Special",
      priceCents: 1000,
      category: "food",
      icon: "🍲",
      badge: "🔥 Best Seller",
      description: "Tages-Special am Event-Stand",
    },
    {
      id: "p2",
      name: "Beilage / Snack",
      priceCents: 400,
      category: "food",
      icon: "🍟",
      description: "Frisch zubereitete Beilage",
    },
    {
      id: "p3",
      name: "Erfrischungsgetränk 0.5L",
      priceCents: 350,
      category: "drink",
      icon: "🥤",
      description: "Kühles Getränk im Becher",
    },
    {
      id: "p4",
      name: "Bier / Special 0.5L",
      priceCents: 450,
      category: "drink",
      icon: "🍺",
      description: "Ausschank am Stand",
    },
    {
      id: "p5",
      name: "Kombi-Angebot / Menü",
      priceCents: 1400,
      category: "special",
      icon: "🍱",
      badge: "⭐ Popular",
      description: "Hauptgericht + Beilage + Getränk",
    },
    {
      id: "p6",
      name: "Dessert / Süßspeise",
      priceCents: 300,
      category: "special",
      icon: "🍦",
      description: "Süßer Snack für zwischendurch",
    },
  ];

  return <FestivalCashRegister config={config} items={items} />;
}
