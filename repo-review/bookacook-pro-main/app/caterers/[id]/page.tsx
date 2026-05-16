import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SpeiselyHeader } from "@/components/layout/SpeiselyHeader";

type CatererPageProps = {
  params: Promise<{ id: string }>;
};

type CatererRow = {
  id: string;
  business_name: string | null;
  city: string | null;
  cover_image_url: string | null;
  logo_url: string | null;
  cuisine_types: string[] | null;
  average_rating: number | null;
  verification_status: string | null;
  is_featured: boolean | null;
  phone: string | null;
  is_active: boolean | null;
};

type PackageRow = {
  id: string;
  caterer_id: string;
  title: string | null;
  description: string | null;
  summary: string | null;
  category: string | null;
  status: string | null;
  price_amount: number | null;
  min_guests: number | null;
  max_guests: number | null;
  cuisine_type: string | null;
  event_types: string[] | null;
  dietary_options: string[] | null;
  service_area: string | null;
  tags: string[] | null;
  is_published: boolean | null;
};

export async function generateMetadata({
  params,
}: CatererPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("caterers")
    .select("business_name, city")
    .eq("id", id)
    .maybeSingle();

  return {
    title: data?.business_name
      ? `${data.business_name} | Speisely`
      : "Caterer | Speisely",
    description: data?.business_name
      ? `${data.business_name}${data.city ? ` in ${data.city}` : ""} auf Speisely.`
      : "Premium Caterer-Profil auf Speisely.",
  };
}

function formatPrice(value?: number | null) {
  if (value == null) return "Preis auf Anfrage";
  return `ab €${value.toLocaleString("de-DE")}`;
}

function formatGuestRange(min?: number | null, max?: number | null) {
  if (min && max) return `${min}–${max} Gäste`;
  if (min) return `Ab ${min} Gäste`;
  if (max) return `Bis ${max} Gäste`;
  return "Flexible Gästezahl";
}

function verificationLabel(status?: string | null) {
  const map: Record<string, string> = {
    verified: "Verifiziert",
    pending: "In Prüfung",
    under_review: "In Prüfung",
    rejected: "Abgelehnt",
    suspended: "Pausiert",
  };

  return status ? map[status] ?? status : "Noch nicht verifiziert";
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[#eadfce] bg-[#faf6ee] px-3 py-1.5 text-xs font-semibold text-[#173f35]">
      {children}
    </span>
  );
}

function PackageCard({ pkg }: { pkg: PackageRow }) {
  const text =
    pkg.description || pkg.summary || "Paketdetails sind auf Anfrage verfügbar.";

  return (
    <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b28a3c]">
            {pkg.category || "Paket"}
          </p>

          <h3 className="mt-2 text-2xl font-semibold text-[#173f35]">
            {pkg.title || "Catering-Paket"}
          </h3>

          <p className="mt-3 text-sm leading-7 text-[#5c6f68]">{text}</p>
        </div>

        <div className="rounded-2xl border border-[#eadfce] bg-[#faf6ee] px-5 py-4 md:min-w-[160px] md:text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6d35]">
            Preis
          </p>
          <p className="mt-1 text-xl font-semibold text-[#173f35]">
            {formatPrice(pkg.price_amount)}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Chip>{formatGuestRange(pkg.min_guests, pkg.max_guests)}</Chip>
        {pkg.cuisine_type ? <Chip>{pkg.cuisine_type}</Chip> : null}
        {(pkg.event_types || []).slice(0, 3).map((item) => (
          <Chip key={item}>{item}</Chip>
        ))}
        {(pkg.dietary_options || []).slice(0, 3).map((item) => (
          <Chip key={item}>{item}</Chip>
        ))}
        {(pkg.tags || []).slice(0, 3).map((item) => (
          <Chip key={item}>{item}</Chip>
        ))}
      </div>

      {pkg.service_area ? (
        <p className="mt-4 text-sm text-[#5c6f68]">
          Servicegebiet: {pkg.service_area}
        </p>
      ) : null}
    </div>
  );
}

export default async function CatererPublicPage({ params }: CatererPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: caterer, error: catererError },
    { data: packages, error: packagesError },
  ] = await Promise.all([
    supabase
      .from("caterers")
      .select(
        `
        id,
        business_name,
        city,
        cover_image_url,
        logo_url,
        cuisine_types,
        average_rating,
        verification_status,
        is_featured,
        phone,
        is_active
      `
      )
      .eq("id", id)
      .eq("is_active", true)
      .maybeSingle<CatererRow>(),
    supabase
      .from("packages")
      .select(
        `
        id,
        caterer_id,
        title,
        description,
        summary,
        category,
        status,
        price_amount,
        min_guests,
        max_guests,
        cuisine_type,
        event_types,
        dietary_options,
        service_area,
        tags,
        is_published
      `
      )
      .eq("caterer_id", id)
      .eq("is_published", true)
      .returns<PackageRow[]>(),
  ]);

  if (catererError || !caterer) {
    notFound();
  }

  if (packagesError) {
    console.error("Failed to load packages:", packagesError.message);
  }

  const publishedPackages = (packages || []).filter(
    (pkg) => (pkg.status || "").toLowerCase() !== "draft"
  );

  const pageTitle = caterer.business_name || "Caterer";
  const initials = pageTitle.charAt(0).toUpperCase() || "C";

  return (
    <main className="min-h-screen bg-[#faf6ee] text-[#16372f]">
      <SpeiselyHeader />

      <section className="mx-auto max-w-7xl px-6 pt-24 pb-14 lg:pt-28 lg:pb-20">
        <Link
          href="/caterers"
          className="inline-flex rounded-full border border-[#d8ccb9] bg-white px-4 py-2 text-sm font-semibold text-[#49645c] shadow-sm transition hover:bg-[#f4ead7]"
        >
          ← Zurück zu Caterern
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <div className="inline-flex rounded-full border border-[#eadfce] bg-white px-4 py-2 text-sm font-semibold text-[#8a6d35] shadow-sm">
              Premium Caterer-Profil
            </div>

            <div className="mt-8 flex items-start gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] bg-[#173f35] text-3xl font-semibold text-white">
                {initials}
              </div>

              <div>
                <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
                  {pageTitle}
                </h1>

                <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#5c6f68]">
                  {caterer.city ? <span>{caterer.city}</span> : null}
                  {caterer.average_rating ? (
                    <span>★ {Number(caterer.average_rating).toFixed(1)}</span>
                  ) : null}
                  <span>{verificationLabel(caterer.verification_status)}</span>
                </div>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5c6f68]">
                  Premium Catering-Partner auf Speisely mit kuratierten Paketen,
                  klaren Leistungen und strukturierter Anfrage.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {(caterer.cuisine_types || []).slice(0, 6).map((item) => (
                    <Chip key={item}>{item}</Chip>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28a3c]">
              Schnellaktionen
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <Link
                href={`/request/new?caterer=${encodeURIComponent(caterer.id)}`}
                className="inline-flex items-center justify-center rounded-full bg-[#173f35] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0f2f27]"
              >
                Diesen Caterer anfragen
              </Link>

              <Link
                href="/caterers"
                className="inline-flex items-center justify-center rounded-full border border-[#d8ccb9] bg-white px-5 py-3.5 text-sm font-semibold text-[#173f35] transition hover:bg-[#f4ead7]"
              >
                Weitere Caterer ansehen
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-24 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28a3c]">
            Pakete
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Verfügbare Catering-Pakete
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5c6f68]">
            Vergleichen Sie veröffentlichte Pakete, Gästezahl, Küchenrichtung
            und Servicegebiet.
          </p>

          <div className="mt-8 space-y-5">
            {publishedPackages.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-[#d8ccb9] bg-white p-10 text-center text-sm text-[#5c6f68]">
                Noch keine öffentlichen Pakete verfügbar.
              </div>
            ) : (
              publishedPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28a3c]">
              Überblick
            </p>

            <h2 className="mt-3 text-2xl font-semibold">Auf einen Blick</h2>

            <div className="mt-6 space-y-5 text-sm">
              <div>
                <p className="font-semibold text-[#8a6d35]">Name</p>
                <p className="mt-1">{pageTitle}</p>
              </div>

              <div>
                <p className="font-semibold text-[#8a6d35]">Stadt</p>
                <p className="mt-1">{caterer.city || "Nicht angegeben"}</p>
              </div>

              <div>
                <p className="font-semibold text-[#8a6d35]">Verifizierung</p>
                <p className="mt-1">
                  {verificationLabel(caterer.verification_status)}
                </p>
              </div>

              <div>
                <p className="font-semibold text-[#8a6d35]">Telefon</p>
                <p className="mt-1">
                  {caterer.phone || "Nach Anfrage verfügbar"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#eadfce] bg-[#fffaf1] p-6 shadow-sm">
            <p className="text-sm leading-7 text-[#5c6f68]">
              Speisely-Profile helfen Kunden, Caterer schneller zu vergleichen,
              Paket-Fit zu verstehen und direkt in eine strukturierte Anfrage zu
              wechseln.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
