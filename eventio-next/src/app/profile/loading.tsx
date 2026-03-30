import Link from "next/link";

export default function ProfileLoading() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-6">
        <div className="mx-auto w-full xl:max-w-[1360px]">
          <header className="flex items-center justify-between pt-2">
            <Link href="/dashboard" aria-label="Eventio">
              <span className="text-[22px] font-semibold text-text sm:text-[28px]">
                E.
              </span>
            </Link>
            <div className="h-10 w-32 rounded bg-surface/60" />
          </header>
        </div>

        <div className="mx-auto w-full xl:max-w-[1200px]">
          <section className="relative mt-10 rounded-[2px] bg-surface pb-10 pt-16 shadow-[0px_2px_3px_rgba(0,0,0,0.108696)]">
            <div className="absolute left-1/2 top-0 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-stroke/70" />
            <div className="mx-auto h-[48px] w-48 rounded bg-surfaceAlt" />
            <div className="mx-auto mt-1 h-6 w-56 rounded bg-stroke/70" />
          </section>

          <section className="mt-10">
            <div className="flex items-center justify-between">
              <div className="h-[48px] w-40 rounded bg-stroke/70" />
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-surfaceAlt" />
                <div className="h-6 w-6 rounded bg-surfaceAlt" />
              </div>
            </div>

            <div className="mt-4 grid gap-y-4 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-2 lg:gap-x-4 xl:grid-cols-3 xl:gap-x-[15px]">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[296px] rounded-[2px] bg-surface p-6 shadow-[0px_2px_3px_rgba(0,0,0,0.108696)] lg:p-8"
                >
                  <div className="h-6 w-40 rounded bg-surfaceAlt" />
                  <div className="mt-3 h-10 w-56 rounded bg-stroke/70" />
                  <div className="mt-2 h-6 w-28 rounded bg-surfaceAlt" />
                  <div className="mt-6 h-6 w-full rounded bg-stroke/70" />
                  <div className="mt-2 h-6 w-4/5 rounded bg-stroke/70" />
                  <div className="mt-16 flex items-center justify-between">
                    <div className="h-6 w-24 rounded bg-surfaceAlt" />
                    <div className="h-8 w-[100px] rounded-[4px] bg-stroke/70" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
