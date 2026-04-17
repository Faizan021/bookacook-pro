"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEventRequestDraft } from "@/lib/dashboard/event-requests";

type Props = {
  initialQuery?: string;
  initialOccasion?: string;
  initialCaterer?: string;
};

export function RequestIntakePage({
  initialQuery = "",
  initialOccasion = "",
  initialCaterer = "",
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [occasion, setOccasion] = useState(initialOccasion);
  const [caterer, setCaterer] = useState(initialCaterer);
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    setLoading(true);

    const draft = await createEventRequestDraft({
      ai_query: query,
      event_type: occasion || null,
      preferred_caterer_id: caterer || null,
    });

    router.push(`/request/${draft.id}`);
  }

  return (
    <main>{/* premium intake UI here */}</main>
  );
}
