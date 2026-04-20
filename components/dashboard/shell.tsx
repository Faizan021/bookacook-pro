"use client";

import Link from "next/link";
import { Sidebar } from "@/components/dashboard/sidebar";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LogoMark } from "@/components/ui/logo-mark";
import { useT, useIsRTL } from "@/lib/i18n/context";

type DashboardShellProps = {
  role: "admin" | "caterer" | "customer";
  basePath: string;
  isDemo?: boolean;
  children: React.ReactNode;
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
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at top center, rgba(196,152,64,0.10) 0%, transparent 26%), radial-gradient(circle at 85% 20%, rgba(58,84,68,0.10) 0%, transparent 18%)",
            }}
          />
        </div>

        <header className="relative z-10 flex h-20 flex-shrink-0 items-center justify-between border-b border-white/8 bg-[#09130e]/80 px-6 backdrop-blur-2xl">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
              <Link href="/" className="transition hover:text-[#eadfca]">
                Speisely
              </Link>
              <span>/</span>
              <span className="truncate text-[#c49840]">{t(breadcrumbKey)}</span>
            </div>

            <div className="mt-2 text-lg font-semibold tracking-tight text-white">
              {t(breadcrumbKey)}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            {!isDemo && (
              <Link
                href="/"
                className="hidden rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[#eadfca] transition hover:border-[#c49840]/30 hover:bg-white/[0.05] md:inline-flex"
                aria-label="Speisely Home"
              >
                <LogoMark
                  size={24}
                  color="#eadfca"
                  wordmarkColor="#eadfca"
                  showWordmark={false}
                />
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
