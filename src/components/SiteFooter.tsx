import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Linkedin, Instagram, ArrowRight } from "lucide-react";
import { SpeiselyLogo } from "./SpeiselyLogo";
import { useI18n } from "@/i18n/I18nProvider";
import { useServerFn } from "@tanstack/react-start";
import { getValidGeoLocations } from "@/lib/geo/server.functions";

export function SiteFooter() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const getLocs = useServerFn(getValidGeoLocations);
  const [validLocs, setValidLocs] = useState<string[]>([]);

  useEffect(() => {
    getLocs().then(setValidLocs);
  }, [getLocs]);

  const topCities = [
    { name: "Berlin", slug: "berlin" },
    { name: "Hamburg", slug: "hamburg" },
    { name: "München", slug: "muenchen" },
    { name: "Köln", slug: "koeln" },
    { name: "Frankfurt", slug: "frankfurt" },
  ];

  const cityLinks = topCities
    .filter((city) => validLocs.includes(`/restaurants/ort/${city.slug}`))
    .map((city) => ({ label: `Restaurants in ${city.name}`, to: `/restaurants/ort/${city.slug}` }));

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
            { label: t("nav.instant"), to: "/instant-order" },
            { label: t("nav.catering"), to: "/catering" },
            { label: t("Event-Planer", "Event Planner"), to: "/planner" },
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
            <FooterLink to="/speisely" label={t("Was ist Speisely?", "What is Speisely?")} />
            <FooterLink to="/about" label={t("nav.about")} />
            <FooterLink to="/" label="Success Stories" />
            <FooterLink to="/" label="Careers" />
            <FooterLink to="/" label="Contact / Help" />
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
              href="https://instagram.com/speisely"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="h-9 w-9 grid place-items-center rounded-full bg-[oklch(0.97_0.02_92)]/10 hover:bg-[oklch(0.97_0.02_92)]/20 transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Top Locations */}
        {cityLinks.length > 0 && (
          <FooterCol
            title="Städte"
            items={cityLinks}
          />
        )}

        {/* Legal & Newsletter */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.18em] font-sans font-semibold mb-4 text-[oklch(0.97_0.02_92)]/60">
            {t("footer.legal")}
          </h4>
          <ul className="space-y-2.5 text-sm">
            <FooterLink to="/contact" label={t("nav.contact")} />
            <FooterLink to="/impressum" label={t("footer.imprint")} />
            <FooterLink to="/impressum" label={t("footer.privacy")} />
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

      <div className="border-t border-[oklch(0.97_0.02_92)]/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-5 text-xs text-[oklch(0.97_0.02_92)]/60 flex flex-wrap gap-2 justify-between">
          <span>© {new Date().getFullYear()} Speisely</span>
          <span>Berlin · Hamburg · München</span>
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
      <Link to={to} className="text-[oklch(0.97_0.02_92)]/80 hover:text-[oklch(0.97_0.02_92)] transition-colors">
        {label}
      </Link>
    </li>
  );
}
