"use client";

import { useState } from "react";
import Link from "next/link";
<<<<<<< HEAD
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function CustomerSignupPage() {
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
          </div>
=======
import { useT } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { createClient } from "@/lib/supabase/client";

export default function CustomerSignupPage() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const inputBase =
    "mt-1 w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2";
  const inputOk = `${inputBase} border-gray-200 focus:border-orange-400 focus:ring-orange-100`;
  const inputErr = `${inputBase} border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let valid = true;
    setEmailErr("");
    setPasswordErr("");
    setNameErr("");
    setServerError("");

    if (!name.trim()) { setNameErr(t("validation.required")); valid = false; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailErr(t("validation.emailInvalid")); valid = false;
    }
    if (!password || password.length < 8) {
      setPasswordErr(t("validation.passwordMin")); valid = false;
    }
    if (!valid) return;

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { role: "customer", full_name: name.trim() } },
      });
      if (authError) throw authError;
      const userId = authData.user?.id;
      if (userId) {
        await supabase.from("profiles").upsert({
          id: userId,
          role: "customer",
          full_name: name.trim(),
        });
      }
      setSuccess(true);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : t("validation.serverError"));
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="absolute end-4 top-4"><LanguageSwitcher /></div>
        <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
          <div className="w-full rounded-2xl border bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mt-5 text-2xl font-bold text-gray-900">{t("auth.createAccount")}</h1>
            <p className="mt-2 text-sm text-gray-500">{t("signup.customerSuccess")}</p>
            <Link href="/login" className="mt-6 block w-full rounded-xl bg-orange-500 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-orange-400">
              {t("auth.goToLogin")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="absolute end-4 top-4"><LanguageSwitcher /></div>
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
        <div className="w-full rounded-2xl border bg-white p-8 shadow-sm">
          <div className="mb-2">
            <Link href="/signup" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 rtl:flex-row-reverse">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 rtl:rotate-180">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              {t("signup.backToChooser")}
            </Link>
          </div>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">{t("signup.asCustomer")}</h1>
          <p className="mt-1 text-sm text-gray-500">{t("auth.createYour")}</p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("catererReg.contactPerson")}
                <span className="ms-1 text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setNameErr(""); }}
                className={nameErr ? inputErr : inputOk}
                placeholder="Anna Schmidt"
              />
              {nameErr && <p className="mt-1 text-xs text-red-500">{nameErr}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("auth.email")}
                <span className="ms-1 text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailErr(""); }}
                className={emailErr ? inputErr : inputOk}
                autoComplete="email"
              />
              {emailErr && <p className="mt-1 text-xs text-red-500">{emailErr}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("auth.password")}
                <span className="ms-1 text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordErr(""); }}
                className={passwordErr ? inputErr : inputOk}
                autoComplete="new-password"
              />
              {passwordErr && <p className="mt-1 text-xs text-red-500">{passwordErr}</p>}
            </div>

            {serverError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-400 disabled:opacity-60"
            >
              {submitting ? "..." : t("auth.createAccount")}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            {t("auth.hasAccount")}{" "}
            <Link href="/login" className="font-medium text-orange-500 hover:text-orange-600">
              {t("auth.goToLogin")}
            </Link>
          </p>
>>>>>>> e9057020fd43d92fbf1a91cb1d5444a718b2704f
        </div>
      </div>
    </main>
  );
}
