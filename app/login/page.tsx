"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";

function getRoleRedirect(role: string | null | undefined): string {
  switch (role) {
    case "caterer":  return "/caterer";
    case "admin":    return "/admin";
    case "customer": return "/customer";
    default:         return "/";
  }
}

export default function LoginPage() {
  const t = useT();
  const router = useRouter();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    console.log("[login] attempting sign-in for:", email);

    try {
      const supabase = createClient();

      // ── 1. Authenticate ──────────────────────────────────────────────────
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        console.error("[login] auth error:", authError.message);
        setError(authError.message);
        return;
      }

      const userId = authData.user.id;
      console.log("[login] auth success, user id:", userId);

      // ── 2. Resolve role (try 4 sources in order) ────────────────────────
      let role: string | null = null;

      // Source 1: get_my_role() RPC — SECURITY DEFINER, bypasses RLS entirely
      // Requires migration 004 to be run in Supabase SQL Editor
      const { data: rpcRole, error: rpcError } =
        await supabase.rpc("get_my_role");

      if (rpcError) {
        console.warn("[login] get_my_role() RPC error:", rpcError.message,
          "— run migration 004_profiles_rls.sql in Supabase SQL Editor");
      } else {
        console.log("[login] get_my_role() returned:", rpcRole);
        role = rpcRole as string | null;
      }

      // Source 2: direct profiles table query (works once RLS SELECT policy exists)
      if (!role) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .maybeSingle();

        if (profileError) {
          console.warn("[login] profiles table error:", profileError.message);
        } else {
          console.log("[login] profiles row:", profile);
          role = profile?.role ?? null;
        }
      }

      // Source 3: user_metadata (set during signup or via Supabase dashboard)
      if (!role) {
        const metaRole = authData.user.user_metadata?.role as string | undefined;
        if (metaRole) { console.log("[login] role from user_metadata:", metaRole); role = metaRole; }
      }

      // Source 4: app_metadata (set via Supabase service key / dashboard)
      if (!role) {
        const appRole = authData.user.app_metadata?.role as string | undefined;
        if (appRole) { console.log("[login] role from app_metadata:", appRole); role = appRole; }
      }

      const destination = getRoleRedirect(role);
      console.log("[login] final role:", role, "→ redirecting to:", destination);

      router.push(destination);
    } catch (err) {
      console.error("[login] unexpected error:", err);
      setError("Ein unerwarteter Fehler ist aufgetreten. Bitte erneut versuchen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="absolute end-4 top-4">
        <LanguageSwitcher />
      </div>
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
        <div className="w-full rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">{t("auth.welcomeBack")}</h1>
          <p className="mt-2 text-gray-500">{t("auth.login")}</p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("auth.email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("auth.password")}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-400 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Anmelden…
                </span>
              ) : (
                t("auth.login")
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            {t("auth.noAccount")}{" "}
            <Link href="/signup" className="font-medium text-orange-500 hover:text-orange-600">
              {t("auth.goToSignup")}
            </Link>
          </p>

          <div className="mt-6 border-t border-gray-100 pt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              {t("landing.previewLabel")}
            </p>
            <div className="grid gap-2">
              <Link href="/demo/customer" className="rounded-xl border px-4 py-2.5 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                {t("auth.previewCustomer")}
              </Link>
              <Link href="/demo/caterer" className="rounded-xl border px-4 py-2.5 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                {t("auth.previewCaterer")}
              </Link>
              <Link href="/demo/admin" className="rounded-xl border px-4 py-2.5 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                {t("auth.previewAdmin")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
