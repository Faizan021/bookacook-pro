"use client";

import Link from "next/link";
import { CalendarRange, ClipboardList, ArrowRight } from "lucide-react";
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
  confirmed: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border border-amber-200 bg-amber-50 text-amber-700",
  completed: "border border-sky-200 bg-sky-50 text-sky-700",
  cancelled: "border border-red-200 bg-red-50 text-red-700",
};

function StatusBadge({ status }: { status: BookingStatus }) {
  const t = useT();

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${statusStyles[status]}`}
    >
      {t(`status.${status}`)}
    </span>
  );
}

function EmptyState({ role }: { role: "admin" | "caterer" | "customer" }) {
  const t = useT();

  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#eadfce] bg-[#faf6ee] text-[#b28a3c]">
        <ClipboardList className="h-7 w-7" />
      </div>

      <p className="premium-heading mt-5 text-lg font-semibold text-[#173f35]">
        {t("empty.bookings")}
      </p>

      <p className="mt-2 max-w-md text-sm leading-7 text-[#5c6f68]">
        {t("empty.bookingsDesc")}
      </p>

      {role === "customer" && (
        <Link
          href="/caterers"
          className="mt-6 inline-flex items-center gap-2 rounded-[1rem] bg-[#173f35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2f27]"
        >
          {t("bookings.findCaterers")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}

      {role === "caterer" && (
        <Link
          href="/caterer/packages"
          className="mt-6 inline-flex items-center gap-2 rounded-[1rem] bg-[#173f35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2f27]"
        >
          {t("bookings.addPackages")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export function BookingsModule({
  role,
  bookings = [],
}: BookingsModuleProps) {
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
    <div className="overflow-hidden rounded-[2rem] border border-[#eadfce] bg-white shadow-sm">
      <div className="border-b border-[#eadfce] bg-[#faf6ee] px-6 py-5 md:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b28a3c]">
              <CalendarRange className="h-3.5 w-3.5" />
              {role === "customer" ? t("nav.myBookings") : t("nav.bookings")}
            </div>

            <h2 className="premium-heading mt-3 text-2xl font-semibold text-[#173f35]">{title}</h2>
            <p className="mt-2 text-sm leading-7 text-[#5c6f68]">{subtitle}</p>
          </div>

          <div className="hidden rounded-full border border-[#d8ccb9] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5c6f68] md:inline-flex">
            {data.length} {data.length === 1 ? "item" : "items"}
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <EmptyState role={role} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-[#eadfce] bg-[#faf6ee]">
                <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35] md:px-8">
                  {t("table.id")}
                </th>

                {role === "admin" && (
                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                    {t("table.customer")}
                  </th>
                )}

                {role !== "customer" && (
                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                    {role === "admin" ? t("table.caterer") : t("table.customer")}
                  </th>
                )}

                {role === "customer" && (
                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                    {t("table.caterer")}
                  </th>
                )}

                <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                  {t("table.event")}
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                  {t("table.date")}
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                  {t("table.guests")}
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                  {t("table.amount")}
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                  {t("table.status")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#eadfce]">
              {data.map((booking) => (
                <tr
                  key={booking.id}
                  className="transition hover:bg-[#faf6ee]"
                >
                  <td className="px-6 py-5 font-mono text-xs font-semibold text-[#8a6d35] md:px-8">
                    {booking.id}
                  </td>

                  {role === "admin" && (
                    <td className="px-6 py-5 font-semibold text-[#173f35]">
                      {booking.customer || "—"}
                    </td>
                  )}

                  {role !== "customer" && (
                    <td className="px-6 py-5 font-medium text-[#5c6f68]">
                      {role === "admin" ? booking.caterer || "—" : booking.customer || "—"}
                    </td>
                  )}

                  {role === "customer" && (
                    <td className="px-6 py-5 font-medium text-[#5c6f68]">
                      {booking.caterer || "—"}
                    </td>
                  )}

                  <td className="px-6 py-5 font-semibold text-[#173f35]">{booking.event}</td>
                  <td className="px-6 py-5 font-medium text-[#5c6f68]">{booking.date}</td>
                  <td className="px-6 py-5 font-medium text-[#5c6f68]">{booking.guests}</td>
                  <td className="px-6 py-5 font-semibold text-[#173f35]">
                    {booking.amount}
                  </td>
                  <td className="px-6 py-5">
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
