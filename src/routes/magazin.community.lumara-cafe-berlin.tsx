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
  Coffee,
  Heart,
  Egg,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/i18n/I18nProvider";
import { RestaurantClaimBridge } from "@/components/RestaurantClaimBridge";

export const Route = createFileRoute("/magazin/community/lumara-cafe-berlin")({
  head: () => ({
    meta: [
      {
        title: "Lumara Café Berlin: Brunch, Hummus & Brioche",
      },
      {
        name: "description",
        content:
          "Speisely Community Visit im Lumara Café Berlin-Charlottenburg: Samtiger Hummus, ofenfrisches Lavabrot, Tiramisu French Toast und Specialty Coffee.",
      },
      {
        name: "keywords",
        content:
          "Lumara Cafe Berlin, Brunch Charlottenburg, Mediterranes Fruehstueck Berlin, Hummus Lavabrot Berlin, Tiramisu French Toast, Knesebeckstrasse Cafe, Speisely Community Visit, Halal Brunch Berlin",
      },
      {
        name: "geo.region",
        content: "DE-BE",
      },
      {
        name: "geo.placename",
        content: "Berlin-Charlottenburg",
      },
      {
        name: "geo.position",
        content: "52.5034;13.3188",
      },
      {
        name: "ICBM",
        content: "52.5034, 13.3188",
      },
      {
        property: "og:title",
        content: "Lumara Café Berlin: Mediterrane Brunch-Kultur | Speisely Magazin",
      },
      {
        property: "og:description",
        content:
          "Erlebnisbericht aus der Knesebeckstraße: Wie Lumara Café in Charlottenburg samtigen Hummus, pochierte Eier und kunstvolles Tiramisu French Toast zelebriert.",
      },
      {
        property: "og:image",
        content: "https://speisely.de/magazin/lumara-cafe-berlin/lumara_table_spread.webp?v=1",
      },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "de_DE" },
      {
        property: "og:url",
        content: "https://speisely.de/magazin/community/lumara-cafe-berlin",
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
        href: "https://speisely.de/magazin/community/lumara-cafe-berlin",
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
                name: "Lumara Café",
                url: "https://www.instagram.com/lumara.cafe/",
                priceRange: "€€",
                servesCuisine: "Mediterraner Brunch, Levantinisches Frühstück, Specialty Coffee",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Knesebeckstraße 29",
                  addressLocality: "Berlin",
                  postalCode: "10623",
                  addressRegion: "Berlin",
                  addressCountry: "DE",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 52.5034,
                  longitude: 13.3188,
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
                ],
              },
            },
            {
              "@type": "Article",
              "@id": "https://speisely.de/magazin/community/lumara-cafe-berlin#article",
              isPartOf: {
                "@id": "https://speisely.de/#website",
              },
              headline:
                "Lumara Café Berlin: Die Kunst von samtigem Hummus, Tiramisu-Brioche & Morgenlicht",
              description:
                "Ein Mitglied der Speisely Community berichtet aus der Knesebeckstraße 29 in Berlin-Charlottenburg: Mediterranes Frühstück, ofenfrisches Lavabrot und meisterhafter Specialty Coffee.",
              image: "https://speisely.de/magazin/lumara-cafe-berlin/lumara_table_spread.webp?v=1",
              datePublished: "2026-10-19T08:00:00+02:00",
              dateModified: "2026-10-19T08:00:00+02:00",
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
                name: "Lumara Café",
                servesCuisine: "Mediterranes Frühstück & Specialty Coffee",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Knesebeckstraße 29",
                  addressLocality: "Berlin",
                  postalCode: "10623",
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
                  name: "Lumara Café Berlin",
                  item: "https://speisely.de/magazin/community/lumara-cafe-berlin",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: LumaraCafeArticlePage,
});

function LumaraCafeArticlePage() {
  const { lang } = useI18n();
  const isDe = lang === "de";
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <article className="min-h-screen bg-[#F6F4EB] text-[#173C32]">
      {/* Editorial Navigation Top Bar (Rule 17: Mobile Safe) */}
      <header className="sticky top-0 z-40 bg-[#083822] text-[#F6F4EB] border-b border-[#E6B84A]/30 backdrop-blur-md px-3 sm:px-4 py-2.5 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            <Link
              to="/magazin"
              className="text-xs uppercase tracking-widest text-[#E6B84A] hover:underline flex items-center gap-1 font-bold whitespace-nowrap"
            >
              ← <span className="hidden xs:inline">Speisely</span> Magazin
            </Link>
            <span className="text-[#F6F4EB]/30 hidden md:inline">|</span>
            <span className="text-xs tracking-wider uppercase text-[#F6F4EB]/80 hidden md:inline font-mono truncate">
              Berlin · Charlottenburg
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="hidden sm:inline-block text-[11px] sm:text-xs font-mono bg-[#E6B84A]/20 text-[#E6B84A] px-2.5 py-0.5 rounded-full font-bold border border-[#E6B84A]/40 whitespace-nowrap">
              Brunch & Specialty Coffee
            </span>
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Hero Header Section */}
      <section
        ref={heroRef}
        className="relative bg-gradient-to-b from-[#083822] via-[#0D442B] to-[#F6F4EB] text-white pt-12 sm:pt-16 pb-16 sm:pb-20 px-4 overflow-hidden"
      >
        <div className="max-w-4xl mx-auto text-center space-y-5 sm:space-y-6 relative z-10">
          <div className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-[#E6B84A]/20 border border-[#E6B84A]/40 px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-mono font-bold tracking-wider sm:tracking-widest text-[#E6B84A] uppercase shadow-sm max-w-full">
            <Sparkles className="w-3.5 h-3.5 text-[#E6B84A] shrink-0" aria-hidden="true" />
            <span className="whitespace-nowrap">SPEISELY COMMUNITY VISIT</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">BERLIN CHARLOTTENBURG</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">
              {isDe ? "MEDITERRANER BRUNCH" : "MEDITERRANEAN BRUNCH"}
            </span>
          </div>

          <h1 className="font-serif text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] text-[#F6F4EB]">
            {isDe ? (
              <>
                Lumara Café Berlin: <br className="hidden sm:inline" />
                <span className="text-[#E6B84A] italic font-normal">
                  Die Kunst des mediterranen Brunches
                </span>
              </>
            ) : (
              <>
                Lumara Café Berlin: <br className="hidden sm:inline" />
                <span className="text-[#E6B84A] italic font-normal">
                  The Art of Mediterranean Brunch
                </span>
              </>
            )}
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[#F6F4EB]/85 leading-relaxed font-sans px-1">
            {isDe
              ? "Samtig geschlagener Hummus mit gerösteten Kichererbsen, ofenfrisches Lavabrot, pochierte Eier unter feiner Hollandaise und sündhaftes Tiramisu-Brioche: Wie ein lichtdurchflutetes Refugium in der Knesebeckstraße die Berliner Brunchkultur verzaubert."
              : "Silky whipped hummus with toasted chickpeas, piping-hot lavash bread, poached eggs under velvet hollandaise, and decadent tiramisu brioche: How a sun-drenched sanctuary on Knesebeckstraße redefines Berlin's morning dining scene."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-mono text-[#F6F4EB]/70 pt-2">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#E6B84A] shrink-0" />
              Knesebeckstraße 29, 10623 Berlin
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#E6B84A] shrink-0" />
              {isDe ? "Oktober 2026" : "October 2026"}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#7FA46B] shrink-0" />
              {isDe ? "Unabhängig verkostet & bezahlt" : "Independently tasted & self-funded"}
            </span>
          </div>
        </div>
      </section>

      {/* Main Editorial Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* Editorial Introduction with Master Drop-Cap (Lindt Style) */}
        <section className="space-y-6">
          <div className="relative">
            <p className="text-base sm:text-xl leading-relaxed text-[#173C32]/90 font-serif">
              <span className="float-left text-5xl sm:text-7xl leading-[0.85] font-bold font-serif text-[#E6B84A] mr-3 sm:mr-4 mt-0.5 sm:mt-1">
                {isDe ? "W" : "W"}
              </span>
              {isDe ? (
                <>
                  er die Knesebeckstraße unweit des Savignyplatzes entlangspaziert, ahnt hinter der
                  eleganten Charlottenburger Altbaufassade zunächst einen der vielen klassischen
                  Treffpunkte des Westens. Doch wer die Stufen ins <strong>Lumara Café</strong>{" "}
                  hinabtritt, lässt die urbane Betriebsamkeit der Hauptstadt im Nu hinter sich. Es
                  ist die sinnliche Verschmelzung aus warmer mediterraner Leichtigkeit, sanft
                  beleuchteten Terrakotta-Bögen und dem verlockenden Duft von frisch gebrühtem
                  Specialty Coffee und warmem Lavabrot, die sofort gefangen nimmt.
                </>
              ) : (
                <>
                  alking down Knesebeckstraße just a few steps from Savignyplatz, one might expect
                  another understated café tucked into historic Charlottenburg architecture. Yet the
                  moment you cross the threshold into <strong>Lumara Café</strong>, Berlin's hurried
                  metropolitan rhythm gives way to serene warmth. A harmonious blend of
                  Mediterranean ease, sun-dappled terracotta alcoves, and the intoxicating fragrance
                  of freshly brewed specialty coffee and stone-baked lavash bread welcomes every
                  guest.
                </>
              )}
            </p>
          </div>

          <p className="text-base text-[#173C32]/80 leading-relaxed font-sans">
            {isDe
              ? "Ein Mitglied unserer Speisely Community hat Lumara Café besucht — unabhängig, ohne Ankündigung und auf eigene Kosten. Das Urteil ist eindeutig: Lumara ist mehr als ein fotogenes Frühstückslokal; es ist ein durchdachtes gastronomisches Erlebnis, das levantinische Mezzekunst und kosmopolitische Brunch-Klassiker auf handwerklich höchstem Niveau zusammenführt."
              : "A dedicated member of our Speisely Community visited Lumara Café — unannounced, independent, and completely self-funded. The takeaway is clear: Lumara is far more than a camera-ready brunch destination; it is an impeccably executed culinary haven uniting Levantine mezze traditions with cosmopolitan brunch benchmarks."}
          </p>
        </section>

        {/* Hero Image 1: The Sanctuary Interior (Passe-Partout Luxury Frame) */}
        <figure className="relative my-10 max-w-2xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border-2 border-[#173C32]/15 bg-white p-3 shadow-2xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-3xl">
            <div className="absolute top-3 left-3 sm:top-6 sm:left-6 z-10 flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#083822]/90 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-mono font-bold text-[#F6F4EB] border border-[#E6B84A]/40 shadow-lg max-w-[calc(100%-1.5rem)]">
              <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#E6B84A] shrink-0" />
              <span className="truncate">
                {isDe ? "DAS REFUGIUM" : "THE SANCTUARY"}
                <span className="hidden sm:inline"> · KNESEBECKSTRASSE 29</span>
              </span>
            </div>
            <img
              src="/magazin/lumara-cafe-berlin/lumara_interior_space.webp?v=1"
              alt="Innenraum von Lumara Café Berlin mit beleuchteten Rundbögen, Olivenbaum und Marmortischen"
              className="w-full h-auto object-cover rounded-2xl"
              width="1200"
              height="900"
              loading="eager"
            />
          </div>
          <figcaption className="text-xs font-mono text-[#173C32]/60 mt-3 text-center">
            {isDe
              ? "Foto: Speisely Community. Der lichtdurchflutete Gastraum von Lumara Café: Dezente Beleuchtung, gewölbte Nischen, ein echter Olivenbaum und warmes Wiener Geflecht schaffen pure Ruhe."
              : "Photo: Speisely Community. The luminous dining hall of Lumara Café: Warm backlit alcoves, an olive tree centerpiece, and woven cane seating inspire quiet Mediterranean indulgence."}
          </figcaption>
        </figure>

        {/* Section 1: The Architectural & Culinary Sanctuary */}
        <section className="space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#173C32] tracking-tight">
            {isDe
              ? "Der Raum als Ouvertüre: Licht, Terrazzo und Olivenzweige"
              : "The Space as a Prelude: Light, Terrazzo & Olive Boughs"}
          </h2>
          <p className="text-base text-[#173C32]/80 leading-relaxed font-sans">
            {isDe
              ? "Bevor der erste Teller den Tisch berührt, entfaltet das Interior seine beruhigende Wirkung. Helle, kalkweiße Wände mit sanft hinterleuchteten Rundbögen erinnern an kykladische Sommerhäuser, während Stühle aus hellem Eichenholz und feinem Wiener Geflecht nordische Behaglichkeit einbringen. Ein Solitär-Olivenbaum im sandfarbenen Pflanzkübel bildet den visuellen Ankerpunkt des Raumes. An den kühlen Marmortischen wird nicht gehetzt; hier nimmt man sich Zeit."
              : "Before the first plate touches the table, the interior works its restorative spell. Whitewashed walls accented by glowing arched recesses evoke Mediterranean retreats, while light oak chairs with woven cane craftsmanship introduce Nordic warmth. A solitary potted olive tree serves as the room’s organic anchor. At cool marble tables, hurried mornings naturally dissolve into relaxed conversation."}
          </p>
        </section>

        {/* Sensory Tasting Masterclass: Die Speisely Genuss-Schule (Lindt Style Framework) */}
        <section className="p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-white border-2 border-[#E6B84A]/30 shadow-xl space-y-5 sm:space-y-6">
          <div className="flex items-center gap-2.5 text-[#083822]">
            <Award className="w-5 sm:w-6 h-5 sm:h-6 text-[#E6B84A] shrink-0" />
            <span className="font-mono text-xs uppercase tracking-widest font-black text-[#E6B84A]">
              {isDe ? "DIE SPEISELY GENUSS-SCHULE" : "THE SPEISELY CONNOISSEUR GUIDE"}
            </span>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[#083822] leading-snug">
            {isDe
              ? "Die 3 goldenen Schritte der Verkostung bei Lumara"
              : "The 3 Golden Steps of Tasting at Lumara"}
          </h3>

          <p className="text-sm sm:text-base text-[#173C32]/75 leading-relaxed font-sans">
            {isDe
              ? "Ein wahrhaft meisterhafter Brunch erschöpft sich nicht im einfachen Verzehr. Er belohnt den bewussten Genuss in 3 sensorischen Akten:"
              : "True brunch mastery is not about haste. It rewards mindful tasting across 3 distinct sensory movements:"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-2">
            {/* Step 1 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F6F4EB] border border-[#173C32]/10 space-y-2 sm:space-y-3">
              <span className="font-mono text-3xl font-black text-[#E6B84A]">01</span>
              <h4 className="font-serif text-lg font-bold text-[#083822]">
                {isDe ? "Die samtige Welle" : "The Velvet Wave"}
              </h4>
              <p className="text-xs sm:text-sm text-[#173C32]/70 leading-relaxed font-sans">
                {isDe
                  ? "Das warme Lavabrot anreißen und durch den kühlen, mit Sumach und gerösteten Kichererbsen bestreuten Hummus ziehen. Die Textur muss seidig und ohne körnigen Widerstand gleiten."
                  : "Tear a warm fragment of lavash bread and scoop through the cool hummus. The texture should yield like velvet, punctuated only by toasted chickpeas and tart sumac."}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F6F4EB] border border-[#173C32]/10 space-y-2 sm:space-y-3">
              <span className="font-mono text-3xl font-black text-[#E6B84A]">02</span>
              <h4 className="font-serif text-lg font-bold text-[#083822]">
                {isDe ? "Der goldene Schnitt" : "The Golden Yield"}
              </h4>
              <p className="text-xs sm:text-sm text-[#173C32]/70 leading-relaxed font-sans">
                {isDe
                  ? "Der Schnitt ins pochierte Ei: Das flüssige, warme Eigelb fließt langsam über cremige Avocado, geröstetes Sauerteigbrot und herbe Granatapfelkerne."
                  : "The fork test on the poached egg: Rich liquid yolk slowly blankets velvety avocado, rustic sourdough, and bursts of tart pomegranate."}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F6F4EB] border border-[#173C32]/10 space-y-2 sm:space-y-3">
              <span className="font-mono text-3xl font-black text-[#E6B84A]">03</span>
              <h4 className="font-serif text-lg font-bold text-[#083822]">
                {isDe ? "Der süße Akkord" : "The Sweet Accord"}
              </h4>
              <p className="text-xs sm:text-sm text-[#173C32]/70 leading-relaxed font-sans">
                {isDe
                  ? "Beim Tiramisu French Toast trifft die karamellisierte Brioche-Kruste auf herbes Kakaopulver, getränkte Löffelbiskuits und kühle Mascarpone-Creme."
                  : "On the Tiramisu French Toast, caramelized golden crust contrasts with bitter Dutch cocoa, espresso-soaked ladyfingers, and chilled mascarpone."}
              </p>
            </div>
          </div>
        </section>

        {/* Feature Platter: Eggs Benedict & Za'atar Avocado Toast */}
        <figure className="relative my-10 max-w-2xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border-2 border-[#173C32]/15 bg-white p-3 shadow-2xl transition-all duration-300 hover:border-[#E6B84A]">
            <div className="absolute top-3 left-3 sm:top-6 sm:left-6 z-10 flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#083822]/90 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-mono font-bold text-[#F6F4EB] border border-[#E6B84A]/40 shadow-lg max-w-[calc(100%-1.5rem)]">
              <Egg className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#E6B84A] shrink-0" />
              <span className="truncate">
                SIGNATURE BRUNCH · EGGS BENEDICT
                <span className="hidden sm:inline"> & AVOCADO SOURDOUGH</span>
              </span>
            </div>
            <img
              src="/magazin/lumara-cafe-berlin/lumara_benedict_avotoast.webp?v=1"
              alt="Eggs Benedict mit cremigem Hollandaise-Spiegel und Avocado-Sauerteigbrot mit pochierten Eiern bei Lumara Café"
              className="w-full h-auto object-cover rounded-2xl"
              width="1200"
              height="900"
              loading="lazy"
            />
          </div>
          <figcaption className="text-xs font-mono text-[#173C32]/60 mt-3 text-center">
            {isDe
              ? "Foto: Speisely Community. Perfektionierter Frühstücksklassiker: Zwei pochierte Bio-Eier auf gebeiztem Lachs und Brioche unter seidiger Sauce Hollandaise, flankiert von knusprigem Avocado-Sauerteigbrot mit Za'atar und Granatapfelkernen."
              : "Photo: Speisely Community. Breakfast perfection: Poached organic eggs over salmon and brioche under velvety hollandaise, paired with sourdough avocado toast seasoned with za'atar and pomegranate."}
          </figcaption>
        </figure>

        {/* Product Callout: The Showstopper (Lindt Style Callout Box) */}
        <section className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#083822] to-[#124E34] text-white space-y-3 sm:space-y-4 shadow-xl border border-[#E6B84A]/30">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#E6B84A] text-[#083822] text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded">
              {isDe ? "DER SHOWSTOPPER" : "THE SHOWSTOPPER"}
            </span>
            <span className="text-xs font-mono text-[#E6B84A] tracking-wider uppercase">
              {isDe ? "EINFACH KÖSTLICH!" : "SIMPLY DELICIOUS!"}
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#F6F4EB] leading-snug">
            {isDe
              ? "Tiramisu French Toast & Brioche-Türme: Die süße Meisterschaft"
              : "Tiramisu French Toast & Brioche Towers: Sweet Mastery"}
          </h3>
          <p className="text-sm sm:text-base text-[#F6F4EB]/85 leading-relaxed font-sans">
            {isDe
              ? "Wenn der French-Toast-Turm an den Tisch gebracht wird, verstummen die Gespräche: Extra dicke Scheiben goldbraun ausgebackener Brioche, außen mit feinem Knusperkaramell und innen so watteweich wie eine Wolke. Gekrönt wird das Ensemble entweder von frischen Beeren, Apfelscheiben und Minze – oder in der spektakulären Tiramisu-Interpretation mit samtiger Mascarpone, Kakaobestäubung und getränkten Biskuits. Ein Dessert, das jeden Morgen zum Festtag erhebt."
              : "When the French toast towers arrive, conversation naturally halts: thick cuts of golden brioche, caramelized crisp at the crust and cloud-soft within. Accented by seasonal berries, crisp apple ribbons, and mint—or served in the showstopping Tiramisu rendition with chilled mascarpone, cocoa dusting, and soaked ladyfingers. A morning celebration in its purest form."}
          </p>
        </section>

        {/* Feature Platter: The Sweet Feast Spread */}
        <figure className="relative my-10 max-w-2xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border-2 border-[#173C32]/15 bg-white p-3 shadow-2xl transition-all duration-300 hover:border-[#E6B84A]">
            <div className="absolute top-3 left-3 sm:top-6 sm:left-6 z-10 flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#083822]/90 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-mono font-bold text-[#F6F4EB] border border-[#E6B84A]/40 shadow-lg max-w-[calc(100%-1.5rem)]">
              <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#E6B84A] shrink-0" />
              <span className="truncate">
                {isDe ? "DER FESTSCHMAUS" : "THE SWEET FEAST"}
                <span className="hidden sm:inline"> · TIRAMISU & BERRY BRIOCHE</span>
              </span>
            </div>
            <img
              src="/magazin/lumara-cafe-berlin/lumara_table_spread.webp?v=1"
              alt="Große Brunch-Tafel bei Lumara Café mit Tiramisu French Toast, Beeren-Brioche, Iced Matcha und Mezze"
              className="w-full h-auto object-cover rounded-2xl"
              width="1200"
              height="900"
              loading="lazy"
            />
          </div>
          <figcaption className="text-xs font-mono text-[#173C32]/60 mt-3 text-center">
            {isDe
              ? "Foto: Speisely Community. Der Höhepunkt des Lumara-Tisches: Tiramisu French Toast mit Kakaoschleier, fluffiger Beeren-Brioche-Turm und schaumig geschlagener Iced Matcha Latte."
              : "Photo: Speisely Community. The pinnacle of the Lumara table: Tiramisu French toast under rich cocoa, towering berry brioche, and hand-whisked iced matcha latte."}
          </figcaption>
        </figure>

        {/* 2-Column Sensory Grid: Hummus & Specialty Coffee (Lindt Style) */}
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
            {/* Item 1: Artisanal Hummus */}
            <div className="flex flex-col rounded-3xl bg-white border-2 border-[#173C32]/15 shadow-xl overflow-hidden transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
              <div className="relative aspect-[4/3] w-full bg-[#083822]/5 overflow-hidden">
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-1.5 rounded-full bg-[#083822]/85 backdrop-blur-md px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-mono font-bold text-[#F6F4EB] border border-[#E6B84A]/40 shadow-md">
                  <Utensils className="w-3 h-3 text-[#E6B84A]" />
                  <span>ARTISANAL HUMMUS</span>
                </div>
                <img
                  src="/magazin/lumara-cafe-berlin/lumara_hummus_plate.webp?v=1"
                  alt="Seidiger Hummus mit gerösteten Kichererbsen, Tomaten, Sumach und Granatapfel bei Lumara Café"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                  width="1200"
                  height="900"
                />
              </div>
              <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between space-y-3">
                <div className="space-y-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#083822]/5 text-[#083822] text-[11px] font-mono font-bold uppercase tracking-wider border border-[#083822]/10">
                    {isDe ? "DIE LEVANTINISCHE SEELE" : "LEVANTINE HERITAGE"}
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#083822] leading-snug">
                    {isDe ? "Seidiger Hummus & Lavabrot" : "Silky Hummus & Lavash Bread"}
                  </h4>
                  <p className="text-sm text-[#173C32]/80 leading-relaxed font-sans">
                    {isDe
                      ? "Stundenlang mit feinem Tahini, Zitrone und kaltgepresstem Olivenöl aufgeschlagen. Vollendet mit knusprig gerösteten Kichererbsen, geschmorten Cocktailtomaten und säuerlich-fruchtigen Granatapfelkernen. Ein Hochgenuss zu ofenfrischem, dampfendem Lavabrot."
                      : "Whipped to airy perfection with cold-pressed sesame tahini, fresh lemon, and virgin olive oil. Crowned with crisp roasted chickpeas, blistered cherry tomatoes, and tart ruby pomegranate. An exquisite counterpart to piping-hot, stone-baked lavash bread."}
                  </p>
                </div>
              </div>
            </div>

            {/* Item 2: Specialty Coffee Ritual */}
            <div className="flex flex-col rounded-3xl bg-white border-2 border-[#173C32]/15 shadow-xl overflow-hidden transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
              <div className="relative aspect-[4/3] w-full bg-[#083822]/5 overflow-hidden">
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-1.5 rounded-full bg-[#083822]/85 backdrop-blur-md px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-mono font-bold text-[#F6F4EB] border border-[#E6B84A]/40 shadow-md">
                  <Coffee className="w-3 h-3 text-[#E6B84A]" />
                  <span>SPECIALTY COFFEE</span>
                </div>
                <img
                  src="/magazin/lumara-cafe-berlin/lumara_latte_art.webp?v=1"
                  alt="Flat White mit feinem Blatt-Latte-Art und frischer Kräutertee bei Lumara Café"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                  width="1200"
                  height="900"
                />
              </div>
              <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between space-y-3">
                <div className="space-y-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#083822]/5 text-[#083822] text-[11px] font-mono font-bold uppercase tracking-wider border border-[#083822]/10">
                    {isDe ? "BARISTA-PRÄZISION" : "BARISTA MASTERY"}
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#083822] leading-snug">
                    {isDe ? "Flat White & Latte Art" : "Flat White & Latte Art"}
                  </h4>
                  <p className="text-sm text-[#173C32]/80 leading-relaxed font-sans">
                    {isDe
                      ? "Ausgewählte Bohnen, fein austarierte Extraktion und seidige Mikroschaum-Textur: Das florale Tulpen-Motiv zeugt von Barista-Hingabe. Feine Kakaonoten harmonieren ideal mit der süßen Brioche."
                      : "Artisanal espresso blend, precise extraction, and velvety microfoam poured with textbook tulip art. Nutty cocoa profiles balance the richness of sweet breakfast plates."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fact Sheet / Speisely Gastro Dossier */}
        <section className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#083822] text-[#F6F4EB] space-y-6 shadow-2xl border border-[#E6B84A]/30">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E6B84A]/30 pb-4">
            <div>
              <span className="text-[11px] sm:text-xs font-mono text-[#E6B84A] uppercase tracking-widest font-bold">
                SPEISELY GASTRO-DOSSIER
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#F6F4EB]">
                Lumara Café Berlin
              </h3>
            </div>
            <div className="text-right">
              <span className="inline-block bg-[#E6B84A] text-[#083822] text-xs font-mono font-black px-2.5 py-1 rounded">
                CHARLOTTENBURG
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-sans text-[#F6F4EB]/85">
            <div className="space-y-2">
              <p className="font-bold text-[#E6B84A] uppercase text-xs font-mono tracking-wider">
                {isDe ? "Standort & Adresse" : "Location & Address"}
              </p>
              <p className="leading-snug">
                Knesebeckstraße 29
                <br />
                10623 Berlin-Charlottenburg {isDe ? "(nahe Savignyplatz)" : "(near Savignyplatz)"}
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-[#E6B84A] uppercase text-xs font-mono tracking-wider">
                {isDe ? "Öffnungszeiten" : "Opening Hours"}
              </p>
              <p className="leading-snug">
                {isDe ? "Täglich: 09:00 – 17:00 Uhr" : "Daily: 09:00 AM – 05:00 PM"}
                <br />
                <span className="text-[#E6B84A] font-mono text-xs">
                  {isDe ? "Kein Ruhetag · Täglich geöffnet" : "Open 7 Days a Week · No Rest Day"}
                </span>
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-[#E6B84A] uppercase text-xs font-mono tracking-wider">
                {isDe ? "Konditionen & Besonderheiten" : "Terms & Highlights"}
              </p>
              <p className="leading-snug">
                {isDe ? (
                  <>
                    • 100% Halal-Fleischauswahl & reichhaltig vegetarisch
                    <br />
                    • Kartenzahlung & Barzahlung möglich
                    <br />• Walk-in willkommen (am Wochenende früh kommen!)
                  </>
                ) : (
                  <>
                    • 100% Halal meat options & rich vegetarian selection
                    <br />
                    • Card and cash payments accepted
                    <br />• Walk-ins welcome (arrive early on weekends!)
                  </>
                )}
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-[#E6B84A] uppercase text-xs font-mono tracking-wider">
                {isDe ? "Kontakt & Instagram" : "Contact & Social"}
              </p>
              <p className="leading-snug">
                Instagram:{" "}
                <a
                  href="https://www.instagram.com/lumara.cafe/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E6B84A] underline font-bold hover:text-white"
                >
                  @lumara.cafe
                </a>
                <br />
                {isDe
                  ? "Reservierungen / Walk-in: Vor Ort in der Knesebeckstraße"
                  : "Reservations / Walk-in: On-site at Knesebeckstraße"}
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
              ? "Lumara Café beweist, wie moderner Brunch sein sollte: Nicht überladen mit künstlichen Effekten, sondern getragen von ehrlicher Handwerkskunst, frischen Zutaten und einer Atmosphäre, die wie ein Kurzurlaub am Mittelmeer wirkt. Wer samtigen Hummus mit warmem Lavabrot liebt und bei pochierten Eiern oder karamellisiertem Brioche ins Schwärmen gerät, findet in der Knesebeckstraße 29 seinen neuen Lieblingsort im Berliner Westen."
              : "Lumara Café demonstrates what modern breakfast dining can achieve when anchored in authentic craft rather than fleeting hype: Mediterranean soul, pristine ingredients, and an ambiance reminiscent of a coastal retreat. For lovers of velvety hummus, hot stone-baked lavash, and indulgent brioche, Knesebeckstraße 29 is a premier morning destination in West Berlin."}
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
              ? "Dieser redaktionelle Beitrag entstand im Rahmen unserer Speisely Community-Initiative: Die Fotografien und ersten Tasting-Eindrücke wurden von einem Community-Mitglied vor Ort unabhängig und auf eigene Kosten dokumentiert. Zum Zeitpunkt der Veröffentlichung bestanden keinerlei werbliche oder finanzielle Vereinbarungen mit Lumara Café."
              : "This editorial article was created as part of the Speisely Community Initiative: Visual assets and tasting notes were gathered independently and self-funded by a community contributor. No commercial or promotional agreements existed with Lumara Café at the time of documentation."}
          </p>
        </aside>

        {/* Restaurant Claim & Foodie Recommendation Bridge */}
        <RestaurantClaimBridge restaurantName="Lumara Café" city="Berlin" />

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
