"use client";

import { Wallet, Landmark, Receipt, ShieldAlert } from "lucide-react";
import { useT } from "@/lib/i18n/context";
import type {
  ExtendedPayment,
  ExtendedPaymentTotals,
  PayoutStatus,
} from "@/lib/dashboard/caterer-modules";
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
  paid: "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  pending: "border border-amber-400/20 bg-amber-400/10 text-amber-300",
  refunded: "border border-white/10 bg-white/[0.05] text-[#cfc6b4]",
};

const payoutStatusStyle: Record<string, string> = {
  pending_payment: "border border-amber-400/20 bg-amber-400/10 text-amber-300",
  funds_held: "border border-sky-400/20 bg-sky-400/10 text-sky-300",
  partially_released: "border border-indigo-400/20 bg-indigo-400/10 text-indigo-300",
  payout_pending: "border border-purple-400/20 bg-purple-400/10 text-purple-300",
  payout_released: "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  refunded: "border border-white/10 bg-white/[0.05] text-[#cfc6b4]",
  partially_refunded: "border border-white/10 bg-white/[0.05] text-[#cfc6b4]",
  cancelled: "border border-red-400/20 bg-red-400/10 text-red-300",
  disputed: "border border-red-500/20 bg-red-500/10 text-red-300",
};

const demoSummary = {
  admin: { total: "€38,500", commission: "€3,850", pending: "€4,800" },
  caterer: { total: "€12,400", commission: "€1,240", pending: "€975" },
  customer: { total: "€3,395", commission: "€2,770", pending: "€1,200" },
};

function formatEur(n: number): string {
  return `€${n.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
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

  const basePayments =
    role === "admin"
      ? adminPayments
      : role === "caterer"
        ? catererPayments
        : customerPayments;

  const simplePayments = paymentsProp ?? basePayments;
  const summary = totalsOverride ?? demoSummary[role];

  const isExtendedEmpty = useExtended && extendedPayments!.length === 0;
  const isSimpleEmpty = !useExtended && paymentsProp !== undefined && simplePayments.length === 0;
  const isEmpty = isExtendedEmpty || isSimpleEmpty;

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c49840]">
          <Wallet className="h-3.5 w-3.5" />
          {t("payments.title")}
        </div>

        <h2 className="mt-3 text-2xl font-semibold text-white">
          {t("payments.title")}
        </h2>

        <p className="mt-2 text-sm leading-7 text-[#92a18f]">
          {role === "admin"
            ? t("payments.adminSubtitle")
            : role === "caterer"
              ? t("payments.catererSubtitle")
              : t("payments.customerSubtitle")}
        </p>
      </div>

      {isPayoutBlocked && role === "caterer" && (
        <div className="rounded-[1.6rem] border border-red-400/20 bg-red-400/10 px-5 py-4">
          <div className="flex items-start gap-3 rtl:flex-row-reverse">
            <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-300" />
            <p className="text-sm font-medium leading-7 text-red-200">
              {t("payments.payoutBlockedBanner")}
            </p>
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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] shadow-[0_24px_60px_rgba(0,0,0,0.20)] backdrop-blur-xl">
        <div className="border-b border-white/10 px-6 py-5 md:px-8">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c49840]">
            <Landmark className="h-3.5 w-3.5" />
            {t("payments.recentTransactions")}
          </div>
          <h3 className="mt-3 text-xl font-semibold text-white">
            {t("payments.recentTransactions")}
          </h3>
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#c49840]/15 bg-[#c49840]/10 text-[#c49840]">
              <Receipt className="h-7 w-7" />
            </div>
            <p className="mt-4 text-lg font-semibold text-white">
              {t("empty.payments")}
            </p>
            <p className="mt-2 text-sm leading-7 text-[#92a18f]">
              {t("empty.paymentsDesc")}
            </p>
          </div>
        ) : useExtended ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-black/10">
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
              <tbody className="divide-y divide-white/10">
                {extendedPayments!.map((p) => (
                  <tr key={p.id} className="transition hover:bg-white/[0.03]">
                    <td className="px-6 py-5 font-mono text-xs text-[#8ea18b]">{p.id}</td>
                    <td className="px-6 py-5 text-white">{p.description}</td>
                    <td className="px-6 py-5 text-[#cfc6b4]">{p.date}</td>
                    <td className="px-6 py-5 font-semibold text-white">{formatEur(p.grossAmount)}</td>
                    <td className="px-6 py-5 text-red-300">−{formatEur(p.commissionAmount)}</td>
                    <td className="px-6 py-5 font-semibold text-emerald-300">{formatEur(p.netPayout)}</td>
                    <td className="px-6 py-5 text-amber-300">{formatEur(p.heldAmount)}</td>
                    <td className="px-6 py-5 text-emerald-300">{formatEur(p.releasedAmount)}</td>
                    <td className="px-6 py-5">
                      <PayoutStatusBadge status={p.payoutStatus} label={t(`status.${p.payoutStatus}`)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-black/10">
                  <Th>{t("table.id")}</Th>
                  <Th>{t("table.description")}</Th>
                  <Th>{t("table.date")}</Th>
                  <Th>{t("table.amount")}</Th>
                  <Th>{t("table.status")}</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {simplePayments.map((p) => (
                  <tr key={p.id} className="transition hover:bg-white/[0.03]">
                    <td className="px-6 py-5 font-mono text-xs text-[#8ea18b]">{p.id}</td>
                    <td className="px-6 py-5 text-white">{p.description}</td>
                    <td className="px-6 py-5 text-[#cfc6b4]">{p.date}</td>
                    <td className="px-6 py-5 font-semibold text-white">{p.amount}</td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] whitespace-nowrap ${simpleStatusStyle[p.status] ?? ""}`}
                      >
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
    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8ea18b] whitespace-nowrap">
      {children}
    </th>
  );
}

type Accent = "default" | "amber" | "green" | "red";

const ACCENT: Record<
  Accent,
  { card: string; label: string; value: string; note: string }
> = {
  default: {
    card: "border-white/10 bg-white/[0.045]",
    label: "text-[#8ea18b]",
    value: "text-white",
    note: "text-[#92a18f]",
  },
  amber: {
    card: "border-amber-400/20 bg-amber-400/10",
    label: "text-amber-200",
    value: "text-amber-100",
    note: "text-amber-300",
  },
  green: {
    card: "border-emerald-400/20 bg-emerald-400/10",
    label: "text-emerald-200",
    value: "text-emerald-100",
    note: "text-emerald-300",
  },
  red: {
    card: "border-red-400/20 bg-red-400/10",
    label: "text-red-200",
    value: "text-red-100",
    note: "text-red-300",
  },
};

function SummaryCard({
  label,
  value,
  note,
  accent = "default",
}: {
  label: string;
  value: string;
  note: string;
  accent?: Accent;
}) {
  const s = ACCENT[accent];

  return (
    <div className={`rounded-[1.6rem] border p-5 shadow-[0_14px_34px_rgba(0,0,0,0.16)] ${s.card}`}>
      <p className={`text-sm ${s.label}`}>{label}</p>
      <p className={`mt-2 text-2xl font-bold ${s.value}`}>{value}</p>
      <p className={`mt-1 text-xs ${s.note}`}>{note}</p>
    </div>
  );
}

function PayoutStatusBadge({
  status,
  label,
}: {
  status: PayoutStatus;
  label: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] whitespace-nowrap ${payoutStatusStyle[status] ?? "border border-white/10 bg-white/[0.05] text-[#cfc6b4]"}`}
    >
      {label}
    </span>
  );
}
