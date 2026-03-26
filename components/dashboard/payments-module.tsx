type PaymentsModuleProps = {
  role: "admin" | "caterer" | "customer";
};

type Payment = {
  id: string;
  description: string;
  date: string;
  amount: string;
  status: "paid" | "pending" | "refunded";
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

const statusStyles = {
  paid: "bg-green-50 text-green-700",
  pending: "bg-amber-50 text-amber-700",
  refunded: "bg-gray-100 text-gray-600",
};

const summaryByRole = {
  admin: {
    total: "€38,500",
    commission: "€3,850",
    pending: "€4,800",
    label: "Platform GMV",
    secondLabel: "Commission (10%)",
    thirdLabel: "Pending Payout",
  },
  caterer: {
    total: "€12,400",
    commission: "€1,240",
    pending: "€975",
    label: "Total Earned",
    secondLabel: "Platform Fee (10%)",
    thirdLabel: "Pending",
  },
  customer: {
    total: "€3,395",
    commission: "€2,770",
    pending: "€1,200",
    label: "Total Spent",
    secondLabel: "Completed",
    thirdLabel: "Pending",
  },
};

export function PaymentsModule({ role }: PaymentsModuleProps) {
  const payments = role === "admin" ? adminPayments : role === "caterer" ? catererPayments : customerPayments;
  const summary = summaryByRole[role];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Payments & Revenue</h2>
        <p className="text-sm text-gray-500">
          {role === "admin" ? "Platform-wide payment overview" : role === "caterer" ? "Your earnings and payouts" : "Your payment history"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">{summary.label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{summary.total}</p>
          <p className="mt-1 text-xs text-gray-400">All time</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">{summary.secondLabel}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{summary.commission}</p>
          <p className="mt-1 text-xs text-gray-400">All time</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-amber-50 p-5 shadow-sm border-amber-100">
          <p className="text-sm text-amber-700">{summary.thirdLabel}</p>
          <p className="mt-2 text-3xl font-bold text-amber-800">{summary.pending}</p>
          <p className="mt-1 text-xs text-amber-500">Awaiting confirmation</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h3 className="text-base font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Description</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{p.id}</td>
                  <td className="px-6 py-4 text-gray-900">{p.description}</td>
                  <td className="px-6 py-4 text-gray-600">{p.date}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{p.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
