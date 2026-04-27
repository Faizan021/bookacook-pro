"use client";

import Link from "next/link";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LogoLockup } from "@/components/ui/logo-mark";
import { useT } from "@/lib/i18n/context";

export function SpeiselyHeader() {
  const t = useT();

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8dcc8] bg-[#faf6ee]/90 text-[#16372f] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label="Speisely home">
          <LogoLockup />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link href="/caterers" className="text-[#49645c] hover:text-[#173f35]">
            {t("nav.discoverCaterers", "Caterer entdecken")}
          </Link>

          <Link href="/caterer" className="text-[#49645c] hover:text-[#173f35]">
            {t("nav.forCaterers", "Für Caterer")}
          </Link>

          <Link href="/about" className="text-[#49645c] hover:text-[#173f35]">
            {t("nav.about", "Über Speisely")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <Link
            href="/request/new"
            className="rounded-full bg-[#173f35] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f2f27]"
          >
            {t("nav.describeEvent", "Event beschreiben")}
          </Link>
        </div>
      </div>
    </header>
  );
}
