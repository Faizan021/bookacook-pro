"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n/context";
import { SpeiselyHeader } from "@/components/layout/SpeiselyHeader";

type FormFields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormFields, string>>;

type Props = {
  next?: string;
};

const EMPTY: FormFields = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  password: "",
};

export default function CustomerSignupPageClient({ next = "" }: Props) {
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

      const { data, error } = await supabase.auth.signUp({
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

      if (!data.user) {
        throw new Error("Signup failed. No user returned.");
      }

      const userIdentities = data.user.identities ?? [];
      const emailAlreadyExists = userIdentities.length === 0;

      if (emailAlreadyExists) {
        setServerError(
          t(
            "auth.emailExists",
            "Diese E-Mail ist bereits registriert. Bitte melden Sie sich mit Ihrem bestehenden Konto an."
          )
        );
        setSubmitting(false);
        return;
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

  const loginHref = next
    ? `/login?next=${encodeURIComponent(next)}`
    : "/login";

  const inputBase =
    "mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition";
  const inputOk = `${inputBase} border-[#e8dcc8] bg-[#faf6ee] text-[#173f35] placeholder:text-[#8a9a94] focus:border-[#c9a45c] focus:ring-2 focus:ring-[#c9a45c]/15`;
  const inputErr = `${inputBase} border-red-300 bg-red-50 text-red-700 placeholder:text-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10`;

  if (success) {
    return (
      <main className="min-h-screen bg-[#faf6ee] text-[#16372f]">
        <SpeiselyHeader />

        <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center justify-center px-6 py-16">
          <div className="w-full max-w-md rounded-[2rem] border border-[#eadfce] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#173f35] text-white">
              ✓
            </div>

            <h1 className="mt-6 text-3xl font-semibold tracking-tight">
              {t(
                "auth.signupSuccessTitle",
                "Konto erfolgreich erstellt"
              )}
            </h1>

            <p className="mt-3 text-sm leading-7 text-[#5c6f68]">
              {t(
                "auth.signupSuccessDesc",
                "Ihr Konto wurde erstellt. Sie können sich jetzt anmelden und mit Ihrer Eventplanung fortfahren."
              )}
            </p>

            <div className="mt-8 space-y-3">
              <Link
                href={loginHref}
                className="block w-full rounded-full bg-[#173f35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2f27]"
              >
                {t("auth.goToLogin", "Zur Anmeldung")}
              </Link>

              <Link
                href="/"
                className="block w-full rounded-full border border-[#d8ccb9] bg-white px-5 py-3 text-sm font-semibold text-[#173f35] transition hover:bg-[#f4ead7]"
              >
                {t("nav.backToHome", "Zur Startseite")}
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf6ee] text-[#16372f]">
      <SpeiselyHeader />

      <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div>
          <Link
            href="/signup"
            className="inline-flex rounded-full border border-[#d8ccb9] bg-white px-4 py-2 text-sm font-semibold text-[#49645c] shadow-sm transition hover:bg-[#f4ead7]"
          >
            ← {t("signup.backToChooser", "Zurück zur Auswahl")}
          </Link>

          <div className="mt-10 inline-flex rounded-full border border-[#eadfce] bg-white px-4 py-2 text-sm font-semibold text-[#8a6d35] shadow-sm">
            {t("home.badge", "KI-gestützte Catering-Suche")}
          </div>

          <h1 className="mt-6 max-w-2xl text-5xl font-semibold tracking-tight md:text-7xl">
            {t("customerReg.title", "Kundenkonto erstellen")}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5c6f68]">
            {t(
              "customerReg.leftDesc",
              "Speichern Sie Event-Anfragen, entdecken Sie Premium-Caterer und führen Sie Ihre Planung im persönlichen Dashboard fort."
            )}
          </p>

          <div className="mt-10 grid gap-4">
            <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-[#173f35]">
                {t("customerReg.benefit1Title", "Event-Anfragen speichern")}
              </h3>
              <p className="mt-2 text-sm leading-7 text-[#5c6f68]">
                {t(
                  "customerReg.benefit1Desc",
                  "Starten Sie mit einer kurzen Idee und verfeinern Sie Ihr Catering-Briefing später weiter."
                )}
              </p>
            </div>

            <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-[#173f35]">
                {t(
                  "customerReg.benefit2Title",
                  "Mit passenden Caterern verbinden"
                )}
              </h3>
              <p className="mt-2 text-sm leading-7 text-[#5c6f68]">
                {t(
                  "customerReg.benefit2Desc",
                  "Vergleichen Sie kuratierte Partner, prüfen Sie Matches und verwalten Sie Ihre Anfragen an einem Ort."
                )}
              </p>
            </div>
          </div>
        </div>

        <section className="mx-auto w-full max-w-xl">
          <div className="rounded-[2rem] border border-[#eadfce] bg-white p-8 shadow-sm">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
                {t("auth.signup", "Registrieren")}
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                {t("customerReg.title", "Kundenkonto erstellen")}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#5c6f68]">
                {t(
                  "customerReg.subtitle",
                  "Erstellen Sie Ihr Konto, um Anfragen zu speichern und Ihre Eventplanung fortzuführen."
                )}
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-[#173f35]">
                      {t("auth.firstName", "Vorname")} *
                    </label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => setField("firstName", e.target.value)}
                      className={errors.firstName ? inputErr : inputOk}
                      placeholder="Max"
                    />
                    {errors.firstName ? (
                      <p className="mt-1.5 text-xs font-medium text-red-600">
                        {errors.firstName}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#173f35]">
                      {t("auth.lastName", "Nachname")} *
                    </label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setField("lastName", e.target.value)}
                      className={errors.lastName ? inputErr : inputOk}
                      placeholder="Mustermann"
                    />
                    {errors.lastName ? (
                      <p className="mt-1.5 text-xs font-medium text-red-600">
                        {errors.lastName}
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
                      autoComplete="email"
                      placeholder="max@example.com"
                    />
                    {errors.email ? (
                      <p className="mt-1.5 text-xs font-medium text-red-600">
                        {errors.email}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#173f35]">
                      {t("customerReg.phone", "Telefon")} *
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
                    {t("customerReg.city", "Stadt")} *
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setField("city", e.target.value)}
                    className={errors.city ? inputErr : inputOk}
                    placeholder="Berlin"
                  />
                  {errors.city ? (
                    <p className="mt-1.5 text-xs font-medium text-red-600">
                      {errors.city}
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
                  ? t("customerReg.submitting", "Konto wird erstellt...")
                  : t("customerReg.submit", "Konto erstellen")}
              </button>

              <p className="mt-5 text-center text-xs leading-6 text-[#5c6f68]">
                {t(
                  "customerReg.termsNote",
                  "Mit der Fortsetzung akzeptieren Sie die Speisely-Nutzungsbedingungen und Datenschutzrichtlinie."
                )}
              </p>

              <p className="mt-4 text-center text-sm text-[#5c6f68]">
                {t("auth.hasAccount", "Bereits ein Konto?")}{" "}
                <Link
                  href={loginHref}
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
