"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useT, useLocale } from "@/lib/i18n/context";
import {
  createWizardPackage,
  updateWizardPackage,
} from "@/lib/packages/actions";

// ─── Constants ────────────────────────────────────────────────────────────────

const DIETARY_OPTIONS = ["Halal", "Vegetarisch", "Vegan", "Glutenfrei"] as const;
const CURRENCIES = ["EUR", "USD", "GBP", "CHF"] as const;

const GERMAN_CITIES = [
  "Berlin", "Hamburg", "München", "Köln", "Frankfurt", "Stuttgart",
  "Düsseldorf", "Dortmund", "Essen", "Leipzig", "Bremen", "Dresden",
  "Hannover", "Nürnberg", "Duisburg", "Bochum", "Wuppertal", "Bielefeld",
  "Bonn", "Münster", "Karlsruhe", "Mannheim", "Augsburg", "Wiesbaden",
  "Mönchengladbach", "Gelsenkirchen", "Aachen", "Braunschweig", "Kiel",
  "Chemnitz", "Magdeburg", "Halle", "Freiburg", "Krefeld", "Lübeck",
  "Oberhausen", "Erfurt", "Mainz", "Rostock", "Kassel",
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

type WizardData = {
  title: string;
  short_summary: string;
  description: string;
  event_type: string;
  cuisine_type: string;
  price_type: "fixed" | "per_person";
  price_amount: string;
  currency: string;
  min_guests: string;
  max_guests: string;
  dietary_options: string[];
  service_area: string[];
  includes: string[];
  image_url: string;
  is_published: boolean;
};

const DEFAULTS: WizardData = {
  title: "",
  short_summary: "",
  description: "",
  event_type: "",
  cuisine_type: "",
  price_type: "per_person",
  price_amount: "",
  currency: "EUR",
  min_guests: "",
  max_guests: "",
  dietary_options: [],
  service_area: [],
  includes: [],
  image_url: "",
  is_published: false,
};

// ─── Small UI helpers ─────────────────────────────────────────────────────────

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 transition-colors";

// ─── Progress indicator ───────────────────────────────────────────────────────

function ProgressBar({
  step,
  labels,
  isRtl,
}: {
  step: number;
  labels: [string, string, string];
  isRtl: boolean;
}) {
  return (
    <div className={`flex items-start gap-0 ${isRtl ? "flex-row-reverse" : ""}`}>
      {[1, 2, 3].map((n) => {
        const done = n < step;
        const active = n === step;
        return (
          <div
            key={n}
            className={`flex flex-1 flex-col items-center ${isRtl ? "flex-row-reverse" : ""}`}
          >
            <div className="flex w-full items-center">
              {n > 1 && (
                <div
                  className={`h-0.5 flex-1 transition-colors ${
                    done || active ? "bg-orange-400" : "bg-gray-200"
                  }`}
                />
              )}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  done
                    ? "bg-orange-500 text-white"
                    : active
                    ? "bg-orange-500 text-white ring-2 ring-orange-200"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {done ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  n
                )}
              </div>
              {n < 3 && (
                <div
                  className={`h-0.5 flex-1 transition-colors ${
                    done ? "bg-orange-400" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
            <span
              className={`mt-1.5 text-center text-[11px] font-medium ${
                active ? "text-orange-500" : done ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {labels[n - 1]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PackageWizard() {
  const t = useT();
  const [locale] = useLocale();
  const router = useRouter();
  const isRtl = false;
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(DEFAULTS);
  const [packageId, setPackageId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof WizardData, string>>>({});
  const [globalError, setGlobalError] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);
  const [includeInput, setIncludeInput] = useState("");
  const includeRef = useRef<HTMLInputElement>(null);
  const [cityInput, setCityInput] = useState("");
  const cityInputRef = useRef<HTMLInputElement>(null);

  // ── Helpers ──────────────────────────────────────────────────────────────

  function set<K extends keyof WizardData>(key: K, value: WizardData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setGlobalError("");
  }

  function flashDraftSaved() {
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  }

  // ── Validation ───────────────────────────────────────────────────────────

  function validateStep1(): boolean {
    if (!data.title.trim()) {
      setErrors({ title: t("pkg.wizard.titleRequired") });
      return false;
    }
    if (data.short_summary.length > 150) {
      setErrors({ short_summary: t("pkg.wizard.summaryMax") });
      return false;
    }
    return true;
  }

  function validateStep2(): boolean {
    const amount = parseFloat(data.price_amount);
    if (!data.price_amount || isNaN(amount) || amount <= 0) {
      setErrors({ price_amount: t("pkg.wizard.priceRequired") });
      return false;
    }
    if (data.min_guests && data.max_guests) {
      if (parseInt(data.min_guests) > parseInt(data.max_guests)) {
        setErrors({ max_guests: t("pkg.wizard.guestsOrder") });
        return false;
      }
    }
    return true;
  }

  // ── Navigation ───────────────────────────────────────────────────────────

  async function goStep2() {
    if (!validateStep1()) return;
    setSaving(true);
    setGlobalError("");
    try {
      const step1Payload = {
        title: data.title,
        short_summary: data.short_summary || null,
        description: data.description || null,
        event_type: data.event_type || null,
        cuisine_type: data.cuisine_type || null,
      };

      if (!packageId) {
        const result = await createWizardPackage(step1Payload);
        if (result.error) { setGlobalError(result.error); return; }
        setPackageId(result.id!);
      } else {
        const result = await updateWizardPackage(packageId, step1Payload);
        if (result.error) { setGlobalError(result.error); return; }
      }
      flashDraftSaved();
      setStep(2);
    } finally {
      setSaving(false);
    }
  }

  async function goStep3() {
    if (!validateStep2()) return;
    setSaving(true);
    setGlobalError("");
    try {
      const result = await updateWizardPackage(packageId!, {
        price_type: data.price_type,
        price_amount: parseFloat(data.price_amount),
        currency: data.currency,
        min_guests: data.min_guests ? parseInt(data.min_guests) : null,
        max_guests: data.max_guests ? parseInt(data.max_guests) : null,
      });
      if (result.error) { setGlobalError(result.error); return; }
      flashDraftSaved();
      setStep(3);
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit() {
    setSaving(true);
    setGlobalError("");
    try {
      const result = await updateWizardPackage(packageId!, {
        dietary_options: data.dietary_options,
        service_area: data.service_area.length > 0 ? data.service_area : null,
        includes: data.includes,
        image_url: data.image_url || null,
        is_published: data.is_published,
      });
      if (result.error) { setGlobalError(result.error); return; }
      router.push("/caterer/packages");
    } finally {
      setSaving(false);
    }
  }

  // ── Includes tag input ───────────────────────────────────────────────────

  function addInclude() {
    const v = includeInput.trim();
    if (v && !data.includes.includes(v)) {
      set("includes", [...data.includes, v]);
    }
    setIncludeInput("");
    includeRef.current?.focus();
  }

  function removeInclude(item: string) {
    set("includes", data.includes.filter((i) => i !== item));
  }

  function toggleDietary(option: string) {
    set(
      "dietary_options",
      data.dietary_options.includes(option)
        ? data.dietary_options.filter((o) => o !== option)
        : [...data.dietary_options, option]
    );
  }

  function addCity(city: string) {
    const v = city.trim();
    if (v && !data.service_area.includes(v)) {
      set("service_area", [...data.service_area, v]);
    }
  }

  function addCityFromDropdown(e: React.ChangeEvent<HTMLSelectElement>) {
    const city = e.target.value;
    if (city) addCity(city);
    e.target.value = "";
  }

  function addCustomCity() {
    addCity(cityInput);
    setCityInput("");
    cityInputRef.current?.focus();
  }

  function removeCity(city: string) {
    set("service_area", data.service_area.filter((c) => c !== city));
  }

  // ── Shared layout ────────────────────────────────────────────────────────

  const dir = isRtl ? "rtl" : "ltr";
  const stepLabels: [string, string, string] = [
    t("pkg.wizard.step1"),
    t("pkg.wizard.step2"),
    t("pkg.wizard.step3"),
  ];

  return (
    <div dir={dir} className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("pkg.wizard.pageTitle")}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {t("pkg.wizard.stepOf").replace("{step}", String(step))}
        </p>
      </div>

      {/* Progress */}
      <ProgressBar step={step} labels={stepLabels} isRtl={isRtl} />

      {/* Draft saved toast */}
      {draftSaved && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2.5 text-sm text-green-700">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {t("pkg.wizard.draftSaved")}
        </div>
      )}

      {/* Global error */}
      {globalError && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {t(globalError, globalError)}
        </div>
      )}

      {/* ── Step 1: Basic Info ─────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">{t("pkg.wizard.step1")}</h2>

          <Field label={t("pkg.wizard.titleLabel")} error={errors.title}>
            <input
              type="text"
              value={data.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder={t("pkg.wizard.titlePlaceholder")}
              className={inputCls}
              autoFocus
            />
          </Field>

          <Field
            label={t("pkg.wizard.summaryLabel")}
            error={errors.short_summary}
            hint={`${data.short_summary.length}/150`}
          >
            <textarea
              rows={2}
              value={data.short_summary}
              onChange={(e) => set("short_summary", e.target.value)}
              placeholder={t("pkg.wizard.summaryPlaceholder")}
              className={inputCls}
              maxLength={160}
            />
          </Field>

          <Field label={t("pkg.wizard.descLabel")}>
            <textarea
              rows={4}
              value={data.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder={t("pkg.wizard.descPlaceholder")}
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label={t("pkg.wizard.eventTypeLabel")}>
              <input
                type="text"
                value={data.event_type}
                onChange={(e) => set("event_type", e.target.value)}
                placeholder={t("pkg.wizard.eventTypePlaceholder")}
                className={inputCls}
              />
            </Field>
            <Field label={t("pkg.wizard.cuisineLabel")}>
              <input
                type="text"
                value={data.cuisine_type}
                onChange={(e) => set("cuisine_type", e.target.value)}
                placeholder={t("pkg.wizard.cuisinePlaceholder")}
                className={inputCls}
              />
            </Field>
          </div>
        </div>
      )}

      {/* ── Step 2: Pricing & Guests ───────────────────────────────────────── */}
      {step === 2 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">{t("pkg.wizard.step2")}</h2>

          <Field label={t("pkg.wizard.priceTypeLabel")}>
            <div className="flex gap-4 pt-1">
              {(["fixed", "per_person"] as const).map((pt) => (
                <label
                  key={pt}
                  className={`flex flex-1 cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 transition-colors ${
                    data.price_type === pt
                      ? "border-orange-400 bg-orange-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="price_type"
                    value={pt}
                    checked={data.price_type === pt}
                    onChange={() => set("price_type", pt)}
                    className="accent-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {pt === "fixed" ? t("pkg.wizard.priceFixed") : t("pkg.wizard.pricePerPerson")}
                  </span>
                </label>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Field label={t("pkg.wizard.priceAmountLabel")} error={errors.price_amount}>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">
                    {data.currency === "EUR" ? "€" : data.currency === "USD" ? "$" : data.currency === "GBP" ? "£" : "Fr."}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={data.price_amount}
                    onChange={(e) => set("price_amount", e.target.value)}
                    placeholder="0.00"
                    className={`${inputCls} pl-8`}
                  />
                </div>
              </Field>
            </div>
            <Field label={t("pkg.wizard.currencyLabel")}>
              <select
                value={data.currency}
                onChange={(e) => set("currency", e.target.value)}
                className={inputCls}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label={t("pkg.wizard.minGuestsLabel")}>
              <input
                type="number"
                min="1"
                value={data.min_guests}
                onChange={(e) => set("min_guests", e.target.value)}
                placeholder="—"
                className={inputCls}
              />
            </Field>
            <Field label={t("pkg.wizard.maxGuestsLabel")} error={errors.max_guests}>
              <input
                type="number"
                min="1"
                value={data.max_guests}
                onChange={(e) => set("max_guests", e.target.value)}
                placeholder="—"
                className={inputCls}
              />
            </Field>
          </div>
        </div>
      )}

      {/* ── Step 3: Details & Publish ──────────────────────────────────────── */}
      {step === 3 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">{t("pkg.wizard.step3")}</h2>

          {/* Dietary checkboxes */}
          <Field label={t("pkg.wizard.dietaryLabel")}>
            <div className="flex flex-wrap gap-3 pt-1">
              {DIETARY_OPTIONS.map((opt) => {
                const checked = data.dietary_options.includes(opt);
                return (
                  <label
                    key={opt}
                    className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-colors ${
                      checked
                        ? "border-orange-400 bg-orange-50 font-medium text-orange-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleDietary(opt)}
                      className="hidden"
                    />
                    {checked && (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {opt}
                  </label>
                );
              })}
            </div>
          </Field>

          <Field label={t("pkg.wizard.serviceAreaLabel")}>
            <div className="space-y-2">
              {/* Dropdown */}
              <select
                onChange={addCityFromDropdown}
                defaultValue=""
                className={inputCls}
              >
                <option value="" disabled>{t("pkg.wizard.cityDropdownPlaceholder")}</option>
                {GERMAN_CITIES.map((city) => (
                  <option
                    key={city}
                    value={city}
                    disabled={data.service_area.includes(city)}
                  >
                    {city}
                  </option>
                ))}
              </select>
              {/* Custom city input */}
              <div className="flex gap-2">
                <input
                  ref={cityInputRef}
                  type="text"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); addCustomCity(); }
                  }}
                  placeholder={t("pkg.wizard.cityCustomPlaceholder")}
                  className={`${inputCls} flex-1`}
                />
                <button
                  type="button"
                  onClick={addCustomCity}
                  disabled={!cityInput.trim()}
                  className="rounded-xl bg-gray-100 px-4 text-sm font-medium text-gray-600 hover:bg-gray-200 disabled:opacity-40 transition-colors"
                >
                  {t("pkg.wizard.cityAdd")}
                </button>
              </div>
              {/* Selected city chips */}
              {data.service_area.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {data.service_area.map((city) => (
                    <span
                      key={city}
                      className="flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-sm font-medium text-orange-700"
                    >
                      {city}
                      <button
                        type="button"
                        onClick={() => removeCity(city)}
                        className="text-orange-400 hover:text-red-500 transition-colors leading-none"
                        aria-label={`Remove ${city}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Field>

          {/* Includes tag input */}
          <Field label={t("pkg.wizard.includesLabel")}>
            <div className="space-y-2">
              {data.includes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.includes.map((item) => (
                    <span
                      key={item}
                      className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeInclude(item)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  ref={includeRef}
                  type="text"
                  value={includeInput}
                  onChange={(e) => setIncludeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); addInclude(); }
                  }}
                  placeholder={t("pkg.wizard.includesPlaceholder")}
                  className={`${inputCls} flex-1`}
                />
                <button
                  type="button"
                  onClick={addInclude}
                  disabled={!includeInput.trim()}
                  className="rounded-xl bg-gray-100 px-4 text-sm font-medium text-gray-600 hover:bg-gray-200 disabled:opacity-40 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </Field>

          <Field label={t("pkg.wizard.imageUrlLabel")}>
            <input
              type="url"
              value={data.image_url}
              onChange={(e) => set("image_url", e.target.value)}
              placeholder="https://…"
              className={inputCls}
            />
          </Field>

          {/* Publish toggle */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
            <label className="flex cursor-pointer items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-800">{t("pkg.wizard.publishLabel")}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t("pkg.wizard.publishDesc")}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={data.is_published}
                onClick={() => set("is_published", !data.is_published)}
                className={`relative h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 ${
                  data.is_published ? "bg-orange-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    data.is_published ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </label>
          </div>
        </div>
      )}

      {/* ── Navigation buttons ─────────────────────────────────────────────── */}
      <div className={`flex items-center ${step > 1 ? "justify-between" : "justify-end"}`}>
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            disabled={saving}
            className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {t("pkg.wizard.back")}
          </button>
        )}

        {step < 3 && (
          <button
            type="button"
            onClick={step === 1 ? goStep2 : goStep3}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60 transition-colors"
          >
            {saving ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t("pkg.wizard.saving")}
              </>
            ) : (
              t("pkg.wizard.next")
            )}
          </button>
        )}

        {step === 3 && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60 transition-colors"
          >
            {saving ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t("pkg.wizard.saving")}
              </>
            ) : data.is_published ? (
              t("pkg.wizard.submitPublish")
            ) : (
              t("pkg.wizard.submitDraft")
            )}
          </button>
        )}
      </div>
    </div>
  );
}
