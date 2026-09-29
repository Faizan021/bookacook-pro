import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  Shield,
  Users,
  Utensils,
  Mail,
  Instagram,
  Sparkles,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { SiteShell } from "@/components/SiteShell";
import { AboutSpeiselySection } from "@/components/AboutSpeiselySection";
import { trackEvent } from "@/utils/posthog";

export const Route = createFileRoute("/magazin/community/chicken-krush-prag")({
  head: () => ({
    meta: [
      { title: "Community Story: Chicken Krush Prag | Speisely" },
      {
        name: "description",
        content:
          "Knuspriges Korean Fried Chicken, Snow Flake Seasoning, Yangnyeom Glaze und Rose Tteokbokki in Prag: Ein Community-Erlebnis bei Chicken Krush in Prag-Nové Město.",
      },
      {
        name: "keywords",
        content:
          "Chicken Krush Prag, Korean Fried Chicken Prague, Yangnyeom Chicken, Snow Flake Chicken, Rose Tteokbokki Prag, Chimaek Prag, Korean Food Nové Město, Speisely Community, Speisely Magazin",
      },
      { name: "geo.region", content: "CZ-10" },
      { name: "geo.placename", content: "Prag-Nové Město" },
      { name: "geo.position", content: "50.0782;14.4231" },
      { name: "ICBM", content: "50.0782, 14.4231" },
      {
        property: "og:title",
        content:
          "Community Story: Chicken Krush Prag — Wo Crunch auf K-Food-Tradition trifft | Speisely",
      },
      {
        property: "og:description",
        content:
          "Ein Speisely-Community-Besuch bei Chicken Krush in Prag: Knuspriges Korean Fried Chicken, cremiges Rose Tteokbokki, Snow-Flake-Käsepulver und gemeinsame Sharing-Platten.",
      },
      {
        property: "og:image",
        content: "https://speisely.de/magazin/chicken-krush-prag/chicken-krush-01.jpg",
      },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "de_DE" },
      {
        property: "og:url",
        content: "https://speisely.de/magazin/community/chicken-krush-prag",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://speisely.de/magazin/community/chicken-krush-prag",
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
              "@id": "https://speisely.de/magazin/community/chicken-krush-prag#article",
              isPartOf: {
                "@type": "WebPage",
                "@id": "https://speisely.de/magazin/community/chicken-krush-prag",
                url: "https://speisely.de/magazin/community/chicken-krush-prag",
                name: "Community Story: Chicken Krush Prag | Speisely",
              },
              headline:
                "Goldener Crunch, Yangnyeom-Glanz und Rose Tteokbokki in den Gassen von Prag",
              description:
                "Ein Speisely-Community-Besuch bei Chicken Krush in Prag-Nové Město: Knusprig frittiertes Hähnchen, traditionelle Saucen, digitale Tisch-Bestellung und echtes Chimaek-Feeling.",
              image: "https://speisely.de/magazin/chicken-krush-prag/chicken-krush-01.jpg",
              datePublished: "2026-09-29",
              dateModified: "2026-09-29",
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
                name: "Chicken Krush",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Příčná 1632/9",
                  addressLocality: "Praha 1 - Nové Město",
                  postalCode: "11000",
                  addressRegion: "Hlavní město Praha",
                  addressCountry: "CZ",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 50.0782,
                  longitude: 14.4231,
                },
                url: "https://chickenkrush.cz",
                servesCuisine: "Korean",
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
                  name: "Chicken Krush Prag",
                  item: "https://speisely.de/magazin/community/chicken-krush-prag",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: ChickenKrushCommunityPage,
});

function ChickenKrushCommunityPage() {
  const { lang } = useI18n();
  const isDe = lang === "de";

  const emailSubject = isDe
    ? "Mein Erlebnis für die Speisely Community"
    : "My experience for the Speisely Community";

  const emailBody = isDe
    ? `Hallo Speisely,
Ich möchte ein Erlebnis mit der Speisely Community teilen.

Restaurant, Caterer, Event oder Ort:
Stadt:
Datum:
Meine Geschichte:
Was habe ich bestellt, entdeckt oder erlebt?
Foto-/Videocredit:
War etwas kostenlos, vergünstigt, eingeladen oder gesponsert?

Ich füge meine eigenen Fotos oder Videos dieser E-Mail bei.`
    : `Hello Speisely,
I would like to share an experience with the Speisely Community.

Restaurant, caterer, event or location:
City:
Date:
My story:
What did I order, discover or experience?
Photo/video credit:
Was anything free, discounted, invited or sponsored?

I will attach my own photos or videos to this email.`;

  const mailtoHref = `mailto:info@speisely.de?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  const instagramHref = "https://www.instagram.com/speisely/";

  const menuUrl =
    "https://wolt.com/en/cze/prague/restaurant/chicken-krush-prg?utm_source=speisely&utm_medium=referral&utm_campaign=chicken_krush_prag_community_visit";
  const websiteUrl =
    "https://chickenkrush.cz/?utm_source=speisely&utm_medium=referral&utm_campaign=chicken_krush_prag_community_visit";

  const handleMenuClick = () => {
    trackEvent("restaurant_menu_click", {
      restaurant_name: "Chicken Krush Prague",
      article_slug: "chicken-krush-prag",
      destination: "wolt_menu",
    });
  };

  const handleWebsiteClick = () => {
    trackEvent("restaurant_website_click", {
      restaurant_name: "Chicken Krush Prague",
      article_slug: "chicken-krush-prag",
      destination: "official_website",
    });
  };

  return (
    <SiteShell>
      <div className="bg-[#FAF7F0] text-forest min-h-screen">
        {/* Breadcrumb */}
        <div className="border-b border-forest/10 bg-white/60 backdrop-blur-md sticky top-16 z-30">
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
                  <Link to="/magazin" className="hover:text-forest transition">
                    {isDe ? "Magazin" : "Magazine"}
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
                  Chicken Krush Prag
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
        <header className="mx-auto max-w-4xl px-4 pt-10 pb-8 sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#DDEEE3] text-forest px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider mb-5 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-[#b28a3c]" aria-hidden="true" />
            <span>{isDe ? "Aus der Speisely Community" : "From the Speisely Community"}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-[44px] font-bold text-forest leading-[1.15] tracking-tight">
            {isDe
              ? "Goldener Crunch, Yangnyeom-Glanz und Rose Tteokbokki in Prag"
              : "Golden Crunch, Yangnyeom Glaze and Rose Tteokbokki in Prague"}
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-forest/80 leading-relaxed font-medium">
            {isDe
              ? "Ein Community-Mitglied hat auf seiner Prag-Reise Chicken Krush in der Příčná-Straße besucht: Knusprig paniertes Hähnchen, süß-würzige Saucen, cremige Reiskuchen und ein digitaler Tisch-Service, der zum gemeinsamen Teilen einlädt."
              : "A Speisely community member stopped by Chicken Krush on Příčná Street during a trip to Prague: crackling fried chicken, sweet-savory glazes, velvety rice cakes and tableside digital ordering built for sharing."}
          </p>

          {/* Info Card */}
          <div className="mt-8 surface-card p-5 sm:p-6 rounded-3xl border border-forest/10 bg-white grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-[#b28a3c] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Ort" : "Location"}
                </span>
                <strong className="font-semibold text-forest">Chicken Krush</strong>
                <span className="block text-forest/70 text-xs">
                  Příčná 1632/9, 110 00 Praha 1 – Nové Město
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-4 w-4 text-[#7FA46B] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Beitragstyp" : "Story Type"}
                </span>
                <strong className="font-semibold text-forest">
                  {isDe ? "Community Story" : "Community Story"}
                </strong>
                <span className="block text-forest/70 text-xs">
                  {isDe ? "Aus der Speisely Community" : "From the Speisely Community"}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-4 w-4 text-[#b28a3c] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Fotocredit" : "Photo Credit"}
                </span>
                <strong className="font-semibold text-forest">Speisely Community</strong>
                <span className="block text-forest/70 text-xs">
                  {isDe ? "Redaktionell aufbereitet" : "Editorially prepared"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Article Body */}
        <article className="mx-auto max-w-4xl px-4 sm:px-6 pb-20">
          <div className="prose prose-lg max-w-none text-forest/85 space-y-8 leading-relaxed font-normal">
            {/* Photo 1 (Hero: Table setup with digital tablet, Snow Flake & Seoul Fried Chicken) */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md">
                <img
                  src="/magazin/chicken-krush-prag/chicken-krush-01.jpg"
                  alt={
                    isDe
                      ? "Tisch-Setup bei Chicken Krush in Prag mit digitalem Bestellbildschirm, Snow Flake Chicken, Seoul Fried Chicken und Pommes"
                      : "Table arrangement at Chicken Krush in Prague with digital order screen, Snow Flake chicken, Seoul Fried chicken and seasoned fries"
                  }
                  className="w-full h-auto object-cover max-h-[720px]"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Holzbretter mit Snow Flake Boneless Chicken, Seoul Fried Chicken Thighs, Pommes und eigenem Bestellterminal am Tisch."
                    : "Wooden serving boards with Snow Flake boneless chicken, Seoul fried chicken thighs, fries, and tableside ordering screen."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <p>
              {isDe
                ? "Wer durch die kopfsteingepflasterten Straßen der Prager Neustadt (Nové Město) spaziert, erwartet auf den ersten Blick traditionelle böhmische Wirtshäuser mit Gulasch und Knödeln. Doch nur wenige Gehminuten vom Karlsplatz entfernt, in der ruhigeren Příčná-Straße, leuchtet ein rundes Neonschild mit einem Hähnchen-Emblem aus einer Backsteinwand: The Chicken Krush."
                : "A stroll through the historic cobblestone streets of Prague’s Nové Město might lead you to expect traditional Bohemian taverns with hearty goulash and dumplings. Yet just off Charles Square, along quieter Příčná Street, a circular neon sign mounted on an exposed brick wall glows warmly: The Chicken Krush."}
            </p>

            <p>
              {isDe
                ? "Hier verbindet sich moderne K-Food-Kultur mit einem entspannten Restaurant-Konzept: An jedem Tisch ist ein eigener digitaler Touchscreen angebracht, über den Gäste ihre Lieblingssaucen, Portionsgrößen und Beilagen auf Tschechisch, Englisch oder Koreanisch zusammenstellen können."
                : "The venue blends contemporary Korean food culture with an effortless dining concept: every table is fitted with its own digital touch terminal, allowing guests to customize glazes, portion sizes, and sides in Czech, English, or Korean."}
            </p>

            {/* Photo 2 (Neon Logo) */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md max-w-md mx-auto">
                <img
                  src="/magazin/chicken-krush-prag/chicken-krush-02.png"
                  alt={
                    isDe
                      ? "Beleuchtetes THE CHICKEN KRUSH Neonschild auf rustikaler Ziegelwand in Prag"
                      : "Illuminated THE CHICKEN KRUSH neon wall sign on exposed brick in Prague"
                  }
                  className="w-full h-auto object-cover"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Urbane Atmosphäre in Prag-Nové Město: Das Leuchtschild von Chicken Krush."
                    : "Urban interior details in Prague-Nové Město: The illuminated Chicken Krush emblem."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe
                ? "Vom „Slow Fried“-Prinzip zum perfekten Crunch"
                : "The Art of Slow Frying and Crisp Textures"}
            </h2>

            <p>
              {isDe
                ? "Auf den servierten Holzbrettern fällt sofort ein kleines Detail ins Auge: Auf kleinen Schildern im Hähnchen prangt das Motto „Slow Fried. Pomalu smažené“ sowie „Taste Respect (치킨크러시)“. Korean Fried Chicken unterscheidet sich grundlegend von herkömmlichem Frittierhähnchen durch eine besonders feine Stärkepanade und präzise abgestimmte Frittierzeiten."
                : "Looking across the wooden boards, a small detail catches the eye: little flags reading “Slow Fried. Pomalu smažené” and “Taste Respect (치킨크러시)”. Authentic Korean fried chicken distinguishes itself through a fine, delicate starch batter and carefully timed frying, creating a thin, shatteringly crisp crust."}
            </p>

            {/* Photo 3 (Taste Respect close-up) */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md">
                <img
                  src="/magazin/chicken-krush-prag/chicken-krush-03.png"
                  alt={
                    isDe
                      ? "Nahaufnahme des knusprigen Seoul Fried Chicken mit Flagge 'taste respect 치킨크러시'"
                      : "Close-up of golden crispy Seoul Fried Chicken with 'taste respect 치킨크러시' flag"
                  }
                  className="w-full h-auto object-cover max-h-[640px]"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Goldgelbe Kruste mit deutlicher Textur: Bone-in Chicken Thigh mit Flagge „taste respect“."
                    : "Golden, ridged crust: Bone-in chicken thigh with signature 'taste respect' banner."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <p>
              {isDe
                ? "Das Ergebnis ist eine goldgelbe, rissige Kruste, die das Fleisch im Inneren saftig hält und auch dann nicht weich wird, wenn reichhaltige Glasuren aufgetragen werden."
                : "The technique seals in natural moisture while preserving that vital crackle, even when dressed in thick, glossy glazes."}
            </p>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe ? "Die Geschmackswelten auf dem Tisch" : "Flavor Profiles on the Table"}
            </h2>

            <p>
              {isDe
                ? "Die geteilten Fotos aus der Community zeigen die bemerkenswerte Vielfalt, die das Menü bietet:"
                : "The photographs shared by our community member highlight the diverse spread available on the menu:"}
            </p>

            <ul className="list-disc pl-6 space-y-3 font-normal text-forest/85">
              <li>
                <strong>Snow Flake Boneless:</strong>{" "}
                {isDe
                  ? "Zarte Hähnchenstücke ohne Knochen, bestäubt mit einem fein-süßlichen Käsegewürzpulver. Die samtige Textur des Pulvers erzeugt einen spannenden Kontrast zur heißen, krossen Panade."
                  : "Tender boneless chicken dusted in a velvety sweet-savory cheese seasoning powder, offering a delicate snowy finish and playful textural contrast."}
              </li>
              <li>
                <strong>Seoul Fried Chicken:</strong>{" "}
                {isDe
                  ? "Klassische Hähnchenkeulen (Thighs) mit goldbrauner Panade, gewürzt mit einer dezenten Senf-Pfeffer-Note für puren, unverfälschten Crunch."
                  : "Classic bone-in chicken thighs with a craggy golden coating, seasoned with gentle mustard and pepper notes for unadulterated crunch."}
              </li>
              <li>
                <strong>Yangnyeom Chicken:</strong>{" "}
                {isDe
                  ? "Der koreanische Klassiker: Glänzend überzogen mit einer klebrigen Sauce aus Gochujang (fermentierte Chilipaste), Knoblauch, Sojasauce und Honig, garniert mit gerösteten Mandelsplittern."
                  : "The quintessential Korean favorite: coated in a sticky-glossy glaze of gochujang chili paste, garlic, soy, and honey, sprinkled with toasted almond slivers."}
              </li>
            </ul>

            {/* Photo 4 (Yangnyeom Chicken with almond flakes) */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md">
                <img
                  src="/magazin/chicken-krush-prag/chicken-krush-04.png"
                  alt={
                    isDe
                      ? "Glänzendes Yangnyeom Chicken mit Mandelsplittern und Flagge 'SLOW FRIED. POMALU SMAŽENÉ'"
                      : "Glossy Yangnyeom chicken with sliced almonds and 'SLOW FRIED. POMALU SMAŽENÉ' flag"
                  }
                  className="w-full h-auto object-cover max-h-[640px]"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Kräftig rot glasiert und mit Mandeln verfeinert: Yangnyeom Chicken mit Käse-Pommes und Beilagensalat."
                    : "Deeply glazed in sweet-spicy gochujang with almond slivers: Yangnyeom chicken with seasoned fries and slaw."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe
                ? "Rose Tteokbokki: Cremige Schärfe in der Edelstahlpfanne"
                : "Rose Tteokbokki: Creamy Heat in a Sizzling Pan"}
            </h2>

            <p>
              {isDe
                ? "Ein besonderes Highlight der servierten Tafel ist die glänzende Edelstahlpfanne mit Rose Tteokbokki. Tteokbokki – zylinderförmige, elastische Reiskuchen – gehören zu den beliebtesten Street-Food-Gerichten Koreas. In der modernen 'Rose'-Variante wird die scharfe Gochujang-Sauce mit Sahne oder Milch verfeinert, wodurch eine samtige, lachsfarbene Sauce entsteht."
                : "A standout center on the dining table is the stainless-steel skillet of Rose Tteokbokki. Tteokbokki—chewy, cylindrical rice cakes—are beloved throughout Korean street food stalls. In the contemporary 'Rose' interpretation, fiery gochujang chili paste is tempered with rich cream, creating a luscious, velvety sauce."}
            </p>

            <p>
              {isDe
                ? "Zusammen mit kleinen Würstchen und einer leichten Kräutergarnitur bildet das Gericht die ideale Ergänzung zu den frittierten Hähnchengerichten."
                : "Tossed with mini sausages and fresh herbs, it offers a chewy, warming companion to the crisp chicken platters."}
            </p>

            {/* Photo 5 (Full table spread with Rose Tteokbokki) */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md">
                <img
                  src="/magazin/chicken-krush-prag/chicken-krush-05.png"
                  alt={
                    isDe
                      ? "Große Tafel bei Chicken Krush Prag mit Rose Tteokbokki, Yangnyeom Chicken, Pommes und Dips zum Teilen"
                      : "Shared table feast at Chicken Krush Prague with Rose Tteokbokki, Yangnyeom chicken, seasoned fries, and dipping sauces"
                  }
                  className="w-full h-auto object-cover max-h-[680px]"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Der ganze Tisch im Überblick: Rose Tteokbokki in der Pfanne, knuspriges Chicken, Dips und Beilagensalat."
                    : "The full shared table: pan of Rose Tteokbokki, glazed chicken, seasoned fries, dips, and fresh side salad."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe
                ? "Beilagen, Dips und das Erlebnis des Teilens"
                : "Sides, Dips and the Community Experience"}
            </h2>

            <p>
              {isDe
                ? "Ergänzt werden die Hauptgerichte durch Beilagen wie Pommes frites mit Käse- oder Honig-Butter-Gewürz (Honey Butter Seasoning), frischen Weißkrautsalat sowie verschiedene Dipsaucen wie Creamy Onion oder Ranch in kleinen Edelstahl-Kasserollen. Auch erfrischende koreanische Getränke wie Bongbong (Traubensaft mit Fruchtstücken) oder Galbae (Birnensaft) finden sich auf der Karte."
                : "The feast is completed by french fries dusted in cheese seasoning or honey-butter spice, crisp coleslaw, and house-made dipping sauces like Creamy Onion or Ranch served in stainless steel mini-pots. Traditional Korean chilled refreshments like Bongbong (grape juice with whole grapes) and Galbae (pear juice) complete the setup."}
            </p>

            <p className="font-medium text-forest text-lg">
              {isDe
                ? "Ein lebendiger Food-Moment aus Prag, der zeigt, wie internationale Gastronomie und gemeinsame Esskultur Menschen an einem Tisch zusammenbringen."
                : "A vibrant food snapshot from Prague that demonstrates how global food traditions and shared meals connect travelers across borders."}
            </p>

            {/* Restaurant Info & Action Card */}
            <div className="surface-card p-6 sm:p-8 rounded-3xl border border-forest/15 bg-white my-10 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#b28a3c] mb-2">
                <Utensils className="h-4 w-4" aria-hidden="true" />
                <span>{isDe ? "Restaurant-Informationen" : "Restaurant Details"}</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-forest mb-2">
                Chicken Krush Prag
              </h3>
              <p className="text-sm text-forest/75 mb-4">
                Příčná 1632/9, 110 00 Praha 1 – Nové Město, Tschechien
              </p>

              <div className="flex flex-wrap gap-2 text-xs text-forest/70 mb-6">
                <span className="bg-forest/5 px-3 py-1 rounded-full border border-forest/10 font-medium">
                  {isDe ? "Korean Fried Chicken" : "Korean Fried Chicken"}
                </span>
                <span className="bg-forest/5 px-3 py-1 rounded-full border border-forest/10 font-medium">
                  {isDe ? "Yangnyeom & Snow Flake" : "Yangnyeom & Snow Flake"}
                </span>
                <span className="bg-forest/5 px-3 py-1 rounded-full border border-forest/10 font-medium">
                  {isDe ? "Rose Tteokbokki" : "Rose Tteokbokki"}
                </span>
                <span className="bg-forest/5 px-3 py-1 rounded-full border border-forest/10 font-medium">
                  {isDe ? "Digitale Tisch-Bestellung" : "Digital Table Ordering"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={menuUrl}
                  target="_blank"
                  rel="noopener"
                  onClick={handleMenuClick}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-forest text-[oklch(0.97_0.02_92)] px-6 py-3 text-xs sm:text-sm font-bold shadow-md hover:bg-forest/90 transition-all hover:gap-2.5 cursor-pointer"
                >
                  <BookOpen className="h-4 w-4 text-[#f2d896]" aria-hidden="true" />
                  <span>{isDe ? "Speisekarte & Bestellen" : "Explore Menu & Order"}</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
                </a>

                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener"
                  onClick={handleWebsiteClick}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-cream text-forest px-6 py-3 text-xs sm:text-sm font-semibold border border-forest/15 hover:bg-[#eadfce] transition-colors cursor-pointer"
                >
                  <span>{isDe ? "Website besuchen" : "Visit Website"}</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Editorial Disclosure Box */}
            <div className="rounded-2xl bg-cream p-5 text-xs text-forest/75 border border-forest/15 space-y-2 mt-8">
              <div className="flex items-center gap-2 font-bold text-forest text-xs">
                <Shield className="h-4 w-4 text-[#7FA46B]" aria-hidden="true" />
                <span>{isDe ? "Transparenzhinweis" : "Transparency Notice"}</span>
              </div>
              <p className="leading-relaxed">
                {isDe
                  ? "Dieser redaktionelle Beitrag basiert auf einem Besuch und Fotos aus der Speisely Community während einer Reise nach Prag. Speisely war nicht selbst vor Ort. Der Beitrag gibt die visuellen Eindrücke der geteilten Fotos und Speisekarteninformationen wieder und stellt keine Sternebewertung oder offizielle Restaurantbewertung dar. Fotocredit: Speisely Community."
                  : "This editorial story is based on a visit and photographs shared by a member of the Speisely Community during a trip to Prague. Speisely was not present at the restaurant. It reflects the visual impressions of the shared photographs and public menu information and does not constitute a star rating or official restaurant review. Photo credit: Speisely Community."}
              </p>
            </div>
          </div>

          <AboutSpeiselySection />
        </article>

        {/* CTA Banner: Share Your Own Food Story */}
        <section className="border-t border-forest/10 pt-16 pb-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="rounded-3xl bg-forest text-[oklch(0.97_0.02_92)] p-8 sm:p-10 text-center relative overflow-hidden shadow-xl">
              <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-[#f2d896] backdrop-blur-xs">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{isDe ? "Speisely Community" : "Speisely Community"}</span>
                </div>
                <h2 className="font-display text-2xl sm:text-4xl font-bold">
                  {isDe
                    ? "Hast du auch einen besonderen Food-Moment erlebt?"
                    : "Had a memorable food experience of your own?"}
                </h2>
                <p className="text-sm sm:text-base opacity-85 leading-relaxed">
                  {isDe
                    ? "Teile deine Restaurantbesuche, Catering-Erlebnisse oder Food-Entdeckungen mit der Speisely Community. Schick uns deine Geschichte und Fotos."
                    : "Share your restaurant visits, catering experiences or food discoveries with the Speisely Community. Send us your story and photos."}
                </p>
                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={mailtoHref}
                    className="inline-flex items-center gap-2 rounded-full bg-[#b28a3c] text-white px-6 py-3 text-xs sm:text-sm font-bold shadow-md hover:bg-[#9a7633] transition"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    <span>{isDe ? "Per E-Mail teilen" : "Share via Email"}</span>
                  </a>
                  <a
                    href={instagramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white/15 text-white px-6 py-3 text-xs sm:text-sm font-semibold hover:bg-white/25 transition backdrop-blur-xs"
                  >
                    <Instagram className="h-4 w-4" aria-hidden="true" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
