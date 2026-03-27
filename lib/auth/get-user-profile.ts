import { createClient } from "@/lib/supabase/server";

export async function getUserProfile() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { user: null, profile: null };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return { user, profile: null };
    }

    return { user, profile };
  } catch {
    // Supabase not configured or network error — treat as unauthenticated
    return { user: null, profile: null };
  }
}
