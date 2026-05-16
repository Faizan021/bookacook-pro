"use client";

import { ShieldCheck, ShieldAlert, Lock } from "lucide-react";
import { useT } from "@/lib/i18n/context";
import type {
  CatererProfile,
  VerificationStatus,
} from "@/lib/dashboard/caterer-modules";

type StyleSet = {
  badge: string;
  banner: string;
  bannerText: string;
  icon: string;
};

const STATUS_STYLE: Record<VerificationStatus, StyleSet> = {
  pending: {
    badge: "border border-amber-400/20 bg-amber-400/10 text-amber-300",
    banner: "border border-amber-400/20 bg-amber-400/10",
    bannerText: "text-amber-200",
    icon: "text-amber-300",
  },
  under_review: {
    badge: "border border-sky-400/20 bg-sky-400/10 text-sky-300",
    banner: "border border-sky-400/20 bg-sky-400/10",
    bannerText: "text-sky-200",
    icon: "text-sky-300",
  },
  verified: {
    badge: "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    banner: "",
    bannerText: "",
    icon: "",
  },
  rejected: {
    badge: "border border-red-400/20 bg-red-400/10 text-red-300",
    banner: "border border-red-400/20 bg-red-400/10",
    bannerText: "text-red-200",
    icon: "text-red-300",
  },
  suspended: {
    badge: "border border-red-500/20 bg-red-500/10 text-red-300",
    banner: "border border-red-500/20 bg-red-500/10",
    bannerText: "text-red-200",
    icon: "text-red-300",
  },
};

const SHOW_BANNER: VerificationStatus[] = [
  "pending",
  "under_review",
  "rejected",
  "suspended",
];

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8ea18b]">
        {label}
      </dt>
      <dd className="mt-1 text-sm break-words text-white">{value || "—"}</dd>
    </div>
  );
}

export function VerificationModule({ profile }: { profile?: CatererProfile }) {
  const t = useT();

  if (!profile) {
    return (
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c49840]">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t("verification.title")}
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {t("verification.title")}
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-white/10 bg-white/[0.045] py-16 text-center shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#c49840]/15 bg-[#c49840]/10 text-[#c49840]">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <p className="mt-5 text-lg font-semibold text-white">
            {t("empty.verification")}
          </p>
          <p className="mt-2 text-sm leading-7 text-[#92a18f]">
            {t("empty.verificationDesc")}
          </p>
        </div>
      </div>
    );
  }

  const style = STATUS_STYLE[profile.verificationStatus] ?? STATUS_STYLE.pending;
  const hasBanner = SHOW_BANNER.includes(profile.verificationStatus);

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c49840]">
          <ShieldCheck className="h-3.5 w-3.5" />
          {t("verification.title")}
        </div>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          {t("verification.title")}
        </h2>
        <p className="mt-2 text-sm leading-7 text-[#92a18f]">
          {t("verification.subtitle")}
        </p>
      </div>

      {hasBanner && (
        <div className={`rounded-[1.4rem] px-5 py-4 ${style.banner}`}>
          <div className="flex items-start gap-3 rtl:flex-row-reverse">
            <ShieldAlert className={`mt-0.5 h-5 w-5 shrink-0 ${style.icon}`} />
            <p className={`text-sm font-medium leading-7 ${style.bannerText}`}>
              {t(`verification.banner.${profile.verificationStatus}`)}
            </p>
          </div>
        </div>
      )}

      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8ea18b]">
          {t("verification.profileTitle")}
        </h3>

        <dl className="grid gap-5 sm:grid-cols-2">
          <Field
            label={t("verification.businessName")}
            value={profile.businessName}
          />
          <Field
            label={t("verification.contactPerson")}
            value={profile.contactPerson}
          />
          <Field label={t("verification.phone")} value={profile.phone} />
          <Field
            label={t("verification.address")}
            value={profile.businessAddress}
          />
          <Field
            label={t("verification.licenseNumber")}
            value={profile.licenseNumber}
          />
        </dl>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8ea18b]">
            {t("verification.statusLabel")}
          </p>

          <div className="mt-4">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] ${style.badge}`}
            >
              {t(`status.${profile.verificationStatus}`)}
            </span>
          </div>

          {profile.verificationStatus === "verified" && (
            <p className="mt-3 text-sm leading-7 text-emerald-300">
              {t("verification.verifiedNote")}
            </p>
          )}
        </div>

        <div
          className={`rounded-[1.75rem] border p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl ${
            profile.payoutEnabled
              ? "border-emerald-400/20 bg-emerald-400/10"
              : "border-red-400/20 bg-red-400/10"
          }`}
        >
          <p
            className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${
              profile.payoutEnabled ? "text-emerald-200" : "text-red-200"
            }`}
          >
            {t("verification.payoutEligibility")}
          </p>

          <div className="mt-4 flex items-center gap-3 rtl:flex-row-reverse">
            {profile.payoutEnabled ? (
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
            ) : (
              <Lock className="h-5 w-5 text-red-300" />
            )}

            <span
              className={`text-base font-semibold ${
                profile.payoutEnabled ? "text-emerald-100" : "text-red-100"
              }`}
            >
              {profile.payoutEnabled
                ? t("verification.payoutEnabled")
                : t("verification.payoutBlocked")}
            </span>
          </div>

          {!profile.payoutEnabled && (
            <p className="mt-3 text-sm leading-7 text-red-200">
              {t("verification.payoutBlockedDesc")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
