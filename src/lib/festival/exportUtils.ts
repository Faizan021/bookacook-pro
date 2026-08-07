/**
 * Schnitzel Schmiede Festival Cash Register — Export Utilities
 * CSV Export (German Excel-ready with UTF-8 BOM & Semicolon Delimiter)
 * JSON Backup Exporter
 */

import type { FestivalOrder, FestivalShiftData } from "./types";
import { getAllDataBackupIDB } from "./idbStorage";

/**
 * Exports a shift's transactions as a German-formatted CSV file.
 * Uses UTF-8 BOM (\uFEFF) and Semicolon (;) delimiters for seamless Excel opening.
 */
export function exportShiftToCSV(shift: FestivalShiftData, orders: FestivalOrder[]): void {
  const headers = [
    "Order ID",
    "Operating Date",
    "Time",
    "Status",
    "Table",
    "Items Breakdown",
    "Total EUR",
    "Payment Method",
    "Voided At",
  ];

  const rows = orders.map((order) => {
    const formattedTime = new Date(order.timestamp).toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const itemsSummary = order.items
      .map((item) => `${item.quantity}x ${item.name} (${(item.priceCents / 100).toFixed(2)} €)`)
      .join(" | ");

    const totalEur = (order.totalCents / 100).toFixed(2).replace(".", ",");
    const statusText = order.status === "completed" ? "Abkassiert" : "Storniert";
    const voidedAtText = order.voidedAt
      ? new Date(order.voidedAt).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })
      : "";

    return [
      order.orderId,
      order.operatingDate,
      formattedTime,
      statusText,
      order.tableNumber || "Kein Tisch",
      `"${itemsSummary.replace(/"/g, '""')}"`,
      totalEur,
      "BAR",
      voidedAtText,
    ];
  });

  const csvContent =
    "\uFEFF" + // UTF-8 BOM for Excel German umlaut decoding
    [headers.join(";"), ...rows.map((row) => row.join(";"))].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const filename = `Schichtbericht_${shift.operatingDate.replace(/-/g, "")}_${shift.shiftId}.csv`;
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads a complete JSON data backup of all shifts, orders, and settings.
 * Includes backupCreatedAt timestamp and schemaVersion for disaster recovery.
 */
export async function exportFullDataBackupJSON(): Promise<void> {
  const backupData = await getAllDataBackupIDB();
  const jsonContent = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStr = new Date().toISOString().split("T")[0];
  const filename = `SchnitzelSchmiede_Backup_${dateStr}.json`;
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
