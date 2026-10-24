export interface FeaturedStory {
  title: string;
  category: string;
  page: number;
}

export interface DigitalEdition {
  id: string;
  issueNumber: string;
  seasonDe: string;
  seasonEn: string;
  monthDe: string;
  monthEn: string;
  year: number;
  titleDe: string;
  titleEn: string;
  sublineDe: string;
  sublineEn: string;
  coverImage: string;
  readerUrl: string;
  pageCount: number;
  status: "published" | "in_production" | "upcoming";
  statusBadgeDe: string;
  statusBadgeEn: string;
  featuredStories: FeaturedStory[];
  editorNoteDe: string;
  editorNoteEn: string;
}

export const digitalEditions: DigitalEdition[] = [
  {
    id: "ausgabe-01-herbst-2026",
    issueNumber: "01",
    seasonDe: "Herbst 2026",
    seasonEn: "Autumn 2026",
    monthDe: "Oktober 2026",
    monthEn: "October 2026",
    year: 2026,
    titleDe: "Große Tafeln, goldener Herbst",
    titleEn: "Grand Banquets & Golden Autumn",
    sublineDe:
      "Handgemachte Burger-Kultur im Sesam-Brioche, 18m Holzkohlefeuer an der Sonnenallee, jemenitisches Lehmofen-Lamm und generative KI-Gastronomie-Suche.",
    sublineEn:
      "Artisanal dual-sesame burgers, 18m open charcoal flames on Sonnenallee, Yemeni clay oven braised lamb, and generative AI search architecture.",
    coverImage: "/magazin/oktoberfest/oktoberfest_hendl_feast.jpg",
    readerUrl: "/magazin/reader",
    pageCount: 18,
    status: "published",
    statusBadgeDe: "✦ AKTUELLE AUSGABE · JETZT LESEN",
    statusBadgeEn: "✦ CURRENT ISSUE · READ NOW",
    featuredStories: [
      { title: "Das Wiesn-Hendl: Rotisserie & bayerische Festkultur", category: "Tradition", page: 4 },
      { title: "Thronburger Berlin: Kiez-Burger auf Zedernholz", category: "Kiez-Porträt", page: 8 },
      { title: "Alzaeem Sonnenallee: Rauch, Buchenholz & syrische Spieße", category: "Tradition", page: 10 },
      { title: "Restaurant Mandy: Butterzartes Lehmofen-Lamm", category: "Festkultur", page: 12 },
      { title: "TechGlanz Deep-Tech: Unsichtbar für ChatGPT & Gemini?", category: "KI-Technologie", page: 14 },
      { title: "Die Catering-Revolution: 0% Vermittlungsprovision", category: "Markt-Report", page: 16 },
    ],
    editorNoteDe:
      "In unserer Erstausgabe feiern wir den unverfälschten Genuss: Von traditionsreichen Festrezepturen bis zu wegweisenden Gastro-Technologien für das Jahr 2026.",
    editorNoteEn:
      "In our inaugural edition, we celebrate genuine gastronomy: From time-honored festival recipes to pioneering restaurant discovery technologies for 2026.",
  },
  {
    id: "ausgabe-02-november-2026",
    issueNumber: "02",
    seasonDe: "Spätherbst 2026",
    seasonEn: "Late Autumn 2026",
    monthDe: "November 2026",
    monthEn: "November 2026",
    year: 2026,
    titleDe: "Winterfeuer, Mezze-Kult & Kiez-Konditoreien",
    titleEn: "Winter Embers, Mezze Heritage & Neighborhood Patisseries",
    sublineDe:
      "Vom dampfenden Lehmofen über ofenfrische Pistazien-Baklava mit Urfa-Butter bis hin zu provisionsfreien Firmenweihnachtsfeiern.",
    sublineEn:
      "From steaming stone ovens and fresh Antep pistachio baklava to direct, commission-free corporate winter banquets.",
    coverImage: "/magazin/mandy/mandy-lamm-zwei-topdown.png",
    readerUrl: "/magazin/reader",
    pageCount: 20,
    status: "in_production",
    statusBadgeDe: "✦ IN REDAKTION · ERSCHEINT NOVEMBER 2026",
    statusBadgeEn: "✦ IN PRODUCTION · COMING NOVEMBER 2026",
    featuredStories: [
      { title: "Nadir Güllü München: 40 Lagen hauchdünner Teig am Viktualienmarkt", category: "Handwerk", page: 4 },
      { title: "Shawarma Albaik: Der Duft von Kardamom auf der Sonnenallee", category: "Kiez-Porträt", page: 8 },
      { title: "B2B-Weihnachtscatering: Planung direkt mit dem Küchenchef", category: "Catering", page: 14 },
      { title: "GEO Winter-Check: Wie KI-Assistenten Event-Caterer empfehlen", category: "TechGlanz GEO", page: 18 },
    ],
    editorNoteDe:
      "Die zweite Ausgabe widmet sich den Wärmequellen der kalten Jahreszeit: Aromenreiche Eintöpfe, handwerklich gezogene Teige und die Vorbereitung großer Winterfeste.",
    editorNoteEn:
      "Our second edition is dedicated to warmth and comfort: Rich braises, artisan pulled pastry, and planning premier winter banquets.",
  },
  {
    id: "ausgabe-03-winter-2026",
    issueNumber: "03",
    seasonDe: "Winter 2026/2027",
    seasonEn: "Winter 2026/2027",
    monthDe: "Dezember 2026",
    monthEn: "December 2026",
    year: 2026,
    titleDe: "Das Festessen: Exklusives Catering & Spitzenküche",
    titleEn: "The Grand Feast: Premium Catering & Culinary Excellence",
    sublineDe:
      "Deutschlands führende Event-Caterer im Porträt: Nachhaltige Galadinner, Flying Buffets und moderne Gastronomiekonzepte für das neue Jahr.",
    sublineEn:
      "Germany's leading event caterers profiled: Sustainable gala dining, artisanal flying buffets, and modern food concepts for the new year.",
    coverImage: "/magazin/alzaeem-berlin/alzaeem-spiesse-hero.jpg",
    readerUrl: "/magazin/reader",
    pageCount: 24,
    status: "upcoming",
    statusBadgeDe: "✦ VORSCHAU · WINTER 2026/2027",
    statusBadgeEn: "✦ PREVIEW · WINTER 2026/2027",
    featuredStories: [
      { title: "Gala-Catering der Spitzenklasse: Meisterköche im Großformat", category: "Catering", page: 4 },
      { title: "Die Kunst des Holzkohlefeuers: Große Fleischplatten für Feiern", category: "Tradition", page: 10 },
      { title: "Trends 2027: Wie KI und Direktbuchung den Markt verändern", category: "Markt-Report", page: 18 },
    ],
    editorNoteDe:
      "Ein festlicher Ausblick auf das kulinarische Jahr 2027 mit den besten Caterern, Planern und Küchenchefs unseres bundesweiten Netzwerks.",
    editorNoteEn:
      "A celebratory outlook on gastronomy in 2027 featuring premier caterers, planners, and head chefs across Germany.",
  },
];
