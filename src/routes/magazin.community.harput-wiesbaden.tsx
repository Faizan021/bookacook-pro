import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  MapPin,
  Calendar,
  Users,
  Shield,
  Utensils,
  Info,
  Mail,
  Instagram,
  Sparkles,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/magazin/community/harput-wiesbaden")({
  head: () => ({
    meta: [
      {
        title: "Community Story: Ein Grillabend bei Harput in Wiesbaden | Speisely",
      },
      {
        name: "description",
        content:
          "Ein Mitglied der Speisely Community teilt seinen Besuch bei Harput in Wiesbaden – mit ganzem gegrilltem Fisch und saftigem Hähnchenspieß mit Reis.",
      },
      {
        name: "keywords",
        content:
          "Harput Wiesbaden, Harput Restaurant Wiesbaden, Türkisches Restaurant Wiesbaden, Schwalbacher Straße Wiesbaden, Grillrestaurant Wiesbaden, Essen in Wiesbaden, Gegrillter Fisch Wiesbaden, Hähnchenspieß Wiesbaden, Speisely Community, Speisely Magazin",
      },
      {
        name: "geo.region",
        content: "DE-HE",
      },
      {
        name: "geo.placename",
        content: "Wiesbaden",
      },
      {
        name: "geo.position",
        content: "50.0826;8.2367",
      },
      {
        name: "ICBM",
        content: "50.0826, 8.2367",
      },
      {
        property: "og:title",
        content: "Community Story: Ein Grillabend bei Harput in Wiesbaden | Speisely",
      },
      {
        property: "og:description",
        content:
          "Ein Mitglied der Speisely Community teilt seinen Besuch bei Harput in Wiesbaden – mit ganzem gegrilltem Fisch und saftigem Hähnchenspieß mit Reis.",
      },
      {
        property: "og:image",
        content: "https://speisely.de/magazin/harput-wiesbaden/harput-fisch.jpg",
      },
      { property: "og:type", content: "article" },
      {
        property: "og:locale",
        content: "de_DE",
      },
      {
        property: "og:url",
        content: "https://speisely.de/magazin/community/harput-wiesbaden",
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
        href: "https://speisely.de/magazin/community/harput-wiesbaden",
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
              "@id": "https://speisely.de/magazin/community/harput-wiesbaden#article",
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": "https://speisely.de/magazin/community/harput-wiesbaden",
              },
              headline: "Aus der Speisely Community: Ein Grillabend bei Harput in Wiesbaden",
              description:
                "Ein Mitglied der Speisely Community teilt seinen Besuch bei Harput in Wiesbaden – mit ganzem gegrilltem Fisch und saftigem Hähnchenspieß mit Reis.",
              image: {
                "@type": "ImageObject",
                url: "https://speisely.de/magazin/harput-wiesbaden/harput-fisch.jpg",
                width: 1200,
                height: 675,
              },
              datePublished: "2026-08-18",
              dateModified: "2026-08-18",
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
                name: "Harput Restaurant",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Schwalbacher Straße 49",
                  addressLocality: "Wiesbaden",
                  postalCode: "65183",
                  addressRegion: "Hessen",
                  addressCountry: "DE",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 50.0826,
                  longitude: 8.2367,
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
                  name: "Harput Wiesbaden",
                  item: "https://speisely.de/magazin/community/harput-wiesbaden",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: HarputWiesbadenCommunityArticle,
});

function HarputWiesbadenCommunityArticle() {
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
                  Harput Wiesbaden
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
              ? "Aus der Speisely Community: Ein Grillabend bei Harput in Wiesbaden"
              : "From the Speisely Community: A Grill Evening at Harput in Wiesbaden"}
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-forest/80 leading-relaxed font-medium">
            {isDe
              ? "Manche Restaurantbesuche beginnen mit einer langen Speisekarte. Dieser begann mit zwei Tellern, die schon beim Servieren die Aufmerksamkeit auf sich zogen."
              : "Some restaurant visits begin with a long menu. This one began with two plates that immediately caught attention when served."}
          </p>

          {/* Quick Context Card */}
          <div className="mt-8 surface-card p-5 sm:p-6 rounded-3xl border border-forest/10 bg-white grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-[#b28a3c] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Ort" : "Location"}
                </span>
                <strong className="font-semibold text-forest">Harput Restaurant</strong>
                <span className="block text-forest/70 text-xs">
                  Schwalbacher Str. 49, Wiesbaden
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
                  {isDe ? "Vom Community-Mitglied" : "By community member"}
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
                ? "Ein Mitglied der Speisely Community war in der vergangenen Woche bei Harput in Wiesbaden und hat diesen Food-Moment mit uns geteilt. Auf dem Tisch: ein ganzer gegrillter Fisch und ein Hähnchenspieß mit Reis."
                : "A member of the Speisely Community visited Harput in Wiesbaden last week and shared this food moment with us. On the table: a whole grilled fish and a chicken skewer served with rice."}
            </p>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe
                ? "Zwei Gerichte, zwei verschiedene Seiten des Grills"
                : "Two Dishes, Two Different Sides of the Grill"}
            </h2>

            {/* Photo 1: Fish Board */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md">
                <img
                  src="/magazin/harput-wiesbaden/harput-fisch.jpg"
                  alt={
                    isDe
                      ? "Ganzer gegrillter Fisch mit Reis und Zitrone auf einem Holzbrett bei Harput in Wiesbaden"
                      : "Whole grilled fish with rice and lemon on a wooden platter at Harput in Wiesbaden"
                  }
                  className="w-full h-auto object-cover max-h-[550px]"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Ganzer gegrillter Fisch, serviert auf einem rustikalen Holzbrett mit Reis und Zitrone."
                    : "Whole grilled fish, served on a rustic wooden platter with rice and lemon."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <p>
              {isDe
                ? "Der Fisch kam im Ganzen auf einem länglichen Holzbrett an. Außen kräftig mit Röstnoten gegrillt, auf einer großzügigen Portion Reis serviert und mit einer frischen Zitronenspalte abgerundet. Kein komplizierter Aufbau, keine überflüssige Dekoration – der Fisch stand klar im Mittelpunkt des Holzbretts."
                : "The fish arrived whole on an elongated wooden platter. Robustly grilled on the outside, served over a generous bed of rice, and finished with a fresh lemon wedge. No complicated arrangement, no unnecessary decoration—the fish remained the clear centerpiece of the board."}
            </p>

            <p className="bg-[#FAF7F0] border-l-4 border-[#b28a3c] p-4 rounded-r-2xl text-xs sm:text-sm text-forest/80 font-medium italic">
              {isDe
                ? "Hinweis zur Transparenz: Den genauen Namen beziehungsweise die Fischart kennen wir bisher nicht. Deshalb beschreiben wir das Gericht bewusst als „ganzen gegrillten Fisch“, anstatt eine nicht bestätigte Menübezeichnung zu verwenden."
                : "Transparency note: We do not currently know the exact species or menu name. Therefore, we deliberately describe the dish as 'whole grilled fish' rather than using an unconfirmed menu label."}
            </p>

            {/* Photo 2: Chicken Skewer Board */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md">
                <img
                  src="/magazin/harput-wiesbaden/harput-haehnchenspiesz.jpg"
                  alt={
                    isDe
                      ? "Gegrillter Hähnchenspieß mit Reis, gegrillter Spitzpaprika und Tomate bei Harput in Wiesbaden"
                      : "Grilled chicken skewer with rice, charred chili pepper and grilled tomato at Harput in Wiesbaden"
                  }
                  className="w-full h-auto object-cover max-h-[550px]"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Gegrillter Hähnchenspieß mit Reis, gerösteter Spitzpaprika und Tomate."
                    : "Grilled chicken skewer with rice, charred chili pepper, and tomato."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <p>
              {isDe
                ? "Daneben zeigte der Hähnchenspieß eine andere Facette des Grillangebots. Gut marinierte, saftig gegrillte Fleischstücke wurden über einer Portion Reis angerichtet, begleitet von einer scharf gerösteten Spitzpaprika und einer gegrillten Tomate vom Holzkohlegrill. Ein Teller, auf dem Farben, Beilagen und Grillspuren bereits einen guten Eindruck davon vermittelten, was die Community an diesem Abend entdeckt hatte."
                : "Beside it, the chicken skewer showcased another facet of the grill selection. Well-marinated, tender grilled pieces arranged over rice, accompanied by a charred red chili pepper and a grilled tomato from the charcoal fire. A dish whose colors, sides, and grill marks gave a vivid impression of what our community member enjoyed that evening."}
            </p>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe ? "Mehr als nur ein Restaurantfoto" : "More Than Just a Restaurant Photo"}
            </h2>

            <p>
              {isDe
                ? "Was von einem Restaurantbesuch bleibt, ist nicht immer nur die Erinnerung an ein einzelnes Gericht. Manchmal ist es der Moment, in dem mehrere Teller auf dem Tisch stehen, jeder etwas anderes probiert und aus einem gewöhnlichen Abend eine kleine gemeinsame Geschichte wird."
                : "What remains from a restaurant visit is not always just the memory of a single dish. Sometimes it is the moment when several plates fill the table, everyone tastes something different, and an ordinary evening turns into a shared story."}
            </p>

            <p>
              {isDe
                ? "Genau solche Erfahrungen möchten wir in der Speisely Community sammeln: echte Restaurantbesuche, Catering-Erlebnisse, Food-Events und persönliche Entdeckungen aus unterschiedlichen Städten."
                : "These are exactly the kinds of experiences we want to bring together in the Speisely Community: genuine restaurant visits, catering experiences, food events, and personal discoveries from different cities."}
            </p>

            <p className="font-medium text-forest">
              {isDe
                ? "Nicht als öffentliche Bewertung. Nicht mit Sternen oder Rankings. Sondern als persönliche Momente, die Menschen mit Speisely teilen und die wir mit ihrer Erlaubnis redaktionell erzählen."
                : "Not as a public review. Not with stars or rankings. But as personal moments that people share with Speisely, which we tell with their permission."}
            </p>

            {/* Restaurant Info Box */}
            <div className="surface-card p-6 sm:p-8 rounded-3xl border border-forest/10 my-8">
              <h3 className="font-display text-xl font-bold text-forest flex items-center gap-2">
                <Utensils className="h-5 w-5 text-[#b28a3c]" aria-hidden="true" />
                <span>Harput in Wiesbaden</span>
              </h3>
              <p className="mt-2 text-sm text-forest/75">
                {isDe
                  ? "Harput befindet sich in der Schwalbacher Straße 49 in 65183 Wiesbaden. Das Angebot umfasst verschiedene Holzkohlegrill-Gerichte sowie weitere Speisen aus der türkischen Küche."
                  : "Harput is located at Schwalbacher Straße 49 in 65183 Wiesbaden. The menu features a variety of charcoal-grilled dishes and Turkish specialties."}
              </p>
              <p className="mt-3 text-xs text-forest/60 italic font-medium">
                {isDe
                  ? "Dieser Beitrag soll keine vollständige Bewertung des Restaurants sein. Er erzählt einen einzelnen Besuch und zeigt die beiden Gerichte, die ein Mitglied unserer Community mit uns geteilt hat."
                  : "This article is not intended to be an exhaustive restaurant review. It shares a single visit and showcases the two dishes contributed by our community member."}
              </p>
            </div>

            {/* Transparent Disclosure Section */}
            <div className="surface-card p-6 rounded-3xl border border-[#b28a3c]/30 bg-[#FAF7F0] text-xs sm:text-sm text-forest/80 space-y-3">
              <div className="flex items-center gap-2 font-bold text-forest">
                <Shield className="h-4 w-4 text-[#7FA46B]" aria-hidden="true" />
                <span>{isDe ? "Transparenzhinweis" : "Transparency Notice"}</span>
              </div>
              <p>
                {isDe
                  ? "Dieser Besuch wurde von einem Mitglied der Speisely Community unabhängig durchgeführt und selbst bezahlt. Speisely war bei diesem Besuch nicht selbst vor Ort. Der Beitrag basiert auf den persönlichen Erfahrungen und Informationen des Community-Mitglieds und wurde von Speisely redaktionell aufbereitet. Es handelt sich nicht um eine offizielle Speisely-Bewertung."
                  : "This visit was independently carried out and self-paid by a member of the Speisely Community. Speisely was not on site. The article is based on the contributor's personal experience and was editorially prepared by Speisely. It is not an official Speisely rating."}
              </p>
              <p className="text-xs text-forest/60 pt-1 border-t border-forest/10">
                {isDe
                  ? "Foto- und Medienhinweis: Die Fotos wurden vom Community-Mitglied selbst aufgenommen und Speisely mit ausdrücklicher Erlaubnis zur Veröffentlichung zur Verfügung gestellt. Fotocredit: Speisely Community."
                  : "Photo and media notice: The photos were taken by the community member and provided to Speisely with explicit permission for publication. Photo credit: Speisely Community."}
              </p>
            </div>

            {/* CTA Section: Du hast auch etwas entdeckt? */}
            <div className="mt-12 rounded-3xl bg-forest text-[oklch(0.97_0.02_92)] p-8 sm:p-12 text-center shadow-xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f2d896]">
                {isDe ? "MITMACHEN & TEILEN" : "PARTICIPATE & SHARE"}
              </span>
              <h2 className="mt-2 font-display text-2xl sm:text-4xl font-bold text-white">
                {isDe ? "Du hast auch etwas entdeckt?" : "Discovered Something Yourself?"}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-white/80 max-w-xl mx-auto leading-relaxed">
                {isDe
                  ? "Vielleicht war es ein kleines Restaurant in deiner Nachbarschaft, ein besonderes Catering oder ein Food-Moment auf einem Event. Teile deine Erfahrung, Fotos oder Videos mit der Speisely Community."
                  : "Perhaps it was a neighborhood restaurant, a memorable catering experience, or a food moment at an event. Share your experience, photos, or videos with the Speisely Community."}
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
