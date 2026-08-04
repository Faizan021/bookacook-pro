import { createFileRoute, redirect } from "@tanstack/react-router";
import { FestivalDashboard } from "@/components/festival/FestivalDashboard";
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
    meta: [{ title: "Speisely Festival Mode — Partner Dashboard" }],
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

  // Default menu items for partner festival POS
  const items: FestivalItem[] = [
    {
      id: "p1",
      name: "Hauptgericht / Special",
      priceCents: 1000,
      description: "Tages-Special am Event-Stand",
    },
    {
      id: "p2",
      name: "Beilage / Snack",
      priceCents: 400,
      description: "Frisch zubereitete Beilage",
    },
    {
      id: "p3",
      name: "Erfrischungsgetränk 0.5L",
      priceCents: 350,
      description: "Kühles Getränk im Becher",
    },
    {
      id: "p4",
      name: "Bier / Special 0.5L",
      priceCents: 450,
      description: "Ausschank am Stand",
    },
    {
      id: "p5",
      name: "Kombi-Angebot / Menü",
      priceCents: 1400,
      description: "Hauptgericht + Beilage + Getränk",
    },
    {
      id: "p6",
      name: "Dessert / Süßspeise",
      priceCents: 300,
      description: "Süßer Snack für zwischendurch",
    },
  ];

  return <FestivalDashboard config={config} items={items} />;
}
