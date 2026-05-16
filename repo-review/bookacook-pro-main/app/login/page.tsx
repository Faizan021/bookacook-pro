import LoginPageClient from "./LoginPageClient";

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

  return <LoginPageClient next={next} />;
}
