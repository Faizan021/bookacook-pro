"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/lib/i18n/context";
import { LogoLockup } from "@/components/ui/logo-mark";

type NavItem = {
  labelKey: string;
  fallback: string;
  href: string;
  icon: ReactNode;
};

type SidebarProps = {
  role: "admin" | "caterer" | "customer";
  basePath: string;
  isDemo?: boolean;
};

function HomeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path
        fillRule="evenodd"
        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
    </svg>
  );
}

function CurrencyIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path
        fillRule="evenodd"
        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0117.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path
        fillRule="evenodd"
        d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.192.96a6.97 6.97 0 011.384.573l.815-.544a1 1 0 011.265.125l1.67 1.67a1 1 0 01.125 1.265l-.544.815c.23.438.421.9.573 1.384l.96.192a1 1 0 01.804.98v2.36a1 1 0 01-.804.98l-.96.192a6.97 6.97 0 01-.573 1.384l.544.815a1 1 0 01-.125 1.265l-1.67 1.67a1 1 0 01-1.265.125l-.815-.544a6.97 6.97 0 01-1.384.573l-.192.96a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.192-.96a6.97 6.97 0 01-1.384-.573l-.815.544a1 1 0 01-1.265-.125l-1.67-1.67a1 1 0 01-.125-1.265l.544-.815a6.97 6.97 0 01-.573-1.384l-.96-.192A1 1 0 011 11.18V8.82a1 1 0 01.804-.98l.96-.192a6.97 6.97 0 01.573-1.384l-.544-.815a1 1 0 01.125-1.265l1.67-1.67a1 1 0 011.265-.125l.815.544c.438-.23.9-.421 1.384-.573l.192-.96zM10 13a3 3 0 100-6 3 3 0 000 6z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 rtl:rotate-180">
      <path
        fillRule="evenodd"
        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function getNavItems(role: string, basePath: string): NavItem[] {
  const overview = {
    labelKey: "nav.overview",
    fallback: "Übersicht",
    href: basePath,
    icon: <HomeIcon />,
  };

  const bookings = {
    labelKey: "nav.bookings",
    fallback: "Buchungen",
    href: `${basePath}/bookings`,
    icon: <CalendarIcon />,
  };

  const payments = {
    labelKey: "nav.payments",
    fallback: "Zahlungen",
    href: `${basePath}/payments`,
    icon: <CurrencyIcon />,
  };

  const settings = {
    labelKey: "nav.settings",
    fallback: "Einstellungen",
    href: `${basePath}/settings`,
    icon: <SettingsIcon />,
  };

  if (role === "admin") {
    return [
      overview,
      bookings,
      {
        labelKey: "nav.caterers",
        fallback: "Caterer",
        href: `${basePath}/caterers`,
        icon: <UsersIcon />,
      },
      payments,
      settings,
    ];
  }

  if (role === "caterer") {
    return [
      overview,
      bookings,
      {
        labelKey: "nav.packages",
        fallback: "Pakete",
        href: `${basePath}/packages`,
        icon: <BoxIcon />,
      },
      {
        labelKey: "nav.availability",
        fallback: "Verfügbarkeit",
        href: `${basePath}/availability`,
        icon: <ClockIcon />,
      },
      {
        labelKey: "nav.verification",
        fallback: "Verifizierung",
        href: `${basePath}/verification`,
        icon: <ShieldCheckIcon />,
      },
      payments,
      settings,
    ];
  }

  return [
    overview,
    {
      labelKey: "nav.myBookings",
      fallback: "Meine Anfragen",
      href: `${basePath}/bookings`,
      icon: <CalendarIcon />,
    },
    settings,
  ];
}

export function Sidebar({ role, basePath, isDemo = false }: SidebarProps) {
  const pathname = usePathname();
  const t = useT();
  const navItems = getNavItems(role, basePath);

  const portalKey =
    role === "admin"
      ? "portal.admin"
      : role === "caterer"
        ? "portal.caterer"
        : "portal.customer";

  return (
    <aside className="flex h-full w-64 flex-shrink-0 flex-col border-e border-[#e8dcc8] bg-white text-[#16372f] shadow-[12px_0_40px_rgba(31,61,51,0.06)]">
      <div className="border-b border-[#e8dcc8] px-5 py-5">
        <Link href="/" className="block">
          <LogoLockup />
        </Link>

        <div className="mt-3 inline-flex rounded-full bg-[#faf6ee] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
          {t(portalKey)}
        </div>
      </div>

      <div className="px-4 pb-2 pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a6d35]">
          Navigation
        </p>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== basePath && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "group flex items-center gap-3 rounded-[1rem] px-3.5 py-3 text-sm font-semibold transition-all rtl:flex-row-reverse",
                isActive
                  ? "border border-[#d8ccb9] bg-[#173f35] text-white shadow-sm"
                  : "border border-transparent text-[#5c6f68] hover:border-[#eadfce] hover:bg-[#faf6ee] hover:text-[#173f35]",
              ].join(" ")}
            >
              <span
                className={[
                  "flex-shrink-0",
                  isActive ? "text-[#d7b66d]" : "text-[#8a6d35]",
                ].join(" ")}
              >
                {item.icon}
              </span>
              <span>{t(item.labelKey, item.fallback)}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-[#e8dcc8] p-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-[1rem] border border-transparent px-3 py-2.5 text-xs font-semibold text-[#5c6f68] transition hover:border-[#eadfce] hover:bg-[#faf6ee] hover:text-[#173f35] rtl:flex-row-reverse"
        >
          <ArrowLeftIcon />
          {t("nav.backToHome", "Zurück zur Startseite")}
        </Link>

        {isDemo && (
          <div className="rounded-[1rem] border border-[#eadfce] bg-[#faf6ee] px-3 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a6d35]">
              Demo
            </p>
            <p className="mt-1 text-[11px] leading-5 text-[#5c6f68]">
              Sample data only
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
