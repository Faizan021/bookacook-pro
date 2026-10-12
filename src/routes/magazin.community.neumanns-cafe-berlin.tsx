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
          "„…am Ende ist es nur Brot“: Frühstück im Neumanns Café Berlin-Friedrichshain — Speisely Community Story",
      },
      {
        property: "og:description",
        content:
          "Handwerklicher Sauerteig aus eigener Bäckerei, pochierte Bio-Eier auf Blattspinat, Karotten-Süßkartoffel-Stulle mit Pekannüssen & Ziegenkäse sowie Andraschko Kaffee in der Gabriel-Max-Straße 18.",
      },
      { property: "og:type", content: "article" },
      {
        property: "og:url",
        content: "https://speisely.de/magazin/community/neumanns-cafe-berlin",
      },
      {
        property: "og:image",
        content:
          "https://speisely.de/magazin/neumanns-cafe-berlin/05_poached_eggs_spinach_hd.jpg?v=3",
      },
      { property: "og:locale", content: "de_DE" },
      { property: "og:locale:alternate", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Neumanns Café Berlin: Sauerteig-Bäckerei, Frühstück & Weinbar — Speisely",
      },
      {
        name: "twitter:description",
        content:
          "Warum das Neumanns Café in der Gabriel-Max-Straße 18 Berlins ehrlichstes Sauerteig-Frühstück serviert.",
      },
      {
        name: "twitter:image",
        content:
          "https://speisely.de/magazin/neumanns-cafe-berlin/05_poached_eggs_spinach_hd.jpg?v=3",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://speisely.de/magazin/community/neumanns-cafe-berlin",
      },
      {
        rel: "alternate",
        hrefLang: "de",
        href: "https://speisely.de/magazin/community/neumanns-cafe-berlin",
      },
      {
        rel: "alternate",
        hrefLang: "en",
        href: "https://speisely.de/magazin/community/neumanns-cafe-berlin",
      },
      {
        rel: "alternate",
        hrefLang: "x-default",
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
              headline:
                "„…am Ende ist es nur Brot“: Warum das Neumanns Café am Boxhagener Platz Berlins ehrlichstes Sauerteig-Frühstück serviert",
              alternateName:
                "...in the end, it's just bread: Why Neumanns Café by Boxhagener Platz Serves Berlin's Most Honest Sourdough Breakfast",
              description:
                "Ein Speisely Community-Frühstücksbericht über das Neumanns Café in Berlin-Friedrichshain (Gabriel-Max-Straße 18): Hausgebackenes Sauerteigbrot, pochierte Eier auf Blattspinat, spanische Tortilla, Karotten-Süßkartoffel-Stulle mit Pekannüssen & Ziegenkäse sowie Kaffee der Andraschko Kaffeemanufaktur.",
              image: [
                "https://speisely.de/magazin/neumanns-cafe-berlin/05_poached_eggs_spinach_hd.jpg?v=3",
                "https://speisely.de/magazin/neumanns-cafe-berlin/01_tortilla_croissant_hd.jpg?v=3",
                "https://speisely.de/magazin/neumanns-cafe-berlin/02_chevre_pecan_tartine_hd.jpg?v=3",
              ],
              datePublished: "2026-10-12T09:00:00+02:00",
              dateModified: "2026-10-12T12:00:00+02:00",
              inLanguage: ["de-DE", "en-US"],
              author: {
                "@type": "Organization",
                name: "Speisely Community & Redaktion",
                url: "https://speisely.de/community",
              },
              publisher: {
                "@type": "Organization",
                name: "Speisely",
                logo: {
                  "@type": "ImageObject",
                  url: "https://speisely.de/logo-512.png",
                },
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": "https://speisely.de/magazin/community/neumanns-cafe-berlin",
              },
              about: {
                "@type": "CafeOrCoffeeShop",
                name: "Neumanns Café",
                description:
                  "…am Ende ist es nur Brot. Handwerkliche Sauerteig-Bäckerei, Frühstückscafé, „Um die Ecke“ Kaffeebar und abendliche Weinbar in Berlin-Friedrichshain.",
                servesCuisine: [
                  "Artisanal Sourdough Bakery",
                  "Breakfast & Brunch",
                  "Specialty Coffee",
                  "Wine Bar",
                ],
                priceRange: "€€",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Gabriel-Max-Straße 18",
                  addressLocality: "Berlin",
                  addressRegion: "Berlin",
                  postalCode: "10245",
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
              {isDe ? "Sauerteig-Bäckerei & Weinbar" : "Sourdough Bakery & Wine Bar"}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold text-forest leading-[1.12] tracking-tight mb-5">
            {isDe
              ? "„…am Ende ist es nur Brot“: Warum das Neumanns Café am Boxhagener Platz Berlins ehrlichstes Sauerteig-Frühstück serviert"
              : "“...in the end, it’s just bread”: Why Neumanns Café by Boxhagener Platz Serves Berlin’s Most Honest Sourdough Breakfast"}
          </h1>

          <p className="text-lg sm:text-xl text-forest/80 leading-relaxed font-normal mb-6">
            {isDe
              ? "Sechs Worte Berliner Understatement, hinter denen tagelange Fermentation steckt: In der Gabriel-Max-Straße 18 zeigt das Neumanns jeden Morgen, welche Strahlkraft ein Frühstück entfaltet, wenn das Sauerteigbrot aus der eigenen Backstube stammt – begleitet von pochierten Bio-Eiern auf jungem Blattspinat, spanischer Kartoffel-Tortilla, gerösteten Pekannüssen, französischem Ziegenkäse und Espresso der Berliner Kaffeemanufaktur Andraschko."
              : "Six words of classic Berlin understatement backed by days of wild fermentation: At Gabriel-Max-Straße 18, Neumanns proves every morning what happens when breakfast is built on sourdough from its own bakery—paired with poached organic eggs over wilted spinach, Spanish potato tortilla, toasted pecans, French chèvre, and espresso roasted in Berlin by Andraschko Kaffeemanufaktur."}
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

        {/* IMAGE 1 (HERO): Poached Eggs on Spinach & Sourdough Trays + Cappuccino */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 mb-10">
          <figure className="max-w-xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-forest/5">
                <img
                  src="/magazin/neumanns-cafe-berlin/05_poached_eggs_spinach_hd.jpg?v=3"
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
                ? "Frühstück am Boxhagener Platz: Auf dem markanten Edelstahl-Tablett serviert das Neumanns Café perfekt pochierte Bio-Eier auf gedünstetem Blattspinat und leichtem Kartoffelstampf über dick geschnittenem Haus-Sauerteig – dazu extra Brotscheiben, Butter, Fruchtkonfitüre, frisch gepresster Orangensaft und ein samtiger Cappuccino."
                : "Breakfast by Boxhagener Platz: Served on signature stainless-steel trays, Neumanns Café pairs poached organic eggs over wilted spinach and light potato mash on thick-cut house sourdough—accompanied by extra sourdough slices, butter, fruit jam, fresh-squeezed orange juice, and a velvety cappuccino."}
            </figcaption>
          </figure>
        </section>

        {/* Quick Key Facts Box + 3-Concept Kiez Compass + Speisely Verdict Bento */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 mb-12 space-y-6">
          <div className="rounded-3xl bg-white border border-forest/10 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-forest/10 pb-4">
              <h2 className="font-display text-lg sm:text-xl font-bold text-forest flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#9E6D18]" />
                {isDe ? "Neumanns Berlin: Drei Orte, eine Backstube" : "Neumanns Berlin: Three Concepts, One Bakery"}
              </h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3.5 py-1 text-xs font-bold text-forest border border-forest/15">
                „…am Ende ist es nur Brot 🥖“
              </span>
            </div>

            {/* 3-Concept Visual Cards (Café / Weinbar, Um die Ecke, Bäckerei) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="rounded-2xl bg-cream/70 border border-forest/10 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-[#9E6D18] mb-1">
                    <span>01 · Café & Weinbar</span>
                    <Wine className="h-3.5 w-3.5" />
                  </div>
                  <div className="font-bold text-forest text-sm mb-1">
                    {isDe ? "Frühstück & Abend-Weinbar" : "Brunch & Evening Wine Bar"}
                  </div>
                  <p className="text-xs text-forest/75 leading-relaxed mb-3">
                    {isDe
                      ? "Ausgedehntes Sauerteig-Frühstück am Tag, entspannte Nachbarschafts-Weinbar am Abend."
                      : "Long sourdough breakfasts by day, intimate neighborhood wine bar by night."}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-forest/10 text-xs font-semibold text-forest space-y-0.5">
                  <div>▸ Café: 09:00 – 17:00</div>
                  <div className="text-[#9E6D18]">▸ Do–Sa: 18:30 – 23:00 (Weinbar)</div>
                </div>
              </div>

              <div className="rounded-2xl bg-cream/70 border border-forest/10 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-[#9E6D18] mb-1">
                    <span>02 · Um die Ecke</span>
                    <Coffee className="h-3.5 w-3.5" />
                  </div>
                  <div className="font-bold text-forest text-sm mb-1">
                    {isDe ? "Für Frühaufsteher & Unterwegs" : "Early Risers & Coffee to Go"}
                  </div>
                  <p className="text-xs text-forest/75 leading-relaxed mb-3">
                    {isDe
                      ? "Andraschko Espresso, Flat White, warme Croissants und belegte Stullen ab dem frühen Morgen."
                      : "Andraschko espresso, flat whites, warm croissants, and sourdough sandwiches from early morning."}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-forest/10 text-xs font-semibold text-forest space-y-0.5">
                  <div>▸ {isDe ? "Täglich:" : "Daily:"} 08:00 – 18:00</div>
                  <div className="text-forest/60">Gabriel-Max-Str. 18 (Ecke)</div>
                </div>
              </div>

              <div className="rounded-2xl bg-cream/70 border border-forest/10 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-[#9E6D18] mb-1">
                    <span>03 · Die Bäckerei</span>
                    <Utensils className="h-3.5 w-3.5" />
                  </div>
                  <div className="font-bold text-forest text-sm mb-1">
                    {isDe ? "Handwerkliche Backstube" : "Artisanal Sourdough Bakery"}
                  </div>
                  <p className="text-xs text-forest/75 leading-relaxed mb-3">
                    {isDe
                      ? "Ganze Sauerteiglaibe mit krachender Kruste und feines Gebäck für zu Hause."
                      : "Whole slow-fermented sourdough loaves with crackling crusts to take home."}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-forest/10 text-xs font-semibold text-forest space-y-0.5">
                  <div>▸ Mi–Fr: {isDe ? "ab 08:00 Uhr" : "from 08:00"}</div>
                  <div className="text-forest/60">{isDe ? "Solange der Vorrat reicht" : "While loaves last"}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-1">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-cream/50">
                <MapPin className="h-5 w-5 text-forest shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-forest">
                    {isDe ? "Standort im Kiez" : "Neighborhood Location"}
                  </div>
                  <div className="text-forest/85 font-medium">Gabriel-Max-Straße 18, 10245 Berlin</div>
                  <div className="text-xs text-forest/65 mt-0.5">
                    {isDe
                      ? "Berlin-Friedrichshain · Direkt am Boxhagener Platz"
                      : "Berlin-Friedrichshain · Steps from Boxhagener Platz"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-cream/50">
                <Clock className="h-5 w-5 text-forest shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-forest">
                    {isDe ? "Unsere 3 Bestellungen beim Besuch" : "Our 3 Orders During the Visit"}
                  </div>
                  <div className="text-forest/80 text-xs leading-relaxed mt-0.5">
                    {isDe
                      ? "1. Pochierte Eier auf Blattspinat & Sauerteig · 2. Spanische Kartoffel-Tortilla & Butter-Croissant · 3. Karotten-Süßkartoffel-Stulle mit Pekannüssen & Ziegenkäse"
                      : "1. Poached eggs on spinach & sourdough · 2. Spanish potato tortilla & butter croissant · 3. Carrot-sweet-potato tartine with pecans & chèvre"}
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
                  {isDe ? "Das Speisely Kurzfazit" : "The Speisely Verdict"}
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
                    ? "Langzeitfermentierter Sauerteig aus der eigenen Bäckerei mit dunkler, krachender Kruste und saftig-offener Krume."
                    : "Long-fermented sourdough from their own bakery with a dark, crackling crust and moist, open crumb."}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 border border-white/10">
                <div className="text-[#E6B84A] font-bold uppercase tracking-wider mb-1">
                  {isDe ? "2. Die Stullen-Kunst" : "2. Tartine Craft"}
                </div>
                <p className="text-white/90 leading-relaxed">
                  {isDe
                    ? "Samtige Karotten-Süßkartoffel-Creme mit gerösteten Pekannüssen, Saaten, Schnittlauch & mildem Ziegenkäse-Taler."
                    : "Velvety carrot-sweet-potato mash topped with toasted pecans, seeds, chives, and a creamy goat cheese medallion."}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 border border-white/10">
                <div className="text-[#E6B84A] font-bold uppercase tracking-wider mb-1">
                  {isDe ? "3. Kaffeekultur" : "3. Coffee Culture"}
                </div>
                <p className="text-white/90 leading-relaxed">
                  {isDe
                    ? "Bohnen der Berliner Andraschko Kaffeemanufaktur – dichter Mikro-Schaum und nussig-schokoladiger Espresso."
                    : "Beans from Berlin's Andraschko Kaffeemanufaktur—silky micro-foam and nutty, chocolatey espresso."}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 border border-white/10">
                <div className="text-[#E6B84A] font-bold uppercase tracking-wider mb-1">
                  {isDe ? "4. Tages-Rhythmus" : "4. All-Day Rhythm"}
                </div>
                <p className="text-white/90 leading-relaxed">
                  {isDe
                    ? "Vom frühen Espresso um 8 Uhr über den ausgedehnten Brunch bis zum Naturwein am Donnerstag- bis Samstagabend."
                    : "From 8 a.m. espresso at 'Um die Ecke' to leisurely brunch and natural wines Thursday through Saturday nights."}
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
                ? "1. „…am Ende ist es nur Brot“ – Warum echtes Bäckerhandwerk keine großen Worte braucht"
                : "1. “...in the end, it’s just bread” — Why True Bakery Craft Needs No Grandstanding"}
            </h2>
            <p>
              {isDe
                ? "Wer in Berlin-Friedrichshain frühstücken geht, hat die Wahl zwischen unzähligen Cafés rund um den Boxhagener Platz. Doch während viele Orte auf kurzlebige Show-Effekte setzen, liest man beim Neumanns in der Gabriel-Max-Straße 18 ein Motto, das trockener und sympathischer kaum sein könnte: „…am Ende ist es nur Brot 🥖“."
                : "Anyone heading out for breakfast in Berlin-Friedrichshain is spoiled for choice around Boxhagener Platz. Yet while plenty of spots chase fleeting visual gimmicks, Neumanns at Gabriel-Max-Straße 18 greets you with a motto of dry, disarming Berlin modesty: “...in the end, it’s just bread 🥖”."}
            </p>
            <p>
              {isDe
                ? "Sobald das erste Edelstahl-Tablett auf dem Holztisch steht, versteht man die feine Ironie hinter diesem Satz. Denn im Neumanns ist Brot keine Nebensache, sondern das Fundament einer eigenen handwerklichen Sauerteig-Bäckerei. Über viele Stunden kalt geführt und kräftig ausgebacken, bringt jede Scheibe jene dunkel karamellisierte, krachende Kruste mit, die beim Anschneiden hörbar splittert, während die großporige Krume im Inneren saftig, elastisch und fein säuerlich bleibt."
                : "The moment the first stainless-steel tray lands on the wooden table, the quiet irony of that line becomes clear. At Neumanns, bread is never an afterthought—it is the foundation of their own artisanal sourdough bakery. Cold-fermented for hours and baked dark, every slice arrives with a deeply caramelized, crackling crust that splinters audibly under the knife while the open-crumb interior stays moist, elastic, and gently tangy."}
            </p>
            <p>
              {isDe
                ? "Auf unserem ersten Tablett zeigt sich diese Qualität ohne Umwege: Zwei auf den Punkt pochierte Bio-Eier ruhen auf warmem, leicht gestampftem Kartoffelpüree und glänzendem jungem Blattspinat über einer dicken Scheibe geröstetem Sauerteigbrot. Beim Anstechen verbindet sich das flüssige, goldgelbe Eigelb mit dem Spinat und der herzhaften Brotkruste. Dazu werden zwei weitere knusprige Scheiben Hausbrot, zimmerwarme Butter, dunkelrote Fruchtkonfitüre im Porzellanschälchen, ein Wildkräutersalat mit gerösteten Sonnenblumenkernen, frisch gepresster Orangensaft und ein Cappuccino serviert."
                : "On our first tray, that quality speaks for itself: Two impeccably poached organic eggs rest on warm, lightly crushed potato mash and glossy wilted spinach atop a thick slice of toasted sourdough. Cut into the eggs and the rich golden yolk mingles immediately with the warm greens and toasted crust. Alongside sit two extra slices of crusty house bread, room-temperature butter, ruby-red fruit jam in porcelain ramekins, a wild herb salad scattered with toasted sunflower seeds, freshly squeezed orange juice, and a cappuccino."}
            </p>
          </section>

          {/* Editorial Pull-Quote */}
          <blockquote className="my-8 rounded-3xl bg-white border-l-4 border-[#9E6D18] p-6 sm:p-8 shadow-sm">
            <p className="font-display text-xl sm:text-2xl italic text-forest leading-relaxed mb-3">
              {isDe
                ? "„Wenn das Sauerteigbrot aus der eigenen Backstube so viel Charakter auf den Teller bringt, braucht es kein Chichi – nur gute Butter, ein perfekt pochiertes Ei und ehrliches Handwerk.“"
                : "“When sourdough from your own bakery brings this much character to the plate, it needs no theatrics—just good butter, a perfectly poached egg, and honest craft.”"}
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
                ? "2. Spanische Kartoffel-Tortilla, blättriges Butter-Croissant & dreierlei Sauerteig"
                : "2. Spanish Potato Tortilla, Flaky Butter Croissant & Three Slices of Toasted Sourdough"}
            </h2>
            <p>
              {isDe
                ? "Wer zu zweit am Tisch sitzt, sollte unbedingt ein zweites Tablett danebenstellen, das Herzhaftes und französische Backkunst verbindet. Im Mittelpunkt steht hier eine goldbraun gebackene spanische Kartoffel-Tortilla: innen saftig geschichtet und mild-würzig, obenauf garniert mit fein gehobelten Radieschenscheiben und knackigen Cornichons, die mit ihrer frischen Säure einen präzisen Kontrapunkt setzen."
                : "If you are sharing the table for two, ordering a second tray that bridges savory comfort and French Viennoiserie is essential. Center stage is a golden-baked Spanish potato tortilla—tenderly layered and gently savory inside, crowned with thinly sliced red radishes and crisp cornichons whose bright acidity cuts cleanly through the richness."}
            </p>
            <p>
              {isDe
                ? "Direkt daneben liegt ein kupfergoldenes Butter-Croissant, dessen hauchdünne, blättrige Teigschichten schon beim Aufbrechen leise knistern. Begleitet wird das Ensemble von drei dick geschnittenen, auf den Punkt gerösteten Sauerteigscheiben, zweierlei Konfitüre, Butter, einem knackigen Marktsalat mit Kirschtomate und einem Glas frisch gepresstem Orangensaft."
                : "Right beside it sits a copper-golden butter croissant whose paper-thin laminated layers shatter delicately at the touch. Completing the tray are three thick slices of toasted house sourdough, two fruit preserves, butter, crisp market greens with cherry tomato, and a glass of freshly squeezed orange juice."}
            </p>
          </section>

          {/* IMAGE 2: Spanish Tortilla & Croissant Brunch Tray */}
          <figure className="max-w-xl mx-auto my-8">
            <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-forest/5">
                <img
                  src="/magazin/neumanns-cafe-berlin/01_tortilla_croissant_hd.jpg?v=3"
                  alt={
                    isDe
                      ? "Spanische Kartoffel-Tortilla mit Radieschen und Cornichons, Butter-Croissant, geröstetes Sauerteigbrot und frisch gepresster Orangensaft im Neumanns Café Berlin"
                      : "Spanish potato tortilla with radish and cornichons, butter croissant, toasted sourdough bread and fresh orange juice at Neumanns Café Berlin"
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
                    ? "Spanische Tortilla · Butter-Croissant · Sauerteig"
                    : "Spanish Tortilla · Butter Croissant · Sourdough"}
                </div>
              </div>
            </div>
            <figcaption className="mt-3 text-center text-xs text-forest/70 italic px-2">
              {isDe
                ? "Herzhaft & blättrig auf einem Tablett: Goldgelbe spanische Kartoffel-Tortilla mit Radieschenscheiben und Cornichons, ein frisch gebackenes Butter-Croissant, drei geröstete Sauerteigscheiben, Marktsalat und frisch gepresster Orangensaft."
                : "Savory meets flaky on a single tray: Golden Spanish potato tortilla topped with sliced radishes and cornichons, a freshly baked butter croissant, three toasted sourdough slices, market greens, and fresh orange juice."}
            </figcaption>
          </figure>

          {/* Section 3: Sweet Potato Pecan Stulle, Chèvre & Andraschko Coffee */}
          <section className="space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest tracking-tight">
              {isDe
                ? "3. Die Stullen-Kunst: Karotten-Süßkartoffel-Creme, geröstete Pekannüsse, Chèvre & Andraschko Kaffee"
                : "3. The Art of the Berlin Stulle: Carrot-Sweet-Potato Mash, Toasted Pecans, Chèvre & Andraschko Coffee"}
            </h2>
            <p>
              {isDe
                ? "Wer wissen möchte, warum die Berliner Stulle im Neumanns längst Kultstatus genießt, findet die Antwort auf dem dritten Teller: Eine kräftige Scheibe dunkles Natursauerteigbrot ist dick und wellenförmig mit einer leuchtend orangefarbenen, samtig aufgeschlagenen Karotten-Süßkartoffel-Creme bestrichen. Darüber sorgen geröstete Pekannüsse, heller Sesam, grob geschrotete Gewürzsaaten und fein geschnittener Schnittlauch für nussigen Biss und aromatische Tiefe."
                : "Anyone wondering why the humble Berlin open-faced Stulle has achieved cult status at Neumanns will find the answer on the third plate: A thick slice of dark wild sourdough is generously sculpted with a vibrant, velvety mash of roasted carrots and sweet potato. Scattered across the top, toasted pecans, white sesame, crushed aromatic seeds, and finely snipped chives deliver nutty crunch and warm spice."}
            </p>
            <p>
              {isDe
                ? "Direkt auf dem gesprenkelten Keramikteller ruht daneben ein cremiger französischer Ziegenweichkäse-Taler (Chèvre), verfeinert mit einem Hauch Olivenöl und Blütenhonig, sowie ein knackiger Blattsalat mit einer im Ganzen geschmorten jungen Karotte und gerösteten Sonnenblumenkernen. In den Tassen dazu: Ein Cappuccino aus Bohnen der Berliner Kaffeemanufaktur Andraschko und ein großer Keramikbecher mit frischem Zitronen-Minz-Aufguss."
                : "Resting beside it on the speckled ceramic plate is a creamy French goat cheese medallion (chèvre) glossed with olive oil and blossom honey, alongside crisp salad leaves topped with a whole roasted baby carrot and toasted sunflower seeds. In the cups above: a cappuccino pulled with beans from Berlin's Andraschko Kaffeemanufaktur and a stoneware mug of fresh lemon-mint infusion."}
            </p>
          </section>

          {/* IMAGE 3: Chèvre, Pecan Tartine & Latte Art */}
          <figure className="max-w-xl mx-auto my-8">
            <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-forest/5">
                <img
                  src="/magazin/neumanns-cafe-berlin/02_chevre_pecan_tartine_hd.jpg?v=3"
                  alt={
                    isDe
                      ? "Sauerteig-Stulle mit Karotten-Süßkartoffel-Creme, gerösteten Pekannüssen, cremigem Ziegenkäse, Salat mit geschmorter Karotte und Andraschko Cappuccino im Neumanns Café"
                      : "Sourdough tartine with carrot-sweet-potato mash, toasted pecans, creamy goat cheese, salad with roasted baby carrot, and Andraschko cappuccino at Neumanns Café"
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
                    ? "Pekannuss-Stulle · Chèvre · Andraschko Kaffee"
                    : "Pecan Tartine · Chèvre · Andraschko Coffee"}
                </div>
              </div>
            </div>
            <figcaption className="mt-3 text-center text-xs text-forest/70 italic px-2">
              {isDe
                ? "Textur-Kontrast auf Keramik: Dunkle Sauerteig-Stulle mit Karotten-Süßkartoffel-Creme, gerösteten Pekannüssen, Sesam und Schnittlauch, begleitet von mildem Ziegenkäse-Taler, Blattsalat mit geschmorter Karotte, Andraschko-Cappuccino und frischem Minz-Zitronen-Aufguss."
                : "Texture contrast on stoneware: Dark sourdough tartine topped with carrot-sweet-potato mash, toasted pecans, sesame, and chives, paired with a mild goat cheese medallion, leaf salad with a roasted baby carrot, Andraschko cappuccino, and fresh mint-lemon infusion."}
            </figcaption>
          </figure>

          {/* Section 4: Café, Weinbar, Um die Ecke & Bäckerei */}
          <section className="space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest tracking-tight">
              {isDe
                ? "4. Vom Frühstück zur Weinbar: Ein Friedrichshainer Kiez-Kosmos in drei Kapiteln"
                : "4. From Morning Sourdough to Evening Wine Bar: A Friedrichshain Trilogy"}
            </h2>
            <p>
              {isDe
                ? "Was das Neumanns in der Gabriel-Max-Straße 18 weit über Friedrichshain hinaus besonders macht, ist seine durchdachte Dreiteilung über den Tag hinweg. Im Café wird täglich von 09:00 bis 17:00 Uhr gefrühstückt; von Donnerstag bis Samstag verwandelt sich derselbe Raum ab 18:30 bis 23:00 Uhr in eine warm beleuchtete Weinbar, in der ausgewählte Weine auf kleine Teller und natürlich das eigene Sauerteigbrot treffen."
                : "What sets Neumanns at Gabriel-Max-Straße 18 apart well beyond Friedrichshain is its thoughtful three-part rhythm across the day. Inside the café, breakfast and brunch run daily from 09:00 to 17:00; Thursday through Saturday from 18:30 to 23:00, the very same room transforms into a warmly lit wine bar where curated bottles meet small plates and, naturally, house sourdough."}
            </p>
            <p>
              {isDe
                ? "Für alle, die morgens schon ab 08:00 Uhr unterwegs sind oder auf dem Weg durch den Kiez nur einen präzise gezogenen Espresso und ein warmes Croissant mitnehmen möchten, ist das „Um die Ecke“ täglich von 08:00 bis 18:00 Uhr geöffnet. Und wer sich einen ganzen Laib des berühmten Natursauerteigbrots für das eigene Frühstück nach Hause holen will, steht von Mittwoch bis Freitag ab 08:00 Uhr direkt vor der eigenen Bäckerei. Am Ende ist es eben doch weit mehr als nur Brot – es ist gelebte Berliner Nachbarschaftskultur."
                : "For early commuters out at 08:00 or neighbors grabbing a dialed-in espresso and warm croissant on the move, 'Um die Ecke' opens daily from 08:00 to 18:00. And anyone hoping to bring a whole loaf of their wild sourdough home can stop directly by the bakery Wednesday through Friday starting at 08:00. In the end, it is far more than just bread—it is living Berlin neighborhood culture."}
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
                  {isDe ? "Sauerteig & Weinbar" : "Sourdough & Wine Bar"}
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
