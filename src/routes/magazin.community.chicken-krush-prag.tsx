import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Shield, Users, Mail, Instagram, Sparkles } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { SiteShell } from "@/components/SiteShell";
import { AboutSpeiselySection } from "@/components/AboutSpeiselySection";

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
        content: "https://speisely.de/magazin/chicken-krush-prag/chicken-krush-real-01.webp",
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
              image: "https://speisely.de/magazin/chicken-krush-prag/chicken-krush-real-01.webp",
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
            {/* Photo 1 — Exterior facade */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md">
                <img
                  src="/magazin/chicken-krush-prag/ck-new-01.webp"
                  alt={
                    isDe
                      ? "Fassade von Chicken Krush in Prag mit leuchtendem goldenem Schriftzug über dem Eingang"
                      : "Exterior of Chicken Krush Prague with glowing golden sign above the entrance"
                  }
                  className="w-full h-auto object-cover max-h-[720px]"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Der goldene Schriftzug an der Fassade: Chicken Krush in der Přičná-Straße, Prag-Nové Město."
                    : "The golden sign on the facade: Chicken Krush on Přičná Street, Prague-Nové Město."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <p>
              {isDe
                ? "Unser Community-Mitglied hatte keinen großen Plan für den Abend — nur Hunger und eine Notiz auf dem Handy: Příčná-Straße, Nové Město. Der goldene Schriftzug über dem Eingang leuchtete warm in die Abendgasse. Dahinter: ein stimmungsvoller Raum, volle Holzbretter und der unverwechselbare Geruch von frisch frittiertem Hähnchen."
                : "There was no big plan for that evening — just hunger and a note on the phone: Příčná Street, Nové Město. The golden sign above the entrance glowed warmly into the evening alley. Inside: an atmospheric dining room, loaded wooden boards, and the unmistakable scent of freshly fried chicken."}
            </p>

            <p>
              {isDe
                ? "An jedem Tisch wartet ein eigener Touchscreen — auf Tschechisch, Englisch oder Koreanisch. Man bestellt ganz unkompliziert selbst, lehnt sich zurück und genießt die Atmosphäre. Das Essen kommt schnell und heiß auf dem Brett."
                : "Every table has its own touchscreen — in Czech, English, or Korean. You order at your own pace, lean back, and soak in the atmosphere. The food arrives fast and piping hot on the wooden board."}
            </p>

            {/* Photo 2 — Iconic circular neon logo on brick wall */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md max-w-md mx-auto">
                <img
                  src="/magazin/chicken-krush-prag/ck-new-03.webp"
                  alt={
                    isDe
                      ? "Beleuchtetes THE CHICKEN KRUSH Neonschild auf rustikaler Ziegelwand in Prag"
                      : "Illuminated THE CHICKEN KRUSH neon sign on exposed brick wall in Prague"
                  }
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Das ikonische beleuchtete Markenzeichen von Chicken Krush auf der Backsteinwand im Innenraum."
                    : "The iconic illuminated Chicken Krush emblem on the exposed brick wall inside."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe ? "Der erste Crunch am Tisch" : "The First Crunch at the Table"}
            </h2>

            <p>
              {isDe
                ? "Auf jedem servierten Holzbrett steckt eine kleine Flagge: Slow Fried und Taste Respect. Die Kruste ist hauchdünn, extrem kross und bricht beim ersten Hineinbeißen mit einem deutlichen Knacken. Innen dampft das Fleisch saftig und zart — genau die Balance, die gutes Korean Fried Chicken ausmacht."
                : "Every wooden board arrives with a small flag: Slow Fried and Taste Respect. The batter is paper-thin, shatteringly crisp and cracks with a clean snap at the first bite. Inside, the chicken steams tender and juicy — the perfect balance that defines great Korean Fried Chicken."}
            </p>

            {/* Photo 3 — Classic fried Born in Seoul chicken */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md">
                <img
                  src="/magazin/chicken-krush-prag/ck-new-05.webp"
                  alt={
                    isDe
                      ? "Klassisches knuspriges Korean Fried Chicken mit Born in Seoul Flagge, Pommes, Coleslaw und Dips auf Holzbrett"
                      : "Classic crispy Korean fried chicken with Born in Seoul flag, fries, coleslaw and dipping sauces on wooden board"
                  }
                  className="w-full h-auto object-cover max-h-[640px]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Born in Seoul: Goldgelb frittiertes Korean Fried Chicken auf dem Holzbrett mit Pommes, Coleslaw und Dips."
                    : "Born in Seoul: Golden Korean Fried Chicken on the board with fries, fresh coleslaw and dipping sauces."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe ? "Süße Schärfe und samtiger Kontrast" : "Sweet Heat and Snowy Contrast"}
            </h2>

            <p>
              {isDe
                ? "Beim Teilen am Tisch greift man automatisch von einem Brett zum nächsten: Das tiefrot glänzende Yangnyeom Chicken ist dick eingekocht mit Gochujang, Honig und Knoblauch, bestreut mit gerösteten Mandelsplittern — klebrig, scharf und süß zugleich. Eine Kombination, die jeden Bissen zu einem Erlebnis macht. Die Dipsaucen und der frische Krautsalat sorgen für die perfekte Balance."
                : "Sharing across the table means constantly switching flavours: deeply glazed Yangnyeom chicken simmered with gochujang, garlic, and honey, topped with toasted almond slivers for a sticky sweet-heat kick. A combination that makes every bite an experience. The dipping sauces and fresh coleslaw provide the perfect balance."}
            </p>

            {/* Photo 4 — Yangnyeom Chicken with Taste Respect flag */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md">
                <img
                  src="/magazin/chicken-krush-prag/ck-new-02.webp"
                  alt={
                    isDe
                      ? "Yangnyeom Chicken mit Taste Respect Flagge, Pommes und Dips auf Chicken Krush Serviertablett"
                      : "Yangnyeom chicken with Taste Respect flag, fries and dipping sauces on Chicken Krush serving tray"
                  }
                  className="w-full h-auto object-cover max-h-[640px]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Kräftig rot glasiertes Yangnyeom Chicken mit dem Signature Taste Respect Fähnchen, Pommes und Dips."
                    : "Deeply glazed Yangnyeom chicken with the signature Taste Respect banner, fries and dipping sauces."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe ? "Das große Sharing-Brett in der Mitte" : "The Big Sharing Board in the Middle"}
            </h2>

            <p>
              {isDe
                ? "Das Highlight auf dem Tisch war das große Sharing-Brett mit gleich mehreren Sorten: weißglasierten Boneless Bites, klassischem fried Chicken, goldgelben Pommes, frischem Coleslaw und einer Reihe von Dipsaucen. Zusammen entsteht genau diese ungezwungene Chimaek-Stimmung, die man aus den Straßen von Seoul kennt — jetzt mitten in Prag-Nové Město."
                : "The standout of the table was the large sharing board with multiple varieties: white-glazed boneless bites, classic fried chicken, golden fries, fresh coleslaw, and a row of dipping sauces. Together, it perfectly captures that relaxed Chimaek atmosphere from the streets of Seoul — right in the heart of Prague's Nové Město."}
            </p>

            {/* Photo 5 — Full feast sharing board */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md">
                <img
                  src="/magazin/chicken-krush-prag/ck-new-04.webp"
                  alt={
                    isDe
                      ? "Grosses Sharing-Brett bei Chicken Krush Prag mit weißglasierten Boneless Bites, Yangnyeom Chicken, Pommes, Coleslaw, Burger und Dips"
                      : "Large sharing board at Chicken Krush Prague with white-glazed boneless bites, Yangnyeom chicken, fries, coleslaw, burger and dipping sauces"
                  }
                  className="w-full h-auto object-cover max-h-[680px]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Das große Sharing-Brett: Boneless Bites mit weißer Glasur, Yangnyeom Chicken, Pommes, Burger, Coleslaw und Dips."
                    : "The big sharing board: white-glazed boneless bites, Yangnyeom chicken, fries, burger, coleslaw and dips."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <p className="font-medium text-forest text-lg pt-2">
              {isDe
                ? "Ein lebendiger, unkomplizierter Abend in Prag: Reinkommen, per Touchscreen bestellen, gemeinsam Holzbretter teilen und authentisches Korean Fried Chicken in Bestform genießen — mitten in der Prager Neustadt."
                : "A vibrant, effortless evening in Prague: walk in, order via touchscreen, share the wooden platters together, and enjoy authentic Korean Fried Chicken at its very best — right in the heart of Nové Město."}
            </p>

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
