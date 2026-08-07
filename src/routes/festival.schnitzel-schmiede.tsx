import { createFileRoute } from "@tanstack/react-router";
import { FestivalCashRegister } from "@/components/festival/FestivalCashRegister";
import type { FestivalEventConfig, FestivalItem } from "@/lib/festival/types";

const SCHNITZEL_SCHMIEDE_CONFIG: FestivalEventConfig = {
  restaurantId: "schnitzel-schmiede-fest-2026",
  restaurantName: "Schnitzel Schmiede",
  eventName: "StadtFest 2026",
  eventNameSecondary: "Marktplatz Stand #4",
  defaultLanguage: "de",
  pinnedItemIds: ["1", "2", "3", "4", "5", "6"],
};

const SCHNITZEL_SCHMIEDE_ITEMS: FestivalItem[] = [
  {
    id: "1",
    name: "Schnitzel Semmel",
    priceCents: 850,
    category: "food",
    icon: "🥪",
    badge: "🔥 Best Seller",
    description: "Knuspriges Schweineschnitzel im frischen Semmel",
  },
  {
    id: "2",
    name: "Schnitzel Teller",
    priceCents: 1200,
    category: "food",
    icon: "🍽️",
    description: "Schnitzel mit Pommes frites & Zitrone",
  },
  {
    id: "3",
    name: "Portion Pommes",
    priceCents: 400,
    category: "food",
    icon: "🍟",
    description: "Goldgelbe Pommes mit Ketchup oder Mayonnaise",
  },
  {
    id: "4",
    name: "Spezi / Cola 0.5L",
    priceCents: 350,
    category: "drink",
    icon: "🥤",
    description: "Eiskaltes Erfrischungsgetränk im Becher",
  },
  {
    id: "5",
    name: "Fest-Menü 1",
    priceCents: 1500,
    category: "special",
    icon: "🍱",
    badge: "⭐ Popular",
    description: "Schnitzel Semmel + Pommes + 0.5L Getränk",
  },
  {
    id: "6",
    name: "Pils / Bier 0.5L",
    priceCents: 450,
    category: "drink",
    icon: "🍺",
    description: "Frisch gezapftes Festbier",
  },
];

export const Route = createFileRoute("/festival/schnitzel-schmiede")({
  head: () => ({
    meta: [
      { title: "Schnitzel Schmiede — Festival Cash Register" },
      { name: "description", content: "Schnitzel Schmiede Festival Cash Register Pilot" },
    ],
  }),
  component: SchnitzelSchmiedeFestivalRegisterPage,
});

function SchnitzelSchmiedeFestivalRegisterPage() {
  return (
    <FestivalCashRegister
      config={SCHNITZEL_SCHMIEDE_CONFIG}
      items={SCHNITZEL_SCHMIEDE_ITEMS}
    />
  );
}
