"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n/context";
import { duplicatePackage, deletePackage } from "@/lib/packages/actions";

type PackageStatus = "active" | "draft" | "paused";

type CateringPackage = {
  id: string;
  name: string;
  description: string;
  pricePerPerson: number;
  minGuests: number;
  maxGuests: number;
  category: string;
  status: PackageStatus;
  // Optional extended fields
  summary?: string;
  cuisineType?: string;
  eventTypes?: string[];
  dietaryOptions?: string[];
  serviceArea?: string;
  tags?: string[];
};

type PackagesModuleProps = {
  packages?: CateringPackage[];
  /** When true, buttons link to the real create / edit pages */
  isEditable?: boolean;
};

const demoPackages: CateringPackage[] = [
  { id: "PKG-001", name: "Classic BBQ Package", description: "Slow-cooked meats, grilled vegetables, homemade sauces, and all the sides you need for a great outdoor event.", pricePerPerson: 38, minGuests: 20, maxGuests: 150, category: "BBQ & Grill", status: "active", eventTypes: ["corporate", "birthday"], dietaryOptions: ["gluten_free"] },
  { id: "PKG-002", name: "Wedding Deluxe", description: "Three-course plated dinner with wine pairing, professional wait staff, and full setup included.", pricePerPerson: 95, minGuests: 50, maxGuests: 300, category: "Fine Dining", status: "active", eventTypes: ["wedding", "anniversary"], dietaryOptions: ["vegetarian", "halal"] },
  { id: "PKG-003", name: "Corporate Buffet", description: "Hot and cold buffet with a wide selection of international dishes, perfect for business events.", pricePerPerson: 28, minGuests: 15, maxGuests: 200, category: "Buffet", status: "active", eventTypes: ["corporate", "conference"], dietaryOptions: ["vegan", "vegetarian"] },
  { id: "PKG-004", name: "Cocktail & Canapés", description: "Elegant finger food and canapés with non-alcoholic welcome drinks. Ideal for networking events.", pricePerPerson: 22, minGuests: 30, maxGuests: 500, category: "Cocktail", status: "active", eventTypes: ["networking", "corporate"] },
  { id: "PKG-005", name: "Private Chef Dinner", description: "An intimate dining experience with a personal chef cooking a bespoke menu for your guests.", pricePerPerson: 120, minGuests: 6, maxGuests: 20, category: "Fine Dining", status: "draft", eventTypes: ["private_dinner", "anniversary"] },
  { id: "PKG-006", name: "Street Food Festival", description: "Multiple street food stations with a variety of cuisines — a crowd-pleasing format for large events.", pricePerPerson: 32, minGuests: 100, maxGuests: 1000, category: "Street Food", status: "paused", eventTypes: ["corporate", "graduation"] },
];

const statusStyles: Record<PackageStatus, string> = {
  active: "bg-green-50 text-green-700",
  draft: "bg-gray-100 text-gray-600",
  paused: "bg-amber-50 text-amber-700",
};

const EVENT_LABELS: Record<string, string> = {
  wedding: "Hochzeit", corporate: "Firmenevent", birthday: "Geburtstag",
  private_dinner: "Privat", team_event: "Team", conference: "Konferenz",
  networking: "Networking", graduation: "Abschluss", anniversary: "Jubiläum", other: "Sonstige",
};

export function PackagesModule({ packages: packagesProp, isEditable = false }: PackagesModuleProps) {
  const t = useT();
  const router = useRouter();
  const data = packagesProp ?? demoPackages;
  const isEmpty = packagesProp !== undefined && data.length === 0;

  const [duplicating, setDuplicating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  async function handleDuplicate(id: string) {
    setDuplicating(id);
    await duplicatePackage(id);
    setDuplicating(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    await deletePackage(id);
    setDeleting(null);
    setConfirmDelete(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rtl:flex-row-reverse">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t("packages.title")}</h2>
          <p className="text-sm text-gray-500">{t("packages.subtitle")}</p>
        </div>
        {isEditable ? (
          <Link
            href="/caterer/packages/new"
            className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            {t("btn.newPackage")}
          </Link>
        ) : (
          <button className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600">
            {t("btn.newPackage")}
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-16 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="mt-4 text-base font-semibold text-gray-600">{t("empty.packages")}</p>
            <p className="mt-1 text-sm text-gray-400">{t("empty.packagesDesc")}</p>
            {isEditable ? (
              <Link href="/caterer/packages/new" className="mt-6 rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600">
                {t("pkg.addFirst")}
              </Link>
            ) : (
              <button className="mt-6 rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600">
                {t("pkg.addFirst")}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((pkg) => (
            <div key={pkg.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2 rtl:flex-row-reverse">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-400">{pkg.category}</p>
                  <h3 className="mt-1 font-semibold text-gray-900 truncate">{pkg.name}</h3>
                </div>
                <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[pkg.status] ?? statusStyles.draft}`}>
                  {t(`status.${pkg.status ?? "draft"}`, pkg.status ?? "draft")}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-500 line-clamp-2">{pkg.description}</p>

              {/* Event type badges */}
              {pkg.eventTypes && pkg.eventTypes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {pkg.eventTypes.slice(0, 3).map((ev) => (
                    <span key={ev} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                      {EVENT_LABELS[ev] ?? ev}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-4 rtl:flex-row-reverse">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    €{Number(pkg.pricePerPerson).toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-400">{t("packages.perPerson")}</p>
                </div>
                <div className="text-end">
                  <p className="text-sm font-medium text-gray-600">
                    {pkg.minGuests}–{pkg.maxGuests} {t("packages.guests")}
                  </p>
                </div>
              </div>

              {isEditable ? (
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/caterer/packages/${pkg.id}/edit`}
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-center text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    {t("btn.edit")}
                  </Link>
                  <button
                    onClick={() => handleDuplicate(pkg.id)}
                    disabled={duplicating === pkg.id}
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    {duplicating === pkg.id ? "…" : t("pkg.duplicate")}
                  </button>
                  {confirmDelete === pkg.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        disabled={deleting === pkg.id}
                        className="rounded-lg bg-red-500 px-2 py-1.5 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50"
                      >
                        {deleting === pkg.id ? "…" : "✓"}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(pkg.id)}
                      className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
                    >
                      {t("pkg.delete")}
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50">
                    {t("btn.edit")}
                  </button>
                  <button className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50">
                    {t("btn.preview")}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
