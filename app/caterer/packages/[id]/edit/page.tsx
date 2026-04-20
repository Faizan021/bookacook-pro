import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import { getCatererIdForUser } from "@/lib/dashboard/caterer-modules";
import { getPackageById } from "@/lib/packages/schema";
import { PackageForm } from "@/components/packages/package-form";

export const metadata: Metadata = {
  title: "Paket bearbeiten",
};

type EditPackagePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPackagePage({
  params,
}: EditPackagePageProps) {
  const { id } = await params;

  const { user } = await getUserProfile();

  if (!user) {
    redirect("/login");
  }

  const [caterer, pkg] = await Promise.all([
    getCatererIdForUser(user.id),
    getPackageById(id),
  ]);

  if (!pkg) {
    notFound();
  }

  if (!caterer || caterer.id !== pkg.caterer_id) {
    redirect("/caterer/packages");
  }

  return (
    <main className="min-h-full bg-[#07110c] text-[#f6f1e8]">
      <div className="mx-auto w-full max-w-5xl px-6 py-8 md:px-8 md:py-10">
        <div className="max-w-4xl">
          <div className="mb-8">
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
              Caterer Dashboard
            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Paket bearbeiten
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-8 text-[#96a592]">
              Aktualisiere Beschreibung, Preise, Leistungen und Regeln deines
              Pakets, damit es im Speisely-Marktplatz klar, hochwertig und
              vertrauenswürdig präsentiert wird.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl lg:p-8">
            <PackageForm mode="edit" packageId={id} initialData={pkg} />
          </div>
        </div>
      </div>
    </main>
  );
}
