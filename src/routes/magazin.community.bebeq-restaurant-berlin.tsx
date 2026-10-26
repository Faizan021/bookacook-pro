import { AboutSpeiselySection } from "@/components/AboutSpeiselySection";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  Calendar,
  Shield,
  Utensils,
  Info,
  Sparkles,
  Flame,
  Clock,
  Share2,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Heart,
  Fish,
} from "lucide-react";
import { useEffect, useState } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/i18n/I18nProvider";
import { RestaurantClaimBridge } from "@/components/RestaurantClaimBridge";

export const Route = createFileRoute("/magazin/community/bebeq-restaurant-berlin")({
  head: () => ({
    meta: [
      {
        title: "BebeQ Restaurant Berlin — Speisely",
      },
      {
        name: "description",
        content:
          "BebeQ Berlin an der Spree-Promenade: Feinstes Fleisch & frischer Fisch vom Holzkohlegrill mit urbanem Lounge-Ambiente in Friedrichshain.",
      },
      {
        name: "keywords",
        content:
          "BebeQ Berlin, BebeQ Restaurant, Restaurant Friedrichshain Spree, Holzkohlegrill Berlin, Steakhouse Berlin Spreeufer, Dorade gegrillt Berlin, Halal Steak Berlin Friedrichshain, Fischrestaurant Berlin Spree",
      },
      {
        name: "geo.region",
        content: "DE-BE",
      },
      {
        name: "geo.placename",
        content: "Berlin, Friedrichshain",
      },
      {
        name: "geo.position",
        content: "52.5056;13.4402",
      },
      {
        name: "ICBM",
        content: "52.5056, 13.4402",
      },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large",
      },
      {
        property: "og:title",
        content: "BebeQ Restaurant Berlin: Fisch, Fleisch & Feuer an der Spree",
      },
      {
        property: "og:description",
        content:
          "Urbanes Flair trifft auf traditionelle Glut: Zarteste Rindermedaillons, saftige Spieße und fangfrischer Fisch direkt an der Mühlenstraße in Berlin-Friedrichshain.",
      },
      {
        property: "og:image",
        content: "https://speisely.de/magazin/bebeq-berlin/bebeq_steak_slate.webp?v=4",
      },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "de_DE" },
      {
        property: "og:url",
        content: "https://speisely.de/magazin/community/bebeq-restaurant-berlin",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://speisely.de/magazin/community/bebeq-restaurant-berlin",
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
                name: "BebeQ Restaurant Berlin",
                url: "https://bebeq-berlin.com",
                priceRange: "€€-€€€",
                servesCuisine: "Mediterraner Holzkohlegrill, Steaks, Fisch & Meeresfrüchte",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Mühlenstraße 60",
                  addressLocality: "Berlin",
                  postalCode: "10243",
                  addressRegion: "Berlin",
                  addressCountry: "DE",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 52.5056,
                  longitude: 13.4402,
                },
              },
            },
            {
              "@type": "Article",
              "@id": "https://speisely.de/magazin/community/bebeq-restaurant-berlin#article",
              isPartOf: {
                "@id": "https://speisely.de/#website",
              },
              headline: "BebeQ Restaurant Berlin: Fisch, Fleisch & Feuer an der Spree-Promenade",
              description:
                "Kulinarische Entdeckung in Friedrichshain: Wie das BebeQ modernes Berliner Lounge-Ambiente mit puristischem Holzkohlegrill-Handwerk verbindet.",
              image: "https://speisely.de/magazin/bebeq-berlin/bebeq_steak_slate.webp?v=4",
              datePublished: "2026-10-26T18:00:00+02:00",
              dateModified: "2026-10-26T18:30:00+02:00",
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
                "@type": "Restaurant",
                name: "BebeQ Restaurant Berlin",
                servesCuisine: "Mediterraner Holzkohlegrill, Steaks & Seafood",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Mühlenstraße 60",
                  addressLocality: "Berlin",
                  postalCode: "10243",
                  addressRegion: "Berlin",
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
                  name: "BebeQ Restaurant Berlin",
                  item: "https://speisely.de/magazin/community/bebeq-restaurant-berlin",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: BebeQArticlePage,
});

function BebeQArticlePage() {
  const { lang } = useI18n();
  const isDe = lang === "de";
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

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
              <span>←</span>
              <span>{isDe ? "Magazin" : "Magazine"}</span>
            </Link>
            <span className="text-[#E6B84A]/50 text-xs">/</span>
            <span className="text-xs uppercase tracking-wider text-[#F6F4EB]/80 truncate font-mono">
              {isDe ? "Community Feature · Berlin" : "Community Story · Berlin"}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={handleShare}
              className="text-xs px-2.5 py-1 rounded-full border border-[#E6B84A]/40 text-[#E6B84A] hover:bg-[#E6B84A]/10 transition flex items-center gap-1 font-sans"
              title={isDe ? "Link kopieren" : "Copy link"}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {copied ? (isDe ? "Kopiert!" : "Copied!") : isDe ? "Teilen" : "Share"}
              </span>
            </button>
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Hero Header Stage */}
      <section className="bg-gradient-to-b from-[#083822] to-[#0D442B] text-[#F6F4EB] pt-12 pb-16 px-4 border-b-2 border-[#E6B84A]/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E6B84A_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          {/* Top Category Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6B84A]/20 border border-[#E6B84A] text-[#E6B84A] text-xs font-mono font-bold tracking-widest uppercase mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isDe
                ? "Speisely Gastro-Spotlight · Berlin Friedrichshain"
                : "Speisely Gastro-Spotlight · Berlin Friedrichshain"}
            </span>
          </div>

          {/* Main Title (Serif Luxury) */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-extrabold tracking-tight text-[#F6F4EB] leading-[1.15] mb-6 drop-shadow-sm">
            {isDe ? (
              <>
                <span className="text-[#E6B84A]">BebeQ Restaurant</span> Berlin:{" "}
                <br className="hidden sm:inline" />
                Fisch, Fleisch & Feuer an der Spree-Promenade
              </>
            ) : (
              <>
                <span className="text-[#E6B84A]">BebeQ Restaurant</span> Berlin:{" "}
                <br className="hidden sm:inline" />
                Fish, Fire & Charcoal Craft by the Spree
              </>
            )}
          </h1>

          {/* Subtitle / Teaser */}
          <p className="text-base sm:text-xl text-[#F6F4EB]/90 font-sans max-w-2xl mx-auto leading-relaxed mb-8">
            {isDe
              ? "Zwischen East Side Gallery und dem Glitzern des Wassers entfaltet das BebeQ eine zeitlose Symbiose aus modernem Lounge-Design und archaischem Holzkohlegrill. Ein Ort, an dem saftige Steaks, goldbraun gegrillte Spieße und fangfrischer Fisch im Mittelpunkt stehen."
              : "Between the East Side Gallery and the gentle ripples of the river Spree, BebeQ balances sleek urban design with pure charcoal grill craftsmanship. Tender steaks, succulent skewers, and whole grilled fish take center stage."}
          </p>

          {/* Quick Facts Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-4 border-t border-[#E6B84A]/20 text-xs font-mono text-[#F6F4EB]/80">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#E6B84A]" />
              <span>Mühlenstraße 60, Berlin</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#E6B84A]" />
              <span>Oktober 2026</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-[#E6B84A]" />
              <span>{isDe ? "Community-Einsendung" : "Community Feature"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#E6B84A]">
              <Shield className="w-4 h-4" />
              <span>{isDe ? "Halal Fleisch-Auswahl" : "Halal Meat Selection"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Editorial Content Container */}
      <main className="max-w-4xl mx-auto px-4 py-12 sm:py-16 space-y-16">
        {/* Section 1: Atmosphere & Concept */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#7FA46B]">
              {isDe ? "Kapitel 01 // Das Ambiente" : "Chapter 01 // The Atmosphere"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#083822]">
              {isDe
                ? "Urbane Spree-Kultur trifft auf warmes Neon-Licht"
                : "Urban Riverside Soul Meets Warm Neon Glow"}
            </h2>
          </div>

          <p className="text-base sm:text-lg leading-relaxed text-[#173C32]/90 font-serif">
            {isDe ? (
              <>
                Friedrichshain pulsierte schon immer im Takt des Wandels. Doch direkt an der
                Mühlenstraße, wo sich historische Monumente und moderne Flussarchitektur begegnen,
                schafft das BebeQ einen erfrischenden Ruhepol mit lebendigem Charakter. Beim
                Betreten fällt sofort der markante Kontrast ins Auge: sanft leuchtende Neon-Akzente,
                tiefgründige Farbnuancen, gepolsterte Sitzbänke und die warme Textur von dunklem
                Holz verbinden sich zu einer stilvollen Lounge-Atmosphäre.
              </>
            ) : (
              <>
                Berlin Friedrichshain has always moved at the speed of modern culture. Right along
                Mühlenstraße, where historic landmarks meet modern riverside architecture, BebeQ
                offers a refined retreat with vibrant soul. Stepping inside reveals a striking
                dialogue between soft violet neon illumination, deep emerald tones, and handcrafted
                wooden elements that invite long, relaxed evenings.
              </>
            )}
          </p>

          {/* Luxury 4:3 Frame 1: Interior Neon */}
          <figure className="max-w-2xl mx-auto my-8">
            <div className="relative overflow-hidden rounded-3xl border-2 border-[#083822]/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100">
                <picture>
                  <source
                    srcSet="/magazin/bebeq-berlin/bebeq_interior_neon.webp?v=4"
                    type="image/webp"
                  />
                  <img
                    src="/magazin/bebeq-berlin/bebeq_interior_neon.jpg?v=4"
                    alt="BebeQ Restaurant Berlin stilvolles Interieur mit Neon-Akzenten"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="eager"
                    width={1200}
                    height={900}
                  />
                </picture>
              </div>
            </div>
            {/* Caption underneath, 100% unobstructed view */}
            <figcaption className="mt-3 text-center text-xs font-mono text-[#173C32]/70 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E6B84A]" />
              <span>
                {isDe
                  ? "Der stilvolle Gastraum: Warme Holztöne, bequeme Lederbänke und markante Neon-Elemente"
                  : "The refined dining room: Warm woods, comfortable leather booths, and glowing accents"}
              </span>
            </figcaption>
          </figure>

          <p className="text-base sm:text-lg leading-relaxed text-[#173C32]/90 font-serif">
            {isDe ? (
              <>
                Hier geht es nicht um überladene Effekthascherei, sondern um Wohlfühlatmosphäre. Ob
                für ein entspanntes Abendessen nach einem Spaziergang am Flussufer oder ein geselliges
                Treffen im Freundeskreis – die Raumaufteilung bietet sowohl intime Zweiertische als
                auch großzügige Tafeln für ausgedehnte Menürunden.
              </>
            ) : (
              <>
                The interior favors genuine comfort over noisy spectacle. Whether arriving after a
                sunset stroll along the river or gathering for an expansive family dinner, the space
                accommodates both intimate conversations and grand shared feasts with effortless
                ease.
              </>
            )}
          </p>
        </section>

        {/* Section 2: Charcoal Mastery & Meat Specialties */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#7FA46B]">
              {isDe ? "Kapitel 02 // Fleisch & Glut" : "Chapter 02 // Fire & Prime Cuts"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#083822]">
              {isDe
                ? "Das Spiel mit der Holzkohle: Steaks & Spieße auf Naturschiefer"
                : "The Charcoal Craft: Prime Steaks & Skewers on Slate"}
            </h2>
          </div>

          <p className="text-base sm:text-lg leading-relaxed text-[#173C32]/90 font-serif">
            {isDe ? (
              <>
                Das Herzstück der Küche ist der offene Holzkohlegrill. Die intensive Strahlungshitze
                schließt den aromatischen Fleischsaft sekundenschnell ein und verleiht jedem
                Schnitt jene charakteristische, feine Rauchnote, die moderne Gas- oder
                Elektrogrills niemals imitieren können.
              </>
            ) : (
              <>
                At the core of the kitchen stands the charcoal hearth. Intense, dry radiant heat
                seals the juices instantaneously, bestowing a distinct, natural smokiness that
                gas or electric grills could never reproduce.
              </>
            )}
          </p>

          {/* 2-Column Luxury 4:3 Gallery Grid for Meat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">
            {/* Dish 1: Beef Medallions on Slate */}
            <figure className="space-y-3">
              <div className="relative overflow-hidden rounded-3xl border-2 border-[#083822]/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100">
                  <picture>
                    <source
                      srcSet="/magazin/bebeq-berlin/bebeq_steak_slate.webp?v=4"
                      type="image/webp"
                    />
                    <img
                      src="/magazin/bebeq-berlin/bebeq_steak_slate.jpg?v=4"
                      alt="Zarte Rindermedaillons mit Kräuterbutter auf Naturschieferplatte"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                      width={1200}
                      height={900}
                    />
                  </picture>
                </div>
              </div>
              <figcaption className="text-center text-xs font-mono text-[#173C32]/70 flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E6B84A]" />
                <span>
                  {isDe
                    ? "Rindermedaillons mit Rauten-Grillbranding, Rosmarin & hausgemachter Kräuterbutter"
                    : "Beef medallions with crosshatch grill marks, rosemary & compound herb butter"}
                </span>
              </figcaption>
            </figure>

            {/* Dish 2: Chicken Skewers with Grilled Corn */}
            <figure className="space-y-3">
              <div className="relative overflow-hidden rounded-3xl border-2 border-[#083822]/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100">
                  <picture>
                    <source
                      srcSet="/magazin/bebeq-berlin/bebeq_chicken_skewers.webp?v=4"
                      type="image/webp"
                    />
                    <img
                      src="/magazin/bebeq-berlin/bebeq_chicken_skewers.jpg?v=4"
                      alt="Würzige Hähnchenspieße mit geröstetem Maiskolben und Grilltomate"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                      width={1200}
                      height={900}
                    />
                  </picture>
                </div>
              </div>
              <figcaption className="text-center text-xs font-mono text-[#173C32]/70 flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E6B84A]" />
                <span>
                  {isDe
                    ? "Saftig marinierte Hähnchenspieße, serviert mit gegrilltem Mais & pikanter Peperoni"
                    : "Juicy marinated chicken skewers paired with fire-roasted corn & charred peppers"}
                </span>
              </figcaption>
            </figure>
          </div>

          <p className="text-base sm:text-lg leading-relaxed text-[#173C32]/90 font-serif">
            {isDe ? (
              <>
                Besonders überzeugend: Die Rindermedaillons kommen mit messerscharfem Rauten-Muster
                vom Gusseisenrost auf einer massiven Schieferplatte an den Tisch. Gekrönt von
                schmelzender Kräuterbutter und einem Zweig frischem Rosmarin, verbindet sich der
                dezent karamellisierte Eigengeschmack mit samtiger Würze. Daneben begeistern die
                Hähnchenspieße durch ihre ausgewogene Marinade – außen goldbraun mit feinen
                Röstpunkten, im Kern bemerkenswert zart und saftig, harmonisch begleitet von
                süßlichem Maiskolben und geschmorter Peperoni.
              </>
            ) : (
              <>
                The beef medallions arrive resting on a solid dark slate tile, showing deep
                crosshatch grill markings. Topped with a slowly melting round of fragrant herb
                butter and fresh rosemary sprig, each bite balances caramelization with rich
                tenderness. Complementing the beef, the marinated chicken skewers showcase precise
                timing: lightly charred at the edges, succulent throughout, and framed by sweet
                roasted corn and flame-blistered chilies.
              </>
            )}
          </p>
        </section>

        {/* Section 3: The Fresh Catch / Mediterranean Seafood */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#7FA46B]">
              {isDe ? "Kapitel 03 // Die Frische des Meeres" : "Chapter 03 // Seafood Craft"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#083822]">
              {isDe
                ? "Ganze Dorade & zarter Lachs: Mediterrane Klarheit"
                : "Whole Sea Bream & Salmon: Mediterranean Clarity"}
            </h2>
          </div>

          <p className="text-base sm:text-lg leading-relaxed text-[#173C32]/90 font-serif">
            {isDe ? (
              <>
                Ein guter Grill beweist sein wahres Können beim Fisch. Wo rohes Fleisch Hitze
                verlangt, erfordert frischer Fisch feinfühliges Fingerspitzengefühl, damit das Fleisch
                weder austrocknet noch zerfällt. Im BebeQ spürt man die Verbundenheit zur
                mediterranen Küstenküche.
              </>
            ) : (
              <>
                True grilling mastery reveals itself when seafood touches the grates. While heavy
                cuts require intense searing, fish demands delicate timing and controlled heat to
                keep the delicate flakes moist and tender. BebeQ honors this coastal heritage with
                impressive respect for raw product quality.
              </>
            )}
          </p>

          {/* 2-Column Luxury 4:3 Gallery Grid for Seafood */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">
            {/* Dish 3: Whole Grilled Sea Bass / Dorade */}
            <figure className="space-y-3">
              <div className="relative overflow-hidden rounded-3xl border-2 border-[#083822]/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100">
                  <picture>
                    <source
                      srcSet="/magazin/bebeq-berlin/bebeq_grilled_seabass.webp?v=4"
                      type="image/webp"
                    />
                    <img
                      src="/magazin/bebeq-berlin/bebeq_grilled_seabass.jpg?v=4"
                      alt="Ganze gegrillte Dorade mit Röstkartoffeln und Zitronenschnitz"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                      width={1200}
                      height={900}
                    />
                  </picture>
                </div>
              </div>
              <figcaption className="text-center text-xs font-mono text-[#173C32]/70 flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E6B84A]" />
                <span>
                  {isDe
                    ? "Ganze gegrillte Dorade: Knusprige Haut, schneeweißes Fleisch & feine Röstkartoffeln"
                    : "Whole grilled sea bream: Crispy salted skin, tender white flakes & golden potatoes"}
                </span>
              </figcaption>
            </figure>

            {/* Dish 4: Salmon Fillet with Glaze */}
            <figure className="space-y-3">
              <div className="relative overflow-hidden rounded-3xl border-2 border-[#083822]/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100">
                  <picture>
                    <source
                      srcSet="/magazin/bebeq-berlin/bebeq_salmon_fillet.webp?v=4"
                      type="image/webp"
                    />
                    <img
                      src="/magazin/bebeq-berlin/bebeq_salmon_fillet.jpg?v=4"
                      alt="Glasiertes Lachsfilet vom Grill mit knackigem Salat und Tomate"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                      width={1200}
                      height={900}
                    />
                  </picture>
                </div>
              </div>
              <figcaption className="text-center text-xs font-mono text-[#173C32]/70 flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E6B84A]" />
                <span>
                  {isDe
                    ? "Auf den Punkt gegrilltes Lachsfilet mit aromatischer Balsamico-Reduktion & Wildkräutern"
                    : "Precision-seared salmon fillet accented with balsamic drizzle & crisp garden greens"}
                </span>
              </figcaption>
            </figure>
          </div>

          <p className="text-base sm:text-lg leading-relaxed text-[#173C32]/90 font-serif">
            {isDe ? (
              <>
                Die im Ganzen servierte Dorade überzeugt durch eine wunderbar knusprig gesalzene Haut,
                unter der das schneeweiße Fleisch herrlich saftig und aromatisch bleibt. Ein Spritzer
                frische Zitrone genügt, um das natürliche Aroma zur vollen Entfaltung zu bringen.
                Ebenso präzise gelingt das Lachsfilet: Die feine Kruste trägt subtile Röstspuren,
                während das Innere glasig-zart zergeht. Eine dezente Balsamico-Reduktion setzt
                einen fruchtig-säuerlichen Akzent zum reichhaltigen Omega-3-Profil des Fisches.
              </>
            ) : (
              <>
                Served whole, the sea bream features a crisp, sea-salted skin protecting glistening,
                delicate white meat underneath. A simple squeeze of fresh lemon brings out the pure
                coastal sweetness. Just as impressive is the salmon fillet: gently crusted on the
                griddle, yielding effortlessly to the fork with buttery softness, accented by a
                velvety balsamic reduction and a vibrant side salad.
              </>
            )}
          </p>
        </section>

        {/* Section 4: Gastro-Dossier & Facts */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#083822]/15 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#083822]/10">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#7FA46B]">
                {isDe ? "Gastro-Dossier & Fakten" : "Culinary Dossier & Info"}
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#083822]">
                BebeQ Restaurant Berlin
              </h3>
            </div>
            <a
              href="https://bebeq-berlin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#083822] text-[#F6F4EB] hover:bg-[#0D442B] transition font-sans text-xs font-semibold shadow-md"
            >
              <span>{isDe ? "Offizielle Restaurant-Webseite" : "Official Website"}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#E6B84A]" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {/* Standorte & Highlights */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#7FA46B] font-bold">
                {isDe ? "Lage & Küchenprofil" : "Location & Culinary Profile"}
              </h4>
              <ul className="space-y-2 text-[#173C32]/90 font-sans">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E6B84A] shrink-0 mt-0.5" />
                  <span>
                    <strong>{isDe ? "Adresse:" : "Address:"}</strong> Mühlenstraße 60, 10243 Berlin
                    (Friedrichshain, direkt an der Spree)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E6B84A] shrink-0 mt-0.5" />
                  <span>
                    <strong>{isDe ? "Spezialitäten:" : "Specialties:"}</strong> Rindermedaillons,
                    Lammkoteletts, Hähnchenspieße, Ganze Dorade & Lachs
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E6B84A] shrink-0 mt-0.5" />
                  <span>
                    <strong>{isDe ? "Zubereitung:" : "Preparation:"}</strong> Traditioneller
                    Holzkohlegrill mit offener Flamme & puristischer Marinade
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E6B84A] shrink-0 mt-0.5" />
                  <span>
                    <strong>{isDe ? "Ernährung:" : "Dietary:"}</strong> Halal Fleisch-Auswahl &
                    reichhaltiges Angebot an fangfrischem Meeresfisch
                  </span>
                </li>
              </ul>
            </div>

            {/* Praxis-Tipps & Details */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#7FA46B] font-bold">
                {isDe ? "Empfehlungen für den Besuch" : "Tips for Diners"}
              </h4>
              <ul className="space-y-2 text-[#173C32]/90 font-sans text-xs sm:text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#E6B84A] font-bold">•</span>
                  <span>
                    <strong>{isDe ? "Spree-Spaziergang:" : "River Promenade:"}</strong> Perfekt
                    kombinierbar mit einem Besuch der benachbarten East Side Gallery oder der
                    Oberbaumbrücke.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E6B84A] font-bold">•</span>
                  <span>
                    <strong>{isDe ? "Teilen am Tisch:" : "Table Sharing:"}</strong> Die Schieferplatten
                    und gemischten Grillplatten eignen sich ideal zum gemeinsamen Probieren im
                    Family-Style.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E6B84A] font-bold">•</span>
                  <span>
                    <strong>{isDe ? "Reservierung:" : "Reservations:"}</strong> Besonders an
                    Wochenendabenden empfiehlt sich eine Vorab-Reservierung für die begehrten
                    Lounge-Bänke.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Callout Box: Speisely Community Empfehlung */}
          <div className="bg-[#F6F4EB] rounded-2xl p-4 sm:p-5 border border-[#083822]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#083822] text-[#E6B84A] flex items-center justify-center font-bold text-lg shrink-0">
                ★
              </div>
              <div>
                <h5 className="font-serif font-bold text-[#083822]">
                  {isDe ? "Speisely Community Empfehlung" : "Speisely Community Recommendation"}
                </h5>
                <p className="text-xs text-[#173C32]/70 font-sans">
                  {isDe
                    ? "Ehrliches Holzkohlefeuer, erstklassiges Fleisch, frischer Fisch und entspannte Berliner Fluss-Kulisse."
                    : "Authentic charcoal heat, prime meats, fresh fish, and a relaxed Berlin riverside setting."}
                </p>
              </div>
            </div>
            <Link
              to="/restaurants"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#083822] hover:text-[#E6B84A] transition whitespace-nowrap"
            >
              <span>{isDe ? "Weitere Restaurants entdecken" : "Explore more spots"}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Speisely Community Disclosure (Editorial Endnote) */}
        <aside className="p-6 rounded-2xl bg-white border border-[#173C32]/10 text-xs sm:text-sm text-[#173C32]/75 space-y-2 shadow-sm font-sans">
          <div className="flex items-center gap-2 font-bold text-[#083822]">
            <Info className="w-4 h-4 text-[#E6B84A] shrink-0" />
            <span>{isDe ? "Speisely Community-Transparenz" : "Speisely Community Disclosure"}</span>
          </div>
          <p className="leading-relaxed">
            {isDe
              ? "Dieser redaktionelle Bericht basiert auf einer Community-Einsendung und visuellen Impressionen vor Ort in Berlin-Friedrichshain. Alle Speisen wurden regulär bestellt und bezahlt. Es handelt sich um ein unabhängiges redaktionelles Feature im Speisely Magazin ohne Einflussnahme Dritter."
              : "This editorial article reflects an independent community feature and visual impressions gathered on-site in Berlin Friedrichshain. All dishes were ordered and paid for independently. This article is published autonomously within Speisely Magazine without commercial sponsorship."}
          </p>
        </aside>

        {/* Claim / Partner Bridge for BebeQ */}
        <RestaurantClaimBridge restaurantName="BebeQ Restaurant Berlin" city="Berlin" />

        {/* About Speisely Section Footer */}
        <AboutSpeiselySection />
      </main>
    </article>
  );
}
