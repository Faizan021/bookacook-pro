import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import {
  getCatererIdForUser,
  getCatererBookingsList,
} from "@/lib/dashboard/caterer-modules";
import { BookingsModule } from "@/components/dashboard/bookings-module";

export default async function CatererBookingsPage() {
  const { user } = await getUserProfile();
  if (!user) redirect("/login");

  const caterer = await getCatererIdForUser(user.id);
  const bookings = caterer ? await getCatererBookingsList(caterer.id) : [];

  return (
    <div className="p-6">
      <BookingsModule role="caterer" bookings={bookings} />
    </div>
  );
}
