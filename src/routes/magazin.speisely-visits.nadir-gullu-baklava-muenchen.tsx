import { AboutSpeiselySection } from "@/components/AboutSpeiselySection";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  MapPin,
  Calendar,
  Eye,
  Shield,
  Globe,
  Utensils,
  Info,
  Award,
  Sparkles,
  Coffee,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/magazin/speisely-visits/nadir-gullu-baklava-muenchen")({
  head: () => ({
    meta: [
      {
        title: "Nadir Güllü München: Echte Baklava-Kunst",
      },
      {
        name: "description",
        content:
          "Speisely besucht Nadir Güllü am Viktualienmarkt München: 40 Schichten Teig, Antep-Pistazien und das legendäre Hışırtı-Knistern im Test.",
      },
      {
        name: "keywords",
        content:
          "Nadir Güllü München, Nadir Güllü Baklava Viktualienmarkt, Karaköy Güllüoğlu München, Beste Baklava München, Havuç Dilimi München, Pistazien Baklava, Türkische Desserts München, Speisely Visits",
      },
      {
        name: "geo.region",
        content: "DE-BY",
      },
      {
        name: "geo.placename",
        content: "München",
      },
      {
        name: "geo.position",
        content: "48.1351;11.5761",
      },
      {
        name: "ICBM",
        content: "48.1351, 11.5761",
      },
      {
        property: "og:title",
        content: "Nadir Güllü München: Die Hohe Schule der Baklava | Speisely Visits",
      },
      {
        property: "og:description",
        content:
          "Vom Goldenen Horn an den Viktualienmarkt: Speisely verkostet die weltberühmte 40-Schichten-Baklava von Nadir Güllü in München. Sensorik, Handwerk und die Kunst der Verkostung.",
      },
      {
        property: "og:image",
        content: "https://speisely.de/magazin/nadir-gullu/nadir-gullu-havuc-dilimi-landscape.webp",
      },
      { property: "og:type", content: "article" },
      {
        property: "og:url",
        content: "https://speisely.de/magazin/speisely-visits/nadir-gullu-baklava-muenchen",
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
        href: "https://speisely.de/magazin/speisely-visits/nadir-gullu-baklava-muenchen",
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
                "@type": "Bakery",
                name: "Nadir Güllü Baklava – Karaköy Güllüoğlu München",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Viktualienmarkt, Abteilung VI, Stand 1b/2b",
                  addressLocality: "München",
                  postalCode: "80331",
                  addressCountry: "DE",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 48.1351,
                  longitude: 11.5761,
                },
                servesCuisine: "Türkische Pâtisserie, Baklava, Desserts",
                priceRange: "€€",
              },
            },
            {
              "@type": "Article",
              "@id":
                "https://speisely.de/magazin/speisely-visits/nadir-gullu-baklava-muenchen#article",
              isPartOf: {
                "@id": "https://speisely.de/#website",
              },
              headline:
                "Nadir Güllü Baklava München: Die Kunst der 40 Schichten am Viktualienmarkt",
              description:
                "Speisely besucht Nadir Güllü am Viktualienmarkt in München. Ein sensorisches Porträt über 180 Jahre Istanbuler Handwerkstradition, Antep-Pistazien und die Kunst der Baklava-Verkostung.",
              image: "https://speisely.de/magazin/nadir-gullu/nadir-gullu-havuc-dilimi-macro.webp",
              datePublished: "2026-10-16T10:00:00+02:00",
              dateModified: "2026-10-16T12:00:00+02:00",
              inLanguage: "de-DE",
              author: {
                "@type": "Organization",
                name: "Speisely Redaktion",
                url: "https://speisely.de",
              },
              publisher: {
                "@id": "https://speisely.de/#organization",
              },
              about: {
                "@type": "FoodEstablishment",
                name: "Nadir Güllü Baklava München",
                servesCuisine: "Baklava & Türkische Pâtisserie",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Viktualienmarkt, Abteilung VI",
                  addressLocality: "München",
                  postalCode: "80331",
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
                  name: "Speisely Visits",
                  item: "https://speisely.de/magazin/speisely-visits",
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: "Nadir Güllü München",
                  item: "https://speisely.de/magazin/speisely-visits/nadir-gullu-baklava-muenchen",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: NadirGulluArticlePage,
});

function NadirGulluArticlePage() {
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
              to="/magazin/speisely-visits"
              className="text-xs uppercase tracking-widest text-[#E6B84A] hover:underline flex items-center gap-1 font-bold whitespace-nowrap"
            >
              ← Speisely Visits
            </Link>
            <span className="text-[#F6F4EB]/30 hidden xs:inline">|</span>
            <span className="text-xs tracking-wider uppercase text-[#F6F4EB]/80 hidden md:inline font-mono truncate">
              München · Viktualienmarkt
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <span className="text-[11px] sm:text-xs font-mono bg-[#E6B84A]/20 text-[#E6B84A] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-bold border border-[#E6B84A]/40 whitespace-nowrap">
              Est. 1843
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
            <Award className="w-3.5 h-3.5" aria-hidden="true" />
            {isDe
              ? "SPEISELY VISITS · MÜNCHEN VIKTUALIENMARKT · FEINBÄCKEREI"
              : "SPEISELY VISITS · MUNICH VIKTUALIENMARKT · MASTER BAKERY"}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-[#F6F4EB]">
            {isDe ? (
              <>
                Nadir Güllü München: <br className="hidden sm:inline" />
                <span className="text-[#E6B84A] italic font-normal">
                  Die Kunst der 40 Schichten
                </span>
              </>
            ) : (
              <>
                Nadir Güllü Munich: <br className="hidden sm:inline" />
                <span className="text-[#E6B84A] italic font-normal">The Art of 40 Layers</span>
              </>
            )}
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#F6F4EB]/85 leading-relaxed font-sans">
            {isDe
              ? "Über 180 Jahre Istanbuler Meistertradition, handverlesene Antep-Smaragdpistazien und das legendäre Hışırtı-Knistern: Wie der berühmteste Baklava-Meister der Welt den Münchner Viktualienmarkt erobert."
              : "Over 180 years of Istanbul master baking tradition, handpicked Antep emerald pistachios, and the legendary Hışırtı crunch: How the world's most renowned Baklava master captures Munich's Viktualienmarkt."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#F6F4EB]/70 pt-2">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#E6B84A]" />
              Viktualienmarkt, Abteilung VI, München
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
                {isDe ? "Ü" : "W"}
              </span>
              {isDe ? (
                <>
                  ber Baklava könnte Großmeister <strong>Nadir Güllü</strong> tagelang sprechen.
                  Schließlich bezeichnet sich der Schirmherr der weltberühmten Istanbuler
                  Institution <em>Karaköy Güllüoğlu</em> mit einem verschmitzten Lächeln selbst als
                  unerbittlichen Perfektionisten seines Fachs:{" "}
                  <em>
                    „Ein echtes Baklava ist keine gewöhnliche Süßspeise. Es ist ein physikalisches
                    und sinnliches Meisterwerk – die Verwandlung von hauchzartem Teig in pures,
                    schmelzendes Glück.“
                  </em>
                </>
              ) : (
                <>
                  hen it comes to the revered craft of baklava, Grandmaster{" "}
                  <strong>Nadir Güllü</strong> could speak for days. The patron of Istanbul's
                  legendary institution <em>Karaköy Güllüoğlu</em> describes himself with a knowing
                  smile as an uncompromising perfectionist of his craft:{" "}
                  <em>
                    "A true baklava is no ordinary pastry. It is a physical and sensory masterpiece
                    — the transformation of whisper-thin dough into pure, melting bliss."
                  </em>
                </>
              )}
            </p>
          </div>

          <p className="text-base text-[#173C32]/80 leading-relaxed font-sans">
            {isDe
              ? "Seit 1843 wird das Geheimnis in der Familie Güllü von Generation zu Generation gehütet. Was in Gaziantep begann und am Bosporus in Karaköy zum weltweiten Pilgerort für Feinschmecker heranreifte, schlägt nun ein neues Kapitel auf: Neben Istanbul und Tokyo gibt es das Original jetzt mitten im Herzen von München – an einem edlen, smaragdgrün getäfelten Pavillon am Viktualienmarkt."
              : "Since 1843, this heritage has been guarded by the Güllü family from generation to generation. What originated in Gaziantep and grew on the Bosphorus into a global culinary pilgrimage site now opens an extraordinary chapter: alongside Istanbul and Tokyo, the original is now served in the heart of Munich — at an elegant emerald-green pavilion directly on the Viktualienmarkt."}
          </p>
        </section>

        {/* Hero Image: 40 Layers Macro (Passe-Partout Luxury Frame) */}
        <figure className="relative my-10 max-w-2xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border-2 border-[#173C32]/15 bg-white p-3 shadow-2xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-3xl">
            {/* Frosted Badge */}
            <div className="absolute top-6 left-6 z-10 flex items-center gap-2 rounded-full bg-[#083822]/85 backdrop-blur-md px-3.5 py-1.5 text-xs font-mono font-bold text-[#F6F4EB] border border-[#E6B84A]/40 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-[#E6B84A]" />
              <span>40 HAUCHDÜNNE SCHICHTEN · KIRK KAT</span>
            </div>
            <img
              src="/magazin/nadir-gullu/nadir-gullu-havuc-dilimi-landscape.webp?v=1"
              alt="Havuç Dilimi Pistazien-Baklava von Nadir Güllü mit 40 hauchdünnen Teigschichten"
              className="w-full h-auto object-cover rounded-2xl"
              width="1024"
              height="576"
              loading="eager"
            />
          </div>
          <figcaption className="text-xs font-mono text-[#173C32]/60 mt-3 text-center">
            {isDe
              ? "Foto: Speisely Visits. Die legendäre Havuç-Dilimi-Dreiecks-Baklava bei Nadir Güllü München: 40 Schichten Teig, Antep-Smaragdpistazien und geklärte Urfa-Butter."
              : "Photo: Speisely Visits. The legendary Havuç Dilimi triangle baklava at Nadir Güllü Munich: 40 layers of paper-thin dough, Antep emerald pistachios, and Urfa clarified butter."}
          </figcaption>
        </figure>

        {/* Section: The 40-Layer Standard (Kırk Kat) */}
        <section className="space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#173C32] tracking-tight">
            {isDe
              ? "Das Geheimnis des Teigs: Wenn Papier wie Pergament wirkt"
              : "The Secret of the Dough: When Pastry Becomes Whispering Silk"}
          </h2>
          <p className="text-base text-[#173C32]/80 leading-relaxed font-sans">
            {isDe
              ? "Die Faszination beginnt lange vor dem ersten Bissen. In den Backstuben von Karaköy rollen Meisterbäcker mit langen, feinen Birnenholz-Stäben (Oklava) bis zu 40 Teigblätter übereinander. Jede einzelne Schicht ist so hauchdünn und transparent, dass man durch sie hindurch eine Zeitung lesen könnte. Dazwischen liegt reine Stärke und das über Jahrzehnte verfeinerte Feingefühl für Temperatur und Feuchtigkeit."
              : "The fascination begins long before the first bite. In Karaköy's ateliers, master bakers roll up to 40 sheets of dough with slender pear-wood rolling pins (Oklava). Each layer is so sheer and translucent that one could read newsprint through it. Between them lies pure wheat starch and decades of refined intuition for temperature and humidity."}
          </p>
          <p className="text-base text-[#173C32]/80 leading-relaxed font-sans">
            {isDe
              ? "Doch der eigentliche Zauber entsteht durch die Zutaten: Kein gewöhnliches Fett, sondern ausschließlich traditionell geklärte Schafbutter aus Şanlıurfa (Sade Yağ) und die geschmacksintensiven, tiefgrünen Frühlings-Pistazien aus Gaziantep (Boz Fıstık), die nur wenige Wochen im Jahr geerntet werden."
              : "Yet the true magic arises from provenance: never ordinary fats, but exclusively clarified sheep's butter from Şanlıurfa (Sade Yağ) and the intensely fragrant, deep emerald spring pistachios from Gaziantep (Boz Fıstık), harvested only during a brief annual window."}
          </p>
        </section>

        {/* Sensory Tasting Masterclass: Die 3 Schritte nach Nadir Usta (Inspired by Lindt "Schleifen binden / Genuss-Tipps") */}
        <section className="p-8 sm:p-10 rounded-3xl bg-white border-2 border-[#E6B84A]/30 shadow-xl space-y-6">
          <div className="flex items-center gap-2.5 text-[#083822]">
            <Award className="w-6 h-6 text-[#E6B84A]" />
            <span className="font-mono text-xs uppercase tracking-widest font-black text-[#E6B84A]">
              {isDe ? "DIE SPEISELY GENUSS-SCHULE" : "THE SPEISELY CONNOISSEUR GUIDE"}
            </span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#083822] leading-snug">
            {isDe
              ? "Die 3 goldenen Schritte der Baklava-Verkostung"
              : "The 3 Golden Steps of Baklava Tasting"}
          </h3>

          <p className="text-sm sm:text-base text-[#173C32]/75 leading-relaxed font-sans">
            {isDe
              ? "Nadir Güllü lehrt seine Gäste stets das gleiche Ritual. Wer Baklava wie ein wahrer Kenner genießen will, schneidet sie nicht mit Messer und Gabel, sondern folgt diesen drei Sinnesschritten:"
              : "Nadir Güllü teaches every connoisseur this exact ritual. To savor baklava properly, never use knife and fork — follow these three sensory stages:"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-[#F6F4EB] border border-[#173C32]/10 space-y-3">
              <span className="font-mono text-3xl font-black text-[#E6B84A]">01</span>
              <h4 className="font-serif text-lg font-bold text-[#083822]">
                {isDe ? "Die Nase (Das Aroma)" : "The Nose (Aroma)"}
              </h4>
              <p className="text-xs sm:text-sm text-[#173C32]/70 leading-relaxed font-sans">
                {isDe
                  ? "Führe das Stück an deine Nase. Du musst den warmen Duft reiner, nussiger Urfa-Butter und frisch gerösteter Pistazien einatmen – ohne beißende Zuckersüße."
                  : "Bring the pastry to your nose. Inhale the warm fragrance of pure Urfa clarified butter and toasted pistachios — free of artificial cloying sweetness."}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-[#F6F4EB] border border-[#173C32]/10 space-y-3">
              <span className="font-mono text-3xl font-black text-[#E6B84A]">02</span>
              <h4 className="font-serif text-lg font-bold text-[#083822]">
                {isDe ? "Der Kopfstand (Die Gaumenregel)" : "The Flip (Palate Rule)"}
              </h4>
              <p className="text-xs sm:text-sm text-[#173C32]/70 leading-relaxed font-sans">
                {isDe
                  ? "Drehe das Dreieck auf den Kopf! Die sirupgetränkte, feuchte Unterseite muss zuerst deinen Gaumen berühren, damit die Geschmacksknospen sofort aufblühen."
                  : "Turn the triangle upside down! The syrup-kissed underside must touch your palate first, allowing your tastebuds to awaken immediately."}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-[#F6F4EB] border border-[#173C32]/10 space-y-3">
              <span className="font-mono text-3xl font-black text-[#E6B84A]">03</span>
              <h4 className="font-serif text-lg font-bold text-[#083822]">
                {isDe ? "Das Gehör (Das Hışırtı)" : "The Sound (The Hışırtı)"}
              </h4>
              <p className="text-xs sm:text-sm text-[#173C32]/70 leading-relaxed font-sans">
                {isDe
                  ? "Der Biss: Ein perfektes Baklava knistert hörbar („Hışırtı“), wenn deine Zähne durch 40 getrocknete Teigschichten brechen, bevor die Butter schmilzt."
                  : "The crunch: A true baklava produces an audible crackle ('Hışırtı') as your teeth glide through 40 crisp leaves before the butter dissolves."}
              </p>
            </div>
          </div>
        </section>

        {/* Feature Platter: Havuç Dilimi with Maraş Dondurma */}
        <figure className="relative my-10 max-w-2xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border-2 border-[#173C32]/15 bg-white p-3 shadow-2xl transition-all duration-300 hover:border-[#E6B84A]">
            <div className="absolute top-6 left-6 z-10 flex items-center gap-2 rounded-full bg-[#083822]/85 backdrop-blur-md px-3.5 py-1.5 text-xs font-mono font-bold text-[#F6F4EB] border border-[#E6B84A]/40 shadow-lg">
              <Utensils className="w-3.5 h-3.5 text-[#E6B84A]" />
              <span>SIGNATURE SERVE · DONDURMA DUO</span>
            </div>
            <img
              src="/magazin/nadir-gullu/nadir-gullu-havuc-dilimi-dondurma.webp?v=1"
              alt="Havuç Dilimi Dreiecksbaklava serviert mit cremigem Dondurma Eis und Bronzebesteck"
              className="w-full h-auto object-cover rounded-2xl"
              width="1024"
              height="750"
              loading="lazy"
            />
          </div>
          <figcaption className="text-xs font-mono text-[#173C32]/60 mt-3 text-center">
            {isDe
              ? "Foto: Speisely Visits. Die perfekte Vermählung: Havuç Dilimi mit traditionellem, elastischem Maraş-Dondurma Eisbecher und feinstem Pistazienstoff."
              : "Photo: Speisely Visits. The quintessential pairing: Warm Havuç Dilimi served alongside traditional Maraş dondurma ice cream and ground pistachio dust."}
          </figcaption>
        </figure>

        {/* Product Callout 1: Einfach Köstlich! (Lindt Callout Box Style) */}
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
              ? "Havuç Dilimi & Maraş-Dondurma: Das Spiel der Gegensätze"
              : "Havuç Dilimi & Maraş Dondurma: Symphony of Opposites"}
          </h3>
          <p className="text-sm sm:text-base text-[#F6F4EB]/85 leading-relaxed font-sans">
            {isDe
              ? "Wenn das noch ofenwarme, knusprige Dreiecksbaklava auf den eiskalten, zäh-cremigen Schmelz von traditionellem Maraş-Dondurma trifft, entsteht eine kulinarische Symbiose der Extraklasse. Der zarte Sirup wird durch die kühle Milchcreme elegant abgefedert, während die gerösteten Pistazien ihren intensiven, nussigen Tiefgang entfalten. Ein Genuss, der nicht nach Hast verlangt, sondern zum Verweilen einlädt."
              : "When the oven-warm, crackling triangle baklava meets the ice-cold, velvet chew of authentic Maraş dondurma, a transcendent culinary harmony is born. The fragrant syrup is softened by cool cream, while toasted pistachios release their rich depth. A ritual not made for haste, but for pure indulgence."}
          </p>
        </section>

        {/* Section: The Boutique Atmosphere at Viktualienmarkt */}
        <section className="space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#173C32] tracking-tight">
            {isDe
              ? "München, Istanbul, Tokyo: Ein Hauch Bosporus am Viktualienmarkt"
              : "Munich, Istanbul, Tokyo: A Touch of the Bosphorus at Viktualienmarkt"}
          </h2>
          <p className="text-base text-[#173C32]/80 leading-relaxed font-sans">
            {isDe
              ? "Wer den Stand in Abteilung VI des Viktualienmarkts betritt, spürt sofort den Unterschied zu gewöhnlichen Süßwarenläden. Dunkles Smaragdgrün, goldene 3D-Lettern, antike Radios und Auslagen mit kostbaren Gourmet-Designboxen spiegeln die gleiche Noblesse wider, die man im Stammhaus in Karaköy oder im exklusiven Store in Tokyo erlebt."
              : "Entering the boutique at Abteilung VI of Viktualienmarkt immediately reveals the pedigree. Dark ribbed forest-green panels, gleaming gold typography, vintage radios, and displays of Galata design gift boxes echo the exact prestige experienced at the Karaköy flagship or the luxury boutique in Tokyo."}
          </p>
        </section>

        {/* Image: Store Counter */}
        <figure className="relative my-10 max-w-2xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border-2 border-[#173C32]/15 bg-white p-3 shadow-2xl transition-all duration-300 hover:border-[#E6B84A]">
            <div className="absolute top-6 left-6 z-10 flex items-center gap-2 rounded-full bg-[#083822]/85 backdrop-blur-md px-3.5 py-1.5 text-xs font-mono font-bold text-[#F6F4EB] border border-[#E6B84A]/40 shadow-lg">
              <MapPin className="w-3.5 h-3.5 text-[#E6B84A]" />
              <span>VIKTUALIENMARKT BOUTIQUE</span>
            </div>
            <img
              src="/magazin/nadir-gullu/nadir-gullu-viktualienmarkt-store.webp?v=1"
              alt="Verkaufstheke von Nadir Güllü am Münchner Viktualienmarkt mit goldenem Schriftzug und Menü"
              className="w-full h-auto object-cover rounded-2xl"
              width="1024"
              height="768"
              loading="lazy"
            />
          </div>
          <figcaption className="text-xs font-mono text-[#173C32]/60 mt-3 text-center">
            {isDe
              ? "Foto: Speisely Visits. Die stilvolle Boutique am Viktualienmarkt: Handgemachte Baklava täglich frisch aufgebacken, türkisches Gebäck und Spezialitäten."
              : "Photo: Speisely Visits. The stylish Viktualienmarkt boutique: Handcrafted baklava freshly baked daily on-site, Turkish pastries and artisanal tea."}
          </figcaption>
        </figure>

        {/* 2-Column Sensory Grid: Su Böreği & Espresso (Lindt Flatlay Style) */}
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
            {/* Item 1: Tea & Su Böreği */}
            <div className="flex flex-col rounded-3xl bg-white border-2 border-[#173C32]/15 shadow-xl overflow-hidden transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
              <div className="relative aspect-[3/4] w-full bg-[#083822]/5 overflow-hidden">
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-[#083822]/85 backdrop-blur-md px-3 py-1 text-[11px] font-mono font-bold text-[#F6F4EB] border border-[#E6B84A]/40 shadow-md">
                  <Utensils className="w-3 h-3 text-[#E6B84A]" />
                  <span>SU BÖREĞİ & ÇAY</span>
                </div>
                <img
                  src="/magazin/nadir-gullu/nadir-gullu-tee-su-boeregi-table.webp?v=2"
                  alt="Türkischer Tee im Tulpenglas, Su Böreği und Baklava-Auswahl auf schwarzem Schiefer"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                  width="782"
                  height="1020"
                />
              </div>
              <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between space-y-3">
                <div className="space-y-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#083822]/5 text-[#083822] text-[11px] font-mono font-bold uppercase tracking-wider border border-[#083822]/10">
                    {isDe ? "DIE HERZHAFTE BALANCE" : "THE SAVORY COUNTERPART"}
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#083822] leading-snug">
                    {isDe ? "Wassergebäck (Su Böreği) & Çay" : "Water Borek (Su Böreği) & Çay"}
                  </h4>
                  <p className="text-sm text-[#173C32]/80 leading-relaxed font-sans">
                    {isDe
                      ? "Wer die Süße unterbrechen möchte, bestellt das legendäre Su Böreği: Gekochte Teigbahnen, geschichtet mit mildem Schafskäse und Petersilie. Dazu traditioneller Schwarztee im geschliffenen Tulpenglas."
                      : "To balance the sweetness, connoisseurs order the legendary Su Böreği: Boiled handmade dough ribbons layered with mild white cheese and fresh herbs, accompanied by piping-hot black tea."}
                  </p>
                </div>
              </div>
            </div>

            {/* Item 2: Espresso & Chocolate Baklava */}
            <div className="flex flex-col rounded-3xl bg-white border-2 border-[#173C32]/15 shadow-xl overflow-hidden transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
              <div className="relative aspect-[3/4] w-full bg-[#083822]/5 overflow-hidden">
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-[#083822]/85 backdrop-blur-md px-3 py-1 text-[11px] font-mono font-bold text-[#F6F4EB] border border-[#E6B84A]/40 shadow-md">
                  <Coffee className="w-3 h-3 text-[#E6B84A]" />
                  <span>ALRIGHTY ESPRESSO</span>
                </div>
                <img
                  src="/magazin/nadir-gullu/nadir-gullu-espresso-baklava-duo.webp?v=2"
                  alt="Italienischer Espresso serviert mit Schokoladen- und Walnuss-Baklava"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                  width="765"
                  height="1020"
                />
              </div>
              <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between space-y-3">
                <div className="space-y-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#083822]/5 text-[#083822] text-[11px] font-mono font-bold uppercase tracking-wider border border-[#083822]/10">
                    {isDe ? "MODERNE SYMBIOSE" : "MODERN HARMONY"}
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#083822] leading-snug">
                    {isDe ? "Schokoladen-Baklava & Espresso" : "Chocolate Baklava & Espresso"}
                  </h4>
                  <p className="text-sm text-[#173C32]/80 leading-relaxed font-sans">
                    {isDe
                      ? "Eine Vermählung auf höchstem Niveau: Dunkle Schokolade in den Teigschichten, gepaart mit einem kräftigen Espresso von der Münchner Rösterei ALRIGHTY. Die Röstbitterstoffe des Kaffees heben den Kakaoton auf ungeahnte Höhen."
                      : "A marriage at the pinnacle of flavor: Rich dark cocoa layered into crisp pastry, paired with an intense espresso from Munich specialty roaster ALRIGHTY. The roasted coffee notes elevate the chocolate to extraordinary heights."}
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
                Nadir Güllü Baklava München
              </h3>
            </div>
            <div className="text-right">
              <span className="inline-block bg-[#E6B84A] text-[#083822] text-xs font-mono font-black px-2.5 py-1 rounded">
                VIKTUALIENMARKT
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-sans text-[#F6F4EB]/85">
            <div className="space-y-2">
              <p className="font-bold text-[#E6B84A] uppercase text-xs font-mono tracking-wider">
                {isDe ? "Standort & Adresse" : "Location & Address"}
              </p>
              <p className="leading-snug">
                Viktualienmarkt, Abteilung VI (Stand 1b/2b)
                <br />
                80331 München (nahe Marienplatz)
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-[#E6B84A] uppercase text-xs font-mono tracking-wider">
                {isDe ? "Öffnungszeiten" : "Opening Hours"}
              </p>
              <p className="leading-snug">
                Mo – Sa: 09:30 – 19:00 Uhr
                <br />
                So: 11:00 – 18:00 Uhr
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-[#E6B84A] uppercase text-xs font-mono tracking-wider">
                {isDe ? "Preise & Empfehlungen" : "Pricing & Highlights"}
              </p>
              <p className="leading-snug">
                • Havuç Dilimi (Dreieck-Baklava): ab 49 €/kg (oder einzeln)
                <br />
                • Gourmet-Box (15 Stk.): ca. 45 €
                <br />
                • Galata-Designbox (12 Stk.): ca. 35 €
                <br />• Su Böreği (Wassergebäck mit Käse): ab 40 €/kg
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-[#E6B84A] uppercase text-xs font-mono tracking-wider">
                {isDe ? "Onlineshop & Deutschlandweiter Versand" : "Online Shop & Delivery"}
              </p>
              <p className="leading-snug">
                Online bestellbar über{" "}
                <a
                  href="https://nadirgullubaklava.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E6B84A] underline font-bold hover:text-white"
                >
                  nadirgullubaklava.de
                </a>{" "}
                mit Frische-Garantie in ganz Deutschland.
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
              ? "Nadir Güllü am Münchner Viktualienmarkt ist keine einfache Konditorei, sondern ein Tempel des Handwerks. Wer einmal den feinen Knusper der 40 Schichten, den Röstduft der Boz-Fıstık-Pistazien und die Eleganz der Urfa-Butter erlebt hat, versteht, warum dieses Haus seit 1843 den weltweiten Maßstab setzt. Ein absolutes Muss für Feinschmecker, die wahre Meisterkunst zu schätzen wissen."
              : "Nadir Güllü at Munich's Viktualienmarkt is not simply a confectioner, but a sanctuary of timeless culinary artistry. Once you experience the 40 crisp layers, the perfume of wild Boz Fıstık pistachios, and the silkiness of Urfa butter, you instantly understand why this dynasty has defined the global pinnacle since 1843. An indispensable destination for true gourmets."}
          </p>
        </section>

        {/* Transparent Notice */}
        <aside className="p-6 rounded-2xl bg-white border border-[#173C32]/10 text-xs text-[#173C32]/70 space-y-2 shadow-sm font-sans">
          <div className="flex items-center gap-2 font-bold text-[#173C32]">
            <Info className="w-4 h-4 text-[#E6B84A]" />
            <span>{isDe ? "Transparenzhinweis & Quellen" : "Editorial Disclosure & Sources"}</span>
          </div>
          <p className="leading-relaxed">
            {isDe
              ? "Dieser redaktionelle Beitrag entstand auf Initiative unserer Speisely Community: Die Fotografien und ersten Genuss-Eindrücke wurden von einem engagierten Community-Mitglied vor Ort geteilt. Ergänzende historische Daten, Produktangaben und handwerkliche Hintergründe wurden redaktionell über die offizielle Website von Nadir Güllü sowie öffentlich zugängliche Quellen recherchiert. Es bestanden zum Zeitpunkt der Veröffentlichung keine werblichen Absprachen mit dem Betreiber."
              : "This editorial story was created through the initiative of our Speisely Community: The photographs and on-site tasting impressions were contributed by an active community member. Supplementary historical details, product specifications, and artisanal facts were researched via Nadir Güllü's official website and public culinary archives. No sponsorship or commercial agreements existed at the time of publication."}
          </p>
        </aside>

        {/* Back Link */}
        <div className="pt-6 text-center">
          <Link
            to="/magazin/speisely-visits"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#083822] hover:text-[#E6B84A] transition-colors font-mono"
          >
            ← {isDe ? "Zurück zu allen Speisely Visits" : "Back to all Speisely Visits"}
          </Link>
        </div>
      </main>

      {/* About Speisely Section Footer */}
      <AboutSpeiselySection />
    </article>
  );
}
