"use client";

import Link from "next/link";
import { Sidebar } from "@/components/dashboard/sidebar";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
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
      className={`flex h-screen overflow-hidden bg-gray-50 ${isRTL ? "flex-row-reverse" : ""}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Sidebar role={role} basePath={basePath} isDemo={isDemo} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-12 flex-shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="transition-colors hover:text-gray-600">
              {t("breadcrumb.app")}
            </Link>
            <span>/</span>
            <span className="font-medium text-gray-700">{t(breadcrumbKey)}</span>
            {isDemo && <span className="text-gray-300">— {t("breadcrumb.demo")}</span>}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            {isDemo ? (
              <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-orange-600">
                DEMO
              </span>
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-xs font-bold text-white shadow-sm">
                U
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
