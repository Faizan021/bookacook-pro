import { redirect } from "next/navigation";
import { getEventRequestById } from "@/lib/dashboard/event-requests";
import RequestOverviewClient from "./RequestOverviewClient";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RequestOverviewPage({ params }: PageProps) {
  const { id } = await params;

  let request: any = null;

  try {
    request = await getEventRequestById(id);
  } catch (error) {
    console.error("Failed to load event request:", error);
    redirect("/request/new");
  }

  if (!request?.id) {
    redirect("/request/new");
  }

  return <RequestOverviewClient request={request} />;
}
