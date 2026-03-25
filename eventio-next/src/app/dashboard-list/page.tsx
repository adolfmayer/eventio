import { DashboardShell } from "@/components/shared/dashboard-shell";
import { Card } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard List View",
};

export default async function DashboardListPage() {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { data: events, error } = await supabase
    .from("events")
    .select("id,title,location,starts_at")
    .order("starts_at", { ascending: true });

  return (
    <DashboardShell
      title="Dashboard"
      subtitle="02-1-2-Dashboard-List-View"
      showSubtitle={true}
      listView={true}
    >
      <section className="space-y-3">
        {error ? (
          <Card className="p-5 sm:p-6">
            <p className="text-sm text-dangerStrong">{error.message}</p>
          </Card>
        ) : null}

        {(events ?? []).map((event) => (
          <Card
            key={event.id}
            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
          >
            <div>
              <h2 className="text-base font-semibold text-text sm:text-lg">
                {event.title}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {event.starts_at ? new Date(event.starts_at).toLocaleString() : "—"} ·{" "}
                {event.location ?? "—"}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Open registration
              </p>
            </div>
            <Link
              className="inline-flex h-9 w-fit items-center justify-center rounded-control bg-brand px-3 text-sm font-semibold text-white hover:bg-brandStrong"
              href={`/dashboard-detail?id=${encodeURIComponent(event.id)}`}
            >
              View Detail
            </Link>
          </Card>
        ))}
      </section>
    </DashboardShell>
  );
}

