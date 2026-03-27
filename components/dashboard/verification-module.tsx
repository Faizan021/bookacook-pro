"use client";

import { useT } from "@/lib/i18n/context";
import type { CatererProfile, VerificationStatus } from "@/lib/dashboard/caterer-modules";

type StyleSet = { badge: string; banner: string; bannerText: string; icon: string };

const STATUS_STYLE: Record<VerificationStatus, StyleSet> = {
  pending:      { badge: "bg-amber-50 text-amber-700",  banner: "border-amber-200 bg-amber-50",  bannerText: "text-amber-800",  icon: "text-amber-500" },
  under_review: { badge: "bg-blue-50 text-blue-700",    banner: "border-blue-200 bg-blue-50",    bannerText: "text-blue-800",   icon: "text-blue-500" },
  verified:     { badge: "bg-green-50 text-green-700",  banner: "",                              bannerText: "",                icon: "" },
  rejected:     { badge: "bg-red-50 text-red-700",      banner: "border-red-200 bg-red-50",      bannerText: "text-red-800",    icon: "text-red-500" },
  suspended:    { badge: "bg-red-100 text-red-800",     banner: "border-red-200 bg-red-50",      bannerText: "text-red-900",    icon: "text-red-600" },
};

const SHOW_BANNER: VerificationStatus[] = ["pending", "under_review", "rejected", "suspended"];

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm text-gray-800 break-words">{value || "—"}</dd>
    </div>
  );
}

export function VerificationModule({ profile }: { profile?: CatererProfile }) {
  const t = useT();

  if (!profile) {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">{t("verification.title")}</h2>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-16 text-center shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p className="mt-4 text-base font-semibold text-gray-600">{t("empty.verification")}</p>
          <p className="mt-1 text-sm text-gray-400">{t("empty.verificationDesc")}</p>
        </div>
      </div>
    );
  }

  const style = STATUS_STYLE[profile.verificationStatus] ?? STATUS_STYLE.pending;
  const hasBanner = SHOW_BANNER.includes(profile.verificationStatus);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{t("verification.title")}</h2>
        <p className="text-sm text-gray-500">{t("verification.subtitle")}</p>
      </div>

      {hasBanner && (
        <div className={`rounded-xl border px-5 py-4 ${style.banner}`}>
          <div className="flex items-start gap-3 rtl:flex-row-reverse">
            <svg xmlns="http://www.w3.org/2000/svg" className={`mt-0.5 h-5 w-5 flex-shrink-0 ${style.icon}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className={`text-sm font-medium ${style.bannerText}`}>
              {t(`verification.banner.${profile.verificationStatus}`)}
            </p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          {t("verification.profileTitle")}
        </h3>
        <dl className="grid gap-5 sm:grid-cols-2">
          <Field label={t("verification.businessName")} value={profile.businessName} />
          <Field label={t("verification.contactPerson")} value={profile.contactPerson} />
          <Field label={t("verification.phone")} value={profile.phone} />
          <Field label={t("verification.address")} value={profile.businessAddress} />
          <Field label={t("verification.licenseNumber")} value={profile.licenseNumber} />
        </dl>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            {t("verification.statusLabel")}
          </p>
          <div className="mt-3">
            <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold ${style.badge}`}>
              {t(`status.${profile.verificationStatus}`)}
            </span>
          </div>
          {profile.verificationStatus === "verified" && (
            <p className="mt-2 text-xs text-green-600">{t("verification.verifiedNote")}</p>
          )}
        </div>

        <div className={`rounded-2xl border p-6 shadow-sm ${profile.payoutEnabled ? "border-green-100 bg-green-50" : "border-red-100 bg-red-50"}`}>
          <p className={`text-[11px] font-semibold uppercase tracking-wider ${profile.payoutEnabled ? "text-green-600" : "text-red-500"}`}>
            {t("verification.payoutEligibility")}
          </p>
          <div className="mt-3 flex items-center gap-2 rtl:flex-row-reverse">
            {profile.payoutEnabled ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            )}
            <span className={`text-base font-bold ${profile.payoutEnabled ? "text-green-800" : "text-red-800"}`}>
              {profile.payoutEnabled ? t("verification.payoutEnabled") : t("verification.payoutBlocked")}
            </span>
          </div>
          {!profile.payoutEnabled && (
            <p className="mt-2 text-xs text-red-600">{t("verification.payoutBlockedDesc")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
