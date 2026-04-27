"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n/context";
import { SpeiselyHeader } from "@/components/layout/SpeiselyHeader";
import { DynamicUnsplashImage } from "@/components/home/DynamicUnsplashImage";

type Props = {
  next?: string;
};

export default function LoginPageClient({ next = "" }: Props) {
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

      if (next) {
        window.location.href = next;
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
      setError(t("error.unexpected", "Unexpected error. Please try again."));
      setLoading(false);
    }
  }

  const signupHref = next
    ? `/signup/customer?next=${encodeURIComponent(next)}`
    : "/signup";

  return (
    <main className="min-h-screen bg-[#faf6ee] text-[#16372f]">
      <SpeiselyHeader />

      <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div className="hidden lg:block">
          <div className="mb-6 inline-flex rounded-full border border-[#e8dcc8] bg-white px-4 py-2 text-sm font-semibold text-[#8a6d35] shadow-sm">
            {t("auth.loginBadge", "Willkommen zurück")}
          </div>

          <h1 className="max-w-2xl text-5xl font-semibold tracking-tight md:text-7xl">
            {t("auth.welcomeBack", "Zurück zu Speisely.")}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5c6f68]">
            {t(
              "auth.loginIntro",
              "Melden Sie sich an, um Catering-Anfragen, gespeicherte Caterer und Ihre Eventplanung weiterzuführen."
            )}
          </p>

          <div className="mt-10 overflow-hidden rounded-[2.5rem] border border-[#eadfce] bg-white shadow-sm">
            <DynamicUnsplashImage
              section="premium"
              className="h-[420px]"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>

        <section className="mx-auto w-full max-w-md">
          <div className="rounded-[2rem] border border-[#eadfce] bg-white p-8 shadow-sm">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
                {t("auth.login", "Login")}
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                {t("auth.welcomeBack", "Willkommen zurück")}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#5c6f68]">
                {t(
                  "auth.loginSubtitle",
                  "Melden Sie sich mit Ihrem Speisely-Konto an."
                )}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#173f35]">
                  {t("auth.email", "E-Mail")}
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full rounded-[1rem] border border-[#e8dcc8] bg-[#faf6ee] px-4 py-3 text-sm text-[#173f35] outline-none transition placeholder:text-[#8a9a94] focus:border-[#c9a45c] focus:ring-2 focus:ring-[#c9a45c]/15"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#173f35]">
                  {t("auth.password", "Passwort")}
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-[1rem] border border-[#e8dcc8] bg-[#faf6ee] px-4 py-3 text-sm text-[#173f35] outline-none transition placeholder:text-[#8a9a94] focus:border-[#c9a45c] focus:ring-2 focus:ring-[#c9a45c]/15"
                />
              </div>

              {error ? (
                <div className="rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-[1rem] bg-[#173f35] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f2f27] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? t("auth.loggingIn", "Wird angemeldet...")
                  : t("auth.login", "Einloggen")}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-[#5c6f68]">
              {t("auth.noAccount", "Noch kein Konto?")}{" "}
              <Link
                href={signupHref}
                className="font-semibold text-[#173f35] underline-offset-4 transition hover:underline"
              >
                {t("auth.goToSignup", "Registrieren")}
              </Link>
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
