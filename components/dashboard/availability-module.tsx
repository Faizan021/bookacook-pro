"use client";

import { useState } from "react";

type DayStatus = "available" | "booked" | "blocked" | "empty";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const bookedDays = new Set([5, 6, 12, 15, 20, 22, 26, 27]);
const blockedDays = new Set([8, 9, 29, 30, 31]);

function getDayStatus(day: number): DayStatus {
  if (bookedDays.has(day)) return "booked";
  if (blockedDays.has(day)) return "blocked";
  return "available";
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

export function AvailabilityModule() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const cells = buildMonthGrid(year, month);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  const booked = cells.filter((c) => c.day && bookedDays.has(c.day)).length;
  const blocked = cells.filter((c) => c.day && blockedDays.has(c.day)).length;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const available = daysInMonth - booked - blocked;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Availability</h2>
        <p className="text-sm text-gray-500">Manage your available dates and block time off</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-green-400" />
            <p className="text-sm font-medium text-gray-700">Available</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{available}</p>
          <p className="text-xs text-gray-400">days this month</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-orange-400" />
            <p className="text-sm font-medium text-gray-700">Booked</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{booked}</p>
          <p className="text-xs text-gray-400">confirmed events</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-gray-400" />
            <p className="text-sm font-medium text-gray-700">Blocked</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{blocked}</p>
          <p className="text-xs text-gray-400">days off</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">
            {MONTHS[month]} {year}
          </h3>
          <div className="flex gap-1">
            <button onClick={prevMonth} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button onClick={nextMonth} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
          {DAYS_OF_WEEK.map((d) => <div key={d}>{d}</div>)}
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
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-white border border-gray-200" />
            <span className="text-xs text-gray-500">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-orange-100 border border-orange-200" />
            <span className="text-xs text-gray-500">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-gray-100 border border-gray-200" />
            <span className="text-xs text-gray-500">Blocked</span>
          </div>
        </div>
      </div>
    </div>
  );
}
