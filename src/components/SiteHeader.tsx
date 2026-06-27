import { Link, useRouterState } from "@tanstack/react-router";
import { SpeiselyLogo } from "./SpeiselyLogo";
import { LanguageToggle } from "./LanguageToggle";
import { useI18n } from "@/i18n/I18nProvider";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function SiteHeader() {
  const { t, lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
    { to: "/blog", label: "Blog" },
    ...(isAdmin ? [{ to: "/admin" as const, label: "Admin" }] : []),
  ];

  const routerState = useRouterState();
  const isHome = routerState.location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerBg = isHome && !scrolled
    ? "bg-transparent border-transparent"
    : "bg-[oklch(0.93_0.05_152/0.85)] backdrop-blur-md border-b border-[oklch(0.85_0.05_152)]";

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-300 ${headerBg}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 h-16 sm:h-20 grid grid-cols-[auto_1fr_auto] items-center gap-2 lg:gap-6">
        <Link to="/" className="shrink-0"><SpeiselyLogo /></Link>

        <nav className="hidden md:flex flex-wrap items-center justify-center gap-0.5 lg:gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-medium text-forest/80 hover:text-forest transition-colors whitespace-nowrap"
              activeProps={{ className: "px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-medium bg-cream text-forest shadow-sm whitespace-nowrap" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 justify-end">
          <LanguageToggle />
          <div className="hidden sm:flex items-center gap-2">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-forest text-[oklch(0.97_0.02_92)] px-3 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm font-medium hover:opacity-90 transition"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/auth"
                  search={{ signup: undefined }}
                  className="inline-flex items-center justify-center rounded-full border border-forest/20 px-3 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm font-medium text-forest hover:bg-cream transition"
                >
                  {tt("Anmelden", "Sign in")}
                </Link>
                <Link
                  to="/auth"
                  search={{ signup: "partner" }}
                  className="inline-flex items-center justify-center rounded-full bg-forest text-[oklch(0.97_0.02_92)] px-3 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm font-medium hover:opacity-90 transition"
                >
                  {tt("Registrieren", "Register")}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <nav className="md:hidden flex items-center gap-1.5 px-4 pb-3 overflow-x-auto no-scrollbar">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="shrink-0 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium text-forest/80 border border-transparent"
            activeProps={{ className: "shrink-0 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium bg-cream text-forest border border-[#eadfce]" }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
