import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  Clock,
  Utensils,
  Sparkles,
  Users,
  Camera,
  Info,
  Flame,
  Wine,
  Award,
  ArrowRight,
  Compass,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { SiteShell } from "@/components/SiteShell";
import { AboutSpeiselySection } from "@/components/AboutSpeiselySection";

export const Route = createFileRoute("/magazin/community/baba-pirzola-berlin")({
  head: () => ({
    meta: [
      { title: "Baba Pirzola Meze & Grill Berlin — Speisely" },
      {
        name: "description",
        content:
          "Community-Besuch bei Baba Pirzola Berlin am Wittenbergplatz: Kuzu Pirzola, Lokum Bonfile, Nazik Ali, Antrikot, Katmer & Fırında Sütlaç Dondurmalı im Test.",
      },
      {
        name: "keywords",
        content:
          "Baba Pirzola Berlin, Türkisches Restaurant Wittenbergplatz, Kuzu Pirzola Berlin, Lokum Bonfile, Nazik Ali, Antrikot 300g, Fırında Sütlaç Dondurmalı, Katmer Berlin, Gavurdağı Salatası, Speisely Community Story",
      },
      { name: "geo.region", content: "DE-BE" },
      { name: "geo.placename", content: "Berlin-Schöneberg" },
      { name: "geo.position", content: "52.5015;13.3444" },
      { name: "ICBM", content: "52.5015, 13.3444" },
      {
        property: "og:title",
        content: "Feuer, Meze & große Grillkunst: Ein Abend im Baba Pirzola Berlin | Speisely",
      },
      {
        property: "og:description",
        content:
          "Zwischen KaDeWe und Wittenbergplatz: Unser Community-Bericht über Kuzu Pirzola, Deniz & Çayır (Surf & Turf), rauchiges Nazik Ali, 300g Antrikot, Katmer und Fırında Sütlaç Dondurmalı.",
      },
      {
        property: "og:image",
        content:
          "https://speisely.de/magazin/baba-pirzola-berlin/01_baba_pirzola_feast_table_hd.jpg?v=4",
      },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "de_DE" },
      {
        property: "og:url",
        content: "https://speisely.de/magazin/community/baba-pirzola-berlin",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://speisely.de/magazin/community/baba-pirzola-berlin",
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
              "@id": "https://speisely.de/magazin/community/baba-pirzola-berlin#article",
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": "https://speisely.de/magazin/community/baba-pirzola-berlin",
              },
              headline:
                "Feuer, Meze & große Grillkunst am Wittenbergplatz: Ein Abend im Baba Pirzola Berlin",
              description:
                "Ein Speisely Community-Mitglied war zu Gast im Baba Pirzola Meze & Grill in der Bayreuther Straße 35 nahe dem KaDeWe und berichtet über Kuzu Pirzola, Lokum Bonfile, Nazik Ali, Antrikot, Katmer und Fırında Sütlaç Dondurmalı.",
              image: [
                {
                  "@type": "ImageObject",
                  url: "https://speisely.de/magazin/baba-pirzola-berlin/01_baba_pirzola_feast_table_hd.jpg?v=4",
                  width: 1200,
                  height: 900,
                },
                {
                  "@type": "ImageObject",
                  url: "https://speisely.de/magazin/baba-pirzola-berlin/02_baba_pirzola_mixed_grill_board_hd.jpg?v=4",
                  width: 1200,
                  height: 900,
                },
                {
                  "@type": "ImageObject",
                  url: "https://speisely.de/magazin/baba-pirzola-berlin/03_baba_pirzola_antrikot_herb_butter_hd.jpg?v=4",
                  width: 1200,
                  height: 900,
                },
              ],
              datePublished: "2026-10-11",
              dateModified: "2026-10-11",
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
                name: "Baba Pirzola Meze & Grill",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Bayreuther Str. 35",
                  addressLocality: "Berlin",
                  postalCode: "10789",
                  addressRegion: "Berlin",
                  addressCountry: "DE",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 52.5015,
                  longitude: 13.3444,
                },
                servesCuisine: ["Turkish", "Mediterranean", "Steakhouse", "Meze"],
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
                  name: "Community",
                  item: "https://speisely.de/community",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Baba Pirzola Berlin",
                  item: "https://speisely.de/magazin/community/baba-pirzola-berlin",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: BabaPirzolaBerlinCommunityArticle,
});

function BabaPirzolaBerlinCommunityArticle() {
  const { lang } = useI18n();
  const isDe = lang === "de";

  const emailSubject = isDe
    ? "Mein Besuch bei Baba Pirzola Berlin – Feedback für Speisely Community"
    : "My visit to Baba Pirzola Berlin – Feedback for Speisely Community";

  const emailBody = isDe
    ? `Hallo Speisely-Team,\n\nich habe das Baba Pirzola Meze & Grill in Berlin besucht und möchte meine Erfahrung teilen.\n\nMein Lieblingsgericht:\nAtmosphäre & Service:\nFotos anbei:`
    : `Hello Speisely Team,\n\nI visited Baba Pirzola Meze & Grill in Berlin and want to share my experience.\n\nFavorite dish:\nAtmosphere & Service:\nPhotos attached:`;

  const mailtoHref = `mailto:info@speisely.de?subject=${encodeURIComponent(
    emailSubject,
  )}&body=${encodeURIComponent(emailBody)}`;

  return (
    <SiteShell>
      <div className="bg-[#FAF7F0] text-forest min-h-screen">
        {/* Breadcrumb Bar */}
        <div className="border-b border-forest/10 bg-white/75 backdrop-blur-md sticky top-16 z-30">
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
                  <Link to="/community" className="hover:text-forest transition">
                    Community
                  </Link>
                </li>
                <li aria-hidden="true">›</li>
                <li aria-current="page" className="text-forest font-bold truncate">
                  Baba Pirzola Berlin
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
        <header className="mx-auto max-w-4xl px-4 pt-10 pb-6 sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EBF4EC] text-forest px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs border border-[#7FA46B]/20">
            <Users className="h-3.5 w-3.5 text-[#7FA46B]" aria-hidden="true" />
            <span>
              {isDe
                ? "Erfahrungsbericht aus der Speisely Community"
                : "Dispatches from the Speisely Community"}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-[44px] font-bold text-forest leading-[1.16] tracking-tight">
            {isDe
              ? "Feuer, Meze & große Grillkunst am Wittenbergplatz: Ein Abend im Baba Pirzola"
              : "Fire, Meze & High Grill Craft at Wittenbergplatz: An Evening at Baba Pirzola"}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-forest/80 leading-relaxed font-normal">
            {isDe
              ? "Nur wenige Schritte vom KaDeWe entfernt verbindet das Baba Pirzola in der Bayreuther Straße die Großzügigkeit einer modernen Istanbuler Meyhane mit der Präzision eines erstklassigen Steakhauses. Ein Abend zwischen rauchigem Nazik Ali, zart schmelzendem Lokum Bonfile, saftigen Kuzu Pirzola und warmem Pistazien-Katmer."
              : "Just steps from KaDeWe on Bayreuther Straße, Baba Pirzola marries the generosity of a contemporary Istanbul meyhane with the precision of a prime steakhouse. An evening defined by smoky Nazik Ali, melt-in-the-mouth Lokum Bonfile, bone-in Kuzu Pirzola, and warm pistachio Katmer."}
          </p>

          {/* Community Visit Meta Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-forest/70 border-y border-forest/10 py-3">
            <span className="inline-flex items-center gap-1.5 font-semibold text-forest">
              <Camera className="h-3.5 w-3.5 text-[#E6B84A]" aria-hidden="true" />
              {isDe
                ? "6 kuratierte Community-Aufnahmen (4:3 Studio-Grading)"
                : "6 Curated Community Captures (4:3 Studio-Graded)"}
            </span>
            <span className="text-forest/30" aria-hidden="true">•</span>
            <span>Wittenbergplatz · Berlin-Schöneberg</span>
            <span className="text-forest/30" aria-hidden="true">•</span>
            <span className="inline-flex items-center gap-1 font-semibold text-[#A85C36]">
              <Flame className="h-3.5 w-3.5" aria-hidden="true" />
              {isDe ? "Holzkohlegrill, Meze & Türkische Weine" : "Charcoal Grill, Meze & Turkish Wines"}
            </span>
          </div>

          {/* Quick Facts Card */}
          <div className="mt-6 p-5 sm:p-6 rounded-3xl border border-forest/10 bg-white shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-[#E6B84A] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Viertel & Adresse" : "Neighborhood"}
                </span>
                <strong className="font-semibold text-forest">Baba Pirzola Meze & Grill</strong>
                <span className="block text-forest/70 text-xs">
                  Bayreuther Str. 35, 10789 Berlin
                </span>
                <span className="block text-forest/60 text-[11px]">
                  {isDe
                    ? "Am Wittenbergplatz / unweit KaDeWe"
                    : "At Wittenbergplatz / steps from KaDeWe"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Utensils className="h-4 w-4 text-[#7FA46B] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Verkostete Gänge" : "Tasted Courses"}
                </span>
                <strong className="font-semibold text-forest">
                  Kuzu Pirzola, Antrikot & Nazik Ali
                </strong>
                <span className="block text-forest/70 text-xs">
                  Lokum Bonfile, Karides Şiş, Gavurdağı Salatası
                </span>
                <span className="block text-forest/60 text-[11px]">
                  Katmer & Fırında Sütlaç Dondurmalı
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-[#E6B84A] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Küche & Zeiten" : "Kitchen Hours"}
                </span>
                <strong className="font-semibold text-forest">
                  {isDe ? "Täglich ab 12:00 Uhr geöffnet" : "Open Daily from 12:00 PM"}
                </strong>
                <span className="block text-forest/70 text-xs">Mo–Do & So: 12:00 – 00:00 Uhr</span>
                <span className="block text-forest/60 text-[11px]">Fr – Sa: 12:00 – 01:00 Uhr</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Article Content */}
        <main className="mx-auto max-w-4xl px-4 py-4 sm:px-6 space-y-12 pb-20">
          {/* SECTION 1: HERO FEAST TABLE */}
          <section className="space-y-6">
            <figure className="group max-w-2xl mx-auto relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest/5">
                <img
                  src="/magazin/baba-pirzola-berlin/01_baba_pirzola_feast_table_hd.jpg?v=4"
                  width={1200}
                  height={900}
                  fetchPriority="high"
                  decoding="async"
                  loading="eager"
                  alt={
                    isDe
                      ? "Gedeckte Tafel im Baba Pirzola Berlin mit Selections-Grillbrett (Üçü bir arada), Kuzu Pirzola, Lokum Bonfile, Gavurdağı Salatası, Patates Tava und Rakı"
                      : "Full table spread at Baba Pirzola Berlin featuring Selections grill board (Üçü bir arada), Kuzu Pirzola, Lokum Bonfile, Gavurdağı Salatası, Patates Tava, and Rakı"
                  }
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/90 backdrop-blur-md text-white px-3.5 py-1 text-xs font-bold shadow-md">
                    <Sparkles className="h-3.5 w-3.5 text-[#E6B84A]" aria-hidden="true" />
                    <span>
                      {isDe
                        ? "🍽️ Selections: Üçü bir arada & Meze-Tafel"
                        : "🍽️ Selections: Üçü bir arada & Meze Spread"}
                    </span>
                  </span>
                </div>
              </div>
              <figcaption className="mt-2.5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-forest/65">
                <span>
                  {isDe
                    ? "Gedeckte Marmortafel im Baba Pirzola: Selections-Holzbrett mit Kuzu Pirzola, Kuzu Küşleme & Lokum Bonfile, begleitet von Gavurdağı Salatası, knusprigen Patates Tava, Küçük Salata und Rakı auf Eis."
                    : "The marble table in full swing: Selections oak board with Kuzu Pirzola, Kuzu Küşleme & Lokum Bonfile, flanked by Gavurdağı Salatası, crisp Patates Tava, Küçük Salata, and chilled Rakı."}
                </span>
                <span className="italic text-[10px] text-forest/50 shrink-0">
                  {isDe ? "Aufnahme 1/6 · 4:3 HD" : "Capture 1/6 · 4:3 HD"}
                </span>
              </figcaption>
            </figure>

            <div className="text-forest/85 leading-relaxed text-base sm:text-lg space-y-4 pt-1">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest">
                {isDe
                  ? "Wenn der Berliner Westen nach Holzkohle, Walnuss und Granatapfel duftet"
                  : "Where West Berlin Smells of Charcoal, Walnut, and Pomegranate"}
              </h2>
              <p>
                {isDe
                  ? "Zwischen dem leuchtenden Portal des KaDeWe und dem Wittenbergplatz gehört der Berliner Westen den Eiligen. Doch wer nur wenige Schritte in die Bayreuther Straße einbiegt, betritt im Baba Pirzola eine andere Zeitzone. Dunkler Marmor, warm gedimmtes Kupferlicht und das leise Klirren von Rakı-Gläsern geben sofort den Ton an: Hier wird ein Abend nicht abgearbeitet, sondern Gang für Gang zelebriert."
                  : "Between the illuminated facade of KaDeWe and Wittenbergplatz, West Berlin belongs to people in a hurry. Yet turn just a few steps into Bayreuther Straße and Baba Pirzola welcomes you into a different tempo altogether. Dark marble, warmly dimmed amber light, and the gentle clink of Rakı glasses set the mood immediately: here, dinner is never rushed—it unfolds course by course."}
              </p>
              <p>
                {isDe
                  ? "Den Auftakt bildet das, was die Karte poetisch ‚Fırının Ruhu – Die Seele des Ofens‘ nennt: Noch dampfendes, hoch aufgegangenes Balon Ekmek direkt aus dem Steinofen, dazu würziger Tulum Keçi Peyniri und die ‚Vitrinden 4 kap Meze‘ – ein individuell zusammengestelltes Quartett aus der Frischevitrine. Unser Favorit auf der dunklen Tischplatte war jedoch sofort der Gavurdağı Salatası: fein gewürfelte Tomaten, knackige Walnusskerne, Petersilie und grüne Peperoni, gebunden von der tiefen, herb-süßen Säure echten Granatapfelsirups."
                  : "The evening begins with what the menu poetically calls 'Fırının Ruhu – The Soul of the Oven': pillowy, still-steaming Balon Ekmek straight from the stone hearth, paired with tangy Tulum Keçi Peyniri and 'Vitrinden 4 kap Meze'—a custom quartet chosen directly from the cold counter. Across the dark marble table, our immediate favorite was the Gavurdağı Salatası: finely diced tomatoes, crunchy walnuts, flat-leaf parsley, and green peperoni bound together by the deep, tart-sweet reduction of real pomegranate molasses."}
              </p>
            </div>

            {/* Editorial Pull-Quote (UX/UI Rhythm Enhancer) */}
            <blockquote className="my-6 rounded-3xl border-l-4 border-[#E6B84A] bg-white px-6 py-5 sm:px-8 sm:py-6 shadow-xs">
              <p className="font-display text-lg sm:text-xl italic text-forest leading-relaxed">
                {isDe
                  ? "„Das Geheimnis großer türkischer Grillkultur liegt im Kontrast: Erst wenn rauchige Hitze vom Rost auf kühlen Knoblauchjoghurt, herben Sumach und das Säuregerüst von Granatapfel trifft, entsteht echte Tiefe am Gaumen.“"
                  : "“The secret of great Turkish grill craft lies in contrast: only when smoky heat from the grates meets cool garlic yoghurt, bright sumac, and the tart backbone of pomegranate does true depth emerge on the palate.”"}
              </p>
              <footer className="mt-2 text-xs font-bold uppercase tracking-wider text-forest/55">
                {isDe
                  ? "— Aus dem Verkostungsprotokoll der Speisely Community"
                  : "— From the Speisely Community Tasting Notes"}
              </footer>
            </blockquote>
          </section>

          {/* SECTION 1.5: THE SPEISELY VERDICT / KURZFAZIT BENTO BOX */}
          <section
            aria-label={isDe ? "Das Speisely-Kurzfazit" : "The Speisely Tasting Verdict"}
            className="rounded-3xl border border-forest/15 bg-gradient-to-br from-white via-white to-[#FAF7F0] p-6 sm:p-8 shadow-sm space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-forest/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#083822] text-[#E6B84A] shadow-xs">
                  <Award className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#7FA46B]">
                    {isDe ? "Kompakter Überblick" : "At-a-Glance Scorecard"}
                  </span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-forest">
                    {isDe
                      ? "Das Speisely-Kurzfazit zum Baba Pirzola"
                      : "The Speisely Verdict on Baba Pirzola"}
                  </h2>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-[#EBF4EC] px-3.5 py-1 text-xs font-bold text-forest border border-[#7FA46B]/25">
                <span>★</span>
                <span>{isDe ? "Community-Favorit in Schöneberg" : "Community Favorite in Schöneberg"}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl bg-[#FAF7F0]/80 p-4 border border-forest/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A85C36] block">
                  {isDe ? "01 · Grill-Handwerk" : "01 · Charcoal Craft"}
                </span>
                <strong className="mt-1 block font-display text-base font-bold text-forest">
                  {isDe ? "Punktgenaue Röstaromen" : "Precision Sear & Juiciness"}
                </strong>
                <p className="mt-1 text-xs text-forest/75 leading-relaxed">
                  {isDe
                    ? "Kuzu Pirzola mit knuspriger Fettkruste am Knochen und Lokum Bonfile, das seinem Namen (‚butterzart wie Türkischer Honig‘) alle Ehre macht."
                    : "Kuzu Pirzola with crisp bone-in fat rendering and Lokum Bonfile that truly lives up to its name ('tender as Turkish delight')."}
                </p>
              </div>

              <div className="rounded-2xl bg-[#FAF7F0]/80 p-4 border border-forest/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7FA46B] block">
                  {isDe ? "02 · Signature-Gang" : "02 · Signature Dish"}
                </span>
                <strong className="mt-1 block font-display text-base font-bold text-forest">
                  {isDe ? "Nazik Ali & Antrikot" : "Nazik Ali & Antrikot"}
                </strong>
                <p className="mt-1 text-xs text-forest/75 leading-relaxed">
                  {isDe
                    ? "Rauchiges Auberginenpüree unter saftigem Lamm-Kalbs-Spieß (Nazik Ali) und 300 g Antrikot mit schmelzender Chili-Kräuterbutter."
                    : "Smoky eggplant purée beneath a juicy lamb-veal skewer (Nazik Ali) and 300 g Antrikot crowned with melting chili-herb butter."}
                </p>
              </div>

              <div className="rounded-2xl bg-[#FAF7F0]/80 p-4 border border-forest/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E6B84A] block">
                  {isDe ? "03 · Tatlılar (Finale)" : "03 · Tatlılar (Finale)"}
                </span>
                <strong className="mt-1 block font-display text-base font-bold text-forest">
                  {isDe ? "Katmer & Fırında Sütlaç" : "Katmer & Fırında Sütlaç"}
                </strong>
                <p className="mt-1 text-xs text-forest/75 leading-relaxed">
                  {isDe
                    ? "Frisch gebackenes, hauchdünnes Pistazien-Katmer und im Tontopf karamellisierter Fırında Sütlaç Dondurmalı mit kühler Eiskugel."
                    : "Freshly baked paper-thin pistachio Katmer and clay-pot caramelized Fırında Sütlaç Dondurmalı topped with cool vanilla ice cream."}
                </p>
              </div>

              <div className="rounded-2xl bg-[#FAF7F0]/80 p-4 border border-forest/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-forest/60 block">
                  {isDe ? "04 · Idealer Anlass" : "04 · Best Occasion"}
                </span>
                <strong className="mt-1 block font-display text-base font-bold text-forest">
                  {isDe ? "Lange Tafeln & Weinabende" : "Group Feasts & Wine Nights"}
                </strong>
                <p className="mt-1 text-xs text-forest/75 leading-relaxed">
                  {isDe
                    ? "Perfekt zum Teilen der großen ‚Selections‘-Holzbretter zu zweit oder in der Runde, begleitet von Urla-Weinen oder Göbek Rakı."
                    : "Built for sharing the generous 'Selections' oak boards as a couple or group alongside Urla estate wines or Göbek Rakı."}
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 2: NAZIK ALI & MEZE TRADITION */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-forest/10 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7FA46B] block mb-1">
                {isDe ? "Kebap-Handwerk & Rauch-Aromatik" : "Kebap Craft & Smoky Aromatics"}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest">
                {isDe
                  ? "Nazik Ali: Wenn rauchige Aubergine auf saftiges Lamm und Kalb trifft"
                  : "Nazik Ali: Where Flame-Roasted Eggplant Meets Juicy Lamb and Veal"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4 text-forest/80 text-sm sm:text-base leading-relaxed">
                <p>
                  {isDe
                    ? "In der südostanatolischen Küche von Gaziantep gilt das Gericht als Gradmesser für die Geduld eines Grillmeisters – im Baba Pirzola steht es als ‚Nazik Ali‘ auf der Karte und gehörte für uns zu den eindrucksvollsten Tellern des Abends."
                    : "In the southeastern Anatolian kitchen of Gaziantep, this dish is considered the ultimate test of a grill master's patience—at Baba Pirzola it appears on the menu as 'Nazik Ali' and ranked among the most memorable plates of our evening."}
                </p>
                <p>
                  {isDe
                    ? "Das Fundament bildet ein samtiges Püree aus über offener Glut gerösteten Auberginen, das mit einer warmen Joghurt-Butter-Knoblauchsoße aufgeschlagen wird. Darauf ruhen saftige Stücke vom gegrillten Hackfleischspieß aus Lamm- und Kalbsfleisch, vollendet mit aufgeschäumter Paprikabutter, geschmorter Tomate und gegrillter Spitzpaprika."
                    : "The foundation is a velvety purée of eggplants blistered over open embers and folded into a warm yoghurt-butter-garlic sauce. Resting on top are juicy medallions of charcoal-grilled lamb and veal minced skewer, finished with sizzling paprika butter, roasted tomato, and charred green pepper."}
                </p>
                <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-forest/10 space-y-1.5">
                  <strong className="text-forest block text-sm sm:text-base">
                    {isDe
                      ? "💡 Warum dieser Gang im Gedächtnis bleibt:"
                      : "💡 Why This Dish Stays in Your Memory:"}
                  </strong>
                  <p className="text-xs sm:text-sm text-forest/75 leading-relaxed">
                    {isDe
                      ? "Statt im Joghurt unterzugehen, behält der Lamm-Kalbs-Spieß seinen kräftigen Grillbiss, während das Auberginenbett eine feine, fast nussige Rauchnote beisteuert – perfekt zum Auftunken mit warmem Balon Ekmek."
                      : "Rather than getting lost in the yoghurt, the lamb-and-veal skewer retains its bold charcoal sear while the eggplant bed contributes a delicate, almost nutty smokiness—irresistible when scooped up with warm Balon Ekmek."}
                  </p>
                </div>
              </div>

              {/* Nazik Ali Photo */}
              <figure className="space-y-2">
                <div className="group relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest/5">
                    <img
                      src="/magazin/baba-pirzola-berlin/05_baba_pirzola_ali_nazik_kebab_hd.jpg?v=4"
                      width={1200}
                      height={900}
                      decoding="async"
                      loading="lazy"
                      alt={
                        isDe
                          ? "Nazik Ali bei Baba Pirzola Berlin: Gegrillter Hackfleischspieß aus Lamm- und Kalbsfleisch auf geröstetem Auberginenpüree in Joghurt-Butter-Knoblauchsoße"
                          : "Nazik Ali at Baba Pirzola Berlin: Grilled lamb and veal minced meat skewer on roasted eggplant puree in yoghurt-butter-garlic sauce"
                      }
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-forest/90 text-white px-3 py-1 text-[11px] font-bold backdrop-blur-md shadow-md">
                        {isDe ? "🍆 Kebap-Klassiker: Nazik Ali" : "🍆 Kebap Classic: Nazik Ali"}
                      </span>
                    </div>
                  </div>
                </div>
                <figcaption className="text-center text-[11px] text-forest/60 italic px-2">
                  {isDe
                    ? "Aufnahme 2/6 · Nazik Ali: Lamm- & Kalbs-Hackfleischspieß auf geröstetem Auberginenpüree in Joghurt-Butter-Knoblauchsoße"
                    : "Capture 2/6 · Nazik Ali: Lamb & veal skewer on flame-roasted eggplant purée in yoghurt-butter-garlic sauce"}
                </figcaption>
              </figure>
            </div>
          </section>

          {/* SECTION 3: THE GRILL MASTERPIECES (2-Column Side-by-Side) */}
          <section className="space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#A85C36] block mb-1">
                {isDe
                  ? "Selections & Babalar Grill Spezial"
                  : "Selections & Babalar Grill Spezial"}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest">
                {isDe
                  ? "Auf dem Eichenbrett serviert: Kuzu Pirzola, Lokum Bonfile, Karides Şiş & 300 g Antrikot"
                  : "Served on Solid Oak: Kuzu Pirzola, Lokum Bonfile, Karides Şiş & 300 g Antrikot"}
              </h2>
              <p className="mt-2 text-forest/80 text-sm sm:text-base leading-relaxed">
                {isDe
                  ? "Herzstück der Karte sind die ‚Selections‘-Platten – darunter ‚Üçü bir arada (Dreierlei)‘, ‚Dördü bir arada (Viererlei)‘, ‚Klasik‘ sowie ‚Deniz & Çayır (Surf & Turf)‘ – und die einzelneren Reifecuts unter ‚Babalar Grill Spezial‘. Wer mit Freunden am Tisch sitzt, erlebt hier die ganze Dramaturgie des Holzkohlegrills auf einem einzigen Brett."
                  : "At the heart of the menu are the 'Selections' boards—including 'Üçü bir arada (Three-Way)', 'Dördü bir arada (Four-Way)', 'Klasik', and 'Deniz & Çayır (Surf & Turf)'—alongside individual prime cuts under 'Babalar Grill Spezial'. Shared across the table, they showcase the full range of the charcoal grill on a single oak board."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl md:max-w-none mx-auto">
              {/* Card 1: Selections Deniz & Çayır (Surf & Turf) / Klasik */}
              <figure className="group relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl flex flex-col">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest/5">
                  <img
                    src="/magazin/baba-pirzola-berlin/02_baba_pirzola_mixed_grill_board_hd.jpg?v=4"
                    width={1200}
                    height={900}
                    decoding="async"
                    loading="lazy"
                    alt={
                      isDe
                        ? "Selections-Grillbrett bei Baba Pirzola mit Kuzu Pirzola, Lokum Bonfile, Karides Şiş, Tavuk Külbastı und Kuzu Şiş"
                        : "Selections grill board at Baba Pirzola with Kuzu Pirzola, Lokum Bonfile, Karides Şiş, Tavuk Külbastı, and Kuzu Şiş"
                    }
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-forest/90 backdrop-blur-md text-white px-3 py-1 text-[11px] font-bold shadow-md">
                      <span>🔥</span>
                      <span>
                        {isDe
                          ? "Deniz & Çayır (Surf & Turf) & Klasik"
                          : "Deniz & Çayır (Surf & Turf) & Klasik"}
                      </span>
                    </span>
                  </div>
                </div>
                <figcaption className="p-2 pt-3 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-forest">
                      {isDe
                        ? "Kuzu Pirzola, Lokum Bonfile, Karides Şiş & Tavuk Külbastı"
                        : "Kuzu Pirzola, Lokum Bonfile, Karides Şiş & Tavuk Külbastı"}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-forest/75 leading-relaxed">
                      {isDe
                        ? "Die Namensgeber des Hauses – saftig am Knochen gegrillte Lamm-Koteletts (Kuzu Pirzola) – treffen auf butterzarte Medaillons vom Kalbsfilet (Lokum Bonfile), glasig-rösche Garnelenspieße (Karides Şiş), saftig ausgelöste Hähnchenschenkel (Tavuk Külbastı) sowie marinierte Kuzu Şiş- und Tavuk Şiş-Spieße."
                        : "The house's namesake bone-in lamb chops (Kuzu Pirzola) meet melt-in-the-mouth veal fillet medallions (Lokum Bonfile), flame-kissed shrimp skewers (Karides Şiş), juicy boneless chicken thighs (Tavuk Külbastı), and marinated Kuzu Şiş and Tavuk Şiş skewers."}
                    </p>
                  </div>
                  <span className="mt-3 block text-[10px] italic text-forest/45">
                    {isDe ? "Aufnahme 3/6 · Selections-Holzbrett" : "Capture 3/6 · Selections Oak Board"}
                  </span>
                </figcaption>
              </figure>

              {/* Card 2: Babalar Grill Spezial - Antrikot (300 g) */}
              <figure className="group relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl flex flex-col">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest/5">
                  <img
                    src="/magazin/baba-pirzola-berlin/03_baba_pirzola_antrikot_herb_butter_hd.jpg?v=4"
                    width={1200}
                    height={900}
                    decoding="async"
                    loading="lazy"
                    alt={
                      isDe
                        ? "Babalar Grill Spezial: Antrikot 300 g (Saftig gegrilltes Entrecôte) mit Kräuterbutter und Sumach-Zwiebeln auf dem Holzbrett"
                        : "Babalar Grill Spezial: Antrikot 300 g (Juicy grilled entrecôte) with herb butter and sumac onions on wooden board"
                    }
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-forest/90 backdrop-blur-md text-white px-3 py-1 text-[11px] font-bold shadow-md">
                      <span>🥩</span>
                      <span>
                        {isDe ? "Babalar Grill Spezial: Antrikot" : "Babalar Grill Spezial: Antrikot"}
                      </span>
                    </span>
                  </div>
                </div>
                <figcaption className="p-2 pt-3 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-forest">
                      {isDe
                        ? "Antrikot (300 g) – Saftig gegrilltes Entrecôte mit Kräuterbutter"
                        : "Antrikot (300 g) – Charcoal-Grilled Entrecôte with Herb Butter"}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-forest/75 leading-relaxed">
                      {isDe
                        ? "Aus der Sektion ‚Babalar Grill Spezial‘: 300 Gramm fein marmoriertes Entrecôte (Antrikot) mit tiefem Röst-Branding, auf dessen warmer Kruste eine Rolle aus Chili-Kräuterbutter langsam schmilzt – begleitet von violetten Sumach-Zwiebeln und Rucola."
                        : "From the 'Babalar Grill Spezial' section: 300 grams of richly marbled entrecôte (Antrikot) with bold diamond sear marks, crowned with a roll of chili-herb butter slowly melting across the crust—served with purple sumac onions and rocket."}
                    </p>
                  </div>
                  <span className="mt-3 block text-[10px] italic text-forest/45">
                    {isDe ? "Aufnahme 4/6 · Antrikot (300 g)" : "Capture 4/6 · Antrikot (300 g)"}
                  </span>
                </figcaption>
              </figure>
            </div>
          </section>

          {/* SECTION 4: SWEET FINALE DUO (Tatlılar: Katmer & Fırında Sütlaç Dondurmalı) */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-forest/10 shadow-xs space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E6B84A]">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>
                  {isDe
                    ? "Tatlılar – Das süße Finale"
                    : "Tatlılar – The Sweet Finale"}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest">
                {isDe
                  ? "Wärme, Knusper & Pistazie: Katmer und Fırında Sütlaç Dondurmalı"
                  : "Warmth, Crunch & Pistachio: Katmer and Fırında Sütlaç Dondurmalı"}
              </h2>
              <p className="text-forest/80 leading-relaxed text-sm sm:text-base">
                {isDe
                  ? "Ein Abend im Baba Pirzola endet selten ohne einen Blick auf die ‚Tatlılar‘-Sektion. Während an den Nachbartischen oft das heiß gezogene Baba Künefe oder klassisches Baklava serviert wird, entschieden wir uns für das Kontrast-Duo aus dem Ofen: knuspriges Pistazien-Katmer und karamellisierten Fırında Sütlaç Dondurmalı im traditionellen Tontopf."
                  : "An evening at Baba Pirzola rarely ends without exploring the 'Tatlılar' section. While neighboring tables often order hot cheese-pull Baba Künefe or classic Baklava, we chose a study in oven-baked contrasts: crispy pistachio Katmer and caramelized Fırında Sütlaç Dondurmalı in a traditional terracotta pot."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dessert 1: Katmer */}
              <figure className="group relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl flex flex-col">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest/5">
                  <img
                    src="/magazin/baba-pirzola-berlin/06_baba_pirzola_katmer_pistachio_hd.jpg?v=4"
                    width={1200}
                    height={900}
                    decoding="async"
                    loading="lazy"
                    alt={
                      isDe
                        ? "Katmer bei Baba Pirzola Berlin: Knusprige Teigtasche mit Pistazien und Sahne auf dem Holzbrett"
                        : "Katmer at Baba Pirzola Berlin: Crispy puff pastry pocket with pistachios and cream on a wooden board"
                    }
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-forest/90 text-white px-3 py-1 text-[11px] font-bold backdrop-blur-md shadow-md">
                      {isDe ? "🥐 Tatlılar: Katmer" : "🥐 Tatlılar: Katmer"}
                    </span>
                  </div>
                </div>
                <figcaption className="p-2 pt-3 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-forest">
                      {isDe
                        ? "Katmer – Hauchdünne Teigtasche mit Pistazien & Sahne"
                        : "Katmer – Paper-Thin Pastry with Pistachios & Cream"}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-forest/75 leading-relaxed">
                      {isDe
                        ? "Schon beim Anschneiden splittert der goldbraun gebackene Blätterteig hörbar auf und gibt das warme Innere aus geschmolzener Sahne und leuchtend grünen, gerösteten Pistazien frei – nicht zu süß, sondern intensiv nussig."
                        : "At the first touch of the fork, the golden-baked phyllo shatters audibly, revealing a warm center of rich cream and vibrant green roasted pistachios—never cloying, deeply nutty, and impossibly crisp."}
                    </p>
                  </div>
                  <span className="mt-3 block text-[10px] italic text-forest/45">
                    {isDe ? "Aufnahme 5/6 · Katmer mit Pistazien" : "Capture 5/6 · Pistachio Katmer"}
                  </span>
                </figcaption>
              </figure>

              {/* Dessert 2: Fırında Sütlaç Dondurmalı */}
              <figure className="group relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl flex flex-col">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest/5">
                  <img
                    src="/magazin/baba-pirzola-berlin/04_baba_pirzola_firin_suetlac_pistachio_hd.jpg?v=4"
                    width={1200}
                    height={900}
                    decoding="async"
                    loading="lazy"
                    alt={
                      isDe
                        ? "Fırında Sütlaç Dondurmalı bei Baba Pirzola Berlin: Türkischer Milchreis mit Zimt, Eiscreme und Pistazien im Tontopf"
                        : "Fırında Sütlaç Dondurmalı at Baba Pirzola Berlin: Turkish rice pudding with cinnamon, ice cream, and pistachios in a clay pot"
                    }
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-forest/90 text-white px-3 py-1 text-[11px] font-bold backdrop-blur-md shadow-md">
                      {isDe ? "🍨 Fırında Sütlaç Dondurmalı" : "🍨 Fırında Sütlaç Dondurmalı"}
                    </span>
                  </div>
                </div>
                <figcaption className="p-2 pt-3 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-forest">
                      {isDe
                        ? "Fırında Sütlaç Dondurmalı – Karamellisiert im Tontopf"
                        : "Fırında Sütlaç Dondurmalı – Baked in Terracotta"}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-forest/75 leading-relaxed">
                      {isDe
                        ? "Unter der im Ofen gebräunten Decke verbirgt sich cremiger türkischer Milchreis im rustikalen Tontopf, gekrönt von einer schmelzenden Kugel Vanilleeis, feiner Zimtwürze und gehackten Pistazien."
                        : "Beneath its oven-bronzed top hides creamy Turkish rice pudding baked in a rustic terracotta pot, crowned with a melting scoop of vanilla ice cream, warm cinnamon, and crushed pistachios."}
                    </p>
                  </div>
                  <span className="mt-3 block text-[10px] italic text-forest/45">
                    {isDe ? "Aufnahme 6/6 · Fırında Sütlaç Dondurmalı" : "Capture 6/6 · Fırında Sütlaç Dondurmalı"}
                  </span>
                </figcaption>
              </figure>
            </div>
          </section>

          {/* SECTION 5: VEGETARIAN & WINE CULTURE HIGHLIGHT */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-forest/10 shadow-xs space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7FA46B]">
              <Wine className="h-4 w-4" aria-hidden="true" />
              <span>
                {isDe
                  ? "Weinkultur, Rakı & Vegetarische Küche"
                  : "Wine Culture, Rakı & Vegetarian Table"}
              </span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-forest">
              {isDe
                ? "Warum der Tisch auch für Weinliebhaber und Vegetarier funktioniert"
                : "Why the Table Shines Equally for Wine Lovers and Vegetarians"}
            </h3>
            <p className="text-forest/80 leading-relaxed text-sm sm:text-base">
              {isDe
                ? "Obwohl der Holzkohlegrill im Mittelpunkt steht, zeigt sich die Küche bei den fleischlosen Gängen ebenso detailverliebt: Neben den vierfach kombinierbaren ‚Vitrinden 4 kap Meze‘ überzeugen warme Tontopf-Gerichte wie Kiraz Domatesli Keçi Peyniri (geschmolzener Ziegenkäse mit Kirschtomaten) oder Patlıcan Yatağında Kuşkonmaz (gegrillter grüner Spargel auf Auberginen-Joghurtsauce). Wer statt Yeni oder Göbek Rakı lieber Wein zum Lamm wählt, findet auf der Karte charakterstarke anatolische und ägäische Gewächse von Weingütern wie Urla, Yedibilgeler, Lucien Arkas und Kavaklıdere."
                : "Even though the charcoal grill takes center stage, the kitchen treats meatless courses with equal care: alongside the customizable 'Vitrinden 4 kap Meze', warm clay-pot dishes like Kiraz Domatesli Keçi Peyniri (baked goat cheese with cherry tomatoes) and Patlıcan Yatağında Kuşkonmaz (charred green asparagus on eggplant-yoghurt sauce) stand on their own. And for guests who prefer wine over Yeni or Göbek Rakı, the cellar highlights expressive Anatolian and Aegean bottles from estates including Urla, Yedibilgeler, Lucien Arkas, and Kavaklıdere."}
            </p>
          </section>

          {/* SECTION 6: TRANSPARENCY & PHOTO ENHANCEMENT DISCLOSURE */}
          <section className="rounded-2xl p-4 sm:p-5 bg-white/60 border border-forest/10 text-xs text-forest/70 space-y-2">
            <div className="flex items-center gap-2 font-bold text-forest">
              <Info className="h-4 w-4 text-[#7FA46B]" aria-hidden="true" />
              <span>
                {isDe
                  ? "Transparenzhinweis & Redaktionelle Foto-Information"
                  : "Transparency Note & Editorial Photo Disclosure"}
              </span>
            </div>
            <p className="leading-relaxed">
              {isDe
                ? "Dieser Beitrag ist Teil unserer unabhängigen Reihe ‚Speisely Community Stories‘. Alle 6 Aufnahmen stammen von einem echten Vor-Ort-Besuch aus unserer Community und wurden für das Magazin-Format auf ein einheitliches 4:3-Retina-Verhältnis (1200×900 px) zugeschnitten sowie in Lichterzeichnung, Kontrast und Farbtemperatur schonend abgestimmt."
                : "This feature is part of our independent 'Speisely Community Stories' series. All 6 photographs were captured during a real on-site dining visit by our community and cropped to a unified 4:3 retina ratio (1200×900 px) with gentle highlight roll-off and studio color grading."}
            </p>
          </section>

          {/* SECTION 7: SPEISELY BERLIN DISCOVERY & INTERNAL SEO FUNNEL (Digital Marketer Upgrade) */}
          <section
            aria-label={
              isDe
                ? "Kulinarik & Catering in Berlin auf Speisely entdecken"
                : "Discover Berlin Restaurants & Catering on Speisely"
            }
            className="rounded-3xl bg-[#083822] text-[#FAF7F0] p-6 sm:p-8 shadow-lg space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E6B84A]">
                  <Compass className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {isDe
                      ? "Speisely Berlin · Kulinarischer Kompass"
                      : "Speisely Berlin · Culinary Compass"}
                  </span>
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  {isDe
                    ? "Du planst ein besonderes Essen oder ein Event in Berlin?"
                    : "Planning a Memorable Dinner or Event in Berlin?"}
                </h3>
                <p className="text-xs sm:text-sm text-white/75 max-w-2xl leading-relaxed">
                  {isDe
                    ? "Entdecke handverlesene Berliner Restaurants, vergleiche Event-Caterer für Firmenfeiern und Hochzeiten oder lies weitere echte Besuchsberichte aus unserer Community."
                    : "Explore handpicked Berlin restaurants, compare event caterers for corporate gatherings and weddings, or read more real dining dispatches from our community."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
              <Link
                to="/restaurants"
                className="group rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 p-4 transition flex flex-col justify-between gap-3"
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#E6B84A]">
                    {isDe ? "Restaurant-Guide" : "Restaurant Guide"}
                  </span>
                  <strong className="mt-1 block font-display text-base font-bold text-white">
                    {isDe ? "Restaurants entdecken" : "Explore Restaurants"}
                  </strong>
                  <p className="mt-1 text-xs text-white/70">
                    {isDe
                      ? "Kuratierte Adressen, Speisekarten & echte Einblicke."
                      : "Curated dining spots, menus & authentic insights."}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#E6B84A] group-hover:translate-x-1 transition-transform">
                  <span>{isDe ? "Zum Verzeichnis" : "Browse Directory"}</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>

              <Link
                to="/catering"
                className="group rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 p-4 transition flex flex-col justify-between gap-3"
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#7FA46B]">
                    {isDe ? "Events & Feiern" : "Events & Gatherings"}
                  </span>
                  <strong className="mt-1 block font-display text-base font-bold text-white">
                    {isDe ? "Catering & Menüs anfragen" : "Book Event Catering"}
                  </strong>
                  <p className="mt-1 text-xs text-white/70">
                    {isDe
                      ? "Von Mezze-Buffets bis hin zu Live-Grill-Catering für dein Fest."
                      : "From mezze spreads to live grill catering for your celebration."}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#E6B84A] group-hover:translate-x-1 transition-transform">
                  <span>{isDe ? "Caterer vergleichen" : "Compare Caterers"}</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>

              <Link
                to="/community"
                className="group rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 p-4 transition flex flex-col justify-between gap-3"
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#E6B84A]">
                    {isDe ? "Magazin & Stories" : "Magazine & Stories"}
                  </span>
                  <strong className="mt-1 block font-display text-base font-bold text-white">
                    {isDe ? "Weitere Community-Berichte" : "More Community Stories"}
                  </strong>
                  <p className="mt-1 text-xs text-white/70">
                    {isDe
                      ? "King Tut, Chi Mc, Schnitzel Schmiede & mehr im Überblick."
                      : "King Tut, Chi Mc, Schnitzel Schmiede & more culinary stories."}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#E6B84A] group-hover:translate-x-1 transition-transform">
                  <span>{isDe ? "Alle Berichte lesen" : "Read All Stories"}</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
            </div>
          </section>

          {/* SECTION 8: COMMUNITY CALLOUT */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-forest/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF4EC] text-forest px-3 py-1 text-xs font-bold">
                <Users className="h-3.5 w-3.5 text-[#7FA46B]" aria-hidden="true" />
                <span>{isDe ? "Teile deine Food-Momente" : "Share Your Food Moments"}</span>
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-forest">
                {isDe
                  ? "Warst du auch bei Baba Pirzola oder hast einen Berliner Favoriten?"
                  : "Have you visited Baba Pirzola or found another Berlin favorite?"}
              </h3>
              <p className="text-forest/70 text-xs sm:text-sm max-w-xl">
                {isDe
                  ? "Schick uns deine Fotos und deine Geschichte. Wir veröffentlichen echte Empfehlungen aus der Speisely Community, um besondere Gastgeber sichtbar zu machen."
                  : "Send us your photos and your story. We publish authentic recommendations from the Speisely Community to spotlight standout culinary hosts."}
              </p>
            </div>
            <a
              href={mailtoHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-forest text-white px-6 py-3 text-xs font-bold hover:bg-forest/90 transition shadow-md shrink-0"
            >
              <span>{isDe ? "Erlebnis einsenden" : "Send Your Experience"}</span>
            </a>
          </section>
        </main>

        <AboutSpeiselySection />
      </div>
    </SiteShell>
  );
}
