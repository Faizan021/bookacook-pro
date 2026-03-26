import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import {
  getCatererIdForUser,
  getCatererPackagesList,
} from "@/lib/dashboard/caterer-modules";
import { PackagesModule } from "@/components/dashboard/packages-module";

export default async function CatererPackagesPage() {
  const { user } = await getUserProfile();
  if (!user) redirect("/login");

  const caterer = await getCatererIdForUser(user.id);
  const packages = caterer ? await getCatererPackagesList(caterer.id) : [];

  return (
    <div className="p-6">
      <PackagesModule packages={packages} />
    </div>
  );
}
