import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'data', 'blog.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Rename slug "plan-perfect-corporate-event-berlin-munich"
content = content.replace(/"plan-perfect-corporate-event-berlin-munich"/g, '"plan-perfect-corporate-event-germany"');

// 2. Remove city-specific text from ID 4
content = content.replace(
  /Top-Locations in den großen deutschen Städten sind Monate im Voraus ausgebucht\./g,
  "Top-Locations sind oft Monate im Voraus ausgebucht."
);
content = content.replace(
  /Top locations in major German cities are booked months in advance\./g,
  "Top locations are often booked months in advance."
);
content = content.replace(
  /Planst du speziell in NRW\? Schau dir unseren Artikel über <a href="\\\/blog\\\/catering-firmenevents-nrw-2026">Catering für Firmenevents<\\\/a> an\./g,
  "Schau dir auch unseren Artikel über <a href=\\"/blog/catering-firmenevents-deutschland-2026\\">Catering für Firmenevents in Deutschland</a> an."
);

// 3. Rename slug "catering-firmenevents-nrw-2026"
content = content.replace(/"catering-firmenevents-nrw-2026"/g, '"catering-firmenevents-deutschland-2026"');

// Add TLDRs
const tldrs = {
  "what-is-speisely": {
    de: [
      "Speisely ist ein provisionsfreier Food- & Event-Marktplatz für Deutschland.",
      "Restaurants zahlen nur 34.99 EUR/Monat (0% Provision) inklusive KDS und Storefront.",
      "Caterer & Event-Planer zahlen 10% Provision pro erfolgreicher Buchung ohne Grundgebühr."
    ],
    en: [
      "Speisely is a commission-free food & event marketplace for Germany.",
      "Restaurants pay only 34.99 EUR/month (0% commission) including KDS and Storefront.",
      "Caterers & event planners pay 10% commission per successful booking with no base fee."
    ]
  },
  "sustainable-plant-based-catering-trends-2026": {
    de: [
      "Nachhaltigkeit und Zero Waste sind die zentralen Catering-Trends in 2026.",
      "Plant-Based Catering (rein pflanzlich) etabliert sich zunehmend als Standard für Events.",
      "Regionale Lebensmittel und kurze Lieferketten stehen im Fokus."
    ],
    en: [
      "Sustainability and zero waste are the core catering trends in 2026.",
      "Plant-based catering is increasingly establishing itself as the standard for events.",
      "The focus is on regional food and short supply chains."
    ]
  },
  "best-food-delivery-alternatives-germany": {
    de: [
      "Hohe Provisionen klassischer Lieferdienste belasten Restaurants zunehmend.",
      "Speisely bietet eine faire Alternative mit 0% Bestellprovision für 34.99 EUR monatlich.",
      "Kunden können direkt und lokal bestellen, was die Gastronomie nachhaltig unterstützt."
    ],
    en: [
      "High commissions from classic delivery services increasingly burden restaurants.",
      "Speisely offers a fair alternative with 0% order commission for 34.99 EUR monthly.",
      "Customers can order directly and locally, providing sustainable support to the gastronomy sector."
    ]
  },
  "plan-perfect-corporate-event-germany": {
    de: [
      "Eine frühzeitige Planung und Location-Suche ist für Firmenevents entscheidend.",
      "Ab 50 Personen lohnt sich oft die Beauftragung eines professionellen Eventplaners.",
      "Moderne Catering-Formate wie Flying Dinners oder Food-Stationen ersetzen klassische Buffets."
    ],
    en: [
      "Early planning and location scouting are crucial for corporate events.",
      "For 50+ people, hiring a professional event planner is often worthwhile.",
      "Modern catering formats like flying dinners or food stations are replacing classic buffets."
    ]
  },
  "why-become-a-partner-of-speisely": {
    de: [
      "Speisely verlangt von Restaurants 0% Provision (Starter-Plan: 34.99 EUR/Monat).",
      "Caterer und Planer zahlen eine faire Provision (10%) nur bei erfolgreicher Buchung.",
      "Alle Partner erhalten einen eigenen Storefront und Zugang zu Live-Features wie dem KDS."
    ],
    en: [
      "Speisely charges restaurants 0% commission (Starter plan: 34.99 EUR/month).",
      "Caterers and planners pay a fair commission (10%) only upon successful booking.",
      "All partners receive their own storefront and access to live features like the KDS."
    ]
  },
  "restaurant-bestellen-ohne-provision-speisely": {
    de: [
      "Speisely ermöglicht Bestellungen mit 0% Provision für Gastronomen.",
      "Kunden nutzen das Instant Order Verzeichnis ganz ohne App-Download.",
      "Die direkte Bestellung stärkt lokale Restaurants finanziell."
    ],
    en: [
      "Speisely enables orders with 0% commission for restaurateurs.",
      "Customers use the Instant Order directory entirely without app downloads.",
      "Direct ordering financially strengthens local restaurants."
    ]
  },
  "catering-firmenevents-deutschland-2026": {
    de: [
      "Messe- und Business-Catering verzeichnen deutschlandweit eine stark wachsende Nachfrage.",
      "Veganes Streetfood und moderne Konzepte ergänzen klassische Buffets.",
      "Über Speisely können Event-Caterer direkt mit 10% Anzahlung gebucht werden."
    ],
    en: [
      "Fair and business catering are experiencing strong demand growth across Germany.",
      "Vegan street food and modern concepts complement classic buffets.",
      "Via Speisely, event caterers can be booked directly with a 10% deposit."
    ]
  },
  "kitchen-display-system-restaurant-kds": {
    de: [
      "Ein KDS digitalisiert die Küchenkommunikation und ersetzt fehleranfällige Papierbons.",
      "Das Speisely KDS ist vollständig in das Restaurant-Dashboard integriert.",
      "Es bietet Echtzeit-Anzeigen und klare Status-Workflows für jede Bestellgröße."
    ],
    en: [
      "A KDS digitizes kitchen communication and replaces error-prone paper tickets.",
      "The Speisely KDS is fully integrated into the restaurant dashboard.",
      "It offers real-time displays and clear status workflows for any order volume."
    ]
  },
  "was-kostet-ein-eventplaner": {
    de: [
      "Eventplaner in Deutschland kosten durchschnittlich 60 € bis 150 € pro Stunde.",
      "Bei Budgetmodellen werden häufig 10 % bis 20 % des Event-Budgets als Honorar berechnet.",
      "Professionelle Planer sparen durch ihr Netzwerk und bessere Konditionen oft Zeit und Geld."
    ],
    en: [
      "Event planners in Germany cost between 60 € and 150 € per hour on average.",
      "For budget models, 10% to 20% of the event budget is often charged as a fee.",
      "Professional planners often save time and money through their networks and better rates."
    ]
  },
  "hochzeit-planen-catering-musik-ablauf-budget": {
    de: [
      "Eine Hochzeit mit 80 Gästen kostet in Deutschland im Schnitt 15.000 € bis 25.000 €.",
      "Location und Catering beanspruchen dabei den größten Budgetanteil (ca. 40-50 %).",
      "Gute Ablaufpläne lassen ausreichend Puffer für das Dinner und Reden."
    ],
    en: [
      "A wedding with 80 guests in Germany costs on average 15,000 € to 25,000 €.",
      "Location and catering claim the largest budget share (approx. 40-50%).",
      "Good schedules leave sufficient buffers for dinner and speeches."
    ]
  },
  "welche-catering-art-passt-zu-welchem-anlass": {
    de: [
      "Buffets bieten die größte Vielfalt und sind ideal für budgetbewusste Großveranstaltungen.",
      "Flying Dinners eignen sich perfekt für Stehempfänge und Networking-Events.",
      "Plated Dinners (gesetzte Menüs) schaffen eine sehr formelle, elegante Atmosphäre."
    ],
    en: [
      "Buffets offer the greatest variety and are ideal for budget-conscious large events.",
      "Flying dinners are perfect for standing receptions and networking events.",
      "Plated dinners create a very formal, elegant atmosphere."
    ]
  }
};

// Insert TLDRs into the object structure
// We'll use a regex replacement to insert the tldr object right after description
Object.keys(tldrs).forEach(slug => {
  const tldrObj = tldrs[slug];
  const tldrStr = `\n    tldr: ${JSON.stringify(tldrObj, null, 6).replace(/}/g, '    }').replace(/"([^"]+)":/g, '$1:')},`;
  
  // Find the exact object in the array
  const regex = new RegExp(`(slug:\\s*["']${slug}["'][\\s\\S]*?description:\\s*{[\\s\\S]*?},)`);
  content = content.replace(regex, `$1${tldrStr}`);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated blog.ts');
