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
  active: "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  draft: "border border-white/10 bg-white/[0.05] text-[#cfc6b4]",
  paused: "border border-amber-400/20 bg-amber-400/10 text-amber-300",
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
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c49840]">
            <Package2 className="h-3.5 w-3.5" />
            {t("packages.title")}
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {t("packages.title")}
          </h2>
          <p className="mt-2 text-sm leading-7 text-[#92a18f]">
            {t("packages.subtitle")}
          </p>
        </div>

        {isEditable ? (
          <Link
            href="/caterer/packages/new"
            className="inline-flex items-center gap-2 rounded-[1rem] bg-[#c49840] px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
          >
            {t("btn.newPackage")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-[1rem] bg-[#c49840] px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
          >
            {t("btn.newPackage")}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-white/[0.04] p-16 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#c49840]/15 bg-[#c49840]/10 text-[#c49840]">
              <Sparkles className="h-7 w-7" />
            </div>

            <p className="mt-5 text-lg font-semibold text-white">
              {t("empty.packages")}
            </p>
            <p className="mt-2 text-sm leading-7 text-[#92a18f]">
              {t("empty.packagesDesc")}
            </p>

            {isEditable ? (
              <Link
                href="/caterer/packages/new"
                className="mt-6 inline-flex items-center gap-2 rounded-[1rem] bg-[#c49840] px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
              >
                {t("pkg.addFirst")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <button
                type="button"
                className="mt-6 inline-flex items-center gap-2 rounded-[1rem] bg-[#c49840] px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
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
              className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-[#c49840]/20 hover:bg-white/[0.06]"
            >
              <div className="flex items-start justify-between gap-3 rtl:flex-row-reverse">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8ea18b]">
                    {pkg.category}
                  </p>
                  <h3 className="mt-2 truncate text-lg font-semibold text-white">
                    {pkg.name}
                  </h3>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${statusStyles[pkg.status]}`}
                >
                  {t(`status.${pkg.status}`, pkg.status)}
                </span>
              </div>

              <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#92a18f]">
                {pkg.description}
              </p>

              {pkg.eventTypes && pkg.eventTypes.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {pkg.eventTypes.slice(0, 3).map((ev) => (
                    <span
                      key={ev}
                      className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-[11px] text-[#ddd5c6]"
                    >
                      {EVENT_LABELS[ev] ?? ev}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-5 border-t border-white/10 pt-5">
                <div className="flex items-end justify-between gap-4 rtl:flex-row-reverse">
                  <div>
                    <p className="text-3xl font-semibold tracking-tight text-white">
                      €
                      {Number(pkg.pricePerPerson).toLocaleString("de-DE", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#8ea18b]">
                      {t("packages.perPerson")}
                    </p>
                  </div>

                  <div className="text-end rtl:text-start">
                    <p className="text-sm font-medium text-[#eadfca]">
                      {pkg.minGuests}–{pkg.maxGuests} {t("packages.guests")}
                    </p>
                  </div>
                </div>
              </div>

              {isEditable ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/caterer/packages/${pkg.id}/edit`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-[0.95rem] border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs font-medium text-white transition hover:border-[#c49840]/30 hover:text-[#c49840]"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    {t("btn.edit")}
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDuplicate(pkg.id)}
                    disabled={duplicating === pkg.id}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-[0.95rem] border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs font-medium text-white transition hover:border-[#c49840]/30 hover:text-[#c49840] disabled:opacity-50"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {duplicating === pkg.id ? "…" : t("pkg.duplicate")}
                  </button>

                  {confirmDelete === pkg.id ? (
                    <div className="flex w-full gap-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(pkg.id)}
                        disabled={deleting === pkg.id}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-[0.95rem] border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-xs font-medium text-red-300 transition hover:bg-red-400/15 disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {deleting === pkg.id ? "…" : t("pkg.delete")}
                      </button>

                      <button
                        type="button"
                        onClick={() => setConfirmDelete(null)}
                        className="inline-flex flex-1 items-center justify-center rounded-[0.95rem] border border-white/10 bg-black/10 px-3 py-2.5 text-xs font-medium text-[#eadfca] transition hover:bg-white/[0.03]"
                      >
                        {t("btn.cancel", "Cancel")}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(pkg.id)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-[0.95rem] border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-xs font-medium text-red-300 transition hover:bg-red-400/15"
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
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-[0.95rem] border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs font-medium text-white transition hover:border-[#c49840]/30 hover:text-[#c49840]"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    {t("btn.edit")}
                  </button>

                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-[0.95rem] border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs font-medium text-white transition hover:border-[#c49840]/30 hover:text-[#c49840]"
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
