import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const metadata = {
  title: "Dashboard Detail Edit",
};

export default function DashboardDetailEditPage() {
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
          <Link
            href="/dashboard-detail-joined"
            className="rounded-control px-3 py-2 text-muted hover:bg-surfaceAlt"
          >
            03-1-2-Detail-Joined
          </Link>
          <span className="rounded-control bg-brand px-3 py-2 text-white">
            03-1-3-Detail-Edit
          </span>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="p-5 sm:p-7">
          <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-text">
            Edit state
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
            Edit event details
          </h1>
          <form className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-text sm:col-span-2">
              Event name
              <Input
                className="mt-1"
                defaultValue="Summer Product Festival"
              />
            </label>
            <label className="block text-sm font-medium text-text">
              Date
              <Input className="mt-1" defaultValue="14/08/2026" />
            </label>
            <label className="block text-sm font-medium text-text">
              Time
              <Input className="mt-1" defaultValue="17:00" />
            </label>
            <label className="block text-sm font-medium text-text sm:col-span-2">
              Description
              <Textarea className="mt-1">
                A full day of talks, networking, and workshops.
              </Textarea>
            </label>
            <div className="sm:col-span-2 flex flex-wrap gap-2">
              <Button size="sm">Save changes</Button>
              <Button size="sm" variant="secondary">
                Discard
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-semibold text-text">Edit notes</h2>
          <p className="mt-3 text-sm text-muted">
            This static screen mirrors the edit variant without persistence
            logic.
          </p>
        </Card>
      </div>
    </main>
  );
}

