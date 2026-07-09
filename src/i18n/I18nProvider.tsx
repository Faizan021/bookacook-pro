import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "de" | "en";

type Dict = Record<string, { de: string; en: string }>;

const dict: Dict = {
  "nav.instant": { de: "Essen sofort bestellen", en: "Instant Food Order" },
  "nav.catering": { de: "Catering", en: "Catering" },
  "nav.partners": { de: "Für Partner", en: "For partners" },
  "nav.about": { de: "Über uns", en: "About Us" },
  "nav.contact": { de: "Kontakt", en: "Contact" },
  "nav.register": { de: "Registrieren", en: "Register" },

  "home.eyebrow": { de: "Ein Marktplatz. Drei Wege zu genießen.", en: "One marketplace. Three ways to enjoy." },
  "home.title": { de: "Worauf hast du<br/>heute Lust?", en: "What would you<br/>like today?" },
  "home.subtitle": {
    de: "Bestelle dein Lieblingsessen sofort, finde das perfekte Catering oder plane dein Event mit einem professionellen Event-Planer.",
    en: "Order your favorite food instantly, find the perfect catering, or plan your event with a professional event planner.",
  },
  "home.socialProof": {
    de: "🇩🇪 Deutschlandweit verfügbar · 47+ Restaurants · Kostenlos stöbern",
    en: "🇩🇪 Available across Germany · 47+ restaurants · Free to browse",
  },
  "home.cta.order": { de: "Sofort bestellen", en: "Order instantly" },
  "home.cta.catering": { de: "Catering finden", en: "Find catering" },
  "home.cta.planner": { de: "Event planen", en: "Plan event" },
  "home.hero.alt": { de: "Miniatur-Diorama mit Essen, Catering und Event-Planung", en: "Miniature diorama with food, catering and event planning" },

  "home.pillar.instant.eyebrow": { de: "Jetzt essen", en: "Eat now" },
  "home.pillar.instant.title": { de: "Essen sofort bestellen", en: "Instant Food Order" },
  "home.pillar.instant.body": {
    de: "Restaurants in deiner Nähe, live verfügbar, Menüs und transparente Preise.",
    en: "Restaurants near you, live availability, menus and transparent pricing.",
  },
  "home.pillar.instant.cta": { de: "Restaurants entdecken", en: "Discover restaurants" },
  "home.pillar.catering.eyebrow": { de: "Event planen", en: "Plan an event" },
  "home.pillar.catering.title": { de: "Catering", en: "Catering" },
  "home.pillar.catering.body": {
    de: "Vergleiche Caterer, entdecke Angebote und finde das perfekte Menü für dein Event.",
    en: "Compare caterers, discover offers and find the perfect menu for your event.",
  },
  "home.pillar.catering.cta": { de: "Caterer entdecken", en: "Discover caterers" },
  "home.pillar.partner.eyebrow": { de: "Gemeinsam wachsen", en: "Growing together" },
  "home.pillar.partner.title": { de: "Partner werden", en: "Become a partner" },
  "home.pillar.partner.body": {
    de: "Mehr Bestellungen, planbare Auslastung und Zugang zu neuen Catering-Kunden.",
    en: "More orders, predictable capacity utilization, and access to new catering customers.",
  },
  "home.pillar.partner.cta": { de: "Vorteile ansehen", en: "View advantages" },
  "home.pillar.planner.eyebrow": { de: "Event-Konzept", en: "Event concept" },
  "home.pillar.planner.title": { de: "Event-Planer", en: "Event Planner" },
  "home.pillar.planner.body": {
    de: "Geprüfte Event-Planer für Hochzeiten, Corporate und private Feiern.",
    en: "Vetted event planners for weddings, corporate and private celebrations.",
  },
  "home.pillar.planner.cta": { de: "Planer entdecken", en: "Discover planners" },

  "io.deliveryTo": { de: "Lieferung nach Berlin", en: "Delivery to Berlin" },
  "io.deliveryToPlaceholder": { de: "Wähle deinen Standort", en: "Choose your delivery location" },
  "io.deliveryToSelected": { de: "Lieferung nach {location}", en: "Delivery to {location}" },
  "io.popularCities": { de: "Beliebte Städte", en: "Popular cities" },
  "io.title": { de: "Was möchtest du essen?", en: "What would you like to eat?" },
  "io.search": { de: "Restaurant oder Gericht suchen", en: "Search for a restaurant or dish" },
  "io.filter.all": { de: "Alle", en: "All" },
  "io.filter.fast": { de: "In 30 Minuten", en: "In 30 minutes" },
  "io.filter.healthy": { de: "Gesund", en: "Healthy" },
  "io.filter.italian": { de: "Italienisch", en: "Italian" },
  "io.filter.asian": { de: "Asiatisch", en: "Asian" },
  "io.filter.vegan": { de: "Vegan", en: "Vegan" },
  "io.nearYou": { de: "Restaurants in deiner Nähe", en: "Restaurants near you" },
  "io.status.open": { de: "Geöffnet", en: "Open" },
  "io.status.later": { de: "Später", en: "Later" },
  "io.delivery": { de: "Lieferung", en: "Delivery" },
  "io.popular": { de: "Beliebt", en: "Popular" },

  "cat.eyebrow": { de: "Speisely Catering-Marktplatz", en: "Speisely Catering Marketplace" },
  "cat.title": { de: "Dein Event.<br/>Dein perfektes Menü.", en: "Your event.<br/>Your perfect menu." },
  "cat.subtitle": {
    de: "Entdecke geprüfte Caterer, vergleiche Angebote und frage deinen Wunschtermin direkt an.",
    en: "Discover vetted caterers, compare offers and request your preferred date directly.",
  },
  "cat.date": { de: "Datum", en: "Date" },
  "cat.guests": { de: "Gäste", en: "Guests" },
  "cat.checkAvail": { de: "Verfügbarkeit prüfen", en: "Check availability" },
  "cat.curated": { de: "Kuratiert & geprüft", en: "Curated & reviewed" },
  "cat.discover": { de: "Caterer entdecken", en: "Discover caterers" },
  "cat.filter.all": { de: "Alle", en: "All" },
  "cat.filter.wedding": { de: "Hochzeit", en: "Wedding" },
  "cat.filter.business": { de: "Business", en: "Business" },
  "cat.filter.private": { de: "Privates Dinner", en: "Private Dinner" },
  "cat.requestMenu": { de: "Menü ansehen →", en: "View menu →" },

  "p.eyebrow": { de: "Für Restaurants, Caterer & Event-Planer", en: "For restaurants, caterers & event planners" },
  "p.title": { de: "Dein Angebot<br/>verdient mehr<br/>Sichtbarkeit.", en: "Your offer<br/>deserves more<br/>visibility." },
  "p.subtitle": {
    de: "Speisely bringt Restaurants, Caterer und Event-Planer mit den passenden Gästen zusammen — von spontanen Bestellungen bis zu großen Firmenveranstaltungen.",
    en: "Speisely helps restaurants, caterers, and event planners connect with the right guests — from spontaneous orders to large corporate events.",
  },
  "p.cta": { de: "Partner werden", en: "Become a partner" },
  "p.f1.title": { de: "Neue Kunden erreichen", en: "Reaching new customers" },
  "p.f1.body": {
    de: "Werde von Gästen, Unternehmen und Veranstaltern entdeckt, die aktiv nach Restaurant-Bestellungen, Catering-Briefings oder Event-Planung suchen.",
    en: "Get discovered by guests, businesses, and organizers who are actively searching for restaurant orders, catering briefs, or event planning support.",
  },
  "p.f2.title": { de: "Kapazität planen", en: "Planning capacity" },
  "p.f2.body": {
    de: "Steuere deine Kapazitäten, verwalte Event-Anfragen oder regelmäßiges Büro-Catering und behalte die volle Kontrolle über deine Planungsabläufe.",
    en: "Manage your available capacity, event requests, or recurring office catering, and keep full control over your planning workflows.",
  },
  "p.f3.title": { de: "Übersicht behalten", en: "Simple overview" },
  "p.f3.body": {
    de: "Verwalte Bestellungen, Catering-Anfragen, Menüs und Event-Angebote an einem einzigen, übersichtlichen Ort.",
    en: "Manage orders, catering inquiries, menus, and event requests in one single, clean location.",
  },
  "p.f4.title": { de: "Tarife & Gebühren", en: "Pricing & Fees" },
  "p.f4.body": {
    de: "Faire, transparente Preisgestaltung für Restaurants, Caterer und Event-Planer. Keine monatlichen Fixkosten für Dienstleister — zahlen Sie nur bei erfolgreicher Vermittlung.",
    en: "Fair, transparent pricing for restaurants, caterers, and event planners. No fixed monthly costs for providers — only pay for successful bookings.",
  },
  "p.ready.title": { de: "Bereit, mit Speisely zu wachsen?", en: "Ready to grow with Speisely?" },
  "p.ready.body": {
    de: "Werde Teil des fairen, wachsenden Marktplatzes für Restaurants, Caterer und Event-Profis in ganz Deutschland.",
    en: "Join the growing, fair marketplace for restaurants, caterers, and event professionals across Germany.",
  },
  "p.learn.mission": { de: "Mehr über unsere Mission erfahren", en: "Learn more about our mission" },
  "p.learn.blog": { de: "Aktuelles aus unserem Blog", en: "Latest updates from our blog" },
  "p.ready.cta": { de: "Partner werden", en: "Become a partner" },

  "ab.eyebrow": { de: "Über Speisely", en: "About Speisely" },
  "ab.title": { de: "Wir machen gute Erlebnisse leichter entdeckbar.", en: "We make great experiences easier to discover." },
  "ab.subtitle": {
    de: "Speisely verbindet spontane Restaurantbestellungen, besondere Catering-Momente und professionelle Event-Planung auf einer Plattform — sorgfältig kuratiert, transparent und persönlich. Made in Deutschland — für Restaurants, Caterer und Event-Profis in ganz Deutschland.",
    en: "Speisely connects spontaneous restaurant orders, special catering moments and professional event planning on one platform — carefully curated, transparent and personal. Made in Germany — for restaurants, caterers, and event professionals nationwide.",
  },
  "ab.conviction": { de: "Unsere Überzeugung", en: "Our conviction" },
  "ab.h2": { de: "Jeder Anlass verdient das passende Erlebnis.", en: "Every occasion deserves the right experience." },
  "ab.body": {
    de: "Ob spontane Essensbestellung bei Restaurants, Catering-Anfragen bei Caterern oder eine komplette Event-Planung mit professionellen Event-Planern: Die Suche nach dem passenden kulinarischen und organisatorischen Erlebnis sollte inspirierend sein, nicht kompliziert. Für unsere Partner schaffen wir faire Bedingungen: Restaurants zahlen eine einfache Flatrate für unbegrenzte Bestellungen, während für Caterer und Event-Planer eine transparente, erfolgsbasierte Vermittlungsgebühr gilt.",
    en: "Whether it is food ordering from local restaurants, catering requests for caterers, or complete event planning with professional event planners: the search for the perfect culinary and organizational experience should be inspiring, not complicated. For our partners, we create fair terms: restaurants pay a simple flat subscription for unlimited orders, while caterers and event planners pay a transparent, success-based matching fee.",
  },
  "ab.body.catering": {
    de: "Für Caterer öffnet Speisely zwei Türen: Event-Catering für Hochzeiten, Firmenveranstaltungen und Feiern — und regelmäßiges Verpflegungsmanagement für Büros, Kitas, Krankenhäuser, Schulen und Pflegeeinrichtungen. Eine Plattform, zwei Einnahmequellen.",
    en: "For caterers, Speisely opens two doors: event catering for weddings, corporate events, and celebrations — and recurring institutional catering for offices, daycare centers, hospitals, schools, and care homes. One platform, two revenue streams.",
  },
  "ab.v1": { de: "Kuratiert", en: "Curated" },
  "ab.v1.desc": { de: "Jeder Partner wird vor der Aufnahme geprüft.", en: "Every partner is reviewed before joining our marketplace." },
  "ab.v2": { de: "Zuverlässig", en: "Reliable" },
  "ab.v2.desc": { de: "Transparente Preise, keine versteckten Kosten.", en: "Transparent pricing, no hidden fees." },
  "ab.v3": { de: "Persönlich", en: "Personal" },
  "ab.v3.desc": { de: "Echte Empfehlungen, abgestimmt auf dein Event.", en: "Real recommendations, tailored to your event." },
  "ab.stat.restaurants": { de: "Restaurants", en: "Restaurants" },
  "ab.stat.caterers": { de: "Caterer", en: "Caterers" },
  "ab.stat.planners": { de: "Event-Planer", en: "Event Planners" },

  "ab.growth.title": { de: "Speisely wächst.", en: "Speisely is growing." },
  "ab.growth.body": {
    de: "Werde einer der ersten Partner und baue mit uns den fairen Marktplatz für Gastronomie und Events in Deutschland.",
    en: "Be one of our first partners and help us build the fair marketplace for food and events in Germany.",
  },
  "ab.growth.cta": { de: "Partner werden →", en: "Become a partner →" },

  "ab.join.eyebrow": { de: "Mitmachen", en: "Join us" },
  "ab.join.title": { de: "Werde Teil von Speisely", en: "Become part of Speisely" },
  "ab.join.body": {
    de: "Egal ob Restaurant, Caterer oder Event-Planer — zeige dein Angebot Tausenden potenzieller Kunden und wachse mit uns.",
    en: "Whether you're a restaurant, caterer or event planner — showcase your offer to thousands of potential customers and grow with us.",
  },
  "ab.join.cta": { de: "Partner werden", en: "Become a partner" },

  "footer.tag": {
    de: "Ein Marktplatz für spontane Restaurantbestellungen, kuratierte Catering-Momente und professionelle Event-Planung. Made in Deutschland.",
    en: "One marketplace for spontaneous restaurant orders, curated catering moments and professional event planning. Made in Germany.",
  },
  "footer.discover": { de: "Entdecken", en: "Discover" },
  "footer.business": { de: "Business", en: "Business" },
  "footer.legal": { de: "Rechtliches", en: "Legal" },
  "footer.imprint": { de: "Impressum", en: "Imprint" },
  "footer.privacy": { de: "Datenschutz", en: "Privacy" },
  "footer.terms": { de: "AGB", en: "Terms" },
};

const Ctx = createContext<{ 
  lang: Lang; 
  setLang: (l: Lang) => void; 
  t: (k: any, fallback?: any) => string 
}>({
  lang: "de",
  setLang: () => {},
  t: (k, fallback) => fallback || k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("de");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("lang")) as Lang | null;
    if (stored === "en" || stored === "de") setLangState(stored);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  const t = (k: string, fallback?: string) => {
    const entry = dict[k as keyof typeof dict];
    if (entry) return entry[lang];
    if (fallback) return lang === "de" ? k : fallback;
    return k;
  };

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
