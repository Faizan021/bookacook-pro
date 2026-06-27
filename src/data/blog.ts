export type BlogPost = {
  id: string;
  slug: string;
  date: string;
  author: string;
  image: string;
  category: "Catering" | "Instant Order" | "Event Planning" | "Company";
  title: {
    de: string;
    en: string;
  };
  description: {
    de: string;
    en: string;
  };
  content: {
    de: string;
    en: string;
  };
  tldr?: {
    de: string[];
    en: string[];
  };
  faq?: Array<{
    question: string;
    answer: string;
  }>;
};

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "what-is-speisely",
    date: "2026-05-10",
    author: "Speisely Team",
    image: "/images/blog/what-is-speisely.png",
    category: "Company",
    title: {
      de: "Was ist Speisely? Der ultimative Food- & Event-Marktplatz in Deutschland",
      en: "What is Speisely? The Ultimate Food & Event Marketplace in Germany",
    },
    description: {
      de: "Speisely ist Deutschlands Plattform fuer provisionsfreie Direktbestellungen, professionelles Catering und Eventplanung - mit KDS, Stripe-Zahlungen und eigenem Storefront.",
      en: "Speisely is Germany's platform for commission-free direct ordering, professional catering and event planning - with KDS, Stripe payments, and a dedicated storefront.",
    },
    tldr: {
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
    content: {
      de: `
        <h2>Speisely: Der Food- &amp; Event-Marktplatz fuer Deutschland</h2>
        <p><strong>Speisely</strong> ist Deutschlands innovativster Marktplatz, der Restaurants, Caterer und Event-Planer direkt mit ihren Kunden verbindet - ohne unnoetige Mittelsmanner und ohne versteckte Provisionen.</p>
        <h3>1. Provisionsfreie Direktbestellungen fuer Restaurants</h3>
        <p>Restaurants erhalten bei Speisely ihren eigenen, professionellen Storefront unter <strong>speisely.de/restaurant/ihr-name</strong>. Fuer nur <strong>34.99 EUR/Monat</strong> beim Starter-Plan koennen sie unbegrenzte Direktbestellungen und Tischreservierungen annehmen - mit <strong>0% Bestellprovision</strong>.</p>
        <h3>2. Kitchen Display System (KDS) fuer das Bestellmanagement</h3>
        <p>Speisely enthaelt ein integriertes <strong>Kitchen Display System (KDS)</strong>, das eingehende Bestellungen direkt in der Kueche anzeigt und verwaltet.</p>
        <h3>3. Catering-Marktplatz fuer B2B und B2C</h3>
        <p>Caterer erhalten qualifizierte Anfragen ueber unseren <a href="/catering">Catering-Marktplatz</a>. Caterer zahlen eine faire Provision von <strong>10% pro Buchung</strong>.</p>
        <h3>4. Event Planer - Anfragen &amp; Buchungen</h3>
        <p><a href="/planner">Event-Planer</a> koennen ihre Dienstleistungen auf Speisely listen und direkte Anfragen von Kunden erhalten.</p>
        <h3>5. Instant Order - Lokal bestellen ohne App</h3>
        <p>Kunden entdecken lokale Restaurants ueber das <strong>Instant Order Verzeichnis</strong>.</p>
        <p><a href="/instant-order">Jetzt entdecken auf speisely.de/instant-order</a></p>
      `,
      en: `
        <h2>Speisely: The Food &amp; Event Marketplace for Germany</h2>
        <p><strong>Speisely</strong> is Germany's most innovative marketplace, connecting restaurants, caterers, and event planners directly with their customers - without unnecessary middlemen and without hidden commissions.</p>
        <h3>1. Commission-Free Direct Ordering for Restaurants</h3>
        <p>Restaurants get their own professional storefront at <strong>speisely.de/restaurant/your-name</strong>. For just <strong>34.99 EUR/month</strong> on the Starter Plan, they can accept unlimited direct orders and table reservations with <strong>0% order commission</strong>.</p>
        <h3>2. Kitchen Display System (KDS) for Order Management</h3>
        <p>Speisely includes an integrated <strong>Kitchen Display System (KDS)</strong> that displays and manages incoming orders directly in the kitchen.</p>
        <h3>3. Catering Marketplace for B2B and B2C</h3>
        <p>Caterers receive qualified inquiries. They pay a fair commission of <strong>10% per booking</strong> - no monthly base fee.</p>
        <h3>4. Event Planners - Inquiries &amp; Bookings</h3>
        <p>Event planners can list their services on Speisely and receive direct inquiries from customers.</p>
        <h3>5. Instant Order - Order Locally Without an App</h3>
        <p>Customers discover local restaurants via the <strong>Instant Order directory</strong> at speisely.de/instant-order.</p>
        <p><a href="https://speisely.de/instant-order">Discover now at speisely.de/instant-order</a></p>
      `
    }
  },
  {
    id: "2",
    slug: "sustainable-plant-based-catering-trends-2026",
    date: "2026-04-15",
    author: "Speisely Catering Team",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    category: "Catering",
    title: {
      de: "Nachhaltiges Catering & Zero Waste: Food Trends 2026 in Deutschland",
      en: "Sustainable & Plant-Based Catering Trends 2026 in Germany",
    },
    description: {
      de: "Entdecke die wichtigsten Catering-Trends 2026: Von der Planetary Health Diet bis hin zu Plant-Based Catering und Zero Waste auf Firmenevents.",
      en: "Discover the top catering trends of 2026: From the Planetary Health Diet to plant-based catering and zero waste at corporate events.",
    },
    tldr: {
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
    content: {
      de: `
        <h2>Der Wandel hin zum gruenen Event</h2>
        <p>Die Catering-Branche in Deutschland erlebt 2026 einen massiven Wandel. Der Fokus liegt auf <strong>Nachhaltigkeit, regionalen Lebensmitteln und Zero Waste</strong>.</p>
        <h3>Plant-Based Catering als neuer Standard</h3>
        <p>Immer mehr Spitzenkoeche in ganz Deutschland bieten komplett pflanzliche Menues an. Das <strong>Plant-based Catering</strong> rueckt ins Zentrum moderner <a href="/catering/events">Event-Caterings</a>.</p>
        <h3>Zero Waste &amp; Regionale Lebensmittel</h3>
        <p>Das <strong>Zero Waste Catering</strong> ist heute essenziell. Caterer auf Speisely arbeiten mit lokalen Bauernhoefen zusammen. Erfahre auch, <a href="/blog/welche-catering-art-passt-zu-welchem-anlass">welche Catering-Art am besten zu deinem Anlass passt</a>.</p>
        <p>Nachhaltige Caterer findest du direkt auf unserem <a href="/catering">Catering-Marktplatz</a>.</p>
      `,
      en: `
        <h2>The Shift Towards Green Events</h2>
        <p>The catering industry in Germany is experiencing a massive shift in 2026, with growing focus on <strong>sustainability, locally sourced food, and zero waste</strong>.</p>
        <h3>Plant-Based Catering as the New Standard</h3>
        <p>More and more top chefs across Germany are offering completely plant-based menus. <strong>Plant-based catering</strong> is taking center stage.</p>
        <h3>Zero Waste &amp; Regional Food</h3>
        <p><strong>Zero Waste Catering</strong> has become essential. Caterers on Speisely work increasingly with local farms.</p>
        <p>Find sustainable caterers at <a href="https://speisely.de/catering">speisely.de/catering</a>.</p>
      `
    }
  },
  {
    id: "3",
    slug: "best-food-delivery-alternatives-germany",
    date: "2026-03-22",
    author: "Speisely Editorial",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
    category: "Instant Order",
    title: {
      de: "Die besten Lieferdienst-Alternativen in Deutschland (2026)",
      en: "The Best Food Delivery Alternatives in Germany (2026)",
    },
    description: {
      de: "Auf der Suche nach echten Lieferando Alternativen? Wie Speisely den Markt fuer Essen online bestellen in Deutschland revolutioniert.",
      en: "Looking for real Lieferando alternatives? How Speisely is revolutionizing the online food ordering market in Germany.",
    },
    tldr: {
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
    content: {
      de: `
        <h2>Warum der Markt neue Alternativen braucht</h2>
        <p>Immer mehr Restaurants und Kunden suchen im Jahr 2026 nach <strong>Lieferando Alternativen</strong>. Hohe Provisionen belasten die Gastronomen, waehrend Kunden sich nach mehr Qualitaet sehnen.</p>
        <h3>Der Lieferdienst Vergleich 2026</h3>
        <p><strong>Speisely</strong> bietet absolut faire Konditionen. Restaurants zahlen nur <strong>34.99 EUR/Monat</strong> ohne Bestellprovision. Bei Lieferando sind es bis zu 30%. Mehr dazu in unserem Artikel <a href="/blog/why-become-a-partner-of-speisely">Warum Partner werden?</a></p>
        <h3>Speisely vs. Lieferando, Uber Eats &amp; Wolt</h3>
        <p>Bei 100 Bestellungen a 20 EUR verliert ein Restaurant auf Lieferando ca. 600 EUR durch Provisionen. Bei Speisely bleibt dieser Betrag vollstaendig beim Restaurant.</p>
        <p>Die Zukunft der Essenslieferung ist lokal und fair: <a href="/instant-order">Jetzt lokal essen bestellen</a>. Weitere Details für Gastronomen gibt es im Beitrag <a href="/blog/restaurant-bestellen-ohne-provision-speisely">Restaurant online bestellen ohne Provision</a>.</p>
      `,
      en: `
        <h2>Why the Market Needs New Alternatives</h2>
        <p>In 2026, more and more restaurants and customers are looking for <strong>Lieferando alternatives</strong>. High commissions burden restaurateurs while customers crave more quality.</p>
        <h3>The Delivery Service Comparison 2026</h3>
        <p><strong>Speisely</strong> offers fair conditions. Restaurants pay only <strong>34.99 EUR/month</strong> with zero order commission. Lieferando charges up to 30%.</p>
        <h3>Speisely vs. Lieferando, Uber Eats &amp; Wolt</h3>
        <p>On 100 orders at 20 EUR, a restaurant loses ~600 EUR to Lieferando commissions. On Speisely, that money stays with the restaurant.</p>
        <p>The future of food delivery is local and fair: <a href="https://speisely.de/instant-order">speisely.de/instant-order</a>.</p>
      `
    }
  },
  {
    id: "4",
    slug: "plan-perfect-corporate-event-germany",
    date: "2026-02-18",
    author: "Speisely Event Experts",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
    category: "Event Planning",
    title: {
      de: "Wie man die perfekte Firmenfeier in Deutschland plant (2026)",
      en: "How to Plan the Perfect Corporate Event in Germany (2026)",
    },
    description: {
      de: "Ein Guide zur Organisation von Corporate Events 2026. Von der Location-Suche bis zum richtigen Eventplaner in ganz Deutschland.",
      en: "A guide to organizing corporate events in 2026. From finding the location to hiring the right event planner across Germany.",
    },
    tldr: {
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
    content: {
      de: `
        <h2>Firmenfeier organisieren: Die ersten Schritte</h2>
        <p>Eine <strong>Firmenfeier organisieren</strong> kann stressig sein. Top-Locations sind oft Monate im Voraus ausgebucht.</p>
        <h3>Brauche ich einen Eventplaner?</h3>
        <p>Die Suche nach einem professionellen <a href="/planner">Eventplaner</a> lohnt sich oft schon ab einer Gruppe von 50 Personen. Professionelle Planer haben Zugang zu exklusiven Off-Market-Locations. Lies auch unseren Guide <a href="/blog/was-kostet-ein-eventplaner">Was kostet ein Eventplaner?</a>.</p>
        <h3>Event Catering Ideen 2026</h3>
        <p>Moderne <strong>Event Catering Ideen 2026</strong> setzen auf Flying Dinners, interaktive Food-Stationen und Street-Food-Wagen statt klassischer Buffets. Welche Form passt? <a href="/blog/welche-catering-art-passt-zu-welchem-anlass">Erfahre es hier</a>.</p>
        <h3>Catering ueber den Speisely-Marktplatz buchen</h3>
        <p>Ueber unseren <a href="/catering">Catering-Marktplatz</a> kannst du qualifizierte <a href="/catering/events">Event-Caterer</a> direkt anfragen. Eine <strong>10%-Anzahlung</strong> sichert dein Datum.</p>
        <p>Speisely-Caterer sind bundesweit für Sie im Einsatz. Schau dir auch unseren Artikel über <a href="/blog/catering-firmenevents-deutschland-2026">Catering für Firmenevents in Deutschland</a> an.</p>
      `,
      en: `
        <h2>Organizing a Corporate Event: The First Steps</h2>
        <p><strong>Organizing a corporate event</strong> can be stressful. Top locations are often booked months in advance.</p>
        <h3>Do I Need an Event Planner?</h3>
        <p>Searching for a professional <strong>event planner</strong> is often worth it for 50+ people. Planners have access to exclusive off-market locations.</p>
        <h3>Event Catering Ideas 2026</h3>
        <p>Modern <strong>event catering ideas 2026</strong> favor flying dinners, interactive food stations, and street food carts over classic buffets.</p>
        <h3>Booking Catering via the Speisely Marketplace</h3>
        <p>At <a href="https://speisely.de/catering">speisely.de/catering</a>, you can request qualified caterers directly. A <strong>10% deposit</strong> secures your booking.</p>
        <p>Speisely caterers are available nationwide.</p>
      `
    }
  },
  {
    id: "5",
    slug: "why-become-a-partner-of-speisely",
    date: "2026-06-15",
    author: "Speisely Business",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80",
    category: "Company",
    title: {
      de: "Warum Restaurants, Caterer und Eventplaner Partner von Speisely werden sollten",
      en: "Why Restaurants, Caterers, and Event Planners Should Partner with Speisely",
    },
    description: {
      de: "34.99 EUR/Monat. 0% Provision. Dein eigener Storefront. Entdecke alle Live-Features von Speisely fuer Restaurants, Caterer und Event-Planer.",
      en: "34.99 EUR/month. 0% commission. Your own storefront. Discover all live Speisely features for restaurants, caterers and event planners.",
    },
    tldr: {
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
    content: {
      de: `
        <h2>Die faire Plattform fuer Gastronomie und Eventplanung</h2>
        <p>Viele Plattformen verlangen bis zu 30% Provision. <strong>Speisely</strong> aendert das grundlegend.</p>
        <h3>Die genauen Konditionen</h3>
        <p><strong>Restaurants:</strong> Starter-Plan fuer <strong>34.99 EUR/Monat</strong> - inklusive eigenem Storefront, unbegrenzten Direktbestellungen und <strong>0% Bestellprovision</strong>.</p>
        <p><strong>Caterer &amp; Event-Planer:</strong> Keine monatliche Grundgebuehr. Nur <strong>10% Provision pro erfolgreicher Buchung</strong>.</p>
        <h3>Alle live Features</h3>
        <ul>
          <li>Eigener Storefront unter speisely.de/restaurant/ihr-name</li>
          <li>Kitchen Display System (KDS) fuer digitales Kuechen-Ordermanagement</li>
          <li>Instant Order Verzeichnis - werde von Kunden entdeckt</li>
          <li>Catering-Marktplatz - erhalte qualifizierte B2B- und B2C-Anfragen</li>
          <li>Event Planer Listings</li>
          <li>Stripe Connect - sichere Direktzahlungen</li>
          <li>Tischreservierungen mit Echtzeit-Verfuegbarkeit</li>
          <li>Analytics Dashboard mit Umsatzuebersicht</li>
        </ul>
        <p><a href="https://speisely.de/partners">Jetzt Partner werden auf speisely.de/partners</a></p>
      `,
      en: `
        <h2>The Fair Platform for Gastronomy and Event Planning</h2>
        <p>Many platforms charge up to 30% commission. <strong>Speisely</strong> fundamentally changes these rules.</p>
        <h3>The Exact Pricing</h3>
        <p><strong>Restaurants:</strong> Starter Plan at <strong>34.99 EUR/month</strong> - including your own storefront, unlimited direct orders, and <strong>0% order commission</strong>.</p>
        <p><strong>Caterers &amp; Event Planners:</strong> No monthly base fee. Only <strong>10% commission per successful booking</strong>.</p>
        <h3>All Live Features</h3>
        <ul>
          <li>Dedicated Storefront at speisely.de/restaurant/your-name</li>
          <li>Kitchen Display System (KDS) for digital kitchen order management</li>
          <li>Instant Order Directory - get discovered by customers</li>
          <li>Catering Marketplace - receive qualified B2B and B2C inquiries</li>
          <li>Event Planner Listings</li>
          <li>Stripe Connect - secure direct payments</li>
          <li>Table Reservations with real-time availability</li>
          <li>Analytics Dashboard with revenue overview</li>
        </ul>
        <p><a href="https://speisely.de/partners">Become a partner at speisely.de/partners</a></p>
      `
    }
  },
  {
    id: "6",
    slug: "restaurant-bestellen-ohne-provision-speisely",
    date: "2026-06-01",
    author: "Speisely Editorial",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    category: "Instant Order",
    title: {
      de: "Restaurant online bestellen ohne Provision - So funktioniert Speisely",
      en: "Order from Restaurants Without Commission - How Speisely Works",
    },
    description: {
      de: "Speisely ermoeglicht Direktbestellungen bei lokalen Restaurants - 34.99 EUR/Monat, 0% Provision. So funktioniert es fuer Restaurantbesitzer und Kunden.",
      en: "Speisely enables direct ordering from local restaurants - 34.99 EUR/month, 0% commission. Here's how it works for restaurant owners and customers.",
    },
    tldr: {
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
    content: {
      de: `
        <h2>Essen bestellen ohne Provision - geht das?</h2>
        <p>Ja, und genau das macht <strong>Speisely</strong> moeglich. Traditionelle Lieferdienste wie Lieferando verlangen bis zu <strong>30% Provision</strong>. Speisely bietet einen eigenen Storefront fuer nur <strong>34.99 EUR/Monat</strong> mit <strong>0% Bestellprovision</strong>.</p>
        <h3>Wie funktioniert Speisely fuer Restaurants?</h3>
        <p>Jedes Restaurant erhaelt seinen eigenen Auftritt unter <strong>speisely.de/restaurant/ihr-name</strong>. Eingehende Bestellungen werden im integrierten <strong>Kitchen Display System (KDS)</strong> angezeigt.</p>
        <h3>Wie funktioniert Speisely fuer Kunden?</h3>
        <p>Kunden besuchen <a href="https://speisely.de/instant-order">speisely.de/instant-order</a> und entdecken lokale Restaurants. Kein App-Download notwendig, keine erzwungene Registrierung.</p>
        <h3>Speisely vs. Lieferando - Der direkte Vergleich</h3>
        <p>Bei 50 Bestellungen a 25 EUR macht ein Restaurant auf Lieferando ueber <strong>375 EUR Verlust</strong> durch Provision. Bei Speisely zahlt das Restaurant <strong>34.99 EUR/Monat</strong> und behaelt den Rest komplett.</p>
        <p><a href="/instant-order">Jetzt Restaurants in deiner Naehe entdecken und bestellen</a></p>
      `,
      en: `
        <h2>Ordering Food Without Commission - Is That Possible?</h2>
        <p>Yes, and that's exactly what <strong>Speisely</strong> makes possible. Traditional delivery services like Lieferando charge up to <strong>30% commission</strong>. Speisely offers a dedicated storefront for just <strong>34.99 EUR/month</strong> with <strong>0% order commission</strong>.</p>
        <h3>How Does Speisely Work for Restaurants?</h3>
        <p>Every restaurant gets its own presence at <strong>speisely.de/restaurant/your-name</strong>. Incoming orders are displayed in the integrated <strong>Kitchen Display System (KDS)</strong>.</p>
        <h3>How Does Speisely Work for Customers?</h3>
        <p>Customers visit <a href="https://speisely.de/instant-order">speisely.de/instant-order</a> and discover local restaurants. No app download needed, no forced registration.</p>
        <h3>Speisely vs. Lieferando - The Direct Comparison</h3>
        <p>With 50 orders at 25 EUR, a restaurant on Lieferando loses over <strong>375 EUR</strong> to commission. On Speisely, the restaurant pays <strong>34.99 EUR/month</strong> and keeps the rest entirely.</p>
        <p><a href="https://speisely.de/instant-order">Discover now: speisely.de/instant-order</a></p>
      `
    }
  },
  {
    id: "7",
    slug: "catering-firmenevents-deutschland-2026",
    date: "2026-06-05",
    author: "Speisely Catering Team",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    category: "Catering",
    title: {
      de: "Catering fuer Firmenevents in Deutschland - Die besten Anbieter 2026",
      en: "Catering for Corporate Events in Germany - The Best Providers 2026",
    },
    description: {
      de: "Catering fuer Firmenevents in Deutschland: Top Caterer in ganz Deutschland. Jetzt auf Speisely anfragen.",
      en: "Catering for corporate events in Germany: Top caterers nationwide. Request now on Speisely.",
    },
    tldr: {
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
    content: {
      de: `
        <h2>Catering in Deutschland: Ein wachsender Markt</h2>
        <p>Unternehmen aus ganz Deutschland suchen zuverlassige Caterer fuer Sommerfeste, Weihnachtsfeiern und Mitarbeitertage.</p>
        <h3>Top Kategorien fuer Catering-Anfragen</h3>
        <p><strong>Messe &amp; Business:</strong> Hohe Nachfrage nach Business-Catering fuer internationale Unternehmen und Messen. Entdecken Sie auch unsere <a href="/catering/institutional-catering">Betriebsverpflegung</a>.<br/>
        <strong>Streetfood &amp; Vegan:</strong> Vielfaeltige Catering-Landschaft - von veganen Streetfood-Konzepten bis zu klassischen Buffets. Mehr dazu in <a href="/blog/sustainable-plant-based-catering-trends-2026">Nachhaltiges Catering 2026</a>.<br/>
        <strong>Mittelstand:</strong> Wachsender Markt fuer Firmen-Catering im Mittelstand.<br/>
        <strong>Industrie:</strong> Starke Nachfrage nach Catering fuer Werksveranstaltungen.</p>
        <h3>So buchst du Catering ueber Speisely</h3>
        <p>Auf unserem <a href="/catering">Catering-Marktplatz</a> oder speziell für <a href="/catering/events">Event-Catering</a> kannst du in wenigen Schritten eine Catering-Anfrage stellen. Eine <strong>10%-Anzahlung</strong> sichert dein Datum.</p>
        <p><a href="/catering">Jetzt Catering anfragen</a></p>
      `,
      en: `
        <h2>Catering in Germany: A Growing Market</h2>
        <p>Companies across Germany are looking for reliable caterers for summer parties, Christmas events, and team days.</p>
        <h3>Top Categories for Catering Inquiries</h3>
        <p><strong>Fairs &amp; Business:</strong> High demand for business catering for international companies and trade fairs.<br/>
        <strong>Street Food &amp; Vegan:</strong> Diverse catering landscape - from vegan street food to classic buffets.<br/>
        <strong>Mid-sized Business:</strong> Growing market for corporate catering in mid-sized businesses.<br/>
        <strong>Industry:</strong> Strong demand for catering at factory events.</p>
        <h3>How to Book Catering via Speisely</h3>
        <p>At <a href="https://speisely.de/catering">speisely.de/catering</a>, submit a catering inquiry in a few steps. A <strong>10% deposit</strong> secures your date.</p>
        <p><a href="https://speisely.de/catering">Request catering: speisely.de/catering</a></p>
      `
    }
  },
  {
    id: "8",
    slug: "kitchen-display-system-restaurant-kds",
    date: "2026-06-10",
    author: "Speisely Team",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    category: "Instant Order",
    title: {
      de: "Kitchen Display System fuer Restaurants - Warum KDS die Kueche revolutioniert",
      en: "Kitchen Display System for Restaurants - Why KDS Revolutionizes the Kitchen",
    },
    description: {
      de: "Was ist ein Kitchen Display System? Wie das integrierte KDS von Speisely Bestellprozesse in Restaurants digitalisiert und beschleunigt.",
      en: "What is a Kitchen Display System? How Speisely's integrated KDS digitizes and accelerates order processes in restaurants.",
    },
    tldr: {
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
    content: {
      de: `
        <h2>Was ist ein Kitchen Display System (KDS)?</h2>
        <p>Ein <strong>Kitchen Display System (KDS)</strong> ist ein digitaler Bildschirm in der Restaurantkueche, auf dem eingehende Bestellungen in Echtzeit angezeigt werden. Statt Bon-Zettel, die verloren gehen oder unleserlich sind, sehen alle Mitarbeiter jederzeit den aktuellen Bestellstatus.</p>
        <h3>Die Probleme ohne KDS</h3>
        <p>In vielen Restaurants laeuft die Bestellkommunikation noch ueber Papier-Bons oder Zuruf. Das fuehrt zu Fehlern und Verzoegerungen - besonders bei hohem Online-Bestellvolumen.</p>
        <h3>Das Speisely KDS - direkt integriert</h3>
        <p>Speisely enthaelt ein vollstaendig integriertes <strong>Kitchen Display System</strong> als Teil jedes Restaurant-Dashboards. Wenn ein Kunde ueber unseren <a href="/instant-order">Instant Order Marktplatz</a> oder den Speisely-Storefront bestellt, erscheint die Bestellung sofort im KDS der Kueche.</p>
        <h3>Vorteile des Speisely KDS</h3>
        <ul>
          <li>Echtzeit-Anzeige aller eingehenden Bestellungen</li>
          <li>Kein Papierbonabfall - 100% digital</li>
          <li>Klarer Status-Workflow: Neu - In Bearbeitung - Fertig</li>
          <li>Optimiert fuer Kuechen-Teams jeder Groesse</li>
          <li>Kostenlos im Speisely Starter-Plan enthalten (34.99 EUR/Monat)</li>
        </ul>
        <p><a href="https://speisely.de/partners">Jetzt Partner werden und KDS nutzen: speisely.de/partners</a></p>
      `,
      en: `
        <h2>What is a Kitchen Display System (KDS)?</h2>
        <p>A <strong>Kitchen Display System (KDS)</strong> is a digital screen in the restaurant kitchen that displays incoming orders in real time. Instead of paper tickets that get lost or are illegible, all staff can see at any time which dishes need to be prepared.</p>
        <h3>The Problems Without a KDS</h3>
        <p>In many restaurants, order communication still runs via paper tickets or shouting. This leads to errors and delays - especially with high online order volumes.</p>
        <h3>The Speisely KDS - Directly Integrated</h3>
        <p>Speisely includes a fully integrated <strong>Kitchen Display System</strong> as part of every restaurant dashboard. When a customer orders through the Speisely storefront, the order appears immediately on the kitchen KDS.</p>
        <h3>Advantages of the Speisely KDS</h3>
        <ul>
          <li>Real-time display of all incoming orders</li>
          <li>No paper ticket waste - 100% digital</li>
          <li>Clear status workflow: New - In Progress - Done</li>
          <li>Optimized for kitchen teams of any size</li>
          <li>Included free in the Speisely Starter Plan (34.99 EUR/month)</li>
        </ul>
        <p><a href="https://speisely.de/partners">Become a partner and use the KDS: speisely.de/partners</a></p>
      `
    }
  },
  {
    id: "9",
    slug: "was-kostet-ein-eventplaner",
    date: "2026-06-25",
    author: "Speisely Editorial",
    image: "/images/blog/was-kostet-ein-eventplaner.png",
    category: "Event Planning",
    title: {
      de: "Was kostet ein Eventplaner? Preise und Leistungen im Überblick",
      en: "How Much Does an Event Planner Cost? Prices and Services Overview",
    },
    description: {
      de: "Wie viel kostet ein Eventplaner in Deutschland? Erfahren Sie alles über Stundensätze, Pauschalen und Prozentmodelle für Hochzeiten und Firmenevents.",
      en: "How much does an event planner cost in Germany? Learn everything about hourly rates, flat fees, and percentage models for weddings and corporate events.",
    },
    tldr: {
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
    content: {
      de: `
        <h2>Was kostet ein Eventplaner? Die schnelle Antwort</h2>
        <p>In Deutschland kostet ein professioneller Eventplaner im Durchschnitt zwischen <strong>60 € und 150 € pro Stunde</strong>. Alternativ berechnen viele Agenturen ein <strong>Prozentmodell von 10 % bis 20 %</strong> des gesamten Veranstaltungsbudgets oder bieten feste <strong>Pauschalen</strong> an. Für eine komplette Hochzeitsplanung sollten Sie mit Kosten zwischen 2.500 € und 5.000 € rechnen, während bei Firmenevents die Preise je nach Umfang und Teilnehmerzahl stark variieren.</p>
        
        <h3>Welche Abrechnungsmodelle gibt es?</h3>
        <h4>1. Das Prozentmodell (Budgetbasiert)</h4>
        <p>Dies ist das häufigste Modell bei großen Events und Hochzeiten. Der Eventplaner erhält in der Regel 15 % des Gesamtbudgets der Veranstaltung. Wenn Ihr Event 20.000 € kostet, liegt das Honorar des Planers bei etwa 3.000 €.</p>
        
        <h4>2. Der Stundensatz</h4>
        <p>Bei Teilplanungen (z.B. nur Location-Suche oder Dienstleister-Vermittlung) wird oft nach Stunden abgerechnet. Hier liegen die Preise meist zwischen 80 € und 120 € pro Stunde.</p>
        
        <h4>3. Die Festpreis-Pauschale</h4>
        <p>Einige Planer bieten feste Pakete an. Ein "Day-of-Coordination" Paket (nur die Betreuung am Tag der Veranstaltung) kostet oft zwischen 800 € und 1.500 €.</p>
        
        <h3>Warum lohnt sich die Investition in einen Eventplaner?</h3>
        <p>Auch wenn die Kosten zunächst hoch erscheinen, sparen professionelle Eventplaner oft Zeit und Geld. Sie verhandeln bessere Konditionen mit Dienstleistern, vermeiden teure Anfängerfehler und garantieren einen stressfreien Ablauf. Für weitere Details zur Organisation lies auch <a href="/blog/plan-perfect-corporate-event-berlin-munich">unseren Event-Guide</a>.</p>
        <p>Finden Sie auf <a href="/planner">Speisely</a> geprüfte Eventplaner in Ihrer Nähe und vergleichen Sie transparente Angebote.</p>
      `,
      en: `
        <h2>How Much Does an Event Planner Cost? The Quick Answer</h2>
        <p>In Germany, a professional event planner costs between <strong>60 € and 150 € per hour</strong> on average. Alternatively, many agencies charge a <strong>percentage model of 10% to 20%</strong> of the total event budget or offer fixed <strong>flat rates</strong>. For full wedding planning, expect costs between 2,500 € and 5,000 €, while corporate event prices vary greatly depending on scope.</p>
        
        <h3>What billing models exist?</h3>
        <p>The most common are the percentage model (usually 15% of the budget), hourly rates (for partial planning), and flat-rate packages (like day-of-coordination).</p>
      `
    },
    faq: [
      {
        question: "Wie viel kostet ein Eventplaner im Durchschnitt?",
        answer: "Ein professioneller Eventplaner kostet in Deutschland durchschnittlich 80 bis 150 Euro pro Stunde. Bei einem prozentualen Honorarmodell berechnen die meisten Planer zwischen 10 % und 20 % des Gesamtbudgets der Veranstaltung."
      },
      {
        question: "Was ist in den Kosten eines Eventplaners enthalten?",
        answer: "Das Leistungspaket umfasst meist die Konzeption, Location-Suche, Dienstleister-Vermittlung (Catering, Musik, Deko), Budgetüberwachung sowie die Koordination am Veranstaltungstag selbst. Bei Teilplanungen können Sie Leistungen auch einzeln buchen."
      },
      {
        question: "Lohnt sich ein Eventplaner für private Feiern?",
        answer: "Ja, besonders bei großen Hochzeiten oder runden Geburtstagen spart ein Planer enorm viel Stress. Zudem verfügen Eventplaner über ein großes Netzwerk und können oft bessere Konditionen bei Catering und Locations aushandeln, was die eigenen Kosten wieder senken kann."
      },
      {
        question: "Was kostet eine reine Tagesbetreuung (Day-of-Coordination)?",
        answer: "Wenn Sie die Planung selbst übernehmen und den Eventplaner nur für den reibungslosen Ablauf am Veranstaltungstag benötigen, liegen die Kosten hierfür als Festpreis meist zwischen 800 € und 1.500 €."
      }
    ]
  },
  {
    id: "10",
    slug: "hochzeit-planen-catering-musik-ablauf-budget",
    date: "2026-06-25",
    author: "Speisely Editorial",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
    category: "Event Planning",
    title: {
      de: "Hochzeit planen: Der ultimative Guide zu Catering, Musik, Ablauf und Budget",
      en: "Planning a Wedding: The Ultimate Guide to Catering, Music, Schedule and Budget",
    },
    description: {
      de: "Alles was Sie zur Hochzeitsplanung wissen müssen. Ein kompletter Guide mit Tipps zu Budget, Catering-Auswahl, DJ vs. Band und dem perfekten Ablauf.",
      en: "Everything you need to know about wedding planning. A complete guide with tips on budgeting, catering, DJ vs Band, and the perfect schedule.",
    },
    tldr: {
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
    content: {
      de: `
        <h2>Die Hochzeitsplanung: Ein grober Überblick</h2>
        <p>Die Planung einer Hochzeit ist ein spannendes Projekt, das im Idealfall 12 bis 18 Monate vor dem großen Tag beginnt. Die wichtigsten Säulen sind die <strong>Location</strong>, das <strong>Catering</strong>, die <strong>Musik</strong> und der reibungslose <strong>Ablauf</strong>.</p>
        
        <h3>1. Das Hochzeits-Budget richtig kalkulieren</h3>
        <p>Bevor Sie Dienstleister buchen, muss das Budget stehen. Eine durchschnittliche Hochzeit mit 80 Gästen kostet in Deutschland etwa 15.000 bis 25.000 Euro. Der größte Posten ist meist die Location und das Catering (ca. 40-50 % des Budgets).</p>
        
        <h3>2. Catering-Auswahl: Buffet, Menü oder Family-Style?</h3>
        <p>Das Essen bleibt den Gästen am längsten in Erinnerung. Ein klassisches <strong>Buffet</strong> bietet Vielfalt und Bewegung, während ein <strong>Menü (Plated Dinner)</strong> formeller und eleganter ist. Ein beliebter Kompromiss ist das <strong>Family-Style-Catering</strong>, bei dem große Schüsseln und Platten auf den Tischen zum Teilen platziert werden.</p>
        
        <h3>3. Musik: DJ oder Live-Band?</h3>
        <p>Ein Hochzeits-DJ ist flexibler, braucht weniger Platz und ist mit ca. 800 € bis 1.500 € deutlich günstiger als eine professionelle Live-Band (2.000 € bis 4.000 €). Eine Kombination – Band am Nachmittag, DJ am Abend – ist oft die perfekte Lösung.</p>
        
        <h3>4. Der perfekte Ablaufplan (Timeline)</h3>
        <p>Ein guter Ablaufplan lässt Raum für Puffer. Planen Sie für das Dinner mindestens 2 bis 2,5 Stunden ein und legen Sie die Hochzeitstorte nicht zu spät an, um die Party nicht zu unterbrechen.</p>
        <p>Entdecken Sie auf unserem <a href="/catering/events">Catering-Marktplatz für Events</a> die besten Hochzeits-Caterer für Ihren großen Tag oder buchen Sie einen professionellen <a href="/planner">Eventplaner</a>, der den Ablauf für Sie übernimmt. Falls Sie sich fragen, welche Art von Essen serviert werden soll, lesen Sie unseren Beitrag <a href="/blog/welche-catering-art-passt-zu-welchem-anlass">Welche Catering-Art passt zu welchem Anlass?</a>.</p>
      `,
      en: `
        <h2>Wedding Planning: A Brief Overview</h2>
        <p>Planning a wedding is an exciting project that ideally starts 12 to 18 months before the big day. The most important pillars are the location, the catering, the music, and the schedule.</p>
        <h3>1. Budgeting properly</h3>
        <p>An average wedding with 80 guests costs around 15,000 to 25,000 euros in Germany. Location and catering take up 40-50%.</p>
      `
    },
    faq: [
      {
        question: "Wie viel Budget sollte man für eine Hochzeit mit 80 Personen einplanen?",
        answer: "In Deutschland rechnen Brautpaare im Durchschnitt mit 15.000 € bis 25.000 € für eine Hochzeit mit 80 Personen. Dies entspricht etwa 180 € bis 300 € pro Gast, wobei Location und Catering den Löwenanteil ausmachen."
      },
      {
        question: "Was ist besser für eine Hochzeit: Buffet oder Menü?",
        answer: "Beide Varianten haben Vorteile. Ein Menü wirkt festlicher und verhindert Warteschlangen, während ein Buffet günstiger ist und eine größere Auswahl für verschiedene Geschmäcker und Allergiker bietet. Alternativ empfiehlt sich ein 'Family-Style'-Catering am Tisch."
      },
      {
        question: "Wie viel kostet ein Hochzeits-Catering pro Person?",
        answer: "Die Preise variieren stark nach Region und Umfang. Ein einfaches Buffet startet bei ca. 35 € pro Person, während ein hochwertiges 4-Gänge-Menü schnell 80 € bis 120 € kosten kann (oft ohne Getränke)."
      },
      {
        question: "Wie finde ich passende Dienstleister für meine Hochzeit?",
        answer: "Beginnen Sie die Suche mindestens 12 Monate im Voraus. Nutzen Sie Plattformen wie Speisely, um regionale Caterer und Eventplaner zu vergleichen, prüfen Sie Referenzen und vereinbaren Sie immer ein Probeessen."
      }
    ]
  },
  {
    id: "11",
    slug: "welche-catering-art-passt-zu-welchem-anlass",
    date: "2026-06-25",
    author: "Speisely Editorial",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
    category: "Catering",
    title: {
      de: "Welche Catering-Art passt zu welchem Anlass?",
      en: "Which Catering Style Fits Which Occasion?",
    },
    description: {
      de: "Buffet, Flying Dinner, Foodtruck oder Menü? Erfahren Sie, welche Catering-Art für Hochzeiten, Firmenfeiern und Business-Meetings am besten geeignet ist.",
      en: "Buffet, flying dinner, food truck, or set menu? Find out which catering style is best for weddings, corporate events, and business meetings.",
    },
    tldr: {
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
    },
    content: {
      de: `
        <h2>Die Qual der Wahl: Das richtige Catering finden</h2>
        <p>Die Art des Caterings prägt die Atmosphäre Ihres gesamten Events. Die richtige Entscheidung hängt von der Gästezahl, der Location, dem Budget und der gewünschten Stimmung ab.</p>
        
        <h3>1. Das klassische Buffet (Der Allrounder)</h3>
        <p><strong>Ideal für:</strong> Hochzeiten, große Firmenfeiern, runde Geburtstage.<br/>Ein Buffet ist kommunikativ, weil sich die Gäste bewegen müssen. Es bietet die größte kulinarische Vielfalt und ist besonders budgetfreundlich, erfordert jedoch Platz für die Aufbaustationen.</p>
        
        <h3>2. Flying Buffet / Flying Dinner</h3>
        <p><strong>Ideal für:</strong> Stehempfänge, Networking-Events, Vernissagen.<br/>Servicekräfte servieren kleine, handliche Portionen direkt aus Schalen oder Gläsern. Die Gäste müssen sich nicht hinsetzen, was den Austausch fördert und eine lockere, aber exklusive Atmosphäre schafft.</p>
        
        <h3>3. Plated Dinner (Gesetztes Menü)</h3>
        <p><strong>Ideal für:</strong> Galas, formelle Hochzeiten, exklusive Business-Dinner.<br/>Alle Gäste werden am Tisch bedient. Dies wirkt sehr feierlich und elegant. Die Herausforderung besteht in der genauen Vorab-Abfrage von Allergien und Vorlieben der Gäste.</p>
        
        <h3>4. Foodtrucks & Streetfood-Stände</h3>
        <p><strong>Ideal für:</strong> Sommerfeste, Festival-Hochzeiten, lockere Firmenevents.<br/>Moderne Foodtrucks bringen eine entspannte Festival-Atmosphäre. Die Gäste holen sich frische Burger, Tacos oder Bowls direkt am Wagen.</p>
        
        <h3>5. Business-Lunch / Drop-Off Catering</h3>
        <p><strong>Ideal für:</strong> Meetings, Seminare, tägliche Büroverpflegung.<br/>Kaltes Fingerfood, Sandwiches oder unkomplizierte warme Bowls, die einfach geliefert und ohne Personal aufgebaut werden können. Entdecken Sie auch unsere Angebote für <a href="/catering/institutional-catering">Gemeinschaftsverpflegung</a>.</p>
        
        <p>Egal welchen Anlass Sie planen, auf <a href="/catering">Speisely Catering</a> und im <a href="/catering/events">Event-Catering</a> finden Sie garantiert den passenden Catering-Partner für Ihre individuellen Bedürfnisse. Benötigen Sie Hilfe bei der Gesamtplanung? Unsere <a href="/planner">Eventplaner</a> unterstützen Sie gerne.</p>
      `,
      en: `
        <h2>Spoilt for Choice: Finding the Right Catering</h2>
        <p>The type of catering shapes the atmosphere of your entire event. The right decision depends on the number of guests, the location, the budget, and the desired mood.</p>
        <h3>Popular Styles</h3>
        <p>Buffet is best for large parties. Flying Dinner is ideal for networking. Plated dinner suits formal galas, and food trucks bring a relaxed festival vibe.</p>
      `
    },
    faq: [
      {
        question: "Welches Catering eignet sich am besten für Stehempfänge?",
        answer: "Für Stehempfänge ist ein sogenanntes 'Flying Dinner' oder Fingerfood ideal. Hierbei serviert das Personal kleine, mundgerechte Portionen direkt zu den Gästen. Es werden weder Tische noch Besteck benötigt, was das Networking erleichtert."
      },
      {
        question: "Was ist der Vorteil von Foodtruck-Catering?",
        answer: "Foodtrucks sorgen für eine lockere, ungezwungene Atmosphäre und eignen sich hervorragend für Outdoor-Events, Sommerfeste oder Festival-Hochzeiten. Zudem benötigen sie oft keine externe Küche, da die Speisen direkt im Wagen frisch zubereitet werden."
      },
      {
        question: "Welche Catering-Art ist am günstigsten?",
        answer: "Das Drop-Off-Catering (Lieferung von fertigen Platten ohne Servicepersonal vor Ort) ist am günstigsten. Wenn warmes Essen gewünscht ist, ist ein klassisches Buffet in der Regel preiswerter als ein gesetztes Menü, da weniger Servicekräfte benötigt werden."
      },
      {
        question: "Worauf muss ich bei der Catering-Planung achten?",
        answer: "Achten Sie auf die räumlichen Gegebenheiten der Location (Strom, Platz für ein Buffet, Zugang zur Küche). Zudem ist es essenziell, vorab Allergien und Ernährungspräferenzen (z.B. vegetarisch/vegan) Ihrer Gäste abzufragen."
      }
    ]
  }
];