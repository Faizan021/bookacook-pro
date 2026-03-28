"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useT } from "@/lib/i18n/context";
import { createPackage, updatePackage } from "@/lib/packages/actions";
import {
  PACKAGE_CATEGORIES,
  EVENT_TYPES,
  DIETARY_OPTIONS,
  DEFAULT_PACKAGE_FORM,
  type PackageFormData,
  type PackageAddOn,
  type PackageImage,
} from "@/lib/packages/types";

// ─── Props ────────────────────────────────────────────────────────────────────

type PackageFormProps = {
  mode: "create" | "edit";
  packageId?: string;
  initialData?: Partial<PackageFormData>;
};

// ─── Inline UI helpers ────────────────────────────────────────────────────────

function Section({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {badge && (
          <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-600">{badge}</span>
        )}
      </div>
      {children}
    </div>
  );
}

function CollapsibleSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-6 py-5 text-base font-semibold text-gray-900 rtl:flex-row-reverse"
      >
        {title}
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="border-t border-gray-100 p-6">{children}</div>}
    </div>
  );
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="ml-1 text-orange-500">*</span>}
    </label>
  );
}

function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-600">{msg}</p>;
}

function TipPanel({ tipTitle, tips }: { tipTitle: string; tips: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-1.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs font-medium text-orange-600 hover:text-orange-700"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        {tipTitle}
        <svg className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul className="mt-2 space-y-1 rounded-xl bg-orange-50 p-3">
          {tips.map((tip, i) => (
            <li key={i} className="text-xs text-orange-700">
              • {tip}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TagInput({
  tags,
  onChange,
  placeholder,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");
  function add() {
    const v = input.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput("");
  }
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
            {tag}
            <button type="button" onClick={() => onChange(tags.filter((t) => t !== tag))} className="ml-0.5 text-gray-400 hover:text-gray-600">
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
        />
        <button type="button" onClick={add} className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200">
          +
        </button>
      </div>
    </div>
  );
}

function AddOnList({
  addOns,
  onChange,
  labelName,
  labelPrice,
  labelAdd,
}: {
  addOns: PackageAddOn[];
  onChange: (addOns: PackageAddOn[]) => void;
  labelName: string;
  labelPrice: string;
  labelAdd: string;
}) {
  function update(idx: number, field: keyof PackageAddOn, value: string | number) {
    const next = [...addOns];
    next[idx] = { ...next[idx], [field]: value };
    onChange(next);
  }
  return (
    <div className="space-y-2">
      {addOns.map((ao, i) => (
        <div key={i} className="flex items-center gap-2 rtl:flex-row-reverse">
          <input
            type="text"
            value={ao.name}
            onChange={(e) => update(i, "name", e.target.value)}
            placeholder={labelName}
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
          <input
            type="number"
            value={ao.price}
            onChange={(e) => update(i, "price", parseFloat(e.target.value) || 0)}
            placeholder={labelPrice}
            className="w-28 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
            min={0}
          />
          <button
            type="button"
            onClick={() => onChange(addOns.filter((_, j) => j !== i))}
            className="flex-shrink-0 rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...addOns, { name: "", price: 0 }])}
        className="mt-1 flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {labelAdd}
      </button>
    </div>
  );
}

function ImageList({
  images,
  onChange,
  labelUrl,
  labelAdd,
}: {
  images: PackageImage[];
  onChange: (images: PackageImage[]) => void;
  labelUrl: string;
  labelAdd: string;
}) {
  function updateUrl(idx: number, url: string) {
    const next = [...images];
    next[idx] = { ...next[idx], url };
    onChange(next);
  }
  return (
    <div className="space-y-3">
      {images.map((img, i) => (
        <div key={i} className="flex items-center gap-3 rtl:flex-row-reverse">
          {img.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img.url} alt="" className="h-12 w-20 rounded-lg object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          )}
          <input
            type="url"
            value={img.url}
            onChange={(e) => updateUrl(i, e.target.value)}
            placeholder={labelUrl}
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
          <button
            type="button"
            onClick={() => onChange(images.filter((_, j) => j !== i))}
            className="flex-shrink-0 rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...images, { url: "", alt: "", order: images.length }])}
        className="flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {labelAdd}
      </button>
    </div>
  );
}

// ─── Normalise initialData so no null leaks overwrite array/string defaults ───

function normalizeFormData(data?: Partial<PackageFormData>): Partial<PackageFormData> {
  if (!data) return {};
  return {
    ...data,
    title:              data.title              ?? "",
    summary:            data.summary            ?? "",
    description:        data.description        ?? "",
    category:           data.category           ?? "",
    cuisine_type:       data.cuisine_type       ?? "",
    cover_image_url:    data.cover_image_url    ?? "",
    service_area:       data.service_area       ?? "",
    event_types:        data.event_types        ?? [],
    dietary_options:    data.dietary_options    ?? [],
    included_items:     data.included_items     ?? [],
    add_ons:            data.add_ons            ?? [],
    images:             data.images             ?? [],
    tags:               data.tags               ?? [],
  };
}

// ─── Main form ────────────────────────────────────────────────────────────────

export function PackageForm({ mode, packageId, initialData }: PackageFormProps) {
  const t = useT();
  const router = useRouter();

  const [form, setForm] = useState<PackageFormData>({ ...DEFAULT_PACKAGE_FORM, ...normalizeFormData(initialData) });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof PackageFormData | "global", string>>>({});
  const [savedMsg, setSavedMsg] = useState("");

  // AI assist state
  const [aiTarget, setAiTarget] = useState<null | "title" | "description" | "tags">(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [aiIsDemo, setAiIsDemo] = useState(false);

  // Collapsible sections
  const [showLogistics, setShowLogistics] = useState(!!(initialData?.service_area));
  const [showMedia, setShowMedia] = useState(!!(initialData?.images?.length));
  const [showDiscovery, setShowDiscovery] = useState(!!(initialData?.tags?.length));

  function set<K extends keyof PackageFormData>(key: K, value: PackageFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }

  function validate(forPublish: boolean): boolean {
    const errs: typeof errors = {};
    if (!(form.title ?? "").trim()) errs.title = t("pkg.validation.titleRequired");
    if (!form.price_amount || form.price_amount <= 0) errs.price_amount = t("pkg.validation.priceRequired");
    if (!form.min_guests || !form.max_guests) errs.min_guests = t("pkg.validation.guestsRequired");
    if ((form.min_guests ?? 0) > (form.max_guests ?? 0)) errs.max_guests = t("pkg.validation.guestsOrder");
    if (forPublish && !(form.summary ?? "").trim()) errs.summary = t("pkg.validation.summaryRequired");
    if (forPublish && !(form.description ?? "").trim()) errs.description = t("pkg.validation.descRequired");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave(targetStatus?: "draft" | "active") {
    const forPublish = targetStatus === "active";
    if (!validate(forPublish)) return;

    setSaving(true);
    setErrors({});

    const data: PackageFormData = { ...form, status: targetStatus ?? form.status };

    try {
      const result =
        mode === "create"
          ? await createPackage(data)
          : await updatePackage(packageId!, data);

      if (result.error) {
        setErrors({ global: result.error });
      } else {
        const msg = forPublish ? t("pkg.form.published") : t("pkg.form.saved");
        setSavedMsg(msg);
        setTimeout(() => setSavedMsg(""), 3500);
        if (mode === "create" && (result as { id?: string }).id) {
          router.push(`/caterer/packages/${(result as { id: string }).id}/edit`);
        } else if (mode === "edit") {
          router.refresh();
        }
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleAiAssist(type: "title" | "description" | "tags") {
    setAiTarget(type);
    setAiLoading(true);
    setAiSuggestion(null);
    setAiIsDemo(false);
    try {
      const res = await fetch("/api/packages/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, context: { title: form.title, category: form.category, cuisine_type: form.cuisine_type, event_types: form.event_types, description: form.description, tags: form.tags } }),
      });
      const json = await res.json();
      setAiSuggestion(json.suggestion ?? null);
      setAiIsDemo(json.demo ?? false);
    } catch {
      setAiSuggestion(null);
    } finally {
      setAiLoading(false);
    }
  }

  function applyAiSuggestion() {
    if (!aiSuggestion || !aiTarget) return;
    if (aiTarget === "title") set("title", aiSuggestion);
    else if (aiTarget === "description") set("description", aiSuggestion);
    else if (aiTarget === "tags") {
      const newTags = aiSuggestion.split(",").map((s) => s.trim()).filter(Boolean);
      set("tags", [...new Set([...form.tags, ...newTags])]);
    }
    setAiTarget(null);
    setAiSuggestion(null);
  }

  function AiButton({ type, label }: { type: "title" | "description" | "tags"; label: string }) {
    const isLoading = aiTarget === type && aiLoading;
    return (
      <button
        type="button"
        onClick={() => handleAiAssist(type)}
        disabled={saving || (aiLoading && aiTarget !== type)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-100 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {t("pkg.ai.loading")}
          </>
        ) : (
          <>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3l14 9-14 9V3z" />
            </svg>
            {label}
          </>
        )}
      </button>
    );
  }

  function AiResult() {
    if (aiTarget === null || aiLoading || !aiSuggestion) return null;
    return (
      <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50 p-4">
        {aiIsDemo && (
          <p className="mb-2 text-xs font-medium text-violet-500">{t("pkg.ai.demoNote")}</p>
        )}
        <p className="text-sm text-violet-900">{aiSuggestion}</p>
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={applyAiSuggestion} className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700">
            {t("pkg.ai.apply")}
          </button>
          <button type="button" onClick={() => { setAiTarget(null); setAiSuggestion(null); }} className="rounded-lg border border-violet-200 px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-100">
            {t("pkg.ai.dismiss")}
          </button>
        </div>
      </div>
    );
  }

  const inputCls = "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400";
  const checkCls = "flex items-center gap-2 cursor-pointer select-none";

  return (
    <div className="mx-auto max-w-3xl space-y-4 pb-12">

      {/* ── Header ── */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-sm rtl:flex-row-reverse">
        <div className="flex items-center gap-3 rtl:flex-row-reverse">
          <Link href="/caterer/packages" className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 rtl:flex-row-reverse">
            <svg className="h-4 w-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t("pkg.form.back")}
          </Link>
          <h1 className="text-base font-semibold text-gray-900">
            {t(mode === "create" ? "pkg.form.newTitle" : "pkg.form.editTitle")}
          </h1>
        </div>
        <div className="flex items-center gap-2 rtl:flex-row-reverse">
          {/* Status pill */}
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value as "draft" | "active" | "paused")}
            className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 focus:border-orange-400 focus:outline-none"
          >
            <option value="draft">{t("status.draft")}</option>
            <option value="active">{t("status.active")}</option>
            <option value="paused">{t("status.paused")}</option>
          </select>
          <button
            type="button"
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            {saving ? t("pkg.form.saving") : t("pkg.form.saveDraft")}
          </button>
          <button
            type="button"
            onClick={() => handleSave("active")}
            disabled={saving}
            className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
          >
            {saving ? t("pkg.form.saving") : t("pkg.form.publish")}
          </button>
        </div>
      </div>

      {/* ── Global success banner ── */}
      {savedMsg && (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          ✓ {savedMsg}
        </div>
      )}

      {/* ── Global error banner ── */}
      {errors.global && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{t(errors.global!, errors.global)}</div>
      )}

      {/* ── Section 1: Basics ── */}
      <Section title={t("pkg.form.basics")} badge={t("pkg.form.required")}>
        <div className="space-y-4">
          {/* Title */}
          <div>
            <FieldLabel label={t("pkg.form.titleLabel")} required />
            <div className="flex items-start gap-2 rtl:flex-row-reverse">
              <div className="flex-1">
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder={t("pkg.form.titlePlaceholder")}
                  maxLength={100}
                  className={inputCls}
                />
                <div className="mt-0.5 flex items-center justify-between">
                  <ErrorMsg msg={errors.title} />
                  <span className="text-xs text-gray-400">{(form.title?.length ?? 0)}/100</span>
                </div>
              </div>
              <AiButton type="title" label={t("pkg.ai.suggestTitle")} />
            </div>
            <TipPanel tipTitle={t("pkg.tip.titleTitle")} tips={[t("pkg.tip.title1"), t("pkg.tip.title2"), t("pkg.tip.title3")]} />
            {aiTarget === "title" && <AiResult />}
          </div>

          {/* Summary */}
          <div>
            <FieldLabel label={t("pkg.form.summaryLabel")} />
            <textarea
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
              placeholder={t("pkg.form.summaryPlaceholder")}
              rows={2}
              maxLength={220}
              className={inputCls}
            />
            <div className="mt-0.5 flex items-center justify-between">
              <ErrorMsg msg={errors.summary} />
              <span className="text-xs text-gray-400">{(form.summary?.length ?? 0)}/220</span>
            </div>
          </div>

          {/* Category + Cuisine */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel label={t("pkg.form.categoryLabel")} required />
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className={inputCls}
              >
                <option value="">{t("pkg.form.categorySelect")}</option>
                {PACKAGE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <ErrorMsg msg={errors.category} />
            </div>
            <div>
              <FieldLabel label={t("pkg.form.cuisineLabel")} />
              <input
                type="text"
                value={form.cuisine_type}
                onChange={(e) => set("cuisine_type", e.target.value)}
                placeholder={t("pkg.form.cuisinePlaceholder")}
                className={inputCls}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Section 2: Pricing & Capacity ── */}
      <Section title={t("pkg.form.pricing")} badge={t("pkg.form.required")}>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <FieldLabel label={t("pkg.form.priceLabel")} required />
            <input
              type="number"
              value={form.price_amount || ""}
              onChange={(e) => set("price_amount", parseFloat(e.target.value) || 0)}
              min={0}
              step={0.5}
              className={inputCls}
            />
            <ErrorMsg msg={errors.price_amount} />
          </div>
          <div>
            <FieldLabel label={t("pkg.form.minGuestsLabel")} required />
            <input
              type="number"
              value={form.min_guests || ""}
              onChange={(e) => set("min_guests", parseInt(e.target.value) || 0)}
              min={1}
              className={inputCls}
            />
            <ErrorMsg msg={errors.min_guests} />
          </div>
          <div>
            <FieldLabel label={t("pkg.form.maxGuestsLabel")} required />
            <input
              type="number"
              value={form.max_guests || ""}
              onChange={(e) => set("max_guests", parseInt(e.target.value) || 0)}
              min={1}
              className={inputCls}
            />
            <ErrorMsg msg={errors.max_guests} />
          </div>
        </div>
      </Section>

      {/* ── Section 3: Event Types ── */}
      <Section title={t("pkg.form.eventTypes")}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {EVENT_TYPES.map((ev) => (
            <label key={ev} className={checkCls}>
              <input
                type="checkbox"
                checked={form.event_types.includes(ev)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...form.event_types, ev]
                    : form.event_types.filter((x) => x !== ev);
                  set("event_types", next);
                }}
                className="h-4 w-4 rounded border-gray-300 accent-orange-500"
              />
              <span className="text-sm text-gray-700">{t(`event.${ev}`)}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* ── Section 4: Description ── */}
      <Section title={t("pkg.form.description")}>
        <div>
          <FieldLabel label={t("pkg.form.descriptionLabel")} />
          <div className="flex items-start gap-2 rtl:flex-row-reverse">
            <div className="flex-1">
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder={t("pkg.form.descriptionPlaceholder")}
                rows={6}
                className={inputCls}
              />
              <div className="mt-0.5 flex items-center justify-between">
                <ErrorMsg msg={errors.description} />
                <span className="text-xs text-gray-400">{(form.description?.length ?? 0)}</span>
              </div>
            </div>
            <AiButton type="description" label={t("pkg.ai.improveDesc")} />
          </div>
          <TipPanel tipTitle={t("pkg.tip.descTitle")} tips={[t("pkg.tip.desc1"), t("pkg.tip.desc2"), t("pkg.tip.desc3")]} />
          {aiTarget === "description" && <AiResult />}
        </div>
      </Section>

      {/* ── Section 5: Inclusions ── */}
      <Section title={t("pkg.form.inclusions")}>
        <div className="space-y-6">
          <div>
            <FieldLabel label={t("pkg.form.includedLabel")} />
            <TagInput
              tags={form.included_items}
              onChange={(v) => set("included_items", v)}
              placeholder={t("pkg.form.includedPlaceholder")}
            />
          </div>
          <div>
            <FieldLabel label={t("pkg.form.addOns")} />
            <AddOnList
              addOns={form.add_ons}
              onChange={(v) => set("add_ons", v)}
              labelName={t("pkg.form.addOnName")}
              labelPrice={t("pkg.form.addOnPrice")}
              labelAdd={t("pkg.form.addOnAdd")}
            />
          </div>
        </div>
      </Section>

      {/* ── Section 6: Dietary ── */}
      <Section title={t("pkg.form.dietary")}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {DIETARY_OPTIONS.map((d) => (
            <label key={d} className={checkCls}>
              <input
                type="checkbox"
                checked={form.dietary_options.includes(d)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...form.dietary_options, d]
                    : form.dietary_options.filter((x) => x !== d);
                  set("dietary_options", next);
                }}
                className="h-4 w-4 rounded border-gray-300 accent-orange-500"
              />
              <span className="text-sm text-gray-700">{t(`dietary.${d}`)}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* ── Section 7: Logistics (collapsible) ── */}
      <CollapsibleSection title={t("pkg.form.logistics")} open={showLogistics} onToggle={() => setShowLogistics((v) => !v)}>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-3">
            <FieldLabel label={t("pkg.form.serviceArea")} />
            <input
              type="text"
              value={form.service_area}
              onChange={(e) => set("service_area", e.target.value)}
              placeholder={t("pkg.form.serviceAreaPlaceholder")}
              className={inputCls}
            />
          </div>
          <div>
            <FieldLabel label={t("pkg.form.setupTime")} />
            <input
              type="number"
              value={form.setup_time_hours || ""}
              onChange={(e) => set("setup_time_hours", parseFloat(e.target.value) || 0)}
              min={0}
              step={0.5}
              className={inputCls}
            />
          </div>
          <div>
            <FieldLabel label={t("pkg.form.bookingNotice")} />
            <input
              type="number"
              value={form.booking_notice_days || ""}
              onChange={(e) => set("booking_notice_days", parseInt(e.target.value) || 0)}
              min={0}
              className={inputCls}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* ── Section 8: Media (collapsible) ── */}
      <CollapsibleSection title={t("pkg.form.media")} open={showMedia} onToggle={() => setShowMedia((v) => !v)}>
        <div className="space-y-4">
          <div>
            <FieldLabel label={t("pkg.form.coverImageLabel")} />
            <input
              type="url"
              value={form.cover_image_url}
              onChange={(e) => set("cover_image_url", e.target.value)}
              placeholder="https://..."
              className={inputCls}
            />
            {form.cover_image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.cover_image_url} alt="" className="mt-2 h-36 w-full rounded-xl object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            )}
          </div>
          <div>
            <FieldLabel label={t("pkg.form.imageGallery")} />
            <ImageList
              images={form.images}
              onChange={(v) => set("images", v)}
              labelUrl={t("pkg.form.imageUrl")}
              labelAdd={t("pkg.form.addImage")}
            />
          </div>
          <TipPanel tipTitle={t("pkg.tip.imageTitle")} tips={[t("pkg.tip.image1"), t("pkg.tip.image2"), t("pkg.tip.image3")]} />
        </div>
      </CollapsibleSection>

      {/* ── Section 9: Discovery (collapsible) ── */}
      <CollapsibleSection title={t("pkg.form.discovery")} open={showDiscovery} onToggle={() => setShowDiscovery((v) => !v)}>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between rtl:flex-row-reverse">
              <FieldLabel label={t("pkg.form.tagsLabel")} />
              <AiButton type="tags" label={t("pkg.ai.suggestTags")} />
            </div>
            <TagInput
              tags={form.tags}
              onChange={(v) => set("tags", v)}
              placeholder={t("pkg.form.tagsPlaceholder")}
            />
            {aiTarget === "tags" && <AiResult />}
          </div>
          <label className={`${checkCls} mt-2`}>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 accent-orange-500"
            />
            <div>
              <p className="text-sm font-medium text-gray-800">{t("pkg.form.featuredLabel")}</p>
              <p className="text-xs text-gray-500">{t("pkg.form.featuredDesc")}</p>
            </div>
          </label>
        </div>
      </CollapsibleSection>

      {/* ── Bottom action bar ── */}
      <div className="flex items-center justify-end gap-3 rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-sm rtl:flex-row-reverse">
        <Link href="/caterer/packages" className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
          {t("pkg.form.back")}
        </Link>
        <button
          type="button"
          onClick={() => handleSave("draft")}
          disabled={saving}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
        >
          {saving ? t("pkg.form.saving") : t("pkg.form.saveDraft")}
        </button>
        <button
          type="button"
          onClick={() => handleSave("active")}
          disabled={saving}
          className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
        >
          {saving ? t("pkg.form.saving") : t("pkg.form.publish")}
        </button>
      </div>
    </div>
  );
}
