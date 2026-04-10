"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/context";

type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";

type Booking = {
  id: string;
  event: string;
  date: string;
  guests: number;
  amount: string;
  status: BookingStatus;
  customer?: string;
  caterer?: string;
};

type BookingsModuleProps = {
  role: "admin" | "caterer" | "customer";
  bookings?: Booking[];
};

const statusStyles: Record<BookingStatus, string> = {
  confirmed: "bg-green-50 text-green-700",
  pending: "bg-amber-50 text-amber-700",
  completed: "bg-blue-50 text-blue-700",
  cancelled: "bg-red-50 text-red-700",
};

function StatusBadge({ status }: { status: BookingStatus }) {
  const t = useT();

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[status]}`}
    >
      {t(`status.${status}`)}
    </span>
  );
}

function EmptyState({ role }: { role: "admin" | "caterer" | "customer" }) {
  const t = useT();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 text-gray-200"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>

      <p className="mt-4 text-base font-semibold text-gray-600">
        {t("empty.bookings")}
      </p>

      <p className="mt-1 text-sm text-gray-400">
        {t("empty.bookingsDesc")}
      </p>

      {role === "customer" && (
        <Link
          href="/"
          className="mt-6 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-400"
        >
          Caterer entdecken
        </Link>
      )}

      {role === "caterer" && (
        <Link
          href="/caterer/packages"
          className="mt-6 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-400"
        >
          Pakete hinzufügen
        </Link>
      )}
    </div>
  );
}

export function BookingsModule({ role, bookings = [] }: BookingsModuleProps) {
  const t = useT();
  const data = bookings;

  const title = role === "customer" ? t("bookings.myTitle") : t("bookings.title");
  const subtitle =
    role === "admin"
      ? t("bookings.adminSubtitle")
      : role === "caterer"
      ? t("bookings.catererSubtitle")
      : t("bookings.customerSubtitle");

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>
      </div>

      {data.length === 0 ? (
        <EmptyState role={role} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {t("table.id")}
                </th>
                {role === "admin" && (
                  <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {t("table.customer")}
                  </th>
                )}
                {role !== "customer" && (
                  <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {role === "admin" ? t("table.caterer") : t("table.customer")}
                  </th>
                )}
                {role === "customer" && (
                  <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {t("table.caterer")}
                  </th>
                )}
                <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {t("table.event")}
                </th>
                <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {t("table.date")}
                </th>
                <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {t("table.guests")}
                </th>
                <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {t("table.amount")}
                </th>
                <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {t("table.status")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {data.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">
                    {booking.id}
                  </td>

                  {role === "admin" && (
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {booking.customer}
                    </td>
                  )}

                  {role !== "customer" && (
                    <td className="px-6 py-4 text-gray-700">
                      {role === "admin" ? booking.caterer : booking.customer}
                    </td>
                  )}

                  {role === "customer" && (
                    <td className="px-6 py-4 text-gray-700">{booking.caterer}</td>
                  )}

                  <td className="px-6 py-4 text-gray-900">{booking.event}</td>
                  <td className="px-6 py-4 text-gray-600">{booking.date}</td>
                  <td className="px-6 py-4 text-gray-600">{booking.guests}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {booking.amount}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
