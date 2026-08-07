/**
 * Schnitzel Schmiede Festival Cash Register — 80mm Thermal Receipt Printing Service
 * Layer 1 (Pilot): Browser 80mm Thermal Print Template using window.print() + CSS @media print.
 * Layer 2 (Future): Transport-agnostic PrinterAdapter interface for direct hardware bridges.
 */

import type { FestivalOrder, FestivalEventConfig } from "./types";

export interface PrinterAdapter {
  printReceipt(order: FestivalOrder, config: FestivalEventConfig): Promise<boolean>;
}

export class Browser80mmPrinterAdapter implements PrinterAdapter {
  async printReceipt(_order: FestivalOrder, _config: FestivalEventConfig): Promise<boolean> {
    if (typeof window === "undefined") return false;
    window.print();
    return true;
  }
}

export const defaultPrinterAdapter: PrinterAdapter = new Browser80mmPrinterAdapter();
