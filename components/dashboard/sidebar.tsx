"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
    </svg>
  );
}

function CurrencyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
    </svg>
  );
}

function getNavItems(role: string, basePath: string): NavItem[] {
  const overview = { label: "Overview", href: basePath, icon: <HomeIcon /> };
  const bookings = { label: "Bookings", href: `${basePath}/bookings`, icon: <CalendarIcon /> };
  const payments = { label: "Payments", href: `${basePath}/payments`, icon: <CurrencyIcon /> };

  if (role === "admin") {
    return [
      overview,
      bookings,
      { label: "Caterers", href: `${basePath}/caterers`, icon: <UsersIcon /> },
      payments,
    ];
  }
  if (role === "caterer") {
    return [
      overview,
      bookings,
      { label: "Packages", href: `${basePath}/packages`, icon: <BoxIcon /> },
      { label: "Availability", href: `${basePath}/availability`, icon: <ClockIcon /> },
      payments,
    ];
  }
  return [
    overview,
    { label: "My Bookings", href: `${basePath}/bookings`, icon: <CalendarIcon /> },
  ];
}

export function Sidebar({ role, basePath, isDemo = false }: SidebarProps) {
  const pathname = usePathname();
  const navItems = getNavItems(role, basePath);
  const roleLabel =
    role === "admin" ? "Admin" : role === "caterer" ? "Caterer" : "Customer";

  return (
    <aside className="flex h-full w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 flex-shrink-0 items-center gap-3 border-b border-gray-200 px-5">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-orange-500 text-base leading-none text-white">
          🍽
        </div>
        <span className="text-lg font-bold tracking-tight text-gray-900">BookaCook</span>
      </div>

      <div className="px-5 pt-5 pb-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          {roleLabel} Portal
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className={isActive ? "text-orange-500" : "text-gray-400"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {isDemo && (
        <div className="border-t border-gray-200 p-4">
          <div className="rounded-xl bg-orange-50 px-3 py-2.5 text-center">
            <p className="text-xs font-semibold text-orange-600">Demo Mode</p>
            <p className="mt-0.5 text-xs text-orange-400">Sample data only</p>
          </div>
        </div>
      )}
    </aside>
  );
}
