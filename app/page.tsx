"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";

export default function Home() {
  const t = useT();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f172a] px-4 py-16">
      <div className="absolute end-4 top-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-3xl">
        <div className="mb-14 flex flex-col items-center text-center">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-2xl shadow-lg shadow-orange-500/25">
              🍽
            </div>
            <span className="text-xl font-bold tracking-tight text-white">BookaCook Pro</span>
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            {t("landing.title1")}
            <br />
            <span className="text-orange-400">{t("landing.title2")}</span>
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-slate-400">
            {t("landing.subtitle")}
          </p>
        </div>

        <div className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-slate-600">
          {t("landing.previewLabel")}
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <Link
            href="/demo/admin"
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-orange-500/40 hover:bg-white/8"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/20 text-xl">
              ⚙️
            </div>
            <h3 className="font-semibold text-white">{t("landing.adminTitle")}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
              {t("landing.adminDesc")}
            </p>
            <div className="mt-5 text-sm font-medium text-orange-400 transition-colors group-hover:text-orange-300">
              {t("landing.previewBtn")}
            </div>
          </Link>

          <Link
            href="/demo/caterer"
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-orange-500/40 hover:bg-white/8"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/20 text-xl">
              🍳
            </div>
            <h3 className="font-semibold text-white">{t("landing.catererTitle")}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
              {t("landing.catererDesc")}
            </p>
            <div className="mt-5 text-sm font-medium text-orange-400 transition-colors group-hover:text-orange-300">
              {t("landing.previewBtn")}
            </div>
          </Link>

          <Link
            href="/demo/customer"
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-orange-500/40 hover:bg-white/8"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20 text-xl">
              👤
            </div>
            <h3 className="font-semibold text-white">{t("landing.customerTitle")}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
              {t("landing.customerDesc")}
            </p>
            <div className="mt-5 text-sm font-medium text-orange-400 transition-colors group-hover:text-orange-300">
              {t("landing.previewBtn")}
            </div>
          </Link>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/login"
            className="rounded-xl border border-white/20 px-7 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/5"
          >
            {t("landing.login")}
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-orange-500 px-7 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-400"
          >
            {t("landing.createAccount")}
          </Link>
        </div>
      </div>
    </div>
  );
}
