import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Dashboard Detail",
};

export default function DashboardDetailPage() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-4 inline-flex rounded-control border border-stroke bg-surface p-1 text-xs font-semibold sm:text-sm">
          <span className="rounded-control bg-brand px-3 py-2 text-white">
            03-1-1-Detail
          </span>
          <Link
            href="/dashboard-detail-joined"
            className="rounded-control px-3 py-2 text-muted hover:bg-surfaceAlt"
          >
            03-1-2-Detail-Joined
          </Link>
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
            Event detail
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
            Summer Product Festival
          </h1>
          <p className="mt-3 text-sm text-muted sm:text-base">
            A full day of talks, networking, and hands-on workshops from local
            product teams.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button size="sm">Join Event</Button>
            <Button size="sm" variant="secondary">
              Edit Event
            </Button>
            <Button size="sm" variant="secondary">
              Back to Dashboard
            </Button>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <div className="rounded-card border border-stroke bg-surfaceAlt p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">
                Agenda
              </p>
              <p className="mt-2 text-sm text-text">
                Keynotes, case studies, networking dinner.
              </p>
            </div>
            <div className="rounded-card border border-stroke bg-surfaceAlt p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">
                Capacity
              </p>
              <p className="mt-2 text-sm text-text">
                124 / 150 spots reserved.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-semibold text-text">Event facts</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Date: 14 Aug 2026</li>
            <li>Time: 17:00</li>
            <li>Location: Vienna</li>
            <li>Attendees: 124</li>
          </ul>
        </Card>
      </div>
    </main>
  );
}

