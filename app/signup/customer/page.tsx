"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LogoMark } from "@/components/ui/logo-mark";

type FormFields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormFields, string>>;

const EMPTY: FormFields = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  password: "",
};

export default function CustomerSignupPage() {
  const t = useT();

  const [form, setForm] = useState<FormFields>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  function setField(field: keyof FormFields, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate(): FormErrors {
    const e: FormErrors = {};

    if (!form.firstName.trim()) e.firstName = t("validation.required");
    if (!form.lastName.trim()) e.lastName = t("validation.required");

    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = t("validation.emailInvalid");
    }

    if (!form.phone.trim()) e.phone = t("validation.required");
    if (!form.city.trim()) e.city = t("validation.required");

    if (!form.password || form.password.length < 8) {
      e.password = t("validation.passwordMin");
    }

    return e;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    setServerError("");

    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            role: "customer",
            first_name: form.firstName.trim(),
            last_name: form.lastName.trim(),
            phone: form.phone.trim(),
            city: form.city.trim(),
            language: "de",
          },
        },
      });

      if (error) throw error;

      setSuccess(true);
      setForm(EMPTY);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : t("validation.serverError");
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  }

  const inputBase =
    "mt-1 w-full rounded-[1rem] border px-4 py-3 text-sm outline-none transition-all duration-200";
  const inputOk = `${inputBase} border-white/10 bg-black/10 text-white placeholder:text-white/30 focus:border-[#c49840]/35 focus:ring-2 focus:ring-[#c49840]/10`;
  const inputErr = `${inputBase} border-red-500/40 bg-red-500/10 text-red-200 placeholder:text-red-300/30 focus:border-red-500 focus:ring-2 focus:ring-red-500/10`;

  if (success) {
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

        <div className="absolute right-4 top-4 z-50">
          <LanguageSwitcher />
        </div>

        <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.045] p-10 text-center shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#c49840]/20 bg-[#c49840]/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-[#c49840]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="mt-6 text-2xl font-semibold tracking-tight text-white">
              {t("auth.signupSuccessTitle", "Account created successfully")}
            </h1>

            <p className="mt-3 text-sm leading-7 text-[#92a18f]">
              {t(
                "auth.signupSuccessDesc",
                "Your account has been created. You can now sign in and start planning your event with Speisely."
              )}
            </p>

            <div className="mt-8 space-y-3">
              <Link
                href="/login"
                className="block w-full rounded-[1rem] bg-[#c49840] px-4 py-3 text-center text-sm font-semibold text-black transition hover:scale-[1.01]"
              >
                {t("auth.goToLogin")}
              </Link>

              <Link
                href="/"
                className="block w-full rounded-[1rem] border border-white/10 bg-white/[0.03] py-3 text-center text-sm font-medium text-white transition hover:border-[#c49840]/30 hover:text-[#c49840]"
              >
                {t("nav.backToHome")}
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
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

      <div className="absolute right-4 top-4 z-50">
        <LanguageSwitcher />
      </div>

      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">
        <div className="hidden lg:flex lg:flex-col lg:justify-between lg:border-r lg:border-white/8 lg:bg-[#09130e]/60 lg:px-12 lg:py-12">
          <div>
            <Link href="/" className="flex items-center gap-3 text-[#eadfca]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c49840]/25 bg-[#c49840]/10">
                <LogoMark size={18} color="#e8ddc8" />
              </div>
              <div className="text-xl font-semibold tracking-tight">Speisely</div>
            </Link>
          </div>

          <div className="max-w-xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c49840]">
              {t("home.badge")}
            </div>

            <h1 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-white">
              {t("customerReg.title", "Create your customer account")}
            </h1>

            <p className="mt-5 text-base leading-8 text-[#9faf9b]">
              {t(
                "customerReg.leftDesc",
                "Join Speisely to save your event requests, discover premium caterers, and continue planning from your personal dashboard."
              )}
            </p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                <div className="text-sm font-semibold text-white">
                  {t("customerReg.benefit1Title", "Save your event requests")}
                </div>
                <p className="mt-2 text-sm leading-7 text-[#92a18f]">
                  {t(
                    "customerReg.benefit1Desc",
                    "Start with a simple idea and continue refining your catering brief later."
                  )}
                </p>
              </div>

              <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                <div className="text-sm font-semibold text-white">
                  {t("customerReg.benefit2Title", "Connect with the right caterers")}
                </div>
                <p className="mt-2 text-sm leading-7 text-[#92a18f]">
                  {t(
                    "customerReg.benefit2Desc",
                    "Compare curated partners, review your shortlist, and manage requests in one place."
                  )}
                </p>
              </div>
            </div>
          </div>

          <div />
        </div>

        <div className="flex items-center justify-center px-6 py-12 lg:px-16">
          <div className="w-full max-w-xl">
            <div className="mb-8">
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 text-sm text-white/40 transition hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                {t("signup.backToChooser", "Back")}
              </Link>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-10">
              <div className="mb-8">
                <div className="flex items-center gap-3 lg:hidden">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c49840]/25 bg-[#c49840]/10">
                    <LogoMark size={18} color="#e8ddc8" />
                  </div>
                  <div className="text-xl font-semibold tracking-tight text-[#eadfca]">
                    Speisely
                  </div>
                </div>

                <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white lg:mt-0">
                  {t("customerReg.title", "Create your customer account")}
                </h1>
                <p className="mt-2 text-sm text-[#9faf9b]">
                  {t(
                    "customerReg.subtitle",
                    "Set up your account to save requests and continue your event planning journey."
                  )}
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                        {t("auth.firstName", "First name")}
                        <span className="ml-1 text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) => setField("firstName", e.target.value)}
                        className={errors.firstName ? inputErr : inputOk}
                        placeholder="Max"
                      />
                      {errors.firstName && (
                        <p className="mt-1.5 text-xs font-medium text-red-400">
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                        {t("auth.lastName", "Last name")}
                        <span className="ml-1 text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) => setField("lastName", e.target.value)}
                        className={errors.lastName ? inputErr : inputOk}
                        placeholder="Mustermann"
                      />
                      {errors.lastName && (
                        <p className="mt-1.5 text-xs font-medium text-red-400">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                        {t("auth.email")}
                        <span className="ml-1 text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setField("email", e.target.value)}
                        className={errors.email ? inputErr : inputOk}
                        autoComplete="email"
                        placeholder="max@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-xs font-medium text-red-400">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                        {t("customerReg.phone", "Phone")}
                        <span className="ml-1 text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                        className={errors.phone ? inputErr : inputOk}
                        placeholder="+49 30 12345678"
                      />
                      {errors.phone && (
                        <p className="mt-1.5 text-xs font-medium text-red-400">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                      {t("customerReg.city", "City")}
                      <span className="ml-1 text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setField("city", e.target.value)}
                      className={errors.city ? inputErr : inputOk}
                      placeholder="Berlin"
                    />
                    {errors.city && (
                      <p className="mt-1.5 text-xs font-medium text-red-400">
                        {errors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                      {t("auth.password")}
                      <span className="ml-1 text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setField("password", e.target.value)}
                      className={errors.password ? inputErr : inputOk}
                      autoComplete="new-password"
                      placeholder="••••••••"
                    />
                    {errors.password && (
                      <p className="mt-1.5 text-xs font-medium text-red-400">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                {serverError && (
                  <div className="mt-6 rounded-[1rem] border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {serverError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-8 w-full rounded-[1rem] bg-[#c49840] px-4 py-4 text-sm font-bold text-black shadow-lg shadow-black/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? t("customerReg.submitting", "Creating account...")
                    : t("customerReg.submit", "Create account")}
                </button>

                <p className="mt-6 text-center text-xs text-white/40">
                  {t(
                    "customerReg.termsNote",
                    "By continuing, you agree to Speisely’s terms and privacy policy."
                  )}
                </p>

                <p className="mt-4 text-center text-sm text-white/60">
                  {t("auth.hasAccount")}{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-[#c49840] transition hover:text-white"
                  >
                    {t("auth.goToLogin")}
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
