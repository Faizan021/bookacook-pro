import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import { getAdminPaymentsList, getAdminPaymentsSummary } from "@/lib/dashboard/admin-modules";
import { PaymentsModule } from "@/components/dashboard/payments-module";

export default async function AdminPaymentsPage() {
  const { user, profile } = await getUserProfile();
  if (!user) redirect("/login");
  if (!profile) redirect("/");
  if (profile.role !== "admin") redirect("/dashboard");

  const [payments, summary] = await Promise.all([
    getAdminPaymentsList(),
    getAdminPaymentsSummary(),
  ]);

  return (
    <div className="p-6">
      <PaymentsModule role="admin" payments={payments} adminSummary={summary} />
    </div>
  );
}
