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
} from "lucide-react";
import { useEffect, useState } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/i18n/I18nProvider";
import { RestaurantClaimBridge } from "@/components/RestaurantClaimBridge";

export const Route = createFileRoute("/magazin/community/seydioglu-baklava-burger")({
  head: () => ({
    meta: [
      {
        title: "Seydioğlu Baklava Burger: Pistazien-Lava & Eis",
      },
      {
        name: "description",
        content:
          "Der virale Baklava Burger im Community-Test: Knuspriger Gaziantep-Teig, Maraş-Eis, heiße Pistazien-Lava & herzhafte Çiğköfte im Rhein-Main-Gebiet.",
      },
      {
        name: "keywords",
        content:
          "Seydioglu Baklava Burger, Baklava Burger Frankfurt, Seydioglu Darmstadt, Gaziantep Baklava Rhein-Main, Pistazien Lava, Maras Dondurma, Midye Baklava, Sobiyet, Cigkofte Durum, Seydioglu Wiesbaden Mannheim Hanau Offenbach",
      },
      {
        name: "geo.region",
        content: "DE-HE",
      },
      {
        name: "geo.placename",
        content: "Frankfurt am Main, Darmstadt, Rhein-Main",
      },
      {
        name: "geo.position",
        content: "50.1109;8.6821",
      },
      {
        name: "ICBM",
        content: "50.1109, 8.6821",
      },
      {
        property: "og:title",
        content: "Seydioğlu Baklava Burger: Knuspriger Antep-Teig trifft flüssige Pistazien-Lava",
      },
      {
        property: "og:description",
        content:
          "Der virale Baklava Burger im ehrlichen Speisely Community-Report: Wie Seydioğlu im Rhein-Main traditionelle Gaziantep-Konditorkunst mit modernem Genuss verbindet.",
      },
      {
        property: "og:image",
        content: "https://speisely.de/magazin/seydioglu/seydioglu_baklava_burger_hero.webp?v=2",
      },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "de_DE" },
      {
        property: "og:url",
        content: "https://speisely.de/magazin/community/seydioglu-baklava-burger",
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
        href: "https://speisely.de/magazin/community/seydioglu-baklava-burger",
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
                name: "Seydioğlu Baklava",
                url: "https://seydioglu-baklava.de",
                priceRange: "€€",
                servesCuisine:
                  "Traditionelle Gaziantep Baklava, Baklava Burger, Künefe, Patisserie & Çiğköfte",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Tituskorso 2 (Nordwestzentrum) & Zeil",
                  addressLocality: "Frankfurt am Main",
                  postalCode: "60439",
                  addressRegion: "Hessen",
                  addressCountry: "DE",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 50.1585,
                  longitude: 8.6366,
                },
              },
            },
            {
              "@type": "Article",
              "@id": "https://speisely.de/magazin/community/seydioglu-baklava-burger#article",
              isPartOf: {
                "@id": "https://speisely.de/#website",
              },
              headline: "Seydioğlu Baklava Burger: Gaziantep-Handwerk & Heiße Pistazien-Lava",
              description:
                "Echtes Gaziantep-Erbe im Rhein-Main-Gebiet: Wie der virale Baklava Burger mit zähem Maraş-Eis, Midye Baklava und herzhaftem Çiğköfte-Dürüm die Gäste begeistert.",
              image: "https://speisely.de/magazin/seydioglu/seydioglu_baklava_burger_hero.webp?v=2",
              datePublished: "2026-10-21T09:30:00+02:00",
              dateModified: "2026-10-21T10:15:00+02:00",
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
                name: "Seydioğlu Baklava",
                servesCuisine: "Traditionelle Gaziantep Baklava & Türkische Desserts",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Frankfurt am Main",
                  addressRegion: "Hessen",
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
                  name: "Seydioğlu Baklava Burger",
                  item: "https://speisely.de/magazin/community/seydioglu-baklava-burger",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: SeydiogluArticlePage,
});

function SeydiogluArticlePage() {
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
              {isDe ? "Community Feature" : "Community Story"}
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
                ? "Speisely Food Spotlight · Rhein-Main"
                : "Speisely Food Spotlight · Rhine-Main"}
            </span>
          </div>

          {/* Main Title (Serif Luxury) */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-extrabold tracking-tight text-[#F6F4EB] leading-[1.14] mb-6 drop-shadow-sm">
            {isDe ? (
              <>
                Der <span className="text-[#E6B84A]">Baklava Burger</span> von Seydioğlu:{" "}
                <br className="hidden sm:inline" />
                Wenn knuspriger Antep-Teig auf heiße Pistazien-Lava trifft
              </>
            ) : (
              <>
                The <span className="text-[#E6B84A]">Baklava Burger</span> by Seydioğlu:{" "}
                <br className="hidden sm:inline" />
                When Crisp Antep Pastry Meets Hot Pistachio Lava
              </>
            )}
          </h1>

          {/* Subtitle / Teaser */}
          <p className="text-base sm:text-xl text-[#F6F4EB]/90 font-sans max-w-2xl mx-auto leading-relaxed mb-8">
            {isDe
              ? "Ein virales Highlight im Rhein-Main-Gebiet: Wie feiner Gaziantep-Filoteig, eiskaltes Maraş-Eis und ein satter Strahl warmer Pistaziensauce traditionelle Konditorkunst modern interpretieren."
              : "A viral highlight across the Rhine-Main region: How delicate Gaziantep phyllo, cold Maraş ice cream, and warm pistachio sauce bring a fresh dynamic to classic pastry craft."}
          </p>

          {/* Quick Facts Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-4 border-t border-[#E6B84A]/20 text-xs font-mono text-[#F6F4EB]/80">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#E6B84A]" />
              <span>Frankfurt · Darmstadt · Rhein-Main</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#E6B84A]" />
              <span>Oktober 2026</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-[#E6B84A]" />
              <span>{isDe ? "Community-Einsendung" : "Community Submission"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#E6B84A]">
              <Shield className="w-4 h-4" />
              <span>{isDe ? "100% Halal" : "100% Halal"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Editorial Content Container */}
      <main className="max-w-4xl mx-auto px-4 py-12 sm:py-16 space-y-16">
        {/* Intro Disclaimer / Transparency Pill */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#083822]/10 shadow-sm flex items-start gap-3.5">
          <Info className="w-5 h-5 text-[#E6B84A] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-[#173C32]/85 leading-relaxed font-sans space-y-1">
            <p>
              <strong className="text-[#083822] font-semibold">
                {isDe ? "Speisely Community-Transparenz:" : "Speisely Community Disclosure:"}
              </strong>{" "}
              {isDe
                ? "Dieser Erfahrungsbericht basiert auf einem Vor-Ort-Besuch unseres Community-Mitglieds im Rhein-Main-Gebiet. Die visuellen Eindrücke verbinden echte Schnappschüsse direkt vom Gast-Tisch mit detailreichen Aufnahmen aus den Filialen und Social-Media-Kanälen des Hauses, um das Handwerk greifbar zu machen. Alle Speisen wurden selbst bezahlt."
                : "This feature reflects an on-site dining experience shared by a Speisely community member in Rhine-Main. The visual presentation pairs genuine table snapshots from the diner with high-definition showcases from the restaurant's channels to illustrate the craftsmanship clearly. All dishes were independently self-paid."}
            </p>
          </div>
        </div>

        {/* Section 1: The Baklava Burger Sensory Experience */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#7FA46B]">
              {isDe ? "Kapitel 01 // Das Burger-Konzept" : "Chapter 01 // The Burger Concept"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#083822]">
              {isDe
                ? "Wenn das Besteck auf knusprigen Teig trifft"
                : "When the Knife Strikes Crisp Pastry"}
            </h2>
          </div>

          <p className="text-base sm:text-lg leading-relaxed text-[#173C32]/90 font-serif">
            {isDe ? (
              <>
                Man bestellt ihn nicht beiläufig, man erlebt ihn als kleines Ritual am Tisch.
                Serviert wird ein dreieckiges Stück frisch gebackene Havuç-Dilimi-Baklava,
                horizontal aufgeschnitten wie ein handwerklicher Brioche-Bun. Dazwischen liegt eine
                feste, zähe Schicht echtes Maraş-Dondurma – traditionelles, mit Salep gebundenes
                Eis, das seine kühle, elastische Textur behält, ohne sofort zu zerfließen.
              </>
            ) : (
              <>
                It is not an ordinary dessert; it arrives as an interactive tableside moment. In the
                center sits a golden wedge of fresh Havuç-Dilimi baklava, halved like a brioche bun.
                Inside rests a dense portion of genuine Maraş dondurma—traditional ice cream bound
                with orchid salep that stays firm and chewable without melting prematurely.
              </>
            )}
          </p>

          {/* Luxury 4:3 Frame 1: Burger Layers */}
          <figure className="max-w-2xl mx-auto my-8">
            <div className="relative overflow-hidden rounded-3xl border-2 border-[#083822]/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100">
                <img
                  src="/magazin/seydioglu/seydioglu_baklava_burger_hero.webp?v=2"
                  alt="Seydioğlu Baklava Burger Schichten mit Maraş Eis"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="eager"
                />
                <div className="absolute top-3 left-3 bg-[#083822]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#E6B84A]/30 text-white text-xs font-mono font-medium flex items-center gap-1.5 shadow-md">
                  <span>🍔</span>
                  <span>
                    {isDe ? "Havuç-Dilimi Bun · Maraş Patty" : "Havuç-Dilimi Bun · Maraş Patty"}
                  </span>
                </div>
              </div>
              <figcaption className="mt-3 text-center text-xs text-[#173C32]/70 font-sans italic">
                {isDe
                  ? "Der Seydioğlu Baklava Burger vor dem Überguss: Butterknuspriger Teig, Maraş-Dondurma und Antep-Pistazien."
                  : "The Seydioğlu Baklava Burger prior to pouring: crisp butter pastry, Maraş dondurma, and Antep pistachios."}
              </figcaption>
            </div>
          </figure>

          <p className="text-base sm:text-lg leading-relaxed text-[#173C32]/90 font-serif">
            {isDe ? (
              <>
                Anschließend folgt der Überguss: Warme, sämige Pistaziensauce, frisch zubereitet aus
                gerösteten Antep-Kernen, fließt in einem ruhigen Strahl über die goldene Teigkruste.
                Der Heiß-Kalt-Kontrast ist sofort präsent: Die warme, nussige Sauce umhüllt das
                kalte Eis. Sobald die Gabel den Teig teilt, hört man das typische <em>Hışırtı</em>
                -Knistern – das feine Knacken zarter Teigschichten, die von geklärtem Butterschmalz
                durchzogen sind.
              </>
            ) : (
              <>
                Then comes the pour: Warm, velvety pistachio sauce, made from roasted Antep kernels,
                is poured directly over the golden pastry. The hot-and-cold contrast is immediate as
                the warm nut cream coats the chilled ice cream. With each forkful comes the
                characteristic <em>Hışırtı</em> crackle—the delicate crunch of thin pastry sheets
                baked with pure clarified butter.
              </>
            )}
          </p>

          {/* Luxury 4:3 Frame 2: The Pour Moment */}
          <figure className="max-w-2xl mx-auto my-8">
            <div className="relative overflow-hidden rounded-3xl border-2 border-[#083822]/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100">
                <img
                  src="/magazin/seydioglu/seydioglu_pistachio_lava_pour.webp?v=2"
                  alt="Heißer Pistazien Lava Pour über den Baklava Burger"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="eager"
                />
                <div className="absolute top-3 left-3 bg-[#083822]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#E6B84A]/30 text-white text-xs font-mono font-medium flex items-center gap-1.5 shadow-md">
                  <span>🔥</span>
                  <span>
                    {isDe ? "Warme Pistazien-Lava · Live Pour" : "Warm Pistachio Lava · Live Pour"}
                  </span>
                </div>
              </div>
              <figcaption className="mt-3 text-center text-xs text-[#173C32]/70 font-sans italic">
                {isDe
                  ? "Der Servier-Moment: Warme Pistaziensauce trifft auf das kühle Maraş-Eis im Inneren."
                  : "The table pour: Warm pistachio sauce coats the cool Maraş ice cream within."}
              </figcaption>
            </div>
          </figure>
        </section>

        {/* Section 2: Gaziantep Heritage & The Classic Specialties */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#7FA46B]">
              {isDe
                ? "Kapitel 02 // Traditionelle Spezialitäten"
                : "Chapter 02 // Traditional Specialties"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#083822]">
              {isDe
                ? "Gaziantep-Backkunst: Mehr als ein moderner Trend"
                : "Gaziantep Pastry: More Than a Trend"}
            </h2>
          </div>

          <p className="text-base sm:text-lg leading-relaxed text-[#173C32]/90 font-serif">
            {isDe ? (
              <>
                Neben dem modernen Burger basiert das Sortiment von Seydioğlu auf den klassischen
                Rezepturen Gazianteps. Die Pistazien stammen aus traditionsreichen Anbaugebieten wie
                Gaziantep, Urfa und Adıyaman, wo sie zur Erntezeit für ihr sattes Grün und
                intensives Aroma geschätzt werden.
              </>
            ) : (
              <>
                Beyond the modern burger concept, Seydioğlu’s core repertoire rests firmly on
                classical Gaziantep heritage. Pistachios are sourced from renowned growing regions
                such as Gaziantep, Urfa, and Adıyaman, selected for their vibrant green hue and deep
                nutty character.
              </>
            )}
          </p>

          <p className="text-base sm:text-lg leading-relaxed text-[#173C32]/90 font-serif">
            {isDe ? (
              <>
                Der Teig wird auf kühlen Arbeitsflächen mit langen Rollhölzern (Oklava) von Hand
                hauchdünn ausgezogen, mit feinem Butterschmalz bestrichen und im Ofen gebacken, bis
                er goldgelb aufbricht. Ein abgestimmter Zuckersirup mit einer Spur Zitrone rundet
                das Gebäck ab, ohne die herbe Note der Nüsse zu überdecken.
              </>
            ) : (
              <>
                Phyllo dough is hand-stretched on cool surfaces using thin rolling pins (Oklava),
                brushed with clarified butter, and baked until crisp and fragrant. A balanced sugar
                syrup with a gentle citrus touch finishes each tray without overwhelming the natural
                nut flavors.
              </>
            )}
          </p>

          {/* 2-Column Luxury Gallery: Midye Baklava & Fıstık Sarma */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            {/* Midye Baklava */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-[#083822]/15 bg-white p-3 shadow-lg transition-all duration-300 hover:border-[#E6B84A] hover:shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100">
                <img
                  src="/magazin/seydioglu/seydioglu_midye_baklava_tray.webp?v=2"
                  alt="Ofenfrisches Blech Midye Baklava mit Antep Pistazien"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="eager"
                />
                <div className="absolute top-2.5 left-2.5 bg-[#083822]/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#E6B84A]/30 text-white text-[11px] font-mono font-medium">
                  🐚 Midye Baklava · Mit Grieß-Kaymak
                </div>
              </div>
              <div className="p-2">
                <h4 className="font-serif font-bold text-[#083822] text-base">
                  {isDe ? "Midye Baklava (Muschelform)" : "Midye Baklava (Shell Shape)"}
                </h4>
                <p className="text-xs text-[#173C32]/80 mt-1 font-sans leading-relaxed">
                  {isDe
                    ? "In charakteristischer Muschelform gefaltet, gefüllt mit cremigem Grieß-Kaymak und grob gemahlenen Antep-Pistazien."
                    : "Folded into distinctive shell ridges, filled with smooth semolina kaymak cream and ground Antep pistachios."}
                </p>
              </div>
            </div>

            {/* Fıstık Sarma */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-[#083822]/15 bg-white p-3 shadow-lg transition-all duration-300 hover:border-[#E6B84A] hover:shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100">
                <img
                  src="/magazin/seydioglu/seydioglu_fistik_sarma_rolls.webp?v=2"
                  alt="Edle Fıstık Sarma Pistazienrollen auf Silberteller"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="eager"
                />
                <div className="absolute top-2.5 left-2.5 bg-[#083822]/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#E6B84A]/30 text-white text-[11px] font-mono font-medium">
                  🌿 Fıstık Sarma · Antep-Pistazienrolle
                </div>
              </div>
              <div className="p-2">
                <h4 className="font-serif font-bold text-[#083822] text-base">
                  {isDe ? "Fıstık Sarma (Pistazien-Rollen)" : "Fıstık Sarma (Emerald Rolls)"}
                </h4>
                <p className="text-xs text-[#173C32]/80 mt-1 font-sans leading-relaxed">
                  {isDe
                    ? "Besonders intensiv im Geschmack: Fast ausschließlich reine Pistazienmasse in hauchzarter Hülle, serviert auf traditioneller Platte."
                    : "Intensely nutty: Pure emerald pistachio paste rolled in an ultra-fine pastry sheet, presented on traditional tableware."}
                </p>
              </div>
            </div>
          </div>

          {/* 2-Column Luxury Gallery: Şöbiyet & Hot Künefe */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            {/* Şöbiyet */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-[#083822]/15 bg-white p-3 shadow-lg transition-all duration-300 hover:border-[#E6B84A] hover:shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100">
                <img
                  src="/magazin/seydioglu/seydioglu_sobiyet_havuc_plate.webp?v=2"
                  alt="Seydioğlu Şöbiyet und Havuç Dilimi Servierteller"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="eager"
                />
                <div className="absolute top-2.5 left-2.5 bg-[#083822]/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#E6B84A]/30 text-white text-[11px] font-mono font-medium">
                  🍮 Şöbiyet · Grieß-Sahne Füllung
                </div>
              </div>
              <div className="p-2">
                <h4 className="font-serif font-bold text-[#083822] text-base">
                  {isDe ? "Şöbiyet & Havuç Dilimi" : "Şöbiyet & Havuç Dilimi"}
                </h4>
                <p className="text-xs text-[#173C32]/80 mt-1 font-sans leading-relaxed">
                  {isDe
                    ? "Dreieckige Teigtaschen mit gekochtem Milch-Grieß-Pudding (İrmik Kaymağı), serviert mit Pistazienstaub."
                    : "Triangular pastry pockets filled with soft milk-semolina cream, dusted with fresh ground pistachios."}
                </p>
              </div>
            </div>

            {/* Künefe */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-[#083822]/15 bg-white p-3 shadow-lg transition-all duration-300 hover:border-[#E6B84A] hover:shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100">
                <img
                  src="/magazin/seydioglu/seydioglu_hot_kunefe_platter.webp?v=2"
                  alt="Heißes Pfannen-Künefe mit Fädenziehendem Antakya Käse"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="eager"
                />
                <div className="absolute top-2.5 left-2.5 bg-[#083822]/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#E6B84A]/30 text-white text-[11px] font-mono font-medium">
                  🧀 Pfannen-Künefe · Ziehender Käse
                </div>
              </div>
              <div className="p-2">
                <h4 className="font-serif font-bold text-[#083822] text-base">
                  {isDe ? "Heißes Pfannen-Künefe" : "Hot Pan Künefe"}
                </h4>
                <p className="text-xs text-[#173C32]/80 mt-1 font-sans leading-relaxed">
                  {isDe
                    ? "Frisch gebackenes Kadayıf-Engelshaar mit mildem Schmelzkäse und heißem Zuckersirup in der Kupferpfanne."
                    : "Crisp shredded pastry threads baked with mild melting cheese and sweet syrup in a traditional pan."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: The Savory Counterbalance (Çiğköfte Dürüm Rolls) */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#7FA46B]">
              {isDe
                ? "Kapitel 03 // Der herzhafte Kontrapunkt"
                : "Chapter 03 // The Savory Balance"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#083822]">
              {isDe
                ? "Der Gaumen-Ausgleich: Çiğköfte Dürüm Platter"
                : "The Palate Balance: Çiğköfte Dürüm Platter"}
            </h2>
          </div>

          <p className="text-base sm:text-lg leading-relaxed text-[#173C32]/90 font-serif">
            {isDe ? (
              <>
                Wer reichhaltige Desserts genießt, schätzt oft eine herzhafte Erfrischung als
                Kontrast. Bei Seydioğlu greifen Gäste dafür neben ungesüßtem Schwarztee (Çay) gern
                zum <strong>Çiğköfte Dürüm Platter</strong>, der als mundgerecht geschnittene Rollen
                auf einem gehämmerten Metallteller serviert wird.
              </>
            ) : (
              <>
                Enjoying rich desserts naturally calls for a savory, refreshing counterbalance.
                Alongside classic unsweetened Turkish black tea (Çay), diners often choose the{" "}
                <strong>Çiğköfte Dürüm Platter</strong>, served as sliced bite-sized rolls on an
                engraved metal tray.
              </>
            )}
          </p>

          {/* Luxury 4:3 Frame: Çiğköfte Roll Platter */}
          <figure className="max-w-2xl mx-auto my-8">
            <div className="relative overflow-hidden rounded-3xl border-2 border-[#083822]/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100">
                <img
                  src="/magazin/seydioglu/seydioglu_cigkofte_roll_platter.webp?v=2"
                  alt="Seydioğlu Çiğköfte Dürüm Rolle mit Salat und Granatapfelsirup"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="eager"
                />
                <div className="absolute top-3 left-3 bg-[#083822]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#E6B84A]/30 text-white text-xs font-mono font-medium flex items-center gap-1.5 shadow-md">
                  <span>🌿</span>
                  <span>
                    {isDe
                      ? "Çiğköfte Dürüm · Würziger Bulgur & Frische"
                      : "Çiğköfte Dürüm · Spiced Bulgur & Herbs"}
                  </span>
                </div>
              </div>
              <figcaption className="mt-3 text-center text-xs text-[#173C32]/70 font-sans italic">
                {isDe
                  ? "Direkt am Tisch serviert: Mundgerechte Çiğköfte-Rollen mit knackigem Salat, Essiggurken, Zitrone und Granatapfelsirup (Nar Ekşisi)."
                  : "Served at the table: Sliced çiğköfte rolls paired with crisp salad, pickles, fresh lemon, and tart pomegranate molasses."}
              </figcaption>
            </div>
          </figure>

          <p className="text-base sm:text-lg leading-relaxed text-[#173C32]/90 font-serif">
            {isDe ? (
              <>
                Der fein geknetete Bulgur, gewürzt mit traditionellen Kräutern und roter Paprika,
                wird zusammen mit knackigem Salat stramm in dünnes Fladenbrot gerollt und in
                mundgerechte Scheiben portioniert. Zusammen mit eingelegten Peperoni, frischer
                Zitrone und herb-süßem Granatapfelsirup (Nar Ekşisi) bietet die Kombination eine
                willkommene frische Schärfe, die den Gaumen belebt.
              </>
            ) : (
              <>
                Finely kneaded bulgur, seasoned with traditional spices and red pepper paste, is
                rolled in flatbread with crisp lettuce and sliced into bite-sized rounds.
                Accompanied by pickled chilis, fresh lemon, and tangy pomegranate molasses (Nar
                Ekşisi), the savory dish provides a clean, bright contrast to the sweets.
              </>
            )}
          </p>
        </section>

        {/* Section 4: Gastro-Dossier Factsheet & Locations */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#083822]/15 shadow-xl space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#083822]/10 pb-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#E6B84A]">
                {isDe ? "Gastro-Dossier" : "Gastro Dossier"}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#083822]">
                Seydioğlu Baklava · Standorte im Rhein-Main-Gebiet
              </h3>
            </div>
            <a
              href="https://seydioglu-baklava.de/?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#083822] text-[#F6F4EB] hover:bg-[#0D442B] transition font-sans text-xs font-semibold shadow-md"
            >
              <span>{isDe ? "Offizielle Webseite" : "Official Website"}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#E6B84A]" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {/* Standorte Liste */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#7FA46B] font-bold">
                {isDe ? "Filialnetz & Region" : "Branch Network & Region"}
              </h4>
              <ul className="space-y-2 text-[#173C32]/90 font-sans">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E6B84A] shrink-0 mt-0.5" />
                  <span>
                    <strong>Frankfurt am Main:</strong> Nordwest-Zentrum (Tituskorso) & Zeil
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E6B84A] shrink-0 mt-0.5" />
                  <span>
                    <strong>Darmstadt:</strong> Zentraler Standort
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E6B84A] shrink-0 mt-0.5" />
                  <span>
                    <strong>Wiesbaden & Hanau:</strong> Frischetheke & Café
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E6B84A] shrink-0 mt-0.5" />
                  <span>
                    <strong>Offenbach & Mannheim:</strong> Café & Mitnahme
                  </span>
                </li>
              </ul>
            </div>

            {/* Praxis-Tipps & Details */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#7FA46B] font-bold">
                {isDe ? "Tipps für den Besuch" : "Tips for Diners"}
              </h4>
              <ul className="space-y-2 text-[#173C32]/90 font-sans text-xs sm:text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#E6B84A] font-bold">•</span>
                  <span>
                    <strong>Frisch serviert:</strong> Den Burger am besten direkt nach dem Überguss
                    probieren, solange der Heiß-Kalt-Kontrast besonders ausgeprägt ist.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E6B84A] font-bold">•</span>
                  <span>
                    <strong>Tee-Begleitung:</strong> Traditioneller türkischer Schwarztee harmoniert
                    ideal mit der Süße des Gebäcks.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E6B84A] font-bold">•</span>
                  <span>
                    <strong>Mitnahme & Lagerung:</strong> Frische Baklava am besten bei kühler
                    Zimmertemperatur aufbewahren, um die Knusprigkeit der Teigschichten zu erhalten.
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
                    ? "Handwerkliche Antep-Tradition, aromatische Pistaziensauce und abwechslungsreiche Vielfalt im Rhein-Main-Gebiet."
                    : "Authentic Antep heritage, aromatic pistachio sauce, and rich sweet and savory variety in Rhine-Main."}
                </p>
              </div>
            </div>
            <Link
              to="/restaurants"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#083822] hover:text-[#E6B84A] transition whitespace-nowrap"
            >
              <span>{isDe ? "Weitere Orte entdecken" : "Explore more spots"}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Claim / Partner Bridge for Seydioglu */}
        <RestaurantClaimBridge restaurantName="Seydioğlu Baklava" city="Frankfurt am Main" />

        {/* About Speisely Section Footer */}
        <AboutSpeiselySection />
      </main>
    </article>
  );
}
