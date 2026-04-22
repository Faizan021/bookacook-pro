import { notFound } from "next/navigation";
import { getCatererById } from "@/lib/caterers/data";

type CatererPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CatererPage({ params }: CatererPageProps) {
  const { id } = await params;

  const caterer = await getCatererById(id);

  if (!caterer) {
    notFound();
  }

  return (
    <main>
      <h1>{caterer.business_name}</h1>
    </main>
  );
}
