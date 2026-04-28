"use client";

import { Wallet, Landmark, Receipt } from "lucide-react";
import { useT } from "@/lib/i18n/context";
import type {
  ExtendedPayment,
  ExtendedPaymentTotals,
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
  extendedPayments?: ExtendedPayment[];
  extendedTotals?: ExtendedPaymentTotals;
  adminSummary?: AdminPaymentSummary;
};

const STATUS_STYLE: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  refunded: "bg-[#faf6ee] text-[#5c6f68] border border-[#eadfce]",
};

export function PaymentsModule({
  role,
  payments = [],
  adminSummary,
}: PaymentsModuleProps) {
  const t = useT();

  return (
    <div className="space-y-6 text-[#16372f]">
      <div>
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a7432]">
          <Wallet className="h-3.5 w-3.5" />
          {t("payments.title", "Payments")}
        </div>

        <h2 className="mt-3 text-2xl font-semibold text-[#173f35]">
          {role === "admin"
            ? "Admin payments overview"
            : "Payments overview"}
        </h2>

        <p className="mt-2 text-sm leading-7 text-[#5c6f68]">
          {role === "admin"
            ? "Track customer payments, 10% platform commission, held funds, 7-day release eligibility, blocked payouts, and released caterer payouts."
            : "Monitor payments and payout activity."}
        </p>
      </div>

      {role === "admin" && adminSummary && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard label="Total GMV" value={adminSummary.gmv} />
          <SummaryCard
            label="Platform commission 10%"
            value={adminSummary.commissionTotal}
          />
          <SummaryCard label="Held funds" value={adminSummary.heldFunds} />
          <SummaryCard
            label="Eligible for release"
            value={adminSummary.eligibleForRelease}
          />
          <SummaryCard label="Released to caterers" value={adminSummary.releasedTotal} />
          <SummaryCard
            label="Blocked payouts / disputes"
            value={adminSummary.blockedPayouts}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-[2rem] border border-[#eadfce] bg-white shadow-sm">
        <div className="border-b border-[#eadfce] px-6 py-5">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a7432]">
            <Landmark className="h-3.5 w-3.5" />
            Transactions
          </div>

          <h3 className="mt-3 text-xl font-semibold text-[#173f35]">
            Recent payments
          </h3>

          {role === "admin" ? (
            <p className="mt-2 max-w-3xl text-sm leading-7 text-[#5c6f68]">
              Customer pays the full booking amount. Speisely holds funds until
              the event is completed, waits 7 days for possible issues, keeps
              10% commission, and releases 90% to the verified caterer.
            </p>
          ) : null}
        </div>

        {payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#eadfce] bg-[#faf6ee]">
              <Receipt className="h-7 w-7 text-[#9a7432]" />
            </div>

            <p className="mt-4 text-lg font-semibold text-[#173f35]">
              No payments yet
            </p>

            <p className="mt-2 max-w-md text-sm leading-7 text-[#5c6f68]">
              Payments will appear here once customers pay for bookings and
              payout status is tracked by Speisely.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-[#eadfce] bg-[#faf6ee]">
                  <Th>ID</Th>
                  <Th>Description</Th>
                  <Th>Date</Th>
                  <Th>Amount</Th>
                  <Th>Status</Th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#eadfce]">
                {payments.map((p) => (
                  <tr key={p.id} className="transition hover:bg-[#faf6ee]">
                    <td className="px-6 py-4 font-mono text-xs text-[#8a6d35]">
                      {p.id}
                    </td>

                    <td className="px-6 py-4 font-medium text-[#173f35]">
                      {p.description}
                    </td>

                    <td className="px-6 py-4 text-[#5c6f68]">{p.date}</td>

                    <td className="px-6 py-4 font-semibold text-[#173f35]">
                      {p.amount}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                          STATUS_STYLE[p.status] ??
                          "border border-[#eadfce] bg-[#faf6ee] text-[#5c6f68]"
                        }`}
                      >
                        {p.status}
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
    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
      {children}
    </th>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.6rem] border border-[#eadfce] bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-[#8a6d35]">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#173f35]">{value}</p>
    </div>
  );
}
