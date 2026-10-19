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
  Flame,
  Clock,
  Phone,
  Laptop,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/i18n/I18nProvider";
import { RestaurantClaimBridge } from "@/components/RestaurantClaimBridge";

export const Route = createFileRoute("/magazin/community/lumara-cafe-berlin")({
  head: () => ({
    meta: [
      {
        title: "Lumara Café Berlin: Brunch, Lavabrot & Tahini Latte",
      },
      {
        name: "description",
        content:
          "Lumara Café Berlin-Charlottenburg: Echtes Lavabrot 'Golden Pear', Nonna Maria Tiramisu French Toast, Croffle Truffle und Specialty Tahini Latte.",
      },
      {
        name: "keywords",
        content:
          "Lumara Cafe Berlin, Lumara Charlottenburg, Lavabrot Berlin, Nonna Maria French Toast, Croffle Truffle Berlin, Tahini Latte, Knesebeckstrasse Brunch, Pure Pistachio Kuchen, Mediterraner Brunch Berlin",
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
        content: "Lumara Café Berlin: Das Licht des Marmors & Moderne Brunch-Kultur",
      },
      {
        property: "og:description",
        content:
          "Das neue Brunch-Refugium in der Knesebeckstraße: Ofenfrisches Lavabrot, getrüffelte Croffles, Nonna Maria Brioche und Tahini-Kaffee.",
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
                url: "https://lumara-cafe.de",
                telephone: "+49 30 628 59 260",
                priceRange: "€€",
                servesCuisine:
                  "Mediterranes Brunch Café, Lavabrot Spezialitäten, Specialty Coffee & Bowls",
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
                    opens: "08:00",
                    closes: "18:00",
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
                "Lumara Café Berlin: Licht des Marmors, Ofen-Lavabrot & 'Nonna Maria' Brioche",
              description:
                "Authentischer Tasting-Report aus der Knesebeckstraße 29 in Charlottenburg: Wie Lumara Café modernes Lavabrot, getrüffelte Croffles und Specialty Tahini Latte meistert.",
              image: "https://speisely.de/magazin/lumara-cafe-berlin/lumara_table_spread.webp?v=1",
              datePublished: "2026-10-19T08:00:00+02:00",
              dateModified: "2026-10-19T11:30:00+02:00",
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
                servesCuisine: "Mediterraner Brunch & Specialty Coffee",
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
      {/* Editorial Navigation Top Bar */}
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
                  Das Licht des Marmors & Moderne Brunch-Kultur
                </span>
              </>
            ) : (
              <>
                Lumara Café Berlin: <br className="hidden sm:inline" />
                <span className="text-[#E6B84A] italic font-normal">
                  The Light of Marble & Modern Brunch Craft
                </span>
              </>
            )}
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[#F6F4EB]/85 leading-relaxed font-sans px-1">
            {isDe
              ? "Ofenfrisches Lavabrot mit gerösteten Birnen und Dattelsirup, 'Nonna Maria' Tiramisu-Brioche, getrüffelte Croffles und samtige Tahini Lattes: Wie ein lichtdurchflutetes Refugium in der Knesebeckstraße mediterrane Leichtigkeit zelebriert."
              : "Stone-baked lavash bread with roasted pears and date syrup, 'Nonna Maria' tiramisu brioche, truffle-infused croffles, and silky tahini lattes: How a sun-drenched sanctuary on Knesebeckstraße redefines Berlin's morning scene."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-mono text-[#F6F4EB]/70 pt-2">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#E6B84A] shrink-0" />
              Knesebeckstraße 29, 10623 Berlin
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#E6B84A] shrink-0" />
              {isDe ? "Täglich 08:00 – 18:00 Uhr" : "Daily 08:00 AM – 06:00 PM"}
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
        {/* Editorial Introduction with Master Drop-Cap */}
        <section className="space-y-6">
          <div className="relative">
            <p className="text-base sm:text-xl leading-relaxed text-[#173C32]/90 font-serif">
              <span className="float-left text-5xl sm:text-7xl leading-[0.85] font-bold font-serif text-[#E6B84A] mr-3 sm:mr-4 mt-0.5 sm:mt-1">
                L
              </span>
              {isDe ? (
                <>
                  UMARA – der Name leitet sich aus dem poetischen Zusammenspiel von <em>Licht</em>{" "}
                  und <em>Marmor</em> ab. Wer die Knesebeckstraße unweit des Savignyplatzes und des
                  Kurfürstendamms entlangspaziert und die Stufen in dieses Refugium hinabtritt,
                  spürt sofort, dass hier kein gewöhnliches Großstadtlokal wartet. Es ist ein
                  moderner, eleganter "Place to be": Sanft beleuchtete Terrakotta-Rundbögen, echter
                  Marmor, ein Solitär-Olivenbaum und das leise Surren der Siebträgermaschine
                  schaffen ein Gefühl von mediterranem Kurzurlaub mitten in Charlottenburg.
                </>
              ) : (
                <>
                  UMARA – a name inspired by the luminous dialogue between <em>light</em> and{" "}
                  <em>marble</em>. Walking down Knesebeckstraße just a few steps from Savignyplatz
                  and Kurfürstendamm, the moment you cross the threshold, the frantic metropolitan
                  rhythm gives way to serene warmth. This is not another generic breakfast spot; it
                  is a design-forward, light-filled sanctuary where sun-dappled terracotta alcoves,
                  polished marble, a potted olive tree, and the aroma of specialty coffee inspire
                  quiet Mediterranean indulgence.
                </>
              )}
            </p>
          </div>

          <p className="text-base text-[#173C32]/80 leading-relaxed font-sans">
            {isDe
              ? "Ein Mitglied unserer Speisely Community hat Lumara Café besucht — unabhängig, ohne Ankündigung und auf eigene Kosten. Das kulinarische Profil ist bemerkenswert präzise: Das Küchenteam vereint mediterrane Wärme mit moderner urbaner Genusskultur. Hier gibt es keine schwerfälligen Standardgerichte, sondern bio-zertifizierte Frische, veganfreundliche Vielfalt, ofenfrisches Lavabrot, getrüffelte Spezialitäten und zuckerreduzierte Desserts, die den Gaumen begeistern."
              : "A dedicated member of our Speisely Community visited Lumara Café — unannounced, independent, and completely self-funded. The culinary concept is remarkably sharp: an experienced international kitchen team fusing Mediterranean warmth with contemporary brunch sophistication. Rather than heavy clichés, Lumara focuses on organic farm-fresh ingredients, stone-baked lavash flatbreads, truffle croffles, and refined sugar-reduced pastries."}
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
              ? "Foto: Speisely Community. Der lichtdurchflutete Gastraum von Lumara Café: Beleuchtete Rundbögen, echter Olivenbaum, Wiener Geflecht und Marmortische zum Genießen oder produktiven Verweilen."
              : "Photo: Speisely Community. Lumara Café's light-filled interior: Backlit alcoves, an olive tree centerpiece, woven cane chairs, and marble tables ideal for relaxed dining or focused remote work."}
          </figcaption>
        </figure>

        {/* Section 1: The Concept — Bewusst genießen & kreative Vielfalt */}
        <section className="space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#173C32] tracking-tight">
            {isDe
              ? "Die Lumara-Philosophie: Bio-Qualität, Zuckerreduktion & Lavabrot"
              : "The Lumara Philosophy: Organic Quality, Mindful Sugar & Stone-Baked Lavash"}
          </h2>
          <p className="text-base text-[#173C32]/80 leading-relaxed font-sans">
            {isDe
              ? "Das Herzstück der Speisekarte ist das ofenfrische Lava-Brot: Knusprig gebackenes Fladenbrot, das dampfend aus dem Ofen serviert und kreativ belegt wird. Ob als 'Golden Pear' mit milder Ziegenkäsemischung, gerösteten Birnen, Rosmarin, Walnüssen und Dattelsirup, oder als 'Feta Fiesta' mit hausgemachter Muhammara-Walnusspaste und Oliven – hier verschmelzen levantinische Aromen mit mediterraner Eleganz. Ergänzt wird dies durch zuckerreduzierte Kuchen wie den reinen Pistazienkuchen 'Pure Pistachio', der vollkommen ohne Mehl und Industriezucker auskommt."
              : "The centerpiece of the culinary offering is their stone-baked Lava Bread: served steaming straight from the oven and topped with inspired flavor pairings. Highlights include the 'Golden Pear' with creamy goat cheese, roasted pears, rosemary, walnuts, and date syrup, and the 'Feta Fiesta' with homemade muhammara walnut spread and olives. Mindful eaters will delight in flourless, sugar-reduced cakes like the signature 'Pure Pistachio', baked purely from pistachios and served with airy cream."}
          </p>
        </section>

        {/* Sensory Tasting Masterclass: Die Speisely Genuss-Schule */}
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
              ? "Die Küche von Lumara belohnt die Neugier und die bewusste sensorische Wahrnehmung in 3 Stufen:"
              : "Lumara's kitchen rewards mindful discovery across 3 distinct sensory movements:"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-2">
            {/* Step 1 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F6F4EB] border border-[#173C32]/10 space-y-2 sm:space-y-3">
              <span className="font-mono text-3xl font-black text-[#E6B84A]">01</span>
              <h4 className="font-serif text-lg font-bold text-[#083822]">
                {isDe ? "Der Lavabrot-Biss" : "The Lavash Crisp"}
              </h4>
              <p className="text-xs sm:text-sm text-[#173C32]/70 leading-relaxed font-sans">
                {isDe
                  ? "Das noch dampfende Lavabrot 'Golden Pear' teilen: Der warme Ziegenkäse, das herbe Aroma von Thymian und die Süße des Dattelsirups vereinen sich mit dem Knacken gerösteter Walnüsse."
                  : "Break into the steaming 'Golden Pear' lava bread: warm goat cheese, aromatic thyme, and sweet date syrup balance the crunch of roasted walnuts."}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F6F4EB] border border-[#173C32]/10 space-y-2 sm:space-y-3">
              <span className="font-mono text-3xl font-black text-[#E6B84A]">02</span>
              <h4 className="font-serif text-lg font-bold text-[#083822]">
                {isDe ? "Der goldene Schnitt" : "The Golden Cut"}
              </h4>
              <p className="text-xs sm:text-sm text-[#173C32]/70 leading-relaxed font-sans">
                {isDe
                  ? "Der Schnitt in die pochierten Eier des 'Green Goddess' oder 'Eggs Benedict': Seidige Hollandaise und flüssiger Dotter treffen auf cremige Avocado und kräftiges Sauerteigbrot."
                  : "The fork test on the poached eggs of the 'Green Goddess' or 'Eggs Benedict': Velvety hollandaise and golden yolk cascade over sourdough and fresh avocado."}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F6F4EB] border border-[#173C32]/10 space-y-2 sm:space-y-3">
              <span className="font-mono text-3xl font-black text-[#E6B84A]">03</span>
              <h4 className="font-serif text-lg font-bold text-[#083822]">
                {isDe ? "Nonna Marias Akkord" : "The Nonna Maria Finale"}
              </h4>
              <p className="text-xs sm:text-sm text-[#173C32]/70 leading-relaxed font-sans">
                {isDe
                  ? "Beim French Toast 'Nonna Maria' verschmelzen butterzarte Brioche, luftige Mascarpone, getränkte Löffelbiskuits und herber Kakao zu einem vollendeten Tiramisu-Dessert."
                  : "On the 'Nonna Maria' French toast, caramelized brioche, whipped mascarpone, espresso-kissed ladyfingers, and Dutch cocoa harmonize into tiramisu perfection."}
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
                BRUNCH-KLASSIKER · EGGS BENEDICT
                <span className="hidden sm:inline"> & GREEN GODDESS TOAST</span>
              </span>
            </div>
            <img
              src="/magazin/lumara-cafe-berlin/lumara_benedict_avotoast.webp?v=1"
              alt="Eggs Benedict auf Brioche mit pochierten Eiern und Guacamole-Sauerteigbrot bei Lumara Café"
              className="w-full h-auto object-cover rounded-2xl"
              width="1200"
              height="900"
              loading="lazy"
            />
          </div>
          <figcaption className="text-xs font-mono text-[#173C32]/60 mt-3 text-center">
            {isDe
              ? "Foto: Speisely Community. Brioche-Scheiben mit pochierten Freilandeiern, seidiger Hollandaise und Avocado – serviert neben knusprigem Sauerteigbrot mit Granatapfelkernen."
              : "Photo: Speisely Community. Golden brioche with poached organic eggs, silky hollandaise, and avocado—paired with crusty sourdough toast crowned with ruby pomegranate."}
          </figcaption>
        </figure>

        {/* Product Callout: The Showstopper — Nonna Maria & Frenchie */}
        <section className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#083822] to-[#124E34] text-white space-y-3 sm:space-y-4 shadow-xl border border-[#E6B84A]/30">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#E6B84A] text-[#083822] text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded">
              {isDe ? "DER SHOWSTOPPER" : "THE SHOWSTOPPER"}
            </span>
            <span className="text-xs font-mono text-[#E6B84A] tracking-wider uppercase">
              NONNA MARIA (16 €) · FRENCHIE (16.90 €)
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#F6F4EB] leading-snug">
            {isDe
              ? "French Toast 'Nonna Maria': Wenn Tiramisu auf warme Brioche trifft"
              : "French Toast 'Nonna Maria': When Tiramisu Meets Warm Brioche"}
          </h3>
          <p className="text-sm sm:text-base text-[#F6F4EB]/85 leading-relaxed font-sans">
            {isDe
              ? "Die süßen Kreationen bei Lumara sind keine bloßen Beilagen, sondern eigenständige Meisterwerke: Bei 'Nonna Maria' wird goldbraun ausgebackene Brioche im Tiramisu-Stil mit Mascarpone, Kakaopulver, knusprigen Ladyfinger-Keksen und einer samtigen Kaffee-Sahne-Sauce serviert. Wer es fruchtiger mag, wählt den 'Frenchie' mit saisonalen Beeren, Apfelstiften, gehackten Pistazien und purem Ahornsirup."
              : "Sweet selections at Lumara are culinary centerpieces: 'Nonna Maria' layers golden brioche in tiramisu elegance with rich mascarpone, cocoa powder, crisp ladyfingers, and a velvety coffee cream reduction. Those craving orchard brightness can opt for 'Frenchie', laden with seasonal fresh berries, apple batons, chopped pistachios, and pure maple syrup."}
          </p>
        </section>

        {/* Feature Platter: The Sweet Feast Spread */}
        <figure className="relative my-10 max-w-2xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border-2 border-[#173C32]/15 bg-white p-3 shadow-2xl transition-all duration-300 hover:border-[#E6B84A]">
            <div className="absolute top-3 left-3 sm:top-6 sm:left-6 z-10 flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#083822]/90 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-mono font-bold text-[#F6F4EB] border border-[#E6B84A]/40 shadow-lg max-w-[calc(100%-1.5rem)]">
              <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#E6B84A] shrink-0" />
              <span className="truncate">
                {isDe ? "DER FESTSCHMAUS" : "THE SWEET FEAST"}
                <span className="hidden sm:inline"> · NONNA MARIA & ICED MATCHA</span>
              </span>
            </div>
            <img
              src="/magazin/lumara-cafe-berlin/lumara_table_spread.webp?v=1"
              alt="Große Brunch-Tafel bei Lumara Café mit Tiramisu French Toast Nonna Maria, Beeren-Brioche und Iced Matcha"
              className="w-full h-auto object-cover rounded-2xl"
              width="1200"
              height="900"
              loading="lazy"
            />
          </div>
          <figcaption className="text-xs font-mono text-[#173C32]/60 mt-3 text-center">
            {isDe
              ? "Foto: Speisely Community. Die süße Tafel bei Lumara: Nonna Maria French Toast mit Löffelbiskuits, Beeren-Brioche-Turm und frisch aufgeschlagener Iced Matcha Latte."
              : "Photo: Speisely Community. Sweet brunch mastery: Nonna Maria French toast with ladyfingers, berry brioche tower, and whisked iced matcha latte."}
          </figcaption>
        </figure>

        {/* 2-Column Sensory Grid: Hummus Bowls & Signature Tahini Latte */}
        <section
          aria-label={isDe ? "Kulinarische Begleiter" : "Culinary Pairings"}
          className="my-14 space-y-6"
        >
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E6B84A] font-bold">
              {isDe ? "SIGNATURE KREATIONEN" : "SIGNATURE CREATIONS"}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-black text-[#083822]">
              {isDe ? "Hummus-Bowls & Tahini-Kaffee" : "Hummus Bowls & Tahini Coffee"}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Item 1: Artisanal Hummus Bowls */}
            <div className="flex flex-col rounded-3xl bg-white border-2 border-[#173C32]/15 shadow-xl overflow-hidden transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
              <div className="relative aspect-[4/3] w-full bg-[#083822]/5 overflow-hidden">
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-1.5 rounded-full bg-[#083822]/85 backdrop-blur-md px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-mono font-bold text-[#F6F4EB] border border-[#E6B84A]/40 shadow-md">
                  <Utensils className="w-3 h-3 text-[#E6B84A]" />
                  <span>GREEN DREAM & GOLDEN HUMMUS</span>
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
                    {isDe ? "HAUSGEMACHTE BOWLS" : "SCRATCH-MADE BOWLS"}
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#083822] leading-snug">
                    {isDe ? "Cremige Hummus-Variationen" : "Silky Hummus Bowls"}
                  </h4>
                  <p className="text-sm text-[#173C32]/80 leading-relaxed font-sans">
                    {isDe
                      ? "Vom 'Golden Hummus' (8 €) mit Tahini, Zitrone, Pinienkernen und Pickled Onions bis zum 'Green Dream' (9.50 €) mit Avocado, Feta, Joghurt und gerösteten Cashews & Pistazien: Cremig geschlagen und ideal zum Dippen mit ofenfrischem Brot."
                      : "From the 'Golden Hummus' (€8) with tahini, pine nuts, and pickled onions to the vibrant 'Green Dream' (€9.50) topped with avocado, feta, yogurt, and toasted cashews & pistachios."}
                  </p>
                </div>
              </div>
            </div>

            {/* Item 2: Signature Drinks — Tahini Latte & Matcha */}
            <div className="flex flex-col rounded-3xl bg-white border-2 border-[#173C32]/15 shadow-xl overflow-hidden transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
              <div className="relative aspect-[4/3] w-full bg-[#083822]/5 overflow-hidden">
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-1.5 rounded-full bg-[#083822]/85 backdrop-blur-md px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-mono font-bold text-[#F6F4EB] border border-[#E6B84A]/40 shadow-md">
                  <Coffee className="w-3 h-3 text-[#E6B84A]" />
                  <span>TAHINI LATTE & SPECIALTY COFFEE</span>
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
                    {isDe ? "SIGNATURE DRINKS" : "SIGNATURE DRINKS"}
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#083822] leading-snug">
                    {isDe ? "Tahini Latte & Jade Matcha" : "Tahini Latte & Jade Matcha"}
                  </h4>
                  <p className="text-sm text-[#173C32]/80 leading-relaxed font-sans">
                    {isDe
                      ? "Die Signature-Getränke sind Berlins Geheimtipp: Der 'Tahini Latte' (5.50 €) verschmilzt nussiges Sesam-Tahini mit Espresso, während der 'Jade Matcha' (6.50 €) kaltes Kokosnusswasser mit samtigem Matcha-Schaum krönt. Natürlich gibt es auch Flat White mit perfekter Tulpen-Latte-Art."
                      : "Berlin's most creative morning pour: The 'Tahini Latte' (€5.50) infuses nutty sesame tahini with rich espresso, while the 'Jade Matcha' (€6.50) crowns coconut water with airy matcha foam."}
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
              <p className="font-bold text-[#E6B84A] uppercase text-xs font-mono tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E6B84A]" />
                {isDe ? "Standort & Adresse" : "Location & Address"}
              </p>
              <p className="leading-snug">
                Knesebeckstraße 29
                <br />
                10623 Berlin-Charlottenburg{" "}
                {isDe ? "(nahe Savignyplatz & Ku'damm)" : "(near Savignyplatz & Ku'damm)"}
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-[#E6B84A] uppercase text-xs font-mono tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#E6B84A]" />
                {isDe ? "Öffnungszeiten" : "Opening Hours"}
              </p>
              <p className="leading-snug">
                {isDe ? "Täglich: 08:00 – 18:00 Uhr" : "Daily: 08:00 AM – 06:00 PM"}
                <br />
                <span className="text-[#E6B84A] font-mono text-xs">
                  {isDe
                    ? "Küche bis 15:00 Uhr · Kaffee & Kuchen bis 18:00 Uhr"
                    : "Kitchen until 3:00 PM · Coffee & Cake until 6:00 PM"}
                </span>
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-[#E6B84A] uppercase text-xs font-mono tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#E6B84A]" />
                {isDe ? "Besonderheiten & Ernährung" : "Highlights & Dietary"}
              </p>
              <p className="leading-snug">
                {isDe ? (
                  <>
                    • Ofenfrisches Lava-Brot & Croffle-Spezialitäten
                    <br />
                    • Vegetarisch, veganfreundlich & zuckerreduziert
                    <br />
                    • Bio-Zutaten & laktosefreie Alternativen (Hafer, Soja, Kokos)
                    <br />• Highspeed-WLAN & sonnige Außenterrasse
                  </>
                ) : (
                  <>
                    • Stone-baked lava flatbreads & truffle croffles
                    <br />
                    • Vegetarian, vegan-friendly & low-sugar pastries
                    <br />
                    • Organic produce & dairy-free milks (oat, soy, coconut)
                    <br />• High-speed Wi-Fi & sunny outdoor patio
                  </>
                )}
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-[#E6B84A] uppercase text-xs font-mono tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#E6B84A]" />
                {isDe ? "Kontakt & Reservierung" : "Contact & Reservations"}
              </p>
              <p className="leading-snug">
                Telefon:{" "}
                <a
                  href="tel:+493062859260"
                  className="text-[#E6B84A] underline font-bold hover:text-white"
                >
                  +49 30 628 59 260
                </a>
                <br />
                Web:{" "}
                <a
                  href="https://lumara-cafe.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E6B84A] underline font-bold hover:text-white"
                >
                  lumara-cafe.de
                </a>{" "}
                · Instagram:{" "}
                <a
                  href="https://www.instagram.com/lumara.cafe/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E6B84A] underline font-bold hover:text-white"
                >
                  @lumara.cafe
                </a>
                <br />
                {isDe ? "Walk-ins herzlich willkommen" : "Walk-ins warmly welcome"}
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
              ? "Lumara Café ist kein beliebiges Frühstückslokal, sondern eine Bereicherung für Charlottenburg. Mit echtem Ofen-Lavabrot ('Golden Pear'), getrüffelten Croffles, dem sündhaften 'Nonna Maria' Tiramisu-French-Toast und innovativen Signature-Getränken wie dem Tahini Latte beweist das Team, wie zeitgemäßer Brunch schmecken muss: Natürlich, frisch, voller mediterraner Seele und mit Liebe zum Detail zubereitet."
              : "Lumara Café is far more than a routine breakfast room; it is an inspired asset for Charlottenburg. Through stone-baked lava flatbreads ('Golden Pear'), truffle croffles, decadent 'Nonna Maria' tiramisu French toast, and pioneer drinks like the Tahini Latte, the team proves what contemporary brunch can achieve: natural, unpretentious, brimming with Mediterranean warmth, and impeccably executed."}
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
