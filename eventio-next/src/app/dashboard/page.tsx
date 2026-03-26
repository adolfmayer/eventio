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
  const currentUserFullName =
    (auth.user.user_metadata?.full_name as string | undefined) ?? null;
  const currentUserEmail = auth.user.email ?? null;

  const { data: events, error } = await supabase
    .from("events")
    .select("id,title,description,owner_id,capacity,starts_at,event_attendees(user_id)")
    .order("starts_at", { ascending: true });

  const ownerIds = Array.from(new Set((events ?? []).map((event) => event.owner_id)));
  const { data: ownerProfiles } = ownerIds.length
    ? await supabase
        .from("profiles")
        .select("id,display_name")
        .in("id", ownerIds)
    : { data: [] as Array<{ id: string; display_name: string }> };

  const ownerNameById = new Map(
    (ownerProfiles ?? []).map((profile) => [profile.id, profile.display_name]),
  );

  const eventsWithAuthor = (events ?? []).map((event) => {
    return {
      ...event,
      authorName: ownerNameById.get(event.owner_id) ?? "Event author",
    };
  });

  return (
    <DashboardView
      currentUser={{
        id: auth.user.id,
        email: currentUserEmail,
        fullName: currentUserFullName,
      }}
      events={eventsWithAuthor}
      errorMessage={error?.message ?? null}
    />
  );
}

