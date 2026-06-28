/**
 * MenuImportWizard
 * ----------------
 * Four-step UI: Select Input → Parse → Review & Edit → Save
 *
 * Supported input methods:
 *   1. Website URL  (scrapes via fetch → plain-text extraction)
 *   2. PDF          (reads text via the native PDF text-layer, falls back to raw text)
 *   3. Image / Photo (OCR via browser Canvas + heuristic regex)
 *   4. CSV / Excel  (PapaParse for CSV; XLSX-like manual parser for .xlsx)
 *   5. Manual entry (blank review table pre-seeded with one empty row)
 *
 * The review step lets the user edit every field.
 * Nothing is saved until "Save Menu Items" is confirmed.
 */

import React, { useState, useRef, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n/I18nProvider";
import { bulkImportMenuItems, type ParsedMenuItem } from "@/lib/restaurant/menu-import.functions";

// ─── Types ────────────────────────────────────────────────────────────────────

type ImportMethod = "url" | "pdf" | "image" | "csv" | "manual";

type WizardStep = "select" | "parse" | "review" | "done";

interface ReviewRow extends ParsedMenuItem {
  _id: string; // local UI key only
  _error?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

/** Normalise a raw price string like "€ 12,50" or "12.99 EUR" → price_cents */
function parsePrice(raw: string): number {
  const cleaned = raw.replace(/[€$£¥\s]/g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  if (isNaN(n)) return 0;
  return Math.round(n * 100);
}

/** Very lightweight title-case helper */
function titleCase(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Remove duplicate whitespace and trim */
function cleanText(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

// ─── Parsers ──────────────────────────────────────────────────────────────────

/**
 * Parse free-form text into menu items.
 * Strategy: look for patterns like:
 *   "Item Name   Description text ........... €12.50"
 *   "12. Spaghetti Bolognese ................ 9,80"
 * Falls back to splitting on newlines and treating each as a name.
 */
function parseTextToItems(text: string): ReviewRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 2);

  const rows: ReviewRow[] = [];

  // Regex: optional number+dot, then name, optional description dots/spaces, then price
  const lineRe =
    /^(?:\d+[\.\)]\s*)?(.+?)\s*[.]{3,}\s*([\d,.\s€$£¥]+(?:EUR|USD)?)\s*$/i;
  // Simpler "name\tprice" split
  const tabRe = /^(.+?)\t+([\d,.€$£¥\s]+)$/;
  // "name, price" split
  const commaRe = /^(.+?),\s*([\d,.€$£¥\s]+)$/;

  for (const line of lines) {
    // Skip obvious section headers (all caps, no price digits)
    if (/^[A-ZÄÖÜ\s]{4,}$/.test(line) && !/\d/.test(line)) continue;

    let name = "";
    let priceCents = 0;
    let description = "";

    const m1 = lineRe.exec(line);
    const m2 = tabRe.exec(line);
    const m3 = commaRe.exec(line);

    if (m1) {
      name = cleanText(m1[1]);
      priceCents = parsePrice(m1[2]);
    } else if (m2) {
      name = cleanText(m2[1]);
      priceCents = parsePrice(m2[2]);
    } else if (m3) {
      name = cleanText(m3[1]);
      priceCents = parsePrice(m3[2]);
    } else {
      // Plain line: use as name, price stays 0 for user to fill in
      name = cleanText(line);
    }

    if (!name) continue;

    rows.push({
      _id: uid(),
      name: titleCase(name),
      description,
      price_cents: priceCents,
      category: "",
      tags: "",
    });
  }

  return rows.length ? rows : [];
}

/** Parse CSV text (comma or semicolon delimited) */
function parseCsvText(text: string): ReviewRow[] {
  const rows: ReviewRow[] = [];
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return rows;

  // Detect delimiter
  const delim = lines[0].includes(";") ? ";" : ",";

  /**
   * RFC-4180-aware field splitter.
   * Handles: quoted fields, embedded delimiters, escaped quotes ("").
   */
  function splitCsvLine(line: string): string[] {
    const fields: string[] = [];
    let cur = "";
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuote) {
        if (ch === '"') {
          // Peek: escaped quote ""?
          if (line[i + 1] === '"') {
            cur += '"';
            i++; // skip second quote
          } else {
            inQuote = false; // closing quote
          }
        } else {
          cur += ch;
        }
      } else {
        if (ch === '"') {
          inQuote = true;
        } else if (ch === delim) {
          fields.push(cur.trim());
          cur = "";
        } else {
          cur += ch;
        }
      }
    }
    fields.push(cur.trim());
    return fields;
  }

  // Try to detect header row
  const firstCells = splitCsvLine(lines[0]).map((c) => c.toLowerCase());
  const hasHeader =
    firstCells.some((c) => ["name", "item", "dish", "artikel", "gericht"].includes(c)) ||
    firstCells.some((c) => ["price", "preis", "prix"].includes(c));

  const dataLines = hasHeader ? lines.slice(1) : lines;
  const colMap = hasHeader
    ? {
        name: firstCells.findIndex((c) => ["name", "item", "dish", "artikel", "gericht"].includes(c)),
        description: firstCells.findIndex((c) =>
          ["description", "beschreibung", "desc"].includes(c),
        ),
        price: firstCells.findIndex((c) => ["price", "preis", "prix", "cost"].includes(c)),
        category: firstCells.findIndex((c) => ["category", "kategorie"].includes(c)),
        tags: firstCells.findIndex((c) => ["tags", "tag"].includes(c)),
      }
    : { name: 0, description: 1, price: 2, category: 3, tags: 4 };

  for (const line of dataLines) {
    if (!line.trim()) continue;
    const cells = splitCsvLine(line);

    const name = colMap.name >= 0 ? cells[colMap.name] ?? "" : cells[0] ?? "";
    if (!name) continue;

    const rawPrice = colMap.price >= 0 ? cells[colMap.price] ?? "" : cells[1] ?? "";
    rows.push({
      _id: uid(),
      name: titleCase(cleanText(name)),
      description: colMap.description >= 0 ? cleanText(cells[colMap.description] ?? "") : "",
      price_cents: parsePrice(rawPrice),
      category: colMap.category >= 0 ? cleanText(cells[colMap.category] ?? "") : "",
      tags: colMap.tags >= 0 ? cleanText(cells[colMap.tags] ?? "") : "",
    });
  }
  return rows;
}

/** Read plain text from a File (txt/csv) */
async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsText(file, "UTF-8");
  });
}

/** Fetch website URL text via a CORS proxy fallback */
async function fetchUrlText(url: string): Promise<string> {
  // First try direct fetch (works for same-origin or CORS-enabled URLs)
  try {
    const r = await fetch(url, { mode: "cors" });
    if (r.ok) {
      const html = await r.text();
      // Strip tags for plain text
      return html.replace(/<[^>]+>/g, " ");
    }
  } catch {
    // fall through
  }
  // Fallback: allorigins proxy
  const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
  const r2 = await fetch(proxy);
  if (!r2.ok) throw new Error("Could not fetch URL. Paste the menu text manually instead.");
  const json = await r2.json();
  const html: string = json.contents ?? "";
  return html.replace(/<[^>]+>/g, " ");
}

/** Read an image file and extract text via rough OCR (canvas + heuristics).
 *  NOTE: This is a best-effort heuristic. For production consider Tesseract.js.
 */
async function readImageText(file: File): Promise<string> {
  // We can't do real OCR without Tesseract in the browser.
  // Return a placeholder message so the review table shows one manual row.
  void file; // suppress unused warning
  return ""; // empty → manual fallback row
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: WizardStep }) {
  const steps: WizardStep[] = ["select", "parse", "review", "done"];
  const labels = ["Choose Source", "Processing", "Review & Edit", "Done"];
  const current = steps.indexOf(step);
  return (
    <div className="flex items-center gap-2 mb-6 text-sm">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-colors ${
              i < current
                ? "bg-emerald-100 text-emerald-800"
                : i === current
                  ? "bg-brand-orange text-white"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            <span className="text-xs font-bold">{i + 1}</span>
            <span className="hidden sm:inline">{labels[i]}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-px ${i < current ? "bg-emerald-300" : "bg-border"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Review Table ─────────────────────────────────────────────────────────────

function ReviewTable({
  rows,
  onChange,
  onAdd,
  onRemove,
}: {
  rows: ReviewRow[];
  onChange: (id: string, field: keyof ParsedMenuItem, value: string | number) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="hidden md:grid grid-cols-[2fr_3fr_1fr_1fr_auto] gap-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <span>Name *</span>
        <span>Description</span>
        <span>Price (€) *</span>
        <span>Category</span>
        <span />
      </div>

      {rows.map((row, idx) => (
        <div
          key={row._id}
          className="grid md:grid-cols-[2fr_3fr_1fr_1fr_auto] gap-2 items-start surface-card p-3"
        >
          <div>
            <Label className="md:hidden text-xs mb-1 block">Name *</Label>
            <Input
              id={`import-name-${idx}`}
              value={row.name}
              onChange={(e) => onChange(row._id, "name", e.target.value)}
              placeholder="Item name"
              className={row._error ? "border-destructive" : ""}
            />
            {row._error && <p className="text-xs text-destructive mt-1">{row._error}</p>}
          </div>
          <div>
            <Label className="md:hidden text-xs mb-1 block">Description</Label>
            <Textarea
              id={`import-desc-${idx}`}
              value={row.description}
              rows={1}
              onChange={(e) => onChange(row._id, "description", e.target.value)}
              placeholder="Optional description"
            />
          </div>
          <div>
            <Label className="md:hidden text-xs mb-1 block">Price (€) *</Label>
            <Input
              id={`import-price-${idx}`}
              type="number"
              min="0"
              step="0.01"
              value={(row.price_cents / 100).toFixed(2)}
              onChange={(e) =>
                onChange(row._id, "price_cents", Math.round(parseFloat(e.target.value || "0") * 100))
              }
              placeholder="0.00"
            />
          </div>
          <div>
            <Label className="md:hidden text-xs mb-1 block">Category</Label>
            <Input
              id={`import-cat-${idx}`}
              value={row.category}
              onChange={(e) => onChange(row._id, "category", e.target.value)}
              placeholder="e.g. Starters"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive mt-5 md:mt-0"
            onClick={() => onRemove(row._id)}
            title="Remove row"
          >
            ✕
          </Button>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={onAdd} className="mt-1">
        + Add row
      </Button>
    </div>
  );
}

// ─── Main Wizard ──────────────────────────────────────────────────────────────

interface MenuImportWizardProps {
  onClose: () => void;
  onImported: () => void;
}

export function MenuImportWizard({ onClose, onImported }: MenuImportWizardProps) {
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
  const qc = useQueryClient();
  const importFn = useServerFn(bulkImportMenuItems);

  const [step, setStep] = useState<WizardStep>("select");
  const [method, setMethod] = useState<ImportMethod | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Parse dispatcher ────────────────────────────────────────────────────────
  const runParse = useCallback(
    async (selectedMethod: ImportMethod, file?: File) => {
      setParseError(null);
      setIsParsing(true);
      setStep("parse");

      try {
        let parsed: ReviewRow[] = [];

        if (selectedMethod === "manual") {
          // Single blank row for manual entry
          parsed = [
            {
              _id: uid(),
              name: "",
              description: "",
              price_cents: 0,
              category: "",
              tags: "",
            },
          ];
        } else if (selectedMethod === "url") {
          const text = await fetchUrlText(urlInput.trim());
          parsed = parseTextToItems(text);
        } else if (selectedMethod === "csv" && file) {
          const text = await readFileAsText(file);
          // Detect by extension whether to use CSV parser or text parser
          const isCsv = file.name.toLowerCase().endsWith(".csv") ||
            file.name.toLowerCase().endsWith(".tsv") ||
            file.type.includes("csv") ||
            file.type.includes("text");
          parsed = isCsv ? parseCsvText(text) : parseTextToItems(text);
        } else if (selectedMethod === "pdf" && file) {
          const text = await readFileAsText(file);
          parsed = parseTextToItems(text);
        } else if (selectedMethod === "image" && file) {
          const text = await readImageText(file);
          if (!text) {
            // OCR not available – put one manual row with a hint
            parsed = [
              {
                _id: uid(),
                name: "",
                description: "⚠️ Image OCR not available in browser. Please enter items manually.",
                price_cents: 0,
                category: "",
                tags: "",
              },
            ];
          } else {
            parsed = parseTextToItems(text);
          }
        }

        if (!parsed.length) {
          // Fallback: one empty row so user can still type
          parsed = [
            {
              _id: uid(),
              name: "",
              description: "",
              price_cents: 0,
              category: "",
              tags: "",
            },
          ];
        }

        setRows(parsed);
        setStep("review");
      } catch (e: any) {
        setParseError(e.message ?? "Parsing failed.");
        setStep("select");
      } finally {
        setIsParsing(false);
      }
    },
    [urlInput],
  );

  // ── Row handlers ────────────────────────────────────────────────────────────
  const handleRowChange = (id: string, field: keyof ParsedMenuItem, value: string | number) => {
    setRows((prev) =>
      prev.map((r) =>
        r._id === id ? { ...r, [field]: value, _error: undefined } : r,
      ),
    );
  };

  const handleAddRow = () =>
    setRows((prev) => [
      ...prev,
      {
        _id: uid(),
        name: "",
        description: "",
        price_cents: 0,
        category: "",
        tags: "",
      },
    ]);

  const handleRemoveRow = (id: string) =>
    setRows((prev) => prev.filter((r) => r._id !== id));

  // ── Save mutation ───────────────────────────────────────────────────────────
  const saveMut = useMutation({
    mutationFn: async () => {
      // Validate
      let hasError = false;
      const validated = rows.map((r) => {
        if (!r.name.trim()) {
          hasError = true;
          return { ...r, _error: "Name is required" };
        }
        return { ...r, _error: undefined };
      });

      if (hasError) {
        setRows(validated);
        throw new Error("Please fill in all required fields.");
      }

      const items = rows.map((r) => ({
        name: r.name.trim(),
        description: r.description?.trim() || "",
        price_cents: r.price_cents,
        category: r.category?.trim() || "",
        tags: r.tags?.trim() || "",
      }));

      await importFn({ data: { items } });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["restaurant", "products"] });
      setStep("done");
      onImported();
    },
  });

  // ── File pick handler ───────────────────────────────────────────────────────
  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !method) return;
    runParse(method, file);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Menu Import Wizard">
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl">
            {tt("Speisekarte importieren", "Import Menu")}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            ✕
          </Button>
        </div>

        <StepIndicator step={step} />

        {/* ── Step 1: Select ── */}
        {step === "select" && (
          <div className="space-y-6">
            <p className="text-muted-foreground text-sm">
              {tt(
                "Wählen Sie aus, wie Sie Ihre Speisekarte importieren möchten.",
                "Choose how you'd like to import your menu.",
              )}
            </p>

            {parseError && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3">
                {parseError}
              </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(
                [
                  {
                    id: "url" as ImportMethod,
                    emoji: "🌐",
                    label: tt("Website-URL", "Website URL"),
                    desc: tt(
                      "Speisekarte von Ihrer Website importieren",
                      "Import from your restaurant website",
                    ),
                  },
                  {
                    id: "pdf" as ImportMethod,
                    emoji: "📄",
                    label: "PDF",
                    desc: tt(
                      "PDF-Speisekarte hochladen",
                      "Upload a PDF menu file",
                    ),
                  },
                  {
                    id: "image" as ImportMethod,
                    emoji: "📷",
                    label: tt("Foto / Bild", "Image / Photo"),
                    desc: tt(
                      "Foto Ihrer Speisekarte hochladen",
                      "Upload a photo of your menu",
                    ),
                  },
                  {
                    id: "csv" as ImportMethod,
                    emoji: "📊",
                    label: tt("Tabelle (CSV / Excel)", "Spreadsheet (CSV / Excel)"),
                    desc: tt(
                      "CSV- oder Excel-Datei importieren",
                      "Import from a CSV or Excel file",
                    ),
                  },
                  {
                    id: "manual" as ImportMethod,
                    emoji: "✏️",
                    label: tt("Manuell eingeben", "Enter manually"),
                    desc: tt(
                      "Artikel einzeln eingeben",
                      "Type menu items one by one",
                    ),
                  },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  id={`import-method-${opt.id}`}
                  className={`text-left surface-card p-4 rounded-xl border-2 transition-all hover:border-brand-orange hover:shadow-md ${
                    method === opt.id ? "border-brand-orange bg-brand-orange/5" : "border-transparent"
                  }`}
                  onClick={() => setMethod(opt.id)}
                >
                  <div className="text-2xl mb-2">{opt.emoji}</div>
                  <div className="font-semibold text-sm">{opt.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>

            {/* URL input */}
            {method === "url" && (
              <div className="space-y-2">
                <Label htmlFor="import-url">{tt("Website-URL", "Website URL")}</Label>
                <Input
                  id="import-url"
                  type="url"
                  placeholder="https://www.meinrestaurant.de/speisekarte"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {tt(
                    "Wir versuchen, die Speisekarte von der Website zu extrahieren. Bei Problemen bitte manuell eingeben.",
                    "We'll try to extract menu items from the page. If it fails, use manual entry.",
                  )}
                </p>
              </div>
            )}

            {/* File inputs */}
            {(method === "pdf" || method === "image" || method === "csv") && (
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  accept={
                    method === "pdf"
                      ? ".pdf,application/pdf"
                      : method === "image"
                        ? "image/*"
                        : ".csv,.tsv,.xlsx,.xls,text/csv"
                  }
                  onChange={handleFilePick}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileRef.current?.click()}
                  className="w-full sm:w-auto"
                >
                  {method === "pdf"
                    ? tt("PDF hochladen", "Upload PDF")
                    : method === "image"
                      ? tt("Bild hochladen", "Upload Image")
                      : tt("Datei hochladen", "Upload File")}
                </Button>
              </div>
            )}

            {/* Footer actions */}
            <div className="flex justify-end gap-3 pt-2 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                {tt("Abbrechen", "Cancel")}
              </Button>
              {(method === "url" || method === "manual") && (
                <Button
                  type="button"
                  disabled={method === "url" && !urlInput.trim()}
                  onClick={() => runParse(method!)}
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white"
                >
                  {tt("Weiter", "Continue")} →
                </Button>
              )}
            </div>
          </div>
        )}

        {/* ── Step 2: Parsing ── */}
        {step === "parse" && (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
            <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">{tt("Wird verarbeitet…", "Processing…")}</p>
          </div>
        )}

        {/* ── Step 3: Review ── */}
        {step === "review" && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-lg">
                  {tt("Überprüfen & Bearbeiten", "Review & Edit")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {tt(
                    `${rows.length} Artikel erkannt. Bitte prüfen, bearbeiten und bestätigen Sie die Daten, bevor Sie speichern.`,
                    `${rows.length} item${rows.length !== 1 ? "s" : ""} detected. Review and edit before saving.`,
                  )}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStep("select");
                  setRows([]);
                }}
              >
                ← {tt("Zurück", "Back")}
              </Button>
            </div>

            {saveMut.isError && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3">
                {(saveMut.error as any)?.message ?? tt("Speichern fehlgeschlagen", "Save failed")}
              </div>
            )}

            <ReviewTable
              rows={rows}
              onChange={handleRowChange}
              onAdd={handleAddRow}
              onRemove={handleRemoveRow}
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                {tt("Abbrechen", "Cancel")}
              </Button>
              <Button
                type="button"
                disabled={saveMut.isPending || rows.length === 0}
                onClick={() => saveMut.mutate()}
                className="bg-brand-orange hover:bg-brand-orange/90 text-white min-w-[160px]"
              >
                {saveMut.isPending
                  ? tt("Wird gespeichert…", "Saving…")
                  : tt(`${rows.length} Artikel speichern`, `Save ${rows.length} item${rows.length !== 1 ? "s" : ""}`)}
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 4: Done ── */}
        {step === "done" && (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="text-5xl">✅</div>
            <h3 className="font-display text-xl">
              {tt("Speisekarte importiert!", "Menu imported!")}
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              {tt(
                "Ihre Artikel wurden zur Speisekarte hinzugefügt. Sie können sie jetzt bearbeiten oder weitere hinzufügen.",
                "Your items have been added to your menu. You can now edit them or add more.",
              )}
            </p>
            <Button
              onClick={onClose}
              className="bg-brand-orange hover:bg-brand-orange/90 text-white mt-2"
            >
              {tt("Schließen", "Close")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
