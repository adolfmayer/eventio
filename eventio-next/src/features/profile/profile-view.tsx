'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { DashboardProfileMenu } from '@/components/shared/dashboard-profile-menu';
import { Button } from '@/components/ui/button';
import { joinEventAction, leaveEventAction } from '@/features/events/actions';
import { cn } from '@/lib/cn';

type ViewMode = 'grid' | 'list';

type ProfileEvent = {
  id: string;
  title: string;
  description: string | null;
  owner_id: string;
  authorName: string;
  capacity: number | null;
  starts_at: string;
  event_attendees: Array<{ user_id: string }>;
};

type ProfileViewProps = {
  currentUser: {
    id: string;
    email: string | null;
    fullName: string | null;
  };
  events: ProfileEvent[];
};

function GridIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 11H9V5H4V11ZM4 18H9V12H4V18ZM10 18H15V12H10V18ZM16 18H21V12H16V18ZM10 11H15V5H10V11ZM16 5V11H21V5H16Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 18H21V12H4V18ZM4 5V11H21V5H4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function getInitials(nameOrEmail: string | null) {
  const base = (nameOrEmail ?? '').trim();
  if (!base) return 'U';
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return base.slice(0, 2).toUpperCase();
}

function formatCardDate(startsAtIso: string) {
  const d = new Date(startsAtIso);
  return d.toLocaleString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function SmallActionButton({
  kind,
  children,
}: {
  kind: 'join' | 'leave' | 'edit';
  children: React.ReactNode;
}) {
  const base =
    'h-8 w-[100px] rounded-[4px] text-[14px] leading-[14px] uppercase tracking-[1px] font-normal';
  const byKind: Record<typeof kind, string> = {
    join: 'bg-brand text-white hover:bg-brandStrong',
    leave: 'bg-danger text-white hover:bg-dangerStrong',
    edit: 'bg-[#D9DCE1] text-[#A9AEB4] hover:bg-[#C4C9D1]',
  };

  return (
    <Button className={cn(base, byKind[kind])} type="submit">
      {children}
    </Button>
  );
}

function EventCard({
  event,
  viewMode,
  currentUserId,
}: {
  event: ProfileEvent;
  viewMode: ViewMode;
  currentUserId: string;
}) {
  const attendeeCount = event.event_attendees.length;
  const isOwner = event.owner_id === currentUserId;
  const isAttendee = event.event_attendees.some(
    (a) => a.user_id === currentUserId
  );
  const action: 'edit' | 'leave' | 'join' = isOwner
    ? 'edit'
    : isAttendee
      ? 'leave'
      : 'join';
  const capacityText =
    event.capacity == null
      ? `${attendeeCount} attending`
      : `${attendeeCount} of ${event.capacity}`;
  const description = event.description ?? '';

  if (viewMode === 'list') {
    return (
      <div className="relative w-full rounded-[2px] bg-white shadow-[0px_2px_3px_rgba(0,0,0,0.108696)]">
        <Link
          href={`/dashboard-detail?id=${encodeURIComponent(event.id)}`}
          className="absolute inset-0 z-0"
          aria-label={`Open ${event.title}`}
        />
        <div className="flex items-center gap-4 px-6 py-3 lg:px-8">
          <p className="w-[220px] truncate text-[18px] leading-[48px] text-text">
            {event.title}
          </p>
          <p className="hidden flex-1 truncate text-[16px] leading-6 text-[#949EA8] lg:block">
            {description}
          </p>
          <p className="hidden w-[140px] truncate text-[14px] leading-6 text-[#7D7878] lg:block">
            {event.authorName}
          </p>
          <p className="hidden w-[180px] text-[14px] leading-6 text-[#CACDD0] lg:block">
            {formatCardDate(event.starts_at)}
          </p>
          <p className="hidden w-[120px] text-[14px] leading-6 text-[#949EA8] lg:block">
            {capacityText}
          </p>
          <div className="relative z-10 ml-auto">
            {action === 'edit' ? (
              <Link
                href={`/dashboard-detail-edit?id=${encodeURIComponent(event.id)}`}
              >
                <Button className="h-8 w-[100px] rounded-[4px] bg-[#D9DCE1] text-[14px] leading-[14px] font-normal uppercase tracking-[1px] text-[#A9AEB4] hover:bg-[#C4C9D1]">
                  Edit
                </Button>
              </Link>
            ) : (
              <form
                action={action === 'leave' ? leaveEventAction : joinEventAction}
              >
                <input type="hidden" name="eventId" value={event.id} />
                <SmallActionButton kind={action}>
                  {action === 'leave' ? 'Leave' : 'Join'}
                </SmallActionButton>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[296px] w-full rounded-[2px] bg-white shadow-[0px_2px_3px_rgba(0,0,0,0.108696)] xl:w-[390px]">
      <Link
        href={`/dashboard-detail?id=${encodeURIComponent(event.id)}`}
        className="absolute inset-0 z-0"
        aria-label={`Open ${event.title}`}
      />
      <div className="flex h-full flex-col p-6 lg:p-8">
        <p className="text-[14px] leading-6 text-[#CACDD0]">
          {formatCardDate(event.starts_at)}
        </p>
        <h2 className="mt-2 text-[22px] leading-[48px] text-text">
          {event.title}
        </h2>
        <p className="-mt-2 truncate text-[14px] leading-6 text-[#7D7878]">
          {event.authorName}
        </p>
        <p className="mt-6 line-clamp-2 text-[16px] leading-6 text-[#949EA8]">
          {description}
        </p>
        <div className="relative z-10 mt-auto flex items-center justify-between pt-8">
          <div className="flex items-center gap-1.5">
            <Image
              src="/eventio/dashboard/icons/icon-user.svg"
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
            />
            <p className="text-[14px] leading-6 text-[#949EA8]">
              {capacityText}
            </p>
          </div>
          {action === 'edit' ? (
            <Link
              href={`/dashboard-detail-edit?id=${encodeURIComponent(event.id)}`}
            >
              <Button className="h-8 w-[100px] rounded-[4px] bg-[#D9DCE1] text-[14px] leading-4 font-normal uppercase tracking-[1px] text-[#A9AEB4] hover:bg-[#C4C9D1]">
                Edit
              </Button>
            </Link>
          ) : (
            <form
              action={action === 'leave' ? leaveEventAction : joinEventAction}
            >
              <input type="hidden" name="eventId" value={event.id} />
              <SmallActionButton kind={action}>
                {action === 'leave' ? 'Leave' : 'Join'}
              </SmallActionButton>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProfileView({ currentUser, events }: ProfileViewProps) {
  const [viewMode, setViewMode] = React.useState<ViewMode>('grid');
  const initials = getInitials(currentUser.fullName ?? currentUser.email);

  return (
    <main className="min-h-screen bg-[#F9F9FB]">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-6">
        <div className="mx-auto w-full xl:max-w-[1360px]">
          <header className="flex items-center justify-between pt-2">
            <Link href="/dashboard" aria-label="Eventio">
              <span className="text-[22px] font-semibold text-text sm:text-[28px]">
                E.
              </span>
            </Link>
            <DashboardProfileMenu
              fullName={currentUser.fullName}
              email={currentUser.email}
            />
          </header>
        </div>
        <div className="mx-auto w-full xl:max-w-[1200px]">
          <section className="relative mt-10 rounded-[2px] bg-white pb-10 pt-16 shadow-[0px_2px_3px_rgba(0,0,0,0.108696)]">
            <div className="absolute left-1/2 top-0 flex h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#D9DCE1] text-[28px] font-semibold text-[#949EA8]">
              {initials}
            </div>
            <p className="text-center text-[18px] leading-[48px] text-[#323C46]">
              {currentUser.fullName ?? '—'}
            </p>
            <p className="-mt-3 text-center text-[14px] leading-6 text-[#949EA8]">
              {currentUser.email ?? '—'}
            </p>
          </section>

          <section className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-[22px] leading-[48px] text-[#323C46] sm:text-[28px]">
                My events
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className="inline-flex h-6 w-6 items-center justify-center"
                  aria-label="Grid view"
                >
                  <GridIcon
                    className={cn(
                      viewMode === 'grid' ? 'text-[#323C46]' : 'text-[#D9DCE1]'
                    )}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="inline-flex h-6 w-6 items-center justify-center"
                  aria-label="List view"
                >
                  <ListIcon
                    className={cn(
                      viewMode === 'list' ? 'text-[#323C46]' : 'text-[#D9DCE1]'
                    )}
                  />
                </button>
              </div>
            </div>

            {events.length === 0 ? (
              <div className="mt-4 rounded-[2px] bg-white p-6 shadow-[0px_2px_3px_rgba(0,0,0,0.108696)]">
                <p className="text-[16px] leading-6 text-[#949EA8]">
                  No events
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="mt-4 grid gap-y-4 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-2 lg:gap-x-4 xl:grid-cols-[repeat(auto-fit,minmax(390px,390px))] xl:justify-start xl:gap-x-[15px] xl:gap-y-4">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    viewMode="grid"
                    currentUserId={currentUser.id}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    viewMode="list"
                    currentUserId={currentUser.id}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
