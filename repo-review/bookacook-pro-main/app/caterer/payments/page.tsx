import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import {
  getCatererProfile,
  getCatererExtendedPayments,
} from "@/lib/dashboard/caterer-modules";
import { PaymentsModule } from "@/components/dashboard/payments-module";

export default async function CatererPaymentsPage() {
  const { user } = await getUserProfile();
  if (!user) redirect("/login");

  const profile = await getCatererProfile(user.id);
  const catererId = profile?.id;

  const ZERO_TOTALS = {
    grossTotal: "€0,00", commissionTotal: "€0,00", netTotal: "€0,00",
    heldTotal: "€0,00", releasedTotal: "€0,00", remainingTotal: "€0,00",
  };

  const { payments, totals } = catererId
    ? await getCatererExtendedPayments(catererId)
    : { payments: [], totals: ZERO_TOTALS };

  const isPayoutBlocked = profile ? !profile.payoutEnabled : true;

  return (
    <div className="p-6">
      <PaymentsModule
        role="caterer"
        extendedPayments={payments}
        extendedTotals={totals}
        isPayoutBlocked={isPayoutBlocked}
      />
    </div>
  );
}
