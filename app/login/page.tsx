import LoginPageClient from "./LoginPageClient";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type SearchParams = Promise<{
  next?: string;
}>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const next = resolvedSearchParams.next ?? "";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (next && next.startsWith("/") && !next.startsWith("//")) {
      redirect(next);
    } else if (profile?.role === "caterer") {
      redirect("/caterer");
    } else if (profile?.role === "restaurant") {
      redirect("/restaurant");
    } else if (profile?.role === "admin") {
      redirect("/admin");
    } else {
      redirect("/customer");
    }
  }

  return <LoginPageClient next={next} />;
}
