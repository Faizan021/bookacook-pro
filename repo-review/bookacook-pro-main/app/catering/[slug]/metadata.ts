import { notFound } from "next/navigation";
import { getStorefrontData } from "@/lib/storefront/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getStorefrontData(slug);

  if (!data) {
    return { title: "Caterer Not Found" };
  }

  const { caterer } = data;
  return {
    title: `${caterer.business_name} | Speisely`,
    description: `Bestes Catering von ${caterer.business_name} in ${caterer.city}.`,
    openGraph: {
      title: caterer.business_name,
      description: `Bestes Catering von ${caterer.business_name} in ${caterer.city}.`,
      images: [caterer.cover_image_url || caterer.logo_url],
    },
  };
}
