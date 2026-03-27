import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import { getCatererIdForUser } from "@/lib/dashboard/caterer-modules";
import { getCatererPackages } from "@/lib/packages/schema";
import { PackagesModule } from "@/components/dashboard/packages-module";

export default async function CatererPackagesPage() {
  const { user } = await getUserProfile();
  if (!user) redirect("/login");

  const caterer = await getCatererIdForUser(user.id);
  const packages = caterer ? await getCatererPackages(caterer.id) : [];

  // Map Package → CateringPackage shape expected by PackagesModule
  const mapped = packages.map((p) => ({
    id: p.id,
    name: p.title,
    description: p.description ?? p.summary ?? "",
    pricePerPerson: p.price_per_person,
    minGuests: p.min_guests,
    maxGuests: p.max_guests,
    category: p.category,
    status: p.status,
    summary: p.summary,
    cuisineType: p.cuisine_type,
    eventTypes: p.event_types,
    dietaryOptions: p.dietary_options,
    serviceArea: p.service_area,
    tags: p.tags,
  }));

  return (
    <div className="p-6">
      <PackagesModule packages={mapped} isEditable />
    </div>
  );
}
