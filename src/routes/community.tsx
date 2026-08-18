import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/PageHero";
import { useI18n } from "@/i18n/I18nProvider";
import {
  Mail,
  Instagram,
  Utensils,
  Camera,
  Video,
  Heart,
  MapPin,
  PartyPopper,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Clock,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  AlertCircle,
  Lock,
} from "lucide-react";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      {
        title: "Speisely Community – Teile deine Erfahrung, Fotos und Videos | Speisely",
      },
      {
        name: "description",
        content:
          "Teile dein Restaurant-, Catering- oder Eventerlebnis mit der Speisely Community. Sende uns deine Fotos, Videos und die Geschichte dahinter.",
      },
      {
        property: "og:title",
        content: "Speisely Community – Teile deine Erfahrung, Fotos und Videos",
      },
      {
        property: "og:description",
        content:
          "Teile dein Restaurant-, Catering- oder Eventerlebnis mit der Speisely Community. Sende uns deine Fotos, Videos und die Geschichte dahinter.",
      },
      {
        property: "og:url",
        content: "https://speisely.de/community",
      },
      {
        property: "og:type",
        content: "website",
      },
    ],
    links: [{ rel: "canonical", href: "https://speisely.de/community" }],
  }),
  component: CommunityPage,
});

function CommunityPage() {
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

  const shareItems = isDe
    ? [
        {
          icon: Utensils,
          title: "Restaurant- oder Caféentdeckung",
          desc: "Dein Besuch beim Lieblingsitaliener, Street-Food-Spot oder neuen Café in deiner Nachbarschaft.",
        },
        {
          icon: PartyPopper,
          title: "Catering-Erlebnis",
          desc: "Gelungenes Fingerfood bei einer Feier, ein Food-Truck auf einem Event oder ein Hochzeitsmenü.",
        },
        {
          icon: Sparkles,
          title: "Food-Event oder Feier",
          desc: "Stadtfeste, Gourmet-Meilen, kulinarische Märkte oder private Feierlichkeiten.",
        },
        {
          icon: Heart,
          title: "Besonderes Gericht oder Food-Moment",
          desc: "Ein außergewöhnliches Menü, ein Lieblingsgericht oder ein Geschmackserlebnis zum Teilen.",
        },
        {
          icon: MessageCircle,
          title: "Persönliche Erfahrung & Food Story",
          desc: "Ein Gespräch mit dem Inhaber, eine Familienrezept-Tradition oder die Geschichte hinter dem Genuss.",
        },
        {
          icon: Camera,
          title: "Eigene Fotos",
          desc: "Authentische, selbst aufgenommene Bilder vom Essen, den Tellern und der Atmosphäre.",
        },
        {
          icon: Video,
          title: "Eigene Videos",
          desc: "Kurze Videoclips vom Anrichten, Dampfen frischer Gerichte oder dem Geschehen vor Ort.",
        },
        {
          icon: MapPin,
          title: "Tipp aus deiner Stadt",
          desc: "Ein echter kulinarischer Geheimtipp abseits der bekannten Touristenpfade in deiner Stadt.",
        },
      ]
    : [
        {
          icon: Utensils,
          title: "Restaurant or Café Discovery",
          desc: "Your visit to a favorite local spot, street food vendor, or new neighborhood café.",
        },
        {
          icon: PartyPopper,
          title: "Catering Experience",
          desc: "Delicious finger food at a party, a food truck at an event, or a memorable celebration meal.",
        },
        {
          icon: Sparkles,
          title: "Food Event or Celebration",
          desc: "City food festivals, gourmet miles, culinary markets, or special gatherings.",
        },
        {
          icon: Heart,
          title: "Special Dish or Food Moment",
          desc: "An exceptional menu, your favorite dish, or a culinary highlight worth remembering.",
        },
        {
          icon: MessageCircle,
          title: "Personal Experience & Food Story",
          desc: "A chat with the owner, a family culinary tradition, or the story behind the table.",
        },
        {
          icon: Camera,
          title: "Your Own Photos",
          desc: "Authentic, self-captured snapshots of the food, the presentation, and the ambient vibe.",
        },
        {
          icon: Video,
          title: "Your Own Videos",
          desc: "Short video clips showing the preparation, steaming dishes, or the atmosphere.",
        },
        {
          icon: MapPin,
          title: "A Discovery From Your City",
          desc: "A genuine hidden culinary gem in your city away from typical tourist spots.",
        },
      ];

  const steps = isDe
    ? [
        {
          num: "1",
          title: "Erlebnis teilen",
          body: "Schick uns deine Erfahrung, Fotos und Videos per E-Mail, Instagram oder über unsere Kontaktseite.",
        },
        {
          num: "2",
          title: "Redaktionelle Prüfung",
          body: "Wir prüfen deine Geschichte, die wichtigsten Angaben und ob du die eingereichten Fotos und Videos verwenden darfst.",
        },
        {
          num: "3",
          title: "Community Story",
          body: "Wenn deine Einsendung zu Speisely passt, können wir mit deiner Erlaubnis daraus eine Community Story, einen Artikel, Post oder ein Reel erstellen.",
        },
      ]
    : [
        {
          num: "1",
          title: "Share Your Experience",
          body: "Send us your experience, photos and videos by email, Instagram or through our Contact page.",
        },
        {
          num: "2",
          title: "Editorial Review",
          body: "We review your story, important details and whether you have permission to share the submitted photos and videos.",
        },
        {
          num: "3",
          title: "Community Story",
          body: "If the submission is suitable for Speisely, we may—with your permission—turn it into a Community Story, article, post or reel.",
        },
      ];

  const checklist = isDe
    ? [
        "Name des Restaurants, Caterers, Events oder Ortes",
        "Stadt und Stadtteil",
        "Ungefähres Datum des Erlebnisses",
        "Was hast du bestellt, entdeckt oder erlebt?",
        "Deine persönliche Geschichte",
        "Eigene Fotos",
        "Eigene Videos",
        "Gewünschter Foto- oder Videocredit",
        "Information, falls etwas kostenlos, vergünstigt, eingeladen oder gesponsert war",
      ]
    : [
        "Restaurant, caterer, event or location name",
        "City and neighborhood",
        "Approximate date of the experience",
        "What did you order, discover or experience?",
        "Your personal story",
        "Your own photos",
        "Your own videos",
        "Preferred photo or video credit",
        "Information about anything received free, discounted, invited or sponsored",
      ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://speisely.de/community",
        url: "https://speisely.de/community",
        name: isDe
          ? "Speisely Community – Teile deine Erfahrung, Fotos und Videos"
          : "Speisely Community – Share Your Experience, Photos and Videos",
        description: isDe
          ? "Teile dein Restaurant-, Catering- oder Eventerlebnis mit der Speisely Community. Sende uns deine Fotos, Videos und die Geschichte dahinter."
          : "Share your restaurant, catering or event experience with the Speisely Community. Send us your photos, videos and the story behind them.",
        inLanguage: isDe ? "de-DE" : "en-US",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: isDe ? "Startseite" : "Home",
            item: "https://speisely.de",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: isDe ? "Magazin" : "Magazine",
            item: "https://speisely.de/magazin",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Community",
            item: "https://speisely.de/community",
          },
        ],
      },
    ],
  };

  return (
    <SiteShell>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Cinematic Speisely Standard Hero Section with CTA buttons built-in */}
      <PageHero
        eyebrow="SPEISELY COMMUNITY"
        heading={
          isDe ? (
            <>
              Dein Erlebnis. Deine Fotos.
              <br />
              <span className="text-[#f2d896]">Deine Videos. Deine Geschichte.</span>
            </>
          ) : (
            <>
              Your Experience. Your Photos.
              <br />
              <span className="text-[#f2d896]">Your Videos. Your Story.</span>
            </>
          )
        }
        subtext={
          isDe
            ? "Du hast ein Restaurant entdeckt, ein besonderes Catering erlebt oder einen unvergesslichen Food-Moment auf einer Veranstaltung festgehalten? Teile deine Erfahrung, Fotos, Videos und die Geschichte dahinter mit der Speisely Community. Aus ausgewählten Einsendungen können Community Stories, Artikel, Posts oder Reels entstehen."
            : "Discovered a restaurant, enjoyed a memorable catering experience or captured a special moment at a food event? Share your experience, photos, videos and the story behind them with the Speisely Community. Selected submissions may become Community Stories, articles, posts or reels."
        }
        primaryCta={{
          label: isDe ? "Erlebnis mit uns teilen" : "Share Your Experience",
          href: mailtoHref,
        }}
        secondaryCta={{
          label: isDe ? "Auf Instagram schreiben" : "Message Us on Instagram",
          href: instagramHref,
        }}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-24 pt-8">
        {/* Breadcrumb Navigation below Hero */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-xs text-forest/60 font-medium">
            <li>
              <Link to="/" className="hover:text-forest transition-colors">
                {isDe ? "Startseite" : "Home"}
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li>
              <Link to="/magazin" className="hover:text-forest transition-colors">
                {isDe ? "Magazin" : "Magazine"}
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" className="text-forest font-semibold">
              Community
            </li>
          </ol>
        </nav>

        {/* Important photo & video guideline callout box */}
        <div className="mb-14 surface-card p-6 sm:p-7 rounded-3xl border border-[#b28a3c]/30 bg-[#FAF7F0] shadow-xs">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-2xl bg-[#b28a3c]/15 text-[#b28a3c] flex items-center justify-center shrink-0 mt-0.5">
              <Camera className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-forest">
                {isDe
                  ? "Wichtig für deine Fotos und Videos"
                  : "Important information about your photos and videos"}
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-forest/80 leading-relaxed font-medium">
                {isDe
                  ? "Bitte sende uns nur Fotos und Videos, die du selbst aufgenommen hast. Darauf dürfen entweder keine identifizierbaren Personen oder ausschließlich du selbst zu sehen sein. Vor einer Veröffentlichung klären wir mit dir schriftlich, wie Speisely die ausgewählten Inhalte verwenden darf."
                  : "Please send us only photos and videos that you created yourself. They must show either no identifiable people or only you. Before publication, we will confirm with you in writing how Speisely may use the selected content."}
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Was kannst du mit uns teilen? */}
        <section className="mb-20" aria-labelledby="community-topics">
          <div className="max-w-3xl mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b28a3c]">
              {isDe ? "THEMEN & VIELFALT" : "TOPICS & DIVERSITY"}
            </span>
            <h2
              id="community-topics"
              className="mt-2 font-display text-3xl sm:text-4xl text-forest font-bold"
            >
              {isDe ? "Was kannst du mit uns teilen?" : "What can you share with us?"}
            </h2>
            <p className="mt-3 text-forest/70 text-base leading-relaxed">
              {isDe
                ? "Du brauchst keine professionelle Kamera und musst kein Influencer sein. Entscheidend ist, dass es deine echte Erfahrung und deine eigene Geschichte ist."
                : "You don’t need a professional camera or an influencer account. What matters is that it is your genuine experience and your own story."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {shareItems.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={idx}
                  className="surface-card p-6 rounded-3xl border border-forest/10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="h-11 w-11 rounded-2xl bg-[#DDEEE3] flex items-center justify-center text-forest mb-4">
                      <IconComponent className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-forest">{item.title}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-forest/70 leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: So funktioniert es */}
        <section className="mb-20" aria-labelledby="how-it-works">
          <div className="max-w-3xl mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b28a3c]">
              {isDe ? "EINFACHER ABLAUF" : "SIMPLE PROCESS"}
            </span>
            <h2
              id="how-it-works"
              className="mt-2 font-display text-3xl sm:text-4xl text-forest font-bold"
            >
              {isDe ? "So funktioniert es" : "How It Works"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="surface-card p-8 rounded-3xl border border-forest/10 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="h-12 w-12 rounded-full bg-forest text-[oklch(0.97_0.02_92)] flex items-center justify-center font-bold text-lg shadow-sm mb-6">
                    {step.num}
                  </div>
                  <h3 className="font-display text-xl font-bold text-forest mb-3">{step.title}</h3>
                  <p className="text-sm text-forest/70 leading-relaxed font-medium">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Editorial clarification note */}
          <div className="mt-8 surface-card p-6 rounded-2xl border border-forest/10 flex items-start gap-4">
            <ShieldCheck className="h-5 w-5 text-[#b28a3c] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-forest/80 leading-relaxed font-medium">
              {isDe
                ? "Nicht jede Einsendung wird veröffentlicht. Vor einer Veröffentlichung klären wir die wichtigsten Angaben, Bild- und Videorechte, eine mögliche Einladung oder Vergünstigung sowie deinen gewünschten Credit."
                : "Not every submission will be published. Before publication, we confirm the important details, photo and video rights, any invitation or discount, and your preferred credit."}
            </p>
          </div>
        </section>

        {/* Section 3: Was solltest du uns schicken? (Checklist) */}
        <section className="mb-20" aria-labelledby="submission-checklist">
          <div className="surface-card p-8 sm:p-12 rounded-3xl border border-forest/10 shadow-sm">
            <div className="max-w-2xl mb-8">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b28a3c]">
                {isDe ? "CHECKLISTE" : "CHECKLIST"}
              </span>
              <h2
                id="submission-checklist"
                className="mt-2 font-display text-3xl sm:text-4xl text-forest font-bold"
              >
                {isDe ? "Was solltest du uns schicken?" : "What Should You Send Us?"}
              </h2>
              <p className="mt-2 text-sm text-forest/70 font-medium">
                {isDe
                  ? "Damit wir deine Einsendung schnell verstehen und bearbeiten können, helfen uns diese Angaben:"
                  : "These details help us quickly review and prepare your submission:"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {checklist.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2
                    className="h-5 w-5 text-[#7FA46B] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-forest leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Community Stories (Approved Empty State) */}
        <section className="mb-20" aria-labelledby="community-stories">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-forest/10">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#b28a3c]">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                {isDe ? "AUS DER SPEISELY COMMUNITY" : "FROM THE SPEISELY COMMUNITY"}
              </span>
              <h2
                id="community-stories"
                className="mt-1 font-display text-3xl sm:text-4xl text-forest font-bold"
              >
                {isDe ? "Veröffentlichte Community Stories" : "Published Community Stories"}
              </h2>
            </div>
            <p className="text-sm text-forest/70 max-w-md font-medium">
              {isDe
                ? "Echte Entdeckungen und Berichte von Leserinnen und Lesern aus ganz Deutschland."
                : "Genuine discoveries and stories from food lovers across Germany."}
            </p>
          </div>

          {/* Approved Authentic Empty State */}
          <div className="surface-card rounded-3xl border-2 border-dashed border-forest/20 p-10 sm:p-14 text-center max-w-3xl mx-auto shadow-xs">
            <div className="h-14 w-14 rounded-full bg-[#DDEEE3] text-forest flex items-center justify-center mx-auto mb-4">
              <Clock className="h-7 w-7 text-[#b28a3c]" aria-hidden="true" />
            </div>
            <h3 className="font-display text-2xl font-bold text-forest">
              {isDe ? "Stories in Vorbereitung" : "Stories in Preparation"}
            </h3>
            <p className="mt-3 text-sm sm:text-base text-forest/75 max-w-lg mx-auto leading-relaxed font-medium">
              {isDe
                ? "Die ersten Community Stories sind unterwegs. Vielleicht beginnt die nächste mit deinem Erlebnis."
                : "The first Community Stories are on their way. Maybe the next one will begin with your experience."}
            </p>
            <div className="mt-6">
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-2 rounded-full bg-forest text-[oklch(0.97_0.02_92)] px-6 py-3 text-xs sm:text-sm font-bold shadow-md hover:bg-forest/90 transition"
              >
                <Mail className="h-4 w-4 text-[#E6B84A]" aria-hidden="true" />
                <span>{isDe ? "Erlebnis mit uns teilen" : "Share Your Experience"}</span>
              </a>
            </div>
          </div>
        </section>

        {/* Section 5: Final CTA Section */}
        <section className="relative overflow-hidden rounded-3xl bg-forest text-[oklch(0.97_0.02_92)] p-10 sm:p-16 mb-16 shadow-2xl">
          <div className="absolute inset-0 z-0 opacity-15">
            <img
              src="/hero-cinematic.webp"
              alt="Community Background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f2d896]">
              {isDe ? "MITMACHEN & TEILEN" : "PARTICIPATE & SHARE"}
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {isDe ? "Hast du etwas Leckeres entdeckt?" : "Discovered Something Delicious?"}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
              {isDe
                ? "Schick uns deinen Restaurantbesuch, deine Bilder oder deinen persönlichen Food-Tipp. Vielleicht erzählen wir deine Geschichte als Nächstes."
                : "Send us your restaurant visit, your pictures, or your personal food tip. We might feature your story next."}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-2 rounded-full bg-[#b28a3c] text-white px-8 py-4 text-sm font-bold shadow-xl shadow-[#b28a3c]/30 hover:bg-[#9a7633] hover:scale-105 transition-all"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span>{isDe ? "Per E-Mail kontaktieren" : "Contact via Email"}</span>
              </a>

              <a
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Speisely Instagram Profil (Direct Message)"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/25 text-white px-7 py-4 text-sm font-semibold hover:bg-white/20 transition-all shadow-sm"
              >
                <Instagram className="h-4 w-4 text-[#f2d896]" aria-hidden="true" />
                <span>{isDe ? "Auf Instagram schreiben" : "Message on Instagram"}</span>
              </a>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/15 text-white/90 px-6 py-4 text-sm font-semibold hover:bg-white/15 transition-all"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>{isDe ? "Andere Kontaktmöglichkeiten" : "Other Contact Options"}</span>
              </Link>
            </div>

            <p className="mt-5 text-xs text-white/60 font-medium">
              {isDe
                ? "Mit dem Senden erfolgt noch keine automatische Veröffentlichung."
                : "Sending your content does not mean it will be published automatically."}
            </p>
          </div>
        </section>

        {/* Section 6: Editorial Transparency and Safety Section */}
        <section className="surface-card p-7 sm:p-9 rounded-3xl border border-forest/10 text-xs sm:text-sm text-forest/80 leading-relaxed space-y-4">
          <div className="flex items-center gap-2 font-bold text-forest text-sm sm:text-base">
            <Lock className="h-4 w-4 text-[#b28a3c]" aria-hidden="true" />
            <span>
              {isDe
                ? "Transparenz, Moderation & Datenschutz"
                : "Transparency, Moderation & Privacy"}
            </span>
          </div>
          <p className="font-medium">
            {isDe
              ? "Community-Beiträge erzählen persönliche Erfahrungen von Menschen aus der Speisely Community. Einsendungen werden privat übermittelt und redaktionell geprüft. Sie sind nicht automatisch offizielle Speisely-Bewertungen. Nicht jede Einsendung wird veröffentlicht, und es gibt keine öffentliche Kommentar- oder Bewertungsfunktion. Vor einer Veröffentlichung klären wir die wichtigsten Angaben sowie die Nutzung der eingereichten Fotos und Videos."
              : "Community contributions share personal experiences from people in the Speisely Community. Submissions are sent privately and reviewed editorially. They are not automatically official Speisely reviews. Not every submission is published, and there is no public commenting or rating feature. Before publication, we confirm the important details and permission to use the submitted photos and videos."}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-forest/70 pt-2 border-t border-forest/10">
            <div className="flex items-center gap-2">
              <span className="text-[#7FA46B] font-bold">✓</span>
              <span>
                {isDe
                  ? "Keine automatische Veröffentlichung — jede Einsendung wird kuratiert."
                  : "No automatic publishing — every submission is editorially curated."}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#7FA46B] font-bold">✓</span>
              <span>
                {isDe
                  ? "Keine Sterne-Bewertungen oder unmoderierten Kommentarspalten."
                  : "No star rating systems or unmoderated public comment threads."}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#7FA46B] font-bold">✓</span>
              <span>
                {isDe
                  ? "Transparente Kennzeichnung bei gesponserten oder vergünstigten Besuchen."
                  : "Transparent disclosure of sponsored, complimentary, or discounted experiences."}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#7FA46B] font-bold">✓</span>
              <span>
                {isDe
                  ? "Persönliche Kontaktdaten werden niemals ohne Erlaubnis veröffentlicht."
                  : "Personal contact information is never published without explicit consent."}
              </span>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
