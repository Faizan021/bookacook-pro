export type ArticleCategory = "all" | "speisely-visits" | "community" | "guides" | "festivals";

export type DisclosureType = "selbst-bezahlt" | "eingeladen" | "gesponsert";

export interface MagazineArticle {
  id: string;
  slug: string;
  titleDe: string;
  titleEn: string;
  excerptDe: string;
  excerptEn: string;
  image: string;
  categoryBadgeDe: string;
  categoryBadgeEn: string;
  location: string;
  city: string;
  dateDe: string;
  dateEn: string;
  readTime: string;
  categories: ArticleCategory[];
  to: string;
  isVisit: boolean;
  visitDateDe?: string;
  visitDateEn?: string;
  disclosureType?: DisclosureType;
  disclosureDe?: string;
  disclosureEn?: string;
  featured?: boolean;
}

export const magazineArticles: MagazineArticle[] = [
  // 1. Speisely Visit: Nadir Güllü München
  {
    id: "nadir-gullu-baklava",
    slug: "nadir-gullu-baklava-muenchen",
    titleDe: "Nadir Güllü München: Die Kunst der 40 Schichten am Viktualienmarkt",
    titleEn: "Nadir Güllü Munich: The Art of 40 Layers at Viktualienmarkt",
    excerptDe:
      "180 Jahre Istanbuler Handwerkstradition von Karaköy Güllüoğlu am Viktualienmarkt: 40 hauchdünne Teigschichten, Urfa-Butter und das Hışırtı-Knistern.",
    excerptEn:
      "180 years of Istanbul craft by Karaköy Güllüoğlu at Viktualienmarkt: 40 pastry layers, Urfa butter, and the signature Hışırtı crunch.",
    image: "/magazin/nadir-gullu/nadir-gullu-havuc-dilimi-macro.webp",
    categoryBadgeDe: "Speisely Visits",
    categoryBadgeEn: "Speisely Visits",
    location: "Viktualienmarkt, München",
    city: "München",
    dateDe: "16. Oktober 2026",
    dateEn: "October 16, 2026",
    readTime: "6 Min.",
    categories: ["speisely-visits"],
    to: "/magazin/speisely-visits/nadir-gullu-baklava-muenchen",
    isVisit: true,
    visitDateDe: "16. Oktober 2026",
    visitDateEn: "October 16, 2026",
    disclosureType: "selbst-bezahlt",
    disclosureDe: "Unabhängig besucht und selbst bezahlt",
    disclosureEn: "Independently visited and self-paid",
    featured: true,
  },

  // 2. Speisely Visit: Mandy Restaurant Berlin
  {
    id: "mandy-restaurant",
    slug: "mandy-restaurant-berlin-neukoelln",
    titleDe: "Warum wir bei Mandy natürlich Mandy bestellen mussten",
    titleEn: "Why at Mandy We Naturally Had to Order Mandy",
    excerptDe:
      "Speisely besucht Mandy in Berlin-Neukölln. Wir bestellen Mandy Lamm für zwei, Vorspeisen und Chai – und zahlen rund 45 Euro.",
    excerptEn:
      "Speisely visits Mandy in Berlin-Neukölln. We order Mandy Lamb for two, appetizers, and chai — paying around 45 Euros total.",
    image: "/magazin/mandy/mandy-lamm-fuer-zwei-berlin-neukoelln.webp",
    categoryBadgeDe: "Speisely Visits",
    categoryBadgeEn: "Speisely Visits",
    location: "Wildenbruchstraße, Berlin",
    city: "Berlin",
    dateDe: "17. August 2026",
    dateEn: "August 17, 2026",
    readTime: "5 Min.",
    categories: ["speisely-visits"],
    to: "/magazin/speisely-visits/mandy-restaurant-berlin-neukoelln",
    isVisit: true,
    visitDateDe: "17. August 2026",
    visitDateEn: "August 17, 2026",
    disclosureType: "selbst-bezahlt",
    disclosureDe: "Unabhängig besucht und selbst bezahlt",
    disclosureEn: "Independently visited and self-paid",
    featured: true,
  },

  // 3. Speisely Visit: Shawarma Albaik Berlin
  {
    id: "shawarma-albaik",
    slug: "shawarma-albaik-berlin",
    titleDe: "Ein Abend bei Shawarma Albaik auf der Sonnenallee",
    titleEn: "An Evening at Shawarma Albaik on Sonnenallee",
    excerptDe:
      "Chicken Shawarma, gelber Reis, Knoblauchsauce und ein gemeinsamer Abend mit Freunden auf der Sonnenallee in Berlin-Neukölln.",
    excerptEn:
      "Chicken shawarma, yellow rice, garlic sauce, and an evening shared with friends on Sonnenallee in Berlin-Neukölln.",
    image: "/magazin/albaik/albaik-shawarma-rice-hero.webp",
    categoryBadgeDe: "Speisely Visits",
    categoryBadgeEn: "Speisely Visits",
    location: "Sonnenallee, Berlin",
    city: "Berlin",
    dateDe: "16. August 2026",
    dateEn: "August 16, 2026",
    readTime: "4 Min.",
    categories: ["speisely-visits"],
    to: "/magazin/speisely-visits/shawarma-albaik-berlin",
    isVisit: true,
    visitDateDe: "16. August 2026",
    visitDateEn: "August 16, 2026",
    disclosureType: "selbst-bezahlt",
    disclosureDe: "Unabhängig besucht und selbst bezahlt",
    disclosureEn: "Independently visited and self-paid",
  },

  // 4. Community: La Grilladine Düsseldorf
  {
    id: "la-grilladine-duesseldorf",
    slug: "la-grilladine-duesseldorf",
    titleDe: "Glut, Ton & Minze: La Grilladine Düsseldorf",
    titleEn: "Embers, Clay & Mint: La Grilladine Düsseldorf",
    excerptDe:
      "Buchenholzkohle-Röstaromen, ganze Dorade Royale papillon, im Tontopf geschmorte Salzzitronen-Tajine und die Zeremonie des Atay-Tees im Maghreb-Viertel.",
    excerptEn:
      "Beechwood charcoal aromas, butterflied whole sea bream, claypot-simmered lemon tagine, and the ritual of fresh Atay mint tea in Düsseldorf.",
    image: "/magazin/la-grilladine-duesseldorf/la_grilladine_dorade_3d.webp?v=1",
    categoryBadgeDe: "Community Story",
    categoryBadgeEn: "Community Story",
    location: "Oberbilk, Düsseldorf",
    city: "Düsseldorf",
    dateDe: "Oktober 2026",
    dateEn: "October 2026",
    readTime: "5 Min.",
    categories: ["community", "guides"],
    to: "/magazin/community/la-grilladine-duesseldorf",
    isVisit: false,
    disclosureType: "selbst-bezahlt",
    disclosureDe: "Community-Einsendung · Selbst bezahlt",
    disclosureEn: "Community Submission · Self-paid",
  },

  // 5. Community: Lumara Café Berlin
  {
    id: "lumara-cafe-berlin",
    slug: "lumara-cafe-berlin",
    titleDe: "Samt & Brioche: Lumara Café Berlin-Charlottenburg",
    titleEn: "Velvet & Brioche: Lumara Café Berlin-Charlottenburg",
    excerptDe:
      "Samtig geschlagener Hummus, ofenfrisches Lavabrot, pochierte Eier unter feiner Hollandaise und sündhaftes Tiramisu-Brioche in der Knesebeckstraße.",
    excerptEn:
      "Silky whipped hummus, stone-baked lavash bread, poached eggs under hollandaise, and decadent tiramisu brioche on Knesebeckstraße.",
    image: "/magazin/lumara-cafe-berlin/lumara_table_spread.webp?v=1",
    categoryBadgeDe: "Community Story",
    categoryBadgeEn: "Community Story",
    location: "Knesebeckstraße, Berlin-Charlottenburg",
    city: "Berlin",
    dateDe: "Oktober 2026",
    dateEn: "October 2026",
    readTime: "5 Min.",
    categories: ["community", "guides"],
    to: "/magazin/community/lumara-cafe-berlin",
    isVisit: false,
    disclosureType: "selbst-bezahlt",
    disclosureDe: "Community-Einsendung · Selbst bezahlt",
    disclosureEn: "Community Submission · Self-paid",
  },

  // 5. Community: Neumanns Café Berlin
  {
    id: "neumanns-cafe",
    slug: "neumanns-cafe-berlin",
    titleDe: "Neumanns Café Berlin: Handwerkliches Sauerteig-Frühstück am Boxhagener Platz",
    titleEn: "Neumanns Café Berlin: Artisanal Sourdough Breakfast & Bakery by Boxhagener Platz",
    excerptDe:
      "Hausgebackenes Sauerteigbrot aus eigener Bäckerei, pochierte Eier auf Blattspinat, Süßkartoffel-Stulle mit Ziegenkäse & Andraschko-Kaffee.",
    excerptEn:
      "House-baked sourdough from their own bakery, poached eggs on spinach, sweet potato toast with goat cheese & Andraschko coffee.",
    image: "/magazin/neumanns-cafe-berlin/05_poached_eggs_spinach_hd.jpg?v=3",
    categoryBadgeDe: "Community Story",
    categoryBadgeEn: "Community Story",
    location: "Boxhagener Platz, Berlin",
    city: "Berlin",
    dateDe: "Oktober 2026",
    dateEn: "October 2026",
    readTime: "5 Min.",
    categories: ["community", "guides"],
    to: "/magazin/community/neumanns-cafe-berlin",
    isVisit: false,
    disclosureType: "selbst-bezahlt",
    disclosureDe: "Community-Einsendung · Selbst bezahlt",
    disclosureEn: "Community Submission · Self-paid",
  },

  // 5. Community: Baba Pirzola Berlin
  {
    id: "baba-pirzola",
    slug: "baba-pirzola-berlin",
    titleDe: "Feuer, Meze & große Grillkunst: Ein Abend im Baba Pirzola",
    titleEn: "Fire, Meze & Masterful Grilling: An Evening at Baba Pirzola",
    excerptDe:
      "Zwischen KaDeWe und Wittenbergplatz: Kuzu Pirzola, rauchiges Nazik Ali, 300g Antrikot und warmes Katmer mit Eis.",
    excerptEn:
      "Between KaDeWe and Wittenbergplatz: Kuzu Pirzola, smoky Nazik Ali, 300g Entrecôte and warm Katmer with ice cream.",
    image: "/magazin/baba-pirzola-berlin/01_baba_pirzola_feast_table_hd.jpg?v=3",
    categoryBadgeDe: "Community Story",
    categoryBadgeEn: "Community Story",
    location: "Wittenbergplatz, Berlin",
    city: "Berlin",
    dateDe: "Oktober 2026",
    dateEn: "October 2026",
    readTime: "6 Min.",
    categories: ["community"],
    to: "/magazin/community/baba-pirzola-berlin",
    isVisit: false,
    disclosureType: "selbst-bezahlt",
    disclosureDe: "Community-Einsendung · Selbst bezahlt",
    disclosureEn: "Community Submission · Self-paid",
  },

  // 6. Community: King Tut Restaurant Berlin
  {
    id: "king-tut-restaurant",
    slug: "king-tut-restaurant-berlin",
    titleDe: "Hawawshi & Holzkohlegrill auf Silberplatten: King Tut Berlin",
    titleEn: "Hawawshi & Charcoal Grill on Silver Platters: King Tut Berlin",
    excerptDe:
      "Knuspriges Hawawshi, dampfende Molokhia und kaiserliche Silberplatten mit Holzkohlegrill-Spezialitäten in Berlin-Wilmersdorf.",
    excerptEn:
      "Crisp hawawshi, steaming molokhia, and imperial silver platters of charcoal grill specialties in Berlin-Wilmersdorf.",
    image: "/magazin/king-tut-berlin/16_king_tut_hawawshi_molokhia_hd.jpg",
    categoryBadgeDe: "Community Story",
    categoryBadgeEn: "Community Story",
    location: "Hohenzollerndamm, Berlin",
    city: "Berlin",
    dateDe: "Oktober 2026",
    dateEn: "October 2026",
    readTime: "6 Min.",
    categories: ["community"],
    to: "/magazin/community/king-tut-restaurant-berlin",
    isVisit: false,
    disclosureType: "selbst-bezahlt",
    disclosureDe: "Community-Einsendung · Selbst bezahlt",
    disclosureEn: "Community Submission · Self-paid",
  },

  // 7. Community: bb.q Chicken Berlin Kreuzberg
  {
    id: "bbq-chicken-kreuzberg",
    slug: "bbq-chicken-berlin-kreuzberg",
    titleDe: "Golden Olive & Secret Sauce: Korean Fried Chicken in Kreuzberg",
    titleEn: "Golden Olive & Secret Sauce: Korean Fried Chicken in Kreuzberg",
    excerptDe:
      "In Olivenöl frittiertes Hähnchen, Cheesling Pulver, Secret Spicy Glaze und Rosé Ddeokbokki am Kottbusser Damm.",
    excerptEn:
      "Olive-oil fried chicken, Cheesling powder, Secret Spicy glaze, and Rosé Tteokbokki at Kottbusser Damm.",
    image: "/magazin/bbq-chicken-berlin/01_golden_fried_chicken_hero.jpg?v=2",
    categoryBadgeDe: "Community Story",
    categoryBadgeEn: "Community Story",
    location: "Kreuzberg, Berlin",
    city: "Berlin",
    dateDe: "Oktober 2026",
    dateEn: "October 2026",
    readTime: "5 Min.",
    categories: ["community"],
    to: "/magazin/community/bbq-chicken-berlin-kreuzberg",
    isVisit: false,
    disclosureType: "selbst-bezahlt",
    disclosureDe: "Community-Einsendung · Selbst bezahlt",
    disclosureEn: "Community Submission · Self-paid",
  },

  // 8. Community: San Sebastian Cheesecake Berlin
  {
    id: "san-sebastian-berlin",
    slug: "san-sebastian-berlin",
    titleDe: "Karamellisierte Kruste & flüssige Schokolade: San Sebastian Berlin",
    titleEn: "Caramelized Crust & Flowing Chocolate: San Sebastian Berlin",
    excerptDe:
      "Baskischer Käsekuchen mit samtig-cremigem Kern, reichhaltig übergossen mit warmem Milch- oder Zartbitterschokoladen-Guss in Kreuzberg.",
    excerptEn:
      "Basque cheesecake with an ultra-creamy center, lavishly poured with warm melted milk or dark chocolate in Kreuzberg.",
    image: "/magazin/san-sebastian-berlin/san-sebastian-hd-01-choc-waterfall.webp?v=2",
    categoryBadgeDe: "Community Story",
    categoryBadgeEn: "Community Story",
    location: "Kottbusser Damm, Berlin",
    city: "Berlin",
    dateDe: "Oktober 2026",
    dateEn: "October 2026",
    readTime: "4 Min.",
    categories: ["community"],
    to: "/magazin/community/san-sebastian-berlin",
    isVisit: false,
    disclosureType: "selbst-bezahlt",
    disclosureDe: "Community-Einsendung · Selbst bezahlt",
    disclosureEn: "Community Submission · Self-paid",
  },

  // 9. Community: Chicken Krush Prag
  {
    id: "chicken-krush-prag",
    slug: "chicken-krush-prag",
    titleDe: "K-Food-Kult im Herzen von Prag: Chicken Krush",
    titleEn: "K-Food Cult in the Heart of Prague: Chicken Krush",
    excerptDe:
      "Korean Fried Chicken, Loaded Bulgogi Fries, knusprige Kimchi Mandu und cremiger Matcha Latte in der Karlsgasse.",
    excerptEn:
      "Korean fried chicken, loaded bulgogi fries, crisp kimchi mandu, and creamy matcha latte at Karlova street in Prague.",
    image: "/magazin/chicken-krush-prag/ck-hd-01-neon-emblem.webp?v=2",
    categoryBadgeDe: "Community Story",
    categoryBadgeEn: "Community Story",
    location: "Karlova, Prag",
    city: "Prag",
    dateDe: "Oktober 2026",
    dateEn: "October 2026",
    readTime: "5 Min.",
    categories: ["community", "guides"],
    to: "/magazin/community/chicken-krush-prag",
    isVisit: false,
    disclosureType: "selbst-bezahlt",
    disclosureDe: "Community-Einsendung · Selbst bezahlt",
    disclosureEn: "Community Submission · Self-paid",
  },

  // 10. Community: Garçon de Café Berlin
  {
    id: "garcon-de-cafe",
    slug: "garcon-de-cafe-berlin",
    titleDe: "Französisches Savoir-Vivre im Prenzlauer Berg: Garçon de Café",
    titleEn: "French Savoir-Vivre in Prenzlauer Berg: Garçon de Café",
    excerptDe:
      "Handgemachte Croissants, feine Pâtisserie, Quiche Lorraine und Specialty Coffee im charmanten Kiez von Berlin-Pankow.",
    excerptEn:
      "Handmade croissants, delicate pastries, quiche Lorraine, and specialty coffee in Berlin's historic Prenzlauer Berg.",
    image: "/magazin/garcon-de-cafe-berlin/garcon-01.webp?v=2",
    categoryBadgeDe: "Community Story",
    categoryBadgeEn: "Community Story",
    location: "Prenzlauer Berg, Berlin",
    city: "Berlin",
    dateDe: "Oktober 2026",
    dateEn: "October 2026",
    readTime: "5 Min.",
    categories: ["community"],
    to: "/magazin/community/garcon-de-cafe-berlin",
    isVisit: false,
    disclosureType: "selbst-bezahlt",
    disclosureDe: "Community-Einsendung · Selbst bezahlt",
    disclosureEn: "Community Submission · Self-paid",
  },

  // 11. Community: Thronburger Berlin
  {
    id: "thronburger-berlin",
    slug: "thronburger-berlin",
    titleDe: "Smash Burger Handwerk & Homemade Sauces: Thronburger Berlin",
    titleEn: "Smash Burger Craft & Homemade Sauces: Thronburger Berlin",
    excerptDe:
      "Karamellisierte Krusten, luftige Potato Buns, geschmolzener Cheddar und knusprige Fries in Berlin-Neukölln.",
    excerptEn:
      "Crisp smash patties, fluffy potato buns, molten cheddar, and loaded fries in Berlin-Neukölln.",
    image: "/magazin/thronburger-berlin/thronburger-01.webp?v=2",
    categoryBadgeDe: "Community Story",
    categoryBadgeEn: "Community Story",
    location: "Sonnenallee, Berlin",
    city: "Berlin",
    dateDe: "Oktober 2026",
    dateEn: "October 2026",
    readTime: "4 Min.",
    categories: ["community"],
    to: "/magazin/community/thronburger-berlin",
    isVisit: false,
    disclosureType: "selbst-bezahlt",
    disclosureDe: "Community-Einsendung · Selbst bezahlt",
    disclosureEn: "Community Submission · Self-paid",
  },

  // 12. Community: Kokio Berlin
  {
    id: "kokio-berlin",
    slug: "kokio-berlin",
    titleDe: "K-Chicken, Soju & Streetfood-Vibes: Kokio Berlin",
    titleEn: "K-Chicken, Soju & Street Food Vibes: Kokio Berlin",
    excerptDe:
      "Knuspriges Korean Fried Chicken in Soja-Knoblauch-Glasur, pickled Radish und authentische K-Bites am Helmholtzplatz.",
    excerptEn:
      "Crispy Korean fried chicken in soy-garlic glaze, pickled radish, and streetfood bites at Helmholtzplatz.",
    image: "/magazin/kokio-berlin/kokio-boneless-02.webp?v=2",
    categoryBadgeDe: "Community Story",
    categoryBadgeEn: "Community Story",
    location: "Helmholtzplatz, Berlin",
    city: "Berlin",
    dateDe: "Oktober 2026",
    dateEn: "October 2026",
    readTime: "5 Min.",
    categories: ["community"],
    to: "/magazin/community/kokio-berlin",
    isVisit: false,
    disclosureType: "selbst-bezahlt",
    disclosureDe: "Community-Einsendung · Selbst bezahlt",
    disclosureEn: "Community Submission · Self-paid",
  },

  // 13. Community: Al Zaeem Berlin
  {
    id: "alzaeem-berlin",
    slug: "alzaeem-restaurant-berlin",
    titleDe: "Damaszener Grill-Tradition & Mezze-Platten: Al Zaeem Berlin",
    titleEn: "Damascene Grilling Tradition & Mezze Platters: Al Zaeem Berlin",
    excerptDe:
      "Frisch gebackenes Fladenbrot, rauchiges Mutabbal, saftige Schawarma-Platten und syrische Gastfreundschaft an der Sonnenallee.",
    excerptEn:
      "Freshly baked flatbread, smoky mutabbal, juicy shawarma platters, and Syrian hospitality on Sonnenallee.",
    image: "/magazin/alzaeem-berlin/mix-grill-close.webp?v=2",
    categoryBadgeDe: "Community Story",
    categoryBadgeEn: "Community Story",
    location: "Sonnenallee, Berlin",
    city: "Berlin",
    dateDe: "Oktober 2026",
    dateEn: "October 2026",
    readTime: "5 Min.",
    categories: ["community"],
    to: "/magazin/community/alzaeem-restaurant-berlin",
    isVisit: false,
    disclosureType: "selbst-bezahlt",
    disclosureDe: "Community-Einsendung · Selbst bezahlt",
    disclosureEn: "Community Submission · Self-paid",
  },

  // 14. Community: Ariana Frankfurt
  {
    id: "ariana-frankfurt",
    slug: "ariana-restaurant-frankfurt",
    titleDe: "Afghanische Gastfreundschaft & Qabili Palau: Ariana Frankfurt",
    titleEn: "Afghan Hospitality & Qabili Palau: Ariana Frankfurt",
    excerptDe:
      "Gedämpfter Basmatireis mit karamellisierten Karotten und Rosinen, zart geschmortes Lammfleisch, Mantu Teigtaschen und Ashak im Bahnhofsviertel.",
    excerptEn:
      "Fragrant basmati rice with candied carrots and raisins, slow-braised lamb, steamed mantu dumplings, and ashak.",
    image: "/magazin/ariana-frankfurt/qabili-palau.webp?v=2",
    categoryBadgeDe: "Community Story",
    categoryBadgeEn: "Community Story",
    location: "Bahnhofsviertel, Frankfurt",
    city: "Frankfurt am Main",
    dateDe: "Oktober 2026",
    dateEn: "October 2026",
    readTime: "6 Min.",
    categories: ["community"],
    to: "/magazin/community/ariana-restaurant-frankfurt",
    isVisit: false,
    disclosureType: "selbst-bezahlt",
    disclosureDe: "Community-Einsendung · Selbst bezahlt",
    disclosureEn: "Community Submission · Self-paid",
  },

  // 15. Community: Harput Wiesbaden
  {
    id: "harput-wiesbaden",
    slug: "harput-wiesbaden",
    titleDe: "Holzkohle-Kebab & anatolische Mezze-Kultur: Harput Wiesbaden",
    titleEn: "Charcoal Kebab & Anatolian Mezze Culture: Harput Wiesbaden",
    excerptDe:
      "Saftige Adana Kebabs frisch vom offenen Holzkohlegrill, knuspriges Pide-Brot und cremiges Haydari in der Wellritzstraße.",
    excerptEn:
      "Juicy Adana kebabs fresh from open charcoal, crisp pide bread, and creamy haydari in Wiesbaden's Wellritzstraße.",
    image: "/magazin/harput-wiesbaden/harput-fisch.webp?v=2",
    categoryBadgeDe: "Community Story",
    categoryBadgeEn: "Community Story",
    location: "Wellritzstraße, Wiesbaden",
    city: "Wiesbaden",
    dateDe: "Oktober 2026",
    dateEn: "October 2026",
    readTime: "5 Min.",
    categories: ["community"],
    to: "/magazin/community/harput-wiesbaden",
    isVisit: false,
    disclosureType: "selbst-bezahlt",
    disclosureDe: "Community-Einsendung · Selbst bezahlt",
    disclosureEn: "Community Submission · Self-paid",
  },

  // 16. Partner Story: Schnitzel Schmiede
  {
    id: "schnitzel-schmiede",
    slug: "schnitzel-schmiede",
    titleDe: "Schnitzel Schmiede Mönchengladbach: Handwerk & Tradition",
    titleEn: "Schnitzel Schmiede Mönchengladbach: Craft & Tradition",
    excerptDe:
      "Frisch geklopfte Schnitzel, regionale Zutaten und echte Handwerkskunst beim Altstadtfest Mönchengladbach.",
    excerptEn:
      "Freshly pounded schnitzels, local ingredients, and authentic culinary craft at the Mönchengladbach Old Town Festival.",
    image: "/images/banner_schnitzel.webp",
    categoryBadgeDe: "Partner Story",
    categoryBadgeEn: "Partner Story",
    location: "Mönchengladbach",
    city: "Mönchengladbach",
    dateDe: "September 2026",
    dateEn: "September 2026",
    readTime: "4 Min.",
    categories: ["festivals"],
    to: "/magazin/schnitzel-schmiede",
    isVisit: false,
    disclosureType: "gesponsert",
    disclosureDe: "Partner-Porträt & Festival-Feature",
    disclosureEn: "Partner Portrait & Festival Feature",
  },
];
