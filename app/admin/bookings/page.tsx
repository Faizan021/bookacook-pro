import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import { BookingsModule } from "@/components/dashboard/bookings-module";

export default async function AdminBookingsPage() {
  const { user, profile } = await getUserProfile();
  if (!user || !profile) redirect("/login");
  if (profile.role !== "admin") redirect("/dashboard");

  return (
    <div className="p-6">
      <BookingsModule role="admin" />
    </div>
  );
}
