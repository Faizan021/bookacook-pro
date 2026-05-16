import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStorefrontBySlug } from "@/lib/storefront/queries";
import { StorefrontClient } from "./StorefrontClient";

type StorefrontPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: StorefrontPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getStorefrontBySlug(slug);

  if (!data) {
    return {
      title: "Restaurant nicht gefunden | Speisely",
    };
  }

  return {
    title: `${data.storefront.display_name} direkt bestellen | Speisely`,
    description:
      data.storefront.description ||
      `Bestellen Sie direkt bei ${data.storefront.display_name} über Speisely.`,
  };
}

export default async function StorefrontPage({ params }: StorefrontPageProps) {
  const { slug } = await params;
  const data = await getStorefrontBySlug(slug);

  if (!data) notFound();

  return <StorefrontClient data={data} />;
}
