import { createClient } from "@supabase/supabase-js";

import type { Database } from "../src/types/database";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.",
  );
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export const SEED_DOMAIN = "seed.eventio.test";

export type SeedAuthUser = {
  id: string;
  email: string;
  displayName: string;
};

export async function listAllSeedAuthUsers(): Promise<SeedAuthUser[]> {
  const users: SeedAuthUser[] = [];
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    const currentPageUsers = data.users ?? [];

    const seedUsers = currentPageUsers
      .filter((user) => (user.email ?? "").toLowerCase().endsWith(`@${SEED_DOMAIN}`))
      .map((user) => ({
        id: user.id,
        email: user.email ?? "",
        displayName: (user.user_metadata?.full_name as string | undefined) ?? "Seed User",
      }));

    users.push(...seedUsers);

    if (currentPageUsers.length < perPage) break;
    page += 1;
  }

  return users;
}

export async function clearPreviousSeedData(seedUserIds: string[]): Promise<void> {
  if (seedUserIds.length === 0) return;

  const { data: ownedEvents, error: ownedEventsError } = await supabase
    .from("events")
    .select("id")
    .in("owner_id", seedUserIds);

  if (ownedEventsError) throw ownedEventsError;

  const ownedEventIds = (ownedEvents ?? []).map((event) => event.id);

  if (ownedEventIds.length > 0) {
    const { error: attendeesByEventError } = await supabase
      .from("event_attendees")
      .delete()
      .in("event_id", ownedEventIds);
    if (attendeesByEventError) throw attendeesByEventError;
  }

  const { error: attendeesByUserError } = await supabase
    .from("event_attendees")
    .delete()
    .in("user_id", seedUserIds);
  if (attendeesByUserError) throw attendeesByUserError;

  const { error: eventsDeleteError } = await supabase
    .from("events")
    .delete()
    .in("owner_id", seedUserIds);
  if (eventsDeleteError) throw eventsDeleteError;

  const { error: profilesDeleteError } = await supabase
    .from("profiles")
    .delete()
    .in("id", seedUserIds);
  if (profilesDeleteError) throw profilesDeleteError;

  for (const seedUserId of seedUserIds) {
    const { error: userDeleteError } = await supabase.auth.admin.deleteUser(seedUserId);
    if (userDeleteError) throw userDeleteError;
  }
}
