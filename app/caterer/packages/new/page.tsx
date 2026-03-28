import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import { PackageWizard } from "@/components/packages/package-wizard";

export const metadata = { title: "Neues Paket – BookaCook Pro" };

export default async function NewPackagePage() {
  const { user } = await getUserProfile();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <PackageWizard />
    </div>
  );
}
