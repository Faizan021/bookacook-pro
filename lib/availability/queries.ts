import { createClient } from "@/lib/supabase/server";

export type AvailabilityRecord = {
  date: string;
  is_available: boolean;
};

export async function getCatererAvailability(
  catererId: string
): Promise<AvailabilityRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("availability")
    .select("available_date, is_available")
    .eq("caterer_id", catererId);

  if (error || !data) return [];
  return (data as { available_date: string; is_available: boolean }[]).map(
    (r) => ({ date: r.available_date, is_available: r.is_available })
  );
}
