import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Dashboard Detail Joined",
};

export default function DashboardDetailJoinedPage() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-4 inline-flex rounded-control border border-stroke bg-surface p-1 text-xs font-semibold sm:text-sm">
          <Link
            href="/dashboard-detail"
            className="rounded-control px-3 py-2 text-muted hover:bg-surfaceAlt"
          >
            03-1-1-Detail
          </Link>
          <span className="rounded-control bg-brand px-3 py-2 text-white">
            03-1-2-Detail-Joined
          </span>
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
            Joined state
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
            Summer Product Festival
          </h1>
          <p className="mt-3 text-sm text-muted sm:text-base">
            You are already in. Event reminders and updates are now enabled for
            this profile.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-control border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              Joined
            </span>
            <Button size="sm" variant="secondary">
              Leave Event
            </Button>
            <Button size="sm" variant="secondary">
              Back to Dashboard
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-semibold text-text">Event facts</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Date: 14 Aug 2026</li>
            <li>Time: 17:00</li>
            <li>Location: Vienna</li>
            <li>Status: Joined</li>
          </ul>
        </Card>
      </div>
    </main>
  );
}

