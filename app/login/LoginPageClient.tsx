"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n/context";
import { SpeiselyHeader } from "@/components/layout/SpeiselyHeader";
import { DynamicUnsplashImage } from "@/components/home/DynamicUnsplashImage";

type Props = {
  next?: string;
};

function safeNextPath(value?: string) {
  if (!value) return "";
  if (!value.startsWith("/")) return "";
  if (value.startsWith("//")) return "";
  return value;
}

export default function LoginPageClient({ next = "" }: Props) {
  const t = useT();
  const safeNext = safeNextPath(next);

  const isCatererLogin =
    safeNext === "/caterer" || safeNext.startsWith("/caterer/");
  const isRequestLogin =
    safeNext === "/request/new" || safeNext.startsWith("/request/");

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
        setError(t("auth.loginNoUser", "Login failed. No user returned."));
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      const role = profile?.role ?? null;

      if (!role) {
        setError(
          t("auth.noRoleFound", "Login succeeded, but no user role was found.")
        );
        setLoading(false);
        return;
      }

      if (isCatererLogin && role !== "caterer" && role !== "admin") {
        await supabase.auth.signOut();
        setError(
          t(
            "auth.catererAccountRequired",
            "Please log in with a caterer account. This account is registered as a customer."
          )
        );
        setLoading(false);
        return;
      }

      if (isRequestLogin && role !== "customer" && role !== "admin") {
        await supabase.auth.signOut();
        setError(
          t(
            "auth.customerAccountRequired",
            "Please log in with a customer account to continue your event request."
          )
        );
        setLoading(false);
        return;
      }

      if (safeNext) {
        window.location.assign(safeNext);
        return;
      }

      if (role === "admin") {
        window.location.assign("/admin");
        return;
      }

      if (role === "caterer") {
        window.location.assign("/caterer");
        return;
      }

      window.location.assign("/customer");
    } catch {
      setError(t("error.unexpected", "Unexpected error. Please try again."));
      setLoading(false);
    }
  }

  const signupHref = isCatererLogin
    ? "/signup/caterer"
    : safeNext
      ? `/signup/customer?next=${encodeURIComponent(safeNext)}`
      : "/signup";

  const badgeText = isCatererLogin
    ? t("auth.catererLoginBadge", "Caterer Portal")
    : isRequestLogin
      ? t("auth.requestLoginBadge", "AI event request")
      : t("auth.loginBadge", "Welcome back");

  const introTitle = isCatererLogin
    ? t("auth.catererLoginTitle", "Caterer login")
    : isRequestLogin
      ? t("auth.requestLoginTitle", "Save your AI event brief")
      : t("auth.welcomeBack", "Welcome back");

  const introDescription = isCatererLogin
    ? t(
        "auth.catererLoginIntro",
        "Sign in to manage your catering profile, packages, requests, availability, and payments."
      )
    : isRequestLogin
      ? t(
          "auth.requestLoginIntro",
          "Your event brief is already prepared. Log in to save it and continue to your catering matches."
        )
      : t(
          "auth.loginIntro",
          "Sign in to continue your catering requests, saved caterers, and event planning."
        );

  const buttonText = loading
    ? isRequestLogin
      ? t("auth.preparingRequest", "Continuing your AI brief...")
      : t("auth.loggingIn", "Logging in...")
    : isRequestLogin
      ? t("auth.continueRequest", "Continue event request")
      : t("auth.login", "Log In");

  return (
    <main className="min-h-screen bg-[#faf6ee] text-[#16372f]">
      <SpeiselyHeader />

      <section className="mx-auto grid min-h-[calc(100vh-76px)] max-w-6xl items-center gap-8 px-5 py-6 lg:grid-cols-[0.95fr_0.85fr] lg:py-7">
        <div className="hidden lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e8dcc8] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#8a6d35] shadow-sm">
            <Sparkles className="h-4 w-4" />
            {badgeText}
          </div>

          <h1 className="premium-heading mt-5 max-w-2xl text-[3.4rem] leading-[0.95] text-[#173f35]">
            {introTitle}
          </h1>

          <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#5c6f68]">
            {introDescription}
          </p>

          {isRequestLogin ? (
            <div className="mt-5 rounded-[1.5rem] border border-[#eadfce] bg-white/85 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28a3c]">
                {t("auth.requestSavedLabel", "Your request is waiting")}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#5c6f68]">
                {t(
                  "auth.requestSavedText",
                  "After login, Speisely will return you to your AI request and continue the brief automatically."
                )}
              </p>
            </div>
          ) : null}

          <div className="mt-5 overflow-hidden rounded-[2rem] border border-[#eadfce] bg-white shadow-sm">
            <DynamicUnsplashImage
              section="premium"
              className="h-[250px]"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          </div>
        </div>

        <section className="mx-auto w-full max-w-md">
          <div className="rounded-[1.8rem] border border-[#eadfce] bg-white p-6 shadow-[0_22px_70px_rgba(35,28,18,0.08)]">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28a3c]">
                {badgeText}
              </p>

              <h2 className="premium-heading mt-2 text-[2.1rem] leading-[0.98] text-[#173f35]">
                {introTitle}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#5c6f68]">
                {introDescription}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#173f35]">
                  {t("auth.email", "Email address")}
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
                  {t("auth.password", "Password")}
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
                {buttonText}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-[#5c6f68]">
              {t("auth.noAccount", "Don't have an account?")}{" "}
              <Link
                href={signupHref}
                className="font-semibold text-[#173f35] underline-offset-4 transition hover:underline"
              >
                {isCatererLogin
                  ? t("auth.createCatererAccount", "Create caterer account")
                  : t("auth.goToSignup", "Go to Sign Up")}
              </Link>
            </p>

            <div className="mt-3 text-center">
              <Link
                href="/admin-login"
                className="text-xs font-medium text-[#8a6d35] underline-offset-4 transition hover:text-[#173f35] hover:underline"
              >
                {t("nav.loginAdmin", "Login as admin")}
              </Link>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
