import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import {
  getCatererIdForUser,
  getCatererBookingDates,
} from "@/lib/dashboard/caterer-modules";
import { getCatererAvailability } from "@/lib/availability/queries";
import { AvailabilityModule } from "@/components/dashboard/availability-module";

export default async function CatererAvailabilityPage() {
  const { user } = await getUserProfile();
  if (!user) redirect("/login");

  const caterer = await getCatererIdForUser(user.id);
  const [bookedDates, initialAvailability] = await Promise.all([
    caterer ? getCatererBookingDates(caterer.id) : Promise.resolve([]),
    caterer ? getCatererAvailability(caterer.id) : Promise.resolve([]),
  ]);

  return (
    <div className="p-6">
      <AvailabilityModule
        bookedDates={bookedDates}
        initialAvailability={initialAvailability}
      />
    </div>
  );
}
