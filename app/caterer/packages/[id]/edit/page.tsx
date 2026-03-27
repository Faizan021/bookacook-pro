import { redirect, notFound } from "next/navigation";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import { getCatererIdForUser } from "@/lib/dashboard/caterer-modules";
import { getPackageById } from "@/lib/packages/schema";
import { PackageForm } from "@/components/packages/package-form";

export const metadata = { title: "Paket bearbeiten – BookaCook Pro" };

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await getUserProfile();
  if (!user) redirect("/login");

  const [caterer, pkg] = await Promise.all([
    getCatererIdForUser(user.id),
    getPackageById(id),
  ]);

  if (!pkg) notFound();

  // Redirect if caterer doesn't own this package
  if (!caterer || caterer.id !== pkg.caterer_id) redirect("/caterer/packages");

  return (
    <div className="p-6">
      <PackageForm mode="edit" packageId={id} initialData={pkg} />
    </div>
  );
}
