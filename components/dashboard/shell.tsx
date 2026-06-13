"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/dashboard/sidebar";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LogoLockup } from "@/components/ui/logo-mark";
import { useT, useIsRTL } from "@/lib/i18n/context";

type DashboardShellProps = {
  role: "admin" | "caterer" | "customer" | "restaurant";
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

  const isDark = false; // Reverted back to light theme per user request

  const bgClass = isDark ? "bg-[#0a1410]" : "bg-[#faf6ee]";
  const textClass = isDark ? "text-[#eadfca]" : "text-[#16372f]";
  const textMutedClass = isDark ? "text-[#9faf9b]" : "text-[#5c6f68]";
  const borderClass = isDark ? "border-white/10" : "border-[#e8dcc8]";
  const headerBgClass = isDark ? "bg-[#0a1410]/90" : "bg-[#faf6ee]/90";
  const linkHoverClass = isDark ? "hover:text-white hover:bg-white/5" : "hover:text-[#173f35] hover:bg-[#f4ead7]";

  const breadcrumbKey =
    role === "admin"
      ? "breadcrumb.adminDashboard"
      : role === "caterer"
        ? "breadcrumb.catererDashboard"
        : role === "restaurant"
          ? "breadcrumb.restaurantDashboard"
          : "breadcrumb.customerDashboard";

  const portalKey =
    role === "admin"
      ? "portal.admin"
      : role === "caterer"
        ? "portal.caterer"
        : role === "restaurant"
          ? "portal.restaurant"
          : "portal.customer";

  return (
    <div
      className={`flex h-screen overflow-hidden ${bgClass} ${textClass} ${
        isRTL ? "flex-row-reverse" : ""
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Sidebar role={role} basePath={basePath} isDemo={isDemo} isDark={isDark} />

      <div className="relative flex flex-1 flex-col overflow-hidden">
        {isDark && (
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#173f35]/20 via-[#0a1410] to-[#0a1410] opacity-80" />
        )}
        <header className={`relative z-10 flex h-24 flex-shrink-0 items-center justify-between border-b ${borderClass} ${headerBgClass} px-6 backdrop-blur-xl md:px-8`}>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c49840]">
              <Link href="/" className={`transition ${isDark ? "hover:text-[#eadfca]" : "hover:text-[#173f35]"}`}>
                Speisely
              </Link>
              <span>/</span>
              <span className={`truncate ${isDark ? "text-white" : "text-[#173f35]"}`}>
                {t(breadcrumbKey)}
              </span>
            </div>

            <div className={`mt-2 text-2xl font-semibold tracking-tight ${isDark ? "text-white" : "text-[#16372f]"}`}>
              {t(breadcrumbKey)}
            </div>

            <div className={`mt-1 text-sm ${textMutedClass}`}>{t(portalKey)}</div>
          </div>

          <div className="flex items-center gap-3">
            <div className={isDark ? "brightness-0 invert opacity-80" : ""}>
              <LanguageSwitcher />
            </div>

            {!isDemo && (
              <Link
                href="/"
                className={`inline-flex items-center gap-3 rounded-full border px-4 py-2.5 shadow-sm transition ${
                  isDark ? "border-white/20 bg-white/5 hover:bg-white/10" : "border-[#d8ccb9] bg-white hover:bg-[#f4ead7]"
                }`}
                aria-label="Speisely Home"
              >
                <div className={isDark ? "brightness-0 invert" : ""}>
                  <LogoLockup />
                </div>
              </Link>
            )}
          </div>
        </header>

        <main className={`relative z-10 flex-1 overflow-y-auto ${bgClass}`}>
          <div className="mx-auto w-full max-w-[1600px] px-6 py-8 md:px-8 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
