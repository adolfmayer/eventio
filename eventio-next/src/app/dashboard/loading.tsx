import Link from "next/link";

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

export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-[#F9F9FB]">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-6">
        <div className="mx-auto w-full xl:max-w-[1360px]">
          <header className="flex items-center justify-between pt-2">
            <Link href="/dashboard" aria-label="Eventio">
              <span className="text-[28px] font-semibold text-text">E.</span>
            </Link>
            <div className="h-10 w-32 rounded bg-white/60" />
          </header>
        </div>

        <div className="mx-auto w-full xl:max-w-[1200px]">
          <div className="mt-10 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="h-6 w-24 rounded bg-white/60" />
              <div className="h-6 w-28 rounded bg-white/60" />
              <div className="h-6 w-24 rounded bg-white/60" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-white/60" />
              <div className="h-6 w-6 rounded bg-white/60" />
            </div>
          </div>

          <section className="mt-10 grid gap-y-4 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-2 lg:gap-x-4 xl:grid-cols-3 xl:gap-x-[15px]">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[296px] rounded-[2px] bg-white p-8 shadow-[0px_2px_3px_rgba(0,0,0,0.108696)]"
              >
                <div className="h-6 w-40 rounded bg-[#F0F1F4]" />
                <div className="mt-3 h-10 w-56 rounded bg-[#ECEFF3]" />
                <div className="mt-2 h-6 w-28 rounded bg-[#F0F1F4]" />
                <div className="mt-6 h-6 w-full rounded bg-[#ECEFF3]" />
                <div className="mt-2 h-6 w-4/5 rounded bg-[#ECEFF3]" />
                <div className="mt-16 flex items-center justify-between">
                  <div className="h-6 w-24 rounded bg-[#F0F1F4]" />
                  <div className="h-8 w-[100px] rounded-[4px] bg-[#ECEFF3]" />
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#323C46] shadow-[0px_6px_9px_rgba(0,0,0,0.15)]">
        <PlusIcon className="text-white" />
      </div>
    </main>
  );
}

