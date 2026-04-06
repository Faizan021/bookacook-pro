"use client";

<<<<<<< HEAD
import { useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function SignupPage() {
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);

    if (!contactPerson.trim() || !email.trim() || !password || !confirmPassword) {
      setStatusMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setStatusMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { data: signUpData, error: signUpError } = await supabaseBrowser.auth.signUp({
      email,
      password,
      options: {
        data: {
          contact_person: contactPerson,
          role: "customer",
        },
      },
    });

    if (signUpError) {
      setStatusMessage(signUpError.message);
      setLoading(false);
      return;
    }

    if (!signUpData?.user?.id) {
      setStatusMessage("Unable to create account. Please try again.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/signup-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: signUpData.user.id,
        email,
        contact_person: contactPerson,
        role: "customer",
      }),
    });

    setLoading(false);

    const result = await response.json();
    if (result.success) {
      setStatusMessage(
        "Success! Your account was created. Please check your email to confirm and then log in."
      );
    } else {
      setStatusMessage(
        `Account created, but profile save had an issue: ${result?.error ?? "unknown error"}. You can still log in.`
      );
    }

    setContactPerson("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
        <div className="w-full rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Customer Sign Up</h1>
          <p className="mt-2 text-gray-600">
            Create a new customer account with email, password, and contact person.
          </p>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Contact Person</span>
              <input
                type="text"
                value={contactPerson}
                onChange={(event) => setContactPerson(event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                placeholder="John Doe"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Email address</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                placeholder="Enter a strong password"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Confirm Password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                placeholder="Repeat your password"
                required
              />
            </label>

            {statusMessage ? (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {statusMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create customer account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-black underline">
              Log in
            </Link>
=======
import Link from "next/link";
import { useT } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";

export default function SignupPage() {
  const t = useT();

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="absolute end-4 top-4">
        <LanguageSwitcher />
      </div>

      <div className="mx-auto flex min-h-[80vh] max-w-lg items-center justify-center">
        <div className="w-full">
          <div className="mb-8 text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 shadow-sm shadow-orange-200">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-7 w-7">
                <path d="M12 2C9.243 2 7 4.243 7 7v1H4v13h16V8h-3V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v1H9V7c0-1.654 1.346-3 3-3zm0 8c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2z"/>
              </svg>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">{t("auth.createAccount")}</h1>
            <p className="mt-2 text-gray-500">{t("signup.chooseRole")}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/signup/caterer"
              className="group rounded-2xl border-2 border-orange-200 bg-white p-6 shadow-sm transition-all hover:border-orange-500 hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 3a1 1 0 011-1h.01a1 1 0 010 2H7a1 1 0 01-1-1zm2 3a1 1 0 00-2 0v1a2 2 0 00-2 2v1a2 2 0 00-2 2v.683a3.7 3.7 0 011.055.485 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0A3.7 3.7 0 0118 12.683V12a2 2 0 00-2-2V9a2 2 0 00-2-2V6a1 1 0 10-2 0v1h-1V6a1 1 0 10-2 0v1H8V6zm10 8.868a3.704 3.704 0 01-4.055-.036 1.704 1.704 0 00-1.89 0 3.704 3.704 0 01-4.11 0 1.704 1.704 0 00-1.89 0A3.7 3.7 0 012 14.868V17a1 1 0 001 1h14a1 1 0 001-1v-2.132zM9 3a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm3 0a1 1 0 011-1h.01a1 1 0 110 2H13a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{t("signup.asCaterer")}</h2>
              <p className="mt-1 text-sm text-gray-500">{t("signup.catererDesc")}</p>
              <span className="mt-3 inline-block text-xs font-semibold text-orange-500">{t("signup.catererCta")} →</span>
            </Link>

            <Link
              href="/signup/customer"
              className="group rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="font-bold text-gray-900 group-hover:text-gray-700 transition-colors">{t("signup.asCustomer")}</h2>
              <p className="mt-1 text-sm text-gray-500">{t("signup.customerDesc")}</p>
              <span className="mt-3 inline-block text-xs font-semibold text-gray-400">{t("signup.customerCta")} →</span>
            </Link>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            {t("auth.hasAccount")}{" "}
            <Link href="/login" className="font-medium text-orange-500 hover:text-orange-600">
              {t("auth.goToLogin")}
            </Link>
          </p>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
              {t("landing.previewLabel")}
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              <Link href="/demo/customer" className="rounded-xl border px-3 py-2 text-center text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50">
                {t("auth.previewCustomer")}
              </Link>
              <Link href="/demo/caterer" className="rounded-xl border px-3 py-2 text-center text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50">
                {t("auth.previewCaterer")}
              </Link>
              <Link href="/demo/admin" className="rounded-xl border px-3 py-2 text-center text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50">
                {t("auth.previewAdmin")}
              </Link>
            </div>
>>>>>>> e9057020fd43d92fbf1a91cb1d5444a718b2704f
          </div>
        </div>
      </div>
    </main>
  );
}
