import { Restaurant } from "./types";

export const RESTAURANTS: Record<string, Restaurant> = {
  "mani-restaurant": {
    name: "MANI Restaurant",
    cuisine: "Modern Levantine",
    location: "Berlin-Mitte",
    rating: 4.9,
    reviews: 128,
    delivery: "25-35 Min",
    brandGradient: "from-[#16372f] via-[#2a4d44] to-[#eadfce]",
    menu: [
      {
        category: "Signature Dishes",
        items: [
          { id: "mani-1", name: "Gegrillter Oktopus", price: 24.50, description: "Hummus, Shakshuka & Kräuteröl", isAiFavorite: true },
          { id: "mani-2", name: "Lamm-Kofta", price: 22.00, description: "Za'atar-Fladenbrot & Joghurt" }
        ]
      }
    ]
  },
  "izakaya": {
    name: "Izakaya Asian Kitchen",
    cuisine: "Japanese Contemporary",
    location: "Berlin-Kreuzberg",
    rating: 4.8,
    reviews: 94,
    delivery: "30-40 Min",
    brandGradient: "from-[#0f2a24] via-[#1c3b33] to-[#dcd0bc]",
    menu: [
      {
        category: "Starters",
        items: [
          { id: "iz-1", name: "Wagyu Gyoza", price: 18.00, description: "Handgemachte Gyoza mit Wagyu" }
        ]
      }
    ]
  },
  "bistro-charlotte": {
    name: "Bistro Charlotte",
    cuisine: "French Haute Cuisine",
    location: "Berlin-Charlottenburg",
    rating: 4.9,
    reviews: 210,
    delivery: "20-30 Min",
    brandGradient: "from-[#1d3d35] via-[#33564c] to-[#f3ede1]",
    menu: [
      {
        category: "Plat Principal",
        items: [
          { id: "bc-1", name: "Boeuf Bourguignon", price: 28.50, description: "Geschmorte Rinderschulter, Rotwein" }
        ]
      }
    ]
  }
};
