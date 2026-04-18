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
      className={`flex h-screen overflow-hidden bg-background text-foreground ${
        isRTL ? "flex-row-reverse" : ""
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Sidebar role={role} basePath={basePath} isDemo={isDemo} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-border/60 bg-background/90 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="transition hover:text-foreground">
              Speisely
            </Link>
            <span>/</span>
            <span className="font-medium text-foreground">{t(breadcrumbKey)}</span>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            {!isDemo && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-sm">
                S
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-background px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
