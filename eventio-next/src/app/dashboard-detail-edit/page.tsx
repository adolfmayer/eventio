import Image from 'next/image';
import Link from 'next/link';

import { DashboardProfileMenu } from '@/components/shared/dashboard-profile-menu';
import {
  deleteEventAction,
  updateEventAction,
} from '@/features/events/actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Dashboard Detail Edit',
};

export default async function DashboardDetailEditPage({
  searchParams,
}: {
  searchParams?: Promise<{ id?: string; error?: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect('/login?redirectTo=/dashboard-detail-edit');

  const params = (await searchParams) ?? {};
  const eventId = params.id;
  if (!eventId) redirect('/dashboard');

  const [{ data: event, error }, { data: attendees }] = await Promise.all([
    supabase
      .from('events')
      .select('id,title,description,location,starts_at,capacity,owner_id')
      .eq('id', eventId)
      .single(),
    supabase.from('event_attendees').select('user_id').eq('event_id', eventId),
  ]);

  if (error || !event) redirect('/dashboard');
  if (event.owner_id !== auth.user.id)
    redirect(`/dashboard-detail?id=${encodeURIComponent(eventId)}`);

  const attendeeUserIds = (attendees ?? []).map((a) => a.user_id);
  const { data: attendeeProfiles } = attendeeUserIds.length
    ? await supabase
        .from('profiles')
        .select('id,display_name')
        .in('id', attendeeUserIds)
    : { data: [] as Array<{ id: string; display_name: string }> };
  const attendeeNameById = new Map(
    (attendeeProfiles ?? []).map((p) => [p.id, p.display_name])
  );
  const attendeePills = attendeeUserIds.map((id) => ({
    id,
    isCurrentUser: id === auth.user.id,
    label:
      id === auth.user.id ? 'You' : (attendeeNameById.get(id) ?? 'Attendee'),
  }));

  const startsAtDate = new Date(event.starts_at);
  const dateValue = startsAtDate.toISOString().slice(0, 10);
  const timeValue = startsAtDate.toISOString().slice(11, 16);
  const detailId = event.id.slice(0, 6).toUpperCase();
  const paramsError = params.error;

  return (
    <main className="min-h-screen bg-bg">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-6">
        <div className="mx-auto w-full xl:max-w-[1360px]">
          <header className="relative flex items-center justify-between pt-2">
            <Link href="/dashboard" aria-label="Eventio">
              <span className="text-[28px] font-semibold text-text">E.</span>
            </Link>

            <Link
              href={`/dashboard-detail?id=${encodeURIComponent(event.id)}`}
              className="absolute left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap text-[14px] leading-[48px] text-text md:text-[16px]"
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
                (auth.user.user_metadata?.full_name as string | undefined) ??
                null
              }
              email={auth.user.email ?? null}
            />
          </header>
        </div>
        <div className="mx-auto w-full xl:max-w-[1200px]">
          <div className="mt-10 flex items-center justify-between">
            <p className="text-[12px] uppercase tracking-[1px] text-muted">
              DETAIL EVENT: #{detailId}
            </p>
            <form action={deleteEventAction}>
              <input type="hidden" name="eventId" value={event.id} />
              <button
                type="submit"
                className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[1px] text-danger"
              >
                <Image
                  src="/eventio/dashboard/icons/icon-delete.svg"
                  alt=""
                  width={16}
                  height={16}
                  aria-hidden="true"
                />
                DELETE EVENT
              </button>
            </form>
          </div>

          <section className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,795px)_minmax(0,390px)] lg:gap-[17px]">
            <article className="rounded-[2px] bg-surface shadow-[0px_2px_3px_rgba(0,0,0,0.108696)] lg:min-h-[464px]">
              <form
                id="edit-event-form"
                action={updateEventAction}
                className="p-6 lg:p-8"
              >
                <input type="hidden" name="eventId" value={event.id} />
                {paramsError ? (
                  <p className="mb-4 text-[14px] leading-6 text-danger">
                    {paramsError}
                  </p>
                ) : null}
                <label className="block">
                  <span className="text-[14px] leading-6 text-muted">
                    Date
                  </span>
                  <input
                    name="date"
                    type="date"
                    defaultValue={dateValue}
                    className="mt-1 block h-8 w-full border-b border-stroke bg-transparent pb-2 text-[16px] leading-6 text-text outline-none"
                    required
                  />
                </label>

                <label className="mt-6 block">
                  <span className="text-[14px] leading-6 text-muted">
                    Time
                  </span>
                  <input
                    name="time"
                    type="time"
                    defaultValue={timeValue}
                    className="mt-1 block h-8 w-full border-b border-stroke bg-transparent pb-2 text-[16px] leading-6 text-text outline-none"
                    required
                  />
                </label>

                <label className="mt-6 block">
                  <span className="text-[14px] leading-6 text-muted">
                    Title
                  </span>
                  <input
                    name="title"
                    type="text"
                    defaultValue={event.title}
                    className="mt-1 block h-8 w-full border-b border-stroke bg-transparent pb-2 text-[16px] leading-6 text-text outline-none"
                    required
                    maxLength={120}
                  />
                </label>

                <label className="mt-6 block">
                  <span className="text-[14px] leading-6 text-muted">
                    Description
                  </span>
                  <input
                    name="description"
                    type="text"
                    defaultValue={event.description ?? ''}
                    className="mt-1 block h-8 w-full border-b border-stroke bg-transparent pb-2 text-[16px] leading-6 text-text outline-none"
                    maxLength={2000}
                  />
                </label>

                <label className="mt-6 block">
                  <span className="text-[14px] leading-6 text-muted">
                    Location
                  </span>
                  <input
                    name="location"
                    type="text"
                    defaultValue={event.location ?? ''}
                    className="mt-1 block h-8 w-full border-b border-stroke bg-transparent pb-2 text-[16px] leading-6 text-text outline-none"
                    maxLength={120}
                  />
                </label>

                <label className="mt-6 block">
                  <span className="text-[14px] leading-6 text-muted">
                    Capacity
                  </span>
                  <input
                    name="capacity"
                    type="number"
                    min={1}
                    defaultValue={event.capacity ?? ''}
                    className="mt-1 block h-8 w-full border-b border-stroke bg-transparent pb-2 text-[16px] leading-6 text-text outline-none"
                  />
                </label>
              </form>
            </article>

            <aside className="h-[216px] rounded-[2px] bg-surface shadow-[0px_2px_3px_rgba(0,0,0,0.108696)] lg:h-[296px]">
              <div className="p-6 lg:p-8">
                <h2 className="text-[22px] leading-8 text-text">Attendees</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {attendeePills.length ? (
                    attendeePills.map((attendee) => (
                      <span
                        key={attendee.id}
                        className={
                          attendee.isCurrentUser
                            ? 'rounded-full border-2 border-stroke px-4 text-[13px] leading-[28px] text-muted'
                            : 'rounded-full bg-surfaceAlt px-4 text-[13px] leading-8 text-muted'
                        }
                      >
                        {attendee.label}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full bg-surfaceAlt px-4 text-[13px] leading-8 text-muted">
                      No attendees yet
                    </span>
                  )}
                </div>
              </div>
            </aside>
          </section>
        </div>
      </div>

      <button
        type="submit"
        form="edit-event-form"
        className="fixed bottom-8 right-8 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#22D486] shadow-[0px_6px_9px_rgba(0,0,0,0.15)] hover:bg-[#1DBB76]"
        aria-label="Confirm event changes"
      >
        <Image
          src="/eventio/dashboard/icons/icon-confirm.svg"
          alt=""
          width={24}
          height={24}
          aria-hidden="true"
        />
      </button>
    </main>
  );
}
