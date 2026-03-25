import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard Detail Joined",
};

export default async function DashboardDetailJoinedPage({
  searchParams,
}: {
  searchParams?: Promise<{ id?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const id = params.id;
  redirect(id ? `/dashboard-detail?id=${encodeURIComponent(id)}` : "/dashboard-detail");
}

