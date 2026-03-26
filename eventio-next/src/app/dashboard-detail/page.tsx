import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { DashboardProfileMenu } from "@/components/shared/dashboard-profile-menu";
import { joinEventAction, leaveEventAction } from "@/features/events/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard Detail",
};

export default async function DashboardDetailPage({
  searchParams,
}: {
  searchParams?: Promise<{ id?: string; error?: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login?redirectTo=/dashboard-detail");

  const params = (await searchParams) ?? {};
  const eventId = params.id;

  if (!eventId) {
    const { data: first } = await supabase
      .from("events")
      .select("id")
      .order("starts_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!first?.id) redirect("/dashboard");
    redirect(`/dashboard-detail?id=${encodeURIComponent(first.id)}`);
  }

  const [{ data: event, error: eventError }, { data: attendees, count: attendeesCount }] =
    await Promise.all([
      supabase
        .from("events")
        .select("id,title,description,location,starts_at,capacity,owner_id")
        .eq("id", eventId)
        .single(),
      supabase
        .from("event_attendees")
        .select("user_id", { count: "exact" })
        .eq("event_id", eventId),
    ]);

  if (eventError || !event) {
    redirect(`/dashboard?error=${encodeURIComponent(eventError?.message ?? "Event not found")}`);
  }

  const attendeeUserIds = (attendees ?? []).map((a) => a.user_id);
  const isOwner = event.owner_id === auth.user.id;
  const isJoined = attendeeUserIds.includes(auth.user.id);

  const [{ data: ownerProfile }, { data: attendeeProfiles }] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", event.owner_id)
      .maybeSingle(),
    attendeeUserIds.length
      ? supabase.from("profiles").select("id,display_name").in("id", attendeeUserIds)
      : Promise.resolve({ data: [] as Array<{ id: string; display_name: string }> }),
  ]);

  const attendeeNameById = new Map(
    (attendeeProfiles ?? []).map((p) => [p.id, p.display_name]),
  );
  const attendeePills = attendeeUserIds.map((id) => ({
    id,
    isCurrentUser: id === auth.user.id,
    label: id === auth.user.id ? "You" : attendeeNameById.get(id) ?? "Attendee",
  }));

  const authorName =
    ownerProfile?.display_name ??
    (auth.user.user_metadata?.full_name as string | undefined) ??
    "Event author";
  const capacityText =
    event.capacity == null
      ? `${attendeesCount ?? 0} attending`
      : `${attendeesCount ?? 0} of ${event.capacity}`;
  const detailId = event.id.slice(0, 6).toUpperCase();

  return (
    <main className="min-h-screen bg-[#F9F9FB]">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-6">
        <div className="mx-auto w-full xl:max-w-[1200px]">
          <header className="relative flex items-center justify-between pt-2">
            <Link href="/dashboard" aria-label="Eventio">
              <span className="text-[28px] font-semibold text-text">E.</span>
            </Link>

            <Link
              href="/dashboard"
              className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[16px] leading-[48px] text-text md:inline-flex"
            >
              <Image
                src="/eventio/dashboard/icons/icon-back.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden="true"
              />
              Back to events
            </Link>

            <DashboardProfileMenu
              fullName={
                (auth.user.user_metadata?.full_name as string | undefined) ?? null
              }
              email={auth.user.email ?? null}
            />
          </header>

          <p className="mt-10 text-[12px] uppercase tracking-[1px] text-[#A9AEB4]">
            DETAIL EVENT: #{detailId}
          </p>

          <section className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,795px)_minmax(0,390px)] lg:gap-[17px]">
            <article className="h-[296px] rounded-[2px] bg-white shadow-[0px_2px_3px_rgba(0,0,0,0.108696)]">
              <div className="flex h-full flex-col p-6 lg:p-8">
                <p className="text-[14px] leading-6 text-[#CACDD0]">
                  {new Date(event.starts_at).toLocaleString()}
                </p>
                <h1 className="mt-2 text-[22px] leading-[48px] text-text lg:text-[45px] lg:leading-[48px]">
                  {event.title}
                </h1>
                <p className="-mt-2 text-[14px] leading-6 text-[#7D7878]">{authorName}</p>
                <p className="mt-6 line-clamp-2 text-[16px] leading-6 text-[#949EA8]">
                  {event.description ?? "—"}
                </p>
                {params.error ? (
                  <p className="mt-2 text-[14px] leading-6 text-danger">{params.error}</p>
                ) : null}

                <div className="mt-auto flex items-center justify-between pt-8">
                  <div className="flex items-center gap-1.5">
                    <Image
                      src="/eventio/dashboard/icons/icon-user.svg"
                      alt=""
                      width={24}
                      height={24}
                      aria-hidden="true"
                    />
                    <p className="text-[14px] leading-6 text-[#949EA8]">{capacityText}</p>
                  </div>

                  {isOwner ? (
                    <Link href={`/dashboard-detail-edit?id=${encodeURIComponent(event.id)}`}>
                      <Button className="h-8 w-[100px] rounded-[4px] bg-[#D9DCE1] text-[14px] leading-4 font-normal uppercase tracking-[1px] text-[#A9AEB4] hover:bg-[#C4C9D1]">
                        Edit
                      </Button>
                    </Link>
                  ) : isJoined ? (
                    <form action={leaveEventAction}>
                      <input type="hidden" name="eventId" value={event.id} />
                      <Button className="h-8 w-[100px] rounded-[4px] bg-danger text-[14px] leading-4 font-normal uppercase tracking-[1px] text-white hover:bg-dangerStrong">
                        Leave
                      </Button>
                    </form>
                  ) : (
                    <form action={joinEventAction}>
                      <input type="hidden" name="eventId" value={event.id} />
                      <Button className="h-8 w-[100px] rounded-[4px] bg-brand text-[14px] leading-4 font-normal uppercase tracking-[1px] text-white hover:bg-brandStrong">
                        Join
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </article>

            <aside className="h-[216px] rounded-[2px] bg-white shadow-[0px_2px_3px_rgba(0,0,0,0.108696)] lg:h-[296px]">
              <div className="p-6 lg:p-8">
                <h2 className="text-[22px] leading-8 text-text">Attendees</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {attendeePills.length ? (
                    attendeePills.map((attendee) => (
                      <span
                        key={attendee.id}
                        className={
                          attendee.isCurrentUser
                            ? "rounded-full border-2 border-[#D9DCE1] px-4 text-[13px] leading-[28px] text-[#949EA8]"
                            : "rounded-full bg-[#D9DCE1] px-4 text-[13px] leading-8 text-[#949EA8]"
                        }
                      >
                        {attendee.label}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full bg-[#D9DCE1] px-4 text-[13px] leading-8 text-[#949EA8]">
                      No attendees yet
                    </span>
                  )}
                </div>
              </div>
            </aside>
          </section>
        </div>
      </div>

      <Link
        href="/create-new"
        className="fixed bottom-8 right-8 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#323C46] shadow-[0px_6px_9px_rgba(0,0,0,0.15)] hover:bg-[#565D5A]"
        aria-label="Create new event"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="text-white"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z"
            fill="currentColor"
          />
        </svg>
      </Link>
    </main>
  );
}

