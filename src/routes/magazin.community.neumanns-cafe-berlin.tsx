import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  Clock,
  Utensils,
  Sparkles,
  Users,
  Camera,
  Info,
  Coffee,
  Wine,
  Award,
  ArrowRight,
  Compass,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { SiteShell } from "@/components/SiteShell";
import { AboutSpeiselySection } from "@/components/AboutSpeiselySection";

export const Route = createFileRoute("/magazin/community/neumanns-cafe-berlin")({
  head: () => ({
    meta: [
      { title: "Neumanns Café Berlin-Friedrichshain — Speisely" },
      {
        name: "description",
        content:
          "Frühstück im Neumanns Café Berlin (Gabriel-Max-Str. 18, Friedrichshain): Eigene Sauerteig-Bäckerei, pochierte Eier, Tortilla & Andraschko Kaffee.",
      },
      {
        name: "keywords",
        content:
          "Neumanns Café Berlin, Frühstück Friedrichshain, Brunch Boxhagener Platz, Sauerteigbrot Berlin, Gabriel-Max-Straße 18, Andraschko Kaffee Berlin, Neumanns Bäckerei, Speisely Community Story",
      },
      { name: "geo.region", content: "DE-BE" },
      { name: "geo.placename", content: "Berlin-Friedrichshain" },
      { name: "geo.position", content: "52.5112;13.4589" },
      { name: "ICBM", content: "52.5112, 13.4589" },
      {
        property: "og:title",
        content:
          "„…am Ende ist es nur Brot“: Warum das Frühstück im Neumanns Café ganz Friedrichshain verzaubert | Speisely",
      },
      {
        property: "og:description",
        content:
          "Zwischen eigener Sauerteig-Bäckerei, pochierten Eiern auf Blattspinat, Süßkartoffel-Pekannuss-Stulle, spanischer Tortilla und Andraschko-Cappuccino am Boxhagener Platz.",
      },
      {
        property: "og:image",
        content:
          "https://speisely.de/magazin/neumanns-cafe-berlin/05_poached_eggs_spinach_hd.jpg?v=2",
      },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "de_DE" },
      {
        property: "og:url",
        content: "https://speisely.de/magazin/community/neumanns-cafe-berlin",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://speisely.de/magazin/community/neumanns-cafe-berlin",
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
              "@id": "https://speisely.de/magazin/community/neumanns-cafe-berlin#article",
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": "https://speisely.de/magazin/community/neumanns-cafe-berlin",
              },
              headline:
                "„…am Ende ist es nur Brot“: Warum das Frühstück im Neumanns Café ganz Friedrichshain verzaubert",
              description:
                "Ein Speisely Community-Bericht aus dem Neumanns Café in der Gabriel-Max-Straße 18 am Boxhagener Platz: Hausgebackenes Sauerteigbrot, pochierte Eier auf Spinat, Süßkartoffel-Pekannuss-Stulle mit Ziegenkäse, spanische Tortilla und Andraschko Kaffeemanufaktur.",
              image: [
                {
                  "@type": "ImageObject",
                  url: "https://speisely.de/magazin/neumanns-cafe-berlin/05_poached_eggs_spinach_hd.jpg?v=2",
                  width: 1200,
                  height: 900,
                },
                {
                  "@type": "ImageObject",
                  url: "https://speisely.de/magazin/neumanns-cafe-berlin/01_tortilla_croissant_hd.jpg?v=2",
                  width: 1200,
                  height: 900,
                },
                {
                  "@type": "ImageObject",
                  url: "https://speisely.de/magazin/neumanns-cafe-berlin/02_chevre_pecan_tartine_hd.jpg?v=2",
                  width: 1200,
                  height: 900,
                },
              ],
              datePublished: "2026-10-12",
              dateModified: "2026-10-12",
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
              about: {
                "@type": "CafeOrCoffeeShop",
                name: "Neumanns Café",
                servesCuisine: [
                  "Breakfast & Brunch",
                  "Sourdough Bakery",
                  "Specialty Coffee",
                  "Wine Bar",
                ],
                priceRange: "€€",
                telephone: "+49 30 81724983",
                url: "https://www.neumanns.berlin",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Gabriel-Max-Straße 18",
                  addressLocality: "Berlin",
                  postalCode: "10245",
                  addressRegion: "Berlin",
                  addressCountry: "DE",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 52.5112,
                  longitude: 13.4589,
                },
                openingHoursSpecification: [
                  {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: [
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ],
                    opens: "09:00",
                    closes: "17:00",
                  },
                  {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: ["Thursday", "Friday", "Saturday"],
                    opens: "18:30",
                    closes: "23:00",
                  },
                ],
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
                  name: "Neumanns Café Berlin",
                  item: "https://speisely.de/magazin/community/neumanns-cafe-berlin",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: NeumannsCafeBerlinArticle,
});

function NeumannsCafeBerlinArticle() {
  const { lang } = useI18n();
  const isDe = lang === "de";

  return (
    <SiteShell>
      {/* Breadcrumb Navigation */}
      <div className="bg-cream border-b border-forest/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-3">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center space-x-2 text-xs text-forest/70 overflow-x-auto whitespace-nowrap"
          >
            <Link to="/" className="hover:text-forest transition-colors">
              {isDe ? "Startseite" : "Home"}
            </Link>
            <span>/</span>
            <Link to="/magazin" className="hover:text-forest transition-colors">
              {isDe ? "Magazin" : "Magazine"}
            </Link>
            <span>/</span>
            <Link to="/community" className="hover:text-forest transition-colors">
              {isDe ? "Community" : "Community"}
            </Link>
            <span>/</span>
            <span className="text-forest font-semibold">Neumanns Café Berlin</span>
          </nav>
        </div>
      </div>

      <article className="bg-cream text-forest pb-20">
        {/* Hero Header */}
        <header className="mx-auto max-w-4xl px-4 sm:px-6 pt-10 pb-8">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest text-white px-3.5 py-1 text-xs font-bold tracking-wide uppercase">
              <Users className="h-3.5 w-3.5 text-[#E6B84A]" />
              {isDe ? "Speisely Community Story" : "Speisely Community Story"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6B84A]/20 text-forest border border-[#E6B84A]/40 px-3.5 py-1 text-xs font-semibold">
              <MapPin className="h-3.5 w-3.5 text-forest" />
              Berlin-Friedrichshain · Boxhagener Platz
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/5 text-forest/80 px-3 py-1 text-xs font-medium">
              <Coffee className="h-3.5 w-3.5 text-[#9E6D18]" />
              {isDe ? "Sauerteig-Bäckerei & Brunch" : "Sourdough Bakery & Brunch"}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold text-forest leading-[1.12] tracking-tight mb-5">
            {isDe
              ? "„…am Ende ist es nur Brot“: Warum das Frühstück im Neumanns Café ganz Friedrichshain verzaubert"
              : "“...in the end, it’s just bread”: Why Breakfast at Neumanns Café Captivates Friedrichshain"}
          </h1>

          <p className="text-lg sm:text-xl text-forest/80 leading-relaxed font-normal mb-6">
            {isDe
              ? "Ein Satz wie ein Berliner Understatement: Direkt am Boxhagener Platz in der Gabriel-Max-Straße 18 zeigt das Neumanns Café jeden Morgen, was passiert, wenn handwerklich gebackenes Sauerteigbrot aus der eigenen Bäckerei auf pochierte Eier, geröstete Pekannüsse, spanische Tortilla und Röstkaffee der Andraschko Kaffeemanufaktur trifft."
              : "A motto of pure Berlin understatement: Right by Boxhagener Platz at Gabriel-Max-Straße 18, Neumanns Café proves every morning what happens when artisan sourdough from its own bakery meets poached eggs, toasted pecans, Spanish tortilla, and Andraschko specialty coffee."}
          </p>

          {/* Editorial Disclosure Banner */}
          <div className="rounded-2xl bg-white/90 border border-forest/10 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-forest/75">
            <div className="flex items-start sm:items-center gap-3">
              <Camera className="h-5 w-5 text-[#9E6D18] shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="font-bold text-forest block sm:inline">
                  {isDe ? "Transparenz & Quelle: " : "Transparency & Source: "}
                </span>
                {isDe
                  ? "Eingereicht von einem Speisely Community-Mitglied (eigener Besuch, selbst bezahlt, unabhängige redaktionelle Auswahl)."
                  : "Submitted by a Speisely Community member (independent visit, self-paid, independent editorial selection)."}
              </div>
            </div>
            <div className="text-forest/60 font-medium shrink-0">
              {isDe ? "12. Oktober 2026 · 5 Min. Lesezeit" : "October 12, 2026 · 5 min read"}
            </div>
          </div>
        </header>

        {/* IMAGE 1 (HERO): Poached Eggs on Spinach & Sourdough Trays */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 mb-10">
          <figure className="max-w-xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-forest/5">
                <img
                  src="/magazin/neumanns-cafe-berlin/05_poached_eggs_spinach_hd.jpg?v=2"
                  alt={
                    isDe
                      ? "Frühstück im Neumanns Café Berlin-Friedrichshain: Pochierte Eier auf jungem Blattspinat und Sauerteigbrot mit frisch gepresstem Orangensaft und Cappuccino"
                      : "Breakfast at Neumanns Café Berlin-Friedrichshain: Poached eggs on wilted spinach and house sourdough with fresh orange juice and cappuccino"
                  }
                  width={1200}
                  height={900}
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 rounded-full bg-black/65 backdrop-blur-md text-white px-3.5 py-1.5 text-xs font-semibold tracking-wide shadow-md">
                  🥖{" "}
                  {isDe
                    ? "Pochierte Eier · Blattspinat · Haus-Sauerteig"
                    : "Poached Eggs · Wilted Spinach · House Sourdough"}
                </div>
              </div>
            </div>
            <figcaption className="mt-3 text-center text-xs text-forest/70 italic px-2">
              {isDe
                ? "Frühstück am Boxhagener Platz: Auf dem markanten Edelstahl-Tablett serviert das Neumanns Café perfekt pochierte Eier auf gedünstetem Blattspinat und Kartoffelstampf über knusprigem Haus-Sauerteig – begleitet von extra Brotscheiben, Butter, Fruchtaufstrich, frisch gepresstem Orangensaft und Cappuccino."
                : "Breakfast by Boxhagener Platz: Served on signature stainless-steel trays, Neumanns Café pairs poached eggs over wilted spinach and potato mash on crusty house-baked sourdough—complete with extra sourdough slices, butter, fruit jam, fresh-squeezed orange juice, and cappuccino."}
            </figcaption>
          </figure>
        </section>

        {/* Quick Key Facts Box + Speisely Verdict Bento */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 mb-12 space-y-6">
          <div className="rounded-3xl bg-white border border-forest/10 p-6 sm:p-8 shadow-sm">
            <h2 className="font-display text-lg sm:text-xl font-bold text-forest mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#9E6D18]" />
              {isDe ? "Neumanns Café auf einen Blick" : "Neumanns Café at a Glance"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-cream/60">
                <MapPin className="h-5 w-5 text-forest shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-forest">
                    {isDe ? "Adresse & Kiez" : "Address & Neighborhood"}
                  </div>
                  <div className="text-forest/80">Gabriel-Max-Straße 18, 10245 Berlin</div>
                  <div className="text-xs text-forest/60 mt-0.5">
                    {isDe
                      ? "Friedrichshain · 1 Minute vom Boxhagener Platz"
                      : "Friedrichshain · 1 min from Boxhagener Platz"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-cream/60">
                <Clock className="h-5 w-5 text-forest shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-forest">
                    {isDe ? "Alle Zeiten & Konzepte" : "All Hours & Concepts"}
                  </div>
                  <div className="text-forest/80 text-xs space-y-0.5 mt-0.5">
                    <div>
                      <strong>Café:</strong> 09:00 – 17:00 Uhr
                    </div>
                    <div>
                      <strong>Weinbar:</strong> Do–Sa 18:30 – 23:00 Uhr
                    </div>
                    <div>
                      <strong>Um die Ecke:</strong> 08:00 – 18:00 Uhr
                    </div>
                    <div>
                      <strong>Bäckerei:</strong> Mi–Fr ab 08:00 Uhr
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-cream/60">
                <Utensils className="h-5 w-5 text-forest shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-forest">
                    {isDe ? "Frühstücks-Highlights" : "Breakfast Highlights"}
                  </div>
                  <div className="text-forest/80">
                    {isDe
                      ? "Hausgebackenes Sauerteigbrot, Pochierte Eier auf Spinat, Süßkartoffel-Pekannuss-Stulle & Ziegenkäse, Spanische Tortilla"
                      : "House-baked sourdough, poached eggs on spinach, sweet-potato pecan tartine & chèvre, Spanish tortilla"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-cream/60">
                <Wine className="h-5 w-5 text-forest shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-forest">
                    {isDe ? "Kaffee & Abend-Konzept" : "Coffee & Evening Concept"}
                  </div>
                  <div className="text-forest/80">
                    {isDe
                      ? "Andraschko Kaffeemanufaktur Berlin · Frischer Minz-Zitronen-Aufguss · Naturwein & Weinbar am Abend"
                      : "Andraschko Kaffeemanufaktur Berlin · Fresh mint-lemon infusion · Natural wine bar in the evening"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Speisely Verdict 4-Pillar Bento Box */}
          <div className="rounded-3xl bg-forest text-white p-6 sm:p-8 shadow-xl border border-[#E6B84A]/30">
            <div className="flex items-center justify-between gap-2 mb-5">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-[#E6B84A]" />
                <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#E6B84A]">
                  {isDe ? "Das Speisely Kurfazit" : "The Speisely Verdict"}
                </span>
              </div>
              <span className="text-xs font-semibold text-white/70">
                {isDe ? "Geprüfter Community-Besuch" : "Verified Community Visit"}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
              <div className="rounded-2xl bg-white/10 p-4 border border-white/10">
                <div className="text-[#E6B84A] font-bold uppercase tracking-wider mb-1">
                  {isDe ? "1. Das Fundament" : "1. The Foundation"}
                </div>
                <p className="text-white/90 leading-relaxed">
                  {isDe
                    ? "Langzeitfermentierter Sauerteig aus der eigenen Bäckerei mit dunkler, krachender Kruste und saftiger Krume."
                    : "Long-fermented sourdough from their own bakery with a dark, crackling crust and moist crumb."}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 border border-white/10">
                <div className="text-[#E6B84A] font-bold uppercase tracking-wider mb-1">
                  {isDe ? "2. Die Stullen-Kunst" : "2. Tartine Craft"}
                </div>
                <p className="text-white/90 leading-relaxed">
                  {isDe
                    ? "Cremiger Karotten-Süßkartoffel-Aufstrich mit gerösteten Pekannüssen, Schnittlauch & mildem Ziegenkäse-Taler."
                    : "Velvety carrot-sweet-potato mash topped with toasted pecans, chives, and a creamy goat cheese medallion."}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 border border-white/10">
                <div className="text-[#E6B84A] font-bold uppercase tracking-wider mb-1">
                  {isDe ? "3. Kaffeekultur" : "3. Coffee Culture"}
                </div>
                <p className="text-white/90 leading-relaxed">
                  {isDe
                    ? "Bohnen der Berliner Andraschko Kaffeemanufaktur – samtiger Mikro-Schaum und nussig-schokoladiger Espresso."
                    : "Beans from Berlin's Andraschko Kaffeemanufaktur—silky micro-foam and nutty, chocolatey espresso."}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 border border-white/10">
                <div className="text-[#E6B84A] font-bold uppercase tracking-wider mb-1">
                  {isDe ? "4. Drei Orte, Ein Kiez" : "4. Three Spots, One Kiez"}
                </div>
                <p className="text-white/90 leading-relaxed">
                  {isDe
                    ? "Café & Weinbar in der Gabriel-Max-Str. 18, „Um die Ecke“ für schnellen Genuss & die eigene Bäckerei."
                    : "Café & wine bar at Gabriel-Max-Str. 18, 'Um die Ecke' for quick coffee & pastries, plus the bakery."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Narrative Body */}
        <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-12 text-base sm:text-lg leading-relaxed text-forest/90">
          {/* Section 1: "...am Ende ist es nur Brot" */}
          <section className="space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest tracking-tight">
              {isDe
                ? "1. „…am Ende ist es nur Brot“ – Das schönste Understatement am Boxhagener Platz"
                : "1. “...in the end, it’s just bread” — The Finest Understatement at Boxhagener Platz"}
            </h2>
            <p>
              {isDe
                ? "Wer in Berlin-Friedrichshain nach einem Frühstück sucht, das nicht von kurzlebigen Social-Media-Gimmicks lebt, sondern von echtem Handwerk, landet früher oder später in der Gabriel-Max-Straße 18. Nur wenige Schritte vom trubeligen Boxhagener Platz entfernt steht auf dem Profil von Neumanns ein einziger, fast lakonischer Satz: „…am Ende ist es nur Brot 🥖“."
                : "Anyone searching in Berlin-Friedrichshain for a breakfast built on true craft rather than fleeting social media gimmicks eventually finds their way to Gabriel-Max-Straße 18. Just steps from bustling Boxhagener Platz, Neumanns sums up its philosophy in a single, disarmingly modest line: “...in the end, it’s just bread 🥖”."}
            </p>
            <p>
              {isDe
                ? "Doch sobald das erste Tablett auf dem warmen Holztisch landet, wird klar, wie viel Understatement in diesen sechs Worten steckt. Denn das Brot im Neumanns ist kein zugekauftes Standardprodukt, sondern das Herzstück einer eigenen handwerklichen Sauerteig-Bäckerei. Mit langer Teigführung gebacken, besitzt jede Scheibe jene tiefbraune, krachende Kruste, die beim Anschneiden hörbar knistert, während die großporige Krume im Inneren saftig, elastisch und fein säuerlich bleibt."
                : "Yet the moment the first tray lands on the warm wooden table, you realize just how much understatement lives inside those words. The bread at Neumanns isn't a bought-in commodity—it is the centerpiece of their own artisan sourdough bakery. Baked with long fermentation, every slice boasts a deep mahogany crust that crackles audibly under the knife while the open-crumb interior stays moist, elastic, and delicately tangy."}
            </p>
            <p>
              {isDe
                ? "Auf unserem ersten Frühstückstablett zeigt sich diese Philosophie in ihrer pursten Form: Zwei auf den Punkt pochierte Eier ruhen auf einem Bett aus warmem, leicht gestampftem Kartoffelpüree und jungem, glänzendem Blattspinat über einer dicken Scheibe geröstetem Sauerteigbrot. Dazu gibt es zwei weitere knusprige Scheiben Hausbrot, zimmerwarme Butter, dunkelrote Fruchtkonfitüre im Porzellanschälchen, einen Becher frisch gepressten Orangensaft und einen Wildkräutersalat mit gerösteten Sonnenblumenkernen."
                : "On our first breakfast tray, this philosophy shines in its purest form: Two impeccably poached eggs rest on a bed of warm, lightly crushed potato mash and glossy wilted spinach atop a thick slice of toasted sourdough. Alongside sit two extra slices of crusty house bread, room-temperature butter, ruby-red fruit jam in porcelain ramekins, a glass of freshly squeezed orange juice, and a wild herb salad scattered with toasted sunflower seeds."}
            </p>
          </section>

          {/* Editorial Pull-Quote */}
          <blockquote className="my-8 rounded-3xl bg-white border-l-4 border-[#9E6D18] p-6 sm:p-8 shadow-sm">
            <p className="font-display text-xl sm:text-2xl italic text-forest leading-relaxed mb-3">
              {isDe
                ? "„Wenn das Brot aus der eigenen Backstube so viel Charakter mitbringt, braucht es keine Effekthascherei – nur gute Butter, ein perfekt pochiertes Ei und ehrliche Zutaten.“"
                : "“When bread from your own bakery carries this much character, it needs no theatrics—just good butter, a perfectly poached egg, and honest ingredients.”"}
            </p>
            <footer className="text-xs font-bold uppercase tracking-widest text-[#9E6D18]">
              {isDe
                ? "— Speisely Community-Eindruck · Berlin-Friedrichshain"
                : "— Speisely Community Note · Berlin-Friedrichshain"}
            </footer>
          </blockquote>

          {/* Section 2: Spanish Tortilla & Croissant Tray */}
          <section className="space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest tracking-tight">
              {isDe
                ? "2. Spanische Tortilla, blättriges Butter-Croissant & das große Frühstückstablett"
                : "2. Spanish Tortilla, Flaky Butter Croissant & the Signature Brunch Tray"}
            </h2>
            <p>
              {isDe
                ? "Wer am Wochenende zu zweit oder mit Freunden im Neumanns sitzt, bestellt am besten quer durch die Karte. Neben den belegten Sauerteig-Stullen gehört die goldgelb gebackene spanische Tortilla zu den heimlichen Lieblingen am Morgen. Saftig geschichtete Kartoffeln und gestocktes Ei, gekrönt von feinen Radieschenscheiben und knackigen Cornichons, bringen eine herzhafte Wärme auf das Tablett."
                : "When visiting Neumanns with a partner or friends, ordering across the menu is the best strategy. Alongside the open-faced sourdough tartines, the golden-baked Spanish tortilla is one of the morning's quiet stars. Tender layers of potato and softly set egg—crowned with crisp radish rounds and tangy cornichons—bring comforting savory warmth to the tray."}
            </p>
            <p>
              {isDe
                ? "Direkt daneben liegt ein kupferbraun gebackenes Butter-Croissant mit feinblättriger Kruste, begleitet von drei dick geschnittenen, gerösteten Sauerteigscheiben, zweierlei Konfitüre, Butter und frischem Marktsalat. Es ist ein Frühstück, das satt macht, ohne jemals schwer zu wirken – weil jede einzelne Komponente frisch zubereitet ist."
                : "Right beside it sits a copper-golden butter croissant with shattering, flaky layers, accompanied by three thick slices of toasted sourdough, two jams, butter, and crisp market greens. It is a breakfast that leaves you deeply satisfied without ever feeling heavy—because every component on the tray is made fresh."}
            </p>
          </section>

          {/* IMAGE 2: Spanish Tortilla & Croissant Brunch Tray */}
          <figure className="max-w-xl mx-auto my-8">
            <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-forest/5">
                <img
                  src="/magazin/neumanns-cafe-berlin/01_tortilla_croissant_hd.jpg?v=2"
                  alt={
                    isDe
                      ? "Spanische Tortilla mit Radieschen und Cornichons, Butter-Croissant, geröstetes Sauerteigbrot und frisch gepresster Orangensaft im Neumanns Café Berlin"
                      : "Spanish tortilla with radish and cornichons, butter croissant, toasted sourdough bread and fresh orange juice at Neumanns Café Berlin"
                  }
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 rounded-full bg-black/65 backdrop-blur-md text-white px-3.5 py-1.5 text-xs font-semibold tracking-wide shadow-md">
                  🥐{" "}
                  {isDe
                    ? "Spanische Tortilla · Croissant · Sauerteig"
                    : "Spanish Tortilla · Croissant · Sourdough"}
                </div>
              </div>
            </div>
            <figcaption className="mt-3 text-center text-xs text-forest/70 italic px-2">
              {isDe
                ? "Herzhaft & süß auf einem Tablett: Saftige spanische Kartoffel-Tortilla mit Radieschen und Cornichons, blättriges Butter-Croissant, drei geröstete Sauerteigscheiben und frisch gepresster Orangensaft."
                : "Savory meets sweet on a single tray: Tender Spanish potato tortilla with radish and cornichons, flaky butter croissant, three toasted sourdough slices, and fresh orange juice."}
            </figcaption>
          </figure>

          {/* Section 3: Sweet Potato Pecan Stulle, Chèvre & Andraschko Coffee */}
          <section className="space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest tracking-tight">
              {isDe
                ? "3. Karotten-Süßkartoffel-Stulle mit Pekannüssen, Ziegenkäse & Andraschko Kaffee"
                : "3. Carrot-Sweet-Potato Tartine with Pecans, Chèvre & Andraschko Coffee"}
            </h2>
            <p>
              {isDe
                ? "Wie kreativ sich gutes Sauerteigbrot inszenieren lässt, beweist der nächste Teller: Eine dicke Scheibe dunkles Hausbrot wird großzügig mit einer leuchtend orangefarbenen, samtig aufgeschlagenen Creme aus gerösteten Karotten und Süßkartoffeln bestrichen. Darüber liegen knackig geröstete Pekannüsse, Sesam, geschrotete Saaten und frischer Schnittlauch."
                : "The next plate demonstrates just how creatively great sourdough can be staged: A thick slice of dark house loaf is generously spread with a vibrant, velvety mash of roasted carrots and sweet potato, then finished with toasted pecans, sesame, crushed seeds, and fresh chives."}
            </p>
            <p>
              {isDe
                ? "Dazu serviert die Küche einen mild-cremigen französischen Ziegenweichkäse-Taler, beträufelt mit einem Hauch Olivenöl und Honig, sowie einen knackigen Blattsalat mit geschmorten Karottenstreifen. In den Tassen daneben: Ein Cappuccino aus Bohnen der renommierten Berliner Kaffeemanufaktur Andraschko mit fein gezeichneter Latte Art sowie ein großer Keramikbecher mit frischem Minz-Zitronen-Ingwer-Aufguss."
                : "Alongside, the kitchen plates a mild, creamy French goat cheese medallion drizzled with a touch of olive oil and honey, plus a crisp leaf salad topped with roasted carrot ribbons. In the cups beside it: a cappuccino brewed with beans from Berlin's renowned Andraschko Kaffeemanufaktur featuring crisp rosette latte art, and a ceramic mug of fresh mint, lemon, and ginger infusion."}
            </p>
          </section>

          {/* IMAGE 3: Chèvre, Pecan Tartine & Latte Art */}
          <figure className="max-w-xl mx-auto my-8">
            <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-forest/5">
                <img
                  src="/magazin/neumanns-cafe-berlin/02_chevre_pecan_tartine_hd.jpg?v=2"
                  alt={
                    isDe
                      ? "Sauerteig-Stulle mit Karotten-Süßkartoffel-Creme, gerösteten Pekannüssen, cremigem Ziegenkäse, Salat und Andraschko Cappuccino im Neumanns Café"
                      : "Sourdough tartine with carrot-sweet-potato mash, toasted pecans, creamy goat cheese, salad, and Andraschko cappuccino at Neumanns Café"
                  }
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 rounded-full bg-black/65 backdrop-blur-md text-white px-3.5 py-1.5 text-xs font-semibold tracking-wide shadow-md">
                  🧀{" "}
                  {isDe
                    ? "Pekannuss-Stulle · Ziegenkäse · Andraschko Kaffee"
                    : "Pecan Tartine · Goat Cheese · Andraschko Coffee"}
                </div>
              </div>
            </div>
            <figcaption className="mt-3 text-center text-xs text-forest/70 italic px-2">
              {isDe
                ? "Farbenfrohes Handwerk auf Keramik: Hausgebackene Sauerteig-Stulle mit Karotten-Süßkartoffel-Aufstrich und gerösteten Pekannüssen, begleitet von mildem Ziegenkäse, Wildkräutersalat, Andraschko-Cappuccino und frischem Minz-Zitronen-Tee."
                : "Colorful craft on ceramic: House-baked sourdough tartine topped with carrot-sweet-potato mash and toasted pecans, paired with mild goat cheese, market greens, Andraschko cappuccino, and fresh mint-lemon tea."}
            </figcaption>
          </figure>

          {/* Section 4: Café, Weinbar, Um die Ecke & Bäckerei */}
          <section className="space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest tracking-tight">
              {isDe
                ? "4. Vom Frühstück zur Weinbar: Ein Kiez-Kosmos in drei Kapiteln"
                : "4. From Morning Sourdough to Evening Wine Bar: A Neighborhood Trilogy"}
            </h2>
            <p>
              {isDe
                ? "Was das Neumanns in Friedrichshain so besonders macht, ist sein Rhythmus über den gesamten Tag. Während im Café in der Gabriel-Max-Straße 18 täglich von 09:00 bis 17:00 Uhr gefrühstückt und gebruncht wird, verwandelt sich der Raum von Donnerstag bis Samstag ab 18:30 bis 23:00 Uhr in eine entspannte Nachbarschafts-Weinbar – natürlich wieder mit dem eigenen Sauerteigbrot als Begleiter zu ausgewählten Weinen und kleinen Tellern."
                : "What makes Neumanns so special in Friedrichshain is its rhythm across the entire day. While the café at Gabriel-Max-Straße 18 serves breakfast and brunch daily from 09:00 to 17:00, Thursday through Saturday evenings from 18:30 to 23:00 see the space transform into an intimate neighborhood wine bar—naturally with house sourdough accompanying curated wines and small plates."}
            </p>
            <p>
              {isDe
                ? "Wer unter der Woche schon früher unterwegs ist oder nur einen schnellen Flat White und ein warmes Croissant auf die Hand möchte, schaut im „Um die Ecke“ (08:00 bis 18:00 Uhr) vorbei. Und wer sich einen ganzen Laib des berühmten Sauerteigbrots mit nach Hause nehmen will, wird von Mittwoch bis Freitag ab 08:00 Uhr direkt in der eigenen Bäckerei fündig. Am Ende ist es eben doch viel mehr als nur Brot – es ist gelebte Berliner Nachbarschaftskultur."
                : "Early risers looking for a quick flat white and warm pastry to go can stop by 'Um die Ecke' (08:00 to 18:00). And anyone wanting to take a whole loaf of the famous sourdough home can visit their bakery Wednesday through Friday starting at 08:00. In the end, it is far more than just bread—it is living Berlin neighborhood culture."}
            </p>
          </section>

          {/* Internal Discovery Funnel Links (Digital Marketing & SEO Hub) */}
          <section className="rounded-3xl bg-white border border-forest/15 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#9E6D18]">
              <Compass className="h-4 w-4" />
              {isDe
                ? "Weiterstöbern auf Speisely Berlin"
                : "Explore More on Speisely Berlin"}
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-forest">
              {isDe
                ? "Noch mehr besondere Cafés, Restaurants & Event-Catering in Berlin entdecken"
                : "Discover More Standout Cafés, Restaurants & Event Catering in Berlin"}
            </h3>
            <p className="text-sm text-forest/75 leading-relaxed">
              {isDe
                ? "Du liebst handwerkliches Frühstück, französische Patisserie oder suchst das passende Catering für dein nächstes Team-Frühstück oder Event in Berlin?"
                : "Love artisan breakfast, French patisserie, or looking for catering for your next team brunch or private event in Berlin?"}
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                to="/restaurant/ort/$city"
                params={{ city: "berlin" }}
                className="inline-flex items-center gap-1.5 rounded-full bg-forest text-white px-4 py-2 text-xs font-bold hover:bg-forest/90 transition-colors"
              >
                {isDe ? "Alle Restaurants in Berlin" : "All Restaurants in Berlin"}
                <ArrowRight className="h-3.5 w-3.5 text-[#E6B84A]" />
              </Link>
              <Link
                to="/catering/ort/$city"
                params={{ city: "berlin" }}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#E6B84A]/25 text-forest border border-[#E6B84A]/50 px-4 py-2 text-xs font-bold hover:bg-[#E6B84A]/40 transition-colors"
              >
                {isDe ? "Catering in Berlin anfragen" : "Book Catering in Berlin"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/magazin/community/garcon-de-cafe-berlin"
                className="inline-flex items-center gap-1.5 rounded-full bg-cream text-forest border border-forest/15 px-4 py-2 text-xs font-semibold hover:border-forest/40 transition-colors"
              >
                {isDe ? "Garçon de Café Berlin" : "Garçon de Café Berlin"}
              </Link>
              <Link
                to="/magazin/community/baba-pirzola-berlin"
                className="inline-flex items-center gap-1.5 rounded-full bg-cream text-forest border border-forest/15 px-4 py-2 text-xs font-semibold hover:border-forest/40 transition-colors"
              >
                {isDe ? "Baba Pirzola Meze & Grill" : "Baba Pirzola Meze & Grill"}
              </Link>
            </div>
          </section>

          {/* Editorial Note & Transparency Footer */}
          <footer className="pt-8 border-t border-forest/15 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-forest/70">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-forest uppercase tracking-wider">
                  {isDe ? "Kategorie:" : "Category:"}
                </span>
                <Link
                  to="/community"
                  className="rounded-full bg-forest/10 px-3 py-1 font-semibold text-forest hover:bg-forest hover:text-white transition-colors"
                >
                  Speisely Community Story
                </Link>
                <span className="rounded-full bg-forest/5 px-3 py-1">Berlin-Friedrichshain</span>
                <span className="rounded-full bg-forest/5 px-3 py-1">Boxhagener Platz</span>
                <span className="rounded-full bg-forest/5 px-3 py-1">
                  {isDe ? "Sauerteig & Brunch" : "Sourdough & Brunch"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-forest/60">
                <Info className="h-3.5 w-3.5" />
                <span>
                  {isDe
                    ? "Unabhängiger Community-Beitrag · Keine bezahlte Anzeige"
                    : "Independent Community Contribution · Not a paid ad"}
                </span>
              </div>
            </div>
          </footer>
        </div>
      </article>

      <AboutSpeiselySection />
    </SiteShell>
  );
}
