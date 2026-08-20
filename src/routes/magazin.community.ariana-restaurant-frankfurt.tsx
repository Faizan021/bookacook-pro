import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Shield, Users, Utensils, Mail, Instagram, Sparkles } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/magazin/community/ariana-restaurant-frankfurt")({
  head: () => ({
    meta: [
      {
        title: "Community Story: Qabili Palau bei Ariana in Frankfurt | Speisely",
      },
      {
        name: "description",
        content:
          "Das Geheimnis unter dem Reisberg: Warum liegt das Fleisch beim Qabili Palau eigentlich unter dem Reis? Eine Food Story aus der Speisely Community bei Ariana in Frankfurt.",
      },
      {
        name: "keywords",
        content:
          "Ariana Restaurant Frankfurt, Qabili Frankfurt, Afghanisches Restaurant Frankfurt, Münchener Straße Frankfurt, Kabuli Pulao Frankfurt, Afghanische Küche Frankfurt, Speisely Community, Speisely Magazin",
      },
      {
        name: "geo.region",
        content: "DE-HE",
      },
      {
        name: "geo.placename",
        content: "Frankfurt am Main",
      },
      {
        name: "geo.position",
        content: "50.1075;8.6695",
      },
      {
        name: "ICBM",
        content: "50.1075, 8.6695",
      },
      {
        property: "og:title",
        content: "Community Story: Qabili Palau bei Ariana in Frankfurt | Speisely",
      },
      {
        property: "og:description",
        content:
          "Das Geheimnis unter dem Reisberg: Warum liegt das Fleisch beim Qabili Palau eigentlich unter dem Reis? Eine Food Story aus der Speisely Community bei Ariana in Frankfurt.",
      },
      {
        property: "og:image",
        content: "https://speisely.de/magazin/ariana-frankfurt/qabili-palau.jpg",
      },
      { property: "og:type", content: "article" },
      {
        property: "og:locale",
        content: "de_DE",
      },
      {
        property: "og:url",
        content: "https://speisely.de/magazin/community/ariana-restaurant-frankfurt",
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
        href: "https://speisely.de/magazin/community/ariana-restaurant-frankfurt",
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
              "@id": "https://speisely.de/magazin/community/ariana-restaurant-frankfurt#article",
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": "https://speisely.de/magazin/community/ariana-restaurant-frankfurt",
              },
              headline: "Das Geheimnis unter dem Reisberg: Qabili Palau bei Ariana in Frankfurt",
              description:
                "Warum liegt das Fleisch beim afghanischen Qabili Palau eigentlich unter dem Reis? Ein kulinarischer Einblick aus der Speisely Community bei Ariana in Frankfurt.",
              image: {
                "@type": "ImageObject",
                url: "https://speisely.de/magazin/ariana-frankfurt/qabili-palau.jpg",
                width: 1200,
                height: 675,
              },
              datePublished: "2026-08-20",
              dateModified: "2026-08-20",
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
                name: "Ariana Restaurant",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Münchener Straße 48",
                  addressLocality: "Frankfurt am Main",
                  postalCode: "60329",
                  addressRegion: "Hessen",
                  addressCountry: "DE",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 50.1075,
                  longitude: 8.6695,
                },
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
                  name: "Ariana Frankfurt",
                  item: "https://speisely.de/magazin/community/ariana-restaurant-frankfurt",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: ArianaFrankfurtCommunityArticle,
});

function ArianaFrankfurtCommunityArticle() {
  const { lang } = useI18n();
  const isDe = lang === "de";

  const emailSubject = isDe
    ? "Mein Erlebnis für die Speisely Community"
    : "My experience for the Speisely Community";

  const emailBody = isDe
    ? `Hallo Speisely,\nich möchte ein Erlebnis mit der Speisely Community teilen.\n\nRestaurant, Caterer, Event oder Ort:\nStadt:\nDatum:\nMeine Geschichte:\nWas habe ich bestellt, entdeckt oder erlebt?\nFoto-/Videocredit:\nWar etwas kostenlos, vergünstigt, eingeladen oder gesponsert?\n\nIch füge meine eigenen Fotos oder Videos dieser E-Mail bei.`
    : `Hello Speisely,\nI would like to share an experience with the Speisely Community.\n\nRestaurant, caterer, event or location:\nCity:\nDate:\nMy story:\nWhat did I order, discover or experience?\nPhoto/video credit:\nWas anything free, discounted, invited or sponsored?\n\nI will attach my own photos or videos to this email.`;

  const mailtoHref = `mailto:info@speisely.de?subject=${encodeURIComponent(
    emailSubject,
  )}&body=${encodeURIComponent(emailBody)}`;
  const instagramHref = "https://www.instagram.com/speisely/";

  return (
    <SiteShell>
      <div className="bg-[#FAF7F0] text-forest min-h-screen">
        {/* Article Breadcrumbs Header */}
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
                  Ariana Frankfurt
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

        {/* Hero Section */}
        <header className="mx-auto max-w-4xl px-4 pt-10 pb-8 sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#DDEEE3] text-forest px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider mb-5 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-[#b28a3c]" aria-hidden="true" />
            <span>{isDe ? "Aus der Speisely Community" : "From the Speisely Community"}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-[44px] font-bold text-forest leading-[1.15] tracking-tight">
            {isDe
              ? "Das Geheimnis unter dem Reisberg: Qabili Palau bei Ariana in Frankfurt"
              : "The Secret Beneath the Mountain of Rice: Qabili Palau at Ariana in Frankfurt"}
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-forest/80 leading-relaxed font-medium">
            {isDe
              ? "Beim Qabili Palau liegt das Entscheidende nicht unbedingt oben."
              : "With Qabili Palau, the most important part isn't necessarily on top."}
          </p>

          {/* Quick Context Card */}
          <div className="mt-8 surface-card p-5 sm:p-6 rounded-3xl border border-forest/10 bg-white grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-[#b28a3c] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Ort" : "Location"}
                </span>
                <strong className="font-semibold text-forest">Ariana Restaurant</strong>
                <span className="block text-forest/70 text-xs">
                  Münchener Str. 48, Frankfurt am Main
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="h-4 w-4 text-[#7FA46B] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Besuchsart" : "Visit Type"}
                </span>
                <strong className="font-semibold text-forest">
                  {isDe ? "Selbst bezahlt" : "Self-paid"}
                </strong>
                <span className="block text-forest/70 text-xs">
                  {isDe ? "11,90 € (Onlinepreis)" : "€11.90 (online menu)"}
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

        {/* Main Article Content */}
        <article className="mx-auto max-w-4xl px-4 sm:px-6 pb-20">
          <div className="prose prose-lg max-w-none text-forest/85 space-y-8 leading-relaxed font-normal">
            <p>
              {isDe
                ? "Als ein Mitglied der Speisely Community das Gericht bei Ariana in Frankfurt bestellte, kam zunächst ein großzügiger Berg aus langkörnigem Basmatireis auf den Tisch. Darüber: goldorange Möhrenstreifen, dunkle Rosinen und Gewürze. Das Fleisch war erst auf den zweiten Blick zu erkennen – verborgen unter dem Reis."
                : "When a member of the Speisely Community ordered the dish at Ariana in Frankfurt, what arrived at the table was a generous mountain of long-grain basmati rice. Across the top: golden-orange carrot ribbons, dark raisins, and warm spices. The meat was only visible upon second glance—tucked away beneath the rice."}
            </p>

            <p className="font-medium text-forest text-lg">
              {isDe
                ? "Genau dort gehört es bei diesem afghanischen Gericht häufig hin."
                : "In this traditional Afghan dish, that is exactly where it belongs."}
            </p>

            {/* Featured Photo: Qabili Palau */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md">
                <img
                  src="/magazin/ariana-frankfurt/qabili-palau.jpg"
                  alt={
                    isDe
                      ? "Qabili Palau mit langkörnigem Basmatireis, karamellisierten Möhrenstreifen und Rosinen bei Ariana in Frankfurt"
                      : "Qabili Palau with long-grain basmati rice, caramelized carrots and raisins at Ariana in Frankfurt"
                  }
                  className="w-full h-auto object-cover max-h-[600px]"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Traditionelles Qabili Palau: Basmatireis mit Möhrenstreifen, Rosinen und verdecktem Fleisch."
                    : "Traditional Qabili Palau: Basmati rice with carrot julienne, raisins and concealed braised meat."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe
                ? "Warum liegt das Fleisch unter dem Reis?"
                : "Why is the meat placed under the rice?"}
            </h2>

            <p>
              {isDe
                ? "Qabili Palau wird traditionell mit Reis, Fleisch, Möhren und Rosinen zubereitet. Das Fleisch wird gegart, während sein Sud dem Reis Geschmack gibt, und beim Anrichten häufig unter dem Reis platziert."
                : "Qabili Palau is traditionally prepared with rice, meat, carrots, and raisins. The meat is slowly braised, its cooking juices infusing the rice with deep flavor, and upon serving, it is often placed beneath the rice."}
            </p>

            <p>
              {isDe
                ? "So entsteht der Moment, den das Community-Foto so gut einfängt: Erst sieht man Reis, Möhren und Rosinen. Dann öffnet sich der Reisberg – und darunter wartet das Fleisch."
                : "This creates the very moment captured so well in the community photo: first, you see the rice, carrots, and raisins. Then, the mountain of rice opens up—and underneath, the tender meat awaits."}
            </p>

            <p>
              {isDe
                ? "Der erste Bissen lebt von Gegensätzen. Die Möhren und Rosinen bringen eine milde Süße mit, während Kreuzkümmel, Kardamom und Fleisch für die herzhafte Seite sorgen. Qabili Palau ist deshalb nicht einfach Reis mit einer Beilage. Alle Bestandteile gehören zusammen."
                : "The first bite thrives on contrast. The carrots and raisins provide a gentle sweetness, while cumin, cardamom, and the meat deliver savory depth. Qabili Palau is therefore not simply rice with a side dish. Every single element belongs together."}
            </p>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe
                ? "Ein Gericht für Gäste und besondere Anlässe"
                : "A dish for guests and special occasions"}
            </h2>

            <p>
              {isDe
                ? "Qabili Palau gilt weithin als afghanisches Nationalgericht. Quellen zur afghanischen Esskultur beschreiben es als ein aufwendiges Gericht, das traditionell Gästen und bei besonderen Anlässen serviert wird."
                : "Qabili Palau is widely regarded as the national dish of Afghanistan. Accounts of Afghan food culture describe it as an elaborate dish traditionally served to honored guests and on festive occasions."}
            </p>

            <p>
              {isDe
                ? "Früher bedeuteten die feinen Möhrenstreifen, Rosinen und Nüsse viel Handarbeit. Heute lässt sich manches schneller vorbereiten, doch das Gericht hat seinen besonderen Platz in der afghanischen Küche behalten."
                : "Historically, preparing the fine carrot julienne, raisins, and nuts required meticulous handwork. While modern kitchens can prepare components faster today, the dish has retained its revered status in Afghan gastronomy."}
            </p>

            <p className="bg-[#FAF7F0] border-l-4 border-[#b28a3c] p-4 rounded-r-2xl text-xs sm:text-sm text-forest/80 font-medium">
              {isDe
                ? "Bei Ariana wird Qabili auf der aktuellen Online-Speisekarte mit gedämpftem Kalbfleisch, afghanischen Gewürzen, Rosinen, Mandeln, Kreuzkümmel und Kardamom beschrieben. Der dort ausgewiesene Onlinepreis beträgt derzeit 11,90 Euro; der Preis im Restaurant kann davon abweichen."
                : "On Ariana’s current online menu, Qabili is described with steamed veal, Afghan spices, raisins, almonds, cumin, and cardamom. The listed online price is currently 11.90 euros; in-restaurant prices may vary."}
            </p>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe
                ? "Warum Speisely solche Geschichten erzählt"
                : "Why Speisely tells stories like this"}
            </h2>

            <p>
              {isDe
                ? "Eine klassische Bewertung würde fragen: War es gut? Wie war der Service? Wie viele Sterne?"
                : "A conventional review would ask: Was it good? How was the service? How many stars?"}
            </p>

            <p className="font-display text-xl sm:text-2xl font-bold text-forest italic pl-4 border-l-2 border-forest/30">
              {isDe
                ? "Warum ist das Fleisch eigentlich unter dem Reis versteckt?"
                : "Why is the meat actually hidden beneath the rice?"}
            </p>

            <p>
              {isDe
                ? "Denn manchmal erzählt die Art, wie ein Gericht aufgebaut ist, mehr als jede Punktzahl."
                : "Because sometimes the way a dish is constructed tells a richer story than any score ever could."}
            </p>

            {/* Restaurant Info Card */}
            <div className="surface-card p-6 sm:p-8 rounded-3xl border border-forest/10 my-8">
              <h3 className="font-display text-xl font-bold text-forest flex items-center gap-2">
                <Utensils className="h-5 w-5 text-[#b28a3c]" aria-hidden="true" />
                <span>Ariana Restaurant Frankfurt</span>
              </h3>
              <p className="mt-2 text-sm text-forest/75">
                Münchener Straße 48, 60329 Frankfurt am Main
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-forest/70">
                <span className="bg-[#DDEEE3] text-forest px-2.5 py-1 rounded-md">
                  {isDe ? "Afghanische Spezialitäten" : "Afghan Specialties"}
                </span>
                <span className="bg-[#DDEEE3] text-forest px-2.5 py-1 rounded-md">Halal</span>
                <span className="bg-[#DDEEE3] text-forest px-2.5 py-1 rounded-md">
                  {isDe ? "Vegetarische Gerichte" : "Vegetarian Options"}
                </span>
              </div>
            </div>

            {/* Transparent Disclosure Section */}
            <div className="surface-card p-6 rounded-3xl border border-[#b28a3c]/30 bg-[#FAF7F0] text-xs sm:text-sm text-forest/80 space-y-3">
              <div className="flex items-center gap-2 font-bold text-forest">
                <Shield className="h-4 w-4 text-[#7FA46B]" aria-hidden="true" />
                <span>{isDe ? "Transparenzhinweis" : "Transparency Notice"}</span>
              </div>
              <p>
                {isDe
                  ? "Diese Geschichte basiert auf einem Besuch und einem Foto, die von einem Mitglied der Speisely Community geteilt wurden. Speisely war nicht selbst vor Ort. Der Beitrag ist keine Sternebewertung und keine offizielle Restaurantbewertung."
                  : "This story is based on a visit and photo shared by a member of the Speisely Community. Speisely was not on site. This article is not a star rating and does not constitute an official restaurant review."}
              </p>
              <p className="text-xs text-forest/60 pt-1 border-t border-forest/10">
                {isDe
                  ? "Foto- und Medienhinweis: Das Foto wurde vom Community-Mitglied aufgenommen und Speisely nach redaktioneller Optimierung zur Verfügung gestellt. Fotocredit: Speisely Community."
                  : "Photo and media notice: The photo was captured by the community member and editorially optimized for publication. Photo credit: Speisely Community."}
              </p>
            </div>

            {/* CTA Section */}
            <div className="mt-12 rounded-3xl bg-forest text-[oklch(0.97_0.02_92)] p-8 sm:p-12 text-center shadow-xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f2d896]">
                {isDe ? "MITMACHEN & TEILEN" : "PARTICIPATE & SHARE"}
              </span>
              <h2 className="mt-2 font-display text-2xl sm:text-4xl font-bold text-white">
                {isDe ? "Du hast auch etwas entdeckt?" : "Discovered Something Yourself?"}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-white/80 max-w-xl mx-auto leading-relaxed">
                {isDe
                  ? "Vielleicht war es ein traditionelles Gericht, ein lokales Restaurant oder ein Food-Moment auf einer Feier. Teile deine Erfahrung mit der Speisely Community."
                  : "Perhaps it was a traditional dish, a neighborhood restaurant, or a food moment at a celebration. Share your experience with the Speisely Community."}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <a
                  href={mailtoHref}
                  className="inline-flex items-center gap-2 rounded-full bg-[#b28a3c] text-white px-6 py-3.5 text-xs sm:text-sm font-bold shadow-lg hover:bg-[#9a7633] transition"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  <span>{isDe ? "Erlebnis per E-Mail teilen" : "Share Experience via Email"}</span>
                </a>

                <a
                  href={instagramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 text-white px-6 py-3.5 text-xs sm:text-sm font-semibold hover:bg-white/20 transition"
                >
                  <Instagram className="h-4 w-4 text-[#f2d896]" aria-hidden="true" />
                  <span>{isDe ? "Auf Instagram schreiben" : "Message on Instagram"}</span>
                </a>
              </div>

              <p className="mt-4 text-[11px] text-white/50 font-medium">
                {isDe
                  ? "Mit dem Senden erfolgt noch keine automatische Veröffentlichung."
                  : "Sending your content does not mean it will be published automatically."}
              </p>
            </div>
          </div>
        </article>
      </div>
    </SiteShell>
  );
}
