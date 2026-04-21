"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LogoMark } from "@/components/ui/logo-mark";

export default function LoginPage() {
  const t = useT();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Login failed. No user returned.");
        setLoading(false);
        return;
      }

      const meta = data.user.user_metadata ?? {};
      const appMeta = data.user.app_metadata ?? {};

      let role: string | null =
        (meta.role as string | undefined) ||
        (appMeta.role as string | undefined) ||
        null;

      if (!role) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .maybeSingle();

        if (profileError) {
          setError(profileError.message);
          setLoading(false);
          return;
        }

        role = profile?.role ?? null;
      }

      if (!role) {
        setError("Login succeeded, but no user role was found.");
        setLoading(false);
        return;
      }

      if (role === "admin") {
        window.location.href = "/admin";
        return;
      }

      if (role === "caterer") {
        window.location.href = "/caterer";
        return;
      }

      if (role === "customer") {
        window.location.href = "/customer";
        return;
      }

      setError(`Unknown user role: ${role}`);
      setLoading(false);
    } catch {
      setError(t("error.unexpected"));
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#07110c] text-[#f6f1e8]">
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(circle at top center, rgba(196,152,64,0.16) 0%, transparent 30%), radial-gradient(circle at 15% 85%, rgba(72,101,82,0.18) 0%, transparent 24%), radial-gradient(circle at 85% 30%, rgba(40,60,48,0.18) 0%, transparent 18%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_22%,transparent_72%,rgba(255,255,255,0.02))]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="border-b border-white/8 bg-[#09130e]/80 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-8">
            <Link href="/" className="flex items-center gap-3 text-[#eadfca]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c49840]/25 bg-[#c49840]/10">
                <LogoMark size={18} color="#e8ddc8" />
              </div>

              <div className="flex flex-col">
                <span className="text-xl font-semibold tracking-tight">Speisely</span>
                <span className="text-xs text-[#9faf9b]">
                  {t("home.brandTagline")}
                </span>
              </div>
            </Link>

            <LanguageSwitcher />
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-6 py-10 md:px-8 lg:py-16">
          <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <section className="hidden lg:block">
              <div className="max-w-xl">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c49840]">
                  {t("home.badge")}
                </div>

                <h1 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-white">
                  {t("auth.welcomeBack")}
                </h1>

                <p className="mt-5 text-base leading-8 text-[#9faf9b]">
                  {t("home.editorialFooterTagline")}
                </p>

                <div className="mt-8 grid gap-4">
                  <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                    <div className="text-sm font-semibold text-white">
                      {t("home.heroBenefit1")}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-[#92a18f]">
                      {t("home.editorialHeroSubtitle")}
                    </p>
                  </div>

                  <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                    <div className="text-sm font-semibold text-white">
                      {t("home.heroBenefit2")}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-[#92a18f]">
                      {t("home.steps.step2Desc")}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mx-auto w-full max-w-md">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c49840]/25 bg-[#c49840]/10 text-[#eadfca] lg:hidden">
                      <LogoMark size={18} color="#e8ddc8" />
                    </div>

                    <div>
                      <h2 className="text-3xl font-semibold tracking-tight text-white">
                        {t("auth.welcomeBack")}
                      </h2>
                      <p className="mt-2 text-sm text-[#9faf9b]">
                        {t("auth.login")}
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#eadfca]">
                      {t("auth.email")}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="w-full rounded-[1rem] border border-white/10 bg-black/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#c49840]/35 focus:ring-2 focus:ring-[#c49840]/10"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#eadfca]">
                      {t("auth.password")}
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="w-full rounded-[1rem] border border-white/10 bg-black/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#c49840]/35 focus:ring-2 focus:ring-[#c49840]/10"
                    />
                  </div>

                  {error ? (
                    <div className="rounded-[1rem] border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                      {error}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center rounded-[1rem] bg-[#c49840] px-4 py-3 text-sm font-semibold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="h-4 w-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        {t("auth.login")}
                      </span>
                    ) : (
                      t("auth.login")
                    )}
                  </button>
                </form>

                <p className="mt-5 text-center text-sm text-[#9faf9b]">
                  {t("auth.noAccount")}{" "}
                  <Link
                    href="/signup"
                    className="font-semibold text-[#c49840] transition hover:text-[#eadfca]"
                  >
                    {t("auth.goToSignup")}
                  </Link>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
