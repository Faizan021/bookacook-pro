export const RESTAURANTS = {
  "mani-restaurant": {
    name: "MANI Restaurant",
    cuisine: "Modern Levantine",
    location: "Berlin-Mitte",
    rating: 4.9,
    reviews: 128,
    delivery: "25-35 Min",
    menu: [
      {
        category: "Signature Dishes",
        items: [
          { id: "mani-1", name: "Gegrillter Oktopus", price: 24.50, description: "Mit Hummus, Shakshuka und Kräuteröl" },
          { id: "mani-2", name: "Lamm-Kofta", price: 22.00, description: "Serviert mit Za'atar-Fladenbrot" }
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
    menu: [
      {
        category: "Starters",
        items: [
          { id: "iz-1", name: "Wagyu Gyoza", price: 18.00, description: "Handgemachte Gyoza mit Wagyu-Füllung" }
        ]
      }
    ]
  }
};
