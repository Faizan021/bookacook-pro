"use client"; // <--- MOVED TO THE TOP

import Link from "next/link";
import { useT } from "@/lib/i18n/context";

export default function CustomerBookingsPage() {
  const t = useT();

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[1.75rem] border border-border bg-card p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {t("bookings.myTitle")}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("bookings.customerSubtitle")}
              </p>
            </div>

            <Link
              href="/caterers"
              className="inline-flex rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              {t("bookings.findCaterers")}
            </Link>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-dashed border-border bg-secondary/35 p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-border bg-background shadow-sm">
              <span className="text-2xl">📋</span>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-foreground">
              {t("empty.bookings")}
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              {t("empty.bookingsDesc")}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/caterers"
                className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                {t("bookings.findCaterers")}
              </Link>

              <Link
                href="/customer"
                className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary"
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
