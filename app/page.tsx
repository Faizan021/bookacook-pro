function parseHeroIntent(input: string) {
  const text = input.toLowerCase();

  const event =
    text.includes("wedding")
      ? "Wedding"
      : text.includes("corporate") || text.includes("office") || text.includes("business")
      ? "Corporate Event"
      : text.includes("birthday")
      ? "Birthday"
      : text.includes("graduation")
      ? "Graduation"
      : text.includes("christmas")
      ? "Christmas Dinner"
      : text.includes("ramadan") || text.includes("iftar")
      ? "Ramadan / Iftar"
      : text.includes("summer")
      ? "Summer Party"
      : text.includes("festival") || text.includes("fair") || text.includes("large")
      ? "Large Event"
      : text.includes("private") || text.includes("dinner") || text.includes("party")
      ? "Private Party"
      : "Event";

  const city =
    text.includes("berlin")
      ? "Berlin"
      : text.includes("hamburg")
      ? "Hamburg"
      : text.includes("munich") || text.includes("münchen")
      ? "Munich"
      : text.includes("frankfurt")
      ? "Frankfurt"
      : text.includes("cologne") || text.includes("köln")
      ? "Cologne"
      : "City";

  const diet =
    text.includes("vegan")
      ? "Vegan"
      : text.includes("vegetarian")
      ? "Vegetarian"
      : text.includes("halal")
      ? "Halal"
      : text.includes("gluten")
      ? "Gluten-free"
      : "Preferred menu";

  const guestMatch =
    input.match(/(\d+)\s*(guests|guest|people|persons)/i) ||
    input.match(/for\s+(\d+)/i);

  const guests = guestMatch ? `${guestMatch[1]} guests` : "Guest count";

  const budgetMatch =
    input.match(/€\s?\d+/i) ||
    input.match(/\d+\s?€/i);

  const budget = budgetMatch ? budgetMatch[0] : "Budget";

  return { event, city, guests, diet, budget };
}
