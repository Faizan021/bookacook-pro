import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  Shield,
  Users,
  Utensils,
  Mail,
  Instagram,
  Sparkles,
  ExternalLink,
  BookOpen,
  Coffee,
  Clock,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { SiteShell } from "@/components/SiteShell";
import { AboutSpeiselySection } from "@/components/AboutSpeiselySection";
import { trackEvent } from "@/utils/posthog";

export const Route = createFileRoute("/magazin/community/garcon-de-cafe-berlin")({
  head: () => ({
    meta: [
      { title: "Community Story: Garçon de Café Berlin | Speisely" },
      {
        name: "description",
        content:
          "Eine Pause aus Holz, Licht und drei Espressoshots: Ein Speisely-Community-Besuch bei Garçon de Café im EDGE-Gebäude nahe Berlin Hauptbahnhof – Specialty Coffee, detaillierte Latte Art und mobiles Kaffeecatering.",
      },
      {
        name: "keywords",
        content:
          "Garçon de Café Berlin, Specialty Coffee Berlin, Hauptbahnhof Café, Europacity Coffee, Flat White Berlin, Coffee Truck Berlin, Barista Catering Berlin, Speisely Community, Speisely Magazin",
      },
      { name: "geo.region", content: "DE-BE" },
      { name: "geo.placename", content: "Berlin-Mitte" },
      { name: "geo.position", content: "52.5255;13.3670" },
      { name: "ICBM", content: "52.5255, 13.3670" },
      {
        property: "og:title",
        content: "Community Story: Garçon de Café Berlin | Speisely",
      },
      {
        property: "og:description",
        content:
          "Inside the design-led coffee shop at EDGE Workspaces near Berlin Hauptbahnhof: specialty coffee, detailed latte art, morning pastries, and mobile catering.",
      },
      {
        property: "og:image",
        content: "https://speisely.de/magazin/garcon-de-cafe-berlin/garcon-01.jpg",
      },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "de_DE" },
      {
        property: "og:url",
        content: "https://speisely.de/magazin/community/garcon-de-cafe-berlin",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://speisely.de/magazin/community/garcon-de-cafe-berlin",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              "@id": "https://speisely.de/magazin/community/garcon-de-cafe-berlin#article",
              isPartOf: {
                "@type": "WebPage",
                "@id": "https://speisely.de/magazin/community/garcon-de-cafe-berlin",
                url: "https://speisely.de/magazin/community/garcon-de-cafe-berlin",
                name: "Community Story: Garçon de Café Berlin | Speisely",
              },
              headline: "Eine Pause aus Holz, Licht und drei Espressoshots",
              description:
                "Ein Speisely-Community-Besuch bei Garçon de Café am Berliner EDGE-Gebäude nahe Hauptbahnhof: Specialty Coffee, detaillierte Latte Art, Frühstücksschalen und mobiles Catering.",
              image: "https://speisely.de/magazin/garcon-de-cafe-berlin/garcon-01.jpg",
              datePublished: "2026-09-05",
              dateModified: "2026-09-05",
              author: {
                "@type": "Organization",
                name: "Speisely Community",
                url: "https://speisely.de/community",
              },
              publisher: {
                "@type": "Organization",
                name: "Speisely",
                url: "https://speisely.de",
                logo: {
                  "@type": "ImageObject",
                  url: "https://speisely.de/speisely_logo.png",
                },
              },
              inLanguage: "de-DE",
              contentLocation: {
                "@type": "CafeOrCoffeeShop",
                name: "Garçon de Café",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Invalidenstraße 65",
                  addressLocality: "Berlin",
                  postalCode: "10557",
                  addressRegion: "Berlin",
                  addressCountry: "DE",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: "52.5255",
                  longitude: "13.3670",
                },
              },
            },
            {
              "@type": "BreadcrumbList",
              "@id": "https://speisely.de/magazin/community/garcon-de-cafe-berlin#breadcrumb",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Startseite",
                  item: "https://speisely.de",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Magazin",
                  item: "https://speisely.de/magazin",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Community",
                  item: "https://speisely.de/community",
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: "Garçon de Café Berlin",
                  item: "https://speisely.de/magazin/community/garcon-de-cafe-berlin",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: GarconDeCafeCommunityPage,
});

function GarconDeCafeCommunityPage() {
  const { lang } = useI18n();
  const isDe = lang === "de";

  const emailSubject = isDe
    ? "Mein Erlebnis für die Speisely Community"
    : "My experience for the Speisely Community";

  const emailBody = isDe
    ? `Hallo Speisely,
Ich möchte ein Erlebnis mit der Speisely Community teilen.

Restaurant, Caterer, Event oder Ort:
Stadt:
Datum:
Meine Geschichte:
Was habe ich bestellt, entdeckt oder erlebt?
Foto-/Videocredit:

Ich füge meine eigenen Fotos oder Videos dieser E-Mail bei.`
    : `Hello Speisely,
I would like to share an experience with the Speisely Community.

Restaurant, caterer, event or location:
City:
Date:
My story:
What did I order, discover or experience?
Photo/video credit:

I will attach my own photos or videos to this email.`;

  const mailtoHref = `mailto:info@speisely.de?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  const instagramHref = "https://www.instagram.com/speisely/";

  const menuUrl =
    "https://www.garcondecafe.de/wp-content/uploads/2023/09/garcon-de-cafe-menue-speisekarte-getraenkekarte.pdf";
  const websiteUrl =
    "https://www.garcondecafe.de/?utm_source=speisely&utm_medium=referral&utm_campaign=garcon_de_cafe_community_visit";

  const handleMenuClick = () => {
    trackEvent("restaurant_menu_click", {
      restaurant_name: "Garçon de Café",
      article_slug: "garcon-de-cafe-berlin",
      destination: "garcon_menu_pdf",
    });
  };

  const handleWebsiteClick = () => {
    trackEvent("restaurant_website_click", {
      restaurant_name: "Garçon de Café",
      article_slug: "garcon-de-cafe-berlin",
      destination: "official_website",
    });
  };

  return (
    <SiteShell>
      <div className="bg-[#FAF7F0] text-forest min-h-screen">
        {/* Breadcrumb */}
        <div className="border-b border-forest/10 bg-white/60 backdrop-blur-md sticky top-16 z-30">
          <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6 flex items-center justify-between">
            <nav aria-label="Breadcrumb" className="text-xs font-medium text-forest/70 truncate">
              <ol className="flex items-center gap-1.5 flex-wrap">
                <li>
                  <Link to="/" className="hover:text-forest transition">
                    {isDe ? "Startseite" : "Home"}
                  </Link>
                </li>
                <li aria-hidden="true">›</li>
                <li>
                  <Link to="/magazin" className="hover:text-forest transition">
                    {isDe ? "Magazin" : "Magazine"}
                  </Link>
                </li>
                <li aria-hidden="true">›</li>
                <li>
                  <Link to="/community" className="hover:text-forest transition">
                    Community
                  </Link>
                </li>
                <li aria-hidden="true">›</li>
                <li className="text-forest font-semibold truncate" aria-current="page">
                  Garçon de Café Berlin
                </li>
              </ol>
            </nav>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#A85C36] uppercase tracking-wider bg-[#A85C36]/10 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" />
              {isDe ? "Community Story" : "Community Story"}
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <header className="mx-auto max-w-4xl px-4 pt-8 pb-6 sm:px-6 sm:pt-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A85C36] uppercase tracking-widest bg-[#A85C36]/10 px-3 py-1 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            {isDe ? "Aus der Speisely Community" : "From the Speisely Community"}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-forest tracking-tight leading-tight mb-4">
            {isDe
              ? "Eine Pause aus Holz, Licht und drei Espressoshots: Bei Garçon de Café in Berlin"
              : "A Pause of Timber, Light and Three Espresso Shots: At Garçon de Café in Berlin"}
          </h1>

          <p className="text-base sm:text-lg text-forest/80 leading-relaxed max-w-3xl mb-6">
            {isDe
              ? "Zwischen den Hektikwellen des Hauptbahnhofs und den hohen Glaswänden der Europacity: Ein Besuch im Café von Garçon de Café am Berliner EDGE-Gebäude – Specialty Coffee, detaillierte Latte Art und das mobile Kaffeecatering dahinter."
              : "Between the bustle of Berlin Hauptbahnhof and the high glass walls of Europacity: Inside the design-led coffee shop at EDGE Workspaces – specialty coffee, detailed latte art, and the mobile catering operations behind it."}
          </p>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-forest/70 pb-6 border-b border-forest/10">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#A85C36]" />
              Invalidenstraße 65, 10557 Berlin (EDGE Workspaces)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Coffee className="w-3.5 h-3.5 text-[#A85C36]" />
              {isDe ? "Specialty Coffee & Barista Catering" : "Specialty Coffee & Barista Catering"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-forest/60" />
              {isDe ? "4 Min. Lesezeit" : "4 min read"}
            </span>
          </div>
        </header>

        {/* Hero Photo 1 */}
        <div className="mx-auto max-w-3xl px-4 sm:px-6 mb-12">
          <figure className="rounded-2xl overflow-hidden shadow-lg border border-forest/10 bg-white">
            <img
              src="/magazin/garcon-de-cafe-berlin/garcon-01.jpg"
              alt={
                isDe
                  ? "Das lichtdurchflutete Atrium von Garçon de Café im Berliner EDGE-Gebäude nahe dem Hauptbahnhof"
                  : "The light-filled atrium of Garçon de Café inside Berlin EDGE Workspaces near Hauptbahnhof"
              }
              className="w-full h-auto block"
              loading="eager"
            />
            <figcaption className="p-3.5 text-xs text-forest/70 bg-[#F4EFE6] border-t border-forest/10 flex items-center justify-between gap-2">
              <span>
                {isDe
                  ? "Das lichtdurchflutete Atrium von Garçon de Café im Berliner EDGE-Gebäude nahe dem Hauptbahnhof."
                  : "The light-filled atrium of Garçon de Café inside Berlin EDGE Workspaces near Hauptbahnhof."}
              </span>
              <span className="font-medium text-forest/60 shrink-0">
                📸 Foto: Speisely Community
              </span>
            </figcaption>
          </figure>
        </div>

        {/* Article Body */}
        <main className="mx-auto max-w-4xl px-4 sm:px-6 pb-16">
          <div className="prose prose-forest max-w-none space-y-8 text-forest/90 text-base sm:text-[17px] leading-relaxed">
            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest tracking-tight pt-2">
                {isDe
                  ? "1. Der Raum: Wo der Bahnhofslärm verstummt"
                  : "1. The Space: Where Station Bustle Fades"}
              </h2>
              <p>
                {isDe
                  ? "Nur wenige Schritte trennen die eiligen Schritte auf dem Bahnhofsvorplatz von der Ruhe des gläsernen Atriums in der Invalidenstraße 65. Wer das Erdgeschoss der EDGE Workspaces betritt, spürt sofort den Wechsel der Frequenzen: Das Tageslicht fällt ungefiltert durch deckenhohe Fensterfronten, bricht sich auf warmem Fischgrätparkett und trifft an der Decke auf geometrisch geschichtetes Holz, das den weiten Raum strukturiert und behutsam erdet."
                  : "Just a two-minute walk from the main entrance of Berlin Hauptbahnhof, Garçon de Café operates in an expansive atrium on the ground floor of EDGE Workspaces. Stepping inside from the station rush brings an immediate change in pace: daylight pours through floor-to-ceiling glass facades across warm herringbone parquet floors and geometric timber ceilings."}
              </p>
              <p>
                {isDe
                  ? "Mitten in diesem lichten Rund steht die Kaffeebar – ein geschwungener Tresen aus vertikalen Holzlamellen, gekrönt von dunklem Naturstein. Hinter einem zarten Bogen aus schwarzem Stahl ranken grüne Hängepflanzen über einer weißen Siebträgermaschine und präzisen Mühlen. Zur linken Seite steigen breite Holztribünen wie ein kleines Amphitheater empor; sonnengelbe Kissen laden dazu ein, sich für ein paar Minuten aus dem Takt der Stadt auszuklinken."
                  : "At the center sits a curved espresso bar wrapped in vertical wooden slats with a dark stone countertop. Behind a black steel arched frame with lush hanging plants, baristas craft drinks on a commercial white espresso machine. To the left, tiered wooden steps with yellow cushions invite commuters and workspace members to pause."}
              </p>
              <p className="font-medium italic text-forest/80 border-l-2 border-[#A85C36] pl-4">
                {isDe
                  ? "Zwischen dem hellen Holz, dem Glas und dem dunklen Stein ist dies ein Ort geworden, an dem man fast beiläufig zur Ruhe kommt."
                  : "Between the glass, timber and dark stone counter, it is an easy place to pause for a coffee near the station."}
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4 pt-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest tracking-tight">
                {isDe
                  ? "2. Das Handwerk: Zeichnen mit Milchschaum"
                  : "2. The Craft: Precision & Latte Art"}
              </h2>
              <p>
                {isDe
                  ? "Hinter dem Tresen herrscht die unaufgeregte Konzentration erfahrener Baristas. Das Mahlen der Bohnen, das gleichmäßige Einstreichen des Siebträgers und das Zischen der Dampflanze greifen leise ineinander. Serviert werden die Getränke in schweren, klassischen weißen Keramiktassen auf passenden Untertassen."
                  : "Behind the bar, coffee is prepared with steady care: grinding, dosing, extracting espresso, and steaming milk into glossy micro-foam, served in classic white ceramic cups on matching saucers."}
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>
                    {isDe ? "Der Flat White mit drei Shots: " : "The Three-Shot Flat White: "}
                  </strong>
                  {isDe
                    ? "Der Flat White wird hier mit drei konzentrierten Espressoshots zubereitet. Gebettet in dichten, seidigen Mikroschaum, entfaltet der Kaffee eine kräftige, aber harmonisch abgerundete Präsenz."
                    : "Built with three concentrated espresso shots and silky, micro-textured milk foam, balancing coffee strength with a smooth finish."}
                </li>
                <li>
                  <strong>{isDe ? "Sichtbare Latte Art: " : "Defined Latte Art: "}</strong>
                  {isDe
                    ? "Die Tassen zeigen feinste Gießkunst – vielgliedrige Rosetta-Blätter und ineinanderfließende Tulpenherzen, die sich mit scharfen Konturen in der nussbraunen Crema halten."
                    : "Each cup features clean pouring techniques, from multi-tiered Rosetta leaves to concentric tulip-heart patterns held firmly in the espresso crema."}
                </li>
                <li>
                  <strong>{isDe ? "Filterkaffee und Gewürze: " : "Filter & Teas: "}</strong>
                  {isDe
                    ? "Neben den Espressoklassikern stehen frisch aufgebrühter Batch Brew, gekühlter Iced Filter, aromatischer Spiced Chai mit Zimt und Kardamom sowie eine Auswahl an Tees auf der Karte."
                    : "In addition to espresso, the menu includes freshly brewed Batch Brew, Iced Filter, Spiced Chai with cinnamon and cardamom, and traditional teas."}
                </li>
              </ul>
            </section>

            {/* Photo 2: Rosetta */}
            <figure className="my-10 max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-md border border-forest/10 bg-white">
              <img
                src="/magazin/garcon-de-cafe-berlin/garcon-02.jpg"
                alt={
                  isDe
                    ? "Rosetta-Latte-Art in klassischer weißer Keramiktasse auf dunklem Naturstein"
                    : "Rosetta latte art in classic white ceramic cup on dark stone counter"
                }
                className="w-full h-auto block"
                loading="lazy"
              />
              <figcaption className="p-3.5 text-xs text-forest/70 bg-[#F4EFE6] border-t border-forest/10 flex items-center justify-between gap-2">
                <span>
                  {isDe
                    ? "Rosetta-Latte-Art in klassischer weißer Keramiktasse auf dunklem Naturstein."
                    : "Rosetta latte art in classic white ceramic cup on dark stone counter."}
                </span>
                <span className="font-medium text-forest/60 shrink-0">
                  📸 Foto: Speisely Community
                </span>
              </figcaption>
            </figure>

            {/* Section 3 */}
            <section className="space-y-4 pt-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest tracking-tight">
                {isDe ? "3. Bei den süßen Begleitern" : "3. Matcha, Pastries & Morning Options"}
              </h2>
              <p>
                {isDe
                  ? "Wer den Blick über die Auslage schweifen lässt, findet neben dem Kaffee passende Begleiter für den Vormittag und Nachmittag:"
                  : "For visitors looking beyond espresso, the counter offers tea and bakery selections:"}
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Matcha Latte: </strong>
                  {isDe
                    ? "Kräftig grüner, fein aufgeschlagener Matcha-Tee, der im Glas oder in der Tasse mit gedämpfter Milch und sanfter Schaumkunst serviert wird."
                    : "Whisked green tea poured with steamed milk and finished with delicate latte art."}
                </li>
                <li>
                  <strong>
                    {isDe ? "Iced Matcha mit Frucht: " : "Iced Matcha with Fruit Purees: "}
                  </strong>
                  {isDe
                    ? "Für warme Tage geschichtet auf Eis – wahlweise mit Mango-, Erdbeer- oder Kokospüree."
                    : "Layered over ice with Mango, Strawberry, or Coconut puree."}
                </li>
                <li>
                  <strong>{isDe ? "Klassisches Gebäck: " : "Pastries: "}</strong>
                  {isDe
                    ? "Auf schlichtem Pergamentpapier liegen gebackene Pain au Chocolat und zarte Croissants."
                    : "Pain au Chocolat and croissants are available at the counter, served on parchment paper."}
                </li>
                <li>
                  <strong>{isDe ? "Veganes Bananenbrot & Schokolade: " : "Sweets: "}</strong>
                  {isDe
                    ? "Ergänzt wird das Angebot durch saftiges, veganes Schoko-Erdnussbutter-Bananenbrot und Schoko-Karamell-Fondant."
                    : "The counter selection also features Vegan Chocolate Chip Peanut Butter Banana Bread and Fondant Chocolat Caramel."}
                </li>
              </ul>
            </section>

            {/* Photo 3: Matcha & Pain au Chocolat */}
            <figure className="my-10 max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-md border border-forest/10 bg-white">
              <img
                src="/magazin/garcon-de-cafe-berlin/garcon-03.jpg"
                alt={
                  isDe
                    ? "Matcha und Pain au Chocolat auf dem dunklen Holztisch"
                    : "Matcha latte and pain au chocolat on dark wooden table"
                }
                className="w-full h-auto block"
                loading="lazy"
              />
              <figcaption className="p-3.5 text-xs text-forest/70 bg-[#F4EFE6] border-t border-forest/10 flex items-center justify-between gap-2">
                <span>
                  {isDe
                    ? "Matcha und Pain au Chocolat auf dem dunklen Holztisch."
                    : "Matcha and pain au chocolat on dark wooden table."}
                </span>
                <span className="font-medium text-forest/60 shrink-0">
                  📸 Foto: Speisely Community
                </span>
              </figcaption>
            </figure>

            <p>
              {isDe
                ? "Beim Besuch unserer Community stand zudem eine frische Obst- und Granolaschale auf dem Tisch – mit aufgefächerten Apfelscheiben, Banane, Beeren und gehobelten Kokosflocken über geröstetem Getreide."
                : "The visit also included a fresh fruit-and-granola bowl photographed at the table with sliced apples, bananas, berries, and coconut flakes."}
            </p>

            {/* Photo 4: Cappuccino & Granola Bowl */}
            <figure className="my-10 max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-md border border-forest/10 bg-white">
              <img
                src="/magazin/garcon-de-cafe-berlin/garcon-04.jpg"
                alt={
                  isDe
                    ? "Cappuccino mit Latte Art und eine Frucht-Granola-Schale beim Community-Besuch"
                    : "Cappuccino with latte art and fruit granola bowl during community visit"
                }
                className="w-full h-auto block"
                loading="lazy"
              />
              <figcaption className="p-3.5 text-xs text-forest/70 bg-[#F4EFE6] border-t border-forest/10 flex items-center justify-between gap-2">
                <span>
                  {isDe
                    ? "Cappuccino mit Latte Art und eine Frucht-Granola-Schale beim Community-Besuch."
                    : "Cappuccino with latte art and a fruit-granola bowl during the community visit."}
                </span>
                <span className="font-medium text-forest/60 shrink-0">
                  📸 Foto: Speisely Community
                </span>
              </figcaption>
            </figure>

            {/* Section 4 */}
            <section className="space-y-4 pt-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest tracking-tight">
                {isDe
                  ? "4. Kaffeebohnen für daheim und die Kaffeetrucks für draußen"
                  : "4. Taking Coffee Home & Mobile Event Catering"}
              </h2>
              <p>
                {isDe
                  ? "Wer den Geschmack mitnehmen möchte, greift an der Kasse zu den 250g-Signature-Kaffeebeuteln, die als ganze Bohne oder auf Wunsch frisch gemahlen über den Tresen gehen."
                  : "Before leaving, guests can pick up 250g Signature Coffee Bags, available as whole beans or ground for home brewing."}
              </p>
              <p>
                {isDe
                  ? "Was im Café an der Invalidenstraße seinen festen Ankerplatz hat, bringt das Team gleichzeitig auf die Straßen Berlins und des Umlands: Für Firmenfeiern, Kongresse und Sommerfeste betreibt Garçon de Café ein mobiles Catering mit zwei nostalgischen Citroën-Kaffeetrucks – einem braunen und einem silbernen Oldtimer – sowie modularen Kaffeebars für Innenräume."
                  : "Beyond the stationary coffee shop at Invalidenstraße, Garçon de Café operates a dedicated mobile coffee catering service for events in Berlin and the surrounding area with two vintage Citroën coffee trucks (one brown and one silver) and modular indoor espresso bars."}
              </p>
            </section>

            {/* Photo 5: Closing Flat-Lay */}
            <figure className="my-10 max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-md border border-forest/10 bg-white">
              <img
                src="/magazin/garcon-de-cafe-berlin/garcon-05.jpg"
                alt={
                  isDe
                    ? "Kaffee und Frucht-Granola auf dunklem Holztisch"
                    : "Coffee and fruit granola on dark wooden table"
                }
                className="w-full h-auto block"
                loading="lazy"
              />
              <figcaption className="p-3.5 text-xs text-forest/70 bg-[#F4EFE6] border-t border-forest/10 flex items-center justify-between gap-2">
                <span>
                  {isDe
                    ? "Kaffee und Frucht-Granola auf dunklem Holztisch."
                    : "Coffee and fruit granola on dark wooden table."}
                </span>
                <span className="font-medium text-forest/60 shrink-0">
                  📸 Foto: Speisely Community
                </span>
              </figcaption>
            </figure>
          </div>

          {/* SPOT-PASS INFO CARD */}
          <div className="mt-12 rounded-2xl border-2 border-forest/20 bg-white p-6 sm:p-8 shadow-md">
            <div className="flex items-center gap-2 text-xs font-bold text-[#A85C36] uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              {isDe ? "Speisely Spot-Pass" : "Speisely Spot-Pass"}
            </div>
            <h3 className="font-serif text-2xl font-bold text-forest mb-4">
              Garçon de Café Berlin
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-forest/80 mb-6">
              <div>
                <span className="font-semibold text-forest block">
                  {isDe ? "Adresse:" : "Address:"}
                </span>
                <span>Invalidenstraße 65, 10557 Berlin (EDGE Workspaces)</span>
                <span className="block text-xs text-forest/60 mt-0.5">
                  {isDe ? "~160 m vom Berliner Hauptbahnhof" : "~160 m from Berlin Hauptbahnhof"}
                </span>
              </div>
              <div>
                <span className="font-semibold text-forest block">
                  {isDe ? "Öffnungszeiten:" : "Opening Hours:"}
                </span>
                <span>
                  {isDe
                    ? "Aktuelle Zeiten vor dem Besuch über Google Maps prüfen"
                    : "Check current hours on Google Maps before visiting"}
                </span>
              </div>
              <div>
                <span className="font-semibold text-forest block">
                  {isDe ? "Kaffee & Getränke:" : "Coffee & Drinks:"}
                </span>
                <span>Flat White mit drei Shots, Cappuccino, Batch Brew, Matcha, Iced Matcha</span>
              </div>
              <div>
                <span className="font-semibold text-forest block">
                  {isDe ? "Gebäck & Sweets:" : "Pastries & Sweets:"}
                </span>
                <span>Pain au Chocolat, Croissants, Veganes Bananenbrot, Schoko-Fondant</span>
              </div>
              <div>
                <span className="font-semibold text-forest block">
                  {isDe ? "Mobiles Catering:" : "Mobile Catering:"}
                </span>
                <span>
                  {isDe
                    ? "2 Citroën Oldtimer-Trucks (Braun & Silber), Modulare Indoor-Bars"
                    : "2 Vintage Citroën Trucks (Brown & Silver), Modular Indoor Bars"}
                </span>
              </div>
              <div>
                <span className="font-semibold text-forest block">
                  {isDe ? "Für Zuhause:" : "Takeaway:"}
                </span>
                <span>250g Signature-Röstung (Bohne / Gemahlen)</span>
              </div>
            </div>

            {/* DUAL ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-forest/10">
              <a
                href={menuUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleMenuClick}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0D3B2E] text-white text-sm font-bold shadow hover:bg-[#0D3B2E]/90 transition"
              >
                <BookOpen className="w-4 h-4" />
                {isDe ? "Speisekarte (PDF) ansehen" : "Explore Menu (PDF)"}
              </a>
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWebsiteClick}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-forest/30 bg-[#FAF7F0] text-forest text-sm font-bold hover:bg-white transition"
              >
                <ExternalLink className="w-4 h-4" />
                {isDe ? "Offizielle Website besuchen" : "Visit Official Website"}
              </a>
            </div>
          </div>

          {/* EDITORIAL DISCLOSURE & CREDITS */}
          <div className="mt-8 rounded-xl bg-[#F4EFE6] p-4 text-xs text-forest/70 space-y-2 border border-forest/10">
            <div className="flex items-center gap-2 font-bold text-forest">
              <Shield className="w-4 h-4 text-[#A85C36]" />
              {isDe ? "Speisely Transparenz & Offenlegung" : "Speisely Editorial Disclosure"}
            </div>
            <p>
              {isDe
                ? "Format: Speisely Community Story • Text: Speisely Redaktion • Fotos: Speisely Community • Besuchsdatum: September 2026."
                : "Format: Speisely Community Story • Text: Speisely Editorial Team • Photos: Speisely Community • Visit Date: September 2026."}
            </p>
            <p>
              {isDe
                ? "Offenlegung: Unabhängig besucht und selbst bezahlt. Es gab keine Einladung, kein Sponsoring und keine Vergütung. Sortiment und Flottendetails wurden vor Veröffentlichung über die offiziellen Kanäle des Cafés und Wolt Berlin abgeglichen."
                : "Disclosure: Independently visited and self-paid. No invitation, sponsorship, or compensation was received. Offerings and catering details were cross-checked via official café channels and Wolt Berlin."}
            </p>
          </div>

          {/* SUBMIT COMMUNITY STORY CTA */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-[#0D3B2E] to-[#164e3f] p-6 sm:p-8 text-white shadow-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#DFBA73] uppercase tracking-wider mb-2">
              <Users className="w-4 h-4" />
              {isDe ? "Deine Gastro-Entdeckung" : "Your Food Discovery"}
            </div>
            <h3 className="font-serif text-2xl font-bold mb-3">
              {isDe
                ? "Hast du ein Café, Restaurant oder Catering entdeckt?"
                : "Have you discovered a café, restaurant, or caterer?"}
            </h3>
            <p className="text-sm text-white/80 max-w-2xl leading-relaxed mb-6">
              {isDe
                ? "Teile deine Fotos, Empfehlungen und Geschichten mit der Speisely Community. Wir veröffentlichen ehrliche, ungekürzte Berichte über gute Gastronomie."
                : "Share your photos, recommendations, and stories with the Speisely Community. We publish genuine, honest spotlights on great food and hospitality."}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#DFBA73] text-[#0D3B2E] font-bold text-xs sm:text-sm hover:bg-[#ebd097] transition shadow"
              >
                <Mail className="w-4 h-4" />
                {isDe ? "Story per E-Mail einreichen" : "Submit Story via Email"}
              </a>
              <a
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs sm:text-sm hover:bg-white/20 transition border border-white/20"
              >
                <Instagram className="w-4 h-4" />
                @speisely
              </a>
            </div>
          </div>
        </main>

        <AboutSpeiselySection />
      </div>
    </SiteShell>
  );
}
