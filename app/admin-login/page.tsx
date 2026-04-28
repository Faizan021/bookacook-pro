"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n/context";
import { SpeiselyHeader } from "@/components/layout/SpeiselyHeader";

export default function AdminLoginPage() {
  const t = useT();

  const [email, setEmail] = useState("ahmad_faizan12@hotmail.com");
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
        email: email.trim(),
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

      if (profile?.role !== "admin") {
        await supabase.auth.signOut();
        setError("This account is not an admin account.");
        setLoading(false);
        return;
      }

      window.location.href = "/admin";
    } catch {
      setError(t("error.unexpected", "Unexpected error. Please try again."));
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf6ee] text-[#16372f]">
      <SpeiselyHeader />

      <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-[1fr_0.85fr] lg:py-24">
        <div>
          <div className="inline-flex rounded-full border border-[#eadfce] bg-white px-4 py-2 text-sm font-semibold text-[#8a6d35] shadow-sm">
            Admin Portal
          </div>

          <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl">
            Speisely Admin Login
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5c6f68]">
            Sign in to review caterer registrations, approve verification,
            manage marketplace visibility, and monitor platform operations.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-[#173f35]">
                Caterer approvals
              </p>
              <p className="mt-2 text-sm leading-7 text-[#5c6f68]">
                Verify, reject, or review new caterer applications.
              </p>
            </div>

            <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-[#173f35]">
                Platform control
              </p>
              <p className="mt-2 text-sm leading-7 text-[#5c6f68]">
                Manage trusted providers before they become visible.
              </p>
            </div>
          </div>
        </div>

        <section className="mx-auto w-full max-w-md">
          <div className="rounded-[2rem] border border-[#eadfce] bg-white p-8 shadow-sm">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
                Admin Login
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Welcome, Admin
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#5c6f68]">
                Only admin accounts can access this area.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#173f35]">
                  Email address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full rounded-[1rem] border border-[#e8dcc8] bg-[#faf6ee] px-4 py-3 text-sm text-[#173f35] outline-none transition focus:border-[#c9a45c] focus:ring-2 focus:ring-[#c9a45c]/15"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#173f35]">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-[1rem] border border-[#e8dcc8] bg-[#faf6ee] px-4 py-3 text-sm text-[#173f35] outline-none transition focus:border-[#c9a45c] focus:ring-2 focus:ring-[#c9a45c]/15"
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
                {loading ? "Checking admin access..." : "Login as Admin"}
              </button>
            </form>

            <div className="mt-5 text-center">
              <Link
                href="/"
                className="text-sm font-semibold text-[#173f35] underline-offset-4 hover:underline"
              >
                Back to homepage
              </Link>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
