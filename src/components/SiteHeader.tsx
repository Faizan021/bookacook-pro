import { Link, useRouterState } from "@tanstack/react-router";
import { SpeiselyLogo } from "./SpeiselyLogo";
import { LanguageToggle } from "./LanguageToggle";
import { useI18n } from "@/i18n/I18nProvider";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, ShieldCheck, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";

export function SiteHeader() {
  const { t, lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setIsLoggedIn(true);
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .maybeSingle();
        setIsAdmin(!!data);
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    };
    checkRole();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        checkRole();
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const navItems = [
    { to: "/instant-order", label: t("nav.instant") },
    { to: "/catering", label: t("nav.catering") },
    { to: "/planner", label: "Event Planner" },
    { to: "/partners", label: t("nav.partners") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
    { to: "/blog", label: "Blog" },
  ];

  // Keep pathname in state so active links update on navigation
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  void pathname; // used implicitly via routerState for active link detection

  return (
    /* Header is always cream — no transparent / cinematic mode */
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-md border-b border-forest/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        <Link to="/" className="shrink-0">
          <SpeiselyLogo variant="dark" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center justify-center gap-1 lg:gap-2 overflow-hidden">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="px-2.5 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap text-forest/70 hover:text-forest hover:bg-forest/5"
              activeProps={{
                className:
                  "px-2.5 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap bg-forest text-[oklch(0.97_0.02_92)]",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <LanguageToggle variant="dark" />
          <div className="hidden sm:flex items-center gap-2">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center gap-1.5 justify-center rounded-full px-3 py-1.5 text-sm font-medium hover:opacity-90 transition outline-none ring-0 bg-forest text-[oklch(0.97_0.02_92)]">
                  <User className="h-4 w-4" />
                  <span className="hidden lg:inline">Mein Konto</span>
                  <ChevronDown className="h-3 w-3 opacity-70" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-white border border-[#e2e8e4] rounded-xl shadow-lg p-1"
                >
                  <DropdownMenuItem
                    asChild
                    className="rounded-lg hover:bg-forest/5 cursor-pointer text-forest p-2"
                  >
                    <Link to="/dashboard" className="flex items-center w-full">
                      <LayoutDashboard className="mr-2 h-4 w-4 text-forest/70" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem
                      asChild
                      className="rounded-lg hover:bg-forest/5 cursor-pointer text-forest p-2 mt-1"
                    >
                      <Link to="/admin" className="flex items-center w-full">
                        <ShieldCheck className="mr-2 h-4 w-4 text-brand-orange" />
                        <span className="font-medium">Admin Portal</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-[#e2e8e4]/60 my-1" />
                  <DropdownMenuItem
                    className="rounded-lg hover:bg-rose-50 text-rose-600 cursor-pointer p-2"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      window.location.href = "/auth";
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Abmelden</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  to="/auth"
                  search={{ signup: undefined, message: undefined, logout: undefined }}
                  className="inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-sm font-medium transition whitespace-nowrap border-forest/20 text-forest hover:bg-cream"
                >
                  {tt("Anmelden", "Sign in")}
                </Link>
                <Link
                  to="/auth"
                  search={{ signup: "partner", message: undefined, logout: undefined }}
                  className="inline-flex items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium transition whitespace-nowrap bg-forest text-[oklch(0.97_0.02_92)] hover:opacity-90"
                >
                  {tt("Registrieren", "Register")}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav pills */}
      <nav className="md:hidden flex items-center gap-1.5 px-4 pb-3 overflow-x-auto no-scrollbar">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="shrink-0 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium border border-transparent transition-colors text-forest/70 hover:text-forest"
            activeProps={{
              className:
                "shrink-0 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold border bg-forest text-[oklch(0.97_0.02_92)] border-forest",
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
