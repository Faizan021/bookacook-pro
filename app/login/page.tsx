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

      const meta = data.user?.user_metadata ?? {};
      const appMeta = data.user?.app_metadata ?? {};

      let role: string | null =
        (meta.role as string | undefined) ||
        (appMeta.role as string | undefined) ||
        null;

      if (!role) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user!.id)
          .maybeSingle();

        role = profile?.role ?? null;
      }

      let destination = "/";
      if (role === "caterer") destination = "/caterer";
      if (role === "admin") destination = "/admin";
      if (role === "customer") destination = "/customer";

      window.location.href = destination;
    } catch {
      setError(t("error.unexpected"));
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col">
        <header className="border-b border-border/60 bg-background/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center text-primary">
                <LogoMark className="h-8 w-8" />
              </div>

              <div className="flex flex-col">
                <span className="text-base font-semibold tracking-tight">Speisely</span>
                <span className="text-xs text-muted-foreground">
                  {t("home.brandTagline")}
                </span>
              </div>
            </Link>

            <LanguageSwitcher />
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-6 py-10 lg:py-16">
          <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <section className="hidden lg:block">
              <div className="max-w-xl">
                <div className="text-xs uppercase tracking-[0.24em] text-primary">
                  {t("home.badge")}
                </div>

                <h1 className="mt-4 text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-foreground">
                  {t("auth.welcomeBack")}
                </h1>

                <p className="mt-5 text-base leading-8 text-muted-foreground">
                  {t("home.editorialFooterTagline")}
                </p>

                <div className="mt-8 grid gap-4">
                  <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-sm">
                    <div className="text-sm font-semibold text-foreground">
                      {t("home.heroBenefit1")}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {t("home.editorialHeroSubtitle")}
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-sm">
                    <div className="text-sm font-semibold text-foreground">
                      {t("home.heroBenefit2")}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {t("home.steps.step2Desc")}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mx-auto w-full max-w-md">
              <div className="rounded-[1.75rem] border border-border bg-card p-8 shadow-sm">
                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center text-primary lg:hidden">
                      <LogoMark className="h-8 w-8" />
                    </div>

                    <div>
                      <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                        {t("auth.welcomeBack")}
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {t("auth.login")}
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      {t("auth.email")}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      {t("auth.password")}
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>

                  {error ? (
                    <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
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

                <p className="mt-5 text-center text-sm text-muted-foreground">
                  {t("auth.noAccount")}{" "}
                  <Link
                    href="/signup"
                    className="font-semibold text-primary transition hover:opacity-80"
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
