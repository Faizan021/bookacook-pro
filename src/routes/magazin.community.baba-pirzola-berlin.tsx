import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  Clock,
  Phone,
  Globe,
  Instagram,
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
          "Community-Besuch bei Baba Pirzola am Wittenbergplatz in Berlin: Zarte Lamm-Pirzola, Ali Nazik auf Rauch-Aubergine, Antrikot & Fırın Sütlaç.",
      },
      {
        name: "keywords",
        content:
          "Baba Pirzola Berlin, Türkisches Restaurant Wittenbergplatz, Meze & Grill Berlin, Lammkoteletts Pirzola, Ali Nazik Berlin, Antrikot Grill, Fırın Sütlaç, Bayreuther Str. 35 Berlin, Speisely Community Story",
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
          "Ein Speisely Community-Mitglied besucht Baba Pirzola in der Bayreuther Str. 35: Anatolische Grillkunst, Rakı-Meze-Kultur, Ali Nazik und karamellisierter Sütlaç.",
      },
      {
        property: "og:image",
        content:
          "https://speisely.de/magazin/baba-pirzola-berlin/01_baba_pirzola_feast_table_hd.jpg?v=2",
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
                "Ein Speisely Community-Mitglied war zu Gast im Baba Pirzola Meze & Grill in der Bayreuther Straße 35 nahe dem KaDeWe und teilt Eindrücke von Lamm-Pirzola, Ali Nazik, Ribeye-Antrikot und Fırın Sütlaç.",
              image: {
                "@type": "ImageObject",
                url: "https://speisely.de/magazin/baba-pirzola-berlin/01_baba_pirzola_feast_table_hd.jpg?v=2",
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
    : `Hello Speisely Team,\n\nI visited Baba Pirzola Meze & Grill in Berlin and want to share my experience.\n\nFavorite dish:\nAtmosphere & Service:\nPhotos attached:`;

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
              ? "Nur wenige Schritte vom KaDeWe entfernt zelebriert das Baba Pirzola in der Bayreuther Straße 35 die gehobene türkisch-mediterrane Tafelkultur. Ein Mitglied unserer Speisely Community hat sich durch Lammkoteletts vom Eichenbrett, rauchiges Ali Nazik, saftiges Antrikot und im Tontopf karamellisierten Sütlaç probiert."
              : "Just steps from KaDeWe on Bayreuther Straße 35, Baba Pirzola celebrates elevated Turkish-Mediterranean dining culture. A member of our Speisely Community experienced oak-board lamb pirzola, smoky Ali Nazik, juicy ribeye antrikot, and clay-pot caramelized Sütlaç."}
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
                  {isDe ? "Pirzola, Antrikot & Ali Nazik" : "Pirzola, Antrikot & Ali Nazik"}
                </strong>
                <span className="block text-forest/70 text-xs">
                  {isDe
                    ? "Gavurdağı-Salat, Rosmarinkartoffeln, Meze"
                    : "Gavurdağı Salad, Rosemary Potatoes, Meze"}
                </span>
                <span className="block text-forest/60 text-[11px]">
                  {isDe
                    ? "Katmer & Fırın Sütlaç mit Antep-Pistazien"
                    : "Katmer & Fırın Sütlaç with Antep Pistachios"}
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
                      ? "Gedeckte Tafel im Baba Pirzola Berlin mit Lamm-Pirzola auf dem Holzbrett, Gavurdağı-Walnusssalat, Rosmarinkartoffeln und Rakı"
                      : "Full table spread at Baba Pirzola Berlin featuring lamb pirzola on a wooden board, Gavurdağı walnut salad, rosemary potatoes, and Rakı"
                  }
                  className="h-full w-full object-cover"
                  loading="eager"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/90 backdrop-blur-md text-white px-3.5 py-1 text-xs font-bold shadow-md">
                    <Sparkles className="h-3.5 w-3.5 text-[#E6B84A]" aria-hidden="true" />
                    <span>
                      {isDe ? "🍽️ Rakı, Meze & Grill-Tafel" : "🍽️ Rakı, Meze & Grill Spread"}
                    </span>
                  </span>
                </div>
              </div>
              <div className="mt-2.5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-forest/60">
                <span>
                  {isDe
                    ? "Der Auftakt auf dunklem Marmor: Gegrilltes Lammkotelett & Spieße auf dem Eichenbrett, begleitet von Gavurdağı-Salat mit Walnüssen, Ofenkartoffeln und klassischem Rakı auf Eis."
                    : "The opening spread on dark marble: Grilled lamb chop & skewers on oak board, accompanied by Gavurdağı walnut salad, roasted potatoes, and classic Rakı over ice."}
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
                  ? "Rund um den Wittenbergplatz und das KaDeWe pulsiert der Berliner Westen. Wer nur ein paar Meter in die ruhigere Bayreuther Straße einbiegt, steht vor der eleganten Fassade des Baba Pirzola. Schon der Name gibt das kulinarische Versprechen vor: ‚Pirzola‘ steht im Türkischen für zarte, am Knochen gegrillte Koteletts – und genau diese Disziplin beherrscht die Küche hier in Perfektion."
                  : "Around Wittenbergplatz and KaDeWe, West Berlin beats with energy. Turn just a few meters into quieter Bayreuther Straße and you stand before the refined facade of Baba Pirzola. The name itself is a culinary promise: 'Pirzola' means tender, bone-in grilled chops in Turkish—a craft the kitchen here has mastered to perfection."}
              </p>
              <p>
                {isDe
                  ? "Statt Hektik erwartet die Gäste im Inneren ein warm ausgeleuchtetes, modernes Ambiente mit dunklen Marmortischen, stilvoller Bar und aufmerksamem Tischservice. Hier trifft die jahrhundertealte anatolische Meyhane-Kultur – das entspannte Teilen zahlreicher kleiner Vorspeisen (Meze) bei einem Glas Rakı oder ausgewählten türkischen Weinen – auf präzises Steakhouse-Handwerk."
                  : "Instead of rush, guests step into a warmly lit, contemporary dining room with dark marble tables, a stylish bar, and attentive table service. Here, the centuries-old Anatolian Meyhane tradition—sharing vibrant small plates (Meze) over a glass of Rakı or curated Turkish wines—meets modern steakhouse precision."}
              </p>
            </div>
          </section>

          {/* SECTION 2: ALI NAZIK & MEZE TRADITION */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-forest/10 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7FA46B] block mb-1">
                {isDe ? "Anatolische Spezialität" : "Anatolian Specialty"}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest">
                {isDe
                  ? "Ali Nazik: Wenn rauchige Aubergine auf saftigen Grillspieß trifft"
                  : "Ali Nazik: When Smoky Eggplant Meets Juicy Charcoal Skewers"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4 text-forest/80 text-sm sm:text-base leading-relaxed">
                <p>
                  {isDe
                    ? "Bevor die großen Holzbretter den Tisch erreichten, sorgten die kalten und warmen Vorspeisen für Begeisterung: Von cremigem Hummus über fein gewürzte Schafskäsecremes bis zum knackigen Gavurdağı-Salat mit fein gewürfelten Tomaten, Walnüssen und herb-süßer Granatapfelreduktion."
                    : "Before the heavy wooden boards arrived at the table, the cold and warm starters set the tone: from velvety hummus and spiced feta creams to crisp Gavurdağı salad tossed with finely diced tomatoes, walnuts, and tangy pomegranate reduction."}
                </p>
                <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-forest/10 space-y-2">
                  <strong className="text-forest block text-base">
                    {isDe
                      ? "🔥 Unser Geheimtipp: Ali Nazik Kebab"
                      : "🔥 Our Insider Pick: Ali Nazik Kebab"}
                  </strong>
                  <p className="text-xs sm:text-sm text-forest/75 leading-relaxed">
                    {isDe
                      ? "Ein Klassiker aus Gaziantep, den man in dieser Qualität selten findet: Über offener Glut geröstetes, samtiges Auberginenpüree, verfeinert mit cremigem Knoblauch-Joghurt, auf dem ein saftig gegrillter Hackfleischspieß mit aufgeschäumter Paprikabutter, Schmortomate und gegrillter Spitzpaprika ruht. Der Kontrast aus kühler, rauchiger Creme und heißem Fleisch vom Rost ist schlichtweg herausragend."
                      : "A Gaziantep classic rarely found at this level of quality: flame-roasted, silky eggplant purée folded with garlicky strained yogurt, crowned with a juicy charcoal-grilled skewer, sizzling paprika butter, blistered tomato, and charred green pepper. The interplay of cool smoky cream and hot meat from the grill is unforgettable."}
                  </p>
                </div>
              </div>

              {/* Ali Nazik Photo */}
              <div className="space-y-2">
                <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest/5">
                    <img
                      src="/magazin/baba-pirzola-berlin/05_baba_pirzola_ali_nazik_kebab_hd.jpg?v=3"
                      alt={
                        isDe
                          ? "Ali Nazik Kebab bei Baba Pirzola auf geröstetem Auberginen-Joghurt-Bett mit Paprikabutter"
                          : "Ali Nazik Kebab at Baba Pirzola on roasted eggplant-yogurt bed with paprika butter"
                      }
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-forest/90 text-white px-3 py-1 text-[11px] font-bold backdrop-blur-md shadow-md">
                        {isDe ? "🍆 Signature Ali Nazik" : "🍆 Signature Ali Nazik"}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-[11px] text-forest/60 italic">
                  {isDe
                    ? "Ali Nazik auf handgefertigter Keramik: Rauchige Aubergine, Knoblauchjoghurt & heißer Spieß"
                    : "Ali Nazik on artisan ceramic: Smoky eggplant, garlic yogurt & sizzling skewer"}
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 3: THE GRILL MASTERPIECES (2-Column Side-by-Side) */}
          <section className="space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#A85C36] block mb-1">
                {isDe ? "Vom Holzkohlegrill aufs Eichenbrett" : "From Charcoal Grill to Oak Board"}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest">
                {isDe
                  ? "Die Namensgeber: Lamm-Pirzola, Surf & Turf Platte & Ribeye-Antrikot"
                  : "The Headliners: Lamb Pirzola, Surf & Turf Board & Ribeye Antrikot"}
              </h2>
              <p className="mt-2 text-forest/80 text-sm sm:text-base leading-relaxed">
                {isDe
                  ? "Beim Hauptgang zeigt sich, warum Stammgäste aus ganz Berlin immer wieder an den Wittenbergplatz zurückkehren. Serviert wird auf massiven Holzbrettern mit würzigem Sumach-Zwiebelsalat, gegrillter Pfefferoni und geschmorter Kirschtomate."
                  : "When the mains arrive, it becomes clear why regulars from across Berlin return to Wittenbergplatz again and again. Cuts are presented on solid oak boards with tangy sumac onion salad, charred green pepper, and blistered cherry tomato."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl md:max-w-none mx-auto">
              {/* Card 1: Mixed Grill & Surf-and-Turf Board */}
              <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl flex flex-col">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest/5">
                  <img
                    src="/magazin/baba-pirzola-berlin/02_baba_pirzola_mixed_grill_board_hd.jpg?v=3"
                    alt={
                      isDe
                        ? "Großes Eichenbrett bei Baba Pirzola mit Lamm-Pirzola, Rinderfilet-Medaillons, Riesengarnelen vom Grill und Spießen"
                        : "Signature oak board at Baba Pirzola with lamb pirzola, beef fillet medallions, charcoal-grilled jumbo prawns, and skewers"
                    }
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-forest/90 backdrop-blur-md text-white px-3 py-1 text-[11px] font-bold shadow-md">
                      <span>🔥</span>
                      <span>{isDe ? "Pirzola, Filet & Garnelen" : "Pirzola, Filet & Prawns"}</span>
                    </span>
                  </div>
                </div>
                <div className="p-2 pt-3 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-forest">
                      {isDe
                        ? "Das große Baba-Brett: Pirzola, Filet-Medaillons & Riesengarnelen"
                        : "The Grand Baba Board: Pirzola, Filet Medallions & Prawns"}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-forest/75 leading-relaxed">
                      {isDe
                        ? "Ein Festmahl zum Teilen: Am langen Knochen gereifte Lamm-Pirzola, zarte Rinderfilet-Medaillons mit perfektem Grill-Branding, goldbraun gegrillte Riesengarnelen (Karides) und saftig marinierte Spieße."
                        : "A feast made for sharing: long-bone lamb pirzola, tender beef fillet medallions with bold sear marks, golden charcoal-kissed jumbo prawns (Karides), and juicy marinated skewers."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Antrikot with Herb Butter */}
              <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl flex flex-col">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest/5">
                  <img
                    src="/magazin/baba-pirzola-berlin/03_baba_pirzola_antrikot_herb_butter_hd.jpg?v=3"
                    alt={
                      isDe
                        ? "Saftig gegrilltes Rinder-Antrikot (Entrecôte) mit Grillstreifen, Haus-Kräuterbutter und Sumach-Zwiebeln"
                        : "Juicy grilled beef Antrikot (Ribeye) with sear marks, house herb butter, and sumac onions"
                    }
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-forest/90 backdrop-blur-md text-white px-3 py-1 text-[11px] font-bold shadow-md">
                      <span>🥩</span>
                      <span>{isDe ? "Dry-Aged & Antrikot" : "Dry-Aged & Antrikot"}</span>
                    </span>
                  </div>
                </div>
                <div className="p-2 pt-3 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-forest">
                      {isDe
                        ? "Dana Antrikot mit Haus-Kräuterbutter"
                        : "Dana Antrikot with House Herb Butter"}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-forest/75 leading-relaxed">
                      {isDe
                        ? "Perfekt marmoriertes Entrecôte mit ausgeprägtem Branding vom Rost, groben Meersalzflocken und einer Scheibe hausgemachter mediterraner Kräuter-Chili-Butter, die langsam auf dem heißen Schnitt schmilzt."
                        : "Richly marbled ribeye steak with bold grill sear marks, flaky sea salt, and a medallion of house-made Mediterranean herb-chili butter slowly melting alongside."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: SWEET FINALE DUO (Katmer & Fırın Sütlaç) */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-forest/10 shadow-xs space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E6B84A]">
                <Sparkles className="h-4 w-4" />
                <span>
                  {isDe
                    ? "Das süße Finale aus Gaziantep & dem Steinofen"
                    : "The Sweet Finale from Gaziantep & the Clay Oven"}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest">
                {isDe
                  ? "Knuspriges Pistazien-Katmer & im Tontopf karamellisiertes Fırın Sütlaç"
                  : "Crispy Pistachio Katmer & Clay-Pot Caramelized Fırın Sütlaç"}
              </h2>
              <p className="text-forest/80 leading-relaxed text-sm sm:text-base">
                {isDe
                  ? "Nach den herzhaften Röstaromen vom Holzkohlegrill führt kein Weg an der türkischen Patisserie vorbei. Unsere beiden Favoriten zeigen die ganze Bandbreite zwischen hauchdünnem, warmem Blätterteig-Handwerk und cremig überbackener Tradition."
                  : "After the savory char of the charcoal grill, Turkish pastry craft takes center stage. Our two favorites showcase the full spectrum between paper-thin warm phyllo artistry and creamy oven-baked tradition."}
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
                        ? "Knusprig gebackenes Gaziantep-Katmer auf dem Holzbrett mit Kaymak-Rahm und grünen Antep-Pistazien"
                        : "Crispy baked Gaziantep Katmer on a wooden board with Kaymak clotted cream and green Antep pistachios"
                    }
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-forest/90 text-white px-3 py-1 text-[11px] font-bold backdrop-blur-md shadow-md">
                      {isDe ? "🥐 Warmes Pistazien-Katmer" : "🥐 Warm Pistachio Katmer"}
                    </span>
                  </div>
                </div>
                <div className="p-2 pt-3 flex-grow">
                  <h3 className="font-display text-lg font-bold text-forest">
                    {isDe
                      ? "Gaziantep Katmer mit Kaymak & Pistazien"
                      : "Gaziantep Katmer with Kaymak & Pistachios"}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-forest/75 leading-relaxed">
                    {isDe
                      ? "Hauchdünn gezogener Yufka-Teig, gefüllt mit schmelzendem Kaymak (türkischem Rahm) und fein gemahlenen Antep-Pistazien – goldbraun und knusprig gebacken direkt auf dem Holzbrett serviert."
                      : "Paper-thin hand-stretched phyllo pastry filled with melting Kaymak (Turkish clotted cream) and finely ground Antep pistachios—baked golden-crisp and served warm on an oak board."}
                  </p>
                </div>
              </div>

              {/* Dessert 2: Fırın Sütlaç */}
              <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl flex flex-col">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest/5">
                  <img
                    src="/magazin/baba-pirzola-berlin/04_baba_pirzola_firin_suetlac_pistachio_hd.jpg?v=3"
                    alt={
                      isDe
                        ? "Fırın Sütlaç im Tontopf gebacken mit Vanilleeis und grünen Antep-Pistazien bei Baba Pirzola"
                        : "Fırın Sütlaç baked in a clay pot topped with vanilla ice cream and green Antep pistachios at Baba Pirzola"
                    }
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-forest/90 text-white px-3 py-1 text-[11px] font-bold backdrop-blur-md shadow-md">
                      {isDe ? "🍨 Fırın Sütlaç im Tontopf" : "🍨 Clay-Pot Fırın Sütlaç"}
                    </span>
                  </div>
                </div>
                <div className="p-2 pt-3 flex-grow">
                  <h3 className="font-display text-lg font-bold text-forest">
                    {isDe
                      ? "Fırın Sütlaç mit Eis & Antep-Pistazien"
                      : "Fırın Sütlaç with Ice Cream & Pistachios"}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-forest/75 leading-relaxed">
                    {isDe
                      ? "Traditioneller Milchreis, im Terrakotta-Tontopf überbacken bis sich eine karamellisierte Kruste bildet, gekrönt von einer kühlen Kugel Eis und leuchtend grünen Pistazien."
                      : "Traditional rice pudding baked in a terracotta clay pot until a caramelized crust forms, crowned with a cool scoop of ice cream and vibrant green pistachios."}
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
                ? "Mehr als nur Fleisch: Große vegetarische Meze-Vielfalt & kuratierte Weinkarte"
                : "More Than Meat: Rich Vegetarian Meze Diversity & Curated Wine List"}
            </h3>
            <p className="text-forest/80 leading-relaxed text-sm sm:text-base">
              {isDe
                ? "Was viele beim Blick auf den Namen ‚Pirzola‘ überrascht: Die anatolische Küche besitzt eine beeindruckende vegetarische Tradition. Wer ohne Fleisch genießt, kann sich aus Dutzenden frisch zubereiteten Meze-Schälchen, Ofenkartoffeln, gegrilltem Gemüse, Feta-Variationen und Salaten eine vollwertige Festtafel zusammenstellen. Dazu berät der aufmerksame Service kompetent zu charakterstarken türkischen und mediterranen Weinen sowie zur klassischen Rakı-Begleitung."
                : "What surprises many at first glance is how deeply rooted vegetarian dishes are in Anatolian dining culture. Guests dining meat-free can assemble a lavish feast from dozens of freshly prepared cold and warm Meze plates, rosemary potatoes, grilled vegetables, feta creations, and crisp salads—paired with characterful Turkish wines or traditional Rakı."}
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

          {/* SECTION 7: VISITING GUIDE & RESERVATION BOX */}
          <section className="bg-gradient-to-br from-[#EBF4EC] to-[#FAF7F0] rounded-3xl p-6 sm:p-8 border border-[#7FA46B]/25 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-forest/60">
                  {isDe ? "Alle Infos für deinen Besuch" : "All Details for Your Visit"}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-forest mt-1">
                  Baba Pirzola Meze & Grill besuchen
                </h3>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href="https://babapirzola.de/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-forest text-white px-5 py-2.5 text-xs font-bold hover:bg-forest/90 transition shadow-md shrink-0"
                >
                  <Globe className="h-4 w-4" />
                  <span>{isDe ? "Website & Tisch reservieren" : "Website & Book a Table"}</span>
                </a>
                <a
                  href="tel:+493043662023"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-forest border border-forest/20 px-4 py-2.5 text-xs font-bold hover:bg-forest/5 transition shadow-xs shrink-0"
                >
                  <Phone className="h-3.5 w-3.5 text-[#7FA46B]" />
                  <span>030 / 43662023</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-forest/10">
                <span className="font-bold text-forest block mb-1">📍 Adresse</span>
                <p className="text-forest/75 leading-relaxed">
                  Bayreuther Str. 35
                  <br />
                  10789 Berlin (Wittenbergplatz)
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-forest/10">
                <span className="font-bold text-forest block mb-1">📞 Kontakt & Reservierung</span>
                <p className="text-forest/75 leading-relaxed">
                  <a href="tel:+493043662023" className="hover:underline font-semibold">
                    030 / 43662023
                  </a>
                  <br />
                  <a href="mailto:info@babapirzola.de" className="hover:underline truncate block">
                    info@babapirzola.de
                  </a>
                  <span className="block text-[11px] text-forest/60 mt-0.5">
                    Online via Tablekult / Website
                  </span>
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-forest/10">
                <span className="font-bold text-forest block mb-1">⏰ Öffnungszeiten</span>
                <p className="text-forest/75 leading-relaxed">
                  Mo–Do: 12:00 – 00:00 Uhr
                  <br />
                  Fr–Sa: 12:00 – 01:00 Uhr
                  <br />
                  Sonntag: 12:00 – 00:00 Uhr
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-forest/10">
                <span className="font-bold text-forest block mb-1">📱 Instagram</span>
                <p className="text-forest/75 leading-relaxed">
                  <a
                    href="https://www.instagram.com/baba.pirzola/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline inline-flex items-center gap-1 text-forest font-semibold"
                  >
                    <Instagram className="h-3.5 w-3.5 text-[#E6B84A]" />
                    @baba.pirzola
                  </a>
                  <span className="block text-forest/60 text-[11px] mt-0.5">
                    6.500+ Follower · 420+ Beiträge
                  </span>
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-forest/10 flex flex-wrap items-center justify-between gap-3 text-xs text-forest/75">
              <span>
                {isDe
                  ? "💡 Tipp: Für Freitag- und Samstagabend empfehlen wir unbedingt eine frühzeitige Tischreservierung."
                  : "💡 Tip: For Friday and Saturday evenings, we strongly recommend booking a table in advance."}
              </span>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Baba+Pirzola+Bayreuther+Str.+35+10789+Berlin"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-forest hover:text-[#7FA46B] underline"
              >
                {isDe ? "Route in Google Maps öffnen →" : "Open route in Google Maps →"}
              </a>
            </div>
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
