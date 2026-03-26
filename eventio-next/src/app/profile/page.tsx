import { ProfileView } from "@/features/profile/profile-view";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My Profile",
};

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  const userId = data.user.id;
  const currentUserFullName =
    (data.user.user_metadata?.full_name as string | undefined) ?? null;
  const currentUserEmail = data.user.email ?? null;

  const [{ data: createdEvents }, { data: joinedRows }] = await Promise.all([
    supabase
      .from("events")
      .select("id,title,description,owner_id,capacity,starts_at,event_attendees(user_id)")
      .eq("owner_id", userId),
    supabase.from("event_attendees").select("event_id").eq("user_id", userId),
  ]);

  const joinedEventIds = (joinedRows ?? []).map((row) => row.event_id);
  const { data: joinedEvents } = joinedEventIds.length
    ? await supabase
        .from("events")
        .select("id,title,description,owner_id,capacity,starts_at,event_attendees(user_id)")
        .in("id", joinedEventIds)
    : { data: [] as Array<{
        id: string;
        title: string;
        description: string | null;
        owner_id: string;
        capacity: number | null;
        starts_at: string;
        event_attendees: Array<{ user_id: string }>;
      }> };

  const mergedById = new Map<string, (typeof createdEvents extends Array<infer T> ? T : never)>();
  for (const event of createdEvents ?? []) mergedById.set(event.id, event);
  for (const event of joinedEvents ?? []) mergedById.set(event.id, event);
  const mergedEvents = Array.from(mergedById.values()).sort(
    (a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
  );

  const ownerIds = Array.from(new Set(mergedEvents.map((event) => event.owner_id)));
  const { data: ownerProfiles } = ownerIds.length
    ? await supabase.from("profiles").select("id,display_name").in("id", ownerIds)
    : { data: [] as Array<{ id: string; display_name: string }> };
  const ownerNameById = new Map((ownerProfiles ?? []).map((profile) => [profile.id, profile.display_name]));

  const eventsWithAuthor = mergedEvents.map((event) => ({
    ...event,
    authorName: ownerNameById.get(event.owner_id) ?? "Event author",
  }));

  return (
    <ProfileView
      currentUser={{
        id: userId,
        fullName: currentUserFullName,
        email: currentUserEmail,
      }}
      events={eventsWithAuthor}
    />
  );
}

