import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Linkedin, Instagram, ArrowRight } from "lucide-react";
import { SpeiselyLogo } from "./SpeiselyLogo";
import { useI18n } from "@/i18n/I18nProvider";

export function SiteFooter() {
  const { t, lang } = useI18n();
  const [email, setEmail] = useState("");
  const isDe = lang === "de";

  // SSR-rendered Community & Partner Index Links (100% depth-1 Googlebot & AI discovery, zero orphan URLs)
  const berlinStories = [
    { label: "King Tut Berlin", to: "/magazin/community/king-tut-restaurant-berlin" },
    { label: "Baba Pirzola Berlin", to: "/magazin/community/baba-pirzola-berlin" },
    {
      label: "Mandy Restaurant Berlin",
      to: "/magazin/speisely-visits/mandy-restaurant-berlin-neukoelln",
    },
    { label: "Shawarma Albaik Berlin", to: "/magazin/speisely-visits/shawarma-albaik-berlin" },
    { label: "bb.q Chicken Kreuzberg", to: "/magazin/community/bbq-chicken-berlin-kreuzberg" },
    { label: "San Sebastian Berlin", to: "/magazin/community/san-sebastian-berlin" },
    { label: "Lumara Café Berlin", to: "/magazin/community/lumara-cafe-berlin" },
    { label: "Neumanns Café Berlin", to: "/magazin/community/neumanns-cafe-berlin" },
    { label: "Garçon de Café Berlin", to: "/magazin/community/garcon-de-cafe-berlin" },
    { label: "Thronburger Berlin", to: "/magazin/community/thronburger-berlin" },
    { label: "Kokio Berlin", to: "/magazin/community/kokio-berlin" },
    { label: "Al Zaeem Berlin", to: "/magazin/community/alzaeem-restaurant-berlin" },
  ];

  const regionalStories = [
    { label: "Seydioğlu Baklava Frankfurt", to: "/magazin/community/seydioglu-baklava-burger" },
    { label: "Nadir Güllü München", to: "/magazin/speisely-visits/nadir-gullu-baklava-muenchen" },
    { label: "La Grilladine Düsseldorf", to: "/magazin/community/la-grilladine-duesseldorf" },
    { label: "Chicken Krush Prag", to: "/magazin/community/chicken-krush-prag" },
    { label: "Ariana Frankfurt", to: "/magazin/community/ariana-restaurant-frankfurt" },
    { label: "Harput Wiesbaden", to: "/magazin/community/harput-wiesbaden" },
    { label: "Schnitzel Schmiede", to: "/magazin/schnitzel-schmiede" },
    { label: "Speisely Visits Übersicht", to: "/magazin/speisely-visits" },
    { label: "Mediadaten & Werbepartner", to: "/magazin/mediadaten" },
  ];

  const catererAndGuideLinks = [
    { label: "Meeting- & Office Catering bestellen", to: "/catering" },
    { label: "Catering Konfigurator & Menü-Filter", to: "/catering" },
    { label: "Event-Catering & Buffets", to: "/catering/events" },
    { label: "Büroverpflegung & Subscriptions", to: "/catering/daily-catering-subscriptions" },
    { label: "Groß- & Kitaverpflegung", to: "/catering/institutional-catering" },
    { label: "Halal Catering & Buffets", to: "/catering/halal" },
    { label: "Fingerfood & Flying Buffet", to: "/catering/fingerfood" },
    { label: "Maison Verde Catering", to: "/catering/maison-verde" },
    { label: "Partyservice Küpper", to: "/catering/partyservice-kuepper" },
    { label: "Stadt-Tafel Catering", to: "/catering/stadt-tafel" },
    { label: "Veedo's Kitchen Köln", to: "/catering/veedos-kitchen" },
    { label: "Olivenhain Catering", to: "/catering/olivenhain" },
    {
      label: "Meeting- & Firmencatering Guide",
      to: "/blog/catering-firmenevents-deutschland-2026",
    },
    { label: "Catering-Preise vergleichen", to: "/blog/catering-preise-vergleichen-deutschland" },
    {
      label: "Hochzeit planen Leitfaden",
      to: "/blog/hochzeit-planen-catering-musik-ablauf-budget",
    },
    { label: "Eventplaner Kosten Guide", to: "/blog/was-kostet-ein-eventplaner" },
  ];

  return (
    <footer className="mt-24 bg-forest text-[oklch(0.97_0.02_92)]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-5">
        {/* Brand */}
        <div>
          <SpeiselyLogo variant="light" />
          <p className="mt-4 text-sm leading-relaxed text-[oklch(0.97_0.02_92)]/70 max-w-xs">
            {t("footer.tag")}
          </p>
        </div>

        {/* Discover */}
        <FooterCol
          title={t("footer.discover")}
          items={[
            {
              label: isDe ? "Lokale Restaurants" : "Local Restaurants",
              to: "/restaurants",
            },
            { label: t("nav.catering"), to: "/catering" },
            { label: t("Event-Planer", "Event Planner"), to: "/planner" },
            { label: "Magazin", to: "/magazin" },
            { label: "Speisely Community", to: "/community" },
            { label: "FAQ", to: "/faq" },
            { label: "Blog", to: "/blog" },
          ]}
        />

        {/* Business */}
        <div>
          <h3 className="text-xs uppercase tracking-[0.18em] font-sans font-semibold mb-4 text-[oklch(0.97_0.02_92)]/75">
            {t("footer.business")}
          </h3>

          <ul className="space-y-2.5 text-sm">
            <FooterLink to="/partners" label={t("nav.partners")} />
            <FooterLink
              to="/partner/webseiten"
              label={isDe ? "Kostenlose Gastro-Websites" : "Free Gastro Websites"}
            />
            <FooterLink
              to="/case-study/haus-spaas"
              label={isDe ? "Case Study: Haus Spaas" : "Case Study: Haus Spaas"}
            />
            <FooterLink
              to="/case-study/partyservice-kuepper"
              label={isDe ? "Case Study: Partyservice Küpper" : "Case Study: Küpper BBQ"}
            />
            <FooterLink to="/speisely" label={t("Was ist Speisely?", "What is Speisely?")} />
            <FooterLink to="/about" label={t("nav.about")} />
            <FooterLink to="/magazin" label={t("Presse & Magazin", "Press & Magazine")} />
            <FooterLink to="/contact" label={t("Kontakt & Hilfe", "Contact & Help")} />
          </ul>

          <div className="mt-5 flex gap-3">
            <a
              href="https://www.linkedin.com/company/speisely"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="h-9 w-9 grid place-items-center rounded-full bg-[oklch(0.97_0.02_92)]/10 hover:bg-[oklch(0.97_0.02_92)]/20 transition-colors"
            >
              <Linkedin className="h-4 w-4" />
            </a>

            <a
              href="https://www.instagram.com/speisely/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="h-9 w-9 grid place-items-center rounded-full bg-[oklch(0.97_0.02_92)]/10 hover:bg-[oklch(0.97_0.02_92)]/20 transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Top Locations (SSR rendered for instant Googlebot crawl - Structured City Hubs) */}
        <div>
          <h3 className="text-xs uppercase tracking-[0.18em] font-sans font-semibold mb-4 text-[oklch(0.97_0.02_92)]/75">
            {isDe ? "Städte & Regionen" : "Cities & Regions"}
          </h3>
          <ul className="space-y-3.5 text-xs">
            <li className="pb-2 border-b border-white/5">
              <span className="block font-semibold text-white/95 mb-1 text-sm">Berlin</span>
              <div className="flex items-center gap-2">
                <Link
                  to="/catering/ort/$city"
                  params={{ city: "berlin" }}
                  className="text-[oklch(0.97_0.02_92)]/75 hover:text-white hover:underline underline-offset-2 transition-colors"
                >
                  Catering
                </Link>
                <span className="text-white/30">·</span>
                <Link
                  to="/restaurant/ort/$city"
                  params={{ city: "berlin" }}
                  className="text-[oklch(0.97_0.02_92)]/75 hover:text-white hover:underline underline-offset-2 transition-colors"
                >
                  Restaurants
                </Link>
              </div>
            </li>
            <li className="pb-2 border-b border-white/5">
              <span className="block font-semibold text-white/95 mb-1 text-sm">München</span>
              <div className="flex items-center gap-2">
                <Link
                  to="/catering/ort/$city"
                  params={{ city: "muenchen" }}
                  className="text-[oklch(0.97_0.02_92)]/75 hover:text-white hover:underline underline-offset-2 transition-colors"
                >
                  Catering
                </Link>
                <span className="text-white/30">·</span>
                <Link
                  to="/restaurant/ort/$city"
                  params={{ city: "muenchen" }}
                  className="text-[oklch(0.97_0.02_92)]/75 hover:text-white hover:underline underline-offset-2 transition-colors"
                >
                  Restaurants
                </Link>
              </div>
            </li>
            <li className="pb-2 border-b border-white/5">
              <span className="block font-semibold text-white/95 mb-1 text-sm">Hamburg</span>
              <div className="flex items-center gap-2">
                <Link
                  to="/catering/ort/$city"
                  params={{ city: "hamburg" }}
                  className="text-[oklch(0.97_0.02_92)]/75 hover:text-white hover:underline underline-offset-2 transition-colors"
                >
                  Catering
                </Link>
                <span className="text-white/30">·</span>
                <Link
                  to="/restaurant/ort/$city"
                  params={{ city: "hamburg" }}
                  className="text-[oklch(0.97_0.02_92)]/75 hover:text-white hover:underline underline-offset-2 transition-colors"
                >
                  Restaurants
                </Link>
              </div>
            </li>
            <li className="pb-2 border-b border-white/5">
              <span className="block font-semibold text-white/95 mb-1 text-sm">Frankfurt</span>
              <div>
                <Link
                  to="/catering/ort/$city"
                  params={{ city: "frankfurt" }}
                  className="text-[oklch(0.97_0.02_92)]/75 hover:text-white hover:underline underline-offset-2 transition-colors"
                >
                  Catering
                </Link>
              </div>
            </li>
            <li className="pt-1">
              <span className="block text-[10px] uppercase tracking-wider text-[#E6B84A] font-semibold mb-1">
                Weitere Städte
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link
                  to="/catering/ort/$city"
                  params={{ city: "koeln" }}
                  className="text-[oklch(0.97_0.02_92)]/75 hover:text-white hover:underline underline-offset-2 transition-colors"
                >
                  Köln
                </Link>
                <span className="text-white/30">·</span>
                <Link
                  to="/catering/ort/$city"
                  params={{ city: "duesseldorf" }}
                  className="text-[oklch(0.97_0.02_92)]/75 hover:text-white hover:underline underline-offset-2 transition-colors"
                >
                  Düsseldorf
                </Link>
                <span className="text-white/30">·</span>
                <Link
                  to="/catering/ort/$city"
                  params={{ city: "stuttgart" }}
                  className="text-[oklch(0.97_0.02_92)]/75 hover:text-white hover:underline underline-offset-2 transition-colors"
                >
                  Stuttgart
                </Link>
              </div>
            </li>
          </ul>
        </div>

        {/* Legal & Newsletter */}
        <div>
          <h3 className="text-xs uppercase tracking-[0.18em] font-sans font-semibold mb-4 text-[oklch(0.97_0.02_92)]/75">
            {t("footer.legal")}
          </h3>

          <ul className="space-y-2.5 text-sm">
            <FooterLink to="/contact" label={t("nav.contact")} />
            <FooterLink to="/impressum" label={t("footer.imprint")} />
            <FooterLink to="/datenschutz" label={t("footer.privacy")} />
            <FooterLink to="/nutzungsbedingungen" label={t("footer.terms")} />
          </ul>

          <div className="mt-6">
            <p className="font-display text-lg text-[oklch(0.97_0.02_92)] font-semibold">
              Stay updated
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmail("");
              }}
              className="mt-3 flex items-center gap-2 rounded-full bg-[oklch(0.97_0.02_92)]/10 p-1 pl-4 ring-1 ring-[oklch(0.97_0.02_92)]/15 focus-within:ring-[oklch(0.97_0.02_92)]/40 transition"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                aria-label="Email address"
                className="flex-1 bg-transparent text-sm text-[oklch(0.97_0.02_92)] placeholder:text-[oklch(0.97_0.02_92)]/75 outline-none min-w-0"
              />

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full bg-cream text-forest px-4 py-2 text-xs font-medium hover:opacity-90 transition"
              >
                Subscribe <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* SSR Luxury Editorial Directory Hub (Replaces messy link clouds, preserves 100% SEO crawl depth) */}
      <div className="border-t border-[oklch(0.97_0.02_92)]/10 bg-black/15">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[oklch(0.97_0.02_92)]/10">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#E6B84A]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E6B84A] animate-pulse" />
                Speisely Editorial Directory
              </span>
              <h4 className="mt-1 font-serif text-lg text-white font-medium">
                {isDe
                  ? "Gastro-Reportagen, Community & B2B-Guides"
                  : "Gastronomy Reports, Community & B2B Guides"}
              </h4>
            </div>
            <p className="text-xs text-[oklch(0.97_0.02_92)]/60 max-w-md">
              {isDe
                ? "Alle verifizierten Partner, kuratierten Reportagen und Catering-Services auf einen Blick."
                : "All verified partners, curated reports, and catering services at a glance."}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Column A: Berlin Community Stories */}
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[oklch(0.97_0.02_92)]/10">
                <span className="text-sm font-semibold text-white tracking-wide">
                  {isDe ? "Berlin Gastro-Entdeckungen" : "Berlin Food Discoveries"}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                  {berlinStories.length}
                </span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2 text-xs">
                {berlinStories.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="group inline-flex items-center gap-2 text-[oklch(0.97_0.02_92)]/75 hover:text-white transition-colors py-0.5 min-h-[24px]"
                    >
                      <span className="h-1 w-1 rounded-full bg-white/20 group-hover:bg-[#E6B84A] transition-colors" />
                      <span className="group-hover:underline underline-offset-2">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column B: Regional Stories & Speisely Visits */}
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[oklch(0.97_0.02_92)]/10">
                <span className="text-sm font-semibold text-white tracking-wide">
                  {isDe ? "Überregionale Stories & Besuche" : "Regional Stories & Visits"}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                  {regionalStories.length}
                </span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2 text-xs">
                {regionalStories.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="group inline-flex items-center gap-2 text-[oklch(0.97_0.02_92)]/75 hover:text-white transition-colors py-0.5 min-h-[24px]"
                    >
                      <span className="h-1 w-1 rounded-full bg-white/20 group-hover:bg-[#E6B84A] transition-colors" />
                      <span className="group-hover:underline underline-offset-2">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column C: Catering-Guides & B2B Solutions */}
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[oklch(0.97_0.02_92)]/10">
                <span className="text-sm font-semibold text-white tracking-wide">
                  {isDe ? "Catering-Guides & Partner" : "Catering Guides & Partners"}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                  {catererAndGuideLinks.length}
                </span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2 text-xs">
                {catererAndGuideLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="group inline-flex items-center gap-2 text-[oklch(0.97_0.02_92)]/75 hover:text-white transition-colors py-0.5 min-h-[24px]"
                    >
                      <span className="h-1 w-1 rounded-full bg-white/20 group-hover:bg-[#E6B84A] transition-colors" />
                      <span className="group-hover:underline underline-offset-2">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[oklch(0.97_0.02_92)]/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-5 text-xs text-[oklch(0.97_0.02_92)]/75 flex flex-wrap gap-2 justify-between">
          <span>© {new Date().getFullYear()} Speisely</span>

          <span>
            {isDe
              ? "Aktuell im Aufbau: Berlin · München · Hamburg · Köln · Frankfurt"
              : "Currently expanding: Berlin · Munich · Hamburg · Cologne · Frankfurt"}
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; to: string }[] }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-[0.18em] font-sans font-semibold mb-4 text-[oklch(0.97_0.02_92)]/75">
        {title}
      </h3>

      <ul className="space-y-2.5 text-sm">
        {items.map((i) => (
          <FooterLink key={i.label} to={i.to} label={i.label} />
        ))}
      </ul>
    </div>
  );
}

function FooterLink({ to, label }: { to: string; label: string }) {
  return (
    <li>
      <Link
        to={to}
        className="inline-block py-1 text-[oklch(0.97_0.02_92)]/80 hover:text-[oklch(0.97_0.02_92)] transition-colors min-h-[24px]"
      >
        {label}
      </Link>
    </li>
  );
}
