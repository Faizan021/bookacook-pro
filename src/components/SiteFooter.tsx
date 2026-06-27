import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Linkedin, Instagram, ArrowRight } from "lucide-react";
import { SpeiselyLogo } from "./SpeiselyLogo";
import { useI18n } from "@/i18n/I18nProvider";

export function SiteFooter() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");

  return (
    <footer className="mt-24 bg-forest text-[oklch(0.97_0.02_92)]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
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
            { label: "Event-Planer", to: "/planner" },
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
            <FooterLink to="/about" label={t("nav.about")} />
            <FooterLink to="/" label="Success Stories" />
            <FooterLink to="/" label="Careers" />
            <FooterLink to="/" label="Contact / Help" />
          </ul>
          <div className="mt-5 flex gap-3">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="h-9 w-9 grid place-items-center rounded-full bg-[oklch(0.97_0.02_92)]/10 hover:bg-[oklch(0.97_0.02_92)]/20 transition-colors"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="h-9 w-9 grid place-items-center rounded-full bg-[oklch(0.97_0.02_92)]/10 hover:bg-[oklch(0.97_0.02_92)]/20 transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="h-9 w-9 grid place-items-center rounded-full bg-[oklch(0.97_0.02_92)]/10 hover:bg-[oklch(0.97_0.02_92)]/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Legal & Newsletter */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.18em] font-sans font-semibold mb-4 text-[oklch(0.97_0.02_92)]/60">
            {t("footer.legal")}
          </h4>
          <ul className="space-y-2.5 text-sm">
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
