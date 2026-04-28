import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/get-user-profile";

export default async function AdminSettingsPage() {
  const { user, profile } = await getUserProfile();

  if (!user) redirect("/admin-login");
  if (!profile) redirect("/admin-login");
  if (profile.role !== "admin") redirect("/");

  return (
    <div className="space-y-6 text-[#16372f]">
      <div className="rounded-[2rem] border border-[#eadfce] bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
          Admin / Settings
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#173f35]">
          Platform settings
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5c6f68]">
          Control Speisely’s commission, payout holding period, caterer
          verification rules, and marketplace safety settings.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#173f35]">
            Payment rules
          </h2>

          <div className="mt-6 space-y-4">
            <SettingRow
              label="Platform commission"
              value="10%"
              note="Speisely keeps 10% from each completed catering order."
            />

            <SettingRow
              label="Payout holding period"
              value="7 days"
              note="Funds are held for 7 days after event completion in case the customer raises an issue."
            />

            <SettingRow
              label="Caterer payout"
              value="90%"
              note="After the holding period, verified caterers receive 90% of the completed order value."
            />

            <SettingRow
              label="Dispute handling"
              value="Manual admin review"
              note="If a dispute is raised, payout remains blocked until admin resolves it."
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#173f35]">
            Caterer verification
          </h2>

          <div className="mt-6 space-y-4">
            <SettingRow
              label="License number required"
              value="Enabled"
              note="Caterers must provide a license or registration number during signup."
            />

            <SettingRow
              label="Marketplace visibility"
              value="Verified only"
              note="Caterers should only appear publicly after admin approval."
            />

            <SettingRow
              label="Payout eligibility"
              value="Verified only"
              note="Unverified caterers cannot receive payouts."
            />

            <SettingRow
              label="Suspension mode"
              value="Available"
              note="Admin can suspend caterers and block payouts if needed."
            />
          </div>
        </section>
      </div>

      <div className="rounded-[2rem] border border-[#eadfce] bg-[#173f35] p-8 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d6b25e]">
          Current payout logic
        </p>

        <h2 className="mt-3 text-3xl font-semibold">
          Booking.com-style protected payout flow
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-5">
          <FlowStep number="1" title="Customer pays" />
          <FlowStep number="2" title="Speisely holds funds" />
          <FlowStep number="3" title="Event completed" />
          <FlowStep number="4" title="7-day issue window" />
          <FlowStep number="5" title="90% payout / 10% commission" />
        </div>
      </div>
    </div>
  );
}

function SettingRow({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[#eadfce] bg-[#faf6ee] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-[#173f35]">{label}</p>
          <p className="mt-1 text-sm leading-6 text-[#5c6f68]">{note}</p>
        </div>

        <span className="shrink-0 rounded-full border border-[#d6b25e]/40 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#8a6d35]">
          {value}
        </span>
      </div>
    </div>
  );
}

function FlowStep({ number, title }: { number: string; title: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4">
      <p className="text-sm font-bold text-[#d6b25e]">{number}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-white">{title}</p>
    </div>
  );
}
