import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import { getCatererIdForUser } from "@/lib/dashboard/caterer-modules";
import { getCatererPackages } from "@/lib/packages/schema";
import { PackagesModule } from "@/components/dashboard/packages-module";
import type { PackageStatus } from "@/lib/packages/types";

export default async function CatererPackagesPage() {
  const { user } = await getUserProfile();
  if (!user) redirect("/login");

  const caterer = await getCatererIdForUser(user.id);
  const packages = caterer ? await getCatererPackages(caterer.id) : [];

  // Map Package → CateringPackage shape expected by PackagesModule.
  const mapped = packages.map((p) => {
    const raw = p as Record<string, unknown>;

    // Status: prefer canonical column; fall back to is_published flag or 'draft'
    const rawStatus = (p.status as string | undefined | null) ||
      (raw.is_published ? "active" : "draft");
    const status: PackageStatus =
      rawStatus === "active" || rawStatus === "paused" ? rawStatus : "draft";

    // Price: canonical column is price_amount
    const pricePerPerson = Number(p.price_amount) || 0;

    return {
      id: p.id,
      name: p.title,
      description: (p.description as string | undefined) ?? (p.summary as string | undefined) ?? "",
      pricePerPerson,
      minGuests: (p.min_guests as number | undefined) ?? 0,
      maxGuests: (p.max_guests as number | undefined) ?? 0,
      category: (p.category as string | undefined) ?? "",
      status,
      summary: p.summary as string | undefined,
      cuisineType: (p.cuisine_type as string | undefined) ?? undefined,
      eventTypes: (p.event_types as string[] | undefined) ?? [],
      dietaryOptions: (p.dietary_options as string[] | undefined) ?? [],
      serviceArea: (p.service_area as string | undefined) ?? undefined,
      tags: (p.tags as string[] | undefined) ?? [],
    };
  });

  return (
    <div className="p-6">
      <PackagesModule packages={mapped} isEditable />
    </div>
  );
}
