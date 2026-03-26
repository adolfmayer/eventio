import Image from 'next/image';
import Link from 'next/link';

import { CreateEventForm } from '@/features/events/create-event-form';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Create New',
};

export default async function CreateNewPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; from?: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect('/login?redirectTo=/create-new');

  const params = (await searchParams) ?? {};
  const closeHref =
    typeof params.from === 'string' && params.from.startsWith('/')
      ? params.from
      : '/dashboard';

  return (
    <main className="min-h-screen bg-[#F9F9FB]">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-8 pt-7">
        <header className="flex items-center justify-between">
          <Link href="/dashboard" aria-label="Eventio">
            <span className="text-[22px] font-semibold text-text sm:text-[28px]">
              E.
            </span>
          </Link>
          <Link
            href={closeHref}
            className="inline-flex items-center gap-2 text-[16px] leading-[48px] text-text"
          >
            <Image
              src="/eventio/dashboard/icons/icon-close.svg"
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
            />
            <span className="hidden sm:inline">Close</span>
          </Link>
        </header>

        <section className="mx-auto mt-8 w-full max-w-[480px] rounded-[2px] bg-white px-4 py-6 shadow-[0px_2px_3px_rgba(0,0,0,0.108696)] sm:mt-[136px] sm:min-h-[608px] sm:px-8 sm:py-10">
          <h1 className="text-center text-[22px] leading-[48px] text-[#323C46] sm:text-[28px]">
            Create new event
          </h1>
          <p className="-mt-1 text-center text-[14px] leading-6 text-[#949EA8] sm:text-[18px]">
            Enter details below.
          </p>

          <CreateEventForm from={closeHref} serverError={params.error} />
        </section>
      </div>
    </main>
  );
}
