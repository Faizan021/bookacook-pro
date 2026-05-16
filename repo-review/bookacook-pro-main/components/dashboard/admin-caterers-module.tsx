"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";
import type { AdminCatererRecord, VerificationStatus } from "@/lib/dashboard/admin-modules";

type ActionType = "under_review" | "verified" | "rejected" | "suspended";

const STATUS_BADGE: Record<VerificationStatus, string> = {
  pending:      "bg-amber-50 text-amber-700",
  under_review: "bg-blue-50 text-blue-700",
  verified:     "bg-green-50 text-green-700",
  rejected:     "bg-red-50 text-red-700",
  suspended:    "bg-red-100 text-red-800",
};

const ACTION_STYLE: Record<ActionType, string> = {
  under_review: "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
  verified:     "bg-green-500 text-white hover:bg-green-600",
  rejected:     "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
  suspended:    "border border-gray-200 text-gray-600 hover:bg-gray-50",
};

function getActions(status: VerificationStatus): ActionType[] {
  switch (status) {
    case "pending":      return ["under_review", "verified", "rejected"];
    case "under_review": return ["verified", "rejected", "suspended"];
    case "verified":     return ["suspended"];
    case "rejected":     return ["verified", "suspended"];
    case "suspended":    return ["verified", "rejected"];
  }
}

export function AdminCaterersModule({ caterers: initial }: { caterers: AdminCatererRecord[] }) {
  const t = useT();
  const router = useRouter();
  const [caterers, setCaterers] = useState<AdminCatererRecord[]>(initial);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");

  async function performAction(catererId: string, action: ActionType) {
    setLoading((p) => ({ ...p, [catererId]: true }));
    setError("");

    const payoutEnabled = action === "verified";

    try {
      const supabase = createClient();
      const { error: err } = await supabase
        .from("caterers")
        .update({ verification_status: action, payout_enabled: payoutEnabled })
        .eq("id", catererId);

      if (err) throw err;

      setCaterers((prev) =>
        prev.map((c) =>
          c.id === catererId
            ? { ...c, verificationStatus: action as VerificationStatus, payoutEnabled }
            : c
        )
      );
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t("validation.serverError"));
    } finally {
      setLoading((p) => ({ ...p, [catererId]: false }));
    }
  }

  const counts = {
    pending:      caterers.filter((c) => c.verificationStatus === "pending").length,
    under_review: caterers.filter((c) => c.verificationStatus === "under_review").length,
    verified:     caterers.filter((c) => c.verificationStatus === "verified").length,
    rejected:     caterers.filter((c) => c.verificationStatus === "rejected").length,
    suspended:    caterers.filter((c) => c.verificationStatus === "suspended").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t("admin.caterers.title")}</h2>
          <p className="text-sm text-gray-500">{t("admin.caterers.subtitle")}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {counts.pending      > 0 && <Badge color="amber">{counts.pending} {t("status.pending")}</Badge>}
          {counts.under_review > 0 && <Badge color="blue">{counts.under_review} {t("status.under_review")}</Badge>}
          {counts.verified     > 0 && <Badge color="green">{counts.verified} {t("status.verified")}</Badge>}
          {counts.rejected     > 0 && <Badge color="red">{counts.rejected} {t("status.rejected")}</Badge>}
          {counts.suspended    > 0 && <Badge color="darkred">{counts.suspended} {t("status.suspended")}</Badge>}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {caterers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-16 text-center shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="mt-4 text-base font-semibold text-gray-600">{t("empty.caterers")}</p>
          <p className="mt-1 text-sm text-gray-400">{t("empty.caterersDesc")}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <Th>{t("admin.caterers.col.business")}</Th>
                  <Th>{t("admin.caterers.col.contact")}</Th>
                  <Th>{t("admin.caterers.col.license")}</Th>
                  <Th>{t("admin.caterers.col.status")}</Th>
                  <Th>{t("admin.caterers.col.payout")}</Th>
                  <Th>{t("admin.caterers.col.registered")}</Th>
                  <Th>{t("admin.caterers.col.actions")}</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {caterers.map((c) => {
                  const actions = getActions(c.verificationStatus);
                  const isLoading = Boolean(loading[c.id]);
                  return (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-900">{c.businessName}</div>
                        {c.phone && <div className="text-xs text-gray-400">{c.phone}</div>}
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-gray-800">{c.contactPerson || "—"}</div>
                        {c.email && <div className="text-xs text-gray-400">{c.email}</div>}
                      </td>
                      <td className="px-5 py-4">
                        {c.licenseNumber ? (
                          <span className="font-mono text-xs text-gray-700">{c.licenseNumber}</span>
                        ) : (
                          <span className="text-xs text-red-500">{t("admin.caterers.noLicense")}</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[c.verificationStatus]}`}>
                          {t(`status.${c.verificationStatus}`)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.payoutEnabled ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {c.payoutEnabled ? t("verification.payoutEnabled") : t("verification.payoutBlocked")}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-500">{c.createdAt || "—"}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {actions.map((action) => (
                            <button
                              key={action}
                              disabled={isLoading}
                              onClick={() => performAction(c.id, action)}
                              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${ACTION_STYLE[action]}`}
                            >
                              {t(`admin.caterers.action.${action}`)}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-500">
      {children}
    </th>
  );
}

type BadgeColor = "amber" | "blue" | "green" | "red" | "darkred";
const BADGE_COLOR: Record<BadgeColor, string> = {
  amber:   "bg-amber-50 text-amber-700",
  blue:    "bg-blue-50 text-blue-700",
  green:   "bg-green-50 text-green-700",
  red:     "bg-red-50 text-red-700",
  darkred: "bg-red-100 text-red-800",
};

function Badge({ color, children }: { color: BadgeColor; children: React.ReactNode }) {
  return (
    <span className={`rounded-full px-3 py-1 font-medium ${BADGE_COLOR[color]}`}>{children}</span>
  );
}
