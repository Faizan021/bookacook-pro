"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/context";

export default function CustomerBookingsPage() {
  const t = useT();

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t("bookings.myTitle")}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                {t("bookings.customerSubtitle")}
              </p>
            </div>

            <Link
              href="/caterers"
              className="inline-flex rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-400"
            >
              {t("bookings.findCaterers")}
            </Link>
          </div>

          <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
              <span className="text-2xl">📋</span>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              {t("empty.bookings")}
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-500">
              {t("empty.bookingsDesc")}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/caterers"
                className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-400"
              >
                {t("bookings.findCaterers")}
              </Link>

              <Link
                href="/customer"
                className="rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-white"
              >
                {t("bookings.backToDashboard")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
