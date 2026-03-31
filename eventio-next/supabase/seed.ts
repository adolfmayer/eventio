import { faker } from "@faker-js/faker";
import { createClient } from "@supabase/supabase-js";

import type { Database, TablesInsert } from "../src/types/database";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.",
  );
}

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SEED_DOMAIN = "seed.eventio.test";
const USER_COUNT = 10;
const PASSWORD = "SeedUser#2026!";
const EVENT_TITLES = [
  "Networking Morning",
  "Tech Meetup",
  "Product Launch",
  "Founder Roundtable",
  "Design Crit Session",
  "AI Builders Night",
  "Startup Demo Day",
  "Community Breakfast",
  "Career Growth Workshop",
  "Growth Marketing Lab",
  "Frontend Performance Clinic",
  "Backend Architecture Forum",
  "Women in Tech Meetup",
  "Investor AMA",
  "Product Strategy Talk",
  "No-Code Showcase",
  "Cloud Native Meetup",
  "Data Science Jam",
  "DevOps Deep Dive",
  "Open Source Sprint",
];

type SeedAuthUser = {
  id: string;
  email: string;
  displayName: string;
};

function toIso(date: Date): string {
  return date.toISOString();
}

async function listAllSeedAuthUsers(): Promise<SeedAuthUser[]> {
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

async function clearPreviousSeedData(seedUserIds: string[]): Promise<void> {
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

async function createSeedUsers(count: number): Promise<SeedAuthUser[]> {
  const users: SeedAuthUser[] = [];

  for (let index = 1; index <= count; index += 1) {
    const displayName = faker.person.fullName();
    const email = `seed.user${String(index).padStart(2, "0")}@${SEED_DOMAIN}`;

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: displayName, is_seed: true },
    });

    if (error) throw error;
    if (!data.user) {
      throw new Error(`Failed to create user: ${email}`);
    }

    users.push({
      id: data.user.id,
      email,
      displayName,
    });
  }

  const profileRows: TablesInsert<"profiles">[] = users.map((user) => ({
    id: user.id,
    display_name: user.displayName,
  }));

  const { error: profilesUpsertError } = await supabase.from("profiles").upsert(profileRows);
  if (profilesUpsertError) throw profilesUpsertError;

  return users;
}

function randomEventTitle(index: number): string {
  const baseTitle = EVENT_TITLES[index % EVENT_TITLES.length];
  const city = faker.location.city();
  return `${baseTitle} - ${city}`;
}

function randomStartDate(isPast: boolean): Date {
  const now = new Date();

  if (isPast) {
    const from = new Date(now);
    from.setDate(from.getDate() - 120);
    const to = new Date(now);
    to.setDate(to.getDate() - 1);
    return faker.date.between({ from, to });
  }

  const from = new Date(now);
  from.setDate(from.getDate() + 1);
  const to = new Date(now);
  to.setDate(to.getDate() + 120);
  return faker.date.between({ from, to });
}

async function createSeedEvents(
  users: SeedAuthUser[],
): Promise<Array<{ id: string; owner_id: string; capacity: number | null }>> {
  const eventCount = faker.number.int({ min: 20, max: 30 });

  const eventRows: TablesInsert<"events">[] = Array.from({ length: eventCount }, (_, index) => {
    const owner = faker.helpers.arrayElement(users);
    const isPast = index < Math.floor(eventCount * 0.45);
    const startsAt = randomStartDate(isPast);
    const hasCapacity = faker.datatype.boolean(0.8);

    return {
      owner_id: owner.id,
      title: randomEventTitle(index),
      description: faker.lorem.sentences({ min: 1, max: 3 }),
      location: `${faker.location.city()}, ${faker.location.countryCode()}`,
      starts_at: toIso(startsAt),
      capacity: hasCapacity ? faker.number.int({ min: 10, max: 200 }) : null,
      // If your DB gains ends_at later, add:
      // ends_at: new Date(startsAt.getTime() + 2 * 60 * 60 * 1000).toISOString(),
    };
  });

  const { data, error } = await supabase
    .from("events")
    .insert(eventRows)
    .select("id,owner_id,capacity");

  if (error) throw error;
  return data ?? [];
}

async function createAttendees(
  events: Array<{ id: string; owner_id: string; capacity: number | null }>,
  users: SeedAuthUser[],
): Promise<number> {
  const attendeeRows: TablesInsert<"event_attendees">[] = [];

  for (const event of events) {
    const eligibleUsers = users.filter((user) => user.id !== event.owner_id);
    if (eligibleUsers.length === 0) continue;

    const maxByCapacity = event.capacity == null ? 8 : Math.max(0, event.capacity - 1);
    const maxAttendees = Math.min(maxByCapacity, eligibleUsers.length, 12);
    const attendeeCount = faker.number.int({ min: 0, max: maxAttendees });
    if (attendeeCount === 0) continue;

    const attendees = faker.helpers.arrayElements(eligibleUsers, attendeeCount);
    for (const attendee of attendees) {
      attendeeRows.push({
        event_id: event.id,
        user_id: attendee.id,
      });
    }
  }

  if (attendeeRows.length === 0) return 0;

  const { error } = await supabase
    .from("event_attendees")
    .upsert(attendeeRows, { onConflict: "event_id,user_id", ignoreDuplicates: true });
  if (error) throw error;

  return attendeeRows.length;
}

async function main() {
  console.log("Starting seed...");

  const existingSeedUsers = await listAllSeedAuthUsers();
  await clearPreviousSeedData(existingSeedUsers.map((user) => user.id));

  const users = await createSeedUsers(USER_COUNT);
  const events = await createSeedEvents(users);
  const attendeeLinks = await createAttendees(events, users);

  console.log("Seed complete.");
  console.log(
    JSON.stringify(
      {
        users: users.length,
        events: events.length,
        attendee_links: attendeeLinks,
        seed_user_domain: SEED_DOMAIN,
      },
      null,
      2,
    ),
  );
}

main().catch((error: unknown) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
