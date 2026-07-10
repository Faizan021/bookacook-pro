export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqCategory = {
  de: FaqItem[];
  en: FaqItem[];
};

export const cateringFaqData: FaqCategory = {
  de: [
    {
      question: "Was versteht man unter Cateringservice?",
      answer:
        "Ein Cateringservice umfasst die professionelle Zubereitung, Lieferung und oft auch die Präsentation von Speisen und Getränken für verschiedene Anlässe. Moderne Caterer gehen dabei über die reine Essenslieferung hinaus und bieten ganzheitliche kulinarische Erlebnisse an – vom einfachen Fingerfood-Drop-off für das Büro bis hin zum voll betreuten Galadinner mit Personal und Equipment.",
    },
    {
      question: "Welche Arten von Veranstaltungen bedienen Caterer?",
      answer:
        "Caterer decken ein breites Spektrum ab: Private Feiern wie Hochzeiten und Geburtstage, Business-Events wie Konferenzen, Tagungen und Weihnachtsfeiern, sowie das tägliche Office-Catering oder die Großverpflegung für Schulen und Kitas. Auf Speisely können Sie gezielt nach Caterern filtern, die sich auf Ihren spezifischen Anlasstyp spezialisiert haben.",
    },
    {
      question: "Was ist der Unterschied zwischen Buffet und Menü?",
      answer:
        "Bei einem Buffet werden alle Speisen auf einer zentralen Station angerichtet, an der sich die Gäste selbst bedienen. Das fördert die Kommunikation und bietet eine größere Auswahl. Ein Menü (Plated Dinner) wird in festgelegten Gängen direkt am Platz serviert, was formeller und eleganter wirkt, aber eine genauere Vorabplanung der Sitzordnung und Menüwahl pro Gast erfordert.",
    },
    {
      question: "Wie viele Personen kann ein Cateringbetrieb bewältigen?",
      answer:
        "Das hängt stark von der Spezialisierung des Caterers ab. Kleine Manufakturen fokussieren sich oft auf exklusive Runden von 10 bis 50 Personen, während große Großküchen und Event-Caterer problemlos Veranstaltungen mit mehreren tausend Gästen stemmen können. Auf Speisely sehen Sie direkt die Mindest- und Maximalkapazitäten der jeweiligen Partner.",
    },
    {
      question: "Wie früh sollte ich einen Caterer buchen?",
      answer:
        "Für große Events wie Hochzeiten oder Weihnachtsfeiern empfehlen wir eine Buchung von 6 bis 12 Monaten im Voraus. Für kleinere Business-Lunches oder private Partys genügen oft 2 bis 4 Wochen. Bei kurzfristigen Anfragen (weniger als 7 Tage) bieten viele Speisely-Partner spezielle, schnell umsetzbare Standardpakete an.",
    },
    {
      question: "Kann ich ein Probemenü vor der Buchung bekommen?",
      answer:
        "Ja, besonders bei großen Events wie Hochzeiten oder Firmengalas ist ein Probeessen absolut üblich. Die Kosten hierfür werden oft mit der finalen Auftragssumme verrechnet, falls Sie sich für den Caterer entscheiden. Klären Sie dies am besten direkt bei Ihrer Anfrage über Speisely.",
    },
    {
      question: "Was passiert, wenn Gäste absagen oder mehr kommen?",
      answer:
        "Die meisten Caterer haben eine vertraglich festgelegte Deadline (oft 7 bis 14 Tage vor dem Event), bis zu der Sie die finale Gästezahl kostenlos anpassen können. Danach wird in der Regel die zuletzt gemeldete Anzahl abgerechnet, da Wareneinkauf und Personalplanung bereits abgeschlossen sind.",
    },
    {
      question: "Wie viel kostet ein Catering pro Person?",
      answer:
        "Die Kosten variieren je nach Aufwand, Zutatenqualität und Service. Ein einfaches Business-Lunch-Buffet startet oft bei 15-25 € pro Person. Hochwertige Hochzeitsmenüs oder BBQ-Caterings inklusive Personal und Equipment liegen typischerweise zwischen 50 € und 150 € pro Person. Über Speisely können Sie Ihr Budget direkt angeben, um passende Angebote zu erhalten.",
    },
    {
      question: "Wie finde ich einen guten Catering-Service?",
      answer:
        "Ein guter Caterer zeichnet sich durch Transparenz, Flexibilität und nachweisbare Qualität aus. Achten Sie auf klare Kommunikation bei der Angebotserstellung, Spezialisierungen, die zu Ihrem Event passen, und die Bereitschaft, auf Ihre individuellen Wünsche einzugehen. Speisely listet ausschließlich qualitätsgeprüfte Partner, um Ihnen die Auswahl zu erleichtern.",
    },
    {
      question: "Welche Informationen sollte ich bei einer Catering-Anfrage bereithalten?",
      answer:
        "Für ein präzises Angebot benötigt der Caterer das Veranstaltungsdatum, den genauen Ort (oder die PLZ), die erwartete Gästezahl, das gewünschte Format (Buffet, Menü, Fingerfood) sowie ein grobes Budget pro Person. Zudem sind Informationen zu den örtlichen Gegebenheiten (gibt es eine Küche vor Ort?) sehr hilfreich.",
    },
    {
      question: "Können Caterer auf Allergien und Ernährungswünsche eingehen?",
      answer:
        "Absolut. Professionelle Caterer stellen sich problemlos auf vegane, glutenfreie, laktosefreie oder halal-konforme Wünsche ein. Wichtig ist, dass Sie diese Anforderungen so früh wie möglich – idealerweise direkt bei der ersten Anfrage über Speisely – kommunizieren, damit die Menüplanung entsprechend angepasst werden kann.",
    },
    {
      question: "Welche Zusatzleistungen bieten Caterer häufig an?",
      answer:
        "Viele Caterer agieren als Full-Service-Dienstleister. Neben dem Essen bieten sie passendes Geschirr, Besteck und Gläser zur Miete an, stellen erfahrenes Service- und Barpersonal bereit und kümmern sich um den Auf- und Abbau. Manche bringen sogar eigene Foodtrucks, Kaffeebars oder mobile Cocktail-Tresen mit.",
    },
    {
      question: "Wie funktioniert die Anfrage über Speisely?",
      answer:
        "Ganz einfach: Suchen Sie auf unserer Plattform nach Caterern in Ihrer Nähe, filtern Sie nach Event-Typ und Budget. Sie können sich die Profile und Beispielmenüs ansehen und dann eine unverbindliche Anfrage direkt über Speisely senden. Der Caterer meldet sich anschließend mit einem maßgeschneiderten Angebot bei Ihnen.",
    },
  ],
  en: [
    {
      question: "What is a catering service?",
      answer:
        "A catering service includes the professional preparation, delivery, and often presentation of food and beverages for various occasions. Modern caterers go beyond just delivering food, offering holistic culinary experiences – from simple finger food drop-offs for the office to fully catered gala dinners with staff and equipment.",
    },
    {
      question: "What types of events do caterers serve?",
      answer:
        "Caterers cover a wide spectrum: private celebrations like weddings and birthdays, business events such as conferences, meetings, and Christmas parties, as well as daily office catering or large-scale catering for schools and daycares. On Speisely, you can specifically filter for caterers specializing in your event type.",
    },
    {
      question: "What is the difference between a buffet and a set menu?",
      answer:
        "At a buffet, all food is arranged at a central station where guests serve themselves. This promotes communication and offers a wider choice. A set menu (plated dinner) is served directly at the table in set courses, which feels more formal and elegant but requires precise prior planning of seating arrangements and menu choices per guest.",
    },
    {
      question: "How many people can a catering company handle?",
      answer:
        "This strongly depends on the caterer's specialization. Small manufacturers often focus on exclusive groups of 10 to 50 people, while large commercial kitchens and event caterers can easily handle events with several thousand guests. On Speisely, you can see the minimum and maximum capacities of each partner right away.",
    },
    {
      question: "How early should I book a caterer?",
      answer:
        "For large events like weddings or Christmas parties, we recommend booking 6 to 12 months in advance. For smaller business lunches or private parties, 2 to 4 weeks is often sufficient. For short-notice requests (less than 7 days), many Speisely partners offer special, quickly implementable standard packages.",
    },
    {
      question: "Can I get a tasting menu before booking?",
      answer:
        "Yes, especially for large events like weddings or corporate galas, a tasting is absolutely common. The costs for this are often offset against the final order amount if you choose the caterer. It's best to clarify this directly when making your request via Speisely.",
    },
    {
      question: "What happens if guests cancel or more people come?",
      answer:
        "Most caterers have a contractually defined deadline (often 7 to 14 days before the event) until which you can adjust the final guest count free of charge. After that, the most recently reported number is usually billed, as purchasing and staff planning are already finalized.",
    },
    {
      question: "How much does catering cost per person?",
      answer:
        "Costs vary depending on effort, ingredient quality, and service. A simple business lunch buffet often starts at €15-€25 per person. High-quality wedding menus or BBQ caterings including staff and equipment are typically between €50 and €150 per person. Through Speisely, you can state your budget directly to receive suitable offers.",
    },
    {
      question: "How do I find a good catering service?",
      answer:
        "A good caterer is characterized by transparency, flexibility, and verifiable quality. Look for clear communication when quotes are created, specializations that fit your event, and a willingness to accommodate your individual requests. Speisely exclusively lists quality-checked partners to make your choice easier.",
    },
    {
      question: "What information should I have ready for a catering request?",
      answer:
        "For an accurate quote, the caterer needs the event date, the exact location (or ZIP code), the expected number of guests, the desired format (buffet, menu, finger food), and a rough budget per person. Additionally, information about the venue (is there a kitchen on site?) is very helpful.",
    },
    {
      question: "Can caterers accommodate allergies and dietary requirements?",
      answer:
        "Absolutely. Professional caterers easily adjust to vegan, gluten-free, lactose-free, or halal requirements. It is important that you communicate these requirements as early as possible – ideally right in your first request via Speisely – so the menu planning can be adjusted accordingly.",
    },
    {
      question: "What additional services do caterers often offer?",
      answer:
        "Many caterers act as full-service providers. In addition to food, they offer suitable tableware, cutlery, and glasses for rent, provide experienced service and bar staff, and handle setup and breakdown. Some even bring their own food trucks, coffee bars, or mobile cocktail counters.",
    },
    {
      question: "How does the request process via Speisely work?",
      answer:
        "Very simply: search our platform for caterers in your area, filter by event type and budget. You can view their profiles and sample menus, then send a non-binding request directly via Speisely. The caterer will then contact you with a customized offer.",
    },
  ],
};

export const plannerFaqData: FaqCategory = {
  de: [
    {
      question: "Ist die Anfrage wirklich kostenlos?",
      answer:
        "Ja, die Nutzung von Speisely und die Anfragen an unsere Event-Planer sind 100% kostenlos und unverbindlich.",
    },
    {
      question: "Wie finde ich den richtigen Planer?",
      answer:
        "Unser Guided Briefing Wizard hilft dir dabei. Wir nutzen deine Antworten, um dir die am besten passenden Event-Planer vorzuschlagen.",
    },
    {
      question: "Arbeiten Sie mit allen Budgets?",
      answer:
        "Wir haben Planer für verschiedene Budgetklassen – von Premium bis Luxury. Wähle einfach dein Budget im Briefing aus.",
    },
  ],
  en: [
    {
      question: "Is the inquiry really free?",
      answer:
        "Yes, using Speisely and requesting quotes from our event planners is 100% free and without obligation.",
    },
    {
      question: "How do I find the right planner?",
      answer:
        "Our Guided Briefing Wizard helps you. We use your answers to suggest the most suitable event planners for you.",
    },
    {
      question: "Do you work with all budgets?",
      answer:
        "We have planners for various budget classes – from Premium to Luxury. Just select your budget in the briefing.",
    },
  ],
};
