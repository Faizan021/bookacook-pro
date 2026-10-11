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
          "Community-Besuch bei Baba Pirzola Berlin: Kuzu Pirzola, Lokum Bonfile, Nazik Ali, Antrikot, Katmer & Fırında Sütlaç Dondurmalı.",
      },
      {
        name: "keywords",
        content:
          "Baba Pirzola Berlin, Türkisches Restaurant Wittenbergplatz, Kuzu Pirzola, Lokum Bonfile, Nazik Ali, Antrikot, Fırında Sütlaç Dondurmalı, Katmer, Gavurdağı Salatası, Speisely Community Story",
      },
      { name: "geo.region", content: "DE-BE" },
      { name: "geo.placename", content: "Berlin-Schöneberg" },
      { name: "geo.position", content: "52.5015;13.3444" },
      { name: "ICBM", content: "52.5015, 13.3444" },
      {
        property: "og:title",
        content: "Community-Besuch: Baba Pirzola Meze & Grill am Wittenbergplatz | Speisely",
      },
      {
        property: "og:description",
        content:
          "Ein Speisely Community-Mitglied besucht Baba Pirzola in der Bayreuther Str. 35: Kuzu Pirzola, Deniz & Çayır Surf & Turf, Nazik Ali, Katmer und Fırında Sütlaç Dondurmalı.",
      },
      {
        property: "og:image",
        content:
          "https://speisely.de/magazin/baba-pirzola-berlin/01_baba_pirzola_feast_table_hd.jpg?v=3",
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
                "Hohe Grillkunst am Wittenbergplatz: Unser Community-Abend im Baba Pirzola Berlin",
              description:
                "Ein Speisely Community-Mitglied war zu Gast im Baba Pirzola Meze & Grill in der Bayreuther Straße 35 nahe dem KaDeWe und teilt Eindrücke von Kuzu Pirzola, Lokum Bonfile, Nazik Ali, Antrikot, Katmer und Fırında Sütlaç Dondurmalı.",
              image: {
                "@type": "ImageObject",
                url: "https://speisely.de/magazin/baba-pirzola-berlin/01_baba_pirzola_feast_table_hd.jpg?v=3",
                width: 1200,
                height: 900,
              },
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
                telephone: "+49 30 43662023",
                url: "https://babapirzola.de/",
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
    : `Hello Speisely Team,\n\nI visited Baba Pirzola Meze & Grill in Berlin and want to share my experience.\n\nFavorite dish:\nAtmosphere & Service:\nFotos attached:`;

  const mailtoHref = `mailto:info@speisely.de?subject=${encodeURIComponent(
    emailSubject,
  )}&body=${encodeURIComponent(emailBody)}`;

  return (
    <SiteShell>
      <div className="bg-[#FAF7F0] text-forest min-h-screen">
        {/* Breadcrumb Bar */}
        <div className="border-b border-forest/10 bg-white/70 backdrop-blur-md sticky top-16 z-30">
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
                : "Experience from the Speisely Community"}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-[44px] font-bold text-forest leading-[1.18] tracking-tight">
            {isDe
              ? "Feuer, Meze & große Grillkunst am Wittenbergplatz: Ein Abend im Baba Pirzola"
              : "Fire, Meze & High Grill Craft at Wittenbergplatz: An Evening at Baba Pirzola"}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-forest/80 leading-relaxed font-normal">
            {isDe
              ? "Nur wenige Schritte vom KaDeWe entfernt zelebriert das Baba Pirzola in der Bayreuther Straße 35 klassische türkische Grillspeisen und Weine. Ein Mitglied unserer Speisely Community hat sich durch Kuzu Pirzola, Lokum Bonfile, Karides Şiş, rauchiges Nazik Ali, saftiges Antrikot sowie Katmer und Fırında Sütlaç Dondurmalı probiert."
              : "Just steps from KaDeWe on Bayreuther Straße 35, Baba Pirzola celebrates classic Turkish charcoal grill specialties and fine wines. A member of our Speisely Community experienced Kuzu Pirzola, Lokum Bonfile, Karides Şiş, smoky Nazik Ali, juicy Antrikot, plus Katmer and Fırında Sütlaç Dondurmalı."}
          </p>

          {/* Community Visit Meta Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-forest/70 border-y border-forest/10 py-3">
            <span className="inline-flex items-center gap-1.5 font-semibold text-forest">
              <Camera className="h-3.5 w-3.5 text-[#E6B84A]" />
              {isDe
                ? "Echte Community-Aufnahmen (HD-optimiert)"
                : "Authentic Community Photos (HD-Enhanced)"}
            </span>
            <span className="text-forest/30">•</span>
            <span>
              {isDe ? "Wittenbergplatz · Berlin-Schöneberg" : "Wittenbergplatz · Berlin-Schöneberg"}
            </span>
            <span className="text-forest/30">•</span>
            <span className="inline-flex items-center gap-1 font-semibold text-[#A85C36]">
              <Flame className="h-3.5 w-3.5" />
              {isDe ? "Türkische Meze & Holzkohlegrill" : "Turkish Meze & Charcoal Grill"}
            </span>
          </div>

          {/* Quick Facts Card */}
          <div className="mt-6 p-5 sm:p-6 rounded-3xl border border-forest/10 bg-white shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-[#E6B84A] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Adresse" : "Location"}
                </span>
                <strong className="font-semibold text-forest">Baba Pirzola Meze & Grill</strong>
                <span className="block text-forest/70 text-xs">
                  Bayreuther Str. 35, 10789 Berlin
                </span>
                <span className="block text-forest/60 text-[11px]">
                  {isDe
                    ? "Direkt am Wittenbergplatz / nahe KaDeWe"
                    : "Right at Wittenbergplatz / near KaDeWe"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Utensils className="h-4 w-4 text-[#7FA46B] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Unsere Auswahl" : "What We Ordered"}
                </span>
                <strong className="font-semibold text-forest">
                  {isDe
                    ? "Kuzu Pirzola, Antrikot & Nazik Ali"
                    : "Kuzu Pirzola, Antrikot & Nazik Ali"}
                </strong>
                <span className="block text-forest/70 text-xs">
                  {isDe
                    ? "Lokum Bonfile, Karides Şiş, Gavurdağı Salatası, Patates Tava"
                    : "Lokum Bonfile, Karides Şiş, Gavurdağı Salatası, Patates Tava"}
                </span>
                <span className="block text-forest/60 text-[11px]">
                  {isDe
                    ? "Katmer & Fırında Sütlaç Dondurmalı"
                    : "Katmer & Fırında Sütlaç Dondurmalı"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-[#E6B84A] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Öffnungszeiten" : "Opening Hours"}
                </span>
                <strong className="font-semibold text-forest">
                  {isDe ? "Täglich ab 12:00 Uhr" : "Open Daily from 12:00 PM"}
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
          <section className="space-y-4">
            <div className="max-w-2xl mx-auto relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest/5">
                <img
                  src="/magazin/baba-pirzola-berlin/01_baba_pirzola_feast_table_hd.jpg?v=3"
                  alt={
                    isDe
                      ? "Gedeckte Tafel im Baba Pirzola Berlin mit Selections-Grillbrett (Üçü bir arada), Gavurdağı Salatası, Patates Tava, Küçük Salata und Rakı"
                      : "Full table spread at Baba Pirzola Berlin featuring Selections grill board (Üçü bir arada), Gavurdağı Salatası, Patates Tava, Küçük Salata, and Rakı"
                  }
                  className="h-full w-full object-cover"
                  loading="eager"
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
              <div className="mt-2.5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-forest/60">
                <span>
                  {isDe
                    ? "Die gedeckte Tafel: Selections-Holzbrett (Kuzu Pirzola, Kuzu Küşleme & Lokum Bonfile) begleitet von Gavurdağı Salatası mit Walnüssen & Granatapfelsirup, Patates Tava, Küçük Salata und Yeni/Göbek Rakı."
                    : "The full table spread: Selections oak board (Kuzu Pirzola, Kuzu Küşleme & Lokum Bonfile) served with Gavurdağı Salatası (walnuts & pomegranate syrup), Patates Tava, Küçük Salata, and Yeni/Göbek Rakı."}
                </span>
                <span className="italic text-[10px] text-forest/50 shrink-0">
                  {isDe ? "Community-Aufnahme (4:3 HD)" : "Community Capture (4:3 HD)"}
                </span>
              </div>
            </div>

            <div className="text-forest/85 leading-relaxed text-base sm:text-lg space-y-4 pt-2">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest">
                {isDe
                  ? "„Ein Ort, an dem man nicht einfach nur isst, sondern den ganzen Abend zelebriert“"
                  : "“A place where you don’t just eat, but celebrate the entire evening”"}
              </h2>
              <p>
                {isDe
                  ? "Rund um den Wittenbergplatz und das KaDeWe pulsiert der Berliner Westen. Wer nur ein paar Meter in die ruhigere Bayreuther Straße einbiegt, steht vor der eleganten Fassade des Baba Pirzola. Schon der Name gibt das kulinarische Versprechen vor: ‚Kuzu Pirzola‘ steht für saftig am Knochen gegrillte Lamm-Koteletts – die Paradedisziplin des Hauses unter den ‚Babalar Grill Spezial‘-Gerichten."
                  : "Around Wittenbergplatz and KaDeWe, West Berlin beats with energy. Turn just a few meters into quieter Bayreuther Straße and you stand before the refined facade of Baba Pirzola. The name itself is a culinary promise: 'Kuzu Pirzola' stands for juicy bone-in grilled lamb chops—the house's signature discipline under 'Babalar Grill Spezial'."}
              </p>
              <p>
                {isDe
                  ? "Statt Hektik erwartet die Gäste im Inneren ein warm ausgeleuchtetes, modernes Ambiente mit dunklen Marmortischen, stilvoller Bar und aufmerksamem Tischservice. Zum Auftakt lockt ‚Fırının Ruhu – Die Seele des Ofens‘ mit ofenfrischem Balon Ekmek aus dem Steinofen, Tulum Keçi Peyniri (Tulum-Ziegenkäse) sowie ‚Vitrinden 4 kap Meze‘ – vier kalt-warm kombinierbaren Mezze-Schalen direkt von der Frischetheke."
                  : "Instead of rush, guests step into a warmly lit, contemporary dining room with dark marble tables, a stylish bar, and attentive table service. The evening begins with 'Fırının Ruhu – Soul of the Stove': fresh stone-oven Balon Ekmek, Tulum Keçi Peyniri (Tulum goat cheese), and 'Vitrinden 4 kap Meze'—four customizable bowls of cold and warm mezze straight from the counter."}
              </p>
            </div>
          </section>

          {/* SECTION 2: NAZIK ALI & MEZE TRADITION */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-forest/10 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7FA46B] block mb-1">
                {isDe ? "Kebap aus Lamm- & Kalbsfleisch" : "Lamb & Veal Kebap Specialty"}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest">
                {isDe
                  ? "Nazik Ali: Gegrillter Hackfleischspieß auf geröstetem Auberginenpüree"
                  : "Nazik Ali: Grilled Lamb & Veal Skewer on Roasted Eggplant Purée"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4 text-forest/80 text-sm sm:text-base leading-relaxed">
                <p>
                  {isDe
                    ? "Neben warmen Spezialitäten wie Pastırmalı Humus (Hummus mit Pastırma und Butter), İçli Köfte (gefüllten Bulgurbällchen mit Walnüssen) oder knusprigen Fındık Lahmacun aus dem Steinofen gehörte der frisch zubereitete Gavurdağı Salatası mit Tomaten, grünen Peperoni, Walnüssen, Petersilie, Olivenöl und Granatapfelsirup zu unseren Highlights."
                    : "Alongside warm mezze specialties like Pastırmalı Humus (hummus with pastırma and butter), İçli Köfte (bulgur balls stuffed with minced meat and walnuts), and stone-oven Fındık Lahmacun, the freshly tossed Gavurdağı Salatası with tomatoes, green peperoni, walnuts, parsley, olive oil, and pomegranate syrup stood out immediately."}
                </p>
                <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-forest/10 space-y-2">
                  <strong className="text-forest block text-base">
                    {isDe
                      ? "🔥 Unser Geheimtipp von der Kebap-Karte: Nazik Ali"
                      : "🔥 Our Kebap Menu Pick: Nazik Ali"}
                  </strong>
                  <p className="text-xs sm:text-sm text-forest/75 leading-relaxed">
                    {isDe
                      ? "Auf der Karte als ‚Nazik Ali‘ geführt: Ein saftig gegrillter Hackfleischspieß aus Lamm- und Kalbsfleisch (mind. 200 g), gebettet auf über offener Glut geröstetem Auberginenpüree in feiner Joghurt-Butter-Knoblauchsoße, garniert mit geschmorter Tomate und gegrillter Spitzpaprika."
                      : "Listed on the menu as 'Nazik Ali': a juicy charcoal-grilled minced meat skewer of lamb and veal (min. 200 g), resting on flame-roasted eggplant purée in a velvety yoghurt-butter-garlic sauce, garnished with blistered tomato and charred green pepper."}
                  </p>
                </div>
              </div>

              {/* Nazik Ali Photo */}
              <div className="space-y-2">
                <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest/5">
                    <img
                      src="/magazin/baba-pirzola-berlin/05_baba_pirzola_ali_nazik_kebab_hd.jpg?v=3"
                      alt={
                        isDe
                          ? "Nazik Ali bei Baba Pirzola: Gegrillter Hackfleischspieß auf geröstetem Auberginenpüree in Joghurt-Butter-Knoblauchsoße"
                          : "Nazik Ali at Baba Pirzola: Grilled minced meat skewer on roasted eggplant puree in yoghurt-butter-garlic sauce"
                      }
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-forest/90 text-white px-3 py-1 text-[11px] font-bold backdrop-blur-md shadow-md">
                        {isDe ? "🍆 Kebap-Klassiker: Nazik Ali" : "🍆 Kebap Classic: Nazik Ali"}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-[11px] text-forest/60 italic">
                  {isDe
                    ? "Nazik Ali: Lamm- & Kalbs-Hackfleischspieß auf geröstetem Auberginenpüree in Joghurt-Butter-Knoblauchsoße"
                    : "Nazik Ali: Lamb & veal skewer on roasted eggplant purée in yoghurt-butter-garlic sauce"}
                </p>
              </div>
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
                  ? "Kuzu Pirzola, Lokum Bonfile, Karides Şiş & saftiges Antrikot"
                  : "Kuzu Pirzola, Lokum Bonfile, Karides Şiş & Juicy Antrikot"}
              </h2>
              <p className="mt-2 text-forest/80 text-sm sm:text-base leading-relaxed">
                {isDe
                  ? "Wer die ganze Vielfalt des Holzkohlegrills erleben möchte, wählt aus den ‚Selections‘-Kombinationen – wie ‚Üçü bir arada (Dreierlei)‘, ‚Dördü bir arada (Viererlei)‘, ‚Klasik‘ oder ‚Deniz & Çayır (Surf & Turf)‘ – oder bestellt direkt aus den ‚Babalar Grill Spezial‘-Cuts."
                  : "To experience the full range of the charcoal grill, guests choose from the 'Selections' boards—such as 'Üçü bir arada (Three-Way)', 'Dördü bir arada (Four-Way)', 'Klasik', or 'Deniz & Çayır (Surf & Turf)'—or order directly from the 'Babalar Grill Spezial' cuts."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl md:max-w-none mx-auto">
              {/* Card 1: Selections Deniz & Çayır (Surf & Turf) / Klasik */}
              <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl flex flex-col">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest/5">
                  <img
                    src="/magazin/baba-pirzola-berlin/02_baba_pirzola_mixed_grill_board_hd.jpg?v=3"
                    alt={
                      isDe
                        ? "Selections-Grillbrett bei Baba Pirzola mit Kuzu Pirzola, Lokum Bonfile, Karides Şiş, Tavuk Külbastı und Kuzu Şiş"
                        : "Selections grill board at Baba Pirzola with Kuzu Pirzola, Lokum Bonfile, Karides Şiş, Tavuk Külbastı, and Kuzu Şiş"
                    }
                    className="h-full w-full object-cover"
                    loading="lazy"
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
                <div className="p-2 pt-3 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-forest">
                      {isDe
                        ? "Kuzu Pirzola, Lokum Bonfile, Karides Şiş & Tavuk Külbastı"
                        : "Kuzu Pirzola, Lokum Bonfile, Karides Şiş & Tavuk Külbastı"}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-forest/75 leading-relaxed">
                      {isDe
                        ? "Vereint auf dem großen Holzbrett: Saftig gegrillte Lamm-Koteletts (Kuzu Pirzola), butterzartes Kalbsfilet (Lokum Bonfile), gegrillte Garnelenspieße (Karides Şiş), ausgelöste Hähnchenschenkel (Tavuk Külbastı) sowie marinierte Kuzu Şiş- und Tavuk Şiş-Spieße."
                        : "United on the solid oak board: juicy grilled lamb chops (Kuzu Pirzola), buttery veal fillet (Lokum Bonfile), grilled shrimp skewers (Karides Şiş), boneless chicken thighs (Tavuk Külbastı), plus marinated Kuzu Şiş and Tavuk Şiş skewers."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Babalar Grill Spezial - Antrikot (300 g) */}
              <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl flex flex-col">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest/5">
                  <img
                    src="/magazin/baba-pirzola-berlin/03_baba_pirzola_antrikot_herb_butter_hd.jpg?v=3"
                    alt={
                      isDe
                        ? "Babalar Grill Spezial: Antrikot 300 g (Saftig gegrilltes Entrecôte) mit Kräuterbutter auf dem Holzbrett"
                        : "Babalar Grill Spezial: Antrikot 300 g (Juicy grilled entrecôte) with herb butter on wooden board"
                    }
                    className="h-full w-full object-cover"
                    loading="lazy"
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
                <div className="p-2 pt-3 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-forest">
                      {isDe
                        ? "Antrikot (300 g) – Saftig gegrilltes Entrecôte"
                        : "Antrikot (300 g) – Juicy Grilled Entrecôte"}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-forest/75 leading-relaxed">
                      {isDe
                        ? "Aus der Rubrik ‚Babalar Grill Spezial‘: 300 Gramm saftig gegrilltes Entrecôte (Antrikot) mit intensivem Grill-Branding, groben Salzflocken, würziger Kräuterbutter und Sumach-Zwiebelsalat."
                        : "From the 'Babalar Grill Spezial' section: 300 grams of juicy charcoal-grilled entrecôte (Antrikot) with bold sear marks, flaky sea salt, aromatic herb butter, and sumac onion salad."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: SWEET FINALE DUO (Tatlılar: Katmer & Fırında Sütlaç Dondurmalı) */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-forest/10 shadow-xs space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E6B84A]">
                <Sparkles className="h-4 w-4" />
                <span>
                  {isDe
                    ? "Tatlılar – Süßspeisen & Sweets"
                    : "Tatlılar – Traditional Turkish Sweets"}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest">
                {isDe
                  ? "Katmer mit Pistazien & Sahne sowie Fırında Sütlaç Dondurmalı"
                  : "Pistachio & Cream Katmer and Fırında Sütlaç Dondurmalı"}
              </h2>
              <p className="text-forest/80 leading-relaxed text-sm sm:text-base">
                {isDe
                  ? "Unter ‚Tatlılar (Süßspeisen)‘ stehen im Baba Pirzola vier Klassiker zur Wahl: Baklava, Baba Künefe, Katmer und Fırında Sütlaç Dondurmalı. Unsere Wahl fiel auf die knusprige Pistazien-Teigtasche und den im Tontopf überbackenen Milchreis."
                  : "Under 'Tatlılar (Sweets)', Baba Pirzola features four classics: Baklava, Baba Künefe, Katmer, and Fırında Sütlaç Dondurmalı. We chose the crispy pistachio pastry pocket and the clay-pot baked rice pudding."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dessert 1: Katmer */}
              <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl flex flex-col">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest/5">
                  <img
                    src="/magazin/baba-pirzola-berlin/06_baba_pirzola_katmer_pistachio_hd.jpg?v=3"
                    alt={
                      isDe
                        ? "Katmer bei Baba Pirzola: Knusprige Teigtasche mit Pistazien und Sahne auf dem Holzbrett"
                        : "Katmer at Baba Pirzola: Crispy puff pastry with pistachios and cream on a wooden board"
                    }
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-forest/90 text-white px-3 py-1 text-[11px] font-bold backdrop-blur-md shadow-md">
                      {isDe ? "🥐 Tatlılar: Katmer" : "🥐 Tatlılar: Katmer"}
                    </span>
                  </div>
                </div>
                <div className="p-2 pt-3 flex-grow">
                  <h3 className="font-display text-lg font-bold text-forest">
                    {isDe
                      ? "Katmer – Teigtasche mit Pistazien & Sahne"
                      : "Katmer – Puff Pastry with Pistachios & Cream"}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-forest/75 leading-relaxed">
                    {isDe
                      ? "Hauchdünn gebackene, goldbraun knusprige Blätterteigtasche, gefüllt mit reichlich gemahlenen Pistazien und cremiger Sahne (serviert mit Vanilleeis)."
                      : "Paper-thin, golden-crisp baked pastry pocket generously filled with ground pistachios and rich cream (served with vanilla ice cream)."}
                  </p>
                </div>
              </div>

              {/* Dessert 2: Fırında Sütlaç Dondurmalı */}
              <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl flex flex-col">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest/5">
                  <img
                    src="/magazin/baba-pirzola-berlin/04_baba_pirzola_firin_suetlac_pistachio_hd.jpg?v=3"
                    alt={
                      isDe
                        ? "Fırında Sütlaç Dondurmalı bei Baba Pirzola: Türkischer Milchreis mit Zimt, Eiscreme und Pistazien im Tontopf"
                        : "Fırında Sütlaç Dondurmalı at Baba Pirzola: Turkish rice pudding with cinnamon, ice cream, and pistachios in a clay pot"
                    }
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-forest/90 text-white px-3 py-1 text-[11px] font-bold backdrop-blur-md shadow-md">
                      {isDe ? "🍨 Fırında Sütlaç Dondurmalı" : "🍨 Fırında Sütlaç Dondurmalı"}
                    </span>
                  </div>
                </div>
                <div className="p-2 pt-3 flex-grow">
                  <h3 className="font-display text-lg font-bold text-forest">
                    {isDe
                      ? "Fırında Sütlaç Dondurmalı"
                      : "Fırında Sütlaç Dondurmalı"}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-forest/75 leading-relaxed">
                    {isDe
                      ? "Im Ofen karamellisierter türkischer Milchreis im Tontopf, serviert mit einer Kugel Eiscreme, feiner Zimtnote und leuchtend grünen Pistazien."
                      : "Oven-caramelized Turkish rice pudding baked in a clay pot, served with a scoop of ice cream, cinnamon, and vibrant green pistachios."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: VEGETARIAN & WINE CULTURE HIGHLIGHT */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-forest/10 shadow-xs space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7FA46B]">
              <Wine className="h-4 w-4" />
              <span>
                {isDe
                  ? "Für Gruppen, Weinliebhaber & Vegetarier"
                  : "For Groups, Wine Lovers & Vegetarians"}
              </span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-forest">
              {isDe
                ? "Mehr als nur Fleisch: Große Mezze-Vielfalt, Urla-Weine & Rakı-Kultur"
                : "More Than Meat: Rich Mezze Diversity, Urla Wines & Rakı Culture"}
            </h3>
            <p className="text-forest/80 leading-relaxed text-sm sm:text-base">
              {isDe
                ? "Auch wer vegetarisch genießt, wird im Baba Pirzola fündig: Von ‚Vitrinden 4 kap Meze‘ über Kiraz Domatesli Keçi Peyniri (im Tontopf gebratener Ziegenkäse mit Cherrytomaten), Patlıcan Yatağında Kuşkonmaz (gerösteter Spargel auf Auberginen-Joghurtsauce) und Sebze Tava bis hin zu frischen Salaten. Dazu führt die Weinkarte ausgewählte türkische Spitzenweine von Weingütern wie Urla, Yedibilgeler, Lucien Arkas und Kavaklıdere sowie Yeni, Gold und Göbek Rakı."
                : "Vegetarian guests are equally spoiled at Baba Pirzola: from 'Vitrinden 4 kap Meze' to Kiraz Domatesli Keçi Peyniri (clay-pot roasted goat cheese with cherry tomatoes), Patlıcan Yatağında Kuşkonmaz (roasted asparagus on eggplant-yoghurt sauce), Sebze Tava, and crisp salads. The wine list showcases premier Turkish estates including Urla, Yedibilgeler, Lucien Arkas, and Kavaklıdere alongside Yeni, Gold, and Göbek Rakı."}
            </p>
          </section>

          {/* SECTION 6: TRANSPARENCY & PHOTO ENHANCEMENT DISCLOSURE */}
          <section className="rounded-2xl p-4 sm:p-5 bg-white/60 border border-forest/10 text-xs text-forest/70 space-y-2">
            <div className="flex items-center gap-2 font-bold text-forest">
              <Info className="h-4 w-4 text-[#7FA46B]" />
              <span>
                {isDe
                  ? "Transparenzhinweis & Redaktionelle Foto-Information"
                  : "Transparency Note & Editorial Photo Disclosure"}
              </span>
            </div>
            <p className="leading-relaxed">
              {isDe
                ? "Dieser Beitrag ist Teil unserer unabhängigen Reihe ‚Speisely Community Stories‘. Die Aufnahmen stammen direkt von einem Vor-Ort-Besuch aus unserer Community und wurden für das Magazin-Format auf ein einheitliches 4:3-Retina-Verhältnis zugeschnitten sowie farblich und in der Detailschärfe behutsam optimiert."
                : "This article is part of our independent 'Speisely Community Stories' series. All photographs were captured during a real on-site dining visit by our community and carefully cropped to a unified 4:3 retina ratio with subtle color and sharpness grading for our magazine layout."}
            </p>
          </section>

          {/* SECTION 8: COMMUNITY CALLOUT */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-forest/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF4EC] text-forest px-3 py-1 text-xs font-bold">
                <Users className="h-3.5 w-3.5 text-[#7FA46B]" />
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
