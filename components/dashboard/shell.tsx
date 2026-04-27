"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/dashboard/sidebar";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LogoLockup } from "@/components/ui/logo-mark";
import { useT, useIsRTL } from "@/lib/i18n/context";

type DashboardShellProps = {
  role: "admin" | "caterer" | "customer";
  basePath: string;
  isDemo?: boolean;
  children: ReactNode;
};

export function DashboardShell({
  role,
  basePath,
  isDemo = false,
  children,
}: DashboardShellProps) {
  const t = useT();
  const isRTL = useIsRTL();

  const breadcrumbKey =
    role === "admin"
      ? "breadcrumb.adminDashboard"
      : role === "caterer"
        ? "breadcrumb.catererDashboard"
        : "breadcrumb.customerDashboard";

  const portalKey =
    role === "admin"
      ? "portal.admin"
      : role === "caterer"
        ? "portal.caterer"
        : "portal.customer";

  return (
    <div
      className={`flex h-screen overflow-hidden bg-[#faf6ee] text-[#16372f] ${
        isRTL ? "flex-row-reverse" : ""
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Sidebar role={role} basePath={basePath} isDemo={isDemo} />

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <header className="relative z-10 flex h-24 flex-shrink-0 items-center justify-between border-b border-[#e8dcc8] bg-[#faf6ee]/90 px-6 backdrop-blur-xl md:px-8">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a6d35]">
              <Link href="/" className="transition hover:text-[#173f35]">
                Speisely
              </Link>
              <span>/</span>
              <span className="truncate text-[#173f35]">
                {t(breadcrumbKey)}
              </span>
            </div>

            <div className="mt-2 text-2xl font-semibold tracking-tight text-[#16372f]">
              {t(breadcrumbKey)}
            </div>

            <div className="mt-1 text-sm text-[#5c6f68]">{t(portalKey)}</div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            {!isDemo && (
              <Link
                href="/"
                className="inline-flex items-center gap-3 rounded-full border border-[#d8ccb9] bg-white px-4 py-2.5 shadow-sm transition hover:bg-[#f4ead7]"
                aria-label="Speisely Home"
              >
                <LogoLockup />
              </Link>
            )}
          </div>
        </header>

        <main className="relative z-10 flex-1 overflow-y-auto bg-[#faf6ee]">
          <div className="mx-auto w-full max-w-[1600px] px-6 py-8 md:px-8 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
