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

export default function CatererSignupPage() {
  const t = useT();
  const [form, setForm] = useState<FormFields>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  function set(field: keyof FormFields, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.businessName.trim()) e.businessName = t("validation.required");
    if (!form.contactPerson.trim()) e.contactPerson = t("validation.required");
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = t("validation.emailInvalid");
    if (!form.phone.trim()) e.phone = t("validation.required");
    if (!form.businessAddress.trim()) e.businessAddress = t("validation.required");
    if (!form.licenseNumber.trim()) e.licenseNumber = t("validation.licenseRequired");
    if (!form.password || form.password.length < 8) e.password = t("validation.passwordMin");
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setServerError("");

    try {
      const supabase = createClient();

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            role: "caterer",
            full_name: form.contactPerson.trim(),
          },
        },
      });

      if (authError) throw authError;
      const userId = authData.user?.id;
      if (!userId) throw new Error(t("validation.serverError"));

      await supabase.from("profiles").upsert({
        id: userId,
        role: "caterer",
        full_name: form.contactPerson.trim(),
        phone: form.phone.trim(),
      });

      const { error: catererError } = await supabase.from("caterers").insert({
        user_id: userId,
        business_name: form.businessName.trim(),
        contact_person: form.contactPerson.trim(),
        phone: form.phone.trim(),
        business_address: form.businessAddress.trim(),
        license_number: form.licenseNumber.trim(),
        verification_status: "pending",
      });

      if (catererError) throw catererError;

      setSuccess(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : t("validation.serverError");
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const inputBase =
    "mt-1 w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2";
  const inputOk = `${inputBase} border-gray-200 focus:border-orange-400 focus:ring-orange-100`;
  const inputErr = `${inputBase} border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100`;

  if (success) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="absolute end-4 top-4">
          <LanguageSwitcher />
        </div>
        <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
          <div className="w-full rounded-2xl border bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mt-5 text-2xl font-bold text-gray-900">{t("catererReg.successTitle")}</h1>
            <p className="mt-2 text-sm text-gray-500">{t("catererReg.successDesc")}</p>
            <div className="mt-4 inline-flex items-center rounded-full bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-700">
              {t("catererReg.pendingBadge")}
            </div>
            <div className="mt-6 space-y-2">
              <Link
                href="/login"
                className="block w-full rounded-xl bg-orange-500 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-orange-400"
              >
                {t("auth.goToLogin")}
              </Link>
              <Link
                href="/"
                className="block w-full rounded-xl border py-2.5 text-center text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
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
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="absolute end-4 top-4">
        <LanguageSwitcher />
      </div>

      <div className="mx-auto max-w-2xl py-10">
        <div className="mb-2">
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-gray-600 rtl:flex-row-reverse"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 rtl:rotate-180">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            {t("signup.backToChooser")}
          </Link>
        </div>

        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{t("catererReg.title")}</h1>
            <p className="mt-1 text-sm text-gray-500">{t("catererReg.subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t("catererReg.businessName")}
                    <span className="ms-1 text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.businessName}
                    onChange={(e) => set("businessName", e.target.value)}
                    className={errors.businessName ? inputErr : inputOk}
                    placeholder="Berlin BBQ House GmbH"
                  />
                  {errors.businessName && (
                    <p className="mt-1 text-xs text-red-500">{errors.businessName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t("catererReg.contactPerson")}
                    <span className="ms-1 text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.contactPerson}
                    onChange={(e) => set("contactPerson", e.target.value)}
                    className={errors.contactPerson ? inputErr : inputOk}
                    placeholder="Max Mustermann"
                  />
                  {errors.contactPerson && (
                    <p className="mt-1 text-xs text-red-500">{errors.contactPerson}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t("auth.email")}
                    <span className="ms-1 text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={errors.email ? inputErr : inputOk}
                    placeholder="kontakt@berlincatering.de"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t("catererReg.phone")}
                    <span className="ms-1 text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    className={errors.phone ? inputErr : inputOk}
                    placeholder="+49 30 12345678"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("catererReg.businessAddress")}
                  <span className="ms-1 text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={form.businessAddress}
                  onChange={(e) => set("businessAddress", e.target.value)}
                  className={`${errors.businessAddress ? inputErr : inputOk} resize-none`}
                  placeholder="Musterstraße 1, 10115 Berlin"
                />
                {errors.businessAddress && (
                  <p className="mt-1 text-xs text-red-500">{errors.businessAddress}</p>
                )}
              </div>

              <div className="rounded-xl border-2 border-orange-100 bg-orange-50/50 p-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 rtl:flex-row-reverse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  {t("catererReg.licenseNumber")}
                  <span className="ms-auto rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    {t("catererReg.licenseRequired")}
                  </span>
                </label>
                <input
                  type="text"
                  value={form.licenseNumber}
                  onChange={(e) => set("licenseNumber", e.target.value)}
                  className={`${errors.licenseNumber
                    ? `${inputBase} border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100`
                    : `${inputBase} border-orange-200 bg-white focus:border-orange-400 focus:ring-orange-100`
                  }`}
                  placeholder="z.B. HRB-123456 / IHK-2024-789"
                />
                <p className="mt-1.5 text-xs text-orange-600">{t("catererReg.licenseHelp")}</p>
                {errors.licenseNumber && (
                  <p className="mt-1 text-xs font-semibold text-red-600">{errors.licenseNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("auth.password")}
                  <span className="ms-1 text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  className={errors.password ? inputErr : inputOk}
                  autoComplete="new-password"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>
            </div>

            {serverError && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? t("catererReg.submitting") : t("catererReg.submit")}
            </button>

            <p className="mt-4 text-center text-xs text-gray-400">
              {t("catererReg.termsNote")}
            </p>

            <p className="mt-3 text-center text-sm text-gray-500">
              {t("auth.hasAccount")}{" "}
              <Link href="/login" className="font-medium text-orange-500 hover:text-orange-600">
                {t("auth.goToLogin")}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
