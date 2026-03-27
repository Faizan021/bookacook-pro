"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/lib/i18n/context";

type NavItem = {
  labelKey: string;
  href: string;
  icon: React.ReactNode;
};

type SidebarProps = {
  role: "admin" | "caterer" | "customer";
  basePath: string;
  isDemo?: boolean;
};

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
    </svg>
  );
}

function CurrencyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0117.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 rtl:rotate-180">
      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
  );
}

function getNavItems(role: string, basePath: string): NavItem[] {
  const overview = { labelKey: "nav.overview", href: basePath, icon: <HomeIcon /> };
  const bookings = { labelKey: "nav.bookings", href: `${basePath}/bookings`, icon: <CalendarIcon /> };
  const payments = { labelKey: "nav.payments", href: `${basePath}/payments`, icon: <CurrencyIcon /> };

  if (role === "admin") {
    return [
      overview,
      bookings,
      { labelKey: "nav.caterers", href: `${basePath}/caterers`, icon: <UsersIcon /> },
      payments,
    ];
  }
  if (role === "caterer") {
    return [
      overview,
      bookings,
      { labelKey: "nav.packages", href: `${basePath}/packages`, icon: <BoxIcon /> },
      { labelKey: "nav.availability", href: `${basePath}/availability`, icon: <ClockIcon /> },
      { labelKey: "nav.verification", href: `${basePath}/verification`, icon: <ShieldCheckIcon /> },
      payments,
    ];
  }
  return [
    overview,
    { labelKey: "nav.myBookings", href: `${basePath}/bookings`, icon: <CalendarIcon /> },
  ];
}

export function Sidebar({ role, basePath, isDemo = false }: SidebarProps) {
  const pathname = usePathname();
  const t = useT();
  const navItems = getNavItems(role, basePath);

  const portalKey =
    role === "admin" ? "portal.admin" : role === "caterer" ? "portal.caterer" : "portal.customer";

  return (
    <aside className="flex h-full w-60 flex-shrink-0 flex-col border-e border-gray-100 bg-white">
      <div className="flex h-14 flex-shrink-0 items-center gap-2.5 px-5">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-orange-500 text-sm shadow-sm shadow-orange-200">
          🍽
        </div>
        <span className="text-base font-bold tracking-tight text-gray-900">BookaCook</span>
      </div>

      <div className="px-4 pb-1 pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400">
          {t(portalKey)}
        </p>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all rtl:flex-row-reverse ${
                isActive
                  ? "bg-orange-500 text-white shadow-sm shadow-orange-200"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <span className={`flex-shrink-0 ${isActive ? "text-white/90" : "text-gray-400"}`}>
                {item.icon}
              </span>
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 p-3 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 rtl:flex-row-reverse"
        >
          <ArrowLeftIcon />
          {t("nav.backToHome")}
        </Link>
        {isDemo && (
          <div className="rounded-lg border border-orange-100 bg-orange-50 px-3 py-2">
            <p className="text-xs font-semibold text-orange-600">{t("demo.mode")}</p>
            <p className="text-[11px] text-orange-400">{t("demo.sampleData")}</p>
          </div>
        )}
      </div>
    </aside>
  );
}
