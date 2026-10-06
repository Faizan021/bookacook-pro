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
  CheckCircle2,
  Heart,
  Camera,
  Info,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { SiteShell } from "@/components/SiteShell";
import { AboutSpeiselySection } from "@/components/AboutSpeiselySection";

export const Route = createFileRoute("/magazin/community/king-tut-restaurant-berlin")({
  head: () => ({
    meta: [
      { title: "King Tut Restaurant Berlin — Speisely" },
      {
        name: "description",
        content:
          "Ein Speisely Community-Mitglied hat King Tut in Berlin-Wilmersdorf besucht: Echtes Hawawshi, grüne Molokhia & Holzkohlegrill auf Silberplatten.",
      },
      {
        name: "keywords",
        content:
          "King Tut Berlin, Ägyptisches Restaurant Wilmersdorf, Hawawshi Berlin, Molokhia Berlin, Mixed Grill Silberplatte, Umm Ali, Speisely Community Story, Hohenzollerndamm Restaurant",
      },
      { name: "geo.region", content: "DE-BE" },
      { name: "geo.placename", content: "Berlin-Wilmersdorf" },
      { name: "geo.position", content: "52.4938;13.3188" },
      { name: "ICBM", content: "52.4938, 13.3188" },
      {
        property: "og:title",
        content: "Community-Besuch: King Tut Restaurant & Café Berlin | Speisely",
      },
      {
        property: "og:description",
        content:
          "Ein Speisely Community-Mitglied teilt sein Erlebnis bei King Tut in Berlin-Wilmersdorf: Knuspriges Hawawshi, Jutesuppen-Kult & Grill auf Silberplatten.",
      },
      {
        property: "og:image",
        content:
          "https://speisely.de/magazin/king-tut-berlin/16_king_tut_hawawshi_molokhia_hd.jpg?v=2",
      },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "de_DE" },
      {
        property: "og:url",
        content: "https://speisely.de/magazin/community/king-tut-restaurant-berlin",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://speisely.de/magazin/community/king-tut-restaurant-berlin",
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
              "@id": "https://speisely.de/magazin/community/king-tut-restaurant-berlin#article",
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": "https://speisely.de/magazin/community/king-tut-restaurant-berlin",
              },
              headline:
                "Community-Besuch bei King Tut in Berlin-Wilmersdorf — Ein echter Festschmaus aus Kairo",
              description:
                "Ein Speisely Community-Mitglied hat das King Tut Restaurant am Hohenzollerndamm 11 besucht und teilt seine ehrlichen Eindrücke, Lieblingsgerichte und Fotos.",
              image: {
                "@type": "ImageObject",
                url: "https://speisely.de/magazin/king-tut-berlin/16_king_tut_hawawshi_molokhia_hd.jpg?v=2",
                width: 1200,
                height: 900,
              },
              datePublished: "2026-10-06",
              dateModified: "2026-10-06",
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
                name: "King Tut Restaurant & Café",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Hohenzollerndamm 11",
                  addressLocality: "Berlin",
                  postalCode: "10717",
                  addressRegion: "Berlin",
                  addressCountry: "DE",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 52.4938,
                  longitude: 13.3188,
                },
                url: "https://kingtutrestaurant.de/",
                servesCuisine: "Egyptian",
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
                  name: "King Tut Berlin",
                  item: "https://speisely.de/magazin/community/king-tut-restaurant-berlin",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: KingTutBerlinCommunityArticle,
});

function KingTutBerlinCommunityArticle() {
  const { lang } = useI18n();
  const isDe = lang === "de";

  const emailSubject = isDe
    ? "Mein Besuch bei King Tut Berlin – Feedback für Speisely Community"
    : "My visit to King Tut Berlin – Feedback for Speisely Community";

  const emailBody = isDe
    ? `Hallo Speisely-Team,\n\nich habe das King Tut Restaurant in Berlin besucht und möchte meine Erfahrung teilen.\n\nMein Lieblingsgericht:\nAtmosphäre & Service:\nFotos anbei:`
    : `Hello Speisely Team,\n\nI visited King Tut Restaurant in Berlin and want to share my experience.\n\nFavorite dish:\nAtmosphere & Service:\nPhotos attached:`;

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
                  King Tut Berlin
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
              ? "Ein Abend wie in Kairo: Unser Besuch bei King Tut in Berlin"
              : "An Evening in Cairo: Our Visit to King Tut in Berlin"}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-forest/80 leading-relaxed font-normal">
            {isDe
              ? "Ein Mitglied unserer Speisely Community war mit Freunden am Hohenzollerndamm 11 unterwegs. Hier ist der persönliche Bericht: Von heißem, knusprigem Hawawshi über samtige Molokhia bis zu rauchigen Grillplatten auf echten Silbertabletts."
              : "A member of our Speisely Community visited King Tut on Hohenzollerndamm 11 with friends. Here is their honest story: from crackling-crisp Hawawshi and velvety Molokhia to smoky mixed grill platters served on authentic silver trays."}
          </p>

          {/* Community Visit Meta Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-forest/70 border-y border-forest/10 py-3">
            <span className="inline-flex items-center gap-1.5 font-semibold text-forest">
              <Camera className="h-3.5 w-3.5 text-[#E6B84A]" />
              {isDe
                ? "Fotos & Bericht von Community-Mitglied geteilt"
                : "Photos & story shared by community member"}
            </span>
            <span className="text-forest/30">•</span>
            <span>
              {isDe ? "Vor-Ort-Besuch in Berlin-Wilmersdorf" : "Field visit in Berlin-Wilmersdorf"}
            </span>
            <span className="text-forest/30">•</span>
            <span className="font-semibold text-emerald-700">✓ 100% Halal</span>
          </div>

          {/* Quick Facts Card */}
          <div className="mt-6 p-5 sm:p-6 rounded-3xl border border-forest/10 bg-white shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-[#E6B84A] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Ort" : "Location"}
                </span>
                <strong className="font-semibold text-forest">King Tut Restaurant & Café</strong>
                <span className="block text-forest/70 text-xs">
                  Hohenzollerndamm 11, 10717 Berlin
                </span>
                <span className="block text-forest/60 text-[11px]">
                  {isDe
                    ? "Kreuzung Düsseldorfer Str. (Wilmersdorf)"
                    : "Corner Düsseldorfer Str. (Wilmersdorf)"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Utensils className="h-4 w-4 text-[#7FA46B] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Was wir probiert haben" : "What we ordered"}
                </span>
                <strong className="font-semibold text-forest">
                  {isDe ? "Hawawshi & Mixed Grill" : "Hawawshi & Mixed Grill"}
                </strong>
                <span className="block text-forest/70 text-xs">
                  {isDe ? "Molokhia, Salata Baladi, Umm Ali" : "Molokhia, Salata Baladi, Umm Ali"}
                </span>
                <span className="block text-forest/60 text-[11px]">
                  {isDe ? "Reis mit Fadennudeln & Toum" : "Vermicelli Rice & Garlic Toum"}
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
                  {isDe ? "Jeden Tag geöffnet" : "Open every day"}
                </strong>
                <span className="block text-forest/70 text-xs">
                  Mo–Do 12:00–22:30 · Fr 13:00–23:30
                </span>
                <span className="block text-forest/60 text-[11px]">
                  Sa 12:00–00:00 · So 15:00–22:30
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Article Content */}
        <main className="mx-auto max-w-4xl px-4 py-4 sm:px-6 space-y-12 pb-20">
          {/* SECTION 1: HERO FEAST */}
          <section className="space-y-4">
            <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest/5">
                <img
                  src="/magazin/king-tut-berlin/16_king_tut_hawawshi_molokhia_hd.jpg?v=2"
                  alt={
                    isDe
                      ? "Der gedeckte Tisch bei King Tut Berlin mit Hawawshi, Molokhia, Mixed Grill und Fladenbrot"
                      : "The spread at King Tut Berlin with Hawawshi, Molokhia, Mixed Grill and fresh flatbread"
                  }
                  className="h-full w-full object-cover"
                  loading="eager"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/90 backdrop-blur-md text-white px-3.5 py-1 text-xs font-bold shadow-md">
                    <Sparkles className="h-3.5 w-3.5 text-[#E6B84A]" aria-hidden="true" />
                    <span>{isDe ? "Der Tisch füllt sich" : "The Feast Arrives"}</span>
                  </span>
                </div>
              </div>
              <div className="mt-2.5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-forest/60">
                <span>
                  {isDe
                    ? "Der Tisch bei King Tut: Knuspriges Hawawshi mit Pommes, grüne Molokhia mit geröstetem Knoblauch, saftige Grillspieße und frische Baladi-Brote."
                    : "The table at King Tut: Crispy Hawawshi with fries, green Molokhia with roasted garlic, grilled skewers, and fresh Baladi bread."}
                </span>
                <span className="italic text-[10px] text-forest/50 shrink-0">
                  {isDe
                    ? "Foto-Upgrade via Software basierend auf Community-Vorlage"
                    : "Photo enhanced via software from community original"}
                </span>
              </div>
            </div>

            <div className="text-forest/85 leading-relaxed text-base sm:text-lg space-y-4 pt-2">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest">
                {isDe
                  ? "„Wir wollten etwas Echtes probieren – und wurden überrascht“"
                  : "“We wanted to taste something authentic – and got surprised”"}
              </h2>
              <p>
                {isDe
                  ? "Wenn man in Berlin arabisch essen geht, landet man fast automatisch in Neukölln oder Wedding für Schawarma oder Falafel. Unser Community-Mitglied hat uns geschrieben: „Wir suchten für ein Treffen mit Freunden einen Ort, an dem man gemütlich sitzen kann und der Gerichte serviert, die man in Berlin sonst selten findet. Freunde empfahlen uns das King Tut am Hohenzollerndamm in Wilmersdorf.“"
                  : "When looking for Middle Eastern food in Berlin, people often default to Neukölln or Wedding for quick shawarma or falafel. Our community member told us: “We were looking for a cozy place to sit down with friends and try dishes you rarely find in Berlin. Friends recommended King Tut on Hohenzollerndamm in Wilmersdorf.”"}
              </p>
              <p>
                {isDe
                  ? "Schon beim Reinkommen merkt man, dass hier mit Herzblut gearbeitet wird: Warme Holzlamellen an den Wänden, dezente Pharaonen-Motive, bequeme Bänke und eine detailgetreue goldene Totenmaske von Tutanchamun in einer beleuchteten Vitrine. Das Team hat uns mit einer Herzlichkeit begrüßt, wie man sie sonst nur von Gastgebern in Kairo kennt."
                  : "From the moment you step in, the passion is palpable: warm acoustic wood slat walls, subtle Egyptian heritage artwork, comfortable seating, and an illuminated glass case showcasing a golden Tutankhamun bust. The team welcomed our group with the effortless, warm hospitality Cairo is renowned for."}
              </p>
            </div>
          </section>

          {/* SECTION 2: THE SOULFOOD (Hawawshi & Molokhia) */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-forest/10 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7FA46B] block mb-1">
                {isDe ? "Die Highlights auf dem Tisch" : "Table Highlights"}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest">
                {isDe ? "Das Hawawshi & der Molokhia-Moment" : "The Hawawshi & The Molokhia Moment"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4 text-forest/80 text-sm sm:text-base leading-relaxed">
                <p>
                  {isDe
                    ? "Wer zum ersten Mal ägyptisch isst, sollte unbedingt diese beiden Klassiker bestellen, von denen unser Community-Mitglied besonders begeistert war:"
                    : "If you're trying Egyptian food for the first time, these two dishes were the undisputed favorites of our community member:"}
                </p>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-forest/10">
                    <strong className="text-forest block mb-1">
                      1. Hawawshi (حواوشي) — Der absolute Suchtfaktor
                    </strong>
                    <p className="text-xs sm:text-sm text-forest/75 leading-relaxed">
                      {isDe
                        ? "Fladenbrot, reich gefüllt mit saftigem Rinderhack, Kräutern und Zwiebeln, das im heißen Steinofen gebacken wird, bis es außen krachend knusprig ist und innen wunderbar saftig bleibt. Zusammen mit Pommes und Dip der heimliche Favorit der ganzen Runde."
                        : "Flatbread generously stuffed with seasoned minced beef, herbs, and onions, oven-baked until crackling crisp on the outside while staying juicy inside. Paired with fries, it was the instant table favorite."}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-forest/10">
                    <strong className="text-forest block mb-1">
                      2. Molokhia (ملوخية) — Das Herzstück der ägyptischen Küche
                    </strong>
                    <p className="text-xs sm:text-sm text-forest/75 leading-relaxed">
                      {isDe
                        ? "Die traditionelle samtig-grüne Juteblattsuppe. Das Geheimnis liegt in der 'Teshah': frisch in Butter angebratener Knoblauch und gemahlener Koriander, der zischend heiß über die Suppe kommt. Mit Reis und frischem Baladi-Brot ein echter Seelenwärmer."
                        : "The traditional velvety green jute leaf soup. The secret is the 'Teshah': butter-sautéed garlic and ground coriander poured sizzling hot right into the bowl. Best enjoyed with rice and fresh Baladi bread."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fresh Salad */}
              <div className="space-y-2">
                <div className="relative overflow-hidden rounded-2xl border-2 border-forest/15 bg-white p-2 shadow-md">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-forest/5">
                    <img
                      src="/magazin/king-tut-berlin/19_salata_baladi_fresh_mint.jpg?v=2"
                      alt={
                        isDe
                          ? "Frische knackige Salata Baladi Schale mit Gurken, Tomaten und Minze bei King Tut"
                          : "Crisp fresh Salata Baladi bowl with cucumber, tomato, and mint at King Tut"
                      }
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute bottom-3 left-3">
                      <span className="rounded-md bg-forest/85 text-white px-2.5 py-1 text-[11px] font-bold backdrop-blur-xs">
                        {isDe ? "🥗 Frische Salata Baladi" : "🥗 Fresh Salata Baladi"}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-[10px] text-forest/50 italic">
                  {isDe
                    ? "Originalaufnahme unseres Community-Mitglieds vor Ort"
                    : "Original photo taken on-site by our community member"}
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 3: THE MONUMENTAL SILVER PLATTER (Mixed Grill) */}
          <section className="space-y-4">
            <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest/5">
                <img
                  src="/magazin/king-tut-berlin/17_king_tut_silver_grill_hd.jpg?v=2"
                  alt={
                    isDe
                      ? "Große ornamentale King Tut Silberplatte mit Holzkohlegrill, Lammkoteletts, Kofta und Shish Tawook"
                      : "Grand ornate King Tut silver platter with charcoal mixed grill, lamb chops, kofta and shish tawook"
                  }
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/90 backdrop-blur-md text-white px-3.5 py-1 text-xs font-bold shadow-md">
                    <Sparkles className="h-3.5 w-3.5 text-[#E6B84A]" aria-hidden="true" />
                    <span>
                      {isDe
                        ? "🔥 Das Highlight: Die Silberplatte"
                        : "🔥 The Signature: The Silver Platter"}
                    </span>
                  </span>
                </div>
              </div>
              <div className="mt-2.5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-forest/60">
                <span>
                  {isDe
                    ? "Der Holzkohlegrill auf graviertem Silber: Karamellisierte Lammkoteletts, saftige Kofta, Shish Tawook und gegrillte Paprika auf Reis."
                    : "Charcoal grill on engraved silver: Caramelized lamb chops, juicy kofta, shish tawook, and grilled peppers over rice."}
                </span>
                <span className="italic text-[10px] text-forest/50 shrink-0">
                  {isDe
                    ? "Digital softwareoptimierte Detailansicht ohne Personen"
                    : "Digitally software-enhanced detail view with zero people"}
                </span>
              </div>
            </div>

            <div className="text-forest/85 leading-relaxed text-base sm:text-lg space-y-4 pt-2">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest">
                {isDe
                  ? "„Als die dampfende Silberplatte kam, haben alle das Handy gezückt“"
                  : "“When the steaming silver platter arrived, everyone pulled out their phones”"}
              </h2>
              <p>
                {isDe
                  ? "Das optische und geschmackliche Meisterstück war die große Grillplatte. Bei King Tut wird das Fleisch nicht einfach auf einem gewöhnlichen Teller serviert, sondern auf kunstvoll gravierten, glänzenden Silberplatten:"
                  : "The visual and culinary masterpiece was the grand grill platter. At King Tut, grilled specialties aren't served on ordinary plates, but on artfully embossed, shiny silver platters:"}
              </p>
              <p>
                {isDe
                  ? "Karamellisierte Lammkoteletts mit feinsten Röstaromen vom Holzkohlegrill, würzige, saftige Kofta-Spieße und zart marinierte Hähnchenstücke (Shish Tawook). Das Ganze liegt auf einem fluffigen Bett aus ägyptischem Reis mit gerösteten Fadennudeln (Ruz me'shariyeh) und buntem Röstgemüse. Dazu die beiden unverzichtbaren Saucen: samtig-feine Sesamtahina mit feinen Olivenöltropfen und eine intensive, weiße Knoblauchcreme (Toum), die perfekt zu dem Fleisch passte."
                  : "Caramelized lamb chops with crisp char from the charcoal grill, juicy seasoned kofta skewers, and tender marinated shish tawook chicken chunks. All served over fragrant Egyptian vermicelli rice (Ruz me'shariyeh) with grilled peppers and tomatoes. Accompanied by two essential dips: silky sesame tahini with olive oil swirls and vibrant garlic toum that pairs delightfully with the hot meat."}
              </p>
            </div>
          </section>

          {/* SECTION 4: 2-COLUMN REAL VISIT GALLERY */}
          <section className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest/60 block mb-1">
                {isDe ? "Eindrücke vor Ort" : "On-Site Atmosphere"}
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-forest">
                {isDe
                  ? "Gemütliche Atmosphäre & echte Details"
                  : "Cozy Ambiance & Authentic Touches"}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-md hover:border-[#E6B84A] transition-all">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest/5">
                  <img
                    src="/magazin/king-tut-berlin/20_dining_room_slat_wall_table.jpg?v=2"
                    alt={
                      isDe
                        ? "Moderner Gastraum bei King Tut mit bequemen Polsterbänken und Holzlamellen"
                        : "Modern dining room at King Tut with comfortable bench seating and wood slats"
                    }
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-md bg-forest/85 text-white px-2.5 py-1 text-[11px] font-bold">
                      {isDe
                        ? "✨ Viel Platz für Freunde & Familie"
                        : "✨ Great for Friends & Family"}
                    </span>
                  </div>
                </div>
                <h4 className="mt-3 font-bold text-forest text-sm">
                  {isDe ? "Moderne Gemütlichkeit in Wilmersdorf" : "Modern Comfort in Wilmersdorf"}
                </h4>
                <p className="mt-1 text-xs text-forest/70">
                  {isDe
                    ? "Gedeckte Tische, ruhige Akustik durch Holzlamellen und genug Raum, um sich in Ruhe zu unterhalten."
                    : "Clean set tables, pleasant acoustics through wood slat panels, and plenty of room to converse."}
                </p>
              </div>

              <div className="relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-md hover:border-[#E6B84A] transition-all">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest/5">
                  <img
                    src="/magazin/king-tut-berlin/22_gold_mask_window_display.jpg?v=2"
                    alt={
                      isDe
                        ? "Goldene Tutanchamun-Maske in der Glasvitrine am Fenster von King Tut"
                        : "Golden Tutankhamun mask display in the window case at King Tut"
                    }
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-md bg-forest/85 text-white px-2.5 py-1 text-[11px] font-bold">
                      {isDe ? "👑 Der Namensgeber" : "👑 The Namesake"}
                    </span>
                  </div>
                </div>
                <h4 className="mt-3 font-bold text-forest text-sm">
                  {isDe ? "Die goldene Maske von King Tut" : "The Golden Mask of King Tut"}
                </h4>
                <p className="mt-1 text-xs text-forest/70">
                  {isDe
                    ? "Ein schöner Blickfang am Fenster zum Hohenzollerndamm mit dem goldenen King-Tut-Schild."
                    : "A charming centerpiece by the window onto Hohenzollerndamm with the brass King Tut plaque."}
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 5: SWEET FINALE */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-forest/10 shadow-xs space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E6B84A]">
              <Sparkles className="h-4 w-4" />
              <span>{isDe ? "Der süße Abschluss" : "The Sweet Finale"}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest">
              {isDe
                ? "Der perfekte Ausklang: Umm Ali & frischer Minztee"
                : "The Perfect Ending: Umm Ali & Fresh Mint Tea"}
            </h2>
            <p className="text-forest/80 leading-relaxed text-sm sm:text-base">
              {isDe
                ? "Unser Tipp an alle Besucher: Lasst unbedingt noch ein bisschen Platz für den Nachtisch. Wir haben uns das ofenfrische Umm Ali (أم علي) geteilt – der berühmte ägyptische Brotpudding mit Blätterteig, heißer gesüßter Milch, gerösteten Nüssen und Rosinen, der direkt im heißen Tontopf serviert wird. Dazu ein Glas frisch aufgebrühter Schwarztee mit frischen Pfefferminzblättern. Der perfekte Abschluss für einen rundum gelungenen Abend."
                : "Our tip for anyone visiting: save some room for dessert. We shared an oven-fresh bowl of Umm Ali (أم علي) – the famous Egyptian bread pudding made with flaky pastry, sweetened milk, toasted nuts, and raisins, served steaming in a clay pot. Paired with freshly brewed hot black tea and fresh mint leaves, it was the crowning touch to a wonderful gathering."}
            </p>
          </section>

          {/* SECTION 6: TRANSPARENCY & PHOTO ENHANCEMENT DISCLOSURE (Requested by user) */}
          <section className="rounded-2xl p-4 sm:p-5 bg-white/60 border border-forest/10 text-xs text-forest/70 space-y-2">
            <div className="flex items-center gap-2 font-bold text-forest">
              <Info className="h-4 w-4 text-[#7FA46B]" />
              <span>
                {isDe
                  ? "Transparenzhinweis & Foto-Information"
                  : "Transparency Note & Photo Disclosure"}
              </span>
            </div>
            <p className="leading-relaxed">
              {isDe
                ? "Die Fotos und Erfahrungsberichte in diesem Beitrag wurden uns freundlicherweise von einem Mitglied unserer Speisely Community nach dem Restaurantbesuch zur Verfügung gestellt. Um die kulinarischen Details der Gerichte optimal zur Geltung zu bringen und gleichzeitig die Privatsphäre der anwesenden Gäste und Mitarbeiter zu schützen (Entfernung von Personen und Gesichtern), wurden ausgewählte Nahaufnahmen mithilfe moderner digitaler Bildbearbeitungssoftware optimiert."
                : "The photos and dining impressions in this story were kindly provided by a member of our Speisely Community after their restaurant visit. To best showcase the appetizing textures and details of the dishes while fully respecting the privacy of other dining guests (removal of people and background faces), select photographs were digitally enhanced using imaging software."}
            </p>
          </section>

          {/* SECTION 7: VISITING GUIDE & RESERVATION BOX */}
          <section className="bg-gradient-to-br from-[#EBF4EC] to-[#FAF7F0] rounded-3xl p-6 sm:p-8 border border-[#7FA46B]/25 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-forest/60">
                  {isDe ? "Alle Infos auf einen Blick" : "All Details at a Glance"}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-forest mt-1">
                  King Tut Restaurant & Café besuchen
                </h3>
              </div>
              <a
                href="https://kingtutrestaurant.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-forest text-white px-5 py-2.5 text-xs font-bold hover:bg-forest/90 transition shadow-md shrink-0"
              >
                <Globe className="h-4 w-4" />
                <span>{isDe ? "Website & Reservierung" : "Website & Booking"}</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-forest/10">
                <span className="font-bold text-forest block mb-1">📍 Adresse</span>
                <p className="text-forest/75 leading-relaxed">
                  Hohenzollerndamm 11
                  <br />
                  10717 Berlin-Wilmersdorf
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-forest/10">
                <span className="font-bold text-forest block mb-1">📞 Telefon & E-Mail</span>
                <p className="text-forest/75 leading-relaxed">
                  <a href="tel:+4917614837601" className="hover:underline">
                    +49 176 1483 7601
                  </a>
                  <br />
                  <a
                    href="mailto:info@kingtutrestaurant.de"
                    className="hover:underline truncate block"
                  >
                    info@kingtutrestaurant.de
                  </a>
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-forest/10">
                <span className="font-bold text-forest block mb-1">⏰ Öffnungszeiten</span>
                <p className="text-forest/75 leading-relaxed">
                  Mo–Do: 12:00 – 22:30
                  <br />
                  Fr: 13:00 – 23:30
                  <br />
                  Sa: 12:00 – 00:00
                  <br />
                  So: 15:00 – 22:30
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-forest/10">
                <span className="font-bold text-forest block mb-1">📱 Instagram</span>
                <p className="text-forest/75 leading-relaxed">
                  <a
                    href="https://www.instagram.com/king_tut_berlin/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline inline-flex items-center gap-1 text-forest font-semibold"
                  >
                    <Instagram className="h-3.5 w-3.5 text-[#E6B84A]" />
                    @king_tut_berlin
                  </a>
                  <span className="block text-forest/60 text-[11px] mt-0.5">8.8k Follower</span>
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-forest/10 flex flex-wrap items-center justify-between gap-3 text-xs text-forest/75">
              <span>
                {isDe
                  ? "💡 Tipp: Auch größere Tische für Familien & Geburtstage lassen sich problemlos reservieren."
                  : "💡 Tip: Larger tables for families and celebrations can easily be booked in advance."}
              </span>
              <a
                href="https://www.google.com/maps?q=King+tut+Restaurant+caf%C3%A9,+Hohenzollerndamm+11,+10717+Berlin,+Germany&ftid=0x47a8517144edc3fd:0x135c761d47397f00"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-forest hover:text-[#7FA46B] underline"
              >
                {isDe ? "Route in Google Maps aufrufen →" : "View route in Google Maps →"}
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
                  ? "Warst du auch bei King Tut oder hast einen Geheimtipp?"
                  : "Have you visited King Tut or found another hidden gem?"}
              </h3>
              <p className="text-forest/70 text-xs sm:text-sm max-w-xl">
                {isDe
                  ? "Schick uns deine Fotos und deine Geschichte. Wir veröffentlichen echte Empfehlungen aus der Speisely Community, um authentische Gastgeber sichtbar zu machen."
                  : "Send us your photos and your story. We publish honest recommendations from the Speisely Community to spotlight authentic culinary hosts."}
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
