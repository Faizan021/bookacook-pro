"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";

export default function LoginPage() {
  const t = useT();

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="absolute end-4 top-4">
        <LanguageSwitcher />
      </div>
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
        <div className="w-full rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">{t("auth.welcomeBack")}</h1>
          <p className="mt-2 text-gray-500">{t("auth.login")}</p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">{t("auth.email")}</label>
              <input
                type="email"
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t("auth.password")}</label>
              <input
                type="password"
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>

          <button className="mt-6 w-full rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-400">
            {t("auth.login")}
          </button>

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
