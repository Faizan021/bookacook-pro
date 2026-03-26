import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import {
  getCatererIdForUser,
  getCatererBookingDates,
} from "@/lib/dashboard/caterer-modules";
import { AvailabilityModule } from "@/components/dashboard/availability-module";

export default async function CatererAvailabilityPage() {
  const { user } = await getUserProfile();
  if (!user) redirect("/login");

  const caterer = await getCatererIdForUser(user.id);
  const bookedDates = caterer ? await getCatererBookingDates(caterer.id) : [];

  return (
    <div className="p-6">
      <AvailabilityModule bookedDates={bookedDates} />
    </div>
  );
}
