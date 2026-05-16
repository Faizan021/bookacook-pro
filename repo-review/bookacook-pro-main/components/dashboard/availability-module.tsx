"use client";

import { useState, useEffect, useRef } from "react";
import { useT } from "@/lib/i18n/context";
import { upsertAvailability } from "@/lib/availability/actions";

type DayStatus = "available" | "booked" | "blocked";

export type AvailabilityRecord = {
  date: string;
  is_available: boolean;
};

const DAY_KEYS = ["days.sun", "days.mon", "days.tue", "days.wed", "days.thu", "days.fri", "days.sat"];
const MONTH_KEYS = [
  "months.0", "months.1", "months.2", "months.3", "months.4", "months.5",
  "months.6", "months.7", "months.8", "months.9", "months.10", "months.11",
];

const demoBookedDays = new Set([5, 6, 12, 15, 20, 22, 26, 27]);
const demoBlockedDays = new Set([8, 9, 29, 30, 31]);

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getBookedSetFromDates(dates: string[], year: number, month: number): Set<number> {
  const result = new Set<number>();
  for (const d of dates) {
    try {
      const date = new Date(d);
      if (!isNaN(date.getTime()) && date.getFullYear() === year && date.getMonth() === month) {
        result.add(date.getDate());
      }
    } catch { /* skip */ }
  }
  return result;
}

function buildMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: { day: number | null }[] = [];
  for (let i = 0; i < firstDay; i++) cells.push({ day: null });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d });
  while (cells.length % 7 !== 0) cells.push({ day: null });
  return cells;
}

type PopupInfo = {
  day: number;
  top: number;
  left: number;
  above: boolean;
};

type AvailabilityModuleProps = {
  bookedDates?: string[];
  initialAvailability?: AvailabilityRecord[];
};

export function AvailabilityModule({ bookedDates, initialAvailability }: AvailabilityModuleProps) {
  const t = useT();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [popup, setPopup] = useState<PopupInfo | null>(null);
  const [saving, setSaving] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Map of "YYYY-MM-DD" → is_available (true = available, false = blocked)
  const [manualDates, setManualDates] = useState<Map<string, boolean>>(() => {
    const map = new Map<string, boolean>();
    for (const r of initialAvailability ?? []) {
      map.set(r.date, r.is_available);
    }
    return map;
  });

  const isRealData = bookedDates !== undefined;
  const cells = buildMonthGrid(year, month);
  const currentBookedDays = isRealData
    ? getBookedSetFromDates(bookedDates, year, month)
    : demoBookedDays;

  function getDayStatus(day: number): DayStatus {
    if (currentBookedDays.has(day)) return "booked";
    const ds = toDateStr(year, month, day);
    if (manualDates.has(ds)) return manualDates.get(ds) ? "available" : "blocked";
    if (!isRealData && demoBlockedDays.has(day)) return "blocked";
    return "available";
  }

  function handleDayClick(day: number, e: React.MouseEvent<HTMLButtonElement>) {
    if (currentBookedDays.has(day)) return;
    if (!isRealData) return; // demo mode is view-only

    const rect = e.currentTarget.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const above = spaceBelow < 110;

    setPopup({
      day,
      top: above ? rect.top - 8 : rect.bottom + 8,
      left: rect.left + rect.width / 2,
      above,
    });
  }

  async function handleMark(isAvailable: boolean) {
    if (!popup || saving) return;
    const ds = toDateStr(year, month, popup.day);
    setSaving(true);

    // Optimistic update
    setManualDates((prev) => new Map(prev).set(ds, isAvailable));
    setPopup(null);

    await upsertAvailability(ds, isAvailable);
    setSaving(false);
  }

  // Close popup on outside click or Escape
  useEffect(() => {
    if (!popup) return;
    function onDown(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setPopup(null);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPopup(null);
    }
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [popup]);

  // Close popup when month changes
  function prevMonth() {
    setPopup(null);
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }
  function nextMonth() {
    setPopup(null);
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  // Counts for the summary cards
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const booked = cells.filter((c) => c.day && currentBookedDays.has(c.day)).length;

  let blocked = 0;
  if (isRealData) {
    for (const [ds, isAvail] of manualDates) {
      if (!isAvail) {
        const d = new Date(ds + "T00:00:00");
        if (d.getFullYear() === year && d.getMonth() === month) blocked++;
      }
    }
  } else {
    blocked = cells.filter((c) => c.day && demoBlockedDays.has(c.day)).length;
  }
  const available = daysInMonth - booked - blocked;

  // Day cell styles
  function getCellClass(status: DayStatus, isClickable: boolean): string {
    const base = "relative flex aspect-square items-center justify-center rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1";
    if (status === "booked") return `${base} bg-orange-100 text-orange-800 font-semibold border border-orange-200 cursor-default`;
    if (status === "blocked") return `${base} bg-gray-100 text-gray-400 border border-gray-200 ${isClickable ? "cursor-pointer hover:bg-gray-200" : "cursor-default"}`;
    // available
    return `${base} bg-white border border-gray-200 text-gray-900 ${isClickable ? "cursor-pointer hover:bg-green-50 hover:border-green-300" : ""}`;
  }

  const selectedDay = popup?.day;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{t("availability.title")}</h2>
        <p className="text-sm text-gray-500">{t("availability.subtitle")}</p>
      </div>

      {/* Summary cards */}
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

      {/* Calendar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Header */}
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

        {/* Day names */}
        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
          {DAY_KEYS.map((key) => <div key={key}>{t(key)}</div>)}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell, i) => {
            if (!cell.day) {
              return <div key={`empty-${i}`} className="aspect-square rounded-lg" />;
            }
            const status = getDayStatus(cell.day);
            const isClickable = isRealData && status !== "booked";
            const isSelected = cell.day === selectedDay;

            return (
              <button
                key={cell.day}
                onClick={(e) => handleDayClick(cell.day!, e)}
                disabled={!isClickable}
                className={`${getCellClass(status, isClickable)} ${isSelected ? "ring-2 ring-orange-400 ring-offset-1" : ""}`}
              >
                {/* Status dot */}
                {status === "available" && isRealData && manualDates.has(toDateStr(year, month, cell.day)) && (
                  <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-green-400" />
                )}
                {status === "blocked" && (
                  <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gray-400" />
                )}
                {status === "booked" && (
                  <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-orange-400" />
                )}
                {cell.day}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2 rtl:flex-row-reverse">
            <div className="h-3 w-3 rounded border border-gray-200 bg-white" />
            <span className="text-xs text-gray-500">{t("availability.available")}</span>
          </div>
          <div className="flex items-center gap-2 rtl:flex-row-reverse">
            <div className="h-3 w-3 rounded border border-orange-200 bg-orange-100" />
            <span className="text-xs text-gray-500">{t("availability.booked")}</span>
          </div>
          <div className="flex items-center gap-2 rtl:flex-row-reverse">
            <div className="h-3 w-3 rounded border border-gray-200 bg-gray-100" />
            <span className="text-xs text-gray-500">{t("availability.blocked")}</span>
          </div>
          {isRealData && (
            <p className="ml-auto text-xs text-gray-400 rtl:mr-auto rtl:ml-0">
              {t("availability.clickToSet")}
            </p>
          )}
        </div>
      </div>

      {/* Floating popup — rendered in a portal-like fixed div */}
      {popup && (
        <div
          ref={popupRef}
          className="fixed z-50"
          style={{
            top: popup.above ? undefined : popup.top,
            bottom: popup.above ? `calc(100vh - ${popup.top}px)` : undefined,
            left: popup.left,
            transform: "translateX(-50%)",
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="w-48 rounded-xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5">
            <div className="border-b border-gray-100 px-3 py-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {toDateStr(year, month, popup.day)}
              </p>
            </div>
            <div className="p-1.5 space-y-1">
              <button
                onClick={() => handleMark(true)}
                disabled={saving}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-green-50 hover:text-green-700 disabled:opacity-50"
              >
                <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-green-400" />
                {t("availability.markAvailable")}
              </button>
              <button
                onClick={() => handleMark(false)}
                disabled={saving}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
              >
                <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-gray-400" />
                {t("availability.markBlocked")}
              </button>
            </div>
          </div>
          {/* Arrow */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 border border-gray-200 bg-white ${popup.above ? "bottom-[-5px] border-l-0 border-t-0" : "top-[-5px] border-r-0 border-b-0"}`}
          />
        </div>
      )}
    </div>
  );
}
