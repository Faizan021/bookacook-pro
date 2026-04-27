"use client";

import Link from "next/link";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LogoLockup } from "@/components/ui/logo-mark";
import { useT } from "@/lib/i18n/context";

type SpeiselyHeaderProps = {
  variant?: "light" | "dark";
};

export function SpeiselyHeader({ variant = "light" }: SpeiselyHeaderProps) {
  const t = useT();

  const isDark = variant === "dark";

  return (
    <header
      className={[
        "sticky top-0 z-50 border-b backdrop-blur-xl",
        isDark
          ? "border-white/10 bg-[#07130f]/90 text-white"
          : "border-[#e8dcc8] bg-[#faf6ee]/90 text-[#16372f]",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label="Speisely home">
          <LogoLockup />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link
            href="/caterers"
            className={isDark ? "text-white/70 hover:text-[#d7b66d]" : "text-[#49645c] hover:text-[#173f35]"}
          >
            {t("nav.discoverCaterers", "Caterer entdecken")}
          </Link>

          <Link
            href="/caterer"
            className={isDark ? "text-white/70 hover:text-[#d7b66d]" : "text-[#49645c] hover:text-[#173f35]"}
          >
            {t("nav.forCaterers", "Für Caterer")}
          </Link>

          <Link
            href="/about"
            className={isDark ? "text-white/70 hover:text-[#d7b66d]" : "text-[#49645c] hover:text-[#173f35]"}
          >
            {t("nav.about", "Über Speisely")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <Link
            href="/request/new"
            className={[
              "rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition",
              isDark
                ? "bg-[#d7a83f] text-black hover:bg-[#e3b955]"
                : "bg-[#173f35] text-white hover:bg-[#0f2f27]",
            ].join(" ")}
          >
            {t("nav.describeEvent", "Event beschreiben")}
          </Link>
        </div>
      </div>
    </header>
  );
}
