"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n/context";

type DayStatus = "available" | "booked" | "blocked" | "empty";

const DAY_KEYS = ["days.sun", "days.mon", "days.tue", "days.wed", "days.thu", "days.fri", "days.sat"];
const MONTH_KEYS = [
  "months.0", "months.1", "months.2", "months.3", "months.4", "months.5",
  "months.6", "months.7", "months.8", "months.9", "months.10", "months.11",
];

const demoBookedDays = new Set([5, 6, 12, 15, 20, 22, 26, 27]);
const demoBlockedDays = new Set([8, 9, 29, 30, 31]);

function getBookedSetFromDates(dates: string[], year: number, month: number): Set<number> {
  const result = new Set<number>();
  for (const d of dates) {
    try {
      const date = new Date(d);
      if (!isNaN(date.getTime()) && date.getFullYear() === year && date.getMonth() === month) {
        result.add(date.getDate());
      }
    } catch {
      // skip invalid dates
    }
  }
  return result;
}

const dayStyles: Record<DayStatus | "empty", string> = {
  available: "bg-white hover:bg-green-50 text-gray-900 cursor-pointer border border-gray-200",
  booked: "bg-orange-100 text-orange-800 font-semibold border border-orange-200",
  blocked: "bg-gray-100 text-gray-400 border border-gray-200",
  empty: "bg-transparent border-transparent",
};

function buildMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: { day: number | null }[] = [];

  for (let i = 0; i < firstDay; i++) cells.push({ day: null });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d });
  while (cells.length % 7 !== 0) cells.push({ day: null });

  return cells;
}

type AvailabilityModuleProps = {
  bookedDates?: string[];
};

export function AvailabilityModule({ bookedDates }: AvailabilityModuleProps) {
  const t = useT();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const cells = buildMonthGrid(year, month);

  const isRealData = bookedDates !== undefined;
  const currentBookedDays = isRealData
    ? getBookedSetFromDates(bookedDates, year, month)
    : demoBookedDays;
  const currentBlockedDays = isRealData ? new Set<number>() : demoBlockedDays;

  function getDayStatus(day: number): DayStatus {
    if (currentBookedDays.has(day)) return "booked";
    if (currentBlockedDays.has(day)) return "blocked";
    return "available";
  }

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  const booked = cells.filter((c) => c.day && currentBookedDays.has(c.day)).length;
  const blocked = cells.filter((c) => c.day && currentBlockedDays.has(c.day)).length;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const available = daysInMonth - booked - blocked;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{t("availability.title")}</h2>
        <p className="text-sm text-gray-500">{t("availability.subtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3 rtl:flex-row-reverse">
            <div className="h-3 w-3 rounded-full bg-green-400" />
            <p className="text-sm font-medium text-gray-700">{t("availability.available")}</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{available}</p>
          <p className="text-xs text-gray-400">{t("availability.daysThisMonth")}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3 rtl:flex-row-reverse">
            <div className="h-3 w-3 rounded-full bg-orange-400" />
            <p className="text-sm font-medium text-gray-700">{t("availability.booked")}</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{booked}</p>
          <p className="text-xs text-gray-400">{t("availability.confirmedEvents")}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3 rtl:flex-row-reverse">
            <div className="h-3 w-3 rounded-full bg-gray-400" />
            <p className="text-sm font-medium text-gray-700">{t("availability.blocked")}</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{blocked}</p>
          <p className="text-xs text-gray-400">{t("availability.daysOff")}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between rtl:flex-row-reverse">
          <h3 className="text-base font-semibold text-gray-900">
            {t(MONTH_KEYS[month])} {year}
          </h3>
          <div className="flex gap-1">
            <button onClick={prevMonth} className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 rtl:rotate-180">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button onClick={nextMonth} className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 rtl:rotate-180">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
          {DAY_KEYS.map((key) => <div key={key}>{t(key)}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell, i) => {
            if (!cell.day) {
              return <div key={`empty-${i}`} className="aspect-square rounded-lg" />;
            }
            const status = getDayStatus(cell.day);
            return (
              <div
                key={cell.day}
                className={`flex aspect-square items-center justify-center rounded-lg text-sm transition-colors ${dayStyles[status]}`}
              >
                {cell.day}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-4 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2 rtl:flex-row-reverse">
            <div className="h-3 w-3 rounded border border-gray-200 bg-white" />
            <span className="text-xs text-gray-500">{t("availability.available")}</span>
          </div>
          <div className="flex items-center gap-2 rtl:flex-row-reverse">
            <div className="h-3 w-3 rounded border border-orange-200 bg-orange-100" />
            <span className="text-xs text-gray-500">{t("availability.booked")}</span>
          </div>
          {!isRealData && (
            <div className="flex items-center gap-2 rtl:flex-row-reverse">
              <div className="h-3 w-3 rounded border border-gray-200 bg-gray-100" />
              <span className="text-xs text-gray-500">{t("availability.blocked")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
