import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Shield, Users, Utensils, Mail, Instagram, Sparkles } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { SiteShell } from "@/components/SiteShell";
import { AboutSpeiselySection } from "@/components/AboutSpeiselySection";

export const Route = createFileRoute("/magazin/community/alzaeem-restaurant-berlin")({
  head: () => ({
    meta: [
      { title: "Community Story: Alzaeem Restaurant Berlin-Neukölln | Speisely" },
      {
        name: "description",
        content:
          "Ein Fest aus Holzkohle, Mezze und Grillgenuss. Mix Grill #44, syrische Grillgerichte und ein vielseitiges Kindermenü beim Alzaeem Restaurant an der Sonnenallee in Berlin-Neukölln.",
      },
      {
        name: "keywords",
        content:
          "Alzaeem Restaurant Berlin, Syrisches Restaurant Neukölln, Mix Grill Sonnenallee, Shish Tawook Berlin, Kabob Neukölln, Halal Restaurant Berlin, Speisely Community, Speisely Magazin",
      },
      { name: "geo.region", content: "DE-BE" },
      { name: "geo.placename", content: "Berlin-Neukölln" },
      { name: "geo.position", content: "52.4878;13.4352" },
      { name: "ICBM", content: "52.4878, 13.4352" },
      {
        property: "og:title",
        content: "Community Story: Alzaeem Restaurant Berlin-Neukölln | Speisely",
      },
      {
        property: "og:description",
        content:
          "Der Tisch füllt sich, bevor der Grill kommt. Mix Grill #44 und syrischer Holzkohlegrill auf der Sonnenallee in Berlin-Neukölln.",
      },
      {
        property: "og:image",
        content: "https://speisely.de/magazin/alzaeem-berlin/mix-grill-spread.jpg",
      },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "de_DE" },
      {
        property: "og:url",
        content: "https://speisely.de/magazin/community/alzaeem-restaurant-berlin",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://speisely.de/magazin/community/alzaeem-restaurant-berlin",
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
              "@id": "https://speisely.de/magazin/community/alzaeem-restaurant-berlin#article",
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": "https://speisely.de/magazin/community/alzaeem-restaurant-berlin",
              },
              headline: "Der Tisch füllt sich, bevor der Grill kommt — Alzaeem an der Sonnenallee",
              description:
                "Mix Grill #44, syrische Grillgerichte und ein vielseitiges Kindermenü beim Alzaeem Restaurant in Berlin-Neukölln.",
              image: {
                "@type": "ImageObject",
                url: "https://speisely.de/magazin/alzaeem-berlin/mix-grill-spread.jpg",
                width: 1200,
                height: 800,
              },
              datePublished: "2026-08-26",
              dateModified: "2026-08-26",
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
                name: "Alzaeem Restaurant",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Sonnenallee 16",
                  addressLocality: "Berlin",
                  postalCode: "12047",
                  addressRegion: "Berlin",
                  addressCountry: "DE",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 52.4878,
                  longitude: 13.4352,
                },
                url: "https://www.alzaeem-restaurant.de",
                servesCuisine: "Syrian",
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
                  name: "Alzaeem Berlin",
                  item: "https://speisely.de/magazin/community/alzaeem-restaurant-berlin",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: AlzaeemBerlinCommunityArticle,
});

function AlzaeemBerlinCommunityArticle() {
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
                  Alzaeem Berlin
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
              ? "Ein Fest aus Holzkohle, Mezze und Grillgenuss"
              : "A Feast of Charcoal, Mezze and Grilled Flavours"}
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-forest/80 leading-relaxed font-medium">
            {isDe
              ? "Alzaeem an der Sonnenallee in Berlin-Neukölln: Mix Grill #44, syrische Grillgerichte und ein vielseitiges Kindermenü."
              : "Alzaeem on Sonnenallee in Berlin-Neukölln: Mix Grill #44, Syrian charcoal-grilled dishes and a varied children's meal."}
          </p>

          {/* Info Card */}
          <div className="mt-8 surface-card p-5 sm:p-6 rounded-3xl border border-forest/10 bg-white grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-[#b28a3c] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider">
                  {isDe ? "Ort" : "Location"}
                </span>
                <strong className="font-semibold text-forest">Alzaeem Restaurant</strong>
                <span className="block text-forest/70 text-xs">
                  Sonnenallee 16, 12047 Berlin-Neukölln
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
                  {isDe ? "Unabhängiger Community-Besuch" : "Independent community visit"}
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
            {/* Photo 1 — kebab hero close-up */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md">
                <img
                  src="/magazin/alzaeem-berlin/mix-grill-close.jpg"
                  alt={
                    isDe
                      ? "Kabob und Shish Tawook auf einem Kupfertablett im Alzaeem Restaurant Neukölln"
                      : "Kabob and Shish Tawook served on a copper tray at Alzaeem Restaurant in Neukölln"
                  }
                  className="w-full h-auto object-cover max-h-[680px]"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Kabob und Shish Tawook auf dem Kupfertablett, begleitet von gegrilltem Gemüse und frischen Kräutern."
                    : "Kabob and Shish Tawook on the copper tray, accompanied by grilled vegetables and fresh herbs."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <p>
              {isDe
                ? "Die Sonnenallee ist lebendig, vielfältig und voller kulinarischer Eindrücke. Zwischen Geschäften, Bäckereien und Restaurants liegt das Alzaeem auf Nummer 16. Beim Betreten macht sich direkt der Duft des Holzkohlegrills bemerkbar und stimmt auf das Essen ein."
                : "Sonnenallee is lively, diverse and full of culinary discoveries. Alzaeem sits among its many shops, bakeries and restaurants at number 16. Upon entering, the aroma of the charcoal grill immediately sets the scene for the meal ahead."}
            </p>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe
                ? "Mix Grill #44 – eine Auswahl für den ganzen Tisch"
                : "Mix Grill #44 — something for the whole table"}
            </h2>

            <p>
              {isDe
                ? "Bei diesem Community-Besuch wurde der Mix Grill mit Shish Tawook bestellt – Nummer 44 auf der Speisekarte."
                : "During this community visit, Mix Grill #44 with Shish Tawook was ordered."}
            </p>

            <p>
              {isDe
                ? "Serviert wird eine großzügige Kombination aus gegrilltem Lammfleisch, Kabob-Spießen und Shish Tawook auf einem langen Kupfertablett. Dazu gehören Hummus, Mutabal, Knoblauchsoße, Pommes und Salat. Alles ist Teil derselben Bestellung und bietet eine abwechslungsreiche Auswahl zum gemeinsamen Probieren."
                : "The generous combination includes grilled lamb, kabob skewers and Shish Tawook served on a long copper tray. Hummus, mutabal, garlic sauce, fries and salad are also included, creating a varied spread that everyone at the table can explore together."}
            </p>

            <p>
              {isDe
                ? "Während die Grillgerichte frisch zubereitet werden, kommen Hummus und Mutabal auf den Tisch. Zusammen mit dem Brot entsteht bereits eine kleine Mezze-Runde, die sich wunderbar teilen lässt."
                : "While the grilled dishes are freshly prepared, the hummus and mutabal arrive at the table. Served with bread, they create a small mezze selection that is easy to share."}
            </p>

            <p className="font-display text-xl sm:text-2xl font-bold text-forest italic pl-4 border-l-2 border-forest/30">
              {isDe
                ? "Der Tisch füllt sich – und das große Grilltablett ist noch unterwegs."
                : "The table starts filling up before the large grill tray even arrives."}
            </p>

            {/* Photo 2 — full table spread */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md">
                <img
                  src="/magazin/alzaeem-berlin/mix-grill-spread.jpg"
                  alt={
                    isDe
                      ? "Mix Grill mit Hummus, Mutabal, Pommes und Salat im Alzaeem Restaurant Berlin-Neukölln"
                      : "Mix Grill with hummus, mutabal, fries and salad at Alzaeem Restaurant in Berlin-Neukölln"
                  }
                  className="w-full h-auto object-cover max-h-[680px]"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Mix Grill #44: Hummus, Mutabal, Pommes und Salat sind inklusive."
                    : "Mix Grill #44: hummus, mutabal, fries and salad are all included."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <p>
              {isDe
                ? "Anschließend kommt das lange Kupfertablett: würzige Kabob-Spieße, gegrilltes Lammfleisch und marinierte Shish-Tawook-Hähnchenstücke. Eine gegrillte Aubergine, Paprika, Zwiebeln und frische Kräuter ergänzen die Platte."
                : "Next comes the long copper tray with seasoned kabob skewers, grilled lamb and pieces of marinated Shish Tawook chicken. A grilled aubergine, pepper, onions and fresh herbs complete the presentation."}
            </p>

            <p>
              {isDe
                ? "Die verschiedenen Komponenten bringen rauchige Grillaromen, cremige Mezze, frische Beilagen und warmes Brot an einen Tisch. Gerade diese Vielfalt macht den Mix Grill zu einem Essen, das sich gut gemeinsam entdecken und teilen lässt."
                : "The combination brings together smoky grilled flavours, creamy mezze, fresh accompaniments and warm bread. This variety makes the Mix Grill particularly well suited to sharing and discovering together."}
            </p>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe ? "Ein vielseitiges Kindermenü" : "A varied children's meal"}
            </h2>

            {/* Photo 3 — Kinder menu */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md">
                <img
                  src="/magazin/alzaeem-berlin/kinder-menu.jpg"
                  alt={
                    isDe
                      ? "Kindermenü mit Mozzarella Sticks, Chicken Nuggets, Pommes, Krautsalat und Gurken"
                      : "Children's meal with mozzarella sticks, chicken nuggets, fries, coleslaw and pickles"
                  }
                  className="w-full h-auto object-cover max-h-[600px]"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Kindermenü: Mozzarella Sticks, sechs Chicken Nuggets, Pommes, Krautsalat, Gurken, Knoblauchsoße und Capri-Sun."
                    : "Children's meal: mozzarella sticks, six chicken nuggets, fries, coleslaw, pickles, garlic sauce and Capri-Sun."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <p>
              {isDe
                ? "Auch für Kinder gibt es eine großzügig zusammengestellte Auswahl. Das Kindermenü enthält Mozzarella Sticks, sechs Chicken Nuggets, Pommes frites, Krautsalat, Knoblauchsoße, Gemüse, saure Gurken und einen Capri-Sun. Der Preis lag bei diesem Besuch bei ungefähr 10,00 €."
                : "There is also a generous selection for younger guests. The children's meal includes mozzarella sticks, six chicken nuggets, fries, coleslaw, garlic sauce, vegetables, pickles and a Capri-Sun. It cost approximately €10 during this visit."}
            </p>

            <p>
              {isDe
                ? "Durch die unterschiedlichen Bestandteile können Kinder selbst auswählen, was sie zuerst probieren möchten. Gleichzeitig lassen sich Hummus, Mutabal, Brot und Pommes unkompliziert mit der ganzen Familie teilen."
                : "The variety gives children several familiar options to choose from. Hummus, mutabal, bread and fries can also be shared easily across the family table."}
            </p>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe
                ? "Ein gemeinsames Essen mitten in Neukölln"
                : "A shared meal in the heart of Neukölln"}
            </h2>

            <p>
              {isDe
                ? "Alzaeem liegt mitten in einem lebendigen Teil der Sonnenallee und bringt Grillgerichte, Mezze und großzügige Platten an einen Tisch."
                : "Alzaeem sits in a lively part of Sonnenallee, bringing grilled dishes, mezze and generous sharing platters to the table."}
            </p>

            <p>
              {isDe
                ? "Dieser Community-Besuch zeigt ein Essen, bei dem das Teilen im Mittelpunkt steht: verschiedene Fleischsorten vom Holzkohlegrill, cremige Dips, frischer Salat, warmes Brot und Beilagen für unterschiedliche Geschmäcker."
                : "This community visit captured a meal centred around sharing: different charcoal-grilled meats, creamy dips, fresh salad, warm bread and accompaniments for a range of tastes."}
            </p>

            <p className="font-medium text-forest text-lg">
              {isDe
                ? "Mix Grill #44 ist eine vielseitige Wahl für alle, die gemeinsam probieren, teilen und sich Zeit für ein großzügiges Essen nehmen möchten."
                : "Mix Grill #44 offers a varied choice for anyone who enjoys exploring different flavours and taking time over a generous shared meal."}
            </p>

            {/* Restaurant Card */}
            <div className="surface-card p-6 sm:p-8 rounded-3xl border border-forest/10 my-8">
              <h3 className="font-display text-xl font-bold text-forest flex items-center gap-2">
                <Utensils className="h-5 w-5 text-[#b28a3c]" aria-hidden="true" />
                <span>Alzaeem Restaurant Berlin-Neukölln</span>
              </h3>
              <p className="mt-2 text-sm text-forest/75">Sonnenallee 16, 12047 Berlin-Neukölln</p>
              <p className="mt-1 text-sm text-forest/60">
                <a
                  href="https://www.alzaeem-restaurant.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-forest transition"
                >
                  alzaeem-restaurant.de
                </a>
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-forest/70">
                <span className="bg-[#DDEEE3] text-forest px-2.5 py-1 rounded-md">
                  {isDe ? "Syrischer Holzkohlegrill" : "Syrian charcoal grill"}
                </span>
                <span className="bg-[#DDEEE3] text-forest px-2.5 py-1 rounded-md">Halal</span>
                <span className="bg-[#DDEEE3] text-forest px-2.5 py-1 rounded-md">Mezze</span>
                <span className="bg-[#DDEEE3] text-forest px-2.5 py-1 rounded-md">Shawarma</span>
              </div>
            </div>

            {/* Transparency Notice */}
            <div className="surface-card p-6 rounded-3xl border border-[#b28a3c]/30 bg-[#FAF7F0] text-xs sm:text-sm text-forest/80 space-y-3">
              <div className="flex items-center gap-2 font-bold text-forest">
                <Shield className="h-4 w-4 text-[#7FA46B]" aria-hidden="true" />
                <span>{isDe ? "Transparenzhinweis" : "Transparency notice"}</span>
              </div>
              <p>
                {isDe
                  ? "Diese Geschichte basiert auf einem selbst bezahlten Besuch und auf Fotos, die von einem Mitglied der Speisely Community geteilt wurden. Speisely war nicht selbst vor Ort. Der Beitrag gibt die Eindrücke dieses Community-Besuchs wieder und ist keine Sternebewertung oder offizielle Restaurantbewertung."
                  : "This story is based on a self-paid visit and photographs shared by a member of the Speisely Community. Speisely was not present at the restaurant. The article reflects the impressions of this community visit and is not a star rating or an official restaurant review."}
              </p>
              <p className="text-xs text-forest/60 pt-1 border-t border-forest/10">
                {isDe
                  ? "Die Fotos wurden vom Community-Mitglied aufgenommen und für die Veröffentlichung redaktionell aufbereitet. Fotocredit: Speisely Community."
                  : "The photographs were captured by the community member and editorially prepared for publication. Photo credit: Speisely Community."}
              </p>
            </div>

            {/* CTA */}
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
                  : "Perhaps it was a traditional dish, a neighbourhood restaurant, or a food moment at a celebration. Share your experience with the Speisely Community."}
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
          
          <AboutSpeiselySection />
        </article>
      </div>
    </SiteShell>
  );
}
