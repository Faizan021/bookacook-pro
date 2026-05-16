"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, LogOut, UserCircle2 } from "lucide-react";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LogoLockup } from "@/components/ui/logo-mark";
import { useT } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";

export function SpeiselyHeader() {
  const t = useT();
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (mounted) {
          setEmail(user?.email ?? null);
        }
      } catch {
        if (mounted) setEmail(null);
      } finally {
        if (mounted) setChecking(false);
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setEmail(null);
    window.location.href = "/";
  }

  const shortEmail =
    email && email.length > 24 ? `${email.slice(0, 21)}...` : email;

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8dcc8] bg-[#faf6ee]/90 text-[#16372f] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label="Speisely home">
          <LogoLockup />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link href="/caterers" className="text-[#49645c] hover:text-[#173f35]">
            {t("nav.discoverCaterers", "Caterer entdecken")}
          </Link>

          <Link href="/for-caterers" className="text-[#49645c] hover:text-[#173f35]">
            {t("nav.forCaterers", "Für Caterer")}
          </Link>

          <Link href="/about" className="text-[#49645c] hover:text-[#173f35]">
            {t("nav.about", "Über Speisely")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          {checking ? (
            <div className="hidden rounded-full border border-[#e8dcc8] bg-white px-5 py-2.5 text-sm font-semibold text-[#5c6f68] shadow-sm sm:block">
              ...
            </div>
          ) : email ? (
            <div className="group relative">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-[#d8ccb9] bg-white px-4 py-2.5 text-sm font-semibold text-[#173f35] shadow-sm transition hover:bg-[#faf6ee]"
              >
                <UserCircle2 className="h-4 w-4 text-[#b28a3c]" />
                <span className="hidden max-w-[170px] truncate lg:inline">
                  {shortEmail}
                </span>
                <span className="lg:hidden">Account</span>
                <ChevronDown className="h-4 w-4 text-[#8a6d35]" />
              </button>

              <div className="absolute right-0 top-full z-50 hidden w-72 pt-2 group-hover:block">
                <div className="rounded-2xl border border-[#eadfce] bg-white p-2 shadow-xl">
                  <div className="border-b border-[#eadfce] px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#b28a3c]">
                      Logged in
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold text-[#173f35]">
                      {email}
                    </p>
                  </div>

                  <Link
                    href="/customer"
                    className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#173f35] transition hover:bg-[#faf6ee]"
                  >
                    Customer dashboard
                  </Link>

                  <Link
                    href="/request/new"
                    className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#173f35] transition hover:bg-[#faf6ee]"
                  >
                    New AI event request
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-700 transition hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="group relative">
              <button
                type="button"
                className="rounded-full border border-[#e8dcc8] bg-white px-5 py-2.5 text-sm font-semibold text-[#173f35] shadow-sm transition hover:bg-[#faf6ee]"
              >
                {t("nav.login", "Login")}
              </button>

              <div className="absolute right-0 top-full z-50 hidden w-60 pt-2 group-hover:block">
                <div className="rounded-2xl border border-[#eadfce] bg-white p-2 shadow-xl">
                  <Link
                    href="/login"
                    className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#173f35] transition hover:bg-[#faf6ee]"
                  >
                    {t("nav.loginCustomer", "Login as customer")}
                  </Link>

                  <Link
                    href="/login?next=/caterer"
                    className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#173f35] transition hover:bg-[#faf6ee]"
                  >
                    {t("nav.loginCaterer", "Login as caterer")}
                  </Link>

                  <Link
                    href="/admin-login"
                    className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#8a6d35] transition hover:bg-[#faf6ee]"
                  >
                    {t("nav.loginAdmin", "Login as admin")}
                  </Link>
                </div>
              </div>
            </div>
          )}

          <Link
            href="/request/new"
            className="rounded-full bg-[#173f35] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f2f27]"
          >
            {t("nav.describeEvent", "Event beschreiben")}
          </Link>
        </div>
      </div>
    </header>
  );
}
