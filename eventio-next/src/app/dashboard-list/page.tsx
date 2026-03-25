import { DashboardShell } from "@/components/shared/dashboard-shell";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
  title: "Dashboard List View",
};

export default function DashboardListPage() {
  return (
    <DashboardShell
      title="Dashboard"
      subtitle="02-1-2-Dashboard-List-View"
      showSubtitle={true}
      listView={true}
    >
      <section className="space-y-3">
        {Array.from({ length: 7 }).map((_, index) => (
          <Card
            key={index}
            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
          >
            <div>
              <h2 className="text-base font-semibold text-text sm:text-lg">
                Frontend Conference #{index + 1}
              </h2>
              <p className="mt-1 text-sm text-muted">Friday, 18:30 · Prague</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Open registration
              </p>
            </div>
            <Link
              className="inline-flex h-9 w-fit items-center justify-center rounded-control bg-brand px-3 text-sm font-semibold text-white hover:bg-brandStrong"
              href="/dashboard-detail"
            >
              View Detail
            </Link>
          </Card>
        ))}
      </section>
    </DashboardShell>
  );
}

