/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/integrations/supabase/client";
import { BRANDING_ASSISTANT_ENABLED } from "@/utils/featureFlags";
import { generateSvgLogo, generateSvgBanner } from "@/utils/brandingGenerator";

export type Dietary = "vegetarian" | "vegan" | "gluten-free";

export type MenuItem = {
  id?: string;
  name: string;
  desc: { de: string; en: string };
  price: number;
  img: string | null;
  category?: string;
  dietary?: Dietary[];
};

export type Restaurant = {
  id: string;
  slug?: string;
  name: string;
  tags: string[];
  rating: number;
  time: string;
  fee: string;
  img: string;
  logo?: string;
  use_generated_branding?: boolean;
  status: "Open" | "Closed";
  area: string;
  address: string;
  phone: string;
  distanceKm: number;
  minOrder: number;
  about: { de: string; en: string };
  menu: MenuItem[];
  announcement_active?: boolean;
  announcement_bg_color?: string;
  announcement_text?: string;
  isShowcase?: boolean;
  serviceAreas?: string;
  acceptsCash?: boolean;
  acceptsPaypal?: boolean;
  paypalEmail?: string;
  stripeConnectStatus?: string;
  acceptsDelivery?: boolean;
  acceptsPickup?: boolean;
};

export const fallbackRestaurants: Restaurant[] = [
  {
    id: "schnitzel-schmiede",
    slug: "schnitzel-schmiede",
    name: "Schnitzel Schmiede",
    tags: ["Deutsche Küche", "Schnitzel-Spezialitäten", "Biergarten & Festkultur"],
    rating: 4.9,
    time: "20-30 min",
    fee: "€0.00",
    img: "/slide1_schnitzel_hero.webp",
    logo: "/speisely_official_logo.png",
    status: "Open",
    area: "Mönchengladbach",
    address: "Brucknerallee 42, 41236 Mönchengladbach",
    phone: "+49 2166 987654",
    distanceKm: 1.4,
    minOrder: 12,
    about: {
      de: "Seit 2013 die erste Adresse für handgeklopfte, goldbraun ausgebackene Schnitzel-Spezialitäten, knusprige Beilagen und gelebte rheinische Gastfreundschaft.",
      en: "Since 2013, the premier address for hand-pounded, golden-fried schnitzel specialties, crispy sides, and warm Rhineland hospitality.",
    },
    announcement_active: true,
    announcement_bg_color: "primary",
    announcement_text: "Frisch aus der Pfanne: Unser Fest-Menü jetzt auch direkt vorbestellen! 🍽️",
    menu: [
      {
        id: "ss-1",
        name: "Original Schmiede-Schnitzel (Wiener Art)",
        desc: {
          de: "Zartes Schweineschnitzel in goldbrauner Panade, serviert mit frischer Zitrone und Preiselbeeren",
          en: "Tender pork schnitzel in golden breading, served with fresh lemon and lingonberries",
        },
        price: 14.5,
        img: "/slide1_schnitzel_hero.webp",
        category: "Schnitzel-Klassiker",
      },
      {
        id: "ss-2",
        name: "Schnitzel Semmel (Festival-Klassiker)",
        desc: {
          de: "Knuspriges Schweineschnitzel im ofenfrischen Bäcker-Semmel mit Krautsalat & Remoulade",
          en: "Crispy pork schnitzel in a fresh bakery roll with coleslaw & remoulade",
        },
        price: 8.5,
        img: "/slide3_german_festival.webp",
        category: "Schnitzel-Klassiker",
      },
      {
        id: "ss-3",
        name: "Jäger-Schnitzel mit Waldpilzrahm",
        desc: {
          de: "Frisch gebratenes Schnitzel mit hausgemachter Champignon-Waldpilz-Rahmsauce & Pommes frites",
          en: "Freshly pan-fried schnitzel with homemade forest mushroom cream sauce & French fries",
        },
        price: 16.9,
        img: "/slide1_schnitzel_hero.webp",
        category: "Schnitzel-Klassiker",
      },
      {
        id: "ss-4",
        name: "Goldgelbe Pommes Frites",
        desc: {
          de: "Knusprige Pommes frites mit Meersalz, wahlweise mit Ketchup oder Haus-Mayonnaise",
          en: "Crispy French fries with sea salt, served with ketchup or house mayonnaise",
        },
        price: 4.5,
        img: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&h=450&fit=crop",
        category: "Beilagen & Salate",
        dietary: ["vegan", "gluten-free"],
      },
      {
        id: "ss-5",
        name: "Rheinischer Kartoffelsalat",
        desc: {
          de: "Nach Hausrezept mit Gewürzgurken, frischen Kräutern und mildem Dressing",
          en: "House recipe with pickles, fresh herbs, and mild dressing",
        },
        price: 4.9,
        img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=450&fit=crop",
        category: "Beilagen & Salate",
        dietary: ["vegetarian", "gluten-free"],
      },
    ],
  },
  {
    id: "haus-spaas",
    slug: "haus-spaas",
    name: "Haus Spaas",
    tags: ["Traditionelle deutsche Küche", "Saisonales", "Steaks & Schnitzel"],
    rating: 4.9,
    time: "25-35 min",
    fee: "€0.00",
    img: "/haus_spaas_desktop_hero.png",
    logo: "/spaas_mobile_preview.png",
    status: "Open",
    area: "Mönchengladbach",
    address: "Düsseldorfer Str. 112, 41238 Mönchengladbach",
    phone: "+49 2166 123456",
    distanceKm: 1.8,
    minOrder: 15,
    about: {
      de: "Traditionsreiches Restaurant mit gemütlichem Ambiente, regionaler Frischeküche, saftigen Steaks und saisonalen Spezialitäten.",
      en: "Traditional restaurant offering a cozy ambiance, regional fresh cuisine, juicy steaks, and seasonal specialties.",
    },
    announcement_active: true,
    announcement_bg_color: "primary",
    announcement_text: "Tischreservierung & Direktbestellung ohne Plattformgebühren! ✨",
    menu: [
      {
        id: "hs-1",
        name: "Rumpsteak Haus Spaas (250g)",
        desc: {
          de: "Rosa gebratenes Roastbeef mit geschmorten Zwiebeln, Kräuterbutter und Bratkartoffeln",
          en: "Medium-roasted striploin steak with braised onions, herb butter, and pan-fried potatoes",
        },
        price: 26.5,
        img: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&h=450&fit=crop",
        category: "Hauptgerichte",
        dietary: ["gluten-free"],
      },
      {
        id: "hs-2",
        name: "Herrencreme & Saisonales Dessert",
        desc: {
          de: "Hausgemachte westfälische Herrencreme mit feiner Schokoraspel",
          en: "Homemade traditional vanilla cream dessert with dark chocolate shavings",
        },
        price: 7.5,
        img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&h=450&fit=crop",
        category: "Desserts",
        dietary: ["vegetarian"],
      },
      {
        id: "hs-3",
        name: "Ziegenkäse auf Wildkräutersalat",
        desc: {
          de: "Gratinierter Ziegenkäse mit Waldhonig, Walnüssen und Haus-Vinaigrette",
          en: "Gratinated goat cheese with forest honey, walnuts, and house vinaigrette",
        },
        price: 13.9,
        img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=450&fit=crop",
        category: "Vorspeisen",
        dietary: ["vegetarian", "gluten-free"],
      },
    ],
  },
  {
    id: "khan-baba",
    slug: "khan-baba",
    name: "Khan Baba Berlin",
    tags: [
      "Authentische pakistanische Küche",
      "100% Halal",
      "Karachi Biryani",
      "Tandoor & BBQ",
      "Berlin Wedding",
    ],
    rating: 4.9,
    time: "20-35 min",
    fee: "€0.00",
    img: "/caterers/khan-baba/01_hero_pakistani_buffet.webp",
    logo: "/caterers/khan-baba/logo.webp",
    status: "Open",
    area: "Berlin-Wedding",
    address: "Amsterdamer Straße 12, 13347 Berlin",
    phone: "+49 178 2672163",
    distanceKm: 1.2,
    minOrder: 15,
    acceptsDelivery: false,
    acceptsPickup: true,
    about: {
      de: "Willkommen bei Khan Baba Berlin im Herzen von Wedding! Berühmt für echte Karachi Student Biryani, traditionell geschmorte Rinder-Nihari, saftige Tandoori Seekh Kebabs und frische Karahi-Currys. Hinweis: Reguläre Restaurant-Speisen werden nur zur Selbstabholung (Takeaway) zubereitet. Große Catering-Degs und Buffets liefern wir zuverlässig in ganz Berlin!",
      en: "Welcome to Khan Baba Berlin in Wedding! Renowned for authentic Karachi Student Biryani, slow-braised beef Nihari, sizzling tandoori Seekh Kebabs, and fresh Karahi curries. Note: Regular restaurant orders are for local takeaway (pickup) only. Catering cauldrons and event buffets are delivered Berlin-wide!",
    },
    announcement_active: true,
    announcement_bg_color: "primary",
    announcement_text:
      "🇵🇰 Original pakistanische Spezialitäten! Restaurant: Nur Selbstabholung vor Ort. Catering-Degs liefern wir berlinweit!",
    menu: [
      {
        id: "kb-1",
        name: "Karachi Student Biryani (Chicken)",
        desc: {
          de: "Die beliebteste Biryani Berlins: Würziger Duftreis mit zartem Hähnchenfleisch, traditionell gedämpft mit Safran und Karachi-Gewürzen",
          en: "Berlin's most popular biryani: Fragrant basmati rice with tender chicken, steamed with saffron and Karachi spices",
        },
        price: 13.9,
        img: "/caterers/khan-baba/02_karachi_biryani_deg.webp",
        category: "Biryani & Reis",
      },
      {
        id: "kb-2",
        name: "Mutton Biryani (Lamm)",
        desc: {
          de: "Fein geschichteter Basmatireis mit butterzartem Lammfleisch, warmen Gewürzen und Minze",
          en: "Layered basmati rice with succulent slow-braised lamb, whole aromatic spices and mint",
        },
        price: 15.9,
        img: "/caterers/khan-baba/02_karachi_biryani_deg.webp",
        category: "Biryani & Reis",
      },
      {
        id: "kb-3",
        name: "Traditionelle Rinder-Nihari",
        desc: {
          de: "Stundenlang langsam geschmorte Rinderbeinscheibe in samtig-würziger Sauce, serviert mit frischem Ingwer, grünem Chili und Zitrone",
          en: "Slow-simmered beef shank in a rich velvety spiced gravy, garnished with fresh ginger juliennes and lemon",
        },
        price: 15.9,
        img: "/caterers/khan-baba/03_nihari_tandoor_naan.webp",
        category: "Traditionelle Spezialitäten",
      },
      {
        id: "kb-4",
        name: "Chicken Haleem",
        desc: {
          de: "Cremig gekochtes Hähnchen mit Weizen, Gerste und 7 Linsensorten, garniert mit Röstzwiebeln und Koriander",
          en: "Slow-cooked shredded chicken stew with cracked wheat and lentils, topped with caramelized golden onions",
        },
        price: 14.9,
        img: "/caterers/khan-baba/03_nihari_tandoor_naan.webp",
        category: "Traditionelle Spezialitäten",
      },
      {
        id: "kb-5",
        name: "Paya Spezialität",
        desc: {
          de: "Klassisches Lahori Festtagsgericht in kräftig reduzierter Knochenbrühe mit feiner Gewürznote",
          en: "Traditional rich bone broth stew cooked with slow-simmered spices",
        },
        price: 14.9,
        img: "/caterers/khan-baba/03_nihari_tandoor_naan.webp",
        category: "Traditionelle Spezialitäten",
      },
      {
        id: "kb-6",
        name: "Chicken Karahi (Pfannengericht)",
        desc: {
          de: "In der traditionellen Eisenpfanne frisch zubereitet mit Tomaten, Knoblauch, Ingwer und grünen Chilis",
          en: "Cooked fresh in a traditional wok with ripe tomatoes, garlic, ginger, and green chilies",
        },
        price: 14.9,
        img: "/caterers/khan-baba/01_hero_pakistani_buffet.webp",
        category: "Karahi & Pfannengerichte",
      },
      {
        id: "kb-7",
        name: "Mutton Karahi",
        desc: {
          de: "Zartes Lammfleisch in der Karahi-Pfanne geschmort mit frischen Kräutern und kräftigen Gewürzen",
          en: "Tender lamb cooked in wok with tomatoes, ginger, and hand-ground spices",
        },
        price: 16.9,
        img: "/caterers/khan-baba/01_hero_pakistani_buffet.webp",
        category: "Karahi & Pfannengerichte",
      },
      {
        id: "kb-8",
        name: "Butter Chicken",
        desc: {
          de: "Gegrilltes Hähnchenfilet in feiner Tomaten-Cashew-Butter-Sauce",
          en: "Tender chicken pieces in a silky tomato and butter sauce with fenugreek",
        },
        price: 14.5,
        img: "/caterers/khan-baba/01_hero_pakistani_buffet.webp",
        category: "Karahi & Pfannengerichte",
      },
      {
        id: "kb-9",
        name: "Seekh Kebab Platter",
        desc: {
          de: "Zwei saftig gegrillte Spieße aus gewürztem Rinderhackfleisch aus dem Holzkohle-Tandoor, serviert mit Salat und Chutney",
          en: "Two juicy skewers of spiced minced beef grilled over coals in the tandoor, with fresh salad and chutney",
        },
        price: 12.9,
        img: "/caterers/khan-baba/04_seekh_kebab_bbq_grill.webp",
        category: "Tandoori Grill & BBQ",
      },
      {
        id: "kb-10",
        name: "Chicken Tikka Boti",
        desc: {
          de: "Marinierte Hähnchenbruststücke am Spieß zart im Tandoor gegrillt",
          en: "Succulent boneless chicken chunks marinated in yogurt and tandoor spices, flame grilled",
        },
        price: 12.9,
        img: "/caterers/khan-baba/04_seekh_kebab_bbq_grill.webp",
        category: "Tandoori Grill & BBQ",
      },
      {
        id: "kb-11",
        name: "Samosa Chaat",
        desc: {
          de: "Knusprige Kartoffel-Samosas auf Kichererbsen-Curry mit Joghurt, Minze und Tamarindensauce",
          en: "Crispy vegetable samosas served over chickpea masala with yogurt and tamarind chutney",
        },
        price: 8.9,
        img: "/caterers/khan-baba/01_hero_pakistani_buffet.webp",
        category: "Vorspeisen & Street Food",
      },
      {
        id: "kb-12",
        name: "Gol Gappe / Pani Puri (6 Stk.)",
        desc: {
          de: "Hohle, krosse Weizenbällchen gefüllt mit Kartoffeln und Kichererbsen, serviert mit pikantem Kräuterwasser",
          en: "Crisp hollow pooris filled with potatoes and chickpeas, served with tangy spiced mint water",
        },
        price: 8.9,
        img: "/caterers/khan-baba/01_hero_pakistani_buffet.webp",
        category: "Vorspeisen & Street Food",
      },
      {
        id: "kb-13",
        name: "Halwa Puri Chana Teller",
        desc: {
          de: "Traditionelles Lahori Sonntags-Frühstück: 3 heiße Puris mit Kichererbsen-Chana und süßem Halwa",
          en: "Traditional weekend breakfast: 3 fresh puris served with spicy chickpea curry and sweet semolina halwa",
        },
        price: 14.9,
        img: "/caterers/khan-baba/01_hero_pakistani_buffet.webp",
        category: "Vorspeisen & Street Food",
      },
      {
        id: "kb-14",
        name: "Tandoori Garlic Naan",
        desc: {
          de: "Frisch gebackenes Fladenbrot aus dem Lehmofen mit feiner Knoblauchbutter und Koriander",
          en: "Oven-baked flatbread brushed with aromatic garlic butter and cilantro",
        },
        price: 3.5,
        img: "/caterers/khan-baba/03_nihari_tandoor_naan.webp",
        category: "Tandoor Brote & Beilagen",
      },
      {
        id: "kb-15",
        name: "Mango Lassi (0,4l)",
        desc: {
          de: "Cremiges Joghurt-Getränk mit fruchtigem Kesar-Mango-Püree",
          en: "Creamy refreshing yogurt drink with mango pulp",
        },
        price: 4.5,
        img: "/caterers/khan-baba/01_hero_pakistani_buffet.webp",
        category: "Getränke & Desserts",
      },
      {
        id: "kb-16",
        name: "Gulab Jamun (2 Stk.)",
        desc: {
          de: "Warme goldbraune Teigbällchen eingelegt in feinem Rosen-Kardamomsirup",
          en: "Warm fried dough balls soaked in fragrant rose and cardamom syrup",
        },
        price: 4.5,
        img: "/caterers/khan-baba/01_hero_pakistani_buffet.webp",
        category: "Getränke & Desserts",
      },
    ],
  },
  {
    id: "verde-grain",
    slug: "verde-grain",
    name: "Verde & Grain",
    tags: ["Healthy", "Bowls", "Salads"],
    rating: 4.8,
    time: "20-30 min",
    fee: "€1.49",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&h=900&fit=crop",
    status: "Open",
    area: "Berlin",
    address: "Linienstraße 142, 10115 Berlin",
    phone: "+49 30 1234 5678",
    distanceKm: 2.5,
    minOrder: 15,
    about: {
      de: "Saisonale Bio-Bowls und Salate, frisch zubereitet aus regionalen Zutaten.",
      en: "Seasonal organic bowls and salads, freshly prepared from regional ingredients.",
    },
    announcement_active: true,
    announcement_bg_color: "primary",
    announcement_text: "All you can eat bowls on Mondays! 🥗",
    menu: [
      {
        name: "Tuscan Kale & Pecorino",
        desc: {
          de: "Bio-Grünkohl, Pecorino, Pinienkerne",
          en: "Organic kale, pecorino, pine nuts",
        },
        price: 14.5,
        img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop",
        category: "Bowls",
        dietary: ["vegetarian", "gluten-free"],
      },
      {
        name: "Mediterranean Quinoa",
        desc: { de: "Quinoa, Gurke, Tomate, Tahini", en: "Quinoa, cucumber, tomato, tahini" },
        price: 15.5,
        img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop",
        category: "Bowls",
        dietary: ["vegan", "gluten-free"],
      },
      {
        name: "Fig & Prosciutto",
        desc: {
          de: "Feigen, Prosciutto, Rucola, Balsamico",
          en: "Figs, prosciutto, arugula, balsamic",
        },
        price: 17.0,
        img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop",
        category: "Salads",
        dietary: ["gluten-free"],
      },
      {
        name: "Roasted Beet & Goat Cheese",
        desc: { de: "Rote Bete, Ziegenkäse, Walnüsse", en: "Roasted beets, goat cheese, walnuts" },
        price: 13.5,
        img: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400&h=400&fit=crop",
        category: "Salads",
        dietary: ["vegetarian", "gluten-free"],
      },
      {
        name: "Cold Pressed Green Juice",
        desc: { de: "Sellerie, Apfel, Ingwer, Zitrone", en: "Celery, apple, ginger, lemon" },
        price: 6.5,
        img: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=400&fit=crop",
        category: "Drinks",
        dietary: ["vegan", "gluten-free"],
      },
    ],
  },
  {
    id: "casa-limone",
    slug: "casa-limone",
    name: "Casa Limone",
    tags: ["Italian", "Pasta", "Antipasti"],
    rating: 4.7,
    time: "30-40 min",
    fee: "€1.99",
    img: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=1200&h=900&fit=crop",
    status: "Open",
    area: "München",
    address: "Leopoldstraße 58, 80802 München",
    phone: "+49 89 2345 6789",
    distanceKm: 3.1,
    minOrder: 18,
    about: {
      de: "Authentische italienische Küche mit handgemachter Pasta, frischer Burrata und saisonalen Trüffelgerichten.",
      en: "Authentic Italian cuisine with handmade pasta, fresh burrata, and seasonal truffle dishes.",
    },
    menu: [
      {
        name: "Cacio e Pepe",
        desc: {
          de: "Tonnarelli, Pecorino Romano, schwarzer Pfeffer",
          en: "Tonnarelli, Pecorino Romano, black pepper",
        },
        price: 13.9,
        img: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&h=400&fit=crop",
        category: "Pasta",
        dietary: ["vegetarian"],
      },
      {
        name: "Tagliatelle al Ragù",
        desc: { de: "Bolognese-Ragù, Parmigiano", en: "Bolognese ragù, Parmigiano" },
        price: 15.9,
        img: "https://images.unsplash.com/photo-1572441713132-c542fc4fe282?w=400&h=400&fit=crop",
        category: "Pasta",
      },
      {
        name: "Antipasti Misti",
        desc: { de: "Wurstwaren, Oliven, Focaccia", en: "Cured meats, olives, focaccia" },
        price: 16.5,
        img: "https://images.unsplash.com/photo-1626202373052-9cb1490ff7e8?w=400&h=400&fit=crop",
        category: "Antipasti",
      },
      {
        name: "Burrata Pugliese",
        desc: { de: "Burrata, Kirschtomaten, Basilikum", en: "Burrata, cherry tomatoes, basil" },
        price: 12.0,
        img: "https://images.unsplash.com/photo-1633437756091-3acff8d92b62?w=400&h=400&fit=crop",
        category: "Antipasti",
        dietary: ["vegetarian", "gluten-free"],
      },
      {
        name: "Tiramisu Classico",
        desc: { de: "Mascarpone, Espresso, Savoiardi", en: "Mascarpone, espresso, ladyfingers" },
        price: 7.5,
        img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop",
        category: "Dolci",
        dietary: ["vegetarian"],
      },
    ],
  },
  {
    id: "miso-social",
    slug: "miso-social",
    name: "Miso Social",
    tags: ["Japanese", "Sushi", "Ramen"],
    rating: 4.9,
    time: "25-40 min",
    fee: "€0.99",
    img: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=1200&h=900&fit=crop",
    status: "Open",
    area: "Berlin",
    address: "Oranienstraße 22, 10999 Berlin",
    phone: "+49 30 3456 7890",
    distanceKm: 1.2,
    minOrder: 12,
    about: {
      de: "Modernes Izakaya mit handgezogenen Ramen-Nudeln, kreativem Sushi und japanischen Tapas.",
      en: "Modern izakaya with hand-pulled ramen noodles, creative sushi, and Japanese tapas.",
    },
    menu: [
      {
        name: "Tonkotsu Ramen",
        desc: { de: "Schweinebrühe, Chashu, weiches Ei", en: "Pork broth, chashu, soft egg" },
        price: 15.9,
        img: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400&h=400&fit=crop",
        category: "Ramen",
      },
      {
        name: "Spicy Miso Ramen",
        desc: { de: "Miso-Brühe, Chili-Öl, Mais", en: "Miso broth, chili oil, corn" },
        price: 14.9,
        img: "https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=400&h=400&fit=crop",
        category: "Ramen",
      },
      {
        name: "Salmon Nigiri (6 St.)",
        desc: { de: "Sashimi-Lachs, Sushi-Reis", en: "Sashimi salmon, sushi rice" },
        price: 12.5,
        img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=400&fit=crop",
        category: "Sushi",
        dietary: ["gluten-free"],
      },
      {
        name: "Spicy Tuna Maki",
        desc: { de: "Gelbflossen-Thunfisch, Chili-Mayo", en: "Yellowfin tuna, chili mayo" },
        price: 11.0,
        img: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=400&fit=crop",
        category: "Sushi",
      },
      {
        name: "Edamame",
        desc: { de: "Meersalz, Sesam", en: "Sea salt, sesame" },
        price: 5.5,
        img: "https://images.unsplash.com/photo-1564844536311-de546a28c87d?w=400&h=400&fit=crop",
        category: "Sides",
        dietary: ["vegan", "gluten-free"],
      },
    ],
  },
  {
    id: "osteria-del-sole",
    slug: "osteria-del-sole",
    name: "Osteria del Sole",
    tags: ["Italienische Küche", "Steinofen-Pizza", "Weinbar"],
    rating: 4.8,
    time: "25-35 min",
    fee: "€1.99",
    img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=900&fit=crop",
    status: "Open",
    area: "Köln",
    address: "Aachener Straße 64, 50674 Köln",
    phone: "+49 221 8765 4321",
    distanceKm: 2.0,
    minOrder: 18,
    about: {
      de: "Neapolitanische Steinofen-Pizza mit 72 Stunden gereiftem Sauerteig, ausgewählte Antipasti und italienische Lebensfreude.",
      en: "Neapolitan wood-fired pizza with 72-hour fermented sourdough, curated antipasti, and Italian joie de vivre.",
    },
    menu: [
      {
        name: "Pizza Margherita DOP",
        desc: {
          de: "San-Marzano-Tomaten, Fior di Latte, frisches Basilikum, Olivenöl extra vergine",
          en: "San Marzano tomatoes, Fior di Latte, fresh basil, extra virgin olive oil",
        },
        price: 13.5,
        img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=450&fit=crop",
        category: "Steinofen-Pizza",
        dietary: ["vegetarian"],
      },
      {
        name: "Pizza Diavola Piccante",
        desc: {
          de: "Pikante Spianata-Salami aus Kalabrien, Fior di Latte, schwarze Oliven",
          en: "Spicy Calabrian Spianata salami, Fior di Latte, black olives",
        },
        price: 15.9,
        img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=450&fit=crop",
        category: "Steinofen-Pizza",
      },
      {
        name: "Vitello Tonnato",
        desc: {
          de: "Zart gegartes Kalbfleisch mit feiner Thunfisch-Kapern-Creme",
          en: "Thinly sliced veal with delicate tuna-caper cream",
        },
        price: 14.9,
        img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=450&fit=crop",
        category: "Antipasti",
        dietary: ["gluten-free"],
      },
    ],
  },
];

function mapRestaurant(r: any): Restaurant {
  const isGeneratedLogo =
    r.logo_url === "GENERATED_MONOGRAM" ||
    (!r.logo_url && BRANDING_ASSISTANT_ENABLED && r.use_generated_branding);

  const isGeneratedBanner =
    r.banner_image_url === "GENERATED_GRADIENT" ||
    (!r.banner_image_url && BRANDING_ASSISTANT_ENABLED && r.use_generated_branding);

  let resolvedLogo = generateSvgLogo(
    r.name || r.business_name || "Restaurant",
    r.cuisine_type || "Speisely Partner",
  );

  if (!isGeneratedLogo && r.logo_url) {
    if (
      r.logo_url.startsWith("http") ||
      r.logo_url.startsWith("/") ||
      r.logo_url.startsWith("data:")
    ) {
      resolvedLogo = r.logo_url;
    } else {
      resolvedLogo = supabase.storage.from("storefront-assets").getPublicUrl(r.logo_url)
        .data.publicUrl;
    }
  }

  let resolvedBanner = generateSvgBanner(
    r.name || r.business_name || "Restaurant",
    r.cuisine_type || "Speisely Partner",
  );

  if (!isGeneratedBanner && r.banner_image_url) {
    if (
      r.banner_image_url.startsWith("http") ||
      r.banner_image_url.startsWith("/") ||
      r.banner_image_url.startsWith("data:")
    ) {
      resolvedBanner = r.banner_image_url;
    } else {
      resolvedBanner = supabase.storage.from("storefront-assets").getPublicUrl(r.banner_image_url)
        .data.publicUrl;
    }
  }

  return {
    id: r.id,
    slug: r.slug,
    name: r.name || r.business_name || "Restaurant",
    tags: r.cuisine_type ? [r.cuisine_type] : [],
    rating: 4.5,
    time: "25-35 min",
    fee: r.delivery_fee != null ? `€${Number(r.delivery_fee).toFixed(2)}` : "€0.00",
    minOrder: Number(r.min_order_amount ?? 10),
    distanceKm: 2.0,
    status: r.is_active ? "Open" : "Closed",
    img: resolvedBanner,
    logo: resolvedLogo,
    use_generated_branding: r.use_generated_branding || false,
    area: r.city || "Berlin",
    address: r.business_address || "",
    phone: r.phone || "",
    about: { de: r.description || "", en: r.description || "" },
    serviceAreas: r.service_areas || "",
    acceptsCash: r.accepts_cash || false,
    acceptsPaypal: r.accepts_paypal || false,
    paypalEmail: r.paypal_email || "",
    stripeConnectStatus: r.stripe_connect_status || "not_connected",
    acceptsDelivery: r.accepts_delivery ?? true,
    acceptsPickup: r.accepts_pickup ?? true,
    announcement_active: r.announcement_active || false,
    announcement_text: r.announcement_text || "",
    announcement_bg_color: r.announcement_bg_color || "default",
    menu: (r.restaurant_products || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      desc: { de: p.description || "", en: p.description || "" },
      price: (p.price_cents || 0) / 100,
      img: p.image_url
        ? p.image_url.startsWith("http")
          ? p.image_url
          : supabase.storage.from("restaurant-products").getPublicUrl(p.image_url).data.publicUrl
        : null,
      category: p.category || "Menu",
      dietary: p.dietary_tags || [],
    })),
  };
}

function isSubscriptionBlocked(status: string | null): boolean {
  if (status === "canceled" || status === "unpaid") return true;
  return false;
}

let cachedRestaurants: { data: Restaurant[]; timestamp: number } | null = null;
const RESTAURANT_CACHE_TTL_MS = 60 * 1000; // 60 seconds

export async function getRestaurants(): Promise<Restaurant[]> {
  const now = Date.now();
  if (cachedRestaurants && now - cachedRestaurants.timestamp < RESTAURANT_CACHE_TTL_MS) {
    return cachedRestaurants.data;
  }

  const { data, error } = await supabase
    .from("restaurants")
    .select(
      "id, name, slug, description, logo_url, banner_image_url, city, cuisine_type, service_areas, custom_domain, announcement_active, announcement_text, announcement_bg_color, is_published, accepts_cash, accepts_paypal, stripe_connect_status, accepts_delivery, accepts_pickup, certifications, delivery_fee, delivery_radius_km, min_order_amount, operating_hours, seat_capacity, subscription_status, subscriptions(current_period_end), restaurant_products(*), approval_status, owner_id, business_address, use_generated_branding",
    )
    .eq("is_active", true)
    .eq("approval_status", "approved")
    .eq("is_published", true)
    .eq("show_in_marketplace", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching restaurants:", error);
  }

  const validData = (data || []).filter((r) => {
    return !isSubscriptionBlocked(r.subscription_status);
  });

  const liveRestaurants = validData.map(mapRestaurant);
  const MIN_DISPLAY_COUNT = 6;

  let result: Restaurant[];
  if (liveRestaurants.length >= MIN_DISPLAY_COUNT) {
    result = liveRestaurants;
  } else {
    const needed = MIN_DISPLAY_COUNT - liveRestaurants.length;
    const showcaseItems = fallbackRestaurants.slice(0, needed).map((r) => ({
      ...r,
      isShowcase: true,
    }));
    result = [...liveRestaurants, ...showcaseItems];
  }

  cachedRestaurants = { data: result, timestamp: now };
  return result;
}

export async function getRestaurant(slugOrId: string): Promise<Restaurant | undefined> {
  const clean = (slugOrId || "").toLowerCase().trim();
  const fallback = fallbackRestaurants.find(
    (r) => (r.id && r.id.toLowerCase() === clean) || (r.slug && r.slug.toLowerCase() === clean),
  );
  if (fallback) {
    return { ...fallback, isShowcase: true };
  }

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
    const query = supabase
      .from("restaurants")
      .select(
        "id, name, slug, description, logo_url, banner_image_url, city, cuisine_type, service_areas, custom_domain, announcement_active, announcement_text, announcement_bg_color, is_published, accepts_cash, accepts_paypal, stripe_connect_status, accepts_delivery, accepts_pickup, certifications, delivery_fee, delivery_radius_km, min_order_amount, operating_hours, seat_capacity, subscription_status, subscriptions(current_period_end), restaurant_products(*), approval_status, owner_id, business_address, use_generated_branding",
      );

    const fetchPromise = (
      isUuid ? query.or(`slug.eq.${slugOrId},id.eq.${slugOrId}`) : query.eq("slug", slugOrId)
    ).maybeSingle();

    const timeoutPromise = new Promise<{ data: null; error: null }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: null }), 2500),
    );

    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

    if (!error && data) {
      if (isSubscriptionBlocked(data.subscription_status)) {
        return undefined;
      }
      if (data.approval_status !== "approved") {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user?.id !== data.owner_id) {
          return undefined;
        }
      }
      return mapRestaurant(data);
    }
  } catch (e) {
    console.error("Error in getRestaurant:", e);
  }

  const fallbackAfter = fallbackRestaurants.find(
    (r) => (r.id && r.id.toLowerCase() === clean) || (r.slug && r.slug.toLowerCase() === clean),
  );
  if (fallbackAfter) {
    return { ...fallbackAfter, isShowcase: true };
  }
  return undefined;
}
