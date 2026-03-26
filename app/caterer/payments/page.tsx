import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import {
  getCatererIdForUser,
  getCatererPaymentsList,
} from "@/lib/dashboard/caterer-modules";
import { PaymentsModule } from "@/components/dashboard/payments-module";

export default async function CatererPaymentsPage() {
  const { user } = await getUserProfile();
  if (!user) redirect("/login");

  const caterer = await getCatererIdForUser(user.id);
  const { payments, totals } = caterer
    ? await getCatererPaymentsList(caterer.id)
    : {
        payments: [],
        totals: { total: "€0", commission: "€0", pending: "€0" },
      };

  return (
    <div className="p-6">
      <PaymentsModule role="caterer" payments={payments} totalsOverride={totals} />
    </div>
  );
}
