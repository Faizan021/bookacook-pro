import React from "react";
import { Link, useRouter, useLocation } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/i18n/I18nProvider";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getPartnerWorkspaces } from "@/lib/auth/workspace.functions";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Tag,
  Settings,
  CalendarDays,
  LogOut,
  Store,
  CreditCard,
} from "lucide-react";

interface VendorLayoutProps {
  children: React.ReactNode;
  vertical: "restaurant" | "caterer" | "planner";
  title: string;
  storefrontSlug?: string;
}

export function VendorLayout({ children, vertical, title, storefrontSlug }: VendorLayoutProps) {
  const router = useRouter();
  const location = useLocation();
  const { t, lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);

  const basePath = {
    restaurant: "/restaurant",
    caterer: "/caterer",
    planner: "/dashboard/planner",
  }[vertical];

  const getWorkspaces = useServerFn(getPartnerWorkspaces);
  const { data: workspaces } = useQuery({
    queryKey: ["partner-workspaces"],
    queryFn: () => getWorkspaces(),
  });

  async function signOut() {
    await supabase.auth.signOut();
    router.navigate({
      to: "/auth",
      search: { signup: undefined, message: undefined, logout: undefined },
    });
  }

  // Navigation config based on vertical
  const navItems = {
    restaurant: [
      { id: "overview", label: tt("Übersicht", "Overview"), icon: LayoutDashboard },
      { id: "orders", label: tt("Bestellungen", "Orders"), icon: ShoppingBag },
      { id: "reservations", label: tt("Reservierungen", "Reservations"), icon: CalendarDays },
      { id: "menu", label: tt("Speisekarte", "Menu"), icon: UtensilsCrossed },
      { id: "promotions", label: tt("Aktionen", "Promotions"), icon: Tag },
      { id: "settings-billing", label: tt("Abonnement", "Subscription"), icon: CreditCard },
      { id: "settings-general", label: tt("Einstellungen", "Settings"), icon: Settings },
    ],
    caterer: [
      { id: "overview", label: tt("Übersicht", "Overview"), icon: LayoutDashboard },
      { id: "briefs", label: tt("Anfragen & Leads", "Briefs & Leads"), icon: CalendarDays },
      { id: "calendar", label: tt("Kalender", "Calendar"), icon: CalendarDays },
      { id: "menu", label: tt("Pakete", "Packages"), icon: ShoppingBag },
      { id: "promotions", label: tt("Aktionen", "Promotions"), icon: Tag },
      { id: "profile", label: tt("Einstellungen", "Settings"), icon: Settings },
    ],
    planner: [
      { id: "overview", label: tt("Übersicht", "Overview"), icon: LayoutDashboard },
      { id: "briefs", label: tt("Anfragen & Leads", "Briefs & Leads"), icon: CalendarDays },
      { id: "calendar", label: tt("Kalender", "Calendar"), icon: CalendarDays },
      { id: "packages", label: tt("Dienstleistungen", "Services"), icon: ShoppingBag },
      { id: "promotions", label: tt("Aktionen", "Promotions"), icon: Tag },
      { id: "logistics", label: tt("Logistik", "Logistics"), icon: UtensilsCrossed },
      { id: "profile", label: tt("Einstellungen", "Settings"), icon: Settings },
    ],
  }[vertical];

  return (
    <div className="flex min-h-screen w-full bg-[#f8faf9] text-forest font-sans">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-[#e2e8e4] bg-cream/80 backdrop-blur-md">
        <div className="flex h-16 items-center px-6 border-b border-[#e2e8e4]">
          <Link
            to="/"
            className="flex items-center gap-2 text-forest hover:opacity-80 transition-opacity"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-cream font-bold">
              S
            </div>
            <span className="font-display text-xl font-bold tracking-tight">Speisely</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="mb-6 px-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-forest/50">
              {title}
            </h2>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              // We'll use hash routing for tabs since the existing components use Radix Tabs
              // which read the value. Wait, Radix Tabs don't automatically sync with the URL hash unless coded to.
              // For a SaaS feel, we should update the URL hash or use search params.
              // For now, we'll just emit an event or rely on the parent component mapping the active tab.
              // Actually, since we are wrapping the existing Tabs, we can just render the Sidebar buttons
              // and let the parent control the active tab via state or hash.

              // We'll pass the `id` to the URL search param or hash so the parent can read it.
              const searchParams = new URLSearchParams(location.search);
              const cleanTab = searchParams.get("tab") || (location.hash || "").replace("#", "");
              let isActive = cleanTab === item.id || (!cleanTab && item.id === "overview");
              if (
                item.id === "settings-general" &&
                cleanTab.startsWith("settings-") &&
                cleanTab !== "settings-billing"
              ) {
                isActive = true;
              }

              return (
                <Link
                  key={item.id}
                  to={basePath}
                  search={{ tab: item.id }}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-forest text-cream shadow-md"
                      : "text-forest/70 hover:bg-forest/5 hover:text-forest"
                  }`}
                >
                  <item.icon className={`h-4 w-4 ${isActive ? "text-cream" : "text-forest/50"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-[#e2e8e4] p-4 space-y-2">
          {storefrontSlug && (
            <Button variant="outline" className="w-full justify-start gap-2 bg-white/50" asChild>
              <a
                href={`${vertical === "caterer" ? "/catering" : vertical === "planner" ? "/planner" : "/restaurant"}/${storefrontSlug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Store className="h-4 w-4" />
                {tt("Mein Storefront", "My Storefront")}
              </a>
            </Button>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4" />
            {tt("Abmelden", "Sign out")}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col pl-64">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[#e2e8e4] bg-cream/80 px-8 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <h1 className="font-display text-xl">{title}</h1>
            {workspaces && (
              <div className="ml-4 flex items-center gap-2">
                {workspaces.restaurant && vertical !== "restaurant" && (
                  <Link
                    to="/restaurant"
                    className="text-xs font-medium text-forest bg-forest/5 border border-forest/10 px-2 py-1 rounded-md hover:bg-forest/10 transition"
                  >
                    {tt("Restaurant", "Restaurant")}
                  </Link>
                )}
                {workspaces.caterer && vertical !== "caterer" && (
                  <Link
                    to="/caterer"
                    className="text-xs font-medium text-forest bg-forest/5 border border-forest/10 px-2 py-1 rounded-md hover:bg-forest/10 transition"
                  >
                    {tt("Catering", "Catering")}
                  </Link>
                )}
                {workspaces.planner && vertical !== "planner" && (
                  <Link
                    to="/dashboard/planner"
                    className="text-xs font-medium text-forest bg-forest/5 border border-forest/10 px-2 py-1 rounded-md hover:bg-forest/10 transition"
                  >
                    {tt("Event Planner", "Event Planner")}
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="text-xs font-medium border border-[#b28a3c] text-[#b28a3c] px-2 py-1 rounded-md hover:bg-[#b28a3c]/10 transition"
                >
                  {tt("Hub", "Hub")}
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <LanguageToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function DashboardSkeleton({
  vertical,
  title,
}: {
  vertical: "restaurant" | "caterer" | "planner";
  title: string;
}) {
  return (
    <VendorLayout vertical={vertical} title={title}>
      <div className="space-y-6 animate-pulse">
        <div className="flex gap-4 mb-8 border-b border-border pb-4">
          <div className="h-10 w-32 bg-forest/10 rounded-md"></div>
          <div className="h-10 w-32 bg-forest/10 rounded-md"></div>
          <div className="h-10 w-32 bg-forest/10 rounded-md"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="surface-card p-6 h-32 bg-forest/5 border-none"></div>
          <div className="surface-card p-6 h-32 bg-forest/5 border-none"></div>
          <div className="surface-card p-6 h-32 bg-forest/5 border-none"></div>
        </div>
        <div className="surface-card p-8 h-64 bg-forest/5 border-none mt-6"></div>
      </div>
    </VendorLayout>
  );
}
