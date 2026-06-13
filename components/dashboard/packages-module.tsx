"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Copy,
  Eye,
  Package2,
  Pencil,
  Sparkles,
  Trash2,
} from "lucide-react";
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
  summary?: string;
  cuisineType?: string;
  eventTypes?: string[];
  dietaryOptions?: string[];
  serviceArea?: string;
  tags?: string[];
};

type PackagesModuleProps = {
  packages?: CateringPackage[];
  isEditable?: boolean;
};

const demoPackages: CateringPackage[] = [
  {
    id: "PKG-001",
    name: "Classic BBQ Package",
    description:
      "Slow-cooked meats, grilled vegetables, homemade sauces, and all the sides you need for a great outdoor event.",
    pricePerPerson: 38,
    minGuests: 20,
    maxGuests: 150,
    category: "BBQ & Grill",
    status: "active",
    eventTypes: ["corporate", "birthday"],
    dietaryOptions: ["gluten_free"],
  },
  {
    id: "PKG-002",
    name: "Wedding Deluxe",
    description:
      "Three-course plated dinner with wine pairing, professional wait staff, and full setup included.",
    pricePerPerson: 95,
    minGuests: 50,
    maxGuests: 300,
    category: "Fine Dining",
    status: "active",
    eventTypes: ["wedding", "anniversary"],
    dietaryOptions: ["vegetarian", "halal"],
  },
  {
    id: "PKG-003",
    name: "Corporate Buffet",
    description:
      "Hot and cold buffet with a wide selection of international dishes, perfect for business events.",
    pricePerPerson: 28,
    minGuests: 15,
    maxGuests: 200,
    category: "Buffet",
    status: "active",
    eventTypes: ["corporate", "conference"],
    dietaryOptions: ["vegan", "vegetarian"],
  },
  {
    id: "PKG-004",
    name: "Cocktail & Canapés",
    description:
      "Elegant finger food and canapés with non-alcoholic welcome drinks. Ideal for networking events.",
    pricePerPerson: 22,
    minGuests: 30,
    maxGuests: 500,
    category: "Cocktail",
    status: "active",
    eventTypes: ["networking", "corporate"],
  },
  {
    id: "PKG-005",
    name: "Private Chef Dinner",
    description:
      "An intimate dining experience with a personal chef cooking a bespoke menu for your guests.",
    pricePerPerson: 120,
    minGuests: 6,
    maxGuests: 20,
    category: "Fine Dining",
    status: "draft",
    eventTypes: ["private_dinner", "anniversary"],
  },
  {
    id: "PKG-006",
    name: "Street Food Festival",
    description:
      "Multiple street food stations with a variety of cuisines — a crowd-pleasing format for large events.",
    pricePerPerson: 32,
    minGuests: 100,
    maxGuests: 1000,
    category: "Street Food",
    status: "paused",
    eventTypes: ["corporate", "graduation"],
  },
];

const statusStyles: Record<PackageStatus, string> = {
  active: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  draft: "border border-[#eadfce] bg-white text-[#5c6f68]",
  paused: "border border-amber-200 bg-amber-50 text-amber-700",
};

const EVENT_LABELS: Record<string, string> = {
  wedding: "Hochzeit",
  corporate: "Firmenevent",
  birthday: "Geburtstag",
  private_dinner: "Privat",
  team_event: "Team",
  conference: "Konferenz",
  networking: "Networking",
  graduation: "Abschluss",
  anniversary: "Jubiläum",
  other: "Sonstige",
};

export function PackagesModule({
  packages: packagesProp,
  isEditable = false,
}: PackagesModuleProps) {
  const t = useT();
  const router = useRouter();
  const data = packagesProp ?? demoPackages;
  const isEmpty = packagesProp !== undefined && data.length === 0;

  const [duplicating, setDuplicating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  async function handleDuplicate(id: string) {
    setDuplicating(id);
    try {
      await duplicatePackage(id);
      router.refresh();
    } finally {
      setDuplicating(null);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      await deletePackage(id);
      setConfirmDelete(null);
      router.refresh();
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 rtl:flex-row-reverse">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b28a3c]">
            <Package2 className="h-3.5 w-3.5" />
            {t("packages.title")}
          </div>
          <h2 className="premium-heading mt-2 text-2xl font-semibold text-[#173f35]">
            {t("packages.title")}
          </h2>
          <p className="mt-2 text-sm leading-7 text-[#5c6f68]">
            {t("packages.subtitle")}
          </p>
        </div>

        {isEditable ? (
          <Link
            href="/caterer/packages/new"
            className="inline-flex items-center gap-2 rounded-[1rem] bg-[#173f35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2f27]"
          >
            {t("btn.newPackage")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-[1rem] bg-[#173f35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2f27]"
          >
            {t("btn.newPackage")}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="rounded-[1.75rem] border border-[#eadfce] bg-white p-16 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#eadfce] bg-[#faf6ee] text-[#b28a3c]">
              <Sparkles className="h-7 w-7" />
            </div>

            <p className="premium-heading mt-5 text-lg font-semibold text-[#173f35]">
              {t("empty.packages")}
            </p>
            <p className="mt-2 text-sm leading-7 text-[#5c6f68]">
              {t("empty.packagesDesc")}
            </p>

            {isEditable ? (
              <Link
                href="/caterer/packages/new"
                className="mt-6 inline-flex items-center gap-2 rounded-[1rem] bg-[#173f35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2f27]"
              >
                {t("pkg.addFirst")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <button
                type="button"
                className="mt-6 inline-flex items-center gap-2 rounded-[1rem] bg-[#173f35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2f27]"
              >
                {t("pkg.addFirst")}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((pkg) => (
            <div
              key={pkg.id}
              className="group rounded-[1.75rem] border border-[#eadfce] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#c9a45c]/40 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3 rtl:flex-row-reverse">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                    {pkg.category}
                  </p>
                  <h3 className="premium-heading mt-2 truncate text-lg font-semibold text-[#173f35]">
                    {pkg.name}
                  </h3>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${statusStyles[pkg.status]}`}
                >
                  {t(`status.${pkg.status}`, pkg.status)}
                </span>
              </div>

              <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#5c6f68]">
                {pkg.description}
              </p>

              {pkg.eventTypes && pkg.eventTypes.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {pkg.eventTypes.slice(0, 3).map((ev) => (
                    <span
                      key={ev}
                      className="rounded-full border border-[#eadfce] bg-[#faf6ee] px-3 py-1 text-[11px] font-medium text-[#5c6f68]"
                    >
                      {EVENT_LABELS[ev] ?? ev}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-5 border-t border-[#eadfce] pt-5">
                <div className="flex items-end justify-between gap-4 rtl:flex-row-reverse">
                  <div>
                    <p className="premium-heading text-3xl font-semibold tracking-tight text-[#173f35]">
                      €
                      {Number(pkg.pricePerPerson).toLocaleString("de-DE", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#8a6d35]">
                      {t("packages.perPerson")}
                    </p>
                  </div>

                  <div className="text-end rtl:text-start">
                    <p className="text-sm font-medium text-[#5c6f68]">
                      {pkg.minGuests}–{pkg.maxGuests} {t("packages.guests")}
                    </p>
                  </div>
                </div>
              </div>

              {isEditable ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/caterer/packages/${pkg.id}/edit`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-[0.95rem] border border-[#eadfce] bg-[#faf6ee] px-3 py-2.5 text-xs font-semibold text-[#173f35] transition hover:border-[#c9a45c]/40 hover:bg-white"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    {t("btn.edit")}
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDuplicate(pkg.id)}
                    disabled={duplicating === pkg.id}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-[0.95rem] border border-[#eadfce] bg-[#faf6ee] px-3 py-2.5 text-xs font-semibold text-[#173f35] transition hover:border-[#c9a45c]/40 hover:bg-white disabled:opacity-50"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {duplicating === pkg.id ? "…" : t("pkg.duplicate")}
                  </button>

                  {confirmDelete === pkg.id ? (
                    <div className="flex w-full gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(pkg.id)}
                        disabled={deleting === pkg.id}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-[0.95rem] border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {deleting === pkg.id ? "…" : t("pkg.delete")}
                      </button>

                      <button
                        type="button"
                        onClick={() => setConfirmDelete(null)}
                        className="inline-flex flex-1 items-center justify-center rounded-[0.95rem] border border-[#eadfce] bg-white px-3 py-2.5 text-xs font-semibold text-[#5c6f68] transition hover:bg-[#faf6ee]"
                      >
                        {t("btn.cancel", "Cancel")}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(pkg.id)}
                      className="inline-flex w-full mt-2 items-center justify-center gap-2 rounded-[0.95rem] border border-red-100 bg-white px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {t("pkg.delete")}
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-[0.95rem] border border-[#eadfce] bg-[#faf6ee] px-3 py-2.5 text-xs font-semibold text-[#173f35] transition hover:border-[#c9a45c]/40 hover:bg-white"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    {t("btn.edit")}
                  </button>

                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-[0.95rem] border border-[#eadfce] bg-[#faf6ee] px-3 py-2.5 text-xs font-semibold text-[#173f35] transition hover:border-[#c9a45c]/40 hover:bg-white"
                  >
                    <Eye className="h-3.5 w-3.5" />
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
