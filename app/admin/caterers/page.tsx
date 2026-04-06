import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import { getAdminCaterersList } from "@/lib/dashboard/admin-modules";
import { AdminCaterersModule } from "@/components/dashboard/admin-caterers-module";

export default async function AdminCaterersPage() {
  const { user, profile } = await getUserProfile();
  if (!user) redirect("/login");
  if (!profile) redirect("/");
  if (profile.role !== "admin") redirect("/dashboard");

  const caterers = await getAdminCaterersList();

  return (
    <div className="p-6">
      <AdminCaterersModule caterers={caterers} />
    </div>
  );
}
