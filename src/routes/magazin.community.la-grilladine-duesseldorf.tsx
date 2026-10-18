import { AboutSpeiselySection } from "@/components/AboutSpeiselySection";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  Calendar,
  Shield,
  Utensils,
  Info,
  Award,
  Sparkles,
  Flame,
  Fish,
  Coffee,
  Coins,
  Clock,
  Phone,
  Globe,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/i18n/I18nProvider";
import { RestaurantClaimBridge } from "@/components/RestaurantClaimBridge";

export const Route = createFileRoute("/magazin/community/la-grilladine-duesseldorf")({
  head: () => ({
    meta: [
      {
        title: "La Grilladine Düsseldorf: Glut, Ton & Minze",
      },
      {
        name: "description",
        content:
          "Speisely Community Visit bei La Grilladine in Düsseldorf-Oberbilk: Ganze Dorade über Buchenglut, Salzzitronen-Tajine und das Zeremoniell des Atay-Tees.",
      },
      {
        name: "keywords",
        content:
          "La Grilladine Düsseldorf, Marokkanisches Restaurant Düsseldorf, Holzkohlegrill Düsseldorf, Tajine Salzzitronen Oliven, Oberbilk Maghreb Viertel, Dorade Royale Grill, Atay Minztee, Halal Restaurant Düsseldorf, Speisely Community Visit",
      },
      {
        name: "geo.region",
        content: "DE-NW",
      },
      {
        name: "geo.placename",
        content: "Düsseldorf-Oberbilk",
      },
      {
        name: "geo.position",
        content: "51.2155;6.7972",
      },
      {
        name: "ICBM",
        content: "51.2155, 6.7972",
      },
      {
        property: "og:title",
        content: "La Grilladine Düsseldorf: Glut, Ton & Maghreb-Feuer | Speisely Magazin",
      },
      {
        property: "og:description",
        content:
          "Sensorischer Erlebnisbericht aus dem Düsseldorfer Maghreb-Viertel: Meisterhafte Buchenholzkohle-Röstaromen, schmorende Tajine im Tontopf und Atay-Zeremonie.",
      },
      {
        property: "og:image",
        content:
          "https://speisely.de/magazin/la-grilladine-duesseldorf/la_grilladine_dorade_3d.webp?v=2",
      },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "de_DE" },
      {
        property: "og:url",
        content: "https://speisely.de/magazin/community/la-grilladine-duesseldorf",
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://speisely.de/magazin/community/la-grilladine-duesseldorf",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://speisely.de/#organization",
              name: "Speisely",
              url: "https://speisely.de",
              logo: {
                "@type": "ImageObject",
                url: "https://speisely.de/speisely_logo.png",
              },
            },
            {
              "@type": "WebSite",
              "@id": "https://speisely.de/#website",
              url: "https://speisely.de",
              name: "Speisely",
              publisher: {
                "@id": "https://speisely.de/#organization",
              },
              inLanguage: "de-DE",
              contentLocation: {
                "@type": "Restaurant",
                name: "La Grilladine",
                url: "https://la-grilladine.de",
                telephone: "+49 211 94216796",
                priceRange: "€€",
                servesCuisine: "Marokkanisch, Holzkohlegrill, Maghreb",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Dreieckstraße 26",
                  addressLocality: "Düsseldorf",
                  postalCode: "40227",
                  addressRegion: "Nordrhein-Westfalen",
                  addressCountry: "DE",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 51.2155,
                  longitude: 6.7972,
                },
                openingHoursSpecification: [
                  {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                    opens: "12:00",
                    closes: "22:00",
                  },
                  {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: ["Sunday"],
                    opens: "13:00",
                    closes: "21:00",
                  },
                ],
              },
            },
            {
              "@type": "Article",
              "@id": "https://speisely.de/magazin/community/la-grilladine-duesseldorf#article",
              isPartOf: {
                "@id": "https://speisely.de/#website",
              },
              headline:
                "La Grilladine Düsseldorf: Die Magie von Glut, Ton & marokkanischer Gastfreundschaft",
              description:
                "Ein Mitglied der Speisely Community berichtet aus der Dreieckstraße 26 in Düsseldorf: Ganze Dorade über Buchenglut, Salzzitronen-Tajine und die Kunst des Atay-Tees.",
              image:
                "https://speisely.de/magazin/la-grilladine-duesseldorf/la_grilladine_dorade_3d.webp?v=2",
              datePublished: "2026-10-18T12:00:00+02:00",
              dateModified: "2026-10-18T18:00:00+02:00",
              inLanguage: "de-DE",
              author: {
                "@type": "Organization",
                name: "Speisely Community",
                url: "https://speisely.de/community",
              },
              publisher: {
                "@id": "https://speisely.de/#organization",
              },
              about: {
                "@type": "FoodEstablishment",
                name: "La Grilladine",
                servesCuisine: "Marokkanische Küche & Holzkohlespezialitäten",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Dreieckstraße 26",
                  addressLocality: "Düsseldorf",
                  postalCode: "40227",
                  addressCountry: "DE",
                },
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
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
                  name: "La Grilladine Düsseldorf",
                  item: "https://speisely.de/magazin/community/la-grilladine-duesseldorf",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: LaGrilladineArticlePage,
});

function LaGrilladineArticlePage() {
  const { lang } = useI18n();
  const isDe = lang === "de";
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <article className="min-h-screen bg-[#F6F4EB] text-[#173C32]">
      {/* Editorial Navigation Top Bar */}
      <header className="sticky top-0 z-40 bg-[#083822] text-[#F6F4EB] border-b border-[#E6B84A]/30 backdrop-blur-md px-4 py-2.5 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              to="/magazin"
              className="text-xs uppercase tracking-widest text-[#E6B84A] hover:underline flex items-center gap-1 font-bold whitespace-nowrap"
            >
              ← Speisely Magazin
            </Link>
            <span className="text-[#F6F4EB]/30 hidden xs:inline">|</span>
            <span className="text-xs tracking-wider uppercase text-[#F6F4EB]/80 hidden md:inline font-mono truncate">
              Düsseldorf · Oberbilk
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <span className="text-[11px] sm:text-xs font-mono bg-[#E6B84A]/20 text-[#E6B84A] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-bold border border-[#E6B84A]/40 whitespace-nowrap">
              Holzkohle & Tajine
            </span>
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Hero Header Section */}
      <section
        ref={heroRef}
        className="relative bg-gradient-to-b from-[#083822] via-[#0D442B] to-[#F6F4EB] text-white pt-16 pb-20 px-4 overflow-hidden"
      >
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E6B84A]/20 border border-[#E6B84A]/40 px-4 py-1.5 text-xs font-mono font-bold tracking-widest text-[#E6B84A] uppercase shadow-sm">
            <Flame className="w-3.5 h-3.5 text-[#E6B84A]" aria-hidden="true" />
            {isDe
              ? "SPEISELY COMMUNITY VISIT · DÜSSELDORF OBERBILK · MAROKKANISCHE KÜCHE"
              : "SPEISELY COMMUNITY VISIT · DÜSSELDORF OBERBILK · MOROCCAN CUISINE"}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-[#F6F4EB]">
            {isDe ? (
              <>
                La Grilladine Düsseldorf: <br className="hidden sm:inline" />
                <span className="text-[#E6B84A] italic font-normal">
                  Die Kunst von Glut, Ton & Minze
                </span>
              </>
            ) : (
              <>
                La Grilladine Düsseldorf: <br className="hidden sm:inline" />
                <span className="text-[#E6B84A] italic font-normal">
                  The Art of Embers, Clay & Mint
                </span>
              </>
            )}
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#F6F4EB]/85 leading-relaxed font-sans">
            {isDe
              ? "Glühende Buchenholzkohle auf offener Flamme, zischende Dorade Royale mit krossen Kartoffel-Rondellen und stundenlang im Tontopf geschmorte Salzzitronen: Wie ein unverfälschtes Traditionslokal im Düsseldorfer Maghreb-Viertel pure Handwerkskunst zelebriert."
              : "Glowing beechwood embers over open hearth, sizzling whole Dorade Royale with crisp potato crisps, and tagines braised in clay for hours with preserved lemons: How an authentic sanctuary in Düsseldorf's Maghreb district celebrates pure culinary devotion."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#F6F4EB]/70 pt-2">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#E6B84A]" />
              Dreieckstraße 26, 40227 Düsseldorf
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#E6B84A]" />
              {isDe ? "Oktober 2026" : "October 2026"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#7FA46B]" />
              {isDe ? "Unabhängig verkostet & bezahlt" : "Independently tasted & paid"}
            </span>
          </div>
        </div>
      </section>

      {/* Main Editorial Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* Editorial Introduction with Master Drop-Cap (Lindt Style) */}
        <section className="space-y-6">
          <div className="relative">
            <p className="text-lg sm:text-xl leading-relaxed text-[#173C32]/90 font-serif">
              <span className="float-left text-6xl sm:text-7xl leading-[0.8] font-bold font-serif text-[#E6B84A] pr-4 pt-1">
                {isDe ? "W" : "T"}
              </span>
              {isDe ? (
                <>
                  er die Dreieckstraße in Düsseldorf-Oberbilk an einem kühlen Herbstabend betritt,
                  wird noch vor der Eingangstür von einem vertrauten, tiefen Duft empfangen:
                  Trockenes Buchenholz, geschmolzenes Meersalz und die harzige Note glimmender
                  Holzkohle. Hier, im Herzen des lebendigen Düsseldorfer Maghreb-Viertels, liegt{" "}
                  <strong>La Grilladine</strong> — kein poliertes Konzeptrestaurant, sondern ein
                  refugiumhafter Ort, an dem ein einfaches, aber unerbittliches Gesetz gilt:{" "}
                  <em>
                    „Der Geschmack entsteht nicht durch Chichi. Er entsteht durch Hitze, reines Holz
                    und das geduldige Schmoren in gebranntem Ton.“
                  </em>
                </>
              ) : (
                <>
                  alking down Dreieckstraße in Düsseldorf-Oberbilk on a brisk autumn evening, one is
                  greeted before even reaching the threshold by a deep, evocative scent: dry
                  beechwood embers, sea salt, and the aromatic crackle of live charcoal. Here, in
                  the heart of Düsseldorf's vibrant Maghreb quarter, lies{" "}
                  <strong>La Grilladine</strong> — not an over-curated dining concept, but a
                  grounded sanctuary guided by one unbending principle:{" "}
                  <em>
                    "True flavor is never born from superficial fanfare. It is forged through heat,
                    pure wood embers, and the patient alchemy of terracotta clay."
                  </em>
                </>
              )}
            </p>
          </div>

          <p className="text-base text-[#173C32]/80 leading-relaxed font-sans">
            {isDe
              ? "Ein engagiertes Mitglied unserer Speisely Community hat La Grilladine besucht — selbst bezahlt, ohne Ankündigung und mit dem Blick für das Wesentliche. Hinter der schlichten Fassade verbirgt sich eine der verlässlichsten Grill- und Schmorstuben Nordrhein-Westfalens: Ein lebendiger Treffpunkt, an dem Nachbarn aus dem Viertel, Familien von nah und fern sowie Food-Liebhaber aus ganz NRW an rustikalen Tischen zusammenkommen, um ehrliche Gastfreundschaft zu teilen."
              : "An active member of the Speisely community visited La Grilladine — self-paid, unannounced, and with an eye for tactile craftsmanship. Behind its modest storefront lies one of North Rhine-Westphalia's most authentic hearth kitchens: a welcoming, lively gathering place where neighborhood regulars, families from across the region, and food enthusiasts from all walks of life share rustic tables and genuine hospitality."}
          </p>
        </section>

        {/* Hero Image 1: The Counter & Open Grill (Passe-Partout Luxury Frame) */}
        <figure className="relative my-10 max-w-2xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border-2 border-[#173C32]/15 bg-white p-3 shadow-2xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-3xl">
            {/* Frosted Badge */}
            <div className="absolute top-6 left-6 z-10 flex items-center gap-2 rounded-full bg-[#083822]/85 backdrop-blur-md px-3.5 py-1.5 text-xs font-mono font-bold text-[#F6F4EB] border border-[#E6B84A]/40 shadow-lg">
              <Flame className="w-3.5 h-3.5 text-[#E6B84A]" />
              <span>
                {isDe
                  ? "DER GRILL & DIE THEKE · DREIECKSTRASSE"
                  : "THE HEARTH & COUNTER · DREIECKSTRASSE"}
              </span>
            </div>
            <img
              src="/magazin/la-grilladine-duesseldorf/la_grilladine_theke_3d.webp?v=2"
              alt="Frischetheke und Holzkohlegrill bei La Grilladine Düsseldorf mit traditionellen Tajine-Tongefäßen"
              className="w-full h-auto object-cover rounded-2xl"
              width="1024"
              height="768"
              loading="eager"
            />
          </div>
          <figcaption className="text-xs font-mono text-[#173C32]/60 mt-3 text-center">
            {isDe
              ? "Foto: Speisely Community. Das Herzstück von La Grilladine: Die gekühlte Auslage mit frischem Fang und Fleischzuschnitten, flankiert von traditionellen marokkanischen Ton-Tajines."
              : "Photo: Speisely Community. The pulsating heart of La Grilladine: chilled displays of fresh catch and butcher cuts, framed by earthenware tagine pots."}
          </figcaption>
        </figure>

        {/* Section 1: The Hearth & Craft */}
        <section className="space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#173C32] tracking-tight">
            {isDe
              ? "Das Geheimnis des Feuers: Frischetheke und Buchenglut"
              : "The Secret of the Embers: Display Counter & Live Fire"}
          </h2>
          <p className="text-base text-[#173C32]/80 leading-relaxed font-sans">
            {isDe
              ? "Das Bestellen bei La Grilladine folgt keinem unpersönlichen Menükatalog, sondern dem Blick in die Frischetheke. Ganze Doraden, saftige Lammkoteletts, Merguez-Würstchen und Rindersteaks liegen auf gestoßenem Eis bereit. Man zeigt auf den gewünschten Schnitt, der Grillmeister wiegt ihn ab, würzt ihn mit hauseigener Chermoula — jener legendären nordafrikanischen Marinade aus frischem Koriander, glatter Petersilie, Knoblauch, gemahlenem Kreuzkümmel und Olivenöl — und legt ihn direkt auf das gusseiserne Grillrost."
              : "Ordering at La Grilladine bypasses generic menu folders and starts directly at the glass counter. Whole sea bream, lamb chops, spiced merguez, and prime rib cuts rest over crushed ice. You indicate your selection, the pitmaster weighs it, perfumes it with house-ground chermoula — the legendary North African marinade of coriander, flat parsley, garlic, toasted cumin, and cold-pressed olive oil — and lays it across the cast-iron grate."}
          </p>
          <p className="text-base text-[#173C32]/80 leading-relaxed font-sans">
            {isDe
              ? "Hier brennt kein Gasfeuer. Die Buchenholzkohle wird kontinuierlich mit einem Fächer auf die exakte Gluttemperatur gebracht. Die Flammen lecken nur für Millisekunden an der Außenseite, um eine krosse Kruste zu karamellisieren, während der Kern sanft im eigenen Saft dämpft."
              : "No gas burner is tolerated here. Hardwood beechwood charcoal is maintained at optimal temperature with steady rhythmic fanning. Flames kiss the surface just long enough to caramelize a paper-thin crust while the core gently poaches in its own natural juices."}
          </p>
        </section>

        {/* Sensory Tasting Masterclass: Die 3 Schritte (Inspired by Lindt Sensory Framework) */}
        <section className="p-8 sm:p-10 rounded-3xl bg-white border-2 border-[#E6B84A]/30 shadow-xl space-y-6">
          <div className="flex items-center gap-2.5 text-[#083822]">
            <Award className="w-6 h-6 text-[#E6B84A]" />
            <span className="font-mono text-xs uppercase tracking-widest font-black text-[#E6B84A]">
              {isDe ? "DIE SPEISELY GENUSS-SCHULE" : "THE SPEISELY CONNOISSEUR GUIDE"}
            </span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#083822] leading-snug">
            {isDe
              ? "Die 3 goldenen Schritte der Verkostung bei La Grilladine"
              : "The 3 Golden Steps of Tasting at La Grilladine"}
          </h3>

          <p className="text-sm sm:text-base text-[#173C32]/75 leading-relaxed font-sans">
            {isDe
              ? "Wer marokkanische Küche in ihrer reinsten Form begreifen möchte, schneidet Gerichte nicht unbedacht an, sondern achtet auf das Zusammenspiel von Kruste, Tontopf-Dampf und Minz-Frische:"
              : "To truly appreciate authentic Moroccan hearth cooking, do not rush through the meal — observe the harmonious progression of char, earthenware steam, and herbal freshness:"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-[#F6F4EB] border border-[#173C32]/10 space-y-3">
              <span className="font-mono text-3xl font-black text-[#E6B84A]">01</span>
              <h4 className="font-serif text-lg font-bold text-[#083822]">
                {isDe ? "Das Auge & Die Theke" : "The Eye & The Counter"}
              </h4>
              <p className="text-xs sm:text-sm text-[#173C32]/70 leading-relaxed font-sans">
                {isDe
                  ? "Wähle deinen Fisch an der Theke selbst aus. Achte auf glänzende Schuppen, klare Augen und das dezente Knistern der Glut beim ersten Auflegen."
                  : "Select your catch personally at the counter. Look for luminous scales, clear eyes, and listen for the sharp sizzle as it meets glowing coals."}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-[#F6F4EB] border border-[#173C32]/10 space-y-3">
              <span className="font-mono text-3xl font-black text-[#E6B84A]">02</span>
              <h4 className="font-serif text-lg font-bold text-[#083822]">
                {isDe ? "Der Knusper & Die Flocke" : "The Crisp & The Flake"}
              </h4>
              <p className="text-xs sm:text-sm text-[#173C32]/70 leading-relaxed font-sans">
                {isDe
                  ? "Der Gabeltest: Die Haut muss mit einem feinen Knuspern nachgeben. Das weiße Fleisch darunter löst sich in saftigen Lamellen von der Gräte."
                  : "The fork test: The charred skin should yield with an audible crunch. Beneath it, pearlescent flakes detach effortlessly in moist segments."}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-[#F6F4EB] border border-[#173C32]/10 space-y-3">
              <span className="font-mono text-3xl font-black text-[#E6B84A]">03</span>
              <h4 className="font-serif text-lg font-bold text-[#083822]">
                {isDe ? "Die R'gwa (Die Schaumkrone)" : "The R'gwa (The Foam Crown)"}
              </h4>
              <p className="text-xs sm:text-sm text-[#173C32]/70 leading-relaxed font-sans">
                {isDe
                  ? "Der Atay-Tee wird aus mindestens 40 cm Höhe eingegossen. Die dichte Schaumkrone schützt das Aroma und kühlt den heißen Minzaufguss sanft ab."
                  : "Mint tea poured from at least 40 cm height aerates the liquor, creating a creamy foam crown (R'gwa) that seals in mint oils and tempers heat."}
              </p>
            </div>
          </div>
        </section>

        {/* Feature Platter: Whole Dorade Royale in Butterfly Cut */}
        <figure className="relative my-10 max-w-2xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border-2 border-[#173C32]/15 bg-white p-3 shadow-2xl transition-all duration-300 hover:border-[#E6B84A]">
            <div className="absolute top-6 left-6 z-10 flex items-center gap-2 rounded-full bg-[#083822]/85 backdrop-blur-md px-3.5 py-1.5 text-xs font-mono font-bold text-[#F6F4EB] border border-[#E6B84A]/40 shadow-lg">
              <Fish className="w-3.5 h-3.5 text-[#E6B84A]" />
              <span>
                {isDe
                  ? "SIGNATURE SERVE · DORADE ROYALE PAPILLON"
                  : "SIGNATURE SERVE · DORADE ROYALE PAPILLON"}
              </span>
            </div>
            <img
              src="/magazin/la-grilladine-duesseldorf/la_grilladine_dorade_3d.webp?v=2"
              alt="Ganze Dorade Royale vom Holzkohlegrill mit knusprigen Kartoffel-Rondellen und Chermoula bei La Grilladine"
              className="w-full h-auto object-cover rounded-2xl"
              width="1024"
              height="768"
              loading="lazy"
            />
          </div>
          <figcaption className="text-xs font-mono text-[#173C32]/60 mt-3 text-center">
            {isDe
              ? "Foto: Speisely Community. Der unangefochtene Liebling der Gäste: Ganze Dorade Royale im Schmetterlingsschnitt, serviert mit goldgelben Kartoffelchips und frischer Zitrone."
              : "Photo: Speisely Community. The guest favorite: Whole Dorade Royale butterfly-split across beechwood coals, served with hand-sliced potato rounds and fresh lemon."}
          </figcaption>
        </figure>

        {/* Product Callout: The Showstopper (Lindt Style Callout Box) */}
        <section className="p-7 rounded-3xl bg-gradient-to-r from-[#083822] to-[#124E34] text-white space-y-4 shadow-xl border border-[#E6B84A]/30">
          <div className="flex items-center gap-2">
            <span className="bg-[#E6B84A] text-[#083822] text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded">
              {isDe ? "DER SHOWSTOPPER" : "THE SHOWSTOPPER"}
            </span>
            <span className="text-xs font-mono text-[#E6B84A] tracking-wider uppercase">
              {isDe ? "EINFACH KÖSTLICH!" : "SIMPLY DELICIOUS!"}
            </span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#F6F4EB]">
            {isDe
              ? "Dorade Royale & Chermoula: Das Spiel von Röstung & Frische"
              : "Dorade Royale & Chermoula: The Symphony of Smoke & Brightness"}
          </h3>
          <p className="text-sm sm:text-base text-[#F6F4EB]/85 leading-relaxed font-sans">
            {isDe
              ? "Wenn die frisch gegrillte Dorade am Tisch ankommt, steigt eine feine Rauchsäule aus gebranntem Meersalz und geröstetem Kreuzkümmel empor. Die Haut ist durch die Buchenholzkohle hauchdünn blisteriert und knusprig, während das Fleisch darunter schneeweiß, glasig und unvergleichlich saftig bleibt. Begleitet von den hauchfein geschnittenen, kross frittierten Kartoffelrondellen entsteht eine Textur-Harmonie, die man in hochpreisigen Fischrestaurants oft vergeblich sucht."
              : "When the freshly grilled sea bream arrives, an aromatic vapor of toasted cumin, sea salt, and citrus lifts into the room. The skin is blistered and crisp from beechwood charcoal, while the pearlescent flesh remains exquisitely tender and moist. Paired with razor-thin, golden potato rounds, it creates a textural contrast rare even in high-end seafood dining."}
          </p>
        </section>

        {/* Section: The Community Atmosphere in Oberbilk */}
        <section className="space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#173C32] tracking-tight">
            {isDe
              ? "Oberbilk: Das pulsierende Maghreb-Viertel als kulinarische Heimat"
              : "Oberbilk: Düsseldorf's Maghreb Quarter as a Culinary Home"}
          </h2>
          <p className="text-base text-[#173C32]/80 leading-relaxed font-sans">
            {isDe
              ? "La Grilladine ist fest in der Nachbarschaft von Düsseldorf-Oberbilk verankert. Zwischen marokkanischen Bäckereien, Minzhändlern und Gewürzläden ist das Restaurant seit Jahren die verlässliche Konstante für authentische nordafrikanische Küche. Der Service ist herzlich, zügig und unprätentiös: Wer hier speist, teilt sich oft Schalen mit marinierten Oliven und taucht frisches, warmes Fladenbrot gemeinsam in Schmortöpfe."
              : "La Grilladine is deeply woven into the fabric of Düsseldorf-Oberbilk. Surrounded by Moroccan bakeries, fresh mint vendors, and spice merchants, the dining room has stood as an authentic anchor for years. Service is warm, swift, and completely unpretentious: guests share bowls of cured olives and dip warm, freshly baked flatbread together."}
          </p>
        </section>

        {/* 2-Column Sensory Grid: Tajine & Mint Tea (Lindt Flatlay Style) */}
        <section
          aria-label={isDe ? "Kulinarische Begleiter" : "Culinary Pairings"}
          className="my-14 space-y-6"
        >
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E6B84A] font-bold">
              {isDe ? "HARMONIE & KONTRAST" : "HARMONY & CONTRAST"}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-black text-[#083822]">
              {isDe ? "Die vollendeten Begleiter" : "The Perfect Pairings"}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Item 1: Tajine de Poulet */}
            <div className="flex flex-col rounded-3xl bg-white border-2 border-[#173C32]/15 shadow-xl overflow-hidden transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
              <div className="relative aspect-[4/3] w-full bg-[#083822]/5 overflow-hidden">
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-[#083822]/85 backdrop-blur-md px-3 py-1 text-[11px] font-mono font-bold text-[#F6F4EB] border border-[#E6B84A]/40 shadow-md">
                  <Utensils className="w-3 h-3 text-[#E6B84A]" />
                  <span>TAJINE DE POULET</span>
                </div>
                <img
                  src="/magazin/la-grilladine-duesseldorf/la_grilladine_tajine_poulet_3d.webp?v=2"
                  alt="Marokkanische Hähnchen-Tajine mit Salzzitronen, grünen Oliven und Safran im Tontopf"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                  width="800"
                  height="600"
                />
              </div>
              <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between space-y-3">
                <div className="space-y-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#083822]/5 text-[#083822] text-[11px] font-mono font-bold uppercase tracking-wider border border-[#083822]/10">
                    {isDe ? "DIE ALCHEMIE DER GEDULD" : "ALCHEMY OF PATIENCE"}
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#083822] leading-snug">
                    {isDe ? "Tajine aux Citrons Confits" : "Tagine aux Citrons Confits"}
                  </h4>
                  <p className="text-sm text-[#173C32]/80 leading-relaxed font-sans">
                    {isDe
                      ? "Im schweren Tongefäß langsam geschmort: Das zarte Hähnchenfleisch zerfällt auf der Zunge. Die herbe Frische fermentierter Salzzitronen balanciert die sämige Zwiebel-Safran-Reduktion perfekt aus."
                      : "Slowly braised in heavy unglazed clay: Fall-apart tender chicken enveloped in a velvety reduction of sweet caramelized onions, earthy saffron, and briny preserved lemon."}
                  </p>
                </div>
              </div>
            </div>

            {/* Item 2: Mint Tea Ritual */}
            <div className="flex flex-col rounded-3xl bg-white border-2 border-[#173C32]/15 shadow-xl overflow-hidden transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
              <div className="relative aspect-[4/3] w-full bg-[#083822]/5 overflow-hidden">
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-[#083822]/85 backdrop-blur-md px-3 py-1 text-[11px] font-mono font-bold text-[#F6F4EB] border border-[#E6B84A]/40 shadow-md">
                  <Coffee className="w-3 h-3 text-[#E6B84A]" />
                  <span>ATAY BI NA'NA</span>
                </div>
                <img
                  src="/magazin/la-grilladine-duesseldorf/la_grilladine_minztee_3d.webp?v=2"
                  alt="Frischer marokkanischer Minztee im traditionellen Silberkännchen mit gravierten Gläsern"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                  width="800"
                  height="600"
                />
              </div>
              <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between space-y-3">
                <div className="space-y-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#083822]/5 text-[#083822] text-[11px] font-mono font-bold uppercase tracking-wider border border-[#083822]/10">
                    {isDe ? "DAS ZEREMONIELL" : "THE SACRED RITUAL"}
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#083822] leading-snug">
                    {isDe ? "Marokkanischer Atay bi Na'na" : "Moroccan Atay bi Na'na"}
                  </h4>
                  <p className="text-sm text-[#173C32]/80 leading-relaxed font-sans">
                    {isDe
                      ? "Heiß aufgegossener Gunpowder-Grüntee mit ganzen Zweigen frischer Krauseminze. Aus der kunstvoll ziselierten Silberkanne hoch eingegossen, bildet sich die unverzichtbare Schaumkrone (R'gwa)."
                      : "Piping-hot gunpowder green tea steeped with whole bunches of fresh spearmint. Poured from high above into ornamented glasses, creating the iconic silky crown of aromatic foam."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fact Sheet / Speisely Gastro Dossier */}
        <section className="p-8 rounded-3xl bg-[#083822] text-[#F6F4EB] space-y-6 shadow-2xl border border-[#E6B84A]/30">
          <div className="flex items-center justify-between border-b border-[#E6B84A]/30 pb-4">
            <div>
              <span className="text-xs font-mono text-[#E6B84A] uppercase tracking-widest font-bold">
                SPEISELY GASTRO-DOSSIER
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#F6F4EB]">
                La Grilladine Düsseldorf
              </h3>
            </div>
            <div className="text-right">
              <span className="inline-block bg-[#E6B84A] text-[#083822] text-xs font-mono font-black px-2.5 py-1 rounded">
                OBERBILK
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-sans text-[#F6F4EB]/85">
            <div className="space-y-2">
              <p className="font-bold text-[#E6B84A] uppercase text-xs font-mono tracking-wider">
                {isDe ? "Standort & Adresse" : "Location & Address"}
              </p>
              <p className="leading-snug">
                Dreieckstraße 26
                <br />
                40227 Düsseldorf-Oberbilk (Maghreb-Viertel)
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-[#E6B84A] uppercase text-xs font-mono tracking-wider">
                {isDe ? "Öffnungszeiten" : "Opening Hours"}
              </p>
              <p className="leading-snug">
                Di – Sa: 12:00 – 22:00 Uhr
                <br />
                So: 13:00 – 21:00 Uhr
                <br />
                <span className="text-[#E6B84A] font-mono text-xs">
                  Montag Ruhetag / Closed on Mondays
                </span>
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-[#E6B84A] uppercase text-xs font-mono tracking-wider">
                {isDe ? "Konditionen & Bezahlung" : "Terms & Payment"}
              </p>
              <p className="leading-snug">
                • <strong className="text-white">Nur Barzahlung</strong> (Cash Only!)
                <br />
                • Keine Reservierung möglich (First Come, First Served)
                <br />• Ausgezeichnetes Preis-Leistungs-Verhältnis (€€)
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-[#E6B84A] uppercase text-xs font-mono tracking-wider">
                {isDe ? "Kontakt & Webpräsenz" : "Contact & Web"}
              </p>
              <p className="leading-snug">
                Telefon:{" "}
                <a href="tel:+4921194216796" className="text-[#E6B84A] hover:underline font-mono">
                  +49 211 94216796
                </a>
                <br />
                Website:{" "}
                <a
                  href="https://la-grilladine.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E6B84A] underline font-bold hover:text-white"
                >
                  la-grilladine.de
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Conclusion / Fazit */}
        <section className="space-y-4 pt-4 border-t border-[#173C32]/15">
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#173C32] tracking-tight">
            {isDe ? "Das Speisely-Fazit" : "The Speisely Verdict"}
          </h2>
          <p className="text-base text-[#173C32]/80 leading-relaxed font-sans">
            {isDe
              ? "La Grilladine ist die seltene Antithese zur austauschbaren Großstadtgastronomie: Keine gekünstelte Ästhetik, sondern echte Hingabe zum Handwerk. Wer die Buchenglut knistern hören, fangfrische Dorade im perfekten Garpunkt probieren und in die sämige Tiefe einer echten Tajine eintauchen möchte, findet in der Dreieckstraße 26 einen der ehrlichsten Genussorte Düsseldorfs."
              : "La Grilladine represents the rare antithesis to generic urban dining: zero manufactured pretension, but unconditional devotion to hearth cooking. Those who wish to hear beechwood coals crackle, savor whole sea bream cooked to succulent perfection, and dive into the slow-simmered depths of earthenware tagines will find Dreieckstraße 26 to be one of Düsseldorf's most rewarding culinary truths."}
          </p>
        </section>

        {/* Transparent Notice */}
        <aside className="p-6 rounded-2xl bg-white border border-[#173C32]/10 text-xs text-[#173C32]/70 space-y-2 shadow-sm font-sans">
          <div className="flex items-center gap-2 font-bold text-[#173C32]">
            <Info className="w-4 h-4 text-[#E6B84A]" />
            <span>
              {isDe
                ? "Transparenzhinweis & Community-Dokumentation"
                : "Editorial Disclosure & Community Notes"}
            </span>
          </div>
          <p className="leading-relaxed">
            {isDe
              ? "Dieser redaktionelle Beitrag entstand im Rahmen unserer Speisely Community-Initiative: Die Fotografien und ersten Tasting-Notizen wurden von einem Community-Mitglied vor Ort unabhängig und auf eigene Kosten erstellt. Die gastronomischen Eckdaten, Öffnungszeiten und Kontaktdaten wurden über offizielle Register und vor Ort verifiziert. Zum Zeitpunkt der Veröffentlichung bestanden keinerlei werbliche oder finanzielle Vereinbarungen mit dem Restaurantbetreiber."
              : "This editorial story was created as part of the Speisely Community Initiative: Visual assets and on-site tasting impressions were documented independently and self-funded by a community contributor. Operational facts, opening times, and contact information were cross-referenced with official local records. No commercial or promotional agreements existed with the restaurant at publication time."}
          </p>
        </aside>

        {/* Restaurant Claim & Foodie Recommendation Bridge */}
        <RestaurantClaimBridge restaurantName="La Grilladine" city="Düsseldorf" />

        {/* Back Link */}
        <div className="pt-6 text-center">
          <Link
            to="/magazin"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#083822] hover:text-[#E6B84A] transition-colors font-mono"
          >
            ← {isDe ? "Zurück zum Speisely Magazin" : "Back to Speisely Magazine"}
          </Link>
        </div>
      </main>

      {/* About Speisely Section Footer */}
      <AboutSpeiselySection />
    </article>
  );
}
