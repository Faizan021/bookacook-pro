"use client";

import { useState } from "react";
import Link from "next/link";
import { useT } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { createClient } from "@/lib/supabase/client";

type FormFields = {
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessAddress: string;
  licenseNumber: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormFields, string>>;

const EMPTY: FormFields = {
  businessName: "",
  contactPerson: "",
  email: "",
  phone: "",
  businessAddress: "",
  licenseNumber: "",
  password: "",
};

// PREMIUM IMAGE URLS
const HERO_IMAGE_URL = "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop";
const SUCCESS_IMAGE_URL = "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=1200&auto=format&fit=crop";

export default function CatererSignupPage() {
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

    if (!form.businessName.trim()) e.businessName = t("validation.required");
    if (!form.contactPerson.trim()) e.contactPerson = t("validation.required");
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = t("validation.emailInvalid");
    }
    if (!form.phone.trim()) e.phone = t("validation.required");
    if (!form.businessAddress.trim()) e.businessAddress = t("validation.required");
    if (!form.licenseNumber.trim()) e.licenseNumber = t("validation.licenseRequired");
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
            role: "caterer",
            first_name: form.contactPerson.trim(),
            phone: form.phone.trim(),
            language: "de",
            city: "",
            business_name: form.businessName.trim(),
            business_address: form.businessAddress.trim(),
            license_number: form.licenseNumber.trim(),
          },
        },
      });

      if (error) {
        throw error;
      }

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

  // STYLES FOR DARK THEME FORM
  // We use explicit text-white and bg-white/5 to ensure visibility
  const inputBase =
    "mt-1 w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all duration-200";
  const inputOk = `${inputBase} border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/30 focus:bg-white/10 focus:ring-4 focus:ring-white/5`;
  const inputErr = `${inputBase} border-red-500/50 bg-red-500/10 text-red-200 placeholder:text-red-300/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10`;

  if (success) {
    return (
      <main className="min-h-screen bg-surface-dark text-white flex flex-col lg:flex-row">
        <div className="absolute end-4 top-4 z-50">
          <LanguageSwitcher />
        </div>

        <div className="hidden lg:block lg:w-1/2 relative">
          <img src={SUCCESS_IMAGE_URL} alt="Success" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>

        <div className="flex w-full items-center justify-center px-6 py-10 lg:w-1/2">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-card p-10 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-[var(--accent-gold)]"
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
              {t("catererReg.successTitle")}
            </h1>

            <p className="mt-3 text-sm text-white/60">
              {t("catererReg.successDesc")}
            </p>

            <div className="mt-5 inline-flex items-center rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold text-[var(--accent-gold)] ring-1 ring-[var(--accent-gold)]/20">
              {t("catererReg.pendingBadge")}
            </div>

            <div className="mt-8 space-y-3">
              <Link
                href="/login"
                className="block w-full rounded-xl px-4 py-3 text-center text-sm font-semibold text-black transition hover:brightness-110"
                style={{ background: "var(--accent-gold)" }}
              >
                {t("auth.goToLogin")}
              </Link>

              <Link
                href="/"
                className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 text-center text-sm font-medium text-white transition hover:bg-white/10"
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
    <main className="min-h-screen bg-surface-dark text-white">
      <div className="absolute end-4 top-4 z-50">
        <LanguageSwitcher />
      </div>

      <div className="grid min-h-screen lg:grid-cols-2">
        
        {/* LEFT SIDE: EYE-CATCHING IMAGE */}
        <div className="hidden lg:block relative overflow-hidden">
          <img 
            src={HERO_IMAGE_URL} 
            alt="Catering Excellence" 
            className="absolute inset-0 h-full w-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          
          <div className="absolute bottom-16 left-16 max-w-md">
            <h2 className="text-4xl font-semibold text-white leading-tight">
              Elevate your catering business with Speisely.
            </h2>
            <p className="mt-4 text-lg text-white/60">
              Join the most exclusive marketplace for professional catering services.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: THE FORM (FIXED CONTRAST) */}
        <div className="flex items-center justify-center px-6 py-12 lg:px-16 lg:py-12 bg-[#0a120e]"> 
          {/* Note: Added explicit dark hex bg-color above to ensure the background is dark even if theme fails */}
          
          <div className="w-full max-w-xl">
            <div className="mb-8">
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 text-sm text-white/40 transition hover:text-white rtl:flex-row-reverse"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 rtl:rotate-180"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                {t("signup.backToChooser")}
              </Link>
            </div>

            {/* THE FORM CONTAINER - NOW DARK & TRANSPARENT (Glassmorphism) */}
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md sm:p-10">
              <div className="mb-8">
                <h1 className="text-3xl font-semibold tracking-tight text-white">
                  {t("catererReg.title")}
                </h1>
                <p className="mt-2 text-sm text-white/50">
                  {t("catererReg.subtitle")}
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                        {t("catererReg.businessName")}
                        <span className="ms-1 text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.businessName}
                        onChange={(e) => setField("businessName", e.target.value)}
                        className={errors.businessName ? inputErr : inputOk}
                        placeholder="Berlin BBQ House GmbH"
                      />
                      {errors.businessName && (
                        <p className="mt-1.5 text-xs text-red-400 font-medium">
                          {errors.businessName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                        {t("catererReg.contactPerson")}
                        <span className="ms-1 text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.contactPerson}
                        onChange={(e) => setField("contactPerson", e.target.value)}
                        className={errors.contactPerson ? inputErr : inputOk}
                        placeholder="Max Mustermann"
                      />
                      {errors.contactPerson && (
                        <p className="mt-1.5 text-xs text-red-400 font-medium">
                          {errors.contactPerson}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                        {t("auth.email")}
                        <span className="ms-1 text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setField("email", e.target.value)}
                        className={errors.email ? inputErr : inputOk}
                        placeholder="kontakt@berlincatering.de"
                        autoComplete="email"
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                        {t("catererReg.phone")}
                        <span className="ms-1 text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                        className={errors.phone ? inputErr : inputOk}
                        placeholder="+49 30 12345678"
                      />
                      {errors.phone && (
                        <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                      {t("catererReg.businessAddress")}
                      <span className="ms-1 text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={form.businessAddress}
                      onChange={(e) => setField("businessAddress", e.target.value)}
                      className={`${errors.businessAddress ? inputErr : inputOk} resize-none`}
                      placeholder="Musterstraße 1, 10115 Berlin"
                    />
                    {errors.businessAddress && (
                      <p className="mt-1.5 text-xs text-red-400 font-medium">
                        {errors.businessAddress}
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors focus-within:border-white/20">
                    <label className="flex items-center gap-2 text-sm font-semibold text-white rtl:flex-row-reverse">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[var(--accent-gold)]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 4.925-3.31 9.128-7.834 10.614a.75.75 0 01-.532 0C5.31 16.073 2 11.87 2 7c0-.682.057-1.35.166-2.001zm11.54 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {t("catererReg.licenseNumber")}
                      <span className="ms-auto rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-gold)] ring-1 ring-[var(--accent-gold)]/20">
                        {t("catererReg.licenseRequired")}
                      </span>
                    </label>

                    <input
                      type="text"
                      value={form.licenseNumber}
                      onChange={(e) => setField("licenseNumber", e.target.value)}
                      className={
                        errors.licenseNumber
                          ? inputErr
                          : inputOk
                      }
                      placeholder="z.B. HRB-123456 / IHK-2024-789"
                    />

                    <p className="mt-2 text-[11px] text-white/40 italic">
                      {t("catererReg.licenseHelp")}
                    </p>

                    {errors.licenseNumber && (
                      <p className="mt-2 text-xs font-semibold text-red-400">
                        {errors.licenseNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                      {t("auth.password")}
                      <span className="ms-1 text-red-500">*</span>
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
                      <p className="mt-1.5 text-xs text-red-400 font-medium">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                {serverError && (
                  <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {serverError}
                  </div>
                )}

                {/* PREMIUM CTA: Gold Background, Black Text */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-8 w-full rounded-xl px-4 py-4 text-sm font-bold text-black shadow-lg shadow-black/20 transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ background: "var(--accent-gold)" }}
                >
                  {submitting ? t("catererReg.submitting") : t("catererReg.submit")}
                </button>

                <p className="mt-6 text-center text-xs text-white/40">
                  {t("catererReg.termsNote")}
                </p>

                <p className="mt-4 text-center text-sm text-white/60">
                  {t("auth.hasAccount")}{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-[var(--accent-gold)] transition hover:text-white"
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
