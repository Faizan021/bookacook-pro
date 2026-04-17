import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import { getCatererIdForUser } from "@/lib/dashboard/caterer-modules";
import { getPackageById } from "@/lib/packages/schema";
import { PackageForm } from "@/components/packages/package-form";

export const metadata: Metadata = {
  title: "Paket bearbeiten",
};

export default async function EditPackagePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

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
    redirect("/caterer-dashboard/packages");
  }

  return (
    <main className="min-h-full bg-background text-foreground">
      <div className="page-container section-shell">
        <div className="max-w-4xl">
          <div className="mb-8">
            <div className="eyebrow text-primary">Caterer Dashboard</div>
            <h1 className="section-title mt-3 text-3xl font-semibold sm:text-4xl">
              Paket bearbeiten
            </h1>
            <p className="body-muted mt-4 max-w-2xl text-base">
              Aktualisiere Beschreibung, Preise, Leistungen und Regeln deines
              Pakets, damit es im Speisely-Marktplatz klar und hochwertig
              präsentiert wird.
            </p>
          </div>

          <div className="premium-card p-6 lg:p-8">
            <PackageForm mode="edit" packageId={id} initialData={pkg} />
          </div>
        </div>
      </div>
    </main>
  );
}
