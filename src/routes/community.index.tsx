import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/PageHero";
import { useI18n } from "@/i18n/I18nProvider";
import {
  Mail,
  Instagram,
  Utensils,
  PartyPopper,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Camera,
  Shield,
  Send,
} from "lucide-react";

export const Route = createFileRoute("/community/")({
  head: () => ({
    meta: [
      {
        title: "Speisely Community – Echte Erlebnisse, Fotos & Food Stories | Speisely",
      },
      {
        name: "description",
        content:
          "Entdecke echte Restaurantbesuche, Catering-Erlebnisse und Food-Momente aus der Speisely Community. Teile deine eigenen Fotos, Videos und Geschichten mit uns.",
      },
      {
        property: "og:title",
        content: "Speisely Community – Echte Erlebnisse, Fotos & Food Stories",
      },
      {
        property: "og:description",
        content:
          "Entdecke echte Restaurantbesuche, Catering-Erlebnisse und Food-Momente aus der Speisely Community. Teile deine eigenen Fotos, Videos und Geschichten mit uns.",
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

  const shareCategories = isDe
    ? [
        {
          icon: Utensils,
          title: "Restaurant & Café",
          desc: "Restaurantbesuche, Cafés, besondere Gerichte und lokale Entdeckungen.",
        },
        {
          icon: PartyPopper,
          title: "Catering",
          desc: "Catering-Erlebnisse bei Feiern, Hochzeiten, Firmenveranstaltungen oder privaten Anlässen.",
        },
        {
          icon: Sparkles,
          title: "Food Events & persönliche Geschichten",
          desc: "Food Events, Märkte, Festivals, Familientraditionen und persönliche Food-Momente.",
        },
      ]
    : [
        {
          icon: Utensils,
          title: "Restaurant & Café",
          desc: "Restaurant visits, cafés, memorable dishes and local discoveries.",
        },
        {
          icon: PartyPopper,
          title: "Catering",
          desc: "Catering experiences at celebrations, weddings, corporate events or private occasions.",
        },
        {
          icon: Sparkles,
          title: "Food Events & Personal Stories",
          desc: "Food events, markets, festivals, family traditions and personal food moments.",
        },
      ];

  const steps = isDe
    ? [
        {
          num: "1",
          title: "1. Erlebnis teilen",
          body: "Schick uns deine Geschichte und deine eigenen Fotos oder Videos per E-Mail oder Instagram.",
        },
        {
          num: "2",
          title: "2. Redaktionelle Prüfung",
          body: "Wir prüfen die Angaben, Medienrechte und den Veröffentlichungsstatus.",
        },
        {
          num: "3",
          title: "3. Community Story",
          body: "Wenn die Einsendung zu Speisely passt, kann daraus mit deiner Erlaubnis eine Story, ein Artikel, Post oder Reel entstehen.",
        },
      ]
    : [
        {
          num: "1",
          title: "1. Share your experience",
          body: "Send us your story and your own photos or videos by email or Instagram.",
        },
        {
          num: "2",
          title: "2. Editorial review",
          body: "We review the information, media rights and publication status.",
        },
        {
          num: "3",
          title: "3. Community Story",
          body: "If the submission is suitable for Speisely, it may—with your permission—become a story, article, post or reel.",
        },
      ];

  const checklistItems = isDe
    ? [
        "Restaurant, Caterer, Event oder Ort",
        "Stadt und ungefähres Datum",
        "Deine persönliche Geschichte",
        "Was du bestellt, entdeckt oder erlebt hast",
        "Eigene Fotos oder Videos",
        "Gewünschter Credit",
        "Information über Einladung, Rabatt oder Sponsoring",
      ]
    : [
        "Restaurant, caterer, event or location",
        "City and approximate date",
        "Your personal story",
        "What you ordered, discovered or experienced",
        "Your own photos or videos",
        "Preferred credit",
        "Information about invitation, discount or sponsorship",
      ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://speisely.de/community",
        url: "https://speisely.de/community",
        name: isDe
          ? "Speisely Community – Echte Erlebnisse, Fotos & Food Stories"
          : "Speisely Community – Genuine Experiences, Photos & Food Stories",
        description: isDe
          ? "Entdecke echte Restaurantbesuche, Catering-Erlebnisse und Food-Momente aus der Speisely Community."
          : "Discover genuine restaurant visits, catering experiences and food moments from the Speisely Community.",
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

      {/* 2. Hero with Email and Instagram CTAs */}
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
            ? "Du hast ein Restaurant entdeckt, ein besonderes Catering erlebt oder einen unvergesslichen Food-Moment festgehalten? Teile deine Erfahrung, Fotos, Videos und die Geschichte dahinter mit der Speisely Community."
            : "Discovered a restaurant, enjoyed a memorable catering experience or captured a special food moment? Share your experience, photos, videos and the story behind them with the Speisely Community."
        }
        primaryCta={{
          label: isDe ? "Erlebnis mit uns teilen" : "Share Your Experience",
          href: mailtoHref,
        }}
        secondaryCta={{
          label: isDe ? "Auf Instagram schreiben" : "Message on Instagram",
          href: instagramHref,
        }}
      />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24 pt-8">
        {/* Breadcrumb Navigation */}
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

        {/* 3. Featured Community Story Section (Directly Below Hero) */}
        <section className="mb-20" aria-labelledby="featured-community-story">
          <div className="surface-card rounded-3xl border border-forest/10 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Image Side (55% on desktop) */}
              <div className="lg:col-span-7 relative min-h-[280px] sm:min-h-[360px] lg:min-h-[420px] bg-black/5 overflow-hidden">
                <img
                  src="/magazin/harput-wiesbaden/harput-fisch.jpg"
                  alt={
                    isDe
                      ? "Ein Grillabend bei Harput in Wiesbaden"
                      : "An Evening at Harput in Wiesbaden"
                  }
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/90 backdrop-blur-md text-[oklch(0.97_0.02_92)] px-3.5 py-1.5 text-xs font-bold shadow-md">
                    <Sparkles className="h-3.5 w-3.5 text-[#f2d896]" aria-hidden="true" />
                    {isDe ? "Aus der Speisely Community" : "From the Speisely Community"}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 rounded-md bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 text-[11px] font-medium">
                  📸 Speisely Community
                </div>
              </div>

              {/* Story Content Side (45% on desktop) */}
              <div className="lg:col-span-5 p-7 sm:p-9 lg:p-10 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#b28a3c] uppercase mb-2.5">
                    <span>{isDe ? "NEU AUS DER COMMUNITY" : "NEW FROM THE COMMUNITY"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-forest/60 mb-3">
                    <MapPin className="h-3.5 w-3.5 text-[#b28a3c]" aria-hidden="true" />
                    <span>Wiesbaden</span>
                    <span>•</span>
                    <span>{isDe ? "Selbst bezahlt" : "Self-paid"}</span>
                  </div>

                  <h2
                    id="featured-community-story"
                    className="font-display text-2xl sm:text-3xl font-bold text-forest leading-tight mb-4"
                  >
                    {isDe
                      ? "Ein Grillabend bei Harput in Wiesbaden"
                      : "An Evening at Harput in Wiesbaden"}
                  </h2>

                  <p className="text-sm sm:text-base text-forest/75 leading-relaxed font-medium mb-6">
                    {isDe
                      ? "Zwei Teller, ein gemeinsamer Abend und ein Food-Moment aus Wiesbaden: Ein Mitglied der Speisely Community teilt seinen Besuch bei Harput."
                      : "Two plates, one shared evening and a food moment from Wiesbaden: a member of the Speisely Community shares their visit to Harput."}
                  </p>
                </div>

                <div>
                  <Link
                    to="/magazin/community/harput-wiesbaden"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-forest text-[oklch(0.97_0.02_92)] px-7 py-3.5 text-xs sm:text-sm font-bold shadow-md hover:bg-forest/90 hover:gap-3 transition-all"
                  >
                    <span>{isDe ? "Story lesen" : "Read the Story"}</span>
                    <ArrowRight className="h-4 w-4 text-[#f2d896]" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Short Community Explanation */}
        <section className="mb-20" aria-labelledby="what-is-community">
          <div className="surface-card p-8 sm:p-10 rounded-3xl border border-forest/10 max-w-4xl mx-auto shadow-xs">
            <h2
              id="what-is-community"
              className="font-display text-2xl sm:text-3xl font-bold text-forest mb-4"
            >
              {isDe ? "Was ist die Speisely Community?" : "What is the Speisely Community?"}
            </h2>
            <p className="text-base sm:text-lg text-forest/80 leading-relaxed font-medium">
              {isDe
                ? "Die Speisely Community sammelt echte Erfahrungen rund um Restaurants, Catering und Food Events. Menschen aus verschiedenen Städten teilen ihre eigenen Fotos, Videos und persönlichen Geschichten mit uns. Aus ausgewählten Einsendungen entstehen redaktionelle Community Stories, Artikel, Posts oder Reels."
                : "The Speisely Community collects genuine experiences involving restaurants, catering and food events. People from different cities share their own photos, videos and personal stories with us. Selected submissions may become editorial Community Stories, articles, posts or reels."}
            </p>
          </div>
        </section>

        {/* 5. What People Can Share (3 Clear Categories) */}
        <section className="mb-20" aria-labelledby="share-categories">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b28a3c]">
              {isDe ? "THEMEN & KATEGORIEN" : "TOPICS & CATEGORIES"}
            </span>
            <h2
              id="share-categories"
              className="mt-2 font-display text-3xl sm:text-4xl text-forest font-bold"
            >
              {isDe ? "Was kannst du teilen?" : "What Can You Share?"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shareCategories.map((cat, idx) => {
              const IconComp = cat.icon;
              return (
                <div
                  key={idx}
                  className="surface-card p-7 rounded-3xl border border-forest/10 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="h-12 w-12 rounded-2xl bg-[#DDEEE3] flex items-center justify-center text-forest mb-5">
                      <IconComp className="h-6 w-6 text-forest" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-forest mb-2.5">
                      {cat.title}
                    </h3>
                    <p className="text-sm text-forest/70 leading-relaxed font-medium">{cat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-sm sm:text-base text-forest/75 font-medium max-w-xl mx-auto">
            {isDe
              ? "Teile deine Erfahrung mit deinen eigenen Fotos oder Videos und erzähle uns die Geschichte dahinter."
              : "Share your experience with your own photos or videos and tell us the story behind it."}
          </p>
        </section>

        {/* 6. How It Works (Concise 3 Steps) */}
        <section className="mb-20" aria-labelledby="how-it-works">
          <div className="text-center max-w-2xl mx-auto mb-10">
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
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="surface-card p-7 sm:p-8 rounded-3xl border border-forest/10 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="h-11 w-11 rounded-full bg-forest text-[oklch(0.97_0.02_92)] flex items-center justify-center font-bold text-base shadow-xs mb-5">
                    {step.num}
                  </div>
                  <h3 className="font-display text-lg font-bold text-forest mb-2.5">
                    {step.title}
                  </h3>
                  <p className="text-sm text-forest/70 leading-relaxed font-medium">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Compact Submission Checklist and Media Notice (2-Column Block) */}
        <section className="mb-20" aria-labelledby="submission-requirements">
          <div className="surface-card p-8 sm:p-10 lg:p-12 rounded-3xl border border-forest/10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left Column: Checklist (7 items) */}
              <div className="lg:col-span-7">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b28a3c]">
                  {isDe ? "ÜBERSICHT" : "OVERVIEW"}
                </span>
                <h2
                  id="submission-requirements"
                  className="mt-1 font-display text-2xl sm:text-3xl text-forest font-bold mb-6"
                >
                  {isDe ? "Was brauchen wir von dir?" : "What do we need from you?"}
                </h2>

                <div className="space-y-3">
                  {checklistItems.map((item, idx) => (
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

              {/* Right Column: Media-Rights Notice Box */}
              <div className="lg:col-span-5 rounded-2xl border border-[#b28a3c]/30 bg-[#FAF7F0] p-6 sm:p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-forest font-bold mb-3">
                    <Camera className="h-5 w-5 text-[#b28a3c]" aria-hidden="true" />
                    <h3 className="font-display text-base font-bold text-forest">
                      {isDe
                        ? "Wichtig für deine Fotos und Videos"
                        : "Important information about your photos and videos"}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-forest/80 leading-relaxed font-medium">
                    {isDe
                      ? "Bitte sende uns nur Fotos und Videos, die du selbst aufgenommen hast. Darauf dürfen entweder keine identifizierbaren Personen oder ausschließlich du selbst zu sehen sein. Vor einer Veröffentlichung klären wir mit dir schriftlich, wie Speisely die ausgewählten Inhalte verwenden darf."
                      : "Please send us only photos and videos that you created yourself. They must show either no identifiable people or only you. Before publication, we will confirm with you in writing how Speisely may use the selected content."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Single Transparency Note */}
        <section className="mb-20" aria-label="Transparency Policy">
          <div className="surface-card p-6 sm:p-7 rounded-3xl border border-forest/10 flex items-start gap-4 bg-white/80">
            <Shield className="h-5 w-5 text-[#7FA46B] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs sm:text-sm text-forest/75 leading-relaxed font-medium">
              {isDe
                ? "Community-Beiträge erzählen persönliche Erfahrungen von Menschen aus der Speisely Community. Sie werden privat eingereicht und vor einer Veröffentlichung redaktionell geprüft. Nicht jede Einsendung wird veröffentlicht. Es gibt keine öffentliche Kommentar-, Bewertungs- oder Rankingfunktion."
                : "Community contributions share personal experiences from people in the Speisely Community. They are submitted privately and reviewed editorially before publication. Not every submission is published. There is no public commenting, rating or ranking feature."}
            </p>
          </div>
        </section>

        {/* 9. Final CTA */}
        <section className="relative overflow-hidden rounded-3xl bg-forest text-[oklch(0.97_0.02_92)] p-8 sm:p-14 text-center shadow-2xl">
          <div className="absolute inset-0 z-0 opacity-15">
            <img
              src="/hero-cinematic.webp"
              alt="Community Background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 mx-auto max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f2d896]">
              {isDe ? "MITMACHEN & TEILEN" : "PARTICIPATE & SHARE"}
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {isDe ? "Deine Geschichte könnte die nächste sein." : "Your story could be next."}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-white/80 max-w-lg mx-auto leading-relaxed font-medium">
              {isDe
                ? "Teile dein Restaurant-, Catering- oder Eventerlebnis mit deinen eigenen Fotos oder Videos."
                : "Share your restaurant, catering or event experience with your own photos or videos."}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-2 rounded-full bg-[#b28a3c] text-white px-7 py-3.5 text-xs sm:text-sm font-bold shadow-xl shadow-[#b28a3c]/30 hover:bg-[#9a7633] transition-all"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span>{isDe ? "Erlebnis per E-Mail teilen" : "Share Your Experience"}</span>
              </a>

              <a
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Speisely Instagram Profil"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/25 text-white px-6 py-3.5 text-xs sm:text-sm font-semibold hover:bg-white/20 transition-all"
              >
                <Instagram className="h-4 w-4 text-[#f2d896]" aria-hidden="true" />
                <span>{isDe ? "Auf Instagram schreiben" : "Message Us on Instagram"}</span>
              </a>
            </div>

            <p className="mt-4 text-[11px] text-white/50 font-medium">
              {isDe
                ? "Mit dem Senden erfolgt noch keine automatische Veröffentlichung."
                : "Sending your content does not mean it will be published automatically."}
            </p>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
