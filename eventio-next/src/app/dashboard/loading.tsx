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
        <header className="flex items-center justify-between pt-2">
          <Link href="/dashboard" aria-label="Eventio">
            <span className="text-[28px] font-semibold text-text">E.</span>
          </Link>
          <div className="h-10 w-32 rounded bg-white/60" />
        </header>

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

        <div className="grid min-h-[520px] place-items-center">
          <div
            className="h-[63px] w-[63px] animate-spin rounded-full"
            style={{
              background:
                "conic-gradient(from 90deg at 50% 50%, rgba(255, 255, 255, 0.187047) -23.59deg, rgba(0, 0, 0, 0.244084) 6.81deg, rgba(255, 255, 255, 0.187047) 336.41deg, rgba(0, 0, 0, 0.244084) 366.81deg)",
              mask: "radial-gradient(transparent 58%, black 59%)",
              WebkitMask: "radial-gradient(transparent 58%, black 59%)",
            }}
            aria-label="Loading"
          />
        </div>
      </div>

      <div className="fixed bottom-8 right-8 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#323C46] shadow-[0px_6px_9px_rgba(0,0,0,0.15)]">
        <PlusIcon className="text-white" />
      </div>
    </main>
  );
}

