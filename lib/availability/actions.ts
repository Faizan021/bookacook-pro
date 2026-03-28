"use server";

import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import { getCatererIdForUser } from "@/lib/dashboard/caterer-modules";

export async function upsertAvailability(
  availableDate: string,
  isAvailable: boolean,
  note?: string
): Promise<{ error?: string }> {
  const { user } = await getUserProfile();
  if (!user) return { error: "error.notLoggedIn" };

  const caterer = await getCatererIdForUser(user.id);
  if (!caterer) return { error: "error.catererNotFound" };

  const supabase = await createClient();
  const { error } = await supabase.from("availability").upsert(
    {
      caterer_id: caterer.id,
      available_date: availableDate,
      is_available: isAvailable,
      note: note ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "caterer_id,available_date" }
  );

  if (error) return { error: error.message };
  return {};
}
