"use client";

import { useT } from "@/lib/i18n/context";
import type { ExtendedPayment, ExtendedPaymentTotals, PayoutStatus } from "@/lib/dashboard/caterer-modules";
import type { AdminPaymentSummary } from "@/lib/dashboard/admin-modules";

type Payment = {
  id: string;
  description: string;
  date: string;
  amount: string;
  status: "paid" | "pending" | "refunded";
};

type PaymentsModuleProps = {
  role: "admin" | "caterer" | "customer";
  payments?: Payment[];
  totalsOverride?: { total: string; commission: string; pending: string };
  extendedPayments?: ExtendedPayment[];
  extendedTotals?: ExtendedPaymentTotals;
  isPayoutBlocked?: boolean;
  adminSummary?: AdminPaymentSummary;
};

const adminPayments: Payment[] = [
  { id: "PAY-001", description: "Wedding Reception — Royal Events", date: "15 Mar 2026", amount: "€8,400", status: "paid" },
  { id: "PAY-002", description: "Corporate Lunch — Berlin BBQ House", date: "10 Mar 2026", amount: "€2,100", status: "paid" },
  { id: "PAY-003", description: "Product Launch — FreshBite Co.", date: "5 Mar 2026", amount: "€4,800", status: "pending" },
  { id: "PAY-004", description: "Private Dinner — Taste of Italy", date: "1 Mar 2026", amount: "€640", status: "refunded" },
  { id: "PAY-005", description: "Team Away Day — The Grill Room", date: "25 Feb 2026", amount: "€975", status: "paid" },
];

const catererPayments: Payment[] = [
  { id: "PAY-001", description: "Corporate Lunch — 40 guests", date: "15 Mar 2026", amount: "€2,100", status: "paid" },
  { id: "PAY-002", description: "Birthday Party — 30 guests", date: "10 Mar 2026", amount: "€1,350", status: "paid" },
  { id: "PAY-003", description: "Wedding Deposit — 120 guests", date: "5 Mar 2026", amount: "€2,800", status: "paid" },
  { id: "PAY-004", description: "Private Dinner — 12 guests", date: "1 Mar 2026", amount: "€640", status: "refunded" },
  { id: "PAY-005", description: "Team Event — 25 guests", date: "25 Feb 2026", amount: "€975", status: "pending" },
];

const customerPayments: Payment[] = [
  { id: "PAY-001", description: "Corporate Lunch — FreshBite Catering", date: "10 Mar 2026", amount: "€1,150", status: "paid" },
  { id: "PAY-002", description: "BBQ Party Deposit — Berlin BBQ House", date: "5 Mar 2026", amount: "€425", status: "paid" },
  { id: "PAY-003", description: "Wedding Catering Deposit — Royal Events", date: "1 Mar 2026", amount: "€1,200", status: "pending" },
  { id: "PAY-004", description: "Birthday Party — Taste of Italy", date: "1 Feb 2026", amount: "€620", status: "paid" },
];

const simpleStatusStyle: Record<string, string> = {
  paid:     "bg-green-50 text-green-700",
  pending:  "bg-amber-50 text-amber-700",
  refunded: "bg-gray-100 text-gray-600",
};

const payoutStatusStyle: Record<string, string> = {
  pending_payment:    "bg-amber-50 text-amber-700",
  funds_held:         "bg-blue-50 text-blue-700",
  partially_released: "bg-indigo-50 text-indigo-700",
  payout_pending:     "bg-purple-50 text-purple-700",
  payout_released:    "bg-green-50 text-green-700",
  refunded:           "bg-gray-100 text-gray-600",
  partially_refunded: "bg-gray-100 text-gray-600",
  cancelled:          "bg-red-50 text-red-500",
  disputed:           "bg-red-100 text-red-700",
};

const demoSummary = {
  admin:    { total: "€38,500", commission: "€3,850", pending: "€4,800" },
  caterer:  { total: "€12,400", commission: "€1,240", pending: "€975" },
  customer: { total: "€3,395",  commission: "€2,770", pending: "€1,200" },
};

function formatEur(n: number): string {
  return `€${n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function PaymentsModule({
  role,
  payments: paymentsProp,
  totalsOverride,
  extendedPayments,
  extendedTotals,
  isPayoutBlocked = false,
  adminSummary,
}: PaymentsModuleProps) {
  const t = useT();

  const useExtended = extendedPayments !== undefined && role === "caterer";
  const useAdminSummary = adminSummary !== undefined && role === "admin";

  const basePayments = role === "admin" ? adminPayments : role === "caterer" ? catererPayments : customerPayments;
  const simplePayments = paymentsProp ?? basePayments;
  const summary = totalsOverride ?? demoSummary[role];

  const isExtendedEmpty = useExtended && extendedPayments!.length === 0;
  const isSimpleEmpty = !useExtended && paymentsProp !== undefined && simplePayments.length === 0;
  const isEmpty = isExtendedEmpty || isSimpleEmpty;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{t("payments.title")}</h2>
        <p className="text-sm text-gray-500">
          {role === "admin"
            ? t("payments.adminSubtitle")
            : role === "caterer"
            ? t("payments.catererSubtitle")
            : t("payments.customerSubtitle")}
        </p>
      </div>

      {isPayoutBlocked && role === "caterer" && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <div className="flex items-start gap-3 rtl:flex-row-reverse">
            <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-red-800">{t("payments.payoutBlockedBanner")}</p>
          </div>
        </div>
      )}

      {useAdminSummary ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard label={t("payments.gmv")} value={adminSummary!.gmv} note={t("payments.allTime")} />
          <SummaryCard label={t("payments.commission10")} value={adminSummary!.commissionTotal} note={t("payments.allTime")} />
          <SummaryCard label={t("payments.heldFunds")} value={adminSummary!.heldFunds} note={t("payments.awaitingConfirmation")} accent="amber" />
          <SummaryCard label={t("payments.released")} value={adminSummary!.releasedTotal} note={t("payments.allTime")} accent="green" />
          <SummaryCard label={t("payments.blockedPayouts")} value={adminSummary!.blockedPayouts} note={t("payments.unverifiedCaterers")} accent="red" />
        </div>
      ) : useExtended ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard label={t("payments.gross")} value={extendedTotals?.grossTotal ?? "€0"} note={t("payments.allTime")} />
          <SummaryCard label={t("payments.commission10")} value={extendedTotals?.commissionTotal ?? "€0"} note={t("payments.allTime")} />
          <SummaryCard label={t("payments.net")} value={extendedTotals?.netTotal ?? "€0"} note={t("payments.allTime")} accent="green" />
          <SummaryCard label={t("payments.held")} value={extendedTotals?.heldTotal ?? "€0"} note={t("payments.awaitingConfirmation")} accent="amber" />
          <SummaryCard label={t("payments.released")} value={extendedTotals?.releasedTotal ?? "€0"} note={t("payments.allTime")} accent="green" />
          <SummaryCard label={t("payments.remaining")} value={extendedTotals?.remainingTotal ?? "€0"} note={t("payments.awaitingConfirmation")} accent="amber" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard label={t(`payments.totalLabel.${role}`)} value={summary.total} note={t("payments.allTime")} />
          <SummaryCard label={t(`payments.secondLabel.${role}`)} value={summary.commission} note={t("payments.allTime")} />
          <SummaryCard label={t(`payments.thirdLabel.${role}`)} value={summary.pending} note={t("payments.awaitingConfirmation")} accent="amber" />
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h3 className="text-base font-semibold text-gray-900">{t("payments.recentTransactions")}</h3>
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <p className="mt-4 text-base font-semibold text-gray-600">{t("empty.payments")}</p>
            <p className="mt-1 text-sm text-gray-400">{t("empty.paymentsDesc")}</p>
          </div>
        ) : useExtended ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <Th>{t("table.id")}</Th>
                  <Th>{t("table.description")}</Th>
                  <Th>{t("table.date")}</Th>
                  <Th>{t("payments.gross")}</Th>
                  <Th>{t("payments.commission10")}</Th>
                  <Th>{t("payments.net")}</Th>
                  <Th>{t("payments.held")}</Th>
                  <Th>{t("payments.released")}</Th>
                  <Th>{t("payments.payoutStatus")}</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {extendedPayments!.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{p.id}</td>
                    <td className="px-6 py-4 text-gray-900">{p.description}</td>
                    <td className="px-6 py-4 text-gray-600">{p.date}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{formatEur(p.grossAmount)}</td>
                    <td className="px-6 py-4 text-red-600">−{formatEur(p.commissionAmount)}</td>
                    <td className="px-6 py-4 font-semibold text-green-700">{formatEur(p.netPayout)}</td>
                    <td className="px-6 py-4 text-amber-700">{formatEur(p.heldAmount)}</td>
                    <td className="px-6 py-4 text-green-700">{formatEur(p.releasedAmount)}</td>
                    <td className="px-6 py-4">
                      <PayoutStatusBadge status={p.payoutStatus} label={t(`status.${p.payoutStatus}`)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <Th>{t("table.id")}</Th>
                  <Th>{t("table.description")}</Th>
                  <Th>{t("table.date")}</Th>
                  <Th>{t("table.amount")}</Th>
                  <Th>{t("table.status")}</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {simplePayments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{p.id}</td>
                    <td className="px-6 py-4 text-gray-900">{p.description}</td>
                    <td className="px-6 py-4 text-gray-600">{p.date}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{p.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${simpleStatusStyle[p.status] ?? ""}`}>
                        {t(`status.${p.status}`)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">
      {children}
    </th>
  );
}

type Accent = "default" | "amber" | "green" | "red";
const ACCENT: Record<Accent, { card: string; label: string; value: string; note: string }> = {
  default: { card: "border-gray-200 bg-white", label: "text-gray-500", value: "text-gray-900", note: "text-gray-400" },
  amber:   { card: "border-amber-100 bg-amber-50", label: "text-amber-700", value: "text-amber-800", note: "text-amber-500" },
  green:   { card: "border-green-100 bg-green-50", label: "text-green-700", value: "text-green-800", note: "text-green-500" },
  red:     { card: "border-red-100 bg-red-50", label: "text-red-700", value: "text-red-800", note: "text-red-400" },
};

function SummaryCard({ label, value, note, accent = "default" }: { label: string; value: string; note: string; accent?: Accent }) {
  const s = ACCENT[accent];
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${s.card}`}>
      <p className={`text-sm ${s.label}`}>{label}</p>
      <p className={`mt-2 text-2xl font-bold ${s.value}`}>{value}</p>
      <p className={`mt-1 text-xs ${s.note}`}>{note}</p>
    </div>
  );
}

function PayoutStatusBadge({ status, label }: { status: PayoutStatus; label: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${payoutStatusStyle[status] ?? "bg-gray-100 text-gray-600"}`}>
      {label}
    </span>
  );
}
