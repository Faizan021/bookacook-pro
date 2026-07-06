import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Calendar, Heart, ShieldCheck, Star, Users, ArrowRight, UtensilsCrossed } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { useI18n } from "@/i18n/I18nProvider";
import { B2bCateringDialog } from "@/components/B2bCateringDialog";
import { PageHero } from "@/components/PageHero";


export const Route = createFileRoute("/catering/events")({
  head: () => ({
    meta: [
      { title: "Premium Event-Catering für Hochzeiten & Firmenfeiern — Speisely" },
      {
        name: "description",
        content: "Plane dein perfektes Event mit unseren geprüften Caterern. Von exklusiven Hochzeitsbuffets bis hin zu kreativem Fingerfood für Business-Veranstaltungen und private Feiern.",
      },
      { property: "og:title", content: "Premium Event- & Hochzeits-Catering — Speisely" },
      {
        property: "og:description",
        content: "Geprüfte Caterer für Hochzeiten, Firmenfeiern und Privates Plating. Jetzt vergleichen und unverbindlich anfragen.",
      },
      { property: "og:url", content: "/catering/events" },
    ],
    links: [{ rel: "canonical", href: "/catering/events" }],
  }),
  component: EventsCatering,
});

function EventsCatering() {
  const { lang } = useI18n();
  const [b2bOpen, setB2bOpen] = useState(false);

  return (
    <SiteShell>
      <PageHero
        eyebrow={lang === "de" ? "EINMALIGE EVENTS & FEIERLICHKEITEN" : "ONE-OFF EVENTS & CELEBRATIONS"}
        heading={
          lang === "de" ? (
            <>Unvergessliche Momente<br />mit <span className="text-[#f2d896]">Premium Event-Catering.</span></>
          ) : (
            <>Unforgettable moments<br />with <span className="text-[#f2d896]">premium event catering.</span></>
          )
        }
        subtext={
          lang === "de"
            ? "Egal ob traumhafte Hochzeit, exklusive Firmenfeier oder privates Fine Dining zu Hause – wir verbinden dich mit geprüften Food-Partnern, die deine Vision kulinarisch Wirklichkeit werden lassen."
            : "Whether it is a dream wedding, an exclusive corporate party, or private fine dining at home – we connect you with vetted food partners who turn your culinary vision into reality."
        }
        primaryCta={{ label: lang === "de" ? "Event-Caterer finden" : "Discover Event Caterers", href: "/catering" }}
        secondaryCta={{ label: lang === "de" ? "Daily Catering Subscriptions" : "Daily Catering Subscriptions", onClick: () => setB2bOpen(true) }}
        imageUrl="/images/event_catering_hero.png"
        imageAlt="Elegant Rustic Event and Wedding Tablescape"
      />


      {/* Event Formats (Weddings, Private Plating, Business Events) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16 md:py-24 border-b border-[#eadfce]/30">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest">{lang === "de" ? "UNSERE FORMATS" : "OUR FORMATS"}</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-forest">
            {lang === "de" ? "Kreative Genusskonzepte für dein Event" : "Creative Culinary Concepts for Your Event"}
          </h2>
          <p className="text-sm text-forest/70 leading-relaxed">
            {lang === "de"
              ? "Vom lockeren Get-Together bis zur glamourösen Gala – wir stimmen das Menü-Design exakt auf den Charakter deiner Veranstaltung ab."
              : "From casual get-togethers to glamorous galas – we align the menu design precisely with the character of your event."}
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Wedding */}
          <div className="surface-card p-8 rounded-3xl border border-[#eadfce]/45 flex flex-col justify-between text-left">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-forest">
                {lang === "de" ? "Hochzeiten & Jubiläen" : "Weddings & Anniversaries"}
              </h3>
              <p className="text-sm text-forest/75 leading-relaxed">
                {lang === "de"
                  ? "Mehrgängige Festmenüs, reichhaltige Grillbuffets und Sektempfänge. Wir begleiten euren großen Tag mit Liebe zum Detail und erstklassigem Service."
                  : "Multi-course festive dinners, lavish live BBQ buffets, and champagne receptions. We support your special day with passion and outstanding service."}
              </p>
            </div>
          </div>

          {/* Corporate Event */}
          <div className="surface-card p-8 rounded-3xl border border-[#eadfce]/45 flex flex-col justify-between text-left">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-forest">
                {lang === "de" ? "Firmenfeiern & Gala-Abende" : "Corporate Parties & Galas"}
              </h3>
              <p className="text-sm text-forest/75 leading-relaxed">
                {lang === "de"
                  ? "Repräsentative Food-Stände, Fingerfood-Variationen und saisonale Highlights für Weihnachtsfeiern, Sommerfeste und Firmenjubiläen."
                  : "Impressive live food stations, diverse finger food selections, and seasonal highlights for corporate celebrations and anniversaries."}
              </p>
            </div>
          </div>

          {/* Private Dining / Business Lunch */}
          <div className="surface-card p-8 rounded-3xl border border-[#eadfce]/45 flex flex-col justify-between text-left">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-forest">
                {lang === "de" ? "Privat-Dinner & Business Lunch" : "Private Dinner & Business Lunch"}
              </h3>
              <p className="text-sm text-forest/75 leading-relaxed">
                {lang === "de"
                  ? "Exklusive Dinner-Erlebnisse in vertrauter Runde oder produktive Meetings. Frisch zubereitet von privaten Spitzenköchen direkt vor Ort."
                  : "Exclusive private dining in intimate circles or productive meetings. Freshly prepared on-site by top private chefs."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mid-Page Call-To-Action (Event-Led Theme) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16">
        <div className="rounded-[2.5rem] bg-forest p-8 sm:p-12 text-cream flex flex-col md:grid md:grid-cols-[1.2fr_0.8fr] items-center gap-12 relative overflow-hidden shadow-xl border border-forest/10">
          <div className="relative z-10 space-y-5 text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-cream/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cream backdrop-blur-sm">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {lang === "de" ? "KULINARISCHE SPITZENKLASSE" : "CULINARY EXCELLENCE"}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-mint leading-tight">
              {lang === "de" ? "Vergleiche die besten Angebote live" : "Compare the Best Quotes Live"}
            </h2>
            <p className="text-cream/80 text-sm sm:text-base leading-relaxed">
              {lang === "de"
                ? "Keine versteckten Gebühren. Auf Speisely fragst du Caterer direkt an und erhältst maßgeschneiderte, transparente Menü-Pakete für dein Budget."
                : "No hidden fees. Request custom proposals directly from vetted caterers on Speisely for transparent menu pricing adjusted to your budget."}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/catering"
                className="rounded-full bg-mint px-6 py-3.5 text-sm font-semibold text-forest hover:bg-white transition cursor-pointer shadow-md flex items-center gap-2"
              >
                {lang === "de" ? "Event-Caterer vergleichen" : "Compare Event Caterers"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={() => setB2bOpen(true)}
                className="rounded-full border border-cream/20 bg-transparent hover:bg-cream/10 px-6 py-3.5 text-sm font-semibold text-cream transition"
              >
                {lang === "de" ? "Daily Catering Subscriptions" : "Daily Catering Subscriptions"}
              </button>
            </div>
          </div>
          <div className="relative z-10 w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 hidden md:block">
            <img
              src="/images/business_lunch_plating.png"
              alt="High-end fine dining event plating"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-cream/10 py-16 md:py-24 border-t border-b border-[#eadfce]/30 text-left">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="max-w-2xl space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest">{lang === "de" ? "ABLAUF" : "HOW IT WORKS"}</span>
            <h2 className="text-3xl font-display font-bold text-forest">{lang === "de" ? "In 3 Schritten zum perfekten Event-Menü" : "In 3 Steps to Your Perfect Event Menu"}</h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <div className="space-y-3">
              <div className="text-4xl font-display font-bold text-forest">01</div>
              <h4 className="font-bold text-forest text-base">{lang === "de" ? "Caterer auswählen" : "Select Caterer"}</h4>
              <p className="text-xs text-forest/70 leading-relaxed">{lang === "de" ? "Filtere nach Anlass, Personenanzahl und Ort, und entdecke unsere geprüften Partner." : "Filter by occasion, guest count, and location, and explore our verified catering partners."}</p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-display font-bold text-forest">02</div>
              <h4 className="font-bold text-forest text-base">{lang === "de" ? "Konzept anfordern" : "Request Proposal"}</h4>
              <p className="text-xs text-forest/70 leading-relaxed">{lang === "de" ? "Wähle ein vordefiniertes Menü oder frage ein individuelles Konzept an. Kostenlos & unverbindlich." : "Choose a predefined package or request a custom menu path. Free of charge & non-binding."}</p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-display font-bold text-forest">03</div>
              <h4 className="font-bold text-forest text-base">{lang === "de" ? "Genießen" : "Celebrate & Enjoy"}</h4>
              <p className="text-xs text-forest/70 leading-relaxed">{lang === "de" ? "Besprich letzte Details direkt mit dem Caterer. Pünktliche Lieferung und Aufbau vor Ort sind garantiert." : "Clarify details directly with the food partner. Logistical accuracy and on-site setup are fully guaranteed."}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Block (Event-Led Theme) */}
      <section className="bg-cream/40 py-16 border-t border-[#eadfce]/30 text-center">
        <div className="mx-auto max-w-3xl px-4 space-y-6">
          <h2 className="text-3xl font-display font-bold text-forest">
            {lang === "de" ? "Lass uns etwas Großartiges kreieren." : "Let's Create Something Extraordinary."}
          </h2>
          <p className="text-sm text-forest/75 max-w-lg mx-auto">
            {lang === "de"
              ? "Vergleiche jetzt geprüfte Caterer für deine Hochzeit oder Firmenfeier und starte unverbindlich deine Anfrage."
              : "Compare vetted catering partners for your wedding or corporate event and send your request today."}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/catering"
              className="rounded-full bg-forest text-cream hover:opacity-95 px-6 py-3.5 text-sm font-semibold shadow-md transition cursor-pointer flex items-center gap-2"
            >
              {lang === "de" ? "Event-Caterer entdecken" : "Discover Event Caterers"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setB2bOpen(true)}
              className="rounded-full bg-[#22C55E] hover:bg-[#22C55E]/90 text-white px-6 py-3.5 text-sm font-semibold shadow-md transition cursor-pointer"
            >
              {lang === "de" ? "Daily Catering Subscriptions" : "Daily Catering Subscriptions"}
            </button>
          </div>
        </div>
      </section>

      {/* Reusable B2b Dialog */}
      <B2bCateringDialog open={b2bOpen} onOpenChange={setB2bOpen} />
    </SiteShell>
  );
}
