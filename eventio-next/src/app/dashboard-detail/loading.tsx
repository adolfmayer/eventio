import Image from "next/image";
import Link from "next/link";

export default function DashboardDetailLoading() {
  return (
    <main className="min-h-screen bg-[#F9F9FB]">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-6">
        <div className="mx-auto w-full xl:max-w-[1360px]">
          <header className="relative flex items-center justify-between pt-2">
            <Link href="/dashboard" aria-label="Eventio">
              <span className="text-[28px] font-semibold text-text">E.</span>
            </Link>

            <div className="absolute left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap text-[14px] leading-[48px] text-text md:text-[16px]">
              <Image
                src="/eventio/dashboard/icons/icon-back.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden="true"
              />
              Back to events
            </div>

            <div className="h-10 w-32 rounded bg-white/60" />
          </header>
        </div>

        <div className="mx-auto w-full xl:max-w-[1200px]">
          <div className="mt-10 h-6 w-36 rounded bg-white/60" />

          <section className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,795px)_minmax(0,390px)] lg:gap-[17px]">
            <article className="min-h-[296px] rounded-[2px] bg-white p-6 shadow-[0px_2px_3px_rgba(0,0,0,0.108696)] lg:p-8">
              <div className="h-6 w-44 rounded bg-[#F0F1F4]" />
              <div className="mt-3 h-12 w-3/4 rounded bg-[#ECEFF3]" />
              <div className="mt-2 h-6 w-36 rounded bg-[#F0F1F4]" />
              <div className="mt-6 h-6 w-full rounded bg-[#ECEFF3]" />
              <div className="mt-2 h-6 w-5/6 rounded bg-[#ECEFF3]" />
              <div className="mt-2 h-6 w-2/3 rounded bg-[#ECEFF3]" />
              <div className="mt-12 flex items-center justify-between">
                <div className="h-6 w-24 rounded bg-[#F0F1F4]" />
                <div className="h-8 w-[100px] rounded-[4px] bg-[#ECEFF3]" />
              </div>
            </article>

            <aside className="h-[216px] rounded-[2px] bg-white p-6 shadow-[0px_2px_3px_rgba(0,0,0,0.108696)] lg:h-[296px] lg:p-8">
              <div className="h-8 w-28 rounded bg-[#ECEFF3]" />
              <div className="mt-4 h-8 w-32 rounded-full bg-[#F0F1F4]" />
            </aside>
          </section>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#323C46] shadow-[0px_6px_9px_rgba(0,0,0,0.15)]" />
    </main>
  );
}
