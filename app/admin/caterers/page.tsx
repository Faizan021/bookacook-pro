import { revalidatePath } from "next/cache";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type CatererRow = {
  id: string;
  business_name: string | null;
  phone: string | null;
  business_address: string | null;
  license_number: string | null;
  city: string | null;
  verification_status: string | null;
  payout_enabled: boolean | null;
  is_active: boolean | null;
  created_at: string | null;
};

async function updateCatererVerification(formData: FormData) {
  "use server";

  try {
    const id = String(formData.get("id") || "");
    const status = String(formData.get("status") || "pending");

    if (!id) return;

    const supabase = await createClient();

    const updates =
      status === "approved"
        ? {
            verification_status: "approved",
            payout_enabled: true,
            is_active: true,
          }
        : status === "rejected"
          ? {
              verification_status: "rejected",
              payout_enabled: false,
              is_active: false,
            }
          : status === "suspended"
            ? {
                verification_status: "suspended",
                payout_enabled: false,
                is_active: false,
              }
            : {
                verification_status: "under_review",
                payout_enabled: false,
                is_active: false,
              };

    const { error } = await supabase
      .from("caterers")
      .update(updates)
      .eq("id", id);

   if (error) {
  console.error("CATERER VERIFY ERROR:", JSON.stringify(error, null, 2));
  return;
}

    revalidatePath("/admin/caterers");
    revalidatePath("/admin");
  } catch (err) {
    console.error("Caterer verification server action crashed:", err);
  }
}

function statusBadge(status?: string | null) {
  if (status === "approved") return "bg-green-100 text-green-700 border-green-200";
  if (status === "rejected" || status === "suspended") return "bg-red-100 text-red-700 border-red-200";
  if (status === "under_review") return "bg-blue-100 text-blue-700 border-blue-200";
  return "bg-orange-100 text-orange-700 border-orange-200";
}

function formatStatus(status?: string | null) {
  const map: Record<string, string> = {
    approved: "Approved",
    pending: "Pending",
    under_review: "Under review",
    rejected: "Rejected",
    suspended: "Suspended",
  };

  return map[status || "pending"] || "Pending";
}

export default async function AdminCaterersPage() {
  const supabase = await createClient();

  const { data: caterers, error } = await supabase
    .from("caterers")
    .select(
      `
      id,
      business_name,
      phone,
      business_address,
      license_number,
      city,
      verification_status,
      payout_enabled,
      is_active,
      created_at
    `
    )
    .order("created_at", { ascending: false })
    .returns<CatererRow[]>();

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        <h1 className="text-xl font-bold">Could not load caterers</h1>
        <p className="mt-2 text-sm">{error.message}</p>
      </div>
    );
  }

  const pendingCount = (caterers || []).filter(
    (c) =>
      !c.verification_status ||
      c.verification_status === "pending" ||
      c.verification_status === "under_review"
  ).length;

  return (
    <div className="space-y-8 text-[#16372f]">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
            Admin / Caterers
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#173f35]">
            Caterer verification
          </h1>

          <p className="mt-2 text-[#5c6f68]">
            Review new caterer registrations, check license details, and approve
            marketplace visibility.
          </p>
        </div>

        <div className="rounded-2xl border border-[#eadfce] bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6d35]">
            Pending review
          </p>
          <p className="mt-1 text-3xl font-semibold text-[#173f35]">
            {pendingCount}
          </p>
        </div>
      </div>

      {!caterers || caterers.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-[#d8ccb9] bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-[#173f35]">
            No caterers yet
          </h2>
          <p className="mt-2 text-sm text-[#5c6f68]">
            New caterer signup requests will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {caterers.map((caterer) => (
            <div
              key={caterer.id}
              className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-[#173f35]">
                    {caterer.business_name || "Unnamed caterer"}
                  </h2>

                  <p className="mt-1 text-sm text-[#5c6f68]">
                    {caterer.city || "City not set"}
                  </p>
                </div>

                <span
                  className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${statusBadge(
                    caterer.verification_status
                  )}`}
                >
                  {formatStatus(caterer.verification_status)}
                </span>
              </div>

              <div className="mt-6 grid gap-4 rounded-2xl border border-[#eadfce] bg-[#faf6ee] p-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                    Phone
                  </p>
                  <p className="mt-1 font-medium text-[#173f35]">
                    {caterer.phone || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                    License / Registration
                  </p>
                  <p className="mt-1 font-medium text-[#173f35]">
                    {caterer.license_number || "Missing"}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                    Business address
                  </p>
                  <p className="mt-1 font-medium text-[#173f35]">
                    {caterer.business_address || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                    Active
                  </p>
                  <p className="mt-1 font-medium text-[#173f35]">
                    {caterer.is_active ? "Yes" : "No"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                    Payout enabled
                  </p>
                  <p className="mt-1 font-medium text-[#173f35]">
                    {caterer.payout_enabled ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <form action={updateCatererVerification}>
                  <input type="hidden" name="id" value={caterer.id} />
                  <input type="hidden" name="status" value="under_review" />
                  <button className="w-full rounded-full border border-[#d8ccb9] bg-white px-5 py-3 text-sm font-semibold text-[#173f35] transition hover:bg-[#f4ead7] sm:w-auto">
                    Mark under review
                  </button>
                </form>

                <form action={updateCatererVerification}>
                  <input type="hidden" name="id" value={caterer.id} />
                  <input type="hidden" name="status" value="approved" />
                  <button className="w-full rounded-full bg-[#173f35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2f27] sm:w-auto">
                    Verify
                  </button>
                </form>

                <form action={updateCatererVerification}>
                  <input type="hidden" name="id" value={caterer.id} />
                  <input type="hidden" name="status" value="rejected" />
                  <button className="w-full rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 sm:w-auto">
                    Reject
                  </button>
                </form>

                <Link
                  href={`/caterers/${caterer.id}`}
                  className="inline-flex items-center justify-center rounded-full border border-[#d8ccb9] bg-white px-5 py-3 text-sm font-semibold text-[#173f35] transition hover:bg-[#f4ead7]"
                >
                  View public profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
