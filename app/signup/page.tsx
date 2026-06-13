import { redirect } from "next/navigation";

type SignupPageProps = {
  searchParams?: Promise<{
    role?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const role = params?.role;

  if (role === "caterer") {
    redirect("/signup/caterer");
  }

  if (role === "restaurant") {
    redirect("/signup/restaurant");
  }

  redirect("/signup/customer");
}
