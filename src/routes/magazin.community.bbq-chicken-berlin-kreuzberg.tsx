import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  Clock,
  Globe,
  Instagram,
  Utensils,
  Sparkles,
  Users,
  CheckCircle2,
  Heart,
  Camera,
  Info,
  Flame,
  Award,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Share2,
  Bookmark,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { SiteShell } from "@/components/SiteShell";
import { AboutSpeiselySection } from "@/components/AboutSpeiselySection";

export const Route = createFileRoute("/magazin/community/bbq-chicken-berlin-kreuzberg")({
  head: () => ({
    meta: [
      { title: "BBQ Chicken Berlin-Kreuzberg — Speisely" },
      {
        name: "description",
        content:
          "BBQ Chicken in der Skalitzer Straße 97 in Berlin-Kreuzberg: Golden Fried Chicken, Cheesling & Secret Glaze im Speisely Community-Test.",
      },
      {
        name: "keywords",
        content:
          "BBQ Chicken Berlin, Korean Fried Chicken Kreuzberg, Skalitzer Straße 97, bb.q Chicken Berlin, Cheesling Chicken, Secret Spicy Glaze, Tteokbokki Berlin, Speisely Community Bericht, Halal Korean Food Berlin",
      },
      { name: "geo.region", content: "DE-BE" },
      { name: "geo.placename", content: "Berlin-Kreuzberg" },
      { name: "geo.position", content: "52.5015;13.4180" },
      { name: "ICBM", content: "52.5015, 13.4180" },
      {
        property: "og:title",
        content: "Community-Erfahrungsbericht: BBQ Chicken Berlin-Kreuzberg | Speisely",
      },
      {
        property: "og:description",
        content:
          "Authentischer Seoul-Streetfood-Crunch in der Skalitzer Straße: Wie gut schmeckt das weltberühmte bb.q Chicken in Berlin-Kreuzberg wirklich? Unser ausführlicher Vor-Ort-Bericht.",
      },
      {
        property: "og:image",
        content:
          "https://speisely.de/magazin/bbq-chicken-berlin/01_golden_fried_chicken_hero.jpg?v=2",
      },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "de_DE" },
      {
        property: "og:url",
        content: "https://speisely.de/magazin/community/bbq-chicken-berlin-kreuzberg",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://speisely.de/magazin/community/bbq-chicken-berlin-kreuzberg",
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
              "@id": "https://speisely.de/magazin/community/bbq-chicken-berlin-kreuzberg#article",
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": "https://speisely.de/magazin/community/bbq-chicken-berlin-kreuzberg",
              },
              headline:
                "Community-Besuch bei BBQ Chicken in Berlin-Kreuzberg — Authentisches K-Food & maximaler Crunch",
              description:
                "Ein Speisely Community-Mitglied hat die Filiale in der Skalitzer Straße 97 besucht und teilt seine ehrlichen Eindrücke, Texturen, Saucen-Highlights und Fotos.",
              image: {
                "@type": "ImageObject",
                url: "https://speisely.de/magazin/bbq-chicken-berlin/01_golden_fried_chicken_hero.jpg?v=2",
                width: 1200,
                height: 900,
              },
              datePublished: "2026-10-07",
              dateModified: "2026-10-07",
              author: {
                "@type": "Organization",
                name: "Speisely Community",
                url: "https://speisely.de/community",
              },
              publisher: {
                "@type": "Organization",
                name: "Speisely",
                url: "https://speisely.de",
              },
            },
            {
              "@type": "Restaurant",
              "@id":
                "https://speisely.de/magazin/community/bbq-chicken-berlin-kreuzberg#restaurant",
              name: "BBQ Chicken Berlin-Kreuzberg (bb.q Chicken)",
              servesCuisine: ["Korean", "Korean Fried Chicken", "Asian Street Food"],
              address: {
                "@type": "PostalAddress",
                streetAddress: "Skalitzer Straße 97",
                postalCode: "10997",
                addressLocality: "Berlin",
                addressRegion: "Berlin",
                addressCountry: "DE",
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
                  opens: "12:00",
                  closes: "23:00",
                },
              ],
              url: "https://www.bbq-chicken.de",
            },
          ],
        }),
      },
    ],
  }),
  component: BbqChickenBerlinStory,
});

function BbqChickenBerlinStory() {
  const { lang } = useI18n();
  const isDe = lang === "de";

  const emailSubject = isDe
    ? "Mein Besuch bei BBQ Chicken Kreuzberg – Feedback für Speisely Community"
    : "My visit to BBQ Chicken Kreuzberg – Feedback for Speisely Community";

  const emailBody = isDe
    ? `Hallo Speisely-Team,\n\nich habe BBQ Chicken in Berlin-Kreuzberg besucht und möchte meine Erfahrung teilen.\n\nMein Lieblingsgericht:\nAtmosphäre & Service:\nFotos anbei:`
    : `Hello Speisely Team,\n\nI visited BBQ Chicken in Berlin-Kreuzberg and want to share my experience.\n\nFavorite dish:\nAtmosphere & Service:\nPhotos attached:`;

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
                  BBQ Chicken Berlin
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
              ? "Seoul-Streetfood in Kreuzberg: Unser Besuch bei BBQ Chicken in Berlin"
              : "Seoul Street Food in Kreuzberg: Our Visit to BBQ Chicken in Berlin"}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-forest/80 leading-relaxed font-normal">
            {isDe
              ? "Ein Mitglied unserer Speisely Community war in der Skalitzer Straße 97 unterwegs. Hier ist der persönliche Bericht: Vom legendären doppelten Crunch über schneeweißen Cheesling-Puder bis zu feurig-glänzenden Secret Glazes und heißem Tteokbokki."
              : "A member of our Speisely Community visited Skalitzer Straße 97 in Kreuzberg. Here is their honest story: from the legendary acoustic double crunch and Cheesling snow powder to glossy Secret Glazes and piping hot Tteokbokki."}
          </p>

          {/* Community Visit Meta Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-forest/70 border-y border-forest/10 py-3">
            <span className="inline-flex items-center gap-1.5 font-semibold text-forest">
              <Camera className="h-3.5 w-3.5 text-[#E6B84A]" />
              {isDe
                ? "Fotos & Menü-Originale von Community aufbereitet"
                : "Photos & official menu curated by community"}
            </span>
            <span className="text-forest/30">•</span>
            <span>
              {isDe ? "Vor-Ort-Besuch in Berlin-Kreuzberg" : "Field visit in Berlin-Kreuzberg"}
            </span>
            <span className="text-forest/30">•</span>
            <span className="font-semibold text-emerald-700">✓ Halal-Optionen verifiziert</span>
          </div>

          {/* Quick Facts Card */}
          <div className="mt-6 p-5 sm:p-6 rounded-3xl border border-forest/10 bg-white shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-[#E6B84A] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Ort" : "Location"}
                </span>
                <strong className="font-semibold text-forest">BBQ Chicken Kreuzberg</strong>
                <span className="block text-forest/70 text-xs">
                  Skalitzer Straße 97, 10997 Berlin
                </span>
                <span className="block text-forest/60 text-[11px]">
                  {isDe
                    ? "Kreuzberg Kiez (U-Görlitzer Bahnhof)"
                    : "Kreuzberg Hub (U-Görlitzer Bahnhof)"}
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
                  {isDe ? "Golden Fried & Cheesling" : "Golden Fried & Cheesling"}
                </strong>
                <span className="block text-forest/70 text-xs">
                  {isDe
                    ? "Secret Sauce, Rosé Tteokbokki & Mandu"
                    : "Secret Sauce, Rosé Tteokbokki & Mandu"}
                </span>
                <span className="block text-forest/60 text-[11px]">
                  {isDe ? "Eingelegter Rettich (Chicken-Mu)" : "Pickled Radish (Chicken-Mu)"}
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
                  {isDe ? "Täglich geöffnet" : "Open Daily"}
                </strong>
                <span className="block text-forest/70 text-xs">
                  Montag – Sonntag: 12:00 – 23:00 Uhr
                </span>
                <span className="block text-forest/60 text-[11px]">
                  {isDe ? "Küche schließt: 22:00 Uhr" : "Kitchen closes: 22:00"}
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
                  src="/magazin/bbq-chicken-berlin/01_golden_fried_chicken_hero.jpg?v=2"
                  alt={
                    isDe
                      ? "Golden Fried Chicken Servierschale bei BBQ Chicken Berlin-Kreuzberg"
                      : "Golden Fried Chicken serving platter at BBQ Chicken Berlin-Kreuzberg"
                  }
                  className="h-full w-full object-cover"
                  loading="eager"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/90 backdrop-blur-md text-white px-3.5 py-1 text-xs font-bold shadow-md">
                    <Sparkles className="h-3.5 w-3.5 text-[#E6B84A]" aria-hidden="true" />
                    <span>{isDe ? "Der Signature Crunch" : "The Signature Crunch"}</span>
                  </span>
                </div>
              </div>
              <div className="mt-2.5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-forest/60">
                <span>
                  {isDe
                    ? "Der Tisch bei BBQ Chicken: Golden Fried Chicken — zweifach ausgebacken, kross wie Blätterteig und herrlich saftig."
                    : "The table at BBQ Chicken: Golden Fried Chicken — double-fried, delicately flaky like pastry, and exceptionally juicy."}
                </span>
                <span className="italic text-[10px] text-forest/50 shrink-0">
                  {isDe
                    ? "Foto-Upgrade in HD aus der Speisely Community"
                    : "HD photo upgraded from Speisely Community"}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-forest/10 shadow-xs space-y-4 text-forest/90 leading-relaxed text-base sm:text-lg">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest">
                {isDe
                  ? "Der Tisch füllt sich: Mehr als nur gewöhnliches Fried Chicken"
                  : "The Feast Arrives: Far More Than Ordinary Fried Chicken"}
              </h2>
              <p>
                {isDe
                  ? "Wer Berlin-Kreuzberg kulinarisch erkundet, erwartet handgemachte Qualität und starke Kiez-Atmosphäre. Als wir die Skalitzer Straße 97 betraten, fiel sofort der Duft von geröstetem Sesam, Knoblauch und karamellisierender Sojasauce auf. Korean Fried Chicken ist hier kein Fast Food für zwischendurch, sondern ein zelebriertes Handwerk."
                  : "Anyone exploring Kreuzberg's dining landscape anticipates bold flavors and community character. Stepping into Skalitzer Straße 97, the aroma of toasted sesame, roasted garlic, and caramelizing soy sauce immediately sets the tone. Korean Fried Chicken here is crafted with precision."}
              </p>
              <p>
                {isDe
                  ? "Das Geheimnis liegt im traditionellen koreanischen Frittierverfahren: Durch das zweimalige Ausbacken wird das Hähnchen hauchdünn und glasartig kross. Die Kruste splittert bei jedem Bissen hörbar, ohne dass Fett im Mund zurückbleibt."
                  : "The secret lies in the double-frying technique: water evaporates, excess fat renders away, and the batter solidifies into an acoustic, wafer-thin crust that withstands heavy marinades without losing its snap."}
              </p>
            </div>
          </section>

          {/* SECTION 2: OFFICIAL MENU SPECIALTIES (TRANSFORMED FROM BBQ-CHICKEN.DE/MENÜ) */}
          <section className="space-y-6">
            <div className="border-t border-forest/10 pt-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9E6D18] block mb-1">
                {isDe ? "Speisekarte & Spezialitäten" : "Menu & Specialties"}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest">
                {isDe
                  ? "Die 6 offiziellen Menü-Klassiker von bb.q Chicken"
                  : "The 6 Official Menu Classics from bb.q Chicken"}
              </h2>
              <p className="text-sm text-forest/75 mt-1">
                {isDe
                  ? "Direkt aus der offiziellen Speisekarte entnommen und von unserer Community verkostet: Ob trocken gewürzt oder glasiert in Signature-Saucen."
                  : "Curated directly from the official menu and tasted by our community: dry-rubbed dusted classics and glazed specialties."}
              </p>
            </div>

            {/* 6 Official Menu Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* 1. Black Pepper */}
              <div className="surface-card rounded-3xl border border-forest/10 p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-forest/5 mb-3">
                    <img
                      src="/magazin/bbq-chicken-berlin/menu_black_pepper_hd.png"
                      alt="Black Pepper Fried Chicken"
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-forest/90 text-white text-[11px] font-bold">
                      Stufe 2 · Würzig
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-forest">Black Pepper</h3>
                  <p className="text-xs text-forest/75 mt-1 leading-relaxed">
                    Mit geschrotetem schwarzem Pfeffer gewürzt für eine feine, aromatische Schärfe.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-forest/10 text-[11px] font-semibold text-[#9E6D18]">
                  Trocken gewürzt · Pfeffriger Crunch
                </div>
              </div>

              {/* 2. Cheesling */}
              <div className="surface-card rounded-3xl border border-forest/10 p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-forest/5 mb-3">
                    <img
                      src="/magazin/bbq-chicken-berlin/menu_cheesling_hd.png"
                      alt="Cheesling Fried Chicken"
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#E6B84A] text-forest text-[11px] font-bold">
                      Der Kult-Hit
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-forest">Cheesling</h3>
                  <p className="text-xs text-forest/75 mt-1 leading-relaxed">
                    Bestaubt mit samtig-herzhaftem Cheddar- und Mascarponepulver mit feiner Süße.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-forest/10 text-[11px] font-semibold text-[#9E6D18]">
                  Schneeweißer Käsepuder · Süß & Salzig
                </div>
              </div>

              {/* 3. Lemon Cheesling */}
              <div className="surface-card rounded-3xl border border-forest/10 p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-forest/5 mb-3">
                    <img
                      src="/magazin/bbq-chicken-berlin/menu_lemon_cheesling_hd.png"
                      alt="Lemon Cheesling Fried Chicken"
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-emerald-700/90 text-white text-[11px] font-bold">
                      Fruchtig & Frisch
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-forest">Lemon Cheesling</h3>
                  <p className="text-xs text-forest/75 mt-1 leading-relaxed">
                    Cheesling-Puder, beträufelt mit süß-saurem Zitronendressing für spritzigen
                    Genuss.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-forest/10 text-[11px] font-semibold text-[#9E6D18]">
                  Frische Zitrone · Samtige Käsenote
                </div>
              </div>

              {/* 4. Secret Sauce */}
              <div className="surface-card rounded-3xl border border-forest/10 p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-forest/5 mb-3">
                    <img
                      src="/magazin/bbq-chicken-berlin/menu_secret_hd.png"
                      alt="Secret Sauce Fried Chicken"
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-red-700/90 text-white text-[11px] font-bold">
                      Stufe 1 · 20 Zutaten
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-forest">Secret Sauce</h3>
                  <p className="text-xs text-forest/75 mt-1 leading-relaxed">
                    Süßliche Secret-Sauce aus 20 Zutaten: koreanische Chili-Paste, Zwiebeln und
                    Knoblauch.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-forest/10 text-[11px] font-semibold text-[#9E6D18]">
                  Klebrig-rot · Traditioneller K-Klassiker
                </div>
              </div>

              {/* 5. Galbi */}
              <div className="surface-card rounded-3xl border border-forest/10 p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-forest/5 mb-3">
                    <img
                      src="/magazin/bbq-chicken-berlin/menu_galbi_hd.png"
                      alt="Galbi Korean BBQ Sauce"
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-stone-700/90 text-white text-[11px] font-bold">
                      Rauchig & Deftig
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-forest">Galbi BBQ</h3>
                  <p className="text-xs text-forest/75 mt-1 leading-relaxed">
                    Mariniert mit traditioneller, herzhafter Korean BBQ Sauce, geröstetem Sesam und
                    Soja.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-forest/10 text-[11px] font-semibold text-[#9E6D18]">
                  Sojasauce & Knoblauch · BBQ-Kult
                </div>
              </div>

              {/* 6. Honey Garlic */}
              <div className="surface-card rounded-3xl border border-forest/10 p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-forest/5 mb-3">
                    <img
                      src="/magazin/bbq-chicken-berlin/menu_honey_garlic_hd.png"
                      alt="Honey Garlic Fried Chicken"
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-amber-600/90 text-white text-[11px] font-bold">
                      Harmonisch & Mild
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-forest">Honey Garlic</h3>
                  <p className="text-xs text-forest/75 mt-1 leading-relaxed">
                    Aromatisch-süßer Honig, frischer Knoblauch und Sojasauce für ein rundes
                    Geschmacksprofil.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-forest/10 text-[11px] font-semibold text-[#9E6D18]">
                  Echter Bienenhonig · Gerösteter Knoblauch
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: K-STREETFOOD & SOULFOOD (AUTHENTIC KOREAN SIDES FROM BBQ-CHICKEN.DE) */}
          <section className="space-y-6">
            <div className="border-t border-forest/10 pt-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9E6D18] block mb-1">
                {isDe ? "Authentische K-Kultur & Beilagen" : "Authentic K-Culture & Sides"}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest">
                {isDe
                  ? "Mehr als nur Fried Chicken: Rosé Tteokbokki, Bulgogi Mandu & Chicken-Mu"
                  : "More Than Fried Chicken: Rosé Tteokbokki, Bulgogi Mandu & Chicken-Mu"}
              </h2>
              <p className="text-sm text-forest/75 mt-1">
                {isDe
                  ? "In der koreanischen Esskultur wird der Tisch geteilt: Neben krossem Geflügel gehören dampfende Pfannen, Teigtaschen und erfrischende Pickles unverzichtbar dazu."
                  : "In Korean dining, meals are meant to be shared: alongside crispy poultry, sizzling pans, dumplings, and crisp pickles are essential."}
              </p>
            </div>

            {/* 2-Column Food Showcase Cards (King Tut Standard) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Rosé Tteokbokki */}
              <div className="surface-card rounded-3xl border border-forest/10 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-forest/5 mb-4 border border-forest/10">
                    <img
                      src="/magazin/bbq-chicken-berlin/20_rose_tteokbokki_hd.jpg?v=2"
                      alt="Rosé Tteokbokki Pfanne bei BBQ Chicken Berlin"
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-forest/90 text-white text-xs font-bold shadow-md">
                      🌶️ Samtig-scharf
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-forest">
                    {isDe ? "Rosé Tteokbokki (로제 떡볶이)" : "Rosé Tteokbokki"}
                  </h3>
                  <p className="text-xs sm:text-sm text-forest/75 mt-2 leading-relaxed">
                    {isDe
                      ? "Zylinderförmige koreanische Reiskuchen und Fischfrikadellen (Eomuk), gegart in samtiger Chili-Sahne-Sauce. Der Biss ist herrlich elastisch („chewy“), während die Sahne der Schärfe eine cremige Milde verleiht."
                      : "Cylindrical Korean rice cakes and fish cakes simmered in velvety chili-cream sauce. The bite is signature chewy, while the rich cream balances the Gochujang heat perfectly."}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-forest/10 text-xs font-semibold text-[#9E6D18]">
                  Traditioneller Reiskuchen-Kult · Sämige Gochujang-Creme
                </div>
              </div>

              {/* Card 2: Bulgogi Mandu */}
              <div className="surface-card rounded-3xl border border-forest/10 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-forest/5 mb-4 border border-forest/10">
                    <img
                      src="/magazin/bbq-chicken-berlin/21_bulgogi_mandu_hd.jpg?v=2"
                      alt="Bulgogi Mandu gebratene Teigtaschen"
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#E6B84A] text-forest text-xs font-bold shadow-md">
                      🥟 Knusprig gebraten
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-forest">
                    {isDe ? "Bulgogi Mandu (불고기 만두)" : "Bulgogi Mandu"}
                  </h3>
                  <p className="text-xs sm:text-sm text-forest/75 mt-2 leading-relaxed">
                    {isDe
                      ? "Außen zart-knusprig auf dem Servierblech ausgebacken, innen gefüllt mit saftigem Rindfleisch im Korean-BBQ-Stil, Frühlingszwiebeln und Knoblauch. Zusammen mit Soja-Dip ein absolutes Muss."
                      : "Delicately crisp on the outside, stuffed with seasoned Korean BBQ beef, scallions, and garlic. Paired with house dipping sauce, an irresistible starter."}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-forest/10 text-xs font-semibold text-[#9E6D18]">
                  Korean BBQ Rindfleisch · Knusprige Teigtaschen
                </div>
              </div>
            </div>

            {/* Editorial Feature Box: Chicken-Mu (Pickled Radish) */}
            <div className="rounded-3xl border border-forest/15 bg-white p-6 sm:p-7 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7FA46B]">
                <Sparkles className="h-4 w-4" />
                <span>
                  {isDe ? "Der Gaumenöffner der K-Küche" : "The Essential Palate Cleanser"}
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-forest">
                {isDe
                  ? "Der heimliche Star des Tisches: Eingelegter weißer Rettich (Chicken-Mu / 치킨무)"
                  : "The Secret Hero of the Table: Pickled Radish (Chicken-Mu)"}
              </h3>
              <p className="text-xs sm:text-sm text-forest/80 leading-relaxed">
                {isDe
                  ? "Wer schon einmal in Seoul ein traditionelles Chicken-Lokal besucht hat, weiß: Ohne „Chicken-Mu“ ist die Mahlzeit unvollständig. Die eiskalten, weißen Rettichwürfel in süß-säuerlicher Lake sind nicht bloß hübsche Beigabe, sondern ein genialer kulinarischer Gaumenreiniger. Nach herzhaftem Crunch und feurigen Saucen neutralisiert ein einziger Bissen die Fettnoten im Nu – und bereitet den Mund perfekt auf das nächste saftige Hähnchenstück vor."
                  : "Anyone who has dined in Seoul knows: no chicken order is complete without 'Chicken-Mu'. The chilled, crisp white radish cubes in sweet-tangy brine act as the ultimate palate cleanser, cutting right through richness and refreshing your palate for the next bite."}
              </p>
            </div>
          </section>

          {/* SECTION 4: INSIDER ORDERING GUIDE & KREUZBERG KIEZ-VIBE (COMBINED GUIDE) */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-forest/10 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#9E6D18] block mb-1">
                {isDe ? "Insider-Tipps & Kiez-Atmosphäre" : "Insider Tips & Neighborhood Vibe"}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest">
                {isDe
                  ? "Der Speisely Bestell-Guide: Ban-Ban Prinzip, Schärfegrade & Görli-Vibe"
                  : "The Speisely Ordering Guide: Ban-Ban Rule, Spice Levels & Görli Vibe"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box 1: Ordering Guide (Ban-Ban & Spice) */}
              <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-forest/10 space-y-3">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-red-600" />
                  <strong className="text-forest text-sm sm:text-base font-bold">
                    {isDe ? "1. Die goldene Ban-Ban Regel (반반)" : "1. The Golden Ban-Ban Rule"}
                  </strong>
                </div>
                <p className="text-xs sm:text-sm text-forest/75 leading-relaxed">
                  {isDe
                    ? "Bestelle nie nur eine Sorte! Korean Fried Chicken lebt vom Geschmacks-Kontrast. Die ideale Kombination für 2 Personen: Eine milde, trockene Knusper-Sorte (wie Cheesling oder Honey Garlic) kombiniert mit einer glasierten Sauce (wie Secret Sauce oder rauchigem Galbi BBQ). So bleibt jeder Bissen bis zum Schluss abwechslungsreich."
                    : "Never order just one flavor! Korean Fried Chicken is all about taste contrasts. The ideal pair for two: one mild, crispy dry-rub (like Cheesling or Honey Garlic) paired with a rich glazed flavor (like Secret Sauce or smoky Galbi BBQ)."}
                </p>

                <div className="pt-2 border-t border-forest/10">
                  <span className="block text-[11px] font-bold text-forest/60 uppercase tracking-wider mb-1">
                    {isDe ? "Schärfegrad-Check" : "Heat Level Guide"}
                  </span>
                  <p className="text-xs text-forest/75 leading-relaxed">
                    {isDe
                      ? "Stufe 1 (Secret Sauce) ist fruchtig-mild. Wer echte Schärfe sucht, greift zu Hot Spicy oder dem betäubenden Sichuan-Kick von Mala Hot (Stufe 4)."
                      : "Level 1 (Secret Sauce) offers sweet, mild fruitiness. For true heat, go with Hot Spicy or the tongue-tingling Sichuan kick of Mala Hot (Level 4)."}
                  </p>
                </div>
              </div>

              {/* Box 2: Kreuzberg Vibe & Görli Picnic */}
              <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-forest/10 space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#E6B84A]" />
                  <strong className="text-forest text-sm sm:text-base font-bold">
                    {isDe
                      ? "2. Dine-In oder Görlitzer-Park-Picknick?"
                      : "2. Dine-In or Görlitzer Park Picnic?"}
                  </strong>
                </div>
                <p className="text-xs sm:text-sm text-forest/75 leading-relaxed">
                  {isDe
                    ? "Vor Ort in der Skalitzer Straße 97 herrscht lebendige, unkomplizierte Streetfood-Stimmung: Hocker, Servierbleche, knisternde Fritteusen und Einweghandschuhe, mit denen man das Huhn authentisch mit den Fingern isst."
                    : "Inside Skalitzer Straße 97, expect vibrant, unpretentious street food energy: stools, metal serving trays, sizzling fryers, and finger gloves to enjoy the chicken authentically."}
                </p>

                <div className="pt-2 border-t border-forest/10">
                  <span className="block text-[11px] font-bold text-forest/60 uppercase tracking-wider mb-1">
                    {isDe ? "Community Kiez-Tipp" : "Community Kiez Tip"}
                  </span>
                  <p className="text-xs text-forest/75 leading-relaxed">
                    {isDe
                      ? "Durch die direkte Nähe zum U-Bahnhof Görlitzer Bahnhof holen sich viele Gäste die dampfenden Combo-Boxen als Takeaway. An lauen Sommerabenden ist eine heiße Chicken-Box mit kaltem Chilsung Cider im Görli das ultimative Kiez-Picknick."
                      : "Located right by U-Görlitzer Bahnhof, many locals grab steaming combo boxes to-go. On warm evenings, hot chicken boxes paired with cold drinks in Görlitzer Park make the ultimate Kreuzberg picnic."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: FACTSHEET CARD (KING TUT STANDARD) */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-forest/10 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-forest/10 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#9E6D18] block mb-0.5">
                  Speisely Community Dossier
                </span>
                <h3 className="font-display text-2xl font-bold text-forest">
                  BBQ Chicken Berlin-Kreuzberg
                </h3>
              </div>
              <Award className="h-8 w-8 text-[#E6B84A] shrink-0" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm text-forest/80">
              <div className="space-y-4">
                <div>
                  <strong className="block text-forest text-sm mb-1">
                    {isDe ? "Genaue Anschrift" : "Full Address"}
                  </strong>
                  <p>Skalitzer Straße 97, 10997 Berlin (Kreuzberg)</p>
                  <p className="text-xs text-forest/60 mt-0.5">Nähe U-Bahnhof Görlitzer Bahnhof</p>
                </div>

                <div>
                  <strong className="block text-forest text-sm mb-1">
                    {isDe ? "Küche & Spezialitäten" : "Cuisine & Highlights"}
                  </strong>
                  <p>
                    Korean Fried Chicken, Wings, Boneless, Cheesling, Secret Glaze, Tteokbokki,
                    Mandu
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <strong className="block text-forest text-sm mb-1">
                    {isDe ? "Öffnungszeiten" : "Opening Hours"}
                  </strong>
                  <p>Montag bis Sonntag: 12:00 – 23:00 Uhr</p>
                  <p className="text-xs text-forest/60 mt-0.5">
                    Warme Küche schließt täglich um 22:00 Uhr
                  </p>
                </div>

                <div>
                  <strong className="block text-forest text-sm mb-1">
                    {isDe ? "Ernährung & Halal-Status" : "Dietary & Halal Status"}
                  </strong>
                  <p className="text-emerald-700 font-medium">
                    ✓ Halal-Zertifizierte Hähnchen-Optionen verfügbar
                  </p>
                </div>
              </div>
            </div>

            {/* Online Ordering Links */}
            <div className="pt-4 border-t border-forest/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-forest/70 font-medium">Online bestellen & liefern lassen:</span>
              <div className="flex items-center gap-3">
                <a
                  href="https://wolt.com/de/deu/berlin/restaurant/bbq-chicken-berlin-kreuzberg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-sky-600/10 text-sky-800 border border-sky-600/20 hover:bg-sky-600/20 transition-colors font-bold flex items-center gap-1"
                >
                  Wolt Kreuzberg <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://www.lieferando.de/speisekarte/bbq-chicken-kreuzberg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-orange-600/10 text-orange-800 border border-orange-600/20 hover:bg-orange-600/20 transition-colors font-bold flex items-center gap-1"
                >
                  Lieferando Kreuzberg <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://www.instagram.com/bbqchicken.berlin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-pink-600/10 text-pink-800 border border-pink-600/20 hover:bg-pink-600/20 transition-colors font-bold flex items-center gap-1"
                >
                  @bbqchicken.berlin <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </section>

          {/* SECTION 6: COMMUNITY SUBMISSION BOX (KING TUT STYLE) */}
          <section className="rounded-3xl border border-[#7FA46B]/30 bg-[#EBF4EC] p-6 sm:p-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-forest shadow-xs">
              <Users className="h-3.5 w-3.5 text-[#7FA46B]" />
              <span>{isDe ? "Deine Food-Story auf Speisely" : "Your Food Story on Speisely"}</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-forest">
              {isDe
                ? "Warst du auch bei BBQ Chicken oder hast einen Kiez-Tipp?"
                : "Have you been to BBQ Chicken or discovered a hidden gem?"}
            </h3>
            <p className="mx-auto max-w-xl text-xs sm:text-sm text-forest/80 leading-relaxed">
              {isDe
                ? "Teile deine Fotos, dein Lieblingsgericht und deine ehrliche Meinung mit unserer Community. Wir freuen uns über jede echte Restaurant-Empfehlung!"
                : "Share your photos, favorite dishes, and honest feedback with our community. We celebrate authentic dining experiences across Germany!"}
            </p>
            <div className="pt-2">
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-2 rounded-full bg-forest text-white px-6 py-2.5 text-xs sm:text-sm font-bold shadow-md hover:bg-[#7FA46B] transition"
              >
                <span>{isDe ? "Erfahrung per E-Mail teilen" : "Share via Email"}</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </section>
        </main>

        {/* Global Footer */}
        <AboutSpeiselySection />
      </div>
    </SiteShell>
  );
}
