import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import { PackageForm } from "@/components/packages/package-form";

export const metadata = { title: "Neues Paket – BookaCook Pro" };

export default async function NewPackagePage() {
  const { user } = await getUserProfile();
  if (!user) redirect("/login");

  return (
    <div className="p-6">
      <PackageForm mode="create" />
    </div>
  );
}
