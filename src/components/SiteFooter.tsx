import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Linkedin, Instagram, ArrowRight } from "lucide-react";
import { SpeiselyLogo } from "./SpeiselyLogo";
import { useI18n } from "@/i18n/I18nProvider";

export function SiteFooter() {
  const { t, lang } = useI18n();
  const [email, setEmail] = useState("");
  const isDe = lang === "de";

  // Static SSR-rendered Geo Landing Links so Googlebot discovers them on initial HTML crawl (Depth 1)
  const cityLinks = [
    { label: "Restaurants in Berlin", to: "/restaurant/ort/berlin" },
    { label: "Catering in Berlin", to: "/catering/ort/berlin" },
    { label: "Restaurants in München", to: "/restaurant/ort/muenchen" },
    { label: "Catering in München", to: "/catering/ort/muenchen" },
    { label: "Restaurants in Hamburg", to: "/restaurant/ort/hamburg" },
    { label: "Catering in Hamburg", to: "/catering/ort/hamburg" },
    { label: "Catering in Köln", to: "/catering/ort/koeln" },
    { label: "Catering in Frankfurt", to: "/catering/ort/frankfurt" },
  ];

  // SSR-rendered Community & Partner Index Links to prevent "Discovered - currently not indexed" in GSC
  const directoryLinks = [
    { label: "Neumanns Café Berlin", to: "/magazin/community/neumanns-cafe-berlin" },
    { label: "Baba Pirzola Berlin", to: "/magazin/community/baba-pirzola-berlin" },
    { label: "bb.q Chicken Kreuzberg", to: "/magazin/community/bbq-chicken-berlin-kreuzberg" },
    { label: "King Tut Berlin", to: "/magazin/community/king-tut-restaurant-berlin" },
    { label: "San Sebastian Berlin", to: "/magazin/community/san-sebastian-berlin" },
    { label: "Chicken Krush Prag", to: "/magazin/community/chicken-krush-prag" },
    { label: "Garçon de Café Berlin", to: "/magazin/community/garcon-de-cafe-berlin" },
    { label: "Thronburger Berlin", to: "/magazin/community/thronburger-berlin" },
    { label: "Kokio Berlin", to: "/magazin/community/kokio-berlin" },
    { label: "Al Zaeem Berlin", to: "/magazin/community/alzaeem-restaurant-berlin" },
    { label: "Ariana Frankfurt", to: "/magazin/community/ariana-restaurant-frankfurt" },
    { label: "Harput Wiesbaden", to: "/magazin/community/harput-wiesbaden" },
    { label: "Mandy Restaurant Berlin", to: "/magazin/speisely-visits/mandy-restaurant-berlin-neukoelln" },
    { label: "Shawarma Albaik Berlin", to: "/magazin/speisely-visits/shawarma-albaik-berlin" },
    { label: "Schnitzel Schmiede", to: "/magazin/schnitzel-schmiede" },
    { label: "Speisely Visits", to: "/magazin/speisely-visits" },
    { label: "Architecture Simulator", to: "/architecture-simulator" },
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
          <h4 className="text-xs uppercase tracking-[0.18em] font-sans font-semibold mb-4 text-[oklch(0.97_0.02_92)]/60">
            {t("footer.business")}
          </h4>
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

        {/* Top Locations (SSR rendered for instant Googlebot crawl) */}
        <FooterCol title={isDe ? "Städte & Regionen" : "Cities & Regions"} items={cityLinks} />

        {/* Legal & Newsletter */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.18em] font-sans font-semibold mb-4 text-[oklch(0.97_0.02_92)]/60">
            {t("footer.legal")}
          </h4>
          <ul className="space-y-2.5 text-sm">
            <FooterLink to="/contact" label={t("nav.contact")} />
            <FooterLink to="/impressum" label={t("footer.imprint")} />
            <FooterLink to="/datenschutz" label={t("footer.privacy")} />
            <FooterLink to="/impressum" label={t("footer.terms")} />
          </ul>

          <div className="mt-6">
            <h5 className="font-display text-lg text-[oklch(0.97_0.02_92)]">Stay updated</h5>
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
                className="flex-1 bg-transparent text-sm text-[oklch(0.97_0.02_92)] placeholder:text-[oklch(0.97_0.02_92)]/50 outline-none min-w-0"
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

      {/* SSR Internal Link Hub for Magazin & Community Stories (Eliminates Orphan Sitemap URLs) */}
      <div className="border-t border-[oklch(0.97_0.02_92)]/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6">
          <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[oklch(0.97_0.02_92)]/50 mb-3">
            {isDe
              ? "Speisely Community Stories & Kulinarik-Guides"
              : "Speisely Community Stories & Culinary Guides"}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[oklch(0.97_0.02_92)]/65">
            {directoryLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="hover:text-[oklch(0.97_0.02_92)] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[oklch(0.97_0.02_92)]/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-5 text-xs text-[oklch(0.97_0.02_92)]/60 flex flex-wrap gap-2 justify-between">
          <span>© {new Date().getFullYear()} Speisely</span>
          <span>Berlin · Hamburg · München · Köln · Frankfurt</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; to: string }[] }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-[0.18em] font-sans font-semibold mb-4 text-[oklch(0.97_0.02_92)]/60">
        {title}
      </h4>
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
        className="text-[oklch(0.97_0.02_92)]/80 hover:text-[oklch(0.97_0.02_92)] transition-colors"
      >
        {label}
      </Link>
    </li>
  );
}
