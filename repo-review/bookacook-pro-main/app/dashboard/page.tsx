import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/get-user-profile";

export default async function DashboardPage() {
  const { user, profile } = await getUserProfile();

  if (!user) redirect("/login");
  if (!profile) redirect("/");

  if (profile.role === "admin") {
    redirect("/admin");
  }

  if (profile.role === "caterer") {
    redirect("/caterer");
  }

  redirect("/customer");
}