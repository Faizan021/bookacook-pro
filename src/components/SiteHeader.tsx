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
import {
  User,
  ShieldCheck,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  BookOpen,
  Eye,
  Users,
  Lightbulb,
  TrendingUp,
  Briefcase,
  DollarSign,
  UserPlus,
  Info,
  Mail,
  Menu,
  X,
} from "lucide-react";

export function SiteHeader() {
  const { t, lang } = useI18n();
  const isDe = lang === "de";
  const tt = (de: string, en: string) => (isDe ? de : en);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Expandable group states in mobile menu
  const [mobileMagazinOpen, setMobileMagazinOpen] = useState(false);
  const [mobilePartnersOpen, setMobilePartnersOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);

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

  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  // Auto-close mobile menu on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isMagazinActive =
    pathname.startsWith("/magazin") ||
    pathname.startsWith("/community") ||
    pathname.startsWith("/blog");
  const isPartnersActive = pathname.startsWith("/partners");
  const isAboutActive = pathname.startsWith("/about") || pathname.startsWith("/contact");

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-md border-b border-forest/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="shrink-0" onClick={() => setMobileMenuOpen(false)}>
          <SpeiselyLogo variant="dark" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2">
          {/* Direct Link 1: Restaurants */}
          <Link
            to="/restaurants"
            className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors text-forest/80 hover:text-forest hover:bg-forest/5"
            activeProps={{
              className:
                "px-3 py-1.5 rounded-full text-sm font-semibold bg-forest !text-[oklch(0.97_0.02_92)] shadow-sm",
            }}
          >
            {t("nav.restaurants")}
          </Link>

          {/* Direct Link 2: Catering */}
          <Link
            to="/catering"
            className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors text-forest/80 hover:text-forest hover:bg-forest/5"
            activeProps={{
              className:
                "px-3 py-1.5 rounded-full text-sm font-semibold bg-forest !text-[oklch(0.97_0.02_92)] shadow-sm",
            }}
          >
            {t("nav.catering")}
          </Link>

          {/* Direct Link 3: Event Planner */}
          <Link
            to="/planner"
            className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors text-forest/80 hover:text-forest hover:bg-forest/5"
            activeProps={{
              className:
                "px-3 py-1.5 rounded-full text-sm font-semibold bg-forest !text-[oklch(0.97_0.02_92)] shadow-sm",
            }}
          >
            {t("nav.planner")}
          </Link>

          {/* Dropdown 1: Magazin */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-forest ${
                isMagazinActive
                  ? "bg-forest !text-[oklch(0.97_0.02_92)] font-semibold shadow-sm"
                  : "text-forest/80 hover:text-forest hover:bg-forest/5"
              }`}
            >
              <span>{t("nav.magazine")}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-56 bg-white border border-[#e2e8e4] rounded-2xl shadow-xl p-1.5 z-50"
            >
              <DropdownMenuItem asChild className="rounded-xl hover:bg-forest/5 cursor-pointer p-2">
                <Link
                  to="/magazin"
                  className="flex items-center w-full text-forest text-xs font-semibold"
                >
                  <BookOpen className="mr-2.5 h-4 w-4 text-[#7FA46B]" aria-hidden="true" />
                  <span>{t("nav.magazine.all")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-xl hover:bg-forest/5 cursor-pointer p-2">
                <Link
                  to="/magazin/speisely-visits"
                  className="flex items-center w-full text-forest text-xs font-semibold"
                >
                  <Eye className="mr-2.5 h-4 w-4 text-[#7FA46B]" aria-hidden="true" />
                  <span>{t("nav.magazine.visits")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="rounded-xl hover:bg-[#DDEEE3]/50 cursor-pointer p-2 bg-[#DDEEE3]/20"
              >
                <Link
                  to="/community"
                  className="flex items-center w-full text-forest text-xs font-bold"
                >
                  <Users className="mr-2.5 h-4 w-4 text-[#7FA46B]" aria-hidden="true" />
                  <span>{t("nav.magazine.community")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#e2e8e4]/60 my-1" />
              <DropdownMenuItem asChild className="rounded-xl hover:bg-forest/5 cursor-pointer p-2">
                <Link
                  to="/blog"
                  className="flex items-center w-full text-forest text-xs font-semibold"
                >
                  <TrendingUp className="mr-2.5 h-4 w-4 text-[#7FA46B]" aria-hidden="true" />
                  <span>{t("nav.magazine.tips")}</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dropdown 2: Für Partner */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-forest ${
                isPartnersActive
                  ? "bg-forest !text-[oklch(0.97_0.02_92)] font-semibold shadow-sm"
                  : "text-forest/80 hover:text-forest hover:bg-forest/5"
              }`}
            >
              <span>{t("nav.partners")}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-52 bg-white border border-[#e2e8e4] rounded-2xl shadow-xl p-1.5 z-50"
            >
              <DropdownMenuItem asChild className="rounded-xl hover:bg-forest/5 cursor-pointer p-2">
                <Link
                  to="/partners"
                  className="flex items-center w-full text-forest text-xs font-semibold"
                >
                  <Briefcase className="mr-2.5 h-4 w-4 text-[#7FA46B]" aria-hidden="true" />
                  <span>{t("nav.partners.overview")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-xl hover:bg-forest/5 cursor-pointer p-2">
                <Link
                  to="/partners"
                  hash="pricing"
                  className="flex items-center w-full text-forest text-xs font-semibold"
                >
                  <DollarSign className="mr-2.5 h-4 w-4 text-[#E6B84A]" aria-hidden="true" />
                  <span>{t("nav.partners.pricing")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#e2e8e4]/60 my-1" />
              <DropdownMenuItem asChild className="rounded-xl hover:bg-forest/5 cursor-pointer p-2">
                <Link
                  to="/auth"
                  search={{ signup: "partner", message: undefined, logout: undefined }}
                  className="flex items-center w-full text-forest text-xs font-bold text-[#b8860b]"
                >
                  <UserPlus className="mr-2.5 h-4 w-4" aria-hidden="true" />
                  <span>{t("nav.partners.join")}</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dropdown 3: Über Speisely */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-forest ${
                isAboutActive
                  ? "bg-forest !text-[oklch(0.97_0.02_92)] font-semibold shadow-sm"
                  : "text-forest/80 hover:text-forest hover:bg-forest/5"
              }`}
            >
              <span>{t("nav.aboutGroup")}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-44 bg-white border border-[#e2e8e4] rounded-2xl shadow-xl p-1.5 z-50"
            >
              <DropdownMenuItem asChild className="rounded-xl hover:bg-forest/5 cursor-pointer p-2">
                <Link
                  to="/about"
                  className="flex items-center w-full text-forest text-xs font-semibold"
                >
                  <Info className="mr-2.5 h-4 w-4 text-[#7FA46B]" aria-hidden="true" />
                  <span>{t("nav.about")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-xl hover:bg-forest/5 cursor-pointer p-2">
                <Link
                  to="/contact"
                  className="flex items-center w-full text-forest text-xs font-semibold"
                >
                  <Mail className="mr-2.5 h-4 w-4 text-[#7FA46B]" aria-hidden="true" />
                  <span>{t("nav.contact")}</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right Actions: Lang Toggle + Auth Buttons / User Dropdown + Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <LanguageToggle variant="dark" />

          {/* Auth Button Desktop */}
          <div className="hidden sm:flex items-center gap-2">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center gap-1.5 justify-center rounded-full px-3 py-1.5 text-sm font-medium hover:opacity-90 transition outline-none ring-0 bg-forest text-[oklch(0.97_0.02_92)]">
                  <User className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden xl:inline">{isDe ? "Mein Konto" : "Account"}</span>
                  <ChevronDown className="h-3 w-3 opacity-70" aria-hidden="true" />
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
                      <LayoutDashboard className="mr-2 h-4 w-4 text-forest/70" aria-hidden="true" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem
                      asChild
                      className="rounded-lg hover:bg-forest/5 cursor-pointer text-forest p-2 mt-1"
                    >
                      <Link to="/admin" className="flex items-center w-full">
                        <ShieldCheck
                          className="mr-2 h-4 w-4 text-brand-orange"
                          aria-hidden="true"
                        />
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
                    <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                    <span>{isDe ? "Abmelden" : "Sign out"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  to="/auth"
                  search={{ signup: undefined, message: undefined, logout: undefined }}
                  className="inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap border-forest/20 text-forest hover:bg-cream"
                >
                  {tt("Anmelden", "Sign in")}
                </Link>
                <Link
                  to="/auth"
                  search={{ signup: "partner", message: undefined, logout: undefined }}
                  className="inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-xs font-bold transition whitespace-nowrap bg-forest text-[oklch(0.97_0.02_92)] hover:opacity-90 shadow-sm"
                >
                  {tt("Partner werden", "Join as Partner")}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-xl text-forest hover:bg-forest/5 transition-colors focus:outline-none focus:ring-2 focus:ring-forest"
            aria-label={mobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-forest/10 bg-cream/98 px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          {/* Direct Links */}
          <div className="grid grid-cols-3 gap-2 pb-2 border-b border-forest/10">
            <Link
              to="/restaurants"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 text-center rounded-xl bg-white border border-forest/10 text-xs font-bold text-forest shadow-xs"
            >
              {t("nav.restaurants")}
            </Link>
            <Link
              to="/catering"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 text-center rounded-xl bg-white border border-forest/10 text-xs font-bold text-forest shadow-xs"
            >
              {t("nav.catering")}
            </Link>
            <Link
              to="/planner"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 text-center rounded-xl bg-white border border-forest/10 text-xs font-bold text-forest shadow-xs"
            >
              {t("nav.planner")}
            </Link>
          </div>

          {/* Expandable Group 1: Magazin */}
          <div className="rounded-2xl border border-forest/10 bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => setMobileMagazinOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-forest hover:bg-forest/5 transition-colors"
              aria-expanded={mobileMagazinOpen}
            >
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#7FA46B]" aria-hidden="true" />
                {t("nav.magazine")}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-forest/60 transition-transform ${
                  mobileMagazinOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
            {mobileMagazinOpen && (
              <div className="bg-[#FDFBF7] px-4 py-2 border-t border-forest/5 space-y-1.5">
                <Link
                  to="/magazin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1.5 text-xs font-semibold text-forest/80 hover:text-forest"
                >
                  • {t("nav.magazine.all")}
                </Link>
                <Link
                  to="/magazin/speisely-visits"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1.5 text-xs font-semibold text-forest/80 hover:text-forest"
                >
                  • {t("nav.magazine.visits")}
                </Link>
                <Link
                  to="/community"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1.5 text-xs font-bold text-[#7FA46B]"
                >
                  • {t("nav.magazine.community")}
                </Link>
                <Link
                  to="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1.5 text-xs font-semibold text-forest/80 hover:text-forest"
                >
                  • {t("nav.magazine.tips")}
                </Link>
              </div>
            )}
          </div>

          {/* Expandable Group 2: Für Partner */}
          <div className="rounded-2xl border border-forest/10 bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => setMobilePartnersOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-forest hover:bg-forest/5 transition-colors"
              aria-expanded={mobilePartnersOpen}
            >
              <span className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-[#7FA46B]" aria-hidden="true" />
                {t("nav.partners")}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-forest/60 transition-transform ${
                  mobilePartnersOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
            {mobilePartnersOpen && (
              <div className="bg-[#FDFBF7] px-4 py-2 border-t border-forest/5 space-y-1.5">
                <Link
                  to="/partners"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1.5 text-xs font-semibold text-forest/80 hover:text-forest"
                >
                  • {t("nav.partners.overview")}
                </Link>
                <Link
                  to="/partners"
                  hash="pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1.5 text-xs font-semibold text-forest/80 hover:text-forest"
                >
                  • {t("nav.partners.pricing")}
                </Link>
                <Link
                  to="/auth"
                  search={{ signup: "partner", message: undefined, logout: undefined }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1.5 text-xs font-bold text-[#b8860b]"
                >
                  • {t("nav.partners.join")}
                </Link>
              </div>
            )}
          </div>

          {/* Expandable Group 3: Über Speisely */}
          <div className="rounded-2xl border border-forest/10 bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => setMobileAboutOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-forest hover:bg-forest/5 transition-colors"
              aria-expanded={mobileAboutOpen}
            >
              <span className="flex items-center gap-2">
                <Info className="h-4 w-4 text-[#7FA46B]" aria-hidden="true" />
                {t("nav.aboutGroup")}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-forest/60 transition-transform ${
                  mobileAboutOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
            {mobileAboutOpen && (
              <div className="bg-[#FDFBF7] px-4 py-2 border-t border-forest/5 space-y-1.5">
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1.5 text-xs font-semibold text-forest/80 hover:text-forest"
                >
                  • {t("nav.about")}
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1.5 text-xs font-semibold text-forest/80 hover:text-forest"
                >
                  • {t("nav.contact")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Auth Actions */}
          <div className="pt-2 flex items-center gap-2 sm:hidden">
            <Link
              to="/auth"
              search={{ signup: undefined, message: undefined, logout: undefined }}
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2.5 rounded-xl border border-forest/20 text-xs font-semibold text-forest"
            >
              {tt("Anmelden", "Sign in")}
            </Link>
            <Link
              to="/auth"
              search={{ signup: "partner", message: undefined, logout: undefined }}
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2.5 rounded-xl bg-forest text-[oklch(0.97_0.02_92)] text-xs font-bold shadow-sm"
            >
              {tt("Partner werden", "Join Partner")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
