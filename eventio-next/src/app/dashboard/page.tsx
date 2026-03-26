import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { DashboardView } from "@/features/events/dashboard-view";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { data: events, error } = await supabase
    .from("events")
    .select("id,title,description,owner_id,capacity,starts_at,event_attendees(user_id)")
    .order("starts_at", { ascending: true });

  return (
    <DashboardView
      currentUser={{
        id: auth.user.id,
        email: auth.user.email ?? null,
        fullName:
          (auth.user.user_metadata?.full_name as string | undefined) ?? null,
      }}
      events={events ?? []}
      errorMessage={error?.message ?? null}
    />
  );
}

