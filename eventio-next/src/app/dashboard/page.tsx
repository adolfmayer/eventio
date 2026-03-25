import Link from "next/link";

import { DashboardShell } from "@/components/shared/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <DashboardShell
      title="Dashboard"
      subtitle="02-1-1-Dashboard"
      showSubtitle={true}
      listView={false}
    >
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
              Music · Community
            </p>
            <h2 className="mt-2 text-lg font-semibold text-text">
              Product Meetup {index + 1}
            </h2>
            <p className="mt-2 text-sm text-muted">
              Thursday, 19:00 · Bratislava
            </p>
            <Badge className="mt-3 w-fit">24 attendees</Badge>
            <Link
              className="mt-4 inline-block text-sm font-semibold text-dangerStrong hover:text-danger"
              href="/dashboard-detail"
            >
              Open detail
            </Link>
          </Card>
        ))}
      </section>
    </DashboardShell>
  );
}

