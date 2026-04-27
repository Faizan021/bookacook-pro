"use client";

import { useState } from "react";
import Link from "next/link";
import { useT } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";
import { SpeiselyHeader } from "@/components/layout/SpeiselyHeader";
import { DynamicUnsplashImage } from "@/components/home/DynamicUnsplashImage";

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
    if (!form.licenseNumber.trim()) {
      e.licenseNumber = t(
        "validation.licenseRequired",
        "Bitte geben Sie eine Gewerbe- oder Registrierungsnummer an."
      );
    }

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

      const { data, error } = await supabase.auth.signUp({
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

      if (error) throw error;

      if (!data.user) {
        throw new Error("Signup failed. No user returned.");
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

  const inputBase =
    "mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition";
  const inputOk = `${inputBase} border-[#e8dcc8] bg-[#faf6ee] text-[#173f35] placeholder:text-[#8a9a94] focus:border-[#c9a45c] focus:ring-2 focus:ring-[#c9a45c]/15`;
  const inputErr = `${inputBase} border-red-300 bg-red-50 text-red-700 placeholder:text-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10`;

  if (success) {
    return (
      <main className="min-h-screen bg-[#faf6ee] text-[#16372f]">
        <SpeiselyHeader />

        <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-[1fr_0.9fr] lg:py-24">
          <div>
            <div className="inline-flex rounded-full border border-[#eadfce] bg-white px-4 py-2 text-sm font-semibold text-[#8a6d35] shadow-sm">
              {t("catererReg.pendingBadge", "Profil in Prüfung")}
            </div>

            <h1 className="mt-6 max-w-2xl text-5xl font-semibold tracking-tight md:text-7xl">
              {t("catererReg.successTitle", "Registrierung erfolgreich")}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5c6f68]">
              {t(
                "catererReg.successDesc",
                "Ihr Caterer-Profil wurde angelegt. Speisely prüft Ihre Angaben, bevor Auszahlungen und vollständige Sichtbarkeit aktiviert werden."
              )}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login?next=/caterer"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#173f35] px-6 font-semibold text-white shadow-sm transition hover:bg-[#0f2f27]"
              >
                {t("auth.goToLogin", "Zur Anmeldung")}
              </Link>

              <Link
                href="/"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#d8ccb9] bg-white px-6 font-semibold text-[#173f35] shadow-sm transition hover:bg-[#f4ead7]"
              >
                {t("nav.backToHome", "Zur Startseite")}
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.5rem] border border-[#eadfce] bg-white shadow-sm">
            <DynamicUnsplashImage
              section="premium"
              className="h-[520px]"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf6ee] text-[#16372f]">
      <SpeiselyHeader />

      <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:py-24">
        <div>
          <Link
            href="/signup"
            className="inline-flex rounded-full border border-[#d8ccb9] bg-white px-4 py-2 text-sm font-semibold text-[#49645c] shadow-sm transition hover:bg-[#f4ead7]"
          >
            ← {t("signup.backToChooser", "Zurück zur Auswahl")}
          </Link>

          <div className="mt-10 inline-flex rounded-full border border-[#eadfce] bg-white px-4 py-2 text-sm font-semibold text-[#8a6d35] shadow-sm">
            {t("forCaterers.badge", "Für Premium-Caterer")}
          </div>

          <h1 className="mt-6 max-w-2xl text-5xl font-semibold tracking-tight md:text-7xl">
            {t(
              "catererReg.title",
              "Caterer-Konto erstellen"
            )}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5c6f68]">
            {t(
              "catererReg.subtitle",
              "Registrieren Sie Ihr Catering-Unternehmen, präsentieren Sie Pakete professionell und erhalten Sie strukturierte Event-Anfragen."
            )}
          </p>

          <div className="mt-10 rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28a3c]">
              {t("catererReg.licenseRequired", "Verifizierung erforderlich")}
            </p>
            <p className="mt-3 text-sm leading-7 text-[#5c6f68]">
              {t(
                "catererReg.licenseHelp",
                "Für Speisely benötigen Caterer eine Gewerbe-, Lizenz- oder Registrierungsnummer. Ohne diese Angabe ist keine Registrierung möglich."
              )}
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-[2.5rem] border border-[#eadfce] bg-white shadow-sm">
            <DynamicUnsplashImage
              section="premium"
              className="h-80"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          </div>
        </div>

        <section className="mx-auto w-full max-w-xl">
          <div className="rounded-[2rem] border border-[#eadfce] bg-white p-8 shadow-sm">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
                {t("auth.signup", "Registrieren")}
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                {t("catererReg.title", "Caterer-Konto erstellen")}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#5c6f68]">
                {t(
                  "catererReg.formIntro",
                  "Füllen Sie die Unternehmensdaten aus. Ihr Profil wird vor der vollständigen Freischaltung geprüft."
                )}
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-[#173f35]">
                      {t("catererReg.businessName", "Unternehmensname")} *
                    </label>
                    <input
                      type="text"
                      value={form.businessName}
                      onChange={(e) => setField("businessName", e.target.value)}
                      className={errors.businessName ? inputErr : inputOk}
                      placeholder="Berlin Catering GmbH"
                    />
                    {errors.businessName ? (
                      <p className="mt-1.5 text-xs font-medium text-red-600">
                        {errors.businessName}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#173f35]">
                      {t("catererReg.contactPerson", "Ansprechperson")} *
                    </label>
                    <input
                      type="text"
                      value={form.contactPerson}
                      onChange={(e) => setField("contactPerson", e.target.value)}
                      className={errors.contactPerson ? inputErr : inputOk}
                      placeholder="Max Mustermann"
                    />
                    {errors.contactPerson ? (
                      <p className="mt-1.5 text-xs font-medium text-red-600">
                        {errors.contactPerson}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-[#173f35]">
                      {t("auth.email", "E-Mail")} *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      className={errors.email ? inputErr : inputOk}
                      placeholder="kontakt@catering.de"
                      autoComplete="email"
                    />
                    {errors.email ? (
                      <p className="mt-1.5 text-xs font-medium text-red-600">
                        {errors.email}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#173f35]">
                      {t("catererReg.phone", "Telefon")} *
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      className={errors.phone ? inputErr : inputOk}
                      placeholder="+49 30 12345678"
                    />
                    {errors.phone ? (
                      <p className="mt-1.5 text-xs font-medium text-red-600">
                        {errors.phone}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#173f35]">
                    {t("catererReg.businessAddress", "Geschäftsadresse")} *
                  </label>
                  <textarea
                    rows={2}
                    value={form.businessAddress}
                    onChange={(e) => setField("businessAddress", e.target.value)}
                    className={`${errors.businessAddress ? inputErr : inputOk} resize-none`}
                    placeholder="Musterstraße 1, 10115 Berlin"
                  />
                  {errors.businessAddress ? (
                    <p className="mt-1.5 text-xs font-medium text-red-600">
                      {errors.businessAddress}
                    </p>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-[#eadfce] bg-[#faf6ee] p-5">
                  <label className="flex items-center justify-between gap-3 text-sm font-semibold text-[#173f35]">
                    <span>{t("catererReg.licenseNumber", "Gewerbe-/Registrierungsnummer")} *</span>
                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a6d35]">
                      {t("catererReg.licenseRequired", "Pflichtfeld")}
                    </span>
                  </label>

                  <input
                    type="text"
                    value={form.licenseNumber}
                    onChange={(e) => setField("licenseNumber", e.target.value)}
                    className={errors.licenseNumber ? inputErr : inputOk}
                    placeholder="z. B. HRB-123456 / IHK-2024-789"
                  />

                  <p className="mt-2 text-xs leading-6 text-[#5c6f68]">
                    {t(
                      "catererReg.licenseHelp",
                      "Diese Angabe ist notwendig, damit Speisely Anbieter vor Auszahlung und Sichtbarkeit prüfen kann."
                    )}
                  </p>

                  {errors.licenseNumber ? (
                    <p className="mt-2 text-xs font-semibold text-red-600">
                      {errors.licenseNumber}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#173f35]">
                    {t("auth.password", "Passwort")} *
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setField("password", e.target.value)}
                    className={errors.password ? inputErr : inputOk}
                    autoComplete="new-password"
                    placeholder="••••••••"
                  />
                  {errors.password ? (
                    <p className="mt-1.5 text-xs font-medium text-red-600">
                      {errors.password}
                    </p>
                  ) : null}
                </div>
              </div>

              {serverError ? (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {serverError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="mt-8 w-full rounded-full bg-[#173f35] px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f2f27] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? t("catererReg.submitting", "Registrierung wird gesendet...")
                  : t("catererReg.submit", "Caterer-Konto erstellen")}
              </button>

              <p className="mt-5 text-center text-xs leading-6 text-[#5c6f68]">
                {t(
                  "catererReg.termsNote",
                  "Mit der Fortsetzung akzeptieren Sie die Speisely-Nutzungsbedingungen und Datenschutzrichtlinie."
                )}
              </p>

              <p className="mt-4 text-center text-sm text-[#5c6f68]">
                {t("auth.hasAccount", "Bereits ein Konto?")}{" "}
                <Link
                  href="/login?next=/caterer"
                  className="font-semibold text-[#173f35] underline-offset-4 hover:underline"
                >
                  {t("auth.goToLogin", "Zur Anmeldung")}
                </Link>
              </p>
            </form>
          </div>
        </section>
      </section>
    </main>
  );
}
