"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/dashboard/sidebar";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LogoMark } from "@/components/ui/logo-mark";
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
      className={`flex h-screen overflow-hidden bg-[#07110c] text-[#f6f1e8] ${
        isRTL ? "flex-row-reverse" : ""
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Sidebar role={role} basePath={basePath} isDemo={isDemo} />

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-65"
            style={{
              background:
                "radial-gradient(circle at top center, rgba(196,152,64,0.12) 0%, transparent 28%), radial-gradient(circle at 82% 16%, rgba(58,84,68,0.12) 0%, transparent 20%), radial-gradient(circle at 18% 85%, rgba(72,101,82,0.10) 0%, transparent 24%)",
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_24%,transparent_76%,rgba(255,255,255,0.015))]" />
        </div>

        <header className="relative z-10 flex h-24 flex-shrink-0 items-center justify-between border-b border-white/10 bg-[#09130e]/80 px-6 backdrop-blur-2xl md:px-8">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8ea18b]">
              <Link href="/" className="transition hover:text-[#eadfca]">
                Speisely
              </Link>
              <span>/</span>
              <span className="truncate text-[#c49840]">{t(breadcrumbKey)}</span>
            </div>

            <div className="mt-2 text-2xl font-semibold tracking-tight text-white">
              {t(breadcrumbKey)}
            </div>

            <div className="mt-1 text-sm text-[#9faf9b]">
              {t(portalKey)}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            {!isDemo && (
              <Link
                href="/"
                className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[#eadfca] transition hover:border-[#c49840]/30 hover:bg-white/[0.05]"
                aria-label="Speisely Home"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c49840]/20 bg-[#c49840]/10">
                  <LogoMark size={16} color="#eadfca" />
                </div>
                <span className="hidden text-sm font-medium text-[#eadfca] md:inline">
                  Speisely
                </span>
              </Link>
            )}
          </div>
        </header>

        <main className="relative z-10 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] px-6 py-8 md:px-8 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
