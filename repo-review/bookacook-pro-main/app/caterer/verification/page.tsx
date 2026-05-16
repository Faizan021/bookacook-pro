import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import { getCatererProfile } from "@/lib/dashboard/caterer-modules";
import { VerificationModule } from "@/components/dashboard/verification-module";

export default async function CatererVerificationPage() {
  const { user, profile } = await getUserProfile();
  if (!user) redirect("/login");
  if (!profile) redirect("/");
  if (profile.role !== "caterer" && profile.role !== "admin") redirect("/dashboard");

  const catererProfile = await getCatererProfile(user.id);

  return (
    <div className="p-6">
      <VerificationModule profile={catererProfile ?? undefined} />
    </div>
  );
}
