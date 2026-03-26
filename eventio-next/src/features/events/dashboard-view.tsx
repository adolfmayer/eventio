'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { SignOutButton } from '@/features/auth/sign-out-button';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { joinEventAction, leaveEventAction } from '@/features/events/actions';

type ViewMode = 'grid' | 'list';
type FilterMode = 'all' | 'future' | 'past';

type DashboardUser = {
  id: string;
  email: string | null;
  fullName: string | null;
};

type DashboardEvent = {
  id: string;
  title: string;
  description: string | null;
  owner_id: string;
  authorName: string;
  capacity: number | null;
  starts_at: string;
  event_attendees: Array<{ user_id: string }>;
};

export type DashboardViewProps = {
  currentUser: DashboardUser;
  events: DashboardEvent[];
  errorMessage: string | null;
};

function GridIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 0H24V24H0V0Z"
        stroke="black"
        strokeOpacity="0.01"
        strokeWidth="0"
      />
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
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 0H24V24H0V0Z"
        stroke="black"
        strokeOpacity="0.01"
        strokeWidth="0"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 18H21V12H4V18ZM4 5V11H21V5H4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z"
        fill="currentColor"
      />
    </svg>
  );
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

function getInitials(nameOrEmail: string | null) {
  const base = (nameOrEmail ?? '').trim();
  if (!base) return 'U';
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return base.slice(0, 2).toUpperCase();
}

function isFuture(startsAtIso: string, now: Date) {
  return new Date(startsAtIso).getTime() >= now.getTime();
}

function isPast(startsAtIso: string, now: Date) {
  return new Date(startsAtIso).getTime() < now.getTime();
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
  viewMode,
  event,
  currentUserId,
}: {
  viewMode: ViewMode;
  event: DashboardEvent;
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

  const description = event.description ?? '';
  const dateText = formatCardDate(event.starts_at);
  const capacityText =
    event.capacity == null
      ? `${attendeeCount} attending`
      : `${attendeeCount} of ${event.capacity}`;

  if (viewMode === 'list') {
    return (
      <div className="relative w-full rounded-[2px] bg-white shadow-[0px_2px_3px_rgba(0,0,0,0.108696)]">
        <div className="flex items-center gap-4 px-8 py-3">
          <p className="w-[220px] truncate text-[18px] leading-[48px] text-text">
            {event.title}
          </p>
          <p className="hidden flex-1 truncate text-[16px] leading-6 text-[#949EA8] lg:block">
            {description}
          </p>
          <p className="hidden w-[140px] truncate text-[14px] font-normal leading-6 text-[#7D7878] lg:block">
            {event.authorName}
          </p>
          <p className="hidden w-[160px] text-[14px] leading-6 text-[#CACDD0] lg:block">
            {dateText}
          </p>
          <p className="hidden w-[120px] text-[14px] leading-6 text-[#949EA8] lg:block">
            {capacityText}
          </p>

          <div className="ml-auto flex items-center gap-3">
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

  // grid
  return (
    <div className="relative h-[296px] w-full rounded-[2px] bg-white shadow-[0px_2px_3px_rgba(0,0,0,0.108696)] lg:w-[390px]">
      <div className="flex h-full flex-col p-8">
        <p className="text-[14px] font-normal leading-6 text-[#CACDD0]">
          {dateText}
        </p>
        <h2 className="mt-2 text-[22px] font-normal leading-[48px] text-text">
          {event.title}
        </h2>
        <p className="-mt-2 truncate text-[14px] font-normal leading-6 text-[#7D7878]">
          {event.authorName}
        </p>
        <p className="mt-6 line-clamp-2 text-[16px] font-normal leading-6 text-[#949EA8]">
          {description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-8">
          <div className="flex items-center gap-1.5">
            <Image
              src="/eventio/dashboard/icons/icon-user.svg"
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
            />
            <p className="text-[14px] font-normal leading-6 text-[#949EA8]">
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

export function DashboardView({
  currentUser,
  events,
  errorMessage,
}: DashboardViewProps) {
  const [viewMode, setViewMode] = React.useState<ViewMode>('grid');
  const [filterMode, setFilterMode] = React.useState<FilterMode>('all');
  const [profileOpen, setProfileOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem('eventio.dashboard.viewMode');
      if (raw === 'grid' || raw === 'list') setViewMode(raw);
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    try {
      window.localStorage.setItem('eventio.dashboard.viewMode', viewMode);
    } catch {
      // ignore
    }
  }, [viewMode]);

  const now = React.useMemo(() => new Date(), []);

  const visibleEvents = React.useMemo(() => {
    if (filterMode === 'future') {
      return events.filter((e) => isFuture(e.starts_at, now));
    }
    if (filterMode === 'past') {
      return events.filter((e) => isPast(e.starts_at, now));
    }
    return events;
  }, [events, filterMode, now]);

  const fullNameOrEmail = currentUser.fullName ?? currentUser.email;
  const initials = getInitials(fullNameOrEmail);

  return (
    <main className="min-h-screen bg-[#F9F9FB]">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-6">
        <header className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" aria-label="Eventio">
              <span className="text-[28px] font-semibold text-text">E.</span>
            </Link>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2"
              aria-haspopup="menu"
              aria-expanded={profileOpen}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D9DCE1] text-[14px] font-semibold text-[#949EA8]">
                {initials}
              </div>
              <span className="hidden text-[14px] font-medium leading-6 text-[#949EA8] sm:inline">
                {currentUser.fullName ?? '—'}
              </span>
              <Image
                src="/eventio/dashboard/icons/icon-chevron-down.svg"
                alt=""
                width={10}
                height={5}
                aria-hidden="true"
              />
            </button>

            {profileOpen ? (
              <div
                role="menu"
                className="absolute right-0 mt-3 w-[162px] rounded-[14px] bg-white shadow-[0px_5px_15px_rgba(0,0,0,0.198087)]"
              >
                <Link
                  href="/profile"
                  role="menuitem"
                  className="block px-4 py-3 text-[14px] font-medium leading-6 text-[#9CA5AF] hover:bg-surfaceAlt"
                  onClick={() => setProfileOpen(false)}
                >
                  Profile
                </Link>
                <div className="px-4 pb-3">
                  <SignOutButton
                    variant="ghost"
                    size="sm"
                    className="h-auto w-full justify-start px-0 py-0 text-[14px] font-medium leading-6 text-[#9CA5AF] hover:bg-transparent"
                  >
                    Log out
                  </SignOutButton>
                </div>
              </div>
            ) : null}
          </div>
        </header>

        <div className="mt-10 flex items-center justify-between">
          <nav className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={cn(
                'text-[12px] leading-6 tracking-[1px] uppercase',
                filterMode === 'all' ? 'text-text' : 'text-[#A9AEB4]'
              )}
            >
              ALL EVENTS
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('future')}
              className={cn(
                'text-[12px] leading-6 tracking-[1px] uppercase',
                filterMode === 'future' ? 'text-text' : 'text-[#A9AEB4]'
              )}
            >
              FUTURE EVENTS
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('past')}
              className={cn(
                'text-[12px] leading-6 tracking-[1px] uppercase',
                filterMode === 'past' ? 'text-text' : 'text-[#A9AEB4]'
              )}
            >
              PAST EVENTS
            </button>
          </nav>

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

        <section className="mt-10">
          {errorMessage ? (
            <div className="rounded-[2px] bg-white p-6 shadow-[0px_2px_3px_rgba(0,0,0,0.108696)]">
              <p className="text-sm text-dangerStrong">{errorMessage}</p>
            </div>
          ) : null}

          {viewMode === 'grid' ? (
            <div className="grid gap-y-4 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-[repeat(3,390px)] lg:gap-x-[15px] lg:gap-y-4">
              {visibleEvents.map((event) => (
                <EventCard
                  key={event.id}
                  viewMode="grid"
                  event={event}
                  currentUserId={currentUser.id}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {visibleEvents.map((event) => (
                <EventCard
                  key={event.id}
                  viewMode="list"
                  event={event}
                  currentUserId={currentUser.id}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <Link
        href="/create-new"
        className="fixed bottom-8 right-8 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#323C46] shadow-[0px_6px_9px_rgba(0,0,0,0.15)] hover:bg-[#565D5A]"
        aria-label="Create new event"
      >
        <PlusIcon className="text-white" />
      </Link>
    </main>
  );
}
