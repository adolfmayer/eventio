import Image from "next/image";
import Link from "next/link";

import { createEventAction } from "@/features/events/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Create New",
};

export default async function CreateNewPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; from?: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login?redirectTo=/create-new");

  const params = (await searchParams) ?? {};
  const closeHref =
    typeof params.from === "string" && params.from.startsWith("/")
      ? params.from
      : "/dashboard";

  return (
    <main className="min-h-screen bg-[#F9F9FB]">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-8 pt-7">
        <header className="flex items-center justify-between">
          <Link href="/dashboard" aria-label="Eventio">
            <span className="text-[22px] font-semibold text-text sm:text-[28px]">E.</span>
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

          {params.error ? (
            <p className="mt-4 whitespace-pre-line text-[14px] leading-6 text-dangerStrong">
              {params.error}
            </p>
          ) : null}

          <form action={createEventAction} className="mt-6">
            <label className="block">
              <span className="text-[16px] leading-6 text-[#C9CED3] sm:text-[18px]">Title</span>
              <input
                name="title"
                type="text"
                className="mt-1 block h-8 w-full border-b border-[#DAE1E7] bg-transparent text-[16px] leading-6 text-[#323C46] outline-none"
                required
                maxLength={120}
              />
            </label>

            <label className="mt-6 block">
              <span className="text-[16px] leading-6 text-[#C9CED3] sm:text-[18px]">
                Description
              </span>
              <input
                name="description"
                type="text"
                className="mt-1 block h-8 w-full border-b border-[#DAE1E7] bg-transparent text-[16px] leading-6 text-[#323C46] outline-none"
                maxLength={2000}
              />
            </label>

            <label className="mt-6 block">
              <span className="text-[16px] leading-6 text-[#C9CED3] sm:text-[18px]">Date</span>
              <input
                name="date"
                type="date"
                className="mt-1 block h-8 w-full border-b border-[#DAE1E7] bg-transparent text-[16px] leading-6 text-[#323C46] outline-none"
                required
              />
            </label>

            <label className="mt-6 block">
              <span className="text-[16px] leading-6 text-[#C9CED3] sm:text-[18px]">Time</span>
              <input
                name="time"
                type="time"
                className="mt-1 block h-8 w-full border-b border-[#DAE1E7] bg-transparent text-[16px] leading-6 text-[#323C46] outline-none"
                required
              />
            </label>

            <label className="mt-6 block">
              <span className="text-[16px] leading-6 text-[#C9CED3] sm:text-[18px]">
                Location
              </span>
              <input
                name="location"
                type="text"
                className="mt-1 block h-8 w-full border-b border-[#DAE1E7] bg-transparent text-[16px] leading-6 text-[#323C46] outline-none"
                maxLength={120}
              />
            </label>

            <label className="mt-6 block">
              <span className="text-[16px] leading-6 text-[#C9CED3] sm:text-[18px]">
                Capacity
              </span>
              <input
                name="capacity"
                type="number"
                min={1}
                className="mt-1 block h-8 w-full border-b border-[#DAE1E7] bg-transparent text-[16px] leading-6 text-[#323C46] outline-none"
              />
            </label>

            <button
              type="submit"
              className="mx-auto mt-8 block h-[57px] w-[240px] rounded-[4px] bg-[#22D486] text-[16px] leading-8 tracking-[1px] text-white uppercase hover:bg-[#1DBB76]"
            >
              CREATE NEW EVENT
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

