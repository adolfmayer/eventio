import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

  const [{ data: event, error: eventError }, { count: attendeesCount }, { data: attendeeRow }] =
    await Promise.all([
      supabase
        .from("events")
        .select("id,title,description,location,starts_at,capacity,owner_id")
        .eq("id", eventId)
        .single(),
      supabase
        .from("event_attendees")
        .select("*", { count: "exact", head: true })
        .eq("event_id", eventId),
      supabase
        .from("event_attendees")
        .select("event_id")
        .eq("event_id", eventId)
        .eq("user_id", auth.user.id)
        .maybeSingle(),
    ]);

  if (eventError || !event) {
    redirect(`/dashboard?error=${encodeURIComponent(eventError?.message ?? "Event not found")}`);
  }

  const isOwner = event.owner_id === auth.user.id;
  const isJoined = Boolean(attendeeRow);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-4 inline-flex rounded-control border border-stroke bg-surface p-1 text-xs font-semibold sm:text-sm">
          <span className="rounded-control bg-brand px-3 py-2 text-white">
            03-1-1-Detail
          </span>
          <Link
            href="/dashboard-detail-joined"
            className="rounded-control px-3 py-2 text-muted hover:bg-surfaceAlt"
          >
            03-1-2-Detail-Joined
          </Link>
          <Link
            href="/dashboard-detail-edit"
            className="rounded-control px-3 py-2 text-muted hover:bg-surfaceAlt"
          >
            03-1-3-Detail-Edit
          </Link>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="p-5 sm:p-7">
          <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-text">
            Event detail
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
            {event.title}
          </h1>
          <p className="mt-3 text-sm text-muted sm:text-base">
            {event.description ?? "—"}
          </p>
          {params.error ? (
            <p className="mt-4 text-sm text-dangerStrong">{params.error}</p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-2">
            {isJoined ? (
              <form action={leaveEventAction}>
                <input type="hidden" name="eventId" value={event.id} />
                <Button size="sm" variant="secondary" type="submit">
                  Leave Event
                </Button>
              </form>
            ) : (
              <form action={joinEventAction}>
                <input type="hidden" name="eventId" value={event.id} />
                <Button size="sm" type="submit">
                  Join Event
                </Button>
              </form>
            )}

            {isOwner ? (
              <Link
                href={`/dashboard-detail-edit?id=${encodeURIComponent(event.id)}`}
                className="inline-flex h-9 items-center justify-center rounded-control border border-stroke bg-surface px-3 text-sm font-semibold text-text shadow-sm hover:bg-surfaceAlt"
              >
                Edit Event
              </Link>
            ) : null}

            <Link
              href="/dashboard"
              className="inline-flex h-9 items-center justify-center rounded-control border border-stroke bg-surface px-3 text-sm font-semibold text-text shadow-sm hover:bg-surfaceAlt"
            >
              Back to Dashboard
            </Link>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <div className="rounded-card border border-stroke bg-surfaceAlt p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">
                Agenda
              </p>
              <p className="mt-2 text-sm text-text">
                Keynotes, case studies, networking dinner.
              </p>
            </div>
            <div className="rounded-card border border-stroke bg-surfaceAlt p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">
                Capacity
              </p>
              <p className="mt-2 text-sm text-text">
                {attendeesCount ?? 0}
                {event.capacity ? ` / ${event.capacity}` : ""} spots reserved.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-semibold text-text">Event facts</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Date: {new Date(event.starts_at).toLocaleDateString()}</li>
            <li>Time: {new Date(event.starts_at).toLocaleTimeString()}</li>
            <li>Location: {event.location ?? "—"}</li>
            <li>Attendees: {attendeesCount ?? 0}</li>
          </ul>
        </Card>
      </div>
    </main>
  );
}

