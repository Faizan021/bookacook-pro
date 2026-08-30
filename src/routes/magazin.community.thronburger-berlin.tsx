/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Shield, Users, Utensils, Mail, Instagram, Sparkles, ExternalLink, BookOpen } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { SiteShell } from "@/components/SiteShell";
import { AboutSpeiselySection } from "@/components/AboutSpeiselySection";
import { trackEvent } from "@/utils/posthog";

export const Route = createFileRoute("/magazin/community/thronburger-berlin")({
  head: () => ({
    meta: [
      { title: "Community Story: Thronburger Berlin | Speisely" },
      {
        name: "description",
        content:
          "Ein Burger, viele Berliner Straßen: Halal Beef Burger im dunklen Sesam-Brioche, Süßkartoffel-Pommes und ein Speisekarten-Konzept mit Berliner Straßen-Namen bei Thronburger in Berlin-Friedrichshain.",
      },
      {
        name: "keywords",
        content:
          "Thronburger Berlin, Halal Burger Berlin, Friedrichshain Burger, Ostkreuz Burger, Süßkartoffel Pommes Berlin, Sesame Brioche Burger, Speisely Community, Speisely Magazin",
      },
      { name: "geo.region", content: "DE-BE" },
      { name: "geo.placename", content: "Berlin-Friedrichshain" },
      { name: "geo.position", content: "52.5058;13.4702" },
      { name: "ICBM", content: "52.5058, 13.4702" },
      {
        property: "og:title",
        content: "Community Story: Thronburger Berlin | Speisely",
      },
      {
        property: "og:description",
        content:
          "Ein Burger, viele Berliner Straßen: Halal Beef Burger, dunkles Sesam-Brioche und Süßkartoffel-Pommes. Ein Community-Besuch bei Thronburger Berlin.",
      },
      {
        property: "og:image",
        content: "https://speisely.de/magazin/thronburger-berlin/thronburger-01.jpg",
      },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "de_DE" },
      {
        property: "og:url",
        content: "https://speisely.de/magazin/community/thronburger-berlin",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://speisely.de/magazin/community/thronburger-berlin",
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
              "@id": "https://speisely.de/magazin/community/thronburger-berlin#article",
              isPartOf: {
                "@type": "WebPage",
                "@id": "https://speisely.de/magazin/community/thronburger-berlin",
                url: "https://speisely.de/magazin/community/thronburger-berlin",
                name: "Community Story: Thronburger Berlin | Speisely",
              },
              headline: "Ein Burger, viele Berliner Straßen",
              description:
                "Ein Speisely-Community-Besuch bei Thronburger Berlin: Halal Beef Burger im dunklen Sesam-Brioche, Süßkartoffel-Pommes und ein Speisekarten-Konzept mit Berliner Straßen-Namen.",
              image: "https://speisely.de/magazin/thronburger-berlin/thronburger-01.jpg",
              datePublished: "2026-08-30",
              dateModified: "2026-08-30",
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
                "@type": "Restaurant",
                name: "Thronburger Berlin",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Neue Bahnhofstraße 7A",
                  addressLocality: "Berlin",
                  postalCode: "10245",
                  addressRegion: "Berlin",
                  addressCountry: "DE",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 52.5058,
                  longitude: 13.4702,
                },
                url: "https://www.thronburger.de",
                servesCuisine: ["Burgers", "Halal", "Vegetarian"],
              },
            },
            {
              "@type": "BreadcrumbList",
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
                  name: "Thronburger Berlin",
                  item: "https://speisely.de/magazin/community/thronburger-berlin",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: ThronburgerCommunityPage,
});

function ThronburgerCommunityPage() {
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

  const menuUrl = "https://www.thronburger.de/?utm_source=speisely&utm_medium=referral&utm_campaign=thronburger_community_visit#burger";
  const websiteUrl = "https://www.thronburger.de/?utm_source=speisely&utm_medium=referral&utm_campaign=thronburger_community_visit";

  const handleMenuClick = () => {
    trackEvent("restaurant_menu_click", {
      restaurant_name: "Thronburger Berlin",
      article_slug: "thronburger-berlin",
      destination: "thronburger_menu",
    });
  };

  const handleWebsiteClick = () => {
    trackEvent("restaurant_website_click", {
      restaurant_name: "Thronburger Berlin",
      article_slug: "thronburger-berlin",
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
                <li aria-current="page" className="text-forest font-bold truncate">
                  Thronburger Berlin
                </li>
              </ol>
            </nav>
            <Link
              to="/community"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-forest hover:text-[#7FA46B] transition"
            >
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isDe ? "Alle Community Stories" : "All Community Stories"}</span>
            </Link>
          </div>
        </div>

        {/* Hero Header */}
        <header className="mx-auto max-w-4xl px-4 pt-10 pb-8 sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#DDEEE3] text-forest px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider mb-5 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-[#b28a3c]" aria-hidden="true" />
            <span>{isDe ? "Aus der Speisely Community" : "From the Speisely Community"}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-[44px] font-bold text-forest leading-[1.15] tracking-tight">
            {isDe
              ? "Ein Burger, viele Berliner Straßen"
              : "One Burger, Many Berlin Streets"}
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-forest/80 leading-relaxed font-medium">
            {isDe
              ? "Ein dunkles Sesam-Brioche, geschmolzener Käse, frische Zutaten und eine Schale Süßkartoffel-Pommes: Ein Food-Moment bei Thronburger in Berlin."
              : "A dark sesame brioche, multiple beef patties, melted cheese, fresh ingredients and a full bowl of sweet potato fries: this burger commands attention on a wooden tray."}
          </p>

          {/* Info Card */}
          <div className="mt-8 surface-card p-5 sm:p-6 rounded-3xl border border-forest/10 bg-white grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-[#b28a3c] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Ort" : "Location"}
                </span>
                <strong className="font-semibold text-forest">Thronburger Berlin</strong>
                <span className="block text-forest/70 text-xs">
                  Neue Bahnhofstraße 7A, 10245 Berlin-Friedrichshain
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-4 w-4 text-[#7FA46B] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Beitragstyp" : "Story Type"}
                </span>
                <strong className="font-semibold text-forest">
                  {isDe ? "Community Story" : "Community Story"}
                </strong>
                <span className="block text-forest/70 text-xs">
                  {isDe ? "Aus der Speisely Community" : "From the Speisely Community"}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-4 w-4 text-[#b28a3c] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Fotocredit" : "Photo Credit"}
                </span>
                <strong className="font-semibold text-forest">Speisely Community</strong>
                <span className="block text-forest/70 text-xs">
                  {isDe ? "Redaktionell aufbereitet" : "Editorially prepared"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Article Body */}
        <article className="mx-auto max-w-4xl px-4 sm:px-6 pb-20">
          <div className="prose prose-lg max-w-none text-forest/85 space-y-8 leading-relaxed font-normal">
            {/* Photo 1 (Hero: eye-level burger & fries) */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md">
                <img
                  src="/magazin/thronburger-berlin/thronburger-01.jpg"
                  alt={
                    isDe
                      ? "Halal Beef Burger im Sesam-Brioche mit geschmolzenem Käse und Süßkartoffel-Pommes bei Thronburger Berlin"
                      : "Halal beef burger with a sesame brioche, melted cheese and sweet potato fries at Thronburger Berlin"
                  }
                  className="w-full h-auto block"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Halal Beef Burger mit Sesam-Brioche, geschmolzenem Käse und Süßkartoffel-Pommes bei Thronburger Berlin."
                    : "Halal beef burger with a sesame brioche, melted cheese and sweet potato fries at Thronburger Berlin."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <p>
              {isDe
                ? "Ein dunkles Sesam-Brioche, mehrere Beef-Patties, geschmolzener Käse, frische Zutaten und eine gefüllte Holzschale mit Süßkartoffel-Pommes: Die geteilten Fotos rücken das Essen direkt in den Mittelpunkt. Der Burger ist hoch auf einem Holztablett geschichtet, während die orangefarbenen Süßkartoffel-Pommes einen lebendigen Kontrast zum dunklen Bun und zum geschmolzenen Käse bilden."
                : "A dark sesame brioche, multiple beef patties, melted cheese, fresh ingredients and a full bowl of sweet potato fries: this burger does not need an elaborate setting to command attention. The photographs shared with the Speisely Community place the food firmly at the centre. The burger is built high on a wooden tray, while the orange sweet potato fries create a vivid contrast with the dark bun and golden cheese."}
            </p>

            <p>
              {isDe
                ? "Ein Mitglied der Speisely Community hat diesen Moment geteilt und den Besuch als sehr positive Erfahrung beschrieben. Für uns war es ein Berliner Burger-Moment, der es wert ist, weitergegeben zu werden."
                : "The Community member described the Thronburger visit as a very good experience. For us, it was a Berlin burger moment worth sharing."}
            </p>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe ? "Eine Speisekarte mit Berliner Identität" : "A menu with a Berlin identity"}
            </h2>

            <p>
              {isDe
                ? "Was bei Thronburger besonders auffällt, ist die enge Verbindung zwischen Speisekarte und Stadt: Nahezu jeder Burger ist nach einer Berliner Straße oder einem Kiez benannt."
                : "What particularly stands out about Thronburger is the connection between its menu and the city: every burger is named after a Berlin street."}
            </p>

            <p>
              {isDe ? (
                <>
                  Zu den Klassikern auf der Karte zählen unter anderem der <em>Friedrichshainer</em> und der <em>Hirschburger</em> mit Rindfleisch, der knusprige Hähnchen-Burger <em>Lenbacher</em> sowie die vegetarische Variante <em>Wiesenburger</em>. Der klassische Cheeseburger trägt den Namen <em>Kreutziger</em> – kombiniert aus Sesam-Brioche, Salat, Tomate, Zwiebeln, Halal-Rindfleisch und Cheddar. Namen wie <em>Petersburger</em>, <em>Revaler</em>, <em>Krossener</em> und <em>Boxhagener</em> setzen diese Idee quer durch das Sortiment fort. Das Ergebnis ist eine Speisekarte, die sich wie ein kleiner Stadtplan von Berlin liest.{" "}
                  <a
                    href="https://www.thronburger.de/"
                    target="_blank"
                    rel="noopener"
                    className="text-[#b28a3c] font-semibold underline hover:text-forest transition"
                  >
                    [Thronburger Website]
                  </a>
                </>
              ) : (
                <>
                  The restaurant’s featured classics include the beef-based <em>Friedrichshainer</em> and <em>Hirschburger</em>, the crispy chicken <em>Lenbacher</em>, and the vegetarian <em>Wiesenburger</em>. Its classic cheeseburger is called the <em>Kreutziger</em>, combining a sesame brioche, lettuce, tomato, onion, halal beef and cheddar. Names such as <em>Petersburger</em>, <em>Revaler</em>, <em>Krossener</em> and <em>Boxhagener</em> continue the idea across the wider selection. The result is a burger menu that reads like a map of Berlin.{" "}
                  <a
                    href="https://www.thronburger.de/"
                    target="_blank"
                    rel="noopener"
                    className="text-[#b28a3c] font-semibold underline hover:text-forest transition"
                  >
                    [Thronburger Website]
                  </a>
                </>
              )}
            </p>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe ? "Ein Burger, der ins Auge fällt" : "A burger built to be noticed"}
            </h2>

            <p>
              {isDe
                ? "Das erste Detail, das auf den Fotos ins Auge sticht, ist das dunkle Brioche-Brötchen, das dicht mit schwarzem und hellem Sesam bestreut ist. Darunter bleiben die Patties, der geschmolzene Cheddar, frischer Salat und Tomaten klar erkennbar. Jede Schicht bringt ihre eigene Farbe und Struktur ein und verleiht dem Burger eine markante, kräftige Optik."
                : "The first detail to catch the eye in the Community photographs is the dark brioche, densely covered with black and golden sesame seeds. Beneath it, the patties, melted cheese, lettuce and tomato remain clearly visible. Each layer contributes its own colour and shape, giving the burger a distinctive, substantial appearance."}
            </p>

            {/* Photo 2 (Top-down detail) */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md">
                <img
                  src="/magazin/thronburger-berlin/thronburger-02.jpg"
                  alt={
                    isDe
                      ? "Draufsicht auf den Burger im Sesam-Brioche und die Schale Süßkartoffel-Pommes bei Thronburger Berlin"
                      : "Overhead view of burger in sesame brioche and sweet potato fries at Thronburger Berlin"
                  }
                  className="w-full h-auto block"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Draufsicht: Dicht bestreutes Sesam-Brioche und eine großzügige Schale Süßkartoffel-Pommes."
                    : "Overhead view: densely seeded sesame brioche and a generous bowl of sweet potato fries."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <p>
              {isDe
                ? "Die Süßkartoffel-Pommes werden in einer separaten Holzschale serviert. Ihr warmer Orangeton und die leicht gebräunten Ränder machen sie zu einem prägenden Teil der gesamten Präsentation auf dem Tisch."
                : "The sweet potato fries arrive in a separate wooden bowl. Their warm orange colour and browned edges make them more than a small addition at the side—they become an important part of the presentation."}
            </p>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe ? "Halal-Auswahl über den klassischen Beef Burger hinaus" : "Halal choices beyond the classic beef burger"}
            </h2>

            <p>
              {isDe ? (
                <>
                  Thronburger beschreibt sein gesamtes Speisenangebot als 100% halal. Neben Rindfleisch-Burgern umfasst die Karte auch Hähnchen-Varianten sowie vegetarische und vegane Optionen. Bei den Beilagen stehen unter anderem Curly Fries, Süßkartoffel-Pommes, Potato Wedges und Chicken Nuggets zur Auswahl, ergänzt durch Hot Dogs und Salate.{" "}
                  <a
                    href="https://www.thronburger.de/"
                    target="_blank"
                    rel="noopener"
                    className="text-[#b28a3c] font-semibold underline hover:text-forest transition"
                  >
                    [Thronburger]
                  </a>
                </>
              ) : (
                <>
                  Thronburger describes its complete food selection as 100% halal. Alongside its beef burgers, the menu includes chicken, vegetarian and vegan options. The choice continues through the sides, including Curly Fries, Sweet Potato Fries, potato wedges and chicken nuggets, alongside hot dogs and salads.{" "}
                  <a
                    href="https://www.thronburger.de/"
                    target="_blank"
                    rel="noopener"
                    className="text-[#b28a3c] font-semibold underline hover:text-forest transition"
                  >
                    [Thronburger]
                  </a>
                </>
              )}
            </p>

            {/* Photo 3 (Second eye-level context) */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md">
                <img
                  src="/magazin/thronburger-berlin/thronburger-03.jpg"
                  alt={
                    isDe
                      ? "Burger und Süßkartoffel-Pommes auf Holztabletts serviert bei Thronburger Berlin"
                      : "A Thronburger burger and sweet potato fries served on wooden trays"
                  }
                  className="w-full h-auto block"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Burger und Süßkartoffel-Pommes auf Holztabletts serviert bei Thronburger Berlin."
                    : "A Thronburger burger and sweet potato fries served on wooden trays."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe ? "Zwei Standorte im Berliner Osten" : "Two locations in eastern Berlin"}
            </h2>

            <p>
              {isDe ? (
                <>
                  Das 2013 gegründete Konzept listet aktuell zwei Berliner Standorte: Das Restaurant in Friedrichshain befindet sich in der Neuen Bahnhofstraße 7A in direkter Nähe zum Bahnhof Ostkreuz. Ein zweiter Standort liegt in der Wilhelminenhofstraße 65 in Oberschöneweide. Die beiden Standorte verbinden unterschiedliche Kieze im Berliner Osten – während die Burgernamen das Konzept weiter durch die Stadt tragen.{" "}
                  <a
                    href="https://www.thronburger.de/"
                    target="_blank"
                    rel="noopener"
                    className="text-[#b28a3c] font-semibold underline hover:text-forest transition"
                  >
                    [Thronburger]
                  </a>
                </>
              ) : (
                <>
                  Established in 2013, Thronburger currently lists two Berlin restaurants. The Friedrichshain location is on Neue Bahnhofstraße 7A, close to Ostkreuz. The second is situated on Wilhelminenhofstraße 65 in Oberschöneweide. The two locations connect different neighbourhoods in eastern Berlin—while the burger names carry the concept further across the city.{" "}
                  <a
                    href="https://www.thronburger.de/"
                    target="_blank"
                    rel="noopener"
                    className="text-[#b28a3c] font-semibold underline hover:text-forest transition"
                  >
                    [Thronburger]
                  </a>
                </>
              )}
            </p>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe ? "Ein Community-Moment zum Teilen" : "A Community moment worth sharing"}
            </h2>

            <p>
              {isDe
                ? "Dieses Erlebnis zeigt, worum es bei den Speisely Community Stories geht: Jemand entdeckt einen Ort, hat eine positive Erfahrung und teilt diesen Food-Moment mit anderen. Uns gefällt besonders, wie Thronburger eine klare Berliner Identität mit einem vollständig halal gestalteten Burger-Angebot verbindet."
                : "This experience captures what Speisely Community Stories are meant to celebrate: someone discovers a place, has a positive experience and chooses to share that food moment with others. We particularly appreciate the way Thronburger combines a clear Berlin identity with an entirely halal burger selection."}
            </p>

            <p className="font-medium text-forest text-lg">
              {isDe
                ? "Eine selbstbewusste Burger-Präsentation, ein kreativer Bezug zur Stadt und eine Community-Erfahrung, die man gerne weitergibt."
                : "A confident burger presentation, a creative connection to the city and a Community experience worth passing on."}
            </p>

            {/* Restaurant Info & Action Card */}
            <div className="surface-card p-6 sm:p-8 rounded-3xl border border-forest/15 bg-white my-10 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#b28a3c] mb-2">
                <Utensils className="h-4 w-4" aria-hidden="true" />
                <span>{isDe ? "Restaurant-Informationen" : "Restaurant Details"}</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-forest mb-2">
                Thronburger Berlin
              </h3>
              <div className="space-y-1 text-sm text-forest/75 mb-4">
                <p><strong>Friedrichshain:</strong> Neue Bahnhofstraße 7A, 10245 Berlin (Nähe Ostkreuz)</p>
                <p><strong>Oberschöneweide:</strong> Wilhelminenhofstraße 65, 12459 Berlin</p>
              </div>
              
              <div className="flex flex-wrap gap-2 text-xs text-forest/70 mb-6">
                <span className="bg-forest/5 px-3 py-1 rounded-full border border-forest/10 font-medium">
                  {isDe ? "Halal Burger" : "Halal Burgers"}
                </span>
                <span className="bg-forest/5 px-3 py-1 rounded-full border border-forest/10 font-medium">
                  {isDe ? "Beef & Chicken" : "Beef & Chicken"}
                </span>
                <span className="bg-forest/5 px-3 py-1 rounded-full border border-forest/10 font-medium">
                  {isDe ? "Vegetarisch & Vegan" : "Vegetarian & Vegan"}
                </span>
                <span className="bg-forest/5 px-3 py-1 rounded-full border border-forest/10 font-medium">
                  {isDe ? "Süßkartoffel-Pommes" : "Sweet Potato Fries"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={menuUrl}
                  target="_blank"
                  rel="noopener"
                  onClick={handleMenuClick}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-forest text-[oklch(0.97_0.02_92)] px-6 py-3 text-xs sm:text-sm font-bold shadow-md hover:bg-forest/90 transition-all hover:gap-2.5 cursor-pointer"
                >
                  <BookOpen className="h-4 w-4 text-[#f2d896]" aria-hidden="true" />
                  <span>{isDe ? "Speisekarte ansehen" : "Explore the menu"}</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
                </a>

                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener"
                  onClick={handleWebsiteClick}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-cream text-forest px-6 py-3 text-xs sm:text-sm font-semibold border border-forest/15 hover:bg-[#eadfce] transition-colors cursor-pointer"
                >
                  <span>{isDe ? "Website besuchen" : "Visit Thronburger"}</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Editorial Disclosure Box */}
            <div className="rounded-2xl bg-cream p-5 text-xs text-forest/75 border border-forest/15 space-y-2 mt-8">
              <div className="flex items-center gap-2 font-bold text-forest text-xs">
                <Shield className="h-4 w-4 text-[#7FA46B]" aria-hidden="true" />
                <span>{isDe ? "Transparenzhinweis" : "Transparency Notice"}</span>
              </div>
              <p className="leading-relaxed">
                {isDe
                  ? "Diese Geschichte basiert auf Fotos und einer positiven Erfahrung, die von einem Mitglied der Speisely Community geteilt wurden. Speisely war nicht selbst vor Ort. Der Beitrag gibt die persönlichen Eindrücke dieses Community-Besuchs wieder und ist keine Sternebewertung oder offizielle Restaurantbewertung."
                  : "This story is based on photographs and a positive experience shared by a Speisely Community member. Speisely was not present. The article reflects the contributor’s personal experience and is not a star rating or an official restaurant review."}
              </p>
              <p className="text-xs text-forest/60 pt-1 border-t border-forest/10">
                {isDe
                  ? "Informationen zu Speisekarte, Standorten und dem Halal-Konzept stammen von der offiziellen Website von Thronburger. Die Fotos wurden vom Community-Mitglied aufgenommen und für die Veröffentlichung redaktionell optimiert. Fotocredit: Speisely Community."
                  : "Information about the menu, locations and halal concept comes from Thronburger’s official website. The photographs were captured by the Community member and editorially cropped and adjusted for lighting, colour and sharpness. Photo credit: Speisely Community."}
              </p>
            </div>
          </div>
          
          <AboutSpeiselySection />
        </article>

        {/* CTA Banner: Share Your Own Food Story */}
        <section className="border-t border-forest/10 pt-16 pb-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="rounded-3xl bg-forest text-[oklch(0.97_0.02_92)] p-8 sm:p-10 text-center relative overflow-hidden shadow-xl">
              <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-[#f2d896] backdrop-blur-xs">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{isDe ? "Speisely Community" : "Speisely Community"}</span>
                </div>
                <h2 className="font-display text-2xl sm:text-4xl font-bold">
                  {isDe
                    ? "Hast du auch einen besonderen Food-Moment erlebt?"
                    : "Had a memorable food experience of your own?"}
                </h2>
                <p className="text-sm sm:text-base opacity-85 leading-relaxed">
                  {isDe
                    ? "Teile deine Restaurantbesuche, Catering-Erlebnisse oder Food-Entdeckungen mit der Speisely Community. Schick uns deine Geschichte und Fotos."
                    : "Share your restaurant visits, catering experiences or food discoveries with the Speisely Community. Send us your story and photos."}
                </p>
                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={mailtoHref}
                    className="inline-flex items-center gap-2 rounded-full bg-[#b28a3c] text-white px-6 py-3 text-xs sm:text-sm font-bold shadow-md hover:bg-[#9a7633] transition"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    <span>{isDe ? "Per E-Mail teilen" : "Share via Email"}</span>
                  </a>
                  <a
                    href={instagramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white/15 text-white px-6 py-3 text-xs sm:text-sm font-semibold hover:bg-white/25 transition backdrop-blur-xs"
                  >
                    <Instagram className="h-4 w-4" aria-hidden="true" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
