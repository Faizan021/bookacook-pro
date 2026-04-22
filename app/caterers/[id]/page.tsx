import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
  business_description: string | null;
  service_area: string | null;
  phone: string | null;
  website_url: string | null;
};

type PackageRow = {
  id: string;
  title: string | null;
  description: string | null;
  category: string | null;
  price_amount: number | null;
  min_guests: number | null;
  max_guests: number | null;
  dietary_options: string[] | null;
  event_types: string[] | null;
  is_published: boolean | null;
  is_active: boolean | null;
  status: string | null;
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

  const title = data?.business_name
    ? `${data.business_name} | Speisely`
    : "Caterer | Speisely";

  const description = data?.business_name
    ? `${data.business_name}${data.city ? ` in ${data.city}` : ""} on Speisely.`
    : "Premium caterer profile on Speisely.";

  return {
    title,
    description,
  };
}

function formatPrice(value?: number | null) {
  if (value == null) return "Price on request";
  return `€${value.toLocaleString("de-DE")}`;
}

function formatGuestRange(min?: number | null, max?: number | null) {
  if (min && max) return `${min}–${max} guests`;
  if (min) return `From ${min} guests`;
  if (max) return `Up to ${max} guests`;
  return "Flexible guest count";
}

function verificationLabel(status?: string | null) {
  if (!status) return null;

  const map: Record<string, string> = {
    verified: "Verified",
    pending: "Pending",
    under_review: "Under review",
    rejected: "Rejected",
    suspended: "Suspended",
  };

  return map[status] ?? status;
}

function verificationStyle(status?: string | null) {
  switch (status) {
    case "verified":
      return "border-green-400/20 bg-green-400/10 text-green-300";
    case "pending":
    case "under_review":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";
    case "rejected":
    case "suspended":
      return "border-red-400/20 bg-red-400/10 text-red-300";
    default:
      return "border-white/10 bg-white/[0.04] text-[#eadfca]";
  }
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
        {eyebrow}
      </div>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#96a592]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-[#ddd5c6]">
      {children}
    </span>
  );
}

function PackageCard({ pkg }: { pkg: PackageRow }) {
  return (
    <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
            {pkg.category || "Package"}
          </div>
          <h3 className="mt-2 text-xl font-semibold text-white">
            {pkg.title || "Untitled package"}
          </h3>
          <p className="mt-3 text-sm leading-7 text-[#96a592]">
            {pkg.description || "Package details available on request."}
          </p>
        </div>

        <div className="rounded-[1.2rem] border border-[#c49840]/15 bg-[#c49840]/8 px-4 py-3 text-left md:min-w-[160px] md:text-right">
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#8ea18b]">
            From
          </div>
          <div className="mt-1 text-xl font-semibold text-white">
            {formatPrice(pkg.price_amount)}
          </div>
          <div className="mt-1 text-xs text-[#c49840]">per package / starting point</div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Chip>{formatGuestRange(pkg.min_guests, pkg.max_guests)}</Chip>
        {(pkg.event_types || []).slice(0, 3).map((item) => (
          <Chip key={item}>{item}</Chip>
        ))}
        {(pkg.dietary_options || []).slice(0, 3).map((item) => (
          <Chip key={item}>{item}</Chip>
        ))}
      </div>
    </div>
  );
}

export default async function CatererPublicPage({ params }: CatererPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: caterer, error: catererError }, { data: packages, error: packagesError }] =
    await Promise.all([
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
          business_description,
          service_area,
          phone,
          website_url
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
          title,
          description,
          category,
          price_amount,
          min_guests,
          max_guests,
          dietary_options,
          event_types,
          is_published,
          is_active,
          status
        `
        )
        .eq("caterer_id", id)
        .eq("is_published", true)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .returns<PackageRow[]>(),
    ]);

  if (catererError || !caterer) {
    notFound();
  }

  if (packagesError) {
    console.error("Failed to load packages:", packagesError.message);
  }

  const publishedPackages =
    (packages || []).filter((pkg) => (pkg.status || "").toLowerCase() !== "draft") ?? [];

  const pageTitle = caterer.business_name || "Caterer";
  const initials = pageTitle.charAt(0).toUpperCase() || "C";
  const badgeLabel = verificationLabel(caterer.verification_status);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#07110c] text-[#f6f1e8]">
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 opacity-55"
          style={{
            background:
              "radial-gradient(circle at top center, rgba(196,152,64,0.14) 0%, transparent 28%), radial-gradient(circle at 15% 85%, rgba(72,101,82,0.16) 0%, transparent 24%), radial-gradient(circle at 85% 30%, rgba(40,60,48,0.14) 0%, transparent 18%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_22%,transparent_72%,rgba(255,255,255,0.02))]" />
      </div>

      <section className="relative z-10 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-12 md:px-8 md:pb-16 md:pt-16">
          <div className="mb-8">
            <Link
              href="/caterers"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-[#d8d1c2] transition hover:border-[#c49840]/30 hover:text-[#c49840]"
            >
              ← Back to caterers
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/20 bg-[#c49840]/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
                Premium catering profile
              </div>

              <div className="mt-8 flex items-start gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] border border-[#c49840]/15 bg-[#c49840]/10 text-3xl font-semibold text-[#c49840]">
                  {initials}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-4xl font-medium leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                      {pageTitle}
                    </h1>

                    {badgeLabel ? (
                      <span
                        className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${verificationStyle(
                          caterer.verification_status
                        )}`}
                      >
                        {badgeLabel}
                      </span>
                    ) : null}

                    {caterer.is_featured ? (
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#eadfca]">
                        Featured
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#a4b29f]">
                    {caterer.city ? <span>{caterer.city}</span> : null}
                    {caterer.average_rating ? (
                      <span>★ {Number(caterer.average_rating).toFixed(1)} rating</span>
                    ) : null}
                    {caterer.service_area ? <span>Service area: {caterer.service_area}</span> : null}
                  </div>

                  <p className="mt-6 max-w-3xl text-lg leading-8 text-[#a4b29f]">
                    {caterer.business_description ||
                      "Premium catering partner on Speisely with curated packages and structured event service."}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {(caterer.cuisine_types || []).slice(0, 6).map((item) => (
                      <Chip key={item}>{item}</Chip>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:justify-self-end">
              <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c49840]">
                  Quick actions
                </div>

                <div className="mt-5 flex flex-col gap-3">
                  <Link
                    href={`/request/new?caterer=${encodeURIComponent(caterer.id)}`}
                    className="inline-flex items-center justify-center rounded-[1rem] bg-[#c49840] px-5 py-3.5 text-sm font-semibold text-black transition hover:scale-[1.02]"
                  >
                    Request this caterer
                  </Link>

                  <Link
                    href="/caterers"
                    className="inline-flex items-center justify-center rounded-[1rem] border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm font-semibold text-white transition hover:border-[#c49840]/30 hover:text-[#c49840]"
                  >
                    Browse more caterers
                  </Link>

                  {caterer.website_url ? (
                    <a
                      href={caterer.website_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-[1rem] border border-white/10 bg-black/10 px-5 py-3.5 text-sm font-medium text-[#eadfca] transition hover:border-white/15 hover:bg-white/[0.03]"
                    >
                      Visit website
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10 md:px-8">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <SectionTitle
              eyebrow="Packages"
              title="Available catering packages"
              description="Explore the caterer’s currently published packages and service options."
            />

            {publishedPackages.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] p-10 text-center text-sm leading-7 text-[#92a18f]">
                No public packages available yet.
              </div>
            ) : (
              <div className="space-y-5">
                {publishedPackages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-6 xl:pt-[3.2rem]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
              <SectionTitle
                eyebrow="Overview"
                title="At a glance"
                description="A quick summary of this caterer’s positioning and public profile."
              />

              <div className="mt-6 space-y-5">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
                    Business name
                  </div>
                  <div className="mt-1 text-sm font-medium text-white">{pageTitle}</div>
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
                    City
                  </div>
                  <div className="mt-1 text-sm font-medium text-white">
                    {caterer.city || "Not specified"}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
                    Verification
                  </div>
                  <div className="mt-1 text-sm font-medium text-white">
                    {badgeLabel || "Not specified"}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
                    Service area
                  </div>
                  <div className="mt-1 text-sm font-medium text-white">
                    {caterer.service_area || "On request"}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[#8ea18b]">
                    Phone
                  </div>
                  <div className="mt-1 text-sm font-medium text-white">
                    {caterer.phone || "Available after inquiry"}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#c49840]/15 bg-[#c49840]/8 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.16)]">
              <p className="text-sm leading-8 text-[#e7dcc7]">
                Speisely profiles are designed to help customers compare caterers faster,
                understand package fit, and move into a more structured event request flow.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
