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
  confirmed: "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  pending: "border border-amber-400/20 bg-amber-400/10 text-amber-300",
  completed: "border border-sky-400/20 bg-sky-400/10 text-sky-300",
  cancelled: "border border-red-400/20 bg-red-400/10 text-red-300",
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
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#c49840]/15 bg-[#c49840]/10 text-[#c49840]">
        <ClipboardList className="h-7 w-7" />
      </div>

      <p className="mt-5 text-lg font-semibold text-white">
        {t("empty.bookings")}
      </p>

      <p className="mt-2 max-w-md text-sm leading-7 text-[#92a18f]">
        {t("empty.bookingsDesc")}
      </p>

      {role === "customer" && (
        <Link
          href="/caterers"
          className="mt-6 inline-flex items-center gap-2 rounded-[1rem] bg-[#c49840] px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
        >
          {t("bookings.findCaterers")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}

      {role === "caterer" && (
        <Link
          href="/caterer/packages"
          className="mt-6 inline-flex items-center gap-2 rounded-[1rem] bg-[#c49840] px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
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
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] shadow-[0_24px_60px_rgba(0,0,0,0.20)] backdrop-blur-xl">
      <div className="border-b border-white/10 px-6 py-5 md:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c49840]">
              <CalendarRange className="h-3.5 w-3.5" />
              {role === "customer" ? t("nav.myBookings") : t("nav.bookings")}
            </div>

            <h2 className="mt-3 text-2xl font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm leading-7 text-[#92a18f]">{subtitle}</p>
          </div>

          <div className="hidden rounded-full border border-white/10 bg-black/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#8ea18b] md:inline-flex">
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
              <tr className="border-b border-white/10 bg-black/10">
                <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8ea18b] md:px-8">
                  {t("table.id")}
                </th>

                {role === "admin" && (
                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8ea18b]">
                    {t("table.customer")}
                  </th>
                )}

                {role !== "customer" && (
                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8ea18b]">
                    {role === "admin" ? t("table.caterer") : t("table.customer")}
                  </th>
                )}

                {role === "customer" && (
                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8ea18b]">
                    {t("table.caterer")}
                  </th>
                )}

                <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8ea18b]">
                  {t("table.event")}
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8ea18b]">
                  {t("table.date")}
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8ea18b]">
                  {t("table.guests")}
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8ea18b]">
                  {t("table.amount")}
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8ea18b]">
                  {t("table.status")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {data.map((booking) => (
                <tr
                  key={booking.id}
                  className="transition hover:bg-white/[0.03]"
                >
                  <td className="px-6 py-5 font-mono text-xs text-[#8ea18b] md:px-8">
                    {booking.id}
                  </td>

                  {role === "admin" && (
                    <td className="px-6 py-5 font-medium text-white">
                      {booking.customer || "—"}
                    </td>
                  )}

                  {role !== "customer" && (
                    <td className="px-6 py-5 text-[#ddd5c6]">
                      {role === "admin" ? booking.caterer || "—" : booking.customer || "—"}
                    </td>
                  )}

                  {role === "customer" && (
                    <td className="px-6 py-5 text-[#ddd5c6]">
                      {booking.caterer || "—"}
                    </td>
                  )}

                  <td className="px-6 py-5 text-white">{booking.event}</td>
                  <td className="px-6 py-5 text-[#cfc6b4]">{booking.date}</td>
                  <td className="px-6 py-5 text-[#cfc6b4]">{booking.guests}</td>
                  <td className="px-6 py-5 font-semibold text-white">
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
