/* eslint-disable */
import { supabase } from "@/integrations/supabase/client";
import { BRANDING_ASSISTANT_ENABLED } from "@/utils/featureFlags";
import { generateSvgLogo, generateSvgBanner } from "@/utils/brandingGenerator";
import { getPublicCatererList } from "@/lib/caterer/menu.functions";

export type Caterer = {
  id: string;
  name: string;
  tagline: { de: string; en: string };
  rating: number;
  reviewCount: number;
  minOrder: number;
  minGuests: number;
  perPerson: number;
  time: string;
  tags: string[];
  img: string;
  logo?: string;
  slug?: string;
  use_generated_branding?: boolean;
  status: "available" | "busy";
  area: string;
  address: string;
  phone: string;
  cat: "wedding" | "corporate" | "private" | "ramadan" | "christmas" | "business" | "all";
  verified: boolean;
  dietary: string[];
  about: { de: string; en: string };
  packages: any[];
  menu?: { category?: string; [key: string]: any }[];
  serviceCategories?: string[];
  announcement_active?: boolean;
  announcement_bg_color?: string;
  announcement_text?: string;
  isShowcase?: boolean;
};

export const fallbackCaterers: Caterer[] = [
  {
    id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0001",
    slug: "veedos-kitchen",
    name: "VeeDo's Kitchen",
    tagline: {
      de: "Pakistani & Indische Spezialitäten · Catering-Anfragen für Events & Feiern",
      en: "Pakistani & Indian Specialties · Catering enquiries for Events & Celebrations",
    },
    rating: 4.9,
    reviewCount: 38,
    minOrder: 0,
    minGuests: 15,
    perPerson: 0,
    time: "48 Stunden Vorlauf",
    tags: ["Pakistani Catering", "Buffet & Grill", "Events & Feiern"],
    serviceCategories: ["events", "wedding", "private", "ramadan"],
    img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&h=900&fit=crop",
    logo: generateSvgLogo("VeeDo's Kitchen", "Pakistani Catering"),
    status: "available",
    area: "Berlin & Umgebung",
    address: "Berlin & umliegende Städte, Deutschland",
    phone: "",
    cat: "all",
    verified: true,
    dietary: ["Orient-Spezialitäten", "Vegetarisch"],
    about: {
      de: "VeeDo's Kitchen bietet Catering-Anfragen für Feiern, Hochzeiten und geschäftliche Events in Berlin und umliegenden Städten. Auswahl an Biryani, Spezialitäten vom Grill und traditionellen Nachspeisen. Alle Preise auf Anfrage.",
      en: "VeeDo's Kitchen offers catering enquiries for celebrations, weddings, and corporate events in Berlin and adjacent cities. Selection of Biryani, grill specialties, and traditional desserts. All prices on request.",
    },
    announcement_active: true,
    announcement_bg_color: "primary",
    announcement_text:
      "ℹ️ Ihre Anfrage ist unverbindlich. Der Caterer bestätigt Verfügbarkeit und Details separat.",
    packages: [
      {
        id: "biryani-party-menu",
        title: "Biryani Party Menu",
        price_amount: 0,
        price_type: "on_request",
        min_guests: 20,
        short_summary: "Chicken Dum Biryani, Seekh Kebab Platter, Raita, Salad & Gulab Jamun",
        description:
          "Das ultimative Biryani-Party-Paket inkl. Chicken Dum Biryani, frisch gegrillten Seekh Kebabs, hausgemachtem Raita, frischem Salat und warmen Gulab Jamun.",
        included_items: [
          "Chicken Dum Biryani",
          "Seekh Kebab Platter",
          "Raita",
          "Fresh Salad",
          "Gulab Jamun",
        ],
      },
      {
        id: "traditional-dawat-menu",
        title: "Traditional Dawat Menu",
        price_amount: 0,
        price_type: "on_request",
        min_guests: 25,
        short_summary: "Lahori Nihari, Chicken Karahi, Basmati Rice, Naan & Shahi Kheer",
        description:
          "Traditionelles Festtagsmenü mit zartem Lahori Nihari, Peshawari Chicken Karahi, aromatischem Basmatireis, frischem Naan und cremiger Shahi Kheer.",
        included_items: [
          "Lahori Khas Nihari",
          "Peshawari Chicken Karahi",
          "Plain Basmati Rice",
          "Garlic Naan",
          "Shahi Kheer",
        ],
      },
      {
        id: "mehndi-dholki-menu",
        title: "Mehndi & Dholki Menu",
        price_amount: 0,
        price_type: "on_request",
        min_guests: 30,
        short_summary: "Chicken Tikka, Chapli Kebab, Samosa, Chana Chaat, Naan & Jalebi",
        description:
          "Buntes Fingerfood- & BBQ-Buffet für Pre-Wedding-Feiern inkl. Live-Style Starters, Grill-Spezialitäten, Naan und frischer Jalebi.",
        included_items: [
          "Chicken Tikka",
          "Chapli Kebab",
          "Samosa",
          "Chana Chaat",
          "Fresh Naan",
          "Jalebi",
        ],
      },
      {
        id: "wedding-shahi-buffet",
        title: "Wedding Shahi Buffet",
        price_amount: 0,
        price_type: "on_request",
        min_guests: 50,
        short_summary: "Mutton Biryani, Chicken Handi, Malai Boti, Naan, Ras Malai & Kheer",
        description:
          "Exklusives Hochzeitsbuffet mit Shahi Mutton Biryani, cremiger Chicken Handi, Malai Boti, Naan-Auswahl sowie Ras Malai und Kheer.",
        included_items: [
          "Shahi Mutton Biryani",
          "Chicken Handi",
          "Malai Boti",
          "Garlic & Plain Naan",
          "Ras Malai",
          "Shahi Kheer",
        ],
      },
      {
        id: "aqeeqah-catering-menu",
        title: "Aqeeqah Catering Menu",
        price_amount: 0,
        price_type: "on_request",
        min_guests: 30,
        short_summary: "Mutton Karahi, Mutton Pulao, Naan, Salad & Gajar Halwa",
        description:
          "Traditionelles Aqeeqah-Buffet mit frischem Mutton Karahi, Mutton Yakhni Pulao, Tandoori Breads, frischem Salat und Gajar Halwa.",
        included_items: [
          "Mutton Karahi",
          "Mutton Yakhni Pulao",
          "Tandoori Roti",
          "Fresh Salad",
          "Gajar Halwa",
        ],
      },
      {
        id: "ramadan-iftar-buffet",
        title: "Ramadan Iftar Buffet",
        price_amount: 0,
        price_type: "on_request",
        min_guests: 25,
        short_summary: "Datteln, Samosa, Pakora, Dahi Bhalla, Rooh Afza, Chicken Biryani & Naan",
        description:
          "Reichhaltiges Iftar-Buffet mit Datteln, Samosas, Pakoras, Dahi Bhalla, kühlem Rooh Afza, gefolgt von Chicken Biryani und Naan.",
        included_items: [
          "Datteln & Iftar Snacks",
          "Samosa & Pakora",
          "Dahi Bhalla",
          "Rooh Afza Lassi",
          "Chicken Biryani",
          "Naan",
        ],
      },
      {
        id: "office-community-event-menu",
        title: "Office & Community Event Menu",
        price_amount: 0,
        price_type: "on_request",
        min_guests: 20,
        short_summary: "Chicken Biryani, Daal Tarka, Naan, Salad & Mineral Water",
        description:
          "Unkompliziertes Catering für Firmen-Lunches und Community-Events inkl. Hauptgang, Beilage, Brot und Getränken.",
        included_items: ["Chicken Biryani", "Daal Tarka", "Fresh Naan", "Salad", "Mineral Water"],
      },
      {
        id: "vegetarian-pakistani-menu",
        title: "Vegetarian Pakistani Menu",
        price_amount: 0,
        price_type: "on_request",
        min_guests: 15,
        short_summary: "Vegetable Biryani, Palak Paneer, Daal Mash, Naan, Raita & Kheer",
        description:
          "100% vegetarisches Spezialitäten-Buffet mit gemischter Gemüserreis-Biryani, Palak Paneer, Daal Mash, Naan und Kheer.",
        included_items: [
          "Vegetable Biryani",
          "Palak Paneer",
          "Daal Mash",
          "Fresh Naan",
          "Raita",
          "Shahi Kheer",
        ],
      },
    ],
    menu: [
      // 1. Biryani & Rice
      {
        id: "item-biryani-chicken",
        category: "Biryani & Rice",
        name: "Chicken Dum Biryani",
        desc: {
          de: "Traditionell im Tonkrug gedämpfter Basmati-Safranreis mit zartem Hähnchenfleisch, orientalischen Gewürzen, Raita & Salat.",
          en: "Traditional dum-cooked saffron basmati rice with tender chicken, aromatic spices, raita & salad.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=600&fit=crop",
      },
      {
        id: "item-biryani-mutton",
        category: "Biryani & Rice",
        name: "Mutton Biryani",
        desc: {
          de: "Festliche Lamm-Biryani mit zart geschmortem Lammfleisch, Nüssen, Rosinen und erlesenem Basmatireis.",
          en: "Royal mutton biryani cooked with tender lamb meat, nuts, raisins, and aromatic basmati rice.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&h=600&fit=crop",
      },
      {
        id: "item-biryani-beef",
        category: "Biryani & Rice",
        name: "Beef Biryani",
        desc: {
          de: "Herzhafte Rinder-Biryani mit zartem Rindfleisch, aromatischen Gewürzen und duftendem Safran-Basmatireis.",
          en: "Savory beef biryani with tender beef cuts, spices, and fragrant saffron basmati rice.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=600&fit=crop",
      },
      {
        id: "item-biryani-veg",
        category: "Biryani & Rice",
        name: "Vegetable Biryani",
        desc: {
          de: "Aromatische Reispfanne mit frischem Saisongemüse, Erbsen, Paneer, Cashews und Safran.",
          en: "Aromatic basmati rice dish with fresh seasonal vegetables, peas, paneer, cashews & saffron.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800&h=600&fit=crop",
      },
      {
        id: "item-pulao-chicken",
        category: "Biryani & Rice",
        name: "Chicken Pulao",
        desc: {
          de: "Milder Gewürzreis gekocht in kräftiger Hühnerbrühe mit Nelken, Zimt und Zwiebeln.",
          en: "Mildly spiced basmati rice simmered in rich chicken broth with whole spices.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=600&fit=crop",
      },
      {
        id: "item-pulao-mutton",
        category: "Biryani & Rice",
        name: "Mutton Pulao",
        desc: {
          de: "Traditioneller Lamm-Pulao mit feiner Note von schwarzem Pfeffer, Kardamom und geschmorten Zwiebeln.",
          en: "Traditional mutton pulao infused with black pepper, cardamom, and caramelized onions.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&h=600&fit=crop",
      },
      {
        id: "item-pulao-yakhni",
        category: "Biryani & Rice",
        name: "Yakhni Pulao",
        desc: {
          de: "Klassischer Yakhni-Reis in reduzierter Knochenbrühe gekocht für maximalen Geschmack.",
          en: "Classic Yakhni pulao cooked in reduced bone broth for deep aromatic flavor.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&h=600&fit=crop",
      },
      {
        id: "item-pulao-matar",
        category: "Biryani & Rice",
        name: "Matar Pulao",
        desc: {
          de: "Duftender Basmatireis mit süßen Erbsen, Kreuzkümmel und einem Hauch von Ghee.",
          en: "Fragrant basmati rice tossed with sweet green peas, cumin seeds, and ghee.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800&h=600&fit=crop",
      },
      {
        id: "item-rice-zeera",
        category: "Biryani & Rice",
        name: "Zeera Rice",
        desc: {
          de: "Gedämpfter Basmatireis angeröstet mit gerösteten Kreuzkümmelsamen und frischem Koriander.",
          en: "Steamed basmati rice tempered with roasted cumin seeds and fresh coriander.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&h=600&fit=crop",
      },
      {
        id: "item-rice-basmati",
        category: "Biryani & Rice",
        name: "Plain Basmati Rice",
        desc: {
          de: "Reiner, langkörniger Basmatireis auf den Punkt gedämpft.",
          en: "Pure long-grain fluffy basmati rice steamed to perfection.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&h=600&fit=crop",
      },
      {
        id: "item-dessert-zarda-rice",
        category: "Biryani & Rice",
        name: "Zarda",
        desc: {
          de: "Süßer Festtags-Safranreis mit Mandeln, Pistazien, Rosinen und Kokosraspeln.",
          en: "Sweet festive saffron rice enriched with almonds, pistachios, raisins & coconut.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&h=600&fit=crop",
      },

      // 2. Traditional Pakistani Specialities
      {
        id: "item-lahori-nihari",
        category: "Traditional Pakistani Specialities",
        name: "Nihari",
        desc: {
          de: "Langsam über Nacht geschmortes Rinderfleisch in würziger Gravy-Sauce mit frischem Ingwer & Chili.",
          en: "Slow-cooked beef stew in rich aromatic gravy served with fresh ginger & green chili.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
      },
      {
        id: "item-shahi-haleem",
        category: "Traditional Pakistani Specialities",
        name: "Haleem",
        desc: {
          de: "Cremiger Eintopf aus Weizen, Gerste, Linsen und zart geschmortem Fleisch mit Röstzwiebeln.",
          en: "Creamy slow-cooked stew of wheat, barley, lentils, and tender meat garnished with fried onions.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
      },
      {
        id: "item-mutton-paya",
        category: "Traditional Pakistani Specialities",
        name: "Paya",
        desc: {
          de: "Traditionelle Lammhaxen-Suppe mit intensiver Gewürznote, perfekt zu frischem Naan.",
          en: "Traditional slow-simmered mutton trotters soup with rich aromatic spices.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
      },
      {
        id: "item-kunna-gosht",
        category: "Traditional Pakistani Specialities",
        name: "Kunna Gosht",
        desc: {
          de: "Chinioti Spezialität: Zartes Lammfleisch im Tonkrug geschmort mit Kreuzkümmel und dunkler Gravy.",
          en: "Chinioti specialty: Mutton slow-cooked in earthenware clay pot with cumin and rich gravy.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
      },
      {
        id: "item-aloo-gosht",
        category: "Traditional Pakistani Specialities",
        name: "Aloo Gosht",
        desc: {
          de: "Klassisches Lamm- oder Rinder-Curry mit Kartoffeln in herzhafter Tomaten-Zwiebel-Gravy.",
          en: "Home-style mutton or beef curry stewed with tender potatoes and fresh herbs.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop",
      },
      {
        id: "item-keema-matar",
        category: "Traditional Pakistani Specialities",
        name: "Keema Matar",
        desc: {
          de: "Würziges Rinderhackfleisch gebraten mit grünen Erbsen, Ingwer, Knoblauch und Garam Masala.",
          en: "Minced beef sautéed with green peas, ginger, garlic, and aromatic Garam Masala.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop",
      },
      {
        id: "item-kofta-curry",
        category: "Traditional Pakistani Specialities",
        name: "Kofta Curry",
        desc: {
          de: "Saftige Fleischbällchen aus Rinderhack geschmort in pikant gewürzter Joghurt-Gravy.",
          en: "Juicy minced beef meatballs simmered in a spiced yogurt and onion curry gravy.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop",
      },

      // 3. Chicken Dishes
      {
        id: "item-chicken-karahi",
        category: "Chicken Dishes",
        name: "Chicken Karahi",
        desc: {
          de: "Frisch zubereitetes Hähnchen-Curry aus dem Kadhai mit sonnengereiften Tomaten & schwarzem Pfeffer.",
          en: "Fresh wok-cooked chicken curry with ripe tomatoes, black pepper, and fresh coriander.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop",
      },
      {
        id: "item-chicken-handi",
        category: "Chicken Dishes",
        name: "Chicken Handi",
        desc: {
          de: "Cremiges Hähnchen-Curry im Tonkrug mit Sahne, Bockshornklee und milder Mandelsauce.",
          en: "Creamy boneless chicken curry prepared in clay pot with cream, fenugreek, and almonds.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop",
      },
      {
        id: "item-chicken-qorma",
        category: "Chicken Dishes",
        name: "Chicken Qorma",
        desc: {
          de: "Königliches Moghul-Hähnchen-Qorma geschmort mit Röstzwiebeln, Joghurt und Nüssen.",
          en: "Royal Mughlai chicken qorma braised with fried onions, yogurt, and aromatic spices.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop",
      },
      {
        id: "item-achari-chicken",
        category: "Chicken Dishes",
        name: "Achari Chicken",
        desc: {
          de: "Pikant-säuerliches Hähnchen-Curry gekocht mit traditionellem Einlegegewürz (Pickle Spices).",
          en: "Tangy and spicy chicken curry cooked with traditional pickling spices (Achar).",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop",
      },
      {
        id: "item-chicken-jalfrezi",
        category: "Chicken Dishes",
        name: "Chicken Jalfrezi",
        desc: {
          de: "Zartes Hähnchenbrustfilet gebraten mit bunten Paprikastreifen, Zwiebeln & Ei.",
          en: "Boneless chicken stir-fried with crisp bell peppers, onions, and spicy tomato sauce.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop",
      },
      {
        id: "item-butter-chicken",
        category: "Chicken Dishes",
        name: "Butter Chicken",
        desc: {
          de: "Gegrilltes Tikka-Hähnchen in samtiger Tomaten-Sahne-Butter-Sauce.",
          en: "Tandoori grilled chicken pieces in a silky smooth tomato, butter, and cream sauce.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop",
      },

      // 4. Mutton & Beef Dishes
      {
        id: "item-mutton-karahi",
        category: "Mutton & Beef Dishes",
        name: "Mutton Karahi",
        desc: {
          de: "Zartes Lammfleisch im Kadhai geschmort mit Tomaten, schwarzem Pfeffer, Ingwer & Koriander.",
          en: "Tender mutton cooked in Karahi wok with tomatoes, black pepper, ginger & cilantro.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
      },
      {
        id: "item-mutton-qorma",
        category: "Mutton & Beef Dishes",
        name: "Mutton Qorma",
        desc: {
          de: "Festliches Lamm-Qorma in dicker, aromatischer Joghurt-Kewra-Gravy.",
          en: "Festive mutton qorma slow-cooked in thick spiced yogurt and Kewra gravy.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
      },
      {
        id: "item-beef-karahi",
        category: "Mutton & Beef Dishes",
        name: "Beef Karahi",
        desc: {
          de: "Herzhaftes Rindfleisch-Karahi gebraten mit frischen Tomaten, grünen Chilis & Ingwer.",
          en: "Flavorful beef karahi sautéed with fresh tomatoes, green chilies, and julienned ginger.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
      },
      {
        id: "item-beef-qorma",
        category: "Mutton & Beef Dishes",
        name: "Beef Qorma",
        desc: {
          de: "Reichhaltiges Rinder-Qorma geschmort nach traditionellem Lahori Rezept.",
          en: "Rich beef qorma braised slowly according to traditional Lahori recipe.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
      },

      // 5. BBQ & Grilled Dishes
      {
        id: "item-bbq-chicken-tikka",
        category: "BBQ & Grilled Dishes",
        name: "Chicken Tikka",
        desc: {
          de: "In Joghurt & Gewürzen marinierte Hähnchenkeule auf Holzkohle gegrillt.",
          en: "Charcoal-grilled chicken leg marinated in spiced yogurt and herbs.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=600&fit=crop",
      },
      {
        id: "item-bbq-chicken-boti",
        category: "BBQ & Grilled Dishes",
        name: "Chicken Boti",
        desc: {
          de: "Saftige Hähnchenbrust-Stücke gegrillt am Spieß mit Minzsauce.",
          en: "Juicy boneless chicken breast cubes skewered and grilled over charcoal.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=600&fit=crop",
      },
      {
        id: "item-bbq-malai-boti",
        category: "BBQ & Grilled Dishes",
        name: "Malai Boti",
        desc: {
          de: "Zarte Hähnchenboti mariniert in Frischkäse, Sahne und weißem Pfeffer.",
          en: "Melt-in-mouth chicken pieces marinated in cream, cheese, and white pepper.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=600&fit=crop",
      },
      {
        id: "item-seekh-kebabs",
        category: "BBQ & Grilled Dishes",
        name: "Seekh Kebab",
        desc: {
          de: "Saftig gegrillte Hackfleischspieße vom Lamm & Rind mit Minz-Chutney.",
          en: "Juicy grilled minced lamb and beef skewers seasoned with fresh herbs.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=600&fit=crop",
      },
      {
        id: "item-bbq-chapli-kebab",
        category: "BBQ & Grilled Dishes",
        name: "Chapli Kebab",
        desc: {
          de: "Peshawari Rinderhack-Frikadellen gebraten mit Granatapfelkernen & Tomatenscheibe.",
          en: "Traditional Peshawari spiced minced beef patties with pomegranate seeds & tomato.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=600&fit=crop",
      },
      {
        id: "item-bbq-reshmi-kebab",
        category: "BBQ & Grilled Dishes",
        name: "Reshmi Kebab",
        desc: {
          de: "Zarte Hähnchenhackspieße verfeinert mit Eiweiß, Sahne & Safran.",
          en: "Silky soft minced chicken skewers seasoned with mild aromatic cream & saffron.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=600&fit=crop",
      },
      {
        id: "item-bbq-mixed-platter",
        category: "BBQ & Grilled Dishes",
        name: "Mixed Grill Platter",
        desc: {
          de: "Gemischte Grillplatte: Chicken Tikka, Malai Boti, Seekh Kebab & Chapli Kebab.",
          en: "Assorted grill platter featuring Chicken Tikka, Malai Boti, Seekh & Chapli Kebab.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=600&fit=crop",
      },

      // 6. Daal & Vegetarian Dishes
      {
        id: "item-daal-chana",
        category: "Daal & Vegetarian Dishes",
        name: "Daal Chana",
        desc: {
          de: "Gelbe Kichererbsenlinsen langsam gekocht und mit Knoblauch-Kümmel-Tarka verfeinert.",
          en: "Yellow split chickpeas cooked slow and tempered with garlic, cumin & ghee.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
      },
      {
        id: "item-daal-mash",
        category: "Daal & Vegetarian Dishes",
        name: "Daal Mash",
        desc: {
          de: "Weiße Urid-Linsen trocken gebraten in Kadhai mit grünem Chili, Ingwer & Butter.",
          en: "Skinned white lentils wok-fried dry with green chili, ginger & butter.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
      },
      {
        id: "item-daal-tarka",
        category: "Daal & Vegetarian Dishes",
        name: "Daal Tarka",
        desc: {
          de: "Cremige gelbe Linsensuppe serviert mit knusprigem Anfragen-Tarka aus Ingwer & Zwiebeln.",
          en: "Creamy yellow lentils finished with aromatic butter garlic & chili tempering.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
      },
      {
        id: "item-chana-masala",
        category: "Daal & Vegetarian Dishes",
        name: "Chana Masala",
        desc: {
          de: "Kichererbsen in würziger Tomaten-Zwiebel-Sauce nach Lahori Art.",
          en: "Savory chickpeas stewed in spiced onion tomato curry Lahori style.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
      },
      {
        id: "item-aloo-palak",
        category: "Daal & Vegetarian Dishes",
        name: "Aloo Palak",
        desc: {
          de: "Frischer Spinat gekocht mit würzigen Kartoffelwürfeln.",
          en: "Fresh spinach cooked with spiced potato cubes and fenugreek.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800&h=600&fit=crop",
      },
      {
        id: "item-palak-paneer",
        category: "Daal & Vegetarian Dishes",
        name: "Palak Paneer",
        desc: {
          de: "Cremiger Spinat mit hausgemachten indischen Käsewürfeln.",
          en: "Creamy spinach curry with soft homemade cottage cheese cubes.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800&h=600&fit=crop",
      },
      {
        id: "item-mix-veg-curry",
        category: "Daal & Vegetarian Dishes",
        name: "Mixed Vegetable Curry",
        desc: {
          de: "Bunt gemischtes Saisongemüse (Karotten, Erbsen, Blumenkohl) in feiner Curry sauce.",
          en: "Seasonal garden vegetables cooked in a fragrant curry gravy.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800&h=600&fit=crop",
      },

      // 7. Street Food & Starters
      {
        id: "item-starter-samosa",
        category: "Street Food & Starters",
        name: "Samosa",
        desc: {
          de: "Knusprige Teigtaschen gefüllt mit würzigem Kartoffel-Erbsen-Masala.",
          en: "Crispy fried pastry filled with spiced potato and green pea filling.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop",
      },
      {
        id: "item-starter-veg-pakora",
        category: "Street Food & Starters",
        name: "Vegetable Pakora",
        desc: {
          de: "In Kichererbsenteig frittierte Gemüsestücke (Zwiebeln, Kartoffeln, Spinat).",
          en: "Deep-fried crispy vegetable fritters coated in spiced chickpea batter.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop",
      },
      {
        id: "item-starter-chicken-pakora",
        category: "Street Food & Starters",
        name: "Chicken Pakora",
        desc: {
          de: "Saftiges Hähnchenbrustfilet in würziger Pakora-Panade goldbraun frittiert.",
          en: "Crispy fried spiced chicken tenders in chickpea flour batter.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop",
      },
      {
        id: "item-starter-spring-rolls",
        category: "Street Food & Starters",
        name: "Spring Rolls",
        desc: {
          de: "Knusprige Frühlingsrollen gefüllt mit Hähnchen und feinem Gemüse.",
          en: "Crispy rolls filled with shredded chicken and seasoned vegetables.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop",
      },
      {
        id: "item-starter-chana-chaat",
        category: "Street Food & Starters",
        name: "Chana Chaat",
        desc: {
          de: "Erfrischender Kichererbsensalat mit Tomaten, Zwiebeln, Tamarinden-Chutney & Chaat Masala.",
          en: "Tangy chickpea salad with onions, tomatoes, tamarind chutney & Chaat spices.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop",
      },
      {
        id: "item-starter-dahi-bhalla",
        category: "Street Food & Starters",
        name: "Dahi Bhalla",
        desc: {
          de: "Weiche Linsenbällchen in cremig gewürztem Joghurt mit süß-säuerlichen Chutneys.",
          en: "Soft lentil dumplings soaked in sweetened spiced yogurt with chutneys.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop",
      },
      {
        id: "item-starter-papri-chaat",
        category: "Street Food & Starters",
        name: "Papri Chaat",
        desc: {
          de: "Knusprige Teig-Papris mit Kichererbsen, Kartoffeln, Joghurt & Minz-Chutney.",
          en: "Crispy flour crackers topped with potatoes, chickpeas, yogurt & mint chutney.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop",
      },
      {
        id: "item-starter-gol-gappay",
        category: "Street Food & Starters",
        name: "Gol Gappay",
        desc: {
          de: "Knusprige Hohlkugeln gefüllt mit Kichererbsen & würzig-saurem Tamarindenwasser.",
          en: "Crispy hollow puris served with spiced chickpea filling & tangy tamarind water.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop",
      },

      // 8. Breads & Sides
      {
        id: "item-bread-naan",
        category: "Breads & Sides",
        name: "Naan",
        desc: {
          de: "Ofenfrisches Fladenbrot im Tandoor gebacken.",
          en: "Freshly baked leavened flatbread from the tandoor oven.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop",
      },
      {
        id: "item-bread-garlic-naan",
        category: "Breads & Sides",
        name: "Garlic Naan",
        desc: {
          de: "Ofenfrisches Naan bestrichen mit Knoblauchbutter & frischem Koriander.",
          en: "Tandoori naan brushed with garlic butter and fresh coriander.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop",
      },
      {
        id: "item-bread-tandoori-roti",
        category: "Breads & Sides",
        name: "Tandoori Roti",
        desc: {
          de: "Traditionelles Vollkorn-Fladenbrot aus dem Tonofen.",
          en: "Whole wheat flatbread baked crispy in clay tandoor.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop",
      },
      {
        id: "item-bread-chapati",
        category: "Breads & Sides",
        name: "Chapati",
        desc: {
          de: "Dünnes Vollkorn-Fladenbrot von der Gusseisenplatte (Tawa).",
          en: "Thin unleavened whole wheat flatbread cooked on tawa.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop",
      },
      {
        id: "item-bread-paratha",
        category: "Breads & Sides",
        name: "Paratha",
        desc: {
          de: "Mehrschichtiges, mit Ghee bestrichenes knuspriges Fladenbrot.",
          en: "Flaky layered whole wheat flatbread fried with Ghee.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop",
      },
      {
        id: "item-side-raita",
        category: "Breads & Sides",
        name: "Raita",
        desc: {
          de: "Erfrischender Joghurt mit Gurken, Minze und geröstetem Kreuzkümmel.",
          en: "Cooling yogurt dip with cucumber, mint, and roasted cumin.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&h=600&fit=crop",
      },
      {
        id: "item-side-salad",
        category: "Breads & Sides",
        name: "Fresh Salad",
        desc: {
          de: "Frischer Salat aus Gurken, Tomaten, Zwiebeln, Zitronenscheiben & grüner Chili.",
          en: "Fresh garden salad of sliced cucumber, tomatoes, onions & lemon.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop",
      },
      {
        id: "item-side-chutney",
        category: "Breads & Sides",
        name: "Chutney",
        desc: {
          de: "Hausgemachte Dips: Grünes Minz-Koriander-Chutney & Süßes Tamarinden-Chutney.",
          en: "Homemade dip selection: Mint coriander green chutney & sweet tamarind chutney.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&h=600&fit=crop",
      },
      {
        id: "item-side-pickles",
        category: "Breads & Sides",
        name: "Pickles",
        desc: {
          de: "Traditionell eingelegtes pikantes Mango- & Chili-Achar.",
          en: "Traditional spicy mixed mango and chili pickle (Achar).",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&h=600&fit=crop",
      },

      // 9. Desserts
      {
        id: "item-dessert-gulab-jamun",
        category: "Desserts",
        name: "Gulab Jamun",
        desc: {
          de: "Warme, in Kardamom-Rosenwasser-Sirup getränkte Milchbällchen.",
          en: "Warm soft milk-solid dumplings soaked in cardamom rose syrup.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&h=600&fit=crop",
      },
      {
        id: "item-dessert-kheer",
        category: "Desserts",
        name: "Kheer",
        desc: {
          de: "Cremiger Safran-Reispudding garniert mit gehobelten Mandeln & Pistazien.",
          en: "Creamy saffron rice pudding garnished with slivered almonds & pistachios.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&h=600&fit=crop",
      },
      {
        id: "item-dessert-gajar-halwa",
        category: "Desserts",
        name: "Gajar Halwa",
        desc: {
          de: "Traditionelles Karotten-Halwa gekocht in Milch, Ghee, Khoya und Nüssen.",
          en: "Traditional sweet carrot pudding cooked with milk, ghee, khoya & nuts.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&h=600&fit=crop",
      },
      {
        id: "item-dessert-suji-halwa",
        category: "Desserts",
        name: "Suji Halwa",
        desc: {
          de: "Klassisches Grieß-Halwa geröstet in Ghee mit Kardamom.",
          en: "Classic sweet semolina pudding roasted in ghee with cardamom.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&h=600&fit=crop",
      },
      {
        id: "item-dessert-ras-malai",
        category: "Desserts",
        name: "Ras Malai",
        desc: {
          de: "Zarte Hüttenkäse-Klößchen serviert in eisgekühlter Safran-Milch.",
          en: "Soft cottage cheese patties served in chilled saffron cardamom milk.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&h=600&fit=crop",
      },
      {
        id: "item-dessert-jalebi",
        category: "Desserts",
        name: "Jalebi",
        desc: {
          de: "Knusprige frittierte Safranteig-Spiralen getränkt in Zucker-Sirup.",
          en: "Crispy fried saffron batter spirals soaked in warm sugar syrup.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&h=600&fit=crop",
      },

      // 10. Drinks
      {
        id: "item-drink-mango-lassi",
        category: "Drinks",
        name: "Mango Lassi",
        desc: {
          de: "Cremiges Joghurtgetränk zubereitet mit fruchtigem Alphonso-Mangomark.",
          en: "Creamy yogurt drink blended with sweet Alphonso mango pulp.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&h=600&fit=crop",
      },
      {
        id: "item-drink-sweet-lassi",
        category: "Drinks",
        name: "Sweet Lassi",
        desc: {
          de: "Traditionelles süßes Joghurtgetränk verfeinert mit Kardamom.",
          en: "Traditional sweet churned yogurt beverage flavored with cardamom.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&h=600&fit=crop",
      },
      {
        id: "item-drink-salted-lassi",
        category: "Drinks",
        name: "Salted Lassi",
        desc: {
          de: "Erfrischend-herbes Joghurtgetränk mit geröstetem Kreuzkümmel und Meersalz.",
          en: "Refreshing savory yogurt drink flavored with roasted cumin and sea salt.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&h=600&fit=crop",
      },
      {
        id: "item-drink-rooh-afza",
        category: "Drinks",
        name: "Rooh Afza",
        desc: {
          de: "Erfrischendes orientalisches Kräuter- & Rosen-Sirup-Getränk.",
          en: "Refreshing herbal rose syrup drink served chilled with ice.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&h=600&fit=crop",
      },
      {
        id: "item-drink-soft-drinks",
        category: "Drinks",
        name: "Soft Drinks",
        desc: {
          de: "Auswahl an Erfrischungsgetränken (Coca-Cola, Fanta, Sprite).",
          en: "Assorted soft drinks (Coca-Cola, Fanta, Sprite).",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&h=600&fit=crop",
      },
      {
        id: "item-drink-water",
        category: "Drinks",
        name: "Mineral Water",
        desc: {
          de: "Gekühltes Mineralwasser (still / spritzig).",
          en: "Chilled bottled mineral water (still / sparkling).",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&h=600&fit=crop",
      },
      {
        id: "item-drink-chai",
        category: "Drinks",
        name: "Pakistani Chai",
        desc: {
          de: "Heißer, gekochter Gewürz-Milchtee mit Kardamom & Ingwer.",
          en: "Hot brewed Pakistani spiced milk tea infused with cardamom & ginger.",
        },
        price_cents: 0,
        unit: "Preis auf Anfrage",
        serves: 1,
        is_available: true,
        image_url:
          "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&h=600&fit=crop",
      },
    ],
  },
  {
    id: "partyservice-kuepper",
    slug: "partyservice-kuepper",
    name: "Partyservice Küpper",
    tagline: {
      de: "Feine Buffets, Event-Catering, Firmen-Abos & Gemeinschaftsverpflegung",
      en: "Fine Buffets, Event Catering, Corporate Subscriptions & Institutional Catering",
    },
    rating: 5.0,
    reviewCount: 48,
    minOrder: 150,
    minGuests: 10,
    perPerson: 18,
    time: "48 Stunden Vorlauf",
    tags: ["Event Catering", "Firmen-Abo", "Gemeinschaftsverpflegung", "Buffet"],
    serviceCategories: ["events", "daily-catering-subscriptions", "institutional-catering"],
    img: "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&h=900&fit=crop",
    logo: generateSvgLogo("Partyservice Küpper", "Event & B2B Catering"),
    status: "available",
    area: "Solingen & NRW",
    address: "Solingen, Deutschland",
    phone: "+49 212 1234567",
    cat: "all",
    verified: true,
    dietary: ["Buffet-Klassiker", "Deftige Spezialitäten", "Vegetarisch"],
    about: {
      de: "Ihr erfahrener Partner für Event-Catering, tägliche Firmenverpflegung und Institutionen. Wir bieten maßgeschneiderte Buffets und Frische-Konzepte.",
      en: "Your experienced partner for event catering, daily corporate meals, and institutional dining.",
    },
    packages: [],
    menu: [],
  },
  {
    id: "maison-verde",
    name: "Maison Verde",
    tagline: { de: "Fine Dining · Privates Dinner", en: "Fine Dining · Private Dinner" },
    rating: 4.9,
    reviewCount: 128,
    minOrder: 600,
    time: "7 Tage Vorlauf",
    tags: ["Fine Dining", "Französisch", "Exklusiv"],
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=900&fit=crop",
    status: "available",
    area: "Berlin Mitte",
    address: "Auguststraße 14, 10117 Berlin",
    phone: "+49 30 4567 1234",
    cat: "private",
    minGuests: 10,
    perPerson: 85,
    verified: true,
    dietary: ["Vegetarian", "Vegan"],
    about: {
      de: "Intime Fine-Dining-Erlebnisse bei dir zuhause — saisonal, regional und persönlich serviert.",
      en: "Intimate fine dining experiences at your home — seasonal, regional and personally served.",
    },
    announcement_active: true,
    announcement_bg_color: "secondary",
    announcement_text: "Available for last-minute bookings this weekend! 🥂",
    packages: [],
    menu: [
      {
        name: "6-Gänge Fine Dining",
        desc: { de: "Saisonales Menü", en: "Seasonal menu" },
        price: 85,
        unit: { de: "Person", en: "person" },
        serves: 1,
        category: "Menü",
      },
      {
        name: "Weinbegleitung",
        desc: { de: "Passende Weine", en: "Matching wines" },
        price: 45,
        unit: { de: "Person", en: "person" },
        serves: 1,
        category: "Getränke",
      },
    ],
  },
  {
    id: "stadt-tafel",
    name: "Stadt & Tafel",
    tagline: { de: "Modern Sharing · Corporate", en: "Modern Sharing · Corporate" },
    rating: 4.7,
    reviewCount: 340,
    minOrder: 350,
    time: "3 Tage Vorlauf",
    tags: ["Sharing", "Bowls", "Team Lunch"],
    img: "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&h=900&fit=crop",
    status: "busy",
    area: "Kreuzberg",
    address: "Lobeckstraße 30, 10969 Berlin",
    phone: "+49 30 4567 2345",
    cat: "business",
    minGuests: 20,
    perPerson: 25,
    verified: true,
    dietary: ["Vegetarian", "Gluten-free"],
    about: {
      de: "Sharing-Bowls und Plattenkonzepte für Team-Events, Konferenzen und Office-Lunches.",
      en: "Sharing bowls and platter concepts for team events, conferences and office lunches.",
    },
    packages: [],
    menu: [
      {
        name: "Sharing Bowl: Levantine",
        desc: { de: "Hummus, Falafel, Tabbouleh", en: "Hummus, falafel, tabbouleh" },
        price: 25,
        unit: { de: "Person", en: "person" },
        serves: 1,
        category: "Bowls",
      },
      {
        name: "Sharing Bowl: Asian",
        desc: { de: "Edamame, Teriyaki, Reis", en: "Edamame, teriyaki, rice" },
        price: 28,
        unit: { de: "Person", en: "person" },
        serves: 1,
        category: "Bowls",
      },
    ],
  },
  {
    id: "olivenhain",
    name: "Olivenhain",
    tagline: { de: "Levantinische Hochzeit", en: "Levantine Wedding" },
    rating: 4.8,
    reviewCount: 215,
    minOrder: 1500,
    time: "14 Tage Vorlauf",
    tags: ["Levantinisch", "Buffet", "Hochzeit"],
    img: "https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=1200&h=900&fit=crop",
    status: "available",
    area: "Neukölln",
    address: "Sonnenallee 88, 12045 Berlin",
    phone: "+49 30 4567 3456",
    cat: "wedding",
    minGuests: 50,
    perPerson: 45,
    verified: true,
    dietary: ["Halal", "Vegetarian"],
    about: {
      de: "Üppige levantinische Buffets für Hochzeiten — Mezze, Grill und süße Klassiker.",
      en: "Sumptuous Levantine buffets for weddings — mezze, grill and sweet classics.",
    },
    packages: [],
    menu: [
      {
        name: "Hochzeitsbuffet Premium",
        desc: { de: "Vollständiges Buffet mit Grillstation", en: "Full buffet with grill station" },
        price: 45,
        unit: { de: "Person", en: "person" },
        serves: 1,
        category: "Buffet",
      },
      {
        name: "Mezze Platte",
        desc: { de: "Verschiedene Mezze Variationen", en: "Various mezze variations" },
        price: 18,
        unit: { de: "Person", en: "person" },
        serves: 1,
        category: "Vorspeisen",
      },
    ],
  },
];

function mapCaterer(r: any): Caterer {
  const cData = r.caterers || {};
  const isGenerated = BRANDING_ASSISTANT_ENABLED && cData.use_generated_branding;
  const isBannerMissing = !r.banner_image_url;
  const isLogoMissing = !cData.logo_url;

  const resolvedBanner =
    isGenerated || isBannerMissing
      ? generateSvgBanner(r.business_name || "Caterer", "Catering Service")
      : r.banner_image_url.startsWith("http")
        ? r.banner_image_url
        : supabase.storage.from("storefront-assets").getPublicUrl(r.banner_image_url).data
            .publicUrl;

  const resolvedLogo =
    isGenerated || isLogoMissing
      ? generateSvgLogo(r.business_name || "Caterer", "Catering Service")
      : cData.logo_url && cData.logo_url.startsWith("http")
        ? cData.logo_url
        : cData.logo_url
          ? supabase.storage.from("storefront-assets").getPublicUrl(cData.logo_url).data.publicUrl
          : undefined;

  return {
    id: r.slug || r.id,
    slug: r.slug,
    name: r.business_name || "Caterer",
    tagline: { de: r.description || "Premium Catering", en: r.description || "Premium Catering" },
    rating: 4.8,
    reviewCount: 0,
    minOrder: Number(r.min_order_amount ?? 150),
    minGuests: 10,
    perPerson: 25,
    time: "3 Tage Vorlauf",
    tags: r.cuisine_type ? [r.cuisine_type] : ["Catering"],
    img: resolvedBanner,
    logo: resolvedLogo,
    use_generated_branding: cData.use_generated_branding || false,
    status: r.is_active || r.status === "published" ? "available" : "busy",
    area: r.city || "Berlin",
    address: r.business_address || "",
    phone: r.phone || "",
    cat: "corporate",
    verified: true,
    dietary: [],
    about: { de: r.description || "", en: r.description || "" },
    packages: [],
    menu: (r.products || []).map((p: any) => ({
      name: p.name,
      desc: { de: p.description || "", en: p.description || "" },
      price: p.price_cents ? p.price_cents / 100 : Number(p.price || 0),
      category: p.category || "Menu",
      dietary: p.dietary_tags || [],
    })),
  };
}

export function mapDbCaterer(c: any): Caterer {
  const defaultFoodImg =
    "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&h=900&fit=crop";
  let img = defaultFoodImg;
  if (c.banner_image_url && typeof c.banner_image_url === "string") {
    if (c.banner_image_url.startsWith("http")) {
      img = c.banner_image_url;
    } else {
      const supabaseUrl =
        import.meta.env.VITE_SUPABASE_URL || "https://athwccvgdovglcpluwnu.supabase.co";
      img = `${supabaseUrl}/storage/v1/object/public/storefront-assets/${c.banner_image_url}`;
    }
  }

  // Format service area cleanly instead of dumping 20+ raw postal codes
  let areaDisplay = c.service_areas || "Mönchengladbach & Region";
  if (areaDisplay.includes(",") && areaDisplay.split(",").length > 3) {
    if (areaDisplay.includes("41") || areaDisplay.includes("47")) {
      areaDisplay = "Mönchengladbach & Region";
    } else {
      areaDisplay = "Regionale Zustellung";
    }
  }

  // Determine appropriate dietary/specialty tags based on caterer profile
  let dietaryTags = ["Buffet-Klassiker", "Event-Service"];
  const catererNameLower = (c.name || "").toLowerCase();
  if (c.certifications && c.certifications.length > 0) {
    dietaryTags = c.certifications
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);
  } else if (
    catererNameLower.includes("kuepper") ||
    catererNameLower.includes("küpper") ||
    catererNameLower.includes("partyservice")
  ) {
    dietaryTags = ["Buffet-Klassiker", "Deftige Spezialitäten"];
  }

  // Parse service categories supported by this caterer (default: all 3 for comprehensive caterers like Partyservice Küpper)
  let categoriesSupported = ["events", "daily-catering-subscriptions", "institutional-catering"];
  if (
    c.service_categories &&
    typeof c.service_categories === "string" &&
    c.service_categories.trim()
  ) {
    categoriesSupported = c.service_categories
      .split(",")
      .map((s: string) => s.trim().toLowerCase())
      .filter(Boolean);
  }

  return {
    id: c.slug || c.id,
    slug: c.slug,
    name: c.name || "Caterer",
    tagline: {
      de: c.description || "Individuelle Catering-Erlebnisse",
      en: c.description || "Custom catering experiences",
    },
    rating: 5.0,
    reviewCount: 12,
    minOrder: c.min_delivery_cents ? c.min_delivery_cents / 100 : 0,
    minGuests: 10,
    perPerson: 15,
    time: "7 Tage Vorlauf",
    tags: ["Event", "B2B Subscriptions", "Gemeinschaftsverpflegung"],
    serviceCategories: categoriesSupported,
    img,
    logo: c.logo_url || undefined,
    status: "available",
    area: areaDisplay,
    address: c.business_address || "",
    phone: c.phone || "",
    cat: "corporate",
    verified: true,
    dietary: dietaryTags,
    about: { de: c.description || "", en: c.description || "" },
    packages: [],
    menu: [],
  };
}

export async function getCaterers(): Promise<Caterer[]> {
  try {
    const list = await getPublicCatererList();
    const liveCaterers = (list || []).map(mapDbCaterer);

    const hasKuepper = liveCaterers.some((c) =>
      (c.slug || c.id || "").toLowerCase().includes("kuepper"),
    );
    let combined = [...liveCaterers];
    if (!hasKuepper) {
      const kuepperFallback = fallbackCaterers.find((c) => c.id === "partyservice-kuepper");
      if (kuepperFallback) {
        combined.unshift(kuepperFallback);
      }
    }

    const MIN_DISPLAY_COUNT = 4;
    if (combined.length >= MIN_DISPLAY_COUNT) {
      return combined;
    }

    const needed = MIN_DISPLAY_COUNT - combined.length;
    const existingIds = new Set(combined.map((c) => c.id));
    const showcaseItems = fallbackCaterers
      .filter((c) => !existingIds.has(c.id))
      .slice(0, needed)
      .map((c) => ({
        ...c,
        isShowcase: true,
      }));

    return [...combined, ...showcaseItems];
  } catch (err) {
    console.error("Failed to load caterers via server function, using fallbacks:", err);
    return fallbackCaterers.map((c) => ({ ...c, isShowcase: true }));
  }
}

export async function getCaterer(id: string): Promise<Caterer | undefined> {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let query = supabase
      .from("storefront_settings")
      .select(
        "id, caterer_id, slug, description, banner_image_url, accepts_delivery, accepts_pickup, delivery_fee, min_order_amount, estimated_prep_time_minutes",
      )
      .eq("is_active", true);

    if (isUuid) {
      query = query.or(`slug.eq.${id},id.eq.${id}`);
    } else {
      query = query.eq("slug", id);
    }

    let { data: sfData, error: sfErr } = await query.maybeSingle();

    if (!sfData) {
      // Fallback: Query caterers table directly
      const { data: catData } = await (isUuid
        ? supabase.from("caterers").select("*").or(`slug.eq.${id},id.eq.${id}`).maybeSingle()
        : supabase.from("caterers").select("*").ilike("slug", id).maybeSingle());

      if (catData) {
        sfData = {
          id: catData.id,
          caterer_id: catData.id,
          slug: catData.slug || id,
          description: catData.description || "",
          banner_image_url: catData.banner_image_url || null,
          accepts_delivery: true,
          accepts_pickup: true,
          delivery_fee: (catData.delivery_fee_cents || 0) / 100,
          min_order_amount: (catData.min_delivery_cents || 0) / 100,
          estimated_prep_time_minutes: 60,
        };
      } else {
        const fallback = fallbackCaterers.find((c) => c.id === id || c.slug === id);
        if (fallback) return { ...fallback, isShowcase: true };

        const formattedName = id
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

        return {
          id: id,
          name: formattedName,
          tagline: { de: "Qualitäts-Catering & Services", en: "Quality Catering & Services" },
          rating: 4.9,
          reviewCount: 12,
          minOrder: 150,
          minGuests: 10,
          perPerson: 18,
          time: "48 Stunden Vorlauf",
          tags: ["Catering", "Event", "Buffet"],
          img: "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&h=900&fit=crop",
          status: "available",
          area: "Solingen & Umgebung",
          address: "Deutschland",
          phone: "+49 212 1234567",
          cat: "all",
          verified: true,
          dietary: ["Vegetarisch", "Vegan", "Halal"],
          about: {
            de: `Willkommen bei ${formattedName}. Wir bieten erstklassige Buffets, Menüs und Catering-Konzepte für Ihr Event.`,
            en: `Welcome to ${formattedName}. We provide top-class catering for your events.`,
          },
          packages: [],
          isShowcase: false,
        };
      }
    }

    const [catRes, menuRes] = await Promise.all([
      supabase
        .from("caterers")
        .select(
          "id, name, slug, approval_status, use_generated_branding, logo_url, owner_id, phone, business_address, service_areas",
        )
        .eq("id", sfData.caterer_id)
        .maybeSingle(),
      supabase
        .from("caterer_menu_items")
        .select(
          "id, caterer_id, category, name, description, price_cents, unit, serves, image_url, is_available",
        )
        .eq("caterer_id", sfData.caterer_id)
        .eq("is_available", true),
    ]);

    const caterer = catRes.data;
    const products = menuRes.data || [];

    if (!caterer) {
      const fallback = fallbackCaterers.find((c) => c.id === id || c.slug === id);
      if (fallback) return { ...fallback, isShowcase: true };
    }

    const merged = {
      ...sfData,
      caterers: caterer,
      products: products,
    };

    return mapCaterer(merged);
  } catch (err) {
    console.error("Failed to load caterer details, checking fallback:", err);
    const fallback = fallbackCaterers.find((c) => c.id === id || c.slug === id);
    if (fallback) return { ...fallback, isShowcase: true };

    const formattedName = id
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    return {
      id: id,
      name: formattedName,
      tagline: { de: "Qualitäts-Catering & Services", en: "Quality Catering & Services" },
      rating: 4.9,
      reviewCount: 12,
      minOrder: 150,
      minGuests: 10,
      perPerson: 18,
      time: "48 Stunden Vorlauf",
      tags: ["Catering", "Event", "Buffet"],
      img: "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&h=900&fit=crop",
      status: "available",
      area: "Solingen & Umgebung",
      address: "Deutschland",
      phone: "+49 212 1234567",
      cat: "all",
      verified: true,
      dietary: ["Vegetarisch", "Vegan", "Halal"],
      about: {
        de: `Willkommen bei ${formattedName}. Wir bieten erstklassige Buffets, Menüs und Catering-Konzepte für Ihr Event.`,
        en: `Welcome to ${formattedName}. We provide top-class catering for your events.`,
      },
      packages: [],
      isShowcase: false,
    };
  }
}

export type PromoCode = {
  code: string;
  discount_type: "percentage" | "fixed" | "free_delivery" | "free_item" | "bogo";
  discount_value: number;
  applies_to_product_name?: string;
  min_order_value_cents?: number;
  free_item_name?: string;
  required_qty?: number;
  starts_at?: string;
  ends_at?: string;
};

// Mock promo codes for Maison Verde
export const mockPromoCodes: Record<string, PromoCode[]> = {
  "maison-verde": [
    { code: "CATERING15", discount_type: "percentage", discount_value: 15 },
    { code: "WELCOME", discount_type: "fixed", discount_value: 50 },
  ],
};
