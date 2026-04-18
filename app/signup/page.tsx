import { redirect } from "next/navigation";

export default function SignupPage({
  searchParams,
}: {
  searchParams?: {
    role?: string;
  };
}) {
  const role = searchParams?.role;

  if (role === "caterer") {
    redirect("/signup/caterer");
  }

  if (role === "customer") {
    redirect("/signup/customer");
  }

  redirect("/signup/customer");
}
